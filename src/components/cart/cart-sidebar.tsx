"use client"

import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"
import { Badge } from "../ui/badge"
import { useCart } from "../../context/cart-context"
import { useLanguage } from "../../context/language-context"
import { useCurrency } from "../../context/currency-context"
import { useNavigate } from "react-router-dom"
import { formatCurrency } from "../../utils/formatters"

export function CartSidebar() {
  const { isCartOpen, closeCart, getCurrentBooking, removeServiceFromCart, clearCart, getCartTotal } = useCart()
  const { t } = useLanguage()
  const { currency } = useCurrency()
  const navigate = useNavigate()

  const currentBooking = getCurrentBooking()
  const total = getCartTotal()

  const handleCheckout = () => {
    if (currentBooking?.venue) {
      navigate(`/venues/${currentBooking.venue.venue.id}/checkout`)
      closeCart()
    }
  }

  const handleContinueShopping = () => {
    navigate("/venues")
    closeCart()
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t("cart.title") || "Your Booking"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4 py-4">
              {!currentBooking ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("cart.empty") || "Your cart is empty"}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("cart.emptyDescription") || "Start by selecting a venue for your event"}
                  </p>
                  <Button onClick={handleContinueShopping}>{t("cart.browseVenues") || "Browse Venues"}</Button>
                </div>
              ) : (
                <>
                  {/* Venue Section */}
                  {currentBooking.venue && (
                    <div className="space-y-3">
                      <h4 className="font-medium">{t("cart.venue") || "Venue"}</h4>
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium">{currentBooking.venue.venue.name.en}</h5>
                            <p className="text-sm text-muted-foreground">
                              {currentBooking.venue.venue.location.address}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">{t("booking.guests") || "Guests"}:</span>
                            <span className="ml-1 font-medium">{currentBooking.venue.guests}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{t("booking.eventType") || "Event"}:</span>
                            <span className="ml-1 font-medium">{currentBooking.venue.eventType}</span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">{t("booking.dates") || "Dates"}:</span>
                          <span className="ml-1 font-medium">
                            {new Date(currentBooking.venue.startDate).toLocaleDateString()} -{" "}
                            {new Date(currentBooking.venue.endDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-medium">{t("cart.venuePrice") || "Venue Price"}</span>
                          <span className="font-medium">
                            {formatCurrency(
                              currentBooking.venue.venue.price.amount *
                                (currentBooking.venue.venue.price.type === "perPerson"
                                  ? currentBooking.venue.guests
                                  : 1),
                              currency,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Services Section */}
                  {currentBooking.services.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">{t("cart.services") || "Additional Services"}</h4>
                      <div className="space-y-3">
                        {currentBooking.services.map((serviceItem) => (
                          <div
                            key={`${serviceItem.service.id}-${serviceItem.option.id}`}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium">{serviceItem.service.name.en}</h5>
                                <p className="text-sm text-muted-foreground">{serviceItem.option.name.en}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeServiceFromCart(serviceItem.service.id, serviceItem.option.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{t("cart.quantity") || "Qty"}:</span>
                                <Badge variant="secondary">{serviceItem.quantity}</Badge>
                              </div>
                              <span className="font-medium">
                                {formatCurrency(serviceItem.option.price.amount * serviceItem.quantity, currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          {currentBooking && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>{t("cart.total") || "Total"}</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>

              <div className="space-y-2">
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  {t("cart.proceedToCheckout") || "Proceed to Checkout"}
                </Button>
                <Button onClick={handleContinueShopping} variant="outline" className="w-full bg-transparent">
                  {t("cart.continueShopping") || "Continue Shopping"}
                </Button>
                <Button onClick={clearCart} variant="ghost" className="w-full text-destructive">
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
