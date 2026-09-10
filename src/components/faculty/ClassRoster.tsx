import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useCampus } from '../../context/CampusContext.tsx';
import { User } from '../../types/index.ts';

export const ClassRoster: React.FC = () => {
  const { allUsers } = useAuth();
  const { competencies } = useCampus();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const students = allUsers.filter(u => u.role === 'student');
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.studentId && s.studentId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Class Directory & Student Academic Health</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Enrolled Students (B.Tech CSE - Semester 4)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Directory of {students.length} students with attendance compliance and continuous assessment metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name or roll..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(st => {
          const isSafeAttendance = (st.attendancePercentage || 90) >= 75;
          return (
            <div
              key={st.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {st.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">Roll: {st.studentId || 'CS2024-042'}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSafeAttendance
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isSafeAttendance ? 'Eligible' : 'Attendance Risk'}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px]">Attendance</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {st.attendancePercentage || 91}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">CGPA</span>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">
                      {st.cgpa || 8.4} / 10.0
                    </p>
                  </div>
                </div>

                {st.academicGoal && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Goal: </span>
                    <strong className="text-slate-800 dark:text-slate-200">{st.academicGoal}</strong>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{st.email}</span>
                <button
                  onClick={() => setSelectedStudent(st)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Deep-dive Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden space-y-5">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedStudent.studentId} • B.Tech CSE (Semester 4)
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  Target: {selectedStudent.academicGoal || 'Become an IoT Engineer'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Attendance</span>
                <p className="text-base font-black text-emerald-500">
                  {selectedStudent.attendancePercentage || 91}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Cumulative CGPA</span>
                <p className="text-base font-black text-sky-500">
                  {selectedStudent.cgpa || 8.4}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Exam Hall Ticket</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  Cleared
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Live Competency Health:
              </h4>
              <div className="space-y-2 text-xs">
                {competencies.slice(0, 3).map(comp => (
                  <div key={comp.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{comp.name}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{comp.currentLevel}% ({comp.status})</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
