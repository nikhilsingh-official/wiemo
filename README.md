# What Is Everything Made Of — particle morph scaffold

A Nuxt 4 + Vue 3 + Three.js foundation for morphing a fixed particle budget between procedural shapes or mesh surfaces loaded from GLTF/GLB files.

The hero opens with a directly generated spiral-galaxy particle field, followed
by five GLTF-backed stages that move from Earth toward a particle collision. The
self-contained models live in `public/models`; source and license details are
recorded in `public/models/ATTRIBUTION.md`.

See [Particle morph system](docs/particle-system.md) for the complete architecture, data flow, GPU behavior, timing events, and extension guide.

## Architecture

- `ParticleCanvas.client.vue` owns only the client-side Vue lifecycle and component props.
- `ParticleExperience.ts` owns the scene, renderer, resize loop, asset sequencing, and public API.
- `GltfParticleLoader.ts` loads GLTFs, samples their triangle surfaces, preserves small meshes with a fixed allocation floor, and normalizes the result to the fixed particle budget.
- `GpuParticleMorph.ts` owns the point geometry and shader material. Start and target positions are vertex attributes; the per-frame morph and travel arc happen in the vertex shader. The CPU updates only time/progress uniforms.
- `createShapes.ts` provides zero-asset demo shapes and examples of the `ParticleShape` contract.

## Run it

```bash
pnpm install
pnpm dev
```

The website hero cycles through one procedural opening shape and five bundled
models. Without an `openingShape` prop, an empty `modelUrls` array makes the
canvas fall back to its three demo shapes. Centralize the canvas configuration
in the parent so sibling UI can use the same values:

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { defineParticleOptions } from './three/particleOptions'
import { createSphereShape } from './three/particles/createShapes'
import type { MorphEvent } from './three/types'

const particleCount = 24_000
const openingShape = createSphereShape(particleCount)
const options = reactive(defineParticleOptions({
  modelUrls: ['/models/head.glb', '/models/hand.glb'],
  particleCount,
  morphDuration: 2.4,
  particleColor: '#65d8ff',
}))
const morph = ref<MorphEvent>()
</script>

<ParticleCanvas
  :opening-shape="openingShape"
  :options="options"
  @morph-start="onMorphStart"
  @morph-progress="morph = $event"
  @morph-complete="onMorphComplete"
/>
```

When supplied, `openingShape` is displayed before the first render and prepended
to any GLTF shapes loaded through `modelUrls`. Its position count must match
`options.particleCount`.

`morph-progress` fires every animation frame with `from`, `to`, `elapsed`, `duration`, `progress`, and `easedProgress`. Use linear `progress` for clocks and `easedProgress` when another visual should follow the particle easing exactly. Options are reactive: visual, timing, camera, and renderer-limit changes update the running experience; structural renderer or particle-count changes rebuild it.

The complete defaults live in `particleOptions.ts`. `defineParticleOptions()` accepts partial nested overrides for:

- sequence: model URLs, particle count, autoplay, morph duration, and hold duration;
- appearance: point size, particle/background colors, drift strength, and rotation speed;
- camera: field of view, near/far clipping, and distance;
- renderer: alpha, antialiasing, maximum pixel ratio, and power preference;
- GLTF normalization: centering and model size.

All shapes in a morph sequence must use the same particle count. The GLTF loader enforces this by distributing that budget across model surfaces and sampling triangle interiors. For custom data, construct a `ParticleShape` with a `Float32Array` containing `particleCount * 3` XYZ values, then call `ParticleExperience.morphTo(shape)`.

## Asset locations

- `public/models` contains GLB files loaded at runtime by stable `/models/...` URLs.
- `public/fonts` contains font files loaded by stable `/fonts/...` URLs from the global stylesheet. Keep each font's license alongside its files.
- `app/assets` is reserved for assets imported from JavaScript, Vue, or SCSS that should be fingerprinted and managed by Nuxt's Vite build. It currently contains the global SCSS and its placement guide.

Files in `public` are copied to the build unchanged. Files in `app/assets` become part of Vite's dependency graph and may be renamed or optimized.

## Extension seams

- Configure `DRACOLoader` or `KTX2Loader` inside `GltfParticleLoader` for compressed assets.
- Add color/size attributes beside `aTargetPosition` for per-shape styling.
- Tune the per-mesh minimum and square-root area weighting for a different balance between physical surface density and silhouette legibility.
- Connect scroll, pointer, or route state to `ParticleExperience.morphTo` and disable `autoPlay`.
