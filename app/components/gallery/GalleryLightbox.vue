<script setup lang="ts">
import type { GalleryFrame } from '~/content/gallery'
import { formatFrameId } from '~/content/gallery'

defineOptions({ name: 'GalleryLightbox' })

const props = defineProps<{
  frame: GalleryFrame | null
  currentIndex: number
  total: number
}>()

const emit = defineEmits<{
  close: []
  previous: []
  next: []
}>()

const closeButton = ref<HTMLButtonElement | null>(null)
let previousBodyOverflow = ''

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.frame) return

  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
  else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    emit('previous')
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    emit('next')
  }
}

watch(() => props.frame, async (frame) => {
  if (!import.meta.client) return

  if (frame) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    closeButton.value?.focus()
  }
  else {
    document.body.style.overflow = previousBodyOverflow
  }
})

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="frame"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`Frame ${formatFrameId(frame.id)}: ${frame.alt}`"
        @mousedown.self="emit('close')"
      >
        <header class="lightbox__readout">
          <p>
            <span>{{ String(currentIndex + 1).padStart(3, '0') }}</span>
            <span class="lightbox__divider">/</span>
            <span>{{ String(total).padStart(3, '0') }}</span>
          </p>
          <p class="lightbox__session">{{ frame.sessionName }}</p>
          <p>
            <time v-if="frame.dateTime" :datetime="frame.dateTime">{{ frame.dateLabel }}</time>
            <span v-else>{{ frame.dateLabel }}</span>
          </p>
        </header>

        <button
          ref="closeButton"
          class="lightbox__close"
          type="button"
          aria-label="Close image"
          @click="emit('close')"
        >
          <span>Close</span>
          <span aria-hidden="true">×</span>
        </button>

        <button
          class="lightbox__arrow lightbox__arrow--previous"
          type="button"
          aria-label="Previous frame"
          @click="emit('previous')"
        >
          <span aria-hidden="true">←</span>
          <span>Prev</span>
        </button>

        <div class="lightbox__stage">
          <span class="lightbox__bracket lightbox__bracket--tl" aria-hidden="true" />
          <span class="lightbox__bracket lightbox__bracket--tr" aria-hidden="true" />
          <span class="lightbox__bracket lightbox__bracket--bl" aria-hidden="true" />
          <span class="lightbox__bracket lightbox__bracket--br" aria-hidden="true" />
          <img
            :key="frame.id"
            class="lightbox__image"
            :src="frame.src"
            :alt="frame.alt"
          >
        </div>

        <button
          class="lightbox__arrow lightbox__arrow--next"
          type="button"
          aria-label="Next frame"
          @click="emit('next')"
        >
          <span>Next</span>
          <span aria-hidden="true">→</span>
        </button>

        <footer class="lightbox__footer">
          <p>{{ frame.alt }}</p>
          <p>Arrow keys to navigate <span aria-hidden="true">·</span> Esc to close</p>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  grid-template: auto 1fr auto / minmax(80px, 1fr) minmax(0, 1120px) minmax(80px, 1fr);
  gap: 18px 28px;
  padding: 28px 34px 24px;
  color: #e7edf3;
  background:
    linear-gradient(rgb(0 0 0 / 94%), rgb(0 0 0 / 97%)),
    repeating-linear-gradient(90deg, transparent 0 63px, rgb(51 180 236 / 7%) 64px),
    repeating-linear-gradient(0deg, transparent 0 63px, rgb(51 180 236 / 7%) 64px);
  backdrop-filter: blur(18px);
}

.lightbox__readout {
  grid-column: 1 / 4;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid rgb(51 180 236 / 22%);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1.6px;
  line-height: 1.4;
  text-transform: uppercase;

  p {
    color: rgb(231 237 243 / 58%);
  }

  p:last-child {
    padding-right: 96px;
    text-align: right;
  }
}

.lightbox__divider {
  padding-inline: 8px;
  color: #33b4ec;
}

.lightbox__session {
  color: #bde8fb !important;
}

.lightbox__close {
  position: absolute;
  top: 25px;
  right: 30px;
  display: flex;
  gap: 12px;
  align-items: center;
  color: rgb(231 237 243 / 76%);
  background: transparent;
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  cursor: pointer;
}

.lightbox__close span:last-child {
  font-family: $font-body;
  font-size: 22px;
  line-height: 1;
}

.lightbox__stage {
  position: relative;
  grid-column: 2;
  display: grid;
  min-height: 0;
  place-items: center;
  padding: 18px;
}

.lightbox__image {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: calc(100vh - 190px);
  object-fit: contain;
  box-shadow: 0 28px 80px rgb(0 0 0 / 54%);
  animation: frame-in 220ms ease both;
}

.lightbox__bracket {
  position: absolute;
  width: 42px;
  height: 42px;
  border-color: #33b4ec;
  opacity: 0.86;
}

.lightbox__bracket--tl { top: 0; left: 0; border-top: 1px solid #33b4ec; border-left: 1px solid #33b4ec; }
.lightbox__bracket--tr { top: 0; right: 0; border-top: 1px solid #33b4ec; border-right: 1px solid #33b4ec; }
.lightbox__bracket--bl { bottom: 0; left: 0; border-bottom: 1px solid #33b4ec; border-left: 1px solid #33b4ec; }
.lightbox__bracket--br { right: 0; bottom: 0; border-right: 1px solid #33b4ec; border-bottom: 1px solid #33b4ec; }

.lightbox__arrow {
  align-self: center;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px;
  color: rgb(231 237 243 / 68%);
  background: transparent;
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color $transition-fast $transition-ease;
}

.lightbox__arrow:hover {
  color: #33b4ec;
}

.lightbox__arrow--previous {
  grid-column: 1;
  justify-self: end;
}

.lightbox__arrow--next {
  grid-column: 3;
  justify-self: start;
}

.lightbox__footer {
  grid-column: 1 / 4;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-top: 14px;
  border-top: 1px solid rgb(51 180 236 / 22%);

  p {
    color: rgb(231 237 243 / 52%);
    font-family: $font-mono;
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

.lightbox-enter-active,
.lightbox-leave-active { transition: opacity 180ms ease; }
.lightbox-enter-from,
.lightbox-leave-to { opacity: 0; }

@keyframes frame-in {
  from { opacity: 0; transform: scale(0.985); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 760px) {
  .lightbox {
    grid-template: auto 1fr auto auto / 1fr 1fr;
    gap: 14px;
    padding: 18px;
  }

  .lightbox__readout {
    grid-column: 1 / 3;
    grid-template-columns: 1fr 1fr;
  }

  .lightbox__session { display: none; }

  .lightbox__readout p:last-child { padding-right: 30px; }

  .lightbox__close {
    top: 16px;
    right: 18px;

    span:first-child { display: none; }
  }

  .lightbox__stage {
    grid-column: 1 / 3;
    grid-row: 2;
    padding: 12px;
  }

  .lightbox__image { max-height: calc(100vh - 230px); }

  .lightbox__arrow {
    grid-row: 3;
    justify-self: stretch;
    justify-content: center;
    border: 1px solid rgb(51 180 236 / 18%);
  }

  .lightbox__arrow--previous { grid-column: 1; }
  .lightbox__arrow--next { grid-column: 2; }

  .lightbox__footer {
    grid-column: 1 / 3;
    grid-row: 4;

    p:last-child { display: none; }
  }
}
</style>
