<script setup lang="ts">
const route = useRoute()
const seriesSlug = computed(() => String(route.params.series ?? ''))

const { data: posts } = await useAsyncData(`series-${seriesSlug.value}-posts`, () =>
  queryCollection('series')
    .where('draft', '=', false)
    .where('seriesSlug', '=', seriesSlug.value)
    .order('date', 'DESC')
    .all()
)

if (!posts.value?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Series not found',
  })
}

const seriesTitle = computed(() => posts.value?.[0]?.seriesTitle ?? 'Series')

useSeoMeta({
  title: () => seriesTitle.value,
  description: () => `Posts in ${seriesTitle.value}.`,
})
</script>

<template>
  <main class="content-section series-page">
    <div class="wrap">
      <NuxtLink
        to="/blog/series"
        class="series-page__back"
      >
        Back to series
      </NuxtLink>

      <header class="series-page__header">
        <p class="eyebrow">Series</p>
        <h1>{{ seriesTitle }}</h1>
      </header>

      <section
        v-if="posts?.length"
        class="series-page__grid"
        aria-label="Series posts"
      >
        <BlogCard
          v-for="post in posts"
          :key="post.path"
          :post="post"
        />
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.series-page {
  min-height: 100vh;
  padding-top: calc(112px + clamp(34px, 7vw, 72px));

  &__back {
    display: inline-flex;
    margin-bottom: 32px;
    color: var(--beam);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-decoration: none;
    text-transform: uppercase;
  }

  &__header {
    max-width: 720px;
    margin-bottom: clamp(28px, 5vw, 56px);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(18px, 3vw, 28px);
  }
}

@media (max-width: 760px) {
  .series-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
