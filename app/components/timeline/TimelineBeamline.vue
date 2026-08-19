<script setup lang="ts">
import type { TimelineMilestone } from '~/content/timeline'

defineOptions({ name: 'TimelineBeamline' })

const props = defineProps<{
  milestones: TimelineMilestone[]
  activeIndex: number
  /** Dwell progress through the active milestone, 0–1; drives the countdown ring. */
  progress: number
  isPlaying: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
  hold: []
  release: []
}>()

const stations = ref<HTMLButtonElement[]>([])

const setStationRef = (element: unknown, index: number) => {
  stations.value[index] = element as HTMLButtonElement
}

const railStyle = computed(() => {
  const lastIndex = Math.max(props.milestones.length - 1, 1)

  return {
    '--stations': String(props.milestones.length),
    '--beam-progress': `${(props.activeIndex / lastIndex) * 100}%`,
    '--dwell': props.isPlaying ? String(props.progress) : '0',
  }
})

const focusStation = (index: number) => {
  emit('select', index)
  void nextTick(() => stations.value[index]?.focus())
}

const onKeydown = (event: KeyboardEvent) => {
  const lastIndex = props.milestones.length - 1
  const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key]

  if (step) {
    event.preventDefault()
    focusStation(Math.min(lastIndex, Math.max(0, props.activeIndex + step)))
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    focusStation(0)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    focusStation(lastIndex)
  }
}
</script>

<template>
  <div
    class="beamline"
    role="tablist"
    aria-label="Milestones"
    aria-orientation="horizontal"
    :style="railStyle"
    @keydown="onKeydown"
    @pointerenter="emit('hold')"
    @pointerleave="emit('release')"
    @focusin="emit('hold')"
    @focusout="emit('release')"
  >
    <div class="beamline__rail" aria-hidden="true">
      <span class="beamline__energy" />
      <span class="beamline__particle" />
    </div>

    <button
      v-for="(milestone, index) in milestones"
      :id="`milestone-tab-${milestone.id}`"
      :key="milestone.id"
      :ref="element => setStationRef(element, index)"
      type="button"
      role="tab"
      :class="[
        'station',
        {
          'station--active': activeIndex === index,
          'station--passed': activeIndex > index,
        },
      ]"
      :aria-selected="activeIndex === index"
      :aria-controls="`milestone-panel-${milestone.id}`"
      :tabindex="activeIndex === index ? 0 : -1"
      @click="emit('select', index)"
    >
      <span class="station__ring" aria-hidden="true">
        <i />
        <span v-if="activeIndex === index" class="station__dwell" />
      </span>
      <time class="station__date" :datetime="milestone.dateTime">{{ milestone.dateLabel }}</time>
      <small class="station__kicker">{{ milestone.kicker }}</small>
    </button>
  </div>
</template>

<style scoped lang="scss">
.beamline {
  --half-column: calc(100% / var(--stations) / 2);

  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--stations), minmax(0, 1fr));
}

// Spans exactly first-station-centre to last-station-centre.
.beamline__rail {
  position: absolute;
  top: 29px;
  right: var(--half-column);
  left: var(--half-column);
  height: 2px;
  background: var(--line);
}

.beamline__energy {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--beam-progress);
  background: linear-gradient(90deg, var(--atlas), var(--beam));
  box-shadow: 0 0 16px color-mix(in srgb, var(--beam) 60%, transparent);
  transition: width 620ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.beamline__particle {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: var(--beam-progress);
  width: 11px;
  height: 11px;
  border: 2px solid var(--black);
  border-radius: 50%;
  background: var(--signal);
  box-shadow:
    0 0 0 5px color-mix(in srgb, var(--signal) 12%, transparent),
    0 0 22px 5px color-mix(in srgb, var(--signal) 55%, transparent);
  transform: translate(-50%, -50%);
  transition: left 620ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.station {
  position: relative;
  z-index: 2;
  display: grid;
  padding: 0 6px;
  background: transparent;
  color: var(--faint);
  cursor: pointer;
  justify-items: center;
  text-align: center;
  transition: color $transition-fast $transition-ease;

  &--active,
  &--passed {
    color: var(--beam);
  }

  &:hover {
    color: var(--core);
  }

  &:focus-visible {
    outline: none;

    .station__ring {
      outline: 2px solid var(--beam);
      outline-offset: 4px;
    }
  }
}

.station__ring {
  position: relative;
  display: grid;
  width: 60px;
  height: 60px;
  border: 1px solid currentcolor;
  border-radius: 50%;
  background: var(--black);
  box-shadow: inset 0 0 0 8px var(--black);
  place-items: center;
  transition:
    border-color $transition-fast $transition-ease,
    transform $transition-fast $transition-ease;

  i {
    width: 18px;
    height: 18px;
    border: 1px solid currentcolor;
    border-radius: 50%;
    background: transparent;
    transition: background-color $transition-fast $transition-ease;
  }
}

.station--passed .station__ring i {
  background: color-mix(in srgb, var(--beam) 45%, transparent);
}

.station--active .station__ring {
  border-color: var(--signal);
  box-shadow:
    inset 0 0 0 8px var(--black),
    0 0 22px color-mix(in srgb, var(--signal) 28%, transparent);
  color: var(--signal);
  transform: scale(1.1);
}

// Countdown ring: fills clockwise over the milestone's dwell while playing.
.station__dwell {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: conic-gradient(
    var(--signal) calc(var(--dwell) * 360deg),
    transparent calc(var(--dwell) * 360deg)
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px));
  opacity: 0.75;
  pointer-events: none;
}

.station__date {
  margin-top: 16px;
  color: var(--body-copy);
  font-family: $font-display;
  font-size: 17px;
  line-height: 1;
}

.station--active .station__date {
  color: var(--core);
}

.station__kicker {
  max-width: 150px;
  margin-top: 8px;
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

@media (max-width: 760px) {
  .beamline {
    grid-template-columns: 1fr;
    gap: 30px;
    padding-left: 8px;
  }

  .beamline__rail {
    top: 29px;
    right: auto;
    bottom: 29px;
    left: 37px;
    width: 2px;
    height: auto;
  }

  .beamline__energy {
    width: 2px;
    height: var(--beam-progress);
    background: linear-gradient(180deg, var(--atlas), var(--beam));
    transition-property: height;
  }

  .beamline__particle {
    top: var(--beam-progress);
    left: 50%;
    transition-property: top;
  }

  .station {
    grid-template-columns: 60px 1fr;
    gap: 4px 16px;
    align-items: center;
    justify-items: start;
    padding: 0;
    text-align: left;
  }

  .station__ring {
    grid-row: span 2;
  }

  .station__date,
  .station__kicker {
    align-self: end;
    margin: 0;
  }

  .station__kicker {
    align-self: start;
  }
}

@include reduced-motion {
  .beamline__energy,
  .beamline__particle,
  .station__ring {
    transition: none;
  }
}
</style>
