"use client"

import { useLanguage } from "../context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function TermsPage() {
  const { language } = useLanguage()

  const termsContent = {
    sq: {
      title: "Termat dhe Kushtet e Përdorimit",
      welcome:
        "Mirë se vini në RezervoAmbientin.com. Ju lutemi lexoni me kujdes termat e mëposhtëm përpara se të përdorni platformën tonë.",
      sections: [
        {
          title: "1. Përdorimi i Shërbimit",
          content:
            "Duke hyrë dhe përdorur platformën, ju pranoni të respektoni këto kushte. Nëse nuk pajtoheni, ju lutemi mos e përdorni shërbimin.",
        },
        {
          title: "2. Qëllimi i Platformës",
          content:
            "RezervoAmbientin ofron një mjet online për të kërkuar dhe rezervuar ambiente për evente të ndryshme, përmes një ndërfaqeje të thjeshtë dhe të sigurt.",
        },
        {
          title: "3. Llogaria e Përdoruesit",
          content:
            "Përdoruesi është përgjegjës për ruajtjen e sigurisë së llogarisë së tij dhe për të gjitha veprimet që ndodhin në të. Mos e ndani fjalëkalimin me palë të treta.",
        },
        {
          title: "4. Rezervimet dhe Pagesat",
          content:
            "Çdo rezervim është subjekt i konfirmimit nga ambienti përkatës. Pagesat bëhen përmes platformës ose direkt te ambienti, sipas mënyrës së zgjedhur në momentin e rezervimit.",
        },
        {
          title: "5. Anulimet dhe Rimbursimet",
          content:
            "Politikat e anulimit dhe rimbursimit përcaktohen nga secili ambient dhe janë të shënuara në profilin e tyre. Ju lutemi lexoni me kujdes para se të rezervoni.",
        },
        {
          title: "6. Sjellja e Përdoruesit",
          content:
            "Ndalohet përdorimi i platformës për qëllime mashtruese, abuzive ose të paligjshme. RezervoAmbientin rezervon të drejtën të bllokojë çdo përdorues që shkel këto rregulla.",
        },
        {
          title: "7. Privatësia",
          content:
            "Të dhënat tuaja përpunohen në përputhje me Politikat tona të Privatësisë. Ne nuk i shpërndajmë të dhënat tuaja pa pëlqimin tuaj.",
        },
        {
          title: "8. Ndryshime në Kushte",
          content:
            "Këto kushte mund të ndryshohen në çdo kohë. Versioni më i fundit do të jetë gjithmonë i disponueshëm në këtë faqe.",
        },
        {
          title: "9. Kontakti",
          content: "Për çdo pyetje ose shqetësim, ju lutemi na kontaktoni në:",
        },
      ],
      contact: {
        email: "📧 info@rezervoambientin.com",
        phone: "📞 +355 684090041",
      },
    },
    en: {
      title: "Terms and Conditions of Use",
      welcome: "Welcome to RezervoAmbientin.com. Please read the following terms carefully before using our platform.",
      sections: [
        {
          title: "1. Use of Service",
          content:
            "By accessing and using the platform, you agree to comply with these terms. If you do not agree, please do not use the service.",
        },
        {
          title: "2. Platform Purpose",
          content:
            "RezervoAmbientin provides an online tool to search and book venues for various events, through a simple and secure interface.",
        },
        {
          title: "3. User Account",
          content:
            "The user is responsible for maintaining the security of their account and for all activities that occur on it. Do not share your password with third parties.",
        },
        {
          title: "4. Bookings and Payments",
          content:
            "Every booking is subject to confirmation from the respective venue. Payments are made through the platform or directly at the venue, according to the method chosen at the time of booking.",
        },
        {
          title: "5. Cancellations and Refunds",
          content:
            "Cancellation and refund policies are determined by each venue and are noted in their profile. Please read carefully before booking.",
        },
        {
          title: "6. User Behavior",
          content:
            "The use of the platform for fraudulent, abusive, or illegal purposes is prohibited. RezervoAmbientin reserves the right to block any user who violates these rules.",
        },
        {
          title: "7. Privacy",
          content:
            "Your data is processed in accordance with our Privacy Policies. We do not share your data without your consent.",
        },
        {
          title: "8. Changes to Terms",
          content: "These terms may be changed at any time. The latest version will always be available on this page.",
        },
        {
          title: "9. Contact",
          content: "For any questions or concerns, please contact us at:",
        },
      ],
      contact: {
        email: "📧 info@rezervoambientin.com",
        phone: "📞 +355 684090041",
      },
    },
  }

  const content = termsContent[language as keyof typeof termsContent] || termsContent.en

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
                {index === content.sections.length - 1 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-muted-foreground">{content.contact.email}</p>
                    <p className="text-muted-foreground">{content.contact.phone}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-muted-foreground text-center">
                {language === "sq"
                  ? `Përditësuar më: ${new Date().toLocaleDateString("sq-AL")}`
                  : `Last updated: ${new Date().toLocaleDateString("en-US")}`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
