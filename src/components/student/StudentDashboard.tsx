import React from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  AlertCircle,
  FileCheck2,
  HelpCircle,
  ArrowRight,
  QrCode,
  Zap,
  Target,
  BookOpen,
  ShieldCheck,
  Video,
  Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';

interface StudentDashboardProps {
  onNavigate: (view: string) => void;
  onOpenQRScanner: () => void;
  onOpenAiCoPilot?: () => void;
  onOpenAiAssistant?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onOpenQRScanner,
  onOpenAiCoPilot,
  onOpenAiAssistant
}) => {
  const { currentUser } = useAuth();
  const {
    subjects,
    timetable,
    assignments,
    assessments,
    competencies,
    recommendations,
    completeRecommendation,
    attendanceSessions
  } = useCampus();

  const handleOpenAi = onOpenAiCoPilot || onOpenAiAssistant || (() => {});
  const activeQRSession = attendanceSessions.find(s => s.isActive);
  const urgentRec = recommendations.find(r => !r.isCompleted && r.urgency === 'High') || recommendations.find(r => !r.isCompleted);
  const studentCompetencies = competencies.length > 0 ? competencies : [];

  const strongCount = studentCompetencies.filter(c => c.status === 'Strong').length;
  const devCount = studentCompetencies.filter(c => c.status === 'Developing').length;
  const practiceCount = studentCompetencies.filter(c => c.status === 'Needs Practice').length;

  const todaySlots = timetable.filter(t => t.day === 'Monday');
  const currentSlot = todaySlots.find(s => s.isCurrent) || todaySlots[1] || todaySlots[0];

  return (
    <div className="space-y-6 animate-in fade-in pb-8">
      {/* Header Profile Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {currentUser?.name || 'Ramesh'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            B.Tech CSE • Semester 4 • Academic Year 2026 • AI-Connected Ecosystem
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeQRSession && (
            <button
              onClick={onOpenQRScanner}
              className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-sm shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-102"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Active QR</span>
            </button>
          )}
          <button
            onClick={handleOpenAi}
            className="px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>AI Academic Mentor</span>
          </button>
        </div>
      </header>

      {/* Bento Grid Architecture */}
      <div className="grid grid-cols-12 gap-5">
        {/* ========================================================================= */}
        {/* BENTO CELL 1: Key Hero Next Class & Frosted Stat Cards (8 cols on lg)     */}
        {/* ========================================================================= */}
        <div className="col-span-12 lg:col-span-8 bg-indigo-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-md relative overflow-hidden min-h-[300px]">
          {/* Subtle geometric background blur */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-indigo-100 uppercase text-xs font-black tracking-widest bg-white/15 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                Next Class / Ongoing Lecture
              </span>
              <span className="text-xs font-bold text-indigo-200 bg-indigo-800/50 px-2.5 py-0.5 rounded-full">
                Room 402 • Block C
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-2">
              {currentSlot?.subjectName || 'Internet of Things & Embedded Architecture'}
            </h2>
            <p className="text-indigo-100 opacity-90 text-xs sm:text-sm font-medium">
              {currentSlot?.facultyName || 'Dr. Priya Sharma'} • {currentSlot?.startTime || '10:30 AM'} - {currentSlot?.endTime || '12:00 PM'} • Lab Session
            </p>
          </div>

          {/* Frosted Stat Tiles */}
          <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-4 border-t border-white/15">
            <div className="bg-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md border border-white/10 flex flex-col justify-between">
              <p className="text-[10px] sm:text-xs text-indigo-100 uppercase font-black tracking-wider">
                Attendance
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <p className="text-xl sm:text-3xl font-black">{currentUser?.attendancePercentage || 91.4}%</p>
              </div>
              <span className="text-[10px] text-emerald-300 font-bold mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Safe (&gt;75%)
              </span>
            </div>

            <div className="bg-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md border border-white/10 flex flex-col justify-between">
              <p className="text-[10px] sm:text-xs text-indigo-100 uppercase font-black tracking-wider">
                Current GPA
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <p className="text-xl sm:text-3xl font-black">{currentUser?.cgpa || 8.42}</p>
                <span className="text-[10px] font-bold text-indigo-200">/ 10.0</span>
              </div>
              <span className="text-[10px] text-indigo-200 font-medium mt-0.5">Top 8% CSE Cohort</span>
            </div>

            <div className="bg-white/15 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md border border-white/10 flex flex-col justify-between">
              <p className="text-[10px] sm:text-xs text-indigo-100 uppercase font-black tracking-wider">
                Tasks Due
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <p className="text-xl sm:text-3xl font-black">{assignments.length || 3}</p>
                <span className="text-[10px] font-bold text-indigo-200">Active</span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 1 Due Today
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BENTO CELL 2: Curriculum Progress (4 cols on lg)                          */}
        {/* ========================================================================= */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Curriculum Progress
              </h3>
              <button
                onClick={() => onNavigate('curriculum')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Explorer &rarr;
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  <span>Database Management (CS401)</span>
                  <span className="text-indigo-600 dark:text-indigo-400">82%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  <span>Embedded Systems & RTOS (CS402)</span>
                  <span className="text-amber-600 dark:text-amber-400">45%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  <span>Computer Networks & Protocol (CS403)</span>
                  <span className="text-emerald-600 dark:text-emerald-400">94%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  <span>Operating Systems & Kernels (CS404)</span>
                  <span className="text-sky-600 dark:text-sky-400">76%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: '76%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Syllabus: 24 of 30 Units Mastered</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">On Track</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BENTO CELL 3: AI Learning Plan / Connected Loop (4 cols on lg)            */}
        {/* ========================================================================= */}
        <div className="col-span-12 lg:col-span-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl p-6 border border-emerald-200/80 dark:border-emerald-800/80 relative overflow-hidden text-emerald-950 dark:text-emerald-100 flex flex-col justify-between shadow-xs">
          {/* Subtle background watermark */}
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles className="w-24 h-24 text-emerald-900 dark:text-emerald-300" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                Connected Learning Loop
              </span>
            </div>

            <h3 className="text-emerald-950 dark:text-emerald-100 font-black text-lg">
              AI Micro-Learning Plan
            </h3>

            <p className="text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
              Based on your recent <strong className="text-emerald-950 dark:text-white">62% score in the FreeRTOS Interrupts quiz</strong>, we recommend these micro-learning activities for your <strong className="text-emerald-950 dark:text-white">1:00 PM free study slot</strong>.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="bg-white dark:bg-slate-900/90 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-xs shrink-0">
                  12m
                </div>
                <div className="text-xs min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">Interrupt Vector Tables & ISR</p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <Video className="w-3 h-3" /> Video Lecture Snippet
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/90 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-xs shrink-0">
                  5m
                </div>
                <div className="text-xs min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">Hardware Priority Quiz</p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" /> 3 Interactive Flashcards
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4">
            <button
              onClick={async () => {
                if (urgentRec) {
                  await completeRecommendation(urgentRec.id);
                } else {
                  onNavigate('recommendations');
                }
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-102"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept & Boost Competency</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BENTO CELL 4: Upcoming Assignments & Coursework (4 cols on lg)           */}
        {/* ========================================================================= */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-sky-500" />
                Upcoming Assignments
              </h3>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-3.5">
              <div
                onClick={() => onNavigate('assignments')}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="w-1.5 h-10 bg-rose-500 rounded-full shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      IoT Final Project: Sensor Mesh Architecture
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">Due Today • 11:59 PM</span> • Max 25 pts
                  </p>
                </div>
              </div>

              <div
                onClick={() => onNavigate('assignments')}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="w-1.5 h-10 bg-amber-500 rounded-full shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      DBMS Normalization & B+ Tree Lab
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">Due Tomorrow • 2:00 PM</span> • Max 20 pts
                  </p>
                </div>
              </div>

              <div
                onClick={() => onNavigate('assignments')}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="w-1.5 h-10 bg-emerald-500 rounded-full shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      TCP/IP Protocol Wireshark Trace Analysis
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">Due Friday • 5:00 PM</span> • Max 15 pts
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">All submissions verified by faculty rubrics</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Rubrics Active</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BENTO CELL 5: Competency Profile (4 cols on lg)                           */}
        {/* ========================================================================= */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between border border-slate-800 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                Competency Profile
              </h3>
              <button
                onClick={() => onNavigate('competencies')}
                className="text-xs font-bold text-indigo-300 hover:underline"
              >
                Matrix &rarr;
              </button>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/10 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-tight border border-white/10 font-bold">
                IoT Engineering
              </span>
              <span className="bg-white/10 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-tight border border-white/10 font-bold">
                Database Architect
              </span>
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-tight border border-indigo-400/40 font-black">
                Networking Specialist
              </span>
              <span className="bg-white/10 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-tight border border-white/10 font-bold">
                Cloud Logic
              </span>
              <span className="bg-white/10 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-tight border border-white/10 font-bold">
                Real-Time OS
              </span>
            </div>

            {/* Skill Level Counters */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="block text-lg font-black text-emerald-400">{strongCount}</span>
                <span className="text-[9px] uppercase font-bold text-slate-300">Strong</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="block text-lg font-black text-sky-400">{devCount}</span>
                <span className="text-[9px] uppercase font-bold text-slate-300">Developing</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="block text-lg font-black text-rose-400">{practiceCount}</span>
                <span className="text-[9px] uppercase font-bold text-slate-300">Practice</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-300 italic leading-relaxed">
              "Ramesh is currently in the top 5% of his cohort for Protocol Design & RTOS Hardware interfacing."
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BENTO CELL 6: Daily Timeline & Quick QR Attendance (8 cols on lg)         */}
        {/* ========================================================================= */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-6">
          {/* Daily Timeline */}
          <div className="flex-1 sm:border-r border-slate-100 dark:border-slate-800 sm:pr-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Daily Timeline & Routine (Monday)
              </h3>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Full Week &rarr;
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center text-xs gap-3">
                <span className="text-slate-400 font-bold w-12 shrink-0">09:00 AM</span>
                <span className="bg-slate-100 dark:bg-slate-800 flex-1 py-2 px-3 rounded-xl text-slate-600 dark:text-slate-300 font-medium">
                  DBMS Lecture • Room 301 • Completed
                </span>
              </div>

              <div className="flex items-center text-xs gap-3">
                <span className="text-indigo-600 dark:text-indigo-400 font-black w-12 shrink-0">10:30 AM</span>
                <span className="bg-indigo-50 dark:bg-indigo-950/60 flex-1 py-2 px-3 rounded-xl text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                  <span>IoT Embedded Lab • Room 402 • Ongoing</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
              </div>

              <div className="flex items-center text-xs gap-3">
                <span className="text-slate-400 font-bold w-12 shrink-0">01:00 PM</span>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 flex-1 py-2 px-3 rounded-xl text-emerald-800 dark:text-emerald-300 font-semibold border border-dashed border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                  <span>Free Study Slot (AI Micro-Learning)</span>
                  <span className="text-[10px] font-black uppercase bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded">
                    Scheduled
                  </span>
                </span>
              </div>

              <div className="flex items-center text-xs gap-3">
                <span className="text-slate-400 font-bold w-12 shrink-0">02:30 PM</span>
                <span className="bg-slate-100 dark:bg-slate-800 flex-1 py-2 px-3 rounded-xl text-slate-600 dark:text-slate-300 font-medium">
                  Computer Networks • Hall B • Dr. K. Ramanathan
                </span>
              </div>
            </div>
          </div>

          {/* Quick QR Attendance Scan Tile */}
          <div className="sm:w-56 flex flex-col items-center justify-center text-center gap-3 p-2 bg-[#F8F9FB] dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div
              onClick={onOpenQRScanner}
              className="w-24 h-24 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl flex items-center justify-center relative group cursor-pointer shadow-sm hover:border-indigo-500 transition-all hover:scale-105"
            >
              <QrCode className="w-14 h-14 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/90 backdrop-blur-xs opacity-0 group-hover:opacity-100 rounded-3xl transition-all">
                <span className="text-xs font-black text-white px-2 py-1 text-center">
                  Scan Now
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-wider">
                QR Attendance
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Instant encrypted check-in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
