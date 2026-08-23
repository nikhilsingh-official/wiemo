<script setup lang="ts">
const route = useRoute()
const seriesSlug = computed(() => String(route.params.series ?? ''))

const { data: posts } = await useAsyncData(`series-${seriesSlug.value}-posts`, () =>
  queryCollection('series')
    .where('draft', '=', false)
    .where('seriesSlug', '=', seriesSlug.value)
    .order('seriesPart', 'ASC')
    .all()
)

if (!posts.value?.length) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Series not found',
  })
}

const seriesTitle = computed(() => posts.value?.[0]?.seriesTitle ?? 'Series')
const seriesDescription = computed(() => posts.value?.[0]?.seriesDescription)
const complexityRating = computed(() => posts.value?.[0]?.complexityRating)

useSeoMeta({
  title: () => seriesTitle.value,
  description: () => seriesDescription.value ?? `Posts in ${seriesTitle.value}.`,
  ogTitle: () => `WIEMO | ${seriesTitle.value}`,
  ogDescription: () => seriesDescription.value ?? `Posts in ${seriesTitle.value}.`,
  twitterTitle: () => `WIEMO | ${seriesTitle.value}`,
  twitterDescription: () => seriesDescription.value ?? `Posts in ${seriesTitle.value}.`,
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
        <h1>{{ seriesTitle }}</h1>
        <p v-if="seriesDescription" class="series-page__description">
          {{ seriesDescription }}
        </p>
        <p
          v-if="complexityRating"
          class="series-page__complexity"
        >
          Complexity {{ complexityRating }}/10
        </p>
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
  padding-top: 184px;

  &__back {
    display: inline-flex;
    margin-bottom: 32px;
    color: var(--beam);
    font-family: $font-mono;
    font-size: 12px;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
  }

  &__header {
    max-width: 720px;
    margin-bottom: 56px;
  }

  &__complexity {
    margin-top: 18px;
    color: var(--beam);
    font-family: $font-mono;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  &__description {
    max-width: 620px;
    margin-top: 16px;
    color: var(--body-copy);
    line-height: 1.65;
  }

  &__grid {
    --post-gap: 28px;

    display: flex;
    flex-wrap: wrap;
    gap: var(--post-gap);

    > * {
      flex: 1 1 320px;
      min-width: 0;
      max-width: 462px;
    }
  }
}

@media (max-width: 1020px) {
  .series-page {
    padding-top: calc(112px + 7vw);
  }
}

@media (max-width: 1120px) {
  .series-page__header {
    margin-bottom: 5vw;
  }
}

@media (max-width: 930px) {
  .series-page__grid {
    --post-gap: 3vw;
  }
}

@media (max-width: 760px) {
  .series-page__grid {
    flex-direction: column;

    > * {
      flex-basis: auto;
      max-width: none;
    }
  }
}

@media (max-width: 560px) {
  .series-page__header {
    margin-bottom: 28px;
  }

}

@media (max-width: 600px) {

  .series-page__grid {
    --post-gap: 18px;
  }
}

@media (max-width: 490px) {
  .series-page {
    padding-top: 146px;
  }
}
</style>
