<script setup lang="ts">
import {
  ENERGY_TIERS,
  type EnergyTier,
  type EnergyTierDefinition,
} from '~~/shared/energyTiers'

type SpectrumPost = {
  path: string
  title: string
  date: Date | string
  thumbnail: string
  thumbnailAlt: string
  excerpt?: string
}

type SpectrumSeries = {
  slug: string
  title: string
  energyTier: EnergyTier
  posts: SpectrumPost[]
}

type NodeIdentity = {
  seriesSlug: string
  postPath: string
}

const props = defineProps<{
  seriesList: SpectrumSeries[]
}>()

const activeNode = ref<NodeIdentity | null>(null)
const keyboardMode = ref(false)
const lastPointerType = ref('')
const cardsBelow = ref(new Set<string>())

const seriesByTier = computed(() => {
  const grouped = new Map<EnergyTier, SpectrumSeries[]>()

  for (const tier of ENERGY_TIERS) {
    grouped.set(tier.id, [])
  }

  for (const series of props.seriesList) {
    grouped.get(series.energyTier)?.push(series)
  }

  return grouped
})

const tierFor = (energyTier: EnergyTier) =>
  ENERGY_TIERS.find(tier => tier.id === energyTier)!

const mobileSeries = computed(() =>
  props.seriesList.map(series => ({
    series,
    tier: tierFor(series.energyTier),
  })),
)

const accessibleDescription = computed(() => {
  const assignments = props.seriesList.map((series) => {
    const tier = tierFor(series.energyTier)
    return `${series.title} is in the ${tier?.label ?? series.energyTier} ${tier?.name ?? ''} tier`
  })

  return `Energy spectrum with energy increasing downward from eV to TeV. ${assignments.join('. ')}. Within each series, posts run oldest to newest from left to right, and a ring marks the newest post.`
})

const tierStyle = (tier: EnergyTierDefinition) => ({
  '--tier-colour': tier.colour,
  '--node-size': `${tier.nodeSize}px`,
  '--tier-glow': `${tier.glow}px`,
})

const nodePosition = (index: number, count: number) => {
  const position = count === 1 ? 100 : (index / (count - 1)) * 100

  return { '--node-position': `${position}%` }
}

const nodeIdentity = (series: SpectrumSeries, post: SpectrumPost): NodeIdentity => ({
  seriesSlug: series.slug,
  postPath: post.path,
})

const isActiveNode = (identity: NodeIdentity) =>
  activeNode.value?.seriesSlug === identity.seriesSlug
  && activeNode.value.postPath === identity.postPath

const isActiveSeries = (seriesSlug: string) =>
  activeNode.value?.seriesSlug === seriesSlug

const positionCard = (event: Event, identity: NodeIdentity) => {
  const target = event.currentTarget as HTMLElement

  void nextTick(() => {
    const card = target.querySelector<HTMLElement>('.series-node__card')
    const frame = target.closest<HTMLElement>('.energy-spectrum__desktop')

    if (!card || !frame) {
      return
    }

    const nodeY = target.getBoundingClientRect().top
    const frameRect = frame.getBoundingClientRect()
    const cardHeight = card.getBoundingClientRect().height
    const linePositions = Array.from(
      frame.querySelectorAll<HTMLElement>('.series-level__line'),
      line => line.getBoundingClientRect().top,
    )
    const previousLine = linePositions.filter(position => position < nodeY - 1).at(-1)
    const nextLine = linePositions.find(position => position > nodeY + 1)
    const clearance = 12
    const cardOffset = 18
    const nodeRadius = Number.parseFloat(
      getComputedStyle(target).getPropertyValue('--node-size'),
    ) / 2
    const upperBoundary = previousLine ?? frameRect.top
    const lowerBoundary = nextLine ?? frameRect.bottom
    const hasRoomAbove = nodeY - cardOffset - cardHeight >= upperBoundary + clearance
    const hasRoomBelow = nodeY + nodeRadius + cardOffset + cardHeight <= lowerBoundary - clearance
    const updatedCards = new Set(cardsBelow.value)

    if (!hasRoomAbove && hasRoomBelow) {
      updatedCards.add(identity.postPath)
    }
    else {
      updatedCards.delete(identity.postPath)
    }

    cardsBelow.value = updatedCards
  })
}

const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

const isCoarsePointer = () =>
  import.meta.client && window.matchMedia('(hover: none), (pointer: coarse)').matches

const usesTouchInput = () =>
  lastPointerType.value === 'touch' || isCoarsePointer()

