// Initial realistic seed data for DriveDesk Driving School Management System

export const PREDEFINED_EXPENSE_HEADS = [
  "Fuel - Diesel",
  "Fuel - Petrol",
  "Instructor Salary",
  "Office Staff Salary",
  "Vehicle Service & Maintenance",
  "Vehicle Spare Parts & Tyres",
  "Vehicle Insurance",
  "Vehicle Tax & Fitness / Pollution",
  "RTO / Parivahan Fee",
  "LL / DL Application & Test Fee",
  "Track / Ground Rent",
  "Office Room Rent",
  "Electricity & Water Bill",
  "Internet & Phone Recharge",
  "Printing, Books & Stationery",
  "Tea, Snacks & Refreshments",
  "Marketing & Flex / Ads",
  "Vehicle EMI / Loan",
  "Cleaning & Washing",
  "Miscellaneous / Other Expense"
];

export const INITIAL_SETTINGS = {
  schoolName: "Al Madeena Driving School",
  brandName: "DriveDesk",
  tagline: "Driving School Management",
  address: "Al Madeena Complex, Bypass Road, Calicut, Kerala - 673004",
  contactNumber: "+91 98470 54321",
  contactNumbers: "+91 98470 54321, +91 94471 23456",
  email: "admin@drivedesk.in",
  logoText: "Al Madeena",
  logoImage: "/logo.png",
  ownerName: "Abdul Rahman",
  ownerEmail: "rahman@almadeena.com",
  ownerPhone: "+91 94471 23456",
  currencySymbol: "₹",
  distanceUnit: "KM",
  defaultPageSize: 10,
  taxNumber: "GSTIN32ABCDE1234F1Z5",
  licenseNumber: "RTO-KL-11-DS-2018-042",
  schoolRegistrationNo: "RTO-KL-11-DS-2018-042",
  officeCode: "KL11-CLT-01",
  branchLocation: "Main Branch - Bypass Road, Calicut",
  branches: [
    { id: "b1", name: "Main Branch - Bypass Road", location: "Al Madeena Complex, Bypass Road, Calicut - 673004", phone: "+91 98470 54321", code: "KL11-CLT-01" },
    { id: "b2", name: "City Office - Mavoor Road", location: "Near Mofussil Bus Stand, Mavoor Road, Calicut - 673001", phone: "+91 94471 23456", code: "KL11-CLT-02" },
    { id: "b3", name: "Feroke Sub-Branch", location: "Main Bazar, Feroke, Calicut - 673631", phone: "+91 98951 88990", code: "KL11-FRK-03" }
  ]
};

// Vehicle Categories
export const VEHICLE_CATEGORIES = [
  { id: "LMV", label: "LMV – Light Motor Vehicle", code: "LMV", description: "Cars, Jeeps, Light Motor Vehicles" },
  { id: "MC", label: "M/C – Motorcycle", code: "M/C", description: "Two-Wheeler (Motorcycle with/without gear)" }
];

// Class of Rule
export const CLASS_MODES = [
  "4-Wheeler (LMV)",
  "2-Wheeler (M/C)",
  "Both (LMV + M/C)"
];

// Instructors
export const INSTRUCTORS = [
  "Rajesh K.",
  "Suresh Babu",
  "Balan N.",
  "Manoj P."
];

// Vehicle Models
export const VEHICLE_MODELS = [
  "Maruti Swift",
  "Maruti Suzuki Swift",
  "Hyundai i10 Magna",
  "Honda Activa",
  "Hero Splendor Plus",
  "Tata 407 Heavy Truck"
];

