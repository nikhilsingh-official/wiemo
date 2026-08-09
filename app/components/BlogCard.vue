<script setup lang="ts">
type BlogCardPost = {
  path: string
  title: string
  subheading: string
  description?: string
  excerpt?: string
  author?: string
  date: Date | string
  thumbnail: string
  thumbnailAlt: string
  tags?: string[]
}

const props = defineProps<{
  post: BlogCardPost
  featured?: boolean
}>()

const excerpt = computed(() => props.post.excerpt ?? props.post.description ?? '')

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
</script>

<template>
  <article :class="['blog-card', { 'blog-card--featured': featured }]">
    <NuxtLink
      :to="post.path"
      class="blog-card__link"
    >
      <div class="blog-card__media">
        <img
          :src="post.thumbnail"
          :alt="post.thumbnailAlt"
          loading="lazy"
        >
      </div>

      <div class="blog-card__body">
        <div class="blog-card__meta">
          <span>{{ post.author ?? 'WIEMO' }}</span>
          <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
        </div>

        <h2>{{ post.title }}</h2>
        <p class="blog-card__subheading">{{ post.subheading }}</p>
        <p>{{ excerpt }}</p>

        <ul
          v-if="post.tags?.length"
          class="blog-card__tags"
          aria-label="Post tags"
        >
          <li
            v-for="tag in post.tags"
            :key="tag"
          >
            {{ tag }}
          </li>
        </ul>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped lang="scss">
.blog-card {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  border-radius: 18px;
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--panel) 86%, transparent),
      color-mix(in srgb, var(--black) 96%, transparent)
    );
  box-shadow: 0 22px 60px rgb(0 0 0 / 22%);

  &__link {
    display: grid;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }

  &__media {
    position: relative;
    min-height: 220px;
    background: var(--panel-2);

    &::after {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, transparent 42%, rgb(0 0 0 / 58%)),
        radial-gradient(
          circle at 18% 18%,
          color-mix(in srgb, var(--beam) 22%, transparent),
          transparent 38%
        );
      content: '';
    }

    img {
      width: 100%;
      height: 100%;
      min-height: inherit;
      object-fit: cover;
      filter: saturate(0.82) contrast(1.04);
    }
  }

  &__body {
    display: grid;
    gap: 12px;
    padding: 30px;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    color: var(--mute);
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  h2 {
    max-width: 500px;
    color: var(--ink);
    font-size: 38px;
    line-height: 0.98;
  }

  p {
    color: var(--body-copy);
    line-height: 1.7;
  }

  &__subheading {
    color: var(--core);
    font-size: 16px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
    padding: 0;
    list-style: none;

    li {
      padding: 6px 9px;
      border: 1px solid color-mix(in srgb, var(--beam) 22%, transparent);
      border-radius: 999px;
      color: var(--beam);
      font-family: $font-mono;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  &--featured {
    .blog-card__link {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    }

    .blog-card__media {
      min-height: 420px;
    }

    .blog-card__body {
      align-content: center;
    }
  }
}

@media (max-width: 1000px) {
  .blog-card__body {
    padding: 3vw;
  }
}

@media (max-width: 950px) {
  .blog-card h2 {
    font-size: 4vw;
  }
}

@media (max-width: 760px) {
  .blog-card--featured .blog-card__link {
    grid-template-columns: 1fr;
  }

  .blog-card--featured .blog-card__media {
    min-height: 260px;
  }
}

@media (max-width: 670px) {
  .blog-card__body {
    padding: 20px;
  }
}

@media (max-width: 575px) {
  .blog-card h2 {
    font-size: 23px;
  }
}
</style>
