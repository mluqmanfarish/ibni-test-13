import React, { useEffect, useRef, useState } from 'react';
import { GameItem } from '../types';
import { X, RotateCcw, Award, ShieldAlert, Sparkles, Maximize2, Minimize2 } from 'lucide-react';

interface GameSandboxModalProps {
  game: GameItem | null;
  onClose: () => void;
  onComplete: (gameId: string, xpEarned: number) => void;
}

export const GameSandboxModal: React.FC<GameSandboxModalProps> = ({ game, onClose, onComplete }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!game) return;
    setHasCompleted(false);

    const handleMessage = (event: MessageEvent) => {
      // Listen for message from sandbox
      if (
        event.data === 'GAME_WIN' ||
        (typeof event.data === 'object' && event.data?.type === 'IBNI_GAME_COMPLETE')
      ) {
        const xp = event.data?.xp || game.xp || 50;
        setHasCompleted(true);
        onComplete(game.id, xp);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [game, onComplete]);

  if (!game) return null;

  const reloadGame = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = game.htmlCode;
    }
  };

  const handleManualClaim = () => {
    setHasCompleted(true);
    onComplete(game.id, game.xp);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div
        className={`bg-white border border-slate-700/60 w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-200 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-4xl max-h-[92vh]'
        }`}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="bg-cyan-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" /> SANDBOX
            </span>
            <div className="truncate">
              <h3 className="font-bold text-sm sm:text-base truncate text-white">{game.title}</h3>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">Kategori: {game.category} • Dicipta oleh: {game.creator}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={reloadGame}
              title="Mula Semula Permainan"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Kecilkan Skrin' : 'Skrin Penuh'}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Tutup Permainan"
              className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-center transition-transform active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sandbox Iframe */}
        <div className="relative w-full flex-grow bg-slate-900 min-h-[380px] sm:min-h-[460px]">
          <iframe
            ref={iframeRef}
            srcDoc={game.htmlCode}
            sandbox="allow-scripts allow-forms"
            title={game.title}
            className="w-full h-full border-0 absolute inset-0 bg-slate-900"
          />
        </div>

        {/* Footer */}
        <div className="bg-white px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Award className="w-4 h-4" /> Nilai Ganjaran: +{game.xp} XP
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              *Masa skrin kekal tetap & terkawal. Kuiz melatih minda!
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleManualClaim}
              disabled={hasCompleted}
              className={`font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                hasCompleted
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {hasCompleted ? 'Ganjaran Telah Dituntut!' : 'Selesai & Tuntut XP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
