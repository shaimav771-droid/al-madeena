import React, { useState } from 'react';
import {
  Building2,
  User,
  Sliders,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_SETTINGS } from '../data/initialData';
import CustomSelect from '../components/common/CustomSelect';

export default function Settings() {
  const { settings, updateSettings, showToast } = useApp();

  const [formData, setFormData] = useState({
    schoolName: settings.schoolName || '',
    brandName: settings.brandName || 'DriveDesk',
    tagline: settings.tagline || 'Driving School Management',
    logoImage: settings.logoImage || '/logo.png',
    address: settings.address || '',
    contactNumber: settings.contactNumber || '',
    contactNumbers: settings.contactNumbers || settings.contactNumber || '',
    email: settings.email || '',
    licenseNumber: settings.licenseNumber || '',
    schoolRegistrationNo: settings.schoolRegistrationNo || settings.licenseNumber || '',
    officeCode: settings.officeCode || 'KL11-CLT-01',
    branchLocation: settings.branchLocation || 'Main Branch - Bypass Road, Calicut',
    taxNumber: settings.taxNumber || '',
    ownerName: settings.ownerName || '',
    ownerEmail: settings.ownerEmail || '',
    ownerPhone: settings.ownerPhone || '',
    currencySymbol: settings.currencySymbol || '₹',
    distanceUnit: settings.distanceUnit || 'KM',
    defaultPageSize: settings.defaultPageSize || 10
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newLogo = reader.result;
        setFormData((prev) => ({ ...prev, logoImage: newLogo }));
        updateSettings({ ...formData, logoImage: newLogo });
        showToast('Logo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Settings saved successfully!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all settings to default application profile?')) {
      setFormData(INITIAL_SETTINGS);
      updateSettings(INITIAL_SETTINGS);
      showToast('Settings reset to default values.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E113C]">
            System & School Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#5A627A]">
            Configure driving school branding, official regulatory details, and owner account
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#E2E8F0] text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: School Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <Building2 className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                1. Driving School Information
              </h3>
              <p className="text-xs text-[#5A627A]">
                Official legal organization credentials & address
              </p>
            </div>
          </div>

          {/* School Logo & Brand Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0]">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2 shrink-0 shadow-xs border border-[#E2E8F0] overflow-hidden">
              <img
                src={formData.logoImage || settings.logoImage || "/logo.png"}
                alt="School Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#0E113C]">
                {formData.schoolName || settings.schoolName || 'Al Madeena Driving School'} Logo
              </h4>
              <p className="text-xs text-[#5A627A]">
                Official driving school emblem displayed on sidebar, payment receipts, and reports.
              </p>
            </div>
            <label className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] text-[#0E113C] rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors shrink-0 text-center">
              <span>Change Logo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                School Legal Name *
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Registered School Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                School Official Phone *
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                School Official Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                School Registration Number (RTO) *
              </label>
              <input
                type="text"
                name="schoolRegistrationNo"
                value={formData.schoolRegistrationNo}
                onChange={handleChange}
                placeholder="RTO-KL-11-DS-2018-042"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                RTO Office Code *
              </label>
              <input
                type="text"
                name="officeCode"
                value={formData.officeCode}
                onChange={handleChange}
                placeholder="KL11-CLT-01"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Primary Branch / Office Location
              </label>
              <input
                type="text"
                name="branchLocation"
                value={formData.branchLocation}
                onChange={handleChange}
                placeholder="Main Branch - Bypass Road, Calicut"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                School Contact Numbers (Multiple)
              </label>
              <input
                type="text"
                name="contactNumbers"
                value={formData.contactNumbers}
                onChange={handleChange}
                placeholder="+91 98470 54321, +91 94471 23456"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                RTO Motor Driving School License #
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="RTO-KL-11-DS-2018-042"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                GST / Tax Registration Number
              </label>
              <input
                type="text"
                name="taxNumber"
                value={formData.taxNumber}
                onChange={handleChange}
                placeholder="GSTIN32ABCDE1234F1Z5"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-mono font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Owner / Administrator Account */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <User className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                2. Owner / Administrator Profile
              </h3>
              <p className="text-xs text-[#5A627A]">
                Primary administrative contact credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Proprietor / Owner Name *
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Owner Direct Email *
              </label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Owner Personal Mobile
              </label>
              <input
                type="text"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 font-mono font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: System Preferences */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <Sliders className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                3. System Regional & Table Preferences
              </h3>
              <p className="text-xs text-[#5A627A]">
                Formatting conventions and table pagination sizes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Currency Symbol
              </label>
              <CustomSelect
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                options={[
                  { value: '₹', label: '₹ (INR - Indian Rupee)' },
                  { value: '$', label: '$ (USD - Dollar)' },
                  { value: 'AED', label: 'AED (UAE Dirham)' },
                  { value: '£', label: '£ (GBP - Pound)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Distance Unit
              </label>
              <CustomSelect
                name="distanceUnit"
                value={formData.distanceUnit}
                onChange={handleChange}
                options={[
                  { value: 'KM', label: 'Kilometers (KM)' },
                  { value: 'Miles', label: 'Miles (Mi)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Default Pagination Size
              </label>
              <CustomSelect
                name="defaultPageSize"
                value={formData.defaultPageSize}
                onChange={handleChange}
                options={[
                  { value: 10, label: '10 records per page' },
                  { value: 20, label: '20 records per page' },
                  { value: 50, label: '50 records per page' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-7 py-3 text-xs sm:text-sm font-bold text-[#0E113C] bg-[#FBA920] hover:bg-[#E0910E] rounded-xl transition-all shadow-md shadow-[#FBA920]/25 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Check className="w-4 h-4 text-[#0E113C]" strokeWidth={2.8} />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
