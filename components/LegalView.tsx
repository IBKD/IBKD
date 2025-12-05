
import React from 'react';
import { Language } from '../types';

interface Props {
  type: 'imprint' | 'privacy';
  language: Language;
  onBack: () => void;
}

const LegalView: React.FC<Props> = ({ type, language, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-6 text-blue-600 underline font-medium">&larr; Back</button>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose max-w-none">
        {type === 'imprint' ? (
          <>
            <h1>{language === Language.DE ? 'Impressum' : language === Language.TR ? 'Künye' : 'Imprint'}</h1>
            <p><strong>Angaben gemäß § 5 TMG:</strong></p>
            <p>Initiative Berufskraftfahrer nach Deutschland<br />
            Musterstraße 1<br />
            12345 Berlin</p>
            <p><strong>Kontakt:</strong><br />
            E-Mail: kontakt@initiative-bkd.de</p>
            <p><em>(Dies ist eine Beispiel-Demo für die App-Struktur)</em></p>
          </>
        ) : (
          <>
            <h1>{language === Language.DE ? 'Datenschutzerklärung' : language === Language.TR ? 'Gizlilik Politikası' : 'Privacy Policy'}</h1>
            <h3>1. Datenschutz auf einen Blick</h3>
            <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.</p>
            
            <h3>2. Datenerfassung auf unserer Website</h3>
            <p><strong>Formulardaten:</strong> Wenn Sie die Petition unterschreiben, speichern wir die von Ihnen eingegebenen Daten (Name, Adresse, Kontakt) in unserer Datenbank (Google Firebase).</p>
            <p><strong>Zweck:</strong> Die Daten werden ausschließlich zum Zweck der Petition und zur Übergabe an die genannten Institutionen verwendet.</p>
            <p><strong>Widerruf:</strong> Sie können Ihre Einwilligung zur Speicherung jederzeit widerrufen. Eine formlose Mitteilung per E-Mail reicht dazu aus.</p>
            
            <h3>3. Analyse-Tools</h3>
            <p>Zur groben statistischen Auswertung der Herkunft der Unterstützer nutzen wir den Dienst ipapi.co. Dabei werden IP-Adressen nur zur Ermittlung des Landes/der Stadt genutzt und nicht dauerhaft personenbezogen gespeichert.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LegalView;
