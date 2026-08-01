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
          <p class="eyebrow">Our mission</p>
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
          <span class="section-number">01</span>
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
          <span class="section-number">02</span>
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
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
  gap: clamp(28px, 6vw, 72px);
  align-items: start;

  h1 {
    max-width: 11ch;
    font-size: clamp(3rem, 8vw, 6.5rem);
    line-height: 0.9;
  }
}

.home-intro__copy {
  display: grid;
  gap: 20px;
  color: var(--body-copy);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.85;
}

.impact-grid,
.partner-grid,
.page-preview-grid {
  display: grid;
  gap: clamp(16px, 3vw, 24px);
  margin-top: clamp(24px, 4vw, 44px);
}

.impact-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.impact-card,
.page-preview {
  padding: clamp(22px, 3vw, 34px);
  border: 1px solid rgb(189 232 251 / 12%);
  border-radius: 18px;
  background: linear-gradient(145deg, rgb(8 11 18 / 78%), rgb(4 6 11 / 92%));
}

.impact-card {
  dt {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  dd {
    margin-top: 12px;
    color: var(--core);
    font-family: $font-display;
    font-size: clamp(2.6rem, 7vw, 5.6rem);
    font-weight: 700;
    line-height: 1;
  }

  p {
    margin-top: 12px;
    color: var(--faint);
  }
}

.partner-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.partner-card {
  display: grid;
  min-height: 150px;
  place-items: center;
  padding: 24px;
  border: 1px solid rgb(189 232 251 / 12%);
  border-radius: 18px;
  background: rgb(255 255 255 / 3%);

  img {
    max-height: 74px;
    object-fit: contain;
    filter: grayscale(1) brightness(1.18);
  }
}

.page-preview-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.page-preview {
  color: inherit;
  text-decoration: none;

  h2 {
    color: var(--core);
    font-size: clamp(1.25rem, 2vw, 1.8rem);
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
    font-size: clamp(2rem, 5vw, 4.6rem);
    font-weight: 700;
    line-height: 1;
  }

  footer {
    margin-top: 20px;
    color: var(--mute);
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;

    span {
      display: block;
      margin-top: 8px;
      color: var(--faint);
    }
  }
}

@media (max-width: 920px) {
  .home-intro__grid,
  .impact-grid,
  .partner-grid,
  .page-preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
