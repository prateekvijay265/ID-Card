export const TYPED_WORDS = ['BUILDER.', 'HACKER.', 'SHIPPER.', 'MAKER.', 'FOUNDER.'];

export const STATS = [
  { target: 420,  suf: '+', label: 'Registrations' },
  { target: 72,   suf: '',  label: 'Projects' },
  { target: 247,  suf: '+', label: 'Hackers' },
  { target: 50,   suf: 'k+', label: 'Bounties ($)' },
];

export const PROGRAMS = [
  { num: '01', title: 'Genesis Day',     desc: 'Where it all begins. Team formation, kickoff, and setting the intention.',         icon: '⚡' },
  { num: '02', title: 'Day of Triangle', desc: 'Problem. Solution. Market. Lock your idea and commit to the build.',                icon: '△' },
  { num: '03', title: 'Build Day',       desc: 'Heads down. Ship or ship. No distractions, just builders building.',                icon: '⌨' },
  { num: '04', title: 'Launch Day',      desc: 'The world watches. Demo your project, pitch to judges, ship your legacy.',          icon: '🚀' },
];

export const TIMELINE = [
  { idx: '01', title: 'Registration Begins',    desc: 'Applications open — start your HH GOA journey.' },
  { idx: '02', title: 'Open Trials',            desc: 'Skill-based challenges open to everyone.' },
  { idx: '03', title: 'Alpha Selections',       desc: 'First shortlist from Open Trials performance.' },
  { idx: '04', title: 'Beta Selections',        desc: 'Deeper technical & portfolio review.' },
  { idx: '05', title: 'Charlie Selections',     desc: 'Interviews and team-fit assessment.' },
  { idx: '06', title: 'RSVP & Stake',           desc: 'Final confirmation of your team\'s participation.' },
  { idx: '07', title: 'Residency',              desc: '247 builders. 4 days. Goa.' },
];

export const FAQS = [
  { q: 'Who can participate?',                    a: 'Anyone with a passion for building — developers, designers, PMs, founders. Teams of 1–3. Solo hackers welcome.' },
  { q: 'Is there a registration fee?',            a: 'No. Participation is completely free. Accommodation, meals, and workspace included. Just get yourself to Goa.' },
  { q: 'Can I start before the event?',           a: 'You can brainstorm and plan. All code must be written during the hackathon. Libraries, APIs, and frameworks are encouraged.' },
  { q: 'How are teams formed?',                   a: 'Come with a pre-formed team or find teammates on Day 1. We run a team matching session at the start.' },
  { q: 'What should I bring?',                    a: 'Laptop, charger, hardware if needed, and your energy. We provide workspace, WiFi, power, meals, and caffeine.' },
];

export const TESTIMONIALS = [
  { q: 'HH Goa was the most productive week of my year. Shipped my best project, made lifelong friends, closed a deal by day 3.', name: 'ARJUN M.', role: 'Solana Developer', init: 'A' },
  { q: 'The energy is unreal. Everyone is building. I came with a rough idea and left with a live product and 3 co-founders.', name: 'PRIYA S.', role: 'Full-Stack Builder', init: 'P' },
  { q: 'I\'ve been to every major hackathon. Nothing compares. Location, people, hunger to build — all converge here.', name: 'RAHUL V.', role: 'DeFi Engineer', init: 'R' },
];

export const BUILDER_TITLES = [
  'Chief Solana Chaos Engineer',
  'Principal Vibe Architect',
  'Senior Degenerate Builder',
  'Lead Blockchain Whisperer',
  'Head of Shipping Fast',
  'Distinguished Onchain Dreamer',
  'Staff Engineer of Good Vibes',
  'VP of Breaking Things (Nicely)',
  'Full-Stack Beach Optimizer',
  'Founding Member of the Builder Cult',
  'Grand Poobah of Web3 Nonsense',
  'Director of Midnight Deploys',
  'Senior Vibe Coder',
  'Token-Gated Creativity Lead',
  'Resident DeFi Philosopher',
];
export const getRandTitle = () => BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
