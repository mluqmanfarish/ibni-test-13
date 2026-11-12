import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle2, Heart } from 'lucide-react';

interface SolatLockModalProps {
  prayerName: string;
  locationName: string;
  onDismiss: () => void;
}

export const SolatLockModal: React.FC<SolatLockModalProps> = ({
  prayerName,
  locationName,
  onDismiss,
}) => {
  const [isPlayingAzan, setIsPlayingAzan] = useState(false);
  const [wudukDone, setWudukDone] = useState(false);
  const [solatDone, setSolatDone] = useState(false);

  const toggleSound = () => {
    setIsPlayingAzan(!isPlayingAzan);
    if (!isPlayingAzan && typeof window !== 'undefined' && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.6);
      } catch {
        // audio context fallback
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="ibni-card bg-emerald-900 border border-emerald-600/80 text-white max-w-lg w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-800 border border-emerald-500/50 flex items-center justify-center shadow-md">
          <span className="text-3xl">🕌</span>
        </div>

        <div className="space-y-2">
          <span className="inline-block bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Panggilan Solat Fardhu • {locationName}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-100 tracking-tight">
            Waktu Solat <span className="text-emerald-300">{prayerName}</span> Telah Tiba!
          </h2>
          <p className="text-emerald-200 text-xs sm:text-sm font-medium leading-relaxed">
            Masa skrin anda dijeda sementara untuk memberi laluan kepada ibadah solat. Dirikanlah solat pada awal waktu.
          </p>
        </div>

        {/* Doa / Reminder */}
        <div className="p-4 bg-emerald-950/80 border border-emerald-700/60 rounded-2xl text-xs space-y-2 text-emerald-100">
          <p className="font-arabic text-lg text-emerald-200" dir="rtl">
            حَيَّ عَلَى الصَّلَاةِ ، حَيَّ عَلَى الْفَلَاحِ
          </p>
          <p className="italic text-emerald-300 text-[11px]">
            &ldquo;Mari menuju kejayaan dengan mendirikan solat secara berjemaah atau tepat waktu.&rdquo;
          </p>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <button
            onClick={() => setWudukDone(!wudukDone)}
            className={`p-3 rounded-2xl border flex items-center space-x-2 text-xs font-bold transition-all ${
              wudukDone
                ? 'bg-emerald-500/30 border-emerald-300 text-emerald-100'
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${wudukDone ? 'text-emerald-300' : 'text-emerald-600'}`} />
            <span>1. Mengambil Wuduk</span>
          </button>
          <button
            onClick={() => setSolatDone(!solatDone)}
            className={`p-3 rounded-2xl border flex items-center space-x-2 text-xs font-bold transition-all ${
              solatDone
                ? 'bg-emerald-500/30 border-emerald-300 text-emerald-100'
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${solatDone ? 'text-emerald-300' : 'text-emerald-600'}`} />
            <span>2. Selesai Solat</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onDismiss}
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.99]"
          >
            <Heart className="w-4 h-4 fill-emerald-950" />
            <span>Alhamdulillah, Saya Telah Selesai Solat</span>
          </button>

          <button
            onClick={toggleSound}
            className="text-xs text-emerald-300 hover:text-white flex items-center justify-center mx-auto space-x-1.5 transition-colors"
          >
            {isPlayingAzan ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isPlayingAzan ? 'Bunyi Locing/Azan Aktif' : 'Uji Audio Peringatan Solat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
