<script setup lang="ts">
import type { NuxtError } from '#app'
import { SITE_CONTENT } from '~/content/siteContent'

const props = defineProps<{ error: NuxtError }>()
const isNotFound = computed(() => props.error.statusCode === 404)

useHead({
  title: () => isNotFound.value ? 'WIEMO | Page Not Found' : 'WIEMO | Something Went Wrong',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <div class="error-page">
    <PageBackground />
    <header class="error-page__header wrap">
      <NuxtLink to="/" aria-label="WIEMO home">
        <img class="error-page__logo error-page__logo--dark" src="/logos/wiemo_navbar_darkmode.svg" alt="" aria-hidden="true">
        <img class="error-page__logo error-page__logo--light" src="/logos/wiemo_navbar.svg" alt="" aria-hidden="true">
      </NuxtLink>
    </header>

    <main class="error-page__main wrap">
      <p class="error-page__code">{{ error.statusCode }}</p>
      <h1>{{ isNotFound ? 'This page is beyond our detector.' : 'Something went off course.' }}</h1>
      <p>
        {{ isNotFound
          ? 'The WIEMO page you requested does not exist or may have moved.'
          : 'Please try again, or return to the WIEMO homepage.' }}
      </p>
      <div class="error-page__actions">
        <button class="button button--primary" type="button" @click="clearError({ redirect: '/' })">
          Return home
        </button>
        <a class="button button--ghost" :href="SITE_CONTENT.contact.emailHref">Contact WIEMO</a>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped lang="scss">
.error-page {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
}

.error-page__header,
.error-page__main,
:deep(.site-footer) {
  position: relative;
  z-index: 1;
}

.error-page__header {
  display: flex;
  min-height: 112px;
  align-items: center;
}

.error-page__logo {
  width: 190px;
  height: auto;
}

.error-page__logo--light { display: none; }
:global(:root[data-theme='light']) .error-page__logo--dark { display: none; }
:global(:root[data-theme='light']) .error-page__logo--light { display: block; }

.error-page__main {
  display: grid;
  min-height: calc(100vh - 112px);
  align-content: center;
  padding-block: 72px 120px;

  h1 {
    max-width: 850px;
    font-size: clamp(48px, 7vw, 100px);
    line-height: 0.92;
  }

  > p:not(.error-page__code) {
    max-width: 620px;
    margin-top: 24px;
    color: var(--body-copy);
    font-size: 17px;
  }
}

.error-page__code {
  margin-bottom: 18px;
  color: var(--beam);
  font-family: $font-mono;
  font-size: 14px;
  letter-spacing: 0.25em;
}

.error-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

@media (max-width: 600px) {
  .error-page__main { min-height: calc(100svh - 96px); padding-block: 48px 80px; }
  .error-page__main h1 { font-size: 44px; }
}
</style>
