import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { ENERGY_TIER_IDS } from './shared/energyTiers'

const blogPostSchema = z.object({
  title: z.string(),
  subheading: z.string(),
  excerpt: z.string(),
  author: z.string().default('WIEMO'),
  date: z.date(),
  thumbnail: z.string().editor({ input: 'media' }),
  thumbnailAlt: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  imageCredit: z.string().optional(),
  imageSourceUrl: z.string().url().optional(),
})

export default defineContentConfig({
  collections: {
    reflections: defineCollection({
      type: 'page',
      source: 'blog/reflections/*.md',
      schema: blogPostSchema,
    }),
    series: defineCollection({
      type: 'page',
      source: 'blog/series/**/*.md',
      schema: blogPostSchema.extend({
        postExcerpt: z.string(),
        seriesTitle: z.string(),
        seriesSlug: z.string(),
        seriesPart: z.number().int().positive(),
        energyTier: z.enum(ENERGY_TIER_IDS),
        complexityRating: z.number().int().min(1).max(10),
      }),
    }),
  },
})
