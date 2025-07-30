"use client"
import { useLanguage } from "../context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight, MapPin, Phone, Mail, Globe, FileText } from "lucide-react"

export default function AboutPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            {language === "sq" ? "Rreth Nesh" : "About Us"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === "sq"
              ? "RezervoAmbientin është platforma e parë në Shqipëri për rezervimin online të ambienteve për evente."
              : "RezervoAmbientin is the first platform in Albania for online venue booking for events."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4 space-y-12">
          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{language === "sq" ? "Misioni Ynë" : "Our Mission"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {language === "sq"
                  ? "Ne ndihmojmë përdoruesit të gjejnë hapësirën ideale për çdo rast – nga ditëlindjet dhe dasmat, deri te takimet biznesi – me rezervim të shpejtë, të sigurt dhe pa ndërmjetës."
                  : "We help users find the ideal space for every occasion – from birthdays and weddings to business meetings – with fast, secure booking without intermediaries."}
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{language === "sq" ? "Si Funksionon" : "How It Works"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </span>
                  <p className="text-muted-foreground">
                    {language === "sq"
                      ? "Shfleto ambientet sipas qytetit, llojit të eventit apo numrit të pjesëmarrësve."
                      : "Browse venues by city, event type, or number of participants."}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </span>
                  <p className="text-muted-foreground">
                    {language === "sq"
                      ? "Krahaso çmimet, fotot dhe informacionin."
                      : "Compare prices, photos, and information."}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </span>
                  <p className="text-muted-foreground">
                    {language === "sq" ? "Rezervo online me disa klikime." : "Book online with a few clicks."}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    4
                  </span>
                  <p className="text-muted-foreground">
                    {language === "sq"
                      ? "Ambienti konfirmon dhe komunikimi vazhdon direkt me pronarin."
                      : "The venue confirms and communication continues directly with the owner."}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/how-it-works" className="inline-flex items-center gap-2">
                    {language === "sq" ? "Mëso Më Shumë" : "Learn More"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{language === "sq" ? "Na Kontaktoni" : "Contact Us"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">info@rezervoambientin.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{language === "sq" ? "Telefon" : "Phone"}</p>
                      <p className="text-muted-foreground">+355 684090041</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{language === "sq" ? "Adresa" : "Address"}</p>
                      <p className="text-muted-foreground">Tiranë</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-muted-foreground">www.rezervoambientin.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partnership */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{language === "sq" ? "Bëhu Partner" : "Become a Partner"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Ke një ambient për evente? Bashkohu me platformën RezervoAmbientin dhe shfaq ambientin tënd për mijëra vizitorë çdo muaj."
                    : "Do you have an event venue? Join the RezervoAmbientin platform and showcase your venue to thousands of visitors every month."}
                </p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {language === "sq"
                      ? "Ti vendos çmimet, kushtet dhe oraret. Ne të ndihmojmë të gjesh klientë pa ndërmjetës dhe pa stres."
                      : "You set the prices, conditions, and schedules. We help you find clients without intermediaries and without stress."}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      📤{" "}
                      {language === "sq"
                        ? "Regjistrimi është falas dhe pa angazhim të menjëhershëm."
                        : "Registration is free and without immediate commitment."}
                    </p>
                    <p>
                      🎯{" "}
                      {language === "sq"
                        ? "Rrit dukshmërinë dhe menaxho më lehtë rezervimet online."
                        : "Increase visibility and manage online bookings more easily."}
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/host" className="inline-flex items-center gap-2">
                    {language === "sq" ? "Regjistroni Ambientin Tuaj" : "Register Your Venue"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === "sq" ? "Termat dhe Kushtet" : "Terms and Conditions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Përdorimi i platformës është subjekt i kushteve të përshkruara në faqet tona zyrtare. Të gjithë përdoruesit dhe partnerët janë të detyruar të respektojnë termat dhe politikat përkatëse gjatë përdorimit të platformës."
                    : "Use of the platform is subject to the conditions described on our official pages. All users and partners are required to respect the relevant terms and policies when using the platform."}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" asChild className="justify-start bg-transparent">
                    <Link to="/terms" className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {language === "sq" ? "Termat e përdorimit" : "Terms of use"}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start bg-transparent">
                    <Link to="/privacy" className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {language === "sq" ? "Politika e privatësisë" : "Privacy policy"}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start bg-transparent">
                    <Link to="/cookie" className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {language === "sq" ? "Politika e cookies" : "Cookie policy"}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
