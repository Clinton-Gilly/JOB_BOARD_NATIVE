export type Conversation = {
  id: string;
  name: string;
  role: string;
  preview: string;
  updatedAt: string;
};

export const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Pixel Forge HR',
    role: 'Senior UI Designer',
    preview: 'Can you share your latest mobile case study?',
    updatedAt: '09:21',
  },
  {
    id: 'c2',
    name: 'Nova Labs Team',
    role: 'React Native Engineer',
    preview: 'Interview slots are open this Friday.',
    updatedAt: 'Yesterday',
  },
  {
    id: 'c3',
    name: 'Trailhead Ops',
    role: 'Growth Marketer',
    preview: 'Thanks for the proposal update.',
    updatedAt: 'Mon',
  },
];

export const chatMessages: Record<string, { id: string; text: string; from: 'me' | 'them' }[]> = {
  c1: [
    { id: 'm1', text: 'Hi! We liked your profile for the UI role.', from: 'them' },
    { id: 'm2', text: 'Great to hear. Happy to share more details.', from: 'me' },
    { id: 'm3', text: 'Can you send your latest mobile case study?', from: 'them' },
  ],
  c2: [
    { id: 'm4', text: 'Hello, are you available this Friday?', from: 'them' },
    { id: 'm5', text: 'Yes, Friday afternoon works.', from: 'me' },
    { id: 'm6', text: 'Perfect. We will send a calendar invite.', from: 'them' },
  ],
  c3: [
    { id: 'm7', text: 'We received your proposal, thank you.', from: 'them' },
    { id: 'm8', text: 'Awesome. Let me know if you need revisions.', from: 'me' },
    { id: 'm9', text: 'Will do. We are reviewing internally.', from: 'them' },
  ],
};
