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
  description?: string
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
const seriesAtScrollEnd = ref(new Set<string>())

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
  ENERGY_TIERS.flatMap(tier =>
    (seriesByTier.value.get(tier.id) ?? []).map(series => ({ series, tier })),
  ),
)

const accessibleDescription = computed(() => {
  const assignments = props.seriesList.map((series) => {
    const tier = tierFor(series.energyTier)
    return `${series.title} is in the ${tier?.label ?? series.energyTier} ${tier?.name ?? ''} tier`
  })

  return `Series difficulty increases downward from foundational to advanced, with harder series shown more dimly. ${assignments.join('. ')}. Within each series, posts run oldest to newest from left to right and become brighter, with a ring marking the newest post.`
})

const difficultyProgress = (energyTier: EnergyTier) => {
  const tierIndex = ENERGY_TIERS.findIndex(tier => tier.id === energyTier)

  return Math.max(tierIndex, 0) / Math.max(ENERGY_TIERS.length - 1, 1)
}

const nodeColour = (postProgress: number, energyTier: EnergyTier) => {
  const difficulty = difficultyProgress(energyTier)
  const lightness = 34 + postProgress * 50 - difficulty * 14

  return `hsl(199 82% ${lightness}%)`
}

const tierStyle = (tier: EnergyTierDefinition) => ({
  '--tier-colour': `hsl(199 82% ${64 - difficultyProgress(tier.id) * 18}%)`,
})

const trackStyle = (count: number, energyTier: EnergyTier) => ({
  '--post-count': count,
  '--track-start-colour': nodeColour(0, energyTier),
  '--track-end-colour': nodeColour(1, energyTier),
})

const nodeStyle = (index: number, count: number, energyTier: EnergyTier) => {
  const postProgress = count === 1 ? 1 : index / (count - 1)
  const difficulty = difficultyProgress(energyTier)

  return {
    '--node-colour': nodeColour(postProgress, energyTier),
    '--node-glow': `${(4 + postProgress * 17) * (1 - difficulty * 0.35)}px`,
  }
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

const isAtScrollEnd = (seriesSlug: string) =>
  seriesAtScrollEnd.value.has(seriesSlug)

const syncSeriesScroll = (event: Event, seriesSlug: string) => {
  const viewport = event.currentTarget as HTMLElement
  const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2
  const updatedSeries = new Set(seriesAtScrollEnd.value)

  if (atEnd) {
    updatedSeries.add(seriesSlug)
  }
  else {
    updatedSeries.delete(seriesSlug)
  }

  seriesAtScrollEnd.value = updatedSeries
}

const scrollSeriesRight = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLButtonElement
  const viewport = button
    .closest<HTMLElement>('.series-level__plot')
    ?.querySelector<HTMLElement>('.series-level__viewport')

  viewport?.scrollBy({
    left: Math.max(240, viewport.clientWidth * 0.72),
    behavior: 'smooth',
  })
}

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
      frame.querySelectorAll<HTMLElement>('.series-level__plot'),
      (plot) => {
        const lineOffset = Number.parseFloat(
          getComputedStyle(plot).getPropertyValue('--line-y'),
        )

        return plot.getBoundingClientRect().top + lineOffset
      },
    )
    const previousLine = linePositions.filter(position => position < nodeY - 1).at(-1)
    const nextLine = linePositions.find(position => position > nodeY + 1)
    const clearance = 12
    const cardOffset = 18
    const nodeDiameter = target.querySelector<HTMLElement>('.series-node__point')
      ?.getBoundingClientRect().height ?? 22
    const nodeRadius = nodeDiameter / 2
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

      <p class="energy-spectrum__guide">
        Newer = brighter <span aria-hidden="true">&middot;</span> Harder = dimmer
      </p>
    </header>

    <p id="spectrum-description" class="visually-hidden">
      {{ accessibleDescription }}
    </p>

    <div
      :class="['energy-spectrum__desktop', { 'energy-spectrum__desktop--isolating': activeNode }]"
      role="group"
      aria-describedby="spectrum-description"
    >
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
              <p v-if="series.description">{{ series.description }}</p>
              <NuxtLink :to="`/blog/series/${series.slug}`">View all</NuxtLink>
            </div>

            <div class="series-level__plot">
              <div
                :class="[
                  'series-level__viewport',
                  { 'series-level__viewport--scrollable': series.posts.length > 4 },
                ]"
                @scroll="syncSeriesScroll($event, series.slug)"
              >
                <ol
                  :style="trackStyle(series.posts.length, series.energyTier)"
                  :aria-label="`${series.title} posts, oldest to newest`"
                >
                  <li
                    v-for="(post, index) in series.posts"
                    :key="post.path"
                    class="series-node"
                    :style="nodeStyle(index, series.posts.length, series.energyTier)"
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

              <span
                v-if="series.posts.length > 4"
                :class="[
                  'series-level__scroll-fade',
                  { 'series-level__scroll-fade--hidden': isAtScrollEnd(series.slug) },
                ]"
                aria-hidden="true"
              />
              <button
                v-if="series.posts.length > 4"
                class="series-level__scroll-next"
                type="button"
                :disabled="isAtScrollEnd(series.slug)"
                :aria-label="`Show newer posts in ${series.title}`"
                @click="scrollSeriesRight"
              >
                <span aria-hidden="true" />
              </button>
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
          <p v-if="series.description">{{ series.description }}</p>
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
    font-size: 38px;
  }
}

