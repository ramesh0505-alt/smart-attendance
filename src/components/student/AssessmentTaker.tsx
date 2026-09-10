import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';
import { Assessment, AssessmentAttempt } from '../../types/index.ts';

interface AssessmentTakerProps {
  onNavigateToRecommendations: () => void;
}

export const AssessmentTaker: React.FC<AssessmentTakerProps> = ({ onNavigateToRecommendations }) => {
  const { assessments, attemptAssessment, assessmentAttempts } = useCampus();

  const [activeQuiz, setActiveQuiz] = useState<Assessment | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<AssessmentAttempt | null>(null);

  const handleStartQuiz = (assessment: Assessment) => {
    setActiveQuiz(assessment);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setAttemptResult(null);
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);

    const answersPayload = activeQuiz.questions.map(q => ({
      questionId: q.id,
      selectedOption: selectedAnswers[q.id]
    }));

    const result = await attemptAssessment(activeQuiz.id, answersPayload);
    setIsSubmitting(false);
    if (result) {
      setAttemptResult(result);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Continuous Assessment & Diagnostic Quizzes</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Assessments & Diagnostic Quizzes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time evaluation feeding directly into competency updates and remediation loops
          </p>
        </div>
      </div>

      {/* Available Assessments Cards */}
      {!activeQuiz && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map(ass => {
            const pastAttempt = assessmentAttempts.find(a => a.assessmentId === ass.id);
            return (
              <div
                key={ass.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {ass.subjectCode}: {ass.subjectName}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {ass.durationMinutes} Mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ass.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ass.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Competencies:</span>
                    {ass.competencyTags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {pastAttempt && (
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-indigo-900 dark:text-indigo-200">Latest Attempt:</span>
                        <p className="text-[11px] text-slate-400">{new Date(pastAttempt.completedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
                          {pastAttempt.score} / {pastAttempt.totalMarks} ({pastAttempt.percentage}%)
                        </span>
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {pastAttempt.passed ? 'PASSED' : 'RETAKE SUGGESTED'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {ass.questions.length} Multiple Choice Questions
                  </span>
                  <button
                    onClick={() => handleStartQuiz(ass)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{pastAttempt ? 'Retake Quiz' : 'Launch Quiz'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Quiz Running Screen */}
      {activeQuiz && !attemptResult && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Top Quiz Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {activeQuiz.subjectCode} • {activeQuiz.title}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Question {currentQIndex + 1} of {activeQuiz.questions.length}
              </h3>
            </div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Question Body */}
          {activeQuiz.questions[currentQIndex] && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {activeQuiz.questions[currentQIndex].questionText}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Weight: {activeQuiz.questions[currentQIndex].marks} marks</span>
                  <span>•</span>
                  <span className="text-indigo-500 font-semibold">
                    Skill Tag: {activeQuiz.questions[currentQIndex].competencyTag}
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuiz.questions[currentQIndex].options.map((opt, optIdx) => {
                  const qId = activeQuiz.questions[currentQIndex].id;
                  const isSelected = selectedAnswers[qId] === optIdx;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(qId, optIdx)}
                      className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentQIndex < activeQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating Assessment...' : 'Submit & Score Quiz'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Assessment Completed Result Card & Live Loop Trigger */}
      {attemptResult && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Assessment Completed!
            </h3>
            <p className="text-xs text-slate-500">
              {attemptResult.assessmentTitle} • Evaluated in real time
            </p>
          </div>

          {/* Score Metric Bar */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
            <div>
              <span className="text-xs font-semibold text-slate-400">Total Marks</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {attemptResult.score} / {attemptResult.totalMarks}
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div>
              <span className="text-xs font-semibold text-slate-400">Percentage</span>
              <p className="text-2xl font-black text-emerald-500">
                {attemptResult.percentage}%
              </p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div>
              <span className="text-xs font-semibold text-slate-400">Competency Status</span>
              <p className="text-sm font-bold text-indigo-500 mt-1">
                Matrices Updated in Real-Time
              </p>
            </div>
          </div>

          {/* LIVE LOOP BANNER: If Gaps Detected */}
          {attemptResult.competencyGapsIdentified && attemptResult.competencyGapsIdentified.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>🔄 Continuous Improvement Loop Activated!</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                A gap was identified in <strong className="text-slate-900 dark:text-white">"{attemptResult.competencyGapsIdentified[0]}"</strong>.
                Our recommendation engine has scheduled a 10-minute micro-learning task for your upcoming 2:15 PM free period.
              </p>
              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setAttemptResult(null);
                  onNavigateToRecommendations();
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>View Smart Recommendation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setActiveQuiz(null);
                setAttemptResult(null);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              Return to Assessments Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
