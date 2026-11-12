import React from 'react';
import { MessageSquarePlus, ChevronRight } from 'lucide-react';
import { SurveyStep } from './types';

interface SurveyFloatingBannerProps {
  onOpenSurvey: () => void;
  currentStep: SurveyStep;
}

export const SurveyFloatingBanner: React.FC<SurveyFloatingBannerProps> = ({
  onOpenSurvey,
  currentStep,
}) => {
  const isDone = currentStep === 'step-4-completed';

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 animate-fade-in">
      <button
        onClick={onOpenSurvey}
        className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold border shadow-lg flex items-center gap-2 transition-all active:scale-95 ${
          isDone
            ? 'bg-white/95 text-slate-700 border-slate-200 hover:border-cyan-300'
            : 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white border-cyan-400 hover:brightness-105 shadow-cyan-500/20'
        }`}
        title="Buka Borang Soal Selidik Kajian Ibni"
      >
        <MessageSquarePlus className="w-4 h-4 shrink-0" />
        <span className="hidden xs:inline">
          {isDone ? 'Soal Selidik Selesai (Buka Semula)' : 'Borang Kajian & Maklum Balas Ibni'}
        </span>
        <span className="xs:hidden">Soal Selidik</span>
        <ChevronRight className="w-3.5 h-3.5 opacity-80" />
      </button>
    </div>
  );
};
