<script setup lang="ts">
import { NAVBAR_ITEMS } from '~/navbar/items'
</script>

<template>
  <nav class="navbar" aria-label="Particle physics site navigation">
    <ul class="navbar__list">
      <li class="navbar__item navbar__logo">
        <NuxtLink class="navbar__link" to="/">
          wiemo
        </NuxtLink>
      </li>
      <li
        v-for="item in NAVBAR_ITEMS"
        :key="item.to"
        class="navbar__item"
      >
        <NuxtLink
          class="navbar__link"
          exact-active-class="navbar__link--active"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  min-height: 56px;
  overflow-x: auto;
  isolation: isolate;
  background:
    linear-gradient(
      115deg,
      rgb(189 232 251 / 8%),
      rgb(8 11 18 / 48%) 32%,
      rgb(11 15 24 / 62%)
    );
  border: 1px solid rgb(189 232 251 / 14%);
  box-shadow:
    0 18px 48px rgb(0 0 0 / 38%),
    inset 0 1px 0 rgb(255 255 255 / 7%);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  scrollbar-width: none;
  opacity: 0.75;
  &::-webkit-scrollbar {
    display: none;
  }
}

.navbar__list {
  display: flex;
  width: 100%;
  min-width: max-content;
  height: 100%;
  min-height: inherit;
  align-items: center;
  justify-content: space-between;
  gap: clamp(4px, 0.5vw, 8px);
  padding: 8px;
  border-radius: inherit;
  list-style: none;
}

.navbar__item {
  display: flex;
  align-items: center;
}

.navbar__logo {
  padding: 16px;
}

.navbar__link {
  position: relative;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  padding-inline: clamp(12px, 1.25vw, 20px);
  border-radius: 14px;
  color: var(--body-copy);
  font-family: $font-mono;
  font-size: clamp(0.62rem, 0.72vw, 0.72rem);
  font-weight: 500;
  letter-spacing: 0.09em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    color $transition-fast $transition-ease,
    background-color $transition-fast $transition-ease,
    text-shadow $transition-fast $transition-ease;

  &::after {
    position: absolute;
    right: 14px;
    bottom: 7px;
    left: 14px;
    height: 1px;
    background: var(--beam);
    box-shadow: 0 0 9px rgb(51 180 236 / 70%);
    content: '';
    opacity: 0;
    transform: scaleX(0.35);
    transition:
      opacity $transition-fast $transition-ease,
      transform $transition-fast $transition-ease;
  }

  &:hover {
    color: var(--beam);
    background: rgb(51 180 236 / 8%);
    text-shadow: 0 0 18px rgb(51 180 236 / 35%);
  }

  &:focus-visible {
    outline-offset: -2px;
  }

  &--active {
    color: var(--beam);
    background: rgb(11 128 195 / 11%);

    &::after {
      opacity: 1;
      transform: scaleX(1);
    }
  }
}

@supports not (backdrop-filter: blur(1px)) {
  .navbar {
    background: rgb(8 11 18 / 94%);
  }
}

@media (max-width: $breakpoint-small) {
  .navbar__list {
    justify-content: flex-start;
  }

  .navbar__link {
    padding-inline: 12px;
  }
}
</style>
