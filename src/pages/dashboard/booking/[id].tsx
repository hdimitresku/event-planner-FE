// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Button } from "../../../components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
// import { Badge } from "../../../components/ui/badge"
// import { Textarea } from "../../../components/ui/textarea"
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   User,
//   CreditCard,
//   DollarSign,
//   MessageSquare,
//   ArrowLeft,
//   Star,
//   Edit,
//   Save,
//   X,
//   Phone,
// } from "lucide-react"
// import { Checkbox } from "../../../components/ui/checkbox"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
// import { Input } from "../../../components/ui/input"

// export default function BookingDetailPage() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [booking, setBooking] = useState<any>(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isReviewing, setIsReviewing] = useState(false)
//   const [reviewRating, setReviewRating] = useState(5)
//   const [reviewComment, setReviewComment] = useState("")
//   const [editedBooking, setEditedBooking] = useState<any>(null)

//   // Mock data - in a real app, you would fetch this from an API
//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       const mockBookings = [
//         {
//           id: "1",
//           venue: "Grand Ballroom",
//           date: "2023-06-15",
//           time: "18:00 - 22:00",
//           location: "123 Main St, New York, NY",
//           image: "/placeholder.svg?height=300&width=500",
//           status: "confirmed",
//           price: 1200,
//           guests: 100,
//           services: ["Catering", "DJ Services", "Decoration"],
//           specialRequests: "Please arrange tables in a U-shape configuration.",
//           contactPerson: "John Smith",
//           contactEmail: "john@example.com",
//           contactPhone: "+1 (555) 123-4567",
//           hasReview: false
//         },
//         {
//           id: "2",
//           venue: "Garden Terrace",
//           date: "2023-07-20",
//           time: "12:00 - 16:00",
//           location: "456 Park Ave, New York, NY",
//           image: "/placeholder.svg?height=300&width=500",
//           status: "pending",
//           price: 800,
//           guests: 50,
//           services: ["Catering", "Photography"],
//           specialRequests: "Vegetarian menu options required.",
//           contactPerson: "Jane Doe",
//           contactEmail: "jane@example.com",
//           contactPhone: "+1 (555) 987-6543",
//           hasReview: false
//         },
//         {
//           id: "3",
//           venue: "Skyline Loft",
//           date: "2023-03-10",
//           time: "19:00 - 23:00",
//           location: "789 Broadway, New York, NY",
//           image: "/placeholder.svg?height=300&width=500",
//           status: "completed",
//           price: 950,
//           guests: 75,
//           services: ["Full Service Package", "Valet Parking"],
//           specialRequests: "None",
//           contactPerson: "Robert Johnson",
//           contactEmail: "robert@example.com",
//           contactPhone: "+1 (555) 456-7890",
//           hasReview: false
//         },
//       ]

//       const foundBooking = mockBookings.find(b => b.id === id)
//       setBooking(foundBooking)
//       setEditedBooking(foundBooking ? {...foundBooking} : null)
//     }, 500)
//   }, [id])

//   const handleSaveChanges = () => {
//     // In a real app, you would send this to your API
//     setBooking(editedBooking)
//     setIsEditing(false)
//     alert("Booking updated successfully!")
//   }

//   const handleSubmitReview = () => {
//     // In a real app, you would send this to your API
//     setBooking({
//       ...booking,
//       hasReview: true
//     })
//     setIsReviewing(false)
//     alert("Thank you for your review!")
//   }

//   const handleCancelBooking = () => {
//     if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
//       // In a real app, you would call your API to cancel the booking
//       alert("Booking cancelled successfully")
//       navigate("/dashboard")
//     }
//   }

//   if (!booking) {
//     return (
//       <div className="container py-10">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container py-10">
//       <Button 
//         variant="ghost" 
//         className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-50"
//         onClick={() => navigate("/dashboard")}
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" />
//         Back to Dashboard
//       </Button>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
//             <CardHeader className="pb-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-50">
//                     {booking.venue}
//                   </CardTitle>
//                   <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
//                     Booking #{booking.id}
//                   </CardDescription>
//                 </div>
//                 <Badge className={`${
//                   booking.status === "confirmed"
//                     ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400"
//                     : booking.status === "pending"
//                     ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"
//                     : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400"
//                 }`}>
//                   {booking.status === "confirmed"
//                     ? "Confirmed"
//                     : booking.status === "pending"
//                     ? "Pending"
//                     : "Completed"}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <img 
//                   src={booking.image || "/placeholder.svg"} 
//                   alt={booking.venue} 
//                   className="w-full h-64 object-cover rounded-lg"
//                 />
//               </div>

