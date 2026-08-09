<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.timeline],
})

type Milestone = {
  date: string
  kicker: string
  title: string
  description: string
  stat: string
}

const milestones: Milestone[] = [
  {
    date: '2022',
    kicker: 'Ion source',
    title: 'The first spark',
    description: 'A small group of physicists and educators sketch a programme that makes particle physics tangible for young learners.',
    stat: '01 idea',
  },
  {
    date: '2023',
    kicker: 'Linear accelerator',
    title: 'First classroom beam',
    description: 'The first hands-on sessions turn invisible particles into tracks, questions and experiments students can own.',
    stat: '04 sessions',
  },
  {
    date: '2024',
    kicker: 'Proton synchrotron',
    title: 'The network gains energy',
    description: 'Teachers and volunteers join the chain, bringing repeatable workshops to a growing set of partner schools.',
    stat: '06 partners',
  },
  {
    date: '2025',
    kicker: 'Super proton synchrotron',
    title: 'Momentum at scale',
    description: 'A shared curriculum and facilitator toolkit let the programme reach more classrooms without losing its curiosity-first approach.',
    stat: '420 students',
  },
  {
    date: '2026',
    kicker: 'Large hadron collider',
    title: 'A thousand collisions',
    description: 'The next milestone is one thousand students meeting fundamental physics through direct observation and experiment.',
    stat: '1,000 goal',
  },
]

const activeIndex = ref(0)
const isPlaying = ref(true)
let timer: ReturnType<typeof setInterval> | undefined

const activeMilestone = computed(() => milestones[activeIndex.value] ?? milestones[0]!)
const progress = computed(() => `${(activeIndex.value / (milestones.length - 1)) * 100}%`)
const progressStyle = computed(() => ({ '--timeline-progress': progress.value }))

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = undefined
}

function startTimer() {
  stopTimer()
  if (!isPlaying.value) return
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % milestones.length
  }, 2800)
}

function selectMilestone(index: number) {
  activeIndex.value = index
  startTimer()
}

function togglePlayback() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) startTimer()
  else stopTimer()
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isPlaying.value = false
    return
  }
  startTimer()
})

onUnmounted(stopTimer)
</script>

<template>
  <main class="timeline-page" :style="progressStyle">
    <section class="timeline-page__inner">
      <header class="timeline-header">
        <div>
          <p class="eyebrow">Our timeline · 2022—2026</p>
          <h1>One idea,<br><em>accelerated.</em></h1>
        </div>
        <div class="timeline-header__copy">
          <p>Follow the particle through each stage of our story. Every milestone adds energy to what comes next.</p>
          <button class="playback" type="button" @click="togglePlayback">
            <span aria-hidden="true">{{ isPlaying ? 'Ⅱ' : '▶' }}</span>
            {{ isPlaying ? 'Pause particle' : 'Resume particle' }}
          </button>
        </div>
      </header>

      <div class="beamline" aria-label="Timeline milestones">
        <div class="beamline__rail" aria-hidden="true">
          <span class="beamline__energy" />
          <span class="particle" />
        </div>
        <button
          v-for="(milestone, index) in milestones"
          :key="milestone.date"
          type="button"
          :class="['beamline__station', { 'is-active': activeIndex === index, 'is-passed': activeIndex > index }]"
          :aria-pressed="activeIndex === index"
          @click="selectMilestone(index)"
        >
          <span class="beamline__ring" aria-hidden="true"><i /></span>
          <strong>{{ milestone.date }}</strong>
          <small>{{ milestone.kicker }}</small>
        </button>
      </div>

      <article class="milestone-readout" aria-live="polite">
        <div class="milestone-readout__index">0{{ activeIndex + 1 }} / 0{{ milestones.length }}</div>
        <div>
          <p class="eyebrow">{{ activeMilestone.kicker }}</p>
          <h2>{{ activeMilestone.title }}</h2>
        </div>
        <p>{{ activeMilestone.description }}</p>
        <strong>{{ activeMilestone.stat }}</strong>
      </article>
    </section>
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

.eyebrow {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.timeline-header {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.6fr);
  gap: 80px;
  align-items: end;

  h1 {
    margin-top: 18px;
    font-family: $font-display;
    font-size: clamp(62px, 7.4vw, 122px);
    font-weight: 600;
    letter-spacing: -0.07em;
    line-height: 0.82;
  }

  em {
    color: var(--core);
    font-weight: 400;
  }
}

