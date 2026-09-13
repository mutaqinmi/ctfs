<script lang="ts">
	import { cn } from "$lib/utils";
    import { ChevronRightIcon, FlagTriangleRightIcon, PodiumIcon, UngroupIcon, UserRound } from "@lucide/svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import Link from "./Link.svelte";

    let { class: className, ...props }: HTMLAttributes<HTMLDivElement> = $props();
    
    const menus = {
        section: [
            { id: 1, title: 'Tantangan', href: '/challenges', icon: FlagTriangleRightIcon },
            { id: 2, title: 'Kategori', href: '/categories', icon: UngroupIcon },
            { id: 3, title: 'Papan Skor', href: '/leaderboard', icon: PodiumIcon },
        ],
        settings: [
            { id: 1, title: 'Profil', href: '/me', icon: UserRound },
        ]
    }
</script>

<div {...props} class={cn(
    "space-y-2",
    className
)}>
    {#each Object.entries(menus) as [key, section] (key)}
        <ul class="p-2 bg-white border border-gray-200 rounded-lg">
            {#each section as menuItem (menuItem.id)}
                <li>
                    <Link variant="text" href={menuItem.href} class="p-3! font-normal! hover:no-underline hover:bg-gray-100 flex items-center justify-between not-last:border-b border-b-gray-200">
                        <div class="flex items-center gap-3">
                            <menuItem.icon size={20} class="text-gray-400" />
                            <span>{menuItem.title}</span>
                        </div>
                        <ChevronRightIcon size={16} class="text-gray-300" />
                    </Link>
                </li>
            {/each}
        </ul>
    {/each}
</div>