import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  Award,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Download,
  Settings,
  Lock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';

export const AdminDashboard: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { announcements, downloadReportCsv, generateReport, reports, currentInstitution } = useCampus();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const departments = [
    { name: 'Computer Science & Engineering', students: 720, faculty: 38, attendance: 91, avgCgpa: 8.4, status: 'Optimal' },
    { name: 'Electronics & Communication', students: 640, faculty: 32, attendance: 88, avgCgpa: 8.1, status: 'Optimal' },
    { name: 'Mechanical Engineering', students: 510, faculty: 28, attendance: 79, avgCgpa: 7.7, status: 'Warning' },
    { name: 'Civil Engineering', students: 430, faculty: 24, attendance: 83, avgCgpa: 7.9, status: 'Optimal' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{currentInstitution?.name || 'Campus Governance'} • Institutional Health Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Institutional Admin Command Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time oversight of student attendance compliance, accreditation metrics (NBA/NAAC Bloom's taxonomy tracking), and institutional bulletins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadReportCsv('attendance_defaulters')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Defaulters (CSV)</span>
            </button>
            <button
              onClick={() => downloadReportCsv('audit_trail')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Security Audit Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Enrolled Students</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">2,300</span>
            <span className="text-xs font-semibold text-emerald-500">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">4 Academic Departments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Faculty In-Service</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">122</span>
            <span className="text-xs font-semibold text-indigo-500">Professors</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1:18 Faculty-Student Ratio</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Campus Attendance Avg</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-500">89.4%</span>
            <span className="text-xs font-semibold text-emerald-600">Compliant</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Threshold: 75% for exam hall tickets</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">NBA Outcome Attainment</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">92.8%</span>
            <span className="text-xs font-semibold text-indigo-500">Band A</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bloom's Taxonomy Met</p>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500" />
          Departmental Academic Performance & Compliance Index
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3">Department</th>
                <th className="pb-3 text-center">Students</th>
                <th className="pb-3 text-center">Faculty</th>
                <th className="pb-3">Attendance Rate</th>
                <th className="pb-3 text-center">Average CGPA</th>
                <th className="pb-3 text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {departments.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">{dept.name}</td>
                  <td className="py-3.5 text-center text-slate-600 dark:text-slate-300">{dept.students}</td>
                  <td className="py-3.5 text-center text-slate-600 dark:text-slate-300">{dept.faculty}</td>
                  <td className="py-3.5 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dept.attendance >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${dept.attendance}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] w-8">
                        {dept.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                    {dept.avgCgpa}
                  </td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        dept.status === 'Optimal'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
