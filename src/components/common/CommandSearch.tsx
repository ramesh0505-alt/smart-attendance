import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, FileCheck2, HelpCircle, Library, Megaphone, ArrowRight, X } from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({ isOpen, onClose, onNavigate }) => {
  const { subjects, assignments, assessments, resources, announcements } = useCampus();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredSubjects = q ? subjects.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) : subjects.slice(0, 3);
  const filteredAssignments = q ? assignments.filter(a => a.title.toLowerCase().includes(q) || a.subjectName.toLowerCase().includes(q)) : assignments.slice(0, 3);
  const filteredAssessments = q ? assessments.filter(a => a.title.toLowerCase().includes(q) || a.subjectName.toLowerCase().includes(q)) : assessments.slice(0, 3);
  const filteredResources = q ? resources.filter(r => r.title.toLowerCase().includes(q) || r.topicTitle.toLowerCase().includes(q)) : resources.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Search subjects, curriculum units, assignments, quizzes, notes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Subjects */}
          {filteredSubjects.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Courses & Subjects
              </span>
              <div className="space-y-1">
                {filteredSubjects.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onNavigate('curriculum');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">{sub.code}: {sub.name}</span>
                        <p className="text-[11px] text-slate-400">{sub.facultyName} • Semester {sub.semester}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {filteredAssignments.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Assignments & Tasks
              </span>
              <div className="space-y-1">
                {filteredAssignments.map(a => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onNavigate('assignments');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCheck2 className="w-4 h-4 text-sky-500" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">{a.title}</span>
                        <p className="text-[11px] text-slate-400">{a.subjectName} • Due {a.dueDate}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assessments */}
          {filteredAssessments.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Quizzes & Exams
              </span>
              <div className="space-y-1">
                {filteredAssessments.map(ass => (
                  <button
                    key={ass.id}
                    onClick={() => {
                      onNavigate('assessments');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">{ass.title}</span>
                        <p className="text-[11px] text-slate-400">{ass.subjectName} • {ass.questions.length} questions • {ass.durationMinutes} mins</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {filteredResources.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1.5">
                Digital Resources
              </span>
              <div className="space-y-1">
                {filteredResources.map(res => (
                  <button
                    key={res.id}
                    onClick={() => {
                      onNavigate('resources');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Library className="w-4 h-4 text-purple-500" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">{res.title}</span>
                        <p className="text-[11px] text-slate-400">{res.type} • {res.author}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with <kbd className="px-1 py-0.5 bg-white dark:bg-slate-900 border rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-white dark:bg-slate-900 border rounded">↓</kbd></span>
          <span>Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-900 border rounded">Esc</kbd> to exit</span>
        </div>
      </motion.div>
    </div>
  );
};
