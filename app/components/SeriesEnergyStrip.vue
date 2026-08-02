<script setup lang="ts">
type SeriesEnergyPost = {
  path: string
  title: string
}

type SeriesEnergyStripData = {
  slug: string
  title: string
  complexityRating: number
  posts: SeriesEnergyPost[]
}

const props = defineProps<{
  series: SeriesEnergyStripData
}>()

const TRACK_RISE = 72
const STATE_WIDTH = 180
const colourStops = [
  '#062f49',
  '#0a4e74',
  '#0b80c3',
  '#33b4ec',
  '#bde8fb',
]

const hexToRgb = (hex: string) => {
  const value = Number.parseInt(hex.slice(1), 16)

  return {
    red: (value >> 16) & 255,
    green: (value >> 8) & 255,
    blue: value & 255,
  }
}

const energyColour = (energy: number) => {
  const scaledEnergy = energy * (colourStops.length - 1)
  const lowerIndex = Math.floor(scaledEnergy)
  const upperIndex = Math.min(lowerIndex + 1, colourStops.length - 1)
  const progress = scaledEnergy - lowerIndex
  const lower = hexToRgb(colourStops[lowerIndex]!)
  const upper = hexToRgb(colourStops[upperIndex]!)
  const channel = (start: number, end: number) => Math.round(start + (end - start) * progress)

  return `rgb(${channel(lower.red, upper.red)} ${channel(lower.green, upper.green)} ${channel(lower.blue, upper.blue)})`
}

const postEnergy = (index: number) => {
  const finalIndex = props.series.posts.length - 1
  return finalIndex > 0 ? index / finalIndex : 1
}

const stateStyle = (index: number) => {
  const energy = postEnergy(index)

  return {
    '--energy': energy,
    '--energy-colour': energyColour(energy),
    '--node-size': `${18 + energy * 16}px`,
    '--node-stroke': `${1 + energy * 2}px`,
    '--level-rise': `${energy * TRACK_RISE}px`,
  }
}

const trackStyle = computed(() => {
  const steps = Math.max(props.series.posts.length - 1, 1)

  return {
    '--state-count': props.series.posts.length,
    '--state-width': `${STATE_WIDTH}px`,
    '--step-rise': `${TRACK_RISE / steps}px`,
  }
})

const scaleStyle = {
  background: `linear-gradient(90deg, ${colourStops.join(', ')})`,
}
</script>

<template>
  <article class="energy-strip">
    <header class="energy-strip__header">
      <div>
        <p class="energy-strip__kicker">
          Learning series &middot; {{ series.posts.length }} parts
        </p>
        <h2>{{ series.title }}</h2>
      </div>

      <div class="energy-strip__actions">
        <span class="energy-strip__complexity">
          Complexity <strong>{{ series.complexityRating }}</strong>/10
        </span>
        <NuxtLink
          class="energy-strip__all"
          :to="`/blog/series/${series.slug}`"
        >
          View series <span aria-hidden="true">&rarr;</span>
        </NuxtLink>
      </div>
    </header>

    <div class="energy-strip__viewport">
      <ol
        class="energy-strip__track"
        :style="trackStyle"
        :aria-label="`${series.title}, ${series.posts.length} parts from introductory to advanced`"
      >
        <li
          v-for="(post, index) in series.posts"
          :key="post.path"
          class="energy-state"
          :style="stateStyle(index)"
        >
          <NuxtLink
            class="energy-state__link"
            :to="post.path"
            :aria-label="`Part ${index + 1}: ${post.title}`"
          >
            <span class="energy-state__level" aria-hidden="true">
              <span class="energy-state__node" />
            </span>
            <span class="energy-state__copy">
              <span class="energy-state__part">Part {{ index + 1 }}</span>
              <span class="energy-state__title">{{ post.title }}</span>
            </span>
          </NuxtLink>
        </li>
      </ol>
    </div>

    <footer class="energy-strip__scale" aria-hidden="true">
      <span>Lower energy</span>
      <span class="energy-strip__scale-line" :style="scaleStyle" />
      <span>Higher energy</span>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.energy-strip {
  width: 100%;
  min-width: 0;
  padding-block: clamp(28px, 4vw, 44px);
  border-top: 1px solid rgb(189 232 251 / 14%);

  &:last-child {
    border-bottom: 1px solid rgb(189 232 251 / 14%);
  }
}

.energy-strip__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  padding-inline: clamp(4px, 1vw, 12px);

  h2 {
    margin-top: 7px;
    color: var(--ink);
    font-size: clamp(1.55rem, 3vw, 2.45rem);
    line-height: 1;
  }
}

