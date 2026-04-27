// Tipos globales del proyecto {{PROJECT_NAME}}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: PaginationMeta
}

export interface ApiError {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'user' | 'guest'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  name: string
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Hace que todos los campos de T sean requeridos y no-null */
export type RequiredNonNull<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

/** Selecciona solo los campos que son de tipo string */
export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

/** Tipo para formularios: hace todos los campos string (para v-model) */
export type FormValues<T> = {
  [K in keyof T]: string
}
