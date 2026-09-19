<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import {
		ArrowLeftIcon,
		ChevronDownIcon,
		PlusIcon,
		XIcon
	} from '@lucide/svelte';
	import { untrack } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { challengeDifficulties, challengeMediaTypes, challengeSchema } from '$lib/schemas.js';
	import InputFile from '$lib/components/InputFile.svelte';

	let { data } = $props();

	function addHint(event: MouseEvent) {
		event.preventDefault();
		$form.challenge_hints = [...($form.challenge_hints ?? []), ''];
	}

	function removeHint(index: number) {
		$form.challenge_hints = $form.challenge_hints.filter((_, hintIndex) => hintIndex !== index);
	}

	const { form, errors, constraints, submitting, enhance } = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(challengeSchema),
			dataType: 'json'
		}
	);
</script>

<Navbar user={data.user} />

<main class="min-h-screen w-full bg-gray-50 pt-28">
	<div class="mx-auto w-4/5">
		<section>
			<Button
				onclick={() => window.history.back()}
				variant="text"
				size="sm"
				class="flex w-fit items-center gap-2 font-normal text-blue-500"
			>
				<ArrowLeftIcon size={16} />
				<span>Kembali ke Tantangan</span>
			</Button>
			<Breadcrumbs class="my-2" />
			<header class="mb-6">
				<h2 class="text-2xl font-semibold">Buat Tantangan Baru</h2>
			</header>
			<div class="flex flex-col gap-4">
				<Button
					disabled={$submitting}
					type="submit"
					form="challenge-form"
					class="flex w-fit items-center gap-2 self-end"
				>
					<PlusIcon size={16} />
					<span>Buat Tantangan</span>
				</Button>
				<form
					id="challenge-form"
					action="/challenges/create"
					method="POST"
					class="grid grid-cols-5 gap-6"
					use:enhance
				>
					<div class="col-span-3 space-y-4 rounded-lg border border-gray-200 bg-white p-4 h-fit">
						<div class="space-y-1">
							<label for="challenge_title" class="block">Nama Tantangan</label>
							<input
								type="text"
								id="challenge_title"
								name="challenge_title"
								bind:value={$form.challenge_title}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
								placeholder="Catch me if you can!"
								{...$constraints.challenge_title}
							/>
							{#if $errors.challenge_title}
								<p class="text-xs text-red-500">{$errors.challenge_title}</p>
							{/if}
						</div>
						<div class="space-y-1">
							<label for="challenge_description" class="block">Deskripsi</label>
							<textarea
								id="challenge_description"
								name="challenge_description"
								bind:value={$form.challenge_description}
								class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
								placeholder="Foto ini terlihat mencurigakan ..."
								{...$constraints.challenge_description}></textarea>
							{#if $errors.challenge_description}
								<p class="text-xs text-red-500">{$errors.challenge_description}</p>
							{/if}
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div class="space-y-1">
								<label for="challenge_points" class="block">Poin</label>
								<input
									type="number"
									id="challenge_points"
									name="challenge_points"
									bind:value={$form.challenge_points}
									class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
									placeholder="Poin Tantangan"
									{...$constraints.challenge_points}
								/>
								{#if $errors.challenge_points}
									<p class="text-xs text-red-500">{$errors.challenge_points}</p>
								{/if}
							</div>
							<div class="space-y-1">
								<label for="challenge_difficulty" class="block">Tingkat Kesulitan</label>
								<div class="relative">
									<select
										id="challenge_difficulty"
										name="challenge_difficulty"
										bind:value={$form.challenge_difficulty}
										class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
										{...$constraints.challenge_difficulty}
									>
										{#each challengeDifficulties as difficulty (difficulty.value)}
                                            <option value={difficulty.value}>{difficulty.label}</option>
                                        {/each}
									</select>
									<ChevronDownIcon
										size={16}
										class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
									/>
								</div>
								{#if $errors.challenge_difficulty}
									<p class="text-xs text-red-500">{$errors.challenge_difficulty}</p>
								{/if}
							</div>
						</div>
						<div class="space-y-1">
							<label for="category_id" class="block">Kategori</label>
							<div class="relative">
								<select
									id="category_id"
									name="category_id"
									bind:value={$form.category_id}
									class="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
									{...$constraints.category_id}
								>
									<option value={0} disabled>Pilih Kategori</option>
									{#each data.challengeCategories as category (category.category_id)}
										<option value={category.category_id}>{category.category_name}</option>
									{/each}
								</select>
								<ChevronDownIcon
									size={16}
									class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
								/>
							</div>
							{#if $errors.category_id}
								<p class="text-xs text-red-500">{$errors.category_id}</p>
							{/if}
						</div>
						<div class="space-y-1">
							<div>
								<label for="challenge_flag" class="block">Flag</label>
								<p class="text-sm text-gray-500">Gunakan format <span class="font-mono bg-blue-200 text-blue-600 inline-block px-1 py-0.5 w-fit rounded-md text-xs">{`ctfs${'{'}...${'}'}`}</span></p>
							</div>
							<input
								type="text"
								id="challenge_flag"
								name="challenge_flag"
								bind:value={$form.challenge_flag}
								class="font-mono w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
								placeholder={`ctfs${'{'}c4tCh_m3!f_y0uc4N20c7dt5${'}'}`}
								{...$constraints.challenge_flag}
							/>
							{#if $errors.challenge_flag}
								<p class="text-xs text-red-500">{$errors.challenge_flag}</p>
							{/if}
						</div>
					</div>
					<div class="col-span-2 space-y-4">
                        <div class="flex h-fit flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-4">
                            <div class="space-y-2">
                                <header>
                                    <h2 class="font-medium">Tambahkan Media</h2>
                                    <p class="text-sm text-gray-500">
                                        Unggah file gambar atau video untuk menambahkan media ke challenge
                                    </p>
                                </header>
								<div>
									<InputFile id="media" bind:metadata={$form.challenge_media_metadata} />
								</div>
                            </div>
                            <div class="space-y-2">
                                <header>
                                    <h2 class="font-medium">Jenis Media</h2>
                                </header>
                                <div
                                    class="grid w-full grid-cols-3 overflow-hidden rounded-md border border-gray-300"
                                >
                                    {#each challengeMediaTypes as mediaType (mediaType.value)}
                                        <label
                                            class="cursor-pointer border-r border-gray-300 px-2 py-2 text-center text-sm has-checked:bg-blue-50 has-checked:text-blue-600"
                                        >
											<input
												type="radio"
												name="challenge_media_type"
												value={mediaType.value}
												bind:group={$form.challenge_media_type}
												class="sr-only"
											/>
                                            {mediaType.label}
                                        </label>
                                    {/each}
                                </div>
                            </div>
                        </div>
                        <div class="flex h-fit flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-4">
                            <header>
                                <h2 class="font-medium">Tambahkan Petunjuk</h2>
                                <p class="text-sm text-gray-500">
                                    Tambahkan petunjuk untuk membantu peserta menyelesaikan tantangan.
                                </p>
                            </header>
							<div class="space-y-2">
								{#each $form.challenge_hints as hint, index (index)}
									<div class="flex items-center gap-2 rounded-md py-1 focus-within:border-blue-400">
										<span class="w-5 shrink-0 text-sm font-medium text-gray-500">{index + 1}.</span>
										<input
                                            type="text"
											name="challenge_hints"
											bind:value={$form.challenge_hints[index]}
											class="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm outline-none focus:ring-0"
											placeholder="Tulis petunjuk..."
													aria-label={`Petunjuk ${index + 1}${hint ? `: ${hint}` : ''}`}
										/>
										<button
											type="button"
											aria-label={`Hapus petunjuk ${index + 1}`}
											title="Hapus petunjuk"
											class="shrink-0 text-gray-400 hover:text-red-500"
											onclick={() => removeHint(index)}
										>
											<XIcon size={16} />
										</button>
									</div>
									{#if $errors.challenge_hints?.[index]}
										<p class="text-xs text-red-500">{$errors.challenge_hints[index]}</p>
									{/if}
								{/each}
								<Button
									type="button"
									variant="outline"
									size="sm"
									class="w-full flex items-center justify-center gap-2 text-blue-500"
									onclick={addHint}
								>
									<PlusIcon size={16} />
									<span>Tambah Petunjuk</span>
								</Button>
							</div>
                        </div>
					</div>
				</form>
			</div>
		</section>
	</div>
</main>
