<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'
import { TIMELINE_MILESTONES, TIMELINE_SPAN } from '~/content/timeline'
import {
  useTimelinePlayer,
  type TimelineSpeed,
  type TimelineView,
} from '~/composables/useTimelinePlayer'
import TimelineBeamline from '~/components/timeline/TimelineBeamline.vue'
import TimelineControls from '~/components/timeline/TimelineControls.vue'
import TimelineList from '~/components/timeline/TimelineList.vue'
import TimelineReadout from '~/components/timeline/TimelineReadout.vue'

definePageMeta({
  heroStages: [HERO_STAGE.timeline],
})

useHead({ title: 'Timeline — WIEMO' })

const route = useRoute()
const router = useRouter()

const MILESTONE_QUERY = 'm'
const total = TIMELINE_MILESTONES.length

/** A shared link names its milestone, so it opens there instead of autoplaying. */
const linkedIndex = TIMELINE_MILESTONES.findIndex(
  milestone => milestone.id === route.query[MILESTONE_QUERY],
)

const player = useTimelinePlayer(total, {
  initialIndex: Math.max(linkedIndex, 0),
  autoplay: linkedIndex < 0,
})

const view = ref<TimelineView>('beamline')

const activeIndex = player.index
const activeMilestone = computed(() => TIMELINE_MILESTONES[activeIndex.value] ?? TIMELINE_MILESTONES[0]!)
const previousMilestone = computed(() => TIMELINE_MILESTONES[activeIndex.value - 1])
const nextMilestone = computed(() => TIMELINE_MILESTONES[activeIndex.value + 1])

// Keep the address bar describing what is on screen so any milestone is shareable.
watch(activeIndex, (index) => {
  const id = TIMELINE_MILESTONES[index]?.id
  if (!id || route.query[MILESTONE_QUERY] === id) return

  void router.replace({ query: { ...route.query, [MILESTONE_QUERY]: id } })
})

const setSpeed = (speed: TimelineSpeed) => {
  player.speed.value = speed
}

const openOnBeamline = (index: number) => {
  player.select(index)
  view.value = 'beamline'
}
</script>

<template>
  <main class="timeline-page">
    <div class="timeline-page__inner">
      <header class="timeline-header">
        <div class="timeline-header__lead">
          <p class="timeline-header__eyebrow">
            Our timeline
            <span aria-hidden="true">&middot;</span>
            {{ TIMELINE_SPAN.from }} &ndash; {{ TIMELINE_SPAN.to }}
          </p>
          <h1>One idea,<br><em>accelerated.</em></h1>
        </div>

        <div class="timeline-header__copy">
          <p>
            Follow WIEMO from its first pilot session to more than 350 students reached
            across Bengaluru. Play it through, or step to any milestone yourself.
          </p>
          <dl class="timeline-header__summary">
            <div>
              <dt>Milestones</dt>
              <dd>{{ String(total).padStart(2, '0') }}</dd>
            </div>
            <div>
              <dt>Span</dt>
              <dd>{{ TIMELINE_SPAN.from }} &ndash; {{ TIMELINE_SPAN.to }}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section class="timeline-console" aria-label="Milestone browser">
        <TimelineControls
          :index="activeIndex"
          :total="total"
          :is-playing="player.isPlaying.value"
          :is-at-start="player.isAtStart.value"
          :is-at-end="player.isAtEnd.value"
          :progress="player.progress.value"
          :speed="player.speed.value"
          :view="view"
          @previous="player.previous"
          @next="player.next"
          @toggle="player.toggle"
          @update:speed="setSpeed"
          @update:view="view = $event"
        />

        <p class="visually-hidden" aria-live="polite">
          Milestone {{ activeIndex + 1 }} of {{ total }}: {{ activeMilestone.title }}
        </p>

        <template v-if="view === 'beamline'">
          <TimelineBeamline
            :milestones="TIMELINE_MILESTONES"
            :active-index="activeIndex"
            :progress="player.progress.value"
            :is-playing="player.isPlaying.value"
            @select="player.select"
            @hold="player.hold"
            @release="player.release"
          />

          <TimelineReadout
            :milestone="activeMilestone"
            :index="activeIndex"
            :total="total"
            :previous="previousMilestone"
            :next="nextMilestone"
            @previous="player.previous"
            @next="player.next"
          />

          <p class="timeline-console__hint">
            Tip: with a milestone focused, use the arrow keys to step through the beamline.
          </p>
        </template>

        <TimelineList
          v-else
          :milestones="TIMELINE_MILESTONES"
          :active-index="activeIndex"
          @focus="openOnBeamline"
        />
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.timeline-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
}

.timeline-page__inner {
  width: min(1420px, calc(100% - (var(--gutter) * 2)));
  margin-inline: auto;
  padding-block: 104px 144px;
}

.timeline-header {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.6fr);
  gap: 80px;
  align-items: end;

  h1 {
    margin-top: 18px;
    font-family: $font-display;
    font-size: clamp(58px, 7.2vw, 118px);
    font-weight: 600;
    letter-spacing: -0.07em;
    line-height: 0.82;
  }

  em {
    color: var(--core);
    font-weight: 400;
  }
}

.timeline-header__eyebrow {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.timeline-header__copy {
  display: grid;
  gap: 24px;
  max-width: 460px;
  color: var(--body-copy);
  font-size: 16px;
  line-height: 1.7;
}

.timeline-header__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 40px;
  padding-top: 20px;
  border-top: 1px solid var(--line);

  dt {
    color: var(--faint);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  dd {
    margin-top: 6px;
    color: var(--core);
    font-family: $font-display;
    font-size: 18px;
    line-height: 1.1;
  }
}

.timeline-console {
  display: grid;
  gap: 68px;
  margin-top: 84px;
}

.timeline-console__hint {
  color: var(--faint);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 0.1em;
}

@media (max-width: 1000px) {
  .timeline-header {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .timeline-console {
    gap: 48px;
  }
}

@media (max-width: 760px) {
  .timeline-page__inner {
    width: min(100% - 40px, 620px);
    padding-block: 72px 120px;
  }

  .timeline-console {
    margin-top: 56px;
  }
}
</style>
