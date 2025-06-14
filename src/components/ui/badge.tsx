import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-sm",
        outline: "text-foreground hover:bg-muted/30 hover:text-accent",
        accent: "border-transparent bg-accent text-accent-foreground hover:bg-accent/80 hover:shadow-sm",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20 border-transparent",
        ghost: "border-transparent bg-transparent text-foreground hover:bg-muted/30",
        success:
          "border-transparent bg-emerald-500/90 dark:bg-emerald-600/90 text-white hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70 hover:shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
