<script>
	import Link from '$lib/components/Link.svelte';
	import Button from '$lib/components/Button.svelte';
	import googleIcon from '$lib/assets/google-icon.svg';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { signinSchema } from '$lib/schemas.js';
	import { untrack } from 'svelte';
	import { EyeIcon, EyeOffIcon } from '@lucide/svelte';
	import { authClient } from '$lib/auth-client.js';

	let { data } = $props();
	let showPassword = $state(false);

	const { form, constraints, errors, submitting, enhance } = superForm(
		untrack(() => data.form),
		{
			validators: zod4Client(signinSchema)
		}
	);

    const googleSignin = async () => {
        await authClient.signIn.social({
            provider: 'google'
        })
    }
</script>

<nav class="fixed top-0 z-10 w-full bg-white">
	<div class="m-auto flex w-4/5 items-center justify-between py-6">
		<p class="text-2xl font-semibold">CTFs</p>
		<div class="space-x-2">
			<Link href="/signup" variant="ghost">Daftar</Link>
			<Link href="/signin">Masuk</Link>
		</div>
	</div>
</nav>

<main class="flex h-screen w-full items-center justify-center bg-gray-50">
	<div class="w-90 space-y-4 rounded-lg bg-white p-6">
		<header>
			<h1 class="text-2xl leading-normal font-semibold">Masuk</h1>
			<p class="text-sm text-gray-500">Masuk ke CTFs untuk melanjutkan.</p>
		</header>

		<div>
			<Button variant="outline" class="flex w-full items-center justify-center space-x-4" onclick={googleSignin}>
				<img src={googleIcon} alt="Google Icon" class="w-5" />
				<span>Masuk dengan Google</span>
			</Button>

            <div class="flex items-center justify-center space-x-3 my-3">
                <div class="border-t border-gray-200 w-full"></div>
                <p class="text-center text-xs text-gray-500">atau</p>
                <div class="border-t border-gray-200 w-full"></div>
            </div>

			<form method="post" class="space-y-3" use:enhance>
				<div class="space-y-1">
					<label for="email" class="block">Email</label>
					<input
						type="email"
						id="email"
                        name="email"
						bind:value={$form.email}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
						placeholder="player@ctfs.io"
						{...$constraints.email}
					/>
					{#if $errors.email}
						<p class="text-xs text-red-500">{$errors.email}</p>
					{/if}
				</div>

				<div class="space-y-1">
					<label for="password" class="block">Password</label>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							id="password"
                            name="password"
							bind:value={$form.password}
							class="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none [[type='password']]:[&::-ms-reveal]:hidden"
							placeholder="••••••••"
							{...$constraints.password}
						/>
						<button
							type="button"
							class="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-500"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeIcon size={18} />
							{:else}
								<EyeOffIcon size={18} />
							{/if}
						</button>
					</div>
					{#if $errors.password}
						<p class="text-xs text-red-500">{$errors.password}</p>
					{/if}
				</div>

				<Button disabled={$submitting} class="mt-6 w-full">Masuk</Button>
				<p class="text-sm text-gray-500 text-center leading-loose">
					Belum punya akun? <Link variant="text" href="/signup" class="font-medium text-blue-500"
						>Daftar sekarang</Link
					>.
				</p>
			</form>
		</div>
	</div>
</main>
