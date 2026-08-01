<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.blog],
})

const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

const featuredPost = computed(() => posts.value?.find((post) => post.featured))
const remainingPosts = computed(() =>
  posts.value?.filter((post) => post.path !== featuredPost.value?.path) ?? []
)
</script>

<template>
  <main class="content-section blog-page">
    <div class="wrap">
      <header class="blog-page__header">
        <p class="eyebrow">Field Notes</p>
        <h1>Blog</h1>
        <p class="lede">
          Placeholder posts for Studio-backed stories, updates, and learning resources.
        </p>
      </header>

      <BlogCard
        v-if="featuredPost"
        :post="featuredPost"
        featured
      />

      <section
        v-if="remainingPosts.length"
        class="blog-page__grid"
        aria-label="Blog posts"
      >
        <BlogCard
          v-for="post in remainingPosts"
          :key="post.path"
          :post="post"
        />
      </section>

      <p v-if="!posts?.length">No posts found.</p>
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

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(18px, 3vw, 28px);
    margin-top: clamp(18px, 3vw, 28px);
  }
}

@media (max-width: 760px) {
  .blog-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
