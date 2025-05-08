"use client"

import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.about") || "About"}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.aboutUs") || "About Us"}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.careers") || "Careers"}
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.press") || "Press"}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.blog") || "Blog"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.support") || "Support"}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.helpCenter") || "Help Center"}
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.safety") || "Safety"}
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.cancellation") || "Cancellation Options"}
                </Link>
              </li>
              <li>
                <Link
                  to="/covid"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.covid") || "COVID-19 Resources"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.hosting") || "Hosting"}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/host"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.hostVenue") || "Host Your Venue"}
                </Link>
              </li>
              <li>
                <Link
                  to="/responsible-hosting"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.responsibleHosting") || "Responsible Hosting"}
                </Link>
              </li>
              <li>
                <Link
                  to="/experiences"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.experiences") || "Experiences"}
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.resources") || "Resources"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.legal") || "Legal"}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.terms") || "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.privacy") || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie"
                  className="text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  {t("footer.cookie") || "Cookie Policy"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl mb-4 md:mb-0">
            <span className="text-primary">Venue</span>
            <span className="text-secondary">Space</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} VenueSpace. {t("footer.allRights") || "All rights reserved."}
          </div>
        </div>
      </div>
    </footer>
  )
}
