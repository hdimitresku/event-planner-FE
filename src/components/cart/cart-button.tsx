"use client"
import { ShoppingCart } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useCart } from "../../context/cart-context"
import { cn } from "../../lib/utils"

interface CartButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function CartButton({ className, variant = "outline", size = "default" }: CartButtonProps) {
  const { openCart, getCartItemCount } = useCart()
  const itemCount = getCartItemCount()

  return (
    <Button variant={variant} size={size} onClick={openCart} className={cn("relative", className)}>
      <ShoppingCart className="h-4 w-4" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount > 9 ? "9+" : itemCount}
        </Badge>
      )}
    </Button>
  )
}