.timeline-header__copy {
  display: grid;
  gap: 24px;
  max-width: 450px;
  color: var(--body-copy);
  font-size: 17px;
}

.playback {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--beam) 30%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--atlas) 9%, transparent);
  color: var(--core);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;

  span {
    color: var(--signal);
  }
}

.beamline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-top: 104px;
}

.beamline__rail {
  position: absolute;
  top: 29px;
  right: 10%;
  left: 10%;
  height: 2px;
  background: var(--line);
}

.beamline__energy {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--timeline-progress);
  background: var(--beam);
  box-shadow: 0 0 16px color-mix(in srgb, var(--beam) 72%, transparent);
  transition: width 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.particle {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: var(--timeline-progress);
  width: 12px;
  height: 12px;
  border: 2px solid var(--panel);
  border-radius: 50%;
  background: var(--signal);
  box-shadow:
    0 0 0 6px color-mix(in srgb, var(--signal) 10%, transparent),
    0 0 24px 6px color-mix(in srgb, var(--signal) 70%, transparent);
  transform: translate(-50%, -50%);
  transition: left 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.beamline__station {
  position: relative;
  z-index: 2;
  display: grid;
  justify-items: center;
  background: transparent;
  color: var(--faint);
  cursor: pointer;
  text-align: center;
  transition: color $transition-fast $transition-ease;

  strong {
    margin-top: 16px;
    color: var(--body-copy);
    font-family: $font-display;
    font-size: 24px;
    line-height: 1;
  }

  small {
    max-width: 150px;
    margin-top: 8px;
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 0.08em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  &.is-active,
  &.is-passed {
    color: var(--beam);
  }

  &.is-active strong {
    color: var(--core);
  }
}

.beamline__ring {
  display: grid;
  width: 60px;
  height: 60px;
  border: 1px solid currentcolor;
  border-radius: 50%;
  background: var(--black);
  box-shadow: inset 0 0 0 8px var(--black);
  place-items: center;

  i {
    width: 18px;
    height: 18px;
    border: 1px solid currentcolor;
    border-radius: 50%;
  }
}

.beamline__station.is-active .beamline__ring {
  border-color: var(--signal);
  box-shadow:
    inset 0 0 0 8px var(--black),
    0 0 22px color-mix(in srgb, var(--signal) 30%, transparent);
  color: var(--signal);
  transform: scale(1.12);
}

.milestone-readout {
  display: grid;
  grid-template-columns: 80px minmax(240px, 1fr) minmax(280px, 1.1fr) auto;
  gap: 44px;
  align-items: center;
  min-height: 210px;
  margin-top: 72px;
  padding: 34px 42px;
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  border-radius: 18px;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--panel-2) 92%, transparent),
    color-mix(in srgb, var(--panel) 70%, transparent)
  );
  box-shadow: 0 30px 90px rgb(0 0 0 / 32%);

  h2 {
    margin-top: 8px;
    font-family: $font-display;
    font-size: clamp(32px, 3.2vw, 50px);
    letter-spacing: -0.045em;
    line-height: 0.98;
  }

  > p {
    color: var(--body-copy);
    font-size: 15px;
    line-height: 1.75;
  }

  > strong {
    color: var(--signal);
    font-family: $font-mono;
    font-size: 15px;
    white-space: nowrap;
  }
}

.milestone-readout__index {
  color: var(--faint);
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 0.08em;
}

@media (max-width: 1000px) {
  .timeline-header {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 760px) {
  .timeline-page__inner {
    width: min(100% - 40px, 620px);
    padding-block: 72px 120px;
  }

  .beamline {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-top: 64px;
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
    height: var(--timeline-progress);
    transition-property: height;
  }

  .particle {
    top: var(--timeline-progress);
    left: 50%;
    transition-property: top;
  }

  .beamline__station {
    grid-template-columns: 60px 70px 1fr;
    gap: 16px;
    align-items: center;
    justify-items: start;
    text-align: left;

    strong,
    small {
      margin: 0;
    }
  }

  .milestone-readout {
    grid-template-columns: 1fr;
    gap: 22px;
    margin-top: 50px;
    padding: 28px;
  }
}
</style>
