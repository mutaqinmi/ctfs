<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { badgeVariants } from '$lib/const/variants.js';
	import { ArrowLeftIcon, DownloadIcon, EyeOffIcon, SendIcon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { SvelteSet } from 'svelte/reactivity';
	import { cn } from '$lib/utils.js';

	let { data, form } = $props();
	let revealedHints = new SvelteSet<number>();

	function capitalizeFirstLetter(val: string) {
		return String(val).charAt(0).toUpperCase() + String(val).slice(1);
	}

	function formatFileSize(bytes: number | null) {
		if (bytes === null) return 'Tidak diketahui';
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function revealHint(hintId: number) {
		if (!revealedHints.has(hintId)) revealedHints.add(hintId);
	}
</script>

<Navbar user={data.user} />

<main class="min-h-screen w-full bg-gray-50 pt-28">
	<div class="mx-auto grid w-4/5 grid-cols-4 gap-4">
		<section class="col-span-3">
			<Button onclick={() => window.history.back()} variant="text" size="sm" class="flex w-fit items-center gap-2 font-normal text-blue-500">
				<ArrowLeftIcon size={16} />
				<span>Kembali ke Tantangan</span>
			</Button>
			<Breadcrumbs class="my-2" />
			<header>
				<h2 class="text-2xl font-semibold">{data.challenge.challenge_title}</h2>
				<p class="text-sm leading-loose text-gray-400">oleh {data.challenge.challenge_author} · {data.challenge.challenge_points} poin</p>
				<div class="mt-2 flex items-center gap-2">
					<p class={badgeVariants({ variant: data.challenge.challenge_difficulty })}>
						{capitalizeFirstLetter(data.challenge.challenge_difficulty)}
					</p>
					<p class="inline-block rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-600">
						{data.challenge.challenge_category}
					</p>
				</div>
			</header>
			<p class="mt-6 text-sm">{data.challenge.challenge_description}</p>
			{#if data.media.length > 0}
				<div class="mt-6 overflow-hidden rounded-md border border-gray-200 bg-white">
					<table class="w-full text-left text-sm">
						<thead class="bg-gray-50 text-xs text-gray-500 uppercase">
							<tr>
								<th scope="col" class="px-3 py-2">Nama</th>
								<th scope="col" class="px-3 py-2">Jenis</th>
								<th scope="col" class="px-3 py-2">Ukuran</th>
								<th scope="col" class="px-3 py-2"><span class="sr-only">Unduh</span></th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each data.media as media (media.id)}
								<tr>
									<td class="max-w-0 truncate px-3 py-2 text-gray-700" title={media.fileName}>{media.fileName}</td>
									<td class="px-3 py-2 whitespace-nowrap text-gray-500">{media.mimeType || media.mediaType}</td>
									<td class="px-3 py-2 whitespace-nowrap text-gray-500">{formatFileSize(media.fileSize)}</td>
									<td class="px-3 py-2 text-right">
										<a
											href={resolve('/api/challenges/[slug]/media/[mediaId]', {
												slug: data.challenge.challenge_slug,
												mediaId: String(media.id)
											})}
											target="_blank"
											rel="noreferrer"
											aria-label={`Unduh ${media.fileName}`}
											title="Unduh file"
											class="inline-flex text-gray-400 hover:text-blue-500"
										>
											<DownloadIcon size={16} />
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
			<form method="post" class="mt-6 border-t-2 border-dotted border-t-gray-300 pt-6" use:enhance>
				<div class="flex w-full items-center gap-3">
					<input
						type="text"
						name="flag"
						id="flag"
						placeholder={`ctfs${'{'}...${'}'}`}
						class="font-mono w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
					/>
					<Button type="submit" class="flex items-center gap-2">
						<SendIcon size={16} />
						<span>Kirim</span>
					</Button>
				</div>
				{#if form?.message}
					<p class="mt-2 text-xs text-gray-600">
						<span class={cn(
							form.success ? 'text-green-600' : 'text-red-600'
						)}>{form.message}</span>
					</p>
				{/if}
			</form>
		</section>
		<aside class="col-span-1 h-fit rounded-lg border border-gray-200 bg-white p-4">
			<h2 class="font-medium">Petunjuk</h2>
			{#if data.hints.length > 0}
				<ol class="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600">
					{#each data.hints as hint (hint.id)}
						<li class="relative pr-7">
							<span class="text-blue-600">
								{#if revealedHints.has(hint.id)}
									<span class="text-gray-600">{hint.hint}</span>
								{:else}
									<span class="underline">Buka Petunjuk</span>
								{/if}
							</span>
							<button
								type="button"
								class="absolute top-0 right-0 text-gray-400 disabled:cursor-default"
								disabled={revealedHints.has(hint.id)}
								aria-label="Tampilkan petunjuk"
								title="Tampilkan petunjuk"
								onclick={() => revealHint(hint.id)}
							>
								{#if !revealedHints.has(hint.id)}
									<EyeOffIcon size={16} />
								{/if}
							</button>
						</li>
					{/each}
				</ol>
			{:else}
				<p class="mt-3 text-sm text-gray-400">Belum ada petunjuk.</p>
			{/if}
		</aside>
	</div>
</main>
