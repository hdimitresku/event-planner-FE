"use client"
import { X, ShoppingCart, Calendar, Users, Clock, MapPin, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { useCart } from "../../context/cart-context"
import { useLanguage } from "../../context/language-context"
import { useCurrency } from "../../context/currency-context"
import { format } from "date-fns"
import { cn } from "../../lib/utils"

export function CartSidebar() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    getCurrentBooking,
    removeFromCart,
    removeServiceFromCart,
    getCartTotal,
    clearCart,
  } = useCart()
  const { t, language } = useLanguage()
  const { formatPrice, currency } = useCurrency()

  const currentBooking = getCurrentBooking()

  if (!isCartOpen) return null

  const hasItems = cartItems.length > 0 || currentBooking

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={closeCart} />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">{t("cart.title") || "Your Booking"}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {!hasItems ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">{t("cart.empty") || "Your cart is empty"}</h3>
                <p className="text-muted-foreground">
                  {t("cart.emptyDescription") || "Start by selecting a venue for your event"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Booking */}
                {currentBooking && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{t("cart.currentBooking") || "Current Booking"}</h3>
                      <Badge variant="secondary">{t("cart.inProgress") || "In Progress"}</Badge>
                    </div>

                    {/* Venue Details */}
                    {currentBooking.venue && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                            <img
                              src={
                                currentBooking.venue.venue.media?.[0]?.url ||
                                "/placeholder.svg?height=64&width=64&text=Venue" ||
                                "/placeholder.svg"
                              }
                              alt={currentBooking.venue.venue.name[language]}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{currentBooking.venue.venue.name[language]}</h4>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {currentBooking.venue.venue.address?.city},{" "}
                                {currentBooking.venue.venue.address?.country}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="truncate">{format(currentBooking.venue.startDate, "MMM dd")}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="truncate">{format(currentBooking.venue.startDate, "HH:mm")}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{currentBooking.venue.guests} guests</span>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="text-xs">
                              {t(`venueBook.${currentBooking.venue.eventType}`)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {currentBooking.services.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">{t("cart.selectedServices") || "Selected Services"}</h4>
                        {currentBooking.services.map((serviceItem) => (
                          <div
                            key={`${serviceItem.service.id}-${serviceItem.option.id}`}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{serviceItem.option.name[language]}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {serviceItem.service.name[language]}
                              </div>
                              <div className="text-xs font-medium mt-1">
                                {formatPrice(serviceItem.option.price.amount, currency)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeServiceFromCart(serviceItem.service.id, serviceItem.option.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Separator />
                  </div>
                )}

                {/* Completed Bookings */}
                {cartItems.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {t("cart.booking") || "Booking"} #{index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => item.venue && removeFromCart(item.venue.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {item.venue && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="font-medium text-sm">{item.venue.venue.name[language]}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(item.venue.startDate, "PPP")} • {item.venue.guests} guests
                        </div>
                        <div className="text-sm font-medium mt-2">{formatPrice(item.totalAmount, currency)}</div>
                      </div>
                    )}

                    <Separator />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {hasItems && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("cart.total") || "Total"}</span>
                <span className="text-lg font-bold">{formatPrice(getCartTotal(), currency)}</span>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-amber-500 hover:bg-amber-600">
                  {t("cart.proceedToCheckout") || "Proceed to Checkout"}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                  {t("cart.clearCart") || "Clear Cart"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
