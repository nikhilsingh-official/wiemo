<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.reflections],
})

const { data: posts } = await useAsyncData('reflection-posts', () =>
  queryCollection('reflections')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <main class="content-section blog-page">
    <div class="wrap">
      <header class="blog-page__header">
        <p class="eyebrow">Blog</p>
        <h1>Reflections</h1>
        <p class="lede">
          Notes, ideas, and observations from the work behind WIEMO.
        </p>
      </header>

      <section
        v-if="posts?.length"
        class="blog-page__grid"
        aria-label="Reflection posts"
      >
        <BlogCard
          v-for="post in posts"
          :key="post.path"
          :post="post"
        />
      </section>

      <p v-else>No reflections found.</p>
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
  }
}

@media (max-width: 760px) {
  .blog-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
