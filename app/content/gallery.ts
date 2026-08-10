export type GalleryFrame = {
  id: number
  sessionId: string
  sessionName: string
  dateLabel: string
  dateTime?: string
  src: string
  alt: string
  width: number
  height: number
}

export type GallerySession = {
  id: string
  index: number
  name: string
  partner: string
  dateLabel: string
  dateTime?: string
  location: string
  frames: GalleryFrame[]
}

const frame = (
  id: number,
  session: Pick<GallerySession, 'id' | 'name' | 'dateLabel' | 'dateTime'>,
  image: Pick<GalleryFrame, 'src' | 'alt' | 'width' | 'height'>,
): GalleryFrame => ({
  id,
  sessionId: session.id,
  sessionName: session.name,
  dateLabel: session.dateLabel,
  dateTime: session.dateTime,
  ...image,
})

const parikrma = {
  id: 'parikrma',
  name: 'Parikrma session',
  dateLabel: 'Date unrecorded',
} as const

const makkala = {
  id: 'makkala-jagriti',
  name: 'Makkala Jagriti session',
  dateLabel: '22 Jul 2026',
  dateTime: '2026-07-22',
} as const

const kristu = {
  id: 'kristu-jayanti',
  name: 'Kristu Jayanti session',
  dateLabel: '12 Jul 2025',
  dateTime: '2025-07-12',
} as const

export const GALLERY_SESSIONS: GallerySession[] = [
  {
    ...kristu,
    index: 1,
    partner: 'Kristu Jayanti CMI Public School',
    location: 'Bengaluru',
    frames: [
      frame(1, kristu, {
        src: '/images/gallery/kristu-011.jpg',
        alt: 'A student facilitator receiving a commemorative plaque',
        width: 2048,
        height: 1152,
      }),
      frame(2, kristu, {
        src: '/images/gallery/kristu-012.jpg',
        alt: 'A student facilitator seated with school leaders during a presentation',
        width: 2048,
        height: 1152,
      }),
    ],
  },
  {
    ...makkala,
    index: 2,
    partner: 'Makkala Jagriti',
    location: 'Bengaluru',
    frames: [
      frame(3, makkala, {
        src: '/images/gallery/makkala-004.jpg',
        alt: 'Students and facilitators gathered for a group portrait',
        width: 4000,
        height: 1868,
      }),
      frame(4, makkala, {
        src: '/images/gallery/makkala-005.jpg',
        alt: 'Students seated in a circle around a floor activity',
        width: 2992,
        height: 2992,
      }),
      frame(5, makkala, {
        src: '/images/gallery/makkala-006.jpg',
        alt: 'A facilitator speaking with students seated in a circle',
        width: 2992,
        height: 2992,
      }),
      frame(6, makkala, {
        src: '/images/gallery/makkala-007.jpg',
        alt: 'Students and facilitators smiling for a group portrait',
        width: 4000,
        height: 1868,
      }),
      frame(7, makkala, {
        src: '/images/gallery/makkala-008.jpg',
        alt: 'Students examining a printed image of a spiral galaxy',
        width: 1868,
        height: 4000,
      }),
      frame(8, makkala, {
        src: '/images/gallery/makkala-009.jpg',
        alt: 'A circle discussion during an outreach activity',
        width: 4000,
        height: 1868,
      }),
      frame(9, makkala, {
        src: '/images/gallery/makkala-010.jpg',
        alt: 'A facilitator and students talking across a floor activity',
        width: 4000,
        height: 1868,
      }),
    ],
  },
  {
    ...parikrma,
    index: 3,
    partner: 'Parikrma Humanity Foundation',
    location: 'Bengaluru',
    frames: [
      frame(10, parikrma, {
        src: '/images/gallery/parikrma-001.jpg',
        alt: 'Students watching an astronomy presentation in a classroom',
        width: 1200,
        height: 1600,
      }),
      frame(11, parikrma, {
        src: '/images/gallery/parikrma-002.jpg',
        alt: 'A facilitator presenting an illustration of Saturn to students',
        width: 1600,
        height: 1200,
      }),
      frame(12, parikrma, {
        src: '/images/gallery/parikrma-003.jpg',
        alt: 'A classroom discussing what everything is made of',
        width: 1600,
        height: 1200,
      }),
    ],
  },
]

export const GALLERY_FRAMES = GALLERY_SESSIONS.flatMap(session => session.frames)

export const formatFrameId = (id: number) => String(id).padStart(3, '0')
