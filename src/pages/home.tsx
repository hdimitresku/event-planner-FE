"use client"

import type React from "react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, MapPin, Calendar, Users, ArrowRight, Star, ChevronRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguage } from "../context/language-context"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    location: "",
    guests: "",
  })
  const [date, setDate] = useState<Date>()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    const searchParams = new URLSearchParams()

    if (searchData.location) {
      searchParams.set("location", searchData.location)
    }

    if (date) {
      searchParams.set("date", format(date, "yyyy-MM-dd"))
    }

    if (searchData.guests) {
      searchParams.set("guests", searchData.guests)
    }

    navigate(`/venues?${searchParams.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-primary/5"></div>

        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-accent/20 blur-2xl"></div>
        </div>

        <div className="container relative px-4 md:px-6 z-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_550px] items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full">
                  <Star className="mr-2 h-3.5 w-3.5" />
                  <span>{t("hero.new") || "New and Improved Experience"}</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none text-foreground">
                  {t("hero.title") || "Find Your Perfect Event Space"}
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-xl md:text-2xl leading-relaxed">
                  {t("hero.subtitle") ||
                    "Discover and book unique venues for unforgettable events with our seamless platform."}
                </p>
              </div>

              {/* Search Card */}
              <div className="bg-card rounded-2xl p-8 shadow-large border border-border">
                <div className="grid gap-6">
                  <div className="form-input flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <Input
                      name="location"
                      value={searchData.location}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg"
                      placeholder={t("search.location") || "Where is your event?"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-input flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal p-0 h-auto border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-lg",
                              !date && "text-muted-foreground",
                            )}
                          >
                            {date ? format(date, "MMM dd, yyyy") : <span>{t("search.date") || "Event date"}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="rounded-md border"
                            weekStartsOn={0}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="form-input flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <Input
                        name="guests"
                        value={searchData.guests}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        placeholder={t("search.guests") || "Guest count"}
                      />
                    </div>
                  </div>
                  <Button className="w-full btn-primary h-12 text-lg font-medium" onClick={handleSearch}>
                    <Search className="mr-2 h-5 w-5" /> {t("search.button") || "Search Venues"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative fade-in">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-2xl blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl blur-xl"></div>
              <img
                src="/hero.png?height=600&width=800"
                width="550"
                height="550"
                alt="Featured venue"
                className="relative mx-auto aspect-video overflow-hidden rounded-2xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-large border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-secondary bg-secondary/10 rounded-full">
              <span>{t("categories.explore") || "Explore Venues"}</span>
            </div>
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground">
                {t("categories.title") || "Every Event Type Covered"}
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {t("categories.subtitle") ||
                  "From intimate gatherings to grand celebrations, find the perfect space for any occasion."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { name: "Meeting Rooms", icon: "🏢", color: "primary" },
              { name: "Party Venues", icon: "🎉", color: "secondary" },
              { name: "Photography Studios", icon: "📸", color: "accent" },
              { name: "Wedding Venues", icon: "💍", color: "primary" },
              { name: "Outdoor Spaces", icon: "🌳", color: "secondary" },
              { name: "Restaurants", icon: "🍽️", color: "accent" },
              { name: "Lofts & Penthouses", icon: "🏙️", color: "primary" },
              { name: "Unique Spaces", icon: "🎨", color: "secondary" },
            ].map((category, index) => (
              <Link
                to={`/venues?category=${category.name.toLowerCase().replace(" ", "-")}`}
                key={category.name}
                className="flex flex-col items-center justify-center p-8 bg-card rounded-2xl hover:bg-card/80 transition-all duration-300 shadow-soft border border-border group card-hover"
              >
                <span className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <span className="font-medium text-center text-card-foreground group-hover:text-primary transition-colors text-lg">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-br from-muted/30 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-accent bg-accent/10 rounded-full">
              <span>{t("howItWorks.simple") || "Simple Process"}</span>
            </div>
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground">
                {t("howItWorks.hero.title") || "How It Works"}
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {t("howItWorks.hero.subtitle") || "Book your perfect venue in three simple steps."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                step: 1,
                icon: Search,
                title: t("howItWorks.step1.title") || "Search & Discover",
                description: t("howItWorks.step1.description") || "Browse our curated collection of unique venues.",
                color: "primary",
              },
              {
                step: 2,
                icon: Calendar,
                title: t("howItWorks.step2.title") || "Compare & Select",
                description: t("howItWorks.step2.description") || "Compare options and choose your perfect space.",
                color: "secondary",
              },
              {
                step: 3,
                icon: Star,
                title: t("howItWorks.step3.title") || "Book & Celebrate",
                description: t("howItWorks.step3.description") || "Secure your booking and enjoy your event.",
                color: "accent",
              },
            ].map((step, index) => (
              <div
                key={step.step}
                className="flex flex-col items-center text-center space-y-6 p-8 bg-card rounded-2xl shadow-medium border border-border relative fade-in"
              >
                <div className="absolute -top-4 -left-4">
                  <div className="bg-primary text-primary-foreground rounded-2xl w-14 h-14 flex items-center justify-center text-xl font-bold shadow-medium">
                    {step.step}
                  </div>
                </div>
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mt-6">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <Button size="lg" className="btn-primary group h-14 px-8 text-lg" asChild>
              <Link to="/venues">
                {t("howItWorks.step1.cta") || "Start Exploring"}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full">
              <span>{t("testimonials.title") || "What People Say"}</span>
            </div>
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground">
                {t("testimonials.heading") || "Loved by Event Planners"}
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {t("testimonials.subheading") || "See what our customers have to say about their experience"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                text: "Finding the perfect venue for our company retreat was so easy with this platform. The booking process was seamless and the venue exceeded our expectations!",
              },
              {
                name: "Michael Chen",
                rating: 5,
                text: "I planned my entire wedding using this site. The variety of venues and the detailed information made decision-making so much easier.",
              },
              {
                name: "Emma Rodriguez",
                rating: 5,
                text: "As an event planner, I rely on this platform for all my client events. The customer service is exceptional and the venues are always as described.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl shadow-medium border border-border card-hover">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=56&width=56&text=${testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}`}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground text-lg">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 group h-12 px-6">
              {t("testimonials.readMore") || "Read more testimonials"}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
