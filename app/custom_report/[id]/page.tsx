"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { SimpleCard } from "@/lib/types";
import { allCards } from "@/lib/cards";

export default function CardDetailPage() {
  const [card, setCard] = useState<SimpleCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { filteredCards, setFilteredCards, isAuthValid } = useAppStore();

  useEffect(() => {
    // Check if we have valid auth
    if (!isAuthValid()) {
      toast.error("Session Expired", {
        description: "Please reconnect to continue",
      });
      router.push("/");
      return;
    }

    // Initialize cards if filteredCards is empty
    if (filteredCards.length === 0) {
      setFilteredCards(allCards);
    }

    // Find the specific card
    const cardId = params.id as string;
    // Try to find card by numeric ID first
    const foundCard = (
      filteredCards.length > 0 ? filteredCards : allCards
    ).find((c) => c.id === cardId || c.id === String(parseInt(cardId, 10)));

    if (foundCard) {
      setCard(foundCard);
      // Update URL to numeric ID without triggering navigation
      if (foundCard.id !== cardId) {
        window.history.replaceState({}, "", `/custom_report/${foundCard.id}`);
      }
    } else {
      toast.error("Card Not Found", {
        description: "The requested card could not be found",
      });
      router.push("/search");
      return;
    }

    setIsLoading(false);
  }, [params.id, router, filteredCards, setFilteredCards, isAuthValid]);

  const goBackToSearch = () => {
    router.push("/search");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading card details...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Card Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The requested card could not be found.
            </p>
            <Button onClick={goBackToSearch}>Back to Search</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{card?.name}</h1>
            <p className="text-muted-foreground mt-2">{card?.description}</p>
          </div>
          <Button
            onClick={goBackToSearch}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </div>

        <div className="">{card && <card.component />}</div>
      </div>
    </div>
  );
}
