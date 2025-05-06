"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Utensils, Music, Palette, Camera, Video, Car, Shield, Users, ArrowRight, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export default function ServicesPage() {
  const { t } = useLanguage()

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F7F3ED]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-[#1E2D3B]">
                {t("services.hero.title")}
              </h1>
              <p className="max-w-[900px] text-[#3D3D3D] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("services.hero.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12">
            {/* Catering Services */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <Utensils className="h-6 w-6 text-[#D72638]" />
                  <h2 className="text-3xl font-bold tracking-tighter text-[#1E2D3B]">{t("services.catering.title")}</h2>
                </div>
                <p className="text-[#3D3D3D] md:text-lg">{t("services.catering.description")}</p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.catering.option1")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.catering.option1.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.catering.option2")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.catering.option2.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.catering.option3")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.catering.option3.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img
                  src="/placeholder.svg?height=600&width=800&text=Catering Services"
                  alt="Catering Services"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Music & Entertainment */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="relative aspect-video overflow-hidden rounded-xl order-last lg:order-first">
                <img
                  src="/placeholder.svg?height=600&width=800&text=Music Services"
                  alt="Music Services"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <Music className="h-6 w-6 text-[#D72638]" />
                  <h2 className="text-3xl font-bold tracking-tighter text-[#1E2D3B]">{t("services.music.title")}</h2>
                </div>
                <p className="text-[#3D3D3D] md:text-lg">{t("services.music.description")}</p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.music.option1")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.music.option1.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.music.option2")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.music.option2.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.music.option3")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.music.option3.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decoration Services */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2">
                  <Palette className="h-6 w-6 text-[#D72638]" />
                  <h2 className="text-3xl font-bold tracking-tighter text-[#1E2D3B]">{t("services.decor.title")}</h2>
                </div>
                <p className="text-[#3D3D3D] md:text-lg">{t("services.decor.description")}</p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.decor.option1")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.decor.option1.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.decor.option2")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.decor.option2.description")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-[#1ABC9C] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[#1E2D3B]">{t("services.decor.option3")}</h3>
                      <p className="text-sm text-[#3D3D3D]">{t("services.decor.option3.description")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img
                  src="/placeholder.svg?height=600&width=800&text=Decoration Services"
                  alt="Decoration Services"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F7F3ED]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-[#1E2D3B]">
                {t("services.additional.title")}
              </h2>
              <p className="max-w-[900px] text-[#3D3D3D] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("services.additional.description")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Camera className="h-12 w-12 text-[#F4B400] mb-4" />
                <h3 className="font-semibold text-[#1E2D3B]">{t("services.additional.photography")}</h3>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Video className="h-12 w-12 text-[#F4B400] mb-4" />
                <h3 className="font-semibold text-[#1E2D3B]">{t("services.additional.videography")}</h3>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Car className="h-12 w-12 text-[#F4B400] mb-4" />
                <h3 className="font-semibold text-[#1E2D3B]">{t("services.additional.transportation")}</h3>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Shield className="h-12 w-12 text-[#F4B400] mb-4" />
                <h3 className="font-semibold text-[#1E2D3B]">{t("services.additional.security")}</h3>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-[#F4B400] mb-4" />
                <h3 className="font-semibold text-[#1E2D3B]">{t("services.additional.staffing")}</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-[#1E2D3B]">
                {t("services.cta.title")}
              </h2>
            </div>
            <Button size="lg" className="bg-[#D72638] hover:bg-[#D72638]/90 mt-4" asChild>
              <Link to="/venues">
                {t("services.cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
