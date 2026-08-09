<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { createPageBackground, type GeneratedStar } from '~/backgrounds/pageBackgrounds'

const background = createPageBackground()

const backgroundStyle = {
  '--page-background-base': background.baseColor,
  '--page-grid-width': `${background.grid.width}px`,
  '--page-grid-height': `${background.grid.height}px`,
  '--page-grid-angle': `${background.grid.angle}deg`,
  '--page-grid-opacity': String(background.grid.opacity),
} as CSSProperties

function starStyle(star: GeneratedStar) {
  return {
    left: `${star.x}%`,
    top: `${star.y}%`,
    width: `${star.size}px`,
    height: `${star.size}px`,
    backgroundColor: star.color,
    boxShadow: `0 0 ${star.blur}px ${star.color}`,
    animationDuration: `${star.duration}s`,
    animationDelay: `${star.delay}s`,
    '--star-opacity-low': star.dimOpacity,
    '--star-opacity-high': star.opacity,
    '--star-drift-x': `${star.drift.x}px`,
    '--star-drift-y': `${star.drift.y}px`,
    '--star-start-x': `${star.startOffset.x}px`,
    '--star-start-y': `${star.startOffset.y}px`,
    '--star-scale-min': star.minScale,
    '--star-scale-max': star.maxScale,
  } as CSSProperties
}

function glowStyle(glow: typeof background.glows[number]) {
  return {
    left: `${glow.x}%`,
    top: `${glow.y}%`,
    width: `${glow.size}vw`,
    height: `${glow.size}vw`,
    opacity: glow.opacity,
    background: `radial-gradient(circle, ${glow.color}, transparent 68%)`,
  }
}
</script>

<template>
  <div
    class="page-background"
    :data-background="background.name"
    :style="backgroundStyle"
    aria-hidden="true"
  >
    <div class="page-background__grid" />
    <span
      v-for="(glow, index) in background.glows"
      :key="`glow-${index}`"
      class="page-background__glow"
      :style="glowStyle(glow)"
    />
    <i
      v-for="star in background.starsGenerated"
      :key="star.id"
      class="page-background__star"
      :style="starStyle(star)"
    />
  </div>
</template>

<style scoped lang="scss">
.page-background {
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  background: var(--page-background-base);
  pointer-events: none;
}

.page-background__grid {
  position: absolute;
  inset: -32%;
  background-image:
    linear-gradient(rgb(189 232 251 / 100%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(189 232 251 / 100%) 1px, transparent 1px);
  background-size: var(--page-grid-width) var(--page-grid-height);
  opacity: var(--page-grid-opacity);
  transform: rotate(var(--page-grid-angle));
  mask-image: linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%);
}

.page-background__glow {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(10px);
}

.page-background__star {
  position: absolute;
  border-radius: 50%;
  opacity: var(--star-opacity-low);
  animation: page-star-drift ease-in-out infinite alternate;
  will-change: transform, opacity;
}

@keyframes page-star-drift {
  from {
    opacity: var(--star-opacity-low);
    transform: translate3d(var(--star-start-x), var(--star-start-y), 0) scale(var(--star-scale-min));
  }

  to {
    opacity: var(--star-opacity-high);
    transform: translate3d(var(--star-drift-x), var(--star-drift-y), 0) scale(var(--star-scale-max));
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-background__star {
    opacity: var(--star-opacity-high);
    animation: none;
  }
}
</style>
