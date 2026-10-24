/**
 * Centralized list of actual Sidebar Menu Items configured across DIGI 360 ERP.
 * Strictly reflects only the active menu items and categories present in Sidebar.jsx.
 */

export const SIDEBAR_CATEGORIES = [
  'Overview',
  'Dashboards',
  'People & HR',
  'Sales & CRM',
  'Marketing & Work',
  'Finance & Payroll',
  'Reports',
  'Daily Operations'
];

export const ALL_SIDEBAR_ITEMS = [
  // --- OVERVIEW ---
  { label: 'Approvals', path: '/approvals', category: 'Overview', desc: 'MD Executive approvals for leaves & salary payments' },
  { label: 'Leave Requests', path: '/leaves', category: 'Overview', desc: 'Leave request application, logs & approvals' },
  { label: 'Notifications', path: '/notifications', category: 'Overview', desc: 'System alerts, reminders & updates' },

  // --- DASHBOARDS ---
  { label: 'Dashboard', path: '/dashboard', category: 'Dashboards', desc: 'Main CRM overview & administrative key metrics' },
  { label: 'HR Dashboard', path: '/hr-dashboard', category: 'Dashboards', desc: 'HR overview dashboard & attendance stats' },
  { label: 'Marketing Dashboard', path: '/marketing-dashboard', category: 'Dashboards', desc: 'Marketing campaigns & lead generation metrics' },

  // --- PEOPLE & HR ---
  { label: 'Staff Attendance', path: '/staff-attendance', category: 'People & HR', desc: 'Daily staff attendance roster, check-in logs & workforce hours' },
  { label: 'Recruitment', path: '/recruitment', category: 'People & HR', desc: 'Candidate pipeline, interviews & offer letters' },
  { label: 'Users', path: '/users', category: 'People & HR', desc: 'Employee directory & account management' },
  { label: 'Departments', path: '/departments', category: 'People & HR', desc: 'Department hierarchy & manager assignments' },
  { label: 'Sidebar Permissions', path: '/sidebar-permissions', category: 'People & HR', desc: 'Custom user menu permission configuration' },
  { label: 'Employee Training', path: '/hr/training', category: 'People & HR', desc: 'Internal employee training modules & courses' },

  // --- SALES & CRM ---
  { label: 'Client Leads', path: '/client-leads', category: 'Sales & CRM', desc: 'Client sales lead pipeline & inquiries' },
  { label: 'Clients', path: '/clients', category: 'Sales & CRM', desc: 'Client company profiles & contact directory' },

  // --- MARKETING & WORK ---
  { label: 'Content Calendar', path: '/calendar-work', category: 'Marketing & Work', desc: 'Social media & marketing content scheduling calendar' },
  { label: 'Projects', path: '/projects', category: 'Marketing & Work', desc: 'Project tracking, tasks & milestones' },

  // --- FINANCE & PAYROLL ---
  { label: 'Accounts', path: '/accounts', category: 'Finance & Payroll', desc: 'General accounts, cash book & finance overview' },
  { label: 'Capital', path: '/accounts/capital', category: 'Finance & Payroll', desc: 'Capital investment & equity records' },
  { label: 'Sales', path: '/accounts/sales', category: 'Finance & Payroll', desc: 'Sales deals, billing & revenue records' },
  { label: 'Income', path: '/accounts/income', category: 'Finance & Payroll', desc: 'Business income & receipt entries' },
  { label: 'Purchase', path: '/accounts/purchase', category: 'Finance & Payroll', desc: 'Vendor procurement, purchase orders & stock bills' },
  { label: 'Expense Categories', path: '/accounts/categories', category: 'Finance & Payroll', desc: 'Expense categorization & budget heads' },
  { label: 'Expense', path: '/accounts/expenses', category: 'Finance & Payroll', desc: 'Record & upload expense vouchers' },
  { label: 'Salary Payment', path: '/accounts/salary', category: 'Finance & Payroll', desc: 'Salary payment processing & disbursals' },
  { label: 'Cash & Bank', path: '/accounts/cash-book', category: 'Finance & Payroll', desc: 'Cash & bank ledger & transaction history' },
  { label: 'Operation', path: '/accounts/operation', category: 'Finance & Payroll', desc: 'Operations cash ledger & cash handouts' },
  { label: 'Profit and Loss', path: '/accounts/reports', category: 'Finance & Payroll', desc: 'Profit & loss and financial summaries' },
  { label: 'Payslips', path: '/payslips', category: 'Finance & Payroll', desc: 'Employee payslip generation & disbursal records' },
  { label: 'Personal Payslip', path: '/my-payslip', category: 'Finance & Payroll', desc: 'Personal salary slip portal for employees' },

  // --- REPORTS ---
  { label: 'AI Reports', path: '/ai-report', category: 'Reports', desc: 'Automated AI reports & business summaries' },
  { label: 'Performance Dashboard', path: '/performance-dashboard', category: 'Reports', desc: 'Employee KPI performance analytics' },
  { label: 'Marketing Report', path: '/marketing-report', category: 'Reports', desc: 'Marketing shift & campaign report logs' },
  { label: 'Daily Shift Report', path: '/daily-shift-report', category: 'Reports', desc: 'Official DIGI 360 daily shift report & operational log' },

  // --- DAILY OPERATIONS ---
  { label: 'Daily Operations OS', path: '/daily-operations', category: 'Daily Operations', desc: 'Management daily operations workflow & routines' },
  { label: 'TL Daily Operations', path: '/tl-daily-operations', category: 'Daily Operations', desc: 'Team Lead department routine checklist & EOD closures' },
  { label: 'Attendance', path: '/attendance', category: 'Daily Operations', desc: 'Personal daily attendance clock-in/out logs' },
  { label: 'Task Assign', path: '/todo', category: 'Daily Operations', desc: 'Task assignment & to-do list tracker' },
  { label: 'Employee Task Payments', path: '/employee-task-payments', category: 'Daily Operations', desc: 'Employee task compensation & payout summary' },
];
