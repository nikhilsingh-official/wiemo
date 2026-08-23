<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({ heroStages: [HERO_STAGE.collaborate] })

useSeoMeta({
  title: 'Collaborate',
  description: 'Schools, NGOs and educators can collaborate with WIEMO to bring engaging particle physics sessions to students and communities.',
})
</script>

<template>
  <main class="content-section">
    <div class="wrap collaboration-page">
      <aside class="collaboration-page__intro">
        <p class="collaboration-page__eyebrow">For organisations</p>
        <h1>Collaborate with us.</h1>
        <div class="collaboration-page__copy">
          <p>{{ SITE_CONTENT.collaboration.intro }}</p>
          <p>{{ SITE_CONTENT.collaboration.partnership }}</p>
          <p>{{ SITE_CONTENT.collaboration.invitation }}</p>
        </div>
        <a class="collaboration-page__contact" :href="SITE_CONTENT.contact.emailHref">
          <span>Email</span>
          <strong>{{ SITE_CONTENT.contact.emailLabel }}</strong>
        </a>
      </aside>

      <OrganizationForm />
    </div>
  </main>
</template>

<style scoped lang="scss">
.collaboration-page {
  display: grid;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(48px, 7vw, 108px);
  align-items: start;
  max-width: 1240px;
}

.collaboration-page__intro {
  position: sticky;
  top: 128px;

  h1 {
    margin-top: 14px;
    font-size: clamp(52px, 6vw, 84px);
    line-height: 0.9;
  }
}

.collaboration-page__eyebrow {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.collaboration-page__copy {
  display: grid;
  gap: 18px;
  margin-top: 32px;

  p {
    color: var(--body-copy);
    font-size: 15px;
    line-height: 1.75;
  }
}

.collaboration-page__contact {
  display: grid;
  gap: 3px;
  margin-top: 36px;
  padding-top: 18px;
  border-top: 1px solid color-mix(in srgb, var(--beam) 28%, transparent);

  span {
    color: var(--faint);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
  }

  strong {
    color: var(--core);
    font-family: $font-mono;
    font-size: 13px;
    font-weight: 500;
  }
}

@media (max-width: 900px) {
  .collaboration-page { grid-template-columns: 1fr; }
  .collaboration-page__intro { position: static; }
}
</style>
