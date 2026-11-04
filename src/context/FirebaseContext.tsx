import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  EnquiryFormData,
  StoredEnquiryRecord,
  EnquiryStatus,
  OpdAppointmentInput,
  StoredOpdRecord,
  OpdStatus,
  OpdSlot,
} from '../types';
import { AdminRole } from '../types/admin';
import {
  canPerformAdminAction,
  AdminPermissionAction,
  BOOTSTRAPPED_ADMIN_EMAIL,
  resolveFirebaseAdminRole,
} from '../utils/adminLogic';
import {
  sanitizeEnquiryPayload,
  sanitizeOpdPayload,
  generateSafeDocId,
} from '../utils/enquiryValidation';

const LOCAL_ENQUIRIES_KEY = 'aveniq_local_enquiries_v1';
const LOCAL_OPD_KEY = 'aveniq_local_opd_v1';

export { BOOTSTRAPPED_ADMIN_EMAIL, resolveFirebaseAdminRole };

interface FirebaseContextValue {
  user: User | null;
  isAuthReady: boolean;
  isRoleLoading: boolean;
  isAdmin: boolean;
  isBootstrappedSuperAdmin: boolean;
  adminRole: AdminRole | null;
  hasRolePermission: (action: AdminPermissionAction) => boolean;
  authError: string | null;
  enquiries: StoredEnquiryRecord[];
  opdAppointments: StoredOpdRecord[];
  unsyncedCount: number;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  submitEnquiry: (formData: EnquiryFormData) => Promise<StoredEnquiryRecord>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => Promise<void>;
  deleteEnquiryRecord: (id: string) => Promise<void>;
  submitOpdAppointment: (input: OpdAppointmentInput) => Promise<StoredOpdRecord>;
  updateOpdAppointmentStatus: (id: string, status: OpdStatus, preferredSlot?: OpdSlot) => Promise<void>;
  deleteOpdAppointmentRecord: (id: string) => Promise<void>;
  syncLocalRecordsToCloud: () => Promise<number>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

function parseTimestampToIso(val: unknown): string {
  if (val instanceof Timestamp) {
    return val.toDate().toISOString();
  }
  if (typeof val === 'string') {
    return val;
  }
  return new Date().toISOString();
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [cloudEnquiries, setCloudEnquiries] = useState<StoredEnquiryRecord[]>([]);
  const [cloudOpdAppointments, setCloudOpdAppointments] = useState<StoredOpdRecord[]>([]);

  const [localEnquiries, setLocalEnquiries] = useState<StoredEnquiryRecord[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_ENQUIRIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [localOpdAppointments, setLocalOpdAppointments] = useState<StoredOpdRecord[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_OPD_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(localEnquiries));
    } catch {
      // Ignore storage quota errors
    }
  }, [localEnquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_OPD_KEY, JSON.stringify(localOpdAppointments));
    } catch {
      // Ignore storage quota errors
    }
  }, [localOpdAppointments]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Resolve RBAC AdminRole from verified email + Firestore `/admins/{uid}` document
  useEffect(() => {
    let cancelled = false;

    async function verifyAdminRole() {
      if (!isAuthReady) return;

      if (!user || !user.emailVerified) {
        setAdminRole(null);
        setIsRoleLoading(false);
        return;
      }

      setIsRoleLoading(true);
      const adminDocPath = `admins/${user.uid}`;
      try {
        const adminSnap = await getDoc(doc(db, 'admins', user.uid));
        if (cancelled) return;
        const resolved = resolveFirebaseAdminRole({
          email: user.email,
          emailVerified: user.emailVerified,
          adminDocExists: adminSnap.exists(),
          adminDocData: adminSnap.exists() ? (adminSnap.data() as Record<string, unknown>) : null,
        });
        setAdminRole(resolved);
      } catch (error) {
        if (!cancelled) {
          // If the user is the verified bootstrapped Super Admin, preserve Super Admin access before reporting
          const fallbackRole = resolveFirebaseAdminRole({
            email: user.email,
            emailVerified: user.emailVerified,
            adminDocExists: false,
            adminDocData: null,
          });
          setAdminRole(fallbackRole);
          handleFirestoreError(error, OperationType.GET, adminDocPath);
        }
      } finally {
        if (!cancelled) {
          setIsRoleLoading(false);
        }
      }
    }

    verifyAdminRole();
    return () => {
      cancelled = true;
    };
  }, [isAuthReady, user]);

  const isBootstrappedSuperAdmin = Boolean(
    user &&
      user.emailVerified &&
      (user.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL ||
        user.email?.toLowerCase() === 'abhighodke8877@gmail.com')
  );
  const isAdmin = adminRole !== null;

  const hasRolePermission = useCallback(
    (action: AdminPermissionAction): boolean => {
      if (!adminRole) return false;
      return canPerformAdminAction(adminRole, action);
    },
    [adminRole]
  );

  // Attach Firestore onSnapshot listeners ONLY when auth & role resolution are ready and user is verified
  useEffect(() => {
    if (!isAuthReady || isRoleLoading || !user || !user.emailVerified) {
      setCloudEnquiries([]);
      setCloudOpdAppointments([]);
      return;
    }

    const enquiriesPath = 'enquiries';
    // Pillar 8 of firestore.rules: unconstrained list is permitted only for isBootstrappedAdmin();
    // all other users must query with where('ownerId', '==', user.uid).
    const enquiriesQuery = isBootstrappedSuperAdmin
      ? collection(db, enquiriesPath)
      : query(collection(db, enquiriesPath), where('ownerId', '==', user.uid));

    const unsubscribeEnquiries = onSnapshot(
      enquiriesQuery,
      (snapshot) => {
        const docs: StoredEnquiryRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            ownerId: String(d.ownerId || user.uid),
            fullName: String(d.fullName || ''),
            businessName: String(d.businessName || ''),
            email: String(d.email || ''),
            phone: String(d.phone || ''),
            country: String(d.country || ''),
            interestedService: d.interestedService || 'Hospital Website',
            budgetRange: String(d.budgetRange || ''),
            timeline: String(d.timeline || ''),
            projectDescription: String(d.projectDescription || ''),
            status: (d.status as EnquiryStatus) || 'submitted',
            createdAtIso: parseTimestampToIso(d.createdAt),
            updatedAtIso: parseTimestampToIso(d.updatedAt),
            syncedToCloud: true,
          };
        });
        docs.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
        setCloudEnquiries(docs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, enquiriesPath);
      }
    );

    const opdPath = 'opdAppointments';
    const opdQuery = isBootstrappedSuperAdmin
      ? collection(db, opdPath)
      : query(collection(db, opdPath), where('ownerId', '==', user.uid));

    const unsubscribeOpd = onSnapshot(
      opdQuery,
      (snapshot) => {
        const docs: StoredOpdRecord[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            ownerId: String(d.ownerId || user.uid),
            patientName: String(d.patientName || ''),
            department: d.department || 'Cardiology',
            leadDoctor: String(d.leadDoctor || ''),
            preferredSlot: d.preferredSlot || '10:30 AM',
            status: (d.status as OpdStatus) || 'requested',
            createdAtIso: parseTimestampToIso(d.createdAt),
            updatedAtIso: parseTimestampToIso(d.updatedAt),
            syncedToCloud: true,
          };
        });
        docs.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
        setCloudOpdAppointments(docs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, opdPath);
      }
    );

    return () => {
      unsubscribeEnquiries();
      unsubscribeOpd();
    };
  }, [isAuthReady, isRoleLoading, user, isBootstrappedSuperAdmin]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to complete Google Sign-In.';
      setAuthError(msg);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setAuthError(null);
    await signOut(auth);
  }, []);

  const submitEnquiry = useCallback(
    async (formData: EnquiryFormData): Promise<StoredEnquiryRecord> => {
      const sanitized = sanitizeEnquiryPayload(formData);
      const docId = generateSafeDocId('enq');
      const nowIso = new Date().toISOString();

      if (user && user.emailVerified) {
        const path = `enquiries/${docId}`;
        try {
          await setDoc(doc(db, 'enquiries', docId), {
            ownerId: user.uid,
            ...sanitized,
            status: 'submitted',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, path);
        }

        return {
          id: docId,
          ownerId: user.uid,
          ...sanitized,
          status: 'submitted',
          createdAtIso: nowIso,
          updatedAtIso: nowIso,
          syncedToCloud: true,
        };
      }

      const localRecord: StoredEnquiryRecord = {
        id: docId,
        ownerId: 'local_session',
        ...sanitized,
        status: 'submitted',
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        syncedToCloud: false,
      };
      setLocalEnquiries((prev) => [localRecord, ...prev]);
      return localRecord;
    },
    [user]
  );

  const updateEnquiryStatus = useCallback(
    async (id: string, status: EnquiryStatus) => {
      const isCloud = cloudEnquiries.some((e) => e.id === id);
      if (isCloud && user && user.emailVerified) {
        const path = `enquiries/${id}`;
        try {
          await updateDoc(doc(db, 'enquiries', id), {
            status,
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
        return;
      }

      setLocalEnquiries((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status, updatedAtIso: new Date().toISOString() }
            : item
        )
      );
    },
    [cloudEnquiries, user]
  );

  const deleteEnquiryRecord = useCallback(
    async (id: string) => {
      const isCloud = cloudEnquiries.some((e) => e.id === id);
      if (isCloud && user && user.emailVerified) {
        const path = `enquiries/${id}`;
        try {
          await deleteDoc(doc(db, 'enquiries', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, path);
        }
        return;
      }

      setLocalEnquiries((prev) => prev.filter((item) => item.id !== id));
    },
    [cloudEnquiries, user]
  );

  const submitOpdAppointment = useCallback(
    async (input: OpdAppointmentInput): Promise<StoredOpdRecord> => {
      const sanitized = sanitizeOpdPayload(input);
      const docId = generateSafeDocId('opd');
      const nowIso = new Date().toISOString();

      if (user && user.emailVerified) {
        const path = `opdAppointments/${docId}`;
        try {
          await setDoc(doc(db, 'opdAppointments', docId), {
            ownerId: user.uid,
            ...sanitized,
            status: 'requested',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, path);
        }

        return {
          id: docId,
          ownerId: user.uid,
          ...sanitized,
          status: 'requested',
          createdAtIso: nowIso,
          updatedAtIso: nowIso,
          syncedToCloud: true,
        };
      }

      const localRecord: StoredOpdRecord = {
        id: docId,
        ownerId: 'local_session',
        ...sanitized,
        status: 'requested',
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        syncedToCloud: false,
      };
      setLocalOpdAppointments((prev) => [localRecord, ...prev]);
      return localRecord;
    },
    [user]
  );

  const updateOpdAppointmentStatus = useCallback(
    async (id: string, status: OpdStatus, preferredSlot?: OpdSlot) => {
      const existingCloud = cloudOpdAppointments.find((o) => o.id === id);
      if (existingCloud && user && user.emailVerified) {
        const path = `opdAppointments/${id}`;
        try {
          await updateDoc(doc(db, 'opdAppointments', id), {
            status,
            preferredSlot: preferredSlot || existingCloud.preferredSlot,
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
        return;
      }

      setLocalOpdAppointments((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                preferredSlot: preferredSlot || item.preferredSlot,
                updatedAtIso: new Date().toISOString(),
              }
            : item
        )
      );
    },
    [cloudOpdAppointments, user]
  );

  const deleteOpdAppointmentRecord = useCallback(
    async (id: string) => {
      const isCloud = cloudOpdAppointments.some((o) => o.id === id);
      if (isCloud && user && user.emailVerified) {
        const path = `opdAppointments/${id}`;
        try {
          await deleteDoc(doc(db, 'opdAppointments', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, path);
        }
        return;
      }

      setLocalOpdAppointments((prev) => prev.filter((item) => item.id !== id));
    },
    [cloudOpdAppointments, user]
  );

  const syncLocalRecordsToCloud = useCallback(async (): Promise<number> => {
    if (!user || !user.emailVerified) return 0;
    let synced = 0;

    for (const enq of localEnquiries) {
      const sanitized = sanitizeEnquiryPayload(enq);
      const docId = generateSafeDocId('enq');
      const path = `enquiries/${docId}`;
      try {
        await setDoc(doc(db, 'enquiries', docId), {
          ownerId: user.uid,
          ...sanitized,
          status: 'submitted',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        synced++;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
    setLocalEnquiries([]);

    for (const opd of localOpdAppointments) {
      const sanitized = sanitizeOpdPayload(opd);
      const docId = generateSafeDocId('opd');
      const path = `opdAppointments/${docId}`;
      try {
        await setDoc(doc(db, 'opdAppointments', docId), {
          ownerId: user.uid,
          ...sanitized,
          status: 'requested',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        synced++;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
    setLocalOpdAppointments([]);

    return synced;
  }, [user, localEnquiries, localOpdAppointments]);

  const enquiries = [...cloudEnquiries, ...localEnquiries];
  const opdAppointments = [...cloudOpdAppointments, ...localOpdAppointments];
  const unsyncedCount = localEnquiries.length + localOpdAppointments.length;

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isAuthReady,
        isRoleLoading,
        isAdmin,
        isBootstrappedSuperAdmin,
        adminRole,
        hasRolePermission,
        authError,
        enquiries,
        opdAppointments,
        unsyncedCount,
        signInWithGoogle,
        signOutUser,
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiryRecord,
        submitOpdAppointment,
        updateOpdAppointmentStatus,
        deleteOpdAppointmentRecord,
        syncLocalRecordsToCloud,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebaseStudio() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebaseStudio must be used within a FirebaseProvider');
  }
  return ctx;
}
