import React, { useState } from 'react';
import { UserRole } from '../types';
import { Settings, Sparkles, Clock, ChevronDown, ChevronUp, BellRing, RefreshCw } from 'lucide-react';

interface DevTrialBarProps {
  currentRole: UserRole;
  onSimulateSolat: () => void;
  onSimulateTimeOut: () => void;
  onAddDevXP: () => void;
  onQuickSwitchRole: (role: UserRole) => void;
  onResetTimer: () => void;
}

export const DevTrialBar: React.FC<DevTrialBarProps> = ({
  currentRole,
  onSimulateSolat,
  onSimulateTimeOut,
  onAddDevXP,
  onQuickSwitchRole,
  onResetTimer,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 animate-fade-in max-w-[95vw]">
      <div className="bg-slate-950/90 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-2xl border border-cyan-500/40 shadow-xl text-xs flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        {/* Toggle header */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex items-center space-x-1.5 font-black text-cyan-400 shrink-0">
            <Settings className="w-4 h-4 animate-spin text-cyan-300" style={{ animationDuration: '6s' }} />
            <span>Dev Trial Bar:</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden text-slate-400 hover:text-white p-1"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Buttons */}
        {isExpanded && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={onSimulateSolat}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-transform active:scale-95 text-white"
              title="Kunci skrin dan bunyikan peringatan masuk waktu solat"
            >
              <BellRing className="w-3 h-3" /> Simulasi Solat
            </button>

            <button
              onClick={onSimulateTimeOut}
              className="bg-rose-600 hover:bg-rose-500 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-transform active:scale-95 text-white"
              title="Kunci had skrin kerana masa harian tamat"
            >
              <Clock className="w-3 h-3" /> Simulasi Time-Out
            </button>

            <button
              onClick={onAddDevXP}
              className="bg-amber-600 hover:bg-amber-500 font-bold px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-transform active:scale-95 text-white"
              title="Tambah 100 XP untuk uji leaderboard"
            >
              <Sparkles className="w-3 h-3" /> +100 XP
            </button>

            <button
              onClick={onResetTimer}
              className="bg-slate-800 hover:bg-slate-700 font-bold px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-transform active:scale-95 text-slate-300"
              title="Tetapkan semula baki masa skrin kepada 1j 45m"
            >
              <RefreshCw className="w-3 h-3" /> Reset Masa
            </button>

            {/* Quick role switch pill */}
            <div className="hidden lg:flex items-center space-x-1 pl-1 border-l border-slate-700 text-[10px]">
              <span className="text-slate-400">Mod:</span>
              <button
                onClick={() => onQuickSwitchRole('child')}
                className={`px-1.5 py-0.5 rounded ${
                  currentRole === 'child' ? 'bg-cyan-400 text-black font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Anak
              </button>
              <button
                onClick={() => onQuickSwitchRole('parent')}
                className={`px-1.5 py-0.5 rounded ${
                  currentRole === 'parent' ? 'bg-[#17d1e1] text-black font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Parent
              </button>
              <button
                onClick={() => onQuickSwitchRole('teacher')}
                className={`px-1.5 py-0.5 rounded ${
                  currentRole === 'teacher' ? 'bg-[#c0e6ba] text-black font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                Guru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
