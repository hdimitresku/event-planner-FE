"use client"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, MapPin, Calendar, Users, ArrowRight, Star, ChevronRight } from 'lucide-react'
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <>
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-50 to-sky-50 dark:from-slate-900 dark:to-slate-800">
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-sky-200 dark:bg-sky-700 blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-emerald-200 dark:bg-emerald-700 blur-3xl"></div>
        </div>
        
        <div className="container relative px-4 md:px-6 z-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full">
                  <Star className="mr-1 h-3.5 w-3.5" />
                  <span>{t("hero.new") || "New and Improved Experience"}</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-gray-800 dark:text-gray-50">
                  {t("hero.title")}
                </h1>
                <p className="max-w-[600px] text-gray-600 dark:text-gray-300 text-lg md:text-xl">
                  {t("hero.subtitle")}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2 border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <Input
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                      placeholder={t("search.location")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                      <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        type="date"
                        placeholder={t("search.date")}
                      />
                    </div>
                    <div className="flex items-center gap-2 border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                      <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        type="number"
                        placeholder={t("search.guests")}
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                    <Search className="mr-2 h-4 w-4" /> {t("search.button")}
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-lg blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-sky-400/20 dark:bg-sky-400/10 rounded-lg blur-xl"></div>
              <img
                src="/placeholder.svg?height=600&width=800"
                width="550"
                height="550"
                alt="Featured venue"
                className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-xl border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 rounded-full mb-3">
              <span>{t("categories.explore") || "Explore Venues"}</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-800 dark:text-gray-50">
                {t("categories.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 md:text-xl/relaxed">{t("categories.subtitle")}</p>
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
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm border border-gray-100 dark:border-slate-700 group"
              >
                <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">{category.icon}</span>
                <span className="font-medium text-center text-gray-800 dark:text-gray-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-50 to-sky-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full mb-3">
              <span>{t("howItWorks.simple") || "Simple Process"}</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-800 dark:text-gray-50">
                {t("howItWorks.hero.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 md:text-xl/relaxed">{t("howItWorks.hero.subtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative">
              <div className="absolute -top-3 -left-3">
                <div className="bg-sky-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <div className="h-20 w-20 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-4">
                <Search className="h-8 w-8 text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">{t("howItWorks.step1.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t("howItWorks.step1.description")}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative">
              <div className="absolute -top-3 -left-3">
                <div className="bg-sky-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-4">
                <Calendar className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">{t("howItWorks.step2.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t("howItWorks.step2.description")}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative">
              <div className="absolute -top-3 -left-3">
                <div className="bg-sky-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <div className="h-20 w-20 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-4">
                <Star className="h-8 w-8 text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">{t("howItWorks.step3.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t("howItWorks.step3.description")}</p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white group" asChild>
              <Link to="/venues">
                {t("howItWorks.step1.cta")} 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 rounded-full mb-3">
              <span>{t("testimonials.title") || "What People Say"}</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-800 dark:text-gray-50">
                {t("testimonials.heading") || "Loved by event planners everywhere"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 md:text-xl/relaxed">
                {t("testimonials.subheading") || "See what our customers have to say about their experience"}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img 
                      src={`/placeholder.svg?height=48&width=48&text=User${i}`} 
                      alt="User" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {["Sarah Johnson", "Michael Chen", "Emma Rodriguez"][i-1]}
                    </h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  {[
                    "Finding the perfect venue for our company retreat was so easy with this platform. The booking process was seamless and the venue exceeded our expectations!",
                    "I planned my entire wedding using this site. The variety of venues and the detailed information made decision-making so much easier.",
                    "As an event planner, I rely on this platform for all my client events. The customer service is exceptional and the venues are always as described."
                  ][i-1]}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 group">
              {t("testimonials.readMore") || "Read more testimonials"}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
