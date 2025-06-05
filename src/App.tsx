import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./context/language-context"
import { AuthProvider } from "./context/auth-context"
import { ThemeProvider } from "./context/theme-context"
import { FavoritesProvider } from "./context/favorites-context"
import { SiteHeader } from "./components/site-header"
import { SiteFooter } from "./components/site-footer"
import { ProtectedRoute } from "./components/protected-route"
import { Toaster } from "@/components/ui/sonner"
import { DashboardLayout } from "@/components/dashboard/layout"
import { ScrollToTop } from "./components/scroll-to-top"

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
import DashboardPage from "./pages/dashboard/dashboard"
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
import ProfilePage from "./pages/dashboard/profile"
import FavoritesPage from "./pages/dashboard/favorites"
import DashboardMessagesPage from "./pages/dashboard/messages"
import PaymentMethodsPage from "./pages/dashboard/payment-methods"
import ServiceBookingsPage from "./pages/business/service-bookings"

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <ThemeProvider>
                    <FavoritesProvider>
                        <Router>
                            <ScrollToTop />
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

                                        {/* Protected routes */}
                                        <Route
                                            path="/dashboard"
                                            element={
                                                <ProtectedRoute>
                                                    <DashboardLayout />
                                                </ProtectedRoute>
                                            }
                                        >
                                            <Route index element={<DashboardPage />} />
                                            <Route path="profile" element={<ProfilePage />} />
                                            <Route path="favorites" element={<FavoritesPage />} />
                                            <Route path="messages" element={<DashboardMessagesPage />} />
                                            <Route path="payment-methods" element={<PaymentMethodsPage />} />
                                        </Route>

                                        {/* Business routes */}
                                        <Route
                                            path="/business/dashboard"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <BusinessDashboardPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/venues"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <BusinessVenuesPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/venues/new"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <BusinessVenueNewPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/services/new"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <BusinessServicesNewPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/analytics"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <BusinessAnalyticsPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/venue-bookings"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <BusinessBookingsPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/service-bookings"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <ServiceBookingsPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/messages"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <MessagesPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/help"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <HelpPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/settings"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <SettingsPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route
                                            path="/business/service-management"
                                            element={
                                                <ProtectedRoute requiredRole="host">
                                                    <ServicesManagementPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                    </Routes>
                                </main>
                                <SiteFooter />
                            </div>
                        </Router>
                        <Toaster />
                    </FavoritesProvider>
                </ThemeProvider>
            </LanguageProvider>
        </AuthProvider>
    )
}

export default App
