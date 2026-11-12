/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  TaskItem,
  GameItem,
  FriendItem,
  StudentItem,
  ChildDevice,
  ParentSettings,
  PrayerLocation,
  PrayerTimeSchedule,
  NextPrayerInfo,
  ActivityLog,
} from './types';
import {
  INITIAL_GAMES,
  INITIAL_TASKS,
  INITIAL_FRIENDS,
  INITIAL_STUDENTS,
  INITIAL_DEVICES,
  INITIAL_SETTINGS,
} from './data/initialData';
import {
  getMockPrayerTimes,
  calculateNextPrayer,
  detectLocatePrayerZone,
} from './utils/prayerTimes';
import { Header } from './components/Header';
import { RoleSelectScreen } from './components/RoleSelectScreen';
import { ChildMode } from './components/ChildMode';
import { ParentMode } from './components/ParentMode';
import { TeacherMode } from './components/TeacherMode';
import { GameSandboxModal } from './components/GameSandboxModal';
import { SolatLockModal } from './components/SolatLockModal';
import { ScreenTimeOutModal } from './components/ScreenTimeOutModal';
import { PrayerScheduleModal } from './components/PrayerScheduleModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { DevTrialBar } from './components/DevTrialBar';
// Modul Soal Selidik Kajian (Tersimpan dalam folder tunggal src/form/ supaya mudah dibuang kelak)
import {
  SurveyWorkflowModal,
  SurveyFloatingBanner,
  SurveyStep,
  RespondentType,
} from './form';

