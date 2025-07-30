"use client"
import { useLanguage } from "../context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function TermsPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "sq" ? "Termat dhe Kushtet e Përdorimit" : "Terms and Conditions of Use"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {language === "sq"
                ? "Mirë se vini në RezervoAmbientin.com. Ju lutemi lexoni me kujdes termat e mëposhtëm përpara se të përdorni platformën tonë."
                : "Welcome to RezervoAmbientin.com. Please read the following terms carefully before using our platform."}
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  {language === "sq" ? "Përdorimi i Shërbimit" : "Use of Service"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Duke hyrë dhe përdorur platformën, ju pranoni të respektoni këto kushte. Nëse nuk pajtoheni, ju lutemi mos e përdorni shërbimin."
                    : "By accessing and using the platform, you agree to comply with these terms. If you do not agree, please do not use the service."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  {language === "sq" ? "Qëllimi i Platformës" : "Platform Purpose"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "RezervoAmbientin ofron një mjet online për të kërkuar dhe rezervuar ambiente për evente të ndryshme, përmes një ndërfaqeje të thjeshtë dhe të sigurt."
                    : "RezervoAmbientin provides an online tool to search and book venues for various events through a simple and secure interface."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  {language === "sq" ? "Llogaria e Përdoruesit" : "User Account"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Përdoruesi është përgjegjës për ruajtjen e sigurisë së llogarisë së tij dhe për të gjitha veprimet që ndodhin në të. Mos e ndani fjalëkalimin me palë të treta."
                    : "The user is responsible for maintaining the security of their account and for all activities that occur on it. Do not share your password with third parties."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  {language === "sq" ? "Rezervimet dhe Pagesat" : "Bookings and Payments"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Çdo rezervim është subjekt i konfirmimit nga ambienti përkatës. Pagesat bëhen përmes platformës ose direkt te ambienti, sipas mënyrës së zgjedhur në momentin e rezervimit."
                    : "Every booking is subject to confirmation from the respective venue. Payments are made through the platform or directly at the venue, according to the method chosen at the time of booking."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  {language === "sq" ? "Anulimet dhe Rimbursimet" : "Cancellations and Refunds"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Politikat e anulimit dhe rimbursimit përcaktohen nga secili ambient dhe janë të shënuara në profilin e tyre. Ju lutemi lexoni me kujdes para se të rezervoni."
                    : "Cancellation and refund policies are determined by each venue and are noted in their profile. Please read carefully before booking."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    6
                  </span>
                  {language === "sq" ? "Sjellja e Përdoruesit" : "User Behavior"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Ndalohet përdorimi i platformës për qëllime mashtruese, abuzive ose të paligjshme. RezervoAmbientin rezervon të drejtën të bllokojë çdo përdorues që shkel këto rregulla."
                    : "The use of the platform for fraudulent, abusive, or illegal purposes is prohibited. RezervoAmbientin reserves the right to block any user who violates these rules."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    7
                  </span>
                  {language === "sq" ? "Privatësia" : "Privacy"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Të dhënat tuaja përpunohen në përputhje me Politikat tona të Privatësisë. Ne nuk i shpërndajmë të dhënat tuaja pa pëlqimin tuaj."
                    : "Your data is processed in accordance with our Privacy Policies. We do not share your data without your consent."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    8
                  </span>
                  {language === "sq" ? "Ndryshime në Kushte" : "Changes to Terms"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Këto kushte mund të ndryshohen në çdo kohë. Versioni më i fundit do të jetë gjithmonë i disponueshëm në këtë faqe."
                    : "These terms may be changed at any time. The latest version will always be available on this page."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    9
                  </span>
                  {language === "sq" ? "Kontakti" : "Contact"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {language === "sq"
                      ? "Për çdo pyetje ose shqetësim, ju lutemi na kontaktoni në:"
                      : "For any questions or concerns, please contact us at:"}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div>📧 info@rezervoambientin.com</div>
                    <div>📞 +355 684090041</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
