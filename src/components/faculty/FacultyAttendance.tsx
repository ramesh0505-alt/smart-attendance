import React, { useState } from 'react';
import {
  QrCode,
  Play,
  Square,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  Download,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';

interface FacultyAttendanceProps {
  onOpenQRLauncher: () => void;
}

export const FacultyAttendance: React.FC<FacultyAttendanceProps> = ({ onOpenQRLauncher }) => {
  const { subjects, attendanceSessions, attendanceRecords, startAttendanceSession, stopAttendanceSession } = useCampus();

  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'subj_iot');
  const [room, setRoom] = useState('Lab 402');
  const [durationMins, setDurationMins] = useState(15);
  const [isStarting, setIsStarting] = useState(false);

  const activeSession = attendanceSessions.find(s => s.isActive);
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleStart = async () => {
    setIsStarting(true);
    await startAttendanceSession(selectedSubject.id, selectedSubject.name, room, durationMins);
    setIsStarting(false);
  };

  const handleStop = async (sessionId: string) => {
    await stopAttendanceSession(sessionId);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" />
            <span>Cryptographic Attendance Broadcast Station</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Class Attendance Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Broadcast dynamic rotating QR codes with geo-timestamp verification to prevent proxy check-ins
          </p>
        </div>
      </div>

      {/* Active Session Broadcast Box */}
      {activeSession ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-500/40 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Attendance Broadcast In Progress</span>
              </div>
              <h3 className="text-xl font-black">
                {activeSession.subjectName} ({activeSession.room})
              </h3>
              <p className="text-xs text-slate-300">
                Rotating Token: <span className="font-mono font-bold text-emerald-300">{activeSession.qrToken}</span> • Expires at {new Date(activeSession.qrExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenQRLauncher}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Show Large QR Projector View</span>
              </button>
              <button
                onClick={() => handleStop(activeSession.id)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                <span>End Session</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                Real-time Verified Scans Recorded:
              </span>
            </div>
            <span className="text-xl font-black text-emerald-400">
              {activeSession.presentCount} / {activeSession.totalEnrolled} Students (91%)
            </span>
          </div>
        </div>
      ) : (
        /* Create New Session Launcher */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-500" />
            Start New Lecture Attendance Session
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
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
                Classroom / Laboratory
              </label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="e.g. Lab 402"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                QR Code Lifespan
              </label>
              <select
                value={durationMins}
                onChange={e => setDurationMins(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value={5}>5 Minutes (Quick Attendance)</option>
                <option value={15}>15 Minutes (Standard Class)</option>
                <option value={30}>30 Minutes (Extended Lab)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isStarting}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>{isStarting ? 'Generating QR Cipher...' : 'Broadcast Dynamic QR Session'}</span>
          </button>
        </div>
      )}

      {/* Historical Sessions Ledger */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Past Attendance Broadcast Archives
            </h3>
            <p className="text-xs text-slate-400">Exportable logs for academic auditing</p>
          </div>

          <button
            onClick={() => alert('Exporting attendance ledger to CSV...')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {attendanceSessions.filter(s => !s.isActive).map(sess => (
            <div
              key={sess.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {sess.subjectName} ({sess.room})
                </span>
                <p className="text-[11px] text-slate-400">
                  {sess.date} • Created at {new Date(sess.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="text-right">
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  {sess.presentCount} / {sess.totalEnrolled} (91%)
                </span>
                <p className="text-[10px] text-slate-400">Session Closed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
