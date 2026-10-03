<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { LogOutIcon, MenuIcon, UserRoundIcon } from "@lucide/svelte";
	import Button from "./Button.svelte";
	import Link from "./Link.svelte";
	import type { User } from "better-auth";

	type NavbarUser = User & { points: number };

	let { user }: { user?: NavbarUser | null } = $props();
	let menuOpen = $state(false);

	const handleSignout = async () => {
		const confirmSignout = confirm("Apakah Anda yakin ingin keluar?");
		if (!confirmSignout) return;
		
        await authClient.signOut();
        window.location.href = "/";
    }

	function closeMenu() {
		menuOpen = false;
	}
</script>

<nav class="fixed top-0 z-10 w-full bg-white">
	<div class="mx-4 md:m-auto flex md:w-4/5 items-center justify-between py-4 md:py-6">
		<p class="text-2xl font-semibold">CTFs</p>
		{#if user}
			<div class="hidden items-center gap-4 md:flex">
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
			<button
				type="button"
				class="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
				aria-label="Buka menu pengguna"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<MenuIcon size={22} />
			</button>
		{:else}
			<div class="hidden space-x-2 md:block">
				<Link href="/signup" variant="ghost">Daftar</Link>
				<Link href="/signin">Masuk</Link>
			</div>
			<button
				type="button"
				class="rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
				aria-label="Buka menu autentikasi"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<MenuIcon size={22} />
			</button>
		{/if}
	</div>

	{#if menuOpen}
		<button
			type="button"
			class="fixed inset-0 z-20 md:hidden"
			aria-label="Tutup menu pengguna"
			onclick={closeMenu}
		></button>
		<div class="absolute top-full right-4 z-30 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg md:hidden">

			{#if user}
				<div class="flex items-center gap-3 border-b border-gray-200 pb-3">
					<UserRoundIcon size={42} class="rounded-full bg-gray-300 p-2 text-white" />
					<div>
						<span class="block font-normal">{user.name}</span>
						<span class="block text-sm text-gray-400">{user.points} poin</span>
					</div>
				</div>
				<Button variant="ghost" onclick={handleSignout} class="mt-3 flex w-full items-center gap-2 text-left text-red-600!">
					<LogOutIcon size={20} />
					<span>Keluar</span>
				</Button>
			{:else}
				<div class="flex flex-col gap-2">
					<Link href="/signup" variant="ghost" onclick={closeMenu}>Daftar</Link>
					<Link href="/signin" onclick={closeMenu}>Masuk</Link>
				</div>
			{/if}
		</div>
	{/if}
</nav>