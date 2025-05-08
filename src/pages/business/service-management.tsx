"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import { Search, Plus, Filter, Edit, Trash2, Eye, CheckCircle, XCircle, Utensils, Music, Palette, Camera, Video, Car, Shield, Users, DollarSign, Clock, User } from 'lucide-react'
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Link } from "react-router-dom"
import { ServiceNewModal } from "./service-new"

export default function ServicesManagementPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)

  // Sample services data
  const services = [
    {
      id: 1,
      name: "Premium Catering Service",
      category: "catering",
      description: "Full-service catering for events of all sizes with customizable menus.",
      priceType: "perPerson",
      price: 45,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Catering",
      icon: Utensils,
      featured: true,
      popular: true
    },
    {
      id: 2,
      name: "Professional DJ Services",
      category: "music",
      description: "Experienced DJs with professional equipment for any event type.",
      priceType: "hourly",
      price: 120,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=DJ",
      icon: Music,
      featured: true,
      popular: false
    },
    {
      id: 3,
      name: "Event Photography",
      category: "photography",
      description: "Professional photography services to capture your special moments.",
      priceType: "fixed",
      price: 500,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Photography",
      icon: Camera,
      featured: false,
      popular: true
    },
    {
      id: 4,
      name: "Luxury Transportation",
      category: "transportation",
      description: "Premium transportation services for guests and VIPs.",
      priceType: "fixed",
      price: 350,
      status: "inactive",
      image: "/placeholder.svg?height=200&width=300&text=Transportation",
      icon: Car,
      featured: false,
      popular: false
    },
    {
      id: 5,
      name: "Event Decoration",
      category: "decoration",
      description: "Custom decoration services to transform your venue.",
      priceType: "fixed",
      price: 800,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Decoration",
      icon: Palette,
      featured: true,
      popular: true
    },
    {
      id: 6,
      name: "Event Videography",
      category: "videography",
      description: "Professional video services to document your event.",
      priceType: "hourly",
      price: 150,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Videography",
      icon: Video,
      featured: false,
      popular: false
    },
    {
      id: 7,
      name: "Security Personnel",
      category: "security",
      description: "Professional security staff for event safety.",
      priceType: "hourly",
      price: 35,
      status: "inactive",
      image: "/placeholder.svg?height=200&width=300&text=Security",
      icon: Shield,
      featured: false,
      popular: false
    },
    {
      id: 8,
      name: "Event Staff",
      category: "staffing",
      description: "Professional event staff including servers, bartenders, and hosts.",
      priceType: "perPerson",
      price: 25,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Staffing",
      icon: Users,
      featured: false,
      popular: true
    }
  ]

  // Filter services based on search query, categories, price types, and statuses
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category)
    
    const matchesPriceType = selectedPriceTypes.length === 0 || selectedPriceTypes.includes(service.priceType)
    
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(service.status)
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "active" && service.status === "active") ||
                      (activeTab === "inactive" && service.status === "inactive") ||
                      (activeTab === "featured" && service.featured) ||
                      (activeTab === "popular" && service.popular)
    
    return matchesSearch && matchesCategory && matchesPriceType && matchesStatus && matchesTab
  })

  // Get icon component based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "catering": return Utensils
      case "music": return Music
      case "decoration": return Palette
      case "photography": return Camera
      case "videography": return Video
      case "transportation": return Car
      case "security": return Shield
      case "staffing": return Users
      default: return Utensils
    }
  }

  // Get price display based on price type
  const getPriceDisplay = (priceType: string, price: number) => {
    switch (priceType) {
      case "hourly": return `$${price}/${t("business.pricing.hourly")}`
      case "perPerson": return `$${price}/${t("business.pricing.perPerson")}`
      case "fixed": return `$${price} ${t("business.pricing.fixed")}`
      default: return `$${price}`
    }
  }

  return (
    <BusinessLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("business.services.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("business.services.subtitle")}</p>
        </div>
        <Button onClick={() => setIsAddServiceModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("business.services.addService")}
        </Button>
      </div>

      {/* Service New Modal */}
      <ServiceNewModal 
        isOpen={isAddServiceModalOpen} 
        onClose={() => setIsAddServiceModalOpen(false)} 
      />

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("business.services.searchServices")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                {t("business.common.filter")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{t("business.common.category")}</h3>
                <div className="space-y-2">
                  {["catering", "music", "decoration", "photography", "videography", "transportation", "security", "staffing"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`} 
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category])
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category))
                          }
                        }}
                      />
                      <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                        {t(`business.categories.${category}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("business.common.price")}</h3>
                <div className="space-y-2">
                  {["fixed", "hourly", "perPerson"].map((priceType) => (
                    <div key={priceType} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`price-${priceType}`} 
                        checked={selectedPriceTypes.includes(priceType)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPriceTypes([...selectedPriceTypes, priceType])
                          } else {
                            setSelectedPriceTypes(selectedPriceTypes.filter(p => p !== priceType))
                          }
                        }}
                      />
                      <label htmlFor={`price-${priceType}`} className="text-sm cursor-pointer">
                        {t(`business.pricing.${priceType}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("business.common.status")}</h3>
                <div className="space-y-2">
                  {["active", "inactive"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`} 
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStatuses([...selectedStatuses, status])
                          } else {
                            setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                          }
                        }}
                      />
                      <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                        {t(`business.common.status.${status}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <div className="space-y-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 h-10">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">{t("business.common.status.active")}</TabsTrigger>
              <TabsTrigger value="inactive">{t("business.common.status.inactive")}</TabsTrigger>
              <TabsTrigger value="featured">{t("business.common.featured")}</TabsTrigger>
              <TabsTrigger value="popular">{t("business.common.popular")}</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
                      <div className="aspect-video relative">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="object-cover w-full h-full"
                        />
                        <Badge className={`absolute top-2 right-2 ${service.status === 'active' ? 'bg-success hover:bg-success/80' : 'bg-muted-foreground hover:bg-muted-foreground/80'}`}>
                          {t(`business.common.status.${service.status}`)}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <service.icon className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {t(`business.categories.${service.category}`)}
                          </Badge>
                          <span className="font-medium">
                            {getPriceDisplay(service.priceType, service.price)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="mr-2 h-4 w-4" />
                          {t("business.common.edit")}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          {t("business.common.view")}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">
                      {t("business.common.noItems")}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              {/* Same structure as "all" tab but filtered for active services */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
                      <div className="aspect-video relative">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="object-cover w-full h-full"
                        />
                        <Badge className={`absolute top-2 right-2 ${service.status === 'active' ? 'bg-success hover:bg-success/80' : 'bg-muted-foreground hover:bg-muted-foreground/80'}`}>
                          {t(`business.common.status.${service.status}`)}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <service.icon className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {t(`business.categories.${service.category}`)}
                          </Badge>
                          <span className="font-medium">
                            {getPriceDisplay(service.priceType, service.price)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="mr-2 h-4 w-4" />
                          {t("business.common.edit")}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          {t("business.common.view")}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">
                      {t("business.common.noItems")}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BusinessLayout>
  )
}
