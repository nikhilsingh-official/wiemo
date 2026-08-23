<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'

const exploreLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Total Impact', to: '/total-impact' },
] as const

const involvementLinks = [
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Collaborate', to: '/collaborate' },
  { label: 'Reflections', to: '/blog/reflections' },
] as const
</script>

<template>
  <footer class="site-footer">
    <div class="wrap site-footer__inner">
      <div class="site-footer__brand">
        <NuxtLink to="/" aria-label="WIEMO home" no-prefetch>
          <img class="site-footer__logo site-footer__logo--dark" src="/logos/wiemo_navbar_darkmode.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
          <img class="site-footer__logo site-footer__logo--light" src="/logos/wiemo_navbar.svg" alt="" aria-hidden="true" loading="lazy" decoding="async">
        </NuxtLink>
        <p>{{ SITE_CONTENT.strapline }}</p>
      </div>

      <nav class="site-footer__nav" aria-label="Footer navigation">
        <div>
          <h2>Explore</h2>
          <ul>
            <li v-for="link in exploreLinks" :key="link.to"><NuxtLink :to="link.to" no-prefetch>{{ link.label }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h2>Get involved</h2>
          <ul>
            <li v-for="link in involvementLinks" :key="link.to"><NuxtLink :to="link.to" no-prefetch>{{ link.label }}</NuxtLink></li>
          </ul>
        </div>
      </nav>

      <div class="site-footer__contact">
        <h2>Contact</h2>
        <a :href="SITE_CONTENT.contact.emailHref">{{ SITE_CONTENT.contact.emailLabel }}</a>
        <p>Email is WIEMO’s current public contact channel.</p>
      </div>
    </div>
    <div class="wrap site-footer__base">
      <p>{{ SITE_CONTENT.initiativeName }}</p>
      <NuxtLink to="/" no-prefetch>Back to home</NuxtLink>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  border-top: 1px solid var(--line-soft);
  background: var(--void);
}

.site-footer__inner {
  display: grid;
  grid-template-columns: minmax(240px, 1.2fr) minmax(280px, 1fr) minmax(220px, 0.8fr);
  gap: clamp(40px, 7vw, 100px);
  align-items: start;
  padding-block: clamp(56px, 7vw, 92px);
  color: var(--body-copy);
}

.site-footer__brand {
  display: grid;
  gap: 20px;

  p {
    max-width: 330px;
    color: var(--mute);
    font-size: 15px;
  }
}

.site-footer__logo {
  width: min(220px, 100%);
  height: auto;
}

.site-footer__logo--light { display: none; }

:global(:root[data-theme='light']) .site-footer__logo--dark { display: none; }
:global(:root[data-theme='light']) .site-footer__logo--light { display: block; }

.site-footer__nav {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}

.site-footer h2 {
  margin-bottom: 14px;
  color: var(--faint);
  font-family: $font-mono;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.6px;
  text-transform: uppercase;
}

.site-footer ul {
  display: grid;
  gap: 9px;
  list-style: none;
}

.site-footer a {
  color: var(--beam);
  text-decoration: none;

  &:hover { color: var(--core); }
}

.site-footer__nav a {
  color: var(--body-copy);
  font-size: 14px;
}

.site-footer__contact {
  a {
    overflow-wrap: anywhere;
    font-family: $font-mono;
    font-size: 13px;
  }

  p {
    margin-top: 12px;
    color: var(--faint);
    font-size: 12px;
  }
}

.site-footer__base {
  display: flex;
  min-height: 72px;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--line-soft);
  color: var(--faint);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 0.08em;
}

@media (max-width: 900px) {
  .site-footer__inner { grid-template-columns: 1fr 1fr; }
  .site-footer__brand { grid-column: 1 / -1; }
}

@media (max-width: 600px) {
  .site-footer__inner { grid-template-columns: 1fr; gap: 40px; }
  .site-footer__brand { grid-column: auto; }
  .site-footer__base { align-items: flex-start; flex-direction: column; justify-content: center; padding-block: 20px; }
}
</style>
