import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SETTINGS,
  generateInitialStudents,
  INITIAL_DRIVING_RECORDS,
  INITIAL_BIKE_CLASSES,
  INITIAL_PAYMENTS,
  INITIAL_TEST_RECORDS,
  INITIAL_TRANSACTIONS,
  PREDEFINED_EXPENSE_HEADS
} from '../data/initialData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Load state from localStorage or initialize with seed data
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('drivedesk_students');
      return saved ? JSON.parse(saved) : generateInitialStudents();
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
      return generateInitialStudents();
    }
  });

  const [drivingRecords, setDrivingRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('drivedesk_driving_records');
      return saved ? JSON.parse(saved) : INITIAL_DRIVING_RECORDS;
    } catch (e) {
      console.error('Failed to load driving records from localStorage', e);
      return INITIAL_DRIVING_RECORDS;
    }
  });

  const [bikeClasses, setBikeClasses] = useState(() => {
    try {
      const saved = localStorage.getItem('drivedesk_bike_classes');
      return saved ? JSON.parse(saved) : INITIAL_BIKE_CLASSES;
    } catch (e) {
      console.error('Failed to load bike classes from localStorage', e);
      return INITIAL_BIKE_CLASSES;
    }
  });

  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('drivedesk_payments');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch (e) {
      console.error('Failed to load payments from localStorage', e);
      return INITIAL_PAYMENTS;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('drivedesk_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
      return INITIAL_TRANSACTIONS;
    }
  });

  const [customExpenseHeads, setCustomExpenseHeads] = useState(() => {
    try {
      const saved = localStorage.getItem('drivedesk_custom_expense_heads');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load custom expense heads from localStorage', e);
      return [];
    }
  });

  const [licenceTests, setLicenceTests] = useState(() => {
    try {
      const migrated = localStorage.getItem('drivedesk_retest_migrated_v2');
      if (!migrated) {
        localStorage.removeItem('drivedesk_licence_tests');
        localStorage.setItem('drivedesk_retest_migrated_v2', 'true');
        return INITIAL_TEST_RECORDS;
      }
      const saved = localStorage.getItem('drivedesk_licence_tests');
      return saved ? JSON.parse(saved) : INITIAL_TEST_RECORDS;
    } catch (e) {
      console.error('Failed to load licence tests from localStorage', e);
      return INITIAL_TEST_RECORDS;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('drivedesk_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          logoImage: parsed.logoImage || '/logo.png'
        };
      }
      return INITIAL_SETTINGS;
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
      return INITIAL_SETTINGS;
    }
  });

  const [toast, setToast] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isScheduleTestOpen, setIsScheduleTestOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [isAddBikeModalOpen, setIsAddBikeModalOpen] = useState(false);
  const [isRecordEntryOpen, setIsRecordEntryOpen] = useState(false);
  const [recordEntryType, setRecordEntryType] = useState('Cash Income');
  const [recordEntryStudentId, setRecordEntryStudentId] = useState(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedStudentForPay, setSelectedStudentForPay] = useState(null);
  const [defaultPaymentCategory, setDefaultPaymentCategory] = useState('Regular Course Fees');
  const [drivingActiveTab, setDrivingActiveTab] = useState('car');
  const [feesActiveTab, setFeesActiveTab] = useState('student_fees');
  const [studentFilteredCount, setStudentFilteredCount] = useState(null);

  const openQuickAddModal = () => setIsQuickAddOpen(true);
  const closeQuickAddModal = () => setIsQuickAddOpen(false);
  const openScheduleTestModal = () => setIsScheduleTestOpen(true);
  const closeScheduleTestModal = () => setIsScheduleTestOpen(false);
  const openAddCarModal = () => setIsAddCarModalOpen(true);
  const closeAddCarModal = () => setIsAddCarModalOpen(false);
  const openAddBikeModal = () => setIsAddBikeModalOpen(true);
  const closeAddBikeModal = () => setIsAddBikeModalOpen(false);
  const openRecordEntryModal = (type = 'Cash Income', studentId = null) => {
    setRecordEntryType(type);
    setRecordEntryStudentId(studentId);
    setIsRecordEntryOpen(true);
  };
  const closeRecordEntryModal = () => {
    setIsRecordEntryOpen(false);
    setRecordEntryStudentId(null);
  };
  const openAddPaymentModal = (studentId = null, category = 'Regular Course Fees') => {
    setSelectedStudentForPay(studentId);
    setDefaultPaymentCategory(category);
    setIsAddPaymentOpen(true);
  };
  const closeAddPaymentModal = () => {
    setIsAddPaymentOpen(false);
    setSelectedStudentForPay(null);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_students', JSON.stringify(students));
    } catch (e) {
      console.error('Could not save students', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_driving_records', JSON.stringify(drivingRecords));
    } catch (e) {
      console.error('Could not save driving records', e);
    }
  }, [drivingRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_bike_classes', JSON.stringify(bikeClasses));
    } catch (e) {
      console.error('Could not save bike classes', e);
    }
  }, [bikeClasses]);

  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_payments', JSON.stringify(payments));
    } catch (e) {
      console.error('Could not save payments', e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error('Could not save transactions', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_custom_expense_heads', JSON.stringify(customExpenseHeads));
    } catch (e) {
      console.error('Could not save custom expense heads', e);
    }
  }, [customExpenseHeads]);

  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_licence_tests', JSON.stringify(licenceTests));
    } catch (e) {
      console.error('Could not save licence tests', e);
    }
  }, [licenceTests]);

  useEffect(() => {
    try {
      localStorage.setItem('drivedesk_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Could not save settings', e);
    }
  }, [settings]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr && curr.id === id ? null : curr));
    }, 3500);
  };

  // Helper for Student Financial Calculations (Course Fees + Additional Bike Classes @ ₹300)
  const getStudentFinancials = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    const regularCourseFees = parseFloat(student.courseFees) || 0;
    const studentBikeClasses = bikeClasses.filter((b) => b.studentId === studentId);
    const additionalBikeClassesCount = studentBikeClasses.length;
    const additionalBikeCharges = additionalBikeClassesCount * 300;
    const totalPayable = regularCourseFees + additionalBikeCharges;

    const studentPayments = payments.filter((p) => p.studentId === studentId);
    const regularPaid = studentPayments
      .filter((p) => !p.paymentCategory || p.paymentCategory === 'Regular Course Fees')
      .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
    const bikePaid = studentPayments
      .filter((p) => p.paymentCategory === 'Additional Bike Class Fees')
      .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
    const otherPaid = studentPayments
      .filter((p) => p.paymentCategory === 'Other Charges')
      .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);

    const totalPaid = studentPayments.reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
    const pendingBalance = Math.max(0, totalPayable - totalPaid);
    const pendingRegular = Math.max(0, regularCourseFees - regularPaid);
    const pendingBike = Math.max(0, additionalBikeCharges - bikePaid);

    return {
      regularCourseFees,
      additionalBikeClassesCount,
      additionalBikeCharges,
      totalPayable,
      totalPaid,
      regularPaid,
      bikePaid,
      otherPaid,
      pendingBalance,
      pendingRegular,
      pendingBike,
      status: pendingBalance === 0 ? 'Completed' : (totalPaid > 0 ? 'Active' : (student.status || 'Active'))
    };
  };

  // Actions for Students
  const addStudent = (studentData) => {
    const totalFees = parseFloat(studentData.courseFees) || 0;
    const paidAmount = parseFloat(studentData.paidAmount) || 0;
    const pendingBalance = Math.max(0, totalFees - paidAmount);

    const padCount = String(students.length + 1).padStart(3, '0');
    const newId = `DD-2026-${padCount}`;

    // Normalize vehicle categories
    let categories = studentData.vehicleCategories || [];
    if (!categories.length && studentData.classOfMode) {
      if (studentData.classOfMode.includes('Both')) categories = ['LMV', 'M/C'];
      else if (studentData.classOfMode.includes('Heavy')) categories = ['Heavy Vehicle'];
      else if (studentData.classOfMode.includes('2-Wheeler')) categories = ['M/C'];
      else categories = ['LMV'];
    }

    const newStudent = {
      ...studentData,
      id: newId,
      guardianName: studentData.guardianName || '',
      branch: studentData.branch || settings.branchLocation || 'Main Branch - Bypass Road, Calicut',
      officeCode: studentData.officeCode || settings.officeCode || 'KL11-CLT-01',
      llNo: studentData.llNo || '',
      llDate: studentData.llDate || '',
      testDate: studentData.testDate || '',
      licenceNotes: studentData.licenceNotes || '',
      vehicleCategories: categories,
      courseFees: totalFees,
      paidAmount: paidAmount,
      pendingBalance: pendingBalance,
      status: studentData.status || (pendingBalance === 0 ? 'Completed' : 'Active'),
      startDate: studentData.startDate || new Date().toISOString().split('T')[0],
      photo: studentData.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studentData.name)}&backgroundColor=252525&textColor=ffffff`,
      documents: studentData.documents || [
        { id: `doc-init-1`, name: 'Aadhaar Verification', type: 'PDF', size: '1.1 MB', uploadDate: new Date().toISOString().split('T')[0] }
      ]
    };

    setStudents((prev) => [newStudent, ...prev]);

    // If paid amount was recorded, automatically create corresponding transaction
    if (paidAmount > 0) {
      const newPayment = {
        id: `TXN-2026-${String(payments.length + 801).padStart(3, '0')}`,
        studentId: newId,
        studentName: studentData.name,
        amountPaid: paidAmount,
        paymentCategory: 'Regular Course Fees',
        paymentDate: studentData.startDate || new Date().toISOString().split('T')[0],
        paymentMethod: studentData.paymentMethod || 'Cash',
        referenceNo: studentData.referenceNo || `RCP-AUTO-${Date.now().toString().slice(-4)}`,
        notes: 'Initial course enrollment payment.'
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    showToast(`Student ${newStudent.name} (${newId}) registered successfully!`);
    return newStudent;
  };

  const updateStudent = (id, updatedFields) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === id) {
          const courseFees = updatedFields.courseFees !== undefined ? parseFloat(updatedFields.courseFees) : student.courseFees;
          const paidAmount = updatedFields.paidAmount !== undefined ? parseFloat(updatedFields.paidAmount) : student.paidAmount;
          const pendingBalance = Math.max(0, courseFees - paidAmount);

          return {
            ...student,
            ...updatedFields,
            courseFees,
            paidAmount,
            pendingBalance
          };
        }
        return student;
      })
    );
    showToast('Student information updated successfully.');
  };

  const deleteStudent = (id) => {
    const studentToDelete = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(`Student ${studentToDelete?.name || id} deleted.`);
  };

  // Actions for Car & Heavy Driving Records
  const addDrivingRecord = (recordData) => {
    const student = students.find((s) => s.id === recordData.studentId);
    const vehicle = recordData.vehicleModel || recordData.vehicleDetails || 'Maruti Suzuki Swift';
    const newRecord = {
      ...recordData,
      id: `DR-2026-${String(drivingRecords.length + 101).padStart(3, '0')}`,
      studentName: student ? student.name : recordData.studentName,
      category: recordData.category || (recordData.classOfMode?.includes('Heavy') ? 'Heavy Vehicle' : 'LMV'),
      date: recordData.date || new Date().toISOString().split('T')[0],
      startTime: recordData.startTime || '08:00 AM',
      endTime: recordData.endTime || '09:00 AM',
      kmTravelled: parseFloat(recordData.kmTravelled) || 0,
      vehicleModel: vehicle,
      vehicleDetails: vehicle,
      vehicleNumber: recordData.vehicleNumber || 'KL-11-AB-1234',
      practiceDetails: recordData.practiceDetails || recordData.remarks || 'Practical driving session completed.',
      traineeSignature: recordData.traineeSignature || (student ? student.name : 'Trainee'),
      instructor: recordData.instructor || 'Rajesh K.',
      instructorSignature: recordData.instructorSignature || (recordData.instructor || 'Rajesh K.'),
      remarks: recordData.remarks || ''
    };

    setDrivingRecords((prev) => [newRecord, ...prev]);
    showToast(`Driving record added for ${newRecord.studentName}!`);
    return newRecord;
  };

  const updateDrivingRecord = (id, updatedFields) => {
    setDrivingRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updatedFields } : rec))
    );
    showToast('Driving record updated successfully.');
  };

  const deleteDrivingRecord = (id) => {
    setDrivingRecords((prev) => prev.filter((rec) => rec.id !== id));
    showToast('Driving record removed.');
  };

  // Actions for Bike Classes (Separate Logbook & ₹300 per additional class)
  const addBikeClass = (bikeData) => {
    const student = students.find((s) => s.id === bikeData.studentId);
    const newClass = {
      ...bikeData,
      id: `BC-2026-${String(bikeClasses.length + 501).padStart(3, '0')}`,
      studentName: student ? student.name : bikeData.studentName,
      date: bikeData.date || new Date().toISOString().split('T')[0],
      fromTime: bikeData.fromTime || '07:00 AM',
      toTime: bikeData.toTime || '07:45 AM',
      durationMinutes: parseInt(bikeData.durationMinutes) || 45,
      kmTravelled: parseFloat(bikeData.kmTravelled) || 0,
      vehicleDetails: bikeData.vehicleDetails || 'Hero Splendor Plus',
      vehicleNumber: bikeData.vehicleNumber || 'KL-11-BK-1102',
      traineeSignature: bikeData.traineeSignature || (student ? student.name : 'Trainee'),
      instructor: bikeData.instructor || 'Manoj P.',
      instructorSignature: bikeData.instructorSignature || (bikeData.instructor || 'Manoj P.'),
      remarks: bikeData.remarks || ''
    };

    setBikeClasses((prev) => [newClass, ...prev]);
    showToast(`Bike class logged for ${newClass.studentName}! (+₹300 charge applied)`);
    return newClass;
  };

  const updateBikeClass = (id, updatedFields) => {
    setBikeClasses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Bike class entry updated successfully.');
  };

  const deleteBikeClass = (id) => {
    setBikeClasses((prev) => prev.filter((item) => item.id !== id));
    showToast('Bike class entry deleted. Associated ₹300 charge updated.');
  };

  // Actions for Payments & Financial Ledger
  const addPayment = (paymentData) => {
    const amount = parseFloat(paymentData.amountPaid) || 0;
    const category = paymentData.paymentCategory || 'Regular Course Fees';
    const method = paymentData.paymentMethod || paymentData.paymentMode || 'Cash';
    const isCash = method === 'Cash';
    const txnType = isCash ? 'Cash Income' : 'Bank Income';

    const newTxnId = paymentData.id || `TXN-2026-${String(payments.length + 801).padStart(3, '0')}`;
    const date = paymentData.paymentDate || new Date().toISOString().split('T')[0];

    const student = students.find((s) => s.id === paymentData.studentId);
    const realName = paymentData.realName || paymentData.studentName || (student ? student.name : 'Student');
    const bankingName = isCash ? '' : (paymentData.bankingName || '');

    const newTxn = {
      ...paymentData,
      id: newTxnId,
      studentId: paymentData.studentId,
      studentName: realName,
      realName: realName,
      bankingName: bankingName,
      amountPaid: amount,
      paymentCategory: category,
      paymentDate: date,
      paymentMethod: method,
      paymentMode: method
    };

    // Update student's paidAmount
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === paymentData.studentId) {
          const newPaid = (student.paidAmount || 0) + amount;
          const fin = getStudentFinancials(student.id);
          const totalPayable = fin ? fin.totalPayable : (student.courseFees || 0);
          const newPending = Math.max(0, totalPayable - newPaid);
          const newStatus = newPending === 0 ? 'Completed' : student.status;
          return {
            ...student,
            paidAmount: newPaid,
            pendingBalance: newPending,
            status: newStatus
          };
        }
        return student;
      })
    );

    setPayments((prev) => [newTxn, ...prev]);

    // Requirement 6: Auto-sync into School Cash & Bank ledger
    const newLedgerEntry = {
      id: newTxnId,
      type: txnType,
      date: date,
      amount: amount,
      paymentMode: method,
      category: 'Student Fee',
      expenseHead: '',
      realName: realName,
      bankingName: bankingName,
      studentId: paymentData.studentId,
      referenceNo: paymentData.referenceNo || '',
      notes: paymentData.notes || `${category} paid by ${realName}`,
      createdAt: new Date().toISOString()
    };

    setTransactions((prev) => [newLedgerEntry, ...prev.filter((t) => t.id !== newTxnId)]);

    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} (${category}) recorded for ${realName}!`);
    return newTxn;
  };

  const addTransaction = (txnData) => {
    const padCount = String(transactions.length + 901).padStart(3, '0');
    const newTxnId = txnData.id || `TXN-2026-${padCount}`;
    const amount = parseFloat(txnData.amount) || 0;
    const date = txnData.date || new Date().toISOString().split('T')[0];
    const isCash = txnData.paymentMode === 'Cash';

    const newTxn = {
      ...txnData,
      id: newTxnId,
      amount,
      date,
      paymentMode: txnData.paymentMode || (txnData.type.startsWith('Cash') ? 'Cash' : 'GPay / UPI'),
      realName: txnData.realName || '',
      bankingName: isCash ? '' : (txnData.bankingName || ''),
      expenseHead: txnData.expenseHead || '',
      category: txnData.category || (txnData.type.includes('Expense') ? 'Expense' : 'Income'),
      createdAt: new Date().toISOString()
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // If transaction is linked to a student and is Income, also sync to Student Fees & balance
    if (txnData.studentId && (txnData.type === 'Cash Income' || txnData.type === 'Bank Income')) {
      const student = students.find((s) => s.id === txnData.studentId);
      const category = txnData.paymentCategory || txnData.subCategory || 'Regular Course Fees';
      const newPayment = {
        id: newTxnId,
        studentId: txnData.studentId,
        studentName: student ? student.name : txnData.realName,
        realName: txnData.realName || (student ? student.name : ''),
        bankingName: newTxn.bankingName,
        amountPaid: amount,
        paymentCategory: category,
        paymentDate: date,
        paymentMethod: newTxn.paymentMode,
        paymentMode: newTxn.paymentMode,
        referenceNo: txnData.referenceNo || '',
        notes: txnData.notes || `${category} payment`
      };

      setStudents((prev) =>
        prev.map((st) => {
          if (st.id === txnData.studentId) {
            const newPaid = (st.paidAmount || 0) + amount;
            const fin = getStudentFinancials(st.id);
            const totalPayable = fin ? fin.totalPayable : (st.courseFees || 0);
            const newPending = Math.max(0, totalPayable - newPaid);
            const newStatus = newPending === 0 ? 'Completed' : st.status;
            return {
              ...st,
              paidAmount: newPaid,
              pendingBalance: newPending,
              status: newStatus
            };
          }
          return st;
        })
      );

      setPayments((prev) => [newPayment, ...prev.filter((p) => p.id !== newTxnId)]);
    }

    showToast(`Transaction ${newTxn.type} of ₹${amount.toLocaleString('en-IN')} recorded successfully!`);
    return newTxn;
  };

  const updateTransaction = (id, updatedFields) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    showToast('Transaction updated successfully.');
  };

  const deleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // If target was a student fee payment, revert student's balance
    if (target && target.studentId && (target.type === 'Cash Income' || target.type === 'Bank Income')) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      setStudents((prev) =>
        prev.map((st) => {
          if (st.id === target.studentId) {
            const newPaid = Math.max(0, (st.paidAmount || 0) - (target.amount || 0));
            const fin = getStudentFinancials(st.id);
            const totalPayable = fin ? fin.totalPayable : (st.courseFees || 0);
            const newPending = Math.max(0, totalPayable - newPaid);
            return {
              ...st,
              paidAmount: newPaid,
              pendingBalance: newPending,
              status: newPending === 0 ? 'Completed' : 'Active'
            };
          }
          return st;
        })
      );
    }
    showToast('Transaction removed.');
  };

  const addCustomExpenseHead = (headName) => {
    const trimmed = headName.trim();
    if (!trimmed) return;
    setCustomExpenseHeads((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed];
    });
    showToast(`Custom expense head "${trimmed}" added.`);
  };

  // Actions for Settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully.');
  };

  // Actions for Licence Tests & Retests (LL and DL - LMV & M/C)
  const addTestRecord = (testData) => {
    const student = students.find((s) => s.id === testData.studentId);
    const existingForTrack = licenceTests.filter(
      (t) =>
        t.studentId === testData.studentId &&
        t.testType === testData.testType &&
        (testData.testType === 'LL' || t.category === testData.category)
    );
    const attemptNumber = testData.attemptNumber || (existingForTrack.length + 1);
    const attemptType = testData.attemptType || (attemptNumber > 1 ? 'Retest' : 'Original');

    const newRecord = {
      id: `TST-2026-${String(licenceTests.length + 101).padStart(3, '0')}`,
      studentId: testData.studentId,
      studentName: student ? student.name : testData.studentName,
      testType: testData.testType || 'LL',
      category: testData.category || 'LMV',
      attemptNumber: attemptNumber,
      attemptType: attemptType,
      testDate: testData.testDate || new Date().toISOString().split('T')[0],
      result: testData.result || 'Pending',
      retestDate: testData.retestDate || null,
      retestStatus: testData.retestStatus || 'None',
      remarks: testData.remarks || '',
      createdAt: new Date().toISOString()
    };

    setLicenceTests((prev) => [newRecord, ...prev]);
    showToast(`${newRecord.testType} Test recorded for ${newRecord.studentName}!`);
    return newRecord;
  };

  const updateTestRecord = (id, updatedFields) => {
    setLicenceTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    showToast('Test record updated successfully.');
  };

  const scheduleRetest = (parentTestId, { retestDate, remarks }) => {
    let parentStudentName = 'Student';
    let resultAttempt = null;

    setLicenceTests((prev) => {
      const targetTest = prev.find((t) => t.id === parentTestId);
      if (!targetTest) return prev;

      parentStudentName = targetTest.studentName;

      // Determine next attempt badge number:
      // If previous attemptType was 'Retest', increment: Retest #1 -> Retest #2
      // If previous attemptType was 'Original' (or not 'Retest'), it becomes Retest #1
      const nextAttemptNumber = targetTest.attemptType === 'Retest'
        ? (targetTest.attemptNumber || 1) + 1
        : 1;

      return prev.map((t) => {
        if (t.id === parentTestId) {
          resultAttempt = {
            ...t,
            testDate: retestDate,
            result: 'Pending',
            attemptType: 'Retest',
            attemptNumber: nextAttemptNumber,
            retestDate: null,
            retestStatus: 'None',
            remarks: remarks || t.remarks
          };
          return resultAttempt;
        }
        return t;
      });
    });

    showToast(`Retest #${resultAttempt?.attemptNumber || 1} scheduled for ${parentStudentName} on ${retestDate}!`);
    return resultAttempt;
  };

  const deleteTestRecord = (id) => {
    setLicenceTests((prev) => prev.filter((t) => t.id !== id));
    showToast('Test record removed.');
  };

  const getStudentTests = (studentId) => {
    return licenceTests.filter((t) => t.studentId === studentId);
  };

  // Computed summary metrics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const completedStudents = students.filter((s) => s.status === 'Completed').length;
  const inactiveStudents = students.filter((s) => s.status === 'Inactive').length;

  const totalRegularCourseFees = students.reduce((sum, s) => sum + (parseFloat(s.courseFees) || 0), 0);
  const totalBikeCharges = bikeClasses.length * 300;
  const totalPayableAll = totalRegularCourseFees + totalBikeCharges;

  const totalFeesCollected = payments.reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
  const regularCourseFeeCollected = payments
    .filter((p) => !p.paymentCategory || p.paymentCategory === 'Regular Course Fees')
    .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);
  const additionalBikeFeeCollected = payments
    .filter((p) => p.paymentCategory === 'Additional Bike Class Fees')
    .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0);

  const pendingFees = Math.max(0, totalPayableAll - totalFeesCollected);
  const totalKmDrivenCar = drivingRecords.reduce((sum, r) => sum + (parseFloat(r.kmTravelled) || 0), 0);
  const totalKmDrivenBike = bikeClasses.reduce((sum, b) => sum + (parseFloat(b.kmTravelled) || 0), 0);
  const totalKmDriven = totalKmDrivenCar + totalKmDrivenBike;

  // Licence Test Metrics
  const todayDateStr = new Date().toISOString().split('T')[0];
  const upcomingTestsCount = licenceTests.filter(
    (t) => t.testDate > todayDateStr && t.result === 'Pending' && t.attemptType === 'Original'
  ).length;
  const upcomingRetestsCount = licenceTests.filter(
    (t) => t.testDate > todayDateStr && t.result === 'Pending' && t.attemptType === 'Retest'
  ).length;
  const pendingResultsCount = licenceTests.filter((t) => t.result === 'Pending').length;
  const totalTestsPassed = licenceTests.filter((t) => t.result === 'Passed').length;
  const totalTestsFailed = licenceTests.filter((t) => t.result === 'Failed').length;
  const todayTestsCount = licenceTests.filter((t) => t.testDate === todayDateStr && t.result === 'Pending').length;
  const overdueTestsCount = licenceTests.filter((t) => t.testDate < todayDateStr && t.result === 'Pending').length;

  // Financial metrics for School Cash & Bank and Personal Accounts
  const schoolTransactions = transactions.filter((t) => !t.type.startsWith('Personal'));
  const cashIncome = schoolTransactions
    .filter((t) => t.type === 'Cash Income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const cashExpense = schoolTransactions
    .filter((t) => t.type === 'Cash Expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const cashInHand = cashIncome - cashExpense;

  const bankIncome = schoolTransactions
    .filter((t) => t.type === 'Bank Income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const bankExpense = schoolTransactions
    .filter((t) => t.type === 'Bank Expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const bankBalance = bankIncome - bankExpense;

  const totalIncome = cashIncome + bankIncome;
  const totalExpense = cashExpense + bankExpense;
  const netBalance = totalIncome - totalExpense;

  // Today's Cash Box widget metrics
  const todayCashIn = schoolTransactions
    .filter((t) => t.type === 'Cash Income' && t.date === todayDateStr)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const todayCashOut = schoolTransactions
    .filter((t) => t.type === 'Cash Expense' && t.date === todayDateStr)
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const todayNetCash = todayCashIn - todayCashOut;

  // Personal Account metrics
  const personalTransactions = transactions.filter((t) => t.type.startsWith('Personal'));
  const personalIncome = personalTransactions
    .filter((t) => t.type === 'Personal Income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const personalExpense = personalTransactions
    .filter((t) => t.type === 'Personal Expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const personalNetBalance = personalIncome - personalExpense;

  return (
    <AppContext.Provider
      value={{
        students,
        studentFilteredCount,
        setStudentFilteredCount,
        drivingRecords,
        bikeClasses,
        payments,
        transactions,
        setTransactions,
        customExpenseHeads,
        licenceTests,
        settings,
        toast,
        showToast,
        isQuickAddOpen,
        setIsQuickAddOpen,
        openQuickAddModal,
        closeQuickAddModal,
        isScheduleTestOpen,
        setIsScheduleTestOpen,
        openScheduleTestModal,
        closeScheduleTestModal,
        isAddCarModalOpen,
        setIsAddCarModalOpen,
        openAddCarModal,
        closeAddCarModal,
        isAddBikeModalOpen,
        setIsAddBikeModalOpen,
        openAddBikeModal,
        closeAddBikeModal,
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
        drivingActiveTab,
        setDrivingActiveTab,
        feesActiveTab,
        setFeesActiveTab,
        addStudent,
        updateStudent,
        deleteStudent,
        addDrivingRecord,
        updateDrivingRecord,
        deleteDrivingRecord,
        addBikeClass,
        updateBikeClass,
        deleteBikeClass,
        getStudentFinancials,
        addPayment,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCustomExpenseHead,
        addTestRecord,
        updateTestRecord,
        scheduleRetest,
        deleteTestRecord,
        getStudentTests,
        updateSettings,
        financials: {
          cashInHand,
          bankBalance,
          totalIncome,
          totalExpense,
          netBalance,
          cashIncome,
          cashExpense,
          bankIncome,
          bankExpense,
          todayCashIn,
          todayCashOut,
          todayNetCash,
          personalIncome,
          personalExpense,
          personalNetBalance
        },
        stats: {
          totalStudents,
          activeStudents,
          completedStudents,
          inactiveStudents,
          totalRegularCourseFees,
          totalBikeCharges,
          totalPayableAll,
          pendingFees,
          totalFeesCollected,
          regularCourseFeeCollected,
          additionalBikeFeeCollected,
          cashInHand,
          bankBalance,
          totalIncome,
          totalExpense,
          netBalance,
          todayCashIn,
          todayCashOut,
          todayNetCash,
          personalIncome,
          personalExpense,
          personalNetBalance,
          totalKmDrivenCar,
          totalKmDrivenBike,
          totalKmDriven,
          totalBikeClassesCount: bikeClasses.length,
          totalPaymentsCount: payments.length,
          totalTransactionsCount: transactions.length,
          upcomingTestsCount,
          upcomingRetestsCount,
          pendingResultsCount,
          totalTestsPassed,
          totalTestsFailed,
          todayTestsCount,
          overdueTestsCount,
          totalTestsCount: licenceTests.length
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
