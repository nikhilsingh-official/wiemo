<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.blog],
})

const route = useRoute()

const { data: post } = await useAsyncData(`blog-post-${route.path}`, () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .path(route.path)
    .first()
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog post not found',
  })
}

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

useSeoMeta({
  title: () => post.value?.title ?? 'Blog',
  description: () => post.value?.excerpt ?? '',
  ogImage: () => post.value?.thumbnail ?? '',
})
</script>

<template>
  <main
    v-if="post"
    class="content-section blog-post"
  >
    <article class="wrap">
      <NuxtLink
        to="/blog"
        class="blog-post__back"
      >
        Back to blog
      </NuxtLink>

      <header class="blog-post__header">
        <p class="eyebrow">Field Notes</p>
        <h1>{{ post.title }}</h1>
        <p class="blog-post__subheading">{{ post.subheading }}</p>

        <div class="blog-post__meta">
          <span>{{ post.author }}</span>
          <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
        </div>
      </header>

      <figure class="blog-post__figure">
        <img
          :src="post.thumbnail"
          :alt="post.thumbnailAlt"
        >
        <figcaption v-if="post.imageCredit">
          {{ post.imageCredit }}
        </figcaption>
      </figure>

      <ContentRenderer
        :value="post"
        class="blog-post__content"
      />
    </article>
  </main>
</template>

<style scoped lang="scss">
.blog-post {
  min-height: 100vh;

  &__back {
    display: inline-flex;
    margin-bottom: 32px;
    color: var(--beam);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-decoration: none;
    text-transform: uppercase;
  }

  &__header {
    max-width: 820px;
    margin-bottom: clamp(28px, 5vw, 48px);

    h1 {
      max-width: 11ch;
      margin-top: 8px;
      font-size: clamp(3rem, 9vw, 6.8rem);
      line-height: 0.9;
    }
  }

  &__subheading {
    max-width: 54ch;
    margin-top: 18px;
    color: var(--core);
    font-size: clamp(1.1rem, 2vw, 1.35rem);
    line-height: 1.5;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    margin-top: 20px;
    color: var(--mute);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  &__figure {
    overflow: hidden;
    margin: 0 0 clamp(30px, 5vw, 56px);
    border: 1px solid rgb(189 232 251 / 12%);
    border-radius: 18px;
    background: var(--panel-2);

    img {
      display: block;
      width: 100%;
      max-height: 560px;
      object-fit: cover;
      filter: saturate(0.82) contrast(1.04);
    }

    figcaption {
      padding: 10px 14px;
      color: var(--mute);
      font-family: $font-mono;
      font-size: 0.64rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  }

  &__content {
    max-width: 72ch;
    color: var(--body-copy);
    font-size: 1.04rem;
    line-height: 1.8;
  }
}
</style>
