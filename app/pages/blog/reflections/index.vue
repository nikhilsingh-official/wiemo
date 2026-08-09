<script setup lang="ts">
import { COLOR_MODE_ATTRIBUTE } from '~~/shared/colorMode'
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.reflections],
})

const {
  data: queriedPosts,
  status: queriedPostsStatus,
  error: queriedPostsError,
} = await useAsyncData('reflection-posts', () =>
  queryCollection('reflections')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

const particleAccelerator = ref<HTMLCanvasElement | null>(null)
const reflectionJourney = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const cachedPosts = shallowRef<NonNullable<typeof queriedPosts.value>>([])

watchEffect(() => {
  if (queriedPosts.value?.length) {
    cachedPosts.value = queriedPosts.value
  }
})

const posts = computed(() => (
  cachedPosts.value.length ? cachedPosts.value : queriedPosts.value ?? []
))
const postCount = computed(() => posts.value?.length ?? 0)
const activePost = computed(() => posts.value?.[activeIndex.value])
const showEmptyState = computed(() => queriedPostsStatus.value === 'success' && postCount.value === 0)
const journeyStyle = computed<Record<string, string>>(() => ({
  '--reflection-steps': String(Math.max(postCount.value, 1)),
}))

const SVG_MIN = -520
const SVG_SIZE = 1040
const BEAM_RADIUS = 420
const VIEW_ZOOM = 1.7
const DEFAULT_PEAK_RATIO = 0.48
const SCROLL_ROTATION_PER_STEP = -Math.PI * 1.25
const PARTICLE_COORDINATE = { x: 0, y: -BEAM_RADIUS }
const TRAIL_MIN_ANGULAR_VELOCITY = 0.035
const TRAIL_MAX_ANGULAR_VELOCITY = 2.8
const TRAIL_MIN_LENGTH = 0.08
const TRAIL_MAX_LENGTH = 0.64
const TRAIL_MIN_STRENGTH = 0.025
const TRAIL_RISE_RESPONSE = 7.5
const TRAIL_DECAY_RESPONSE = 2.1
const ROTATION_FOLLOW_RESPONSE = 10.5
type TrailDirection = -1 | 1
type CanvasPalette = {
  beam: string
  compositeOperation: GlobalCompositeOperation
  core: string
  ink: string
}

let animationFrameId = 0
let scrollAnimationFrameId = 0
let resizeObserver: ResizeObserver | undefined
let themeObserver: MutationObserver | undefined
let currentRotation = 0
let targetRotation = 0
let displayedTrailStrength = 0
let displayedTrailDirection: TrailDirection = -1
let acceleratorPeakRatio = DEFAULT_PEAK_RATIO
let lastRenderTimestamp = 0
let canvasPalette: CanvasPalette = {
  beam: '51 180 236',
  compositeOperation: 'lighter',
  core: '189 232 251',
  ink: '255 255 255',
}

function resolveRgbChannels(value: string, fallback: string) {
  const hex = value.trim().match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)

  if (hex) {
    return hex
      .slice(1)
      .map(channel => Number.parseInt(channel, 16))
      .join(' ')
  }

  const rgb = value.trim().match(/^rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i)
  return rgb ? rgb.slice(1, 4).join(' ') : fallback
}

function syncCanvasPalette() {
  const root = document.documentElement
  const styles = getComputedStyle(root)

  canvasPalette = {
    beam: resolveRgbChannels(styles.getPropertyValue('--beam'), canvasPalette.beam),
    compositeOperation: root.getAttribute(COLOR_MODE_ATTRIBUTE) === 'light' ? 'source-over' : 'lighter',
    core: resolveRgbChannels(styles.getPropertyValue('--core'), canvasPalette.core),
    ink: resolveRgbChannels(styles.getPropertyValue('--ink'), canvasPalette.ink),
  }
}

function canvasColor(channels: string, alpha: number) {
  return `rgb(${channels} / ${Math.min(1, Math.max(0, alpha))})`
}