const openFromPointer = (event: PointerEvent, key: NodeIdentity) => {
  if (event.pointerType !== 'touch' && !isCoarsePointer()) {
    activeNode.value = key
    positionCard(event, key)
  }
}

const closeFromPointer = (event: PointerEvent, key: NodeIdentity) => {
  if (event.pointerType === 'touch') {
    return
  }

  const target = event.currentTarget as HTMLElement

  if (isActiveNode(key) && !target.matches(':focus-visible')) {
    activeNode.value = null
  }
}

const openFromFocus = (event: FocusEvent, key: NodeIdentity) => {
  if (keyboardMode.value) {
    activeNode.value = key
    positionCard(event, key)
  }
}

const closeFromFocus = (key: NodeIdentity) => {
  if (keyboardMode.value && isActiveNode(key)) {
    activeNode.value = null
  }
}

const handleNodeClick = (event: MouseEvent, key: NodeIdentity) => {
  if (!usesTouchInput()) {
    return
  }

  if (!isActiveNode(key)) {
    event.preventDefault()
    activeNode.value = key
    positionCard(event, key)
  }
}

const handleKeydown = () => {
  keyboardMode.value = true
}

const handlePointerdown = (event: PointerEvent) => {
  keyboardMode.value = false
  lastPointerType.value = event.pointerType

  const target = event.target as HTMLElement | null
  if (!target?.closest('[data-energy-node]')) {
    activeNode.value = null
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('pointerdown', handlePointerdown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('pointerdown', handlePointerdown)
})
</script>

<template>
  <section class="energy-spectrum" aria-labelledby="spectrum-title">
    <header class="energy-spectrum__header">
      <div>
        <p class="energy-spectrum__kicker">Five fixed energy bands</p>
        <h2 id="spectrum-title">Series spectrum</h2>
      </div>

      <div class="energy-spectrum__legend" aria-label="Diagram key">
        <span class="energy-spectrum__legend-item">
          <span class="energy-spectrum__legend-node" aria-hidden="true" />
          Post
        </span>
        <span class="energy-spectrum__legend-item">
          <span class="energy-spectrum__legend-node energy-spectrum__legend-node--newest" aria-hidden="true" />
          Newest
        </span>
        <span class="energy-spectrum__direction">Oldest <i aria-hidden="true" /> Newest</span>
      </div>
    </header>

    <p id="spectrum-description" class="visually-hidden">
      {{ accessibleDescription }}
    </p>

    <div
      :class="['energy-spectrum__desktop', { 'energy-spectrum__desktop--isolating': activeNode }]"
      role="group"
      aria-describedby="spectrum-description"
    >
      <aside class="energy-axis" aria-hidden="true">
        <span class="energy-axis__title">Energy</span>
        <span class="energy-axis__line" />
        <span class="energy-axis__caption">Increases downward</span>
      </aside>

      <div class="energy-spectrum__lanes">
        <section
          v-for="tier in ENERGY_TIERS"
          :key="tier.id"
          class="spectrum-lane"
          :style="tierStyle(tier)"
          :aria-label="`${tier.label}, ${tier.name} energy tier`"
        >
          <header class="spectrum-lane__header">
            <span class="spectrum-lane__unit">{{ tier.label }}</span>
            <span class="spectrum-lane__name">{{ tier.name }}</span>
          </header>

          <div
            v-if="!seriesByTier.get(tier.id)?.length"
            class="spectrum-lane__empty"
            aria-label="No series in this tier"
          >
            <span>No series assigned</span>
            <i aria-hidden="true" />
          </div>

          <article
            v-for="series in seriesByTier.get(tier.id)"
            :key="series.slug"
            :class="[
              'series-level',
              {
                'series-level--active': isActiveSeries(series.slug),
                'series-level--dimmed': activeNode && !isActiveSeries(series.slug),
              },
            ]"
          >
            <div class="series-level__identity">
              <h3>{{ series.title }}</h3>
              <NuxtLink :to="`/blog/series/${series.slug}`">View all</NuxtLink>
            </div>

            <div class="series-level__plot">
              <span class="series-level__line" aria-hidden="true" />
              <ol :aria-label="`${series.title} posts, oldest to newest`">
                <li
                  v-for="(post, index) in series.posts"
                  :key="post.path"
                  :class="[
                    'series-node',
                    {
                      'series-node--first': index === 0,
                      'series-node--last': index === series.posts.length - 1,
                    },
                  ]"
                  :style="nodePosition(index, series.posts.length)"
                >
                  <NuxtLink
                    :to="post.path"
                    :class="[
                      'series-node__link',
                      { 'series-node__link--open': isActiveNode(nodeIdentity(series, post)) },
                    ]"
                    data-energy-node
                    :aria-label="`${post.title}, ${formatDate(post.date)}${index === series.posts.length - 1 ? ', newest post' : ''}`"
                    @pointerenter="openFromPointer($event, nodeIdentity(series, post))"
                    @pointerleave="closeFromPointer($event, nodeIdentity(series, post))"
                    @focus="openFromFocus($event, nodeIdentity(series, post))"
                    @blur="closeFromFocus(nodeIdentity(series, post))"
                    @click="handleNodeClick($event, nodeIdentity(series, post))"
                  >
                    <span
                      :class="[
                        'series-node__point',
                        { 'series-node__point--newest': index === series.posts.length - 1 },
                      ]"
                      aria-hidden="true"
                    />
                    <span class="series-node__label">{{ post.title }}</span>

                    <span
                      :class="[
                        'series-node__card',
                        { 'series-node__card--below': cardsBelow.has(post.path) },
                      ]"
                      aria-hidden="true"
                    >
                      <img
                        :src="post.thumbnail"
                        :alt="post.thumbnailAlt"
                        loading="lazy"
                      >
                      <span class="series-node__card-copy">
                        <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
                        <strong>{{ post.title }}</strong>
                        <span>{{ post.excerpt }}</span>
                      </span>
                    </span>
                  </NuxtLink>
                </li>
              </ol>
            </div>
          </article>
        </section>
      </div>
    </div>

    <div class="energy-spectrum__mobile" aria-label="Series list">
      <section
        v-for="{ series, tier } in mobileSeries"
        :key="series.slug"
        class="mobile-series"
      >
        <header :style="tierStyle(tier)">
          <div>
            <span>{{ tier.label }}</span>
            <small>{{ tier.name }} energy</small>
          </div>
          <h3>{{ series.title }}</h3>
        </header>

        <ol>
          <li v-for="post in series.posts" :key="post.path">
            <NuxtLink :to="post.path" class="mobile-post">
              <img
                :src="post.thumbnail"
                :alt="post.thumbnailAlt"
                loading="lazy"
              >
              <span class="mobile-post__copy">
                <time :datetime="String(post.date)">{{ formatDate(post.date) }}</time>
                <strong>{{ post.title }}</strong>
              </span>
            </NuxtLink>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.energy-spectrum {
  min-width: 0;
  border-top: 1px solid rgb(189 232 251 / 12%);
}

