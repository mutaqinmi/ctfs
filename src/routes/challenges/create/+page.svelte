<script>
	import Navbar from "$lib/components/Navbar.svelte";
    import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import { ArrowLeftIcon, ChevronDownIcon, CloudUploadIcon, PlusIcon } from '@lucide/svelte';
	import { untrack } from "svelte";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { challengeSchema } from "$lib/schemas.js";

    let { data } = $props();

    const { form, errors, constraints, submitting, enhance } = superForm(
        untrack(() => data.form),
        {
            validators: zod4Client(challengeSchema),
        }
    )
</script>

<Navbar user={data.user} />

<main class="min-h-screen w-full bg-gray-50 pt-28">
    <div class="mx-auto grid w-4/5 grid-cols-5 gap-4">
        <section class="col-span-3">
            <Button onclick={() => window.history.back()} variant="text" size="sm" class="flex w-fit items-center gap-2 font-normal text-blue-500">
				<ArrowLeftIcon size={16} />
				<span>Kembali ke Tantangan</span>
			</Button>
			<Breadcrumbs class="my-2" />
            <header class="mb-6">
                <h2 class="text-2xl font-semibold">Buat Tantangan Baru</h2>
                <p>{data.challengeCategories.map((c) => c.category_name)}</p>
            </header>
            <form id="challenge-form" action="/challenges/create" method="POST" class="space-y-4" use:enhance>
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
                        {...$constraints.challenge_description}
                    ></textarea>
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
                                class="appearance-none w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                {...$constraints.challenge_difficulty}
                            >
                                <option value="easy">Mudah</option>
                                <option value="medium">Sedang</option>
                                <option value="hard">Sulit</option>
                            </select>
                            <ChevronDownIcon size={16} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                            class="appearance-none w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            {...$constraints.category_id}
                        >
                            <option value={0} disabled>Pilih Kategori</option>
                            {#each data.challengeCategories as category (category.category_id)}
                                <option value={category.category_id}>{category.category_name}</option>
                            {/each}
                        </select>
                        <ChevronDownIcon size={16} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {#if $errors.category_id}
                        <p class="text-xs text-red-500">{$errors.category_id}</p>
                    {/if}
                </div>
                <div class="space-y-1">
                    <div>
                        <label for="challenge_flag" class="block">Flag</label>
                        <p class="text-sm text-gray-500">Gunakan format "{`ctfs${'{'}...${'}'}`}"</p>
                    </div>
                    <input
                        type="text"
                        id="challenge_flag"
                        name="challenge_flag"
                        bind:value={$form.challenge_flag}
                        class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        placeholder={`ctfs${'{'}c4tCh_m3!f_y0uc4N20c7dt5${'}'}`}
                        {...$constraints.challenge_flag}
                    />
                    {#if $errors.challenge_flag}
                        <p class="text-xs text-red-500">{$errors.challenge_flag}</p>
                    {/if}
                </div>
            </form>
        </section>
        <aside class="col-span-2 h-fit flex flex-col space-y-4">
            <div class="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
                <div class="space-y-2">
                    <h2 class="font-medium">Tambahkan Media</h2>
                    <div>
                        <label for="media" class="w-full h-48 border-2 border-dashed border-gray-300 text-gray-400 rounded-md flex flex-col items-center justify-center">
                            <CloudUploadIcon size={48} />
                            <span class="mt-4">Klik untuk mengunggah file</span>
                        </label>
                        <input type="file" name="media" id="media" class="hidden">
                    </div>
                </div>
                <div class="space-y-2">
                    <h2 class="font-medium">Jenis Media</h2>
                    <div class="w-full grid grid-cols-3">
                        <div>
                            <input type="radio" name="media_type" id="image" value="image">
                            <label for="image">Gambar</label>
                        </div>
                        <div>
                            <input type="radio" name="media_type" id="source" value="source">
                            <label for="source">Source Code</label>
                        </div>
                        <div>
                            <input type="radio" name="media_type" id="docker" value="docker">
                            <label for="docker">Docker Image</label>
                        </div>
                    </div>
                </div>
            </div>
            <Button disabled={$submitting} type="submit" form="challenge-form" class="w-fit self-end flex items-center gap-2">
                <PlusIcon size={16} />
                <span>Buat Tantangan</span>
            </Button>
		</aside>
    </div>
</main>