"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Ticket, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { setupInitialAuth } from "@/lib/utils"

export default function HomePage() {
  const [domain, setDomain] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const router = useRouter()
  const { isAuthValid } = useAppStore()

  useEffect(() => {
    // Check if already authenticated
    if (isAuthValid()) {
      router.push("/search")
      return
    }
    setIsLoading(false)
  }, [router, isAuthValid])

  // Simulate Freshservice API connection
  const connectToFreshservice = async () => {
    setIsConnecting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const isAuthenticated = await setupInitialAuth( domain, apiKey )

      if(isAuthenticated) {
        toast.success("Connected Successfully", {
          description: `Connected to ${domain} - Data stored securely for 24 hours`,
        })
        router.push("/search")
      }else{
        toast.error("Connection Failed", {
          description: "Please check your domain and API key",
        })
      }
    } catch {
      toast.error("Connection Failed", {
        description: "Something went wrong",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim() || !apiKey.trim()) {
      toast.error("Missing Information", {
        description: "Please enter both Freshservice domain and API key",
      })
      return
    }
    connectToFreshservice()
  }

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Ticket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Freshservice custom data exporter</CardTitle>
          <CardDescription>
            Connect to your Freshservice instance to export custom data to XLSX files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Freshservice Domain</Label>
              <div className="relative">
                <Input
                  id="domain"
                  type="text"
                  placeholder="yourcompany"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  .freshservice.com
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Freshservice API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Find your API key in <Link className="underline underline-offset-2 text-blue-500" target="_blank" href="https://support.freshservice.com/support/solutions/articles/50000000306-where-do-i-find-my-api-key-">Freshservice</Link></p>
            </div>
            <Button type="submit" className="w-full" disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
