import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CustomDatePicker from '../common/CustomDatePicker';

export default function QuickAddStudentModal({ isOpen, onClose }) {
  const { addStudent, settings } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    guardianName: '',
    dob: '',
    address: '',
    phone1: '',
    phone2: '',
    applicationNo: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    registrationNo: `REG-KL11-${Math.floor(1000 + Math.random() * 9000)}`,
    enrolmentNo: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
    vehicleCategories: ['LMV'],
    classOfMode: '4-Wheeler (LMV)',
    llNo: '',
    llDate: '',
    testDate: '',
    licenceNotes: '',
    startDate: new Date().toISOString().split('T')[0],
    courseFees: 7500,
    paidAmount: 2500,
    paymentMethod: 'Cash',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const totalFees = parseFloat(formData.courseFees) || 0;
  const paidAmount = parseFloat(formData.paidAmount) || 0;
  const pendingBalance = Math.max(0, totalFees - paidAmount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryToggle = (code) => {
    setFormData((prev) => {
      const current = prev.vehicleCategories || [];
      const updated = current.includes(code)
        ? current.filter((c) => c !== code)
        : [...current, code];

      const safeUpdated = updated.length ? updated : ['LMV'];

      let suggestedFee = 7500;
      let newMode = '4-Wheeler (LMV)';
      if (safeUpdated.includes('LMV') && safeUpdated.includes('M/C')) {
        suggestedFee = 10000;
        newMode = 'Both (LMV + M/C)';
      } else if (safeUpdated.includes('M/C')) {
        suggestedFee = 4500;
        newMode = '2-Wheeler (M/C)';
      }

      return {
        ...prev,
        vehicleCategories: safeUpdated,
        classOfMode: newMode,
        courseFees: suggestedFee
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Student Name is required';
    if (!formData.phone1.trim()) newErrors.phone1 = 'Mobile Number is required';
    if (!formData.startDate) newErrors.startDate = 'Course Start Date is required';
    if (totalFees <= 0) newErrors.courseFees = 'Course Fees must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addStudent({
      ...formData,
      branch: settings.branchLocation || 'Main Branch - Bypass Road, Calicut',
      officeCode: settings.officeCode || 'KL11-CLT-01',
      courseFees: totalFees,
      paidAmount: paidAmount,
      pendingBalance: pendingBalance,
      status: pendingBalance === 0 ? 'Completed' : 'Active'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-4 pb-4 bg-[#070926]/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] my-auto max-h-[90vh] flex flex-col animate-scale-in">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <UserPlus className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0E113C]">Quick Add Student</h3>
              <p className="text-xs text-[#5A627A]">
                Fast enrollment for new driving student with physical record card details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 pb-28 space-y-4 overflow-y-auto scroll-smooth flex-1">
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Mohammed Faizal"
                className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border ${
                  errors.name ? 'border-red-400' : 'border-[#E2E8F0]'
                } text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-medium`}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Guardian Name
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="Father / Guardian Name"
                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Mobile Number 1 *
              </label>
              <input
                type="tel"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                placeholder="+91 98470 12345"
                className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border ${
                  errors.phone1 ? 'border-red-400' : 'border-[#E2E8F0]'
                } text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono`}
              />
              {errors.phone1 && <p className="text-[11px] text-red-500 mt-1">{errors.phone1}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Mobile Number 2
              </label>
              <input
                type="tel"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                placeholder="+91 94471 67890"
                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative z-30">
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Date of Birth
              </label>
              <CustomDatePicker
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Select Date of Birth"
                error={!!errors.dob}
                dropdownPosition="bottom"
              />
              {errors.dob && <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Complete Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House / Locality, Calicut"
                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
              />
            </div>
          </div>

          {/* Vehicle / Course Categories Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Vehicle Categories (Can select multiple)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'LMV – Car', code: 'LMV' },
                { label: 'M/C – Motorcycle', code: 'M/C' }
              ].map((c) => {
                const active = (formData.vehicleCategories || []).includes(c.code);
                return (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => handleCategoryToggle(c.code)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      active
                        ? 'bg-[#0E113C] text-[#FBA920] border-[#0E113C]'
                        : 'bg-[#F6F8FB] text-[#0E113C] border-[#E2E8F0] hover:bg-[#EEF0F8]'
                    }`}
                  >
                    {active ? '✓ ' : ''}{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Course Fee & Initial Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Course Fees (₹) *
              </label>
              <input
                type="number"
                name="courseFees"
                value={formData.courseFees}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Initial Payment (₹)
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Pending Balance
              </label>
              <div className="px-3.5 py-2 text-sm bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] font-black text-red-600">
                ₹{pendingBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs font-extrabold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#0E113C]" />
              <span>Complete Enrollment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
