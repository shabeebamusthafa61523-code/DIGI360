// ==========================================
// FRONTEND: Attendance.jsx
// Employee Attendance Log In / Log Out Page
// Connected with Staff Attendance Logs
// ==========================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar,
  ChevronRight,
  UserCheck,
  History
} from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

// Helper to get IST Date YYYY-MM-DD
const getISTDate = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata'
  }).format(new Date());
};

const parseAsUTC = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return dateInput;
  const value = String(dateInput);
  return new Date(value.endsWith('Z') ? value : `${value}Z`);
};

const formatTime = (dateInput) => {
  if (!dateInput) return '---';
  try {
    return parseAsUTC(dateInput).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  } catch {
    return '---';
  }
};

const calculateWorkingHours = (checkIn, checkOut, targetDateStr = null) => {
  if (!checkIn) return "0.00";
  const start = parseAsUTC(checkIn);
  let end;
  if (checkOut) {
    end = parseAsUTC(checkOut);
  } else {
    const isToday = targetDateStr ? targetDateStr === getISTDate() : true;
    if (isToday) {
      end = new Date();
    } else {
      return "0.00";
    }
  }
  return Math.max(0, (end.getTime() - start.getTime()) / 3600000).toFixed(2);
};

// ==========================================
// LIVE IST CLOCK (Matching Screenshot)
// ==========================================
const ISTClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toLowerCase();

  return (
    <div className="text-center py-6">
      <p className="text-5xl sm:text-6xl md:text-7xl font-mono font-bold text-slate-900 dark:text-slate-100 tracking-tight select-none">
        {timeString}
      </p>
      <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">
        Indian Standard Time (IST)
      </p>
    </div>
  );
};