.energy-strip__kicker,
.energy-strip__complexity,
.energy-strip__all,
.energy-state__part,
.energy-strip__scale {
  font-family: $font-mono;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.energy-strip__kicker {
  color: var(--mute);
  font-size: 0.66rem;
}

.energy-strip__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 18px;
}

.energy-strip__complexity {
  color: var(--mute);
  font-size: 0.66rem;

  strong {
    color: var(--core);
    font-size: 0.86rem;
    font-weight: 600;
  }
}

.energy-strip__all {
  color: var(--beam);
  font-size: 0.68rem;
  text-decoration: none;

  span {
    display: inline-block;
    margin-left: 3px;
    transition: transform $transition-fast $transition-ease;
  }

  &:hover span {
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid var(--beam);
    outline-offset: 5px;
  }
}

.energy-strip__viewport {
  overflow-x: auto;
  margin-top: 14px;
  padding: 6px 4px 4px;
  scrollbar-color: rgb(51 180 236 / 42%) transparent;
  scrollbar-width: thin;
}

.energy-strip__track {
  display: grid;
  min-width: calc(var(--state-count) * var(--state-width));
  height: 228px;
  grid-template-columns: repeat(var(--state-count), minmax(var(--state-width), 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}

.energy-state {
  position: relative;
  min-width: 0;
}

.energy-state__link {
  position: absolute;
  inset: 0;
  display: block;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    border-radius: 4px;
    outline: 2px solid var(--energy-colour);
    outline-offset: -2px;
  }

  &:hover,
  &:focus-visible {
    .energy-state__node {
      transform: translate(-50%, -50%) scale(1.18);
    }

    .energy-state__title {
      color: var(--energy-colour);
    }
  }
}

.energy-state__level {
  position: absolute;
  right: 0;
  bottom: calc(82px + var(--level-rise));
  left: 0;
  height: 1px;

  &::before {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 0;
    width: 100%;
    height: calc(var(--step-rise) + var(--node-stroke));
    background: linear-gradient(90deg, var(--energy-colour), rgb(189 232 251 / 20%));
    box-shadow: 0 0 calc(var(--energy) * 10px) color-mix(in srgb, var(--energy-colour) 55%, transparent);
    clip-path: polygon(
      0 calc(100% - var(--node-stroke)),
      100% 0,
      100% var(--node-stroke),
      0 100%
    );
    content: '';
    opacity: calc(0.42 + var(--energy) * 0.5);
    transform: translateY(calc(var(--step-rise) * -1));
  }
}

.energy-state:last-child .energy-state__level::before {
  display: none;
}

.energy-state__node {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  display: block;
  width: var(--node-size);
  height: var(--node-size);
  border: var(--node-stroke) solid color-mix(in srgb, var(--energy-colour) 82%, white);
  border-radius: 50%;
  background: var(--energy-colour);
  box-shadow:
    0 0 calc(2px + var(--energy) * 10px) color-mix(in srgb, var(--energy-colour) calc(20% + var(--energy) * 45%), transparent),
    0 0 calc(var(--energy) * 30px) color-mix(in srgb, var(--energy-colour) calc(var(--energy) * 38%), transparent),
    inset 0 0 calc(var(--energy) * 7px) rgb(255 255 255 / calc(var(--energy) * 0.72));
  transform: translate(-50%, -50%);
  transition:
    transform $transition-fast $transition-ease,
    box-shadow $transition-fast $transition-ease;
}

.energy-state__copy {
  position: absolute;
  right: 14px;
  bottom: 0;
  left: 14px;
  display: grid;
  gap: 7px;
}

.energy-state__part {
  color: var(--energy-colour);
  font-size: 0.62rem;
}

.energy-state__title {
  max-width: 17ch;
  color: var(--body-copy);
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.3;
  transition: color $transition-fast $transition-ease;
}

.energy-strip__scale {
  display: grid;
  grid-template-columns: auto minmax(40px, 180px) auto;
  align-items: center;
  justify-content: end;
  gap: 10px;
  margin-top: 12px;
  padding-inline: clamp(4px, 1vw, 12px);
  color: var(--mute);
  font-size: 0.56rem;
}

.energy-strip__scale-line {
  height: 2px;
}

@media (max-width: 700px) {
  .energy-strip__header {
    align-items: start;
    flex-direction: column;
    gap: 16px;
  }

  .energy-strip__actions {
    width: 100%;
    justify-content: space-between;
  }

  .energy-strip__track {
    height: 218px;
  }

  .energy-strip__viewport {
    margin-right: calc(clamp(20px, 5vw, 32px) * -1);
    padding-right: clamp(20px, 5vw, 32px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .energy-state__node,
  .energy-state__title,
  .energy-strip__all span {
    transition: none;
  }
}
</style>
