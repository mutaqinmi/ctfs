<script>
	import Button from "$lib/components/Link.svelte";
    import googleIcon from "$lib/assets/google-icon.svg";
	import Link from "$lib/components/Link.svelte";
</script>

<nav class="bg-white w-full fixed top-0 z-10">
    <div class="w-4/5 m-auto py-6 flex items-center justify-between">
        <p class="font-semibold text-2xl">CTFs</p>
        <div class="space-x-2">
            <Link href="/signup" variant="ghost">Daftar</Link>
            <Link href="/signin">Masuk</Link>
        </div>
    </div>
</nav>

<main class="bg-gray-50 w-full h-screen flex items-center justify-center">
    <div class="w-90 p-6 bg-white rounded-lg space-y-4">
        <header>
            <h1 class="font-semibold text-2xl leading-normal">Masuk</h1>
            <p class="text-gray-500 text-sm">Masuk ke CTFs untuk melanjutkan.</p>
        </header>

        <div>
            <Button variant="outline" class="w-full flex items-center justify-center space-x-4">
                <img src={googleIcon} alt="Google Icon" class="w-5" />
                <span>Masuk dengan Google</span>
            </Button>
            
            <p class="text-gray-500 text-xs text-center my-3">atau</p>
            
            <form method="post" action="?/signin">
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
            </form>
        </div>
    </div>
</main>