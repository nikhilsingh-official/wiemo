/** Primary navigation labels and routes. */
export const NAVBAR_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Blog', to: '/blog/reflections' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Volunteer', to: '/volunteer' },
  { label: 'Collaborate', to: '/collaborate' },
  { label: 'Total Impact', to: '/total-impact' },
] as const

/** Primary blog category pages. */
export const NAVBAR_BLOG_CATEGORIES = [
  { title: 'Reflections', to: '/blog/reflections' },
] as const
