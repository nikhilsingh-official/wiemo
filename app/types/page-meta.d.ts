import type { HeroStage } from '~/hero/stages'

declare module '#app' {
  interface PageMeta {
    heroStages: readonly HeroStage[]
  }
}

export {}
