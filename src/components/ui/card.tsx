import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "relative rounded-lg border bg-card/90 backdrop-blur-sm text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
      "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-sky-50/50 before:to-emerald-50/50 dark:before:from-sky-950/20 dark:before:to-emerald-950/20 before:opacity-50 before:blur-sm before:-z-10",
      "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tr after:from-violet-50/30 after:to-purple-50/30 dark:after:from-violet-950/10 dark:after:to-purple-950/10 after:opacity-30 after:blur-sm after:-z-20",
      className
    )} 
    {...props} 
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />,
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />,
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
