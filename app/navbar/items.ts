/** Primary navigation labels and routes. */
export const NAVBAR_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Blog', to: '/blog/reflections' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Total Impact', to: '/total-impact' },
] as const

/** Primary blog category pages. */
export const NAVBAR_BLOG_CATEGORIES = [
  { title: 'Reflections', to: '/blog/reflections' },
  { title: 'Series', to: '/blog/series' },
] as const

/** Blog posts exposed from the primary Blog navigation dropdown. */
export const NAVBAR_BLOG_POSTS = [
  {
    title: 'Building a Repeatable Session',
    to: '/blog/series/repeatable-sessions/2026-07-24-building-a-repeatable-session',
    date: '2026-07-24',
  },
  {
    title: 'Making Invisible Patterns Visible',
    to: '/blog/reflections/2026-07-21-making-invisible-patterns-visible',
    date: '2026-07-21',
  },
  {
    title: 'From Curiosity to First Experiments',
    to: '/blog/reflections/2026-07-18-curiosity-to-first-experiments',
    date: '2026-07-18',
  },
] as const
