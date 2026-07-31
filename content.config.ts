import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
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
      }),
    }),
  },
})
