<script setup lang="ts">
import type { TimelineMilestone } from '~/content/timeline'

defineOptions({ name: 'TimelineReadout' })

const props = defineProps<{
  milestone: TimelineMilestone
  index: number
  total: number
  previous?: TimelineMilestone
  next?: TimelineMilestone
}>()

const emit = defineEmits<{
  previous: []
  next: []
}>()

const pad = (value: number) => String(value).padStart(2, '0')

const counter = computed(() => `${pad(props.index + 1)} / ${pad(props.total)}`)
</script>

<template>
  <article
    :id="`milestone-panel-${milestone.id}`"
    class="readout-panel"
    role="tabpanel"
    :aria-labelledby="`milestone-tab-${milestone.id}`"
    tabindex="0"
  >
    <div class="readout-panel__aside">
      <p class="readout-panel__counter">{{ counter }}</p>
      <time class="readout-panel__date" :datetime="milestone.dateTime">{{ milestone.dateLabel }}</time>
      <p class="readout-panel__kicker">{{ milestone.kicker }}</p>
    </div>

    <div class="readout-panel__body">
      <h2>{{ milestone.title }}</h2>
      <p>{{ milestone.description }}</p>
    </div>

    <div class="readout-panel__stat">
      <span class="readout-panel__stat-label">Reach</span>
      <strong>{{ milestone.stat }}</strong>
    </div>

    <nav class="readout-panel__nav" aria-label="Adjacent milestones">
      <button
        v-if="previous"
        class="readout-nav"
        type="button"
        @click="emit('previous')"
      >
        <span class="readout-nav__direction"><span aria-hidden="true">&larr;</span> Previous</span>
        <span class="readout-nav__title">{{ previous.title }}</span>
      </button>
      <span v-else class="readout-nav readout-nav--empty">Start of the timeline</span>

      <button
        v-if="next"
        class="readout-nav readout-nav--next"
        type="button"
        @click="emit('next')"
      >
        <span class="readout-nav__direction">Next <span aria-hidden="true">&rarr;</span></span>
        <span class="readout-nav__title">{{ next.title }}</span>
      </button>
      <span v-else class="readout-nav readout-nav--next readout-nav--empty">Latest milestone</span>
    </nav>
  </article>
</template>

<style scoped lang="scss">
.readout-panel {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) auto;
  grid-template-areas:
    'aside body stat'
    'nav   nav  nav';
  gap: 34px 44px;
  align-items: start;
  padding: 34px 40px;
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  border-radius: $radius-large;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--panel-2) 92%, transparent),
    color-mix(in srgb, var(--panel) 70%, transparent)
  );
  box-shadow: 0 30px 90px rgb(0 0 0 / 32%);

  &:focus-visible {
    @include focus-ring;
  }
}

.readout-panel__aside {
  display: grid;
  gap: 8px;
  grid-area: aside;
}

.readout-panel__counter {
  color: var(--faint);
  font-family: $font-mono;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
}

.readout-panel__date {
  color: var(--core);
  font-family: $font-display;
  font-size: 21px;
  line-height: 1.1;
}

.readout-panel__kicker {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.readout-panel__body {
  grid-area: body;

  h2 {
    @include responsive-quaternary-heading;

    font-family: $font-display;
    letter-spacing: -0.04em;
    line-height: 1.02;
  }

  p {
    margin-top: 14px;
    color: var(--body-copy);
    font-size: 15px;
    line-height: 1.75;
  }
}

.readout-panel__stat {
  display: grid;
  gap: 6px;
  grid-area: stat;
  justify-items: end;
  padding-left: 24px;
  border-left: 1px solid var(--line);
  text-align: right;

  strong {
    color: var(--signal);
    font-family: $font-mono;
    font-size: 17px;
    white-space: nowrap;
  }
}

.readout-panel__stat-label {
  color: var(--faint);
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.readout-panel__nav {
  display: flex;
  gap: 20px;
  align-items: stretch;
  justify-content: space-between;
  grid-area: nav;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.readout-nav {
  display: grid;
  gap: 5px;
  max-width: 46%;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--body-copy);
  cursor: pointer;
  text-align: left;
  transition: color $transition-fast $transition-ease;

  &--next {
    justify-items: end;
    text-align: right;
  }

  &--empty {
    align-content: center;
    color: var(--faint);
    cursor: default;
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  &:not(&--empty):hover .readout-nav__title {
    color: var(--core);
  }
}

.readout-nav__direction {
  color: var(--faint);
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.readout-nav__title {
  color: var(--body-copy);
  font-family: $font-display;
  font-size: 15px;
  line-height: 1.2;
  transition: color $transition-fast $transition-ease;
}

@media (max-width: 900px) {
  .readout-panel {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'aside'
      'body'
      'stat'
      'nav';
    gap: 24px;
    padding: 28px;
  }

  .readout-panel__aside {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    align-items: baseline;
  }

  .readout-panel__stat {
    justify-items: start;
    padding: 16px 0 0;
    border-top: 1px solid var(--line);
    border-left: 0;
    text-align: left;
  }
}

@media (max-width: 560px) {
  .readout-panel__nav {
    flex-direction: column;
    gap: 16px;
  }

  .readout-nav {
    max-width: none;

    &--next {
      justify-items: start;
      text-align: left;
    }
  }
}
</style>
