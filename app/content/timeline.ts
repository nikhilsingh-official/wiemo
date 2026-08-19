export type TimelineMilestone = {
  /** Stable slug used for deep links (`/timeline?m=<id>`). */
  id: string
  dateLabel: string
  /** Machine-readable date for `<time datetime>`; month precision where the day is unrecorded. */
  dateTime: string
  kicker: string
  title: string
  description: string
  /** Headline figure for the milestone, shown as its readout. */
  stat: string
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'first-pilot',
    dateLabel: '12 Jul 2025',
    dateTime: '2025-07-12',
    kicker: 'Milestone 01',
    title: 'Where It Began',
    description: 'WIEMO’s first pilot session introduced 180 students at Kristu Jayanti CMI Public School to the fundamental question: What is everything made of?',
    stat: '180 students',
  },
  {
    id: 'bilingual-session',
    dateLabel: '22 Jul 2026',
    dateTime: '2026-07-22',
    kicker: 'Milestone 02',
    title: 'Our First Bilingual Session',
    description: 'At Makkala Jagriti, we brought particle physics to students in both Kannada and English, making unfamiliar ideas easier to explore and understand.',
    stat: 'Kannada + English',
  },
  {
    id: 'parikrma-partnership',
    dateLabel: '29 Jul 2026',
    dateTime: '2026-07-29',
    kicker: 'Milestone 03',
    title: 'Partnering with Parikrma',
    description: 'Our first session with Parikrma introduced Grade 9 students to the particles, questions and discoveries that shape our understanding of the universe.',
    stat: 'Grade 9',
  },
  {
    id: 'two-classrooms',
    dateLabel: '30 Jul 2026',
    dateTime: '2026-07-30',
    kicker: 'Milestone 04',
    title: 'Two Classrooms, One Day',
    description: 'We conducted sessions for 66 students across Grades 8 and 10, adapting the programme to suit different ages and levels of understanding.',
    stat: '66 students',
  },
  {
    id: 'younger-learners',
    dateLabel: '5 Aug 2026',
    dateTime: '2026-08-05',
    kicker: 'Milestone 05',
    title: 'Reaching Younger Learners',
    description: 'WIEMO continued its work with Parikrma by bringing an interactive introduction to particle physics to 30 Grade 7 students.',
    stat: '30 students',
  },
  {
    id: 'first-350',
    dateLabel: 'Aug 2026',
    dateTime: '2026-08',
    kicker: 'Milestone 06',
    title: 'Over 350 Students Reached',
    description: 'With our latest session, WIEMO crossed its first major milestone, reaching 351 students across seven sessions.',
    stat: '351 students',
  },
]

/** Inclusive range covered by the milestones, for the page summary. */
export const TIMELINE_SPAN = {
  from: TIMELINE_MILESTONES[0]!.dateLabel,
  to: TIMELINE_MILESTONES[TIMELINE_MILESTONES.length - 1]!.dateLabel,
} as const
