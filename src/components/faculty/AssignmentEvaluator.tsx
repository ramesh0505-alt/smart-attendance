import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Award,
  CheckCircle2,
  Clock,
  Send,
  X,
  FileText,
  User
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';
import { Submission } from '../../types/index.ts';

export const AssignmentEvaluator: React.FC = () => {
  const { subjects, assignments, submissions, gradeSubmission, createAssignment } = useCampus();

  const [activeTab, setActiveTab] = useState<'submissions' | 'assignments'>('submissions');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [marks, setMarks] = useState(24);
  const [feedback, setFeedback] = useState('Excellent algorithm optimization and clean schematic breakdown.');
  const [isGrading, setIsGrading] = useState(false);

  // New assignment form state
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || 'subj_iot');
  const [newMaxMarks, setNewMaxMarks] = useState(25);
  const [newDueDate, setNewDueDate] = useState('2026-09-15');
  const [newCompetencyTag, setNewCompetencyTag] = useState('Embedded RTOS Architecture');
  const [newDesc, setNewDesc] = useState('');

  const handleGrade = async () => {
    if (!selectedSub) return;
    setIsGrading(true);
    const success = await gradeSubmission(selectedSub.id, marks, feedback);
    setIsGrading(false);
    if (success) {
      setSelectedSub(null);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const sub = subjects.find(s => s.id === newSubjectId) || subjects[0];
    await createAssignment({
      title: newTitle,
      subjectId: sub.id,
      subjectCode: sub.code,
      subjectName: sub.name,
      description: newDesc || 'Solve the lab assignment according to the provided specification.',
      dueDate: newDueDate,
      maxMarks: newMaxMarks,
      rubric: [
        { criteria: 'Correctness & Logic', maxPoints: Math.round(newMaxMarks * 0.5) },
        { criteria: 'Design & Code Quality', maxPoints: Math.round(newMaxMarks * 0.3) },
        { criteria: 'Documentation & Schematics', maxPoints: Math.round(newMaxMarks * 0.2) }
      ],
      competencyTag: newCompetencyTag
    });

    setIsCreatingAssignment(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>Coursework Rubric & Evaluation Desk</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Assignment & Lab Submission Evaluator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Grade student submissions against criteria rubrics and automatically stream results to student gradebooks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreatingAssignment(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Active Student Submissions ({submissions.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map(sub => {
            const isGraded = sub.status === 'Graded' || (sub.marksObtained !== undefined && sub.marksObtained !== null);
            return (
              <div
                key={sub.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-sky-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                        {sub.studentName[0]}
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {sub.studentName}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isGraded
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {isGraded ? `Graded: ${sub.marksObtained} pts` : 'Pending Grade'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 line-clamp-3 leading-relaxed">
                    {sub.content}
                  </p>

                  {sub.fileAttachment && (
                    <div className="flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-sky-400">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Attachment: {sub.fileAttachment}</span>
                    </div>
                  )}

                  {isGraded && sub.feedback && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 italic bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80">
                      <strong>Feedback:</strong> {sub.feedback}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Submitted on {sub.submittedAt}</span>
                  <button
                    onClick={() => {
                      setSelectedSub(sub);
                      setMarks(sub.marksObtained || 23);
                      setFeedback(sub.feedback || 'Good structural organization and clean implementation.');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    {isGraded ? 'Update Grade' : 'Evaluate & Award Marks'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade Submission Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setSelectedSub(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                Grading Rubric
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Evaluate: {selectedSub.studentName}
              </h3>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Submitted Content:</span>
              <p className="text-slate-600 dark:text-slate-400">{selectedSub.content}</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Marks Awarded</span>
                  <span className="text-sky-600 dark:text-sky-400 font-black text-sm">{marks} / 25 Pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={marks}
                  onChange={e => setMarks(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Feedback & Next Steps
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedSub(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleGrade}
                disabled={isGrading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isGrading ? 'Saving Grade...' : 'Publish Rubric Evaluation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Assignment Modal */}
      {isCreatingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateAssignment}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsCreatingAssignment(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create New Coursework Assignment
              </h3>
              <p className="text-xs text-slate-400">Specify deadline, max score, and outcome competency</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. MQTT Broker Cluster Configuration"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={e => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code}: {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newMaxMarks}
                    onChange={e => setNewMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Competency</label>
                <input
                  type="text"
                  value={newCompetencyTag}
                  onChange={e => setNewCompetencyTag(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Provide instructions and submission requirements..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingAssignment(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/30"
              >
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
