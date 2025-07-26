export interface SimpleCard {
  id: string
  name: string
  description: string
  component: React.ComponentType
  details?: {
    category?: string
    size?: string
    lastModified?: string
    author?: string
    tags?: string[]
    fileType?: string
  }
} 