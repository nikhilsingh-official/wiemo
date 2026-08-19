import { createColorModeInitScript } from './shared/colorMode'

// Studio ships a ~770 kB editor chunk that every visitor prefetches, plus a
// ~24 MB admin app in the public output. Production builds leave it out unless
// STUDIO_ENABLED is set, so editing still works wherever you turn it on:
//   STUDIO_ENABLED=true pnpm build
const studioEnabled = process.env.STUDIO_ENABLED
  ? process.env.STUDIO_ENABLED !== 'false'
  : process.env.NODE_ENV !== 'production'

/** Faces used above the fold on every page; the rest can arrive with the CSS. */
const PRELOADED_FONTS = [
  '/fonts/Lexend/Lexend-Variable.woff2',
  '/fonts/General_Sans/GeneralSans-Semibold.woff2',
  '/fonts/Monaspace_Neon/MonaspaceNeon-Regular.woff2',
]

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  buildDir: process.env.NUXT_BUILD_DIR ?? '.nuxt',
  devtools: { enabled: true },
  css: ['~/assets/styles/base.scss'],

  app: {
    head: {
      title: 'particle-physics',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        ...PRELOADED_FONTS.map(href => ({
          rel: 'preload' as const,
          as: 'font' as const,
          type: 'font/woff2',
          href,
          crossorigin: 'anonymous' as const,
        })),
      ],
      script: [
        {
          id: 'color-mode-init',
          innerHTML: createColorModeInitScript(),
        },
      ],
    },
  },

  nitro: {
    // Static JS/CSS was being served uncompressed (~1.7 MB on the home page).
    compressPublicAssets: { gzip: true, brotli: true },
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

  modules: [
    '@nuxt/content',
    ...(studioEnabled ? ['nuxt-studio'] : []),
  ],

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
