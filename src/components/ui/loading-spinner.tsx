import { cn } from "../../lib/utils"

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    text?: string
    className?: string
    overlay?: boolean
}

export function LoadingSpinner({ size = "md", text, className, overlay = false }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    }

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    }

    const spinner = (
        <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
            <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size])} />
            {text && <p className={cn("text-muted-foreground", textSizeClasses[size])}>{text}</p>}
        </div>
    )

    if (overlay) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {spinner}
            </div>
        )
    }

    return spinner
}
