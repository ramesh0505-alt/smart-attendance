import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Library,
  ChevronRight,
  ChevronDown,
  Target,
  FileText
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';

interface CurriculumExplorerProps {
  onNavigateToQuiz: (subjectId: string) => void;
  onNavigateToResources: (subjectId: string) => void;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  onNavigateToQuiz,
  onNavigateToResources
}) => {
  const { subjects, curriculum } = useCampus();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'subj_iot');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    unit_iot_1: true,
    unit_iot_2: true,
    unit_rtos_1: true
  });

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const subjectUnits = curriculum.filter(u => u.subjectId === selectedSubjectId);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Calculate completion percentage
  const totalTopics = subjectUnits.reduce((acc, u) => acc + u.topics.length, 0);
  const completedTopics = subjectUnits.reduce(
    (acc, u) => acc + u.topics.filter(t => t.status === 'Completed' || t.status === 'Assessed').length,
    0
  );
  const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Academic Curriculum & Bloom's Taxonomy Taxonomy</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Curriculum Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hierarchical mapping of Units, Syllabus Topics, Bloom Objectives, and Course Outcome metrics
          </p>
        </div>

        {/* Quick Subject Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSubjectId === s.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Subject Overview Card */}
      {selectedSubject && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-0.5 rounded-full">
                  {selectedSubject.code}
                </span>
                <span className="text-xs text-slate-300">
                  {selectedSubject.credits} Credits • Semester {selectedSubject.semester}
                </span>
              </div>
              <h3 className="text-xl font-black">{selectedSubject.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedSubject.description}</p>
              <p className="text-xs text-indigo-200 font-semibold pt-1">
                Faculty In-Charge: {selectedSubject.facultyName}
              </p>
            </div>

            {/* Progress Gauge */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 min-w-[240px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">Syllabus Taught</span>
                <span className="text-lg font-black text-emerald-400">{progressPct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>{completedTopics} of {totalTopics} Topics Complete</span>
                <span>{subjectUnits.length} Units</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => onNavigateToQuiz(selectedSubject.id)}
                  className="flex-1 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Take Quiz</span>
                </button>
                <button
                  onClick={() => onNavigateToResources(selectedSubject.id)}
                  className="flex-1 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Library className="w-3.5 h-3.5" />
                  <span>Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Units & Topics Accordion Hierarchy */}
      <div className="space-y-4">
        {subjectUnits.map((unit, uIdx) => {
          const isExpanded = !!expandedUnits[unit.id];
          return (
            <div
              key={unit.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
            >
              {/* Unit Header */}
              <div
                onClick={() => toggleUnit(unit.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                    U{uIdx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {unit.title}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          unit.status === 'Completed' || unit.status === 'Assessed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : unit.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {unit.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {unit.topics.length} Syllabus Topics • {unit.durationHours} Hours Allocated
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Topics List */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {unit.topics.map((topic, tIdx) => (
                    <div
                      key={topic.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            {uIdx + 1}.{tIdx + 1}
                          </span>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {topic.title}
                          </h5>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                              topic.status === 'Completed' || topic.status === 'Assessed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {topic.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {topic.hours} Hours
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {topic.description}
                      </p>

                      {/* Bloom's Taxonomy Objectives */}
                      {topic.learningObjectives && topic.learningObjectives.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1.5">
                            <Target className="w-3 h-3 text-indigo-500" />
                            Bloom's Taxonomy Learning Outcomes
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {topic.learningObjectives.map(obj => (
                              <div
                                key={obj.id}
                                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-xs flex items-start gap-2"
                              >
                                <span
                                  className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded shrink-0 ${
                                    obj.bloomLevel === 'Create' || obj.bloomLevel === 'Evaluate'
                                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                      : obj.bloomLevel === 'Analyze'
                                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  }`}
                                >
                                  {obj.bloomLevel}
                                </span>
                                <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-tight">
                                  {obj.statement}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
