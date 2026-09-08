<script>
	import Navbar from "$lib/components/Navbar.svelte";

    let { data } = $props();
</script>

<Navbar user={data.user} />

<main class="w-4/5 mx-auto mt-24">
    <h1>Welcome to SvelteKit, {data.user.name || 'Guest'}!</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
</main>

