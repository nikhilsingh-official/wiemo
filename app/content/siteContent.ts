import { WIEMO_IMPACT } from './impact'

export const SITE_CONTENT = {
  initiativeName: 'The What is Everything Made of Initiative',
  strapline: 'Dedicated to the quest of physics for all.',
  shortDescription:
    'We are a student-led initiative bringing physics education to students in rural and underprivileged communities. Led by CERN Masterclass alumni with a passion for physics, we introduce students to the curiosity, excitement and possibilities of the subject, particularly particle physics.',
  vision:
    'To teach every child about the wonders of the fundamental questions of reality through the lens of physics.',
  goal: 'We aim to have an impact on one thousand students by the end of 2026.',
  mission: [
    'WIEMO aims to give students greater exposure to physics, particularly particle physics, and to the questions that shape our understanding of the universe. Our work was inspired by the experiences of our members at the CERN Masterclass, where they had the opportunity to explore particle physics at the highest level. Recognising that access to such opportunities is often shaped by a student’s background, location and available resources, we aim to make engaging and high-quality physics education more accessible to students in rural and underserved communities.',
    'We believe that the question, “What is everything made of?”, is universal. Every student should have the opportunity to ask that question, explore its answers and discover the possibilities within science, regardless of where they come from. By working with schools, educators and community organisations, our mission is to reduce the barriers that prevent students from accessing scientific knowledge and to create more equal opportunities for curiosity, learning and discovery.',
  ],
  impactMetrics: [
    {
      label: 'Students impacted',
      value: String(WIEMO_IMPACT.studentsReached),
      note: `Goal: ${WIEMO_IMPACT.studentGoal.toLocaleString('en')} students by the end of ${WIEMO_IMPACT.studentGoalYear}`,
    },
    {
      label: 'Sessions delivered',
      value: String(WIEMO_IMPACT.sessionsDelivered),
      note: `${WIEMO_IMPACT.sessionsDelivered} sessions delivered since July 2025`,
    },
  ],
  partners: [
    {
      name: 'Makkala Jagriti',
      url: 'https://makkalajagriti.org/',
      logo: '/logos/makkala-jagriti-logo.svg',
    },
    {
      name: 'Parikrma Humanity Foundation',
      url: 'https://parikrmafoundation.org/',
      logo: '/logos/parikrma-humanity-foundation-logo.png',
    },
    {
      name: 'Dream a Dream',
      url: 'https://dreamadream.org/',
      logo: '/logos/dream-a-dream-logo.webp',
    },
    {
      name: 'Kristu Jayanti CMI Public School',
      url: 'http://www.kristujayantischool.edu.in/',
      logo: '/logos/kristu-jayanti-school-logo.png',
    },
  ],
  testimonial: {
    quote:
      'You fostered an atmosphere of curiosity, encouraging questions and inspiring young minds to think beyond textbooks and venture into the wonders of the universe.',
    attribution: 'Kristu Jayanti Principal',
    permissionConfirmed: false,
  },
  pagePreviews: [
    {
      title: 'About WIEMO',
      to: '/about',
      copy: 'Meet the students behind WIEMO and follow the story from a CERN Masterclass to classrooms across Bengaluru.',
    },
    {
      title: 'Collaborate with us',
      to: '/collaborate',
      copy: 'Schools, NGOs, educators and community organisations can partner with us to bring physics to more students.',
    },
    {
      title: 'Gallery',
      to: '/gallery',
      copy: 'See moments from outreach sessions with our partner schools and student centres.',
    },
    {
      title: 'Volunteer with us',
      to: '/volunteer',
      copy: 'Help WIEMO teach, communicate and build the tools that make our outreach possible.',
    },
    {
      title: 'Our timeline',
      to: '/timeline',
      copy: `Follow WIEMO from its first pilot session to ${WIEMO_IMPACT.sessionsDelivered} sessions reaching ${WIEMO_IMPACT.studentsReached} students.`,
    },
    {
      title: 'Reflections',
      to: '/blog/reflections',
      copy: 'Read first-hand reflections from the sessions, questions and experiences that shape WIEMO.',
    },
  ],
  homeTeachingImages: [
    {
      src: '/images/gallery/parikrma-011.jpg',
      alt: 'Students and WIEMO facilitators celebrating after the presentation',
      caption: 'Parikrma Humanity Foundation',
    },
    {
      src: '/images/gallery/parikrma-002.jpg',
      alt: 'A WIEMO facilitator presenting an illustration of Saturn to students',
      caption: 'Parikrma Humanity Foundation',
    },
  ],
  about: {
    whoWeAre: [
      'What is Everything Made Of, or WIEMO, is a student-led initiative bringing engaging physics education to students in rural and underserved communities.',
      'Led by students with a passion for physics, including CERN Masterclass alumni, we introduce young learners to the ideas, questions and discoveries that make physics fascinating, particularly particle physics.',
    ],
    story: [
      {
        text: 'The idea for WIEMO began in 2024, when I had the opportunity to attend a CERN Masterclass.',
      },
      {
        text: 'For the first time, I was able to explore particle physics beyond the classroom and engage with questions that had fascinated me for years. What is everything made of? How do scientists study particles that cannot be seen? How much of the universe do we still not understand?',
      },
      {
        text: 'When I returned, I realised how uncommon that opportunity had been, and how much it had changed the way I saw physics. I also began thinking about the many students who may never receive the chance to encounter the subject in this way. For them, particle physics might remain something distant and inaccessible, not because they lack curiosity, but because they have never been given the opportunity to explore it.',
      },
      {
        text: 'I wanted to help bridge that gap.',
        highlighted: true,
      },
      {
        text: 'In 2025, I began WIEMO with a single pilot session, where I introduced students to some of the basic ideas I had encountered through the CERN Masterclass. I did not want the session to feel like another lecture. I wanted students to ask questions, imagine themselves as scientists, and experience the excitement of trying to understand the universe.',
      },
      {
        text: 'That first session showed me how powerful simple exposure could be. A subject that initially seemed unfamiliar quickly became something students were curious about. Their questions, excitement and willingness to engage made me realise that WIEMO could become more than a single session.',
      },
      {
        text: 'Since then, I have been joined by Reyansh and Nikhil, whose ideas, effort and commitment have helped WIEMO grow far beyond the original pilot session.',
      },
      {
        text: 'Reyansh has become an essential part of the initiative. He brings not only a strong understanding of difficult ideas, but also the ability to explain them with clarity, patience and energy. His ability to communicate in three languages has been especially important in helping us reach students from different backgrounds. He does much more than translate our sessions. He adapts examples, explanations and questions so that students can genuinely connect with what they are learning. His intelligence, confidence and presence in the classroom have helped make WIEMO more accessible, engaging and inclusive.',
      },
      {
        text: 'Nikhil has played an equally important role in building the technical side of WIEMO. He helped design and develop our website, giving the initiative a platform through which we can share our work, document our progress and connect with schools and organisations. He also supports the technology behind the project, helping us turn ideas into something functional, organised and sustainable. His work has allowed WIEMO to grow not only inside classrooms, but also as a wider initiative with a clear identity and presence.',
      },
      {
        text: 'What began as something I started alone has now become something we are building together. Each of us brings a different strength to the initiative, whether through teaching, communication, technology or planning. WIEMO is no longer simply my project. It is our shared effort, shaped by the people who contribute to it and by every student who asks a question during our sessions.',
      },
    ],
    topics: [
      'Atoms and the structure of matter',
      'The Big Bang theory',
      'Fundamental particles',
      'The Standard Model',
      'Particle accelerators and CERN',
      'The Higgs boson',
    ],
    teachingApproach:
      'We use analogies, activities and discussions to teach these complex concepts to students from 6th to 12th grade.',
    team: [
      {
        name: 'Agastya Kartikeyan',
        role: 'Founder',
        bio: 'Agastya began WIEMO after a 2024 CERN Masterclass changed the way he saw physics. He led the first pilot session in 2025 and continues to shape the initiative’s teaching, planning and partnerships.',
      },
      {
        name: 'Reyansh Sudhir',
        role: 'Lead — Outreach',
        bio: 'Reyansh explains difficult ideas with clarity, patience and energy. His ability to communicate in three languages helps WIEMO adapt its examples, explanations and questions for students from different backgrounds.',
      },
      {
        name: 'Nikhil Singh',
        role: 'Lead — Technology',
        bio: 'Nikhil builds the technology behind WIEMO, including the website that documents its progress and connects the team with schools and organisations. His work helps turn ideas into something functional, organised and sustainable.',
      },
    ],
  },
  collaboration: {
    intro:
      'WIEMO works with schools, NGOs, educators and community organisations to bring engaging physics education to students in rural and underserved communities.',
    partnership:
      'Our partners help us reach students, host sessions and adapt our programmes to the needs of each community. Together, we can give more students the opportunity to explore physics, ask questions and discover the possibilities of science.',
    invitation:
      'Interested in working with us? Get in touch through our form or via our contact details.',
  },
  contact: {
    emailLabel: 'agastya@wiemo.org',
    emailHref: 'mailto:agastya@wiemo.org',
  },
} as const
