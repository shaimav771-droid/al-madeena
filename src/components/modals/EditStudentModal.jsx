import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CLASS_MODES, VEHICLE_CATEGORIES } from '../../data/initialData';
import CustomSelect from '../common/CustomSelect';

export default function EditStudentModal({ isOpen, onClose, student }) {
  const { updateStudent, settings } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    guardianName: '',
    dob: '',
    address: '',
    phone1: '',
    phone2: '',
    applicationNo: '',
    registrationNo: '',
    enrolmentNo: '',
    branch: '',
    officeCode: '',
    llNo: '',
    llDate: '',
    testDate: '',
    licenceNotes: '',
    vehicleCategories: ['LMV'],
    classOfMode: '4-Wheeler (LMV)',
    startDate: '',
    courseFees: 7500,
    paidAmount: 0,
    status: 'Active',
    notes: ''
  });

  useEffect(() => {
    if (student) {
      const cats = student.vehicleCategories && student.vehicleCategories.length
        ? student.vehicleCategories
        : (student.classOfMode?.includes('Both')
            ? ['LMV', 'M/C']
            : (student.classOfMode?.includes('Heavy') ? ['Heavy Vehicle'] : (student.classOfMode?.includes('2-Wheeler') ? ['M/C'] : ['LMV'])));

      setFormData({
        name: student.name || '',
        guardianName: student.guardianName || '',
        dob: student.dob || '',
        address: student.address || '',
        phone1: student.phone1 || '',
        phone2: student.phone2 || '',
        applicationNo: student.applicationNo || '',
        registrationNo: student.registrationNo || '',
        enrolmentNo: student.enrolmentNo || '',
        branch: student.branch || settings.branchLocation || 'Main Branch - Bypass Road, Calicut',
        officeCode: student.officeCode || settings.officeCode || 'KL11-CLT-01',
        llNo: student.llNo || '',
        llDate: student.llDate || '',
        testDate: student.testDate || '',
        licenceNotes: student.licenceNotes || '',
        vehicleCategories: cats,
        classOfMode: student.classOfMode || '4-Wheeler (LMV)',
        startDate: student.startDate || '',
        courseFees: student.courseFees || 7500,
        paidAmount: student.paidAmount || 0,
        status: student.status || 'Active',
        notes: student.notes || ''
      });
    }
  }, [student, isOpen, settings]);

  if (!isOpen || !student) return null;

  const totalFees = parseFloat(formData.courseFees) || 0;
  const paidAmount = parseFloat(formData.paidAmount) || 0;
  const pendingBalance = Math.max(0, totalFees - paidAmount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (catCode) => {
    setFormData((prev) => {
      const current = prev.vehicleCategories || [];
      const updated = current.includes(catCode)
        ? current.filter((c) => c !== catCode)
        : [...current, catCode];

      // Keep classOfMode synced
      let newMode = '4-Wheeler (LMV)';
      if (updated.includes('LMV') && updated.includes('M/C')) {
        newMode = 'Both (LMV + M/C)';
      } else if (updated.includes('M/C')) {
        newMode = '2-Wheeler (M/C)';
      } else {
        newMode = '4-Wheeler (LMV)';
      }

      return {
        ...prev,
        vehicleCategories: updated.length ? updated : ['LMV'],
        classOfMode: newMode
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateStudent(student.id, {
      ...formData,
      courseFees: totalFees,
      paidAmount: paidAmount,
      pendingBalance: pendingBalance,
      status: pendingBalance === 0 ? 'Completed' : formData.status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-8 animate-scale-in">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <Edit3 className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Edit Student — {student.name}
              </h3>
              <p className="text-xs text-[#5A627A]">ID: {student.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Personal Information */}
          <div>
            <h4 className="text-xs font-black text-[#0E113C] uppercase tracking-wider mb-2 pb-1 border-b border-[#E2E8F0]">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Row 1: Student Name * (left) and Guardian Name (right) */}
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold"
                />
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
                  placeholder="Father / Husband / Guardian"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>

              {/* Row 2: Mobile Number 1 * (left) and Mobile Number 2 (right) */}
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Mobile Number 1 *
                </label>
                <input
                  type="text"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Mobile Number 2
                </label>
                <input
                  type="text"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleChange}
                  placeholder="Secondary phone..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
                />
              </div>

              {/* Row 3: Complete Address (left) and Date of Birth (right) */}
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Complete Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>
            </div>
          </div>

          {/* Registration Information */}
          <div>
            <h4 className="text-xs font-black text-[#0E113C] uppercase tracking-wider mb-2 pb-1 border-b border-[#E2E8F0]">
              Registration Identifiers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Application No (APP NO)
                </label>
                <input
                  type="text"
                  name="applicationNo"
                  value={formData.applicationNo}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Registration No (REG NO)
                </label>
                <input
                  type="text"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Enrolment No
                </label>
                <input
                  type="text"
                  name="enrolmentNo"
                  value={formData.enrolmentNo}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Vehicle / Course Categories (Multi-select) */}
          <div>
            <h4 className="text-xs font-black text-[#0E113C] uppercase tracking-wider mb-2 pb-1 border-b border-[#E2E8F0]">
              Vehicle / Course Categories (Select multiple)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'LMV', label: 'LMV – Light Motor Vehicle', code: 'LMV' },
                { id: 'MC', label: 'M/C – Motorcycle', code: 'M/C' }
              ].map((cat) => {
                const isSelected = (formData.vehicleCategories || []).includes(cat.code);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-sm'
                        : 'bg-[#F6F8FB] text-[#0E113C] border-[#E2E8F0] hover:bg-[#EEF0F8]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(cat.code)}
                      className="rounded border-[#94A3B8] text-[#FBA920] focus:ring-[#FBA920]"
                    />
                    <span className="text-xs font-bold">{cat.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Licence Details */}
          <div>
            <h4 className="text-xs font-black text-[#0E113C] uppercase tracking-wider mb-2 pb-1 border-b border-[#E2E8F0]">
              Licence Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  LL Number (Learner's Licence)
                </label>
                <input
                  type="text"
                  name="llNo"
                  value={formData.llNo}
                  onChange={handleChange}
                  placeholder="KL11/2026/0014285"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  LL Date
                </label>
                <input
                  type="date"
                  name="llDate"
                  value={formData.llDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Driving Test Date
                </label>
                <input
                  type="date"
                  name="testDate"
                  value={formData.testDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Licence Additional Notes
                </label>
                <input
                  type="text"
                  name="licenceNotes"
                  value={formData.licenceNotes}
                  onChange={handleChange}
                  placeholder="Notes regarding medical cert, test appointment, ground slot..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>
            </div>
          </div>

          {/* Fees & Status */}
          <div>
            <h4 className="text-xs font-black text-[#0E113C] uppercase tracking-wider mb-2 pb-1 border-b border-[#E2E8F0]">
              Course Fees & Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Course Fees (₹)
                </label>
                <input
                  type="number"
                  name="courseFees"
                  value={formData.courseFees}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Paid Amount (₹)
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E113C] mb-1">
                  Status
                </label>
                <CustomSelect
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                  options={['Active', 'Completed', 'Inactive']}
                  className="py-2"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
