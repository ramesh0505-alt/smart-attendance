import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';
import { TimetableSlot } from '../../types/index.ts';

export const TimetableSchedule: React.FC<{ onOpenQRScanner: () => void }> = ({ onOpenQRScanner }) => {
  const { timetable } = useCampus();
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const daySlots = timetable.filter(t => t.day === selectedDay);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Academic Schedule & Room Routing</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Semester 4 Timetable (Section A)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated conflict-free routine with synchronized free-period study allocations
          </p>
        </div>

        {/* Day Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedDay === d
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Slot Timeline */}
      <div className="space-y-3">
        {daySlots.map(slot => (
          <div
            key={slot.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              slot.isCurrent
                ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-md'
                : slot.isFreeSlot
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-dashed border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            {/* Time & Badge */}
            <div className="flex items-start sm:items-center gap-4">
              <div
                className={`w-28 text-center p-2.5 rounded-xl text-xs font-bold shrink-0 ${
                  slot.isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : slot.isFreeSlot
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="block text-xs font-black">{slot.startTime}</span>
                <span className="block text-[10px] text-opacity-80">to {slot.endTime}</span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {slot.subjectName}
                  </h3>
                  {slot.isCurrent && (
                    <span className="text-[10px] uppercase font-extrabold bg-emerald-500 text-slate-950 px-2 py-0.2 rounded-full animate-pulse">
                      Live In-Session
                    </span>
                  )}
                  {slot.isFreeSlot && (
                    <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Free Period • Micro-Learning Opportunity
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {slot.room}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {slot.facultyName}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {slot.isCurrent && (
                <button
                  onClick={onOpenQRScanner}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Check-in via QR</span>
                </button>
              )}
              {slot.isFreeSlot && (
                <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                  Recommended Study: FreeRTOS Review (10 mins)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
