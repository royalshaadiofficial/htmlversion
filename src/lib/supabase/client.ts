import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Database types
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
      profiles: {
        Row: {
          id: string
          phone: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          city: string
          state: string
          description: string | null
          services: string[] | null
          price_range: string | null
          rating: number
          reviews_count: number
          contact_phone: string | null
          contact_email: string | null
          contact_whatsapp: string | null
          website_url: string | null
          instagram_url: string | null
          images: string[] | null
          featured_image: string | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category: string
          city: string
          state?: string
          description?: string | null
          services?: string[] | null
          price_range?: string | null
          rating?: number
          reviews_count?: number
          contact_phone?: string | null
          contact_email?: string | null
          contact_whatsapp?: string | null
          website_url?: string | null
          instagram_url?: string | null
          images?: string[] | null
          featured_image?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string
          city?: string
          state?: string
          description?: string | null
          services?: string[] | null
          price_range?: string | null
          rating?: number
          reviews_count?: number
          contact_phone?: string | null
          contact_email?: string | null
          contact_whatsapp?: string | null
          website_url?: string | null
          instagram_url?: string | null
          images?: string[] | null
          featured_image?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          content: string
          featured_image: string | null
          author_name: string
          category: string | null
          tags: string[] | null
          seo_title: string | null
          seo_description: string | null
          published_at: string | null
          is_published: boolean
          views_count: number
          created_at: string
          updated_at: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          vendor_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor_id: string
          created_at?: string
        }
        Delete: {
          id?: string
          user_id?: string
          vendor_id?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          user_id: string | null
          vendor_id: string
          name: string
          email: string
          phone: string
          wedding_date: string | null
          message: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          vendor_id: string
          name: string
          email: string
          phone: string
          wedding_date?: string | null
          message: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}