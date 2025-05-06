"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Checkbox } from "../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Calendar } from "../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { format, addHours } from "date-fns"
import { CalendarIcon, Clock, Users, Utensils, Music, Palette, ArrowRight, Info } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function BookingPage() {
  const { t } = useLanguage()
  const params = useParams()
  const venueId = params.id

  // State for date range selection
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addHours(new Date(), 3))
  const [guests, setGuests] = useState(50)
  const [selectedServices, setSelectedServices] = useState({
    catering: "none",
    music: "none",
    decor: "none",
  })

  // This would normally be fetched from an API
  const venue = {
    id: venueId,
    name: "Stunning Loft Space with City Views",
    location: "SoHo, New York",
    price: 150,
    image: "/placeholder.svg?height=300&width=400&text=Venue Image",
  }

  // Calculate duration in hours
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
  }

  const duration = calculateDuration()

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = venue.price * duration

    // Add service costs
    let serviceCosts = 0
    if (selectedServices.catering === "basic") serviceCosts += 25 * guests
    if (selectedServices.catering === "premium") serviceCosts += 45 * guests
    if (selectedServices.music === "dj") serviceCosts += 150 * duration
    if (selectedServices.music === "band") serviceCosts += 350 * duration
    if (selectedServices.music === "playlist") serviceCosts += 50
    if (selectedServices.decor === "basic") serviceCosts += 300
    if (selectedServices.decor === "premium") serviceCosts += 800

    const serviceFee = Math.round((basePrice + serviceCosts) * 0.15)

    return {
      basePrice,
      serviceCosts,
      serviceFee,
      total: basePrice + serviceCosts + serviceFee,
    }
  }

  const { basePrice, serviceFee, total } = calculateTotal()

  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container px-4 md:px-6 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold md:text-3xl">Book {venue.name}</h1>
              <p className="text-muted-foreground">Customize your event and complete your booking</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
              <div className="space-y-6">
                <div className="rounded-lg border p-6 space-y-4 bg-card shadow-sm">
                  <h2 className="text-xl font-semibold">Booking Details</h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-type" className="text-base">
                        Event Type
                      </Label>
                      <select
                          id="event-type"
                          className="w-full p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="">Select event type</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="photoshoot">Photo Shoot</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="date-range-container space-y-4">
                      <Label className="text-base">Event Date & Time</Label>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date & Time</Label>
                          <div className="flex flex-col space-y-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-12">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                    className="rounded-md border"
                                />
                              </PopoverContent>
                            </Popover>

                            <div className="flex items-center border rounded-md bg-background">
                              <Clock className="ml-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                  type="time"
                                  value={startDate ? format(startDate, "HH:mm") : ""}
                                  onChange={(e) => {
                                    if (startDate && e.target.value) {
                                      const [hours, minutes] = e.target.value.split(":").map(Number)
                                      const newDate = new Date(startDate)
                                      newDate.setHours(hours, minutes)
                                      setStartDate(newDate)
                                    }
                                  }}
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date & Time</Label>
                          <div className="flex flex-col space-y-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-12">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    className="rounded-md border"
                                />
                              </PopoverContent>
                            </Popover>

                            <div className="flex items-center border rounded-md bg-background">
                              <Clock className="ml-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                  type="time"
                                  value={endDate ? format(endDate, "HH:mm") : ""}
                                  onChange={(e) => {
                                    if (endDate && e.target.value) {
                                      const [hours, minutes] = e.target.value.split(":").map(Number)
                                      const newDate = new Date(endDate)
                                      newDate.setHours(hours, minutes)
                                      setEndDate(newDate)
                                    }
                                  }}
                                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-primary mr-2" />
                          <span className="font-medium">Duration:</span>
                        </div>
                        <span className="font-medium">{duration} hours</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base flex items-center">
                        <Users className="mr-2 h-5 w-5 text-primary" />
                        Number of Guests
                      </Label>
                      <div className="flex items-center border rounded-md bg-background p-1">
                        <Button
                            variant="ghost"
                            className="rounded-md h-10 w-10"
                            onClick={() => setGuests(Math.max(10, guests - 5))}
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center font-medium">{guests}</div>
                        <Button
                            variant="ghost"
                            className="rounded-md h-10 w-10"
                            onClick={() => setGuests(Math.min(100, guests + 5))}
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">This venue can accommodate 10-100 guests</p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="catering" className="border rounded-lg bg-card shadow-sm">
                  <div className="p-6 pb-2">
                    <h2 className="text-xl font-semibold mb-4">Add Services</h2>
                    <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50 p-1 rounded-md">
                      <TabsTrigger value="catering" className="rounded-sm data-[state=active]:bg-background">
                        <Utensils className="mr-2 h-4 w-4" />
                        {t("business.categories.catering")}
                      </TabsTrigger>
                      <TabsTrigger value="music" className="rounded-sm data-[state=active]:bg-background">
                        <Music className="mr-2 h-4 w-4" />
                        {t("business.categories.music")}
                      </TabsTrigger>
                      <TabsTrigger value="decor" className="rounded-sm data-[state=active]:bg-background">
                        <Palette className="mr-2 h-4 w-4" />
                        {t("business.categories.decoration")}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="catering" className="p-6 pt-2 space-y-4">
                    <p className="text-muted-foreground">Select catering options for your event</p>

                    <RadioGroup
                        defaultValue="none"
                        value={selectedServices.catering}
                        onValueChange={(value: string) => setSelectedServices({ ...selectedServices, catering: value })}
                        className="space-y-3"
                    >
                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="catering-none" className="border-primary" />
                          <Label htmlFor="catering-none" className="font-medium cursor-pointer">
                            No catering needed
                          </Label>
                        </div>
                        <div className="font-medium">$0</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="basic" id="catering-basic" className="border-primary" />
                          <div>
                            <Label htmlFor="catering-basic" className="font-medium cursor-pointer">
                              Basic Package
                            </Label>
                            <p className="text-sm text-muted-foreground">Appetizers, soft drinks, and desserts</p>
                          </div>
                        </div>
                        <div className="font-medium">$25/{t("business.pricing.perPerson")}</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="premium" id="catering-premium" className="border-primary" />
                          <div>
                            <Label htmlFor="catering-premium" className="font-medium cursor-pointer">
                              Premium Package
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Full meal service with appetizers, main course, desserts, and beverages
                            </p>
                          </div>
                        </div>
                        <div className="font-medium">$45/{t("business.pricing.perPerson")}</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="catering-custom" className="border-primary" />
                          <div>
                            <Label htmlFor="catering-custom" className="font-medium cursor-pointer">
                              Custom Menu
                            </Label>
                            <p className="text-sm text-muted-foreground">Work with our chef to create a custom menu</p>
                          </div>
                        </div>
                        <div className="font-medium">Custom pricing</div>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label htmlFor="catering-notes">Special dietary requirements or notes</Label>
                      <Textarea
                          id="catering-notes"
                          placeholder="Please list any dietary restrictions or special requests..."
                          className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="music" className="p-6 pt-2 space-y-4">
                    <p className="text-muted-foreground">Select music and entertainment options</p>

                    <RadioGroup
                        defaultValue="none"
                        value={selectedServices.music}
                        onValueChange={(value: string) => setSelectedServices({ ...selectedServices, music: value })}
                        className="space-y-3"
                    >
                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="music-none" className="border-primary" />
                          <Label htmlFor="music-none" className="font-medium cursor-pointer">
                            No music services needed
                          </Label>
                        </div>
                        <div className="font-medium">$0</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dj" id="music-dj" className="border-primary" />
                          <div>
                            <Label htmlFor="music-dj" className="font-medium cursor-pointer">
                              Professional DJ
                            </Label>
                            <p className="text-sm text-muted-foreground">Experienced DJ with professional equipment</p>
                          </div>
                        </div>
                        <div className="font-medium">$150/{t("business.pricing.hourly")}</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="band" id="music-band" className="border-primary" />
                          <div>
                            <Label htmlFor="music-band" className="font-medium cursor-pointer">
                              Live Band
                            </Label>
                            <p className="text-sm text-muted-foreground">Professional musicians for live performance</p>
                          </div>
                        </div>
                        <div className="font-medium">$350/{t("business.pricing.hourly")}</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="playlist" id="music-playlist" className="border-primary" />
                          <div>
                            <Label htmlFor="music-playlist" className="font-medium cursor-pointer">
                              Custom Playlist
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              We'll create a custom playlist based on your preferences
                            </p>
                          </div>
                        </div>
                        <div className="font-medium">$50 flat fee</div>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label htmlFor="music-notes">Music preferences or special requests</Label>
                      <Textarea
                          id="music-notes"
                          placeholder="Please list your preferred genres, artists, or songs..."
                          className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="decor" className="p-6 pt-2 space-y-4">
                    <p className="text-muted-foreground">Select decoration options for your event</p>

                    <RadioGroup
                        defaultValue="none"
                        value={selectedServices.decor}
                        onValueChange={(value: string) => setSelectedServices({ ...selectedServices, decor: value })}
                        className="space-y-3"
                    >
                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="decor-none" className="border-primary" />
                          <Label htmlFor="decor-none" className="font-medium cursor-pointer">
                            No decoration needed
                          </Label>
                        </div>
                        <div className="font-medium">$0</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="basic" id="decor-basic" className="border-primary" />
                          <div>
                            <Label htmlFor="decor-basic" className="font-medium cursor-pointer">
                              Basic Package
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Table centerpieces, basic lighting, and simple decorations
                            </p>
                          </div>
                        </div>
                        <div className="font-medium">$300</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="premium" id="decor-premium" className="border-primary" />
                          <div>
                            <Label htmlFor="decor-premium" className="font-medium cursor-pointer">
                              Premium Package
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Elaborate decorations, custom lighting, floral arrangements, and themed decor
                            </p>
                          </div>
                        </div>
                        <div className="font-medium">$800</div>
                      </div>

                      <div className="flex items-center justify-between space-x-2 border p-4 rounded-md hover:bg-muted/10 transition-colors">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="decor-custom" className="border-primary" />
                          <div>
                            <Label htmlFor="decor-custom" className="font-medium cursor-pointer">
                              Custom Theme
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Work with our decorator to create a custom themed environment
                            </p>
                          </div>
                        </div>
                        <div className="font-medium">Custom pricing</div>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label htmlFor="decor-notes">Decoration theme or special requests</Label>
                      <Textarea
                          id="decor-notes"
                          placeholder="Please describe your preferred theme or specific decoration requests..."
                          className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="rounded-lg border p-6 space-y-4 bg-card shadow-sm">
                  <h2 className="text-xl font-semibold">Additional Information</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="special-requests" className="text-base">
                        Special Requests
                      </Label>
                      <Textarea
                          id="special-requests"
                          placeholder="Any additional requests or information we should know..."
                          className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-md">
                      <Checkbox
                          id="terms"
                          className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary underline hover:text-primary/80 transition-colors">
                          terms and conditions
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="sticky top-6">
                  <div className="rounded-lg border p-6 space-y-4 bg-card shadow-sm">
                    <h2 className="text-xl font-semibold">Booking Summary</h2>

                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <img src={venue.image || "/placeholder.svg"} alt={venue.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">{venue.location}</p>
                      </div>
                    </div>

                    <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        <span>
                        {startDate && endDate
                            ? format(startDate, "PPP") === format(endDate, "PPP")
                                ? format(startDate, "PPP")
                                : `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`
                            : "Date not selected"}
                      </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-primary" />
                        <span>
                        {startDate && endDate
                            ? `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")} (${duration} hours)`
                            : "Time not selected"}
                      </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-primary" />
                        <span>{guests} guests</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span>Venue rental ({duration} hours)</span>
                        <span>${basePrice}</span>
                      </div>

                      {selectedServices.catering !== "none" && (
                          <div className="flex items-center justify-between">
                        <span>
                          Catering (
                          {selectedServices.catering === "basic"
                              ? "Basic"
                              : selectedServices.catering === "premium"
                                  ? "Premium"
                                  : "Custom"}
                          )
                        </span>
                            <span>
                          {selectedServices.catering === "custom"
                              ? "TBD"
                              : selectedServices.catering === "basic"
                                  ? `$${25 * guests}`
                                  : `$${45 * guests}`}
                        </span>
                          </div>
                      )}

                      {selectedServices.music !== "none" && (
                          <div className="flex items-center justify-between">
                        <span>
                          {selectedServices.music === "dj"
                              ? "DJ Services"
                              : selectedServices.music === "band"
                                  ? "Live Band"
                                  : "Custom Playlist"}
                        </span>
                            <span>
                          {selectedServices.music === "dj"
                              ? `$${150 * duration}`
                              : selectedServices.music === "band"
                                  ? `$${350 * duration}`
                                  : "$50"}
                        </span>
                          </div>
                      )}

                      {selectedServices.decor !== "none" && (
                          <div className="flex items-center justify-between">
                        <span>
                          {selectedServices.decor === "basic"
                              ? "Basic Decoration"
                              : selectedServices.decor === "premium"
                                  ? "Premium Decoration"
                                  : "Custom Decoration"}
                        </span>
                            <span>
                          {selectedServices.decor === "custom"
                              ? "TBD"
                              : selectedServices.decor === "basic"
                                  ? "$300"
                                  : "$800"}
                        </span>
                          </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span>Service fee</span>
                          <div className="relative ml-1 group">
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                              Service fee includes platform maintenance and customer support
                            </div>
                          </div>
                        </div>
                        <span>${serviceFee}</span>
                      </div>

                      <div className="flex items-center justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>

                    <Button className="w-full btn-primary" size="lg" asChild>
                      <Link to={`/venues/${venueId}/checkout`}>
                        Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      You won't be charged until you complete checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