const Attendance = () => {
  const { user: contextUser } = useUser();

  // Retrieve current user profile from context or localStorage fallback
  const currentUser = useMemo(() => {
    if (contextUser && typeof contextUser === 'object') return contextUser;
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [contextUser]);

  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // My Attendance History State
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Update live clock reference every second for duration calculations
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getHeaders = useCallback(() => {
    const rawToken = localStorage.getItem('token');
    const token = rawToken ? rawToken.replace(/^"(.*)"$/, '$1').replace(/"/g, '').replace(/^Bearer\s+/i, '').trim() : '';
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  // Fetch Current Logged-in User's Today Punch Status
  const fetchPersonalStatus = useCallback(async () => {
    try {
      setLoading(true);
      const todayStr = getISTDate();
      const res = await fetch(`${API_BASE}/attendance/${todayStr}`, {
        headers: getHeaders()
      });

      if (!res.ok) {
        setTodayLog(null);
        return;
      }
      const data = await res.json();
      setTodayLog(data || null);
    } catch (err) {
      console.error("Personal attendance sync error:", err);
      setTodayLog(null);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // Fetch Personal Attendance History Logs
  const fetchHistoryLogs = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch(`${API_BASE}/attendance/my-history`, {
        headers: getHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setHistoryLogs(data);
          return;
        }
      }
      setHistoryLogs([]);
    } catch {
      setHistoryLogs([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchPersonalStatus();
    fetchHistoryLogs();
  }, [fetchPersonalStatus, fetchHistoryLogs]);

  // Handle Check-In / Check-Out
  const handlePunchAction = async (type) => {
    setPunchLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE}/attendance/${type}`, {
        method: 'POST',
        headers: getHeaders()
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.detail || `Failed to ${type.replace('-', ' ')}.`);
      }

      const text = type === 'check-in' ? 'Check-in recorded' : 'Check-out recorded';
      setSuccessMsg(`${text} successfully! Synced with Attendance Logs.`);

      await fetchPersonalStatus();
      await fetchHistoryLogs();

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err.message);
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setPunchLoading(false);
    }
  };

  // Live Calculating Working Hours
  const liveWorkingHours = useMemo(() => {
    if (!todayLog?.check_in_time) return "0.00";
    if (todayLog?.check_out_time) {
      return calculateWorkingHours(todayLog.check_in_time, todayLog.check_out_time);
    }
    return calculateWorkingHours(todayLog.check_in_time, currentTime);
  }, [todayLog, currentTime]);

  // Resolve user display info
  const displayName = currentUser?.name || 'Employee';
  const displayDepartment = currentUser?.department || currentUser?.designation || currentUser?.role || 'R&D';
  const displayAvatar = currentUser?.avatar || currentUser?.profile_image || null;
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'EM';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 font-sans">
      
      {/* ========================================== */}
      {/* HEADER SECTION (Matching Screenshot)       */}
      {/* ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Attendance Log In / Log Out
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            Log in and log out your daily shift attendance
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            {getISTDate()}
          </span>

          <button
            onClick={() => {
              fetchPersonalStatus();
              fetchHistoryLogs();
            }}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Refresh Attendance Status"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-indigo-500" : "text-indigo-500"} />
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* NOTIFICATION FEEDBACK ALERTS               */}
      {/* ========================================== */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer text-xs font-bold">
              ✕
            </button>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer text-xs font-bold">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MAIN PUNCH CARD (Matching Screenshot)      */}
      {/* ========================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Profile Info Header on Card */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center text-sm shrink-0 border border-indigo-200 dark:border-indigo-800 overflow-hidden shadow-xs">
              {displayAvatar ? (
                <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {displayName}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-xs text-slate-400 font-medium">
                  {displayDepartment}
                </p>
                {(currentUser?.shift_start_time || currentUser?.shiftStartTime) && (
                  <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                    Shift: {currentUser.shift_start_time || currentUser.shiftStartTime} - {currentUser.shift_end_time || currentUser.shiftEndTime || '18:00'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            {todayLog?.check_in_time && !todayLog?.check_out_time ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Shift
              </span>
            ) : todayLog?.check_out_time ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-2xs">
                <CheckCircle2 size={13} className="text-blue-500" />
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Not Checked In
              </span>
            )}
          </div>
        </div>

        {/* Live IST Clock */}
        <ISTClock />

        {/* Punch In / Punch Out Action Button */}
        <div className="flex flex-col items-center justify-center pt-2">
          {loading ? (
            <div className="py-4">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
            </div>
          ) : !todayLog?.check_in_time ? (
            <button
              onClick={() => handlePunchAction('check-in')}
              disabled={punchLoading}
              className="w-full max-w-sm py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {punchLoading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              <span>Log In (Check In)</span>
            </button>
          ) : !todayLog?.check_out_time ? (
            <button
              onClick={() => handlePunchAction('check-out')}
              disabled={punchLoading}
              className="w-full max-w-sm py-3.5 px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {punchLoading ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
              <span>Log Out (Check Out)</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center max-w-sm w-full">
              <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1">
                <CheckCircle2 size={16} />
                <span>Shift Completed Today</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged out at {formatTime(todayLog.check_out_time)}. Duration logged in Attendance Logs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* SHIFT SUMMARY CARDS (Matching Screenshot)  */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            CHECK-IN
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            {todayLog?.check_in_time ? formatTime(todayLog.check_in_time) : '---'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            CHECK-OUT
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-slate-800 dark:text-slate-100">
            {todayLog?.check_out_time ? formatTime(todayLog.check_out_time) : '- - -'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            DURATION
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {liveWorkingHours} hrs
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            STATUS
          </span>
          <span className="text-xs sm:text-sm font-bold">
            {todayLog?.is_late ? (
              <span className="text-amber-600 dark:text-amber-400">
                Late Arrival {(currentUser?.shift_start_time || currentUser?.shiftStartTime) ? `(After ${currentUser.shift_start_time || currentUser.shiftStartTime})` : ''}
              </span>
            ) : todayLog?.check_in_time ? (
              <span className="text-emerald-600 dark:text-emerald-400">On Time</span>
            ) : (
              <span className="text-slate-400">Pending</span>
            )}
          </span>
        </div>
      </div>

      {/* ========================================== */}
      {/* PERSONAL ATTENDANCE LOGS HISTORY TABLE     */}
      {/* ========================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <History size={18} className="text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                My Attendance Logs & History
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Recent shift attendance punches and accrued hours for your profile
              </p>
            </div>
          </div>

          <button
            onClick={fetchHistoryLogs}
            disabled={historyLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            <RefreshCw size={12} className={historyLoading ? "animate-spin text-indigo-500" : "text-indigo-500"} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Working Hours</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {historyLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-indigo-500 mb-1.5" />
                    Loading your attendance history...
                  </td>
                </tr>
              ) : historyLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <Calendar className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                    No previous attendance history records found yet.
                  </td>
                </tr>
              ) : (
                historyLogs.map((log) => {
                  const isCurrentDay = log.date === getISTDate();
                  return (
                    <tr key={log.id || log.date} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {log.date}
                        {isCurrentDay && (
                          <span className="ml-2 text-[10px] font-sans font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                            Today
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        {log.check_in_time ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {formatTime(log.check_in_time)}
                          </span>
                        ) : (
                          <span className="text-slate-400">---</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        {log.check_out_time ? (
                          <span className="text-slate-700 dark:text-slate-300">
                            {formatTime(log.check_out_time)}
                          </span>
                        ) : log.check_in_time && isCurrentDay ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            In-Shift
                          </span>
                        ) : (
                          <span className="text-slate-400">---</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {log.working_hours ? `${log.working_hours} hrs` : '0.00 hrs'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {log.is_late ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            Late Entry
                          </span>
                        ) : log.check_in_time ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            Present
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                            Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Attendance;