.energy-spectrum__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 28px;
  padding: 28px 0 24px;

  h2 {
    margin-top: 6px;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
  }
}

.energy-spectrum__kicker,
.energy-spectrum__legend,
.energy-spectrum__direction,
.spectrum-lane__header,
.series-level__identity a,
.series-node__label,
.series-node__card time,
.mobile-series header span,
.mobile-series header small,
.mobile-post time {
  font-family: $font-mono;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.energy-spectrum__kicker {
  color: var(--mute);
  font-size: 0.63rem;
}

.energy-spectrum__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px 18px;
  color: var(--mute);
  font-size: 0.58rem;
}

.energy-spectrum__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.energy-spectrum__legend-node {
  position: relative;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--atlas);

  &--newest::after {
    position: absolute;
    inset: -4px;
    border: 1px solid rgb(231 237 243 / 72%);
    border-radius: 50%;
    content: '';
  }
}

.energy-spectrum__direction {
  display: inline-grid;
  grid-template-columns: auto 52px auto;
  align-items: center;
  gap: 8px;

  i {
    position: relative;
    height: 1px;
    background: rgb(126 139 154 / 50%);

    &::after {
      position: absolute;
      top: -2px;
      right: 0;
      width: 5px;
      height: 5px;
      border-top: 1px solid rgb(126 139 154 / 70%);
      border-right: 1px solid rgb(126 139 154 / 70%);
      content: '';
      transform: rotate(45deg);
    }
  }
}

.energy-spectrum__desktop {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  border: 1px solid rgb(189 232 251 / 12%);
  border-radius: 10px;
  background: rgb(4 6 11 / 72%);
}