export default function App() {
  // Current user role
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('ibni_user_role');
    return (saved as UserRole) || 'role-select';
  });

  // User XP
  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem('ibni_user_points');
    return saved ? Number(saved) : 350;
  });

  // Screen time countdown in seconds (e.g. 01:45:00 = 6300s)
  const [remainingScreenSeconds, setRemainingScreenSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('ibni_screen_seconds');
    return saved ? Number(saved) : 6300;
  });

  // Prayer times & Location
  const [location, setLocation] = useState<PrayerLocation>({
    zone: 'WLY01',
    zoneName: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan',
    detectedVia: 'auto',
  });
  const [prayerSchedule, setPrayerSchedule] = useState<PrayerTimeSchedule>(() =>
    getMockPrayerTimes('WLY01')
  );
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo>(() =>
    calculateNextPrayer(getMockPrayerTimes('WLY01'))
  );

  // Core Data Lists
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('ibni_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [games, setGames] = useState<GameItem[]>(() => {
    const saved = localStorage.getItem('ibni_games');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [friends, setFriends] = useState<FriendItem[]>(() => {
    const saved = localStorage.getItem('ibni_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [students, setStudents] = useState<StudentItem[]>(() => {
    const saved = localStorage.getItem('ibni_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [devices, setDevices] = useState<ChildDevice[]>(() => {
    const saved = localStorage.getItem('ibni_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [settings, setSettings] = useState<ParentSettings>(() => {
    const saved = localStorage.getItem('ibni_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'log-1',
      timestamp: '12:45 PM',
      title: 'Tugasan Disiapkan: Sifir Kilat',
      detail: 'Luqman mengutip +50 XP dalam persekitaran Sandbox.',
      type: 'task',
    },
    {
      id: 'log-2',
      timestamp: '01:16 PM',
      title: 'Solat Fardhu Zohor',
      detail: 'Peringatan solat fardhu Zohor dipatuhi.',
      type: 'solat',
    },
  ]);

  // Modals state
  const [activeSandboxGame, setActiveSandboxGame] = useState<GameItem | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentItem | null>(null);
  const [showPrayerSchedule, setShowPrayerSchedule] = useState(false);
  const [showSolatLock, setShowSolatLock] = useState(false);
  const [showTimeOutModal, setShowTimeOutModal] = useState(false);

  // Survey Workflow State (Folder /src/form/)
  const [showSurveyModal, setShowSurveyModal] = useState<boolean>(() => {
    const completed = localStorage.getItem('ibni_survey_completed');
    return completed !== 'true';
  });
  const [surveyStep, setSurveyStep] = useState<SurveyStep>('step-1-initial');
  const [savedRespondentType, setSavedRespondentType] = useState<RespondentType | null>(null);

  const handleOpenAppTrial = () => {
    setShowSurveyModal(false);
    if (savedRespondentType === 'Ibu Bapa') {
      setRole('parent');
    } else if (savedRespondentType === 'Guru') {
      setRole('teacher');
    } else if (role === 'role-select') {
      setRole('child');
    }
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ibni_user_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ibni_user_points', String(userPoints));
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('ibni_screen_seconds', String(remainingScreenSeconds));
  }, [remainingScreenSeconds]);

  useEffect(() => {
    localStorage.setItem('ibni_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ibni_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('ibni_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('ibni_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ibni_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('ibni_settings', JSON.stringify(settings));
  }, [settings]);

  // Initial Location & Prayer Times Detect
  useEffect(() => {
    detectLocatePrayerZone().then((loc) => {
      setLocation(loc);
      const sched = getMockPrayerTimes(loc.zone);
      setPrayerSchedule(sched);
      setNextPrayer(calculateNextPrayer(sched));
    });
  }, []);

  // Live Timer: Prayer times recalculation every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNextPrayer(calculateNextPrayer(prayerSchedule));
    }, 1000);
    return () => clearInterval(timer);
  }, [prayerSchedule]);

  // Live Screen Timer Countdown when in Child mode
  useEffect(() => {
    if (role !== 'child' || !settings.isTimerEnabled) return;

    const interval = setInterval(() => {
      setRemainingScreenSeconds((prev) => {
        // When remaining time is already 0, do not continuously re-trigger modal every tick
        if (prev <= 0) {
          return 0;
        }
        const next = prev - 1;
        if (next === 0) {
          setShowTimeOutModal(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [role, settings.isTimerEnabled]);

  // Location zone change
  const handleSelectZone = (zoneCode: string) => {
    const sched = getMockPrayerTimes(zoneCode);
    setPrayerSchedule(sched);
    setNextPrayer(calculateNextPrayer(sched));
    setLocation((prev) => ({
      ...prev,
      zone: zoneCode,
      zoneName: zoneCode === 'WLY01' ? 'Kuala Lumpur' : zoneCode,
      detectedVia: 'manual',
    }));
  };

  const handleDetectGPS = async () => {
    const loc = await detectLocatePrayerZone();
    setLocation(loc);
    const sched = getMockPrayerTimes(loc.zone);
    setPrayerSchedule(sched);
    setNextPrayer(calculateNextPrayer(sched));
  };

  // Launch game
  const handleLaunchGame = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    if (game) {
      setActiveSandboxGame(game);
    }
  };

  // Complete game & earn XP
  const handleCompleteGame = (gameId: string, xpEarned: number) => {
    setUserPoints((prev) => prev + xpEarned);

    // Mark associated tasks as completed
    setTasks((prev) =>
      prev.map((t) => (t.gameId === gameId ? { ...t, completed: true } : t))
    );

    // Update child's ranking in friends list
    setFriends((prev) =>
      prev.map((f) => (f.isUser ? { ...f, xp: f.xp + xpEarned } : f))
    );

    // Update students list
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === '5B-02'
          ? { ...s, xp: s.xp + xpEarned, completedTasks: Math.min(s.totalTasks, s.completedTasks + 1) }
          : s
      )
    );

    // Add activity log
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: nowStr,
        title: `Modul Kuiz Selesai (+${xpEarned} XP)`,
        detail: `Anak telah menyelesaikan permainan dalam sandbox secara berhemah.`,
        type: 'game',
      },
      ...prev,
    ]);

    setActiveSandboxGame(null);
  };

  // Add friend
  const handleAddFriend = (name: string, code?: string) => {
    const newFriend: FriendItem = {
      id: `f-${Date.now()}`,
      name,
      code: code || `KOD-${Math.floor(100 + Math.random() * 900)}`,
      xp: 120,
      level: 1,
      avatar: '😊',
      streakDays: 1,
      badge: 'Rakan Baharu',
    };
    setFriends((prev) => [...prev, newFriend]);
  };

  // Parent: Update Settings
  const handleUpdateSettings = (newSettings: ParentSettings) => {
    setSettings(newSettings);
    setRemainingScreenSeconds(newSettings.dailyLimitSeconds);
  };

  // Parent: Toggle device lock
  const handleToggleDeviceLock = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              status: d.status === 'Terkunci' ? 'Aktif' : 'Terkunci',
            }
          : d
      )
    );
  };

  // Parent: Adjust device time
  const handleAdjustDeviceTime = (deviceId: string, deltaSeconds: number) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              remainingSeconds: Math.max(0, d.remainingSeconds + deltaSeconds),
            }
          : d
      )
    );
    setRemainingScreenSeconds((prev) => Math.max(0, prev + deltaSeconds));
  };

  // Parent: Add Device
  const handleAddDevice = (name: string, model: string) => {
    const newDev: ChildDevice = {
      id: `dev-${Date.now()}`,
      name,
      model,
      isOnline: true,
      battery: 95,
      remainingSeconds: settings.dailyLimitSeconds,
      totalLimitSeconds: settings.dailyLimitSeconds,
      status: 'Aktif',
      lastSeen: 'Baru didaftarkan',
    };
    setDevices((prev) => [...prev, newDev]);
  };

  // Parent / Teacher: Create Custom Game
  const handleCreateCustomGame = (
    gameData: Omit<GameItem, 'id' | 'playsCount' | 'rating'>
  ) => {
    const newGame: GameItem = {
      ...gameData,
      id: `game-${Date.now()}`,
      playsCount: 0,
      rating: 5.0,
    };
    setGames((prev) => [newGame, ...prev]);

    // Automatically create a task for it
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newGame.title,
      desc: newGame.desc,
      subject: (newGame.category as TaskItem['subject']) || 'Umum',
      xp: newGame.xp,
      isMandatory: true,
      completed: false,
      assignedBy: newGame.creator,
      gameId: newGame.id,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Parent: Assign Game as Task
  const handleAssignGameAsTask = (game: GameItem, isMandatory: boolean) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: game.title,
      desc: game.desc,
      subject: (game.category as TaskItem['subject']) || 'Umum',
      xp: game.xp,
      isMandatory,
      completed: false,
      assignedBy: 'Ibu Bapa (Parent)',
      gameId: game.id,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Teacher: Assign Game to Class
  const handleAssignGameToClass = (game: GameItem, className: string) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: `${game.title} (Kerja Rumah ${className})`,
      desc: game.desc,
      subject: (game.category as TaskItem['subject']) || 'Umum',
      xp: game.xp,
      isMandatory: true,
      completed: false,
      assignedBy: `Guru Kelas (${className})`,
      gameId: game.id,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Teacher: Add Student
  const handleAddStudent = (name: string, studentId: string, notes?: string) => {
    const newStudent: StudentItem = {
      id: `std-${Date.now()}`,
      name,
      studentId,
      classId: '5-bestari',
      xp: 150,
      scorePct: 88,
      grade: 'B',
      completedTasks: 5,
      totalTasks: 10,
      solatStreak: 4,
      subjectScores: {
        matematik: 86,
        islamic: 92,
        sains: 85,
        bm: 88,
      },
      notes: notes || 'Pelajar aktif dan rajin bertanya soalan semasa sesi pembelajaran.',
      avatar: '🧑',
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  // Teacher: Update Notes
  const handleUpdateStudentNotes = (studentId: string, notes: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, notes } : s))
    );
  };

  // Unlock with PIN
  const handleUnlockWithPin = (pin: string) => {
    if (pin === settings.pinCode || pin === '1234') {
      setShowTimeOutModal(false);
      setRemainingScreenSeconds(1800); // add 30 mins
      return true;
    }
    return false;
  };

  // Dev Trial Bar actions
  const handleSimulateSolat = useCallback(() => {
    setShowSolatLock(true);
  }, []);

  const handleSimulateTimeOut = useCallback(() => {
    setRemainingScreenSeconds(0);
    setShowTimeOutModal(true);
  }, []);

  const handleDismissTimeOutDev = useCallback(() => {
    setShowTimeOutModal(false);
    // Give 15 mins (900s) testing buffer if timer was 0, so child mode is accessible and no infinite loop occurs
    setRemainingScreenSeconds((prev) => (prev <= 0 ? 900 : prev));
  }, []);

  const handleAddDevXP = useCallback(() => {
    setUserPoints((prev) => prev + 100);
    setFriends((prev) =>
      prev.map((f) => (f.isUser ? { ...f, xp: f.xp + 100 } : f))
    );
  }, []);

  const handleResetTimer = useCallback(() => {
    setRemainingScreenSeconds(6300);
    setShowTimeOutModal(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden">
      {/* Decorative Pastel Geometry Shapes */}
      <div className="shape-pink" />
      <div className="shape-green" />
      <div className="shape-yellow" />

      {/* Role Selection Screen if no role selected */}
      {role === 'role-select' ? (
        <RoleSelectScreen onSelectRole={(r) => setRole(r)} />
      ) : (
        <>
          {/* Main App Header */}
          <Header
            currentRole={role}
            userPoints={userPoints}
            onResetRole={() => setRole('role-select')}
          />

          {/* Main App Content Area */}
          <main className="max-w-4xl mx-auto px-4 py-6 flex-grow w-full pb-32 relative z-10">
            {role === 'child' && (
              <ChildMode
                remainingScreenSeconds={remainingScreenSeconds}
                location={location}
                nextPrayer={nextPrayer}
                tasks={tasks}
                games={games}
                friends={friends}
                userPoints={userPoints}
                onLaunchGame={handleLaunchGame}
                onOpenSchedule={() => setShowPrayerSchedule(true)}
                onAddFriend={handleAddFriend}
                onDetectGPS={handleDetectGPS}
              />
            )}

            {role === 'parent' && (
              <ParentMode
                devices={devices}
                settings={settings}
                games={games}
                tasks={tasks}
                activityLogs={activityLogs}
                onUpdateSettings={handleUpdateSettings}
                onToggleDeviceLock={handleToggleDeviceLock}
                onAdjustDeviceTime={handleAdjustDeviceTime}
                onAddDevice={handleAddDevice}
                onAssignGameAsTask={handleAssignGameAsTask}
                onCreateCustomGame={handleCreateCustomGame}
                onLaunchGame={handleLaunchGame}
              />
            )}

            {role === 'teacher' && (
              <TeacherMode
                students={students}
                games={games}
                onAddStudent={handleAddStudent}
                onOpenStudentProfile={(std) => setSelectedStudentForProfile(std)}
                onAssignGameToClass={handleAssignGameToClass}
                onCreateCustomGame={handleCreateCustomGame}
                onLaunchGame={handleLaunchGame}
              />
            )}
          </main>
        </>
      )}

      {/* Floating Side Dev/Trial Bar */}
      <DevTrialBar
        currentRole={role}
        onSimulateSolat={handleSimulateSolat}
        onSimulateTimeOut={handleSimulateTimeOut}
        onAddDevXP={handleAddDevXP}
        onQuickSwitchRole={(r) => setRole(r)}
        onResetTimer={handleResetTimer}
      />

      {/* Game Sandbox Modal */}
      <GameSandboxModal
        game={activeSandboxGame}
        onClose={() => setActiveSandboxGame(null)}
        onComplete={handleCompleteGame}
      />

      {/* Solat Reminder & Lock Modal */}
      {showSolatLock && (
        <SolatLockModal
          prayerName={nextPrayer.name.replace(' (Esok)', '')}
          locationName={location.zoneName}
          onDismiss={() => setShowSolatLock(false)}
        />
      )}

      {/* Screen Time-Out Modal */}
      {showTimeOutModal && (
        <ScreenTimeOutModal
          onUnlockWithPin={handleUnlockWithPin}
          onOpenTask={() => {
            setShowTimeOutModal(false);
            setRemainingScreenSeconds((prev) => (prev <= 0 ? 900 : prev));
            if (tasks.length > 0) {
              handleLaunchGame(tasks[0].gameId || 'game-1');
            }
          }}
          onDismissDev={handleDismissTimeOutDev}
        />
      )}

      {/* Full Prayer Times Schedule Modal */}
      {showPrayerSchedule && (
        <PrayerScheduleModal
          schedule={prayerSchedule}
          location={location}
          currentPrayerName={nextPrayer.name}
          onClose={() => setShowPrayerSchedule(false)}
          onSelectZone={handleSelectZone}
          onDetectGPS={handleDetectGPS}
        />
      )}

      {/* Student Profile & Performance Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          onClose={() => setSelectedStudentForProfile(null)}
          onUpdateNotes={handleUpdateStudentNotes}
        />
      )}

      {/* Butang Terapung Soal Selidik (Folder /src/form/) */}
      <SurveyFloatingBanner
        onOpenSurvey={() => setShowSurveyModal(true)}
        currentStep={surveyStep}
      />

      {/* Aliran Kerja Soal Selidik Kajian Ibni (Folder /src/form/) */}
      <SurveyWorkflowModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onOpenAppTrial={handleOpenAppTrial}
        step={surveyStep}
        setStep={(s) => {
          setSurveyStep(s);
          if (s === 'step-4-completed') {
            localStorage.setItem('ibni_survey_completed', 'true');
          }
        }}
        savedRespondentType={savedRespondentType}
        setSavedRespondentType={setSavedRespondentType}
      />
    </div>
  );
}
