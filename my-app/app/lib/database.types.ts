// lib/database.types.ts
export type UserRole = 'citizen' | 'moderator' | 'admin'
export type PostCategory = 'road' | 'utilities' | 'lighting' | 'garbage' | 'greenery' | 'transport' | 'safety' | 'other'
export type PostStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'

export const POST_CATEGORY_LABELS: Record<string, string> = {
  road: '🛣️ Дороги',
  utilities: '🔧 ЖКХ',
  lighting: '💡 Освещение',
  garbage: '🗑️ Мусор',
  greenery: '🌳 Озеленение',
  transport: '🚌 Транспорт',
  safety: '🛡️ Безопасность',
  other: '📌 Другое',
}

export const POST_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:     { label: 'На рассмотрении', color: 'yellow' },
  in_progress: { label: 'В работе',        color: 'blue'   },
  resolved:    { label: 'Решено',          color: 'green'  },
  rejected:    { label: 'Отклонено',       color: 'red'    },
}

export interface User {
  id: string
  email: string
  full_name: string
  city: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  title: string
  description: string
  category: string
  status: string
  lat: number | null
  lng: number | null
  address: string | null
  media_url: string | null
  created_at: string
  updated_at: string
}

export interface PostWithMeta extends Post {
  author_name: string
  author_avatar: string | null
  author_city: string
  votes: number
  comment_count: number
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Partial<User>
        Update: Partial<User>
      }
      posts: {
        Row: Post
        Insert: {
          author_id: string
          title: string
          description?: string
          category?: string
          status?: string
          lat?: number | null
          lng?: number | null
          address?: string | null
          media_url?: string | null
        }
        Update: Partial<Post>
      }
      post_votes: {
        Row: { id: string; post_id: string; user_id: string; created_at: string }
        Insert: { post_id: string; user_id: string }
        Update: never
      }
      comments: {
        Row: Comment
        Insert: {
          post_id: string
          author_id: string
          content: string
        }
        Update: Partial<Comment>
      }
    }
    Views: {
      posts_with_meta: {
        Row: PostWithMeta
      }
    }
  }
}