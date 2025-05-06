"use client"

/**
 * EventSpace Translation System
 * 
 * This system provides a structured approach to translations throughout the application.
 * 
 * Translation Key Structure:
 * - Namespace prefixes for different sections (e.g., business, dashboard, venues)
 * - Common elements shared across sections (e.g., business.common.*)
 * - Specific elements for particular features (e.g., business.serviceNew.*)
 * 
 * Design Principles:
 * 1. DRY (Don't Repeat Yourself) - Reuse common translations across components
 * 2. Hierarchical - Organize by feature area and component type
 * 3. Consistent - Follow naming conventions (noun.verb.attribute pattern)
 * 4. Maintainable - Easy to add new translations or modify existing ones
 * 
 * Common Sections:
 * - business.common.*: Shared elements across the business section
 * - business.pricing.*: Standard pricing type labels
 * - business.categories.*: Service category labels
 * - business.venueTypes.*: Types of venues
 * 
 * Each component should use the most specific translation key available,
 * falling back to common keys when appropriate.
 */

import type React from "react"
import { createContext, useContext, useState } from "react"

// Define the available languages
type Language = "en" | "sq"

// Define the translations interface
interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

// Sample translations
const translations: Translations = {
  en: {
    // Navigation
    "nav.venues": "Venues",
    "nav.services": "Services",
    "nav.howItWorks": "How It Works",
    "nav.dashboard": "Dashboard",
    "nav.login": "Log In",
    "nav.signup": "Sign Up",

    // Common elements across the business section
    "business.common.add": "Add",
    "business.common.edit": "Edit",
    "business.common.delete": "Delete",
    "business.common.save": "Save",
    "business.common.cancel": "Cancel",
    "business.common.view": "View",
    "business.common.search": "Search",
    "business.common.filter": "Filter",
    "business.common.status": "Status",
    "business.common.status.active": "Active",
    "business.common.status.inactive": "Inactive",
    "business.common.price": "Price",
    "business.common.description": "Description",
    "business.common.category": "Category",
    "business.common.submit": "Submit",
    "business.common.saving": "Saving...",
    "business.common.name": "Name",
    "business.common.type": "Type",
    "business.common.selectType": "Select type",
    "business.common.capacity": "Capacity",
    "business.common.featured": "Featured",
    "business.common.popular": "Popular",
    "business.common.location": "Location",
    "business.common.address": "Address",
    "business.common.city": "City",
    "business.common.state": "State/Province",
    "business.common.zip": "ZIP / Postal Code",
    "business.common.country": "Country",
    "business.common.dragPhotos": "Drag and drop your photos here or click to upload",
    "business.common.photoRequirements": "Photos should be high-quality. Recommended size: 1200x800px.",
    "business.common.noItems": "No items found",
    "business.common.viewDetails": "View Details",

    // Common pricing types
    "business.pricing.fixed": "Fixed Price",
    "business.pricing.hourly": "Per Hour",
    "business.pricing.perPerson": "Per Person",
    "business.pricing.custom": "Custom",
    "business.pricing.perDay": "Per Day",

    // Common service categories
    "business.categories.catering": "Catering",
    "business.categories.music": "Music / DJ",
    "business.categories.decoration": "Decoration",
    "business.categories.photography": "Photography",
    "business.categories.videography": "Videography",
    "business.categories.transportation": "Transportation",
    "business.categories.security": "Security",
    "business.categories.staffing": "Staffing",
    "business.categories.entertainment": "Entertainment",
    "business.categories.other": "Other",

    "venues.searchBar.title": "Find Your Ideal Venue",
    "venues.searchBar.location": "Location",
    "venues.searchBar.locationPlaceholder": "Where do you need a venue?",
    "venues.searchBar.date": "Date",
    "venues.searchBar.guests": "Guests",
    "venues.searchBar.guestsPlaceholder": "How many people?",
    "venues.searchBar.button": "Search Venues",

    "venues.filters.title": "Filter Results",
    "venues.filters.clearAll": "Clear All",
    "venues.filters.priceRange": "Price Range",
    "venues.filters.priceType": "Price Type",
    "venues.filters.applyFilters": "Apply Filters",

    "venues.filters.priceRange.0": "$0",
    "venues.filters.priceRange.250": "$250",
    "venues.filters.priceRange.500": "$500",

    "venues.filters.priceType.perHour": "Per Hour",
    "venues.filters.priceType.perPerson": "Per Person",
    "venues.filters.priceType.fixed": "Fixed Price",
    "venues.filters.priceType.custom": "Custom",
    "venues.title": "Venues",
    "venues.sort.recommended": "Recommended",
    "venues.sort.newest": "Newest",
    "venues.sort.oldest": "Oldest",
    "venues.sort.priceLowToHigh": "Price: Low to High",
    "venues.sort.priceHighToLow": "Price: High to Low",
    "venues.sort.capacityLowToHigh": "Capacity: Low to High",
    "venues.sort.capacityHighToLow": "Capacity: High to Low",
    "venues.sort.topRated": "Top Rated",

    "venues.venueType": "Venue Type",

    "venues.amenities": "Amenities",
    "venues.amenities.wifi": "Wi-Fi",
    "venues.amenities.parking": "Parking",
    "venues.amenities.soundSystem": "Sound System",
    "venues.amenities.kitchen": "Kitchen",
    "venues.amenities.avEquipment": "A/V Equipment",

    // Common venue types
    "business.venueTypes.ballroom": "Ballroom",
    "business.venueTypes.garden": "Garden/Outdoor",
    "business.venueTypes.rooftop": "Rooftop",
    "business.venueTypes.loft": "Loft",
    "business.venueTypes.hotel": "Hotel",
    "business.venueTypes.restaurant": "Restaurant",
    "business.venueTypes.other": "Other",

    // Business sidebar
    "business.sidebar.dashboard": "Dashboard",
    "business.sidebar.venues": "Venues",
    "business.sidebar.services": "Services",
    "business.sidebar.bookings": "Bookings",
    "business.sidebar.analytics": "Analytics",
    "business.sidebar.messages": "Messages",
    "business.sidebar.settings": "Settings",
    "business.sidebar.help": "Help",
    "business.sidebar.logout": "Logout",



    // Business dashboard
    "business.dashboard.title": "Dashboard",
    "business.dashboard.subtitle": "Overview of your business performance",
    "business.dashboard.totalRevenue": "Total Revenue",
    "business.dashboard.bookings": "Bookings",
    "business.dashboard.venues": "Venues",
    "business.dashboard.customers": "Customers",
    "business.dashboard.fromLastMonth": "from last month",
    "business.dashboard.overview": "Overview",
    "business.dashboard.analytics": "Analytics",
    "business.dashboard.reports": "Reports",
    "business.dashboard.notifications": "Notifications",
    "business.dashboard.recentBookings": "Recent Bookings",
    "business.dashboard.upcomingEvents": "Upcoming Events",
    "business.dashboard.performance": "Performance",
    "business.dashboard.thisMonth": "This Month",
    "business.dashboard.lastMonth": "Last Month",
    "business.dashboard.thisQuarter": "This Quarter",
    "business.dashboard.thisYear": "This Year",
    "business.dashboard.topVenues": "Top Performing Venues",
    "business.dashboard.viewAll": "View All",

    // Business venues management
    "business.venues.title": "My Venues",
    "business.venues.subtitle": "Manage your venues and availability",
    "business.venues.addVenue": "Add Venue",
    "business.venues.searchVenues": "Search venues...",
    "business.venues.allVenues": "All Venues",
    "business.venues.activeVenues": "Active Venues",
    "business.venues.inactiveVenues": "Inactive Venues",
    "business.venues.active": "Active",
    "business.venues.inactive": "Inactive",
    "business.venues.hour": "hr",
    "business.venues.availability": "Availability",
    "business.venues.deleteVenue": "Delete Venue",
    "business.venues.confirmDelete": "Are you sure you want to delete this venue?",
    "business.venues.confirmDeleteDesc": "This action cannot be undone and will remove all data associated with this venue.",
    "business.venues.noVenues": "No venues found",

    // New venue creation
    "business.venueNew.title": "Add New Venue",
    "business.venueNew.subtitle": "Enter the details of your venue",
    "business.venueNew.details": "Venue Details",
    "business.venueNew.basicInfo": "Basic Information",
    "business.venueNew.venueName": "Venue Name",
    "business.venueNew.venueNamePlaceholder": "Enter the name of your venue",
    "business.venueNew.venueType": "Venue Type",
    "business.venueNew.venueTypePlaceholder": "Select the type of your venue",
    "business.venueNew.capacityPlaceholder": "Enter the capacity of your venue",
    "business.venueNew.squareFeet": "Square Feet",
    "business.venueNew.squareFeetPlaceholder": "Enter the square footage of your venue",
    "business.venueNew.size": "Size",
    "business.venueNew.descriptionPlaceholder": "Enter a description of your venue",
    "business.venueNew.sizePlaceholder": "Enter the size of your venue",
    "business.venueNew.addressPlaceholder": "Enter the address of your venue",
    "business.venueNew.cityPlaceholder": "Enter the city of your venue",
    "business.venueNew.statePlaceholder": "Enter the state of your venue",
    "business.venueNew.zipPlaceholder": "Enter the zip code of your venue",
    "business.venueNew.countryPlaceholder": "Enter the country of your venue",
    "business.venueNew.pricing": "Pricing",
    "business.venueNew.pricePerHour": "Price Per Hour",
    "business.venueNew.pricePerPerson": "Price Per Person",
    "business.venueNew.flatFee": "Flat Fee",
    "business.venueNew.basePrice": "Base Price",

    "business.venueNew.minHours": "Minimum Hours",
    "business.venueNew.briefDesc": "Brief Description",
    "business.venueNew.fullDesc": "Full Description",
    "business.venueNew.photos": "Photos",
    "business.venueNew.uploadPhotos": "Upload Photos",
    "business.venueNew.dragDrop": "Drag and drop photos here, or click to browse",
    "business.venueNew.amenities": "Amenities",
    "business.venueNew.availability": "Availability",
    "business.venueNew.rules": "Rules & Requirements",
    "business.venueNew.saveVenue": "Create Venue",
    "business.venueNew.saveAsDraft": "Save as Draft",
    "business.venueNew.mainPhoto": "Main Photo *",
    "business.venueNew.additionalPhotos": "Additional Photos",
    "business.venueNew.addPhoto": "Add Photo",

    // Business bookings
    "business.bookings.title": "Bookings",
    "business.bookings.subtitle": "Manage your venue bookings",
    "business.bookings.upcoming": "Upcoming",
    "business.bookings.past": "Past",
    "business.bookings.all": "All Bookings",
    "business.bookings.pending": "Pending",
    "business.bookings.confirmed": "Confirmed",
    "business.bookings.canceled": "Canceled",
    "business.bookings.bookingID": "Booking ID",
    "business.bookings.customer": "Customer",
    "business.bookings.venue": "Venue",
    "business.bookings.date": "Date",
    "business.bookings.time": "Time",
    "business.bookings.amount": "Amount",
    "business.bookings.filterByDate": "Filter by Date",
    "business.bookings.export": "Export",
    "business.bookings.completed": "Completed",
    "business.bookings.cancelled": "Cancelled",
    "business.bookings.guests": "Guests",
    "business.bookings.total": "Total",
    "business.bookings.actions": "Actions",
    "business.bookings.searchBookings": "Search Bookings",
    "business.bookings.acceptBooking": "Accept Booking",
    "business.bookings.declineBooking": "Decline Booking",
    "business.bookings.cancelBooking": "Cancel Booking",
    "business.bookings.bookingDetails": "Booking Details",

    // Business services management
    "business.services.title": "Available Services",
    "business.services.subtitle": "Enhance your event with our professional add-ons",
    "business.services.addService": "Add Service",
    "business.services.searchServices": "Search Services",
    "business.services.noServices": "No services found",
    "business.services.active": "Active",
    "business.services.inactive": "Inactive",
    "business.services.featured": "Featured",
    "business.services.popular": "Popular",
    "business.services.edit": "Edit",
    "business.services.view": "View",

    // Service creation
    "business.serviceNew.title": "Add New Service",
    "business.serviceNew.subtitle": "Fill in the data to publish your service",
    "business.serviceNew.serviceName": "Service Name",
    "business.serviceNew.serviceNamePlaceholder": "e.g. Premium Catering Service",
    "business.serviceNew.serviceType": "Service Type",
    "business.serviceNew.selectType": "Select Service Type",
    "business.serviceNew.descriptionPlaceholder": "Describe what your service offers",
    "business.serviceNew.price": "Price",
    "business.serviceNew.pricingType": "Pricing Type",
    "business.serviceNew.flatFee": "Fixed Fee",
    "business.serviceNew.serviceImage": "Service Image",
    "business.serviceNew.dragPhotos": "Drag and drop your photos here or click to upload",
    "business.serviceNew.photoRequirements": "Prefer high-quality photos. Recommended size: 1200x800px.",
    "business.serviceNew.saveService": "Save Service",
    "business.serviceNew.other": "Other",
    "business.serviceNew.hourly": "Per Hour",
    "business.serviceNew.perPerson": "Per Person",
    "business.serviceNew.catering": "Catering",
    "business.serviceNew.music": "Music / DJ",
    "business.serviceNew.decoration": "Decoration",
    "business.serviceNew.photography": "Photography",
    "business.serviceNew.videography": "Videography",
    "business.serviceNew.transportation": "Transportation",
    "business.serviceNew.security": "Security",
    "business.serviceNew.staffing": "Staffing",
    "business.serviceNew.entertainment": "Entertainment",
    "business.serviceNew.saving": "Saving...",

    // Business analytics
    "business.analytics.title": "Analytics",
    "business.analytics.subtitle": "Track your business performance",
    "business.analytics.revenue": "Revenue",
    "business.analytics.bookings": "Bookings",
    "business.analytics.overview": "Overview",
    "business.analytics.venues": "Venues",
    "business.analytics.customers": "Customers",
    "business.analytics.timeRange": "Time Range",
    "business.analytics.thisWeek": "This Week",
    "business.analytics.thisMonth": "This Month",
    "business.analytics.lastMonth": "Last Month",
    "business.analytics.thisQuarter": "This Quarter",
    "business.analytics.thisYear": "This Year",
    "business.analytics.custom": "Custom",
    "business.analytics.export": "Export Data",
    "business.analytics.dateRange": "Date Range",
    "business.analytics.totalBookings": "Total Bookings",
    "business.analytics.fromLastMonth": "from last month",
    "business.analytics.averageBookingValue": "Average Booking Value",
    "business.analytics.occupancyRate": "Occupancy Rate",
    "business.analytics.revenueOverTime": "Revenue Over Time",
    "business.analytics.chartPlaceholder": "Chart will appear here",
    "business.analytics.revenueByVenue": "Revenue by Venue",
    "business.analytics.revenueByMonth": "Revenue by Month",

    // Dashboard
    "dashboard.leaveReview": "Leave a Review",
    "dashboard.bookAgain": "Book Again",
    "dashboard.noFavorites": "You have no favorite venues yet.",

    "dashboard.exploreVenues": "Explore Venues",
    "dashboard.accountSettings": "Account Settings",
    "dashboard.name": "Name",
    "dashboard.email": "Email",
    "dashboard.updateProfile": "Update Profile",
    "dashboard.notificationSettings": "Notification Settings",

    "dashboard.emailNotifications": "Email Notifications",
    "dashboard.smsNotifications": "SMS Notifications",
    "dashboard.saveSettings": "Save Settings",

    // Venue details

    "venueBook.title": "Book Your Event",
    "venueBook.subtitle": "Fill in the event details to complete your reservation",

    "venueBook.eventDetails": "Event Details",
    "venueBook.eventType": "Event Type",
    "venueBook.selectEventType": "Select event type",
    "venueBook.dateRange": "Date Range",
    "venueBook.from": "From",
    "venueBook.to": "To",
    "venueBook.duration": "Duration: 3 hours",

    "venueBook.guests": "Guests",
    "venueBook.guestCapacity": "Guest Capacity",

    "venueBook.services": "Extra Services",
    "venueBook.servicesSubtitle": "Choose additional services to enhance your event",

    "venueBook.catering": "Catering",
    "venueBook.cateringDescription": "Choose from a variety of food and drink services",
    "venueBook.fullService": "Full Service",
    "venueBook.buffet": "Buffet",
    "venueBook.cocktailHour": "Cocktail Hour",

    "venueBook.music": "Music",
    "venueBook.musicDescription": "Set the mood with professional music services",
    "venueBook.dj": "DJ",
    "venueBook.liveMusic": "Live Music",

    "venueBook.decoration": "Decoration",
    "venueBook.decorationDescription": "Create the perfect ambiance for your event",
    "venueBook.fullDecoration": "Full Decoration",
    "venueBook.basicDecoration": "Basic Decoration",
    "venueBook.customTheme": "Custom Theme",

    "venueBook.contactDetails": "Contact Details",
    "venueBook.firstName": "First Name",
    "venueBook.lastName": "Last Name",
    "venueBook.email": "Email",
    "venueBook.phone": "Phone",
    "venueBook.additionalInfo": "Additional Info",
    "venueBook.specialRequests": "Special Requests",
    "venueBook.specialRequestsPlaceholder": "Let us know if you have any specific needs",

    "venueBook.summary": "Summary",
    "venueBook.hours": "Hours",
    "venueBook.venueRental": "Venue Rental (3 hours)",
    "venueBook.serviceFee": "Service Fee",
    "venueBook.total": "Total",
    "venueBook.continueToPayment": "Continue to Payment",
    "venueBook.cancellationPolicy": "Cancellation Policy",

    // Home page
    "hero.title": "Find the Perfect Venue for Your Event",
    "hero.subtitle": "Discover and book unique spaces for meetings, celebrations, productions, and more.",
    "search.location": "Where",
    "search.date": "When",
    "search.guests": "How many",
    "search.button": "Search Venues",

    "categories.title": "Explore Venue Categories",
    "categories.subtitle": "Find the perfect space for any occasion",
    "howItWorks.hero.title": "How VenueSpace Works",
    "howItWorks.hero.subtitle": "Booking a venue and customizing your event has never been easier",

    "howItWorks.step1.title": "Search for Venues",
    "howItWorks.step1.description": "Use filters like location, date, and guest count to find the perfect venue",
    "howItWorks.step1.cta": "Explore Venues",

    "howItWorks.step2.title": "Compare and Choose",
    "howItWorks.step2.description": "Review venue details, amenities, photos, and availability to make your pick",
    "howItWorks.step2.cta": "Select Venue",

    "howItWorks.step3.title": "Customize Your Event",
    "howItWorks.step3.description": "Add services like catering, music, decoration, and more to match your event style",
    "howItWorks.step3.cta": "Customize Your Event",

    "howItWorks.step4.title": "Book and Pay Securely",
    "howItWorks.step4.description": "Complete your booking with secure online payment and instant confirmation",
    "howItWorks.step4.cta": "Book and Pay",

    "howItWorks.step5.title": "Enjoy Your Event",
    "howItWorks.step5.description": "Arrive at your venue and enjoy a seamless, unforgettable experience",
    "howItWorks.step5.cta": "Enjoy Your Event",

    "howItWorks.faq.title": "Frequently Asked Questions",
    "howItWorks.faq.q1": "How do I know if a venue is available?",
    "howItWorks.faq.q2": "Can I cancel or reschedule my booking?",
    "howItWorks.faq.q3": "Are additional services optional?",
    "howItWorks.faq.q4": "What payment methods are accepted?",
    "howItWorks.faq.q5": "Is support available during my event?",

    "howItWorks.cta.title": "Ready to plan your perfect event?",
    "howItWorks.cta.button": "Start Booking",


    // Services Hero Section
    "services.hero.title": "Enhance Your Event with Top-Quality Services",
    "services.hero.subtitle": "Explore professional add-ons to make your occasion unforgettable",

    // Catering Services
    "services.catering.title": "Catering Services",
    "services.catering.description": "From intimate gatherings to large celebrations, find catering that suits your needs",

    "services.catering.option1": "Full-Service Catering",
    "services.catering.option1.description": "Complete meal planning and service for any event size",

    "services.catering.option2": "Buffet Catering",
    "services.catering.option2.description": "Self-service buffets ideal for casual or semi-formal events",

    "services.catering.option3": "Beverage Services",
    "services.catering.option3.description": "Bar service with drinks, cocktails, and professional bartenders",

    // Music / DJ Services
    "services.music.title": "Music Services",
    "services.music.description": "Set the mood with our curated music and DJ options",

    "services.music.option1": "Professional DJ",
    "services.music.option1.description": "Experienced DJs with full sound equipment for all occasions",

    "services.music.option2": "Live Band",
    "services.music.option2.description": "Add energy to your event with a live performance",

    "services.music.option3": "Sound System Rental",
    "services.music.option3.description": "Rent high-quality speakers, mixers, and mics for your event",

    // Decoration Services
    "services.decor.title": "Decoration Services",
    "services.decor.description": "Create the perfect atmosphere with our décor experts",

    "services.decor.option1": "Themed Decor",
    "services.decor.option1.description": "Customized decoration based on your event theme",

    "services.decor.option2": "Lighting Design",
    "services.decor.option2.description": "Elegant lighting setups to enhance mood and aesthetics",

    "services.decor.option3": "Floral Arrangements",
    "services.decor.option3.description": "Fresh floral centerpieces and accents for every style",

    // Additional Services
    "services.additional.title": "Additional Services",
    "services.additional.description": "Complete your event with photography, transport, and more",

    "services.additional.photography": "Photography",
    "services.additional.videography": "Videography",
    "services.additional.transportation": "Transportation",
    "services.additional.security": "Security",
    "services.additional.staffing": "Staffing",

    // Call to Action
    "services.cta.title": "Ready to elevate your event?",
    "services.cta.button": "Explore Services",

    // Dashboard and footer
    "dashboard.welcome": "Welcome",
    "dashboard.manageBookings": "Manage Your Bookings",

    "dashboard.bookVenue": "Book a Venue",
    "dashboard.upcomingBookings": "Upcoming Bookings",
    "dashboard.pastBookings": "Past Bookings",
    "dashboard.favorites": "Favorites",
    "dashboard.settings": "Settings",

    "dashboard.viewDetails": "View Details",
    "dashboard.modifyBooking": "Modify Booking",
    "dashboard.cancelBooking": "Cancel Booking",

    "footer.about": "About",
    "footer.aboutUs": "About Us",
    "footer.careers": "Careers",
    "footer.press": "Press",
    "footer.blog": "Blog",
    "footer.support": "Support",
    "footer.helpCenter": "Help Center",
    "footer.safety": "Safety",
    "footer.cancellation": "Cancellation Options",
    "footer.covid": "COVID-19 Information",
    "footer.hosting": "Hosting",
    "footer.hostVenue": "Host a Venue",
    "footer.responsibleHosting": "Responsible Hosting",
    "footer.experiences": "Experiences",
    "footer.resources": "Resources",
    "footer.legal": "Legal",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",
    "footer.cookie": "Cookie Policy",

    "profile.title": "Profile",
    "profile.dashboard": "Dashboard",
    "profile.logout": "Log Out",
    "profile.tabs.personal": "Personal Info",
    "profile.tabs.security": "Security",
    "profile.tabs.notifications": "Notifications",
    "profile.tabs.payment": "Payment Methods",
    "profile.personalInfo": "Personal Information",
    "profile.personalInfoDesc": "Update your details to keep your account current.",
    "profile.fullName": "Full Name",
    "profile.email": "Email",
    "profile.phone": "Phone Number",
    "profile.address": "Address",
    "profile.birthday": "Birthday",
    "profile.edit": "Edit",
    "profile.security": "Security",
    "profile.securityDesc": "Manage your account security settings.",
    "profile.password": "Password",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmPassword": "Confirm Password",
    "profile.updatePassword": "Update Password",
    "profile.twoFactor": "Two-Factor Authentication",
    "profile.twoFactorStatus": "Two-Factor Authentication Status",
    "profile.twoFactorDesc": "Enable or disable two-factor authentication for extra security.",
    "profile.enable": "Enable",
    "profile.notifications": "Notifications",
    "profile.notificationsDesc": "Manage your notification preferences.",
    "profile.notificationChannels": "Notification Channels",
    "profile.emailNotifications": "Email Notifications",
    "profile.emailNotificationsDesc": "Receive notifications via email.",
    "profile.pushNotifications": "Push Notifications",
    "profile.pushNotificationsDesc": "Receive push notifications on your device.",
    "profile.smsNotifications": "SMS Notifications",
    "profile.smsNotificationsDesc": "Receive notifications via SMS.",
    "profile.notificationTypes": "Notification Types",
    "profile.bookingReminders": "Booking Reminders",
    "profile.bookingRemindersDesc": "Get reminders for upcoming bookings.",
    "profile.promotions": "Promotions",
    "profile.promotionsDesc": "Receive promotional offers and discounts.",
    "profile.updates": "Updates",
    "profile.updatesDesc": "Get updates on your account and service changes.",
    "profile.savePreferences": "Save Preferences",
    "profile.paymentMethods": "Payment Methods",
    "profile.paymentMethodsDesc": "Manage your saved payment methods.",
    "profile.savedCards": "Saved Cards",
    "profile.remove": "Remove",
    "profile.addPaymentMethod": "Add Payment Method",
    "profile.billingAddress": "Billing Address",
    "profile.name": "Name",
    "profile.city": "City",
    "profile.zipCode": "Zip Code",
    "profile.country": "Country",
    "profile.saveBillingInfo": "Save Billing Info",
    "checkout.title": "Checkout",
    "checkout.subtitle": "Complete your booking and payment.",
    "checkout.paymentMethod": "Payment Method",
    "checkout.creditCard": "Credit Card",
    "checkout.VisaMastercardAmericanExpress": "Visa, Mastercard, American Express",
    "checkout.nameOnCard": "Name on Card",
    "checkout.cardNumber": "Card Number",
    "checkout.expiry": "Expiry",
    "checkout.cvc": "CVC",
    "checkout.billingAddress": "Billing Address",
    "checkout.firstName": "First Name",
    "checkout.lastName": "Last Name",
    "checkout.address": "Address",
    "checkout.city": "City",
    "checkout.zip": "Zip Code",
    "checkout.country": "Country",
    "checkout.termsAgree": "I agree to the terms and conditions.",
    "checkout.termsDescription": "Read and accept the terms and conditions of the service.",
    "checkout.completeBooking": "Complete Booking",
    "checkout.securePayment": "Secure Payment",
    "checkout.bookingSummary": "Booking Summary",
    "checkout.hours": "hours",
    "checkout.guests": "guests",
    "checkout.venueRental": "Venue Rental",
    "checkout.serviceFee": "Service Fee",
    "checkout.total": "Total",
    "checkout.cancellationPolicy": "Cancellation Policy"



    // ...
  },
  "sq": {
    // Navigation
    "nav.venues": "Vende",
    "nav.services": "Shërbime",
    "nav.howItWorks": "Si Funksionon",
    "nav.dashboard": "Paneli",
    "nav.login": "Hyr",
    "nav.signup": "Regjistrohu",

    // Venues
    "venues.searchBar.title": "Gjej Ambientin Ideal",
    "venues.searchBar.location": "Vendndodhja",
    "venues.searchBar.locationPlaceholder": "Ku dëshironi të jetë ambienti?",
    "venues.searchBar.date": "Data",
    "venues.searchBar.guests": "Të Ftuar",
    "venues.searchBar.guestsPlaceholder": "Sa persona do të jenë?",
    "venues.searchBar.button": "Kërko Ambjente",

    "venues.filters.title": "Filtro Rezultatet",
    "venues.filters.clearAll": "Pastro të Gjitha",
    "venues.filters.priceRange": "Gama e Çmimeve",
    "venues.filters.priceType": "Lloji i Çmimit",
    "venues.title": "Vende",
    "venues.sort.recommended": "Të Rekomanduara",
    "venues.sort.newest": "Më të Reja",
    "venues.sort.oldest": "Më të Vjetra",
    "venues.sort.priceLowToHigh": "Çmimi: Nga i Ulët në të Lartë",
    "venues.sort.priceHighToLow": "Çmimi: Nga i Lartë në të Ulët",
    "venues.sort.capacityLowToHigh": "Kapaciteti: Nga i Ulët në të Lartë",
    "venues.sort.capacityHighToLow": "Kapaciteti: Nga i Lartë në të Ulët",
    "venues.sort.topRated": "Më të Vlerësuara",

    "venues.filters.applyFilters": "Apliko Filtër",

    "venues.venueType": "Lloji i Ambientit",

    "venues.amenities": "Lehtësira",
    "venues.amenities.wifi": "Wi-Fi",
    "venues.amenities.parking": "Parkim",
    "venues.amenities.soundSystem": "Sistem Zëri",
    "venues.amenities.kitchen": "Kuzhinë",
    "venues.amenities.avEquipment": "Pajisje Audio/Video",

    "venues.filters.priceRange.0": "$0",
    "venues.filters.priceRange.250": "$250",
    "venues.filters.priceRange.500": "$500",

    "venues.filters.priceType.perHour": "Për Orë",
    "venues.filters.priceType.perPerson": "Për Person",
    "venues.filters.priceType.fixed": "Çmim Fiks",
    "venues.filters.priceType.custom": "I Personalizuar",

    "venues.venueType.other1": "Tjetër",
    "venues.venueType.other2": "Tjetër",
    "venues.venueType.other3": "Tjetër",
    "venues.venueType.other4": "Tjetër",
    "venues.venueType.gardenOutdoor": "Kopsht / Ambient i Jashtëm",


    // Common elements across the business section
    "business.common.add": "Shto",
    "business.common.edit": "Ndrysho",
    "business.common.delete": "Fshi",
    "business.common.save": "Ruaj",
    "business.common.cancel": "Anulo",
    "business.common.view": "Shiko",
    "business.common.search": "Kërko",
    "business.common.filter": "Filtro",
    "business.common.status": "Statusi",
    "business.common.status.active": "Aktiv",
    "business.common.status.inactive": "Joaktiv",
    "business.common.price": "Çmimi",
    "business.common.description": "Përshkrimi",
    "business.common.category": "Kategoria",
    "business.common.submit": "Dërgo",
    "business.common.saving": "Duke ruajtur...",
    "business.common.name": "Emri",
    "business.common.type": "Lloji",
    "business.common.selectType": "Zgjidh llojin",
    "business.common.capacity": "Kapaciteti",
    "business.common.featured": "I Veçuar",
    "business.common.popular": "Popullor",
    "business.common.location": "Vendndodhja",
    "business.common.address": "Adresa",
    "business.common.city": "Qyteti",
    "business.common.state": "Shteti/Provinca",
    "business.common.zip": "Kodi Postar",
    "business.common.country": "Vendi",
    "business.common.dragPhotos": "Tërhiq dhe lësho fotot këtu ose kliko për të ngarkuar",
    "business.common.photoRequirements": "Fotot duhet të jenë me cilësi të lartë. Madhësia e rekomanduar: 1200x800px.",
    "business.common.noItems": "Nuk u gjetën artikuj",
    "business.common.viewDetails": "Shiko Detajet",

    // Common pricing types
    "business.pricing.fixed": "Çmim Fiks",
    "business.pricing.hourly": "Për Orë",
    "business.pricing.perPerson": "Për Person",
    "business.pricing.custom": "I Personalizuar",
    "business.pricing.perDay": "Për Ditë",

    // Common service categories
    "business.categories.catering": "Katering",
    "business.categories.music": "Muzikë / DJ",
    "business.categories.decoration": "Dekorim",
    "business.categories.photography": "Fotografi",
    "business.categories.videography": "Videografi",
    "business.categories.transportation": "Transport",
    "business.categories.security": "Siguri",
    "business.categories.staffing": "Staf",
    "business.categories.entertainment": "Argëtim",
    "business.categories.other": "Tjetër",

    // Common venue types
    "business.venueTypes.ballroom": "Sallë Banketi",
    "business.venueTypes.garden": "Kopsht/Jashtë",
    "business.venueTypes.rooftop": "Tarracë",
    "business.venueTypes.loft": "Loft",
    "business.venueTypes.hotel": "Hotel",
    "business.venueTypes.restaurant": "Restorant",
    "business.venueTypes.other": "Tjetër",

    // Business sidebar
    "business.sidebar.dashboard": "Paneli",
    "business.sidebar.venues": "Vende",
    "business.sidebar.services": "Shërbime",
    "business.sidebar.bookings": "Rezervime",
    "business.sidebar.analytics": "Analitika",
    "business.sidebar.messages": "Mesazhe",
    "business.sidebar.settings": "Cilësimet",
    "business.sidebar.help": "Ndihmë",
    "business.sidebar.logout": "Dil",

    // Business dashboard
    "business.dashboard.title": "Paneli",
    "business.dashboard.subtitle": "Përmbledhje e performancës së biznesit tuaj",
    "business.dashboard.totalRevenue": "Të Ardhurat Totale",
    "business.dashboard.bookings": "Rezervime",
    "business.dashboard.venues": "Vende",
    "business.dashboard.customers": "Klientë",
    "business.dashboard.fromLastMonth": "nga muaji i kaluar",
    "business.dashboard.overview": "Përmbledhje",
    "business.dashboard.analytics": "Analitika",
    "business.dashboard.reports": "Raporte",
    "business.dashboard.notifications": "Njoftime",
    "business.dashboard.recentBookings": "Rezervimet e Fundit",
    "business.dashboard.upcomingEvents": "Ngjarjet e Ardhshme",
    "business.dashboard.performance": "Performanca",
    "business.dashboard.thisMonth": "Këtë Muaj",
    "business.dashboard.lastMonth": "Muajin e Kaluar",
    "business.dashboard.thisQuarter": "Këtë Tremujor",
    "business.dashboard.thisYear": "Këtë Vit",
    "business.dashboard.topVenues": "Vendet me Performancë më të Lartë",
    "business.dashboard.viewAll": "Shiko të Gjitha",

    // Business venues management
    "business.venues.title": "Vendet e Mia",
    "business.venues.subtitle": "Menaxho vendet dhe disponueshmërinë tënde",
    "business.venues.addVenue": "Shto Vend",
    "business.venues.searchVenues": "Kërko vende...",
    "business.venues.allVenues": "Të Gjitha Vendet",
    "business.venues.activeVenues": "Vende Aktive",
    "business.venues.inactiveVenues": "Vende Joaktive",
    "business.venues.active": "Aktiv",
    "business.venues.inactive": "Joaktiv",
    "business.venues.hour": "orë",
    "business.venues.availability": "Disponueshmëria",
    "business.venues.deleteVenue": "Fshi Vendin",
    "business.venues.confirmDelete": "Jeni të sigurt që dëshironi të fshini këtë vend?",
    "business.venues.confirmDeleteDesc": "Ky veprim nuk mund të zhbëhet dhe do të heqë të gjitha të dhënat e lidhura me këtë vend.",
    "business.venues.noVenues": "Nuk u gjetën vende",

    // New venue creation
    "business.venueNew.title": "Shto Vend të Ri",
    "business.venueNew.subtitle": "Fut detajet e vendit tënd",
    "business.venueNew.details": "Detajet e Vendit",
    "business.venueNew.basicInfo": "Informacioni Bazë",
    "business.venueNew.venueName": "Emri i Vendit",
    "business.venueNew.venueNamePlaceholder": "Fut emrin e vendit tënd",
    "business.venueNew.venueType": "Lloji i Vendit",
    "business.venueNew.venueTypePlaceholder": "Zgjidh llojin e vendit tënd",
    "business.venueNew.capacityPlaceholder": "Fut kapacitetin e vendit tënd",
    "business.venueNew.squareFeet": "Metra Katrorë",
    "business.venueNew.squareFeetPlaceholder": "Fut sipërfaqen e vendit tënd",
    "business.venueNew.size": "Madhësia",
    "business.venueNew.descriptionPlaceholder": "Fut një përshkrim të vendit tënd",
    "business.venueNew.sizePlaceholder": "Fut madhësinë e vendit tënd",
    "business.venueNew.addressPlaceholder": "Fut adresën e vendit tënd",
    "business.venueNew.cityPlaceholder": "Fut qytetin e vendit tënd",
    "business.venueNew.statePlaceholder": "Fut shtetin e vendit tënd",
    "business.venueNew.zipPlaceholder": "Fut kodin postar të vendit tënd",
    "business.venueNew.countryPlaceholder": "Fut vendin e vendit tënd",
    "business.venueNew.pricing": "Çmimet",
    "business.venueNew.pricePerHour": "Çmimi për Orë",
    "business.venueNew.pricePerPerson": "Çmimi për Person",
    "business.venueNew.flatFee": "Tarifë Fikse",
    "business.venueNew.basePrice": "Çmimi Bazë",
    "business.venueNew.minHours": "Orët Minimale",
    "business.venueNew.briefDesc": "Përshkrim i Shkurtër",
    "business.venueNew.fullDesc": "Përshkrim i Plotë",
    "business.venueNew.photos": "Fotot",
    "business.venueNew.uploadPhotos": "Ngarko Fotot",
    "business.venueNew.dragDrop": "Tërhiq dhe lësho fotot këtu, ose kliko për të shfletuar",
    "business.venueNew.amenities": "Komoditetet",
    "business.venueNew.availability": "Disponueshmëria",
    "business.venueNew.rules": "Rregullat dhe Kërkesat",
    "business.venueNew.saveVenue": "Krijo Vend",
    "business.venueNew.saveAsDraft": "Ruaj si Draft",
    "business.venueNew.mainPhoto": "Foto Kryesore *",
    "business.venueNew.additionalPhotos": "Foto Shtesë",
    "business.venueNew.addPhoto": "Shto Foto",

    // Business bookings
    "business.bookings.title": "Rezervimet",
    "business.bookings.subtitle": "Menaxho rezervimet e vendeve të tua",
    "business.bookings.upcoming": "Të Ardhshme",
    "business.bookings.past": "Të Kaluara",
    "business.bookings.all": "Të Gjitha Rezervimet",
    "business.bookings.pending": "Në Pritje",
    "business.bookings.confirmed": "Të Konfirmuara",
    "business.bookings.canceled": "Të Anuluara",
    "business.bookings.bookingID": "ID e Rezervimit",
    "business.bookings.customer": "Klienti",
    "business.bookings.venue": "Vendi",
    "business.bookings.date": "Data",
    "business.bookings.time": "Ora",
    "business.bookings.amount": "Shuma",
    "business.bookings.filterByDate": "Filtro sipas Datës",
    "business.bookings.export": "Eksporto",
    "business.bookings.completed": "Të Përfunduara",
    "business.bookings.cancelled": "Të Anuluara",
    "business.bookings.guests": "Të Ftuar",
    "business.bookings.total": "Totali",
    "business.bookings.actions": "Veprimet",
    "business.bookings.searchBookings": "Kërko Rezervime",
    "business.bookings.acceptBooking": "Prano Rezervimin",
    "business.bookings.declineBooking": "Refuzo Rezervimin",
    "business.bookings.cancelBooking": "Anulo Rezervimin",
    "business.bookings.bookingDetails": "Detajet e Rezervimit",

    // Business services management
    "business.services.title": "Shërbimet e Disponueshme",
    "business.services.subtitle": "Përmirëso ngjarjen tënde me shtesa profesionale",
    "business.services.addService": "Shto Shërbim",
    "business.services.searchServices": "Kërko Shërbime",
    "business.services.noServices": "Nuk u gjetën shërbime",
    "business.services.active": "Aktiv",
    "business.services.inactive": "Joaktiv",
    "business.services.featured": "I Veçuar",
    "business.services.popular": "Popullor",
    "business.services.edit": "Ndrysho",
    "business.services.view": "Shiko",

    // Service creation
    "business.serviceNew.title": "Shto Shërbim të Ri",
    "business.serviceNew.subtitle": "Plotëso të dhënat për të publikuar shërbimin tënd",
    "business.serviceNew.serviceName": "Emri i Shërbimit",
    "business.serviceNew.serviceNamePlaceholder": "p.sh. Shërbim Katering Premium",
    "business.serviceNew.serviceType": "Lloji i Shërbimit",
    "business.serviceNew.selectType": "Zgjidh Llojin e Shërbimit",
    "business.serviceNew.descriptionPlaceholder": "Përshkruaj çfarë ofron shërbimi yt",
    "business.serviceNew.price": "Çmimi",
    "business.serviceNew.pricingType": "Lloji i Çmimit",
    "business.serviceNew.flatFee": "Tarifë Fikse",
    "business.serviceNew.serviceImage": "Imazhi i Shërbimit",
    "business.serviceNew.dragPhotos": "Tërhiq dhe lësho fotot këtu ose kliko për të ngarkuar",
    "business.serviceNew.photoRequirements": "Preferohen foto me cilësi të lartë. Madhësia e rekomanduar: 1200x800px.",
    "business.serviceNew.saveService": "Ruaj Shërbimin",
    "business.serviceNew.other": "Tjetër",
    "business.serviceNew.hourly": "Për Orë",
    "business.serviceNew.perPerson": "Për Person",
    "business.serviceNew.catering": "Katering",
    "business.serviceNew.music": "Muzikë / DJ",
    "business.serviceNew.decoration": "Dekorim",
    "business.serviceNew.photography": "Fotografi",
    "business.serviceNew.videography": "Videografi",
    "business.serviceNew.transportation": "Transport",
    "business.serviceNew.security": "Siguri",
    "business.serviceNew.staffing": "Staf",
    "business.serviceNew.entertainment": "Argëtim",
    "business.serviceNew.saving": "Duke ruajtur...",

    // Dashboard
    "dashboard.leaveReview": "Lër një Vlerësim",
    "dashboard.bookAgain": "Rezervo Përsëri",
    "dashboard.noFavorites": "Nuk keni ende ambiente të preferuara.",

    "dashboard.exploreVenues": "Eksploro Ambientet",
    "dashboard.accountSettings": "Cilësimet e Llogarisë",
    "dashboard.name": "Emri",
    "dashboard.email": "Email",
    "dashboard.updateProfile": "Përditëso Profilin",
    "dashboard.notificationSettings": "Cilësimet e Njoftimeve",

    "dashboard.emailNotifications": "Njoftime me Email",
    "dashboard.smsNotifications": "Njoftime me SMS",
    "dashboard.saveSettings": "Ruaj Cilësimet",
    // Business analytics
    "business.analytics.title": "Analitika",
    "business.analytics.subtitle": "Ndjek performancën e biznesit tënd",
    "business.analytics.revenue": "Të Ardhurat",
    "business.analytics.bookings": "Rezervimet",
    "business.analytics.overview": "Përmbledhje",
    "business.analytics.venues": "Vendet",
    "business.analytics.customers": "Klientët",
    "business.analytics.timeRange": "Diapazoni Kohor",
    "business.analytics.thisWeek": "Këtë Javë",
    "business.analytics.thisMonth": "Këtë Muaj",
    "business.analytics.lastMonth": "Muajin e Kaluar",
    "business.analytics.thisQuarter": "Këtë Tremujor",
    "business.analytics.thisYear": "Këtë Vit",
    "business.analytics.custom": "I Personalizuar",
    "business.analytics.export": "Eksporto të Dhënat",
    "business.analytics.dateRange": "Diapazoni i Datës",
    "business.analytics.totalBookings": "Totali i Rezervimeve",
    "business.analytics.fromLastMonth": "nga muaji i kaluar",
    "business.analytics.averageBookingValue": "Vlera Mesatare e Rezervimit",
    "business.analytics.occupancyRate": "Shkalla e Zënies",
    "business.analytics.revenueOverTime": "Të Ardhurat me Kalimin e Kohës",
    "business.analytics.chartPlaceholder": "Grafiku do të shfaqet këtu",
    "business.analytics.revenueByVenue": "Të Ardhurat sipas Vendit",
    "business.analytics.revenueByMonth": "Të Ardhurat sipas Muajit",

    // Home page
    "hero.title": "Gjej Vendin e Përsosur për Ngjarjen Tënde",
    "hero.subtitle": "Zbuloni dhe rezervoni hapësira unike për takime, festime, prodhime dhe më shumë.",
    "search.location": "Ku",
    "search.date": "Kur",
    "search.guests": "Sa të ftuar",
    "search.button": "Kërko Vende",

    "categories.title": "Eksploro Kategoritë e Vendeve",
    "categories.subtitle": "Gjej hapësirën e përsosur për çdo rast",
    "howItWorks.hero.title": "Si Funksionon VenueSpace",
    "howItWorks.hero.subtitle": "Rezervimi i një vendi dhe personalizimi i ngjarjes tënde kurrë nuk ka qenë më i lehtë",

    "howItWorks.step1.title": "Kërko për Vende",
    "howItWorks.step1.description": "Përdor filtra si vendndodhja, data dhe numri i të ftuarve për të gjetur vendin e përsosur",
    "howItWorks.step1.cta": "Eksploro Vendet",

    "howItWorks.step2.title": "Krahasoni dhe Zgjidhni",
    "howItWorks.step2.description": "Shqyrto detajet e vendit, komoditetet, fotot dhe disponueshmërinë për të bërë zgjedhjen tënde",
    "howItWorks.step2.cta": "Zgjidh Vendin",

    "howItWorks.step3.title": "Personalizo Ngjarjen Tënde",
    "howItWorks.step3.description": "Shto shërbime si katering, muzikë, dekorim dhe më shumë për të përshtatur stilin e ngjarjes tënde",
    "howItWorks.step3.cta": "Personalizo Ngjarjen Tënde",

    "howItWorks.step4.title": "Rezervo dhe Paguaj në mënyrë të Sigurt",
    "howItWorks.step4.description": "Përfundo rezervimin tënd me pagesë të sigurt online dhe konfirmim të menjëhershëm",
    "howItWorks.step4.cta": "Rezervo dhe Paguaj",

    "howItWorks.step5.title": "Shijo Ngjarjen Tënde",
    "howItWorks.step5.description": "Mbërri në vendin tënd dhe shijo një përvojë të qetë dhe të paharrueshme",
    "howItWorks.step5.cta": "Shijo Ngjarjen Tënde",

    "howItWorks.faq.title": "Pyetjet e Shpeshta",
    "howItWorks.faq.q1": "Si e di nëse një vend është i disponueshëm?",
    "howItWorks.faq.q2": "A mund të anulohet ose të riprogramohet rezervimi im?",
    "howItWorks.faq.q3": "A janë shërbimet shtesë opsionale?",
    "howItWorks.faq.q4": "Cilat metoda pagese pranohen?",
    "howItWorks.faq.q5": "A ofrohet mbështetje gjatë ngjarjes sime?",

    "howItWorks.cta.title": "Gati për të planifikuar ngjarjen tënde të përsosur?",
    "howItWorks.cta.button": "Fillo Rezervimin",

    // Services Hero Section
    "services.hero.title": "Përmirëso Ngjarjen Tënde me Shërbime të Cilësisë së Lartë",
    "services.hero.subtitle": "Eksploro shtesa profesionale për ta bërë rastin tënd të paharrueshëm",

    // Catering Services
    "services.catering.title": "Shërbime Katering",
    "services.catering.description": "Nga tubime intime deri te festime të mëdha, gjej katering që i përshtatet nevojave të tua",

    "services.catering.option1": "Katering me Shërbim të Plotë",
    "services.catering.option1.description": "Planifikim dhe shërbim i plotë i ushqimit për çdo madhësi ngjarjeje",

    "services.catering.option2": "Katering Buffet",
    "services.catering.option2.description": "Bufetë vetë-shërbyese ideale për ngjarje të rastësishme ose gjysmë-formale",

    "services.catering.option3": "Shërbime Pijesh",
    "services.catering.option3.description": "Shërbim bari me pije, kokteje dhe banakierë profesionistë",

    // Music / DJ Services
    "services.music.title": "Shërbime Muzikore",
    "services.music.description": "Krijo atmosferën e duhur me opsionet tona të kuruara të muzikës dhe DJ-ve",

    "services.music.option1": "DJ Profesionist",
    "services.music.option1.description": "DJ me përvojë me pajisje të plota zëri për të gjitha rastet",

    "services.music.option2": "Bandë Live",
    "services.music.option2.description": "Shto energji në ngjarjen tënde me një performancë live",

    "services.music.option3": "Marrja me Qira e Sistemit të Zërit",
    "services.music.option3.description": "Merr me qira altoparlantë, miksera dhe mikrofona me cilësi të lartë për ngjarjen tënde",

    // Decoration Services
    "services.decor.title": "Shërbime Dekorimi",
    "services.decor.description": "Krijo atmosferën e përsosur me ekspertët tanë të dekorit",

    "services.decor.option1": "Dekor me Temë",
    "services.decor.option1.description": "Dekorim i personalizuar bazuar në temën e ngjarjes tënde",

    "services.decor.option2": "Dizajn Ndriçimi",
    "services.decor.option2.description": "Ndriçim elegant për të përmirësuar humorin dhe estetikën",

    "services.decor.option3": "Arranzhime Lulesh",
    "services.decor.option3.description": "Qendra dhe aksentë me lule të freskëta për çdo stil",

    // Additional Services
    "services.additional.title": "Shërbime Shtesë",
    "services.additional.description": "Përfundo ngjarjen tënde me fotografi, transport dhe më shumë",

    "services.additional.photography": "Fotografi",
    "services.additional.videography": "Videografi",
    "services.additional.transportation": "Transport",
    "services.additional.security": "Siguri",
    "services.additional.staffing": "Staf",

    // Call to Action
    "services.cta.title": "Gati për të ngritur ngjarjen tënde në një nivel tjetër?",
    "services.cta.button": "Eksploro Shërbimet",


    "venueBook.title": "Rezervo Eventin",
    "venueBook.subtitle": "Plotësoni detajet për të përfunduar rezervimin",

    "venueBook.eventDetails": "Detajet e Eventit",
    "venueBook.eventType": "Lloji i Eventit",
    "venueBook.selectEventType": "Zgjidh llojin e eventit",
    "venueBook.dateRange": "Data",
    "venueBook.from": "Nga",
    "venueBook.to": "Deri më",
    "venueBook.duration": "Kohëzgjatja: 3 orë",

    "venueBook.guests": "Të Ftuar",
    "venueBook.guestCapacity": "Kapaciteti i të Ftuarve",

    "venueBook.services": "Shërbime Shtesë",
    "venueBook.servicesSubtitle": "Zgjidhni shërbime shtesë për të përmirësuar eventin tuaj",

    "venueBook.catering": "Katering",
    "venueBook.cateringDescription": "Zgjidhni nga një gamë e gjerë ushqimesh dhe pijesh",
    "venueBook.fullService": "Shërbim i Plotë",
    "venueBook.buffet": "Bufe",
    "venueBook.cocktailHour": "Orë Kokteji",

    "venueBook.music": "Muzikë",
    "venueBook.musicDescription": "Krijoni atmosferën perfekte me shërbime profesionale muzike",
    "venueBook.dj": "DJ",
    "venueBook.liveMusic": "Muzikë Live",

    "venueBook.decoration": "Dekorim",
    "venueBook.decorationDescription": "Krijoni ambientin ideal për eventin tuaj",
    "venueBook.fullDecoration": "Dekorim i Plotë",
    "venueBook.basicDecoration": "Dekorim Bazë",
    "venueBook.customTheme": "Temë e Personalizuar",

    "venueBook.contactDetails": "Detajet e Kontaktit",
    "venueBook.firstName": "Emri",
    "venueBook.lastName": "Mbiemri",
    "venueBook.email": "Email",
    "venueBook.phone": "Telefoni",
    "venueBook.additionalInfo": "Informacione Shtesë",
    "venueBook.specialRequests": "Kërkesa të Veçanta",
    "venueBook.specialRequestsPlaceholder": "Na tregoni nëse keni ndonjë kërkesë specifike",

    "venueBook.summary": "Përmbledhje",
    "venueBook.hours": "Orë",
    "venueBook.venueRental": "Qira Ambienti (3 orë)",
    "venueBook.serviceFee": "Tarifë Shërbimi",
    "venueBook.total": "Totali",
    "venueBook.continueToPayment": "Vazhdo te Pagesa",
    "venueBook.cancellationPolicy": "Politika e Anulimit",
    "dashboard.welcome": "Mirë se vini",
    "dashboard.manageBookings": "Menaxho Rezervimet Tuaja",

    "dashboard.bookVenue": "Rezervo një Ambient",
    "dashboard.upcomingBookings": "Rezervime të Ardhshme",
    "dashboard.pastBookings": "Rezervime të Kaluara",
    "dashboard.favorites": "Të Preferuarat",
    "dashboard.settings": "Cilësimet",

    "dashboard.viewDetails": "Shiko Detajet",
    "dashboard.modifyBooking": "Ndrysho Rezervimin",
    "dashboard.cancelBooking": "Anulo Rezervimin",

    "footer.about": "Rreth Nesh",
    "footer.aboutUs": "Kush Jemi",
    "footer.careers": "Karriera",
    "footer.press": "Shtypi",
    "footer.blog": "Blogu",
    "footer.support": "Mbështetje",
    "footer.helpCenter": "Qendra e Ndihmës",
    "footer.safety": "Siguria",
    "footer.cancellation": "Opsionet e Anulimit",
    "footer.covid": "Informacione për COVID-19",
    "footer.hosting": "Pritje",
    "footer.hostVenue": "Ofro Ambientin Tënd",
    "footer.responsibleHosting": "Pritje me Përgjegjësi",
    "footer.experiences": "Eksperiencat",
    "footer.resources": "Burime",
    "footer.legal": "Ligjore",
    "footer.terms": "Kushtet e Shërbimit",
    "footer.privacy": "Politika e Privatësisë",
    "footer.cookie": "Politika e Cookie-ve",
    "profile.title": "Profili",
    "profile.dashboard": "Paneli",
    "profile.logout": "Dil",
    "profile.tabs.personal": "Të Dhënat Personale",
    "profile.tabs.security": "Siguria",
    "profile.tabs.notifications": "Njoftimet",
    "profile.tabs.payment": "Metodat e Pagesës",
    "profile.personalInfo": "Informacioni Personal",
    "profile.personalInfoDesc": "Përditësoni të dhënat tuaja për të mbajtur llogarinë të saktë.",
    "profile.fullName": "Emër dhe Mbiemër",
    "profile.email": "Email",
    "profile.phone": "Numri i Telefonit",
    "profile.address": "Adresa",
    "profile.birthday": "Data e Lindjes",
    "profile.edit": "Përditëso",
    "profile.security": "Siguria",
    "profile.securityDesc": "Menaxho cilësimet e sigurisë së llogarisë tënde.",
    "profile.password": "Fjalëkalimi",
    "profile.currentPassword": "Fjalëkalimi aktual",
    "profile.newPassword": "Fjalëkalimi i ri",
    "profile.confirmPassword": "Konfirmo fjalëkalimin",
    "profile.updatePassword": "Përditëso fjalëkalimin",
    "profile.twoFactor": "Autentifikimi me dy faktorë",
    "profile.twoFactorStatus": "Statusi i autentifikimit me dy faktorë",
    "profile.twoFactorDesc": "Aktivizo ose çaktivizo autentifikimin me dy faktorë për siguri shtesë.",
    "profile.enable": "Aktivizo",
    "profile.notifications": "Njoftimet",
    "profile.notificationsDesc": "Menaxho preferencat e njoftimeve.",
    "profile.notificationChannels": "Kanale njoftimesh",
    "profile.emailNotifications": "Njoftime me email",
    "profile.emailNotificationsDesc": "Merr njoftime përmes email-it.",
    "profile.pushNotifications": "Njoftime push",
    "profile.pushNotificationsDesc": "Merr njoftime push në pajisjen tënde.",
    "profile.smsNotifications": "Njoftime SMS",
    "profile.smsNotificationsDesc": "Merr njoftime përmes SMS.",
    "profile.notificationTypes": "Llojet e njoftimeve",
    "profile.bookingReminders": "Kujtues të rezervimeve",
    "profile.bookingRemindersDesc": "Merr kujtues për rezervimet e ardhshme.",
    "profile.promotions": "Promovime",
    "profile.promotionsDesc": "Merr oferta promocionale dhe zbritje.",
    "profile.updates": "Përditësime",
    "profile.updatesDesc": "Merr përditësime për llogarinë dhe ndryshimet e shërbimit.",
    "profile.paymentMethods": "Metoda të pagesës",
    "profile.paymentMethodsDesc": "Menaxho metodat e ruajtura të pagesës.",
    "profile.savedCards": "Kartat e ruajtura",
    "profile.remove": "Fshi",
    "profile.addPaymentMethod": "Shto metodë pagese",
    "profile.billingAddress": "Adresa e faturimit",
    "profile.name": "Emri",
    "profile.city": "Qyteti",
    "profile.zipCode": "Kodi postar",
    "profile.country": "Vendi",
    "profile.saveBillingInfo": "Ruaj informacionet e faturimit",

    // Checkout
    "checkout.title": "Paguaj",
    "checkout.subtitle": "Përfundo rezervimin dhe pagesën.",
    "checkout.paymentMethod": "Metoda e pagesës",
    "checkout.creditCard": "Kartë krediti",
    "checkout.VisaMastercardAmericanExpress": "Visa, Mastercard, American Express",
    "checkout.nameOnCard": "Emri në kartë",
    "checkout.cardNumber": "Numri i kartës",
    "checkout.expiry": "Afati i skadencës",
    "checkout.cvc": "CVC",
    "checkout.billingAddress": "Adresa e faturimit",
    "checkout.firstName": "Emri",
    "checkout.lastName": "Mbiemri",
    "checkout.address": "Adresa",
    "checkout.city": "Qyteti",
    "checkout.zip": "Kodi postar",
    "checkout.country": "Vendi",
    "checkout.termsAgree": "Pajtohem me kushtet dhe rregullat.",
    "checkout.termsDescription": "Lexoni dhe pranoni kushtet dhe rregullat e shërbimit.",
    "checkout.completeBooking": "Përfundo rezervimin",
    "checkout.securePayment": "Pagesë e sigurt",
    "checkout.bookingSummary": "Përmbledhje e rezervimit",
    "checkout.hours": "orë",
    "checkout.guests": "mysafirë",
    "checkout.venueRental": "Qiraja e vendit",
    "checkout.serviceFee": "Tarifa e shërbimit",
    "checkout.total": "Totali",
    "checkout.cancellationPolicy": "Politika e anulimit"



  }
}

// Define the interface for the language context
interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => { },
  t: () => "",
})

// Provider component that wraps your app and makes the language context available
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Translation function that accepts optional parameters for interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Get the translation
    const translation = translations[language]?.[key] || key

    // If no params provided or no interpolation needed, return the translation as is
    if (!params || !translation.includes("{{")) {
      return translation
    }

    // Interpolate the parameters
    return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
      const regex = new RegExp(`{{${paramKey}}}`, "g")
      return result.replace(regex, String(paramValue))
    }, translation)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}