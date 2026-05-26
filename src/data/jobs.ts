export type JobCategory = 'Design' | 'Engineering' | 'Marketing' | 'Product' | 'Support';

export type JobItem = {
  id: string;
  title: string;
  employer: string;
  category: JobCategory;
  budget: string;
  location: string;
  postedAt: string;
  skills: string[];
  description: string;
};

export const CATEGORY_COLORS: Record<JobCategory, string> = {
  Design: '#FDE68A',
  Engineering: '#BFDBFE',
  Marketing: '#FBCFE8',
  Product: '#BBF7D0',
  Support: '#DDD6FE',
};

const baseJobs: JobItem[] = [
  {
    id: '1',
    title: 'Senior UI Designer',
    employer: 'Pixel Forge',
    category: 'Design',
    budget: '$3,200',
    location: 'Remote',
    postedAt: '2h ago',
    skills: ['Figma', 'Design Systems', 'Prototyping'],
    description:
      'Create polished mobile-first interfaces for a productivity platform used by global teams.',
  },
  {
    id: '2',
    title: 'React Native Engineer',
    employer: 'Nova Labs',
    category: 'Engineering',
    budget: '$4,800',
    location: 'Lagos',
    postedAt: '4h ago',
    skills: ['React Native', 'TypeScript', 'Expo'],
    description:
      'Build and ship performant cross-platform features with a strong focus on app architecture.',
  },
  {
    id: '3',
    title: 'Content Marketing Lead',
    employer: 'Launchlane',
    category: 'Marketing',
    budget: '$2,900',
    location: 'London',
    postedAt: '7h ago',
    skills: ['SEO', 'Copywriting', 'Analytics'],
    description:
      'Own the editorial calendar and drive growth campaigns across social and organic channels.',
  },
  {
    id: '4',
    title: 'Product Manager, Mobile',
    employer: 'OrbitPay',
    category: 'Product',
    budget: '$5,300',
    location: 'New York',
    postedAt: '10h ago',
    skills: ['Roadmapping', 'A/B Testing', 'User Research'],
    description:
      'Lead product decisions for a fast-growing fintech app with millions of active users.',
  },
  {
    id: '5',
    title: 'Customer Success Specialist',
    employer: 'CloudDesk',
    category: 'Support',
    budget: '$2,100',
    location: 'Nairobi',
    postedAt: '12h ago',
    skills: ['CRM', 'Onboarding', 'Communication'],
    description:
      'Guide new customers through setup and help improve retention through proactive support.',
  },
  {
    id: '6',
    title: 'Brand Designer',
    employer: 'Aster Studio',
    category: 'Design',
    budget: '$2,700',
    location: 'Berlin',
    postedAt: '1d ago',
    skills: ['Illustrator', 'Brand Strategy', 'Typography'],
    description:
      'Develop cohesive brand visuals across product launches, campaigns, and digital assets.',
  },
  {
    id: '7',
    title: 'Backend Engineer',
    employer: 'HexaCore',
    category: 'Engineering',
    budget: '$4,500',
    location: 'Remote',
    postedAt: '1d ago',
    skills: ['Node.js', 'PostgreSQL', 'API Design'],
    description:
      'Design and maintain secure APIs powering high-traffic consumer and enterprise products.',
  },
  {
    id: '8',
    title: 'Growth Marketer',
    employer: 'Trailhead',
    category: 'Marketing',
    budget: '$3,000',
    location: 'Toronto',
    postedAt: '1d ago',
    skills: ['Paid Ads', 'Lifecycle', 'Attribution'],
    description:
      'Scale user acquisition using paid social experiments and funnel optimization.',
  },
  {
    id: '9',
    title: 'Associate Product Manager',
    employer: 'Bento Health',
    category: 'Product',
    budget: '$3,400',
    location: 'Remote',
    postedAt: '2d ago',
    skills: ['Product Discovery', 'Wireframing', 'Metrics'],
    description:
      'Partner with design and engineering to deliver patient-centric mobile workflows.',
  },
  {
    id: '10',
    title: 'Technical Support Engineer',
    employer: 'SignalNet',
    category: 'Support',
    budget: '$2,600',
    location: 'Cape Town',
    postedAt: '2d ago',
    skills: ['Debugging', 'SLA', 'Documentation'],
    description:
      'Resolve escalated technical issues while improving internal troubleshooting guides.',
  },
  {
    id: '11',
    title: 'UX Researcher',
    employer: 'Nimbus',
    category: 'Design',
    budget: '$3,100',
    location: 'Austin',
    postedAt: '2d ago',
    skills: ['Interviews', 'Usability Tests', 'Insight Synthesis'],
    description:
      'Run user research programs to uncover insights and shape product strategy.',
  },
  {
    id: '12',
    title: 'Frontend Engineer',
    employer: 'ArcFlow',
    category: 'Engineering',
    budget: '$4,200',
    location: 'San Francisco',
    postedAt: '3d ago',
    skills: ['React', 'Performance', 'Testing'],
    description:
      'Ship high-impact UI features and improve reliability for a data-rich dashboard.',
  },
  {
    id: '13',
    title: 'Social Media Strategist',
    employer: 'Citrus Media',
    category: 'Marketing',
    budget: '$2,500',
    location: 'Remote',
    postedAt: '3d ago',
    skills: ['Content Strategy', 'Community', 'Campaign Ops'],
    description:
      'Design social storytelling campaigns and build engaged communities around the brand.',
  },
  {
    id: '14',
    title: 'Product Analyst',
    employer: 'NorthGrid',
    category: 'Product',
    budget: '$3,600',
    location: 'Dubai',
    postedAt: '3d ago',
    skills: ['SQL', 'Experimentation', 'Dashboards'],
    description:
      'Support roadmap decisions with clear analysis and experimentation insights.',
  },
  {
    id: '15',
    title: 'Customer Onboarding Manager',
    employer: 'Pulse CRM',
    category: 'Support',
    budget: '$2,800',
    location: 'Singapore',
    postedAt: '4d ago',
    skills: ['Enablement', 'Workflows', 'Stakeholder Mgmt'],
    description:
      'Own onboarding processes and improve time-to-value for enterprise customers.',
  },
];

export const jobsSeed = baseJobs;

export function getRefreshedJobs() {
  return baseJobs.map((job, index) => {
    const shiftedHours = (index % 5) + 1;
    return {
      ...job,
      postedAt: `${shiftedHours}h ago`,
      budget: `$${Number(job.budget.replace(/[$,]/g, '')) + 100}`,
    };
  });
}

export const allCategories: (JobCategory | 'All')[] = [
  'All',
  'Design',
  'Engineering',
  'Marketing',
  'Product',
  'Support',
];

export const allLocations = [
  'All',
  'Remote',
  'Lagos',
  'London',
  'New York',
  'Nairobi',
  'Berlin',
  'Toronto',
  'Cape Town',
  'Austin',
  'San Francisco',
  'Dubai',
  'Singapore',
];
