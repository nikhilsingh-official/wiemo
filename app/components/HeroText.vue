<script setup lang="ts">
import HeroHeader from '~/components/HeroHeader.vue'
import type { TextOptionsInput } from '~/hero/text-typing/types'

withDefaults(
  defineProps<{
    headlineText: string
    textOptions?: TextOptionsInput
  }>(),
  {
    textOptions: () => ({}),
  },
)
</script>

<template>
  <div>
    <h3 class="hero__eyebrow">What Is Everything Made Of?</h3>
    <HeroHeader
      class="hero__header"
      :text="headlineText"
      :textoptions="textOptions"
    />
  </div>
</template>

<style scoped lang="scss">
.hero__eyebrow {
  font-family: "JetBrains Mono", sans-serif;
  font-size: 1.2vw;
  color: var(--faint);
}
</style>
