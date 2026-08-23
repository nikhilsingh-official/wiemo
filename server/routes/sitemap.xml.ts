import { queryCollection } from '@nuxt/content/server'
import { SITE_URL } from '../../shared/site'

const STATIC_PATHS = [
  '/',
  '/about',
  '/gallery',
  '/timeline',
  '/total-impact',
  '/volunteer',
  '/collaborate',
  '/blog/reflections',
  '/blog/series',
] as const

export default defineEventHandler(async (event) => {
  const [reflections, seriesPosts] = await Promise.all([
    queryCollection(event, 'reflections')
      .where('draft', '=', false)
      .select('path')
      .all(),
    queryCollection(event, 'series')
      .where('draft', '=', false)
      .select('path', 'seriesSlug')
      .all(),
  ])

  const paths = new Set<string>(STATIC_PATHS)
  for (const reflection of reflections) paths.add(reflection.path)
  for (const post of seriesPosts) {
    paths.add(`/blog/series/${post.seriesSlug}`)
    paths.add(post.path)
  }

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const urls = [...paths]
    .sort()
    .map(path => `  <url><loc>${SITE_URL}${path}</loc></url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
