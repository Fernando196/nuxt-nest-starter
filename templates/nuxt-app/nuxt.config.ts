import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

  // CSS global con el @theme de Tailwind v4
  css: ['~/assets/css/main.css'],
  vite:{
    plugins:[tailwindcss()]
  },
  // TypeScript strict
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        exactOptionalPropertyTypes: true,
      },
    },
  },

  // Auto-imports
  imports: {
    dirs: ['composables/**', 'stores/**', 'utils/**'],
  },

  components: [
    { path: '~/components/ui', prefix: 'UI' },
    { path: '~/components/layout', prefix: 'Layout' },
    '~/components',
  ],

  // Runtime config
  runtimeConfig: {
    sessionSecret: '',
    public: {
      apiBase: '',
      appName: '{{PROJECT_NAME}}',
    },
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },

  nitro: {
    compressPublicAssets: true,
  },
})
