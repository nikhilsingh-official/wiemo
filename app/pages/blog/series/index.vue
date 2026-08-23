<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({ heroStages: [HERO_STAGE.series] })

const {
  data: posts,
  error: postsError,
  status: postsStatus,
} = await useAsyncData('series-posts', () =>
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
    description?: string
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
      description: post.seriesDescription,
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
      excerpt: post.postExcerpt ?? post.excerpt ?? post.description,
    })),
  }))
})

useSeoMeta({
  title: 'Learning Series',
  description: 'Explore WIEMO learning series across five particle-physics-inspired energy tiers.',
})
</script>

<template>
  <main class="content-section blog-page">
    <div class="wrap">
      <header class="blog-page__header">
        <h1>Energy spectrum</h1>
        <p class="lede">
          Follow learning paths across a spectrum of ideas. Series become more challenging
          as you move down; within each series, newer posts glow brighter from left to right.
        </p>
      </header>

      <SeriesEnergySpectrum
        v-if="seriesList.length"
        :series-list="seriesList"
      />

      <p v-else-if="postsStatus === 'pending'">Loading series...</p>
      <p v-else-if="postsError">Unable to load series.</p>
      <p v-else>No series found.</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.blog-page {
  min-height: 100vh;

  &__header {
    max-width: 800px;
    margin-bottom: 80px;
  }

}

@media (max-width: 1140px) {
  .blog-page__header {
    margin-bottom: 7vw;
  }
}

@media (max-width: 630px) {
  .blog-page__header {
    margin-bottom: 44px;
  }
}
</style>
