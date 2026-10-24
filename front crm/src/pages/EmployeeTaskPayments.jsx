// ==========================================
// FRONTEND: EmployeeTaskPayments.jsx
// DIGI 360 - Employee Task Payments Summary
// ==========================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  Users,
  Search,
  RefreshCw,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Briefcase,
  ChevronRight,
  Eye,
  X,
  Building2,
  BadgeIndianRupee,
  Layers,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

const getAuthHeaders = () => {
  const raw = localStorage.getItem('token') || '';
  const token = raw.replace(/^"(.*)"$/, '$1').replace(/"/g, '').replace(/^Bearer\s+/i, '').trim();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatINR = (val) => {
  const num = Number(val) || 0;
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
};

export default function EmployeeTaskPayments() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ summary: {}, employees: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('paymentDesc');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const storedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch (e) { return null; }
  }, []);

  const isPrivileged = useMemo(() => {
    if (!storedUser) return false;
    const role = String(storedUser.role || '').toLowerCase().trim();
    const roleId = String(storedUser.role_id || storedUser.roleId || '').trim();
    const designation = String(storedUser.designation || '').toLowerCase().trim();

    if (storedUser.isSuperAdmin === true || storedUser.is_super_admin === true || role === 'superadmin' || roleId === '0') {
      return true;
    }
    const privilegedRoles = ['admin', 'hr', 'md', 'manager', 'lead', 'team_lead', 'teamlead', 'tl', 'supervisor', 'hod', 'director', 'coo', 'ceo', '1', '2'];
    const hasPrivilegedRole = privilegedRoles.some(r => role.includes(r) || roleId === r);
    const hasPrivilegedDesignation = ['lead', 'manager', 'head', 'hod', 'director', 'supervisor', 'hr', 'md', 'admin', 'coordinator'].some(d => designation.includes(d));

    return hasPrivilegedRole || hasPrivilegedDesignation;
  }, [storedUser]);

  const fetchPayments = useCallback(async () => {
    if (!isPrivileged) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const url = `${API_BASE}/v1/tasks/employee-payments`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) {
        // Fallback to /api/tasks/employee-payments
        const fallbackRes = await fetch(`${API_BASE}/tasks/employee-payments`, { headers: getAuthHeaders() });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success) {
          setData(fallbackData.data || { summary: {}, employees: [] });
          return;
        }
        throw new Error(fallbackData.message || 'Failed to load employee task payments');
      }
      const json = await res.json();
      if (json.success) {
        setData(json.data || { summary: {}, employees: [] });
      } else {
        showToast(json.message || 'Failed to load data', 'error');
      }
    } catch (err) {
      console.error('Fetch employee task payments error:', err);
      showToast('Error loading employee task payments', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set();
    data.employees.forEach((item) => {
      if (item.employee?.department) set.add(item.employee.department);
    });
    return Array.from(set);
  }, [data.employees]);

  // Filter & sort employees
  const filteredEmployees = useMemo(() => {
    let list = [...data.employees];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const emp = item.employee || {};
        return (
          emp.name?.toLowerCase().includes(q) ||
          emp.email?.toLowerCase().includes(q) ||
          emp.employeeId?.toLowerCase().includes(q) ||
          emp.designation?.toLowerCase().includes(q)
        );
      });
    }

    if (selectedDepartment !== 'all') {
      list = list.filter((item) => item.employee?.department === selectedDepartment);
    }

    if (selectedStatus === 'completed') {
      list = list.filter((item) => item.completedTasks > 0);
    } else if (selectedStatus === 'pending') {
      list = list.filter((item) => item.pendingTasks > 0);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'paymentDesc') return (b.totalPayment || 0) - (a.totalPayment || 0);
      if (sortBy === 'paymentAsc') return (a.totalPayment || 0) - (b.totalPayment || 0);
      if (sortBy === 'tasksDesc') return (b.totalTasks || 0) - (a.totalTasks || 0);
      if (sortBy === 'completedDesc') return (b.completedTasks || 0) - (a.completedTasks || 0);
      if (sortBy === 'nameAsc') return (a.employee?.name || '').localeCompare(b.employee?.name || '');
      return 0;
    });

    return list;
  }, [data.employees, searchQuery, selectedDepartment, selectedStatus, sortBy]);

  // Export to Excel
  const handleExportExcel = () => {
    if (!filteredEmployees.length) {
      showToast('No data available to export', 'info');
      return;
    }

    const rows = filteredEmployees.map((item, index) => {
      const emp = item.employee || {};
      return {
        '#': index + 1,
        'Employee ID': emp.employeeId || 'N/A',
        'Employee Name': emp.name || 'Unnamed',
        'Email': emp.email || '',
        'Department': emp.department || 'General',
        'Designation': emp.designation || 'Staff',
        'Total Assigned Tasks': item.totalTasks || 0,
        'Completed Tasks': item.completedTasks || 0,
        'Pending Tasks': item.pendingTasks || 0,
        'Completed Payout (INR)': item.completedPayment || 0,
        'Pending Payout (INR)': item.pendingPayment || 0,
        'Total Task Payout (INR)': item.totalPayment || 0,
        'Paid Payout (INR)': item.paidPayment || 0,
        'Unpaid Payout (INR)': item.unpaidPayment || 0
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Task Payments');
    XLSX.writeFile(workbook, `Employee_Task_Payments_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Exported to Excel successfully!', 'success');
  };

  const summary = data.summary || {};

  if (!isPrivileged) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Access Restricted</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Task payments and employee payout rosters are strictly restricted to managers and administrators.
        </p>
        <button
          onClick={() => navigate('/todo')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          Back to Task Assign
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <BadgeIndianRupee className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Employee Task Payments
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aggregate overview of task compensation, payout breakdown, and completion earnings per employee.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition shadow-2xs cursor-pointer disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Allocated */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Total Task Payouts
            </span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatINR(summary.totalAllocatedPayment)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {summary.totalTasks || 0} assigned tasks
          </p>
        </div>

        {/* Card 2: Completed Tasks Payment */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              Realized / Completed
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatINR(summary.totalCompletedPayment)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {summary.totalCompletedTasks || 0} tasks finished
          </p>
        </div>

        {/* Card 3: Pending Tasks Payment */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-amber-500 tracking-wider">
              Pending / In Progress
            </span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {formatINR(summary.totalPendingPayment)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {summary.totalPendingTasks || 0} active / pending tasks
          </p>
        </div>

        {/* Card 4: Staff in Payout Roster */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              Assigned Staff
            </span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {summary.totalEmployees || 0}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Employees with assigned task rewards
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Task Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="all">All Task Statuses</option>
              <option value="completed">Has Completed Tasks</option>
              <option value="pending">Has Pending Tasks</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="paymentDesc">Sort: Highest Payout (₹)</option>
              <option value="paymentAsc">Sort: Lowest Payout (₹)</option>
              <option value="tasksDesc">Sort: Most Tasks</option>
              <option value="completedDesc">Sort: Most Completed</option>
              <option value="nameAsc">Sort: Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* EMPLOYEES PAYOUT TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4 text-center">Tasks Progress</th>
                <th className="py-3.5 px-4 text-right">Completed (₹)</th>
                <th className="py-3.5 px-4 text-right">Pending (₹)</th>
                <th className="py-3.5 px-4 text-right">Total Payment (₹)</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    Loading employee payments summary...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No employees matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((item) => {
                  const emp = item.employee || {};
                  const total = item.totalTasks || 0;
                  const completed = item.completedTasks || 0;
                  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors"
                    >
                      {/* Employee Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-600 dark:text-slate-300 text-xs overflow-hidden shrink-0">
                            {emp.avatar || emp.profile_image ? (
                              <img
                                src={emp.avatar || emp.profile_image}
                                alt={emp.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (emp.name || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {emp.name || 'Unnamed Employee'}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{emp.employeeId || 'ID: ---'}</span>
                              <span>•</span>
                              <span className="truncate max-w-[140px]">{emp.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Designation */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/60">
                            {emp.department || 'General'}
                          </span>
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                            {emp.designation || 'Staff'}
                          </span>
                        </div>
                      </td>

                      {/* Tasks Progress */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-block text-left w-36">
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            <span>
                              {completed} of {total} done
                            </span>
                            <span className="text-emerald-500">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Completed Payout */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatINR(item.completedPayment)}
                        </span>
                      </td>

                      {/* Pending Payout */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-amber-500">
                          {formatINR(item.pendingPayment)}
                        </span>
                      </td>

                      {/* Total Task Payment */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black text-xs">
                          {formatINR(item.totalPayment)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedEmployee(item);
                            setIsDetailOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-emerald-500 text-xs font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Tasks ({total})</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TASK BREAKDOWN MODAL */}
      <AnimatePresence>
        {isDetailOpen && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-lg overflow-hidden shrink-0">
                    {selectedEmployee.employee?.avatar || selectedEmployee.employee?.profile_image ? (
                      <img
                        src={selectedEmployee.employee.avatar || selectedEmployee.employee.profile_image}
                        alt={selectedEmployee.employee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (selectedEmployee.employee?.name || 'U').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedEmployee.employee?.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedEmployee.employee?.designation} • {selectedEmployee.employee?.department}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Employee Summary Mini Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Tasks</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedEmployee.totalTasks}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Completed Payout</span>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatINR(selectedEmployee.completedPayment)}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Total Payout</span>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {formatINR(selectedEmployee.totalPayment)}
                  </p>
                </div>
              </div>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Assigned Task Breakdown ({selectedEmployee.tasks?.length || 0})
                </h4>

                {selectedEmployee.tasks?.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No tasks assigned.</p>
                ) : (
                  selectedEmployee.tasks.map((task) => {
                    const isDone = ['completed', 'done'].includes(task.status);
                    return (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-emerald-500/40 transition"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                isDone
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                              }`}
                            >
                              {task.status}
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              Priority: {task.priority || 'medium'}
                            </span>
                          </div>
                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {task.title}
                          </p>
                        </div>

                        {/* Task Payment Amount */}
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                            {formatINR(task.payment)}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                            Status: {task.paymentStatus || 'unpaid'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    navigate('/todo');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Go to Task Assign (Todo)</span>
                </button>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
