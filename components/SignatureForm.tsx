
import React, { useState } from 'react';
import { Language, SignerType, DriverForm, CompanyForm, PetitionContent, Sector } from '../types';
import { CheckCircle2, Truck, Building2, PenTool, AlertCircle, Share2, Facebook, Linkedin, Send, Copy, Check } from 'lucide-react';
import { generateThankYouMessage } from '../services/geminiService';
import { saveSignature } from '../services/storageService';
import { LICENSE_CLASSES } from '../constants';

// Feature Flag
const ENABLE_GEMINI_THANKYOU = true;

interface Props {
  content: PetitionContent;
  language: Language;
}

const SignatureForm: React.FC<Props> = ({ content, language }) => {
  const [activeTab, setActiveTab] = useState<SignerType>('company');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [driverData, setDriverData] = useState<DriverForm>({
    fullName: '', birthDate: '', licenseClass: [], sector: 'freight', street: '', zipCode: '', city: '', email: '', phoneNumber: '', privacyAccepted: false, emailVerified: false
  });

  const [companyData, setCompanyData] = useState<CompanyForm>({
    ownerName: '', ownerBirthDate: '', companyName: '', companyType: '', street: '', zipCode: '', city: '', truckCount: 0, driverDemand: 0, email: '', phoneNumber: '', privacyAccepted: false, emailVerified: false
  });

  const getPhonePlaceholder = () => {
    switch (language) {
      case Language.DE: return "+49 170 12345678";
      case Language.TR: return "+90 532 123 45 67";
      default: return "+1 555 123 4567";
    }
  };

  const handlePhoneChange = (val: string, type: 'driver' | 'company') => {
    const sanitized = val.replace(/[^0-9+\-()\s]/g, '');
    if (type === 'driver') setDriverData(prev => ({ ...prev, phoneNumber: sanitized }));
    else setCompanyData(prev => ({ ...prev, phoneNumber: sanitized }));
  };

  const toggleDriverLicense = (lic: string) => {
    setDriverData(prev => {
      const exists = prev.licenseClass.includes(lic);
      if (exists) return { ...prev, licenseClass: prev.licenseClass.filter(l => l !== lic) };
      return { ...prev, licenseClass: [...prev.licenseClass, lic] };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const today = new Date();
    const minDate = new Date("1900-01-01");

    const isValidDate = (dateStr: string) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) && d <= today && d >= minDate;
    };
    
    if (activeTab === 'driver') {
      if (!driverData.fullName.trim()) newErrors.fullName = content.errors.required;
      if (!driverData.birthDate) newErrors.birthDate = content.errors.required;
      else if (!isValidDate(driverData.birthDate)) newErrors.birthDate = content.errors.invalidDate;
      if (driverData.licenseClass.length === 0) newErrors.licenseClass = content.errors.required;
      if (!driverData.street.trim()) newErrors.street = content.errors.required;
      if (!driverData.zipCode.trim()) newErrors.zipCode = content.errors.required;
      if (!driverData.city.trim()) newErrors.city = content.errors.required;
      if (!driverData.email.trim()) newErrors.email = content.errors.required;
      else if (!emailRegex.test(driverData.email)) newErrors.email = content.errors.invalidEmail;
      if (!driverData.phoneNumber.trim()) newErrors.phoneNumber = content.errors.required;
      if (!driverData.privacyAccepted) newErrors.privacyAccepted = content.errors.privacyRequired;
    } else {
      if (!companyData.companyName.trim()) newErrors.companyName = content.errors.required;
      if (!companyData.companyType.trim()) newErrors.companyType = content.errors.required;
      if (!companyData.ownerName.trim()) newErrors.ownerName = content.errors.required;
      if (!companyData.ownerBirthDate) newErrors.ownerBirthDate = content.errors.required;
      else if (!isValidDate(companyData.ownerBirthDate)) newErrors.ownerBirthDate = content.errors.invalidDate;
      if (!companyData.street.trim()) newErrors.street = content.errors.required;
      if (!companyData.zipCode.trim()) newErrors.zipCode = content.errors.required;
      if (!companyData.city.trim()) newErrors.city = content.errors.required;
      if (companyData.truckCount < 0) newErrors.truckCount = content.errors.required;
      if (companyData.driverDemand < 0) newErrors.driverDemand = content.errors.required;
      if (!companyData.email.trim()) newErrors.email = content.errors.required;
      else if (!emailRegex.test(companyData.email)) newErrors.email = content.errors.invalidEmail;
      if (!companyData.phoneNumber.trim()) newErrors.phoneNumber = content.errors.required;
      if (!companyData.privacyAccepted) newErrors.privacyAccepted = content.errors.privacyRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'linkedin' | 'twitter') => {
    // Check for blob URL (local preview) which fails on Facebook
    if (window.location.protocol === 'blob:') {
        alert("Sharing requires a live URL. In this preview mode, please use 'Copy Link'.");
        return;
    }

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(content.shareMessage);
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
    }
    window.open(shareUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const dataToSave = activeTab === 'driver' ? driverData : companyData;
      await saveSignature(activeTab, dataToSave);
      
      const name = activeTab === 'driver' ? driverData.fullName : companyData.ownerName;
      let msg = "";
      
      if (ENABLE_GEMINI_THANKYOU) {
        msg = await generateThankYouMessage(language, activeTab, name);
      } else {
        msg = content.successMessage;
      }
      
      setAiMessage(msg);
      setIsSuccess(true);
      
      // Reset logic
      if (activeTab === 'driver') {
        setDriverData({ fullName: '', birthDate: '', licenseClass: [], sector: 'freight', street: '', zipCode: '', city: '', email: '', phoneNumber: '', privacyAccepted: false, emailVerified: false });
      } else {
        setCompanyData({ ownerName: '', ownerBirthDate: '', companyName: '', companyType: '', street: '', zipCode: '', city: '', truckCount: 0, driverDemand: 0, email: '', phoneNumber: '', privacyAccepted: false, emailVerified: false });
      }
      setErrors({});
    } catch (err: any) {
      if (err.message === 'DUPLICATE_ENTRY') {
        setErrorMessage(content.errors.duplicate);
      } else {
        console.error("Submission error", err);
        setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center shadow-lg animate-fade-in">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">{content.successMessage}</h3>
        <p className="text-green-700 italic mb-8">"{aiMessage}"</p>
        
        <div className="border-t border-green-200 pt-6">
          <h4 className="text-sm font-bold text-green-800 uppercase mb-4">{content.shareTitle}</h4>
          <div className="flex justify-center gap-4">
            <button onClick={() => handleShare('whatsapp')} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"><Share2 size={20} /></button>
            <button onClick={() => handleShare('facebook')} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"><Facebook size={20} /></button>
            <button onClick={() => handleShare('linkedin')} className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800"><Linkedin size={20} /></button>
            <button onClick={copyToClipboard} className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 relative">
                {copyFeedback ? <Check size={20} /> : <Copy size={20} />}
                {copyFeedback && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">Copied!</span>}
            </button>
          </div>
        </div>

        <button 
          onClick={() => { setIsSuccess(false); setAiMessage(''); }}
          className="mt-8 text-green-700 underline hover:text-green-900 text-sm"
        >
          {content.legal.back}
        </button>
      </div>
    );
  }

  const getInputClass = (fieldName: string) => `
    w-full px-4 py-2 rounded-lg border 
    ${errors[fieldName] 
      ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
    focus:ring-2 outline-none transition-all
  `;

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
  const maxDate = new Date().toISOString().split('T')[0];

  const ErrorMessage = ({ field }: { field: string }) => (
    errors[field] ? (
      <p className="text-red-600 text-xs mt-1 flex items-center gap-1 animate-pulse">
        <AlertCircle size={12} /> {errors[field]}
      </p>
    ) : null
  );

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100" id="sign-form">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => { setActiveTab('company'); setErrors({}); setErrorMessage(''); }}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
            activeTab === 'company' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Building2 size={20} />
          {content.formTitles.company}
        </button>
        <button
          onClick={() => { setActiveTab('driver'); setErrors({}); setErrorMessage(''); }}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
            activeTab === 'driver' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Truck size={20} />
          {content.formTitles.driver}
        </button>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <PenTool size={20} />
          <p className="text-sm font-medium">
             {activeTab === 'company' ? content.roles.representative : content.roles.individual}
          </p>
        </div>

        {errorMessage && (
           <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-200">
             <AlertCircle size={24} />
             <p className="font-medium">{errorMessage}</p>
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {activeTab === 'driver' ? (
            <>
              <div>
                <label className={labelClass}>{content.fields.name} *</label>
                <input type="text" className={getInputClass('fullName')} 
                  value={driverData.fullName} onChange={e => setDriverData({...driverData, fullName: e.target.value})} 
                />
                <ErrorMessage field="fullName" />
              </div>

              <div>
                <label className={labelClass}>{content.fields.dob} *</label>
                <input type="date" max={maxDate} className={getInputClass('birthDate')} 
                    value={driverData.birthDate} onChange={e => setDriverData({...driverData, birthDate: e.target.value})}
                />
                <ErrorMessage field="birthDate" />
              </div>
              
              {/* Sector Selection */}
              <div>
                <label className={labelClass}>{content.fields.sector} *</label>
                <select className={getInputClass('sector')} value={driverData.sector} 
                   onChange={e => setDriverData({...driverData, sector: e.target.value as Sector})}>
                  <option value="freight">{content.fields.sectorOptions.freight}</option>
                  <option value="passenger">{content.fields.sectorOptions.passenger}</option>
                  <option value="both">{content.fields.sectorOptions.both}</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>{content.fields.license} *</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LICENSE_CLASSES.map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => toggleDriverLicense(cls)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                        driverData.licenseClass.includes(cls)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
                <ErrorMessage field="licenseClass" />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{content.fields.email} *</label>
                  <input type="email" className={getInputClass('email')} 
                     value={driverData.email} onChange={e => setDriverData({...driverData, email: e.target.value})}
                  />
                  <ErrorMessage field="email" />
                </div>
                <div>
                  <label className={labelClass}>{content.fields.phone} *</label>
                  <input type="tel" className={getInputClass('phoneNumber')} 
                    placeholder={getPhonePlaceholder()}
                    value={driverData.phoneNumber} 
                    onChange={e => handlePhoneChange(e.target.value, 'driver')}
                  />
                  <p className="text-xs text-gray-400 mt-1">Ex: {getPhonePlaceholder()}</p>
                  <ErrorMessage field="phoneNumber" />
                </div>
              </div>

              {/* Driver Address */}
              <div>
                <label className={labelClass}>{content.fields.street} *</label>
                <input type="text" className={getInputClass('street')} 
                   value={driverData.street} onChange={e => setDriverData({...driverData, street: e.target.value})}
                />
                <ErrorMessage field="street" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className={labelClass}>{content.fields.zip} *</label>
                  <input type="text" className={getInputClass('zipCode')} 
                     value={driverData.zipCode} onChange={e => setDriverData({...driverData, zipCode: e.target.value})}
                  />
                  <ErrorMessage field="zipCode" />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>{content.fields.city} *</label>
                  <input type="text" className={getInputClass('city')} 
                     value={driverData.city} onChange={e => setDriverData({...driverData, city: e.target.value})}
                  />
                  <ErrorMessage field="city" />
                </div>
              </div>

               {/* Privacy Checkbox */}
               <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="privacy-driver"
                    checked={driverData.privacyAccepted}
                    onChange={e => setDriverData({...driverData, privacyAccepted: e.target.checked})}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="privacy-driver" className="text-xs text-gray-600 leading-tight">
                    {content.fields.privacyLabel}
                  </label>
               </div>
               <ErrorMessage field="privacyAccepted" />

            </>
          ) : (
            <>
              {/* Company Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{content.fields.company} *</label>
                  <input type="text" className={getInputClass('companyName')} 
                     value={companyData.companyName} onChange={e => setCompanyData({...companyData, companyName: e.target.value})}
                  />
                  <ErrorMessage field="companyName" />
                </div>
                 <div>
                  <label className={labelClass}>{content.fields.legalForm} *</label>
                  <input type="text" className={getInputClass('companyType')} placeholder="GmbH, AG, etc."
                    value={companyData.companyType} onChange={e => setCompanyData({...companyData, companyType: e.target.value})}
                  />
                  <ErrorMessage field="companyType" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{content.fields.owner} *</label>
                  <input type="text" className={getInputClass('ownerName')} 
                     value={companyData.ownerName} onChange={e => setCompanyData({...companyData, ownerName: e.target.value})}
                  />
                  <ErrorMessage field="ownerName" />
                </div>
                 <div>
                  <label className={labelClass}>{content.fields.dob} ({content.fields.owner}) *</label>
                  <input type="date" max={maxDate} className={getInputClass('ownerBirthDate')} 
                     value={companyData.ownerBirthDate} onChange={e => setCompanyData({...companyData, ownerBirthDate: e.target.value})}
                  />
                  <ErrorMessage field="ownerBirthDate" />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{content.fields.email} *</label>
                  <input type="email" className={getInputClass('email')} 
                     value={companyData.email} onChange={e => setCompanyData({...companyData, email: e.target.value})}
                  />
                  <ErrorMessage field="email" />
                </div>
                <div>
                  <label className={labelClass}>{content.fields.phone} *</label>
                  <input type="tel" className={getInputClass('phoneNumber')} 
                    placeholder={getPhonePlaceholder()}
                    value={companyData.phoneNumber} 
                    onChange={e => handlePhoneChange(e.target.value, 'company')}
                  />
                  <p className="text-xs text-gray-400 mt-1">Ex: {getPhonePlaceholder()}</p>
                  <ErrorMessage field="phoneNumber" />
                </div>
              </div>

              <div>
                <label className={labelClass}>{content.fields.street} *</label>
                <input type="text" className={getInputClass('street')} 
                   value={companyData.street} onChange={e => setCompanyData({...companyData, street: e.target.value})}
                />
                <ErrorMessage field="street" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className={labelClass}>{content.fields.zip} *</label>
                  <input type="text" className={getInputClass('zipCode')} 
                     value={companyData.zipCode} onChange={e => setCompanyData({...companyData, zipCode: e.target.value})}
                  />
                  <ErrorMessage field="zipCode" />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>{content.fields.city} *</label>
                  <input type="text" className={getInputClass('city')} 
                     value={companyData.city} onChange={e => setCompanyData({...companyData, city: e.target.value})}
                  />
                  <ErrorMessage field="city" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{content.fields.trucks} *</label>
                  <input type="number" min="0" className={getInputClass('truckCount')} 
                    value={companyData.truckCount || ''} onChange={e => setCompanyData({...companyData, truckCount: parseInt(e.target.value)})}
                  />
                  <ErrorMessage field="truckCount" />
                </div>
                <div>
                  <label className={labelClass}>{content.fields.demand} *</label>
                  <input type="number" min="0" className={getInputClass('driverDemand')} 
                    value={companyData.driverDemand || ''} onChange={e => setCompanyData({...companyData, driverDemand: parseInt(e.target.value)})}
                  />
                  <ErrorMessage field="driverDemand" />
                </div>
              </div>

               {/* Privacy Checkbox */}
               <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="privacy-company"
                    checked={companyData.privacyAccepted}
                    onChange={e => setCompanyData({...companyData, privacyAccepted: e.target.checked})}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="privacy-company" className="text-xs text-gray-600 leading-tight">
                    {content.fields.privacyLabel}
                  </label>
               </div>
               <ErrorMessage field="privacyAccepted" />
            </>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg text-lg font-bold text-white shadow-lg transform transition-all 
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 hover:scale-[1.02] active:scale-95'}
              `}
            >
              {isSubmitting ? 'Verarbeiten...' : content.cta}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignatureForm;
