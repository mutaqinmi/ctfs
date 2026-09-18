<script lang="ts">
	import Link from "./Link.svelte";
	import { badgeVariants } from "$lib/const/variants";

    let { challenge } = $props();

    function capitalizeFirstLetter(val: string) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }
</script>

<Link data-sveltekit-preload-data="tap" href={`/challenges/${challenge.challenge_slug}`} class="p-4 bg-white border border-gray-300 rounded-lg text-black! hover:bg-gray-100! active:bg-gray-200!">
    <div class="flex items-start justify-between">
        <header>
            <h2 class="font-medium text-xl">{challenge.challenge_title}</h2>
            <p class="text-sm text-gray-400">oleh {challenge.challenge_author}</p>
        </header>
        <p class={badgeVariants({ variant: challenge.challenge_difficulty.toLowerCase() })}>
            {capitalizeFirstLetter(challenge.challenge_difficulty)}
        </p>
    </div>
    <div class="mt-6 pt-3 border-t border-t-gray-300 border-dotted text-sm text-gray-400 flex items-center justify-between">
        <p>{challenge.challenge_category}</p>
        <p>{challenge.challenge_points} poin</p>
    </div>
</Link>