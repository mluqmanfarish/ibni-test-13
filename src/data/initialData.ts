import { GameItem, TaskItem, FriendItem, StudentItem, ChildDevice, ParentSettings } from '../types';

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'game-1',
    title: 'Pengembaraan Sifir Kilat',
    category: 'Matematik',
    desc: 'Uji kepantasan sifir anda! Jawab 5 soalan pantas untuk membuka kunci ganjaran XP.',
    xp: 50,
    creator: 'Cikgu Aminah (Guru)',
    colorScheme: 'cyan',
    playsCount: 142,
    rating: 4.9,
    htmlCode: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pengembaraan Sifir Kilat</title>
  <style>
    * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    body { background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
    .card { background: #1e293b; border: 3px solid #38bdf8; border-radius: 20px; padding: 24px; max-width: 420px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h2 { color: #38bdf8; margin-top: 0; font-size: 22px; }
    .question-box { font-size: 38px; font-weight: 800; background: #0b1329; border: 2px dashed #38bdf8; padding: 18px; border-radius: 16px; margin: 20px 0; letter-spacing: 2px; }
    .options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
    button.opt-btn { background: #334155; border: 2px solid #64748b; color: white; padding: 14px; font-size: 20px; font-weight: bold; border-radius: 12px; cursor: pointer; transition: all 0.15s; }
    button.opt-btn:hover { background: #38bdf8; color: #0f172a; border-color: #38bdf8; transform: translateY(-2px); }
    .score-badge { display: inline-block; background: #38bdf8; color: #0f172a; font-weight: 800; padding: 4px 14px; border-radius: 999px; font-size: 14px; margin-bottom: 12px; }
    .feedback { font-weight: bold; font-size: 16px; min-height: 24px; margin-top: 14px; }
    .win-box { display: none; }
    .claim-btn { background: #10b981; color: white; border: none; font-weight: 800; font-size: 18px; padding: 14px 28px; border-radius: 14px; cursor: pointer; margin-top: 16px; width: 100%; box-shadow: 0 4px 0 #047857; }
    .claim-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #047857; }
  </style>
</head>
<body>
  <div class="card" id="gameArea">
    <div class="score-badge">Soalan <span id="qNum">1</span> / 5</div>
    <h2>Pengembaraan Sifir Kilat ⚡</h2>
    <div class="question-box" id="questionText">7 × 8 = ?</div>
    <div class="options" id="optionsGrid"></div>
    <div class="feedback" id="feedbackMsg"></div>
  </div>

  <div class="card win-box" id="winArea">
    <div style="font-size: 50px;">🏆</div>
    <h2 style="color: #4ade80;">TAHNIAH!</h2>
    <p>Anda telah berjaya menjawab semua 5 soalan sifir dengan cemerlang!</p>
    <div style="background: #064e3b; border: 2px solid #10b981; padding: 12px; border-radius: 12px; font-weight: bold; color: #6ee7b7;">
      Ganjaran: +50 XP
    </div>
    <button class="claim-btn" onclick="finishGame()">Tuntut XP & Selesai</button>
  </div>

  <script>
    const questions = [
      { q: "7 × 8", a: 56, opts: [54, 56, 48, 63] },
      { q: "9 × 6", a: 54, opts: [54, 45, 63, 52] },
      { q: "12 × 4", a: 48, opts: [44, 46, 48, 52] },
      { q: "6 × 7", a: 42, opts: [36, 42, 48, 49] },
      { q: "8 × 9", a: 72, opts: [72, 64, 81, 74] }
    ];
    let currentIndex = 0;

    function renderQuestion() {
      if (currentIndex >= questions.length) {
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('winArea').style.display = 'block';
        return;
      }
      const item = questions[currentIndex];
      document.getElementById('qNum').innerText = currentIndex + 1;
      document.getElementById('questionText').innerText = item.q + " = ?";
      const grid = document.getElementById('optionsGrid');
      grid.innerHTML = '';
      const shuffled = [...item.opts].sort(() => Math.random() - 0.5);
      shuffled.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = ans;
        btn.onclick = () => checkAnswer(ans, item.a);
        grid.appendChild(btn);
      });
      document.getElementById('feedbackMsg').innerText = '';
    }

    function checkAnswer(chosen, correct) {
      const fb = document.getElementById('feedbackMsg');
      if (chosen === correct) {
        fb.style.color = '#4ade80';
        fb.innerText = 'Tepat Sekali! 🎉';
        setTimeout(() => {
          currentIndex++;
          renderQuestion();
        }, 600);
      } else {
        fb.style.color = '#f87171';
        fb.innerText = 'Cuba lagi! Anda boleh buat!';
      }
    }

    function finishGame() {
      if (window.parent) {
        window.parent.postMessage({ type: 'IBNI_GAME_COMPLETE', xp: 50, gameId: 'game-1' }, '*');
      }
    }

    renderQuestion();
  </script>
</body>
</html>`
  },
  {
    id: 'game-2',
    title: 'Cabaran Rukun Islam & Solat',
    category: 'Pendidikan Islam',
    desc: 'Ketahui bilangan rakaat, rukun Islam, dan adab harian dengan kuiz interaktif bermakna.',
    xp: 60,
    creator: 'Ibu Bapa (Parent)',
    colorScheme: 'emerald',
    playsCount: 98,
    rating: 5.0,
    htmlCode: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Cabaran Rukun Islam & Solat</title>
  <style>
    body { font-family: sans-serif; background: #064e3b; color: #ecfdf5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .box { background: #022c22; border: 3px solid #34d399; padding: 24px; border-radius: 24px; max-width: 440px; width: 100%; text-align: center; }
    h2 { color: #6ee7b7; margin-top: 0; }
    .soalan { font-size: 20px; font-weight: bold; margin: 20px 0; padding: 15px; background: #065f46; border-radius: 12px; }
    .pilihan { display: flex; flex-direction: column; gap: 10px; }
    button { background: #047857; border: 2px solid #34d399; color: white; padding: 12px; font-size: 16px; font-weight: bold; border-radius: 12px; cursor: pointer; transition: 0.2s; }
    button:hover { background: #10b981; }
  </style>
</head>
<body>
  <div class="box" id="mainCard">
    <h2>🕌 Kuiz Rukun Islam & Solat</h2>
    <div class="soalan" id="soalanText">Berapakah bilangan rakaat bagi solat Asar?</div>
    <div class="pilihan" id="btnGroup">
      <button onclick="pilih(2)">2 Rakaat</button>
      <button onclick="pilih(3)">3 Rakaat</button>
      <button onclick="pilih(4)">4 Rakaat</button>
    </div>
    <p id="info" style="font-weight: bold; margin-top: 15px;"></p>
  </div>
  <script>
    let step = 1;
    function pilih(val) {
      const info = document.getElementById('info');
      if (step === 1) {
        if (val === 4) {
          info.style.color = '#34d399';
          info.innerText = 'Betul! Solat Asar mempunyai 4 rakaat.';
          setTimeout(() => {
            step = 2;
            document.getElementById('soalanText').innerText = 'Apakah Rukun Islam yang kedua?';
            document.getElementById('btnGroup').innerHTML = \`
              <button onclick="pilih('haji')">Menunaikan Haji</button>
              <button onclick="pilih('solat')">Mendirikan Solat 5 Waktu</button>
              <button onclick="pilih('puasa')">Berpuasa di Bulan Ramadan</button>
            \`;
            info.innerText = '';
          }, 900);
        } else {
          info.style.color = '#f87171';
          info.innerText = 'Kurang tepat. Cuba ingat kembali rakaat Zohor, Asar dan Isyak.';
        }
      } else if (step === 2) {
        if (val === 'solat') {
          info.style.color = '#34d399';
          info.innerText = 'Cemerlang! Rukun Islam ke-2 ialah Mendirikan Solat!';
          setTimeout(() => {
            document.getElementById('mainCard').innerHTML = \`
              <h2 style="color: #6ee7b7;">Alhamdulillah! Selesai! ✨</h2>
              <p>Anda telah memperkukuhkan ilmu asas agama anda.</p>
              <button style="background: #10b981; width: 100%; padding: 14px; font-size: 18px;" onclick="window.parent.postMessage({type:'IBNI_GAME_COMPLETE', xp:60, gameId:'game-2'}, '*')">Tuntut 60 XP</button>
            \`;
          }, 900);
        } else {
          info.style.color = '#f87171';
          info.innerText = 'Cuba lagi! Petunjuk: Tiang Agama.';
        }
      }
    }
  </script>
</body>
</html>`
  },
  {
    id: 'game-3',
    title: 'Kalkulator Angkasa (Space Math Defender)',
    category: 'Matematik',
    desc: 'Tembak meteor nombor dengan menekan jawapan tambah tolak yang betul sebelum tiba di bumi!',
    xp: 45,
    creator: 'Cikgu Aminah (Guru)',
    colorScheme: 'purple',
    playsCount: 210,
    rating: 4.8,
    htmlCode: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Space Math Defender</title>
  <style>
    body { margin:0; background:#0b0f19; color:#e2e8f0; font-family:system-ui; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
    .game-container { border:2px solid #818cf8; border-radius:18px; padding:20px; background:#181b34; text-align:center; max-width:400px; width:90%; }
    .meteor { font-size:28px; font-weight:900; color:#fbbf24; background:#312e81; padding:15px; border-radius:14px; border:2px dashed #a5b4fc; margin:15px 0; }
    .answers { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    button { background:#4338ca; color:white; border:none; padding:12px; font-size:18px; font-weight:bold; border-radius:10px; cursor:pointer; }
    button:hover { background:#6366f1; }
  </style>
</head>
<body>
  <div class="game-container" id="box">
    <h3 style="color:#a5b4fc; margin:0;">🚀 Pertahanan Angkasa</h3>
    <p style="font-size:13px; color:#94a3b8;">Hapuskan 3 asteroid matematik!</p>
    <div style="font-size:12px; font-weight:bold; color:#38bdf8;">Asteroid: <span id="astCount">1</span> / 3</div>
    <div class="meteor" id="target">25 + 17 = ?</div>
    <div class="answers" id="btnGroup"></div>
  </div>
  <script>
    const levels = [
      { q: "25 + 17", a: 42, opts: [40, 42, 44, 38] },
      { q: "60 - 24", a: 36, opts: [36, 34, 46, 26] },
      { q: "15 × 3", a: 45, opts: [35, 40, 45, 50] }
    ];
    let idx = 0;
    function load() {
      if(idx >= levels.length) {
        document.getElementById('box').innerHTML = \`
          <h2 style="color:#34d399;">Asteroid Dimusnahkan! 💥</h2>
          <p>Bumi selamat berkat ketangkasan matematik anda!</p>
          <button style="background:#10b981; width:100%;" onclick="window.parent.postMessage({type:'IBNI_GAME_COMPLETE', xp:45, gameId:'game-3'}, '*')">Tuntut 45 XP</button>
        \`;
        return;
      }
      const lvl = levels[idx];
      document.getElementById('astCount').innerText = idx + 1;
      document.getElementById('target').innerText = lvl.q + " = ?";
      const group = document.getElementById('btnGroup');
      group.innerHTML = '';
      lvl.opts.forEach(o => {
        const b = document.createElement('button');
        b.innerText = o;
        b.onclick = () => {
          if (o === lvl.a) {
            idx++;
            load();
          } else {
            alert('Sasaran meleset! Kira semula!');
          }
        };
        group.appendChild(b);
      });
    }
    load();
  </script>
</body>
</html>`
  },
  {
    id: 'game-4',
    title: 'Kosa Kata Explorer: Padanan Ejaan',
    category: 'Bahasa Melayu',
    desc: 'Lengkapkan imbuhan dan ejaan tatabahasa betul dalam petikan pendek.',
    xp: 40,
    creator: 'Cikgu Aminah (Guru)',
    colorScheme: 'amber',
    playsCount: 165,
    rating: 4.7,
    htmlCode: `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <title>Kosa Kata Explorer</title>
  <style>
    body { font-family:sans-serif; background:#fffbeb; color:#78350f; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:16px; }
    .card { background:white; border:3px solid #b45309; border-radius:20px; padding:22px; max-width:400px; width:100%; text-align:center; box-shadow:0 8px 0 #b45309; }
    .sentence { background:#fef3c7; padding:15px; border-radius:12px; font-size:18px; font-weight:bold; margin:16px 0; }
    .btn { background:#d97706; color:white; border:none; padding:12px 20px; font-size:16px; font-weight:bold; border-radius:12px; cursor:pointer; width:100%; margin-bottom:8px; }
    .btn:hover { background:#b45309; }
  </style>
</head>
<body>
  <div class="card" id="cardArea">
    <h3 style="margin-top:0;">📖 Kosa Kata & Ejaan Betul</h3>
    <p style="font-size:13px;">Pilih perkataan dengan ejaan rasmi Dewan Bahasa dan Pustaka:</p>
    <div class="sentence">Amir pergi ke pasar untuk membeli sebuku ______ gandum.</div>
    <button class="btn" onclick="pilih(false)">roti canai</button>
    <button class="btn" onclick="pilih(true)">roti</button>
    <button class="btn" onclick="pilih(false)">roti nan</button>
  </div>
  <script>
    function pilih(isCorrect) {
      if(isCorrect) {
        document.getElementById('cardArea').innerHTML = \`
          <h2 style="color:#059669;">Tahniah! Jawapan Tepat! 🌟</h2>
          <p style="font-size:14px;">Penjodoh bilangan 'sebuku' digunakan untuk benda berbongkah seperti roti atau sabun.</p>
          <button class="btn" style="background:#10b981;" onclick="window.parent.postMessage({type:'IBNI_GAME_COMPLETE', xp:40, gameId:'game-4'}, '*')">Tuntut 40 XP</button>
        \`;
      } else {
        alert('Penjodoh bilangan sebuku khusus untuk roti! Cuba lagi.');
      }
    }
  </script>
</body>
</html>`
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Pengembaraan Sifir Kilat',
    desc: 'Selesaikan 5 soalan sifir laju untuk lulus tugasan matematik hari ini.',
    subject: 'Matematik',
    xp: 50,
    isMandatory: true,
    completed: false,
    assignedBy: 'Cikgu Aminah (Guru)',
    gameId: 'game-1',
  },
  {
    id: 'task-2',
    title: 'Cabaran Rukun Islam & Solat',
    desc: 'Ulang kaji bilangan rakaat dan rukun Islam bersama keluarga.',
    subject: 'Pendidikan Islam',
    xp: 60,
    isMandatory: true,
    completed: false,
    assignedBy: 'Ibu Bapa (Parent)',
    gameId: 'game-2',
  },
  {
    id: 'task-3',
    title: 'Kosa Kata Explorer: Padanan Ejaan',
    desc: 'Lengkapkan latihan tatabahasa penjodoh bilangan.',
    subject: 'Bahasa Melayu',
    xp: 40,
    isMandatory: false,
    completed: false,
    assignedBy: 'Cikgu Aminah (Guru)',
    gameId: 'game-4',
  }
];

export const INITIAL_FRIENDS: FriendItem[] = [
  { id: 'f-1', name: 'Aiman Mukhriz', code: 'AIMAN-912', xp: 1250, level: 8, avatar: '👦', streakDays: 14, badge: 'Jaguh Matematik' },
  { id: 'f-2', name: 'Nur Sarah Balqis', code: 'SARAH-404', xp: 980, level: 7, avatar: '🧕', streakDays: 9, badge: 'Hafizah Cilik' },
  { id: 'f-3', name: 'Anda (Luqman)', code: 'LUQMAN-101', xp: 350, level: 3, avatar: '🧒', isUser: true, streakDays: 5, badge: 'Peneroka Gigih' },
  { id: 'f-4', name: 'Danial Hakim', code: 'DANIAL-720', xp: 310, level: 3, avatar: '👦', streakDays: 3, badge: 'Rakan Setia' },
  { id: 'f-5', name: 'Alif Zikri', code: 'ALIF-552', xp: 240, level: 2, avatar: '🧑', streakDays: 2, badge: 'Pelajar Baru' },
];

export const INITIAL_STUDENTS: StudentItem[] = [
  {
    id: 'std-1',
    name: 'Aiman Mukhriz bin Rosli',
    studentId: '5B-01',
    classId: '5-bestari',
    xp: 1250,
    scorePct: 98,
    grade: 'A',
    completedTasks: 12,
    totalTasks: 12,
    solatStreak: 14,
    subjectScores: { matematik: 98, islamic: 100, sains: 95, bm: 96 },
    notes: 'Sangat konsisten menyiapkan latihan kuiz sebelum masa skrin tamat. Menjadi contoh teladan.',
    avatar: '👦'
  },
  {
    id: 'std-2',
    name: 'Luqman Hardi bin Farish',
    studentId: '5B-02',
    classId: '5-bestari',
    xp: 350,
    scorePct: 92,
    grade: 'A',
    completedTasks: 8,
    totalTasks: 10,
    solatStreak: 5,
    subjectScores: { matematik: 94, islamic: 98, sains: 88, bm: 90 },
    notes: 'Menunjukkan peningkatan ketara dalam matematik sifir kilat. Rajin menepati waktu solat.',
    avatar: '🧒'
  },
  {
    id: 'std-3',
    name: 'Nur Sarah Balqis binti Zulkifli',
    studentId: '5B-03',
    classId: '5-bestari',
    xp: 980,
    scorePct: 95,
    grade: 'A',
    completedTasks: 11,
    totalTasks: 12,
    solatStreak: 9,
    subjectScores: { matematik: 92, islamic: 99, sains: 94, bm: 95 },
    notes: 'Pencapaian cemerlang dalam pendidikan Islam dan tatabahasa BM.',
    avatar: '🧕'
  },
  {
    id: 'std-4',
    name: 'Danial Hakim bin Razak',
    studentId: '5B-04',
    classId: '5-bestari',
    xp: 310,
    scorePct: 84,
    grade: 'B',
    completedTasks: 7,
    totalTasks: 10,
    solatStreak: 3,
    subjectScores: { matematik: 82, islamic: 90, sains: 80, bm: 84 },
    notes: 'Perlu bimbingan sedikit untuk pantas mencongak sifir, namun sangat bersemangat.',
    avatar: '👦'
  },
  {
    id: 'std-5',
    name: 'Farisya Adelia binti Imran',
    studentId: '5B-05',
    classId: '5-bestari',
    xp: 620,
    scorePct: 89,
    grade: 'B',
    completedTasks: 9,
    totalTasks: 11,
    solatStreak: 7,
    subjectScores: { matematik: 88, islamic: 92, sains: 91, bm: 86 },
    notes: 'Aktif menyertai cabaran mingguan sains dan matematik.',
    avatar: '👧'
  }
];

export const INITIAL_DEVICES: ChildDevice[] = [
  {
    id: 'dev-1',
    name: 'Tablet Luqman',
    model: 'Samsung Galaxy Tab A8',
    isOnline: true,
    battery: 84,
    remainingSeconds: 6300, // 01:45:00
    totalLimitSeconds: 7200, // 2 hours
    status: 'Aktif',
    lastSeen: 'Sebentar tadi'
  },
  {
    id: 'dev-2',
    name: 'Telefon Rumah (Kongsi)',
    model: 'Redmi Note 11',
    isOnline: false,
    battery: 62,
    remainingSeconds: 3600,
    totalLimitSeconds: 3600,
    status: 'Terkunci',
    lastSeen: '2 jam yang lalu'
  }
];

export const INITIAL_SETTINGS: ParentSettings = {
  dailyLimitSeconds: 6300, // 01:45:00
  isTimerEnabled: true,
  isSolatLockEnabled: true,
  requireTasksBeforePlay: true,
  bedtimeLock: {
    enabled: true,
    start: '21:30',
    end: '06:00'
  },
  pinCode: '1234'
};
