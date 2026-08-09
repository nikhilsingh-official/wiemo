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
      radial-gradient(circle at 50% 0%, rgb(11 128 195 / 11%), transparent 544px),
      linear-gradient(180deg, rgb(4 6 11 / 44%), rgb(0 0 0 / 16%) 42%, rgb(4 6 11 / 46%));
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
