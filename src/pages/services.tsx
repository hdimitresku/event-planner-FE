"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Utensils, Music, Palette, Camera, Video, Car, Shield, Users, ArrowRight, Check, ChevronRight, Layers } from 'lucide-react'
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function ServicesPage() {
  const { t } = useLanguage()

  return (
    <>
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800">
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
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.catering.option1")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.catering.option1.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.catering.option2")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.catering.option2.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.catering.option3")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.catering.option3.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
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
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 order-last lg:order-first">
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
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.music.option1")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.music.option1.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.music.option2")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.music.option2.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
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
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.decor.option1")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.decor.option1.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.decor.option2")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.decor.option2.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.decor.option3")}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t("services.decor.option3.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
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

      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-sky-50 dark:from-slate-800 dark:to-slate-900">
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
            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.photography")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {t("services.additional.photography.description") || "Professional event photography services"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.videography")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {t("services.additional.videography.description") || "High-quality video production"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.transportation")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {t("services.additional.transportation.description") || "Luxury transportation options"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.security")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {t("services.additional.security.description") || "Professional security personnel"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-50">{t("services.additional.staffing")}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {t("services.additional.staffing.description") || "Event staff and coordinators"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 lg:py-32 bg-sky-500 dark:bg-sky-600">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
                {t("services.cta.title")}
              </h2>
              <p className="max-w-[900px] text-sky-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("services.cta.description") || "Ready to create an unforgettable event? Browse our venues and start planning today."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
