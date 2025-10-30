export interface Product {
  id: string
  slug: string
  name: string
  price: number
  badge?: string
  image: string
  images?: string[]
  category: string
  description?: string
  stock?: number
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  image?: string
}

export interface ProductCardProps {
  product: Product
}