function syncCanvasResolution(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
  const width = Math.max(1, Math.round(rect.width * dpr))
  const height = Math.max(1, Math.round(rect.height * dpr))

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  return {
    dpr,
    width: rect.width,
    height: rect.height,
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, pulse: number) {
  const radius = Math.max(4.5, Math.min(9, scale * (4.55 + pulse * 0.72)))
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 5.8)
  const glowAlpha = 0.72 + pulse * 0.2

  glow.addColorStop(0, canvasColor(canvasPalette.ink, 0.95))
  glow.addColorStop(0.18, canvasColor(canvasPalette.core, glowAlpha))
  glow.addColorStop(0.45, canvasColor(canvasPalette.beam, 0.24 + pulse * 0.16))
  glow.addColorStop(1, canvasColor(canvasPalette.beam, 0))

  ctx.save()
  ctx.globalCompositeOperation = canvasPalette.compositeOperation
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(x, y, radius * 5.8, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = canvasColor(canvasPalette.ink, 1)
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = canvasColor(canvasPalette.core, 0.56 + pulse * 0.28)
  ctx.lineWidth = Math.max(1, scale * (0.75 + pulse * 0.22))
  ctx.beginPath()
  ctx.arc(x, y, radius * 1.65, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawParticleTrail(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  scale: number,
  trailStrength: number,
  trailDirection: TrailDirection,
  shimmer: number,
) {
  if (trailStrength < TRAIL_MIN_STRENGTH) {
    return
  }

  const particleAngle = -Math.PI / 2
  const velocityRatio = Math.min(1, trailStrength)
  const trailLength = TRAIL_MIN_LENGTH
    + (TRAIL_MAX_LENGTH - TRAIL_MIN_LENGTH) * Math.pow(velocityRatio, 0.72)
  const trailAlpha = Math.min(0.84, velocityRatio * 1.22)
  const radius = BEAM_RADIUS * scale
  const lineWidth = Math.max(2, Math.min(6.5, scale * (2.4 + velocityRatio * 1.05)))
  const shimmerAlpha = 0.9 + shimmer * 0.1
  const strokeTrailLayer = (length: number, endGap: number) => {
    ctx.beginPath()
    ctx.arc(
      originX,
      originY,
      radius,
      particleAngle + trailDirection * length,
      particleAngle + trailDirection * endGap,
      trailDirection > 0
    )
    ctx.stroke()
  }

  ctx.save()
  ctx.globalCompositeOperation = canvasPalette.compositeOperation
  ctx.lineCap = 'round'

  ctx.strokeStyle = canvasColor(canvasPalette.beam, 0.11 * trailAlpha * shimmerAlpha)
  ctx.lineWidth = lineWidth * 3.8
  strokeTrailLayer(trailLength, 0.04)

  ctx.strokeStyle = canvasColor(canvasPalette.beam, 0.28 * trailAlpha * shimmerAlpha)
  ctx.lineWidth = lineWidth * 1.75
  strokeTrailLayer(trailLength * 0.72, 0.025)

  ctx.strokeStyle = canvasColor(canvasPalette.core, 0.52 * trailAlpha * shimmerAlpha)
  ctx.lineWidth = lineWidth
  strokeTrailLayer(trailLength * 0.38, 0.01)

  ctx.restore()
}

function dampValue(current: number, target: number, response: number, deltaSeconds: number) {
  return current + (target - current) * (1 - Math.exp(-response * deltaSeconds))
}

function syncAcceleratorPeakRatio(canvas: HTMLCanvasElement) {
  const rawRatio = getComputedStyle(canvas).getPropertyValue('--accelerator-peak-ratio')
  const ratio = Number.parseFloat(rawRatio)

  if (Number.isFinite(ratio) && ratio > 0 && ratio < 1) {
    acceleratorPeakRatio = ratio
    return
  }

  acceleratorPeakRatio = DEFAULT_PEAK_RATIO
}

function updateScrollState() {
  const journey = reflectionJourney.value
  const count = postCount.value

  if (!journey || count === 0) {
    activeIndex.value = 0
    targetRotation = 0
    return
  }

  const rect = journey.getBoundingClientRect()
  const scrollableDistance = Math.max(1, rect.height - window.innerHeight)
  const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance))
  const lastIndex = Math.max(count - 1, 0)

  activeIndex.value = Math.min(lastIndex, Math.round(progress * lastIndex))
  targetRotation = progress * SCROLL_ROTATION_PER_STEP * Math.max(lastIndex, 1)
}

function queueScrollStateUpdate() {
  if (scrollAnimationFrameId) {
    return
  }

  scrollAnimationFrameId = requestAnimationFrame(() => {
    scrollAnimationFrameId = 0
    updateScrollState()
  })
}

onMounted(() => {
  const canvas = particleAccelerator.value
  const ctx = canvas?.getContext('2d')

  if (!canvas || !ctx) {
    return
  }

  const acceleratorImage = new Image()
  acceleratorImage.src = '/images/accelerator-ring.svg'

  syncCanvasPalette()
  themeObserver = new MutationObserver(syncCanvasPalette)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [COLOR_MODE_ATTRIBUTE],
  })

  const render = (timestamp = 0) => {
    updateScrollState()

    const { dpr, width, height } = syncCanvasResolution(canvas)
    const deltaSeconds = lastRenderTimestamp > 0
      ? Math.max(1 / 120, Math.min((timestamp - lastRenderTimestamp) / 1000, 0.1))
      : 1 / 60
    const seconds = timestamp / 1000
    const pulse = (Math.sin(seconds * 2.6) + 1) / 2
    const shimmer = (Math.sin(seconds * 0.72 + 0.8) + 1) / 2
    const scale = (Math.max(width, height) / SVG_SIZE) * VIEW_ZOOM
    const particleX = width / 2
    const particleY = height * acceleratorPeakRatio
    const originX = particleX - PARTICLE_COORDINATE.x * scale
    const originY = particleY - PARTICLE_COORDINATE.y * scale
    const rotationDelta = targetRotation - currentRotation
    const previousRotation = currentRotation

    currentRotation = dampValue(currentRotation, targetRotation, ROTATION_FOLLOW_RESPONSE, deltaSeconds)

    if (Math.abs(rotationDelta) < 0.0005) {
      currentRotation = targetRotation
    }

    const signedAngularVelocity = (currentRotation - previousRotation) / deltaSeconds
    const angularVelocity = Math.abs(signedAngularVelocity)

    if (angularVelocity >= TRAIL_MIN_ANGULAR_VELOCITY) {
      // The fixed particle appears to travel opposite the rotating track, so its
      // wake occupies the same angular side as the track's signed rotation.
      displayedTrailDirection = signedAngularVelocity < 0 ? -1 : 1
    }

    const targetTrailStrength = angularVelocity < TRAIL_MIN_ANGULAR_VELOCITY
      ? 0
      : Math.min(1, angularVelocity / TRAIL_MAX_ANGULAR_VELOCITY)
    const trailResponse = targetTrailStrength > displayedTrailStrength
      ? TRAIL_RISE_RESPONSE
      : TRAIL_DECAY_RESPONSE

    displayedTrailStrength = dampValue(
      displayedTrailStrength,
      targetTrailStrength,
      trailResponse,
      deltaSeconds
    )
    lastRenderTimestamp = timestamp

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    if (acceleratorImage.complete && acceleratorImage.naturalWidth > 0) {
      ctx.save()
      ctx.translate(originX, originY)
      ctx.rotate(currentRotation)
      ctx.drawImage(
        acceleratorImage,
        SVG_MIN * scale,
        SVG_MIN * scale,
        SVG_SIZE * scale,
        SVG_SIZE * scale
      )
      ctx.restore()
    }

    drawParticleTrail(
      ctx,
      originX,
      originY,
      scale,
      displayedTrailStrength,
      displayedTrailDirection,
      shimmer
    )
    drawParticle(ctx, particleX, particleY, scale, pulse)
    animationFrameId = requestAnimationFrame(render)
  }

  resizeObserver = new ResizeObserver(() => {
    syncCanvasResolution(canvas)
    syncAcceleratorPeakRatio(canvas)
    updateScrollState()
  })
  resizeObserver.observe(canvas)

  syncAcceleratorPeakRatio(canvas)
  updateScrollState()
  window.addEventListener('scroll', queueScrollStateUpdate, { passive: true })
  window.addEventListener('resize', queueScrollStateUpdate)

  animationFrameId = requestAnimationFrame(render)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  cancelAnimationFrame(scrollAnimationFrameId)
  resizeObserver?.disconnect()
  themeObserver?.disconnect()
  window.removeEventListener('scroll', queueScrollStateUpdate)
  window.removeEventListener('resize', queueScrollStateUpdate)
})
</script>

