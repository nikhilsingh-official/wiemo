<script setup lang="ts">
import { NAVBAR_BLOG_CATEGORIES, NAVBAR_ITEMS } from '~/navbar/items'

const route = useRoute()
const { colorMode, toggleColorMode } = useColorMode()
const isMenuOpen = ref(false)

const colorModeToggleLabel = computed(() =>
  `Switch to ${colorMode.value === 'dark' ? 'light' : 'dark'} mode`,
)

watch(() => route.fullPath, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <nav class="navbar" aria-label="WIEMO site navigation" @keydown.esc="isMenuOpen = false">
    <NuxtLink class="navbar__brand" to="/" aria-label="WIEMO home" no-prefetch>
      <img
        class="navbar__brand-mark navbar__brand-mark--dark"
        src="/logos/wiemo_navbar_darkmode.svg"
        alt=""
        aria-hidden="true"
      >
      <img
        class="navbar__brand-mark navbar__brand-mark--light"
        src="/logos/wiemo_navbar.svg"
        alt=""
        aria-hidden="true"
      >
    </NuxtLink>
    <ul id="primary-navigation" :class="['navbar__list', { 'navbar__list--open': isMenuOpen }]">
      <li
        v-for="item in NAVBAR_ITEMS"
        :key="item.to"
        :class="[
          'navbar__item',
          { 'navbar__item--dropdown': item.label === 'Blog' },
        ]"
      >
        <template v-if="item.label === 'Blog'">
          <NuxtLink
            :class="[
              'navbar__link',
              { 'navbar__link--active': route.path.startsWith('/blog') },
            ]"
            :to="item.to"
            aria-haspopup="true"
            no-prefetch
          >
            {{ item.label }}
          </NuxtLink>

          <div class="navbar__dropdown" aria-label="Blog categories">
            <NuxtLink
              v-for="category in NAVBAR_BLOG_CATEGORIES"
              :key="category.to"
              class="navbar__dropdown-link navbar__dropdown-link--category"
              :to="category.to"
              no-prefetch
            >
              <span>{{ category.title }}</span>
            </NuxtLink>
          </div>
        </template>

        <NuxtLink
          v-else
          class="navbar__link"
          exact-active-class="navbar__link--active"
          :to="item.to"
          no-prefetch
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
    <button
      class="navbar__menu-toggle"
      type="button"
      aria-controls="primary-navigation"
      :aria-expanded="isMenuOpen"
      :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
      @click="isMenuOpen = !isMenuOpen"
    >
      <span /><span /><span />
    </button>
    <button
      class="navbar__theme-toggle"
      type="button"
      :aria-label="colorModeToggleLabel"
      :aria-pressed="colorMode === 'light'"
      :title="colorModeToggleLabel"
      @click="toggleColorMode"
    >
      <svg class="navbar__theme-icon navbar__theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />
      </svg>
      <svg class="navbar__theme-icon navbar__theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  </nav>
</template>

<style lang="scss">
:root[data-theme='light'] {
  .navbar__brand-mark--dark,
  .navbar__theme-icon--moon {
    display: none;
  }

  .navbar__brand-mark--light,
  .navbar__theme-icon--sun {
    display: block;
  }
}
</style>

<style scoped lang="scss">
.navbar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 56px;
  overflow: visible;
  padding: 8px;
  isolation: isolate;
  background: color-mix(in srgb, var(--panel) 28%, transparent);
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  box-shadow: 0 24px 70px rgb(0 0 0 / 34%);
  backdrop-filter: blur(28px) saturate(165%) contrast(112%);
  -webkit-backdrop-filter: blur(28px) saturate(165%) contrast(112%);
  scrollbar-width: none;

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background:
      linear-gradient(
        115deg,
        color-mix(in srgb, var(--panel) 20%, transparent),
        color-mix(in srgb, var(--panel) 44%, transparent) 42%,
        color-mix(in srgb, var(--panel) 24%, transparent)
      );
    content: '';
    opacity: 1;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.navbar__brand {
  display: inline-flex;
  flex: 0 0 auto;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-inline: 20px;
  border-radius: 14px;
  transition:
    background-color $transition-fast $transition-ease,
    filter $transition-fast $transition-ease;

  &:hover {
    background: color-mix(in srgb, var(--beam) 8%, transparent);
    filter: drop-shadow(0 0 12px color-mix(in srgb, var(--beam) 28%, transparent));
  }

  &:focus-visible {
    outline-offset: -2px;
  }
}

.navbar__brand-mark {
  display: block;
  width: 160px;
  height: auto;
  max-height: 30px;
}

.navbar__brand-mark--light {
  display: none;
}

.navbar__theme-toggle {
  display: inline-flex;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--beam) 20%, transparent);
  border-radius: 14px;
  color: var(--beam);
  background: color-mix(in srgb, var(--panel) 40%, transparent);
  transition:
    color $transition-fast $transition-ease,
    background-color $transition-fast $transition-ease,
    border-color $transition-fast $transition-ease,
    transform $transition-fast $transition-ease;
  cursor: pointer;

  &:hover {
    color: var(--core);
    background: color-mix(in srgb, var(--beam) 12%, transparent);
    border-color: color-mix(in srgb, var(--beam) 45%, transparent);
    transform: rotate(8deg);
  }

  &:focus-visible {
    outline-offset: -2px;
  }
}

.navbar__menu-toggle {
  display: none;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;
  border: 1px solid color-mix(in srgb, var(--beam) 20%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--panel) 40%, transparent);
  cursor: pointer;
  place-content: center;

  span {
    display: block;
    width: 18px;
    height: 1px;
    margin-block: 3px;
    background: var(--beam);
  }
}

