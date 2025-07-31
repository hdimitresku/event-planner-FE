import { Routes, Route } from "react-router-dom"
import { SiteHeader } from "./components/site-header"
import { SiteFooter } from "./components/site-footer"
import { ScrollToTop } from "./components/scroll-to-top"
import { ProtectedRoute } from "./components/protected-route"

// Pages
import { HomePage } from "./pages/home"
import { VenuesPage } from "./pages/venues"
import { VenueDetailPage } from "./pages/venue-detail"
import { VenueBookPage } from "./pages/venue-book"
import { VenueCheckoutPage } from "./pages/venue-checkout"
import { VenueConfirmationPage } from "./pages/venue-confirmation"
import { ServicesPage } from "./pages/services"
import { ServiceBookingsPage } from "./pages/service-bookings"
import { HowItWorksPage } from "./pages/how-it-works"
import { AboutPage } from "./pages/about"
import { LoginPage } from "./pages/login"
import { SignupPage } from "./pages/signup"
import { HostPage } from "./pages/host"
import { PrivacyPage } from "./pages/privacy"
import { TermsPage } from "./pages/terms"

// Dashboard Pages
import { DashboardLayout } from "./components/dashboard/layout"
import { DashboardPage } from "./pages/dashboard/dashboard"
import { FavoritesPage } from "./pages/dashboard/favorites"
import { ProfilePage } from "./pages/dashboard/profile"
import { PaymentMethodsPage } from "./pages/dashboard/payment-methods"
import { MessagesPage } from "./pages/dashboard/messages"

// Business Pages
import { BusinessLayout } from "./components/business/layout"
import { BusinessDashboardPage } from "./pages/business/dashboard"
import { BusinessVenuesPage } from "./pages/business/venues"
import { BusinessVenueNewPage } from "./pages/business/venue-new"
import { BusinessServiceManagementPage } from "./pages/business/service-management"
import { BusinessServiceNewPage } from "./pages/business/service-new"
import { BusinessBookingsPage } from "./pages/business/bookings"
import { BusinessServiceBookingsPage } from "./pages/business/service-bookings"
import { BusinessAnalyticsPage } from "./pages/business/analytics"
import { BusinessMessagesPage } from "./pages/business/messages"
import { BusinessSettingsPage } from "./pages/business/settings"
import { BusinessHelpPage } from "./pages/business/help"

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />
          <Route path="/venues/:id/book" element={<VenueBookPage />} />
          <Route path="/venue-checkout" element={<VenueCheckoutPage />} />
          <Route path="/venue-confirmation" element={<VenueConfirmationPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id/book" element={<ServiceBookingsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Customer Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="payment-methods" element={<PaymentMethodsPage />} />
            <Route path="messages" element={<MessagesPage />} />
          </Route>

          {/* Business Dashboard Routes */}
          <Route
            path="/business"
            element={
              <ProtectedRoute requiredRole="host">
                <BusinessLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<BusinessDashboardPage />} />
            <Route path="venues" element={<BusinessVenuesPage />} />
            <Route path="venues/new" element={<BusinessVenueNewPage />} />
            <Route path="services" element={<BusinessServiceManagementPage />} />
            <Route path="services/new" element={<BusinessServiceNewPage />} />
            <Route path="bookings" element={<BusinessBookingsPage />} />
            <Route path="service-bookings" element={<BusinessServiceBookingsPage />} />
            <Route path="analytics" element={<BusinessAnalyticsPage />} />
            <Route path="messages" element={<BusinessMessagesPage />} />
            <Route path="settings" element={<BusinessSettingsPage />} />
            <Route path="help" element={<BusinessHelpPage />} />
          </Route>
        </Routes>
      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  )
}

export default App
