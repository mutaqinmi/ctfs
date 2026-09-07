<script lang="ts">
	import { cn } from "$lib/utils";
	import type { VariantProps } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";
    import { buttonVariants } from "$lib/const/button-variants";

    interface AnchorProps extends HTMLAnchorAttributes {
        variant?: VariantProps<typeof buttonVariants>["variant"];
        size?: VariantProps<typeof buttonVariants>["size"];
        class?: string;
        children: Snippet;
    }

    let {
        variant,
        size,
        class: className,
        children,
        ...props
    }: AnchorProps = $props();
</script>

<a
    class={cn(buttonVariants({ variant, size }), className)}
    {...props}
>
    {@render children()}
</a>