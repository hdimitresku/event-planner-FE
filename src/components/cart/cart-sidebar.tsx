"use client"

import { ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { useCart } from "../../context/cart-context"
import { useLanguage } from "../../context/language-context"
import { useCurrency } from "../../context/currency-context"
import { useNavigate } from "react-router-dom"
import { formatPrice } from "../../utils/formatters"

export function CartSidebar() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    currentBooking,
    removeServiceFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart()
  const { t } = useLanguage()
  const { currency } = useCurrency()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (currentBooking) {
      navigate("/venue-checkout")
      closeCart()
    }
  }

  const handleClearCart = () => {
    clearCart()
  }

  const totalAmount = getCartTotal()
  const itemCount = getCartItemCount()

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t("cart.title") || "Your Booking"}
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4 py-4">
              {/* Current Booking */}
              {currentBooking && currentBooking.venue && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{t("cart.currentBooking") || "Current Booking"}</h3>
                  </div>

                  {/* Venue Details */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={currentBooking.venue.venue.images[0] || "/placeholder.jpg"}
                        alt={currentBooking.venue.venue.name.en}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{currentBooking.venue.venue.name.en}</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentBooking.venue.guests} {t("common.guests") || "guests"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(currentBooking.venue.startDate).toLocaleDateString()} -{" "}
                          {new Date(currentBooking.venue.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(
                            currentBooking.venue.venue.price.amount *
                              (currentBooking.venue.venue.price.type === "perPerson" ? currentBooking.venue.guests : 1),
                            currency,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  {currentBooking.services.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">{t("cart.additionalServices") || "Additional Services"}</h4>
                      {currentBooking.services.map((serviceItem) => (
                        <div
                          key={`${serviceItem.service.id}-${serviceItem.option.id}`}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{serviceItem.option.name.en}</p>
                            <p className="text-xs text-muted-foreground">{serviceItem.service.name.en}</p>
                            <p className="text-xs text-muted-foreground">
                              {t("common.quantity") || "Qty"}: {serviceItem.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">
                              {formatPrice(serviceItem.option.price.amount * serviceItem.quantity, currency)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeServiceFromCart(serviceItem.service.id, serviceItem.option.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Previous Cart Items */}
              {cartItems.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="font-semibold text-lg">{t("cart.previousBookings") || "Previous Bookings"}</h3>
                  {cartItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium">{item.venue?.venue.name.en}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.totalAmount, currency)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!currentBooking && cartItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{t("cart.empty") || "Your cart is empty"}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("cart.emptyDescription") || "Start by selecting a venue for your event"}
                  </p>
                  <Button
                    onClick={() => {
                      navigate("/venues")
                      closeCart()
                    }}
                  >
                    {t("cart.browseVenues") || "Browse Venues"}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          {(currentBooking || cartItems.length > 0) && (
            <div className="border-t pt-4 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t("cart.total") || "Total"}</span>
                <span>{formatPrice(totalAmount, currency)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {currentBooking && (
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    {t("cart.proceedToCheckout") || "Proceed to Checkout"}
                  </Button>
                )}
                <Button variant="outline" onClick={handleClearCart} className="w-full bg-transparent" size="sm">
                  {t("cart.clearCart") || "Clear Cart"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
