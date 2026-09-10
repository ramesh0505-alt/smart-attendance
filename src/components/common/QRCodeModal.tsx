import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { X, Clock, Users, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { AttendanceSession } from '../../types/index.ts';
import { useCampus } from '../../context/CampusContext.tsx';

interface QRCodeModalProps {
  session: AttendanceSession | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ session, onClose }) => {
  const { attendanceRecords, stopAttendanceSession } = useCampus();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins

  useEffect(() => {
    if (!session || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, session.qrToken, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }, (error) => {
      if (error) console.error('QR code render error:', error);
    });
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const expires = new Date(session.qrExpiresAt).getTime();
      const now = new Date().getTime();
      const diffSecs = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diffSecs);
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const scannedStudents = attendanceRecords.filter(r => r.sessionId === session.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Live Attendance Session Active
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            {session.subjectName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {session.room} • Semester {session.semester} (Section {session.section})
          </p>
        </div>

        {/* QR Code Canvas Card */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <div className="p-3 bg-white rounded-xl shadow-md">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          {/* Countdown & Security Token */}
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>
                Expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
            <div className="text-slate-400 font-mono text-[11px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
              {session.qrToken}
            </div>
          </div>
        </div>

        {/* Real-time Attendees Counter */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-500" />
              Real-time Scanned Students ({scannedStudents.length} / {session.totalStudents})
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {Math.round((scannedStudents.length / Math.max(1, session.totalStudents)) * 100)}% Present
            </span>
          </div>

          <div className="max-h-28 overflow-y-auto space-y-1.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            {scannedStudents.length === 0 ? (
              <p className="text-center py-2 text-slate-400 text-[11px]">
                Waiting for student scans...
              </p>
            ) : (
              scannedStudents.map(st => (
                <div
                  key={st.id}
                  className="flex items-center justify-between px-2 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{st.studentName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{st.timestamp.split('T')[1]?.substring(0, 5) || 'Just now'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stop Session Action */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              stopAttendanceSession(session.id);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-md shadow-rose-600/20"
          >
            End Attendance Session
          </button>
        </div>
      </motion.div>
    </div>
  );
};
