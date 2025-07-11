"use client"
import { Search, Eye, Palette, CreditCard, PartyPopper } from "lucide-react"
import { useLanguage } from "../context/language-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { useState } from "react"

export default function HowItWorksPage() {
  const { t } = useLanguage()
  const [activeFaq, setActiveFaq] = useState<string>("item-1")

  const faqImages = [
    {
      id: "item-1",
      image: "/placeholder.svg?height=600&width=800&text=FAQ+1",
      alt: "FAQ Question 1",
    },
    {
      id: "item-2",
      image: "/placeholder.svg?height=600&width=800&text=FAQ+2",
      alt: "FAQ Question 2",
    },
    {
      id: "item-3",
      image: "/placeholder.svg?height=600&width=800&text=FAQ+3",
      alt: "FAQ Question 3",
    },
    {
      id: "item-4",
      image: "/placeholder.svg?height=600&width=800&text=FAQ+4",
      alt: "FAQ Question 4",
    },
    {
      id: "item-5",
      image: "/placeholder.svg?height=600&width=800&text=FAQ+5",
      alt: "FAQ Question 5",
    },
  ]

  const handleAccordionChange = (value: string) => {
    setActiveFaq(value)
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Beautiful background styling */}
      <div className="fixed inset-0 overflow-hidden opacity-40 dark:opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 dark:bg-amber-700 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-300 to-emerald-400 dark:bg-emerald-700 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-violet-200 to-purple-300 dark:bg-purple-700 blur-2xl opacity-60"></div>
      </div>

      {/* Subtle texture overlay for light mode */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10">
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-2">
                <span>{t("howItWorks.badge") || "Simple Process"}</span>
              </div>
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-50">
                  {t("howItWorks.hero.title")}
                </h1>
                <p className="max-w-[900px] text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("howItWorks.hero.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col space-y-16">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 space-y-6">
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-2">
                    <span>Step 1</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4 shadow-sm">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                      {t("howItWorks.step1.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{t("howItWorks.step1.description")}</p>
                </div>
                <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Search+Venues"
                      alt="Search for venues"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                      {t("howItWorks.step1.tag") || "Find Your Space"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Explore+Venues"
                      alt="Explore venues"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                      {t("howItWorks.step2.tag") || "Explore Options"}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-2">
                    <span>Step 2</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4 shadow-sm">
                      <Eye className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                      {t("howItWorks.step2.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{t("howItWorks.step2.description")}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 space-y-6">
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-2">
                    <span>Step 3</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4 shadow-sm">
                      <Palette className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                      {t("howItWorks.step3.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{t("howItWorks.step3.description")}</p>
                </div>
                <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Customize+Event"
                      alt="Customize your event"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                      {t("howItWorks.step3.tag") || "Personalize"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Book+and+Pay"
                      alt="Book and pay"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                      {t("howItWorks.step4.tag") || "Secure Booking"}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-2">
                    <span>Step 4</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4 shadow-sm">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                      {t("howItWorks.step4.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{t("howItWorks.step4.description")}</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 space-y-6">
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-2">
                    <span>Step 5</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4 shadow-sm">
                      <PartyPopper className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
                      {t("howItWorks.step5.title")}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{t("howItWorks.step5.description")}</p>
                </div>
                <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Enjoy+Your+Event"
                      alt="Enjoy your event"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                      {t("howItWorks.step5.tag") || "Celebrate"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-amber-200 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                {faqImages.map((item) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      activeFaq === item.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img src={item.image || "/placeholder.svg"} alt={item.alt} className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 rounded-lg px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-50 shadow-sm">
                      {t("howItWorks.faq.videoTag") || "Watch Demo"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded-full mb-2">
                  <span>{t("howItWorks.faq.badge") || "Common Questions"}</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-gray-800 dark:text-gray-50">
                  {t("howItWorks.faq.title")}
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  value={activeFaq}
                  onValueChange={handleAccordionChange}
                >
                  <AccordionItem value="item-1" className="border-b border-gray-200 dark:border-gray-700">
                    <AccordionTrigger className="text-gray-800 dark:text-gray-50 font-medium hover:text-amber-500 dark:hover:text-amber-400">
                      {t("howItWorks.faq.q1")}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {t("howItWorks.faq.a1")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b border-gray-200 dark:border-gray-700">
                    <AccordionTrigger className="text-gray-800 dark:text-gray-50 font-medium hover:text-amber-500 dark:hover:text-amber-400">
                      {t("howItWorks.faq.q2")}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {t("howItWorks.faq.a2")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b border-gray-200 dark:border-gray-700">
                    <AccordionTrigger className="text-gray-800 dark:text-gray-50 font-medium hover:text-amber-500 dark:hover:text-amber-400">
                      {t("howItWorks.faq.q3")}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {t("howItWorks.faq.a3")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-b border-gray-200 dark:border-gray-700">
                    <AccordionTrigger className="text-gray-800 dark:text-gray-50 font-medium hover:text-amber-500 dark:hover:text-amber-400">
                      {t("howItWorks.faq.q4")}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {t("howItWorks.faq.a4")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5" className="border-b border-gray-200 dark:border-gray-700">
                    <AccordionTrigger className="text-gray-800 dark:text-gray-50 font-medium hover:text-amber-500 dark:hover:text-amber-400">
                      {t("howItWorks.faq.q5")}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {t("howItWorks.faq.a5")}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 lg:py-32 bg-amber-200 dark:bg-slate-700/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-800 dark:text-gray-50">
                  {t("howItWorks.cta.title")}
                </h2>
                <p className="max-w-[900px] text-gray-800 dark:text-gray-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("howItWorks.cta.description") ||
                    "Ready to find the perfect venue for your next event? Start browsing now."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
