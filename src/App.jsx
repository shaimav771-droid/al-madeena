import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import StudentProfile from './pages/StudentProfile';
import DrivingRecords from './pages/DrivingRecords';
import FeesAndPayments from './pages/FeesAndPayments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import TestManagement from './pages/TestManagement';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* Screen 1: Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Screen 2: Students */}
            <Route path="students" element={<Students />} />

            {/* Screen 3: Add New Student */}
            <Route path="students/add" element={<AddStudent />} />

            {/* Screen 4: Student Profile */}
            <Route path="students/:id" element={<StudentProfile />} />

            {/* Screen 5: Test & Retest Management */}
            <Route path="tests" element={<TestManagement />} />

            {/* Screen 6: Driving Records */}
            <Route path="driving-records" element={<DrivingRecords />} />

            {/* Screen 7: Fees & Payments */}
            <Route path="fees" element={<FeesAndPayments />} />

            {/* Screen 8: Reports */}
            <Route path="reports" element={<Reports />} />

            {/* Screen 9: Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
