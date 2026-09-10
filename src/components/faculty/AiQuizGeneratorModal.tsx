import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  Plus,
  Trash2,
  Send
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';

interface AiQuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiQuizGeneratorModal: React.FC<AiQuizGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { subjects, createAssessment } = useCampus();

  const [topic, setTopic] = useState('FreeRTOS Mutex Priority Inversion & Semaphores');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[1]?.id || subjects[0]?.id || 'subj_rtos');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState(3);
  const [syllabusNotes, setSyllabusNotes] = useState('Focus on priority inheritance mechanisms, deadlock prevention, and task context switching latencies.');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/quiz-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          subjectName: selectedSubject.name,
          difficulty,
          questionCount,
          syllabusNotes
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedQuiz(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishAssessment = async () => {
    if (!generatedQuiz || isPublishing) return;
    setIsPublishing(true);

    const questionsFormatted = generatedQuiz.questions.map((q: any, idx: number) => ({
      id: `q_ai_${Date.now()}_${idx}`,
      questionText: q.questionText,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation,
      competencyTag: q.competencyTag || `${selectedSubject.name} Mastery`,
      marks: q.marks || 5
    }));

    const totalMarks = questionsFormatted.reduce((acc: number, q: any) => acc + q.marks, 0);

    const success = await createAssessment({
      title: generatedQuiz.title || `${topic} Assessment`,
      subjectId: selectedSubject.id,
      subjectCode: selectedSubject.code,
      subjectName: selectedSubject.name,
      description: generatedQuiz.summary || `AI Generated diagnostic quiz covering ${topic}.`,
      durationMinutes: 15,
      totalMarks,
      passingMarks: Math.round(totalMarks * 0.6),
      questions: questionsFormatted,
      competencyTags: Array.from(new Set(questionsFormatted.map((q: any) => q.competencyTag)))
    });

    setIsPublishing(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Gemini AI Assessment Generator</h3>
              <p className="text-[11px] text-indigo-200">
                Instantly construct rigorous syllabus-grounded MCQs with rubrics and skill tags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!generatedQuiz ? (
            /* Input Form */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course Subject
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={e => setSelectedSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.code}: {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${
                          difficulty === diff
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assessment Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. FreeRTOS Task Scheduling & Mutex Locks"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Context / Special Focus Instructions
                </label>
                <textarea
                  rows={3}
                  value={syllabusNotes}
                  onChange={e => setSyllabusNotes(e.target.value)}
                  placeholder="Provide syllabus notes, core concepts to test, or analytical scenarios..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini 3.7 Generating Academic Assessment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Assessment Questions</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Review & Edit Generated Assessment */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">
                  {generatedQuiz.subject}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {generatedQuiz.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {generatedQuiz.summary}
                </p>
              </div>

              {/* Questions Preview */}
              <div className="space-y-4">
                {generatedQuiz.questions.map((q: any, qIdx: number) => (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Q{qIdx + 1}: {q.questionText}
                      </span>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded shrink-0">
                        {q.competencyTag}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt: string, optIdx: number) => (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            optIdx === q.correctOptionIndex
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <strong>Pedagogical Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setGeneratedQuiz(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Regenerate
                </button>
                <button
                  onClick={handlePublishAssessment}
                  disabled={isPublishing}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isPublishing ? 'Publishing...' : 'Publish Assessment to Course'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
