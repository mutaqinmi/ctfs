<script>
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { ArrowLeftIcon, SendIcon } from '@lucide/svelte';

	let { data } = $props();
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
				<p class="text-sm leading-loose text-gray-400">oleh {data.challenge.challenge_author}</p>
				<div class="mt-2 flex items-center gap-2">
					<p class="inline-block rounded-full bg-green-200 px-2 py-1 text-sm text-green-700">
						{data.challenge.challenge_difficulty}
					</p>
					<p class="inline-block rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-600">
						{data.challenge.challenge_category}
					</p>
				</div>
			</header>
			<p class="mt-6 text-sm">{data.challenge.challenge_description}</p>
			<div class="mt-6 pt-6 border-t-2 border-dotted border-t-gray-300 flex items-center gap-3">
				<input
					type="text"
					name="flag"
					id="flag"
                    placeholder={`ctfs${'{'}...${'}'}`}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
				/>
                <Button class="flex items-center gap-2">
                    <SendIcon size={16} />
                    <span>Kirim</span>
                </Button>
			</div>
		</section>
		<aside class="col-span-1 h-fit p-4 bg-white border border-gray-200 rounded-lg">
			<h2 class="font-medium">Petunjuk</h2>
		</aside>
	</div>
</main>
