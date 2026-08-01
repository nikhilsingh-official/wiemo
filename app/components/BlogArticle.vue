<script setup lang="ts">
type BlogArticlePost = {
  title: string
  subheading: string
  author?: string
  date: Date | string
  thumbnail: string
  thumbnailAlt: string
  imageCredit?: string
}

defineProps<{
  post: BlogArticlePost
  backTo: string
  backLabel: string
}>()

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
</script>

<template>
  <main class="blog-post">
    <article class="blog-post__article">
      <NuxtLink
        :to="backTo"
        class="blog-post__back"
      >
        {{ backLabel }}
      </NuxtLink>

      <header class="blog-post__header">
        <h1>{{ post.title }}</h1>
        <p class="blog-post__subheading">{{ post.subheading }}</p>

        <div class="blog-post__meta">
          <span>{{ post.author ?? 'WIEMO' }}</span>
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
  padding: calc(112px + clamp(34px, 7vw, 72px)) var(--gutter) clamp(72px, 10vw, 128px);
  color: var(--ink);
  background:
    radial-gradient(circle at 50% 0%, rgb(11 128 195 / 12%), transparent 34rem),
    linear-gradient(180deg, var(--black), var(--void) 42%, var(--black));

  &__article {
    width: min(100%, 1080px);
    margin-inline: auto;
  }

  &__back {
    display: inline-flex;
    margin-bottom: clamp(34px, 6vw, 72px);
    color: var(--beam);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-decoration: none;
    text-transform: uppercase;

    &:hover {
      color: var(--core);
    }
  }

  &__header {
    max-width: 760px;
    margin-inline: auto;
    margin-bottom: clamp(28px, 5vw, 46px);

    h1 {
      color: var(--ink);
      font-family: $font-display;
      font-size: clamp(2.7rem, 7vw, 5.7rem);
      font-weight: 500;
      letter-spacing: 0;
      line-height: 0.98;
    }
  }

  &__subheading {
    max-width: 48ch;
    margin-top: 18px;
    color: var(--core);
    font-family: $font-body;
    font-size: clamp(1.12rem, 2vw, 1.42rem);
    line-height: 1.42;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    margin-top: 24px;
    color: var(--mute);
    font-family: $font-mono;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &__figure {
    overflow: hidden;
    width: min(100%, 920px);
    margin: 0 auto clamp(34px, 6vw, 64px);
    border: 1px solid rgb(189 232 251 / 12%);
    border-radius: 4px;
    background: var(--panel-2);
    box-shadow: 0 22px 64px rgb(0 0 0 / 34%);

    img {
      display: block;
      width: 100%;
      max-height: 540px;
      object-fit: cover;
      filter: saturate(0.82) contrast(1.04);
    }

    figcaption {
      max-width: 760px;
      padding: 10px 0 12px;
      margin-inline: auto;
      color: var(--mute);
      font-size: 0.82rem;
      line-height: 1.4;
    }
  }

  &__content {
    max-width: 720px;
    margin-inline: auto;
    color: var(--body-copy);
    font-family: $font-body;
    font-size: clamp(1.12rem, 2vw, 1.28rem);
    line-height: 1.78;
  }
}

.blog-post__content {
  :deep(p) {
    max-width: none;
    margin-block: 1.2em;
    color: inherit;
  }

  :deep(h2),
  :deep(h3) {
    margin-top: 2em;
    color: var(--ink);
    font-family: $font-display;
    letter-spacing: 0;
  }

  :deep(a) {
    color: var(--beam);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;

    &:hover {
      color: var(--core);
    }
  }

  :deep(blockquote) {
    margin-block: 1.6em;
    padding-left: 20px;
    border-left: 3px solid var(--beam);
    color: var(--core);
    font-style: italic;
  }

  :deep(ul),
  :deep(ol) {
    display: grid;
    gap: 0.45em;
    padding-left: 1.3em;
    margin-block: 1.2em;
  }
}

@media (max-width: 680px) {
  .blog-post {
    padding-top: 112px;
  }
}
</style>
