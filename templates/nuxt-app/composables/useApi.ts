import type { ApiResponse, ApiError, PaginationParams } from '~/types'

interface UseApiOptions {
  baseURL?: string
  showErrorToast?: boolean
}

/**
 * Composable principal para llamadas a la API.
 * Envuelve $fetch con tipado estricto, manejo de errores y auth automático.
 */
export function useApi(options: UseApiOptions = {}) {
  const config = useRuntimeConfig()
  const { session } = useUserSession()

  const baseURL = options.baseURL ?? config.public.apiBase

  async function get<T>(endpoint: string, params?: PaginationParams): Promise<T> {
    return $fetch<T>(endpoint, {
      method: 'GET',
      baseURL,
      ...(params !== undefined ? { params } : {}),
      headers: getHeaders(),
    })
  }

  async function post<TBody extends Record<string, unknown>, TResponse>(endpoint: string, body: TBody): Promise<TResponse> {
    return $fetch<TResponse>(endpoint, {
      method: 'POST',
      baseURL,
      body,
      headers: getHeaders(),
    })
  }

  async function put<TBody extends Record<string, unknown>, TResponse>(endpoint: string, body: TBody): Promise<TResponse> {
    return $fetch<TResponse>(endpoint, {
      method: 'PUT',
      baseURL,
      body,
      headers: getHeaders(),
    })
  }

  async function patch<TBody extends Record<string, unknown>, TResponse>(endpoint: string, body: Partial<TBody>): Promise<TResponse> {
    return $fetch<TResponse>(endpoint, {
      method: 'PATCH',
      baseURL,
      body,
      headers: getHeaders(),
    })
  }

  async function del<TResponse>(endpoint: string): Promise<TResponse> {
    return $fetch<TResponse>(endpoint, {
      method: 'DELETE',
      baseURL,
      headers: getHeaders(),
    })
  }

  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    // Agrega el token si existe en sesión
    if (session.value?.token) {
      headers['Authorization'] = `Bearer ${session.value.token}`
    }
    return headers
  }

  return { get, post, put, patch, del }
}

/**
 * Tipo de retorno de useApi para tipar en otros composables
 */
export type ApiClient = ReturnType<typeof useApi>