// Generate 250 realistic student records
export function generateInitialStudents() {
  const sampleStudents = [
    {
      id: "DD-2026-001",
      name: "Mohammed Faizal",
      dob: "1998-05-14",
      address: "Rose Villa, Eranhipalam, Calicut",
      phone1: "+91 98951 23401",
      phone2: "+91 98951 23402",
      applicationNo: "APP-2026-1042",
      registrationNo: "REG-KL11-8921",
      enrolmentNo: "ENR-0941",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2026-03-01",
      courseFees: 7500,
      paidAmount: 7500,
      pendingBalance: 0,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      notes: "Attentive student, learning manual gear transmission.",
      documents: [
        { id: "doc-1", name: "Aadhaar Card Copy", type: "PDF", size: "1.2 MB", uploadDate: "2026-03-01" },
        { id: "doc-2", name: "Learner's License Form 2", type: "PDF", size: "850 KB", uploadDate: "2026-03-02" },
        { id: "doc-3", name: "Medical Certificate Form 1A", type: "PDF", size: "640 KB", uploadDate: "2026-03-01" }
      ]
    },
    {
      id: "DD-2026-002",
      name: "Sneha Nair",
      dob: "2001-11-20",
      address: "Sree Nilayam, Mavoor Road, Calicut",
      phone1: "+91 94472 88410",
      phone2: "+91 94472 88411",
      applicationNo: "APP-2026-1043",
      registrationNo: "REG-KL11-8922",
      enrolmentNo: "ENR-0942",
      classOfMode: "Both (LMV + MCWG)",
      startDate: "2026-03-05",
      courseFees: 10000,
      paidAmount: 6000,
      pendingBalance: 4000,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      notes: "Requires extra parking and reverse practice.",
      documents: [
        { id: "doc-4", name: "Aadhaar Card Copy", type: "PDF", size: "1.1 MB", uploadDate: "2026-03-05" },
        { id: "doc-5", name: "LL Test Scorecard", type: "PDF", size: "420 KB", uploadDate: "2026-03-06" }
      ]
    },
    {
      id: "DD-2026-003",
      name: "Rahul Krishnan",
      dob: "1995-08-03",
      address: "Flat 4B, Malabar Residency, Nadakkavu",
      phone1: "+91 97441 55219",
      phone2: "+91 97441 55220",
      applicationNo: "APP-2026-1044",
      registrationNo: "REG-KL11-8923",
      enrolmentNo: "ENR-0943",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2026-02-15",
      courseFees: 7500,
      paidAmount: 5000,
      pendingBalance: 2500,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      notes: "Morning slot preferred, fast learner.",
      documents: [
        { id: "doc-6", name: "Aadhaar Card Copy", type: "PDF", size: "980 KB", uploadDate: "2026-02-15" },
        { id: "doc-7", name: "Eye Test Certificate", type: "PDF", size: "510 KB", uploadDate: "2026-02-15" }
      ]
    },
    {
      id: "DD-2026-004",
      name: "Aisha Parveen",
      dob: "2003-04-18",
      address: "Baitul Noor, Kundungal, Calicut",
      phone1: "+91 96330 91823",
      phone2: "",
      applicationNo: "APP-2026-1045",
      registrationNo: "REG-KL11-8924",
      enrolmentNo: "ENR-0944",
      classOfMode: "2-Wheeler (MCWG)",
      startDate: "2026-03-10",
      courseFees: 4500,
      paidAmount: 2000,
      pendingBalance: 2500,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      notes: "Weekend sessions only.",
      documents: [
        { id: "doc-8", name: "Passport Copy", type: "PDF", size: "1.4 MB", uploadDate: "2026-03-10" }
      ]
    },
    {
      id: "DD-2026-005",
      name: "Arjun Dev",
      dob: "1997-12-09",
      address: "Devakripa, Mankavu, Calicut",
      phone1: "+91 98950 11982",
      phone2: "+91 98950 11983",
      applicationNo: "APP-2026-1046",
      registrationNo: "REG-KL11-8925",
      enrolmentNo: "ENR-0945",
      classOfMode: "Heavy Vehicle (HMV)",
      startDate: "2026-01-10",
      courseFees: 12000,
      paidAmount: 8000,
      pendingBalance: 4000,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      notes: "Commercial driver license upgrade.",
      documents: [
        { id: "doc-9", name: "Existing LMV License", type: "PDF", size: "780 KB", uploadDate: "2026-01-10" },
        { id: "doc-10", name: "Aadhaar Card", type: "PDF", size: "1.0 MB", uploadDate: "2026-01-10" }
      ]
    },
    {
      id: "DD-2026-006",
      name: "Fathima Hiba",
      dob: "2000-09-25",
      address: "Green Meadows, Medical College, Calicut",
      phone1: "+91 99461 44109",
      phone2: "",
      applicationNo: "APP-2026-1047",
      registrationNo: "REG-KL11-8926",
      enrolmentNo: "ENR-0946",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2026-02-01",
      courseFees: 7500,
      paidAmount: 7500,
      pendingBalance: 0,
      status: "Completed",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      notes: "Test passed in first attempt at Chevayur RTO ground.",
      documents: [
        { id: "doc-11", name: "Driving License Copy", type: "PDF", size: "820 KB", uploadDate: "2026-03-12" }
      ]
    },
    {
      id: "DD-2026-007",
      name: "Vivek Menon",
      dob: "1994-03-30",
      address: "Palm Grove, Westhill, Calicut",
      phone1: "+91 94960 77312",
      phone2: "+91 94960 77313",
      applicationNo: "APP-2026-1048",
      registrationNo: "REG-KL11-8927",
      enrolmentNo: "ENR-0947",
      classOfMode: "Both (LMV + MCWG)",
      startDate: "2026-01-15",
      courseFees: 10000,
      paidAmount: 10000,
      pendingBalance: 0,
      status: "Completed",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      notes: "Successfully completed RTO test.",
      documents: [
        { id: "doc-12", name: "RTO Pass Certificate", type: "PDF", size: "900 KB", uploadDate: "2026-02-28" }
      ]
    },
    {
      id: "DD-2026-008",
      name: "Ananya Ramesh",
      dob: "2002-07-14",
      address: "Shanti Nivas, Chevayur, Calicut",
      phone1: "+91 98471 66203",
      phone2: "",
      applicationNo: "APP-2026-1049",
      registrationNo: "REG-KL11-8928",
      enrolmentNo: "ENR-0948",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2026-02-20",
      courseFees: 7500,
      paidAmount: 4500,
      pendingBalance: 3000,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      notes: "Completing road simulation modules.",
      documents: [
        { id: "doc-13", name: "Aadhaar Card", type: "PDF", size: "1.1 MB", uploadDate: "2026-02-20" }
      ]
    },
    {
      id: "DD-2026-009",
      name: "Kiran Prasad",
      dob: "1999-10-11",
      address: "Prasad Bhavan, Feroke, Calicut",
      phone1: "+91 97452 33190",
      phone2: "",
      applicationNo: "APP-2026-1050",
      registrationNo: "REG-KL11-8929",
      enrolmentNo: "ENR-0949",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2026-03-12",
      courseFees: 7500,
      paidAmount: 3500,
      pendingBalance: 4000,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      notes: "Evening slot student.",
      documents: []
    },
    {
      id: "DD-2026-010",
      name: "Divya Suresh",
      dob: "1996-01-22",
      address: "Lakshmi Nivas, Kallai, Calicut",
      phone1: "+91 94470 12890",
      phone2: "",
      applicationNo: "APP-2026-1051",
      registrationNo: "REG-KL11-8930",
      enrolmentNo: "ENR-0950",
      classOfMode: "2-Wheeler (MCWG)",
      startDate: "2026-01-05",
      courseFees: 4500,
      paidAmount: 4500,
      pendingBalance: 0,
      status: "Completed",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      notes: "Completed track test successfully.",
      documents: []
    },
    {
      id: "DD-2026-011",
      name: "Riyas K.",
      dob: "1993-06-17",
      address: "Al Huda, Beypore, Calicut",
      phone1: "+91 98953 44019",
      phone2: "",
      applicationNo: "APP-2026-1052",
      registrationNo: "REG-KL11-8931",
      enrolmentNo: "ENR-0951",
      classOfMode: "Heavy Vehicle (HMV)",
      startDate: "2025-11-20",
      courseFees: 12000,
      paidAmount: 7000,
      pendingBalance: 5000,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      notes: "Experienced driver, learning articulated vehicle handling.",
      documents: []
    },
    {
      id: "DD-2026-012",
      name: "Meera Varma",
      dob: "2002-02-14",
      address: "Varma House, Thali, Calicut",
      phone1: "+91 96451 88021",
      phone2: "",
      applicationNo: "APP-2026-1053",
      registrationNo: "REG-KL11-8932",
      enrolmentNo: "ENR-0952",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2026-03-08",
      courseFees: 7500,
      paidAmount: 4000,
      pendingBalance: 3500,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
      notes: "Clutch control training underway.",
      documents: []
    },
    {
      id: "DD-2026-013",
      name: "Jithin Raj",
      dob: "1997-04-05",
      address: "Raj Nivas, Pantheerankavu, Calicut",
      phone1: "+91 97448 99120",
      phone2: "",
      applicationNo: "APP-2026-1054",
      registrationNo: "REG-KL11-8933",
      enrolmentNo: "ENR-0953",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2026-02-18",
      courseFees: 7500,
      paidAmount: 5000,
      pendingBalance: 2500,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      notes: "Parallel parking practice.",
      documents: []
    },
    {
      id: "DD-2026-014",
      name: "Pooja Hegde",
      dob: "2001-08-29",
      address: "Krishna Kripa, Palayam, Calicut",
      phone1: "+91 98952 11099",
      phone2: "",
      applicationNo: "APP-2026-1055",
      registrationNo: "REG-KL11-8934",
      enrolmentNo: "ENR-0954",
      classOfMode: "Both (LMV + MCWG)",
      startDate: "2026-03-02",
      courseFees: 10000,
      paidAmount: 6000,
      pendingBalance: 4000,
      status: "Active",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      notes: "Highway driving round scheduled next.",
      documents: []
    },
    {
      id: "DD-2026-015",
      name: "Siddharth Das",
      dob: "1995-11-12",
      address: "Shiva Ganga, Meenchanda, Calicut",
      phone1: "+91 94951 22840",
      phone2: "",
      applicationNo: "APP-2026-1056",
      registrationNo: "REG-KL11-8935",
      enrolmentNo: "ENR-0955",
      classOfMode: "4-Wheeler (LMV)",
      startDate: "2025-10-15",
      courseFees: 7500,
      paidAmount: 7500,
      pendingBalance: 0,
      status: "Inactive",
      photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
      notes: "Relocated temporarily for work.",
      documents: []
    }
  ];

  // We have 15 primary real records. Now let's programmatically add the remainder up to 250
  // so the numbers exactly align:
  // Active: 120 total
  // Completed: 85 total
  // Inactive: 45 total
  // Total: 250 total
  // Pending Fees: Exactly ₹35,000 total across all students!
  
  const indianNames = [
    "Adil Shah", "Akhil Joseph", "Amal George", "Anoop Varghese", "Ashwin Kumar",
    "Deepak Sharma", "Farhan Ahmed", "Gokul Nath", "Harish Nair", "Irfan Habeeb",
    "Jayesh Menon", "Kavya Pillai", "Lalitha K.", "Manju Warrier", "Nikhil Raj",
    "Pranav Mohan", "Rashid Ali", "Sachin Ramesh", "Tanvi Bhat", "Unni Mukundan",
    "Vaishnavi S.", "Waseem Akram", "Yadhu Krishnan", "Zayan Malik", "Anjali Paul",
    "Bhavana Das", "Chithra R.", "Devika Sunoj", "Gayathri Devi", "Hima Das"
  ];

  const modes = [
    "4-Wheeler (LMV)",
    "2-Wheeler (MCWG)",
    "Both (LMV + MCWG)",
    "Heavy Vehicle (HMV)"
  ];

  // Currently we have:
  // Active: 10
  // Completed: 3
  // Inactive: 1
  // Total: 15
  // Current pending balance from first 15:
  // Faizal (0) + Sneha (4000) + Rahul (2500) + Aisha (2500) + Arjun (4000) + Fathima (0) +
  // Vivek (0) + Ananya (3000) + Kiran (4000) + Divya (0) + Riyas (5000) + Meera (3500) +
  // Jithin (2500) + Pooja (4000) + Siddharth (0) = 35,000!
  // Wow, the pending balance of the first 15 students is ALREADY exactly ₹35,000!
  // So all remaining 235 students will have pendingBalance = 0 (i.e. Paid Amount == Total Fees)
  // This guarantees that the sum of pending fees across all 250 students is EXACTLY ₹35,000!

  const allStudents = [...sampleStudents];

  let currentActive = 10;
  let currentCompleted = 3;
  let currentInactive = 2; // (let's count 2 inactive)

  const targetActive = 120;
  const targetCompleted = 85;
  const targetInactive = 45;

  for (let i = 16; i <= 250; i++) {
    const padId = String(i).padStart(3, '0');
    const nameIndex = (i - 16) % indianNames.length;
    const baseName = indianNames[nameIndex];
    const surnameSuffix = ["", " Jr.", " K.", " P.", " M.", " V.", " S."][i % 7];
    const fullName = `${baseName}${surnameSuffix}`;
    const mode = modes[i % modes.length];

    let status = "Active";
    if (currentActive < targetActive) {
      status = "Active";
      currentActive++;
    } else if (currentCompleted < targetCompleted) {
      status = "Completed";
      currentCompleted++;
    } else {
      status = "Inactive";
      currentInactive++;
    }

    const fee = mode.includes("Heavy") ? 12000 : (mode.includes("Both") ? 10000 : (mode.includes("2-Wheeler") ? 4500 : 7500));
    
    allStudents.push({
      id: `DD-2026-${padId}`,
      name: fullName,
      dob: `199${(i % 9) + 1}-0${(i % 9) + 1}-${10 + (i % 18)}`,
      address: `Door No. ${i * 4}, Sector ${i % 12}, Calicut`,
      phone1: `+91 98${400 + (i % 500)} ${String(10000 + i).slice(1)}`,
      phone2: "",
      applicationNo: `APP-2026-${1000 + i}`,
      registrationNo: `REG-KL11-${8900 + i}`,
      enrolmentNo: `ENR-${String(900 + i).padStart(4, '0')}`,
      classOfMode: mode,
      startDate: `2026-0${1 + (i % 3)}-${10 + (i % 18)}`,
      courseFees: fee,
      paidAmount: fee, // fully paid so total pending balance remains exactly 35,000
      pendingBalance: 0,
      status: status,
      photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=252525&textColor=ffffff`,
      notes: "Enrolled in standard batch.",
      documents: [
        { id: `doc-${i}-1`, name: "Aadhaar Card", type: "PDF", size: "1.0 MB", uploadDate: "2026-02-10" }
      ]
    });
  }

  const enrichedStudents = allStudents.map((st, idx) => {
    const isBoth = st.classOfMode?.includes("Both");
    const isHeavy = st.classOfMode?.includes("Heavy");
    const isTwo = st.classOfMode?.includes("2-Wheeler");
    const defaultCategories = isBoth ? ["LMV", "M/C"] : (isHeavy ? ["Heavy Vehicle"] : (isTwo ? ["M/C"] : ["LMV"]));
    
    const sampleGuardians = [
      "K. P. Abdul Faizal", "V. Govindan Nair", "P. Radhakrishnan", "Devanand K.",
      "M. C. Parveen", "K. Varma", "S. Menon", "Ramesh Babu",
      "K. P. Prasad", "T. K. Nambiar", "C. H. Hameed", "S. Krishnakumar",
      "Babu Joseph", "P. T. Thomas", "A. K. George"
    ];

    const branchNames = [
      "Main Branch - Bypass Road",
      "City Office - Mavoor Road",
      "Feroke Sub-Branch"
    ];

    const branchCodes = ["KL11-CLT-01", "KL11-CLT-02", "KL11-FRK-03"];
    const branchIdx = idx % 3;

    return {
      guardianName: st.guardianName || sampleGuardians[idx % sampleGuardians.length],
      branch: st.branch || branchNames[branchIdx],
      officeCode: st.officeCode || branchCodes[branchIdx],
      llNo: st.llNo || `KL-11/2026/${String(14200 + idx).padStart(7, '0')}`,
      llDate: st.llDate || `2026-0${1 + (idx % 2)}-${String(10 + (idx % 18)).padStart(2, '0')}`,
      testDate: st.testDate || `2026-0${3 + (idx % 2)}-${String(12 + (idx % 16)).padStart(2, '0')}`,
      licenceNotes: st.licenceNotes || "Learner license verified & valid. Scheduled for ground and road test.",
      vehicleCategories: st.vehicleCategories || defaultCategories,
      ...st
    };
  });

  return enrichedStudents;
}

// Initial Daily Driving Records (Car & Heavy Vehicle Practice History)
export const INITIAL_DRIVING_RECORDS = [
  {
    id: "DR-2026-101",
    studentId: "DD-2026-001",
    studentName: "Mohammed Faizal",
    date: "2026-11-18",
    category: "LMV",
    startTime: "07:30 AM",
    endTime: "08:30 AM",
    kmTravelled: 14.5,
    classOfMode: "4-Wheeler (LMV)",
    vehicleDetails: "Maruti Suzuki Swift",
    vehicleNumber: "KL-11-AB-1234",
    practiceDetails: "Highway driving, clutch modulation, overtaking discipline",
    traineeSignature: "Mohammed Faizal",
    instructor: "Rajesh K.",
    instructorSignature: "Rajesh K.",
    remarks: "Good gear shift and lane discipline on highway stretch."
  },
  {
    id: "DR-2026-102",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    date: "2026-11-18",
    category: "LMV",
    startTime: "08:45 AM",
    endTime: "09:45 AM",
    kmTravelled: 11.2,
    classOfMode: "Both (LMV + MCWG)",
    vehicleDetails: "Maruti Suzuki Swift",
    vehicleNumber: "KL-11-AB-1234",
    practiceDetails: "Parallel parking in designated cones, reverse 'H' track practice",
    traineeSignature: "Sneha Nair",
    instructor: "Suresh Babu",
    instructorSignature: "Suresh Babu",
    remarks: "Parallel parking in designated cones. Progressing well."
  },
  {
    id: "DR-2026-103",
    studentId: "DD-2026-003",
    studentName: "Rahul Krishnan",
    date: "2026-11-18",
    category: "LMV",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    kmTravelled: 16.0,
    classOfMode: "4-Wheeler (LMV)",
    vehicleDetails: "Hyundai i10 Magna",
    vehicleNumber: "KL-11-CD-5678",
    practiceDetails: "Traffic signal negotiation and steep gradient incline restart",
    traineeSignature: "Rahul Krishnan",
    instructor: "Rajesh K.",
    instructorSignature: "Rajesh K.",
    remarks: "Traffic signal negotiation and steep gradient start."
  },
  {
    id: "DR-2026-104",
    studentId: "DD-2026-005",
    studentName: "Arjun Dev",
    date: "2026-11-18",
    category: "Heavy Vehicle",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    kmTravelled: 24.0,
    classOfMode: "Heavy Vehicle (HMV)",
    vehicleDetails: "Tata 407 Heavy Truck",
    vehicleNumber: "KL-11-HV-9012",
    practiceDetails: "Commercial vehicle air brake handling and blind spot awareness",
    traineeSignature: "Arjun Dev",
    instructor: "Balan N.",
    instructorSignature: "Balan N.",
    remarks: "Commercial vehicle air brake handling and blind spot awareness."
  },
  {
    id: "DR-2026-105",
    studentId: "DD-2026-008",
    studentName: "Ananya Ramesh",
    date: "2026-11-17",
    category: "LMV",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    kmTravelled: 12.0,
    classOfMode: "4-Wheeler (LMV)",
    vehicleDetails: "Maruti Suzuki Swift",
    vehicleNumber: "KL-11-AB-1234",
    practiceDetails: "U-turn on wide avenue and roundabout navigation",
    traineeSignature: "Ananya Ramesh",
    instructor: "Rajesh K.",
    instructorSignature: "Rajesh K.",
    remarks: "U-turn and roundabout navigation completed."
  },
  {
    id: "DR-2026-106",
    studentId: "DD-2026-009",
    studentName: "Kiran Prasad",
    date: "2026-11-17",
    category: "LMV",
    startTime: "04:30 PM",
    endTime: "05:30 PM",
    kmTravelled: 13.8,
    classOfMode: "4-Wheeler (LMV)",
    vehicleDetails: "Hyundai i10 Magna",
    vehicleNumber: "KL-11-CD-5678",
    practiceDetails: "Night driving simulation, dipped beam alignment, rear mirror checks",
    traineeSignature: "Kiran Prasad",
    instructor: "Suresh Babu",
    instructorSignature: "Suresh Babu",
    remarks: "Night driving simulation and headlight beam adjustment."
  },
  {
    id: "DR-2026-107",
    studentId: "DD-2026-012",
    studentName: "Meera Varma",
    date: "2026-11-16",
    category: "LMV",
    startTime: "08:00 AM",
    endTime: "09:00 AM",
    kmTravelled: 10.0,
    classOfMode: "4-Wheeler (LMV)",
    vehicleDetails: "Maruti Suzuki Swift",
    vehicleNumber: "KL-11-AB-1234",
    practiceDetails: "Emergency braking distance estimation and smooth steering control",
    traineeSignature: "Meera Varma",
    instructor: "Rajesh K.",
    instructorSignature: "Rajesh K.",
    remarks: "Braking distance estimation and steering smoothness."
  }
];

// Initial Bike Classes (Separate logbook, ₹300 per additional class)
export const INITIAL_BIKE_CLASSES = [
  {
    id: "BC-2026-501",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    date: "2026-11-18",
    fromTime: "07:00 AM",
    toTime: "07:45 AM",
    durationMinutes: 45,
    kmTravelled: 8.5,
    vehicleDetails: "Hero Splendor Plus",
    vehicleNumber: "KL-11-BK-1102",
    traineeSignature: "Sneha Nair",
    instructor: "Manoj P.",
    instructorSignature: "Manoj P.",
    remarks: "Figure-of-8 track balance and foot-peg posture practice"
  },
  {
    id: "BC-2026-502",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    date: "2026-11-17",
    fromTime: "07:15 AM",
    toTime: "08:00 AM",
    durationMinutes: 45,
    kmTravelled: 9.0,
    vehicleDetails: "Hero Splendor Plus",
    vehicleNumber: "KL-11-BK-1102",
    traineeSignature: "Sneha Nair",
    instructor: "Manoj P.",
    instructorSignature: "Manoj P.",
    remarks: "Slow-speed clutch release & slalom cones navigation"
  },
  {
    id: "BC-2026-503",
    studentId: "DD-2026-004",
    studentName: "Aisha Parveen",
    date: "2026-11-18",
    fromTime: "08:00 AM",
    toTime: "08:50 AM",
    durationMinutes: 50,
    kmTravelled: 10.0,
    vehicleDetails: "Honda Activa 6G",
    vehicleNumber: "KL-11-BK-4491",
    traineeSignature: "Aisha Parveen",
    instructor: "Manoj P.",
    instructorSignature: "Manoj P.",
    remarks: "Traffic lane discipline and indicator usage at crossroads"
  },
  {
    id: "BC-2026-504",
    studentId: "DD-2026-001",
    studentName: "Mohammed Faizal",
    date: "2026-11-16",
    fromTime: "06:45 AM",
    toTime: "07:30 AM",
    durationMinutes: 45,
    kmTravelled: 8.0,
    vehicleDetails: "Hero Splendor Plus",
    vehicleNumber: "KL-11-BK-1102",
    traineeSignature: "Mohammed Faizal",
    instructor: "Manoj P.",
    instructorSignature: "Manoj P.",
    remarks: "Additional booster class - hill restart balance test practice"
  }
];

// Initial Fee Payment Transactions
export const INITIAL_PAYMENTS = [
  {
    id: "TXN-2026-801",
    studentId: "DD-2026-001",
    studentName: "Mohammed Faizal",
    realName: "Mohammed Faizal",
    bankingName: "Mohammed Faizal Sr.",
    amountPaid: 3500,
    paymentDate: "2026-11-18",
    paymentMethod: "GPay / UPI",
    paymentMode: "GPay / UPI",
    paymentCategory: "Regular Course Fees",
    referenceNo: "UPI/32904128912/Faizal",
    notes: "Final installment paid in full."
  },
  {
    id: "TXN-2026-802",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    realName: "Sneha Nair",
    bankingName: "Govindan Nair",
    amountPaid: 6000,
    paymentDate: "2026-11-17",
    paymentMethod: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    paymentCategory: "Regular Course Fees",
    referenceNo: "NEFT/SBIN891204/Sneha",
    notes: "First installment towards dual vehicle course."
  },
  {
    id: "TXN-2026-803",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    realName: "Sneha Nair",
    bankingName: "Govindan Nair",
    amountPaid: 600,
    paymentDate: "2026-11-18",
    paymentMethod: "GPay / UPI",
    paymentMode: "GPay / UPI",
    paymentCategory: "Additional Bike Class Fees",
    referenceNo: "UPI/GPay/77881920/SnehaBike",
    notes: "Payment for 2 additional bike practical sessions (₹300 × 2)."
  },
  {
    id: "TXN-2026-804",
    studentId: "DD-2026-003",
    studentName: "Rahul Krishnan",
    realName: "Rahul Krishnan",
    bankingName: "",
    amountPaid: 5000,
    paymentDate: "2026-11-16",
    paymentMethod: "Cash",
    paymentMode: "Cash",
    paymentCategory: "Regular Course Fees",
    referenceNo: "RCP-4412",
    notes: "Registration and LL training fee."
  },
  {
    id: "TXN-2026-805",
    studentId: "DD-2026-005",
    studentName: "Arjun Dev",
    realName: "Arjun Dev",
    bankingName: "Devanand K.",
    amountPaid: 4000,
    paymentDate: "2026-11-15",
    paymentMethod: "Others",
    paymentMode: "Others",
    paymentCategory: "Regular Course Fees",
    referenceNo: "POS/AUTH-99120",
    notes: "Second installment for Heavy Vehicle training."
  },
  {
    id: "TXN-2026-806",
    studentId: "DD-2026-004",
    studentName: "Aisha Parveen",
    realName: "Aisha Parveen",
    bankingName: "M. C. Parveen",
    amountPaid: 2000,
    paymentDate: "2026-11-14",
    paymentMethod: "PhonePe",
    paymentMode: "PhonePe",
    paymentCategory: "Regular Course Fees",
    referenceNo: "UPI/PhonePe/Aisha22",
    notes: "Advance payment for 2-wheeler coaching."
  },
  {
    id: "TXN-2026-807",
    studentId: "DD-2026-008",
    studentName: "Ananya Ramesh",
    realName: "Ananya Ramesh",
    bankingName: "",
    amountPaid: 4500,
    paymentDate: "2026-11-12",
    paymentMethod: "Cash",
    paymentMode: "Cash",
    paymentCategory: "Regular Course Fees",
    referenceNo: "RCP-4399",
    notes: "Initial installment."
  },
  {
    id: "TXN-2026-808",
    studentId: "DD-2026-016",
    studentName: "Adil Shah",
    realName: "Adil Shah",
    bankingName: "",
    amountPaid: 3500,
    paymentDate: "2026-11-22",
    paymentMethod: "Cash",
    paymentMode: "Cash",
    paymentCategory: "Regular Course Fees",
    referenceNo: "RCP-4450",
    notes: "Course installment cash payment received today."
  },
  {
    id: "TXN-2026-809",
    studentId: "DD-2026-017",
    studentName: "Akhil Joseph",
    realName: "Akhil Joseph",
    bankingName: "Joseph Thomas",
    amountPaid: 4000,
    paymentDate: "2026-11-22",
    paymentMethod: "GPay / UPI",
    paymentMode: "GPay / UPI",
    paymentCategory: "Regular Course Fees",
    referenceNo: "UPI/GPay/9912048/Akhil",
    notes: "Course registration payment received today via UPI."
  }
];

// Initial School Cash & Bank and Personal Account Ledger Transactions
export const INITIAL_TRANSACTIONS = [
  // --- TODAY'S TRANSACTIONS (2026-11-22) ---
  {
    id: "TXN-2026-808",
    type: "Cash Income",
    date: "2026-11-22",
    amount: 3500,
    paymentMode: "Cash",
    category: "Student Fee",
    expenseHead: "",
    realName: "Adil Shah",
    bankingName: "",
    referenceNo: "RCP-4450",
    notes: "Course installment cash payment received today.",
    studentId: "DD-2026-016"
  },
  {
    id: "TXN-2026-809",
    type: "Bank Income",
    date: "2026-11-22",
    amount: 4000,
    paymentMode: "GPay / UPI",
    category: "Student Fee",
    expenseHead: "",
    realName: "Akhil Joseph",
    bankingName: "Joseph Thomas",
    referenceNo: "UPI/GPay/9912048/Akhil",
    notes: "Course registration payment received today via UPI.",
    studentId: "DD-2026-017"
  },
  {
    id: "TXN-2026-901",
    type: "Cash Income",
    date: "2026-11-22",
    amount: 800,
    paymentMode: "Cash",
    category: "RTO Service",
    expenseHead: "",
    realName: "Kavya Pillai",
    bankingName: "",
    referenceNo: "RCP-4451",
    notes: "License renewal consultation & documentation assistance."
  },
  {
    id: "TXN-2026-902",
    type: "Cash Expense",
    date: "2026-11-22",
    amount: 650,
    paymentMode: "Cash",
    category: "Expense",
    expenseHead: "Fuel - Petrol",
    realName: "BPCL City Pump",
    bankingName: "",
    referenceNo: "PET-9912",
    notes: "Fuel for Hero Splendor KL-11-BK-1102 practice sessions."
  },
  {
    id: "TXN-2026-903",
    type: "Cash Expense",
    date: "2026-11-22",
    amount: 180,
    paymentMode: "Cash",
    category: "Expense",
    expenseHead: "Tea, Snacks & Refreshments",
    realName: "Malabar Tea Stall",
    bankingName: "",
    referenceNo: "CASH-TEA-22",
    notes: "Evening refreshments for instructors and office desk."
  },

  // --- RECENT SCHOOL CASH & BANK TRANSACTIONS (November 2026) ---
  {
    id: "TXN-2026-801",
    type: "Bank Income",
    date: "2026-11-18",
    amount: 3500,
    paymentMode: "GPay / UPI",
    category: "Student Fee",
    expenseHead: "",
    realName: "Mohammed Faizal",
    bankingName: "Mohammed Faizal Sr.",
    referenceNo: "UPI/32904128912/Faizal",
    notes: "Final installment paid in full.",
    studentId: "DD-2026-001"
  },
  {
    id: "TXN-2026-802",
    type: "Bank Income",
    date: "2026-11-17",
    amount: 6000,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Student Fee",
    expenseHead: "",
    realName: "Sneha Nair",
    bankingName: "Govindan Nair",
    referenceNo: "NEFT/SBIN891204/Sneha",
    notes: "First installment towards dual vehicle course.",
    studentId: "DD-2026-002"
  },
  {
    id: "TXN-2026-803",
    type: "Bank Income",
    date: "2026-11-18",
    amount: 600,
    paymentMode: "GPay / UPI",
    category: "Student Fee",
    expenseHead: "",
    realName: "Sneha Nair",
    bankingName: "Govindan Nair",
    referenceNo: "UPI/GPay/77881920/SnehaBike",
    notes: "Payment for 2 additional bike practical sessions (₹300 × 2).",
    studentId: "DD-2026-002"
  },
  {
    id: "TXN-2026-804",
    type: "Cash Income",
    date: "2026-11-16",
    amount: 5000,
    paymentMode: "Cash",
    category: "Student Fee",
    expenseHead: "",
    realName: "Rahul Krishnan",
    bankingName: "",
    referenceNo: "RCP-4412",
    notes: "Registration and LL training fee.",
    studentId: "DD-2026-003"
  },
  {
    id: "TXN-2026-805",
    type: "Bank Income",
    date: "2026-11-15",
    amount: 4000,
    paymentMode: "Others",
    category: "Student Fee",
    expenseHead: "",
    realName: "Arjun Dev",
    bankingName: "Devanand K.",
    referenceNo: "POS/AUTH-99120",
    notes: "Second installment for Heavy Vehicle training.",
    studentId: "DD-2026-005"
  },
  {
    id: "TXN-2026-806",
    type: "Bank Income",
    date: "2026-11-14",
    amount: 2000,
    paymentMode: "PhonePe",
    category: "Student Fee",
    expenseHead: "",
    realName: "Aisha Parveen",
    bankingName: "M. C. Parveen",
    referenceNo: "UPI/PhonePe/Aisha22",
    notes: "Advance payment for 2-wheeler coaching.",
    studentId: "DD-2026-004"
  },
  {
    id: "TXN-2026-807",
    type: "Cash Income",
    date: "2026-11-12",
    amount: 4500,
    paymentMode: "Cash",
    category: "Student Fee",
    expenseHead: "",
    realName: "Ananya Ramesh",
    bankingName: "",
    referenceNo: "RCP-4399",
    notes: "Initial installment.",
    studentId: "DD-2026-008"
  },

  // --- SCHOOL EXPENSES (Across 20 Predefined Expense Heads) ---
  {
    id: "TXN-2026-904",
    type: "Cash Expense",
    date: "2026-11-20",
    amount: 2200,
    paymentMode: "Cash",
    category: "Expense",
    expenseHead: "Fuel - Diesel",
    realName: "Calicut Fuels HPCL",
    bankingName: "",
    referenceNo: "HPCL-DSL-441",
    notes: "Diesel fill for training Swift KL-11-AB-1234."
  },
  {
    id: "TXN-2026-905",
    type: "Cash Expense",
    date: "2026-11-19",
    amount: 500,
    paymentMode: "Cash",
    category: "Expense",
    expenseHead: "Cleaning & Washing",
    realName: "Sparkle Water Wash",
    bankingName: "",
    referenceNo: "WASH-089",
    notes: "Underbody and exterior pressure wash for two training vehicles."
  },
  {
    id: "TXN-2026-906",
    type: "Bank Expense",
    date: "2026-11-18",
    amount: 3800,
    paymentMode: "GPay / UPI",
    category: "Expense",
    expenseHead: "RTO / Parivahan Fee",
    realName: "Parivahan Sewa Portal",
    bankingName: "RTO Chevayur Portal UPI",
    referenceNo: "PARI/9912084/KL11",
    notes: "Official slot booking fees for 8 DL candidates."
  },
  {
    id: "TXN-2026-907",
    type: "Bank Expense",
    date: "2026-11-15",
    amount: 4500,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Expense",
    expenseHead: "Vehicle Service & Maintenance",
    realName: "Popular Maruti Service",
    bankingName: "Popular Vehicles & Services Ltd",
    referenceNo: "NEFT/POP-SRV-912",
    notes: "Swift 40,000km general inspection and brake pad replacement."
  },
  {
    id: "TXN-2026-908",
    type: "Cash Expense",
    date: "2026-11-10",
    amount: 1450,
    paymentMode: "Cash",
    category: "Expense",
    expenseHead: "Printing, Books & Stationery",
    realName: "Malabar Offset Printers",
    bankingName: "",
    referenceNo: "PRT-339",
    notes: "Trainee record logbooks and Learner 'L' board stickers."
  },
  {
    id: "TXN-2026-909",
    type: "Bank Expense",
    date: "2026-11-10",
    amount: 9500,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Expense",
    expenseHead: "Vehicle EMI / Loan",
    realName: "HDFC Auto Finance",
    bankingName: "HDFC Bank Loan A/C 99014",
    referenceNo: "ACH/HDFC-EMI-110",
    notes: "Monthly vehicle loan instalment for Tata 407 training truck."
  },
  {
    id: "TXN-2026-910",
    type: "Bank Expense",
    date: "2026-11-12",
    amount: 2150,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Expense",
    expenseHead: "Electricity & Water Bill",
    realName: "KSEB Electrical Section",
    bankingName: "KSEB Ltd Online Portal",
    referenceNo: "KSEB/BILL-NOV-09",
    notes: "Office commercial electricity bill for October usage."
  },
  {
    id: "TXN-2026-911",
    type: "Bank Expense",
    date: "2026-11-05",
    amount: 12000,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Expense",
    expenseHead: "Office Room Rent",
    realName: "Al Madeena Complex Landlord",
    bankingName: "K. M. Basheer",
    referenceNo: "IMPS/RENT-NOV-01",
    notes: "Main branch bypass road monthly room rent."
  },
  {
    id: "TXN-2026-912",
    type: "Bank Expense",
    date: "2026-11-01",
    amount: 15000,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Expense",
    expenseHead: "Instructor Salary",
    realName: "Rajesh K.",
    bankingName: "Rajesh Kumar P.",
    referenceNo: "NEFT/SAL-RAJESH-NOV",
    notes: "Senior driving instructor monthly salary payment."
  },
  {
    id: "TXN-2026-913",
    type: "Bank Expense",
    date: "2026-11-08",
    amount: 8400,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Expense",
    expenseHead: "Vehicle Insurance",
    realName: "New India Assurance",
    bankingName: "New India Assurance Co Ltd",
    referenceNo: "NIA/POL-992144",
    notes: "Annual comprehensive commercial driving school insurance renewal."
  },
  {
    id: "TXN-2026-914",
    type: "Bank Expense",
    date: "2026-11-04",
    amount: 3000,
    paymentMode: "GPay / UPI",
    category: "Expense",
    expenseHead: "Track / Ground Rent",
    realName: "Chevayur Track Association",
    bankingName: "Calicut Driving Grounds Trust",
    referenceNo: "UPI/TRACK-NOV-42",
    notes: "Monthly driving ground H-track & reverse track maintenance fee."
  },
  {
    id: "TXN-2026-915",
    type: "Cash Expense",
    date: "2026-11-07",
    amount: 899,
    paymentMode: "Cash",
    category: "Expense",
    expenseHead: "Internet & Phone Recharge",
    realName: "Airtel Calicut Store",
    bankingName: "",
    referenceNo: "AIRTEL-99471",
    notes: "Driving school office high-speed broadband monthly plan."
  },

  // --- PERSONAL ACCOUNT TRANSACTIONS (Completely Separate from School) ---
  {
    id: "TXN-2026-950",
    type: "Personal Income",
    date: "2026-11-02",
    amount: 18000,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Personal Income",
    expenseHead: "",
    realName: "Abdul Rahman (Owner)",
    bankingName: "Commercial Complex Tenant - Shop 4",
    referenceNo: "NEFT/RENT-SHOP4",
    notes: "Monthly private commercial shop rental receipt into personal account."
  },
  {
    id: "TXN-2026-951",
    type: "Personal Income",
    date: "2026-11-14",
    amount: 6500,
    paymentMode: "Cash",
    category: "Personal Income",
    expenseHead: "",
    realName: "Abdul Rahman (Owner)",
    bankingName: "",
    referenceNo: "AGRI-CASH-14",
    notes: "Agricultural estate yield sale cash returns."
  },
  {
    id: "TXN-2026-952",
    type: "Personal Expense",
    date: "2026-11-08",
    amount: 4200,
    paymentMode: "GPay / UPI",
    category: "Personal Expense",
    expenseHead: "Miscellaneous / Other Expense",
    realName: "Lulu Hypermarket Calicut",
    bankingName: "Lulu Group International UPI",
    referenceNo: "UPI/LULU-99214",
    notes: "Family monthly groceries and household provisions."
  },
  {
    id: "TXN-2026-953",
    type: "Personal Expense",
    date: "2026-11-16",
    amount: 1150,
    paymentMode: "Cash",
    category: "Personal Expense",
    expenseHead: "Miscellaneous / Other Expense",
    realName: "Care Pharmacy",
    bankingName: "",
    referenceNo: "PHARM-116",
    notes: "Personal household medical and wellness medicines."
  },
  {
    id: "TXN-2026-954",
    type: "Personal Expense",
    date: "2026-11-20",
    amount: 5000,
    paymentMode: "Direct Banking (NEFT / IMPS / Bank Transfer)",
    category: "Personal Expense",
    expenseHead: "Miscellaneous / Other Expense",
    realName: "LIC of India",
    bankingName: "Life Insurance Corp of India",
    referenceNo: "LIC/PREM-40912",
    notes: "Quarterly personal life policy premium debit."
  }
];

// Initial Licence Test & Retest Records (LL and DL - LMV & M/C)
export const INITIAL_TEST_RECORDS = [
  {
    id: "TST-2026-001",
    studentId: "DD-2026-001",
    studentName: "Mohammed Faizal",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-03-05",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Theory computer examination score 18/20. Passed."
  },
  {
    id: "TST-2026-002",
    studentId: "DD-2026-001",
    studentName: "Mohammed Faizal",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-11-15",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed 'H' ground track test and hill restart on first attempt."
  },
  {
    id: "TST-2026-003",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-03-10",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Computer theory test passed with 19/20."
  },
  {
    id: "TST-2026-004",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Retest",
    testDate: "2026-11-25",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Retest scheduled at Chevayur test track."
  },
  {
    id: "TST-2026-006",
    studentId: "DD-2026-002",
    studentName: "Sneha Nair",
    testType: "DL",
    category: "M/C",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-11-19",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Motorcycle 8-track test scheduled for today."
  },
  {
    id: "TST-2026-007",
    studentId: "DD-2026-003",
    studentName: "Rahul Krishnan",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Retest",
    testDate: "2026-03-02",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed retest computer examination."
  },
  {
    id: "TST-2026-009",
    studentId: "DD-2026-003",
    studentName: "Rahul Krishnan",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Retest",
    testDate: "2026-11-24",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "First DL retest scheduled at testing ground."
  },
  {
    id: "TST-2026-011",
    studentId: "DD-2026-004",
    studentName: "Aisha Parveen",
    testType: "LL",
    category: "M/C",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-03-15",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed LL theory exam."
  },
  {
    id: "TST-2026-012",
    studentId: "DD-2026-004",
    studentName: "Aisha Parveen",
    testType: "DL",
    category: "M/C",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-11-22",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Upcoming practical test."
  },
  {
    id: "TST-2026-013",
    studentId: "DD-2026-006",
    studentName: "Fathima Hiba",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-02-05",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed LL test."
  },
  {
    id: "TST-2026-014",
    studentId: "DD-2026-006",
    studentName: "Fathima Hiba",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-03-10",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Full pass on road & track test."
  },
  {
    id: "TST-2026-015",
    studentId: "DD-2026-007",
    studentName: "Vivek Menon",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-01-20",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed theory test."
  },
  {
    id: "TST-2026-016",
    studentId: "DD-2026-007",
    studentName: "Vivek Menon",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-02-20",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed 4-wheeler test."
  },
  {
    id: "TST-2026-017",
    studentId: "DD-2026-007",
    studentName: "Vivek Menon",
    testType: "DL",
    category: "M/C",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-02-22",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed 2-wheeler 8-track test."
  },
  {
    id: "TST-2026-018",
    studentId: "DD-2026-008",
    studentName: "Ananya Ramesh",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-11-10",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Exam completed; official RTO outcome awaiting verification."
  },
  {
    id: "TST-2026-019",
    studentId: "DD-2026-008",
    studentName: "Ananya Ramesh",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-12-05",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Upcoming DL driving test scheduled."
  },
  {
    id: "TST-2026-020",
    studentId: "DD-2026-009",
    studentName: "Kiran Prasad",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-11-19",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Theory examination scheduled for today."
  },
  {
    id: "TST-2026-021",
    studentId: "DD-2026-012",
    studentName: "Meera Varma",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-03-12",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed LL test."
  },
  {
    id: "TST-2026-022",
    studentId: "DD-2026-012",
    studentName: "Meera Varma",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-11-14",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "DL test completed; awaiting inspector scorecard upload."
  },
  {
    id: "TST-2026-023",
    studentId: "DD-2026-013",
    studentName: "Jithin Raj",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-02-22",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed theory test."
  },
  {
    id: "TST-2026-024",
    studentId: "DD-2026-013",
    studentName: "Jithin Raj",
    testType: "DL",
    category: "LMV",
    attemptNumber: 2,
    attemptType: "Retest",
    testDate: "2026-11-28",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Second retest attempt scheduled."
  },
  {
    id: "TST-2026-027",
    studentId: "DD-2026-014",
    studentName: "Pooja Hegde",
    testType: "LL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-03-08",
    result: "Passed",
    retestDate: null,
    retestStatus: "None",
    remarks: "Passed theory test."
  },
  {
    id: "TST-2026-028",
    studentId: "DD-2026-014",
    studentName: "Pooja Hegde",
    testType: "DL",
    category: "LMV",
    attemptNumber: 1,
    attemptType: "Original",
    testDate: "2026-11-26",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Upcoming car driving test."
  },
  {
    id: "TST-2026-029",
    studentId: "DD-2026-014",
    studentName: "Pooja Hegde",
    testType: "DL",
    category: "M/C",
    attemptNumber: 1,
    attemptType: "Retest",
    testDate: "2026-11-30",
    result: "Pending",
    retestDate: null,
    retestStatus: "None",
    remarks: "Upcoming retest on 8-track balance."
  }
];
