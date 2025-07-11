"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, MapPin, Calendar, Users, ArrowRight, Star, ChevronRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function HomePage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState({
    search: "",
    location: "",
    date: "",
    guests: "",
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams()

    if (searchParams.search) queryParams.append("search", searchParams.search)
    if (searchParams.location) queryParams.append("location", searchParams.location)
    if (searchParams.date) queryParams.append("date", searchParams.date)
    if (searchParams.guests) queryParams.append("guests", searchParams.guests)

    navigate(`/venues?${queryParams.toString()}`)
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Beautiful background styling with warm earth tones */}
      <div className="fixed inset-0 overflow-hidden opacity-40 dark:opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 to-secondary/40 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-accent/30 to-primary/40 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-secondary/20 to-accent/30 blur-2xl opacity-60"></div>
      </div>

      {/* Subtle texture overlay for light mode */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
                    <Star className="mr-1 h-3.5 w-3.5 text-primary" />
                    <span>{t("hero.new") || "New and Improved Experience"}</span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-foreground">
                    {t("hero.title")}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">{t("hero.subtitle")}</p>
                </div>
                <form
                  onSubmit={handleSearch}
                  className="bg-card rounded-xl p-6 shadow-xl border border-border backdrop-blur-sm"
                >
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2 border border-border rounded-md p-3 bg-muted/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                      <Search className="h-5 w-5 text-muted-foreground" />
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground"
                        placeholder={t("search.venueName") || "Search by venue name..."}
                        value={searchParams.search}
                        onChange={(e) => setSearchParams((prev) => ({ ...prev, search: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-2 border border-border rounded-md p-3 bg-muted/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground"
                        placeholder={t("search.location")}
                        value={searchParams.location}
                        onChange={(e) => setSearchParams((prev) => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 border border-border rounded-md p-3 bg-muted/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <Input
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground"
                          type="date"
                          placeholder={t("search.date")}
                          value={searchParams.date}
                          onChange={(e) => setSearchParams((prev) => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center gap-2 border border-border rounded-md p-3 bg-muted/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <Input
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-foreground"
                          type="number"
                          placeholder={t("search.guests")}
                          value={searchParams.guests}
                          onChange={(e) => setSearchParams((prev) => ({ ...prev, guests: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
                    >
                      <Search className="mr-2 h-4 w-4" /> {t("search.button")}
                    </Button>
                  </div>
                </form>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-accent/30 to-secondary/20 rounded-lg blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-tl from-primary/30 to-accent/20 rounded-lg blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-xl"></div>
                <img
                  src="/hero.png?height=600&width=800"
                  width="550"
                  height="550"
                  alt="Featured venue"
                  className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-2xl border border-border"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-secondary bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-full mb-3 border border-secondary/20">
                <span>{t("categories.explore") || "Explore Venues"}</span>
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
                  {t("categories.title")}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed">{t("categories.subtitle")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { name: "Meeting Rooms", icon: "🏢" },
                { name: "Party Venues", icon: "🎉" },
                { name: "Photography Studios", icon: "📸" },
                { name: "Wedding Venues", icon: "💍" },
                { name: "Outdoor Spaces", icon: "🌳" },
                { name: "Restaurants", icon: "🍽️" },
                { name: "Lofts & Penthouses", icon: "🏙️" },
                { name: "Unique Spaces", icon: "🎨" },
              ].map((category) => (
                <Link
                  to={`/venues?category=${category.name.toLowerCase().replace(" ", "-")}`}
                  key={category.name}
                  className="flex flex-col items-center justify-center p-6 bg-card rounded-xl hover:bg-card/80 transition-all duration-200 shadow-md border border-border group hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                    {category.icon}
                  </span>
                  <span className="font-medium text-center text-card-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-muted/30 via-accent/5 to-secondary/5 relative">
          {/* Subtle background pattern for light mode */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-0 bg-[linear-gradient(45deg,_transparent_35%,_rgba(0,0,0,0.05)_35%,_rgba(0,0,0,0.05)_65%,_transparent_65%)] bg-[length:20px_20px]"></div>

          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary bg-gradient-to-r from-primary/10 to-primary/5 rounded-full mb-3 border border-primary/20">
                <span>{t("howItWorks.simple") || "Simple Process"}</span>
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
                  {t("howItWorks.hero.title")}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed">{t("howItWorks.hero.subtitle")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-xl shadow-lg border border-border relative backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:-translate-y-1">
                <div className="absolute -top-3 -left-3">
                  <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/30">
                    1
                  </div>
                </div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mt-4 group-hover:scale-105 transition-transform duration-200">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("howItWorks.step1.title")}</h3>
                <p className="text-muted-foreground">{t("howItWorks.step1.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-xl shadow-lg border border-border relative backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:-translate-y-1">
                <div className="absolute -top-3 -left-3">
                  <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/30">
                    2
                  </div>
                </div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center mt-4 group-hover:scale-105 transition-transform duration-200">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("howItWorks.step2.title")}</h3>
                <p className="text-muted-foreground">{t("howItWorks.step2.description")}</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-xl shadow-lg border border-border relative backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:-translate-y-1">
                <div className="absolute -top-3 -left-3">
                  <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/30">
                    3
                  </div>
                </div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mt-4 group-hover:scale-105 transition-transform duration-200">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("howItWorks.step3.title")}</h3>
                <p className="text-muted-foreground">{t("howItWorks.step3.description")}</p>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                asChild
              >
                <Link to="/venues">
                  {t("howItWorks.step1.cta")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-accent bg-gradient-to-r from-accent/10 to-accent/5 rounded-full mb-3 border border-accent/20">
                <span>{t("testimonials.title") || "What People Say"}</span>
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
                  {t("testimonials.heading") || "Loved by event planners everywhere"}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  {t("testimonials.subheading") || "See what our customers have to say about their experience"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card p-6 rounded-xl shadow-lg border border-border backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 overflow-hidden ring-2 ring-border">
                      <img
                        src={`/placeholder.svg?height=48&width=48&text=User${i}`}
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {["Sarah Johnson", "Michael Chen", "Emma Rodriguez"][i - 1]}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic group-hover:text-foreground/80 transition-colors">
                    {
                      [
                        "Finding the perfect venue for our company retreat was so easy with this platform. The booking process was seamless and the venue exceeded our expectations!",
                        "I planned my entire wedding using this site. The variety of venues and the detailed information made decision-making so much easier.",
                        "As an event planner, I rely on this platform for all my client events. The customer service is exceptional and the venues are always as described.",
                      ][i - 1]
                    }
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 group shadow-sm hover:shadow-md transition-all duration-200 bg-transparent"
              >
                {t("testimonials.readMore") || "Read more testimonials"}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
