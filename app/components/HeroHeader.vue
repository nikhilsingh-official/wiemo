<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { defineTextOptions } from '~/hero/text-typing/textOptions'
import type { TextOptionsInput } from '~/hero/text-typing/types'

const props = withDefaults(
  defineProps<{
    text: string
    textoptions?: TextOptionsInput
  }>(),
  {
    textoptions: () => ({}),
  },
)

const options = computed(() => defineTextOptions(props.textoptions))
const displayedText = ref('')
const announcedText = ref('')
const prefersReducedMotion = ref(false)

const cursorStyle = computed(() => ({
  animationDuration: `${options.value.cursorBlinkDuration}ms`,
}))

let typingTimer: ReturnType<typeof setTimeout> | undefined
let reducedMotionQuery: MediaQueryList | undefined
let isMounted = false

function finishImmediately(target: string) {
  if (typingTimer) clearTimeout(typingTimer)
  typingTimer = undefined
  displayedText.value = target
  announcedText.value = target
}

function animateTo(target: string) {
  const current = displayedText.value
  if (current === target) {
    announcedText.value = target
    typingTimer = undefined
    return
  }

  const isDeleting = current.length > 0 && !target.startsWith(current)
  if (isDeleting) {
    displayedText.value = current.slice(0, -1)
  } else {
    displayedText.value = target.slice(0, current.length + 1)
  }

  if (displayedText.value === target) {
    announcedText.value = target
    typingTimer = undefined
    return
  }

  const delay = isDeleting ? options.value.deletingDelay : options.value.typingDelay
  typingTimer = setTimeout(() => animateTo(target), delay)
}

watch(() => props.text, (nextText) => {
  if (!isMounted) return
  if (typingTimer) clearTimeout(typingTimer)
  if (prefersReducedMotion.value) {
    finishImmediately(nextText)
    return
  }
  animateTo(nextText)
})

function handleReducedMotionChange(event: MediaQueryListEvent) {
  prefersReducedMotion.value = event.matches
  if (event.matches) finishImmediately(props.text)
}

onMounted(() => {
  isMounted = true
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = reducedMotionQuery.matches
  if (reducedMotionQuery.matches) finishImmediately(props.text)
  else animateTo(props.text)
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
})

onBeforeUnmount(() => {
  isMounted = false
  if (typingTimer) clearTimeout(typingTimer)
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
})
</script>

<template>
  <div class="hero-header">
    <h1 class="hero-header__heading">
      <span aria-hidden="true">
        <span class="anchor-text">Particles are</span>
        <span class="change-text">
          {{ displayedText }}
          <span class="hero-header__cursor" :style="cursorStyle">|</span>
        </span>
      </span>
      <span
        class="hero-header__announcement"
        aria-live="polite"
      >Particles are {{ announcedText }}</span>
    </h1>
  </div>
</template>

<style scoped lang="scss">
.hero-header__heading {
  margin: 0;
  max-width: min(12ch, 72vw);
  line-height: 0.98;
}

.anchor-text {
  display: block;
  font-family: $font-display;
  font-size: clamp(3rem, 5vw, 5.6rem);
  font-weight: 700;
  line-height: 0.98;
  color: white;
}

.change-text {
  display: block;
  min-height: 1.06em;
  margin-top: 0.04em;
  font-family: $font-display;
  font-size: clamp(3rem, 5vw, 5.6rem);
  font-weight: 700;
  line-height: 1.02;
  color: $atlas;
  overflow-wrap: anywhere;
}

.hero-header__cursor {
  display: inline-block;
  margin-left: 0.08em;
  font-weight: 400;
  animation: cursor-blink 760ms steps(1, end) infinite;
}

.hero-header__announcement {
  @include visually-hidden;
}

@keyframes cursor-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@include reduced-motion {
  .hero-header__cursor {
    opacity: 1;
    animation: none;
  }
}

@media (max-width: $breakpoint-small) {
  .hero-header__heading {
    max-width: min(11ch, 82vw);
  }

  .anchor-text,
  .change-text {
    font-size: clamp(2.6rem, 12vw, 4rem);
  }
}
</style>
