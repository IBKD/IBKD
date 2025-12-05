import React from 'react';
import { PetitionContent } from '../types';
import { ScrollText } from 'lucide-react';

interface Props {
  content: PetitionContent;
}

const PetitionLetter: React.FC<Props> = ({ content }) => {
  // Helper to parse markdown bold syntax (**text**) into strong tags
  const formatText = (text: string) => {
    // Split by **
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove the asterisks and wrap in strong
        return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6 text-gray-500 uppercase tracking-wide text-sm font-bold">
        <ScrollText size={18} />
        <span>Official Petition Text</span>
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 font-serif">
        {content.letterSubject}
      </h2>

      <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
        {formatText(content.letterBody)}
      </div>

      <div className="mt-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-wider">
          {content.institutionsTitle}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {content.institutions.map((inst, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
              {inst}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PetitionLetter;