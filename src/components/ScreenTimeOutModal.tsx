import React, { useState } from 'react';
import { Clock, ShieldAlert, KeyRound, Sparkles, X } from 'lucide-react';

interface ScreenTimeOutModalProps {
  onUnlockWithPin: (pin: string) => boolean;
  onOpenTask: () => void;
  onDismissDev: () => void;
}

export const ScreenTimeOutModal: React.FC<ScreenTimeOutModalProps> = ({
  onUnlockWithPin,
  onOpenTask,
  onDismissDev,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setErrorMsg('Sila masukkan PIN ibu bapa.');
      return;
    }
    const success = onUnlockWithPin(pin);
    if (!success) {
      setErrorMsg('PIN salah! Sila cuba lagi.');
      setPin('');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="ibni-card bg-white border border-slate-200 text-slate-900 max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
        {/* Top-Right Quick Close for Dev/Testing */}
        <button
          onClick={onDismissDev}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Tutup Simulasi Time-Out"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-xs">
          <Clock className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="inline-block bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Had Masa Skrin Harian Tamat (00:00:00)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Masa Skrin Anda Telah Habis! ⏳
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Masa santai anda untuk hari ini telah mencapai had yang ditetapkan oleh ibu bapa. Rehatkan mata anda atau teruskan aktiviti luar!
          </p>
        </div>

        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2 text-left">
          <div className="flex items-center space-x-2 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Pengecualian Pembelajaran:</span>
          </div>
          <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
            Anda masih dibenarkan menyiapkan tugasan sekolah dan latihan kuiz wajib untuk mengasah minda.
          </p>
          <button
            onClick={onOpenTask}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 mt-2 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Buka Latihan Kuiz Wajib
          </button>
        </div>

        {/* PIN Override for Parents / Dev Controls */}
        <div className="border-t border-slate-100 pt-4 text-left space-y-3">
          {!showPinInput ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setShowPinInput(true)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Masukkan PIN Ibu Bapa (1234)
              </button>
              <button
                type="button"
                onClick={onDismissDev}
                className="w-full sm:w-auto text-xs font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-3.5 py-1.5 rounded-xl transition-colors text-center"
              >
                Tutup (Dev)
              </button>
            </div>
          ) : (
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                PIN Ibu Bapa (Laluan Kecemasan / Tambah Masa):
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN (cth: 1234)"
                  className="bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl px-3 py-2 text-sm font-bold flex-grow text-center tracking-widest transition-colors"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Buka
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinInput(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-2 font-semibold"
                >
                  Batal
                </button>
              </div>
              {errorMsg && <p className="text-xs font-bold text-rose-600">{errorMsg}</p>}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onDismissDev}
                  className="text-xs font-bold text-cyan-700 hover:text-cyan-800 underline"
                >
                  Tutup (Dev)
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