.energy-axis {
  position: relative;
  border-right: 1px solid rgb(189 232 251 / 10%);
  color: var(--mute);
  font-family: $font-mono;
  font-size: 0.56rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.energy-axis__title {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
}

.energy-axis__line {
  position: absolute;
  top: 70px;
  bottom: 62px;
  left: 50%;
  width: 1px;
  background: linear-gradient(180deg, #062f49, #0a4e74, #0b80c3, #33b4ec, #bde8fb);

  &::after {
    position: absolute;
    bottom: -1px;
    left: -4px;
    width: 8px;
    height: 8px;
    border-right: 1px solid #bde8fb;
    border-bottom: 1px solid #bde8fb;
    content: '';
    transform: rotate(45deg);
  }
}

.energy-axis__caption {
  position: absolute;
  right: 8px;
  bottom: 28px;
  left: 8px;
  line-height: 1.45;
  text-align: center;
}

.energy-spectrum__lanes {
  min-width: 0;
}

.spectrum-lane {
  position: relative;
  min-width: 0;
  border-bottom: 1px solid rgb(189 232 251 / 9%);

  &:last-child {
    border-bottom: 0;
  }
}

.spectrum-lane__header {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 4;
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.spectrum-lane__unit {
  color: var(--tier-colour);
  font-size: 0.76rem;
  font-weight: 700;
}

.spectrum-lane__name {
  color: var(--mute);
  font-size: 0.56rem;
}

.spectrum-lane__empty {
  display: grid;
  min-height: 122px;
  grid-template-columns: clamp(124px, 18vw, 206px) minmax(0, 1fr);
  align-items: center;
  gap: 22px;
  padding: 34px 24px 0 18px;
  color: var(--faint);
  font-family: $font-mono;
  font-size: 0.54rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  i {
    height: 1px;
    background: color-mix(in srgb, var(--tier-colour) 38%, transparent);
  }
}

.series-level {
  --line-y: 188px;

  display: grid;
  min-width: 0;
  height: 252px;
  grid-template-columns: clamp(124px, 18vw, 206px) minmax(0, 1fr);
  gap: 22px;
  padding: 0 24px 0 18px;
  transition: opacity 160ms ease;

  &--dimmed {
    opacity: 0.28;
  }
}

.series-level__identity {
  min-width: 0;
  padding-top: calc(var(--line-y) - 24px);

  h3 {
    overflow: hidden;
    color: var(--ink);
    font-size: clamp(0.9rem, 1.5vw, 1.15rem);
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  a {
    display: inline-block;
    margin-top: 7px;
    color: var(--mute);
    font-size: 0.52rem;

    &:hover,
    &:focus-visible {
      color: var(--tier-colour);
    }
  }
}

.series-level__plot {
  position: relative;
  min-width: 0;
  height: 100%;

  ol {
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }
}

.series-level__line {
  position: absolute;
  top: var(--line-y);
  right: 0;
  left: 0;
  height: 1px;
  background: var(--tier-colour);
  box-shadow: 0 0 calc(var(--tier-glow) * 0.4) color-mix(in srgb, var(--tier-colour) 42%, transparent);
}

.series-node {
  position: absolute;
  top: var(--line-y);
  left: var(--node-position);
  width: 128px;
  height: 78px;
  transform: translateX(-50%);

  &--first {
    transform: none;
  }

  &--last {
    transform: translateX(-100%);
  }
}

.series-node__link {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    border-radius: 4px;
    outline: 1px solid var(--tier-colour);
    outline-offset: 6px;
  }

  &:hover,
  &:focus-visible,
  &--open {
    .series-node__card {
      visibility: visible;
      opacity: 1;
      transform: translate(-50%, 0);
    }

    .series-node__label {
      color: var(--ink);
    }
  }
}

.series-node__point {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--node-size);
  height: var(--node-size);
  border: 1px solid color-mix(in srgb, var(--tier-colour) 82%, white);
  border-radius: 50%;
  background: var(--tier-colour);
  box-shadow:
    0 0 var(--tier-glow) color-mix(in srgb, var(--tier-colour) 48%, transparent),
    0 0 calc(var(--tier-glow) * 1.7) color-mix(in srgb, var(--tier-colour) 20%, transparent);
  transform: translate(-50%, -50%);

  &--newest::after {
    position: absolute;
    inset: -6px;
    border: 1px solid rgb(231 237 243 / 76%);
    border-radius: 50%;
    content: '';
  }
}

.series-node--first .series-node__point {
  left: 0;
}

.series-node--last .series-node__point {
  right: 0;
  left: auto;
  transform: translate(50%, -50%);
}

.series-node__label {
  position: absolute;
  top: calc(var(--node-size) / 2 + 13px);
  left: 50%;
  display: -webkit-box;
  width: 118px;
  overflow: hidden;
  color: #7e8b9a;
  font-size: 0.55rem;
  line-height: 1.45;
  text-align: center;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 160ms ease;
}

.series-node--first .series-node__label {
  left: 0;
  text-align: left;
}

.series-node--last .series-node__label {
  right: 0;
  left: auto;
  text-align: right;
}

.series-node__card {
  position: absolute;
  bottom: calc(100% + 18px);
  left: 50%;
  z-index: 12;
  display: grid;
  width: 276px;
  overflow: hidden;
  border: 1px solid rgb(189 232 251 / 16%);
  border-radius: 10px;
  background: #080b12;
  box-shadow: 0 18px 46px rgb(0 0 0 / 44%);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 5px);
  transition:
    opacity 160ms ease,
    transform 160ms ease,
    visibility 160ms ease;
  visibility: hidden;

  img {
    width: 100%;
    height: 72px;
    object-fit: cover;
    filter: saturate(0.78) contrast(1.04);
  }
}

.series-node__card--below {
  top: calc(var(--node-size) / 2 + 18px);
  bottom: auto;
}

.series-node--first .series-node__card {
  left: 0;
  transform: translateY(5px);
}

.series-node--first .series-node__link:hover .series-node__card,
.series-node--first .series-node__link:focus-visible .series-node__card,
.series-node--first .series-node__link--open .series-node__card {
  transform: translateY(0);
}

.series-node--last .series-node__card {
  right: 0;
  left: auto;
  transform: translateY(5px);
}

.series-node--last .series-node__link:hover .series-node__card,
.series-node--last .series-node__link:focus-visible .series-node__card,
.series-node--last .series-node__link--open .series-node__card {
  transform: translateY(0);
}

.series-node__card-copy {
  display: grid;
  gap: 5px;
  padding: 11px 13px 13px;
  text-align: left;

  time {
    color: var(--tier-colour);
    font-size: 0.52rem;
  }

  strong {
    color: var(--ink);
    font-family: $font-display;
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.18;
  }

  > span {
    overflow: hidden;
    color: var(--mute);
    font-family: $font-body;
    font-size: 0.64rem;
    line-height: 1.45;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.energy-spectrum__mobile {
  display: none;
}

@media (hover: none) {
  .series-node__link:hover:not(.series-node__link--open):not(:focus-visible) .series-node__card {
    visibility: hidden;
    opacity: 0;
  }
}

@media (max-width: 800px) and (min-width: 640px) {
  .energy-spectrum__desktop {
    grid-template-columns: 52px minmax(0, 1fr);
  }

  .series-level,
  .spectrum-lane__empty {
    grid-template-columns: 118px minmax(0, 1fr);
    gap: 16px;
    padding-right: 18px;
    padding-left: 14px;
  }

  .series-node {
    width: 104px;
  }

  .series-node__label {
    width: 96px;
    font-size: 0.5rem;
  }

  .series-node__card {
    width: 248px;
  }
}

@media (max-width: 639px) {
  .energy-spectrum__header {
    align-items: start;
    flex-direction: column;
    padding-bottom: 30px;
  }

  .energy-spectrum__legend {
    display: none;
  }

  .energy-spectrum__desktop {
    display: none;
  }

  .energy-spectrum__mobile {
    display: grid;
    gap: 42px;
  }

  .mobile-series {
    display: grid;
    gap: 14px;

    > header {
      display: grid;
      gap: 9px;
      padding-bottom: 14px;
      border-bottom: 1px solid color-mix(in srgb, var(--tier-colour) 45%, transparent);

      div {
        display: flex;
        align-items: baseline;
        gap: 10px;
      }

      span {
        color: var(--tier-colour);
        font-size: 0.7rem;
        font-weight: 700;
      }

      small {
        color: var(--mute);
        font-size: 0.54rem;
      }

      h3 {
        font-size: 1.35rem;
      }
    }

    ol {
      display: grid;
      gap: 10px;
      padding: 0;
      list-style: none;
    }
  }

  .mobile-post {
    display: grid;
    min-height: 92px;
    grid-template-columns: 112px minmax(0, 1fr);
    overflow: hidden;
    border: 1px solid rgb(189 232 251 / 12%);
    border-radius: 9px;
    background: rgb(8 11 18 / 72%);

    img {
      width: 100%;
      height: 100%;
      min-height: 92px;
      object-fit: cover;
      filter: saturate(0.78) contrast(1.04);
    }
  }

  .mobile-post__copy {
    display: grid;
    align-content: center;
    gap: 7px;
    padding: 14px;

    time {
      color: var(--mute);
      font-size: 0.52rem;
    }

    strong {
      color: var(--ink);
      font-family: $font-display;
      font-size: 0.96rem;
      font-weight: 500;
      line-height: 1.22;
    }
  }
}

@media (max-width: 420px) {
  .mobile-post {
    grid-template-columns: 92px minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .series-level,
  .series-node__label,
  .series-node__card {
    transition: none;
  }
}
</style>
