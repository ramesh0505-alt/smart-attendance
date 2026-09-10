import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
  Check,
  X
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';
import { Recommendation } from '../../types/index.ts';

export const SmartRecommendations: React.FC = () => {
  const { recommendations, completeRecommendation, timetable } = useCampus();
  const [activeTask, setActiveTask] = useState<Recommendation | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const pendingRecs = recommendations.filter(r => !r.isCompleted);
  const completedRecs = recommendations.filter(r => r.isCompleted);

  const handleStartTask = (rec: Recommendation) => {
    setActiveTask(rec);
    setQuizAnswer(null);
  };

  const handleFinishTask = async () => {
    if (!activeTask) return;
    setIsFinishing(true);
    await completeRecommendation(activeTask.id);
    setIsFinishing(false);
    setActiveTask(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Diagnostic Remediation & Free Period Optimization</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Smart Recommendations & Micro-Learning
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Targeted 10-15 minute learning activities auto-scheduled into your timetable free slots based on detected competency gaps
          </p>
        </div>
      </div>

      {/* Pending Recommendations */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Active Micro-Learning Queue ({pendingRecs.length})
        </h3>

        {pendingRecs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">All Competencies in Peak Health!</h4>
            <p className="text-xs text-slate-400">No active gaps detected. Take an assessment to test advanced mastery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRecs.map(rec => (
              <div
                key={rec.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {rec.type} • {rec.durationMinutes} Mins
                    </span>
                    <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                      {rec.urgency} Priority
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Why recommended explanation */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                      💡 Why Recommended:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Scheduled Slot: <strong className="text-slate-800 dark:text-slate-200">{rec.freeSlotTime}</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    +12% Competency Boost
                  </span>
                  <button
                    onClick={() => handleStartTask(rec)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <span>Start 10-Min Task</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Recommendations Ledger */}
      {completedRecs.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Completed Micro-Learning History ({completedRecs.length})
          </h3>
          <div className="space-y-2">
            {completedRecs.map(rec => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{rec.title}</span>
                    <p className="text-[11px] text-slate-400">Competency: {rec.competencyTag} • Status: Boost Applied</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Completed & Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Micro-Learning Player Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden space-y-5">
            <button
              onClick={() => setActiveTask(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                10-Minute Micro-Remediation Task
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {activeTask.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Competency: <strong className="text-purple-600 dark:text-purple-400">{activeTask.competencyTag}</strong>
              </p>
            </div>

            {/* Core Pedagogical Concept Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Key Concept: Priority Inversion & Mutex Inheritance
              </h4>
              <p>
                In a real-time multitasking environment, <strong>Priority Inversion</strong> occurs when a high-priority task is indirectly preempted by a lower-priority task holding a shared resource.
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                {`// FreeRTOS Safe Mutex Acquisition:\nSemaphoreHandle_t xMutex = xSemaphoreCreateMutex();\nif (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE) {\n  /* Critical Section Access */\n  xSemaphoreGive(xMutex);\n}`}
              </div>
              <p>
                <strong>Solution:</strong> The Priority Inheritance protocol temporarily raises the priority of the lock-holding task to match the highest waiting task, eliminating intermediate delays.
              </p>
            </div>

            {/* Quick Diagnostic Validation Check */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Quick Concept Check: What guarantees immediate unblocking of a high-priority task?
              </span>

              <div className="space-y-2">
                {[
                  'Disabling all hardware system interrupts permanently',
                  'Priority Inheritance raising the holding task priority until release',
                  'Polling the mutex in a non-blocking spin loop without yield'
                ].map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setQuizAnswer(i)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors flex items-center gap-2.5 ${
                      quizAnswer === i
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 font-bold text-indigo-900 dark:text-indigo-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${quizAnswer === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>
                      {i === 1 && quizAnswer === i ? <Check className="w-3 h-3" /> : String.fromCharCode(65 + i)}
                    </div>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion Action Button */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveTask(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Review Later
              </button>
              <button
                onClick={handleFinishTask}
                disabled={quizAnswer === null || isFinishing}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isFinishing ? 'Updating Competency Matrix...' : 'Complete Task & Elevate Competency'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
