export interface ShippingInfo {
  firstName: string
  lastName: string
  phone: string
  address: string
  addressLine2?: string
  city: string
  postalCode: string
  country: string
}

export interface BillingInfo extends ShippingInfo {}

export interface CheckoutData {
  shipping: ShippingInfo
  billing: BillingInfo
  sameAsBilling: boolean
  saveToProfile: boolean
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded'
