
import React, { useState, useEffect } from 'react';
import { getSignatures, getVisits, SignatureRecord, updateSignatureStatus, deleteSignature, getAdminRole, getAdmins, addAdmin, removeAdmin } from '../services/storageService';
import { CompanyForm, DriverForm, VisitRecord, PetitionContent, SignatureStatus, Language, AdminRole, AdminUser } from '../types';
import { ShieldCheck, Lock, LogOut, Printer, Trash2, Users, Truck, Search, Download, Check, X, AlertCircle, Building2, UserPlus, Shield } from 'lucide-react';
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '../services/firebase';
import type { User } from '../services/firebase';
import LanguageSelector from './LanguageSelector';

interface Props {
  onLogout: () => void;
  content: PetitionContent;
  language: Language;
  setLanguage: (l: Language) => void;
}

const AdminPanel: React.FC<Props> = ({ onLogout, content, language, setLanguage }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<AdminRole | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Data State
  const [signatures, setSignatures] = useState<SignatureRecord[]>([]);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  
  // UI State
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<SignatureStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'team'>('dashboard');

  // Add Admin Form State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('admin');

  // Check Auth State and Role
  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth not initialized");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user && user.email) {

        // 🔐 Fallback: Levent ist immer Super-Admin, egal was im Admin-Table steht
        if (user.email === "levbay74@gmail.com") {
          const role: AdminRole = "super_admin";
          setCurrentUser(user);
          setCurrentRole(role);
          await loadData(role);
          setError("");
          setLoading(false);
          return;
        }

        // Standardpfad: Rolle aus der Admin-Allowlist holen
        const role = await getAdminRole(user.email);
        if (role) {
          setCurrentUser(user);
          setCurrentRole(role);
          loadData(role); // Load data if authorized
        } else {
          setCurrentUser(null);
          setCurrentRole(null);
          setError("Access Denied: Your email is not authorized.");
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const loadData = async (role: AdminRole) => {
    // Parallel fetch
    const [sigData, visitData] = await Promise.all([getSignatures(), getVisits()]);
    setSignatures(sigData);
    setVisits(visitData);

    // Only load admin list if Super Admin
    if (role === 'super_admin') {
      const adminList = await getAdmins();
      setAdmins(adminList);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!auth) {
      setError("Datenbank-Verbindung nicht verfügbar. Bitte Seite neu laden.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Logic continues in onAuthStateChanged
    } catch (err: any) {
      console.error("Login Error Details:", err);
      const debugMsg = err.code ? ` (${err.code})` : ` (${err.message})`;
      setError(content.auth.loginError + debugMsg);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    onLogout();
  };

  // --- Signature Actions ---
  const handleStatusChange = async (id: string, newStatus: SignatureStatus) => {
    await updateSignatureStatus(id, newStatus);
    setSignatures(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Sind Sie sicher?")) {
      await deleteSignature(id);
      setSignatures(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- Team Management Actions ---
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    try {
      const newAdmin = await addAdmin(newAdminEmail, newAdminRole);
      setAdmins(prev => [newAdmin, ...prev]);
      setNewAdminEmail('');
      alert("Admin added to Allowlist. NOTE: You must still create the Firebase Auth user in the Console if they don't have an account.");
    } catch (err: any) {
      alert("Error adding admin: " + err.message);
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (window.confirm("Remove this admin? They will lose access.")) {
      await removeAdmin(id);
      setAdmins(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Type", "Status", "Date", "Name/Company", "City", "Sector", "Licenses", "Email", "Phone"];
    const rows = signatures.map(s => {
      const data = s.data as any;
      const name = s.type === 'driver' ? data.fullName : data.companyName;
      const sector = s.type === 'driver' ? data.sector : '-';
      const licenses = s.type === 'driver' ? data.licenseClass.join(", ") : '-';
      return [s.id, s.type, s.status, s.date, `"${name}"`, data.city, sector, `"${licenses}"`, data.email, data.phoneNumber].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "signatures_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  // --- Filtering & Splitting Logic ---
  const filteredSignatures = signatures.filter(s => {
    if (s.status === 'deleted') return false; 
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    
    const searchLower = filterText.toLowerCase();
    const data = s.data as any;
    const name = s.type === 'driver' ? data.fullName : data.companyName;
    return name?.toLowerCase().includes(searchLower) || data.email?.toLowerCase().includes(searchLower);
  });

  const companySignatures = filteredSignatures.filter(s => s.type === 'company');
  const driverSignatures = filteredSignatures.filter(s => s.type === 'driver');

  // --- Stats Calculation ---
  const drivers = signatures.filter(s => s.type === 'driver' && s.status !== 'deleted');
  const freightDrivers = drivers.filter(s => (s.data as DriverForm).sector === 'freight' || (s.data as DriverForm).sector === 'both').length;
  const passengerDrivers = drivers.filter(s => (s.data as DriverForm).sector === 'passenger' || (s.data as DriverForm).sector === 'both').length;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!auth) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700">
         <div className="text-center p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Verbindungsfehler</h2>
            <p>Die Datenbank konnte nicht initialisiert werden.</p>
            <button onClick={onLogout} className="mt-4 underline">Zurück zur Startseite</button>
         </div>
       </div>
    );
  }

  // Not logged in or Not Authorized
  if (!currentUser || !currentRole) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-3 rounded-full text-white"><Lock size={32} /></div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">{content.auth.loginTitle}</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={content.auth.emailPlaceholder}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={content.auth.passwordPlaceholder}
            />
            {error && <p className="text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>}
            <button type="submit" className="w-full py-2 px-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
              {content.auth.loginBtn}
            </button>
            <button type="button" onClick={onLogout} className="w-full py-2 px-4 text-gray-500 text-sm hover:text-gray-700">
              {content.legal.back}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const ActionButtons = ({ id }: { id: string }) => (
    <div className="flex justify-end gap-2 no-print">
      <button onClick={() => handleStatusChange(id, 'verified')} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Verify"><Check size={16} /></button>
      <button onClick={() => handleStatusChange(id, 'duplicate')} className="text-orange-600 hover:bg-orange-50 p-1 rounded" title="Mark Duplicate"><X size={16} /></button>
      {/* Delete only allowed for Super Admins */}
      {currentRole === 'super_admin' && (
        <button onClick={() => handleDelete(id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Delete"><Trash2 size={16} /></button>
      )}
    </div>
  );

  const t = content.adminPanel;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" id="admin-panel-root">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-orange-500" />
            <span className="font-bold text-lg hidden md:block">{t.title}</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-gray-300">
              {currentRole === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Tab Navigation if Super Admin */}
            {currentRole === 'super_admin' && (
               <div className="mr-4 flex gap-1 bg-slate-800 p-1 rounded">
                 <button 
                   onClick={() => setActiveTab('dashboard')} 
                   className={`px-3 py-1 text-sm rounded transition-colors ${activeTab === 'dashboard' ? 'bg-slate-600 text-white' : 'text-gray-400 hover:text-white'}`}
                 >
                   Dashboard
                 </button>
                 <button 
                   onClick={() => setActiveTab('team')} 
                   className={`px-3 py-1 text-sm rounded transition-colors ${activeTab === 'team' ? 'bg-slate-600 text-white' : 'text-gray-400 hover:text-white'}`}
                 >
                   {t.team.tabTitle}
                 </button>
               </div>
            )}

            <LanguageSelector current={language} onChange={setLanguage} />
            <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>
            <button onClick={() => window.print()} className="p-2 hover:bg-slate-700 rounded"><Printer size={18} /></button>
            <button onClick={handleExportCSV} className="p-2 hover:bg-slate-700 rounded"><Download size={18} /></button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm">
              <LogOut size={16} /> <span className="hidden sm:inline">{content.auth.logoutBtn}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        
        {/* === TEAM TAB (Super Admin Only) === */}
        {activeTab === 'team' && currentRole === 'super_admin' ? (
          <div className="animate-fade-in">
             {/* Add Admin Form */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <UserPlus size={20} /> {t.team.addTitle}
               </h3>
               <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4 items-end">
                 <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.team.emailLabel}</label>
                    <input 
                      type="email" 
                      required
                      value={newAdminEmail}
                      onChange={e => setNewAdminEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.team.roleLabel}</label>
                    <select 
                      value={newAdminRole}
                      onChange={e => setNewAdminRole(e.target.value as AdminRole)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">{t.team.roleAdmin}</option>
                      <option value="super_admin">{t.team.roleSuper}</option>
                    </select>
                 </div>
                 <button type="submit" className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                    {t.team.addBtn}
                 </button>
               </form>
             </div>

             {/* Admin List Table */}
             <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
               <table className="min-w-full divide-y divide-gray-200 text-sm">
                 <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold text-gray-700 uppercase">{t.team.tableEmail}</th>
                      <th className="px-6 py-3 text-left font-bold text-gray-700 uppercase">{t.team.tableRole}</th>
                      <th className="px-6 py-3 text-left font-bold text-gray-700 uppercase">{t.team.tableAdded}</th>
                      <th className="px-6 py-3 text-right font-bold text-gray-700 uppercase">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200">
                    {admins.map(admin => (
                      <tr key={admin.id || admin.email}>
                        <td className="px-6 py-4">{admin.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(admin.addedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleRemoveAdmin(admin.id!)} className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded">
                             <Trash2 size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
          </div>
        ) : (
          /* === DASHBOARD CONTENT === */
          <div className="animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 print:grid-cols-4 print:gap-2 print:mb-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-black print:p-2">
                <div className="text-sm text-gray-500 font-medium uppercase">{t.dashboard.total}</div>
                <div className="text-3xl font-bold text-slate-900">{signatures.length}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-black print:p-2">
                 <div className="text-sm text-gray-500 font-medium uppercase">{t.dashboard.freight}</div>
                 <div className="text-3xl font-bold text-blue-600 print:text-black">{freightDrivers}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-black print:p-2">
                 <div className="text-sm text-gray-500 font-medium uppercase">{t.dashboard.passenger}</div>
                 <div className="text-3xl font-bold text-orange-600 print:text-black">{passengerDrivers}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-black print:p-2">
                 <div className="text-sm text-gray-500 font-medium uppercase">{t.dashboard.views}</div>
                 <div className="text-3xl font-bold text-indigo-600 print:text-black">{visits.length}</div>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 no-print">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder={t.filter.searchPlaceholder} 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                />
              </div>
              <select 
                className="border rounded-lg px-4 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">{t.filter.statusAll}</option>
                <option value="new">{t.filter.statusNew}</option>
                <option value="verified">{t.filter.statusVerified}</option>
                <option value="duplicate">{t.filter.statusDuplicate}</option>
              </select>
            </div>

            {/* COMPANIES TABLE */}
            <div className="mb-12 break-after-page">
              <div className="flex items-center gap-2 mb-4 text-slate-800 border-b border-slate-200 pb-2">
                <Building2 size={24} />
                <h2 className="text-xl font-bold">{t.tables.companies}</h2>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{companySignatures.length}</span>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200 print:shadow-none print:border-none print:overflow-visible">
                <table className="min-w-full divide-y divide-gray-200 text-sm print:border-collapse">
                  <thead className="bg-gray-50 print:bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.status}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.company}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.owner}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.contact}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.fleet}</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700 uppercase no-print">{t.tables.cols.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {companySignatures.map((sig) => {
                      const data = sig.data as CompanyForm;
                      return (
                        <tr key={sig.id} className={sig.status === 'duplicate' ? 'bg-red-50' : ''}>
                           <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase print:border print:border-black
                              ${sig.status === 'verified' ? 'bg-green-100 text-green-800' : 
                                sig.status === 'duplicate' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                              {sig.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {data.companyName} <span className="text-gray-500 font-normal">({data.companyType})</span>
                          </td>
                          <td className="px-4 py-3">
                            {data.ownerName}
                          </td>
                          <td className="px-4 py-3">
                             <div>{data.email}</div>
                             <div className="text-gray-500">{data.phoneNumber}</div>
                             <div className="text-xs mt-1 text-gray-400">{data.zipCode} {data.city}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-4">
                               <div><span className="font-bold">{data.truckCount}</span> <span className="text-xs text-gray-500">Trucks</span></div>
                               <div><span className="font-bold text-orange-600">{data.driverDemand}</span> <span className="text-xs text-gray-500">Demand</span></div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right no-print">
                            <ActionButtons id={sig.id} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {companySignatures.length === 0 && <div className="p-8 text-center text-gray-400">{t.tables.emptyCompanies}</div>}
              </div>
            </div>

            {/* DRIVERS TABLE */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-slate-800 border-b border-slate-200 pb-2">
                <Truck size={24} />
                <h2 className="text-xl font-bold">{t.tables.drivers}</h2>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{driverSignatures.length}</span>
              </div>

              <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200 print:shadow-none print:border-none print:overflow-visible">
                <table className="min-w-full divide-y divide-gray-200 text-sm print:border-collapse">
                  <thead className="bg-gray-50 print:bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.status}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.name}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.location}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.licenses}</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">{t.tables.cols.sector}</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-700 uppercase no-print">{t.tables.cols.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {driverSignatures.map((sig) => {
                      const data = sig.data as DriverForm;
                      return (
                        <tr key={sig.id} className={sig.status === 'duplicate' ? 'bg-red-50' : ''}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase print:border print:border-black
                              ${sig.status === 'verified' ? 'bg-green-100 text-green-800' : 
                                sig.status === 'duplicate' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                              {sig.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold">{data.fullName}</div>
                            <div className="text-xs text-gray-500">{data.email}</div>
                            <div className="text-xs text-gray-400">{data.phoneNumber}</div>
                          </td>
                          <td className="px-4 py-3">
                            {data.zipCode} {data.city}
                          </td>
                          <td className="px-4 py-3 max-w-xs break-words">
                            {data.licenseClass.map(l => (
                              <span key={l} className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-xs mr-1 mb-1 border border-slate-200">{l}</span>
                            ))}
                          </td>
                          <td className="px-4 py-3">
                             <span className={`text-xs font-bold uppercase ${data.sector === 'passenger' ? 'text-orange-600' : 'text-blue-600'}`}>
                               {data.sector}
                             </span>
                          </td>
                          <td className="px-4 py-3 text-right no-print">
                             <ActionButtons id={sig.id} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                 {driverSignatures.length === 0 && <div className="p-8 text-center text-gray-400">{t.tables.emptyDrivers}</div>}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
