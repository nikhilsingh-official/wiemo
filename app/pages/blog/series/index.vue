<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.series],
})

const { data: posts } = await useAsyncData('series-posts', () =>
  queryCollection('series')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

const seriesList = computed(() => {
  const seriesBySlug = new Map<string, { slug: string, title: string, count: number, complexityRating: number }>()

  for (const post of posts.value ?? []) {
    const existing = seriesBySlug.get(post.seriesSlug)
    if (existing) {
      existing.count += 1
      continue
    }

    seriesBySlug.set(post.seriesSlug, {
      slug: post.seriesSlug,
      title: post.seriesTitle,
      complexityRating: post.complexityRating,
      count: 1,
    })
  }

  return Array.from(seriesBySlug.values())
})
</script>

<template>
  <main class="content-section blog-page">
    <div class="wrap">
      <header class="blog-page__header">
        <p class="eyebrow">Blog</p>
        <h1>Series</h1>
        <p class="lede">
          Connected learning paths and recurring notes from WIEMO sessions.
        </p>
      </header>

      <section
        v-if="seriesList.length"
        class="series-grid"
        aria-label="Blog series"
      >
        <NuxtLink
          v-for="series in seriesList"
          :key="series.slug"
          class="series-card"
          :to="`/blog/series/${series.slug}`"
        >
          <h2>{{ series.title }}</h2>
          <div class="series-card__meta">
            <p>{{ series.count }} {{ series.count === 1 ? 'post' : 'posts' }}</p>
            <p>Complexity {{ series.complexityRating }}/10</p>
          </div>
        </NuxtLink>
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

.series-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(18px, 3vw, 28px);
}

.series-card {
  display: grid;
  gap: 12px;
  min-height: 220px;
  align-content: end;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid rgb(189 232 251 / 12%);
  border-radius: 8px;
  color: inherit;
  background: linear-gradient(145deg, rgb(8 11 18 / 86%), rgb(4 6 11 / 96%));
  text-decoration: none;

  h2 {
    color: var(--core);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
  }

  p {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
}

@media (max-width: 760px) {
  .series-grid {
    grid-template-columns: 1fr;
  }
}
</style>
