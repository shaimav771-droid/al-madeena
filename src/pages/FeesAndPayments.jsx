import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  WalletCards,
  Plus,
  Search,
  IndianRupee,
  Receipt,
  CheckCircle2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Bike,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Landmark,
  Coins,
  Scale,
  Calendar,
  Filter,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
  User,
  PieChart,
  ListFilter,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddPaymentModal from '../components/modals/AddPaymentModal';
import RecordEntryModal from '../components/modals/RecordEntryModal';
import CustomSelect from '../components/common/CustomSelect';
import { PREDEFINED_EXPENSE_HEADS } from '../data/initialData';

export default function FeesAndPayments() {
  const {
    students,
    payments,
    transactions,
    customExpenseHeads,
    deleteTransaction,
    financials,
    stats,
    settings,
    getStudentFinancials,
    isRecordEntryOpen,
    setIsRecordEntryOpen,
    recordEntryType,
    setRecordEntryType,
    recordEntryStudentId,
    setRecordEntryStudentId,
    openRecordEntryModal,
    closeRecordEntryModal,
    isAddPaymentOpen,
    setIsAddPaymentOpen,
    selectedStudentForPay,
    setSelectedStudentForPay,
    defaultPaymentCategory,
    setDefaultPaymentCategory,
    openAddPaymentModal,
    closeAddPaymentModal,
    feesActiveTab,
    setFeesActiveTab
  } = useApp();

  const [receiptToPrint, setReceiptToPrint] = useState(null);

  // Main 3 Module Tabs: 'student_fees' | 'school_ledger' | 'personal_account'
  const activeMainTab = feesActiveTab;
  const setActiveMainTab = setFeesActiveTab;

  // Sub-views inside tabs
  const [studentSubView, setStudentSubView] = useState('balances'); // 'balances' | 'receipts'
  const [schoolSubView, setSchoolSubView] = useState('table'); // 'table' | 'breakdown'

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [receiptCategoryFilter, setReceiptCategoryFilter] = useState('All');
  const [schoolTypeFilter, setSchoolTypeFilter] = useState('All');
  const [schoolModeFilter, setSchoolModeFilter] = useState('All');
  const [schoolHeadFilter, setSchoolHeadFilter] = useState('All');
  const [schoolDateFilter, setSchoolDateFilter] = useState('All');
  const [personalTypeFilter, setPersonalTypeFilter] = useState('All');
  const [personalModeFilter, setPersonalModeFilter] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset page when switching tabs or filters
  const handleTabSwitch = (tab) => {
    setActiveMainTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
  };

  // Combine predefined heads and any custom heads
  const allExpenseHeads = useMemo(() => {
    return [...PREDEFINED_EXPENSE_HEADS, ...(customExpenseHeads || [])];
  }, [customExpenseHeads]);

  const todayStr = new Date().toISOString().split('T')[0];

  // ==========================================
  // TAB 1: STUDENT FEES DATA FILTERING
  // ==========================================
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.phone1 && s.phone1.includes(q));

      const fin = getStudentFinancials(s.id) || {
        totalPayable: s.courseFees || 0,
        totalPaid: s.paidAmount || 0,
        pendingBalance: s.pendingBalance || 0,
        additionalBikeClassesCount: 0
      };

      const paymentStatus =
        fin.pendingBalance === 0
          ? 'Paid'
          : fin.totalPaid > 0
          ? 'Partial'
          : 'Unpaid';

      let matchesStatus = statusFilter === 'All' || paymentStatus === statusFilter;
      if (statusFilter === 'BikeDues') {
        matchesStatus = fin.pendingBike > 0;
      }

      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter, getStudentFinancials]);

  const totalPagesStudents = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Student Receipts / Payment History
  const filteredReceipts = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const rName = (p.realName || p.studentName || '').toLowerCase();
      const bName = (p.bankingName || '').toLowerCase();
      const idMatch = (p.id || '').toLowerCase().includes(q);
      const refMatch = (p.referenceNo || '').toLowerCase().includes(q);
      const modeMatch = (p.paymentMethod || p.paymentMode || '').toLowerCase().includes(q);

      const matchesSearch = !q || rName.includes(q) || bName.includes(q) || idMatch || refMatch || modeMatch;

      const matchesCategory =
        receiptCategoryFilter === 'All' ||
        (receiptCategoryFilter === 'Bike'
          ? p.paymentCategory === 'Additional Bike Class Fees'
          : receiptCategoryFilter === 'Regular'
          ? !p.paymentCategory || p.paymentCategory === 'Regular Course Fees'
          : p.paymentCategory === receiptCategoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [payments, searchQuery, receiptCategoryFilter]);

  const totalPagesReceipts = Math.ceil(filteredReceipts.length / pageSize) || 1;
  const paginatedReceipts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReceipts.slice(start, start + pageSize);
  }, [filteredReceipts, currentPage, pageSize]);

  // ==========================================
  // TAB 2: SCHOOL CASH & BANK LEDGER FILTERING
  // ==========================================
  const schoolTransactions = useMemo(() => {
    return transactions.filter((t) => !t.type.startsWith('Personal'));
  }, [transactions]);

  const filteredSchoolLedger = useMemo(() => {
    return schoolTransactions.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const rName = (t.realName || '').toLowerCase();
      const bName = (t.bankingName || '').toLowerCase();
      const refMatch = (t.referenceNo || '').toLowerCase().includes(q);
      const headMatch = (t.expenseHead || '').toLowerCase().includes(q);
      const notesMatch = (t.notes || '').toLowerCase().includes(q);
      const idMatch = (t.id || '').toLowerCase().includes(q);

      const matchesSearch =
        !q || rName.includes(q) || bName.includes(q) || refMatch || headMatch || notesMatch || idMatch;

      const matchesType = schoolTypeFilter === 'All' || t.type === schoolTypeFilter;
      const matchesMode = schoolModeFilter === 'All' || t.paymentMode === schoolModeFilter;
      const matchesHead = schoolHeadFilter === 'All' || t.expenseHead === schoolHeadFilter;

      let matchesDate = true;
      if (schoolDateFilter === 'Today') {
        matchesDate = t.date === todayStr;
      } else if (schoolDateFilter === 'ThisMonth') {
        matchesDate = t.date && t.date.startsWith(todayStr.slice(0, 7));
      }

      return matchesSearch && matchesType && matchesMode && matchesHead && matchesDate;
    });
  }, [schoolTransactions, searchQuery, schoolTypeFilter, schoolModeFilter, schoolHeadFilter, schoolDateFilter, todayStr]);

  const totalPagesSchool = Math.ceil(filteredSchoolLedger.length / pageSize) || 1;
  const paginatedSchoolLedger = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSchoolLedger.slice(start, start + pageSize);
  }, [filteredSchoolLedger, currentPage, pageSize]);

  // Expense Head Breakdown aggregation
  const expenseBreakdown = useMemo(() => {
    const schoolExpenses = schoolTransactions.filter((t) => t.type.includes('Expense'));
    const totalExp = schoolExpenses.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0) || 1;

    const map = {};
    allExpenseHeads.forEach((head) => {
      map[head] = { count: 0, total: 0 };
    });

    schoolExpenses.forEach((t) => {
      const h = t.expenseHead || 'Miscellaneous / Other Expense';
      if (!map[h]) map[h] = { count: 0, total: 0 };
      map[h].count += 1;
      map[h].total += parseFloat(t.amount) || 0;
    });

    return Object.keys(map).map((head) => ({
      head,
      count: map[head].count,
      total: map[head].total,
      percentage: Math.round((map[head].total / totalExp) * 100)
    })).sort((a, b) => b.total - a.total);
  }, [schoolTransactions, allExpenseHeads]);

  // ==========================================
  // TAB 3: PERSONAL ACCOUNT DATA FILTERING
  // ==========================================
  const personalTransactions = useMemo(() => {
    return transactions.filter((t) => t.type.startsWith('Personal'));
  }, [transactions]);

  const filteredPersonal = useMemo(() => {
    return personalTransactions.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const rName = (t.realName || '').toLowerCase();
      const bName = (t.bankingName || '').toLowerCase();
      const refMatch = (t.referenceNo || '').toLowerCase().includes(q);
      const notesMatch = (t.notes || '').toLowerCase().includes(q);
      const idMatch = (t.id || '').toLowerCase().includes(q);

      const matchesSearch = !q || rName.includes(q) || bName.includes(q) || refMatch || notesMatch || idMatch;
      const matchesType = personalTypeFilter === 'All' || t.type === personalTypeFilter;
      const matchesMode = personalModeFilter === 'All' || t.paymentMode === personalModeFilter;

      return matchesSearch && matchesType && matchesMode;
    });
  }, [personalTransactions, searchQuery, personalTypeFilter, personalModeFilter]);

  const totalPagesPersonal = Math.ceil(filteredPersonal.length / pageSize) || 1;
  const paginatedPersonal = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPersonal.slice(start, start + pageSize);
  }, [filteredPersonal, currentPage, pageSize]);

  const handleDeleteLedgerItem = (id) => {
    if (window.confirm('Are you sure you want to delete this financial transaction? This action will adjust related balances.')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-5 pb-16 animate-fade-in w-full min-w-0">
      {/* 2. TOP COMPACT SUMMARY CARDS (5 in one clean row) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Cash in Hand */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-dd-card hover:border-[#CBD5E1] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5A627A] uppercase tracking-wider">
                Cash in Hand
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#EEF0F8] flex items-center justify-center text-[#0E113C]">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-[#0E113C] mt-1 font-mono">
              ₹{(financials.cashInHand || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#5A627A] mt-2 font-medium truncate">
            In: ₹{(financials.cashIncome || 0).toLocaleString('en-IN')} | Out: ₹{(financials.cashExpense || 0).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Card 2: Bank Balance */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-dd-card hover:border-[#CBD5E1] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5A627A] uppercase tracking-wider">
                Bank Balance
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-[#0E113C] mt-1 font-mono">
              ₹{(financials.bankBalance || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#5A627A] mt-2 font-medium truncate">
            In: ₹{(financials.bankIncome || 0).toLocaleString('en-IN')} | Out: ₹{(financials.bankExpense || 0).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Card 3: Total Income */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-dd-card hover:border-[#CBD5E1] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5A627A] uppercase tracking-wider">
                Total Income
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 font-mono">
              ₹{(financials.totalIncome || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#5A627A] mt-2 font-medium truncate">
            Cash Income + Bank Income
          </p>
        </div>

        {/* Card 4: Total Expense */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-dd-card hover:border-[#CBD5E1] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5A627A] uppercase tracking-wider">
                Total Expense
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1 font-mono">
              ₹{(financials.totalExpense || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#5A627A] mt-2 font-medium truncate">
            Cash Expense + Bank Expense
          </p>
        </div>

        {/* Card 5: Net Balance (Highlighted in #0E113C with #FBA920 accent) */}
        <div className="bg-[#0E113C] p-4 rounded-2xl border-2 border-[#0E113C] shadow-lg shadow-[#0E113C]/25 text-white flex flex-col justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#FBA920] uppercase tracking-wider">
                Net Balance
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#181C54] flex items-center justify-center text-[#FBA920]">
                <Scale className="w-4 h-4 text-[#FBA920]" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-[#FBA920] mt-1 font-mono">
              ₹{(financials.netBalance || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <p className="text-[10px] sm:text-[11px] text-gray-300 mt-2 font-medium truncate">
            Total Income − Total Expense
          </p>
        </div>
      </div>

      {/* TODAY'S CASH BOX WIDGET (Daily closing summary widget) */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-[#E2E8F0] shadow-dd-card flex flex-nowrap items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#FFF8EB] border border-[#FBA920]/40 flex items-center justify-center text-[#B45309] shrink-0">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-[#B45309]" />
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <h3 className="text-sm font-black text-[#0E113C] uppercase tracking-wide">
              Today's Cash Box
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#0E113C] text-[#FBA920] text-[10px] font-bold font-mono">
              {todayStr}
            </span>
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-3 text-xs shrink-0">
          {/* Today Cash In */}
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-2 whitespace-nowrap">
            <span className="text-emerald-800 font-semibold">Today's Cash In:</span>
            <span className="font-mono font-black text-emerald-700 text-sm">
              +₹{(financials.todayCashIn || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Today Cash Out */}
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center gap-2 whitespace-nowrap">
            <span className="text-rose-800 font-semibold">Today's Cash Out:</span>
            <span className="font-mono font-black text-rose-600 text-sm">
              -₹{(financials.todayCashOut || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Net Cash in Box */}
          <div className="px-4 py-1.5 rounded-xl bg-[#0E113C] text-white flex items-center gap-2 shadow-xs whitespace-nowrap">
            <span className="text-[#FBA920] font-bold uppercase text-[11px]">Net Cash in Box:</span>
            <span className="font-mono font-black text-white text-base">
              ₹{(financials.todayNetCash || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. THREE MAIN MODULE TABS */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-dd-card overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-[#E2E8F0] bg-[#FAFBFC] overflow-x-auto">
          <button
            onClick={() => handleTabSwitch('student_fees')}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'student_fees'
                ? 'border-[#0E113C] text-[#0E113C] bg-white'
                : 'border-transparent text-[#5A627A] hover:text-[#0E113C] hover:bg-gray-100/50'
            }`}
          >
            <WalletCards className={`w-4 h-4 ${activeMainTab === 'student_fees' ? 'text-[#FBA920]' : 'text-[#5A627A]'}`} />
            <span>Tab 1: Student Fees</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF0F8] text-[#0E113C]">
              {students.length}
            </span>
          </button>

          <button
            onClick={() => handleTabSwitch('school_ledger')}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'school_ledger'
                ? 'border-[#0E113C] text-[#0E113C] bg-white'
                : 'border-transparent text-[#5A627A] hover:text-[#0E113C] hover:bg-gray-100/50'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeMainTab === 'school_ledger' ? 'text-[#FBA920]' : 'text-[#5A627A]'}`} />
            <span>Tab 2: School Cash & Bank</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF0F8] text-[#0E113C]">
              {schoolTransactions.length}
            </span>
          </button>

          <button
            onClick={() => handleTabSwitch('personal_account')}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'personal_account'
                ? 'border-[#0E113C] text-[#0E113C] bg-white'
                : 'border-transparent text-[#5A627A] hover:text-[#0E113C] hover:bg-gray-100/50'
            }`}
          >
            <User className={`w-4 h-4 ${activeMainTab === 'personal_account' ? 'text-[#FBA920]' : 'text-[#5A627A]'}`} />
            <span>Tab 3: Personal Account</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
              {personalTransactions.length}
            </span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1 CONTENT: STUDENT FEES                                   */}
        {/* ============================================================== */}
        {activeMainTab === 'student_fees' && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Sub-View Switcher (Student Balances vs Receipts) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setStudentSubView('balances');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    studentSubView === 'balances'
                      ? 'bg-[#0E113C] text-[#FBA920] shadow-xs'
                      : 'bg-[#F6F8FB] text-[#5A627A] hover:text-[#0E113C]'
                  }`}
                >
                  Student Financial Summary & Balances ({filteredStudents.length})
                </button>
                <button
                  onClick={() => {
                    setStudentSubView('receipts');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    studentSubView === 'receipts'
                      ? 'bg-[#0E113C] text-[#FBA920] shadow-xs'
                      : 'bg-[#F6F8FB] text-[#5A627A] hover:text-[#0E113C]'
                  }`}
                >
                  Student Fee Receipts ({filteredReceipts.length})
                </button>
              </div>

              {studentSubView === 'balances' && (
                <div className="shrink-0">
                  <CustomSelect
                    prefix="Status Filter:"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: 'All', label: 'All Statuses' },
                      { value: 'Paid', label: 'Paid in Full' },
                      { value: 'Partial', label: 'Partial Pending' },
                      { value: 'Unpaid', label: 'Unpaid' },
                      { value: 'BikeDues', label: 'Has Bike Class Dues' },
                    ]}
                    size="sm"
                    autoWidth={true}
                    className="bg-[#F6F8FB]"
                  />
                </div>
              )}

              {studentSubView === 'receipts' && (
                <div className="shrink-0">
                  <CustomSelect
                    prefix="Category:"
                    value={receiptCategoryFilter}
                    onChange={(e) => {
                      setReceiptCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: 'All', label: 'All Categories' },
                      { value: 'Regular', label: 'Regular Course Fees' },
                      { value: 'Bike', label: 'Additional Bike Class Fees' },
                      { value: 'Other Charges', label: 'Other Charges' },
                    ]}
                    size="sm"
                    autoWidth={true}
                    className="bg-[#F6F8FB]"
                  />
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  studentSubView === 'balances'
                    ? 'Search student by name, ID, or phone...'
                    : 'Search receipt by Real Name, Banking Name, or Receipt ID...'
                }
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs sm:text-sm text-[#0E113C] pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 placeholder:text-[#94A3B8] transition-all"
              />
            </div>

            {/* VIEW A: STUDENT FINANCIAL SUMMARY TABLE */}
            {studentSubView === 'balances' && (
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-3">Course Fees</th>
                      <th className="py-3 px-3">Bike Classes (₹300/cl)</th>
                      <th className="py-3 px-3">Total Payable</th>
                      <th className="py-3 px-3">Total Paid</th>
                      <th className="py-3 px-3">Pending Balance</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {paginatedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-xs text-[#94A3B8]">
                          No student fee records found matching filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedStudents.map((st) => {
                        const fin = getStudentFinancials(st.id) || {
                          regularCourseFees: st.courseFees || 0,
                          additionalBikeClassesCount: 0,
                          additionalBikeCharges: 0,
                          totalPayable: st.courseFees || 0,
                          totalPaid: st.paidAmount || 0,
                          pendingBalance: st.pendingBalance || 0
                        };

                        const isFullyPaid = fin.pendingBalance === 0;
                        const isPartial = fin.totalPaid > 0 && fin.pendingBalance > 0;
                        const statusLabel = isFullyPaid ? 'Paid in Full' : isPartial ? 'Partial' : 'Unpaid';

                        return (
                          <tr key={st.id} className="hover:bg-[#F6F8FB] transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={st.photo}
                                  alt={st.name}
                                  className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
                                />
                                <div>
                                  <Link
                                    to={`/students/${st.id}`}
                                    className="font-bold text-[#0E113C] hover:text-[#E0910E] hover:underline"
                                  >
                                    {st.name}
                                  </Link>
                                  <div className="text-[11px] text-[#5A627A]">
                                    {st.id} • {st.phone1}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-[#0E113C]">
                              ₹{fin.regularCourseFees.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3">
                              {fin.additionalBikeClassesCount > 0 ? (
                                <div>
                                  <span className="font-extrabold text-[#E0910E]">
                                    ₹{fin.additionalBikeCharges.toLocaleString('en-IN')}
                                  </span>
                                  <div className="text-[10px] text-[#5A627A]">
                                    ({fin.additionalBikeClassesCount} × ₹300)
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[#94A3B8]">—</span>
                              )}
                            </td>
                            <td className="py-3 px-3 font-black text-[#0E113C]">
                              ₹{fin.totalPayable.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3 font-black text-emerald-700">
                              ₹{fin.totalPaid.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`font-black ${
                                  fin.pendingBalance > 0 ? 'text-[#DC2626]' : 'text-emerald-700'
                                }`}
                              >
                                ₹{fin.pendingBalance.toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                  isFullyPaid
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : isPartial
                                    ? 'bg-[#FFF8EB] text-[#E0910E] border-[#FBA920]/40'
                                    : 'bg-red-50 text-[#DC2626] border-red-200'
                                }`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedStudentForPay(st.id);
                                  setDefaultPaymentCategory(fin.pendingBike > 0 ? 'Additional Bike Class Fees' : 'Regular Course Fees');
                                  setIsAddPaymentOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0E113C] text-[#FBA920] hover:bg-[#0E113C]/90 whitespace-nowrap cursor-pointer transition-colors"
                              >
                                + Pay
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW B: STUDENT FEE RECEIPTS TABLE */}
            {studentSubView === 'receipts' && (
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                    <tr>
                      <th className="py-3 px-4">Receipt / Txn ID</th>
                      <th className="py-3 px-4">Student & Banking Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 font-mono">Amount Paid</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Payment Mode</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {paginatedReceipts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8]">
                          No student fee receipts found matching filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedReceipts.map((txn) => {
                        const rName = txn.realName || txn.studentName || 'Student';
                        const bName = txn.bankingName || '';
                        return (
                          <tr key={txn.id} className="hover:bg-[#F6F8FB] transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[#0E113C]">
                              {txn.id}
                            </td>
                            {/* DUAL NAME DISPLAY (Requirement 4) */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-[#0E113C]">
                                {txn.studentId ? (
                                  <Link to={`/students/${txn.studentId}`} className="hover:text-[#E0910E] hover:underline">
                                    {rName}
                                  </Link>
                                ) : (
                                  rName
                                )}
                              </div>
                              {bName && (
                                <div className="text-[11px] text-[#5A627A] font-medium flex items-center gap-1">
                                  <span className="text-[#94A3B8]">Bank:</span>
                                  <span>{bName}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                  txn.paymentCategory === 'Additional Bike Class Fees'
                                    ? 'bg-[#FFF8EB] text-[#E0910E] border-[#FBA920]/40'
                                    : 'bg-[#EEF0F8] text-[#0E113C] border-[#0E113C]/20'
                                }`}
                              >
                                {txn.paymentCategory || 'Regular Course Fees'}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-black text-emerald-700">
                              ₹{(txn.amountPaid || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3 font-mono text-[#5A627A]">
                              {txn.paymentDate}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-lg bg-gray-100 font-semibold text-[#0E113C] text-[11px]">
                                {txn.paymentMethod || txn.paymentMode || 'Cash'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setReceiptToPrint(txn)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] rounded-xl text-xs font-bold text-[#0E113C] transition-colors cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#0E113C]" />
                                <span>Print</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A627A]">
              <div>
                Showing{' '}
                <span className="font-bold text-[#0E113C]">
                  {studentSubView === 'balances'
                    ? (currentPage - 1) * pageSize + 1
                    : (currentPage - 1) * pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-bold text-[#0E113C]">
                  {studentSubView === 'balances'
                    ? Math.min(currentPage * pageSize, filteredStudents.length)
                    : Math.min(currentPage * pageSize, filteredReceipts.length)}
                </span>{' '}
                of{' '}
                <span className="font-bold text-[#0E113C]">
                  {studentSubView === 'balances' ? filteredStudents.length : filteredReceipts.length}
                </span>{' '}
                records
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold text-[#0E113C]">
                  Page {currentPage} of{' '}
                  {studentSubView === 'balances' ? totalPagesStudents : totalPagesReceipts}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        studentSubView === 'balances' ? totalPagesStudents : totalPagesReceipts,
                        p + 1
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    (studentSubView === 'balances' ? totalPagesStudents : totalPagesReceipts)
                  }
                  className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2 CONTENT: SCHOOL CASH & BANK LEDGER                      */}
        {/* ============================================================== */}
        {activeMainTab === 'school_ledger' && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Sub-View Switcher */}
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <button
                onClick={() => {
                  setSchoolSubView('table');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  schoolSubView === 'table'
                    ? 'bg-[#0E113C] text-[#FBA920] shadow-xs'
                    : 'bg-[#F6F8FB] text-[#5A627A] hover:text-[#0E113C]'
                }`}
              >
                Ledger Transactions Table ({filteredSchoolLedger.length})
              </button>
              <button
                onClick={() => {
                  setSchoolSubView('breakdown');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  schoolSubView === 'breakdown'
                    ? 'bg-[#0E113C] text-[#FBA920] shadow-xs'
                    : 'bg-[#F6F8FB] text-[#5A627A] hover:text-[#0E113C]'
                }`}
              >
                Expense Head Breakdown
              </button>
            </div>

            {/* Filters Bar for School Ledger */}
            {schoolSubView === 'table' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  <div className="relative sm:col-span-2 lg:col-span-1">
                    <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search name, bank, notes..."
                      className="w-full bg-[#F6F8FB] text-xs text-[#0E113C] pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920]"
                    />
                  </div>

                  <CustomSelect
                    prefix="Type:"
                    value={schoolTypeFilter}
                    onChange={(e) => {
                      setSchoolTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: 'All', label: 'All Types' },
                      { value: 'Cash Income', label: 'Cash Income' },
                      { value: 'Cash Expense', label: 'Cash Expense' },
                      { value: 'Bank Income', label: 'Bank Income' },
                      { value: 'Bank Expense', label: 'Bank Expense' },
                    ]}
                    size="sm"
                    className="bg-[#F6F8FB]"
                  />

                  <CustomSelect
                    prefix="Mode:"
                    value={schoolModeFilter}
                    onChange={(e) => {
                      setSchoolModeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: 'All', label: 'All Modes' },
                      { value: 'Cash', label: 'Cash' },
                      { value: 'GPay / UPI', label: 'GPay / UPI' },
                      { value: 'PhonePe', label: 'PhonePe' },
                      { value: 'Direct Banking (NEFT / IMPS / Bank Transfer)', label: 'Direct Banking' },
                      { value: 'Others', label: 'Others' },
                    ]}
                    size="sm"
                    className="bg-[#F6F8FB]"
                  />

                  <CustomSelect
                    prefix="Head:"
                    value={schoolHeadFilter}
                    onChange={(e) => {
                      setSchoolHeadFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: 'All', label: 'All Expense Heads' },
                      ...allExpenseHeads.map((h) => ({ value: h, label: h }))
                    ]}
                    searchable={true}
                    size="sm"
                    className="bg-[#F6F8FB]"
                  />

                  <CustomSelect
                    prefix="Date:"
                    value={schoolDateFilter}
                    onChange={(e) => {
                      setSchoolDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    options={[
                      { value: 'All', label: 'All Time' },
                      { value: 'Today', label: `Today (${todayStr})` },
                      { value: 'ThisMonth', label: 'This Month' },
                    ]}
                    size="sm"
                    className="bg-[#F6F8FB]"
                  />
                </div>

                {/* Ledger Transactions Table */}
                <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                      <tr>
                        <th className="py-3 px-4">Date & ID</th>
                        <th className="py-3 px-3">Transaction Type</th>
                        <th className="py-3 px-4">Real Name & Banking Name</th>
                        <th className="py-3 px-3">Expense Head / Category</th>
                        <th className="py-3 px-3">Mode</th>
                        <th className="py-3 px-3 text-right font-mono">Amount (₹)</th>
                        <th className="py-3 px-3">Reference / Notes</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                      {paginatedSchoolLedger.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-xs text-[#94A3B8]">
                            No school ledger entries found matching filters.
                          </td>
                        </tr>
                      ) : (
                        paginatedSchoolLedger.map((txn) => {
                          const isIncome = txn.type.includes('Income');
                          const isCash = txn.type.startsWith('Cash');
                          const rName = txn.realName || '—';
                          const bName = txn.bankingName || '';

                          return (
                            <tr key={txn.id} className="hover:bg-[#F6F8FB] transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-mono font-bold text-[#0E113C] block">{txn.date}</span>
                                <span className="text-[10px] font-mono text-[#94A3B8]">{txn.id}</span>
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                    isIncome
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                                >
                                  {isIncome ? (
                                    <ArrowDownRight className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <ArrowUpRight className="w-3 h-3 text-rose-600" />
                                  )}
                                  <span>{txn.type}</span>
                                </span>
                              </td>
                              {/* DUAL NAME DISPLAY (Requirement 4) */}
                              <td className="py-3 px-4">
                                <div className="font-bold text-[#0E113C] leading-snug">
                                  {txn.studentId ? (
                                    <Link to={`/students/${txn.studentId}`} className="hover:text-[#E0910E] hover:underline">
                                      {rName}
                                    </Link>
                                  ) : (
                                    rName
                                  )}
                                </div>
                                {bName && (
                                  <div className="text-[11px] text-[#5A627A] font-medium flex items-center gap-1 mt-0.5">
                                    <span className="text-[#94A3B8]">Bank:</span>
                                    <span>{bName}</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {txn.expenseHead ? (
                                  <span className="font-semibold text-[#0E113C] text-xs">
                                    {txn.expenseHead}
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#5A627A]">
                                    {txn.category || 'Student Fee'}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-lg bg-gray-100 font-medium text-[#0E113C] text-[11px]">
                                  {txn.paymentMode}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span
                                  className={`font-black font-mono text-sm ${
                                    isIncome ? 'text-emerald-700' : 'text-rose-600'
                                  }`}
                                >
                                  {isIncome ? '+' : '-'}₹{(txn.amount || 0).toLocaleString('en-IN')}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-xs text-[#5A627A] max-w-xs truncate">
                                {txn.referenceNo && (
                                  <span className="font-mono text-[11px] text-[#0E113C] block truncate">
                                    {txn.referenceNo}
                                  </span>
                                )}
                                <span className="truncate block">{txn.notes || '—'}</span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setReceiptToPrint(txn)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] rounded-xl text-xs font-bold text-[#0E113C] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                                    title="Print receipt / voucher"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-[#0E113C]" />
                                    <span>Print</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLedgerItem(txn.id)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete transaction"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A627A]">
                  <div>
                    Showing <span className="font-bold text-[#0E113C]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                    <span className="font-bold text-[#0E113C]">{Math.min(currentPage * pageSize, filteredSchoolLedger.length)}</span> of{' '}
                    <span className="font-bold text-[#0E113C]">{filteredSchoolLedger.length}</span> transactions
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-bold text-[#0E113C]">
                      Page {currentPage} of {totalPagesSchool}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPagesSchool, p + 1))}
                      disabled={currentPage === totalPagesSchool}
                      className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* VIEW B: EXPENSE HEAD BREAKDOWN (Requirement 5) */}
            {schoolSubView === 'breakdown' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0E113C]">
                      Operational Spending Breakdown by Expense Head
                    </h4>
                    <p className="text-xs text-[#5A627A]">
                      Cumulative expenditure analysis across all 20 predefined driving school expense heads
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#5A627A]">Total School Expenses:</span>
                    <p className="text-xl font-black text-rose-600 font-mono">
                      ₹{(financials.totalExpense || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {expenseBreakdown.map((item, idx) => (
                    <div
                      key={item.head}
                      className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#FBA920] transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#5A627A] uppercase tracking-wider block">
                            #{idx + 1} Head
                          </span>
                          <h5 className="text-xs font-bold text-[#0E113C] truncate mt-0.5">
                            {item.head}
                          </h5>
                          <span className="text-[11px] text-[#5A627A] block mt-0.5">
                            {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-[#0E113C] font-mono block">
                            ₹{item.total.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFF8EB] text-[#B45309]">
                            {item.percentage}% of total
                          </span>
                        </div>
                      </div>

                      {/* Spend progress bar matching Deep Navy and Golden Amber */}
                      <div className="w-full bg-[#EEF0F8] h-2 rounded-full mt-3 overflow-hidden">
                        <div
                          className="bg-[#0E113C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(item.total > 0 ? 3 : 0, item.percentage))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3 CONTENT: PERSONAL ACCOUNT (Separate Personal Ledger)    */}
        {/* ============================================================== */}
        {activeMainTab === 'personal_account' && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Header info & separate personal balance summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Personal Income */}
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Personal Income
                </span>
                <p className="text-xl font-black text-purple-900 font-mono mt-1">
                  ₹{(financials.personalIncome || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-purple-700 mt-1">Private funds received into owner account</p>
              </div>

              {/* Personal Expense */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Personal Expense
                </span>
                <p className="text-xl font-black text-rose-700 font-mono mt-1">
                  ₹{(financials.personalExpense || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-rose-700 mt-1">Private drawings & household expenditures</p>
              </div>

              {/* Net Personal Balance */}
              <div className="p-4 rounded-xl bg-[#0E113C] text-white border-2 border-[#0E113C] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold text-[#FBA920] uppercase tracking-wider">
                    Net Personal Balance
                  </span>
                  <p className="text-xl font-black text-[#FBA920] font-mono mt-1">
                    ₹{(financials.personalNetBalance || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-[10px] text-gray-300 mt-1">Completely separate from school balance</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search personal ledger..."
                  className="w-full bg-[#F6F8FB] text-xs text-[#0E113C] pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920]"
                />
              </div>

              <CustomSelect
                prefix="Type:"
                value={personalTypeFilter}
                onChange={(e) => {
                  setPersonalTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 'All', label: 'All Personal' },
                  { value: 'Personal Income', label: 'Personal Income' },
                  { value: 'Personal Expense', label: 'Personal Expense' },
                ]}
                size="sm"
                className="bg-[#F6F8FB]"
              />

              <CustomSelect
                prefix="Mode:"
                value={personalModeFilter}
                onChange={(e) => {
                  setPersonalModeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 'All', label: 'All Modes' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'GPay / UPI', label: 'GPay / UPI' },
                  { value: 'PhonePe', label: 'PhonePe' },
                  { value: 'Direct Banking (NEFT / IMPS / Bank Transfer)', label: 'Direct Banking' },
                ]}
                size="sm"
                className="bg-[#F6F8FB]"
              />
            </div>

            {/* Personal Ledger Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-4">Date & ID</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-4">Party & Banking Name</th>
                    <th className="py-3 px-3">Payment Mode</th>
                    <th className="py-3 px-3 text-right font-mono">Amount (₹)</th>
                    <th className="py-3 px-3">Reference & Narration</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {paginatedPersonal.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8]">
                        No personal account transactions recorded.
                      </td>
                    </tr>
                  ) : (
                    paginatedPersonal.map((txn) => {
                      const isIncome = txn.type === 'Personal Income';
                      const rName = txn.realName || 'Personal Account';
                      const bName = txn.bankingName || '';

                      return (
                        <tr key={txn.id} className="hover:bg-[#F6F8FB] transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-[#0E113C] block">{txn.date}</span>
                            <span className="text-[10px] font-mono text-[#94A3B8]">{txn.id}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                isIncome
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : 'bg-rose-50 text-rose-800 border-rose-200'
                              }`}
                            >
                              {txn.type}
                            </span>
                          </td>
                          {/* DUAL NAME DISPLAY (Requirement 4) */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#0E113C]">{rName}</div>
                            {bName && (
                              <div className="text-[11px] text-[#5A627A] font-medium flex items-center gap-1 mt-0.5">
                                <span className="text-[#94A3B8]">Bank:</span>
                                <span>{bName}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-lg bg-gray-100 font-medium text-[#0E113C] text-[11px]">
                              {txn.paymentMode}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`font-black font-mono text-sm ${
                                isIncome ? 'text-purple-700' : 'text-rose-600'
                              }`}
                            >
                              {isIncome ? '+' : '-'}₹{(txn.amount || 0).toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-xs text-[#5A627A] max-w-xs truncate">
                            {txn.referenceNo && (
                              <span className="font-mono text-[11px] text-[#0E113C] block truncate">
                                {txn.referenceNo}
                              </span>
                            )}
                            <span className="truncate block">{txn.notes || '—'}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setReceiptToPrint(txn)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] rounded-xl text-xs font-bold text-[#0E113C] transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                                title="Print receipt / voucher"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#0E113C]" />
                                <span>Print</span>
                              </button>
                              <button
                                onClick={() => handleDeleteLedgerItem(txn.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A627A]">
              <div>
                Showing <span className="font-bold text-[#0E113C]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-bold text-[#0E113C]">{Math.min(currentPage * pageSize, filteredPersonal.length)}</span> of{' '}
                <span className="font-bold text-[#0E113C]">{filteredPersonal.length}</span> records
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 font-bold text-[#0E113C]">
                  Page {currentPage} of {totalPagesPersonal}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPagesPersonal, p + 1))}
                  disabled={currentPage === totalPagesPersonal}
                  className="p-1.5 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. RECORD FINANCIAL ENTRY MODAL */}
      {isRecordEntryOpen && (
        <RecordEntryModal
          isOpen={isRecordEntryOpen}
          onClose={closeRecordEntryModal}
          initialType={recordEntryType}
          preselectedStudentId={recordEntryStudentId}
        />
      )}

      {/* 5. RECORD STUDENT FEE MODAL */}
      {isAddPaymentOpen && (
        <AddPaymentModal
          isOpen={isAddPaymentOpen}
          onClose={closeAddPaymentModal}
          preselectedStudentId={selectedStudentForPay}
          defaultCategory={defaultPaymentCategory}
        />
      )}

      {/* 6. OFFICIAL PRINTABLE RECEIPT / VOUCHER MODAL */}
      {receiptToPrint && (() => {
        const isExpense = receiptToPrint.type ? receiptToPrint.type.includes('Expense') : false;
        const isPersonal = receiptToPrint.type ? receiptToPrint.type.startsWith('Personal') : false;
        const txnId = receiptToPrint.id;
        const txnDate = receiptToPrint.paymentDate || receiptToPrint.date || todayStr;
        const realName = receiptToPrint.realName || receiptToPrint.studentName || (isPersonal ? 'Personal Account' : '—');
        const bankingName = receiptToPrint.bankingName;
        const categoryHead =
          receiptToPrint.expenseHead ||
          receiptToPrint.paymentCategory ||
          receiptToPrint.category ||
          (isExpense ? 'Expense' : 'Regular Course Fees');
        const payMode = receiptToPrint.paymentMethod || receiptToPrint.paymentMode || 'Cash';
        const amount = parseFloat(receiptToPrint.amountPaid ?? receiptToPrint.amount ?? 0);
        const refNo = receiptToPrint.referenceNo || '—';
        const notes = receiptToPrint.notes || (isExpense ? 'Operational expense voucher' : 'Payment transaction');

        let badgeTitle = 'OFFICIAL PAYMENT RECEIPT';
        if (isPersonal) {
          badgeTitle = isExpense ? 'PERSONAL EXPENSE VOUCHER' : 'PERSONAL PAYMENT RECEIPT';
        } else if (isExpense) {
          badgeTitle = 'OFFICIAL PAYMENT / EXPENSE VOUCHER';
        }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs animate-fade-in print:bg-white print:p-0 print:static print:block">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] space-y-4 animate-scale-in print:shadow-none print:border print:border-gray-300 print:max-w-none print:w-full print:p-8">
              {/* Close X Button (hidden when printed) */}
              <button
                onClick={() => setReceiptToPrint(null)}
                className="no-print print:hidden absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-[#0E113C] hover:bg-gray-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="border-b border-[#E2E8F0] pb-4 text-center">
                <h3 className="text-base font-extrabold text-[#0E113C] uppercase tracking-wider">
                  {settings.schoolName || 'Al Madeena Driving School'}
                </h3>
                <p className="text-[11px] text-[#5A627A]">{settings.address}</p>
                <p className="text-[11px] text-[#5A627A]">{settings.contactNumbers || settings.contactNumber}</p>
                <div
                  className={`mt-2 text-xs font-extrabold py-1.5 rounded-lg tracking-wider ${
                    isExpense ? 'bg-[#0E113C] text-rose-300' : 'bg-[#0E113C] text-[#FBA920]'
                  }`}
                >
                  {badgeTitle}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5A627A]">{isExpense ? 'Voucher Number:' : 'Receipt Number:'}</span>
                  <span className="font-mono font-bold text-[#0E113C]">{txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A627A]">{isExpense ? 'Voucher Date:' : 'Receipt Date:'}</span>
                  <span className="font-semibold text-[#0E113C]">{txnDate}</span>
                </div>
                {receiptToPrint.type && (
                  <div className="flex justify-between">
                    <span className="text-[#5A627A]">Transaction Type:</span>
                    <span className="font-bold text-[#0E113C]">{receiptToPrint.type}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#5A627A]">
                    {isExpense
                      ? 'Paid To (Party / Payee):'
                      : (receiptToPrint.studentId || !isPersonal ? 'Student / Payer:' : 'Party / Payer:')}
                  </span>
                  <span className="font-bold text-[#0E113C] text-right max-w-[60%] truncate">{realName}</span>
                </div>
                {bankingName && bankingName !== realName && (
                  <div className="flex justify-between">
                    <span className="text-[#5A627A]">Account Holder / Bank:</span>
                    <span className="font-medium text-[#0E113C] text-right max-w-[60%] truncate">{bankingName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#5A627A]">
                    {isExpense ? 'Expense Head / Category:' : 'Payment Category:'}
                  </span>
                  <span className="font-bold text-[#0E113C] text-right max-w-[60%] truncate">{categoryHead}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A627A]">Payment Mode:</span>
                  <span className="font-bold text-[#0E113C]">{payMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A627A]">Reference No:</span>
                  <span className="font-mono text-[#0E113C]">{refNo}</span>
                </div>
                <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center">
                  <span className="font-bold text-sm text-[#0E113C]">
                    {isExpense ? 'Amount Paid:' : 'Amount Received:'}
                  </span>
                  <span
                    className={`font-black text-xl font-mono ${
                      isExpense ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-[#5A627A] italic mt-1">
                  Note: {notes}
                </p>
              </div>

              <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span>Authorized Signature: _________</span>
                <span>Computer Generated</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 no-print print:hidden">
                <button
                  onClick={() => setReceiptToPrint(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#0E113C] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#EEF0F8] cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs font-bold text-[#0E113C] bg-[#FBA920] hover:bg-[#E0910E] rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FBA920]/25 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isExpense ? 'Print Voucher' : 'Print Receipt'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
