import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import QuickAddStudentModal from '../modals/QuickAddStudentModal';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    toast,
    isQuickAddOpen,
    closeQuickAddModal,
    openQuickAddModal,
    openScheduleTestModal,
    openAddCarModal,
    openAddBikeModal,
    openAddPaymentModal,
    openRecordEntryModal
  } = useApp();

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#0E113C] flex overflow-x-hidden w-full max-w-full">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full lg:pl-64 transition-all overflow-x-hidden">
        {/* Top Navigation Bar */}
        <TopHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onQuickAdd={openQuickAddModal}
          onScheduleTest={openScheduleTestModal}
          onAddCarRecord={openAddCarModal}
          onAddBikeClass={openAddBikeModal}
          onRecordStudentFee={() => openAddPaymentModal(null, 'Regular Course Fees')}
          onRecordEntry={() => openRecordEntryModal('Cash Income', null)}
          onRecordPersonalEntry={() => openRecordEntryModal('Personal Income', null)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0 px-3 py-3 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Quick Add Student Modal */}
      <QuickAddStudentModal
        isOpen={isQuickAddOpen}
        onClose={closeQuickAddModal}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#0E113C] text-white px-4.5 py-3 rounded-xl shadow-dd-elevated border border-[#181C54] animate-slide-up ring-1 ring-white/10">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-[#FBA920] shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#FBA920] shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
