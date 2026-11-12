import React, { useState } from 'react';
import {
  TaskItem,
  GameItem,
  FriendItem,
  PrayerLocation,
  NextPrayerInfo,
  ChildTab,
} from '../types';
import { formatSeconds } from '../utils/prayerTimes';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Gamepad2,
  Users,
  UserPlus,
  Play,
  Award,
  Sparkles,
  Flame,
  Calendar,
  Layers,
} from 'lucide-react';
import { DuolingoProgressCard } from './DuolingoProgressCard';

interface ChildModeProps {
  remainingScreenSeconds: number;
  location: PrayerLocation;
  nextPrayer: NextPrayerInfo;
  tasks: TaskItem[];
  games: GameItem[];
  friends: FriendItem[];
  userPoints: number;
  onLaunchGame: (gameId: string) => void;
  onOpenSchedule: () => void;
  onAddFriend: (name: string, code?: string) => void;
  onDetectGPS: () => void;
}

export const ChildMode: React.FC<ChildModeProps> = ({
  remainingScreenSeconds,
  location,
  nextPrayer,
  tasks,
  games,
  friends,
  userPoints,
  onLaunchGame,
  onOpenSchedule,
  onAddFriend,
  onDetectGPS,
}) => {
  const [activeTab, setActiveTab] = useState<ChildTab>('tasks');
  const [friendInput, setFriendInput] = useState('');
  const [friendError, setFriendError] = useState('');
  const [gameFilter, setGameFilter] = useState<string>('Semua');

  const pendingMandatoryTasks = tasks.filter((t) => t.isMandatory && !t.completed);

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendInput.trim()) {
      setFriendError('Sila masukkan nama atau ID rakan.');
      return;
    }
    onAddFriend(friendInput.trim());
    setFriendInput('');
    setFriendError('');
  };

  const filteredGames =
    gameFilter === 'Semua'
      ? games
      : games.filter((g) => g.category.toLowerCase().includes(gameFilter.toLowerCase()));

  // Sort friends by XP
  const sortedFriends = [...friends].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Widget: Timer & Waktu Solat */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timer Card */}
        <div className="ibni-card bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 text-white p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border-0 shadow-md">
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-cyan-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Baki Masa Skrin Hari Ini
              </span>
              <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold text-white">
                Tetap (Fix)
              </span>
            </div>

            <div className="flex items-baseline space-x-3 my-2">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-white drop-shadow-xs">
                {formatSeconds(remainingScreenSeconds)}
              </h2>
            </div>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/20 mt-2 flex items-center justify-between text-[11px] text-cyan-100 font-semibold">
            <span>Nota Disiplin:</span>
            <span className="italic bg-white/15 px-2 py-0.5 rounded-lg">
              Kuiz pintar tidak menambah had masa skrin!
            </span>
          </div>

          {/* Decorative faint pattern */}
          <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Solat Card (WaktuSolat.api.detectLocate) */}
        <div className="ibni-card p-5 sm:p-6 flex flex-col justify-between bg-white relative">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Waktu Solat Semasa
              </span>
              <button
                onClick={onDetectGPS}
                title="Klik untuk kemas kini GPS atau tukar zon"
                className="bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-cyan-200 transition-colors"
              >
                GPS: {location.zoneName} ({location.zone})
              </button>
            </div>

            <div className="flex items-center space-x-3.5 my-1">
              <div
                onClick={onOpenSchedule}
                className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                title="Lihat Jadual Penuh Solat"
              >
                <span className="text-2xl">🕌</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Seterusnya: <span className="text-emerald-700">{nextPrayer.name}</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 border border-slate-200">
                    {nextPrayer.timeStr}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Masuk dalam <span className="font-mono font-bold text-emerald-600">{nextPrayer.formattedCountdown}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-600 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Tugasan Wajib Tertunda:
            </span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full border text-[11px] ${
                pendingMandatoryTasks.length > 0
                  ? 'text-rose-700 bg-rose-50 border-rose-200 animate-pulse'
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}
            >
              {pendingMandatoryTasks.length > 0
                ? `${pendingMandatoryTasks.length} Tugasan Mesti Selesai`
                : 'Semua Tugasan Selesai! 🎉'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Misi Harian Duolingo-Styled Circular Progress Bar */}
      <DuolingoProgressCard
        tasks={tasks}
        userPoints={userPoints}
        onLaunchTask={onLaunchGame}
      />

      {/* 3. Navigasi Tab Mod Anak (Clean, non-crowded pill buttons) */}
      <div className="flex space-x-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'tasks'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Senarai Tugas
          {pendingMandatoryTasks.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
              {pendingMandatoryTasks.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'library'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-purple-400" /> Pustaka Permainan
        </button>

        <button
          onClick={() => setActiveTab('friends')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
            activeTab === 'friends'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" /> Rakan & Ranking
        </button>
      </div>

      {/* 3. Kandungan Tab: SENARAI TUGAS (Task List) */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-600" /> Senarai Tugasan Harian
              </h3>
              <p className="text-xs text-slate-500">
                Selesaikan tugasan yang diberikan oleh Guru dan Ibu Bapa untuk mengutip XP.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Mata Anda: {userPoints} XP
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`ibni-card p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                  task.completed
                    ? 'bg-emerald-50/50 border-emerald-200/80'
                    : task.isMandatory
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-white'
                }`}
              >
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        task.isMandatory
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {task.isMandatory ? 'WAJIB SELESAI' : 'PILIHAN'}
                    </span>
                    <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-md border border-cyan-200">
                      {task.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Oleh: {task.assignedBy}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900">{task.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{task.desc}</p>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                  <span className="font-bold text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> +{task.xp} XP
                  </span>

                  {task.completed ? (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selesai!
                    </span>
                  ) : (
                    <button
                      onClick={() => onLaunchGame(task.gameId || 'game-1')}
                      className={`font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs ${
                        task.isMandatory
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Mula Tugas
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Kandungan Tab: PUSTAKA PERMAINAN (Game Library) */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-600" /> Pustaka Permainan Edukasi
              </h3>
              <p className="text-xs text-slate-500">
                Semua permainan berjalan dalam persekitaran selamat (Sandbox Iframe).
              </p>
            </div>

            {/* Filter tags */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1 max-w-full">
              {['Semua', 'Matematik', 'Pendidikan Islam', 'Sains', 'Bahasa Melayu'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGameFilter(cat)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${
                    gameFilter === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="ibni-card ibni-card-interactive p-5 flex flex-col justify-between bg-white space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-cyan-50 text-cyan-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase tracking-wider">
                      {game.category}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      +{game.xp} XP
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 mb-1">{game.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{game.desc}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Oleh: {game.creator}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3" /> {game.playsCount} kali dimainkan
                  </span>
                  <button
                    onClick={() => onLaunchGame(game.id)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" /> Main Sandbox
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Kandungan Tab: RAKAN & RANKING (Friends & Leaderboard) */}
      {activeTab === 'friends' && (
        <div className="space-y-5">
          {/* Add Friend Box & My Shareable Code */}
          <div className="ibni-card p-5 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-cyan-600" /> Tambah Rakan Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Masukkan Kod ID atau Nama Rakan untuk bersaing dalam papan pendahulu mingguan.
                </p>
              </div>
              <div className="bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-900 shadow-2xs">
                ID Anda: <span className="font-mono font-extrabold text-cyan-700">LUQMAN-101</span>
              </div>
            </div>

            <form onSubmit={handleAddFriendSubmit} className="flex gap-2">
              <input
                type="text"
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
                placeholder="cth: AIMAN-912 atau Siti Nurhaliza..."
                className="bg-slate-50 border border-slate-200 focus:border-cyan-500 focus:bg-white px-3.5 py-2 rounded-xl text-xs font-medium flex-grow text-slate-800 transition-colors"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-xl text-xs font-bold shrink-0 shadow-xs transition-colors"
              >
                + Tambah
              </button>
            </form>
            {friendError && <p className="text-xs font-bold text-rose-600">{friendError}</p>}
          </div>

          {/* Ranking Leaderboard */}
          <div className="ibni-card p-5 bg-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" /> Papan Pendahulu Rakan (XP Ranking)
                </h3>
                <p className="text-xs text-slate-500">Kekalkan streak belajar harian untuk memenangi lencana!</p>
              </div>
              <span className="text-xs font-bold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">
                Minggu Ini
              </span>
            </div>

            <div className="space-y-2.5">
              {sortedFriends.map((friend, idx) => {
                const isUser = friend.isUser;
                return (
                  <div
                    key={friend.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isUser
                        ? 'bg-cyan-50/70 border-cyan-200 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs border ${
                          idx === 0
                            ? 'bg-amber-400 text-white border-amber-500 shadow-2xs'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800 border-slate-400'
                            : idx === 2
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-2xl">{friend.avatar}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {friend.name} {isUser && <span className="text-cyan-600 font-extrabold">(Anda)</span>}
                          </h4>
                          <span className="text-[10px] bg-slate-200/80 text-slate-600 font-semibold px-1.5 py-0.2 rounded">
                            Lv.{friend.level}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-0.5 text-amber-600">
                            <Flame className="w-3 h-3 fill-amber-500" /> {friend.streakDays} hari streak
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">{friend.badge}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-amber-600 font-mono">
                        {friend.xp.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
