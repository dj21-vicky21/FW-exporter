"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Calendar, User, FileText, Tag } from "lucide-react"
import { SimpleCard } from "@/lib/types"


interface CardDetailPageProps {
  card: SimpleCard
  onBack: () => void
  onDownload: (cardId: string) => void
}

export default function CardDetailPage({ card, onBack, onDownload }: CardDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <Button onClick={() => onDownload(card.id)} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download XLSX
          </Button>
        </div>

        {/* Card Detail */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{card.name}</CardTitle>
                <p className="text-gray-600 text-lg">{card.description}</p>
              </div>
              {card.details && (
                <Badge variant="outline" className="text-sm">
                  {card.details.fileType}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {card.details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">File Information</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500">Category</span>
                        <p className="font-medium">{card.details.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500">File Size</span>
                        <p className="font-medium">{card.details.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500">Last Modified</span>
                        <p className="font-medium">{card.details.lastModified}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500">Author</span>
                        <p className="font-medium">{card.details.author}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags and Additional Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.details?.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">What&apos;s included in this export:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Complete data set with all fields</li>
                      <li>• Formatted for Excel compatibility</li>
                      <li>• Ready for analysis and reporting</li>
                      <li>• Includes metadata and timestamps</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 mb-2">
                <div>ID</div>
                <div>Name</div>
                <div>Status</div>
                <div>Date</div>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="grid grid-cols-4 gap-4 text-sm text-gray-600 py-2 border-b border-gray-200">
                    <div>#{String(row).padStart(3, "0")}</div>
                    <div>Sample Data {row}</div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                    <div>{new Date().toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 text-sm text-gray-500">
                ... and {Math.floor(Math.random() * 100) + 50} more rows
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
