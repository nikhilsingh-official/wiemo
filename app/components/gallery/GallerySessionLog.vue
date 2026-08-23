<script setup lang="ts">
import GalleryFrameCard from './GalleryFrame.vue'
import type { GallerySession } from '~/content/gallery'
import { WIEMO_IMPACT } from '~/content/impact'

defineOptions({ name: 'GallerySessionLog' })

const props = defineProps<{ sessions: GallerySession[] }>()

const sessionCount = computed(() => props.sessions.length)
const frameCount = computed(() => props.sessions.reduce(
  (total, session) => total + session.frames.length,
  0,
))

const emit = defineEmits<{
  open: [frameId: number]
}>()
</script>

<template>
  <section class="gallery-log" aria-labelledby="gallery-title">
    <header class="wrap gallery-log__header">
      <p class="gallery-log__eyebrow">Field archive / documented visits</p>
      <h1 id="gallery-title">Gallery</h1>
      <div class="gallery-log__headline">
        <h2>{{ frameCount }} frames.<br>{{ sessionCount }} documented visits.</h2>
        <div class="gallery-log__readout" aria-label="Gallery summary">
          <p><strong>{{ String(frameCount).padStart(3, '0') }}</strong> frames</p>
          <p><strong>{{ String(sessionCount).padStart(3, '0') }}</strong> visits</p>
        </div>
      </div>
      <p class="gallery-log__intro">
        A field record from {{ sessionCount }} documented visits within WIEMO’s
        {{ WIEMO_IMPACT.sessionsDelivered }} sessions delivered to date.
      </p>
    </header>

    <div class="wrap gallery-log__sessions">
      <section
        v-for="session in sessions"
        :id="session.id"
        :key="session.id"
        class="gallery-log__session"
        :aria-labelledby="`${session.id}-gallery-title`"
      >
        <header class="gallery-log__session-header">
          <div class="gallery-log__beamline" aria-hidden="true">
            <span />
          </div>
          <div class="gallery-log__session-meta">
            <p>Visit {{ String(session.index).padStart(2, '0') }}</p>
            <h2 :id="`${session.id}-gallery-title`">{{ session.partner }}</h2>
            <p>
              <span>{{ session.location }}</span>
              <span aria-hidden="true">·</span>
              <time v-if="session.dateTime" :datetime="session.dateTime">{{ session.dateLabel }}</time>
              <span v-else>{{ session.dateLabel }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ String(session.frames.length).padStart(2, '0') }} frames</span>
            </p>
          </div>
        </header>

        <div class="gallery-log__grid">
          <GalleryFrameCard
            v-for="item in session.frames"
            :key="item.id"
            :frame="item"
            @open="emit('open', $event)"
          />
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gallery-log {
  padding-block: var(--section-padding);
  background: color-mix(in srgb, var(--black) 76%, transparent);
  border-bottom: 1px solid var(--line-soft);
}

.gallery-log__header {
  padding-bottom: 88px;

  > h1 {
    margin-top: 18px;
    font-size: clamp(52px, 7vw, 94px);
    line-height: 0.92;
  }
}

.gallery-log__eyebrow,
.gallery-log__session-meta > p:first-child {
  color: var(--beam);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}

.gallery-log__headline {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 48px;
  align-items: end;
  margin-top: 24px;
}

.gallery-log__headline h2 {
  font-size: clamp(34px, 4.5vw, 64px);
  line-height: 0.92;
}

.gallery-log__readout {
  display: grid;
  grid-template-columns: repeat(2, minmax(110px, 1fr));
  gap: 1px;
  padding: 1px;
  background: var(--line);

  p {
    display: grid;
    gap: 4px;
    min-width: 142px;
    padding: 18px;
    color: var(--faint);
    background: var(--black);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 1.4px;
    text-transform: uppercase;
  }

  strong {
    color: var(--core);
    font-family: $font-display;
    font-size: 34px;
    font-weight: 500;
    letter-spacing: -1px;
    line-height: 1;
  }
}

.gallery-log__intro {
  max-width: 470px;
  margin-top: 28px;
  color: var(--mute);
  font-size: 15px;
}

.gallery-log__sessions {
  display: grid;
  gap: 104px;
}

.gallery-log__session {
  scroll-margin-top: 100px;
}

.gallery-log__session-header {
  margin-bottom: 28px;
}

.gallery-log__beamline {
  position: relative;
  height: 1px;
  margin-bottom: 24px;
  background: linear-gradient(90deg, var(--atlas), color-mix(in srgb, var(--atlas) 15%, transparent));

  &::before,
  span {
    position: absolute;
    top: 50%;
    width: 7px;
    height: 7px;
    background: var(--black);
    border: 1px solid var(--beam);
    border-radius: 50%;
    transform: translateY(-50%);
    content: '';
  }

  &::before { left: 0; }
  span { left: 66.666%; }
}

.gallery-log__session-meta {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr) auto;
  gap: 24px;
  align-items: baseline;

  h2 {
    font-size: clamp(27px, 3vw, 42px);
  }

  > p:last-child {
    display: flex;
    gap: 8px;
    color: var(--faint);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

.gallery-log__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px 18px;
}

@media (max-width: 850px) {
  .gallery-log__headline {
    grid-template-columns: 1fr;
  }

  .gallery-log__readout {
    width: min(100%, 360px);
  }

  .gallery-log__session-meta {
    grid-template-columns: 1fr;
    gap: 7px;
  }

  .gallery-log__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 540px) {
  .gallery-log__header { padding-bottom: 64px; }
  .gallery-log__sessions { gap: 76px; }
  .gallery-log__grid { grid-template-columns: 1fr; gap: 24px; }

  .gallery-log__headline h2 { font-size: 36px; }

  .gallery-log__readout {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    p { min-width: 0; padding: 14px; }
    strong { font-size: 28px; }
  }

  .gallery-log__session-meta > p:last-child { flex-wrap: wrap; }
}
</style>
