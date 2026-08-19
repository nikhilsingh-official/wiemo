import type { MaybeRefOrGetter } from 'vue'
import { computed, onMounted, onScopeDispose, readonly, ref, toValue, watch } from 'vue'

/** Milliseconds a milestone holds the stage during playback at 1x. */
const DWELL = 4200

export const TIMELINE_SPEEDS = [0.5, 1, 2] as const
export type TimelineSpeed = typeof TIMELINE_SPEEDS[number]

/** The two ways of reading the timeline: guided sequence, or everything at once. */
export type TimelineView = 'beamline' | 'list'

export type TimelinePlayerOptions = {
  /** Milestone to open on, e.g. from a shared deep link. */
  initialIndex?: number
  /** Start playing on mount. Reduced-motion preferences always win. */
  autoplay?: boolean
}

/**
 * Drives an auto-advancing sequence that the reader can take over at any time.
 *
 * Playback is one mode rather than the only one: any deliberate navigation
 * (`select`/`next`/`previous`/`first`/`last`) hands control to the reader and
 * stops the timer, while `hold`/`release` pause it temporarily for hover and
 * focus without discarding that intent.
 */
export function useTimelinePlayer(
  count: MaybeRefOrGetter<number>,
  options: TimelinePlayerOptions = {},
) {
  const total = computed(() => Math.max(0, toValue(count)))
  const index = ref(options.initialIndex ?? 0)
  const isPlaying = ref(false)
  const speed = ref<TimelineSpeed>(1)
  /** Progress through the current milestone's dwell, 0–1. */
  const progress = ref(0)
  const holds = ref(0)

  const isRunning = computed(() => isPlaying.value && holds.value === 0 && total.value > 1)
  const isAtStart = computed(() => index.value === 0)
  const isAtEnd = computed(() => index.value >= total.value - 1)

  let frame: number | undefined
  let lastTimestamp = 0
  let elapsed = 0

  function tick(timestamp: number) {
    frame = requestAnimationFrame(tick)

    if (!lastTimestamp) {
      lastTimestamp = timestamp
      return
    }

    elapsed += (timestamp - lastTimestamp) * speed.value
    lastTimestamp = timestamp

    if (elapsed < DWELL) {
      progress.value = elapsed / DWELL
      return
    }

    elapsed = 0

    // The timeline has an ending, so playback stops there rather than looping.
    if (isAtEnd.value) {
      progress.value = 1
      pause()
      return
    }

    progress.value = 0
    index.value += 1
  }

  function start() {
    if (frame !== undefined) return
    lastTimestamp = 0
    frame = requestAnimationFrame(tick)
  }

  function stop() {
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    lastTimestamp = 0
  }

  watch(isRunning, running => (running ? start() : stop()), { immediate: true })
  onScopeDispose(stop)

  function play() {
    if (total.value <= 1) return
    // Playing from the end is a replay, not a no-op that stops immediately.
    if (isAtEnd.value) index.value = 0
    elapsed = 0
    progress.value = 0
    isPlaying.value = true
  }

  function pause() {
    isPlaying.value = false
  }

  function toggle() {
    if (isPlaying.value) pause()
    else play()
  }

  /** Temporarily suspends playback (hover, focus) without clearing play intent. */
  function hold() {
    holds.value += 1
  }

  function release() {
    holds.value = Math.max(0, holds.value - 1)
  }

  function goTo(target: number) {
    if (total.value === 0) return
    index.value = ((target % total.value) + total.value) % total.value
    elapsed = 0
    progress.value = 0
    // Deliberate navigation means the reader is steering now.
    isPlaying.value = false
  }

  const select = (target: number) => goTo(target)
  const next = () => goTo(index.value + 1)
  const previous = () => goTo(index.value - 1)
  const first = () => goTo(0)
  const last = () => goTo(total.value - 1)

  onMounted(() => {
    if (options.autoplay === false) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    play()
  })

  return {
    index: readonly(index),
    isPlaying: readonly(isPlaying),
    isAtStart,
    isAtEnd,
    progress: readonly(progress),
    speed,
    play,
    pause,
    toggle,
    hold,
    release,
    select,
    next,
    previous,
    first,
    last,
  }
}
