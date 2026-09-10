import React from 'react';
import {
  Users,
  QrCode,
  FileCheck2,
  HelpCircle,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Zap,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';

interface FacultyDashboardProps {
  onNavigate: (view: string) => void;
  onOpenQRLauncher: () => void;
  onOpenAiQuizModal: () => void;
  onOpenAiCoPilot: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  onNavigate,
  onOpenQRLauncher,
  onOpenAiQuizModal,
  onOpenAiCoPilot
}) => {
  const { currentUser } = useAuth();
  const {
    subjects,
    attendanceSessions,
    assignments,
    submissions,
    aiGenerationLogs,
    reviewAiGenerationLog,
    stats
  } = useCampus();

  const activeSession = attendanceSessions.find(s => s.isActive);
  const pendingSubmissions = submissions.filter(s => s.status === 'Submitted');
  const pendingAiLogs = aiGenerationLogs.filter(l => l.status === 'pending_review');

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 border border-emerald-500/30 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Department of Computer Science & Engineering</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser?.name}! 🎓
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Faculty command center. Manage lecture attendance, evaluate student coursework rubrics, review competency gaps, and approve AI assessments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQRLauncher}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <QrCode className="w-4 h-4" />
              <span>Launch QR Attendance</span>
            </button>

            <button
              onClick={onOpenAiQuizModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Quiz Builder</span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span>Export Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Assigned Courses</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">2</span>
            <span className="text-xs font-semibold text-indigo-500">CS401, CS402</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">IoT & Embedded Systems</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Students</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">120</span>
            <span className="text-xs font-semibold text-emerald-500">Section A & B</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">88% Avg Class Attendance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pending Evaluations</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-500">{pendingSubmissions.length || 2}</span>
            <span className="text-xs font-semibold text-slate-400">Submissions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires rubric grading</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">AI Drafts For Review</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{pendingAiLogs.length}</span>
            <span className="text-xs font-bold text-indigo-500">Review Required</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Human-in-the-loop validation</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Live Session & AI Human Review Desk */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Attendance Card */}
          {activeSession ? (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Active QR Session Broadcasting
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {activeSession.presentCount} Scanned
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeSession.subjectName} ({activeSession.room})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Session Token: <strong className="font-mono">{activeSession.qrToken}</strong> • Expires at {new Date(activeSession.qrExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <button
                onClick={onOpenQRLauncher}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                Display QR Code Modal
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Next Lecture: CS401 (IoT & Sensor Systems)
                </h3>
                <p className="text-xs text-slate-400">Scheduled at 9:00 AM in Lab 402</p>
              </div>
              <button
                onClick={onOpenQRLauncher}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Start QR Session</span>
              </button>
            </div>
          )}

          {/* AI Assessment Generation & Human Review Desk */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    AI Assessment Review Desk (Human-in-the-Loop)
                  </h3>
                  <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    Governance
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect generated questions, adjust rubrics, and approve before exposing to student assessment queues
                </p>
              </div>

              <button
                onClick={onOpenAiQuizModal}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                + New AI Quiz
              </button>
            </div>

            {aiGenerationLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No AI generation activity logged yet.</p>
            ) : (
              <div className="space-y-3">
                {aiGenerationLogs.map(log => {
                  const isPending = log.status === 'pending_review';
                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {log.subjectName}: {log.topic}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                log.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : log.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {log.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Model: <strong className="font-mono">{log.modelUsed}</strong> • {log.questionCount} Questions ({log.difficulty}) • Created by {log.facultyName}
                          </p>
                        </div>

                        {isPending && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => reviewAiGenerationLog(log.id, 'rejected')}
                              className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                              title="Reject Draft"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => reviewAiGenerationLog(log.id, 'approved')}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve & Publish</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {log.generatedContent?.questions && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            Sample Question: {log.generatedContent.questions[0]?.questionText}
                          </p>
                          <p className="text-[11px] text-slate-400 italic">
                            Rubric/Tag: {log.generatedContent.questions[0]?.competencyTag}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Coursework Evaluations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-sky-500" />
                  Student Submissions Awaiting Evaluation
                </h3>
                <p className="text-xs text-slate-400">Review solutions and assign rubric marks</p>
              </div>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Evaluator Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {submissions.slice(0, 3).map(sub => (
                <div
                  key={sub.id}
                  onClick={() => onNavigate('assignments')}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-all flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {sub.studentName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {sub.studentName}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {sub.content}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-sky-600 text-white text-[11px] font-bold shadow-xs shrink-0">
                    Grade Now
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Class Competency Gap Heatmap */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Class Competency Gap Insights
              </h3>
              <p className="text-[11px] text-slate-400">Synthesized from latest diagnostic tests</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-900 dark:text-rose-200">FreeRTOS Interrupt Handling</span>
                  <span className="text-rose-600 dark:text-rose-400">18% Gap</span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-300">
                  22 students missed questions regarding Mutex Priority Inversion.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-sky-900 dark:text-sky-200">Sensor Signal Filtering</span>
                  <span className="text-sky-600 dark:text-sky-400">8% Gap</span>
                </div>
                <p className="text-[11px] text-sky-700 dark:text-sky-300">
                  Minor difficulty with Kalman filter matrix multiplication.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAiQuizModal}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Remedial Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
