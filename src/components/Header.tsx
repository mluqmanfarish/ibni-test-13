import React from 'react';
import { UserRole } from '../types';
import { Star, LogOut, Shield, GraduationCap, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  userPoints: number;
  onResetRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, userPoints, onResetRole }) => {
  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex justify-between items-center">
        {/* Brand & App Logo with Company Association */}
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={onResetRole}
            title="Kembali ke Pemilihan Peranan"
          >
            {/* App Logo: Ibni.™ */}
            <img
              src="/assets/aistudio/ibni-logo_02b979ef.png"
              alt="Ibni Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />

            {/* Company Association: Falah™ */}
            <div className="hidden xs:flex items-center pl-2 border-l border-slate-200 space-x-1">
              <span className="text-[10px] text-slate-400 font-semibold">oleh</span>
              <img
                src="/assets/aistudio/falah-logo_ed5cdf17.png"
                alt="Falah Logo"
                className="h-4 w-auto object-contain opacity-80"
              />
            </div>
          </div>

          {/* Role Badges with clean, soft styling */}
          {currentRole === 'child' && (
            <span className="text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-sky-500 fill-sky-400" /> Mod Anak
            </span>
          )}
          {currentRole === 'parent' && (
            <span className="text-[10px] font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Shield className="w-3 h-3 text-cyan-600" /> Mod Ibu Bapa
            </span>
          )}
          {currentRole === 'teacher' && (
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <GraduationCap className="w-3 h-3 text-emerald-600" /> Mod Guru
            </span>
          )}
        </div>

        {/* Header Stats & Switch Role */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {currentRole === 'child' && (
            <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-2xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="font-extrabold text-xs text-amber-900 font-mono">{userPoints} XP</span>
            </div>
          )}

          {currentRole === 'parent' && (
            <span className="text-xs font-bold bg-slate-50 text-slate-700 px-3 py-1 rounded-xl border border-slate-200 hidden sm:inline-block shadow-2xs">
              Peranti: Tablet Luqman
            </span>
          )}

          {currentRole === 'teacher' && (
            <span className="text-xs font-bold bg-slate-50 text-slate-700 px-3 py-1 rounded-xl border border-slate-200 hidden sm:inline-block shadow-2xs">
              Kelas: 5 Bestari (35)
            </span>
          )}

          <button
            onClick={onResetRole}
            className="ibni-pill-sm bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tukar Peranan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
