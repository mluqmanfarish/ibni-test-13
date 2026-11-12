import React from 'react';
import { TaskItem } from '../types';
import {
  Flame,
  Sparkles,
  Trophy,
  Check,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';

interface DuolingoProgressCardProps {
  tasks: TaskItem[];
  userPoints: number;
  onLaunchTask: (gameId: string) => void;
}

export const DuolingoProgressCard: React.FC<DuolingoProgressCardProps> = ({
  tasks,
  userPoints: _userPoints,
  onLaunchTask,
}) => {
  const mandatoryTasks = tasks.filter((t) => t.isMandatory);
  const totalMandatory = mandatoryTasks.length;
  const completedMandatory = mandatoryTasks.filter((t) => t.completed).length;
  const pendingMandatory = mandatoryTasks.filter((t) => !t.completed);

  const percentage =
    totalMandatory > 0 ? Math.round((completedMandatory / totalMandatory) * 100) : 100;

  // SVG circular math
  const size = 114;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isComplete = percentage === 100;
  const nextPendingTask = pendingMandatory[0];

  // Duolingo vibrant color theme
  const ringColor = isComplete
    ? '#ffc800' // Gold/Amber
    : percentage > 0
    ? '#58cc02' // Duolingo iconic green
    : '#38bdf8'; // Sky blue starter

  return (
    <div className="ibni-card bg-white p-5 sm:p-6 relative overflow-hidden transition-all">
      {/* Playful Duolingo-styled Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#58cc02] flex items-center justify-center text-white shadow-xs">
            <Target className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                Misi Harian Anda
              </h3>
              <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" /> 5 HARI STREAK!
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isComplete
                ? 'Hebat! Semua tugasan wajib hari ini telah diselesaikan!'
                : `Selesaikan ${totalMandatory - completedMandatory} lagi tugasan wajib untuk kekalkan rekod cemerlang.`}
            </p>
          </div>
        </div>

        {/* XP Bonus Tag */}
        <div className="flex items-center space-x-1.5 bg-lime-50 border border-lime-200 px-3 py-1 rounded-2xl shadow-2xs self-start sm:self-auto">
          <Zap className="w-4 h-4 text-lime-600 fill-lime-500" />
          <span className="text-xs font-bold text-lime-800">
            Ganjaran Misi: +{mandatoryTasks.reduce((acc, t) => acc + (t.completed ? t.xp : 0), 0)} / {mandatoryTasks.reduce((acc, t) => acc + t.xp, 0)} XP
          </span>
        </div>
      </div>

      {/* Main Content: Circular Progress Ring & Motivator */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Circular Progress Bar */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Background Glow */}
            <div
              className={`absolute inset-0 rounded-full blur-xl transition-all ${
                isComplete
                  ? 'bg-amber-300/30'
                  : percentage > 0
                  ? 'bg-[#58cc02]/20'
                  : 'bg-cyan-300/20'
              }`}
            />

            <svg
              width={size}
              height={size}
              className="transform -rotate-90 relative z-10"
              viewBox={`0 0 ${size} ${size}`}
            >
              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="transition-colors"
              />

              {/* Progress Stroke */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={ringColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
              {isComplete ? (
                <div className="animate-bounce flex flex-col items-center">
                  <Trophy className="w-8 h-8 text-amber-500 fill-amber-400" />
                  <span className="text-[11px] font-extrabold text-amber-700 tracking-wider">100%</span>
                </div>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight leading-none">
                    {percentage}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    {completedMandatory}/{totalMandatory} Siap
                  </span>
                </>
              )}
            </div>
          </div>

          <span className="mt-2.5 text-xs font-bold text-slate-600 flex items-center gap-1">
            {isComplete ? (
              <span className="text-amber-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Misi Sempurna!
              </span>
            ) : (
              <span>Kemajuan Misi Wajib</span>
            )}
          </span>
        </div>

        {/* Right: Step breakdown & Tactile Duolingo Button */}
        <div className="md:col-span-8 space-y-3.5 flex flex-col justify-between h-full">
          {/* Step Pill Breakdown */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Senarai Semak Misi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mandatoryTasks.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => !t.completed && onLaunchTask(t.gameId || 'game-1')}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                    t.completed
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 text-slate-700 font-medium cursor-pointer group'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold ${
                        t.completed
                          ? 'bg-[#58cc02] text-white border-transparent'
                          : 'bg-white text-slate-400 border-slate-300 group-hover:border-slate-400'
                      }`}
                    >
                      {t.completed ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                    </span>
                    <span className="truncate text-xs font-bold text-slate-800">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                    +{t.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action: Duolingo Tactile 3D Button without harsh black border */}
          <div>
            {isComplete ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center justify-between text-xs font-bold shadow-2xs">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🎉</span>
                  <span>Semua tugasan wajib hari ini berjaya ditamatkan!</span>
                </div>
                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-black">
                  SEMPURNA
                </span>
              </div>
            ) : nextPendingTask ? (
              <button
                onClick={() => onLaunchTask(nextPendingTask.gameId || 'game-1')}
                className="w-full bg-[#58cc02] hover:bg-[#4fa80a] text-white font-extrabold py-3 px-5 rounded-2xl text-sm border-b-4 border-[#428806] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2 tracking-wide shadow-sm"
              >
                <span>TERUSKAN MISI: {nextPendingTask.title}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
