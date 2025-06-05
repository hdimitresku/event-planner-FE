"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Utensils, Music, Palette, Camera, Video, Car, Shield, Users, ChevronRight } from 'lucide-react'
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function ServicesPage() {
  const { t } = useLanguage()

  const serviceCategories = [
    {
      title: t("services.catering.title") || "Catering",
      description: t("services.catering.description") || "Professional catering services for all event types",
      icon: <Utensils className="h-8 w-8" />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-100 to-red-50 dark:bg-orange-900/40",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: t("services.entertainment.title") || "Entertainment",
      description: t("services.entertainment.description") || "DJs, live music, and entertainment options",
      icon: <Music className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-100 to-pink-50 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: t("services.decoration.title") || "Decoration",
      description: t("services.decoration.description") || "Event styling and decoration services",
      icon: <Palette className="h-8 w-8" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-100 to-teal-50 dark:bg-emerald-900/40",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: t("services.photography.title") || "Photography",
      description: t("services.photography.description") || "Professional event photography",
      icon: <Camera className="h-8 w-8" />,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-blue-100 to-indigo-50 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: t("services.videography.title") || "Videography",
      description: t("services.videography.description") || "High-quality video production services",
      icon: <Video className="h-8 w-8" />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-100 to-purple-50 dark:bg-violet-900/40",
      iconColor: "text-violet-600 dark:text-violet-400"
    },
    {
      title: t("services.transportation.title") || "Transportation",
      description: t("services.transportation.description") || "Luxury transportation options",
      icon: <Car className="h-8 w-8" />,
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gradient-to-br from-gray-100 to-slate-50 dark:bg-gray-900/40",
      iconColor: "text-gray-600 dark:text-gray-400"
    },
    {
      title: t("services.security.title") || "Security",
      description: t("services.security.description") || "Professional security personnel",
      icon: <Shield className="h-8 w-8" />,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-red-100 to-rose-50 dark:bg-red-900/40",
      iconColor: "text-red-600 dark:text-red-400"
    },
    {
      title: t("services.staffing.title") || "Event Staffing",
      description: t("services.staffing.description") || "Professional event staff and coordinators",
      icon: <Users className="h-8 w-8" />,
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-gradient-to-br from-amber-100 to-yellow-50 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-400"
    }
  ]

  return (
    <>
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-100 via-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
        {/* Enhanced abstract background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 dark:bg-sky-700 blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-300 to-emerald-400 dark:bg-emerald-700 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-violet-200 to-purple-300 dark:bg-purple-700 blur-2xl opacity-60"></div>
        </div>
        
        {/* Subtle texture overlay for light mode */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-400 bg-gradient-to-r from-sky-100 to-sky-50 dark:bg-sky-900/40 rounded-full mb-3 border border-sky-200/60 dark:border-sky-700/50">
              <span>{t("services.badge") || "Professional Services"}</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-gray-50">
                {t("services.hero.title")}
              </h1>
              <p className="max-w-[900px] text-gray-700 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("services.hero.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/80 dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:bg-emerald-900/40 rounded-full mb-3 border border-emerald-200/60 dark:border-emerald-700/50">
              <span>{t("services.categories.badge") || "Service Categories"}</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900 dark:text-gray-50">
                {t("services.categories.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 md:text-xl/relaxed">{t("services.categories.description")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Link
                to={`/services/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                key={index}
                className="group"
              >
                <Card className="h-full bg-white/95 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 shadow-lg hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className={`h-16 w-16 rounded-xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <div className={category.iconColor}>
                        {category.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">{category.description}</p>
                    <div className="mt-4 flex items-center text-sky-600 dark:text-sky-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      <span>Learn More</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-100 via-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 relative">
        {/* Subtle background pattern for light mode */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-0 bg-[linear-gradient(45deg,_transparent_35%,_rgba(0,0,0,0.05)_35%,_rgba(0,0,0,0.05)_65%,_transparent_65%)] bg-[length:20px_20px]"></div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:bg-emerald-900/40 rounded-full mb-3 border border-emerald-200/60 dark:border-emerald-700/50">
              <span>{t("services.additional.badge") || "More Options"}</span>
            </div>
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900 dark:text-gray-50">
                {t("services.additional.title")}
              </h2>
              <p className="max-w-[900px] text-gray-700 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("services.additional.description")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Card className="bg-white/95 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 shadow-md hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t("services.additional.photography")}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {t("services.additional.photography") || "Professional event photography services"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 shadow-md hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t("services.additional.videography")}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {t("services.additional.videography") || "High-quality video production"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 shadow-md hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t("services.additional.transportation")}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {t("services.additional.transportation") || "Luxury transportation options"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 shadow-md hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t("services.additional.security")}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {t("services.additional.security") || "Professional security personnel"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 dark:bg-slate-800 border border-gray-200/80 dark:border-slate-700 shadow-md hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-black/20 transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t("services.additional.staffing")}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {t("services.additional.staffing") || "Event staff and coordinators"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-sky-100 to-emerald-100 dark:bg-slate-700/30 relative">
        {/* Subtle background pattern for light mode */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.1)_1px,_transparent_0)] bg-[length:30px_30px]"></div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900 dark:text-gray-50">
                {t("services.cta.title")}
              </h2>
              <p className="max-w-[900px] text-gray-800 dark:text-gray-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("services.cta.description") || "Ready to create an unforgettable event? Browse our venues and start planning today."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200" asChild>
                <Link to="/venues">
                  Browse Venues
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 shadow-sm hover:shadow-md transition-all duration-200">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
