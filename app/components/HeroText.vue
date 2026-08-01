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
    <h3 class="hero__eyebrow">{{ SITE_CONTENT.initiativeName }}</h3>
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
.hero__eyebrow {
  font-family: "JetBrains Mono", sans-serif;
  max-width: 42rem;
  font-size: clamp(0.72rem, 1.05vw, 1.05rem);
  color: var(--faint);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero__copy {
  max-width: 44rem;
  margin: 1rem 0 0;
  color: var(--body-copy);
  line-height: 1.7;
}

.hero__CTA {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  margin-top: 1.4rem;
  padding-top: 0.2rem;
}

.hero__CTA__bright,
.hero__CTA__dim {
  position: relative;
  min-height: 44px;
  padding: 0.75rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 7.5px;
  font-family: $font-mono;
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.12em;
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
  color: #eefaff;
  background: transparent;
  border-color: rgb(51 180 236 / 34%);
  box-shadow:
    0 12px 28px rgb(0 0 0 / 26%),
    0 0 18px rgb(11 128 195 / 16%),
    inset 0 1px 0 rgb(255 255 255 / 14%);
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
      rgb(255 255 255 / 7%),
      rgb(51 180 236 / 18%) 42%,
      rgb(11 128 195 / 16%)
    );
  content: '';
}

.hero__CTA__bright:hover {
  color: #ffffff;
  border-color: rgb(51 180 236 / 54%);
  box-shadow:
    0 14px 32px rgb(0 0 0 / 30%),
    0 0 24px rgb(51 180 236 / 22%),
    inset 0 1px 0 rgb(255 255 255 / 18%);
}

.hero__CTA__dim {
  color: var(--faint);
  background: transparent;
  border-color: rgb(189 232 251 / 24%);
}

.hero__CTA__dim:hover {
  color: var(--beam);
  background: rgb(51 180 236 / 6%);
  border-color: rgb(51 180 236 / 38%);
}
</style>
