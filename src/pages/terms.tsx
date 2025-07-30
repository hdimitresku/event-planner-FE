"use client"

import { useLanguage } from "../context/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { Badge } from "../components/ui/badge"

export default function TermsPage() {
  const { t, language } = useLanguage()

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{language === "sq" ? "Terma dhe Kushte" : "Terms and Conditions"}</h1>
          <p className="text-gray-600">
            {language === "sq" ? "Përditësuar më: 24.07.2025" : "Last updated: July 24, 2025"}
          </p>
        </div>

        {/* User Terms */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">
                {language === "sq"
                  ? "Terma dhe Kushte Përdorimi – Për Klientët"
                  : "Terms and Conditions of Use – For Clients"}
              </CardTitle>
              <Badge variant="secondary">{language === "sq" ? "Klientë" : "Clients"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {language === "sq"
                  ? 'Mirë se vini në platformën "RezervoAmbientin"! Këto Terma dhe Kushte rregullojnë përdorimin e platformës nga individët që rezervojnë ambiente për evente përmes saj. Duke përdorur shërbimin tonë, ju pranoni t\'i respektoni këto kushte.'
                  : 'Welcome to the "RezervoAmbientin" platform! These Terms and Conditions govern the use of the platform by individuals who book venues for events through it. By using our service, you agree to respect these conditions.'}
              </p>
            </div>

            <Separator />

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">{language === "sq" ? "1. Përcaktime" : "1. Definitions"}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>{language === "sq" ? "Platforma" : "Platform"}:</strong>{" "}
                    {language === "sq"
                      ? '"RezervoAmbientin", faqe interneti për rezervimin e ambienteve për evente.'
                      : '"RezervoAmbientin", website for booking venues for events.'}
                  </li>
                  <li>
                    <strong>{language === "sq" ? "Klient/Përdorues" : "Client/User"}:</strong>{" "}
                    {language === "sq"
                      ? "çdo individ që kërkon dhe rezervon një ambient përmes platformës."
                      : "any individual who searches for and books a venue through the platform."}
                  </li>
                  <li>
                    <strong>{language === "sq" ? "Ofertuesi i Ambientit" : "Venue Provider"}:</strong>{" "}
                    {language === "sq"
                      ? "pronar ose menaxher që ofron një hapësirë për rezervim."
                      : "owner or manager who offers a space for booking."}
                  </li>
                  <li>
                    <strong>{language === "sq" ? "Rezervim" : "Booking"}:</strong>{" "}
                    {language === "sq"
                      ? "një kërkesë e bërë nga klienti për një ambient të caktuar, në një datë dhe orar specifik."
                      : "a request made by the client for a specific venue, on a specific date and time."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "2. Përdorimi i platformës" : "2. Platform Usage"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "Përdorimi i platformës është falas për klientin. Ju mund të shfletoni, zgjidhni dhe dërgoni kërkesa për rezervim te ambientet e listuara."
                    : "Platform usage is free for clients. You can browse, select and send booking requests to listed venues."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "3. Rezervimi dhe konfirmimi" : "3. Booking and Confirmation"}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Rezervimi nuk është përfundimtar derisa të konfirmohet nga ambienti përkatës."
                      : "Booking is not final until confirmed by the respective venue."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Pas konfirmimit, ofertuesi mund të kërkojë pagesë të një kapari, si garanci për ruajtjen e datës."
                      : "After confirmation, the provider may request payment of a deposit as guarantee for date reservation."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Kjo pagesë bëhet jashtë platformës, përmes kontaktit direkt mes ambientit dhe klientit."
                      : "This payment is made outside the platform, through direct contact between venue and client."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq"
                    ? "4. Sjellja dhe përgjegjësia e klientit"
                    : "4. Client Behavior and Responsibility"}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Me dërgimin e një rezervimi, ju angazhoheni të jeni serioz dhe të respektoni angazhimin e bërë."
                      : "By sending a booking, you commit to being serious and respecting the commitment made."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Dërgimi i rezervimeve fiktive ose pa qëllim real mund të rezultojë në ndalim nga platforma."
                      : "Sending fake bookings or without real purpose may result in platform ban."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Nëse nuk mund të realizoni një rezervim, jeni të lutur ta anuloni sa më herët të jetë e mundur."
                      : "If you cannot fulfill a booking, please cancel it as soon as possible."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "5. Pagesat dhe kapari" : "5. Payments and Deposits"}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? '"RezervoAmbientin" nuk merr pagesa nga klientët në këtë fazë.'
                      : '"RezervoAmbientin" does not take payments from clients at this stage.'}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Pagesa e kaparit (nëse kërkohet) bëhet në marrëveshje direkte me ambientin."
                      : "Deposit payment (if required) is made in direct agreement with the venue."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Platforma nuk mban përgjegjësi për transaksionet apo marrëveshjet jashtë saj."
                      : "The platform is not responsible for transactions or agreements outside of it."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">{language === "sq" ? "6. Anulimi" : "6. Cancellation"}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Ju mund të anuloni një kërkesë për rezervim përpara se të konfirmohet."
                      : "You can cancel a booking request before it is confirmed."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Pas konfirmimit, çdo anulim duhet të komunikohet direkt me ambientin dhe vlen sipas kushteve të tij."
                      : "After confirmation, any cancellation must be communicated directly with the venue and applies according to its conditions."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Platforma nuk garanton rimbursim për kaparin e paguar jashtë saj."
                      : "The platform does not guarantee refund for deposits paid outside of it."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq"
                    ? "7. Kufizime dhe përjashtime nga përgjegjësia"
                    : "7. Limitations and Liability Exclusions"}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Platforma nuk është palë në marrëveshjen mes klientit dhe ambientit."
                      : "The platform is not a party to the agreement between client and venue."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Ne nuk mbajmë përgjegjësi për cilësinë e ambientit, komunikimin, apo çdo mosmarrëveshje që lind jashtë platformës."
                      : "We are not responsible for venue quality, communication, or any disagreements arising outside the platform."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Rekomandojmë që të verifikoni çdo ambient dhe të komunikoni qartë përpara çdo pagese."
                      : "We recommend verifying each venue and communicating clearly before any payment."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">{language === "sq" ? "8. Privatësia" : "8. Privacy"}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Të dhënat tuaja përpunohen sipas Politikës së Privatësisë të platformës."
                      : "Your data is processed according to the platform's Privacy Policy."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Kontakti juaj mund të ndahet vetëm me ambientin që keni zgjedhur për rezervim, për qëllime konfirmimi."
                      : "Your contact may only be shared with the venue you have chosen for booking, for confirmation purposes."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "9. Ndryshime në kushte" : "9. Changes to Terms"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "Këto kushte mund të ndryshohen në çdo kohë. Përdorimi i mëtejshëm i platformës pas përditësimeve nënkupton pranimin e tyre."
                    : "These terms may be changed at any time. Continued use of the platform after updates implies acceptance of them."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "10. Zgjidhja e mosmarrëveshjeve" : "10. Dispute Resolution"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "Çdo mosmarrëveshje që lidhet me përdorimin e kësaj platforme rregullohet nga ligjet në fuqi në Republikën e Shqipërisë."
                    : "Any dispute related to the use of this platform is governed by the laws in force in the Republic of Albania."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner Terms */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">
                {language === "sq"
                  ? "Termat dhe Kushtet e Përdorimit për Partnerët"
                  : "Terms and Conditions of Use for Partners"}
              </CardTitle>
              <Badge variant="outline">{language === "sq" ? "Partnerë" : "Partners"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {language === "sq"
                  ? "Platforma RezervoAmbientin ndërmjetëson rezervimin e ambienteve për evente të ndryshme në territorin e Shqipërisë. Partneri ofron hapësirën e tij në dispozicion të klientëve që rezervojnë përmes platformës."
                  : "The RezervoAmbientin platform mediates the booking of venues for various events in the territory of Albania. The partner makes their space available to clients who book through the platform."}
              </p>
            </div>

            <Separator />

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "1. Qëllimi i Bashkëpunimit" : "1. Purpose of Cooperation"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "Platforma RezervoAmbientin ndërmjetëson rezervimin e ambienteve për evente të ndryshme në territorin e Shqipërisë. Partneri ofron hapësirën e tij në dispozicion të klientëve që rezervojnë përmes platformës."
                    : "The RezervoAmbientin platform mediates the booking of venues for various events in the territory of Albania. The partner makes their space available to clients who book through the platform."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "2. Detyrimet e Partnerit" : "2. Partner Obligations"}
                </h3>
                <p className="text-gray-700 mb-3">
                  {language === "sq" ? "Partneri angazhohet që:" : "The partner commits to:"}
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Të publikojë informacione reale dhe të sakta mbi ambientin (emri, përshkrimi, kapaciteti, çmimi, fotot, rregullat)."
                      : "Publish real and accurate information about the venue (name, description, capacity, price, photos, rules)."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Të menaxhojë me korrektësi kalendarin e disponueshmërisë."
                      : "Properly manage the availability calendar."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Të ofrojë ambientin sipas kushteve të publikuara dhe të pranuara nga klienti."
                      : "Provide the venue according to published conditions accepted by the client."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Të mbajë ambientin të pastër, të sigurt dhe të përshatshëm për ngjarjen e prenotuar."
                      : "Keep the venue clean, safe and suitable for the booked event."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Të respektojë termat financiare dhe të paguajë komisionin ndaj platformës."
                      : "Respect financial terms and pay commission to the platform."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "3. Politika e Pagesave dhe Komisioneve" : "3. Payment and Commission Policy"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {language === "sq"
                    ? "Platforma RezervoAmbientin merr komision nga çdo rezervim i konfirmuar sipas këtyre niveleve:"
                    : "The RezervoAmbientin platform takes commission from each confirmed booking according to these levels:"}
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">
                          {language === "sq" ? "Numri i personave" : "Number of people"}
                        </th>
                        <th className="text-left py-2">
                          {language === "sq" ? "Komisioni për Platformën" : "Platform Commission"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr>
                        <td className="py-2">{language === "sq" ? "Deri në 10 persona" : "Up to 10 people"}</td>
                        <td className="py-2">1,000 lek</td>
                      </tr>
                      <tr>
                        <td className="py-2">{language === "sq" ? "Deri në 20 persona" : "Up to 20 people"}</td>
                        <td className="py-2">2,000 lek</td>
                      </tr>
                      <tr>
                        <td className="py-2">{language === "sq" ? "Deri në 30 persona" : "Up to 30 people"}</td>
                        <td className="py-2">3,000 lek</td>
                      </tr>
                      <tr>
                        <td className="py-2">{language === "sq" ? "30+ persona" : "30+ people"}</td>
                        <td className="py-2">
                          {language === "sq"
                            ? "Përqindje ose çmim i veçantë sipas dakordësimit"
                            : "Percentage or special price by agreement"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-gray-700 mt-4">
                  {language === "sq"
                    ? "Komisioni do të llogaritet dhe komunikohet automatikisht nga sistemi në momentin e rezervimit. Pagesa e komisionit bëhet më së shumti 3 ditë pas realizimit të eventit ose një herë në muaj."
                    : "The commission will be calculated and communicated automatically by the system at the time of booking. Commission payment is made at most 3 days after the event or once a month."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "4. Anulimet dhe Rimbursimet" : "4. Cancellations and Refunds"}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Partneri mund të caktojë politikën e tij të anulimit (fleksibël, mesatare, strikt), që do të pasqyrohet te profili i ambientit."
                      : "The partner can set their cancellation policy (flexible, moderate, strict), which will be reflected in the venue profile."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Në rast mosfunksionimi nga ana e partnerit, ky mban përgjegjësi të plotë për rimbursimin ndaj klientit dhe tarifën e komisionit."
                      : "In case of non-performance by the partner, they bear full responsibility for refunding the client and the commission fee."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "5. Promovimi dhe Ekskluziviteti" : "5. Promotion and Exclusivity"}
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Platforma ka të drejtë të promovojë ambientin në rrjetet sociale, email marketing dhe reklama online."
                      : "The platform has the right to promote the venue on social networks, email marketing and online advertising."}
                  </li>
                  <li>
                    •{" "}
                    {language === "sq"
                      ? "Partneri mund të mos jetë ekskluziv, por duhet të njoftojë nëse ka tarifa të ndryshme jashtë platformës."
                      : "The partner may not be exclusive, but must notify if they have different rates outside the platform."}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "6. Përjashtimi nga Përgjegjësia" : "6. Liability Exclusion"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "RezervoAmbientin nuk mban përgjegjësi për dëme materiale, mosrespektim të orarit nga klienti, ose sjellje të pahijshme. Partneri ka të drejtë të aplikojë penalitete sipas rregullave të vendosura."
                    : "RezervoAmbientin is not responsible for material damage, non-compliance with schedule by the client, or inappropriate behavior. The partner has the right to apply penalties according to established rules."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "7. Përfundimi i Bashkëpunimit" : "7. End of Cooperation"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "Palët mund të ndërpresin bashkëpunimin në çdo kohë me njoftim të shkruar (email ose sistem). Pagesat e mbetura do të likuidohen brenda 5 ditëve."
                    : "Parties may terminate cooperation at any time with written notice (email or system). Remaining payments will be settled within 5 days."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "8. E Drejta e Ndryshimit të Kushteve" : "8. Right to Change Terms"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "Platforma rezervon të drejtën të ndryshojë këto kushte në çdo kohë. Partnerët do të njoftohen me email dhe në panelin e tyre."
                    : "The platform reserves the right to change these terms at any time. Partners will be notified by email and in their panel."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === "sq" ? "9. Ligji i Zbatueshëm dhe Juridiksioni" : "9. Applicable Law and Jurisdiction"}
                </h3>
                <p className="text-gray-700">
                  {language === "sq"
                    ? "Ky bashkëpunim rregullohet nga ligjet e Republikës së Shqipërisë. Çdo mosmarrëveshje zgjidhet nga gjykatat shqiptare."
                    : "This cooperation is governed by the laws of the Republic of Albania. Any dispute is resolved by Albanian courts."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-8">
          <p className="text-gray-600">
            {language === "sq"
              ? "Faleminderit që jeni pjesë e RezervoAmbientin!"
              : "Thank you for being part of RezervoAmbientin!"}
          </p>
        </div>
      </div>
    </div>
  )
}
