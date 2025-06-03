export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          owner_user_id: string
          name: string
          address: string
          capacity: number
          image_url: string | null
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          name: string
          address: string
          capacity: number
          image_url?: string | null
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          name?: string
          address?: string
          capacity?: number
          image_url?: string | null
          price?: number
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          venue_id: string
          user_id: string
          date: string
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          user_id: string
          date: string
          status: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          venue_id?: string
          user_id?: string
          date?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 