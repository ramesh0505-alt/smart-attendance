import React from 'react';
import {
  Award,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';

export const CompetencyMatrix: React.FC<{ onNavigateToRecommendations: () => void }> = ({
  onNavigateToRecommendations
}) => {
  const { currentUser } = useAuth();
  const { competencies } = useCampus();

  const strongList = competencies.filter(c => c.status === 'Strong');
  const devList = competencies.filter(c => c.status === 'Developing');
  const practiceList = competencies.filter(c => c.status === 'Needs Practice');

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Skill Inventory & Outcome Alignment</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Competency Mastery Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time competency health dynamically recalibrated by continuous assessments and micro-learning tasks
          </p>
        </div>

        <button
          onClick={onNavigateToRecommendations}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>View Free Period Recommendations</span>
        </button>
      </div>

      {/* Target Career Goal Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full">
                Active Career Blueprint
              </span>
              <span className="text-xs text-slate-300">78% Target Alignment</span>
            </div>
            <h3 className="text-xl font-black flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Goal: {currentUser?.academicGoal || 'Become an IoT Engineer'}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Curriculum mappings show high proficiency in Sensor Interfacing and Networking Protocols. Complete the FreeRTOS Micro-Learning task to push your core embedded alignment past 85%.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/20">
              <span className="text-xs text-slate-300">Strong</span>
              <p className="text-xl font-black text-emerald-400">{strongList.length}</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/20">
              <span className="text-xs text-slate-300">Developing</span>
              <p className="text-xl font-black text-sky-400">{devList.length}</p>
            </div>
            <div className="text-center p-3 rounded-2xl bg-white/10 border border-white/20">
              <span className="text-xs text-slate-300">Needs Focus</span>
              <p className="text-xl font-black text-rose-400">{practiceList.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Competency List by Category */}
      <div className="space-y-4">
        {competencies.map(comp => (
          <div
            key={comp.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {comp.name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      comp.status === 'Strong'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : comp.status === 'Developing'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {comp.status} ({comp.currentLevel}%)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Domain: {comp.category} • Target Benchmark: {comp.targetLevel}%
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Level {Math.floor(comp.currentLevel / 20) + 1} of 5
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  comp.currentLevel >= 80
                    ? 'bg-emerald-500'
                    : comp.currentLevel >= 60
                    ? 'bg-sky-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${comp.currentLevel}%` }}
              ></div>
            </div>

            {/* Related Syllabus Topics & History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Connected Curriculum Topics:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.relatedTopicTitles.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Recent Calibration Events:
                </span>
                <div className="space-y-1">
                  {comp.history.slice(-2).map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{h.activityTitle}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{h.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
