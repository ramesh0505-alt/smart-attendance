import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  QrCode,
  FileCheck2,
  HelpCircle,
  Award,
  Sparkles,
  Library,
  CalendarDays,
  Users,
  Layers,
  ShieldCheck,
  Megaphone,
  Compass,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export interface NavLinkItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeView?: string;
  setActiveView?: (view: string) => void;
  onOpenAiChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  activeView,
  setActiveView
}) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'student';

  const currentTab = activeTab || activeView || 'dashboard';
  const handleSelectTab = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    if (setActiveView) setActiveView(tab);
  };

  const studentLinks: NavLinkItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Curriculum Explorer', icon: Compass },
    { id: 'timetable', label: 'Timetable & Routine', icon: Calendar },
    { id: 'attendance', label: 'Attendance Ledger', icon: QrCode, badge: 'Live' },
    { id: 'assignments', label: 'Assignments Hub', icon: FileCheck2 },
    { id: 'assessments', label: 'Assessments & Quizzes', icon: HelpCircle },
    { id: 'competencies', label: 'Competencies & Skills', icon: Award },
    { id: 'recommendations', label: 'Smart Recommendations', icon: Sparkles, highlight: true },
    { id: 'resources', label: 'Learning Resources', icon: Library },
    { id: 'events', label: 'Events & Notices', icon: CalendarDays },
    { id: 'reports', label: 'Reports & Transcripts', icon: Layers }
  ];

  const facultyLinks: NavLinkItem[] = [
    { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'roster', label: 'Classes & Students', icon: Users },
    { id: 'curriculum', label: 'Curriculum & Units', icon: BookOpen },
    { id: 'attendance', label: 'QR Attendance Sessions', icon: QrCode },
    { id: 'assignments', label: 'Assignment Evaluator', icon: FileCheck2 },
    { id: 'assessments', label: 'Assessments Desk', icon: HelpCircle },
    { id: 'resources', label: 'Learning Resources', icon: Library },
    { id: 'events', label: 'Announcements', icon: Megaphone },
    { id: 'reports', label: 'Reports & Compliance', icon: Layers }
  ];

  const adminLinks: NavLinkItem[] = [
    { id: 'dashboard', label: 'Institutional Overview', icon: LayoutDashboard },
    { id: 'roster', label: 'Faculty & Student Directory', icon: Users },
    { id: 'curriculum', label: 'Curriculum Governance', icon: Layers },
    { id: 'events', label: 'Campus Bulletins', icon: Megaphone },
    { id: 'reports', label: 'Audit & Compliance Reports', icon: ShieldCheck }
  ];

  const parentLinks: NavLinkItem[] = [
    { id: 'dashboard', label: 'Child Academic Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Breakdown', icon: QrCode },
    { id: 'assignments', label: 'Assignments & Lab Work', icon: FileCheck2 },
    { id: 'competencies', label: 'Skill Mastery Report', icon: Award },
    { id: 'events', label: 'Campus Announcements', icon: Megaphone },
    { id: 'reports', label: 'Academic Reports', icon: Layers }
  ];

  const links: NavLinkItem[] =
    role === 'faculty'
      ? facultyLinks
      : role === 'admin'
      ? adminLinks
      : role === 'parent'
      ? parentLinks
      : studentLinks;

  return (
    <aside
      className={`bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col justify-between shrink-0 transition-all duration-300 hidden md:flex shadow-xs ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      <div className="space-y-4">
        {/* Brand Icon Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-600/20 shrink-0">
            S
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white block">
                SmartCampus
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                Bento Suite
              </span>
            </div>
          )}
        </div>

        {/* User Card in Sidebar */}
        {!isCollapsed ? (
          <div className="p-3 bg-[#F8F9FB] dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1 mt-0.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {currentUser?.role === 'student' ? 'B.Tech CSE • Sem 4' : currentUser?.role}
                </p>
              </div>
            </div>

            {currentUser?.academicGoal && (
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Target Role
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold truncate block">
                  🎯 {currentUser.academicGoal}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
            />
          </div>
        )}

        {/* Navigation Section */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
              Modules
            </p>
          )}
          {links.map(link => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleSelectTab(link.id)}
                title={isCollapsed ? link.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                } rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{link.label}</span>}
                </div>
                {!isCollapsed && link.badge && (
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
                {!isCollapsed && link.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex justify-center">
          <button
            onClick={onToggleCollapse}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      )}
    </aside>
  );
};