<template>
  <main class="content-section blog-page">
    <div class="wrap">
      <header class="blog-page__header">
        <h1>Reflections</h1>
        <p class="lede">
          Notes, ideas, and observations from the work behind WIEMO.
        </p>
      </header>

      <section
        v-if="posts?.length"
        ref="reflectionJourney"
        class="reflection-journey"
        :style="journeyStyle"
        aria-label="Reflection posts"
      >
        <div class="reflection-journey__sticky">
          <div
            class="particle-accelerator"
            aria-hidden="true"
          >
            <canvas
              ref="particleAccelerator"
              class="particle-accelerator__canvas"
              data-renderer="svg-coordinate-canvas"
            />
          </div>

          <span
            class="reflection-journey__particle-marker"
            aria-hidden="true"
          />

          <div
            v-if="activePost"
            class="reflection-journey__card-shell"
          >
            <BlogCard
              :key="`${activeIndex}-${activePost.path}`"
              :post="activePost"
            />
          </div>

          <div
            class="reflection-journey__steps"
            aria-hidden="true"
          >
            <span
              v-for="(_, index) in posts"
              :key="index"
              :class="{ 'is-active': index === activeIndex }"
            />
          </div>
        </div>
      </section>

      <p v-else-if="queriedPostsStatus === 'pending'">Loading reflections...</p>
      <p v-else-if="queriedPostsError">Unable to load reflections.</p>
      <p v-else-if="showEmptyState">No reflections found.</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.blog-page {
  min-height: 100vh;
  padding-block: 72px 84px;

  &__header {
    max-width: 720px;
    margin-bottom: 28px;
  }
}

