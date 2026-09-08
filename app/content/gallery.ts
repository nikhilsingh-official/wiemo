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
    ...parikrma,
    index: 2,
    partner: 'Parikrma Humanity Foundation',
    location: 'Bengaluru',
    frames: [
      frame(3, parikrma, {
        src: '/images/gallery/parikrma-001.jpg',
        alt: 'Students watching an astronomy presentation in a classroom',
        width: 1200,
        height: 1600,
      }),
      frame(4, parikrma, {
        src: '/images/gallery/parikrma-002.jpg',
        alt: 'A facilitator presenting an illustration of Saturn to students',
        width: 1600,
        height: 1200,
      }),
      frame(5, parikrma, {
        src: '/images/gallery/parikrma-003.jpg',
        alt: 'A classroom discussing what everything is made of',
        width: 1600,
        height: 1200,
      }),
      frame(6, parikrma, {
        src: '/images/gallery/parikrma-004.jpg',
        alt: 'Students and WIEMO facilitators posing together in a classroom',
        width: 2000,
        height: 1500,
      }),
      frame(7, parikrma, {
        src: '/images/gallery/parikrma-005.jpg',
        alt: 'Students smiling and making playful poses with WIEMO facilitators',
        width: 2000,
        height: 1500,
      }),
      frame(8, parikrma, {
        src: '/images/gallery/parikrma-006.jpg',
        alt: 'Students and WIEMO facilitators gathered for a classroom portrait',
        width: 2000,
        height: 1500,
      }),
      frame(9, parikrma, {
        src: '/images/gallery/parikrma-007.jpg',
        alt: 'A Parikrma class posing with WIEMO facilitators after a session',
        width: 2000,
        height: 1500,
      }),
      frame(10, parikrma, {
        src: '/images/gallery/parikrma-008.jpg',
        alt: 'Students gathered around WIEMO facilitators for a group photo',
        width: 2000,
        height: 1500,
      }),
      frame(11, parikrma, {
        src: '/images/gallery/parikrma-009.jpg',
        alt: 'Students and facilitators smiling together at the end of a session',
        width: 2000,
        height: 1500,
      }),
      frame(12, parikrma, {
        src: '/images/gallery/parikrma-010.jpg',
        alt: 'A Parikrma class and WIEMO facilitators posing in their classroom',
        width: 2000,
        height: 1500,
      }),
      frame(13, parikrma, {
        src: '/images/gallery/parikrma-011.jpg',
        alt: 'Students and WIEMO facilitators celebrating after the presentation',
        width: 2000,
        height: 1500,
      }),
      frame(14, parikrma, {
        src: '/images/gallery/parikrma-012.jpg',
        alt: 'A Parikrma classroom gathered around WIEMO facilitators',
        width: 2000,
        height: 1500,
      }),
    ],
  },
]

export const GALLERY_FRAMES = GALLERY_SESSIONS.flatMap(session => session.frames)

export const formatFrameId = (id: number) => String(id).padStart(3, '0')
