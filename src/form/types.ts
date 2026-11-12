export type RespondentType = 'Ibu Bapa' | 'Guru' | 'Kedua-duanya (Ibu Bapa & Guru)';

export interface InitialSurveyAnswers {
  jenis_responden: RespondentType;
  // Ibu bapa
  masa_anak?: string;
  sukar_kawal_gajet?: string;
  alat_kawalan?: string;
  sukar_ulang_kaji?: string;
  sukar_solat?: string;
  // Guru
  kaedah_konvensional?: string;
  setuju_interaktif?: string;
  setuju_ai?: string;
}

export interface PostFeedbackAnswers {
  kunci_gajet_berguna: string; // entry.1592112152
  peringatan_solat_berguna: string; // entry.433320611
  app_membantu: string; // entry.599611673
  setuju_gamifikasi: string; // entry.638260519
  sokong_pemasaran: string; // entry.2109346524
  bantu_pdpc_guru?: string; // entry.38139519
  cadangan_komen: string; // entry.1068352295
}

export type SurveyStep = 
  | 'step-1-initial'    // Soal selidik am
  | 'step-2-showcase'   // Pengenalan aplikasi Ibni & ciri-cirinya + pilihan
  | 'step-3-feedback'   // Soal selidik maklum balas / testimoni
  | 'step-4-completed'; // Terima kasih & selesai
