<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { LogOutIcon } from "@lucide/svelte";
	import Button from "./Button.svelte";
	import Link from "./Link.svelte";
	import type { User } from "better-auth";

	let { user }: { user?: User | null } = $props();

	const handleSignout = async () => {
        await authClient.signOut();
        window.location.href = "/";
    }
</script>

<nav class="fixed top-0 z-10 w-full bg-white">
	<div class="m-auto flex w-4/5 items-center justify-between py-6">
		<p class="text-2xl font-semibold">CTFs</p>
		{#if user}
			<Button variant="outline" onclick={handleSignout} class="flex items-center space-x-2">
				<span>Keluar</span>
				<LogOutIcon size={16} />
			</Button>
		{:else}
			<div class="space-x-2">
				<Link href="/signup" variant="ghost">Daftar</Link>
				<Link href="/signin">Masuk</Link>
			</div>
		{/if}
	</div>
</nav>