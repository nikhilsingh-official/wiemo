<script setup lang="ts">
const route = useRoute()
const showHero = computed(() => Boolean(route.meta.heroStages?.length))
</script>
<template>
  <div class="site-shell">
    <PageBackground />
    <div class="site-shell__content">
      <NuxtRouteAnnouncer />
      <Navbar class="navbar__main" />
      <Hero v-if="showHero" />
      <NuxtPage />
      <SiteFooter />
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
</style>
