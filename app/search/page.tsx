"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Clock } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { ThemeToggle } from "@/components/theme-toggle"
import { SimpleCard } from "@/lib/types"
import { allCards } from "@/lib/cards"
import { Badge } from "@/components/ui/badge"

// Mock cards for demonstration
const cards: SimpleCard[] = allCards

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [domain, setDomain] = useState("")
  const router = useRouter()
  
  const {
    filteredCards,
    clearAuth,
    setFilteredCards,
    isAuthValid,
    getDomain
  } = useAppStore()

  useEffect(() => {
    // Check authentication
    if (!isAuthValid()) {
      toast.error("Session Expired", {
        description: "Please reconnect to continue",
      })
      router.push("/")
      return
    }

    const getDomainfromStore = getDomain();
    if (getDomainfromStore) {
      setDomain(getDomainfromStore);
      // Set initial cards
      setFilteredCards(cards);
    }
    setIsLoading(false)
  }, [router, setFilteredCards, isAuthValid, getDomain])

  // Filter cards based on search query
  const handleSearch = (query: string) => {
    setIsSearching(true)
    const filtered = cards.filter(
      card => 
        card.name.toLowerCase().includes(query.toLowerCase()) ||
        card.description.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCards(filtered)
    setIsSearching(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    handleSearch(query)
  }

  const goBackToConnection = () => {
    clearAuth()
    toast.info("Session Cleared", {
      description: "Redirecting to connection page",
    })
    router.push("/")
  }

  // Get expiration time from store state
  const state = useAppStore.getState();
  const expirationTime = state.auth && state.auth.timestamp
    ? new Date(state.auth.timestamp + 24 * 60 * 60 * 1000).toLocaleString()
    : ""

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Search Custom Data</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={goBackToConnection}
              size="sm"
            >
              Change Session
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <Card className="shadow-none border rounded-lg">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">Connected to: {domain}</div>
              <div className="text-sm text-green-500">Secure Session Active</div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Session expires: {expirationTime}</span>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter custom data..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {isSearching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredCards.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="text-lg font-medium">No Results Found</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search query
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => router.push(`/custom_report/${card.id}`)}
              >
                <CardContent className="">
                  <h3 className="font-medium">{card.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {card.description}
                  </p>
                  <div className="flex justify-end mt-4">
                    {card.details?.fileType && (
                      <Badge variant="outline" className="text-xs">
                       {card.details.fileType}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
