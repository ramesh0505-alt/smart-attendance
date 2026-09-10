import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  FileText,
  Video,
  Code2,
  Bookmark,
  Search,
  ExternalLink,
  Download,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';

export const LearningResources: React.FC = () => {
  const { resources, toggleResourceBookmark, subjects } = useCampus();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = resources.filter(r => {
    if (selectedSubjectId !== 'all' && r.subjectId !== selectedSubjectId) return false;
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.topicTitle.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Library className="w-4 h-4" />
            <span>Digital Academic Library & Artifacts</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Course Notes & Learning Materials
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Curated lecture slides, reference PDFs, lab manuals, and code implementations
          </p>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 max-w-xs w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search resources, topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedSubjectId === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSubjectId === s.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>

        {/* Type Select */}
        <div className="flex items-center gap-1.5">
          {['all', 'PDF Notes', 'Video Lecture', 'Code Repository'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedType === type
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(res => {
          const isVideo = res.type === 'Video Lecture';
          const isCode = res.type === 'Code Repository';

          return (
            <div
              key={res.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                    {res.type}
                  </span>
                  <button
                    onClick={() => toggleResourceBookmark(res.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      res.isBookmarked
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${res.isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isVideo
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : isCode
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400'
                    }`}
                  >
                    {isVideo ? <Video className="w-5 h-5" /> : isCode ? <Code2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Topic: {res.topicTitle} • {res.fileSize || 'Interactive'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {res.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{res.author}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
