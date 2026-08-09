<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'
</script>

<template>
  <footer class="site-footer">
    <div class="wrap site-footer__inner">
      <div>
        <p>{{ SITE_CONTENT.initiativeName }}</p>
      </div>

      <p class="site-footer__contact">
        {{ SITE_CONTENT.contact.emailLabel }}
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  border-top: 1px solid $line-soft;
  background: $void;
}

.site-footer__inner {
  display: flex;
  min-height: 140px;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  color: var(--body-copy);
}

.site-footer__contact {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
</style>
