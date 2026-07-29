# High-detail Earth source decision

Research date: 2026-07-29

## Decision

Do not replace the current Earth with an off-the-shelf textured globe. Generate
the production GLB from a high-resolution mathematical sphere, and use
[Natural Earth 1:10m land polygons](https://www.naturalearthdata.com/downloads/10m-physical-vectors/)
to partition its triangles into non-overlapping ocean and land meshes.

This is the cleanest legally redistributable source for this renderer because
the shape loader samples triangle positions and a numeric per-mesh brightness;
it does not read material colors, UVs, images, normal maps, or vertex colors.
Consequently, a conventional globe whose continents exist only in a diffuse
texture becomes an unmarked sphere in the hero. See the local implementation in
[`GltfParticleLoader.ts`](../app/three/assets/GltfParticleLoader.ts).

Natural Earth's official page describes the 1:10m land layer as land polygons
including major islands. The current official release is listed as version
5.1.1 and a 3.12 MB Shapefile download. Its
[terms of use](https://www.naturalearthdata.com/about/terms-of-use/) place every
version of its raster and vector map data in the public domain and expressly
allow modification, electronic distribution, and commercial use without
permission or required credit. The project's
[official source repository](https://github.com/nvkelso/natural-earth-vector)
also supplies a generated GeoJSON form suitable for an offline Node build step.

## What was checked

| Candidate | Published detail and rights | Geometry inspection | Fit for this particle renderer |
| --- | --- | --- | --- |
| [NASA Earth GLB](https://science.nasa.gov/resource/earth-3d-model/) | NASA publishes a 12.32 MB glTF asset and credits NASA VTAD. NASA's [media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) say polygon data and texture maps used for 3D models are generally not subject to US copyright, allow factual educational/informational web use, require NASA acknowledgement, and prohibit implied endorsement. | The downloaded GLB contains one mesh with 1,778 positions and 9,216 indices: 3,072 triangles. It has one material whose base color is an embedded texture, plus embedded diffuse and normal images. There is no separate continent mesh. | Reject as the production source. It is a modestly subdivided textured sphere, not a geometry-defined high-detail Earth. The loader discards exactly the data that identifies the continents. |
| [Sketchfab “Earth” by tamminen](https://sketchfab.com/3d-models/earth-3874805f5acc48b8a46d57495de53358) | The author listing reports 283.7k vertices, 567.3k triangles, 8.8k downloads, and a Creative Commons Attribution license. Its description says the textures come from NASA archives. | The public listing does not say that land is separate geometry, and the downloadable archive was not available for an unauthenticated file-level inspection. | Do not adopt without an asset inspection. The triangle count is high, but the only documented continent source is texture data. It may spend hundreds of thousands of triangles on a sphere while still losing land in this loader, and it adds an attribution obligation. |
| [Pixabay “World, Earth, Planet”](https://pixabay.com/3d-models/world-earth-planet-space-nasa-4045/) | The listing reports a GLB with 8,737 vertices, textures, and use under the Pixabay Content License. Its author says the texture is NASA Blue Marble imagery. | The listing identifies texture, rather than separate land geometry, as the geographic detail. | Reject. It is neither a meaningful high-poly upgrade nor known to retain continents after materials are ignored. |
| [Natural Earth 1:10m land](https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-land/) | Official public-domain land polygons derived from the 1:10m coastline; major islands are included. The official [direct download](https://naciscdn.org/naturalearth/10m/physical/ne_10m_land.zip) is a 3.12 MB Shapefile archive. | The official repository's `ne_10m_land.geojson` was measured locally at 10,157,965 bytes, 6,837 polygons, 6,838 rings, and 446,175 longitude/latitude coordinate pairs. | Select. It provides geometry-defined coastline classification, is legally clean to transform and redistribute, and lets the project choose sphere tessellation independently of cartographic detail. |

The GLB and GeoJSON counts above are local measurements of the downloaded
files, not file-size estimates. The NASA index count was divided by three because
its sole primitive uses glTF triangle mode.

## Recommended production asset

Generate `EarthContinents.glb` as follows:

1. Build a smooth UV sphere at roughly 256 longitude segments by 128 latitude
   segments (about 65,000 triangles). That is genuinely high-detail relative to
   the current 1,365-triangle output while remaining close to the hero's 48,000
   final particle samples.
2. Classify each sphere triangle against the Natural Earth land polygons and
   place it in exactly one of two meshes: `earth-ocean` or `earth-land`.
   Partitioning is important: duplicated or slightly offset continent shells
   recreate the overlap hotspots already seen at joints in other models.
3. Keep both meshes on the same exact mathematical radius. Geographic data
   should decide category, not deform the globe; a smooth silhouette should not
   depend on coastline topology.
4. Give ocean and land modest brightness values in the same shared blue palette
   (for example, approximately 0.8–0.9 and 1.05–1.2). Do not repeat the current
   0.2 versus 3.0 contrast, which makes the oceans look empty and pushes land
   outside the other stages' color range.
5. Preprocess the 1:10m polygons once during asset generation. The production
   page should load only the derived GLB, not parse the 10 MB GeoJSON at runtime.
6. Add coherent view-depth or surface-normal shading in the particle material.
   Higher sphere tessellation removes faceting, but geometry alone cannot create
   the near/far depth cue the current shader lacks.

At 48,000 output points, the particle budget—not the 446,000-point coastline
source—sets the visible geographic resolution. Natural Earth 1:10m is still the
right authoritative master because it preserves recognizable coastlines and
major islands before the generator performs a controlled reduction.

## Implemented visual result

The production generator uses a 192 × 96 sphere (36,480 triangles) and the hero
uses 72,000 particles. A visual test showed that the initially proposed 256 ×
128 sphere left some of its 65,024 triangles unsampled at the old 48,000-particle
budget, producing latitude-band gaps. The chosen combination is still about 27×
the triangle count of the previous Earth while letting every sphere triangle
contribute surface samples. Equal-area latitude rings prevent polar sampling
hotspots. Land receives controlled allocation density rather than a duplicate
shell, and 0.62 versus 1.18 brightness keeps the ocean visible
while making Africa and Eurasia readable in the shared blue palette.

## Redistribution note

The recommended derived asset needs no permission or mandatory attribution
because its geographic source is public-domain Natural Earth data. A voluntary
“Made with Natural Earth” credit follows the project's suggested citation. If
the NASA GLB or any of its images are retained in the repository instead of used
only as a comparison reference, credit NASA as the source and follow NASA's
media and endorsement restrictions.
