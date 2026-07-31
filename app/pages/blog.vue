<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.blog],
})

const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('content').all()
)
</script>

<template>
  <main>
    <h1>Blog</h1>

    <article v-for="post in posts" :key="post.path">
      <header>
        <h2>{{ post.title }}</h2>
        <time v-if="post.meta.date" :datetime="String(post.meta.date)">
          {{ post.meta.date }}
        </time>
      </header>

      <ContentRenderer :value="post" />
    </article>

    <p v-if="!posts?.length">No posts found.</p>
  </main>
</template>
