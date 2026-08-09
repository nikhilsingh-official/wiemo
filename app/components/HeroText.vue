<script setup lang="ts">
import HeroHeader from '~/components/HeroHeader.vue'
import { SITE_CONTENT } from '~/content/siteContent'
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
    <HeroHeader
      class="hero__header"
      :text="headlineText"
      :textoptions="textOptions"
    />
    <p class="hero__copy">
      {{ SITE_CONTENT.shortDescription }}
    </p>
    <div class="hero__CTA">
      <NuxtLink to="/volunteer"><button class="hero__CTA__bright">Volunteer</button></NuxtLink>
      <NuxtLink to="/about"><button class="hero__CTA__dim">Learn More</button></NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero__copy {
  max-width: 704px;
  margin: 20px 0 0;
  color: var(--body-copy);
  line-height: 1.7;
}

.hero__CTA {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 22px;
  padding-top: 3px;
}

.hero__CTA__bright,
.hero__CTA__dim {
  position: relative;
  min-height: 44px;
  padding: 12px 20px;
  border: 1px solid transparent;
  border-radius: 7.5px;
  font-family: $font-mono;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color $transition-fast $transition-ease,
    border-color $transition-fast $transition-ease,
    box-shadow $transition-fast $transition-ease,
    color $transition-fast $transition-ease;
}

.hero__CTA__bright {
  isolation: isolate;
  overflow: hidden;
  color: var(--ink);
  background: transparent;
  border-color: color-mix(in srgb, var(--beam) 34%, transparent);
  box-shadow:
    0 12px 28px rgb(0 0 0 / 26%),
    0 0 18px color-mix(in srgb, var(--atlas) 16%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--ink) 14%, transparent);
  backdrop-filter: blur(14px) saturate(130%);
  -webkit-backdrop-filter: blur(14px) saturate(130%);
}

.hero__CTA__bright::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--ink) 7%, transparent),
      color-mix(in srgb, var(--beam) 18%, transparent) 42%,
      color-mix(in srgb, var(--atlas) 16%, transparent)
    );
  content: '';
}

.hero__CTA__bright:hover {
  color: var(--ink);
  border-color: color-mix(in srgb, var(--beam) 54%, transparent);
  box-shadow:
    0 14px 32px rgb(0 0 0 / 30%),
    0 0 24px color-mix(in srgb, var(--beam) 22%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--ink) 18%, transparent);
}

.hero__CTA__dim {
  color: var(--faint);
  background: transparent;
  border-color: color-mix(in srgb, var(--core) 24%, transparent);
}

.hero__CTA__dim:hover {
  color: var(--beam);
  background: color-mix(in srgb, var(--beam) 6%, transparent);
  border-color: color-mix(in srgb, var(--beam) 38%, transparent);
}
</style>
