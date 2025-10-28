import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Avatar } from "./Avatar.vue"
export { default as AvatarFallback } from "./AvatarFallback.vue"
export { default as AvatarImage } from "./AvatarImage.vue"

export const avatarVariant = cva(
  "relative flex shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        base: "h-10 w-10",
        lg: "h-12 w-12",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      size: "sm",
      shape: "circle",
    },
  },
)

export type AvatarVariants = VariantProps<typeof avatarVariant>
