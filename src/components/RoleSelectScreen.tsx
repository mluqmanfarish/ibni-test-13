import React from 'react';
import { UserRole } from '../types';
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Clock,
  Compass,
} from 'lucide-react';

interface RoleSelectScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole }) => {
  return (
    <div className="fixed inset-0 bg-slate-50/70 z-50 flex flex-col items-center justify-center p-4 relative overflow-hidden backdrop-blur-xs">
      {/* Soft ambient background shapes */}
      <div className="shape-pink" />
      <div className="shape-green" />
      <div className="shape-yellow" />

      <div className="max-w-md w-full space-y-6 text-center relative z-10 animate-fade-in bg-white/90 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl backdrop-blur-md">
        {/* Brand & App Logo */}
        <div className="space-y-3">
          {/* Company badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-[11px] font-bold text-slate-600">
            <span>Inisiatif Pendidikan daripada</span>
            <img
              src="/assets/aistudio/falah-logo_ed5cdf17.png"
              alt="Falah Logo"
              className="h-3.5 w-auto object-contain inline-block"
            />
          </div>

          {/* Official App Logo */}
          <div className="flex justify-center pt-1">
            <img
              src="/assets/aistudio/ibni-logo_02b979ef.png"
              alt="Ibni App Logo"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs"
            />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-xs mx-auto">
            Sila pilih peranan anda untuk memulakan pemantauan dan pembelajaran pintar.
          </p>
        </div>

        {/* Role Cards with sleek modern styling (no crowded thick black borders) */}
        <div className="space-y-3 text-left">
          {/* Parent Mode */}
          <button
            onClick={() => onSelectRole('parent')}
            className="w-full bg-gradient-to-r from-cyan-50 to-white hover:from-cyan-100/80 hover:to-cyan-50/50 text-slate-900 border border-cyan-200 hover:border-cyan-400 p-4 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all group active:scale-[0.99]"
          >
            <span className="flex items-center space-x-3.5">
              <span className="w-11 h-11 rounded-2xl bg-cyan-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <span>
                <span className="block font-black text-base text-slate-900">Ibu Bapa (Parent Mode)</span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Tetapan had masa, peranti & tugasan kuiz
                </span>
              </span>
            </span>
            <span className="w-8 h-8 rounded-full bg-cyan-100/70 text-cyan-800 flex items-center justify-center group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          {/* Teacher Mode */}
          <button
            onClick={() => onSelectRole('teacher')}
            className="w-full bg-gradient-to-r from-emerald-50 to-white hover:from-emerald-100/80 hover:to-emerald-50/50 text-slate-900 border border-emerald-200 hover:border-emerald-400 p-4 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all group active:scale-[0.99]"
          >
            <span className="flex items-center space-x-3.5">
              <span className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </span>
              <span>
                <span className="block font-black text-base text-slate-900">Guru (Teacher Mode)</span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Pengurusan bilik darjah, ranking & kuiz HTML
                </span>
              </span>
            </span>
            <span className="w-8 h-8 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          {/* Child Mode */}
          <button
            onClick={() => onSelectRole('child')}
            className="w-full bg-gradient-to-r from-sky-50 to-white hover:from-sky-100/80 hover:to-sky-50/50 text-slate-900 border border-sky-200 hover:border-sky-400 p-4 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all group active:scale-[0.99]"
          >
            <span className="flex items-center space-x-3.5">
              <span className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 fill-amber-300 text-amber-300" />
              </span>
              <span>
                <span className="block font-black text-base text-slate-900">Anak (Child Mode)</span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Masa skrin tetap, waktu solat, misi & game
                </span>
              </span>
            </span>
            <span className="w-8 h-8 rounded-full bg-sky-100/70 text-sky-800 flex items-center justify-center group-hover:translate-x-1 transition-all">
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="pt-3 grid grid-cols-2 gap-2 text-left text-[11px] font-bold text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-600" /> Had Masa Skrin Tetap
          </div>
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" /> Auto Detect Waktu Solat
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-medium">
          Aplikasi Ibni™ © Hakcipta Falah™ Technologies
        </p>
      </div>
    </div>
  );
};
