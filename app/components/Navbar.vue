<script setup lang="ts">
import { NAVBAR_BLOG_CATEGORIES, NAVBAR_BLOG_POSTS, NAVBAR_ITEMS } from '~/navbar/items'

const route = useRoute()

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
</script>

<template>
  <nav class="navbar" aria-label="Particle physics site navigation">
    <NuxtLink class="navbar__brand" to="/" aria-label="Wiemo home">
      <img
        class="navbar__brand-mark"
        src="/logos/wiemo_navbar_darkmode.svg"
        alt=""
        aria-hidden="true"
      >
    </NuxtLink>
    <ul class="navbar__list">
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
          >
            {{ item.label }}
          </NuxtLink>

          <div
            v-if="NAVBAR_BLOG_POSTS.length"
            class="navbar__dropdown"
            aria-label="Blog posts"
          >
            <NuxtLink
              v-for="category in NAVBAR_BLOG_CATEGORIES"
              :key="category.to"
              class="navbar__dropdown-link navbar__dropdown-link--category"
              :to="category.to"
            >
              <span>{{ category.title }}</span>
            </NuxtLink>

            <NuxtLink
              v-for="post in NAVBAR_BLOG_POSTS"
              :key="post.to"
              class="navbar__dropdown-link"
              :to="post.to"
            >
              <span>{{ post.title }}</span>
              <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
            </NuxtLink>
          </div>
        </template>

        <NuxtLink
          v-else
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
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.2vw, 20px);
  min-height: 56px;
  overflow: visible;
  padding: 8px;
  isolation: isolate;
  background: rgb(8 11 18 / 10%);
  border: 1px solid rgb(189 232 251 / 10%);
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
        rgb(8 11 18 / 20%),
        rgb(8 11 18 / 34%) 42%,
        rgb(8 11 18 / 18%)
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
  padding-inline: clamp(12px, 1.3vw, 20px);
  border-radius: 14px;
  transition:
    background-color $transition-fast $transition-ease,
    filter $transition-fast $transition-ease;

  &:hover {
    background: rgb(51 180 236 / 8%);
    filter: drop-shadow(0 0 12px rgb(51 180 236 / 28%));
  }

  &:focus-visible {
    outline-offset: -2px;
  }
}

.navbar__brand-mark {
  display: block;
  width: clamp(112px, 11vw, 160px);
  height: auto;
  max-height: 30px;
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

.navbar__dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  display: grid;
  width: min(360px, calc(100vw - 40px));
  padding: 8px;
  border: 1px solid rgb(189 232 251 / 14%);
  border-radius: 8px;
  background: rgb(6 9 15 / 96%);
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
    font-size: 0.98rem;
    line-height: 1.16;
  }

  time {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 0.64rem;
    letter-spacing: 0.12em;
    line-height: 1;
    text-transform: uppercase;
  }

  &:hover,
  &:focus-visible {
    color: var(--core);
    background: rgb(51 180 236 / 9%);
  }
}

.navbar__dropdown-link--category {
  border-bottom: 1px solid rgb(189 232 251 / 10%);
}

@supports not (backdrop-filter: blur(1px)) {
  .navbar::before {
    background: rgb(8 11 18 / 88%);
  }
}

@media (max-width: $breakpoint-small) {
  .navbar {
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .navbar__brand {
    padding-inline: 10px;
  }

  .navbar__brand-mark {
    width: 104px;
  }

  .navbar__list {
    justify-content: flex-start;
  }

  .navbar__link {
    padding-inline: 12px;
  }

  .navbar__item--dropdown {
    position: static;
  }

  .navbar__dropdown {
    position: fixed;
    top: 92px;
    right: 16px;
    left: 16px;
    width: auto;
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
</style>
