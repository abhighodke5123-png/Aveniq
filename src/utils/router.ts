export type PageId = 'home' | 'services' | 'industries' | 'work' | 'about' | 'contact';

export interface RouteInfo {
  page: PageId;
  title: string;
  label: string;
  badgeNumber: string;
}

export const ROUTES: Record<PageId, RouteInfo> = {
  home: {
    page: 'home',
    title: 'AVENIQ | Digital Experience Studio',
    label: 'Home',
    badgeNumber: '01',
  },
  services: {
    page: 'services',
    title: 'Services & Capabilities | AVENIQ',
    label: 'Services',
    badgeNumber: '02',
  },
  industries: {
    page: 'industries',
    title: 'Industries & Sectors | AVENIQ',
    label: 'Industries',
    badgeNumber: '03',
  },
  work: {
    page: 'work',
    title: 'Selected Work & Concept Projects | AVENIQ',
    label: 'Work',
    badgeNumber: '04',
  },
  about: {
    page: 'about',
    title: 'About the Studio & Philosophy | AVENIQ',
    label: 'About',
    badgeNumber: '05',
  },
  contact: {
    page: 'contact',
    title: 'Start a Project | AVENIQ',
    label: 'Contact',
    badgeNumber: '06',
  },
};

export function parsePageFromPath(pathOrHash: string): PageId {
  const clean = pathOrHash.toLowerCase().replace(/^[/#]+/, '').trim();
  const base = clean.split(/[?#]/)[0];

  if (base === 'services') return 'services';
  if (base === 'industries') return 'industries';
  if (base === 'work') return 'work';
  if (base === 'about') return 'about';
  if (base === 'contact' || base === 'start-a-project') return 'contact';

  return 'home';
}

export function formatPageUrl(page: PageId): string {
  if (page === 'home') return '#/';
  return `#/${page}`;
}
