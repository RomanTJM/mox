export interface Venue {
  id: string;
  owner_user_id: string;
  name: string;
  address: string;
  capacity: number;
  created_at: string;
  image_url?: string;
  price: number;
}

export interface Booking {
  id: string;
  venue_id: string;
  user_id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
} 