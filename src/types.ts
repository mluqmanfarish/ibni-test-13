export type UserRole = 'role-select' | 'child' | 'parent' | 'teacher';

export type ChildTab = 'tasks' | 'library' | 'friends';
export type ParentTab = 'devices' | 'settings' | 'library' | 'activity';
export type TeacherTab = 'classroom' | 'ranking' | 'library' | 'analytics';

export interface PrayerTimeSchedule {
  subuh: string;
  syuruk: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
}

export interface PrayerLocation {
  zone: string;
  zoneName: string;
  state: string;
  detectedVia: 'gps' | 'auto' | 'manual';
}

export interface NextPrayerInfo {
  name: string;
  timeStr: string;
  remainingSeconds: number;
  formattedCountdown: string;
}

export interface TaskItem {
  id: string;
  title: string;
  desc: string;
  subject: 'Matematik' | 'Pendidikan Islam' | 'Sains' | 'Bahasa Melayu' | 'Bahasa Inggeris' | 'Umum';
  xp: number;
  isMandatory: boolean;
  completed: boolean;
  assignedBy: string;
  gameId?: string;
  completedAt?: string;
}

export interface GameItem {
  id: string;
  title: string;
  category: 'Matematik' | 'Pendidikan Islam' | 'Sains' | 'Bahasa Melayu' | 'Logik & Minda';
  desc: string;
  xp: number;
  htmlCode: string;
  creator: string;
  colorScheme: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
  playsCount: number;
  rating: number;
}

export interface FriendItem {
  id: string;
  name: string;
  code: string;
  xp: number;
  level: number;
  avatar: string;
  isUser?: boolean;
  streakDays: number;
  badge: string;
}

export interface StudentItem {
  id: string;
  name: string;
  studentId: string;
  classId: string;
  xp: number;
  scorePct: number;
  grade: 'A' | 'B' | 'C' | 'D';
  completedTasks: number;
  totalTasks: number;
  solatStreak: number;
  subjectScores: {
    matematik: number;
    islamic: number;
    sains: number;
    bm: number;
  };
  notes: string;
  avatar: string;
}

export interface ChildDevice {
  id: string;
  name: string;
  model: string;
  isOnline: boolean;
  battery: number;
  remainingSeconds: number;
  totalLimitSeconds: number;
  status: 'Aktif' | 'Terkunci' | 'Waktu Solat' | 'Masa Tamat';
  lastSeen: string;
}

export interface ParentSettings {
  dailyLimitSeconds: number;
  isTimerEnabled: boolean;
  isSolatLockEnabled: boolean;
  requireTasksBeforePlay: boolean;
  bedtimeLock: {
    enabled: boolean;
    start: string;
    end: string;
  };
  pinCode: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  type: 'solat' | 'task' | 'game' | 'system' | 'timer';
}
