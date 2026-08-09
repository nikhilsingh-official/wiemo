<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'
import { HOME_HERO_STAGES } from '~/hero/stages'

definePageMeta({
  heroStages: HOME_HERO_STAGES,
})
</script>

<template>
  <main>
    <section class="content-section home-intro">
      <div class="wrap home-intro__grid">
        <div>
          <h1>{{ SITE_CONTENT.strapline }}</h1>
        </div>
        <div class="home-intro__copy">
          <p
            v-for="paragraph in SITE_CONTENT.mission"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="wrap">
        <div class="section-heading">
          <h2>Current impact</h2>
        </div>
        <p class="lede">{{ SITE_CONTENT.goal }}</p>

        <dl class="impact-grid">
          <div
            v-for="metric in SITE_CONTENT.impactMetrics"
            :key="metric.label"
            class="impact-card"
          >
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
            <p>{{ metric.note }}</p>
          </div>
        </dl>
      </div>
    </section>

    <section class="content-section">
      <div class="wrap">
        <div class="section-heading">
          <h2>Partners</h2>
        </div>
        <p class="lede">
          Prototype partner section using the logos and links listed in the source document.
        </p>

        <div class="partner-grid">
          <a
            v-for="partner in SITE_CONTENT.partners"
            :key="partner.name"
            class="partner-card"
            :href="partner.url"
            target="_blank"
            rel="noreferrer"
          >
            <img
              :src="partner.logo"
              :alt="partner.name"
            >
          </a>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="wrap page-preview-grid">
        <NuxtLink
          v-for="preview in SITE_CONTENT.pagePreviews"
          :key="preview.to"
          class="page-preview"
          :to="preview.to"
        >
          <h2>{{ preview.title }}</h2>
          <p>{{ preview.copy }}</p>
        </NuxtLink>
      </div>
    </section>

    <section class="content-section">
      <div class="wrap">
        <blockquote class="testimonial">
          <p>“{{ SITE_CONTENT.testimonial.quote }}”</p>
          <footer>
            — {{ SITE_CONTENT.testimonial.attribution }}
            <span>{{ SITE_CONTENT.testimonial.note }}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.home-intro__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 72px;
  align-items: start;

  h1 {
    max-width: 55vw;
    font-size: 5vw;
    line-height: 0.9;
  }
}

.home-intro__copy {
  display: flex;
  flex: 1 1 520px;
  flex-direction: column;
  gap: 20px;
  color: var(--body-copy);
  font-size: 18px;
  line-height: 1.85;
}

.impact-grid,
.partner-grid,
.page-preview-grid {
  @include responsive-card-gap;

  display: flex;
  gap: var(--card-gap);
  margin-top: 44px;
}

.impact-grid {
  align-items: stretch;
}

.impact-card,
.page-preview {
  padding: 34px;
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  border-radius: 18px;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--panel) 78%, transparent),
    color-mix(in srgb, var(--black) 92%, transparent)
  );
}

.impact-card {
  flex: 1 1 0;
  min-width: 0;

  dt {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  dd {
    margin-top: 12px;
    color: var(--core);
    font-family: $font-display;
    font-size: 90px;
    font-weight: 700;
    line-height: 1;
  }

  p {
    margin-top: 12px;
    color: var(--faint);
  }
}

.partner-grid {
  align-items: stretch;
}

.partner-card {
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 150px;
  padding: 24px;
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--ink) 3%, transparent);

  img {
    max-height: 74px;
    object-fit: contain;
    filter: grayscale(1) brightness(1.18);
  }
}

.page-preview-grid {
  align-items: stretch;
}

.page-preview {
  flex: 1 1 0;
  min-width: 0;
  color: inherit;
  text-decoration: none;

  h2 {
    color: var(--core);
    font-size: 29px;
  }

  p {
    margin-top: 12px;
    color: var(--body-copy);
  }
}

.testimonial {
  max-width: 860px;
  color: var(--ink);

  p {
    font-family: $font-display;
    font-size: 74px;
    font-weight: 700;
    line-height: 1;
  }

  footer {
    margin-top: 20px;
    color: var(--mute);
    font-family: $font-mono;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;

    span {
      display: block;
      margin-top: 8px;
      color: var(--faint);
    }
  }
}

@media (max-width: 1480px) {
  .testimonial p {
    font-size: 5vw;
  }
}

@media (max-width: 1450px) {
  .page-preview h2 {
    font-size: 2vw;
  }
}

@media (max-width: 1280px) {
  .impact-card dd {
    font-size: 7vw;
  }
}

@media (max-width: 1200px) {
  .home-intro__grid {
    gap: 6vw;
  }

  .home-intro__copy {
    font-size: 1.5vw;
  }
}

@media (max-width: 1130px) {
  .impact-card,
  .page-preview {
    padding: 3vw;
  }
}

@media (max-width: 1100px) {
  .impact-grid,
  .partner-grid,
  .page-preview-grid {
    margin-top: 4vw;
  }
}

@media (max-width: 1060px) {
  .home-intro__copy {
    font-size: 16px;
  }
}

@media (max-width: 1000px) {
  .page-preview h2 {
    font-size: 20px;
  }
}

@media (max-width: 730px) {
  .impact-card,
  .page-preview {
    padding: 22px;
  }
}

@media (max-width: 620px) {
  .impact-card dd {
    font-size: 42px;
  }

  .testimonial p {
    font-size: 32px;
  }
}

@media (max-width: 600px) {
  .impact-grid,
  .partner-grid,
  .page-preview-grid {
    margin-top: 24px;
  }
}

@media (max-width: 470px) {
  .home-intro__grid {
    gap: 28px;
  }
}

@media (max-width: 920px) {
  .home-intro__grid,
  .impact-grid,
  .partner-grid,
  .page-preview-grid {
    flex-direction: column;
  }

  .home-intro__grid > *,
  .home-intro__copy,
  .impact-card,
  .partner-card,
  .page-preview {
    flex-basis: auto;
  }
}
</style>
