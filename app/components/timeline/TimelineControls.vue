<script setup lang="ts">
import { TIMELINE_SPEEDS, type TimelineSpeed, type TimelineView } from '~/composables/useTimelinePlayer'

defineOptions({ name: 'TimelineControls' })

const props = defineProps<{
  index: number
  total: number
  isPlaying: boolean
  isAtStart: boolean
  isAtEnd: boolean
  /** Dwell progress through the current milestone, 0–1. */
  progress: number
  speed: TimelineSpeed
  view: TimelineView
}>()

const emit = defineEmits<{
  previous: []
  next: []
  toggle: []
  'update:speed': [speed: TimelineSpeed]
  'update:view': [view: TimelineView]
}>()

const pad = (value: number) => String(value).padStart(2, '0')

const position = computed(() => `${pad(props.index + 1)} / ${pad(props.total)}`)

const playLabel = computed(() => {
  if (props.isPlaying) return 'Pause the timeline'
  return props.isAtEnd ? 'Replay the timeline' : 'Play the timeline'
})

const dwellStyle = computed(() => ({
  '--dwell': props.isPlaying ? String(props.progress) : '0',
}))

const VIEWS = [
  { id: 'beamline', label: 'Beamline' },
  { id: 'list', label: 'List' },
] as const satisfies readonly { id: TimelineView, label: string }[]
</script>

<template>
  <div class="timeline-controls">
    <div class="timeline-controls__transport">
      <button
        class="transport-button"
        type="button"
        :disabled="isAtStart"
        aria-label="Previous milestone"
        @click="emit('previous')"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M12.5 3v10L5.5 8zM4 3h1.4v10H4z" />
        </svg>
      </button>

      <button
        class="transport-button transport-button--play"
        type="button"
        :aria-label="playLabel"
        :aria-pressed="isPlaying"
        @click="emit('toggle')"
      >
        <svg v-if="isPlaying" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />
        </svg>
        <svg v-else viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M4.8 2.8 13 8l-8.2 5.2z" />
        </svg>
      </button>

      <button
        class="transport-button"
        type="button"
        :disabled="isAtEnd"
        aria-label="Next milestone"
        @click="emit('next')"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3.5 3v10l7-5zM10.6 3H12v10h-1.4z" />
        </svg>
      </button>
    </div>

    <p class="timeline-controls__position">
      <span class="visually-hidden">Milestone </span>{{ position }}
    </p>

    <div class="timeline-controls__dwell" :style="dwellStyle" aria-hidden="true">
      <span />
    </div>

    <div
      v-if="view === 'beamline'"
      class="timeline-controls__group"
      role="group"
      aria-label="Playback speed"
    >
      <span class="timeline-controls__legend">Speed</span>
      <button
        v-for="option in TIMELINE_SPEEDS"
        :key="option"
        class="segment"
        type="button"
        :aria-pressed="speed === option"
        :aria-label="`${option} times speed`"
        @click="emit('update:speed', option)"
      >
        {{ option }}&times;
      </button>
    </div>

    <div
      class="timeline-controls__group timeline-controls__group--view"
      role="group"
      aria-label="Timeline layout"
    >
      <span class="timeline-controls__legend">View</span>
      <button
        v-for="option in VIEWS"
        :key="option.id"
        class="segment"
        type="button"
        :aria-pressed="view === option.id"
        @click="emit('update:view', option.id)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.timeline-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: $radius-medium;
  background: color-mix(in srgb, var(--panel) 82%, transparent);
}

.timeline-controls__transport {
  display: flex;
  gap: 6px;
  align-items: center;
}

.transport-button {
  display: grid;
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: color-mix(in srgb, var(--panel-2) 80%, transparent);
  color: var(--body-copy);
  cursor: pointer;
  place-items: center;
  transition:
    color $transition-fast $transition-ease,
    border-color $transition-fast $transition-ease,
    background-color $transition-fast $transition-ease;

  svg {
    width: 15px;
    height: 15px;
    fill: currentcolor;
  }

  &:hover:not(:disabled) {
    border-color: var(--beam);
    color: var(--core);
  }

  &:disabled {
    color: var(--faint);
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--play {
    width: 44px;
    height: 44px;
    border-color: color-mix(in srgb, var(--signal) 42%, transparent);
    background: color-mix(in srgb, var(--signal) 12%, transparent);
    color: var(--signal);

    svg {
      width: 17px;
      height: 17px;
    }

    &:hover:not(:disabled) {
      border-color: var(--signal);
      background: color-mix(in srgb, var(--signal) 20%, transparent);
      color: var(--signal-hover);
    }
  }
}

.timeline-controls__position {
  color: var(--core);
  font-family: $font-mono;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
}

// Shows when playback will advance; idle (empty) whenever the reader is steering.
.timeline-controls__dwell {
  flex: 1 1 120px;
  min-width: 80px;
  height: 2px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--line);

  span {
    display: block;
    width: calc(var(--dwell) * 100%);
    height: 100%;
    background: var(--signal);
  }
}

.timeline-controls__group {
  display: flex;
  gap: 4px;
  align-items: center;
}

.timeline-controls__legend {
  margin-right: 4px;
  color: var(--faint);
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.segment {
  min-height: 36px;
  padding: 5px 11px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--mute);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color $transition-fast $transition-ease,
    border-color $transition-fast $transition-ease,
    background-color $transition-fast $transition-ease;

  &:hover {
    color: var(--core);
  }

  &[aria-pressed='true'] {
    border-color: color-mix(in srgb, var(--beam) 46%, transparent);
    background: color-mix(in srgb, var(--beam) 14%, transparent);
    color: var(--core);
  }
}

@media (max-width: 900px) {
  .timeline-controls__dwell {
    order: 5;
    flex-basis: 100%;
  }
}

@media (max-width: 560px) {
  .timeline-controls {
    gap: 12px 14px;
    padding: 12px;
  }

  .timeline-controls__position { margin-left: auto; }
  .timeline-controls__group { flex: 1 1 100%; justify-content: space-between; }
  .timeline-controls__group--view { margin-left: 0; }
  .segment { flex: 1; min-height: 44px; }
}
</style>
