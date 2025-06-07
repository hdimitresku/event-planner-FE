"use client"

import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="bg-card border-t border-border">
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* About */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
              {t("footer.about") || "About"}
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.aboutUs") || "About Us"}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.careers") || "Careers"}
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.press") || "Press"}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.blog") || "Blog"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
              {t("footer.support") || "Support"}
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.helpCenter") || "Help Center"}
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.safety") || "Safety"}
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.cancellation") || "Cancellation Options"}
                </Link>
              </li>
              <li>
                <Link
                  to="/covid"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.covid") || "COVID-19 Resources"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
              {t("footer.hosting") || "Hosting"}
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link
                  to="/host"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.hostVenue") || "Host Your Venue"}
                </Link>
              </li>
              <li>
                <Link
                  to="/responsible-hosting"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.responsibleHosting") || "Responsible Hosting"}
                </Link>
              </li>
              <li>
                <Link
                  to="/experiences"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.experiences") || "Experiences"}
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.resources") || "Resources"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-card-foreground">
              {t("footer.legal") || "Legal"}
            </h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.terms") || "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.privacy") || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 nav-link"
                >
                  {t("footer.cookie") || "Cookie Policy"}
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
            &copy; {new Date().getFullYear()} RezervoAmbientin. {t("footer.allRights") || "All rights reserved."}
          </div>
        </div>
      </div>
    </footer>
  )
}
