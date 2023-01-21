import _ from 'lodash';

export const RAID_CATEGORY = [
  'DESIGN_SPRINT',
  'FULL_STACK',
  'SMART_CONTRACTS',
  'BACKEND',
  'FRONTEND',
  'MARKETING',
];

export const RAID_CATEGORY_OPTIONS = [
  { label: 'Design Sprint', value: 'DESIGN_SPRINT' },
  { label: 'Full Stack', value: 'FULL_STACK' },
  { label: 'Wizarding', value: 'SMART_CONTRACTS' },
  { label: 'Backend', value: 'BACKEND' },
  { label: 'Frontend', value: 'FRONTEND' },
  { label: 'Marketing', value: 'MARKETING' },
];

export const RAID_CATEGORY_DISPLAY = {
  DESIGN_SPRINT: 'Design Sprint',
  FULL_STACK: 'Full Stack',
  SMART_CONTRACTS: 'Wizarding',
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
  MARKETING: 'Marketing',
};

export const RAID_STATUS = [
  'Awaiting',
  'Preparing',
  'Raiding',
  'Shipped',
  'Lost',
];

export const REGEX_ETH_ADDRESS = /^(0x[a-f0-9]{40})$/i;

export const SERVICES = [
  'DAO (Design, Deployment)',
  'Development (Frontend, Backend)',
  'Marketing (Social Media, Copywriting, Memes/GIFs)',
  'Motion Design (Video, Explainers, Sticker Packs)',
  'NFTs (Contracts, Art, Tokenomics)',
  'Smart Contracts (Solidity, Audits)',
  'Strategy (Product, Launch Planning, Agile)',
  'Tokenomics (Incentives, Distribution, Rewards)',
  'UX (Research, Testing, User Stories)',
  'UI (Interface Design, Interaction Design)',
  'Visual Design (Branding, Illustration, Graphics)',
  'Help me figure out what I need',
];

export const PREFERRED_CONTACT = ['Discord', 'Email', 'Telegram'];

export const PROJECT_TYPE = ['New', 'Existing'];

export const PROJECT_TYPE_DISPLAY = (projectType: string) => {
  const projectTypeMap = {
    NEW: 'New',
    EXISTING: 'Existing',
  };

  if (!_.includes(_.keys(projectTypeMap), projectType)) return;

  return projectTypeMap[projectType];
};

export const AVAILABLE_PROJECT_SPECS = ['Yes', 'Partial', 'None'];

export const AVAILABLE_PROJECT_SPECS_DISPLAY = (spec: string) => {
  const specsMap = {
    YES: 'Yes',
    PARTIAL: 'Partial',
    NONE: 'None',
  };

  if (!_.includes(_.keys(specsMap), spec)) return;

  return specsMap[spec];
};

export const BUDGET = [
  'LESS_THAN_FIVE_THOUSAND',
  'FIVE_TO_TWENTY_THOUSAND',
  'TWENTY_TO_FIFTY_THOUSAND',
  'MORE_THAN_FIFTY_THOUSAND',
  'NOT_SURE',
];

export const BUDGET_DISPLAY = {
  LESS_THAN_FIVE_THOUSAND: '< $5k',
  FIVE_TO_TWENTY_THOUSAND: '$5k - $20k',
  TWENTY_TO_FIFTY_THOUSAND: '$20k - $50k',
  MORE_THAN_FIFTY_THOUSAND: '$50k +',
  NOT_SURE: 'Not Sure',
};

export const DELIVERY_PRIORITIES = [
  'Fast & Polished',
  'Fast & Inexpensive',
  'Polished & Inexpensive',
];

export const DELIVERY_PRIORITIES_DISPLAY = (priority: string) => {
  const deliveryPrioritiesMap = {
    FAST_AND_POLISHED: 'Fast & Polished',
    FAST_AND_INEXPENSIVE: 'Fast & Inexpensive',
    POLISHED_AND_INEXPENSIVE: 'Polished & Inexpensive',
  };

  if (!_.includes(_.keys(deliveryPrioritiesMap), priority)) return;

  return deliveryPrioritiesMap[priority];
};

export const SUBMISSION_TYPE = ['Paid', 'Unpaid'];

