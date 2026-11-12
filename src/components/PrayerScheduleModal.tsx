import React from 'react';
import { PrayerTimeSchedule, PrayerLocation } from '../types';
import { MALAYSIA_ZONES } from '../utils/prayerTimes';
import { X, MapPin, Compass, CheckCircle } from 'lucide-react';

interface PrayerScheduleModalProps {
  schedule: PrayerTimeSchedule;
  location: PrayerLocation;
  currentPrayerName: string;
  onClose: () => void;
  onSelectZone: (zoneCode: string) => void;
  onDetectGPS: () => void;
}

export const PrayerScheduleModal: React.FC<PrayerScheduleModalProps> = ({
  schedule,
  location,
  currentPrayerName,
  onClose,
  onSelectZone,
  onDetectGPS,
}) => {
  const prayers = [
    { id: 'Subuh', time: schedule.subuh, icon: '🌄', desc: 'Solat fardhu Subuh (2 rakaat)' },
    { id: 'Syuruk', time: schedule.syuruk, icon: '☀️', desc: 'Terbit matahari' },
    { id: 'Zohor', time: schedule.zohor, icon: '☀️', desc: 'Solat fardhu Zohor (4 rakaat)' },
    { id: 'Asar', time: schedule.asar, icon: '⛅', desc: 'Solat fardhu Asar (4 rakaat)' },
    { id: 'Maghrib', time: schedule.maghrib, icon: '🌅', desc: 'Solat fardhu Maghrib (3 rakaat)' },
    { id: 'Isyak', time: schedule.isyak, icon: '🌙', desc: 'Solat fardhu Isyak (4 rakaat)' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="ibni-card bg-white max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🕌</span>
              <h3 className="text-xl font-black text-slate-900">Jadual Waktu Solat Harian</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">Berdasarkan waktu rasmi JAKIM Malaysia</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location selector / GPS detect */}
        <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-700" /> Lokasi Semasa: {location.zoneName} ({location.zone})
            </span>
            <button
              onClick={onDetectGPS}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Compass className="w-3 h-3" /> Auto Detect GPS
            </button>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <label className="text-[11px] font-semibold text-slate-600 shrink-0">Tukar Zon:</label>
            <select
              value={location.zone}
              onChange={(e) => onSelectZone(e.target.value)}
              className="bg-white border border-slate-200 focus:border-cyan-500 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-800 w-full"
            >
              {MALAYSIA_ZONES.map((z) => (
                <option key={z.code} value={z.code}>
                  {z.code} - {z.name} ({z.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {prayers.map((p) => {
            const isCurrent = currentPrayerName.toLowerCase().includes(p.id.toLowerCase());
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 border-emerald-300 shadow-2xs font-bold'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {p.id}
                      {isCurrent && (
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> Sekarang / Seterusnya
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-normal">{p.desc}</p>
                  </div>
                </div>
                <div className="text-base font-extrabold text-slate-900 font-mono tracking-wide">
                  {p.time}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-2xl text-xs transition-colors shadow-xs"
        >
          Selesai & Kembali
        </button>
      </div>
    </div>
  );
};
