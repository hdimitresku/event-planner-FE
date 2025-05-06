"use client"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <>
      <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                  {t("hero.title")}
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">{t("hero.subtitle")}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-soft">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2 border rounded-md p-3 bg-background">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                      placeholder={t("search.location")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 border rounded-md p-3 bg-background">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        type="date"
                        placeholder={t("search.date")}
                      />
                    </div>
                    <div className="flex items-center gap-2 border rounded-md p-3 bg-background">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                        type="number"
                        placeholder={t("search.guests")}
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                    <Search className="mr-2 h-4 w-4" /> {t("search.button")}
                  </Button>
                </div>
              </div>
            </div>
            <img
              src="/placeholder.svg?height=600&width=800"
              width="550"
              height="550"
              alt="Featured venue"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-medium"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
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
                className="flex flex-col items-center justify-center p-6 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors card-hover"
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <span className="font-medium text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-foreground">
                {t("howItWorks.hero.title")}
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed">{t("howItWorks.hero.subtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-soft">
              <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("howItWorks.step1.title")}</h3>
              <p className="text-muted-foreground">{t("howItWorks.step1.description")}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-soft">
              <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("howItWorks.step2.title")}</h3>
              <p className="text-muted-foreground">{t("howItWorks.step2.description")}</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-soft">
              <div className="bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground">{t("howItWorks.step3.title")}</h3>
              <p className="text-muted-foreground">{t("howItWorks.step3.description")}</p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white" asChild>
              <Link to="/venues">
                {t("howItWorks.step1.cta")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
