import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';

export const ParentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { competencies, assignments, subjects } = useCampus();
  const [advisorMessage, setAdvisorMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const wardName = 'Ramesh Kumar';
  const wardId = 'CS2024-042';
  const wardAttendance = 91;
  const wardCgpa = 8.4;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setAdvisorMessage('');
      setMessageSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Parent Academic Transparency Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome, {currentUser?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Monitoring verified academic progress, lecture attendance compliance, and competency evolution for your ward, <strong className="text-white">{wardName} ({wardId})</strong>.
            </p>
          </div>

          {/* Hall Ticket Status Badge */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Hall Ticket Cleared</span>
            </div>
            <p className="text-lg font-black text-white mt-1">{wardAttendance}% Attendance</p>
            <span className="text-[10px] text-slate-300">Min 75% Requirement Met</span>
          </div>
        </div>
      </div>

      {/* Ward Academic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Cumulative Semester CGPA</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{wardCgpa}</span>
            <span className="text-xs font-bold text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Class Rank: Top 8% of CSE Cohort</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Continuous Assessment Health</span>
          <div className="flex items-center gap-2 mt-1">
            <Award className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Mastery on Track</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">4 of 5 Core Competencies Strong</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Upcoming Mid-Term Exams</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">Sep 18, 2026</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Syllabus Coverage: 74% Complete</p>
        </div>
      </div>

      {/* Main Grid: Competency Tracking & Advisor Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Competencies & Subject Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Competency Mastery */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Ward Skill & Competency Mastery
            </h3>

            <div className="space-y-3">
              {competencies.map(comp => (
                <div key={comp.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{comp.name}</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{comp.currentLevel}% ({comp.status})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${comp.currentLevel >= 80 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                      style={{ width: `${comp.currentLevel}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Faculty Advisor Direct Reach */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Faculty Mentor & Academic Advisor
              </h3>
              <p className="text-xs text-slate-400">Direct contact with ward's mentor</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                alt="Dr. Priya Sharma"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Dr. Priya Sharma
                </h4>
                <p className="text-[11px] text-slate-400">Associate Professor • Dept. of CSE</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Available for Parent Hours: 3:00 - 5:00 PM</p>
              </div>
            </div>

            {/* Quick Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Send Direct Note to Advisor
              </label>
              <textarea
                rows={3}
                required
                value={advisorMessage}
                onChange={e => setAdvisorMessage(e.target.value)}
                placeholder="Ask about Ramesh's project progress, lab performance, or upcoming counseling..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {messageSent && (
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Message delivered to Dr. Priya Sharma's portal!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Note to Advisor</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
