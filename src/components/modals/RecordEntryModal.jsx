import React, { useState, useEffect } from 'react';
import { X, Plus, Check, IndianRupee, AlertCircle, ArrowDownRight, ArrowUpRight, Wallet, Building2, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CustomSelect from '../common/CustomSelect';
import { PREDEFINED_EXPENSE_HEADS } from '../../data/initialData';

export default function RecordEntryModal({ isOpen, onClose, initialType = 'Cash Income', preselectedStudentId = null }) {
  const { students, addTransaction, customExpenseHeads, addCustomExpenseHead, getStudentFinancials } = useApp();

  const [txnType, setTxnType] = useState(initialType);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [isStudentFee, setIsStudentFee] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(preselectedStudentId || '');
  const [studentCategory, setStudentCategory] = useState('Regular Course Fees');
  const [realName, setRealName] = useState('');
  const [bankingName, setBankingName] = useState('');
  const [expenseHead, setExpenseHead] = useState(PREDEFINED_EXPENSE_HEADS[0]);
  const [isAddingCustomHead, setIsAddingCustomHead] = useState(false);
  const [customHeadName, setCustomHeadName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Combine predefined heads with any runtime user-created custom heads
  const allExpenseHeads = [...PREDEFINED_EXPENSE_HEADS, ...(customExpenseHeads || [])];

  useEffect(() => {
    if (initialType) {
      setTxnType(initialType);
      if (initialType.startsWith('Cash')) {
        setPaymentMode('Cash');
      } else if (initialType.startsWith('Bank')) {
        setPaymentMode('GPay / UPI');
      }
    }
    if (preselectedStudentId) {
      setSelectedStudentId(preselectedStudentId);
      setIsStudentFee(true);
    }
  }, [initialType, preselectedStudentId, isOpen]);

  // Handle transaction type change
  const handleTypeChange = (newType) => {
    setTxnType(newType);
    if (newType.startsWith('Cash')) {
      setPaymentMode('Cash');
    } else if (newType.startsWith('Bank') && paymentMode === 'Cash') {
      setPaymentMode('GPay / UPI');
    }

    if (newType.includes('Expense')) {
      setIsStudentFee(false);
      if (!expenseHead) {
        setExpenseHead(PREDEFINED_EXPENSE_HEADS[0]);
      }
    }
  };

  // Handle student selection change
  useEffect(() => {
    if (isStudentFee && selectedStudentId) {
      const st = students.find((s) => s.id === selectedStudentId);
      if (st) {
        setRealName(st.name);
        if (!bankingName || bankingName === realName) {
          setBankingName(st.guardianName || st.name);
        }
        const fin = getStudentFinancials(st.id);
        if (fin) {
          if (studentCategory === 'Additional Bike Class Fees' && fin.pendingBike > 0) {
            setAmount(fin.pendingBike.toString());
          } else if (fin.pendingBalance > 0 && !amount) {
            setAmount(Math.min(fin.pendingBalance, 3000).toString());
          }
        }
      }
    }
  }, [selectedStudentId, isStudentFee, studentCategory]);

  const selectedStudentObj = isStudentFee && selectedStudentId ? students.find((s) => s.id === selectedStudentId) : null;
  const studentFin = selectedStudentObj ? getStudentFinancials(selectedStudentObj.id) : null;

  if (!isOpen) return null;

  const isExpense = txnType.includes('Expense');
  const isPersonal = txnType.startsWith('Personal');
  const isDigital = paymentMode !== 'Cash';

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!realName.trim()) {
      setError('Please enter the Real Name / Student Name');
      return;
    }

    if (isDigital && !bankingName.trim()) {
      setError('Please enter the Account Holder / Banking Name');
      return;
    }

    if (isExpense && !expenseHead) {
      setError('Please select an Expense Head');
      return;
    }

    addTransaction({
      type: txnType,
      date,
      amount: parsedAmount,
      paymentMode,
      realName: realName.trim(),
      bankingName: isDigital ? bankingName.trim() : '',
      category: isExpense ? 'Expense' : (isStudentFee ? 'Student Fee' : (isPersonal ? 'Personal' : 'School Income')),
      subCategory: isStudentFee ? studentCategory : '',
      expenseHead: isExpense ? expenseHead : '',
      studentId: isStudentFee ? selectedStudentId : null,
      referenceNo: referenceNo.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  const handleCreateCustomHead = (e) => {
    e.preventDefault();
    if (customHeadName.trim()) {
      addCustomExpenseHead(customHeadName.trim());
      setExpenseHead(customHeadName.trim());
      setIsAddingCustomHead(false);
      setCustomHeadName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070926]/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] my-6 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0E113C] text-[#FBA920] shadow-sm">
              <IndianRupee className="w-5 h-5 text-[#FBA920]" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Record Financial Entry
              </h3>
              <p className="text-xs text-[#5A627A]">
                Log income, expense, student fee receipts, or personal ledger records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Transaction Type Grid Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1.5 uppercase tracking-wider">
              1. Transaction Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'Cash Income', label: 'Cash Income', sub: 'School cash box', color: 'border-emerald-300 text-emerald-800 bg-emerald-50/50' },
                { id: 'Cash Expense', label: 'Cash Expense', sub: 'Cash payout', color: 'border-rose-300 text-rose-800 bg-rose-50/50' },
                { id: 'Bank Income', label: 'Bank Income', sub: 'UPI / Direct Bank', color: 'border-blue-300 text-blue-800 bg-blue-50/50' },
                { id: 'Bank Expense', label: 'Bank Expense', sub: 'Net banking / EMI', color: 'border-amber-300 text-amber-800 bg-amber-50/50' },
                { id: 'Personal Income', label: 'Personal Income', sub: 'Private funds in', color: 'border-purple-300 text-purple-800 bg-purple-50/50' },
                { id: 'Personal Expense', label: 'Personal Expense', sub: 'Personal drawings', color: 'border-indigo-300 text-indigo-800 bg-indigo-50/50' },
              ].map((item) => {
                const isSelected = txnType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0E113C] bg-[#0E113C] text-white shadow-sm ring-2 ring-[#FBA920]/40'
                        : `${item.color} hover:border-[#0E113C]/40`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${isSelected ? 'text-[#FBA920]' : ''}`}>
                        {item.label}
                      </span>
                      {item.id.includes('Income') ? (
                        <ArrowDownRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      ) : (
                        <ArrowUpRight className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-rose-600'}`} />
                      )}
                    </div>
                    <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-gray-300' : 'text-[#5A627A]'}`}>
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Payment Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                2. Payment Mode *
              </label>
              <CustomSelect
                value={paymentMode}
                onChange={(e) => {
                  const val = e.target.value;
                  setPaymentMode(val);
                  if (val === 'Cash' && txnType.startsWith('Bank')) {
                    setTxnType(txnType.replace('Bank', 'Cash'));
                  } else if (val !== 'Cash' && txnType.startsWith('Cash')) {
                    setTxnType(txnType.replace('Cash', 'Bank'));
                  }
                }}
                options={[
                  { value: 'Cash', label: 'Cash' },
                  { value: 'GPay / UPI', label: 'GPay / UPI' },
                  { value: 'PhonePe', label: 'PhonePe' },
                  { value: 'Direct Banking (NEFT / IMPS / Bank Transfer)', label: 'Direct Banking (NEFT / IMPS / Bank Transfer)' },
                  { value: 'Others', label: 'Others' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5A627A]">
                  ₹
                </span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2500"
                  className="w-full pl-8 pr-3.5 py-2 text-sm font-black bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Optional: Student Fee Link when Recording School Income */}
          {!isExpense && !isPersonal && (
            <div className="p-3.5 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E113C]">Is this a Student Fee Payment?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStudentFee(true);
                      if (!selectedStudentId && students[0]) {
                        setSelectedStudentId(students[0].id);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      isStudentFee
                        ? 'bg-[#0E113C] text-[#FBA920] shadow-xs'
                        : 'bg-white text-[#5A627A] border border-[#E2E8F0]'
                    }`}
                  >
                    Yes, Student Fee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsStudentFee(false);
                      setSelectedStudentId('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      !isStudentFee
                        ? 'bg-[#0E113C] text-white shadow-xs'
                        : 'bg-white text-[#5A627A] border border-[#E2E8F0]'
                    }`}
                  >
                    Other School Income
                  </button>
                </div>
              </div>

              {isStudentFee && (
                <div className="space-y-3 pt-1 border-t border-[#E2E8F0]">
                  <div>
                    <label className="block text-xs font-bold text-[#0E113C] mb-1">
                      Select Student *
                    </label>
                    <CustomSelect
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      options={students.map((st) => ({
                        value: st.id,
                        label: `${st.name} (${st.id})`,
                        subtext: `Pending: ₹${(st.pendingBalance || 0).toLocaleString('en-IN')}`
                      }))}
                      searchable={true}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0E113C] mb-1">
                        Fee Category *
                      </label>
                      <CustomSelect
                        value={studentCategory}
                        onChange={(e) => setStudentCategory(e.target.value)}
                        options={[
                          { value: 'Regular Course Fees', label: 'Regular Course Fees' },
                          { value: 'Additional Bike Class Fees', label: 'Additional Bike Class Fees' },
                          { value: 'Other Charges', label: 'Other Charges' },
                        ]}
                      />
                    </div>

                    {studentFin && (
                      <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] flex flex-col justify-center text-center">
                        <span className="text-[10px] text-[#5A627A] font-medium">Student Pending Due:</span>
                        <span className="text-sm font-black text-rose-600">
                          ₹{studentFin.pendingBalance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CRITICAL Requirement 4: Dedicated Side-by-Side Banking Name & Real Name Fields */}
          {isDigital ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#FFF8EB] p-3.5 rounded-xl border border-[#FBA920]/40">
              <div className="flex flex-col">
                <label className="block text-xs font-bold text-[#0E113C] mb-1 whitespace-nowrap">
                  Account Holder / Banking Name *
                </label>
                <input
                  type="text"
                  value={bankingName}
                  onChange={(e) => setBankingName(e.target.value)}
                  placeholder="e.g. Sender bank account or UPI name"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#CBD5E1] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-medium"
                  required
                />
                <span className="text-[10px] text-[#5A627A] mt-0.5 block">
                  Name shown in Bank / UPI statement (e.g. Parent's bank name)
                </span>
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-bold text-[#0E113C] mb-1 whitespace-nowrap">
                  Real Name / Student Name *
                </label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="e.g. Actual student or party name"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#CBD5E1] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
                  required
                />
                <span className="text-[10px] text-[#5A627A] mt-0.5 block">
                  The actual student or person this transaction belongs to
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1 whitespace-nowrap">
                Real Name / Student Name *
              </label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="e.g. Student, vendor, or payer name"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
                required
              />
            </div>
          )}

          {/* Requirement 5: 20 Predefined Driving School Expense Heads + Custom Head */}
          {isExpense && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0E113C]">
                Expense Head (Category) *
              </label>

              {isAddingCustomHead ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customHeadName}
                    onChange={(e) => setCustomHeadName(e.target.value)}
                    placeholder="Enter custom expense head name"
                    className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-[#CBD5E1] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateCustomHead}
                    className="px-4 py-2 bg-[#0E113C] hover:bg-[#181C54] text-[#FBA920] rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomHead(false)}
                    className="px-3 py-2 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#5A627A] hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <CustomSelect
                  value={expenseHead}
                  onChange={(e) => {
                    if (e.target.value === '__CUSTOM__') {
                      setIsAddingCustomHead(true);
                    } else {
                      setExpenseHead(e.target.value);
                    }
                  }}
                  options={[
                    ...allExpenseHeads.map((head, idx) => ({
                      value: head,
                      label: head,
                      subtext: idx < 20 ? `Predefined Head #${idx + 1}` : 'Custom Category'
                    })),
                    { value: '__CUSTOM__', label: '+ Add Custom Head', subtext: 'Create a new expense category' }
                  ]}
                  searchable={true}
                />
              )}
            </div>
          )}

          {/* Date & Reference Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Reference / Voucher / UPI Txn No
              </label>
              <input
                type="text"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g. UPI/32904812, RCP-8812, CHQ-104"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
              />
            </div>
          </div>

          {/* Narration / Notes */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Narration / Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Remarks, vehicle number, or invoice details..."
              className="w-full p-3 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs font-extrabold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#0E113C]" strokeWidth={2.5} />
              <span>Save & Confirm Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
