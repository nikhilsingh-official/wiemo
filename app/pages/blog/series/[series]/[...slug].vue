<script setup lang="ts">
const route = useRoute()
const seriesSlug = computed(() => String(route.params.series ?? ''))

const { data: post } = await useAsyncData(`series-post-${route.path}`, () =>
  queryCollection('series')
    .where('draft', '=', false)
    .where('seriesSlug', '=', seriesSlug.value)
    .path(route.path)
    .first()
)

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Series post not found',
  })
}

useSeoMeta({
  title: () => post.value?.title ?? 'Series',
  description: () => post.value?.excerpt ?? '',
  ogImage: () => post.value?.thumbnail ?? '',
})
</script>

<template>
  <BlogArticle
    v-if="post"
    :post="post"
    :back-to="`/blog/series/${seriesSlug}`"
    back-label="Back to series"
  />
</template>
