<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(`reflection-post-${route.path}`, () =>
  queryCollection('reflections')
    .where('draft', '=', false)
    .path(route.path)
    .first()
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Reflection not found',
  })
}

useSeoMeta({
  title: () => post.value?.title ?? 'Reflection',
  description: () => post.value?.excerpt ?? '',
  ogImage: () => post.value?.thumbnail ?? '',
})
</script>

<template>
  <BlogArticle
    v-if="post"
    :post="post"
    back-to="/blog/reflections"
    back-label="Back to reflections"
  />
</template>
