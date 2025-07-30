"use client"

import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export function SiteFooter() {
  const { t, language } = useLanguage()

  return (
      <footer className="bg-card border-t border-border">
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* About */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
                {language === "sq" ? "Rreth Nesh" : t("footer.about") || "About"}
              </h3>
              <ul className="space-y-3 md:space-y-4">
                <li>
                  <Link
                      to="/about"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                  >
                    {language === "sq" ? "Rreth Nesh" : t("footer.aboutUs") || "About Us"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
                {language === "sq" ? "Mbështetje" : t("footer.support") || "Support"}
              </h3>
              <ul className="space-y-3 md:space-y-4">
                <li>
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-sm">📧 info@rezervoambientin.com</div>
                    <div className="text-muted-foreground text-sm">📞 +355 684090041</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Hosting */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
                {language === "sq" ? "Për Pronarët" : t("footer.hosting") || "For Owners"}
              </h3>
              <ul className="space-y-3 md:space-y-4">
                <li>
                  <Link
                      to="/host"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                  >
                    {language === "sq" ? "Regjistroni Ambientin Tuaj" : t("footer.hostVenue") || "Register Your Venue"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
                {language === "sq" ? "Ligjore & Kontakt" : t("footer.legal") || "Legal & Contact"}
              </h3>
              <ul className="space-y-3 md:space-y-4">
                <li>
                  <Link
                      to="/terms"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                  >
                    {language === "sq" ? "Termat dhe Kushtet" : t("footer.terms") || "Terms and Conditions"}
                  </Link>
                </li>
                <li>
                  <Link
                      to="/privacy"
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                  >
                    {language === "sq" ? "Politika e Privatësisë" : t("footer.privacy") || "Privacy Policy"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-xl md:text-2xl">
              <span className="text-primary">Rezervo</span>
              <span className="text-secondary">Ambientin</span>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} RezervoAmbientin.{" "}
              {language === "sq" ? "Të gjitha të drejtat e rezervuara." : t("footer.allRights") || "All rights reserved."}
            </div>
          </div>
        </div>
      </footer>
  )
}
