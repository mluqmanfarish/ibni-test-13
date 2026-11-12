import { PrayerTimeSchedule, PrayerLocation, NextPrayerInfo } from '../types';

export const MALAYSIA_ZONES: { code: string; name: string; state: string }[] = [
  { code: 'WLY01', name: 'Kuala Lumpur, Putrajaya', state: 'Wilayah Persekutuan' },
  { code: 'SGR01', name: 'Shah Alam, Petaling, Gombak, Sepang', state: 'Selangor' },
  { code: 'JHR02', name: 'Johor Bahru, Kota Tinggi, Kulai', state: 'Johor' },
  { code: 'PNG01', name: 'Seluruh Negeri Pulau Pinang', state: 'Pulau Pinang' },
  { code: 'PRK02', name: 'Ipoh, Batu Gajah, Kampar', state: 'Perak' },
  { code: 'MLK01', name: 'Seluruh Negeri Melaka', state: 'Melaka' },
  { code: 'KDH01', name: 'Kota Setar, Kubang Pasu, Pokok Sena', state: 'Kedah' },
  { code: 'TRG01', name: 'Kuala Terengganu, Marang', state: 'Terengganu' },
  { code: 'KTN01', name: 'Kota Bharu, Bachok, Pasir Puteh', state: 'Kelantan' },
  { code: 'SBH07', name: 'Kota Kinabalu, Penampang, Ranau', state: 'Sabah' },
  { code: 'SWK08', name: 'Kuching, Bau, Lundu, Samarahan', state: 'Sarawak' },
];

export function getMockPrayerTimes(zoneCode: string = 'WLY01'): PrayerTimeSchedule {
  // Slight offsets based on zone for realistic Malaysian geography
  let offsetMin = 0;
  if (zoneCode === 'JHR02') offsetMin = -8;
  if (zoneCode === 'PNG01') offsetMin = 8;
  if (zoneCode === 'SBH07') offsetMin = -45;
  if (zoneCode === 'SWK08') offsetMin = -35;
  if (zoneCode === 'TRG01') offsetMin = -12;

  const baseMinutes = {
    subuh: 5 * 60 + 52 + offsetMin,
    syuruk: 7 * 60 + 8 + offsetMin,
    zohor: 13 * 60 + 16 + offsetMin,
    asar: 16 * 60 + 35 + offsetMin,
    maghrib: 19 * 60 + 18 + offsetMin,
    isyak: 20 * 60 + 31 + offsetMin,
  };

  const toTimeStr = (totalMins: number) => {
    const norm = (totalMins + 1440) % 1440;
    const h = Math.floor(norm / 60);
    const m = norm % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return {
    subuh: toTimeStr(baseMinutes.subuh),
    syuruk: toTimeStr(baseMinutes.syuruk),
    zohor: toTimeStr(baseMinutes.zohor),
    asar: toTimeStr(baseMinutes.asar),
    maghrib: toTimeStr(baseMinutes.maghrib),
    isyak: toTimeStr(baseMinutes.isyak),
  };
}

export function calculateNextPrayer(schedule: PrayerTimeSchedule, now: Date = new Date()): NextPrayerInfo {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = currentMinutes * 60 + now.getSeconds();

  const parseTimeToSeconds = (tStr: string) => {
    const [h, m] = tStr.split(':').map(Number);
    return (h * 60 + m) * 60;
  };

  const prayers = [
    { name: 'Subuh', sec: parseTimeToSeconds(schedule.subuh), timeStr: schedule.subuh },
    { name: 'Syuruk', sec: parseTimeToSeconds(schedule.syuruk), timeStr: schedule.syuruk },
    { name: 'Zohor', sec: parseTimeToSeconds(schedule.zohor), timeStr: schedule.zohor },
    { name: 'Asar', sec: parseTimeToSeconds(schedule.asar), timeStr: schedule.asar },
    { name: 'Maghrib', sec: parseTimeToSeconds(schedule.maghrib), timeStr: schedule.maghrib },
    { name: 'Isyak', sec: parseTimeToSeconds(schedule.isyak), timeStr: schedule.isyak },
  ];

  // Find next prayer today
  for (const p of prayers) {
    if (p.sec > currentSeconds) {
      const diffSec = p.sec - currentSeconds;
      return {
        name: p.name,
        timeStr: p.timeStr,
        remainingSeconds: diffSec,
        formattedCountdown: formatSeconds(diffSec),
      };
    }
  }

  // If passed Isyak, next is Subuh tomorrow (add 24h)
  const tomorrowSubuhSec = prayers[0].sec + 24 * 3600;
  const diffSec = tomorrowSubuhSec - currentSeconds;
  return {
    name: 'Subuh (Esok)',
    timeStr: prayers[0].timeStr,
    remainingSeconds: diffSec,
    formattedCountdown: formatSeconds(diffSec),
  };
}

export function formatSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export async function detectLocatePrayerZone(): Promise<PrayerLocation> {
  // Simulates or uses real Geolocation API if available
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
      });

      const { latitude, longitude } = position.coords;

      // Basic bounding box for key Malaysian regions
      if (latitude > 5.0 && longitude < 101.0) {
        return { zone: 'PNG01', zoneName: 'Pulau Pinang', state: 'Pulau Pinang', detectedVia: 'gps' };
      } else if (latitude < 2.0 && longitude > 103.0) {
        return { zone: 'JHR02', zoneName: 'Johor Bahru', state: 'Johor', detectedVia: 'gps' };
      } else if (longitude > 115.0) {
        return { zone: 'SBH07', zoneName: 'Kota Kinabalu', state: 'Sabah', detectedVia: 'gps' };
      } else if (longitude > 109.0 && longitude <= 115.0) {
        return { zone: 'SWK08', zoneName: 'Kuching', state: 'Sarawak', detectedVia: 'gps' };
      } else if (latitude > 3.0 && latitude < 3.5 && longitude > 101.4 && longitude < 101.9) {
        return { zone: 'WLY01', zoneName: 'Kuala Lumpur', state: 'Wilayah Persekutuan', detectedVia: 'gps' };
      }
    } catch {
      // Fallback below
    }
  }

  // Default detected location
  return {
    zone: 'WLY01',
    zoneName: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    detectedVia: 'auto',
  };
}
