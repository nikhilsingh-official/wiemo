<script setup lang="ts">
const route = useRoute()
const showHero = computed(() => Boolean(route.meta.heroStages?.length))
</script>
<template>
  <NuxtRouteAnnouncer />
  <Navbar class="navbar__main" />
  <Hero v-if="showHero" />
  <NuxtPage />
  <SiteFooter />
</template>
<style lang="scss" scoped>
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
