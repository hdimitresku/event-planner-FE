"use client"

import { Button } from "../components/ui/button"
import { Search, Eye, Palette, CreditCard, PartyPopper, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"

export default function HowItWorksPage() {
  const { t } = useLanguage()

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F7F3ED]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-[#1E2D3B]">
                {t("howItWorks.hero.title")}
              </h1>
              <p className="max-w-[900px] text-[#3D3D3D] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("howItWorks.hero.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-16">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center mb-4">
                  <div className="bg-[#D72638] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E2D3B]">{t("howItWorks.step1.title")}</h3>
                </div>
                <p className="text-[#3D3D3D] text-lg mb-4">{t("howItWorks.step1.description")}</p>
                <Button
                  variant="outline"
                  className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
                  asChild
                >
                  <Link to="/venues">{t("howItWorks.step1.cta")}</Link>
                </Button>
              </div>
              <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Search+Venues"
                  alt="Search for venues"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Explore+Venues"
                  alt="Explore venues"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-[#D72638] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E2D3B]">{t("howItWorks.step2.title")}</h3>
                </div>
                <p className="text-[#3D3D3D] text-lg mb-4">{t("howItWorks.step2.description")}</p>
                <Button
                  variant="outline"
                  className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
                  asChild
                >
                  <Link to="/venues">{t("howItWorks.step2.cta")}</Link>
                </Button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center mb-4">
                  <div className="bg-[#D72638] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    <Palette className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E2D3B]">{t("howItWorks.step3.title")}</h3>
                </div>
                <p className="text-[#3D3D3D] text-lg mb-4">{t("howItWorks.step3.description")}</p>
                <Button
                  variant="outline"
                  className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
                  asChild
                >
                  <Link to="/venues">{t("howItWorks.step3.cta")}</Link>
                </Button>
              </div>
              <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Customize+Event"
                  alt="Customize your event"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Book+and+Pay"
                  alt="Book and pay"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-[#D72638] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E2D3B]">{t("howItWorks.step4.title")}</h3>
                </div>
                <p className="text-[#3D3D3D] text-lg mb-4">{t("howItWorks.step4.description")}</p>
                <Button
                  variant="outline"
                  className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
                  asChild
                >
                  <Link to="/venues">{t("howItWorks.step4.cta")}</Link>
                </Button>
              </div>
            </div>

            {/* Step 5 */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center mb-4">
                  <div className="bg-[#D72638] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    <PartyPopper className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E2D3B]">{t("howItWorks.step5.title")}</h3>
                </div>
                <p className="text-[#3D3D3D] text-lg mb-4">{t("howItWorks.step5.description")}</p>
                <Button
                  variant="outline"
                  className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
                  asChild
                >
                  <Link to="/venues">{t("howItWorks.step5.cta")}</Link>
                </Button>
              </div>
              <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Enjoy+Your+Event"
                  alt="Enjoy your event"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F7F3ED]">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
              <img
                src="/placeholder.svg?height=600&width=800&text=Booking+Process+Demo"
                alt="How VenueSpace Works"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter text-[#1E2D3B]">{t("howItWorks.faq.title")}</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-[#1E2D3B] font-medium">{t("howItWorks.faq.q1")}</AccordionTrigger>
                  <AccordionContent className="text-[#3D3D3D]">{t("howItWorks.faq.a1")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-[#1E2D3B] font-medium">{t("howItWorks.faq.q2")}</AccordionTrigger>
                  <AccordionContent className="text-[#3D3D3D]">{t("howItWorks.faq.a2")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-[#1E2D3B] font-medium">{t("howItWorks.faq.q3")}</AccordionTrigger>
                  <AccordionContent className="text-[#3D3D3D]">{t("howItWorks.faq.a3")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-[#1E2D3B] font-medium">{t("howItWorks.faq.q4")}</AccordionTrigger>
                  <AccordionContent className="text-[#3D3D3D]">{t("howItWorks.faq.a4")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-[#1E2D3B] font-medium">{t("howItWorks.faq.q5")}</AccordionTrigger>
                  <AccordionContent className="text-[#3D3D3D]">{t("howItWorks.faq.a5")}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-[#1E2D3B]">
                {t("howItWorks.cta.title")}
              </h2>
            </div>
            <Button size="lg" className="bg-[#D72638] hover:bg-[#D72638]/90 mt-4" asChild>
              <Link to="/venues">
                {t("howItWorks.cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
