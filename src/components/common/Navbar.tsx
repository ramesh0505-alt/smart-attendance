import React, { useState } from 'react';
import {
  GraduationCap,
  Bell,
  Search,
  RotateCcw,
  Sparkles,
  ChevronDown,
  CheckCheck,
  QrCode,
  Layers,
  BookOpen,
  Building2,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';
import { UserRole } from '../../types/index.ts';

interface NavbarProps {
  onOpenCommand?: () => void;
  onOpenSearch?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenQRModal?: () => void;
  onOpenQRScanner?: () => void;
  activeSession?: any;
  activeView?: string;
  setActiveView?: (view: string) => void;
  isPublicView?: boolean;
  setIsPublicView?: (pub: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommand,
  onOpenSearch,
  onOpenAiAssistant,
  onOpenQRModal,
  onOpenQRScanner,
  activeSession,
  activeView,
  setActiveView,
  isPublicView,
  setIsPublicView
}) => {
  const { currentUser, switchUser } = useAuth();
  const {
    institutions,
    currentInstitution,
    setCurrentInstitution,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetDatabase,
    attendanceSessions
  } = useCampus();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showInstMenu, setShowInstMenu] = useState(false);

  const triggerSearch = onOpenCommand || onOpenSearch;
  const unreadNotifs = notifications.filter(n => !n.isRead);
  const activeQRSession = activeSession || attendanceSessions.find(s => s.isActive);

  // Quick switch role candidates
  const demoUsers: { role: UserRole; title: string; subtitle: string; userId: string }[] = [
    { role: 'student', title: 'Ramesh Kumar', subtitle: 'B.Tech CSE, Sem 4 (91% Att, 8.4 CGPA)', userId: 'std_ramesh' },
    { role: 'faculty', title: 'Dr. Priya Sharma', subtitle: 'Assoc. Professor, IoT & Embedded Systems', userId: 'fac_priya' },
    { role: 'admin', title: 'Dr. K. Ramanathan', subtitle: 'Dean & Institutional Super Admin', userId: 'admin_ramanathan' },
    { role: 'parent', title: 'Suresh Kumar', subtitle: 'Parent of Ramesh Kumar', userId: 'parent_suresh' }
  ];

  const activeInst = currentInstitution || institutions[0] || {
    name: 'Smart Institute of Technology',
    code: 'SIT-BLR',
    accreditation: 'NAAC A++ Grade'
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-[#F8F9FB]/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Institution / Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-sm shadow-indigo-600/20 md:hidden">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
                  SmartCampus
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  Bento 2.0
                </span>
              </div>
              
              {/* Institution Context Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowInstMenu(!showInstMenu)}
                  className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Building2 className="w-3 h-3 text-indigo-500" />
                  <span className="truncate max-w-[200px] sm:max-w-[260px]">{activeInst.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showInstMenu && (
                  <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Multi-Tenant Campus</p>
                      <p className="text-[11px] text-slate-400">Select active institution domain</p>
                    </div>
                    <div className="space-y-1">
                      {institutions.map(inst => (
                        <button
                          key={inst.id}
                          onClick={() => {
                            setCurrentInstitution(inst);
                            setShowInstMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            activeInst.id === inst.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <p className="font-bold">{inst.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{inst.code} • {inst.accreditation}</p>
                          </div>
                          {activeInst.id === inst.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Live QR Session Badge for Student */}
          {activeQRSession && currentUser?.role === 'student' && onOpenQRScanner && (
            <button
              onClick={onOpenQRScanner}
              className="hidden lg:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold hover:bg-emerald-100 transition-all animate-pulse shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <QrCode className="w-3.5 h-3.5" />
              <span>Live Attendance Active ({activeQRSession.subjectName.split(' ')[0]})</span>
            </button>
          )}

          {/* Faculty Live Projector QR indicator */}
          {activeQRSession && currentUser?.role === 'faculty' && onOpenQRModal && (
            <button
              onClick={onOpenQRModal}
              className="hidden lg:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 px-3 py-1 rounded-full text-xs font-bold hover:bg-indigo-100 transition-all shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Session Live ({activeQRSession.token})</span>
            </button>
          )}
        </div>

        {/* Center: Global Search Bar Trigger (Bento Search Bar) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
          <button
            onClick={triggerSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Quick Search (Ctrl + K)...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, AI Mentor Trigger & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search on mobile */}
          <button
            onClick={triggerSearch}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Mentor CoPilot Quick Trigger */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="p-2 sm:px-3 sm:py-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs"
              title="Launch AI Academic Mentor"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">AI CoPilot</span>
            </button>
          )}

          {/* QR Scanner Quick Button for Student */}
          {currentUser?.role === 'student' && onOpenQRScanner && (
            <button
              onClick={onOpenQRScanner}
              className="p-2 sm:px-3 sm:py-2 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs"
              title="Scan QR Attendance"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
          )}

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl transition-all shadow-xs"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Campus Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400">No notifications at this time.</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.actionLink && setActiveView) {
                            setActiveView(notif.actionLink.replace('/', ''));
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition-colors ${
                          notif.isRead
                            ? 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent text-slate-600 dark:text-slate-400'
                            : 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/60 text-slate-900 dark:text-slate-100 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white">{notif.title}</h5>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">{notif.timestamp}</span>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role & Account Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-left bg-white dark:bg-slate-900 shadow-xs"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0"
              />
              <div className="hidden md:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                    {currentUser?.name}
                  </span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-black ${
                      currentUser?.role === 'student'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : currentUser?.role === 'faculty'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : currentUser?.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {currentUser?.role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {currentUser?.role === 'student'
                    ? `Roll: ${currentUser.studentId}`
                    : currentUser?.role === 'faculty'
                    ? 'Faculty Portal'
                    : currentUser?.role === 'admin'
                    ? 'Campus Dean'
                    : 'Parent Portal'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 hidden sm:block" />
            </button>

            {/* Role Menu Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <p className="text-[10px] uppercase font-black tracking-wider text-indigo-600 dark:text-indigo-400">
                    Switch Demo Role / Account
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Instant access to tailored dashboards & capabilities
                  </p>
                </div>

                <div className="space-y-1.5">
                  {demoUsers.map(user => {
                    const isSelected = currentUser?.id === user.userId;
                    return (
                      <button
                        key={user.userId}
                        onClick={() => {
                          switchUser(user.userId);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2.5 rounded-2xl text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                            user.role === 'student'
                              ? 'bg-sky-500 text-white'
                              : user.role === 'faculty'
                              ? 'bg-emerald-600 text-white'
                              : user.role === 'admin'
                              ? 'bg-purple-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {user.role[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {user.title}
                            </span>
                            <span className="text-[10px] capitalize text-slate-400 font-semibold">
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
                            {user.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Reset Database Button */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      resetDatabase();
                      setShowRoleMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Campus Seed Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
