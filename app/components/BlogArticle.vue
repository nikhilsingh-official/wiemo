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
  padding: 184px var(--gutter) 128px;
  color: var(--ink);
  background:
    radial-gradient(circle at 50% 0%, rgb(11 128 195 / 12%), transparent 544px),
    linear-gradient(180deg, var(--black), var(--void) 42%, var(--black));

  &__article {
    width: min(100%, 1080px);
    margin-inline: auto;
  }

  &__back {
    display: inline-flex;
    margin-bottom: 72px;
    color: var(--beam);
    font-family: $font-mono;
    font-size: 12px;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;

    &:hover {
      color: var(--core);
    }
  }

  &__header {
    max-width: 760px;
    margin-inline: auto;
    margin-bottom: 46px;

    h1 {
      color: var(--ink);
      font-family: $font-display;
      font-size: 91px;
      font-weight: 500;
      letter-spacing: 0;
      line-height: 0.98;
    }
  }

  &__subheading {
    max-width: 700px;
    margin-top: 18px;
    color: var(--core);
    font-family: $font-body;
    font-size: 23px;
    line-height: 1.42;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    margin-top: 24px;
    color: var(--mute);
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  &__figure {
    overflow: hidden;
    width: min(100%, 920px);
    margin: 0 auto 64px;
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
      font-size: 13px;
      line-height: 1.4;
    }
  }

  &__content {
    max-width: 720px;
    margin-inline: auto;
    color: var(--body-copy);
    font-family: $font-body;
    font-size: 20px;
    line-height: 1.78;
  }
}

.blog-post__content {
  :deep(p) {
    max-width: none;
    margin-block: 24px;
    color: inherit;
  }

  :deep(h2),
  :deep(h3) {
    margin-top: 40px;
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
    margin-block: 32px;
    padding-left: 20px;
    border-left: 3px solid var(--beam);
    color: var(--core);
    font-style: italic;
  }

  :deep(ul),
  :deep(ol) {
    display: grid;
    gap: 9px;
    padding-left: 26px;
    margin-block: 24px;
  }
}

@media (max-width: 1300px) {
  .blog-post__header h1 {
    font-size: 7vw;
  }
}

@media (max-width: 1200px) {
  .blog-post__back {
    margin-bottom: 6vw;
  }
}

@media (max-width: 1150px) {
  .blog-post__subheading {
    font-size: 2vw;
  }
}

@media (max-width: 1070px) {
  .blog-post__figure {
    margin-bottom: 6vw;
  }
}

@media (max-width: 1280px) {
  .blog-post {
    padding-bottom: 10vw;
  }
}

@media (max-width: 1024px) {
  .blog-post {
    padding-top: calc(112px + 7vw);
  }

  .blog-post__content {
    font-size: 2vw;
  }
}

@media (max-width: 720px) {
  .blog-post {
    padding-bottom: 72px;
  }
}

@media (max-width: 920px) {
  .blog-post__header {
    margin-bottom: 5vw;
  }
}

@media (max-width: 896px) {
  .blog-post__subheading,
  .blog-post__content {
    font-size: 18px;
  }
}

@media (max-width: 620px) {
  .blog-post__header h1 {
    font-size: 43px;
  }
}

@media (max-width: 570px) {
  .blog-post__back,
  .blog-post__figure {
    margin-bottom: 34px;
  }

  .blog-post__header {
    margin-bottom: 28px;
  }
}

@media (max-width: 680px) {
  .blog-post {
    padding-top: 112px;
    padding-bottom: 72px;
  }
}
</style>
