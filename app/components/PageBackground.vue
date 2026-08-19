<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { createPageBackground, type GeneratedStar } from '~/backgrounds/pageBackgrounds'

const background = createPageBackground()

const backgroundStyle = {
  '--page-grid-width': `${background.grid.width}px`,
  '--page-grid-height': `${background.grid.height}px`,
  '--page-grid-angle': `${background.grid.angle}deg`,
  '--page-grid-opacity': String(background.grid.opacity),
} as CSSProperties

// Every star is inlined into the SSR HTML of every page, so full float precision
// costs real bytes for sub-pixel differences nobody can see. Two decimals on
// lengths and three on ratios keeps the field identical and the markup half the size.
const round = (value: number, decimals = 2) => Number(value.toFixed(decimals))

function starStyle(star: GeneratedStar) {
  return {
    left: `${round(star.x)}%`,
    top: `${round(star.y)}%`,
    // Height comes from aspect-ratio, and both the fill and the glow read `color`.
    width: `${round(star.size)}px`,
    color: star.color,
    animationDuration: `${round(star.duration)}s`,
    animationDelay: `${round(star.delay)}s`,
    '--star-blur': `${round(star.blur)}px`,
    '--star-opacity-low': round(star.dimOpacity, 3),
    '--star-opacity-high': round(star.opacity, 3),
    '--star-drift-x': `${round(star.drift.x)}px`,
    '--star-drift-y': `${round(star.drift.y)}px`,
    '--star-start-x': `${round(star.startOffset.x)}px`,
    '--star-start-y': `${round(star.startOffset.y)}px`,
    '--star-scale-min': round(star.minScale, 3),
    '--star-scale-max': round(star.maxScale, 3),
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
  background: var(--black);
  transition: background-color $transition-fast $transition-ease;
  pointer-events: none;
}

.page-background__grid {
  position: absolute;
  inset: -32%;
  background-image:
    linear-gradient(var(--core) 1px, transparent 1px),
    linear-gradient(90deg, var(--core) 1px, transparent 1px);
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
  aspect-ratio: 1;
  border-radius: 50%;
  background: currentcolor;
  box-shadow: 0 0 var(--star-blur) currentcolor;
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
