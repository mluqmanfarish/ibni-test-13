import React, { useState } from 'react';
import { StudentItem } from '../types';
import {
  X,
  CheckCircle2,
  Calendar,
  TrendingUp,
  FileText,
  Save,
} from 'lucide-react';

interface StudentProfileModalProps {
  student: StudentItem | null;
  onClose: () => void;
  onUpdateNotes: (studentId: string, notes: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onUpdateNotes,
}) => {
  const [notes, setNotes] = useState(student?.notes || '');
  const [savedMsg, setSavedMsg] = useState(false);

  if (!student) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(student.id, notes);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="ibni-card bg-white max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{student.avatar}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-lg text-slate-900">{student.name}</h4>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full">
                  Gred {student.grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                ID Pelajar: <span className="font-mono text-slate-700">{student.studentId}</span> • Kelas: 5 Bestari
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Purata Markah</span>
            <span className="text-lg font-black text-emerald-600">{student.scorePct}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Tugasan Siap</span>
            <span className="text-lg font-black text-slate-900">
              {student.completedTasks}/{student.totalTasks}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Streak Solat</span>
            <span className="text-lg font-black text-amber-600 flex items-center justify-center gap-1">
              🕌 {student.solatStreak} Hari
            </span>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="space-y-3">
          <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-600" /> Prestasi Subjek Utama
          </h5>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Matematik & Sifir', score: student.subjectScores.matematik, color: 'bg-cyan-500' },
              { name: 'Pendidikan Islam & Solat', score: student.subjectScores.islamic, color: 'bg-emerald-500' },
              { name: 'Sains & Alam Sekitar', score: student.subjectScores.sains, color: 'bg-purple-500' },
              { name: 'Bahasa Melayu & Ejaan', score: student.subjectScores.bm, color: 'bg-amber-500' },
            ].map((sub) => (
              <div key={sub.name} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{sub.name}</span>
                  <span className="font-mono">{sub.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solat & Discipline History */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rekod Kehadiran & Solat Harian</span>
          </div>
          <p className="text-[11px] text-emerald-800">
            Pelajar telah merekodkan solat Zohor dan Asar tepat pada waktunya semasa sesi di sekolah dan di rumah.
          </p>
        </div>

        {/* Teacher Notes & Feedback */}
        <div className="space-y-2 border-t border-slate-100 pt-3">
          <div className="flex justify-between items-center">
            <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-slate-700" /> Ulasan Guru (Teacher Notes)
            </h5>
            {savedMsg && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ulasan Disimpan!
              </span>
            )}
          </div>

          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis ulasan perkembangan dan pujian untuk pelajar ini..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl p-2.5 text-xs font-medium text-slate-800 transition-colors"
          />

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSaveNotes}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Ulasan
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs border border-slate-200 transition-colors"
        >
          Tutup Profil
        </button>
      </div>
    </div>
  );
};
