"use client"

import { useLanguage } from "../context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { CheckCircle, Star, Users, Calendar, TrendingUp } from "lucide-react"

export default function HostPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground">
              {language === "sq" ? "Bëhu Partner me RezervoAmbientin" : "Become a Partner with RezervoAmbientin"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === "sq"
                ? "Ke një ambient për evente? Bashkohu me platformën RezervoAmbientin dhe shfaq ambientin tënd për mijëra vizitorë çdo muaj."
                : "Do you have an event venue? Join the RezervoAmbientin platform and showcase your venue to thousands of visitors every month."}
            </p>
          </div>

          {/* Benefits Section */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {language === "sq" ? "Përfitimet e Partneritetit" : "Partnership Benefits"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "sq" ? "Mijëra Vizitorë" : "Thousands of Visitors"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "sq"
                      ? "Ekspozimi ndaj mijëra përdoruesve çdo muaj"
                      : "Exposure to thousands of users every month"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "sq" ? "Menaxhim i Lehtë" : "Easy Management"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "sq" ? "Menaxho rezervimet online pa stres" : "Manage bookings online without stress"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "sq" ? "Rritje të Ardhurash" : "Revenue Growth"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "sq" ? "Rrit të ardhurat pa ndërmjetës" : "Increase revenue without intermediaries"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === "sq" ? "Kontrolli i Plotë" : "Full Control"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "sq"
                      ? "Ti vendos çmimet, kushtet dhe oraret"
                      : "You set prices, conditions, and schedules"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center">
                {language === "sq" ? "Si Funksionon" : "How It Works"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {language === "sq" ? "Regjistrohuni Falas" : "Register for Free"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "sq"
                        ? "Plotësoni formularin e regjistrimit dhe na dërgoni informacionin për ambientin tuaj."
                        : "Fill out the registration form and send us information about your venue."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {language === "sq" ? "Verifikimi dhe Aktivizimi" : "Verification and Activation"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "sq"
                        ? "Ekipi ynë do të verifikojë informacionin dhe do të aktivizojë profilin tuaj."
                        : "Our team will verify the information and activate your profile."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {language === "sq" ? "Filloni të Merrni Rezervime" : "Start Receiving Bookings"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "sq"
                        ? "Ambienti juaj do të jetë i dukshëm për mijëra përdorues dhe do të filloni të merrni rezervime."
                        : "Your venue will be visible to thousands of users and you will start receiving bookings."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {language === "sq" ? "Regjistroni Ambientin Tuaj" : "Register Your Venue"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6 max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-foreground">
                      {language === "sq" ? "Emri" : "First Name"}
                    </Label>
                    <Input id="firstName" placeholder={language === "sq" ? "Emri juaj" : "Your first name"} />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-foreground">
                      {language === "sq" ? "Mbiemri" : "Last Name"}
                    </Label>
                    <Input id="lastName" placeholder={language === "sq" ? "Mbiemri juaj" : "Your last name"} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="info@ambienti.com" />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground">
                    {language === "sq" ? "Telefoni" : "Phone"}
                  </Label>
                  <Input id="phone" placeholder="+355 69 123 4567" />
                </div>

                <div>
                  <Label htmlFor="venueName" className="text-foreground">
                    {language === "sq" ? "Emri i Ambientit" : "Venue Name"}
                  </Label>
                  <Input id="venueName" placeholder={language === "sq" ? "Emri i ambientit tuaj" : "Your venue name"} />
                </div>

                <div>
                  <Label htmlFor="venueAddress" className="text-foreground">
                    {language === "sq" ? "Adresa e Ambientit" : "Venue Address"}
                  </Label>
                  <Input id="venueAddress" placeholder={language === "sq" ? "Adresa e plotë" : "Full address"} />
                </div>

                <div>
                  <Label htmlFor="capacity" className="text-foreground">
                    {language === "sq" ? "Kapaciteti (numri i personave)" : "Capacity (number of people)"}
                  </Label>
                  <Input id="capacity" type="number" placeholder="100" />
                </div>

                <div>
                  <Label htmlFor="description" className="text-foreground">
                    {language === "sq" ? "Përshkrimi i Ambientit" : "Venue Description"}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={
                      language === "sq"
                        ? "Përshkruani ambientin tuaj, shërbimet që ofroni, etj."
                        : "Describe your venue, services you offer, etc."
                    }
                    rows={4}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-1">
                        {language === "sq" ? "Regjistrimi është falas!" : "Registration is free!"}
                      </p>
                      <p className="text-muted-foreground">
                        {language === "sq"
                          ? "Nuk ka tarifa të fshehura. Paguani vetëm kur merrni rezervime."
                          : "No hidden fees. You only pay when you receive bookings."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {language === "sq" ? "Dërgo Aplikimin" : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
