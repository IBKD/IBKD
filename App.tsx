
import React, { useState, useEffect, useRef } from 'react';
import { Language } from './types';
import { CONTENT } from './constants';
import LanguageSelector from './components/LanguageSelector';
import PetitionLetter from './components/PetitionLetter';
import SignatureForm from './components/SignatureForm';
import AdminPanel from './components/AdminPanel';
import LegalView from './components/LegalView'; // New component
import { Truck, Users, ArrowRight, Shield } from 'lucide-react';
import { logVisit, getSignatures } from './services/storageService';

type ViewState = 'landing' | 'admin' | 'imprint' | 'privacy';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [language, setLanguage] = useState<Language>(Language.DE);
  const [signatureCount, setSignatureCount] = useState<number>(287); // Default fallback
  const content = CONTENT[language];
  const hasLoggedVisit = useRef(false);

  useEffect(() => {
    // Analytics
    if (!hasLoggedVisit.current) {
      const params = new URLSearchParams(window.location.search);
      logVisit(params.get('ref'));
      hasLoggedVisit.current = true;
    }
    
    // Fetch real signature count
    getSignatures().then(sigs => {
       if (sigs.length > 0) setSignatureCount(sigs.length + 280); // Adding base offset for demo
    });
  }, []);

  const scrollToForm = () => {
    document.getElementById('sign-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (view === 'admin') {
    return <AdminPanel onLogout={() => setView('landing')} content={content} language={language} setLanguage={setLanguage} />;
  }
  
  if (view === 'imprint' || view === 'privacy') {
    return <LegalView type={view} language={language} onBack={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Truck size={24} />
              </div>
              <span className="font-bold text-xl hidden sm:block text-slate-800">
                Initiative BKD
              </span>
            </div>
            <LanguageSelector current={language} onChange={setLanguage} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
           <img 
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
            alt="Truck Front View" 
            className="w-full h-full object-cover object-center transform scale-150 translate-x-[20%] md:translate-x-[30%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/10 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl drop-shadow-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 mb-8 leading-relaxed max-w-2xl font-medium shadow-black">
              {content.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToForm}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-500/30"
              >
                {content.cta} <ArrowRight className="ml-2" />
              </button>
              <div className="inline-flex items-center justify-center px-8 py-4 border border-white/30 rounded-lg bg-black/40 backdrop-blur-sm text-white">
                <Users className="mr-2" size={20} />
                <span>{signatureCount} {content.supportersText}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <PetitionLetter content={content} />
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-24">
               <div className="bg-blue-900 text-white p-6 rounded-t-xl -mb-2 relative z-0">
                  <h3 className="font-bold text-lg mb-1">{content.calloutTitle}</h3>
                  <p className="text-blue-200 text-sm">{content.calloutSubtitle}</p>
               </div>
               <div className="relative z-10">
                 <SignatureForm content={content} language={language} />
               </div>
               <div className="mt-4 space-y-2">
                <p className="text-xs text-center text-gray-500">
                  {content.securityNote}
                </p>
                <p className="text-xs text-center text-gray-400">
                  {content.requirementNote}
                </p>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex justify-center items-center gap-2 mb-4 text-slate-800 font-bold">
            <Truck size={20} />
            <span>Initiative Berufskraftfahrer nach Deutschland</span>
          </div>
          <div className="flex gap-6 mb-6 text-sm text-gray-600">
             <button onClick={() => setView('imprint')} className="hover:text-blue-600">{content.legal.imprint}</button>
             <button onClick={() => setView('privacy')} className="hover:text-blue-600">{content.legal.privacy}</button>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            &copy; {new Date().getFullYear()} Initiative BKD. All rights reserved.
          </p>
          <button 
            onClick={() => setView('admin')} 
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            <Shield size={12} />
            Admin Login
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
