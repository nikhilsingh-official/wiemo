<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'
import { WIEMO_IMPACT } from '~/content/impact'

useSeoMeta({
  title: 'Total Impact',
  description: `See WIEMO’s progress toward reaching ${WIEMO_IMPACT.studentGoal.toLocaleString('en')} students through accessible particle physics education by the end of ${WIEMO_IMPACT.studentGoalYear}.`,
})
</script>

<template>
  <main class="content-section">
    <div class="wrap total-impact">
      <header>
        <h1>Total Impact</h1>
        <h2>Progress toward {{ WIEMO_IMPACT.studentGoal.toLocaleString('en') }} students</h2>
        <p class="lede">{{ SITE_CONTENT.goal }}</p>
      </header>

      <dl class="total-impact__grid">
        <div
          v-for="metric in SITE_CONTENT.impactMetrics"
          :key="metric.label"
          class="total-impact__card"
        >
          <dt>{{ metric.label }}</dt>
          <dd>{{ metric.value }}</dd>
          <p>{{ metric.note }}</p>
        </div>
      </dl>
    </div>
  </main>
</template>

<style scoped lang="scss">
.total-impact {
  display: flex;
  flex-direction: column;
  gap: 56px;

  h1 {
    @include responsive-page-heading;

    max-width: 760px;
    line-height: 0.9;
  }

  h2 {
    max-width: 760px;
    margin-top: 14px;
    color: var(--body-copy);
    font-family: $font-display;
    font-size: clamp(25px, 3.2vw, 46px);
    line-height: 1;
  }
}

.total-impact__grid {
  @include responsive-card-gap;

  display: flex;
  gap: var(--card-gap);
}

.total-impact__card {
  flex: 1 1 0;
  min-width: 0;
  padding: 42px;
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--panel) 78%, transparent);

  dt {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  dd {
    margin-top: 14px;
    color: var(--core);
    font-family: $font-display;
    font-size: 112px;
    font-weight: 700;
    line-height: 1;
  }

  p {
    margin-top: 14px;
    color: var(--faint);
  }
}

@media (max-width: 1240px) {
  .total-impact__card dd {
    font-size: 9vw;
  }
}

@media (max-width: 1120px) {
  .total-impact {
    gap: 5vw;
  }
}

@media (max-width: 1050px) {
  .total-impact__card {
    padding: 4vw;
  }
}

@media (max-width: 820px) {
  .total-impact__grid {
    flex-direction: column;
  }

  .total-impact__card {
    flex-basis: auto;
  }
}

@media (max-width: 600px) {
  .total-impact {
    gap: 28px;
  }

  .total-impact__card {
    padding: 24px;
  }

}

@media (max-width: 530px) {
  .total-impact__card dd {
    font-size: 48px;
  }
}
</style>
