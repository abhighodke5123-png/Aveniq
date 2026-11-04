import {
  ServiceItem,
  IndustryItem,
  ConceptProject,
  ProcessStep,
} from '../types';

export const STUDIO_META = {
  brandName: 'AVENIQ',
  tagline: 'Designed to move business forward.',
  descriptor: 'INDEPENDENT DIGITAL EXPERIENCE STUDIO',
  subDescriptor: 'STRATEGY / DESIGN / TECHNOLOGY / GROWTH',
  heroHeadline: 'Your next stage of growth starts with a better digital presence.',
  heroDescription:
    'We design and build high-performance digital experiences that help businesses attract, engage and convert their audiences.',
  introHeadline: 'Good businesses deserve better digital experiences.',
  introParagraph1:
    'Your website is more than an online presence. It is where people discover your business, understand your value and decide to take the next step.',
  introParagraph2:
    'At AVENIQ, we bring together thoughtful design, intelligent technology and business-focused strategy to create digital experiences that make a meaningful difference.',
  contactEmail: 'contact@aveniqstudio.com',
  whatsappNumber: '919876543210',
  internationalMarkets: ['India', 'United States', 'United Kingdom', 'Australia', 'Canada', 'International'],
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'digital-experiences',
    number: '01',
    title: 'Digital Experiences',
    tagline: 'Precision engineered websites and web platforms.',
    description:
      'Custom websites, landing pages, e-commerce, booking platforms and web applications crafted for speed, accessibility, and high conversion.',
    deliverables: [
      'Custom Responsive Websites',
      'High-Conversion Landing Pages',
      'Specialised Booking & Patient Portals',
      'Modern Headless E-commerce',
      'Scalable Web Applications',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js'],
    idealFor: 'Hospitals, enterprise brands, clinics, developers, and scaling modern companies.',
  },
  {
    id: 'brand-creative',
    number: '02',
    title: 'Brand & Creative',
    tagline: 'Distinctive visual identities and art-directed digital systems.',
    description:
      'Brand identity, visual design, UI/UX and digital brand experiences that establish instant credibility and international presence.',
    deliverables: [
      'Visual Identity & Monograms',
      'Design Systems & Component Libraries',
      'UI/UX Architecture & Wireframing',
      'Art Direction & Editorial Typography',
      'Interactive Prototypes & Motion Guidelines',
    ],
    technologies: ['Figma', 'Design Tokens', 'Motion / Framer', 'Accessible Color Systems'],
    idealFor: 'Businesses transitioning from legacy websites into world-class digital brands.',
  },
  {
    id: 'search-growth',
    number: '03',
    title: 'Search & Growth',
    tagline: 'Commercial visibility and organic patient & client acquisition.',
    description:
      'SEO, local SEO, conversion optimisation, analytics and content strategy engineered to drive verified customer acquisition.',
    deliverables: [
      'Technical & Core Web Vitals SEO',
      'Local SEO & Multi-Location Clinic Optimization',
      'Conversion Rate Optimization (CRO)',
      'Schema.org Rich Snippets & Knowledge Graph',
      'Privacy-First Analytics & Conversion Tracking',
    ],
    technologies: ['Schema.org', 'Google Search Console', 'GA4 & PostHog', 'Lighthouse 100 Standards'],
    idealFor: 'Clinics, hospitals, resorts, and service businesses requiring predictable organic enquiries.',
  },
  {
    id: 'ai-automation',
    number: '04',
    title: 'AI & Automation',
    tagline: 'Intelligent workflows that convert interest into confirmed bookings.',
    description:
      'AI-powered chat interfaces, lead management, appointment workflows and business automation that operate 24/7.',
    deliverables: [
      'Bespoke Conversational AI Assistants',
      'Automated Appointment Routing & Reminders',
      'WhatsApp Business API Integrations',
      'CRM & Patient Intake Pipeline Sync',
      'Instant Lead Qualification & Notifications',
    ],
    technologies: ['Gemini API', 'WhatsApp Cloud API', 'Webhooks & Serverless', 'Zapier / Make Engine'],
    idealFor: 'High-volume clinics, real estate sales desks, and hospitality reservation teams.',
  },
  {
    id: 'digital-infrastructure',
    number: '05',
    title: 'Digital Infrastructure',
    tagline: 'Bank-grade performance, continuous security, and dedicated uptime.',
    description:
      'Hosting, website maintenance, security, performance and integrations that guarantee rapid load times and uninterrupted operations.',
    deliverables: [
      'Edge CDN Deployment & Global Caching',
      'Daily Backups & Enterprise Security Shield',
      'Sub-Second Global Load Time Optimization',
      'Core Web Vitals & SLA Monitoring',
      'Ongoing Security Patches & Compliance',
    ],
    technologies: ['Cloudflare Edge', 'Vercel / Cloud Run', 'SSL / TLS 1.3', 'HTTP/3 Protocol'],
    idealFor: 'Organisations where website downtime or slow performance impacts revenue and trust.',
  },
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    summary: 'Hospitals, clinics, dental practices and diagnostic centres.',
    examples: 'Multispeciality hospitals, dental studios, surgical centres, pathology & imaging labs.',
    deliverables: [
      'Doctor credential directories & schedule booking',
      'Departmental speciality pages & procedure guides',
      'Direct WhatsApp and telemedicine triage integration',
      'Local SEO for multi-branch patient acquisition',
    ],
    accentMetric: 'Primary Specialisation',
  },
  {
    id: 'hospitality',
    title: 'Hospitality',
    summary: 'Hotels, resorts, restaurants and cafes.',
    examples: 'Boutique retreats, eco-resorts, luxury dining establishments, curated cafes.',
    deliverables: [
      'Room & suite visual storytelling',
      'Direct commission-free reservation engines',
      'Seasonal culinary menu presentation',
      'Event and wedding enquiry pipelines',
    ],
    accentMetric: 'Direct Booking Lift',
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    summary: 'Builders, property developers and real estate agencies.',
    examples: 'Luxury residential towers, commercial parks, architectural developments, brokerage firms.',
    deliverables: [
      'Architectural project showcases with 3D floorplans',
      'Site plan navigators & neighborhood amenity maps',
      'Instant brochure downloads & lead qualification',
      'VIP sales appointment booking flows',
    ],
    accentMetric: 'High-Value Investor Enquiries',
  },
  {
    id: 'education',
    title: 'Education',
    summary: 'Schools, colleges and educational institutions.',
    examples: 'International academies, collegiate universities, executive training institutes.',
    deliverables: [
      'Curriculum navigators & faculty directories',
      'Admissions inquiry & campus visit registration',
      'Accreditation and academic achievement showcases',
      'Multi-lingual international student guides',
    ],
    accentMetric: 'Enrollment Conversion',
  },
  {
    id: 'professional-services',
    title: 'Professional Services',
    summary: 'Consultants, law firms and financial professionals.',
    examples: 'Corporate law practices, wealth advisory firms, management consulting boutiques.',
    deliverables: [
      'Thought leadership & whitepaper publishing',
      'Partner bios & transaction case archives',
      'Secure client intake & appointment dispatch',
      'Regulatory compliance presentation',
    ],
    accentMetric: 'Institutional Credibility',
  },
  {
    id: 'startups-retail',
    title: 'Startups & Retail',
    summary: 'Technology startups, e-commerce and growing businesses.',
    examples: 'SaaS platforms, D2C consumer brands, fintech ventures, premium retailers.',
    deliverables: [
      'High-velocity product storytelling',
      'Interactive feature walkthroughs & live demo embeds',
      'Frictionless checkout & payment orchestration',
      'Analytics-driven funnel optimisation',
    ],
    accentMetric: 'Scalable Growth Velocity',
  },
];