//               <Tabs defaultValue="details">
//                 <TabsList className="bg-gray-100 dark:bg-slate-700">
//                   <TabsTrigger value="details">Details</TabsTrigger>
//                   {isEditing ? (
//                     <TabsTrigger value="edit">Edit Booking</TabsTrigger>
//                   ) : null}
//                   {booking.status === "completed" && !booking.hasReview && !isReviewing ? (
//                     <TabsTrigger value="review">Leave a Review</TabsTrigger>
//                   ) : null}
//                 </TabsList>

//                 <TabsContent value="details" className="pt-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Booking Information</h3>
//                         <div className="space-y-2">
//                           <div className="flex items-center text-sm">
//                             <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">Date: {booking.date}</span>
//                           </div>
//                           <div className="flex items-center text-sm">
//                             <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">Time: {booking.time}</span>
//                           </div>
//                           <div className="flex items-center text-sm">
//                             <MapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">Location: {booking.location}</span>
//                           </div>
//                           <div className="flex items-center text-sm">
//                             <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">Guests: {booking.guests}</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Information</h3>
//                         <div className="space-y-2">
//                           <div className="flex items-center text-sm">
//                             <CreditCard className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">
//                               Payment Status: {booking.status === "confirmed" ? "Paid" : "Pending"}
//                             </span>
//                           </div>
//                           <div className="flex items-center text-sm">
//                             <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">Total: ${booking.price}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Services Included</h3>
//                         <div className="flex flex-wrap gap-2">
//                           {booking.services.map((service: string, index: number) => (
//                             <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
//                               {service}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>

//                       {booking.specialRequests && (
//                         <div>
//                           <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Special Requests</h3>
//                           <p className="text-gray-700 dark:text-gray-300 text-sm">{booking.specialRequests}</p>
//                         </div>
//                       )}

//                       <div>
//                         <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Contact Information</h3>
//                         <div className="space-y-2">
//                           <div className="flex items-center text-sm">
//                             <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">{booking.contactPerson}</span>
//                           </div>
//                           <div className="flex items-center text-sm">
//                             <MessageSquare className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">{booking.contactEmail}</span>
//                           </div>
//                           <div className="flex items-center text-sm">
//                             <Phone className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">{booking.contactPhone}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </TabsContent>

