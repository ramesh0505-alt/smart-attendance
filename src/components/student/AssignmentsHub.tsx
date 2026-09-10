import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileText,
  MessageSquare,
  Award,
  ChevronRight,
  X,
  Send
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Assignment } from '../../types/index.ts';

export const AssignmentsHub: React.FC = () => {
  const { assignments, submissions, submitAssignment, subjects } = useCampus();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Submitted' | 'Evaluated'>('All');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStudentSubmission = (assignmentId: string) => {
    return submissions.find(
      s => s.assignmentId === assignmentId && (s.studentId === currentUser?.id || s.studentId === 'usr_student_1')
    );
  };

  const filteredAssignments = assignments.filter(a => {
    const userSub = getStudentSubmission(a.id);
    const status = userSub ? userSub.status : 'Pending';

    if (filter === 'All') return true;
    if (filter === 'Pending') return !userSub || status === 'Not Started' || status === 'In Progress';
    if (filter === 'Submitted') return status === 'Submitted';
    if (filter === 'Evaluated') return status === 'Evaluated';
    return true;
  });

  const handleOpenSubmitModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    const userSub = getStudentSubmission(assignment.id);
    setSubmissionText(userSub?.content || '');
    setAttachmentName(userSub?.fileAttachment || '');
  };

  const handleExecuteSubmit = async () => {
    if (!selectedAssignment || !submissionText.trim()) return;
    setIsSubmitting(true);
    const success = await submitAssignment(
      selectedAssignment.id,
      submissionText,
      attachmentName || `${selectedAssignment.title.replace(/\s+/g, '_')}_solution.pdf`
    );
    setIsSubmitting(false);
    if (success) {
      setSelectedAssignment(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>Coursework, Rubrics & Submissions</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Assignments Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit coursework solutions, review grading rubrics, and access faculty evaluations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['All', 'Pending', 'Submitted', 'Evaluated'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.map(a => {
          const userSub = getStudentSubmission(a.id);
          const isEvaluated = userSub?.status === 'Evaluated';
          const isSubmitted = userSub?.status === 'Submitted';
          const displayStatus = isEvaluated ? 'Evaluated' : isSubmitted ? 'Submitted' : 'Pending';

          const matchingSubject = subjects.find(s => s.id === a.subjectId);
          const subjectCode = matchingSubject?.code || 'CS401';

          return (
            <div
              key={a.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-400/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                    {subjectCode}: {a.subjectName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isEvaluated
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isSubmitted
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {displayStatus}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {a.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {a.description}
                </p>

                {/* Competency Tag */}
                {a.competencyTags && a.competencyTags.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Competency Target:</span>
                    <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
                      {a.competencyTags[0]}
                    </span>
                  </div>
                )}

                {/* Evaluated Marks Breakdown */}
                {isEvaluated && userSub && (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-500" />
                        Grade Awarded
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 text-sm">
                        {userSub.marksObtained} / {a.maxMarks} pts
                      </span>
                    </div>
                    {userSub.feedback && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 italic">
                        "{userSub.feedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Meta & Submission Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due {a.dueDate}</span>
                </div>

                <button
                  onClick={() => handleOpenSubmitModal(a)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isEvaluated || isSubmitted
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20'
                  }`}
                >
                  {isEvaluated ? 'View Graded Work' : isSubmitted ? 'Edit Submission' : 'Submit Solution'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                {selectedAssignment.subjectName}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {selectedAssignment.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Maximum Score: {selectedAssignment.maxMarks} Points • Due: {selectedAssignment.dueDate}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Written Analysis / Code Snippet / Submission Body
                </label>
                <textarea
                  rows={5}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Type your explanation, algorithm breakdown, schema definition, or code implementation here..."
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attached File / PDF Document (Simulated)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    placeholder="e.g. Ramesh_Kumar_Lab_Experiment_4.pdf"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => setAttachmentName(`${selectedAssignment.title.replace(/\s+/g, '_')}_solution.pdf`)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Attach PDF</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteSubmit}
                  disabled={!submissionText.trim() || isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Solution...' : 'Confirm Submission'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