export const HEALTHCARE_FEATURES = [
  {
    title: 'Modern Hospital Websites',
    description: 'Clean, soothing interfaces designed with clear hierarchy so patients feel calm and guided.',
  },
  {
    title: 'Doctor & Specialist Profiles',
    description: 'Rich profiles showcasing credentials, specialities, clinical experience, languages, and OPD hours.',
  },
  {
    title: 'Department & Speciality Pages',
    description: 'Deep content pages for Cardiology, Oncology, Orthopedics, Neurology, Pediatrics, and Surgery.',
  },
  {
    title: 'Appointment Enquiry Systems',
    description: 'Frictionless multi-step consultation requests with automated staff notifications and SMS/Email sync.',
  },
  {
    title: 'WhatsApp Integration',
    description: 'Instant one-tap WhatsApp chat links for quick patient triage, emergency directions, and desk queries.',
  },
  {
    title: 'Patient Information Pages',
    description: 'Pre-admission checklists, insurance cashless desk details, visitor guidelines, and digital reports lookup.',
  },
  {
    title: 'Local SEO & Multi-Branch Optimization',
    description: 'Hyper-local geographic ranking to ensure your hospital dominates "best specialist near me" queries.',
  },
  {
    title: 'Mobile-First Accessibility',
    description: 'Optimized touch targets, high contrast legibility, rapid 4G/5G loading, and full WCAG compliance.',
  },
];

