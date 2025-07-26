"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

interface SimpleCard {
  id: string
  name: string
  description: string
}

interface SearchPageProps {
  domain: string
  cards: SimpleCard[]
  onBack: () => void
  onProceedToExport: (selectedCards: string[]) => void
  onSearch: (query: string) => void
  onCardClick: (cardId: string) => void
  isSearching: boolean
}

export default function SearchPage({
  domain,
  cards,
  onBack,
  onProceedToExport,
  onSearch,
  onCardClick,
  isSearching,
}: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCards, setSelectedCards] = useState<string[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  const selectAllVisible = () => {
    const visibleIds = cards.map((card) => card.id)
    setSelectedCards(visibleIds)
  }

  const clearSelection = () => {
    setSelectedCards([])
  }

  const handleProceedToExport = () => {
    if (selectedCards.length === 0) {
      toast.error("Please select at least one card to export")
      return
    }
    onProceedToExport(selectedCards)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Export Custom Data</h1>
            <p className="text-gray-600 mt-2">
              Connected to: <span className="font-semibold">{domain}</span>
            </p>
          </div>
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Connection
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>

              {/* Selection Controls */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{cards.length} cards found</span>
                  {selectedCards.length > 0 && (
                    <span className="text-sm font-medium text-blue-600">{selectedCards.length} selected</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={selectAllVisible} variant="outline" size="sm" disabled={cards.length === 0}>
                    Select All
                  </Button>
                  <Button onClick={clearSelection} variant="outline" size="sm" disabled={selectedCards.length === 0}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`hover:shadow-md transition-shadow ${
                selectedCards.includes(card.id) ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Checkbox
                    checked={selectedCards.includes(card.id)}
                    onChange={() => toggleCardSelection(card.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <CardTitle className="text-lg">{card.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{card.description}</p>
                <Button onClick={() => onCardClick(card.id)} variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {cards.length === 0 && !isSearching && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        )}

        {/* Action Bar */}
        {selectedCards.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedCards.length} card{selectedCards.length !== 1 ? "s" : ""} selected
              </span>
              <Button onClick={handleProceedToExport} className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Proceed to Export
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
