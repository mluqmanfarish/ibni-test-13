import React, { useState } from 'react';
import {
  ChildDevice,
  ParentSettings,
  GameItem,
  TaskItem,
  ActivityLog,
} from '../types';
import { formatSeconds } from '../utils/prayerTimes';
import {
  Smartphone,
  Sliders,
  Code,
  Shield,
  Plus,
  Play,
  Lock,
  Unlock,
  Battery,
  Wifi,
  History,
  CheckCircle,
  Eye,
} from 'lucide-react';

interface ParentModeProps {
  devices: ChildDevice[];
  settings: ParentSettings;
  games: GameItem[];
  tasks: TaskItem[];
  activityLogs: ActivityLog[];
  onUpdateSettings: (newSettings: ParentSettings) => void;
  onToggleDeviceLock: (deviceId: string) => void;
  onAdjustDeviceTime: (deviceId: string, deltaSeconds: number) => void;
  onAddDevice: (name: string, model: string) => void;
  onAssignGameAsTask: (game: GameItem, isMandatory: boolean) => void;
  onCreateCustomGame: (game: Omit<GameItem, 'id' | 'playsCount' | 'rating'>) => void;
  onLaunchGame: (gameId: string) => void;
}

export const ParentMode: React.FC<ParentModeProps> = ({
  devices,
  settings,
  games,
  tasks,
  activityLogs,
  onUpdateSettings,
  onToggleDeviceLock,
  onAdjustDeviceTime,
  onAddDevice,
  onAssignGameAsTask,
  onCreateCustomGame,
  onLaunchGame,
}) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'settings' | 'library' | 'activity'>('devices');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Local settings state for editing
  const [localSettings, setLocalSettings] = useState<ParentSettings>({ ...settings });
  const [limitHours, setLimitHours] = useState(Math.floor(settings.dailyLimitSeconds / 3600));
  const [limitMinutes, setLimitMinutes] = useState(Math.floor((settings.dailyLimitSeconds % 3600) / 60));

  // Add device form
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('');

  // Create HTML Game Studio state
  const [showHtmlCreator, setShowHtmlCreator] = useState(false);
  const [customTitle, setCustomTitle] = useState('Kuiz Hebat Sains & Bintang');
  const [customCategory, setCustomCategory] = useState<'Matematik' | 'Pendidikan Islam' | 'Sains' | 'Bahasa Melayu' | 'Logik & Minda'>('Sains');
  const [customDesc, setCustomDesc] = useState('Kuiz interaktif mengenal buruj dan planet di angkasa.');
  const [customXp, setCustomXp] = useState(50);
  const [customHtml, setCustomHtml] = useState(`<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: system-ui; background: #0f172a; color: white; text-align: center; padding: 24px; }
    .card { background: #1e293b; border: 2px solid #38bdf8; border-radius: 16px; padding: 20px; max-width: 360px; margin: 0 auto; }
    button { background: #38bdf8; color: #0f172a; border: none; font-weight: bold; padding: 12px 20px; font-size: 16px; border-radius: 10px; cursor: pointer; width: 100%; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <h3>🌌 Planet Paling Dekat Dengan Matahari?</h3>
    <button onclick="pilih(false)">Zuhal</button>
    <button onclick="pilih(true)">Utarid</button>
    <button onclick="pilih(false)">Marikh</button>
    <p id="msg" style="margin-top: 15px; font-weight: bold;"></p>
  </div>
  <script>
    function pilih(betul) {
      if(betul) {
        document.getElementById('msg').innerHTML = "Tepat sekali! Utarid (Mercury) paling hampir.";
        setTimeout(() => {
          window.parent.postMessage({ type: 'IBNI_GAME_COMPLETE', xp: 50 }, '*');
        }, 1000);
      } else {
        document.getElementById('msg').innerHTML = "Kurang tepat! Cuba lagi.";
      }
    }
  </script>
</body>
</html>`);

  const handleSaveSettings = () => {
    const totalSecs = limitHours * 3600 + limitMinutes * 60;
    const updated = {
      ...localSettings,
      dailyLimitSeconds: Math.max(900, totalSecs),
    };
    onUpdateSettings(updated);
    setSaveSuccessMsg('Tetapan had masa dan kawalan berjaya disimpan!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCreateGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customHtml) return;

    onCreateCustomGame({
      title: customTitle,
      category: customCategory,
      desc: customDesc,
      xp: customXp,
      creator: 'Ibu Bapa (Parent)',
      colorScheme: 'purple',
      htmlCode: customHtml,
    });

    setShowHtmlCreator(false);
    setSaveSuccessMsg(`Permainan "${customTitle}" berjaya dicipta dan sedia untuk di-assign!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName) return;
    onAddDevice(newDeviceName, newDeviceModel || 'Android / iOS');
    setNewDeviceName('');
    setNewDeviceModel('');
    setShowAddDeviceModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="ibni-card p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Panel Kawalan Ibu Bapa
              </h3>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Urus peranti anak, had masa skrin tetap, dan cipta tugasan kuiz berfaedah.
            </p>
          </div>

          <span className="bg-cyan-50 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200 flex items-center gap-1.5 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-cyan-600" /> Kawalan Aktif
          </span>
        </div>

        {/* Sub Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'devices' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Senarai Peranti ({devices.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Tetapan Timer & Solat
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'library' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Pustaka & Cipta Game HTML
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'activity' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Rekod Aktiviti
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* 1. Tab: SENARAI PERANTI ANAK */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-600" /> Peranti Anak Berdaftar
              </h4>
              <p className="text-xs text-slate-500">Kawal status langsung, baki masa, dan kunci peranti dari jauh.</p>
            </div>
            <button
              onClick={() => setShowAddDeviceModal(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Device
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((dev) => (
              <div key={dev.id} className="ibni-card p-5 bg-white space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-black text-base text-slate-900 flex items-center gap-2">
                      {dev.name}
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${dev.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}
                        title={dev.isOnline ? 'Online' : 'Offline'}
                      />
                    </h5>
                    <p className="text-xs text-slate-500 font-semibold">{dev.model}</p>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      dev.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : 'bg-rose-100 text-rose-900 border-rose-400'
                    }`}
                  >
                    {dev.status}
                  </span>
                </div>

                {/* Device stats */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Baki Masa</span>
                    <span className="text-sm font-black font-mono text-slate-900">
                      {formatSeconds(dev.remainingSeconds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Bateri</span>
                    <span className="text-sm font-black text-slate-900 flex items-center justify-center gap-1">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" /> {dev.battery}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Sambungan</span>
                    <span className="text-sm font-black text-slate-900 flex items-center justify-center gap-1">
                      <Wifi className={`w-3.5 h-3.5 ${dev.isOnline ? 'text-cyan-600' : 'text-slate-400'}`} />
                      {dev.isOnline ? 'WiFi' : 'Padam'}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => onAdjustDeviceTime(dev.id, 900)}
                      className="ibni-pill-sm bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-black px-2.5 py-1.5 rounded-lg"
                      title="Tambah 15 Minit"
                    >
                      +15 Minit
                    </button>
                    <button
                      onClick={() => onAdjustDeviceTime(dev.id, -900)}
                      className="ibni-pill-sm bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-black px-2.5 py-1.5 rounded-lg"
                      title="Tolak 15 Minit"
                    >
                      -15 Minit
                    </button>
                  </div>

                  <button
                    onClick={() => onToggleDeviceLock(dev.id)}
                    className={`ibni-pill font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
                      dev.status === 'Terkunci'
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                    }`}
                  >
                    {dev.status === 'Terkunci' ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Buka Kunci
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Kunci Sekarang
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Tab: SETTING TIMER & SOLAT REMINDER */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Setting Had Masa */}
          <div className="ibni-card p-5 bg-white space-y-4">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
              <Sliders className="w-4 h-4 text-cyan-600" /> Tetapan Had Masa Skrin Harian
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Had Masa Harian (Jam & Minit):
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={limitHours}
                      onChange={(e) => setLimitHours(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-sm font-extrabold text-center w-20 transition-colors"
                    />
                    <span className="text-xs font-semibold text-slate-600">Jam</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={limitMinutes}
                      onChange={(e) => setLimitMinutes(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-sm font-extrabold text-center w-20 transition-colors"
                    />
                    <span className="text-xs font-semibold text-slate-600">Minit</span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: '1 Jam', h: 1, m: 0 },
                  { label: '1 Jam 45 Min (Standard)', h: 1, m: 45 },
                  { label: '2 Jam', h: 2, m: 0 },
                  { label: '3 Jam (Hujung Minggu)', h: 3, m: 0 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setLimitHours(preset.h);
                      setLimitMinutes(preset.m);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Bedtime Lock */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Kunci Waktu Tidur (Bedtime Lock):</span>
                  <input
                    type="checkbox"
                    checked={localSettings.bedtimeLock.enabled}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        bedtimeLock: { ...localSettings.bedtimeLock, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 accent-slate-900"
                  />
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500">Mula:</span>
                  <input
                    type="time"
                    value={localSettings.bedtimeLock.start}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        bedtimeLock: { ...localSettings.bedtimeLock, start: e.target.value },
                      })
                    }
                    className="border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold bg-white"
                  />
                  <span className="text-slate-500">Hingga:</span>
                  <input
                    type="time"
                    value={localSettings.bedtimeLock.end}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        bedtimeLock: { ...localSettings.bedtimeLock, end: e.target.value },
                      })
                    }
                    className="border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Setting ON/OFF Sistem */}
          <div className="ibni-card p-5 bg-white space-y-4">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Suis Kawalan ON/OFF Sistem
            </h4>

            <div className="space-y-3 divide-y divide-slate-100">
              <div className="flex justify-between items-center pt-2 text-xs font-bold">
                <div>
                  <span className="text-slate-900 block">Sistem Had Masa Skrin:</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Skrin mengunci secara automatik apabila had tamat.
                  </span>
                </div>
                <button
                  onClick={() =>
                    setLocalSettings({ ...localSettings, isTimerEnabled: !localSettings.isTimerEnabled })
                  }
                  className={`ibni-pill-sm text-[10px] font-black px-3 py-1 rounded-full ${
                    localSettings.isTimerEnabled
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {localSettings.isTimerEnabled ? 'AKTIF (ON)' : 'TUTUP (OFF)'}
                </button>
              </div>

              <div className="flex justify-between items-center pt-3 text-xs font-bold">
                <div>
                  <span className="text-slate-900 block">Peringatan Solat & Kunci Auto:</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Jeda peranti automatik semasa masuk waktu solat 5 waktu.
                  </span>
                </div>
                <button
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      isSolatLockEnabled: !localSettings.isSolatLockEnabled,
                    })
                  }
                  className={`ibni-pill-sm text-[10px] font-black px-3 py-1 rounded-full ${
                    localSettings.isSolatLockEnabled
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {localSettings.isSolatLockEnabled ? 'AKTIF (ON)' : 'TUTUP (OFF)'}
                </button>
              </div>

              <div className="flex justify-between items-center pt-3 text-xs font-bold">
                <div>
                  <span className="text-slate-900 block">Wajibkan Tugasan Sebelum Game Santai:</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Anak mesti selesaikan kuiz wajib sebelum bebas bermain.
                  </span>
                </div>
                <button
                  onClick={() =>
                    setLocalSettings({
                      ...localSettings,
                      requireTasksBeforePlay: !localSettings.requireTasksBeforePlay,
                    })
                  }
                  className={`ibni-pill-sm text-[10px] font-black px-3 py-1 rounded-full ${
                    localSettings.requireTasksBeforePlay
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {localSettings.requireTasksBeforePlay ? 'AKTIF (ON)' : 'TUTUP (OFF)'}
                </button>
              </div>

              {/* PIN Code */}
              <div className="flex justify-between items-center pt-3 text-xs font-bold">
                <div>
                  <span className="text-slate-900 block">PIN Ibu Bapa:</span>
                  <span className="text-[10px] text-slate-500 font-normal">Untuk buka sekatan kecemasan</span>
                </div>
                <input
                  type="password"
                  maxLength={6}
                  value={localSettings.pinCode}
                  onChange={(e) => setLocalSettings({ ...localSettings, pinCode: e.target.value })}
                  className="bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-lg px-2.5 py-1 text-center font-bold text-xs w-20"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs mt-3 shadow-xs transition-colors"
            >
              Simpan Semua Tetapan
            </button>
          </div>
        </div>
      )}

      {/* 3. Tab: PUSTAKA GAME UNTUK ASSIGN & CREATE HTML */}
      {activeTab === 'library' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-600" /> Pustaka Permainan & Cipta Kuiz HTML
              </h4>
              <p className="text-xs text-slate-500">
                Pilih mana-mana permainan untuk di-assign sebagai tugasan wajib anak, atau cipta kuiz tersuai dengan HTML.
              </p>
            </div>

            <button
              onClick={() => setShowHtmlCreator(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Cipta Game HTML Baru
            </button>
          </div>

          {/* Grid of games */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map((game) => {
              const isAssigned = tasks.some((t) => t.gameId === game.id);
              return (
                <div key={game.id} className="ibni-card p-5 bg-white space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
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

                    <div className="flex space-x-1.5">
                      <button
                        onClick={() => onAssignGameAsTask(game, true)}
                        className={`ibni-pill-sm font-black px-3 py-1.5 rounded-xl text-xs ${
                          isAssigned
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                            : 'bg-rose-500 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {isAssigned ? 'Telah Di-Assign (Wajib)' : 'Assign Tugasan Wajib'}
                      </button>
                      <button
                        onClick={() => onAssignGameAsTask(game, false)}
                        className="ibni-pill-sm bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-2.5 py-1.5 rounded-xl text-xs"
                      >
                        Pilihan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Tab: REKOD AKTIVITI */}
      {activeTab === 'activity' && (
        <div className="ibni-card p-5 bg-white space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-600" /> Rekod & Log Disiplin Harian
              </h4>
              <p className="text-xs text-slate-500">Jejak bila anak selesai solat, bermain game, dan menyiapkan tugasan.</p>
            </div>
            <span className="text-xs font-black bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
              Hari Ini
            </span>
          </div>

          <div className="space-y-2">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-medium"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {log.type === 'solat' ? '🕌' : log.type === 'task' ? '✅' : log.type === 'game' ? '🎮' : '⚙️'}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900">{log.title}</h5>
                    <p className="text-[11px] text-slate-500">{log.detail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE HTML GAME STUDIO */}
      {showHtmlCreator && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="ibni-card bg-white max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-600" /> Cipta Permainan / Kuiz Menggunakan HTML
                </h4>
                <p className="text-xs text-slate-500">
                  Tulis kod HTML/JS interaktif. Kod akan dijalankan dalam sandbox terasing yang selamat.
                </p>
              </div>
              <button
                onClick={() => setShowHtmlCreator(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGameSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tajuk Permainan:</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kategori:</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as typeof customCategory)}
                    className="bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Penerangan Ringkas:</label>
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ganjaran XP:</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={customXp}
                    onChange={(e) => setCustomXp(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs font-bold w-full transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Kod HTML / CSS / JS:</label>
                  <span className="text-[10px] text-cyan-700 font-bold">
                    Tip: Panggil `window.parent.postMessage('GAME_WIN', '*')` bila menang!
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  className="font-mono text-xs bg-slate-900 text-cyan-300 border border-slate-700 rounded-xl p-3 w-full focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowHtmlCreator(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5" /> Simpan & Tambah ke Pustaka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DEVICE */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="ibni-card bg-white max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-600" /> Tambah Peranti Anak Baru
              </h4>
              <button
                onClick={() => setShowAddDeviceModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDeviceSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Peranti:</label>
                <input
                  type="text"
                  placeholder="cth: iPad Belajar Luqman"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-bold w-full transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Model / Jenis:</label>
                <input
                  type="text"
                  placeholder="cth: iPad 9th Gen / Samsung Tab A7"
                  value={newDeviceModel}
                  onChange={(e) => setNewDeviceModel(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-bold w-full transition-colors"
                />
              </div>

              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-cyan-900">Kod Pemasangan (Pairing PIN):</p>
                <p className="font-mono font-black text-sm text-cyan-700 tracking-wider">IBNI-8921</p>
                <p className="text-[10px] text-cyan-800">
                  Masukkan kod ini pada peranti anak untuk mula memantau masa skrin tetap.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddDeviceModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-xs transition-colors"
                >
                  Daftar Peranti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
