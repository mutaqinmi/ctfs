<script lang="ts">
    import { page } from "$app/state";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { ChevronRightIcon, HouseIcon } from "@lucide/svelte";

    let { class: className, ...props }: HTMLAttributes<HTMLDivElement> = $props();

    const pathname = page.url.pathname;
    const pathList = pathname.split("-")
                        .join(" ")
                        .split("/")
                        .filter((path) => path !== "");

    function capitalize(text: string) {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
</script>

<div {...props} class={cn(
    "flex items-center gap-2 text-gray-400 text-sm",
    className
)}>
    <HouseIcon size={14} />
    <ChevronRightIcon size={14} />
    <p>Beranda</p>
    {#each pathList as path (pathList.indexOf(path))}
        <ChevronRightIcon size={14} />
        <p>{capitalize(path)}</p>
    {/each}
</div>