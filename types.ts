// FIX: Created type definitions for the application based on usage in other components.
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For authentication simulation
  wishlist?: string[]; // Array of listing IDs
}

export interface AccommodationListingDetails {
  type: string; // 호텔, 펜션, 리조트 등
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
}

export interface GolfListingDetails {
  courseName: string;
  teeTime: string; // HH:mm
  players: number;
  includes: string[]; // green_fee, cart_fee 등
}

export interface Listing {
  id: string;
  name: string;
  location: string;
  originalPrice: number;
  salePrice: number;
  description: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  seller: string; // User's name
  sellerId: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: 'accommodation' | 'golf';
  details: AccommodationListingDetails | GolfListingDetails;
  status: 'selling' | 'in-progress' | 'completed';
  applicants: string[]; // Array of User names who applied
  currentBuyer: string | null;
}

export interface GolfBookingDetails {
  teeTime: string;
  players: number;
}

export interface Wanted {
  id: string;
  author: string; // User's name
  authorId: string;
  category: 'accommodation' | 'golf';
  location: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  details: string;
  desiredPrice: number;
  golfBookingDetails?: GolfBookingDetails;
}

export interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

export interface Reservation {
  id:string;
  listingId: string;
  name: string;
  seller: string;
  buyer: string;
  price: number;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'disputed';
  reviewSubmitted?: boolean;
}

export interface Review {
  id: string;
  reservationId: string;
  author: string;
  rating: number;
  comment: string;
  timestamp: string;
}