.particle-accelerator {
  position: absolute;
  z-index: 0;
  inset: 0 auto 0 50%;
  width: min(124vw, 1360px);
  height: 100%;
  overflow: visible;
  transform: translateX(-50%);
  pointer-events: none;

  &__canvas {
    width: 100%;
    height: 100%;
  }
}

.reflection-journey {
  min-height: calc(var(--reflection-steps) * 100vh);

  &__sticky {
    --accelerator-card-gap: 94px;
    --accelerator-peak-ratio: 0.48;
    --accelerator-peak-y: 48%;

    position: sticky;
    top: 72px;
    min-height: calc(100svh - 84px);
    overflow: visible;
    isolation: isolate;
  }

  &__card-shell {
    position: absolute;
    z-index: 2;
    top: var(--accelerator-peak-y);
    left: 50%;
    width: min(360px, calc(100vw - 40px));
    transform: translate(-50%, calc(-100% - var(--accelerator-card-gap)));
  }

  &__particle-marker {
    position: absolute;
    z-index: 1;
    top: var(--accelerator-peak-y);
    left: 50%;
    width: 15px;
    aspect-ratio: 1;
    border: 1px solid color-mix(in srgb, var(--core) 82%, transparent);
    border-radius: 50%;
    background: #ffffff;
    box-shadow:
      0 0 14px color-mix(in srgb, var(--core) 92%, transparent),
      0 0 44px color-mix(in srgb, var(--beam) 72%, transparent),
      0 0 86px color-mix(in srgb, var(--beam) 36%, transparent);
    transform: translate(-50%, -50%);
    animation: accelerator-particle-pulse 2.4s ease-in-out infinite;
    pointer-events: none;

    &::after {
      position: absolute;
      inset: -16px;
      border: 1px solid color-mix(in srgb, var(--core) 38%, transparent);
      border-radius: 50%;
      animation: accelerator-particle-ring 2.4s ease-out infinite;
      content: '';
    }
  }

  &__card-shell :deep(.blog-card) {
    border-radius: 16px;
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--panel) 98%, transparent),
      color-mix(in srgb, var(--black) 99%, transparent)
    );
    box-shadow: 0 18px 54px rgb(0 0 0 / 32%);
  }

  &__card-shell :deep(.blog-card__media) {
    min-height: 136px;
  }

  &__card-shell :deep(.blog-card__body) {
    gap: 7px;
    padding: 18px;
  }

  &__card-shell :deep(.blog-card__meta) {
    gap: 8px 12px;
    font-size: 9px;
  }

  &__card-shell :deep(.blog-card h2) {
    max-width: none;
    font-size: 22px;
    line-height: 1.08;
  }

  &__card-shell :deep(.blog-card p) {
    line-height: 1.45;
  }

  &__card-shell :deep(.blog-card__subheading) {
    font-size: 13px;
  }

  &__steps {
    position: absolute;
    z-index: 3;
    right: 0;
    bottom: 28px;
    display: flex;
    gap: 8px;

    span {
      width: 26px;
      height: 2px;
      background: color-mix(in srgb, var(--core) 24%, transparent);
      transition: background 180ms ease, transform 180ms ease;
    }

    .is-active {
      background: var(--core);
      transform: scaleX(1.35);
    }
  }
}

