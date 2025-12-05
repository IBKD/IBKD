
import { CompanyForm, DriverForm, SignerType, VisitRecord, SignatureStatus, AdminRole, AdminUser } from "../types";
import { db, collection, addDoc, getDocs, orderBy, query, where, updateDoc, doc, deleteDoc } from './firebase';

const COLLECTION_NAME = 'signatures';
const VISITS_COLLECTION = 'visits';
const ADMINS_COLLECTION = 'admins';

// Fallback Super Admin Email (Change this to your actual email)
const FALLBACK_SUPER_ADMINS = ['levbay74@gmail.com', 'gundogdugonca06@gmail.com'];

// Feature Flags
const ENABLE_VISIT_TRACKING = true; 

export interface SignatureRecord {
  id: string;
  type: SignerType;
  date: string;
  status: SignatureStatus;
  data: DriverForm | CompanyForm;
}
// --- ADMIN MANAGEMENT FUNCTIONS ---

export const getAdminRole = async (email: string): Promise<AdminRole | null> => {
  if (!db || !email) return null;

  const normalizedEmail = email.toLowerCase().trim();

  // Fallback: Hardcoded Super Admin (prevent lockout)
  if (FALLBACK_SUPER_ADMINS.includes(normalizedEmail)) {
    return 'super_admin';
  }

  try {
    const q = query(
      collection(db, ADMINS_COLLECTION),
      where("email", "==", normalizedEmail)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data() as AdminUser;
      return data.role;
    }

    return null;
  } catch (e) {
    console.error("Error checking admin role:", e);
    return null;
  }
};


// --- LIST ALL ADMINS (Team-Tabelle) ---
export const getAdmins = async (): Promise<AdminUser[]> => {
  if (!db) return [];

  try {
    const snapshot = await getDocs(collection(db, ADMINS_COLLECTION));

    return snapshot.docs.map((doc) => {
      const data = doc.data() as AdminUser;
      return {
        id: doc.id,
        email: data.email,
        role: data.role,
        addedAt: data.addedAt ?? new Date().toISOString(),
      };
    });
  } catch (e) {
    console.error("Error loading admins:", e);
    return [];
  }
};


// --- ADD NEW ADMIN ---
export const addAdmin = async (
  email: string,
  role: AdminRole
): Promise<AdminUser> => {

  const normalizedEmail = email.toLowerCase().trim();
  const addedAt = new Date().toISOString();

  // Check duplicate
  const q = query(collection(db, ADMINS_COLLECTION), where("email", "==", normalizedEmail));
  const snap = await getDocs(q);
  if(!snap.empty) {
    throw new Error("Admin email already exists in allowlist.");
  }

  const ref = await addDoc(collection(db, ADMINS_COLLECTION), {
    email: normalizedEmail,
    role,
    addedAt,
  });

  return {
    id: ref.id,
    email: normalizedEmail,
    role,
    addedAt,
  };
};


// --- REMOVE ADMIN ---
export const removeAdmin = async (id: string): Promise<void> => {
  if (!id) return;
  await deleteDoc(doc(db, ADMINS_COLLECTION, id));
};

export const getSignatures = async (): Promise<SignatureRecord[]> => {
  if (!db) return [];
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const records: SignatureRecord[] = [];
    querySnapshot.forEach((doc) => {
      records.push({ id: doc.id, ...doc.data() } as SignatureRecord);
    });
    return records;
  } catch (e) {
    console.error("Error fetching signatures:", e);
    return [];
  }
};

export const checkDuplicate = async (type: SignerType, email: string): Promise<boolean> => {
  if (!db) return false;
  try {
    // Basic duplicate check by email AND type
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("data.email", "==", email),
      where("type", "==", type)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (e) {
    console.error("Duplicate check failed:", e);
    return false;
  }
};

export const saveSignature = async (type: SignerType, data: DriverForm | CompanyForm): Promise<SignatureRecord> => {
  if (!db) throw new Error("Database not initialized");

  const isDuplicate = await checkDuplicate(type, data.email);
  if (isDuplicate) {
    throw new Error("DUPLICATE_ENTRY");
  }

  const newRecordBase = {
    type,
    date: new Date().toISOString(),
    status: 'new', // Default status
    data
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newRecordBase);
  return { id: docRef.id, ...newRecordBase, status: 'new' };
};

export const updateSignatureStatus = async (id: string, status: SignatureStatus) => {
  if (!db) return;
  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, { status });
};

export const deleteSignature = async (id: string) => {
  if (!db) return;
  const ref = doc(db, COLLECTION_NAME, id);
  await deleteDoc(ref);
};

// --- ANALYTICS FUNCTIONS ---

export const logVisit = async (refSource: string | null) => {
  if (!db || !ENABLE_VISIT_TRACKING) return; 

  try {
    // 1. Get Geo Data (Anonymous if possible, client-side only for approximate location)
    let country = 'Unknown';
    let city = 'Unknown';
    
    try {
      const geoResponse = await fetch('https://ipapi.co/json/');
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        country = geoData.country_name || 'Unknown';
        city = geoData.city || 'Unknown';
      }
    } catch (err) {
      // Fail silently for privacy/blocking extensions
    }

    // 2. Save to Firestore
    const visitData: VisitRecord = {
      timestamp: new Date().toISOString(),
      source: refSource || 'direct',
      country,
      city
    };

    await addDoc(collection(db, VISITS_COLLECTION), visitData);
  } catch (e) {
    console.error("Analytics logging failed", e);
  }
};

export const getVisits = async (): Promise<VisitRecord[]> => {
  if (!db) return [];
  try {
    const q = query(collection(db, VISITS_COLLECTION), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    const visits: VisitRecord[] = [];
    querySnapshot.forEach((doc: any) => {
      visits.push(doc.data() as VisitRecord);
    });
    return visits;
  } catch (e) {
    console.error("Error fetching visits", e);
    return [];
  }
};
