import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Sparkles,
  Search,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';
import { ReportType } from '../../types/index.ts';

export const ReportsCenter: React.FC = () => {
  const { reports, generateReport, downloadReportCsv, currentInstitution, stats } = useCampus();
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeReportModal, setActiveReportModal] = useState<string | null>(null);

  const reportDefinitions: {
    type: ReportType;
    title: string;
    description: string;
    badge: string;
    icon: any;
    color: string;
  }[] = [
    {
      type: 'attendance_defaulters',
      title: 'Attendance Defaulter Registry (<75%)',
      description: 'Regulatory compliance ledger listing all students with aggregate attendance below the statutory 75% threshold.',
      badge: 'Statutory Compliance',
      icon: AlertTriangle,
      color: 'from-amber-500/10 to-rose-500/10 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400'
    },
    {
      type: 'competency_matrix',
      title: 'Cohort Competency & Remediation Matrix',
      description: 'Outcome-based education (OBE) breakdown tracking subject-level skill proficiencies, gap rates, and personalized loop completions.',
      badge: 'OBE Accreditation',
      icon: Award,
      color: 'from-indigo-500/10 to-cyan-500/10 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400'
    },
    {
      type: 'academic_cie',
      title: 'Continuous Internal Evaluation (CIE) Marks Statement',
      description: 'Consolidated semester coursework scores combining assignments, quiz evaluations, project milestones, and projected CGPA.',
      badge: 'Examination Cell',
      icon: FileSpreadsheet,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
    },
    {
      type: 'audit_trail',
      title: 'Institutional Security & Access Audit Trail',
      description: 'Immutable system access log tracking authenticated QR generation, attendance check-ins, evaluation updates, and AI interactions.',
      badge: 'Security & Governance',
      icon: ShieldCheck,
      color: 'from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-900/50 text-purple-600 dark:text-purple-400'
    }
  ];

  const handleGenerate = async (type: ReportType, title: string) => {
    setIsGenerating(true);
    await generateReport(type, title);
    setIsGenerating(false);
  };

  const filteredReports = selectedType === 'all'
    ? reports
    : reports.filter(r => r.type === selectedType);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                Institutional Export Engine
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentInstitution?.name || 'Smart Institute of Technology'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Compliance & Reports Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Generate, audit, and export production-grade spreadsheets for NAAC/NBA accreditation, Attendance Defaulter warnings, Continuous Internal Evaluation (CIE), and role security logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadReportCsv('attendance_defaulters')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Instant Export Defaulters (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Report Generators Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportDefinitions.map(rep => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.type}
              className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${rep.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {rep.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                  {rep.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {rep.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleGenerate(rep.type, rep.title)}
                  disabled={isGenerating}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  Generate New
                </button>
                <button
                  onClick={() => downloadReportCsv(rep.type)}
                  title="Download CSV"
                  className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generated Reports Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Generated Reports & Historical Exports
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Archived institutional exports with immutable timestamp signatures and row summaries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="all">All Report Categories</option>
              <option value="attendance_defaulters">Attendance Defaulters</option>
              <option value="competency_matrix">Competency Matrix</option>
              <option value="academic_cie">Academic CIE Marks</option>
              <option value="audit_trail">Security Audit Trail</option>
            </select>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No reports generated under this filter.</p>
            <p className="text-xs">Click "Generate New" above to create an export.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-y border-slate-200/60 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Report Title</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Generated By</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Rows</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredReports.map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs">
                      <div>{rep.title}</div>
                      <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">{rep.summary}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {rep.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                      {rep.generatedBy}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono">
                      {new Date(rep.generatedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {rep.rowCount} records
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => downloadReportCsv(rep.type)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CSV</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
