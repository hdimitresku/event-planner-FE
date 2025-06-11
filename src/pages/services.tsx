"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Utensils, Music, Palette, Camera, Video, Car, Shield, Users, ArrowRight, Check, ChevronRight, Layers } from 'lucide-react'
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function ServicesPage() {
  const { t } = useLanguage()

  return (
    <div className="relative min-h-screen bg-background">
      {/* Beautiful background styling */}
      <div className="fixed inset-0 overflow-hidden opacity-40 dark:opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 dark:bg-sky-700 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-300 to-emerald-400 dark:bg-emerald-700 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-violet-200 to-purple-300 dark:bg-purple-700 blur-2xl opacity-60"></div>
      </div>

      {/* Subtle texture overlay for light mode */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10">
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-100 via-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full mb-2">
                <Layers className="h-7 w-7 mr-1" />
              </div>
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-50">
                  {t("services.hero.title")}
                </h1>
                <p className="max-w-[900px] text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("services.hero.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-16">
              {/* Catering Services */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full">
                      <Utensils className="h-5 w-5 mr-1" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">
                      {t("services.catering.title")}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 md:text-lg">
                    {t("services.catering.description")}
                  </p>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.catering.option1")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.catering.option1.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.catering.option2")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.catering.option2.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.catering.option3")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.catering.option3.description")}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="venue-card relative aspect-video overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700">
                  <img
                    src="/placeholder.svg?height=600&width=800&text=Catering Services"
                    alt="Catering Services"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                    {t("business.categories.catering") || "Premium Catering"}
                  </div>
                </div>
              </div>

              {/* Music & Entertainment */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="venue-card relative aspect-video overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700 order-last lg:order-first">
                  <img
                    src="/placeholder.svg?height=600&width=800&text=Music Services"
                    alt="Music Services"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                    {t("business.categories.music") || "Live Entertainment"}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full">
                      <Music className="h-5 w-5 mr-1" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">
                      {t("services.music.title")}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 md:text-lg">
                    {t("services.music.description")}
                  </p>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.music.option1")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.music.option1.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.music.option2")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.music.option2.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.music.option3")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.music.option3.description")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decoration Services */}
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full">
                      <Palette className="h-5 w-5 mr-1" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">
                      {t("services.decor.title")}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 md:text-lg">
                    {t("services.decor.description")}
                  </p>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.decor.option1")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.decor.option1.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.decor.option2")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.decor.option2.description")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.decor.option3")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.decor.option3.description")}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="venue-card relative aspect-video overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700">
                  <img
                    src="/placeholder.svg?height=600&width=800&text=Decoration Services"
                    alt="Decoration Services"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                    {t("business.categories.decoration") || "Custom Decor"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full mb-2">
                <span>{t("services.additional.badge") || "More Options"}</span>
              </div>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-800 dark:text-gray-50">
                  {t("services.additional.title")}
                </h2>
                <p className="max-w-[900px] text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("services.additional.description")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <Card className="venue-card bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.photography")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {t("services.additional.photography") || "Professional event photography services"}
                  </p>
                </CardContent>
              </Card>
              <Card className="venue-card bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                    <Video className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.videography")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {t("services.additional.videography") || "High-quality video production"}
                  </p>
                </CardContent>
              </Card>
              <Card className="venue-card bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                    <Car className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.transportation")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {t("services.additional.transportation") || "Luxury transportation options"}
                  </p>
                </CardContent>
              </Card>
              <Card className="venue-card bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.security")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {t("services.additional.security") || "Professional security personnel"}
                  </p>
                </CardContent>
              </Card>
              <Card className="venue-card bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-sky-500 dark:text-sky-400" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.staffing")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {t("services.additional.staffing") || "Event staff and coordinators"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-800 dark:text-gray-50">
                  {t("services.cta.title")}
                </h2>
                <p className="max-w-[900px] text-gray-800 dark:text-gray-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("services.cta.description") || "Ready to create an unforgettable event? Browse our venues and start planning today."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">

              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
