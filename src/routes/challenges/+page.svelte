<script>
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { ChevronDownIcon, FunnelIcon, PlusIcon, SearchIcon } from '@lucide/svelte';

	let { data } = $props();
</script>

<Navbar user={data.user} />

<main class="min-h-screen w-full bg-gray-50 pt-28">
	<div class="mx-auto grid w-4/5 grid-cols-4 gap-4">
		<Menu class="col-span-1" />
		<section class="col-span-3">
			<header>
				<Breadcrumbs class="mb-1" />
				<h1 class="text-3xl font-semibold">Tantangan</h1>
			</header>
			<div class="mt-6 flex items-center justify-between">
                <div class="w-fit relative">
                    <input
                        type="text"
                        name="searchChallenges"
                        id="searchChallenges"
                        class="w-72 rounded-md bg-white border border-gray-300 px-3 pr-10 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                        placeholder="Cari tantangan ..."
                    />
                    <SearchIcon class="absolute top-1/2 -translate-y-1/2 right-4 text-gray-300" size={20} />
                </div>
                <div class="flex gap-2">
                    <Button class="bg-white border border-gray-300 text-black! flex items-center gap-2 hover:bg-gray-200! active:bg-gray-300!">
                        <span>Semua Kategori</span>
                        <ChevronDownIcon size={18} class="text-gray-400" />
                    </Button>
                    <Button class="bg-white border border-gray-300 text-black! flex items-center gap-2 hover:bg-gray-200! active:bg-gray-300!">
                        <FunnelIcon size={18} />
                        <span>Filter</span>
                    </Button>
                    {#if data.user.role === 'admin'}
                        <Link href="/challenges/create" class="flex items-center justify-center gap-2">
                            <PlusIcon size={18} />
                            <span>Buat Tantangan</span>
                        </Link>
                    {/if}
                </div>
			</div>
            <div class="mt-3 grid grid-cols-3 gap-2">
                {#each data.allChallenges as challenge (challenge.challenge_id)}
                    <Link data-sveltekit-preload-data="tap" href={`/challenges/${challenge.challenge_slug}`} class="p-4 bg-white border border-gray-300 rounded-lg text-black! hover:bg-gray-100! active:bg-gray-200!">
                        <div class="flex items-start justify-between">
                            <header>
                                <h2 class="font-medium text-xl">{challenge.challenge_title}</h2>
                                <p class="text-sm text-gray-400">oleh {challenge.challenge_author}</p>
                            </header>
                            <p class="text-xs px-2 py-1 bg-green-200 text-green-700 rounded-full inline-block">{challenge.challenge_difficulty}</p>
                        </div>
                        <div class="mt-6 pt-3 border-t border-t-gray-300 border-dotted text-sm text-gray-400 flex items-center justify-between">
                            <p>{challenge.challenge_category}</p>
                            <!-- <p>{challenge.challenges.solved} Berhasil</p> -->
                        </div>
                    </Link>
                {/each}
            </div>
		</section>
	</div>
</main>
