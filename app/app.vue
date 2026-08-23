<script setup lang="ts">
import { SITE_URL } from '~~/shared/site'

const route = useRoute()
const hasPageHero = computed(() => Boolean(route.meta.heroStages?.length))
const isHomePage = computed(() => route.path === '/')

// PROTOTYPE: compare the existing inner-page hero with a no-hero variant.
// Remove this query-param branch once the client chooses a direction.
const isNoHeroVariant = computed(() => route.query.variant === 'no-hero')
const showHero = computed(() => hasPageHero.value && (isHomePage.value || !isNoHeroVariant.value))
const showHeroPrototypeSwitcher = computed(() => (
  import.meta.dev && hasPageHero.value && !isHomePage.value
))

useHead({
  titleTemplate: 'WIEMO | %s',
  link: [
    {
      rel: 'canonical',
      href: computed(() => `${SITE_URL}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`),
    },
  ],
})
</script>
<template>
  <div class="site-shell">
    <PageBackground />
    <div class="site-shell__content">
      <NuxtRouteAnnouncer />
      <Navbar class="navbar__main" />
      <LazyHero v-if="showHero" />
      <NuxtPage />
      <SiteFooter />
      <HeroVisibilityPrototype v-if="showHeroPrototypeSwitcher" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.site-shell {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
}

.site-shell__content {
  position: relative;
  z-index: 1;

  :deep(.blog-post) {
    background:
      radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--atlas) 11%, transparent), transparent 544px),
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--black) 44%, transparent),
        color-mix(in srgb, var(--void) 16%, transparent) 42%,
        color-mix(in srgb, var(--black) 46%, transparent)
      );
  }
}

.navbar__main {
  position: fixed;
  top: 2.5vh;
  left: 10vw;
  width: 80vw;
  height: 7.5vh;
  border-radius: 20px;
  z-index: 100;
}

// A 10vw margin either side costs a phone a fifth of its width, which is space
// the nav links need far more than the layout needs breathing room.
@media (max-width: 1010px) {
  .navbar__main {
    left: 50%;
    width: calc(100% - 32px);
    transform: translateX(-50%);
  }
}

@media (max-width: 620px) {
  .navbar__main {
    top: 12px;
    width: calc(100% - 20px);
    border-radius: 16px;
  }
}
</style>
