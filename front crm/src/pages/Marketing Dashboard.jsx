import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, BarChart3, RefreshCw, ChevronRight,
  ArrowUpRight, Award, PieChart, CheckCircle2,
  Phone, Mail, Briefcase, Tag, Calendar, Clock, Target,
  Zap, Loader2, Eye, Activity, Megaphone, FolderKanban,
  CheckSquare, Plus, FileText, Globe, ExternalLink, Sparkles,
  Building2, Layers, Search, Filter, AlertCircle, Share2,
  CheckCircle, MessageSquare, ShieldAlert
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';

const rawApiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const API_BASE = rawApiBase.endsWith('/v1') ? rawApiBase : `${rawApiBase}/v1`;

/* ─── Color maps ─── */
const STATUS_COLORS = {
  'New':        { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800', bar: 'from-blue-500 to-indigo-500', dot: 'bg-blue-500' },
  'Contacted':  { badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800', bar: 'from-indigo-500 to-violet-500', dot: 'bg-indigo-500' },
  'Follow Up':  { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800', bar: 'from-amber-500 to-yellow-500', dot: 'bg-amber-500' },
  'Interested': { badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800', bar: 'from-purple-500 to-fuchsia-500', dot: 'bg-purple-500' },
  'Converted':  { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', bar: 'from-emerald-500 to-teal-500', dot: 'bg-emerald-500' },
  'Lost':       { badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800', bar: 'from-rose-500 to-red-500', dot: 'bg-rose-500' },
};

const PLATFORM_COLORS = {
  'facebook_post':   { name: 'Facebook Post', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900', icon: 'FB' },
  'facebook_story':  { name: 'Facebook Story', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900', icon: 'FB' },
  'instagram_post':  { name: 'Instagram Post', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900', icon: 'IG' },
  'instagram_story': { name: 'Instagram Story', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900', icon: 'IG' },
  'instagram_reel':  { name: 'Instagram Reel', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900', icon: 'REEL' },
  'linkedin_post':   { name: 'LinkedIn Post', bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900', icon: 'IN' },
  'youtube_video':   { name: 'YouTube Video', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900', icon: 'YT' },
  'youtube_short':   { name: 'YouTube Short', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900', icon: 'YT' },
  'other':           { name: 'Social Post', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800', icon: 'SOC' }
};

const MarketingDashboard = () => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'leads' | 'calendar' | 'projects'
  
  // Data states
  const [clientLeads, setClientLeads] = useState([]);
  const [leadStats, setLeadStats] = useState(null);
  const [calendarWorks, setCalendarWorks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // UI filter states
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [calendarFilter, setCalendarFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) { console.error(e); }
  }, []);

  const hasAccess = useMemo(() => {
    if (!user) return false;
    const role = String(user.role_id || user.roleId || user.role || '').toLowerCase().trim();
    const isSuperAdmin = Boolean(
      user.isSuperAdmin === true ||
      user.is_super_admin === true ||
      role === 'superadmin' ||
      role === 'super_admin' ||
      role === 'super admin' ||
      role === '0'
    );
    if (isSuperAdmin) return true;

    if (Array.isArray(user.permissions) && user.permissions.length > 0) {
      const allowedSet = user.permissions.map(p => String(p).toLowerCase().trim());
      return allowedSet.includes('marketing dashboard') || allowedSet.includes('/marketing-dashboard');
    }

    return false;
  }, [user]);

  const getAuthHeaders = useCallback(() => {
    const rawToken = localStorage.getItem('token');
    const cleanToken = rawToken ? rawToken.replace(/"/g, '') : '';
    return {
      'Authorization': cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`,
      'Content-Type': 'application/json'
    };
  }, []);

  // Fetch all consolidated marketing datasets
  const fetchAllData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const headers = getAuthHeaders();

    try {
      const [leadsRes, statsRes, calRes, projRes, clientsRes, tasksRes] = await Promise.allSettled([
        fetch(`${API_BASE}/client-leads?limit=100`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/client-leads/stats`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/calendar-work?limit=100`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/projects?limit=50`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/clients?limit=50`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/tasks/all?limit=50`, { headers }).then(r => r.ok ? r.json() : null)
      ]);

      // Client Leads
      if (leadsRes.status === 'fulfilled' && leadsRes.value) {
        const val = leadsRes.value;
        const list = Array.isArray(val.data) ? val.data : (Array.isArray(val) ? val : []);
        setClientLeads(list);
      }

      // Client Lead Stats
      if (statsRes.status === 'fulfilled' && statsRes.value?.success && statsRes.value.data) {
        setLeadStats(statsRes.value.data);
      }

      // Content Calendar
      if (calRes.status === 'fulfilled' && calRes.value) {
        const val = calRes.value;
        const list = val.data?.data || val.data || (Array.isArray(val) ? val : []);
        setCalendarWorks(Array.isArray(list) ? list : []);
      }

      // Projects
      if (projRes.status === 'fulfilled' && projRes.value) {
        const val = projRes.value;
        const list = val.data || (Array.isArray(val) ? val : []);
        setProjects(Array.isArray(list) ? list : []);
      }

      // Clients
      if (clientsRes.status === 'fulfilled' && clientsRes.value) {
        const val = clientsRes.value;
        const list = val.data?.clients || val.data || (Array.isArray(val) ? val : []);
        setClients(Array.isArray(list) ? list : []);
      }

      // Tasks
      if (tasksRes.status === 'fulfilled' && tasksRes.value) {
        const val = tasksRes.value;
        const list = val.data?.tasks || val.data || val.tasks || (Array.isArray(val) ? val : []);
        setTasks(Array.isArray(list) ? list : []);
      }

      if (silent) showToast('Marketing Dashboard refreshed with live data!', 'success');
    } catch (e) {
      console.error('Error consolidating marketing data:', e);
      showToast('Could not refresh all marketing datasets.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAuthHeaders, showToast]);

  useEffect(() => {
    if (hasAccess) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [hasAccess, fetchAllData]);

  /* ─── Computed Analytics from real permissions ─── */
  const analytics = useMemo(() => {
    const totalLeads = clientLeads.length;
    const newLeads = clientLeads.filter(l => (l.status || '').toLowerCase() === 'new').length;
    const convertedLeads = clientLeads.filter(l => (l.status || '').toLowerCase() === 'converted').length;
    const followUpLeads = clientLeads.filter(l => (l.status || '').toLowerCase() === 'follow up').length;
    const meetingsFixed = clientLeads.filter(l => String(l.clientMeetingFixed).toLowerCase() === 'yes').length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    // Status breakdown
    const leadStatusMap = {};
    ['New', 'Contacted', 'Follow Up', 'Interested', 'Converted', 'Lost'].forEach(st => {
      leadStatusMap[st] = clientLeads.filter(l => (l.status || '').toLowerCase() === st.toLowerCase()).length;
    });

    // Content calendar stats
    const totalContent = calendarWorks.length;
    const scheduledContent = calendarWorks.filter(c => c.postingStatus === 'scheduled' || c.postingStatus === 'completed').length;
    const draftContent = calendarWorks.filter(c => c.workStatus === 'draft').length;
    const completedContent = calendarWorks.filter(c => c.workStatus === 'completed').length;

    // Content types
    const contentTypesMap = {};
    calendarWorks.forEach(c => {
      const type = c.contentType || 'other';
      contentTypesMap[type] = (contentTypesMap[type] || 0) + 1;
    });

    // Projects stats
    const totalProjects = projects.length;
    const avgProgress = totalProjects > 0
      ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / totalProjects)
      : 0;

    // Clients stats
    const totalClients = clients.length;

    // Marketer Tasks stats
    const userId = user?.id || user?._id;
    const myTasks = tasks.filter(t => {
      if (!userId) return true;
      const assigned = t.assigned_to || t.assignedTo || [];
      if (Array.isArray(assigned)) {
        return assigned.some(u => String(u._id || u.id || u) === String(userId));
      }
      return String(assigned._id || assigned.id || assigned) === String(userId);
    });
    const completedTasks = myTasks.filter(t => ['done', 'completed'].includes(String(t.status || '').toLowerCase())).length;

    return {
      totalLeads,
      newLeads,
      convertedLeads,
      followUpLeads,
      meetingsFixed,
      conversionRate,
      leadStatusMap,
      totalContent,
      scheduledContent,
      draftContent,
      completedContent,
      contentTypesMap,
      totalProjects,
      avgProgress,
      totalClients,
      myTasksCount: myTasks.length || tasks.length,
      completedTasksCount: completedTasks
    };
  }, [clientLeads, calendarWorks, projects, clients, tasks, user]);

  // Filtered Leads
  const filteredClientLeads = useMemo(() => {
    return clientLeads.filter(l => {
      const matchesSearch = !leadSearch || 
        (l.leadName || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
        (l.email || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
        (l.phone || '').includes(leadSearch) ||
        (l.companyName || '').toLowerCase().includes(leadSearch.toLowerCase());
      
      const matchesStatus = leadStatusFilter === 'all' || 
        (l.status || '').toLowerCase() === leadStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [clientLeads, leadSearch, leadStatusFilter]);

  // Filtered Content
  const filteredCalendarWorks = useMemo(() => {
    return calendarWorks.filter(c => {
      if (calendarFilter === 'all') return true;
      return (c.contentType || '').toLowerCase().includes(calendarFilter.toLowerCase());
    });
  }, [calendarWorks, calendarFilter]);

  /* ─── Access Restricted ─── */
  if (!hasAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center">
          <div className="mx-auto w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
            <ShieldAlert size={36} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">
            Access <span className="text-rose-500">Restricted</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Marketing Dashboard is only accessible to users with explicit permission. Please contact your Super Administrator to request access.
          </p>
          <button onClick={() => window.location.href = '/dashboard'}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer">
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Loading Consolidated Marketing Command Center...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-slate-50/60 dark:bg-slate-950/30 text-slate-800 dark:text-slate-100">
      <div className="max-w-[1680px] mx-auto space-y-6">

        {/* ─── Top Header & Controls ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white rounded-2xl shadow-lg shadow-indigo-500/25">
              <Megaphone size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-indigo-500/20">
                  Unified Marketing OS
                </span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide">
                  Live Operations
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Marketing Command Center
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Consolidated lead acquisition, content calendar, client projects & shift reporting.
              </p>
            </div>
          </div>

          {/* Quick Actions & Refresh */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => fetchAllData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>

            <a
              href="/client-leads"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all"
            >
              <Plus size={14} />
              Add Lead
            </a>

            <a
              href="/calendar-work"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-bold text-xs rounded-xl border border-purple-200 dark:border-purple-800 transition-all"
            >
              <Calendar size={14} />
              Calendar
            </a>

            <a
              href="/marketing-report"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all"
            >
              <FileText size={14} />
              Shift Report
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        {/* ─── Executive KPI Cards (Based on Granted Permissions) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <KpiCard
            icon={<Target size={20} />}
            label="Client Inquiries"
            value={analytics.totalLeads}
            sub={`${analytics.newLeads} new leads`}
            color="indigo"
            link="/client-leads"
          />
          <KpiCard
            icon={<Calendar size={20} />}
            label="Campaign Posts"
            value={analytics.totalContent}
            sub={`${analytics.completedContent} completed`}
            color="violet"
            link="/calendar-work"
          />
          <KpiCard
            icon={<FolderKanban size={20} />}
            label="Active Projects"
            value={analytics.totalProjects}
            sub={`${analytics.avgProgress}% avg progress`}
            color="cyan"
            link="/projects"
          />
          <KpiCard
            icon={<Building2 size={20} />}
            label="Client Brands"
            value={analytics.totalClients}
            sub="Active corporate accounts"
            color="amber"
            link="/clients"
          />
          <KpiCard
            icon={<CheckSquare size={20} />}
            label="Deliverables"
            value={analytics.myTasksCount}
            sub={`${analytics.completedTasksCount} tasks done`}
            color="emerald"
            link="/todo"
          />
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Command Center', icon: BarChart3 },
            { id: 'leads', label: `Client Leads (${analytics.totalLeads})`, icon: Target },
            { id: 'calendar', label: `Content Schedule (${analytics.totalContent})`, icon: Calendar },
            { id: 'projects', label: `Projects & Clients (${analytics.totalProjects})`, icon: Briefcase },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: OVERVIEW / COMMAND CENTER ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* 1. Lead Generation Pipeline (2 cols) */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                      Client Lead Acquisition Pipeline
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Conversion funnel from marketing campaigns to onboarded clients.
                    </p>
                  </div>
                  <a
                    href="/client-leads"
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    View Leads <ChevronRight size={14} />
                  </a>
                </div>

                <div className="space-y-3.5">
                  {Object.entries(analytics.leadStatusMap).map(([status, count], idx) => {
                    const pct = analytics.totalLeads > 0 ? Math.round((count / analytics.totalLeads) * 100) : 0;
                    const colors = STATUS_COLORS[status] || { bar: 'from-slate-500 to-gray-400', dot: 'bg-slate-500' };
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-xs mb-1 px-1">
                          <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            {status}
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-white">
                            {count} <span className="text-slate-400 font-normal">({pct}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-6 rounded-xl overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.05 }}
                            className={`h-full bg-gradient-to-r ${colors.bar} rounded-xl flex items-center pl-3`}
                          >
                            {count > 0 && (
                              <span className="text-[9px] font-black text-white uppercase tracking-wider">
                                {count}
                              </span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-Funnel Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meetings Booked</span>
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                      {analytics.meetingsFixed}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Converted Deals</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                      {analytics.convertedLeads}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
                    <span className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1 block">
                      {analytics.conversionRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Content & Social Media Mix (1 col) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-purple-500 rounded-full" />
                      Content Platforms
                    </h3>
                    <a
                      href="/calendar-work"
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
                    >
                      Calendar <ChevronRight size={14} />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Active social media channels and upcoming scheduled posts.
                  </p>

                  <div className="space-y-3">
                    {Object.entries(analytics.contentTypesMap).map(([type, count]) => {
                      const meta = PLATFORM_COLORS[type] || PLATFORM_COLORS['other'];
                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-[10px]">
                              {meta.icon}
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                              {meta.name}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600">
                            {count} posts
                          </span>
                        </div>
                      );
                    })}

                    {Object.keys(analytics.contentTypesMap).length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs italic">
                        No calendar posts created yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href="/calendar-work"
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Plus size={14} />
                    Plan New Content Post
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Recent Marketing Leads & Deliverables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Inquiries */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
                    Latest Client Leads
                  </h3>
                  <a href="/client-leads" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    All Leads <ChevronRight size={14} />
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        <th className="pb-2.5">Lead Name</th>
                        <th className="pb-2.5">Contact</th>
                        <th className="pb-2.5">Source</th>
                        <th className="pb-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                      {clientLeads.slice(0, 5).map(lead => {
                        const sColor = STATUS_COLORS[lead.status] || STATUS_COLORS['New'];
                        return (
                          <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                            <td className="py-3 font-bold text-slate-800 dark:text-white">
                              {lead.leadName || 'Unnamed Lead'}
                            </td>
                            <td className="py-3 text-slate-500 text-[11px]">
                              {lead.phone || lead.email || '—'}
                            </td>
                            <td className="py-3 text-[10px] font-bold uppercase text-slate-400">
                              {lead.source || 'Marketing'}
                            </td>
                            <td className="py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${sColor.badge}`}>
                                {lead.status || 'New'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {clientLeads.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                            No client leads recorded. Click "Add Lead" to record inquiries.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming Scheduled Posts */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-pink-500 rounded-full" />
                    Content Calendar Schedule
                  </h3>
                  <a href="/calendar-work" className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1">
                    Full Calendar <ChevronRight size={14} />
                  </a>
                </div>

                <div className="space-y-3">
                  {calendarWorks.slice(0, 4).map(work => {
                    const pMeta = PLATFORM_COLORS[work.contentType] || PLATFORM_COLORS['other'];
                    const dateFormatted = work.postingDate
                      ? new Date(work.postingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                      : 'Unscheduled';
                    return (
                      <div
                        key={work._id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-xl text-[10px] font-black border ${pMeta.bg}`}>
                            {pMeta.icon}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
                              {work.title || 'Social Post'}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Status: <span className="capitalize">{work.workStatus || 'draft'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                            {dateFormatted}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400 uppercase">
                            {work.postingStatus || 'pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {calendarWorks.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                      No campaign posts scheduled. Click "Calendar" to add schedule.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB 2: CLIENT LEADS CRM ─── */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Client Leads & Inquiries CRM
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search and manage inbound marketing inquiries and potential clients.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search lead or phone..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      className="pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none w-56"
                    />
                  </div>

                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow up">Follow Up</option>
                    <option value="interested">Interested</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>

                  <a
                    href="/client-leads"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Lead
                  </a>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      <th className="pb-3">Lead Name</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Source</th>
                      <th className="pb-3">Meeting Status</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {filteredClientLeads.map(lead => {
                      const sColor = STATUS_COLORS[lead.status] || STATUS_COLORS['New'];
                      return (
                        <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                          <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                            {lead.leadName || 'Unnamed'}
                          </td>
                          <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">
                            {lead.phone || '—'}
                          </td>
                          <td className="py-3.5 text-slate-500">
                            {lead.email || '—'}
                          </td>
                          <td className="py-3.5">
                            <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {lead.source || 'MARKETING'}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              String(lead.clientMeetingFixed).toLowerCase() === 'yes'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                            }`}>
                              Meeting: {lead.clientMeetingFixed || 'Pending'}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${sColor.badge}`}>
                              {lead.status || 'New'}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <a
                              href="/client-leads"
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Manage
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredClientLeads.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                          No matching client leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: CONTENT & CAMPAIGN CALENDAR ─── */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Social Media & Content Calendar
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Plan, review, and track digital creative assets and social publishing schedules.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={calendarFilter}
                    onChange={(e) => setCalendarFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Platforms</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                  </select>

                  <a
                    href="/calendar-work"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Schedule Post
                  </a>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCalendarWorks.map(work => {
                  const pMeta = PLATFORM_COLORS[work.contentType] || PLATFORM_COLORS['other'];
                  const workDate = work.workDate ? new Date(work.workDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—';
                  const postDate = work.postingDate ? new Date(work.postingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—';

                  return (
                    <div
                      key={work._id}
                      className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border ${pMeta.bg}`}>
                            {pMeta.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {work.workStatus || 'draft'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {work.title || 'Untitled Post'}
                        </h4>
                        {work.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {work.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Posting Date</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{postDate}</span>
                        </div>
                        <a
                          href="/calendar-work"
                          className="font-bold text-purple-600 dark:text-purple-400 text-xs hover:underline flex items-center gap-1"
                        >
                          Details <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  );
                })}

                {filteredCalendarWorks.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-400 text-xs italic">
                    No content calendar posts found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: PROJECTS & CLIENT ACCOUNTS ─── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Projects List */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Marketing Projects & Campaigns
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Client deliverables and marketing campaign initiatives.
                    </p>
                  </div>
                  <a href="/projects" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                  </a>
                </div>

                <div className="space-y-3.5">
                  {projects.map(proj => {
                    const prog = Math.min(Math.max(Number(proj.progress) || 0, 0), 100);
                    return (
                      <div
                        key={proj._id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {proj.projectName}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            {proj.status || 'Active'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{prog}%</span>
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {projects.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs italic">
                      No active marketing projects found.
                    </div>
                  )}
                </div>
              </div>

              {/* Clients Directory */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Client Brand Accounts
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Client company accounts associated with marketing efforts.
                    </p>
                  </div>
                  <a href="/clients" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    View All
                  </a>
                </div>

                <div className="space-y-3">
                  {clients.map(client => (
                    <div
                      key={client._id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center">
                          {(client.companyName || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {client.companyName}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {client.clientName} • {client.industry || 'Business'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                          {client.phone || client.email || '—'}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                          {client.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {clients.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs italic">
                      No client accounts added yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}


      </div>
    </div>
  );
};

/* ─── Reusable Metric Card ─── */
const KpiCard = ({ icon, label, value, sub, color, link }) => {
  const colorMap = {
    indigo:  'from-indigo-500/15 to-indigo-500/5 border-indigo-500/20 text-indigo-500',
    violet:  'from-purple-500/15 to-purple-500/5 border-purple-500/20 text-purple-500',
    cyan:    'from-cyan-500/15 to-cyan-500/5 border-cyan-500/20 text-cyan-500',
    amber:   'from-amber-500/15 to-amber-500/5 border-amber-500/20 text-amber-500',
    emerald: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20 text-emerald-500',
  };
  const scheme = colorMap[color] || colorMap.indigo;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${scheme} border rounded-2xl p-4 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="opacity-80">{icon}</span>
        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">
        {value}
      </div>
      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5">
        {label}
      </div>
      {sub && (
        <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 mt-1 truncate">
          {sub}
        </div>
      )}
    </motion.div>
  );

  return link ? <a href={link}>{content}</a> : content;
};

export default MarketingDashboard;
