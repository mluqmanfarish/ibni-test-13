import React, { useState } from 'react';
import {
  RespondentType,
  InitialSurveyAnswers,
  PostFeedbackAnswers,
  SurveyStep,
} from './types';
import {
  GOOGLE_FORM_INITIAL_URL,
  GOOGLE_FORM_FEEDBACK_URL,
  IBNI_FEATURES_SHOWCASE,
} from './surveyData';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Play,
  MessageSquareHeart,
  Shield,
  GraduationCap,
  Users,
  Send,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface SurveyWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppTrial: () => void;
  step: SurveyStep;
  setStep: (step: SurveyStep) => void;
  savedRespondentType: RespondentType | null;
  setSavedRespondentType: (r: RespondentType) => void;
}

export const SurveyWorkflowModal: React.FC<SurveyWorkflowModalProps> = ({
  isOpen,
  onClose,
  onOpenAppTrial,
  step,
  setStep,
  savedRespondentType,
  setSavedRespondentType,
}) => {
  // State Borang Awal (Langkah 1)
  const [initialForm, setInitialForm] = useState<InitialSurveyAnswers>({
    jenis_responden: savedRespondentType || 'Ibu Bapa',
    masa_anak: '',
    sukar_kawal_gajet: '',
    alat_kawalan: '',
    sukar_ulang_kaji: '',
    sukar_solat: '',
    kaedah_konvensional: '',
    setuju_interaktif: '',
    setuju_ai: '',
  });

  // State Borang Maklum Balas / Testimoni (Langkah 3)
  const [feedbackForm, setFeedbackForm] = useState<PostFeedbackAnswers>({
    kunci_gajet_berguna: '',
    peringatan_solat_berguna: '',
    app_membantu: '',
    setuju_gamifikasi: '',
    sokong_pemasaran: '',
    bantu_pdpc_guru: '',
    cadangan_komen: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const currentRole = initialForm.jenis_responden;
  const isParent = currentRole === 'Ibu Bapa' || currentRole === 'Kedua-duanya (Ibu Bapa & Guru)';
  const isTeacher = currentRole === 'Guru' || currentRole === 'Kedua-duanya (Ibu Bapa & Guru)';

  // Penghantaran Borang Langkah 1 (Kajian Awal)
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const googleData = new URLSearchParams();
    googleData.append('entry.1588020940', initialForm.jenis_responden || '-');
    googleData.append('entry.870009207', initialForm.masa_anak || '-');
    googleData.append('entry.1366304722', initialForm.sukar_kawal_gajet || '-');
    googleData.append('entry.1693057531', initialForm.alat_kawalan || '-');
    googleData.append('entry.1112025074', initialForm.sukar_ulang_kaji || '-');
    googleData.append('entry.1871790206', initialForm.sukar_solat || '-');
    googleData.append('entry.1875407524', initialForm.kaedah_konvensional || '-');
    googleData.append('entry.774820769', initialForm.setuju_interaktif || '-');
    googleData.append('entry.1367272939', initialForm.setuju_ai || '-');

    try {
      await fetch(GOOGLE_FORM_INITIAL_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: googleData.toString(),
      });
      setSavedRespondentType(initialForm.jenis_responden);
      setStep('step-2-showcase');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Sekiranya ada isu jaringan, tetap benarkan pengguna mara ke pengenalan
      setSavedRespondentType(initialForm.jenis_responden);
      setStep('step-2-showcase');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Penghantaran Borang Langkah 3 (Maklum Balas / Testimoni Ibni)
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const googleData = new URLSearchParams();
    googleData.append('entry.1592112152', feedbackForm.kunci_gajet_berguna || '-');
    googleData.append('entry.433320611', feedbackForm.peringatan_solat_berguna || '-');
    googleData.append('entry.599611673', feedbackForm.app_membantu || '-');
    googleData.append('entry.638260519', feedbackForm.setuju_gamifikasi || '-');
    googleData.append('entry.2109346524', feedbackForm.sokong_pemasaran || '-');
    googleData.append(
      'entry.38139519',
      isTeacher ? feedbackForm.bantu_pdpc_guru || '-' : 'Tidak Berkaitan (Bukan Guru)'
    );
    googleData.append('entry.1068352295', feedbackForm.cadangan_komen || '-');

    try {
      await fetch(GOOGLE_FORM_FEEDBACK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: googleData.toString(),
      });
      setStep('step-4-completed');
    } catch {
      setSubmitError('Ralat sambungan. Sila pastikan talian internet anda aktif.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 flex justify-center items-start animate-fade-in">
      <div className="relative bg-white border border-slate-200/90 rounded-3xl shadow-2xl max-w-2xl w-full my-6 p-6 sm:p-8 space-y-6 text-slate-900">
        
        {/* Butang Tutup / Tangguh */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Tutup Borang (Boleh dibuka semula bila-bila masa)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pengepala Rasmi: Logo Ibni & Syarikat Falah */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/aistudio/ibni-logo_02b979ef.png"
              alt="Ibni Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="border-l border-slate-200 pl-3">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block tracking-wider">
                Inisiatif Pendidikan
              </span>
              <img
                src="/assets/aistudio/falah-logo_ed5cdf17.png"
                alt="Falah Logo"
                className="h-4 w-auto object-contain opacity-80"
              />
            </div>
          </div>

          {/* Penunjuk Langkah (Step Indicator) */}
          <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500">
            <span className={`px-2 py-0.5 rounded-full ${step === 'step-1-initial' ? 'bg-cyan-500 text-white font-extrabold' : 'bg-slate-100 text-slate-600'}`}>
              1. Kajian Awal
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className={`px-2 py-0.5 rounded-full ${step === 'step-2-showcase' ? 'bg-cyan-500 text-white font-extrabold' : 'bg-slate-100 text-slate-600'}`}>
              2. Pengenalan Ibni
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className={`px-2 py-0.5 rounded-full ${step === 'step-3-feedback' || step === 'step-4-completed' ? 'bg-cyan-500 text-white font-extrabold' : 'bg-slate-100 text-slate-600'}`}>
              3. Maklum Balas
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LANGKAH 1: SOAL SELIDIK AWAL (GENERAL SURVEY BERDASARKAN HTML ASAL)       */}
        {/* ========================================================================= */}
        {step === 'step-1-initial' && (
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200 uppercase tracking-wider inline-block">
                Langkah 1 daripada 3: Kaji Selidik Am
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Soal Selidik Inovasi Pendidikan & Kawalan Masa Skrin
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pandangan anda amat berharga dalam membantu kami memahami cabaran semasa ibu bapa dan guru berkaitan pengurusan gajet serta kaedah pembelajaran interaktif.
              </p>
            </div>

            {/* 1. Jenis Responden */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
              <label className="block text-sm font-black text-slate-900">
                1. Sila Nyatakan Peranan / Jenis Responden Anda:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['Ibu Bapa', 'Guru', 'Kedua-duanya (Ibu Bapa & Guru)'] as RespondentType[]).map((r) => {
                  const isSelected = initialForm.jenis_responden === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setInitialForm({ ...initialForm, jenis_responden: r })}
                      className={`p-3.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500 text-white border-cyan-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300'
                      }`}
                    >
                      <span>{r}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BAHAGIAN IBU BAPA */}
            {isParent && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold text-rose-800">
                  <Shield className="w-3.5 h-3.5" /> Bahagian Ibu Bapa / Penjaga
                </div>

                {/* Soalan Masa Anak */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Berapakah purata masa penggunaan gajet yang diperuntukkan untuk anak anda dalam sehari?
                  </label>
                  <select
                    required={isParent}
                    value={initialForm.masa_anak}
                    onChange={(e) => setInitialForm({ ...initialForm, masa_anak: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Sila pilih anggaran tempoh masa --</option>
                    <option value="Kurang daripada 1 jam">Kurang daripada 1 jam sehari</option>
                    <option value="1 hingga 2 jam">1 hingga 2 jam sehari</option>
                    <option value="3 hingga 4 jam">3 hingga 4 jam sehari</option>
                    <option value="Lebih daripada 4 jam">Lebih daripada 4 jam sehari</option>
                  </select>
                </div>

                {/* Soalan Sukar Kawal Gajet */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Adakah anda mengalami kesukaran dalam mengawal masa penggunaan gajet anak anda?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Ya, sangat sukar', 'Kadang-kadang', 'Tidak sukar'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setInitialForm({ ...initialForm, sukar_kawal_gajet: opt })}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          initialForm.sukar_kawal_gajet === opt
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soalan Alat Kawalan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Apakah alat atau platform yang digunakan untuk mengawal gajet anak anda pada masa ini?
                  </label>
                  <input
                    type="text"
                    value={initialForm.alat_kawalan}
                    onChange={(e) => setInitialForm({ ...initialForm, alat_kawalan: e.target.value })}
                    placeholder="Cth: Google Family Link, Had Masa Apple, Arahan lisan, Tiada..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Soalan Ulang Kaji */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Adakah anda mengalami kesukaran dalam memastikan anak anda mengulang kaji pelajaran di rumah?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Ya, sangat sukar', 'Kadang-kadang', 'Tidak sukar'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setInitialForm({ ...initialForm, sukar_ulang_kaji: opt })}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          initialForm.sukar_ulang_kaji === opt
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soalan Solat Fardu */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Adakah anda mengalami kesukaran dalam memastikan anak anda menunaikan solat fardu tepat pada masanya?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Ya, sangat sukar', 'Kadang-kadang', 'Tidak sukar'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setInitialForm({ ...initialForm, sukar_solat: opt })}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          initialForm.sukar_solat === opt
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BAHAGIAN GURU */}
            {isTeacher && (
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-800">
                  <GraduationCap className="w-3.5 h-3.5" /> Bahagian Pendidikan & Pendekatan PdPc
                </div>

                {/* Soalan Kaedah Konvensional */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Adakah kaedah pembelajaran secara konvensional (buku rujukan & PdPc fizikal semata-mata) masih relevan pada masa kini?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Masih Relevan', 'Perlu Digabungkan dengan Digital', 'Kurang Relevan'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setInitialForm({ ...initialForm, kaedah_konvensional: opt })}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          initialForm.kaedah_konvensional === opt
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soalan Pembelajaran Interaktif */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Adakah anda bersetuju dengan pendekatan pembelajaran interaktif seperti simulasi dan nota visual bermodul?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Sangat Bersetuju', 'Bersetuju', 'Tidak Bersetuju'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setInitialForm({ ...initialForm, setuju_interaktif: opt })}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          initialForm.setuju_interaktif === opt
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soalan AI dalam Pendidikan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Adakah anda bersetuju dengan penerapan kecerdasan buatan (AI) dalam menyokong sektor pendidikan?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Sangat Bersetuju', 'Bersetuju dengan Kawalan', 'Tidak Bersetuju'].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setInitialForm({ ...initialForm, setuju_ai: opt })}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          initialForm.setuju_ai === opt
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Butang Seterusnya */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Menghantar Data Kajian Awal...' : 'Simpan & Kenali Aplikasi Ibni'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* LANGKAH 2: PENGENALAN APLIKASI IBNI & CIRI-CIRINYA + PILIHAN TEST / JAWAB */}
        {/* ========================================================================= */}
        {step === 'step-2-showcase' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider inline-block">
                Langkah 2 daripada 3: Pengenalan Inovasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Memperkenalkan Aplikasi <span className="text-cyan-600">Ibni.™</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Platform pintar kawalan masa skrin, pengesanan waktu solat sebenar, dan gamifikasi pendidikan bersepadu yang dirangka khas untuk anak, ibu bapa, dan para pendidik.
              </p>
            </div>

            {/* Senarai Kad Ciri-Ciri Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {IBNI_FEATURES_SHOWCASE.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-2 text-left hover:border-cyan-300 transition-all hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                      {feat.icon}
                    </span>
                    <span className="text-[10px] font-extrabold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                      {feat.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{feat.title}</h4>
                    <p className="text-[11px] font-semibold text-cyan-700">{feat.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* PILIHAN TINDAKAN DUA HALA */}
            <div className="p-5 bg-gradient-to-br from-cyan-50 via-white to-sky-50 border border-cyan-200/80 rounded-2xl space-y-3 text-center">
              <h3 className="font-black text-base text-slate-900">
                Pilih Bagaimana Anda Ingin Meneruskan:
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Anda boleh menjawab soalan maklum balas sekarang berdasarkan ciri di atas, atau cuba aplikasi terlebih dahulu dan jawab bila-bila masa!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Pilihan 1: Jawab Maklum Balas Terus */}
                <button
                  type="button"
                  onClick={() => setStep('step-3-feedback')}
                  className="p-3.5 bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99]"
                >
                  <MessageSquareHeart className="w-4 h-4" />
                  <span>Jawab Maklum Balas Sekarang</span>
                </button>

                {/* Pilihan 2: Cuba App Dulu */}
                <button
                  type="button"
                  onClick={onOpenAppTrial}
                  className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99]"
                >
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span>Uji & Teroka Aplikasi Ibni Dahulu</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 italic pt-1">
                *Sekiranya anda memilih untuk menguji dahulu, butang maklum balas terapung akan sentiasa sedia untuk anda klik semula.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LANGKAH 3: SOAL SELIDIK MAKLUM BALAS / TESTIMONI PENGGUNAAN                */}
        {/* ========================================================================= */}
        {step === 'step-3-feedback' && (
          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200 uppercase tracking-wider inline-block">
                Langkah 3 daripada 3: Penilaian & Testimoni
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Maklum Balas Terhadap Ciri & Potensi Aplikasi Ibni
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sila berikan penilaian jujur anda bagi setiap fungsi utama yang dibangunkan dalam aplikasi Ibni.
              </p>
            </div>

            {/* Soalan 1: Kunci Gajet */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
              <label className="block text-xs font-black text-slate-900">
                1. Adakah fungsi kunci gajet (time-out & PIN ibu bapa) dalam aplikasi Ibni ini dianggap sebagai fungsi yang berguna?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Sangat Berguna', 'Berguna', 'Kurang Berguna', 'Tidak Berguna'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFeedbackForm({ ...feedbackForm, kunci_gajet_berguna: opt })}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      feedbackForm.kunci_gajet_berguna === opt
                        ? 'bg-cyan-500 text-white border-cyan-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Soalan 2: Peringatan Solat */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
              <label className="block text-xs font-black text-slate-900">
                2. Adakah fungsi peringatan solat fardu (integrasi waktu Malaysia & jeda skrin) dianggap sebagai fungsi yang berguna?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Sangat Berguna', 'Berguna', 'Kurang Berguna', 'Tidak Berguna'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFeedbackForm({ ...feedbackForm, peringatan_solat_berguna: opt })}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      feedbackForm.peringatan_solat_berguna === opt
                        ? 'bg-cyan-500 text-white border-cyan-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Soalan 3: Aplikasi Membantu */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
              <label className="block text-xs font-black text-slate-900">
                3. Adakah aplikasi Ibni ini secara keseluruhannya dianggap sangat membantu anda?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Sangat Membantu', 'Membantu', 'Kurang Membantu', 'Tidak Membantu'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFeedbackForm({ ...feedbackForm, app_membantu: opt })}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      feedbackForm.app_membantu === opt
                        ? 'bg-cyan-500 text-white border-cyan-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Soalan 4: Gamifikasi */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
              <label className="block text-xs font-black text-slate-900">
                4. Adakah anda bersetuju dengan idea pendekatan gamifikasi dalam pendidikan (mata XP, lencana & kemajuan Duolingo)?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Sangat Bersetuju', 'Bersetuju', 'Kurang Bersetuju', 'Tidak Bersetuju'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFeedbackForm({ ...feedbackForm, setuju_gamifikasi: opt })}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      feedbackForm.setuju_gamifikasi === opt
                        ? 'bg-cyan-500 text-white border-cyan-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Soalan 5: Sokong Pembangunan & Pasaran */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
              <label className="block text-xs font-black text-slate-900">
                5. Adakah anda menyokong untuk aplikasi ini dibangunkan dan dipasarkan secara meluas?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Sangat Menyokong', 'Menyokong', 'Kurang Menyokong', 'Tidak Menyokong'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFeedbackForm({ ...feedbackForm, sokong_pemasaran: opt })}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      feedbackForm.sokong_pemasaran === opt
                        ? 'bg-cyan-500 text-white border-cyan-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Soalan 6: Khusus Guru (PdPc) */}
            {isTeacher && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>6. Khusus Guru: Adakah aplikasi ini membantu anda dalam proses pengajaran dan pembelajaran (PdPc)?</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Sangat Membantu', 'Membantu', 'Kurang Membantu', 'Tidak Membantu'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setFeedbackForm({ ...feedbackForm, bantu_pdpc_guru: opt })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        feedbackForm.bantu_pdpc_guru === opt
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Soalan 7: Cadangan / Komen */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-900">
                7. Cadangan Penambahbaikan atau Komen Peribadi Anda:
              </label>
              <textarea
                rows={3}
                value={feedbackForm.cadangan_komen}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, cadangan_komen: e.target.value })}
                placeholder="Tuliskan sebarang cadangan ciri, penambahbaikan antara muka, atau pandangan ikhlas anda..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {submitError && (
              <p className="text-xs font-bold text-rose-600">{submitError}</p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('step-2-showcase')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2"
              >
                Kembali ke Pengenalan
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Menghantar Maklum Balas...' : 'Hantar Maklum Balas Lengkap'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* LANGKAH 4: SELESAI / PENGHARGAAN                                          */}
        {/* ========================================================================= */}
        {step === 'step-4-completed' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-3xl font-black text-emerald-600 shadow-xs">
              ✓
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Terima Kasih atas Sumbangan Berharga Anda!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Maklum balas serta penilaian anda telah berjaya direkodkan terus ke dalam pangkalan data kajian rasmi <strong>Ibni (Falah™)</strong>.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenAppTrial}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Terus Gunakan Aplikasi Ibni</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('step-1-initial');
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl text-xs"
              >
                Isi Soal Selidik Baharu
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
