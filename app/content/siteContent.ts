export const SITE_CONTENT = {
  initiativeName: 'The What is Everything Made of Initiative',
  strapline: 'Dedicated to the quest of physics for all.',
  shortDescription:
    'We are a student-led initiative bringing physics education to students in rural and underprivileged communities. Led by CERN Masterclass alumni with a passion for physics, we introduce students to the curiosity, excitement and possibilities of the subject, particularly particle physics.',
  goal: 'We aim to have an impact on one thousand students by the end of 2026.',
  mission: [
    'WIEMO aims to give students greater exposure to physics, particularly particle physics, and to the questions that shape our understanding of the universe. Our work was inspired by the experiences of our members at the CERN Masterclass, where they had the opportunity to explore particle physics at the highest level. Recognising that access to such opportunities is often shaped by a student’s background, location and available resources, we aim to make engaging and high-quality physics education more accessible to students in rural and underserved communities.',
    'We believe that the question, “What is everything made of?”, is universal. Every student should have the opportunity to ask that question, explore its answers and discover the possibilities within science, regardless of where they come from. By working with schools, educators and community organisations, our mission is to reduce the barriers that prevent students from accessing scientific knowledge and to create more equal opportunities for curiosity, learning and discovery.',
  ],
  impactMetrics: [
    {
      label: 'Students impacted',
      value: '300',
      note: 'Goal: 1,000 students by the end of 2026',
    },
    {
      label: 'Schools and student centres',
      value: '3',
      note: 'Expected to grow before launch',
    },
    {
      label: 'Sessions delivered',
      value: '5',
      note: 'Current prototype figure',
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
    note: 'Prototype testimonial; permission still needs to be confirmed.',
  },
  pagePreviews: [
    {
      title: 'About WIEMO',
      to: '/about',
      copy: 'Read the mission behind the initiative and why access to physics education should not depend on background, location or resources.',
    },
    {
      title: 'Total Impact',
      to: '/total-impact',
      copy: 'Track the current prototype numbers for students reached, centres visited and sessions delivered.',
    },
    {
      title: 'Gallery',
      to: '/gallery',
      copy: 'Teaching photos will live here once photo permissions are confirmed.',
    },
    {
      title: 'Blog',
      to: '/blog/reflections',
      copy: 'Field notes, workshop updates and particle-physics learning stories for the Studio CMS prototype.',
    },
  ],
  contact: {
    emailLabel: 'Email coming soon',
    emailHref: '',
  },
} as const