.navbar__theme-icon {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.navbar__theme-icon--moon {
  fill: currentColor;
  stroke: none;
}

.navbar__theme-icon--sun {
  display: none;
}

.navbar__list {
  display: flex;
  width: 100%;
  min-width: max-content;
  height: 100%;
  min-height: inherit;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0;
  border-radius: inherit;
  list-style: none;
}

.navbar__item {
  position: relative;
  display: flex;
  align-items: center;
}

.navbar__item--dropdown {
  &:hover,
  &:focus-within {
    .navbar__dropdown {
      visibility: visible;
      opacity: 1;
      transform: translate(-50%, 0);
      pointer-events: auto;
    }
  }
}

.navbar__link {
  position: relative;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  padding-inline: 20px;
  border-radius: 14px;
  color: var(--body-copy);
  font-family: $font-mono;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
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
    box-shadow: 0 0 9px color-mix(in srgb, var(--beam) 70%, transparent);
    content: '';
    opacity: 0;
    transform: scaleX(0.35);
    transition:
      opacity $transition-fast $transition-ease,
      transform $transition-fast $transition-ease;
  }

  &:hover {
    color: var(--beam);
    background: color-mix(in srgb, var(--beam) 8%, transparent);
    text-shadow: 0 0 18px color-mix(in srgb, var(--beam) 35%, transparent);
  }

  &:focus-visible {
    outline-offset: -2px;
  }

  &--active {
    color: var(--beam);
    background: color-mix(in srgb, var(--atlas) 11%, transparent);

    &::after {
      opacity: 1;
      transform: scaleX(1);
    }
  }
}

.navbar__dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  display: grid;
  width: min(360px, calc(100vw - 40px));
  padding: 8px;
  border: 1px solid color-mix(in srgb, var(--core) 14%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--panel) 96%, transparent);
  box-shadow: 0 24px 56px rgb(0 0 0 / 42%);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -4px);
  transition:
    opacity $transition-fast $transition-ease,
    transform $transition-fast $transition-ease,
    visibility $transition-fast $transition-ease;
  visibility: hidden;
}

.navbar__dropdown-link {
  display: grid;
  gap: 5px;
  padding: 13px 14px;
  border-radius: 6px;
  color: var(--body-copy);
  text-decoration: none;
  transition:
    background-color $transition-fast $transition-ease,
    color $transition-fast $transition-ease;

  span {
    color: var(--ink);
    font-family: $font-display;
    font-size: 16px;
    line-height: 1.16;
  }

  time {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 10px;
    letter-spacing: 1px;
    line-height: 1;
    text-transform: uppercase;
  }

  &:hover,
  &:focus-visible {
    color: var(--core);
    background: color-mix(in srgb, var(--beam) 9%, transparent);
  }
}

@media (max-width: 1660px) {
  .navbar {
    gap: 1.2vw;
  }

  .navbar__list {
    gap: 0.5vw;
  }

  .navbar__link {
    padding-inline: 1.25vw;
    font-size: 0.72vw;
  }
}

@media (max-width: 1540px) {
  .navbar__brand {
    padding-inline: 1.3vw;
  }
}

@media (max-width: 1450px) {
  .navbar__brand-mark {
    width: 11vw;
  }
}

@media (max-width: 1390px) {
  .navbar__link {
    font-size: 10px;
  }
}

@media (max-width: 1010px) {
  .navbar__brand-mark {
    width: 112px;
  }

  // Eight mono labels stop fitting here. The list becomes the scroller rather
  // than the whole bar, so the brand and the theme toggle stay put and the
  // bar's own background never scrolls out from under its contents.
  .navbar__list {
    min-width: 0;
    justify-content: flex-start;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  // A scrolling list clips its own children, so the dropdown leaves the flow
  // and anchors to the viewport instead of to the link that opens it.
  .navbar__item--dropdown {
    position: static;
  }

  .navbar__dropdown {
    position: fixed;
    top: 92px;
    right: 16px;
    left: auto;
    width: min(360px, calc(100vw - 32px));
    transform: translateY(-4px);
  }

  .navbar__item--dropdown {
    &:hover,
    &:focus-within {
      .navbar__dropdown {
        transform: translateY(0);
      }
    }
  }
}

@media (max-width: 960px) {
  .navbar__brand,
  .navbar__link {
    padding-inline: 12px;
  }
}

@media (max-width: 840px) {
  .navbar {
    gap: 10px;
  }

  .navbar__list {
    gap: 4px;
  }
}

.navbar__dropdown-link--category {
  border-bottom: 1px solid color-mix(in srgb, var(--core) 10%, transparent);
}

@supports not (backdrop-filter: blur(1px)) {
  .navbar::before {
    background: color-mix(in srgb, var(--panel) 88%, transparent);
  }
}

@media (max-width: $breakpoint-small) {
  .navbar {
    gap: 8px;
  }

  .navbar__brand {
    padding-inline: 10px;
  }

  .navbar__brand-mark {
    width: 104px;
  }

  .navbar__link {
    padding-inline: 12px;
  }

  .navbar__menu-toggle {
    display: grid;
  }

  .navbar__list {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    left: 0;
    display: none;
    width: auto;
    max-height: calc(100dvh - 96px);
    min-height: 0;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid color-mix(in srgb, var(--core) 14%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--panel) 98%, transparent);
    box-shadow: 0 24px 56px rgb(0 0 0 / 42%);

    &--open {
      display: grid;
    }
  }

  .navbar__item,
  .navbar__link {
    width: 100%;
  }

  .navbar__dropdown {
    display: none;
  }

  // Too narrow for a floating panel — the dropdown spans the screen instead.
  .navbar__dropdown {
    right: 16px;
    left: 16px;
    width: auto;
  }
}
</style>
