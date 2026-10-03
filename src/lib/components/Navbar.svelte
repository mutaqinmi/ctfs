<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { LogOutIcon, UserRoundIcon } from "@lucide/svelte";
	import Button from "./Button.svelte";
	import Link from "./Link.svelte";
	import type { User } from "better-auth";

	type NavbarUser = User & { points: number };

	let { user }: { user?: NavbarUser | null } = $props();

	const handleSignout = async () => {
		const confirmSignout = confirm("Apakah Anda yakin ingin keluar?");
		if (!confirmSignout) return;
		
        await authClient.signOut();
        window.location.href = "/";
    }
</script>

<nav class="fixed top-0 z-10 w-full bg-white">
	<div class="m-auto flex w-4/5 items-center justify-between py-6">
		<p class="text-2xl font-semibold">CTFs</p>
		{#if user}
			<div class="flex gap-4 items-center">
				<div class="flex shrink-0 items-center gap-3 text-right">
					<div>
						<span class="block font-normal">{user.name}</span>
						<span class="block text-sm text-gray-400">{user.points} poin</span>
					</div>
					<UserRoundIcon size={42} class="text-white bg-gray-300 rounded-full p-2" />
				</div>
				<div aria-hidden="true" class="border-l-2 border-gray-200 h-8"></div>
				<Button
					variant="ghost"
					onclick={handleSignout}
					class="p-2 text-red-600!"
				>
					<LogOutIcon size={20} />
				</Button>
			</div>
		{:else}
			<div class="space-x-2">
				<Link href="/signup" variant="ghost">Daftar</Link>
				<Link href="/signin">Masuk</Link>
			</div>
		{/if}
	</div>
</nav>