import React, { useState, useEffect } from 'react';
import { X, WalletCards, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CustomSelect from '../common/CustomSelect';

export default function AddPaymentModal({ isOpen, onClose, preselectedStudentId, defaultCategory }) {
  const { students, addPayment, getStudentFinancials } = useApp();

  const [studentId, setStudentId] = useState(preselectedStudentId || (students[0]?.id || ''));
  const [paymentCategory, setPaymentCategory] = useState(defaultCategory || 'Regular Course Fees');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('GPay / UPI');
  const [bankingName, setBankingName] = useState('');
  const [realName, setRealName] = useState('');
  const [error, setError] = useState('');

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];
  const financials = selectedStudent ? getStudentFinancials(selectedStudent.id) : null;

  useEffect(() => {
    if (preselectedStudentId) {
      setStudentId(preselectedStudentId);
    }
    if (defaultCategory) {
      setPaymentCategory(defaultCategory);
    }
  }, [preselectedStudentId, defaultCategory, isOpen]);

  useEffect(() => {
    if (selectedStudent) {
      setRealName(selectedStudent.name);
      if (!bankingName) {
        setBankingName(selectedStudent.guardianName || selectedStudent.name);
      }
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (financials) {
      if (paymentCategory === 'Additional Bike Class Fees') {
        setAmountPaid(financials.pendingBike > 0 ? financials.pendingBike.toString() : '300');
      } else if (paymentCategory === 'Regular Course Fees') {
        setAmountPaid(financials.pendingRegular > 0 ? financials.pendingRegular.toString() : '2000');
      } else {
        setAmountPaid('500');
      }
    }
  }, [studentId, paymentCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(amountPaid);
    if (!amount || amount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    const isCash = paymentMethod === 'Cash';
    if (!isCash && !bankingName.trim()) {
      setError('Please enter Account Holder / Banking Name');
      return;
    }
    if (!realName.trim()) {
      setError('Please enter Student / Real Name');
      return;
    }

    addPayment({
      studentId: selectedStudent.id,
      studentName: realName.trim() || selectedStudent.name,
      realName: realName.trim() || selectedStudent.name,
      bankingName: isCash ? '' : bankingName.trim(),
      amountPaid: amount,
      paymentCategory,
      paymentDate,
      paymentMethod,
      paymentMode: paymentMethod,
      referenceNo: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: `${paymentCategory} payment.`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <WalletCards className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Record Student Fee
              </h3>
              <p className="text-xs text-[#5A627A]">
                Accept fee payment and update student financial records
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Balances Banner */}
        {financials && (
          <div className="bg-[#F6F8FB] border-b border-[#E2E8F0] px-6 py-3 grid grid-cols-3 gap-2 text-center text-xs shrink-0">
            <div className="bg-white p-2 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-semibold text-[#5A627A]">Course Balance</span>
              <p className="font-extrabold text-[#0E113C]">₹{financials.pendingRegular.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-semibold text-[#5A627A]">Bike Due (₹300/cl)</span>
              <p className="font-extrabold text-[#E0910E]">₹{financials.pendingBike.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-semibold text-[#5A627A]">Total Pending</span>
              <p className="font-black text-red-600">₹{financials.pendingBalance.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Inner Form Area - Scrolls Smoothly */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 scroll-smooth">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Select Student *
              </label>
              <CustomSelect
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                options={students.map((st) => ({
                  value: st.id,
                  label: `${st.name} (${st.id})`,
                  subtext: `Total Pending: ₹${(st.pendingBalance || 0).toLocaleString('en-IN')}`,
                }))}
                searchable={true}
                className="py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Payment Category *
                </label>
                <CustomSelect
                  value={paymentCategory}
                  onChange={(e) => setPaymentCategory(e.target.value)}
                  options={[
                    { value: 'Regular Course Fees', label: 'Regular Course Fees' },
                    { value: 'Additional Bike Class Fees', label: 'Additional Bike Class Fees' },
                    { value: 'Other Charges', label: 'Other Charges' }
                  ]}
                  className="py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Amount Paid (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5A627A]">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="2500"
                    className="w-full pl-8 pr-3.5 py-2 text-xs font-black bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Payment Mode *
                </label>
                <CustomSelect
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'GPay / UPI', label: 'GPay / UPI' },
                    { value: 'PhonePe', label: 'PhonePe' },
                    { value: 'Direct Banking (NEFT / IMPS / Bank Transfer)', label: 'Direct Banking (NEFT / IMPS / Bank Transfer)' },
                    { value: 'Others', label: 'Others' },
                  ]}
                  className="py-2"
                />
              </div>
            </div>

            {/* Dedicated Side-by-Side Banking Name & Real Name Fields for Digital/Bank Modes */}
            {paymentMethod !== 'Cash' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#F6F8FB] p-3 rounded-xl border border-[#E2E8F0]">
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-[#0E113C] mb-1 whitespace-nowrap">
                    Account Holder / Banking Name *
                  </label>
                  <input
                    type="text"
                    value={bankingName}
                    onChange={(e) => setBankingName(e.target.value)}
                    placeholder="e.g. Sender bank account or UPI name"
                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                    required
                  />
                  <span className="text-[10px] text-[#5A627A] mt-0.5 block">
                    Name shown in Bank / UPI statement (e.g. Parent's name)
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
                    placeholder="e.g. Actual student name"
                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold"
                    required
                  />
                  <span className="text-[10px] text-[#5A627A] mt-0.5 block">
                    Actual student this fee is credited for
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
                  placeholder="e.g. Student name"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold"
                  required
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-white border-t border-[#E2E8F0] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs font-bold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#0E113C]" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
