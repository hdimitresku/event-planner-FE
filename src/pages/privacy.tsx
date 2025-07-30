"use client"
import { useLanguage } from "../context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function PrivacyPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "sq" ? "Politika e Privatësisë" : "Privacy Policy"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {language === "sq"
                ? "Kjo politikë përshkruan se si RezervoAmbientin mbledh, përdor dhe mbron informacionin tuaj personal."
                : "This policy describes how RezervoAmbientin collects, uses, and protects your personal information."}
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "sq" ? "Informacioni që Mbledhim" : "Information We Collect"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    {language === "sq"
                      ? "Ne mbledhim informacionin që ju na jepni drejtpërdrejt, si:"
                      : "We collect information that you provide to us directly, such as:"}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>{language === "sq" ? "Emri dhe mbiemri" : "First and last name"}</li>
                    <li>{language === "sq" ? "Adresa e email-it" : "Email address"}</li>
                    <li>{language === "sq" ? "Numri i telefonit" : "Phone number"}</li>
                    <li>{language === "sq" ? "Informacioni i rezervimit" : "Booking information"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "sq" ? "Si e Përdorim Informacionin" : "How We Use Information"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    {language === "sq" ? "Informacionin tuaj e përdorim për:" : "We use your information to:"}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>{language === "sq" ? "Përpunimin e rezervimeve" : "Process bookings"}</li>
                    <li>{language === "sq" ? "Komunikimin me ju" : "Communicate with you"}</li>
                    <li>{language === "sq" ? "Përmirësimin e shërbimeve tona" : "Improve our services"}</li>
                    <li>
                      {language === "sq" ? "Dërgimin e njoftimeve të rëndësishme" : "Send important notifications"}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "sq" ? "Ndarja e Informacionit" : "Information Sharing"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Ne nuk i shesim, qirajmë apo ndajmë informacionin tuaj personal me palë të treta pa pëlqimin tuaj, përveç rasteve kur kërkohet nga ligji ose për të përmbushur rezervimet tuaja."
                    : "We do not sell, rent, or share your personal information with third parties without your consent, except when required by law or to fulfill your bookings."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "sq" ? "Siguria e të Dhënave" : "Data Security"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {language === "sq"
                    ? "Ne përdorim masa të përshtatshme teknike dhe organizative për të mbrojtur informacionin tuaj personal nga aksesi i paautorizuar, ndryshimi, zbulimi ose shkatërrimi."
                    : "We use appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "sq" ? "Të Drejtat Tuaja" : "Your Rights"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    {language === "sq" ? "Ju keni të drejtën të:" : "You have the right to:"}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>
                      {language === "sq" ? "Aksesoni informacionin tuaj personal" : "Access your personal information"}
                    </li>
                    <li>
                      {language === "sq" ? "Korrigjoni informacionin e pasaktë" : "Correct inaccurate information"}
                    </li>
                    <li>{language === "sq" ? "Kërkoni fshirjen e të dhënave" : "Request data deletion"}</li>
                    <li>{language === "sq" ? "Tërhiqni pëlqimin tuaj" : "Withdraw your consent"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "sq" ? "Kontakti" : "Contact"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    {language === "sq"
                      ? "Për pyetje rreth kësaj politike privatësie, na kontaktoni:"
                      : "For questions about this privacy policy, contact us:"}
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