//                 {isEditing && (
//                   <TabsContent value="edit" className="pt-4">
//                     <div className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
//                           <Input 
//                             type="date" 
//                             value={editedBooking.date}
//                             onChange={(e) => setEditedBooking({...editedBooking, date: e.target.value})}
//                             className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
//                           <Input 
//                             type="text" 
//                             value={editedBooking.time}
//                             onChange={(e) => setEditedBooking({...editedBooking, time: e.target.value})}
//                             className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Number of Guests</label>
//                           <Input 
//                             type="number" 
//                             value={editedBooking.guests}
//                             onChange={(e) => setEditedBooking({...editedBooking, guests: Number.parseInt(e.target.value)})}
//                             min="1"
//                             className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</label>
//                           <Input 
//                             type="tel" 
//                             value={editedBooking.contactPhone}
//                             onChange={(e) => setEditedBooking({...editedBooking, contactPhone: e.target.value})}
//                             className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
//                           />
//                         </div>
//                       </div>
                      
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Requests</label>
//                         <Textarea 
//                           value={editedBooking.specialRequests}
//                           onChange={(e) => setEditedBooking({...editedBooking, specialRequests: e.target.value})}
//                           className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 min-h-[100px]"
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Services</label>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                           {["Catering", "DJ Services", "Decoration", "Photography", "Valet Parking", "Full Service Package"].map((service) => (
//                             <div key={service} className="flex items-center space-x-2">
//                               <Checkbox 
//                                 id={`service-${service}`} 
//                                 checked={editedBooking.services.includes(service)}
//                                 onCheckedChange={(checked) => {
//                                   if (checked) {
//                                     setEditedBooking({
//                                       ...editedBooking, 
//                                       services: [...editedBooking.services, service]
//                                     })
//                                   } else {
//                                     setEditedBooking({
//                                       ...editedBooking, 
//                                       services: editedBooking.services.filter((s: string) => s !== service)
//                                     })
//                                   }
//                                 }}
//                               />
//                               <label
//                                 htmlFor={`service-${service}`}
//                                 className="text-sm text-gray-700 dark:text-gray-300"
//                               >
//                                 {service}
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
                      
//                       <div className="flex justify-end space-x-2">
//                         <Button 
//                           variant="outline" 
//                           onClick={() => setIsEditing(false)}
//                           className="flex items-center"
//                         >
//                           <X className="mr-2 h-4 w-4" />
//                           Cancel
//                         </Button>
//                         <Button 
//                           className="bg-sky-500 hover:bg-sky-600 text-white flex items-center"
//                           onClick={handleSaveChanges}
//                         >
//                           <Save className="mr-2 h-4 w-4" />
//                           Save Changes
//                         </Button>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 )}

//                 {booking.status === "completed" && !booking.hasReview && !isReviewing && (
//                   <TabsContent value="review" className="pt-4">
//                     <div className="space-y-4">
//                       <div>
//                         <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</h3>
//                         <div className="flex items-center space-x-1">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                               key={star}
//                               type="button"
//                               onClick={() => setReviewRating(star)}
//                               className="focus:outline-none"
//                             >
//                               <Star 
//                                 className={`h-8 w-8 ${
//                                   star <= reviewRating 
//                                     ? "text-yellow-400 fill-yellow-400" 
//                                     : "text-gray-300 dark:text-gray-600"
//                                 }`} 
//                               />
//                             </button>
//                           ))}
//                         </div>
//                       </div>
                      
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Review</label>
//                         <Textarea 
//                           placeholder="Share your experience with this venue..."
//                           value={reviewComment}
//                           onChange={(e) => setReviewComment(e.target.value)}
//                           className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 min-h-[120px]"
//                         />
//                       </div>
                      
//                       <div className="flex justify-end space-x-2">
//                         <Button 
//                           variant="outline" 
//                           onClick={() => setIsReviewing(false)}
//                           className="flex items-center"
//                         >
//                           <X className="mr-2 h-4 w-4" />
//                           Cancel
//                         </Button>
//                         <Button 
//                           className="bg-sky-500 hover:bg-sky-600 text-white flex items-center"
//                           onClick={handleSubmitReview}
//                           disabled={!reviewComment.trim()}
//                         >
//                           <Star className="mr-2 h-4 w-4" />
//                           Submit Review
//                         </Button>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 )}
//               </Tabs>
//             </CardContent>
//             <CardFooter className="flex justify-between pt-0">
//               <div>
//                 {booking.status !== "completed" && (
//                   <Button 
//                     variant="destructive" 
//                     className="bg-red-500 hover:bg-red-600 text-white"
//                     onClick={handleCancelBooking}
//                   >
//                     Cancel Booking
//                   </Button>
//                 )}
//               </div>
//               <div className="flex space-x-2">
//                 {booking.status !== "completed" && !isEditing && (
//                   <Button 
//                     className="bg-sky-500 hover:bg-sky-600 text-white flex items-center"
//                     onClick={() => setIsEditing(true)}
//                   >
//                     <Edit className="mr-2 h-4 w-4" />
//                     Edit Booking
//                   </Button>
//                 )}
//                 {booking.status === "confirmed" && (
//                   <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
//                     View Invoice
//                   </Button>
//                 )}
//               </div>
//             </CardFooter>
//           </Card>
//         </div>

//         <div className="lg:col-span-1">
//           <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm sticky top-6">
//             <CardHeader>
//               <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-50">
//                 Booking Summary
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-300">Venue</span>
//                 <span className="font-medium text-gray-800 dark:text-gray-50">{booking.venue}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-300">Date</span>
//                 <span className="font-medium text-gray-800 dark:text-gray-50">{booking.date}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-300">Time</span>
//                 <span className="font-medium text-gray-800 dark:text-gray-50">{booking.time}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600 dark:text-gray-300">Guests</span>
//                 <span className="font-medium text-gray-800 dark:text-gray-50">{booking.guests}</span>
//               </div>
//               <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
//                   <span className="font-medium text-gray-800 dark:text-gray-50">${booking.price - 100}</span>
//                 </div>
//                 <div className="flex justify-between items-center mt-1">
//                   <span className="text-gray-600 dark:text-gray-300">Service Fee</span>
//                   <span className="font-medium text-gray-800 dark:text-gray-50">$100</span>
//                 </div>
//                 <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
//                   <span className="text-gray-800 dark:text-gray-50 font-semibold">Total</span>
//                   <span className="font-bold text-lg text-gray-800 dark:text-gray-50">${booking.price}</span>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter>
//               {booking.status === "confirmed" && (
//                 <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
//                   Download Receipt
//                 </Button>
//               )}
//               {booking.status === "pending" && (
//                 <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
//                   Complete Payment
//                 </Button>
//               )}
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
