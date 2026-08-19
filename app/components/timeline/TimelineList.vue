<script setup lang="ts">
import type { TimelineMilestone } from '~/content/timeline'

defineOptions({ name: 'TimelineList' })

defineProps<{
  milestones: TimelineMilestone[]
  activeIndex: number
}>()

const emit = defineEmits<{
  /** Select the milestone and hand the reader back to the beamline view. */
  focus: [index: number]
}>()
</script>

<template>
  <ol class="timeline-list" aria-label="All milestones">
    <li
      v-for="(milestone, index) in milestones"
      :key="milestone.id"
      :class="['timeline-list__row', { 'timeline-list__row--active': activeIndex === index }]"
    >
      <div class="timeline-list__marker" aria-hidden="true">
        <span />
      </div>

      <div class="timeline-list__meta">
        <time :datetime="milestone.dateTime">{{ milestone.dateLabel }}</time>
        <p>{{ milestone.kicker }}</p>
      </div>

      <div class="timeline-list__body">
        <h3>{{ milestone.title }}</h3>
        <p>{{ milestone.description }}</p>
      </div>

      <div class="timeline-list__side">
        <strong>{{ milestone.stat }}</strong>
        <button
          class="timeline-list__focus"
          type="button"
          :aria-label="`Show ${milestone.title} on the beamline`"
          @click="emit('focus', index)"
        >
          Beamline <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.timeline-list {
  display: grid;
  list-style: none;
}

.timeline-list__row {
  display: grid;
  grid-template-columns: 40px 150px minmax(0, 1fr) auto;
  gap: 28px;
  align-items: start;
  padding: 26px 0;
  border-top: 1px solid var(--line);
  transition: background-color $transition-fast $transition-ease;

  &:last-child {
    border-bottom: 1px solid var(--line);
  }

  &--active {
    background: color-mix(in srgb, var(--beam) 6%, transparent);
  }
}

// The rail runs through every row so the list keeps the beamline metaphor.
.timeline-list__marker {
  position: relative;
  align-self: stretch;
  justify-self: center;
  width: 1px;
  background: var(--line);

  span {
    position: absolute;
    top: 6px;
    left: 50%;
    display: block;
    width: 11px;
    height: 11px;
    border: 1px solid var(--beam);
    border-radius: 50%;
    background: var(--black);
    transform: translateX(-50%);
    transition:
      background-color $transition-fast $transition-ease,
      box-shadow $transition-fast $transition-ease;
  }
}

.timeline-list__row--active .timeline-list__marker span {
  border-color: var(--signal);
  background: var(--signal);
  box-shadow: 0 0 16px color-mix(in srgb, var(--signal) 55%, transparent);
}

.timeline-list__meta {
  display: grid;
  gap: 6px;

  time {
    color: var(--core);
    font-family: $font-display;
    font-size: 17px;
    line-height: 1.1;
  }

  p {
    color: var(--faint);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
}

.timeline-list__body {
  h3 {
    color: var(--ink);
    font-family: $font-display;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  p {
    max-width: 62ch;
    margin-top: 9px;
    color: var(--body-copy);
    font-size: 14px;
    line-height: 1.7;
  }
}

.timeline-list__side {
  display: grid;
  gap: 12px;
  justify-items: end;
  text-align: right;

  strong {
    color: var(--signal);
    font-family: $font-mono;
    font-size: 14px;
    white-space: nowrap;
  }
}

.timeline-list__focus {
  padding: 7px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: var(--mute);
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color $transition-fast $transition-ease,
    border-color $transition-fast $transition-ease;

  &:hover {
    border-color: var(--beam);
    color: var(--core);
  }
}

@media (max-width: 900px) {
  .timeline-list__row {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 8px 18px;
  }

  .timeline-list__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    align-items: baseline;
  }

  .timeline-list__body,
  .timeline-list__side {
    grid-column: 2;
  }

  .timeline-list__side {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 18px;
    align-items: center;
    justify-items: start;
    margin-top: 4px;
    text-align: left;
  }
}

@include reduced-motion {
  .timeline-list__row,
  .timeline-list__marker span {
    transition: none;
  }
}
</style>
