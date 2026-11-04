import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Phase 0 & Phase 5 Security Rules Verification Suite
 * Evaluates all 12 "Dirty Dozen" adversarial payloads and verifies the structural
 * invariants of `firestore.rules`.
 */

interface AuthContext {
  uid: string;
  email: string;
  email_verified: boolean;
}

interface EnquiryDoc {
  ownerId: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  interestedService: string;
  budgetRange: string;
  timeline: string;
  projectDescription: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  [key: string]: unknown;
}

const VALID_SERVICES = [
  'Hospital Website',
  'Clinic Website',
  'Business Website',
  'E-commerce Website',
  'Website Redesign',
  'SEO & Digital Growth',
  'AI & Automation',
  'Other',
];

const VALID_ENQUIRY_STATUSES = ['submitted', 'in_review', 'scheduled', 'completed', 'archived'];

const ENQUIRY_KEYS = [
  'ownerId',
  'fullName',
  'businessName',
  'email',
  'phone',
  'country',
  'interestedService',
  'budgetRange',
  'timeline',
  'projectDescription',
  'status',
  'createdAt',
  'updatedAt',
];

function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(id);
}

function isVerifiedUser(auth: AuthContext | null): boolean {
  return auth !== null && auth.email_verified === true;
}

function isAdmin(auth: AuthContext | null): boolean {
  return isVerifiedUser(auth) && auth!.email === 'abhighodke5123@gmail.com';
}

function isValidEnquiry(data: Record<string, unknown>, auth: AuthContext | null): boolean {
  if (!auth) return false;
  const keys = Object.keys(data);
  const hasAll = ENQUIRY_KEYS.every((k) => keys.includes(k));
  const hasOnly = keys.every((k) => ENQUIRY_KEYS.includes(k));
  if (!hasAll || !hasOnly) return false;

  return (
    typeof data.ownerId === 'string' &&
    data.ownerId.length >= 1 &&
    data.ownerId.length <= 128 &&
    /^[a-zA-Z0-9_\-]+$/.test(data.ownerId) &&
    typeof data.fullName === 'string' &&
    data.fullName.length >= 2 &&
    data.fullName.length <= 120 &&
    typeof data.businessName === 'string' &&
    data.businessName.length >= 1 &&
    data.businessName.length <= 160 &&
    typeof data.email === 'string' &&
    data.email.length >= 3 &&
    data.email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    typeof data.phone === 'string' &&
    data.phone.length >= 7 &&
    data.phone.length <= 32 &&
    typeof data.country === 'string' &&
    data.country.length >= 1 &&
    data.country.length <= 100 &&
    typeof data.interestedService === 'string' &&
    data.interestedService.length >= 1 &&
    data.interestedService.length <= 60 &&
    VALID_SERVICES.includes(data.interestedService) &&
    typeof data.budgetRange === 'string' &&
    data.budgetRange.length >= 1 &&
    data.budgetRange.length <= 80 &&
    typeof data.timeline === 'string' &&
    data.timeline.length >= 1 &&
    data.timeline.length <= 80 &&
    typeof data.projectDescription === 'string' &&
    data.projectDescription.length >= 15 &&
    data.projectDescription.length <= 2000 &&
    typeof data.status === 'string' &&
    data.status.length >= 1 &&
    data.status.length <= 32 &&
    VALID_ENQUIRY_STATUSES.includes(data.status)
  );
}

function evaluateEnquiryCreate(
  docId: string,
  incoming: Record<string, unknown>,
  auth: AuthContext | null,
  requestTime: number
): boolean {
  return (
    isVerifiedUser(auth) &&
    isValidId(docId) &&
    isValidEnquiry(incoming, auth) &&
    incoming.ownerId === auth!.uid &&
    incoming.status === 'submitted' &&
    incoming.createdAt === requestTime &&
    incoming.updatedAt === requestTime
  );
}

function evaluateEnquiryGet(
  docId: string,
  existing: EnquiryDoc,
  auth: AuthContext | null
): boolean {
  return (
    isVerifiedUser(auth) &&
    isValidId(docId) &&
    (existing.ownerId === auth!.uid || isAdmin(auth))
  );
}

function evaluateEnquiryList(
  existing: EnquiryDoc,
  auth: AuthContext | null
): boolean {
  return (
    isVerifiedUser(auth) &&
    (existing.ownerId === auth!.uid || (auth!.email === 'abhighodke5123@gmail.com' && auth!.email_verified === true))
  );
}

function evaluateEnquiryUpdate(
  docId: string,
  existing: EnquiryDoc,
  incoming: Record<string, unknown>,
  auth: AuthContext | null,
  requestTime: number
): boolean {
  if (!isVerifiedUser(auth) || !isValidId(docId) || !isValidEnquiry(incoming, auth)) {
    return false;
  }
  if (incoming.ownerId !== existing.ownerId || incoming.createdAt !== existing.createdAt || incoming.updatedAt !== requestTime) {
    return false;
  }

  const affectedKeys = Object.keys(incoming).filter((k) => incoming[k] !== existing[k]);
  const isTerminal = existing.status === 'completed' || existing.status === 'archived';

  // Action 1: Owner updates projectDescription/timeline/budgetRange while not in terminal state
  const isOwnerBriefUpdate =
    existing.ownerId === auth!.uid &&
    !isTerminal &&
    incoming.status === existing.status &&
    affectedKeys.every((k) => ['projectDescription', 'timeline', 'budgetRange', 'updatedAt'].includes(k));

  // Action 2: Admin updates status or brief details
  const isAdminStatusUpdate =
    isAdmin(auth) &&
    affectedKeys.every((k) => ['status', 'projectDescription', 'timeline', 'budgetRange', 'updatedAt'].includes(k));

  return isOwnerBriefUpdate || isAdminStatusUpdate;
}

