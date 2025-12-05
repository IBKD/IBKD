
export enum Language {
  DE = 'de',
  EN = 'en',
  TR = 'tr'
}

export type SignerType = 'driver' | 'company';
export type Sector = 'freight' | 'passenger' | 'both'; 
export type SignatureStatus = 'new' | 'verified' | 'duplicate' | 'deleted'; 

// NEW: Admin Roles
export type AdminRole = 'super_admin' | 'admin';

export interface AdminUser {
  id?: string;
  email: string;
  role: AdminRole;
  addedAt: string;
}

export interface DriverForm {
  fullName: string;
  birthDate: string;
  licenseClass: string[]; 
  sector: Sector; 
  street: string;
  zipCode: string;
  city: string;
  email: string;
  phoneNumber: string;
  privacyAccepted: boolean; 
  emailVerified: boolean; 
}

export interface CompanyForm {
  ownerName: string;
  ownerBirthDate: string;
  companyName: string;
  companyType: string;
  street: string;
  zipCode: string;
  city: string;
  truckCount: number;
  driverDemand: number;
  email: string;
  phoneNumber: string;
  privacyAccepted: boolean; 
  emailVerified: boolean; 
}

export interface VisitRecord {
  id?: string;
  timestamp: string;
  source: string;
  country: string;
  city: string;
}

export interface PetitionContent {
  title: string;
  subtitle: string;
  institutionsTitle: string;
  institutions: string[];
  cta: string;
  calloutTitle: string;
  calloutSubtitle: string;
  supportersText: string;
  roles: {
    representative: string;
    individual: string;
  };
  formTitles: {
    driver: string;
    company: string;
  };
  fields: {
    name: string;
    dob: string;
    license: string;
    sector: string; 
    sectorOptions: {
      freight: string;
      passenger: string;
      both: string;
    };
    street: string;
    zip: string;
    city: string;
    owner: string;
    company: string;
    legalForm: string;
    trucks: string;
    demand: string;
    email: string;
    phone: string;
    privacyLabel: string; 
  };
  errors: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    invalidDate: string;
    duplicate: string; 
    privacyRequired: string; 
  };
  letterSubject: string;
  letterBody: string;
  successMessage: string;
  shareTitle: string; 
  shareMessage: string; 
  securityNote: string;
  requirementNote: string;
  legal: {
    imprint: string;
    privacy: string;
    back: string;
  };
  auth: {
    loginTitle: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    loginBtn: string;
    logoutBtn: string;
    loginError: string;
  };
  // Admin Section
  adminPanel: {
    title: string;
    dashboard: {
      total: string;
      freight: string;
      passenger: string;
      views: string;
    };
    filter: {
      searchPlaceholder: string;
      statusAll: string;
      statusNew: string;
      statusVerified: string;
      statusDuplicate: string;
    };
    // New: Team Management
    team: {
      tabTitle: string;
      addTitle: string;
      emailLabel: string;
      roleLabel: string;
      addBtn: string;
      tableEmail: string;
      tableRole: string;
      tableAdded: string;
      roleSuper: string;
      roleAdmin: string;
    };
    tables: {
      companies: string;
      drivers: string;
      emptyCompanies: string;
      emptyDrivers: string;
      cols: {
        status: string;
        company: string;
        owner: string;
        contact: string;
        fleet: string;
        actions: string;
        name: string;
        location: string;
        licenses: string;
        sector: string;
      };
    };
  };
}
