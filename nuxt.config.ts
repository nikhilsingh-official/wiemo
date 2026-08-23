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

const STUDIO_CONFIG = {
  route: '/_studio',
  repository: {
    provider: 'github',
    owner: 'nikhilsingh-official',
    repo: 'wiemo',
    branch: process.env.STUDIO_BRANCH_NAME ?? 'cms/nuxt-studio',
  },
} as const

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Spread preserves Studio's normal top-level runtime config while avoiding
  // an upstream typing gap when the module is intentionally absent in prod.
  ...({ studio: STUDIO_CONFIG }),
  compatibilityDate: '2025-07-15',
  buildDir: process.env.NUXT_BUILD_DIR ?? '.nuxt',
  devtools: { enabled: true },
  css: ['~/assets/styles/base.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'application-name', content: 'WIEMO' },
        { name: 'theme-color', content: '#05111d' },
        { name: 'color-scheme', content: 'dark light' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
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
    prerender: {
      routes: ['/sitemap.xml'],
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

  modules: [
    '@nuxt/content',
    ...(studioEnabled ? ['nuxt-studio'] : []),
  ],

})
