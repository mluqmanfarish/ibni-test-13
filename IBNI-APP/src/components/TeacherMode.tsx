import React, { useState } from 'react';
import { StudentItem, GameItem } from '../types';
import {
  Users,
  GraduationCap,
  Award,
  Plus,
  BookOpen,
  Code,
  TrendingUp,
  Search,
  CheckCircle,
  Eye,
  FileCheck,
} from 'lucide-react';

interface TeacherModeProps {
  students: StudentItem[];
  games: GameItem[];
  onAddStudent: (name: string, studentId: string, notes?: string) => void;
  onOpenStudentProfile: (student: StudentItem) => void;
  onAssignGameToClass: (game: GameItem, className: string) => void;
  onCreateCustomGame: (game: Omit<GameItem, 'id' | 'playsCount' | 'rating'>) => void;
  onLaunchGame: (gameId: string) => void;
}

export const TeacherMode: React.FC<TeacherModeProps> = ({
  students,
  games,
  onAddStudent,
  onOpenStudentProfile,
  onAssignGameToClass,
  onCreateCustomGame,
  onLaunchGame,
}) => {
  const [activeTab, setActiveTab] = useState<'classroom' | 'ranking' | 'library' | 'analytics'>('classroom');
  const [selectedClass, setSelectedClass] = useState('5 Bestari');
  const [searchQuery, setSearchQuery] = useState('');

  // Add student form modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentNotes, setNewStudentNotes] = useState('');

  // HTML game creation for teacher
  const [showTeacherGameModal, setShowTeacherGameModal] = useState(false);
  const [gameTitle, setGameTitle] = useState('Ujian Pantas Tatabahasa Kata Kerja');
  const [gameCategory, setGameCategory] = useState<'Matematik' | 'Pendidikan Islam' | 'Sains' | 'Bahasa Melayu' | 'Logik & Minda'>('Bahasa Melayu');
  const [gameDesc, setGameDesc] = useState('Kenal pasti kata kerja aktif transitif dalam ayat.');
  const [gameXp, setGameXp] = useState(50);
  const [gameHtml, setGameHtml] = useState(`<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; background: #1e1b4b; color: #ede9fe; padding: 24px; text-align: center; }
    .box { background: #2e1065; border: 2px solid #a855f7; border-radius: 18px; padding: 20px; max-width: 380px; margin: 0 auto; }
    button { background: #9333ea; color: white; border: none; font-weight: bold; padding: 12px 18px; font-size: 15px; border-radius: 10px; cursor: pointer; width: 100%; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="box">
    <h3>📖 Kuiz Tatabahasa 5 Bestari</h3>
    <p>Pilih kata kerja yang betul bagi melengkapkan ayat:</p>
    <div style="background: #4c1d95; padding: 12px; border-radius: 10px; font-weight: bold; margin: 12px 0;">
      Kakak sedang ________ sayur-sayuran di dapur.
    </div>
    <button onclick="pilih(true)">memotong</button>
    <button onclick="pilih(false)">terpotong</button>
    <p id="jawapan" style="margin-top: 15px; font-weight: bold;"></p>
  </div>
  <script>
    function pilih(betul) {
      if(betul) {
        document.getElementById('jawapan').innerHTML = "Bagus! 'Memotong' adalah kata kerja perbuatan aktif.";
        setTimeout(() => {
          window.parent.postMessage({ type: 'IBNI_GAME_COMPLETE', xp: 50 }, '*');
        }, 800);
      } else {
        alert("Cuba lagi! 'Terpotong' menunjukkan perbuatan tidak sengaja.");
      }
    }
  </script>
</body>
</html>`);

  const [toastMsg, setToastMsg] = useState('');

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    onAddStudent(newStudentName.trim(), newStudentId.trim() || `5B-${String(students.length + 1).padStart(2, '0')}`, newStudentNotes);
    setNewStudentName('');
    setNewStudentId('');
    setNewStudentNotes('');
    setShowAddStudentModal(false);
    setToastMsg(`Pelajar ${newStudentName} berjaya dimasukkan ke kelas ${selectedClass}!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleCreateTeacherGame = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCustomGame({
      title: gameTitle,
      category: gameCategory,
      desc: gameDesc,
      xp: gameXp,
      creator: `Cikgu Aminah (${selectedClass})`,
      colorScheme: 'cyan',
      htmlCode: gameHtml,
    });
    setShowTeacherGameModal(false);
    setToastMsg(`Modul kuiz "${gameTitle}" berjaya diterbitkan untuk kelas!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorted by score & XP
  const rankedStudents = [...filteredStudents].sort((a, b) => b.scorePct - a.scorePct || b.xp - a.xp);

  const avgClassScore = Math.round(students.reduce((acc, s) => acc + s.scorePct, 0) / (students.length || 1));
  const totalHomeworkDone = students.reduce((acc, s) => acc + s.completedTasks, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="ibni-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👩‍🏫</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Panel Pengurusan Guru (Teacher Portal)
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Pantau kemajuan bilik darjah, statistik prestasi pelajar, dan assign tugasan kuiz kelas.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Pilih Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-xs px-3 py-1.5 rounded-xl shadow-2xs"
            >
              <option value="5 Bestari">5 Bestari (35 Pelajar)</option>
              <option value="4 Amanah">4 Amanah (28 Pelajar)</option>
            </select>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('classroom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'classroom' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Senarai Pelajar ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'ranking' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Class Ranking & Prestasi
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'library' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Pustaka Game & Cipta HTML
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Analisis Gred Kelas
          </button>
        </div>

        {toastMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>

      {/* 1. Tab: BILIK DARJAH & SENARAI PELAJAR */}
      {activeTab === 'classroom' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="ibni-card p-4 bg-white text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Jumlah Pelajar</span>
              <span className="text-2xl font-black text-slate-900">{students.length} Orang</span>
            </div>
            <div className="ibni-card p-4 bg-white text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Purata Markah</span>
              <span className="text-2xl font-black text-emerald-600">{avgClassScore}%</span>
            </div>
            <div className="ibni-card p-4 bg-white text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Kuiz Disiapkan</span>
              <span className="text-2xl font-black text-cyan-600">{totalHomeworkDone} Modul</span>
            </div>
            <div className="ibni-card p-4 bg-white text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Kepatuhan Solat</span>
              <span className="text-2xl font-black text-amber-600">96.4%</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau ID pelajar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium w-full transition-colors"
              />
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Pelajar Baru
            </button>
          </div>

          {/* Student List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => onOpenStudentProfile(student)}
                className="ibni-card ibni-card-interactive p-4 sm:p-5 bg-white flex items-center justify-between cursor-pointer"
                title="Klik untuk lihat profil dan statistik lengkap"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{student.avatar}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h5 className="font-bold text-sm text-slate-900">{student.name}</h5>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full">
                        {student.grade} ({student.scorePct}%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      ID: {student.studentId} • Siap {student.completedTasks}/{student.totalTasks} Tugasan
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-600 block">{student.xp} XP</span>
                  <span className="text-[10px] text-cyan-700 font-bold underline">Lihat Profil &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Tab: CLASS RANKING & PRESTASI */}
      {activeTab === 'ranking' && (
        <div className="ibni-card p-5 bg-white space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Papan Pendahulu Kelas 5 Bestari
              </h4>
              <p className="text-xs text-slate-500">
                Susunan kedudukan pelajar berdasarkan markah kuiz, penyelesaian kerja rumah, dan ganjaran XP.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-xl">
              Semester Semasa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3">Kedudukan</th>
                  <th className="py-2.5 px-3">Nama Pelajar</th>
                  <th className="py-2.5 px-3 text-center">Tugasan Siap</th>
                  <th className="py-2.5 px-3 text-center">Gred / Markah</th>
                  <th className="py-2.5 px-3 text-right">Terkumpul XP</th>
                  <th className="py-2.5 px-3 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {rankedStudents.map((std, idx) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs border ${
                          idx === 0
                            ? 'bg-amber-400 text-white border-amber-500 shadow-2xs'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800 border-slate-400'
                            : idx === 2
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span>{std.avatar}</span>
                      <span>{std.name}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      {std.completedTasks} / {std.totalTasks}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-black border border-emerald-300">
                        {std.grade} ({std.scorePct}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-amber-600">
                      {std.xp} XP
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onOpenStudentProfile(std)}
                        className="ibni-pill-sm bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-black px-2.5 py-1 rounded-lg text-[10px]"
                      >
                        Profil & Stat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Tab: PUSTAKA GAME GURU & ASSIGN KE KELAS */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-600" /> Pustaka Kuiz Guru (Assign & Cipta HTML)
              </h4>
              <p className="text-xs text-slate-500">
                Pilih modul latihan untuk diedarkan kepada semua 35 pelajar dalam kelas {selectedClass}.
              </p>
            </div>

            <button
              onClick={() => setShowTeacherGameModal(true)}
              className="ibni-pill bg-[#c0e6ba] hover:bg-[#aedf9d] text-slate-900 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Cipta Kuiz HTML Kelas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => (
              <div key={game.id} className="ibni-card p-5 bg-white space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-cyan-100/80 text-cyan-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase tracking-wider">
                      {game.category}
                    </span>
                    <h5 className="font-black text-base text-slate-900 mt-1">{game.title}</h5>
                    <p className="text-xs text-slate-600">{game.desc}</p>
                  </div>
                  <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300">
                    +{game.xp} XP
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onLaunchGame(game.id)}
                    className="text-xs font-black text-slate-600 hover:text-black flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Uji Main
                  </button>

                  <button
                    onClick={() => {
                      onAssignGameToClass(game, selectedClass);
                      setToastMsg(`Permainan "${game.title}" berjaya di-assign sebagai kerja rumah kelas ${selectedClass}!`);
                      setTimeout(() => setToastMsg(''), 3500);
                    }}
                    className="ibni-pill bg-black hover:bg-slate-800 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Assign ke Kelas {selectedClass}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Tab: ANALISIS GRED & PRESTASI KELAS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="ibni-card p-5 bg-white space-y-3">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Taburan Gred Kelas {selectedClass}
            </h4>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between items-center p-2 bg-emerald-50 border border-emerald-300 rounded-xl">
                <span>Gred A (85% - 100%)</span>
                <span className="font-black text-emerald-800">
                  {students.filter((s) => s.grade === 'A').length} Pelajar ({Math.round((students.filter((s) => s.grade === 'A').length / students.length) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-cyan-50 border border-cyan-300 rounded-xl">
                <span>Gred B (70% - 84%)</span>
                <span className="font-black text-cyan-800">
                  {students.filter((s) => s.grade === 'B').length} Pelajar ({Math.round((students.filter((s) => s.grade === 'B').length / students.length) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-amber-50 border border-amber-300 rounded-xl">
                <span>Gred C (50% - 69%)</span>
                <span className="font-black text-amber-800">
                  {students.filter((s) => s.grade === 'C').length} Pelajar
                </span>
              </div>
            </div>
          </div>

          <div className="ibni-card p-5 bg-white space-y-3">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
              <BookOpen className="w-4 h-4 text-cyan-600" /> Ringkasan Subjek Teratas
            </h4>
            <div className="space-y-2 text-xs font-bold text-slate-700">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Pendidikan Islam & Solat Fardhu</span>
                  <span className="font-mono text-emerald-600">96%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Matematik & Sifir Pantas</span>
                  <span className="font-mono text-cyan-600">91%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Bahasa Melayu & Tatabahasa</span>
                  <span className="font-mono text-amber-600">89%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="ibni-card bg-white max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" /> Tambah Pelajar Baru ke {selectedClass}
              </h4>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Penuh Pelajar:</label>
                <input
                  type="text"
                  placeholder="cth: Muhammad Harith bin Fauzi"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold w-full transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">No ID Pelajar (Pilihan):</label>
                <input
                  type="text"
                  placeholder={`cth: 5B-${String(students.length + 1).padStart(2, '0')}`}
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold w-full transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Guru Awal:</label>
                <textarea
                  rows={2}
                  placeholder="cth: Pelajar baharu berpindah dari SK Cyberjaya."
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-medium w-full transition-colors"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs transition-colors"
                >
                  Daftar Pelajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TEACHER HTML GAME STUDIO */}
      {showTeacherGameModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="ibni-card bg-white max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-600" /> Cipta Modul Kuiz HTML Guru
                </h4>
                <p className="text-xs text-slate-500">
                  Cipta latihan interaktif untuk kelas {selectedClass}. Berjalan di dalam iframe sandbox selamat.
                </p>
              </div>
              <button
                onClick={() => setShowTeacherGameModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeacherGame} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tajuk Modul:</label>
                  <input
                    type="text"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subjek:</label>
                  <select
                    value={gameCategory}
                    onChange={(e) => setGameCategory(e.target.value as typeof gameCategory)}
                    className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
                  >
                    <option value="Matematik">Matematik</option>
                    <option value="Pendidikan Islam">Pendidikan Islam</option>
                    <option value="Sains">Sains</option>
                    <option value="Bahasa Melayu">Bahasa Melayu</option>
                    <option value="Logik & Minda">Logik & Minda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Penerangan Tugasan:</label>
                  <input
                    type="text"
                    value={gameDesc}
                    onChange={(e) => setGameDesc(e.target.value)}
                    className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mata Ganjaran XP:</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={gameXp}
                    onChange={(e) => setGameXp(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Kod HTML Kuiz:</label>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Panggil window.parent.postMessage('GAME_WIN', '*') untuk selesai.
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={gameHtml}
                  onChange={(e) => setGameHtml(e.target.value)}
                  className="font-mono text-xs bg-slate-900 text-emerald-300 border border-slate-700 rounded-xl p-3 w-full focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherGameModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs transition-colors"
                >
                  Terbitkan Kuiz Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
