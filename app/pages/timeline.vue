<script setup lang="ts">
import { TIMELINE_MILESTONES } from '~/content/timeline'
import {
  useTimelinePlayer,
  type TimelineSpeed,
  type TimelineView,
} from '~/composables/useTimelinePlayer'
import TimelineBeamline from '~/components/timeline/TimelineBeamline.vue'
import TimelineControls from '~/components/timeline/TimelineControls.vue'
import TimelineList from '~/components/timeline/TimelineList.vue'
import TimelineReadout from '~/components/timeline/TimelineReadout.vue'
import { WIEMO_IMPACT } from '~/content/impact'

const description = `Follow WIEMO’s journey from its first particle physics pilot session to ${WIEMO_IMPACT.sessionsDelivered} sessions reaching ${WIEMO_IMPACT.studentsReached} students across Bengaluru.`

useSeoMeta({
  title: 'Timeline',
  description,
  ogTitle: 'WIEMO | Timeline',
  ogDescription: description,
  twitterTitle: 'WIEMO | Timeline',
  twitterDescription: description,
})

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

onMounted(() => {
  if (window.matchMedia('(max-width: 760px)').matches) {
    view.value = 'list'
    player.pause()
  }
})

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
  <main class="timeline-page content-section">
    <div class="wrap timeline-page__inner">
      <header class="timeline-header">
        <p class="timeline-header__eyebrow">Our journey</p>
        <h1>Timeline</h1>
        <p class="lede">
          Follow WIEMO from its first pilot session to {{ WIEMO_IMPACT.studentsReached }} students
          reached across Bengaluru. Play it through, or explore each milestone yourself.
        </p>
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
  overflow-x: clip;
}

.timeline-page__inner {
  display: grid;
  gap: 64px;
}

.timeline-header {
  max-width: 860px;

  h1 {
    @include responsive-page-heading;

    margin-top: 12px;
    line-height: 0.9;
  }

  .lede { margin-top: 20px; }
}

.timeline-header__eyebrow {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.timeline-console {
  display: grid;
  gap: 52px;
}

.timeline-console__hint {
  color: var(--faint);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 0.1em;
}

@media (max-width: 1000px) {
  .timeline-console {
    gap: 48px;
  }
}

@media (max-width: 760px) {
  .timeline-page__inner {
    gap: 44px;
  }

  .timeline-console {
    gap: 36px;
  }
}

</style>
