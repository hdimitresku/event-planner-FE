import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 press-effect",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent/10 hover:text-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover-underline",
        transparent: "bg-transparent hover:bg-transparent",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        minimalist:
          "bg-transparent text-foreground border-b-2 border-primary hover:bg-primary/5 rounded-none px-0 py-1",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        pulse: "pulse-on-hover",
        bounce: "bounce-in",
        slide: "slide-in",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    return (
      <Comp className={buttonVariants({ variant, size, animation, className })} ref={ref} {...props}>
        {isLoading ? (
          <>
            <span className="loading-dots mr-2">
              <span></span>
              <span></span>
              <span></span>
            </span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