export const CONCEPT_PROJECTS: ConceptProject[] = [
  {
    id: 'aura-healthcare',
    title: 'Aura Healthcare System',
    industry: 'Healthcare',
    category: 'Multispeciality Hospital Portal',
    tagline: 'Architectural web ecosystem for a 450-bed quaternary care medical centre.',
    summary:
      'A bespoke digital experience uniting 32 clinical departments, 140+ specialist doctors, instant OPD booking, and emergency guidance into a calm, welcoming patient journey.',
    services: ['Digital Experience', 'UI/UX Architecture', 'Doctor Directories', 'Appointment Engine', 'Local SEO'],
    deliverables: [
      'Departmental Care Center Pages',
      'Dynamic Doctor OPD Schedule Engine',
      'One-Touch WhatsApp Consultation Gateway',
      'Multi-Language Emergency Guidance Bar',
      'Cashless TPA Insurance Desk Navigator',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Edge CDN'],
    architectureHighlights: [
      'Sub-0.6s Time to Interactive across mobile devices',
      'Zero-confusion doctor filtering by department, condition, and language',
      'HIPAA/NABH aligned privacy architecture',
    ],
    imagePlaceholderStyle: {
      bgGradient: 'from-[#17191D] to-[#252830]',
      accentColor: '#91A99B',
      patternType: 'architectural',
    },
  },
  {
    id: 'verdant-dental',
    title: 'Verdant Dental Studio',
    industry: 'Healthcare',
    category: 'Modern Dental & Aesthetic Clinic',
    tagline: 'Editorial aesthetic web presence for bespoke restorative and cosmetic dentistry.',
    summary:
      'Warm architectural minimalism replaces clinical coldness. Features an interactive smile transformation gallery, doctor credentials, and automated WhatsApp appointment scheduling.',
    services: ['Brand Identity', 'Custom Web Experience', 'Visual Direction', 'Appointment Automation'],
    deliverables: [
      'Before/After Aesthetic Transformation Viewer',
      'Interactive Treatment Cost Estimator',
      'Direct WhatsApp Desk Integration',
      'Local Search Geo-Targeting',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Motion'],
    architectureHighlights: [
      'Visual focus on natural light and gentle dental care',
      'Direct conversion increase on mobile consultations',
      'Local map integration with one-click directions',
    ],
    imagePlaceholderStyle: {
      bgGradient: 'from-[#2A2E2B] to-[#17191D]',
      accentColor: '#91A99B',
      patternType: 'minimal',
    },
  },
  {
    id: 'monolith-hotel',
    title: 'The Monolith Retreat & Spa',
    industry: 'Hospitality',
    category: 'Luxury Boutique Mountain Sanctuary',
    tagline: 'Immersive editorial website for an award-winning alpine wellness retreat.',
    summary:
      'Designed to capture tranquility through sweeping architectural imagery, minimalist typography, seasonal culinary dining showcase, and a friction-free suite booking gateway.',
    services: ['Digital Experience', 'Brand Systems', 'Direct Booking Integration', 'Performance Tuning'],
    deliverables: [
      'Suite & Chalet 360° Visual Walkthroughs',
      'Seasonal Dining & Spa Menu Discovery',
      'VIP Concierge & Transfer Enquiry Form',
      'Multi-Currency Payment Integration',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vite'],
    architectureHighlights: [
      'Full viewport editorial layouts without visual clutter',
      'Direct reservations prioritised over third-party OTAs',
      'Smooth scroll transitions matching alpine pacing',
    ],
    imagePlaceholderStyle: {
      bgGradient: 'from-[#1C1F22] to-[#2B2F33]',
      accentColor: '#D1DDD6',
      patternType: 'waves',
    },
  },
  {
    id: 'strata-residences',
    title: 'Strata Architectural Residences',
    industry: 'Real Estate',
    category: 'Premium Property Developer Showcase',
    tagline: 'High-concept digital showcase for benchmark residential towers and waterfront estates.',
    summary:
      'Bespoke digital showroom presenting architectural blueprints, interactive floor plan viewers, bespoke materials gallery, and private sales gallery appointment requests.',
    services: ['Digital Experience', 'Interactive Floorplans', 'Lead Qualification', 'SEO'],
    deliverables: [
      'Interactive Penthouse Floorplan Navigator',
      'Neighborhood Amenity & Commute Isochrone Map',
      'Instant Architectural Monograph Brochure Download',
      'Direct Private Showing Booking System',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vector Floorplan Engine'],
    architectureHighlights: [
      'Designed specifically for ultra-high-net-worth buyers on desktop and mobile',
      'Automated investor qualification questionnaire',
      'Ultra crisp high-dpi architectural rendering displays',
    ],
    imagePlaceholderStyle: {
      bgGradient: 'from-[#1E2024] to-[#141518]',
      accentColor: '#91A99B',
      patternType: 'grid',
    },
  },
  {
    id: 'kura-dining',
    title: 'Kura Botanical Dining',
    industry: 'Hospitality',
    category: 'Contemporary Restaurant & Bar',
    tagline: 'Sensory digital experience for Michelin-referenced botanical gastronomy.',
    summary:
      'Editorial micro-site with dynamic seasonal menus, table reservation booking, private dining requests, and an intimate aesthetic rooted in organic earth tones.',
    services: ['Visual Design', 'Web Experience', 'Table Booking Engine', 'Mobile Optimisation'],
    deliverables: [
      'Live Daily Degustation Menu Viewer',
      'Instant Table Reservation Integration (SevenRooms/Resy)',
      'Private Events & Winemaker Dinners Enquiry',
      'Interactive Cellar & Pairing Guide',
    ],
    techStack: ['React', 'Tailwind CSS', 'TypeScript', 'Motion'],
    architectureHighlights: [
      '95% of guests view on mobile before dining; optimized for one-thumb reservations',
      'Real-time allergen filter on degustation menus',
      'Art-directed food and botanical photography presentation',
    ],
    imagePlaceholderStyle: {
      bgGradient: 'from-[#232624] to-[#181A18]',
      accentColor: '#A3B8AD',
      patternType: 'minimal',
    },
  },
  {
    id: 'nexis-intelligence',
    title: 'Nexis Intelligence Engine',
    industry: 'Technology',
    category: 'SaaS Startup Platform',
    tagline: 'Precision marketing site and product demonstration for enterprise AI infrastructure.',
    summary:
      'High-contrast technical aesthetic communicating developer ergonomics, API benchmarks, enterprise security certifications, and frictionless demo scheduling.',
    services: ['Brand Strategy', 'Product Architecture', 'Technical Copywriting', 'Web Development'],
    deliverables: [
      'Interactive API Speed & Latency Playground',
      'Enterprise Security & SOC2 Compliance Matrix',
      'Interactive Pricing & ROI Calculator',
      'Sales Demo Pipeline Integration',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
    architectureHighlights: [
      'Complex technical value explained with supreme visual clarity',
      'Fast 100/100 Lighthouse benchmark scores',
      'Instant self-serve developer sandbox entry',
    ],
    imagePlaceholderStyle: {
      bgGradient: 'from-[#17191D] to-[#20242B]',
      accentColor: '#91A99B',
      patternType: 'grid',
    },
  },
];

export const VALUE_PROPOSITIONS = [
  {
    number: '01',
    title: 'Strategy First',
    description: 'Every project starts with understanding your business, your patient or client behaviour, and commercial objectives. We build with clear intent, not guesswork.',
  },
  {
    number: '02',
    title: 'Design That Matters',
    description: 'Create intuitive and visually distinctive experiences that establish quiet authority. No templates, no generic fluff—only intentional editorial craft.',
  },
  {
    number: '03',
    title: 'Technology That Scales',
    description: 'Build responsive, secure and maintainable digital solutions using modern frameworks. Fast-loading, accessible, and structured for seamless future expansion.',
  },
  {
    number: '04',
    title: 'Built for Growth',
    description: 'Develop digital foundations that support visibility, engagement and enquiries. From technical SEO to WhatsApp integration, every touchpoint drives results.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    duration: 'Week 1',
    description: 'Understand your business, audience and goals. We conduct thorough discovery into your market, clinical or commercial strengths, and competitor positioning.',
    keyOutputs: ['Discovery Brief', 'Competitor Landscape Analysis', 'Core Goals & KPIs Matrix'],
  },
  {
    number: '02',
    title: 'Strategise',
    duration: 'Week 2',
    description: 'Define the structure, user journey and direction. We map out information architecture, patient and client booking pathways, and content strategy.',
    keyOutputs: ['Information Architecture', 'User Journey Maps', 'Content & SEO Blueprints'],
  },
  {
    number: '03',
    title: 'Design',
    duration: 'Weeks 3-4',
    description: 'Create a distinctive visual experience. We craft high-fidelity editorial layouts, responsive UI systems, typographic scales, and interactive prototypes.',
    keyOutputs: ['Design System', 'Responsive Desktop & Mobile UI', 'Interactive Figma Prototypes'],
  },
  {
    number: '04',
    title: 'Develop',
    duration: 'Weeks 5-7',
    description: 'Build, integrate and optimise. We write clean, performant TypeScript and modern React code, wiring integrations, databases, and automated enquiry pipelines.',
    keyOutputs: ['Clean Codebase', 'Integrations & Booking APIs', '100% Core Web Vitals Optimization'],
  },
  {
    number: '05',
    title: 'Launch & Grow',
    duration: 'Week 8 & Continuous',
    description: 'Deploy and continuously improve. We execute zero-downtime deployment, domain verification, search console indexing, and ongoing maintenance support.',
    keyOutputs: ['Production Launch', 'Search Engine Indexing', 'Continuous Monitoring & Growth'],
  },
];
