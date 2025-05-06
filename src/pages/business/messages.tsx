"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Search, Send, Paperclip, MoreVertical, User, Check, CheckCheck, Plus } from 'lucide-react'
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"

export default function MessagesPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageText, setMessageText] = useState("")

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      lastMessage: "Great! I'll see you at the venue tomorrow at 10 AM.",
      timestamp: "10:23 AM",
      unread: true,
      type: "host",
      status: "active"
    },
    {
      id: 2,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40&text=MB",
      lastMessage: "Is the venue available for a corporate event next Friday?",
      timestamp: "Yesterday",
      unread: false,
      type: "guest",
      status: "active"
    },
    {
      id: 3,
      name: "Event Support",
      avatar: "/placeholder.svg?height=40&width=40&text=ES",
      lastMessage: "Your booking #12345 has been confirmed.",
      timestamp: "2 days ago",
      unread: false,
      type: "support",
      status: "active"
    },
    {
      id: 4,
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=DW",
      lastMessage: "Thank you for your help with the booking.",
      timestamp: "1 week ago",
      unread: false,
      type: "guest",
      status: "archived"
    },
    {
      id: 5,
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=40&width=40&text=ED",
      lastMessage: "Can you provide more information about the catering services?",
      timestamp: "1 week ago",
      unread: false,
      type: "guest",
      status: "active"
    }
  ]

  // Sample messages for the selected conversation
  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: "other",
      text: "Hi there! I'm interested in booking your venue for a corporate event next week.",
      timestamp: "10:00 AM",
      status: "read"
    },
    {
      id: 2,
      conversationId: 1,
      sender: "me",
      text: "Hello! Thank you for your interest. We'd be happy to host your event. What date and time are you looking at?",
      timestamp: "10:05 AM",
      status: "read"
    },
    {
      id: 3,
      conversationId: 1,
      sender: "other",
      text: "We're thinking of next Tuesday from 10 AM to 3 PM. Would that work?",
      timestamp: "10:10 AM",
      status: "read"
    },
    {
      id: 4,
      conversationId: 1,
      sender: "me",
      text: "Let me check our availability... Yes, that time slot is available. How many people will be attending?",
      timestamp: "10:15 AM",
      status: "read"
    },
    {
      id: 5,
      conversationId: 1,
      sender: "other",
      text: "We'll have about 30 people. Do you offer catering services as well?",
      timestamp: "10:18 AM",
      status: "read"
    },
    {
      id: 6,
      conversationId: 1,
      sender: "me",
      text: "Yes, we do offer catering services. We have several menu options available. I can send you our catering menu if you'd like.",
      timestamp: "10:20 AM",
      status: "read"
    },
    {
      id: 7,
      conversationId: 1,
      sender: "other",
      text: "That would be great! Also, do you have AV equipment available for presentations?",
      timestamp: "10:22 AM",
      status: "read"
    },
    {
      id: 8,
      conversationId: 1,
      sender: "me",
      text: "Yes, we have a projector, screen, microphone, and sound system available. There's no extra charge for using the equipment.",
      timestamp: "10:23 AM",
      status: "sent"
    },
    {
      id: 9,
      conversationId: 1,
      sender: "other",
      text: "Great! I'll see you at the venue tomorrow at 10 AM.",
      timestamp: "10:23 AM",
      status: "delivered"
    }
  ]

  // Filter conversations based on search query and active tab
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "unread" && conversation.unread) ||
                      (activeTab === "hosts" && conversation.type === "host") ||
                      (activeTab === "guests" && conversation.type === "guest") ||
                      (activeTab === "support" && conversation.type === "support") ||
                      (activeTab === "archived" && conversation.status === "archived")
    
    return matchesSearch && matchesTab
  })

  // Get messages for the selected conversation
  const conversationMessages = messages.filter(message => message.conversationId === selectedConversation)

  // Handle sending a new message
  const handleSendMessage = () => {
    if (messageText.trim() === "") return
    
    // In a real app, you would send the message to the server here
    console.log("Sending message:", messageText)
    
    // Clear the input field
    setMessageText("")
  }

  return (
    <BusinessLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("messages.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("messages.subtitle")}</p>
        <Button className="mt-4" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("messages.newMessage")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Conversations List */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("messages.search")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 h-9">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedConversation === conversation.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-muted/50"
                  } ${conversation.unread ? "border-l-4 border-l-primary" : "border"}`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                          conversation.status === "active" ? "bg-success" : "bg-muted"
                        }`}
                      ></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.name}</p>
                        <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">{t("messages.noMessages")}</h3>
                <p className="text-muted-foreground mt-1">
                  {t("messages.noMessages")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Conversation */}
        <Card>
          {selectedConversation ? (
            <>
              <CardHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={conversations.find(c => c.id === selectedConversation)?.avatar || "/placeholder.svg"}
                      alt={conversations.find(c => c.id === selectedConversation)?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </CardTitle>
                      <CardDescription>
                        {t(`messages.${conversations.find(c => c.id === selectedConversation)?.type}`)}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.sender === "me" ? "message-sent" : "message-received"
                      }`}
                    >
                      <div className="flex flex-col">
                        <p>{message.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          {message.sender === "me" && (
                            message.status === "read" ? (
                              <CheckCheck className="h-3 w-3 text-primary" />
                            ) : message.status === "delivered" ? (
                              <CheckCheck className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <Check className="h-3 w-3 text-muted-foreground" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder={t("messages.typeMessage")}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button className="shrink-0" onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    {t("messages.send")}
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 h-[500px] text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">{t("messages.noConversation")}</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                {t("messages.noConversation")}
              </p>
            </div>
          )}
        </Card>
      </div>
    </BusinessLayout>
  )
}
