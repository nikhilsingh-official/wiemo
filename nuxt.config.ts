// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  buildDir: process.env.NUXT_BUILD_DIR ?? '.nuxt',
  devtools: { enabled: true },
  css: ['~/assets/styles/base.scss'],

  app: {
    head: {
      title: 'particle-physics',
      htmlAttrs: {
        class: 'dark',
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (source, filename) => (
            filename.endsWith('.vue')
              ? `@use "~/assets/styles/global.scss" as *;\n${source}`
              : source
          ),
        },
      },
    },
  },

  modules: ['@nuxt/content', 'nuxt-studio'],

  studio: {
    route: '/_studio',
    repository: {
      provider: 'github',
      owner: 'nikhilsingh-official',
      repo: 'wiemo',
      branch: process.env.STUDIO_BRANCH_NAME ?? 'cms/nuxt-studio',
    },
  },
})
