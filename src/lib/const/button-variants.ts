import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    "rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
    {
        variants: {
            variant: {
                primary: "bg-blue-500 !text-white not-disabled:hover:bg-blue-600 not-disabled:active:bg-blue-700",
                outline: "bg-transparent border border-gray-300 not-disabled:hover:bg-gray-100 not-disabled:active:bg-gray-200",
                ghost: "not-disabled:hover:bg-gray-100 not-disabled:active:bg-gray-200",
                text: "!p-0 hover:underline"
            },
            size: {
                sm: "px-2 py-1 text-sm",
                md: "px-3 py-2 text-normal",
                lg: "px-4 py-3 text-lg"
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "md"
        }
    }
)