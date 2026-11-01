export interface Category { id: string; name: string; slug: string; description?: string }
export interface ServiceArea { city: string; locality?: string }
export interface Service { id: string; name?: string; description?: string; price?: string }
export interface Provider { id: string; businessName: string; description?: string; startingPrice?: string; verificationStatus?: string; services?: Service[]; averageRating?: number; portfolio?: { id: string; imageUrl?: string; url?: string }[] }
export interface Page<T> { data: T[]; meta?: { page: number; limit: number; total?: number; totalPages?: number } }
export interface Inquiry { id: string; city: string; locality?: string; venue?: string; guestCount?: number; status?: string; category?: Category; eventDate?: string; quotations?: unknown[] }
export interface Quotation { id: string; status?: string; version?: number; totalAmount?: string; validUntil?: string; provider?: Provider; items?: { id: string; description: string; quantity: number; unitPrice: string; subtotal?: string }[]; taxAmount?: string; discountAmount?: string; inclusions?: string; exclusions?: string; paymentTerms?: string; cancellationTerms?: string }
export interface Booking { id: string; reference?: string; status?: string; agreedAmount?: string; eventDate?: string; city?: string; provider?: Provider; quotation?: Quotation }
export interface Conversation { id: string; inquiry?: Inquiry; provider?: Provider; lastMessage?: { body: string; createdAt: string }; updatedAt?: string }
export interface Message { id: string; body: string; createdAt: string; sender?: { id: string; fullName?: string; role?: string }; type?: string }