export const SKILLS_DISPLAY_OPTIONS = [
  {
    label: 'Frontend Dev',
    value: 'FRONTEND',
  },
  {
    label: 'Backend Dev',
    value: 'BACKEND',
  },
  {
    label: 'Solidity',
    value: 'SOLIDITY',
  },
  {
    label: 'BizDev',
    value: 'BIZ_DEV',
  },
  {
    label: 'Community',
    value: 'COMMUNITY',
  },
  // {PROJECT_MANAGEMENT: 'Project Management',}
  // {FINANCE: 'Finance'},
  // {PRODUCT_DESIGN: 'Product Design'},
  // UX_RESEARCH: 'UX Research',
  // GAME_THEORY: 'Game Theory',
  // DEVOPS: 'DevOps',
  // TOKENOMICS: 'Tokenomics',
  // CONTENT: 'Content',
  // MEMES: 'Memes',
  // VISUAL_DESIGN: 'Visual Design',
  // UI_DESIGN: 'UI Design',
  // ILLUSTRATION: 'Illustration',
  // LEGAL: 'Legal',
  // ACCOUNTING: 'Accounting',
];

export const SKILLS_DISPLAY = (skill: string) => {
  const skillsMap = {
    FRONTEND: 'Frontend Dev',
    BACKEND: 'Backend Dev',
    SOLIDITY: 'Solidity',
    BIZ_DEV: 'BizDev',
    COMMUNITY: 'Community',
    PROJECT_MANAGEMENT: 'Project Management',
    FINANCE: 'Finance',
    PRODUCT_DESIGN: 'Product Design',
    UX_RESEARCH: 'UX Research',
    GAME_THEORY: 'Game Theory',
    DEVOPS: 'DevOps',
    TOKENOMICS: 'Tokenomics',
    CONTENT: 'Content',
    MEMES: 'Memes',
    VISUAL_DESIGN: 'Visual Design',
    UI_DESIGN: 'UI Design',
    ILLUSTRATION: 'Illustration',
    LEGAL: 'Legal',
    ACCOUNTING: 'Accounting',
  };

  if (!_.includes(_.keys(skillsMap), skill)) return;

  return skillsMap[skill];
};

export const SKILL_TYPE = ['NA', 'Technical', 'Non - Technical', 'Other'];

export const DAO_FAMILIARITY = ['NA', 'Expert', 'Familiar', 'A Little', 'None'];

export const COHORT_AVAILABILITY = [
  'NA',
  '0-5 hours',
  '6-12 hours',
  '13-35 hours',
  '36+ hours',
];

export const GUILD_CLASS_ICON = {
  COMMUNITY: 'tavernkeeper',
  DESIGN: 'archer',
  TREASURY: 'dwarf',
  MARKETING: 'hunter', // ! need another role badge for bard
  FRONTEND_DEV: 'warrior',
  OPERATIONS: 'healer',
  BIZ_DEV: 'hunter',
  BACKEND_DEV: 'paladin',
  PROJECT_MANAGEMENT: 'monk',
  SMART_CONTRACTS: 'wizard',
  LEGAL: 'rogue',
  ACCOUNT_MANAGER: 'cleric',
};

export const GUILD_CLASS_OPTIONS = [
  { label: 'Tavern Keeper (Community)', value: 'COMMUNITY' },
  { label: 'Archer (Design)', value: 'DESIGN' },
  { label: 'Angry Dwarf (Treasury)', value: 'TREASURY' },
  { label: 'Bard (Marketing)', value: 'MARKETING' },
  { label: 'Warrior (FrontEnd Dev)', value: 'FRONTEND_DEV' },
  { label: 'Healer (Ops)', value: 'OPERATIONS' },
  { label: 'Hunter (BizDev)', value: 'BIZ_DEV' },
  { label: 'Paladin (Backend Dev)', value: 'BACKEND_DEV' },
  { label: 'Monk (PM)', value: 'PROJECT_MANAGEMENT' },
  { label: 'Wizard (Smart Contracts)', value: 'SMART_CONTRACTS' },
  { label: 'Rogue (Legal)', value: 'LEGAL' },
  { label: 'Cleric (Client Manager)', value: 'ACCOUNT_MANAGER' },
];

export const GUILD_CLASS_DISPLAY = {
  COMMUNITY: 'Tavern Keeper (Community)',
  DESIGN: 'Archer (Design)',
  TREASURY: 'Angry Dwarf (Treasury)',
  MARKETING: 'Bard (Marketing)',
  FRONTEND_DEV: 'Warrior (FrontEnd Dev)',
  OPERATIONS: 'Healer (Ops)',
  BIZ_DEV: 'Hunter (BizDev)',
  BACKEND_DEV: 'Paladin (Backend Dev)',
  PROJECT_MANAGEMENT: 'Monk (PM)',
  SMART_CONTRACTS: 'Wizard (Smart Contracts)',
  LEGAL: 'Rogue (Legal)',
  ACCOUNT_MANAGER: 'Cleric (Client Manager)',
};

export const GUILD_GNOSIS_DAO_ADDRESS = '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f';

export const SIDEBAR_ACTION_STATES = {
  none: 'NONE',
  select: 'SELECT',
  raider: 'RAIDER',
  role: 'ROLE',
  cleric: 'CLERIC',
};
