"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import {
  Search,
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  Calendar,
  CreditCard,
  User,
  Building,
  Plus,
  Minus,
} from "lucide-react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"

export default function HelpPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      question: t("help.faqTitle1"),
      answer: t("help.faqAnswer1"),
      category: "bookings",
    },
    {
      id: 2,
      question: t("help.faqTitle2"),
      answer: t("help.faqAnswer2"),
      category: "bookings",
    },
    {
      id: 3,
      question: t("help.faqTitle3"),
      answer: t("help.faqAnswer3"),
      category: "venues",
    },
    {
      id: 4,
      question: t("help.faqTitle4"),
      answer: t("help.faqAnswer4"),
      category: "bookings",
    },
    {
      id: 5,
      question: t("help.faqTitle5"),
      answer: t("help.faqAnswer5"),
      category: "payments",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Toggle FAQ expansion
  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(id)
    }
  }

  return (
    <BusinessLayout>
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("help.title")}</h1>
        <p className="text-muted-foreground mt-2 mb-6">{t("help.subtitle")}</p>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("help.search")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <div className="help-card space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">{t("help.bookings")}</h3>
          <p className="text-muted-foreground mb-4">Find help with booking venues and managing your reservations</p>
          <Button variant="link" className="p-0 h-auto text-primary">
            {t("help.viewMore")} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="help-card space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">{t("help.payments")}</h3>
          <p className="text-muted-foreground mb-4">Learn about payment methods, refunds, and billing information</p>
          <Button variant="link" className="p-0 h-auto text-primary">
            {t("help.viewMore")} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="help-card space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">{t("help.account")}</h3>
          <p className="text-muted-foreground mb-4">Get help with your account settings, profile, and preferences</p>
          <Button variant="link" className="p-0 h-auto text-primary">
            {t("help.viewMore")} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="help-card space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">{t("help.venues")}</h3>
          <p className="text-muted-foreground mb-4">Information about venues, services, and hosting events</p>
          <Button variant="link" className="p-0 h-auto text-primary">
            {t("help.viewMore")} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <HelpCircle className="mr-2 h-5 w-5" />
                {t("help.faq")}
              </CardTitle>
              <CardDescription>{t("help.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer bg-card hover:bg-muted/50 transition-colors"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h3 className="font-medium">{faq.question}</h3>
                      <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                        {expandedFaq === faq.id ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                    {expandedFaq === faq.id && (
                      <div className="p-4 bg-muted/30 border-t">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">No FAQs found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search query to find what you're looking for.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                {t("help.contactUs")}
              </CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{t("help.email")}</h3>
                  <p className="text-sm text-muted-foreground">support@eventbooking.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{t("help.phone")}</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="rounded-full bg-primary/10 p-2 h-8 w-8 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{t("help.supportHours")}</h3>
                  <p className="text-sm text-muted-foreground">{t("help.weekdays")}</p>
                  <p className="text-sm text-muted-foreground">{t("help.weekends")}</p>
                </div>
              </div>
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("help.chat")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </BusinessLayout>
  )
}
