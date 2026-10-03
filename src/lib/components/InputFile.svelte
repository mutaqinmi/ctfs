<script lang="ts">
	import { CloudUploadIcon, TrashIcon } from '@lucide/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type FileStatus = 'uploading' | 'uploaded' | 'error' | 'deleting';
	type SelectedFile = { file: File; status: FileStatus; objectKey?: string; error?: string };
	export type UploadedMediaMetadata = {
		mediaId?: number;
		objectKey: string;
		fileName: string;
		mimeType?: string;
		fileSize: number;
	};

	let {
		metadata = $bindable<UploadedMediaMetadata[]>([]),
		...props
	}: HTMLInputAttributes & { metadata?: UploadedMediaMetadata[] } = $props();
	let selectedFiles: SelectedFile[] = $state([]);
	let mediaInput: HTMLInputElement;
	let isDragging = $state(false);

	function syncInputFiles() {
		const dataTransfer = new DataTransfer();
		selectedFiles.forEach(({ file }) => dataTransfer.items.add(file));
		mediaInput.files = dataTransfer.files;
	}

	function updateFile(file: File, update: Partial<SelectedFile>) {
		selectedFiles = selectedFiles.map((entry) =>
			entry.file === file ? { ...entry, ...update } : entry
		);
	}

	function syncMetadata() {
		const existingMetadata = metadata.filter((entry) => entry.mediaId !== undefined);
		const uploadedMetadata = selectedFiles
			.filter((entry): entry is SelectedFile & { objectKey: string } => Boolean(entry.objectKey))
			.map(({ file, objectKey }) => ({
				objectKey,
				fileName: file.name,
				mimeType: file.type || undefined,
				fileSize: file.size
			}));
		metadata = [...existingMetadata, ...uploadedMetadata];
	}

	async function uploadFile(file: File) {
		try {
			const presignResponse = await fetch('/api/uploads', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', size: file.size })
			});
			if (!presignResponse.ok) throw new Error('Gagal menyiapkan upload');
			const { objectKey, uploadUrl } = await presignResponse.json();
			const uploadResponse = await fetch(uploadUrl, {
				method: 'PUT',
				headers: { 'content-type': file.type || 'application/octet-stream' },
				body: file
			});
			if (!uploadResponse.ok) throw new Error('Gagal mengunggah file');
			updateFile(file, { status: 'uploaded', objectKey });
			syncMetadata();
		} catch (uploadError) {
			updateFile(file, { status: 'error', error: uploadError instanceof Error ? uploadError.message : 'Upload gagal' });
		}
	}

	function addFilesFromList(fileList: FileList | null) {
		const newFiles = fileList ? [...fileList] : [];
		const files = [...selectedFiles.map(({ file }) => file), ...newFiles].filter(
			(file, index, allFiles) => allFiles.findIndex((otherFile) =>
				otherFile.name === file.name && otherFile.size === file.size && otherFile.lastModified === file.lastModified
			) === index
		);
		const newEntries = files.map((file) => selectedFiles.find((entry) => entry.file === file) ?? { file, status: 'uploading' as const });
		selectedFiles = newEntries;
		syncInputFiles();
		syncMetadata();
		newFiles.filter((file) => newEntries.some((entry) => entry.file === file && entry.status === 'uploading')).forEach((file) => void uploadFile(file));
	}

	function addFiles(event: Event) {
		addFilesFromList((event.currentTarget as HTMLInputElement).files);
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		addFilesFromList(event.dataTransfer?.files ?? null);
	}

	function formatFileSize(bytes: number) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	async function removeFile(entry: SelectedFile) {
		if (entry.status === 'uploading' || entry.status === 'deleting') return;
		if (entry.objectKey) {
			updateFile(entry.file, { status: 'deleting' });
			const response = await fetch('/api/uploads', {
				method: 'DELETE',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ objectKey: entry.objectKey })
			});
			if (!response.ok) {
				updateFile(entry.file, { status: 'error', error: 'Gagal menghapus file' });
				return;
			}
		}
		selectedFiles = selectedFiles.filter(({ file }) => file !== entry.file);
		syncInputFiles();
		syncMetadata();
	}

	function removeExistingMedia(mediaId: number) {
		metadata = metadata.filter((entry) => entry.mediaId !== mediaId);
	}
</script>

<div class="space-y-4">
	{#if metadata.some((entry) => entry.mediaId !== undefined)}
		<div class="overflow-hidden rounded-md border border-gray-200">
			<table class="w-full text-left text-sm">
				<tbody class="divide-y divide-gray-200">
					{#each metadata.filter((entry) => entry.mediaId !== undefined) as media (media.mediaId)}
						<tr>
							<td class="max-w-0 truncate px-3 py-2 text-gray-700">{media.fileName}</td>
							<td class="px-3 py-2 whitespace-nowrap text-gray-500">{formatFileSize(media.fileSize)}</td>
							<td class="px-3 py-2 text-right">
								<button type="button" class="text-gray-400 hover:text-red-500" onclick={() => removeExistingMedia(media.mediaId!)}>
									<TrashIcon size={16} />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<div role="button" tabindex="0" ondragover={handleDragOver} ondragleave={handleDragLeave} ondrop={handleDrop} class="rounded-md">
		<label for="media" class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400 transition-all hover:border-blue-400 hover:text-blue-500">
			<CloudUploadIcon size={48} />
			<span class="mt-4">{isDragging ? 'Lepaskan file di sini' : 'Klik atau seret file ke sini'}</span>
		</label>
		<input bind:this={mediaInput} onchange={addFiles} type="file" class="hidden" multiple {...props} />
	</div>

	{#if selectedFiles.length > 0}
		<div class="overflow-hidden rounded-md border border-gray-200">
			<table class="w-full text-left text-sm">
				<tbody class="divide-y divide-gray-200">
					{#each selectedFiles as entry (entry.file.name + entry.file.lastModified)}
						<tr>
							<td class="max-w-0 truncate px-3 py-2 text-gray-700">{entry.file.name}</td>
							<td class="px-3 py-2 whitespace-nowrap text-gray-500">{formatFileSize(entry.file.size)}</td>
							<td class="px-3 py-2 text-right">
								<button type="button" class="text-gray-400 hover:text-red-500" disabled={entry.status === 'uploading' || entry.status === 'deleting'} onclick={() => void removeFile(entry)}>
									{#if entry.status === 'uploading'}Mengunggah...{:else if entry.status === 'deleting'}Menghapus...{:else if entry.status === 'error'}Gagal{:else}<TrashIcon size={16} />{/if}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
