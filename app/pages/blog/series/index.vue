<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.series],
})

const { data: posts } = await useAsyncData('series-posts', () =>
  queryCollection('series')
    .where('draft', '=', false)
    .all()
)

const seriesList = computed(() => {
  type SeriesPost = NonNullable<typeof posts.value>[number]
  const seriesBySlug = new Map<string, {
    slug: string
    title: string
    complexityRating: number
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
      complexityRating: post.complexityRating,
      posts: [post],
    })
  }

  return Array.from(seriesBySlug.values()).map(series => ({
    ...series,
    posts: series.posts.sort((a, b) => a.seriesPart - b.seriesPart),
  }))
})
</script>

<template>
  <main class="content-section blog-page">
    <div class="wrap">
      <header class="blog-page__header">
        <p class="eyebrow">Blog</p>
        <h1>Series</h1>
        <p class="lede">
          Follow each learning path from its lowest energy state to its most advanced ideas.
        </p>
      </header>

      <section
        v-if="seriesList.length"
        class="series-list"
        aria-label="Blog series"
      >
        <SeriesEnergyStrip
          v-for="series in seriesList"
          :key="series.slug"
          :series="series"
        />
      </section>

      <p v-else>No series found.</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.blog-page {
  min-height: 100vh;

  &__header {
    max-width: 720px;
    margin-bottom: clamp(28px, 5vw, 56px);
  }
}

.series-list {
  display: grid;
  min-width: 0;
}
</style>
