"use client"

import { useLanguage } from "../context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function PrivacyPage() {
  const { language } = useLanguage()

  const privacyContent = {
    sq: {
      title: "Politika e Privatësisë",
      welcome:
        "Kjo politikë e privatësisë shpjegon se si RezervoAmbientin mbledh, përdor dhe mbron informacionin tuaj personal.",
      sections: [
        {
          title: "1. Informacioni që Mbledhim",
          content:
            "Ne mbledhim informacione që ju na jepni drejtpërdrejt, si emri, email-i, numri i telefonit dhe detajet e pagesës kur bëni një rezervim.",
        },
        {
          title: "2. Si e Përdorim Informacionin",
          content:
            "Informacionin tuaj e përdorim për të përpunuar rezervimet, për t'ju kontaktuar në lidhje me shërbimet tona dhe për të përmirësuar përvojën tuaj në platformë.",
        },
        {
          title: "3. Ndarja e Informacionit",
          content:
            "Ne nuk e shesim, shkëmbejmë apo transferojmë informacionin tuaj personal te palët e treta pa pëlqimin tuaj, përveç rasteve kur është e nevojshme për përmbushjen e shërbimit.",
        },
        {
          title: "4. Siguria e të Dhënave",
          content:
            "Ne zbatojmë masa të përshtatshme teknike dhe organizative për të mbrojtur të dhënat tuaja nga aksesi i paautorizuar, ndryshimi ose shkatërrimi.",
        },
        {
          title: "5. Të Drejtat Tuaja",
          content:
            "Ju keni të drejtën të aksesoni, korrigjoni ose fshini të dhënat tuaja personale. Gjithashtu mund të kërkoni kufizimin e përpunimit të të dhënave tuaja.",
        },
        {
          title: "6. Cookies",
          content:
            "Faqja jonë përdor cookies për të përmirësuar përvojën tuaj. Ju mund t'i çaktivizoni cookies përmes cilësimeve të shfletuesit tuaj.",
        },
        {
          title: "7. Ndryshime në Politikë",
          content:
            "Mund të përditësojmë këtë politikë privatësie herë pas here. Do t'ju njoftojmë për çdo ndryshim të rëndësishëm.",
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      welcome:
        "This privacy policy explains how RezervoAmbientin collects, uses, and protects your personal information.",
      sections: [
        {
          title: "1. Information We Collect",
          content:
            "We collect information you provide directly to us, such as your name, email, phone number, and payment details when you make a booking.",
        },
        {
          title: "2. How We Use Information",
          content:
            "We use your information to process bookings, contact you regarding our services, and improve your experience on our platform.",
        },
        {
          title: "3. Information Sharing",
          content:
            "We do not sell, trade, or transfer your personal information to third parties without your consent, except when necessary to fulfill the service.",
        },
        {
          title: "4. Data Security",
          content:
            "We implement appropriate technical and organizational measures to protect your data from unauthorized access, alteration, or destruction.",
        },
        {
          title: "5. Your Rights",
          content:
            "You have the right to access, correct, or delete your personal data. You may also request restriction of processing of your data.",
        },
        {
          title: "6. Cookies",
          content:
            "Our website uses cookies to improve your experience. You can disable cookies through your browser settings.",
        },
        {
          title: "7. Policy Changes",
          content:
            "We may update this privacy policy from time to time. We will notify you of any significant changes.",
        },
      ],
    },
  }

  const content = privacyContent[language as keyof typeof privacyContent] || privacyContent.en

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center">{content.title}</CardTitle>
            <p className="text-muted-foreground text-center mt-4">{content.welcome}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-card-foreground">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}

            <div className="border-t pt-6 mt-8">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  {language === "sq"
                    ? `Përditësuar më: ${new Date().toLocaleDateString("sq-AL")}`
                    : `Last updated: ${new Date().toLocaleDateString("en-US")}`}
                </p>
                <div className="text-center space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {language === "sq" ? "Për pyetje rreth privatësisë:" : "For privacy questions:"}
                  </p>
                  <p className="text-sm text-muted-foreground">📧 info@rezervoambientin.com</p>
                  <p className="text-sm text-muted-foreground">📞 +355 684090041</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
