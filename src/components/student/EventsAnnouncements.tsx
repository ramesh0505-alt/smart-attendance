import React from 'react';
import {
  CalendarDays,
  Megaphone,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext.tsx';

export const EventsAnnouncements: React.FC = () => {
  const { events, announcements, toggleEventRegistration } = useCampus();

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Campus Life, Symposiums & Administrative Bulletins</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Events & Announcements
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stay updated with institutional notices, hackathon schedules, and technical club events
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Events */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Upcoming Campus Events & Hackathons
          </h3>

          <div className="space-y-3">
            {events.map(evt => (
              <div
                key={evt.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                      {evt.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {evt.date} • {evt.time}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {evt.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {evt.registeredCount} Registered
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => toggleEventRegistration(evt.id)}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                      evt.isRegistered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-emerald-950/20'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                    }`}
                  >
                    {evt.isRegistered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Registered (Pass Active)</span>
                      </>
                    ) : (
                      <span>Register for Event</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Institutional Notices */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-sky-500" />
            Official Campus Bulletins
          </h3>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className={`p-5 rounded-3xl border text-xs space-y-2 ${
                  ann.isUrgent
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      ann.isUrgent
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  {ann.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {ann.content}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                  <img
                    src={ann.authorAvatar}
                    alt={ann.authorName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>Published by {ann.authorName} ({ann.authorRole})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
