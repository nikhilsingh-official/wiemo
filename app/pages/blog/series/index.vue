<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.series],
})

const { data: posts } = await useAsyncData('series-posts', () =>
  queryCollection('series')
    .where('draft', '=', false)
    .order('date', 'ASC')
    .all()
)

const seriesList = computed(() => {
  type SeriesPost = NonNullable<typeof posts.value>[number]
  const seriesBySlug = new Map<string, {
    slug: string
    title: string
    energyTier: SeriesPost['energyTier']
    posts: SeriesPost[]
  }>()

  for (const post of posts.value ?? []) {
    const existing = seriesBySlug.get(post.seriesSlug)
    if (existing) {
      existing.posts.push(post)
      continue
    }

    seriesBySlug.set(post.seriesSlug, {
      slug: post.seriesSlug,
      title: post.seriesTitle,
      energyTier: post.energyTier,
      posts: [post],
    })
  }

  return Array.from(seriesBySlug.values()).map(series => ({
    ...series,
    posts: series.posts.map(post => ({
      path: post.path,
      title: post.title,
      date: post.date,
      thumbnail: post.thumbnail,
      thumbnailAlt: post.thumbnailAlt,
      // `excerpt` is reserved by Nuxt Content, so the schema exposes its parsed alias.
      excerpt: post.postExcerpt,
    })),
  }))
})

useSeoMeta({
  title: 'Series energy spectrum',
  description: 'Explore WIEMO learning series across five particle-physics-inspired energy tiers.',
})
</script>

<template>
  <main class="content-section blog-page">
    <div class="wrap">
      <header class="blog-page__header">
        <p class="eyebrow">Blog / Series</p>
        <h1>Energy spectrum</h1>
        <p class="lede">
          Follow learning paths across a spectrum of ideas. Introductory series begin at
          lower-energy bands; advanced series sit deeper in the spectrum, where energy
          increases downward.
        </p>
        <p class="blog-page__note">
          A spectrum has no intrinsic up or down convention&mdash;this orientation keeps the
          journey from foundational to collider-scale thinking readable from top to bottom.
        </p>
      </header>

      <SeriesEnergySpectrum
        v-if="seriesList.length"
        :series-list="seriesList"
      />

      <p v-else>No series found.</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.blog-page {
  min-height: 100vh;

  &__header {
    max-width: 800px;
    margin-bottom: clamp(44px, 7vw, 80px);
  }

  &__note {
    max-width: 70ch;
    margin-top: 18px;
    color: var(--mute);
    font-size: 0.82rem;
    line-height: 1.7;
  }
}
</style>