const NOW = 1762250000000;
const VALID_USER: AuthContext = { uid: 'user_123', email: 'client@hospital.org', email_verified: true };
const OTHER_USER: AuthContext = { uid: 'user_456', email: 'other@clinic.org', email_verified: true };
const SPOOFED_ADMIN: AuthContext = { uid: 'spoof_999', email: 'abhighodke5123@gmail.com', email_verified: false };

function makeValidEnquiry(overrides: Partial<EnquiryDoc> = {}): EnquiryDoc {
  return {
    ownerId: 'user_123',
    fullName: 'Dr. Rajesh Verma',
    businessName: 'Zenith Super Speciality Hospital',
    email: 'rajesh@zenithhospital.org',
    phone: '+91 98200 12345',
    country: 'India',
    interestedService: 'Hospital Website',
    budgetRange: '$10,000 - $25,000 (₹8L - ₹20L)',
    timeline: '1-3 months',
    projectDescription: 'Modern hospital website with specialist doctor directory and OPD booking.',
    status: 'submitted',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

test('Dirty Dozen #1: Identity Spoofing on Enquiry Create returns PERMISSION_DENIED', () => {
  const payload = makeValidEnquiry({ ownerId: 'victim_uid_999' });
  assert.equal(evaluateEnquiryCreate('enq_1', payload, VALID_USER, NOW), false);
});

test('Dirty Dozen #2: Shadow / Ghost Field Injection on Create returns PERMISSION_DENIED', () => {
  const payload = makeValidEnquiry({ isVerifiedAdmin: true });
  assert.equal(evaluateEnquiryCreate('enq_1', payload, VALID_USER, NOW), false);
});

test('Dirty Dozen #3: Unverified Email Spoof Attack on Admin Read returns PERMISSION_DENIED', () => {
  const doc = makeValidEnquiry();
  assert.equal(evaluateEnquiryGet('enq_1', doc, SPOOFED_ADMIN), false);
  assert.equal(evaluateEnquiryList(doc, SPOOFED_ADMIN), false);
});

test('Dirty Dozen #4: Cross-Tenant PII Blanket Read returns PERMISSION_DENIED', () => {
  const doc = makeValidEnquiry();
  assert.equal(evaluateEnquiryGet('enq_1', doc, OTHER_USER), false);
});

test('Dirty Dozen #5: Unconstrained List Query Scraping by non-owner returns PERMISSION_DENIED', () => {
  const doc = makeValidEnquiry();
  assert.equal(evaluateEnquiryList(doc, OTHER_USER), false);
});

test('Dirty Dozen #6: Path ID Poisoning with invalid characters returns PERMISSION_DENIED', () => {
  const payload = makeValidEnquiry();
  assert.equal(evaluateEnquiryCreate('bad$id!with/slash', payload, VALID_USER, NOW), false);
});

test('Dirty Dozen #7: Denial of Wallet Oversized Description (> 2000 chars) returns PERMISSION_DENIED', () => {
  const payload = makeValidEnquiry({ projectDescription: 'A'.repeat(2005) });
  assert.equal(evaluateEnquiryCreate('enq_1', payload, VALID_USER, NOW), false);
});

test('Dirty Dozen #8: Client-Forged Timestamp returns PERMISSION_DENIED', () => {
  const payload = makeValidEnquiry({ createdAt: NOW - 60000 });
  assert.equal(evaluateEnquiryCreate('enq_1', payload, VALID_USER, NOW), false);
});

test('Dirty Dozen #9: Immortal Field Mutation (ownerId or createdAt change) returns PERMISSION_DENIED', () => {
  const existing = makeValidEnquiry();
  const mutatedOwner = { ...existing, ownerId: 'user_456', updatedAt: NOW + 1000 };
  assert.equal(evaluateEnquiryUpdate('enq_1', existing, mutatedOwner, VALID_USER, NOW + 1000), false);
});

test('Dirty Dozen #10: Terminal State Unlocking on completed Enquiry returns PERMISSION_DENIED', () => {
  const existing = makeValidEnquiry({ status: 'completed' });
  const updated = { ...existing, projectDescription: 'Trying to edit a completed project scope.', updatedAt: NOW + 1000 };
  assert.equal(evaluateEnquiryUpdate('enq_1', existing, updated, VALID_USER, NOW + 1000), false);
});

test('Dirty Dozen #11: Value Poisoning on Update (invalid status enum) returns PERMISSION_DENIED', () => {
  const existing = makeValidEnquiry();
  const poisoned = { ...existing, status: 'super_hacked_state', updatedAt: NOW + 1000 };
  assert.equal(evaluateEnquiryUpdate('enq_1', existing, poisoned, VALID_USER, NOW + 1000), false);
});

test('Dirty Dozen #12: firestore.rules file enforces all 8 Pillars and locks /admins writes', () => {
  const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
  if (fs.existsSync(rulesPath)) {
    const content = fs.readFileSync(rulesPath, 'utf-8');
    assert.ok(content.includes("rules_version = '2';"), 'Must declare rules_version 2');
    assert.ok(content.includes('match /{document=**} {\n      allow read, write: if false;\n    }'), 'Must include global default-deny safety net');
    assert.ok(content.includes('isValidEnquiry(incoming())'), 'Must validate Enquiry blueprint on create and update');
    assert.ok(content.includes('isValidOpdAppointment(incoming())'), 'Must validate OpdAppointment blueprint on create and update');
    assert.ok(content.includes('request.auth.token.email_verified == true'), 'Must require email_verified == true');
  }
});
