<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'

useSeoMeta({
  title: 'Volunteer',
  description: 'Volunteer with WIEMO to teach physics, build educational resources or help share accessible particle physics with more students.',
})
</script>

<template>
  <main class="content-section">
    <div class="wrap volunteer-page">
      <header class="volunteer-page__header">
        <p class="volunteer-page__eyebrow">Join the initiative</p>
        <h1>Volunteer With Us</h1>
        <h2>Do you love physics? Do you want to make an impact?</h2>
        <p class="volunteer-page__contact">
          Questions? Email
          <a :href="SITE_CONTENT.contact.emailHref">{{ SITE_CONTENT.contact.emailLabel }}</a>.
        </p>
      </header>
      <VolunteerForm />
    </div>
  </main>
</template>

<style scoped lang="scss">
.volunteer-page {
  display: flex;
  flex-direction: column;
  gap: 44px;
  max-width: 1180px;

  h1 {
    @include responsive-page-heading;

    line-height: 0.9;
  }

  h2 {
    @include responsive-tertiary-heading;

    margin-top: 14px;
    color: var(--body-copy);
  }
}

.volunteer-page__header {
  max-width: 860px;
}

.volunteer-page__eyebrow {
  margin-bottom: 12px;
  color: var(--beam);
  font-family: $font-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.volunteer-page__contact {
  margin-top: 20px;
  color: var(--mute);
  font-size: 14px;
}
</style>