@media (max-width: 1440px) {
  .blog-page {
    padding-top: 5vw;
  }
}

@media (max-width: 1400px) {
  .blog-page {
    padding-bottom: 6vw;
  }
}

@media (max-width: 1340px) {
  .reflection-journey__sticky {
    --accelerator-card-gap: 7vw;
  }
}

@media (max-width: 1200px) {
  .reflection-journey__card-shell :deep(.blog-card h2) {
    font-size: 1.8vw;
  }
}

@media (max-width: 1160px) {
  .blog-page__header {
    margin-bottom: 2.4vw;
  }
}

@media (max-width: 1000px) {
  .reflection-journey__card-shell :deep(.blog-card__body) {
    padding: 1.8vw;
  }
}

@media (max-width: 970px) {
  .reflection-journey__sticky {
    --accelerator-card-gap: 68px;
  }

  .reflection-journey__card-shell :deep(.blog-card__media) {
    min-height: 14vw;
  }
}

@media (max-width: 930px) {
  .reflection-journey__steps {
    bottom: 3vw;
  }
}

@media (max-width: 900px) {
  .reflection-journey__card-shell :deep(.blog-card h2) {
    font-size: 16px;
  }
}

@keyframes accelerator-particle-pulse {
  0%,
  100% {
    box-shadow:
      0 0 12px color-mix(in srgb, var(--core) 82%, transparent),
      0 0 34px color-mix(in srgb, var(--beam) 58%, transparent),
      0 0 68px color-mix(in srgb, var(--beam) 28%, transparent);
    transform: translate(-50%, -50%) scale(0.92);
  }

  48% {
    box-shadow:
      0 0 18px color-mix(in srgb, var(--core) 98%, transparent),
      0 0 52px color-mix(in srgb, var(--beam) 82%, transparent),
      0 0 98px color-mix(in srgb, var(--beam) 42%, transparent);
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes accelerator-particle-ring {
  0% {
    opacity: 0.65;
    transform: scale(0.45);
  }

  72%,
  100% {
    opacity: 0;
    transform: scale(1.28);
  }
}

@media (max-width: 760px) {
  .blog-page {
    padding-top: 28px;
  }

  .particle-accelerator {
    width: 132vw;
  }

  .reflection-journey__sticky {
    --accelerator-card-gap: 56px;
    --accelerator-peak-ratio: 0.52;
    --accelerator-peak-y: 52%;

    top: 72px;
    min-height: calc(100svh - 96px);
  }

  .reflection-journey__card-shell {
    width: min(310px, calc(100vw - 32px));
  }

  .reflection-journey__card-shell :deep(.blog-card__media) {
    min-height: 104px;
  }

  .reflection-journey__card-shell :deep(.blog-card__body) {
    padding: 13px;
  }

  .reflection-journey__steps {
    right: auto;
    bottom: 0;
    left: 0;
  }
}

@media (max-width: 660px) {
  .blog-page {
    padding-bottom: 40px;
  }
}

@media (max-width: 640px) {
  .blog-page {
    padding-top: 32px;
  }
}

@media (max-width: 500px) {
  .blog-page__header {
    margin-bottom: 12px;
  }
}

@media (max-width: 460px) {
  .reflection-journey__steps {
    bottom: 14px;
  }
}
</style>
