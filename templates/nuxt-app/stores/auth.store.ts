import { defineStore } from 'pinia'
import type { User, LoginDto, RegisterDto } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // ─── State ──────────────────────────────────────────────────────────────────
  const user = ref<User | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // ─── Getters ────────────────────────────────────────────────────────────────
  const isAuthenticated = computed<boolean>(() => !!user.value)
  const isAdmin = computed<boolean>(() => user.value?.role === 'admin')
  const displayName = computed<string>(() => user.value?.name ?? 'Invitado')

  // ─── Actions ────────────────────────────────────────────────────────────────
  async function login(credentials: LoginDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const { fetch: fetchSession } = useUserSession()
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials,
      })
      await fetchSession()
      await fetchCurrentUser()
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: RegisterDto): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: data,
      })
      await login({ email: data.email, password: data.password })
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  async function fetchCurrentUser(): Promise<void> {
    try {
      user.value = await $fetch<User>('/api/auth/me')
    } catch {
      user.value = null
    }
  }

  function clearError(): void {
    error.value = null
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    if (typeof err === 'object' && err !== null && 'data' in err) {
      const apiErr = err as { data?: { message?: string } }
      return apiErr.data?.message ?? 'Error desconocido'
    }
    return 'Error desconocido'
  }

  return {
    // state
    user,
    isLoading,
    error,
    // getters
    isAuthenticated,
    isAdmin,
    displayName,
    // actions
    login,
    register,
    logout,
    fetchCurrentUser,
    clearError,
  }
})
