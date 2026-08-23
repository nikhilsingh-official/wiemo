<script setup lang="ts">
// PROTOTYPE: two inner-page hero treatments, switchable via `?variant=`.
const VARIANTS = [
  { key: 'hero', label: 'Hero visible' },
  { key: 'no-hero', label: 'No inner hero' },
] as const

type VariantKey = typeof VARIANTS[number]['key']

const route = useRoute()
const router = useRouter()

const currentKey = computed<VariantKey>(() => (
  route.query.variant === 'no-hero' ? 'no-hero' : 'hero'
))
const currentIndex = computed(() => VARIANTS.findIndex(variant => variant.key === currentKey.value))
const currentVariant = computed(() => VARIANTS[currentIndex.value] ?? VARIANTS[0])

function selectVariant(key: VariantKey) {
  void router.replace({
    query: {
      ...route.query,
      variant: key,
    },
  })
}

function cycleVariant(direction: -1 | 1) {
  const nextIndex = (currentIndex.value + direction + VARIANTS.length) % VARIANTS.length
  selectVariant(VARIANTS[nextIndex]?.key ?? 'hero')
}

function handleKeyboard(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

  const target = event.target
  if (target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')) return

  event.preventDefault()
  cycleVariant(event.key === 'ArrowLeft' ? -1 : 1)
}

onMounted(() => window.addEventListener('keydown', handleKeyboard))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyboard))
</script>

<template>
  <aside class="hero-prototype" aria-label="Inner-page hero prototype switcher">
    <span class="hero-prototype__eyebrow">Prototype</span>
    <button type="button" aria-label="Show previous hero variant" @click="cycleVariant(-1)">←</button>
    <p aria-live="polite">
      <strong>{{ currentKey === 'hero' ? 'A' : 'B' }}</strong>
      <span>{{ currentVariant.label }}</span>
    </p>
    <button type="button" aria-label="Show next hero variant" @click="cycleVariant(1)">→</button>
  </aside>
</template>

<style scoped lang="scss">
.hero-prototype {
  position: fixed;
  right: 50%;
  bottom: 22px;
  z-index: 1000;
  display: flex;
  min-height: 52px;
  align-items: center;
  gap: 8px;
  padding: 7px;
  border: 1px solid rgb(101 216 255 / 42%);
  border-radius: 18px;
  color: #ecf8ff;
  background: rgb(3 11 19 / 94%);
  box-shadow: 0 18px 50px rgb(0 0 0 / 55%);
  font-family: $font-mono;
  transform: translateX(50%);
  backdrop-filter: blur(18px);
}

.hero-prototype__eyebrow {
  padding-inline: 10px 4px;
  color: #65d8ff;
  font-size: 9px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.hero-prototype button {
  display: grid;
  width: 38px;
  height: 38px;
  border: 1px solid rgb(101 216 255 / 22%);
  border-radius: 12px;
  color: #65d8ff;
  background: rgb(101 216 255 / 7%);
  cursor: pointer;
  place-items: center;

  &:hover,
  &:focus-visible {
    border-color: #65d8ff;
    background: rgb(101 216 255 / 14%);
  }
}

.hero-prototype p {
  display: flex;
  min-width: 154px;
  gap: 9px;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 11px;
  white-space: nowrap;
}

.hero-prototype strong { color: #65d8ff; }

@media (max-width: 520px) {
  .hero-prototype {
    bottom: 12px;
    max-width: calc(100% - 20px);
  }

  .hero-prototype__eyebrow { display: none; }
  .hero-prototype p { min-width: 138px; }
}
</style>
