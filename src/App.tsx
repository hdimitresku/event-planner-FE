import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LanguageProvider } from "./context/language-context"
import { AuthProvider } from "./context/auth-context"
import { ThemeProvider } from "./context/theme-context"
import { SiteHeader } from "./components/site-header"
import { SiteFooter } from "./components/site-footer"

// Pages
import HomePage from "./pages/home"
import ServicesPage from "./pages/services"
import HowItWorksPage from "./pages/how-it-works"
import SignupPage from "./pages/signup"
import LoginPage from "./pages/login"
import VenuesPage from "./pages/venues"
import VenueDetailPage from "./pages/venue-detail"
import VenueBookPage from "./pages/venue-book"
import VenueCheckoutPage from "./pages/venue-checkout"
import VenueConfirmationPage from "./pages/venue-confirmation"
import DashboardPage from "./pages/dashboard"
import BusinessDashboardPage from "./pages/business/dashboard"
import BusinessVenuesPage from "./pages/business/venues"
import BusinessVenueNewPage from "./pages/business/venue-new"
import BusinessServicesNewPage from "./pages/business/service-new"
import BusinessAnalyticsPage from "./pages/business/analytics"
import BusinessBookingsPage from "./pages/business/bookings"
import MessagesPage from "./pages/business/messages"
import HelpPage from "./pages/business/help"
import SettingsPage from "./pages/business/settings"
import ServicesManagementPage from "./pages/business/service-management"
import ProfilePage from "./pages/profile"
import { useAuth } from "./context/auth-context"
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <SiteHeader />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/venues" element={<VenuesPage />} />
                  <Route path="/venues/:id" element={<VenueDetailPage />} />
                  <Route path="/venues/:id/book" element={<VenueBookPage />} />
                  <Route path="/venues/:id/checkout" element={<VenueCheckoutPage />} />
                  <Route path="/venues/:id/confirmation" element={<VenueConfirmationPage />} />

                  {/* Auth routes with conditional rendering */}
                  {/* <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />} />
                  <Route path="/signup" element={isAuthenticated ? <Navigate to="/profile" /> : <SignupPage />} /> */}

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      //  <ProtectedRoute>
                      <DashboardPage />
                      //  </ProtectedRoute>
                    }
                  />

                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Business routes */}
                  <Route
                    path="/business/dashboard"
                    element={
                      //   <ProtectedRoute>
                      <BusinessDashboardPage />
                      //   </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/venues"
                    element={
                      // <ProtectedRoute>
                      <BusinessVenuesPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/venues/new"
                    element={
                      // <ProtectedRoute>
                      <BusinessVenueNewPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/services/new"
                    element={
                      // <ProtectedRoute>
                      <BusinessServicesNewPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/analytics"
                    element={
                      // <ProtectedRoute>
                      <BusinessAnalyticsPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/bookings"
                    element={
                      // <ProtectedRoute>
                      <BusinessBookingsPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/messages"
                    element={
                      // <ProtectedRoute>
                      <MessagesPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/help"
                    element={
                      // <ProtectedRoute>
                      <HelpPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/settings"
                    element={
                      // <ProtectedRoute>
                      <SettingsPage />
                      // </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business/service-management"
                    element={
                      // <ProtectedRoute>
                      <ServicesManagementPage />
                      // </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <SiteFooter />
            </div>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