.energy-spectrum__kicker,
.energy-spectrum__guide,
.spectrum-lane__header,
.series-level__identity a,
.series-node__label,
.series-node__card time,
.mobile-series header span,
.mobile-series header small,
.mobile-post time {
  font-family: $font-mono;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.energy-spectrum__kicker {
  color: var(--mute);
  font-size: 10px;
}

.energy-spectrum__guide {
  max-width: 360px;
  margin-bottom: 2px;
  color: var(--mute);
  font-size: 9px;
  line-height: 1.6;
  text-align: right;
}

.energy-spectrum__desktop {
  border: 1px solid rgb(189 232 251 / 12%);
  border-radius: 10px;
  background: rgb(4 6 11 / 72%);
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
  font-size: 12px;
  font-weight: 700;
}

.spectrum-lane__name {
  color: var(--mute);
  font-size: 9px;
}

.spectrum-lane__empty {
  display: grid;
  min-height: 122px;
  grid-template-columns: 206px minmax(0, 1fr);
  align-items: center;
  gap: 22px;
  padding: 34px 24px 0 18px;
  color: var(--faint);
  font-family: $font-mono;
  font-size: 9px;
  letter-spacing: 1px;
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
  grid-template-columns: 206px minmax(0, 1fr);
  gap: 22px;
  padding: 0 24px 0 18px;
  transition: opacity 160ms ease;

  &--dimmed {
    opacity: 0.28;
  }
}

.series-level__identity {
  min-width: 0;
  padding-top: 86px;

  h3 {
    display: -webkit-box;
    overflow: hidden;
    color: var(--ink);
    font-size: 18px;
    line-height: 1.1;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  p {
    display: -webkit-box;
    margin-top: 7px;
    overflow: hidden;
    color: var(--mute);
    font-size: 11px;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  a {
    display: inline-block;
    margin-top: 7px;
    color: var(--mute);
    font-size: 8px;

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
}

.series-level__viewport {
  min-width: 0;
  height: 100%;

  ol {
    --track-padding: 0px;
    --node-column-width: calc(100% / var(--post-count));

    position: relative;
    display: grid;
    width: 100%;
    min-width: 100%;
    height: 100%;
    grid-template-columns: repeat(var(--post-count), minmax(0, 1fr));
    margin: 0;
    padding-inline: var(--track-padding);
    list-style: none;

    &::before {
      position: absolute;
      top: var(--line-y);
      right: calc(var(--track-padding) + var(--node-column-width) / 2);
      left: calc(var(--track-padding) + var(--node-column-width) / 2);
      height: 1px;
      background: linear-gradient(90deg, var(--track-start-colour), var(--track-end-colour));
      box-shadow: 0 0 8px rgb(51 180 236 / 18%);
      content: '';
    }
  }

  &--scrollable {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-color: rgb(51 180 236 / 42%) transparent;
    scrollbar-width: thin;

    ol {
      --track-padding: 64px;
      --node-column-width: 160px;

      width: calc(var(--post-count) * var(--node-column-width) + var(--track-padding) * 2);
      min-width: calc(var(--post-count) * var(--node-column-width) + var(--track-padding) * 2);
      grid-template-columns: repeat(var(--post-count), var(--node-column-width));
    }
  }
}

.series-level__scroll-fade {
  position: absolute;
  z-index: 5;
  top: 0;
  right: 0;
  bottom: 8px;
  width: 104px;
  background: linear-gradient(90deg, transparent, rgb(0 0 0 / 28%));
  opacity: 1;
  pointer-events: none;
  transition: opacity 180ms ease;

  &--hidden {
    opacity: 0;
  }
}

.series-level__scroll-next {
  position: absolute;
  z-index: 6;
  top: var(--line-y);
  right: 10px;
  display: grid;
  width: 34px;
  height: 34px;
  border: 1px solid rgb(189 232 251 / 24%);
  border-radius: 50%;
  background: rgb(4 6 11 / 76%);
  box-shadow: 0 0 18px rgb(0 0 0 / 38%);
  cursor: pointer;
  place-items: center;
  transform: translateY(-50%);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    opacity 180ms ease;

  span {
    width: 8px;
    height: 8px;
    border-top: 1px solid var(--tier-colour);
    border-right: 1px solid var(--tier-colour);
    transform: translateX(-2px) rotate(45deg);
  }

  &:hover,
  &:focus-visible {
    border-color: color-mix(in srgb, var(--tier-colour) 66%, transparent);
    background: rgb(8 11 18 / 92%);
  }

  &:focus-visible {
    outline: 2px solid var(--tier-colour);
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0;
    pointer-events: none;
  }
}

.series-node {
  position: relative;
  min-width: 0;
}

.series-node__link {
  position: absolute;
  top: var(--line-y);
  left: 50%;
  display: block;
  width: 128px;
  height: 78px;
  color: inherit;
  text-decoration: none;
  transform: translateX(-50%);

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
  width: 22px;
  height: 22px;
  border: 1px solid color-mix(in srgb, var(--node-colour) 80%, white);
  border-radius: 50%;
  background: var(--node-colour);
  box-shadow:
    0 0 var(--node-glow) color-mix(in srgb, var(--node-colour) 56%, transparent),
    0 0 calc(var(--node-glow) * 1.7) color-mix(in srgb, var(--node-colour) 24%, transparent);
  transform: translate(-50%, -50%);

  &--newest::after {
    position: absolute;
    inset: -6px;
    border: 1px solid rgb(231 237 243 / 76%);
    border-radius: 50%;
    content: '';
  }
}

.series-node__label {
  position: absolute;
  top: 24px;
  left: 50%;
  display: -webkit-box;
  width: 118px;
  overflow: hidden;
  color: #7e8b9a;
  font-size: 9px;
  line-height: 1.45;
  text-align: center;
  transform: translateX(-50%);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 160ms ease;
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
  top: 29px;
  bottom: auto;
}

.series-node__card-copy {
  display: grid;
  gap: 5px;
  padding: 11px 13px 13px;
  text-align: left;

  time {
    color: var(--tier-colour);
    font-size: 8px;
  }

  strong {
    color: var(--ink);
    font-family: $font-display;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.18;
  }

  > span {
    overflow: hidden;
    color: var(--mute);
    font-family: $font-body;
    font-size: 10px;
    line-height: 1.45;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media (max-width: 1260px) {
  .energy-spectrum__header h2 {
    font-size: 3vw;
  }
}

@media (max-width: 1140px) {
  .series-level,
  .spectrum-lane__empty {
    grid-template-columns: 18vw minmax(0, 1fr);
  }

}

@media (max-width: 1200px) {
  .series-level__identity h3 {
    font-size: 1.5vw;
  }
}

@media (max-width: 960px) {
  .series-level__identity h3 {
    font-size: 14px;
  }
}

@media (max-width: 850px) {
  .energy-spectrum__header h2 {
    font-size: 26px;
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
  .series-level,
  .spectrum-lane__empty {
    grid-template-columns: 118px minmax(0, 1fr);
    gap: 16px;
    padding-right: 18px;
    padding-left: 14px;
  }

  .series-node__label {
    width: 96px;
    font-size: 8px;
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

  .energy-spectrum__guide {
    text-align: left;
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
        font-size: 11px;
        font-weight: 700;
      }

      small {
        color: var(--mute);
        font-size: 9px;
      }

      h3 {
        font-size: 22px;
      }

      > p {
        max-width: 580px;
        color: var(--mute);
        font-size: 12px;
        line-height: 1.55;
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
      font-size: 8px;
    }

    strong {
      color: var(--ink);
      font-family: $font-display;
      font-size: 15px;
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
  .series-level__scroll-fade,
  .series-level__scroll-next,
  .series-node__label,
  .series-node__card {
    transition: none;
  }
}
</style>
