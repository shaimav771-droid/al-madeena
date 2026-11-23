# DriveDesk — Driving School Management Web Application

## 1. Project Overview & Purpose
**DriveDesk** is a modern, professional administrative SaaS web application designed for driving school owners and office staff to digitally manage student records, actual daily driving practice logs, course fees, payments, and operational reports.

### Core Business Rules & Constraints
* **No Login Screen:** The application must open directly on the **Dashboard** screen.
* **Administrative Focus:** Built strictly for internal office staff and owners (not a student-facing portal).
* **No Scheduling/Booking:** Do **not** include driving class appointment booking or future class scheduling features.
* **Attendance-Based Logging:** Students are added to daily driving records strictly based on their actual completed driving practice attendance.
* **Connected Architecture:** All 8 screens must operate as a unified, multi-page/routed application sharing a persistent layout shell—never combined into a single long scrolling page.
* **Scope Discipline:** Do not add unrequested features or invent business meanings for registration/enrolment fields that are marked as subject to business confirmation.

---

## 2. Design System & Visual Language

### Color Palette
| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Primary Blue | `#2563EB` | Primary buttons, active navigation links, key highlights |
| **Dark Accent** | Dark Navy | `#172B4D` | Sidebar background or deep structural headings |
| **Soft Accent** | Light Blue | `#EFF6FF` | Active menu item backgrounds, subtle badges, hover states |
| **Canvas** | Background | `#F7F9FC` | Main application workspace background |
| **Surface** | White | `#FFFFFF` | Cards, data tables, modals, top header |
| **Primary Text** | Main Text | `#1E293B` | Headings, primary table data, form labels |
| **Muted Text** | Secondary Text | `#64748B` | Subtitles, breadcrumbs, timestamps, placeholders |
| **Divider** | Border | `#E2E8F0` | Card borders, table row dividers, input outlines |
| **Semantic: Good** | Success | `#16A34A` | Paid status, active badges, positive metrics |
| **Semantic: Alert** | Warning | `#F59E0B` | Partial payment, pending states |
| **Semantic: Risk** | Error | `#DC2626` | Overdue/unpaid balances, delete actions |

### Typography
* **Font Family:** `Inter` or `Poppins` (clean geometric sans-serif).
* **Hierarchy:**
  * Page Titles: `24px` / Semi-Bold (`600`), `#1E293B`
  * Section / Card Headers: `16px–18px` / Semi-Bold (`600`), `#1E293B`
  * Table Headers: `12px` / Medium (`500`), Uppercase, `#64748B`
  * Body & Table Cells: `14px` / Regular (`400`), `#1E293B`
  * Captions & Breadcrumbs: `12px–13px` / Regular (`400`), `#64748B`

### UI Components & Styling Standards
* **Cards:** Pure white (`#FFFFFF`), `1px solid #E2E8F0` border, subtle elevation shadow (`0 1px 3px rgba(0,0,0,0.05)`), `8px`–`12px` border radius, `20px`–`24px` internal padding.
* **Icons:** Clean, uniform line icons (e.g., Lucide Icons).
* **Tables:** Clear row separation, hover row highlight (`#F8FAFC`), right-aligned currency/numeric values, structured status pills, and clean action icon buttons.
* **Responsiveness:** Desktop-first layout (`1280px+`) with collapsible sidebar and responsive grids for tablet and mobile viewports.

---

## 3. Global Application Shell (Persistent Layout)

### Left Sidebar Navigation
* **Brand Header:** DriveDesk logo & title.
* **Navigation Items:**
  1. `Dashboard`
  2. `Students`
  3. `Driving Records`
  4. `Fees & Payments`
  5. `Reports`
  6. `Settings`

### Top Navigation Header
* **Left:** Current Page Title + Breadcrumb trail (e.g., `Students / Add New Student`).
* **Right:** Contextual Search bar (where applicable), Notification bell icon with indicator, and Owner/Admin Profile dropdown menu.

---

## 4. Detailed Screen Specifications

### Screen 1: Dashboard
The default landing view providing an operational snapshot of the driving school.
* **Top Action Bar:** Prominent **+ Quick Add Student** primary button (`#2563EB`).
* **KPI Statistics Cards (4-Column Grid):**
  1. **Total Students**
  2. **Active Students**
  3. **Completed Students**
  4. **Pending Fees**
* **Data Widgets (Clean Cards with Realistic Sample Data):**
  * **Recently Registered Students:** Table/list displaying `Student Name`, `Registration Date`, `Class of Rule`, and a `View Profile` action link.
  * **Today's Driving Records:** Table displaying `Student Name`, `Starting Time`, `Ending Time`, `KM Travelled`, and `Class of Rule`.
  * **Recent Fee Payments:** Table displaying `Student Name`, `Amount Paid`, `Payment Date`, and `Payment Method`.

---

### Screen 2: Students
Central directory for managing all enrolled students.
* **Header & Controls:**
  * Page Title: `Students`
  * Primary CTA: **+ Add New Student**
  * Filter Bar: Search input (by name, ID, or mobile), **Status Filter** (`All`, `Active`, `Completed`, `Inactive`), and **Class of Rule Filter**.
* **Students Data Table:**
  * Columns: `Student ID`, `Student Name`, `Mobile Number`, `Class of Rule`, `Joining Date`, `Status` (badge), and `Actions` (`View Profile`, `Edit`, `Delete`).
* **States:** Built-in pagination controls at the bottom and a clean, helpful empty state when no records match filters.

---

### Screen 3: Add New Student
Structured, multi-section registration form optimized for fast and accurate office data entry.
*(Note: Registration numbers and additional fields are subject to business confirmation; maintain neutral labels without inventing domain meanings.)*

* **Section A — Personal Information:**
  * `Student Name` (Text input)
  * `Date of Birth` (Date picker)
  * `Address` (Textarea)
* **Section B — Contact Information:**
  * `Mobile Number 1` (Tel input)
  * `Mobile Number 2` (Tel input)
* **Section C — Registration Information:**
  * `Application Number` (Text input)
  * `Registration Number` (Text input)
  * `Enrolment Number` (Text input)
* **Section D — Course Information:**
  * `Class of Rule` (Select dropdown)
  * `Course Starting Date` (Date picker)
  * `Course Fees` (Numeric currency input)
* **Section E — Payment Information:**
  * `Total Fees` (Auto-populated/editable currency field)
  * `Paid Amount` (Numeric currency input)
  * `Pending Balance` (Auto-calculated read-only field: `Total Fees - Paid Amount`)
* **Section F — Additional Information:**
  * `Student Photo Upload` (Image dropzone/file input)
  * `Document Upload` (Multi-file upload area)
  * `Additional Notes` (Textarea)
* **Form Footer Actions:**
  * **Save Student** (Primary Blue button)
  * **Cancel** (Secondary Ghost/Outline button)

---

### Screen 4: Student Profile
Comprehensive 360-degree view of an individual student.
* **Profile Header Card:**
  * Student Avatar/Photo, `Student Name`, `Student ID`, `Student Status` badge, and an **Edit Student** button.
* **Tabbed Navigation:**
  1. **Overview:** Organized read-only cards for Personal Details, Contact Details, and Registration Details.
  2. **Course Details:** Displays `Class of Rule`, `Course Starting Date`, and `Course Fees`.
  3. **Driving History:** Chronological table showing `Date`, `Starting Time`, `Ending Time`, `KM Travelled`, and `Class of Rule`.
  4. **Fee History:** Summary metrics (`Total Fees`, `Paid Amount`, `Pending Balance`) above a table of individual `Payment Transactions`.
  5. **Documents:** Grid/list of `Uploaded Documents` with view/download options.

---

### Screen 5: Driving Records
Daily driving practice attendance and mileage log (strictly historical/actual records; no future booking).
* **Header & Controls:**
  * Page Title: `Driving Records`
  * Primary CTA: **+ Add Driving Record** (opens modal or slide-over drawer)
  * Filters: `Search Student`, `Date Filter`, and `Student Filter` dropdown.
* **Driving Records Table:**
  * Columns: `Date`, `Student Name`, `Starting Time`, `Ending Time`, `KM Travelled`, `Class of Rule`, and `Actions` (Edit / Delete).
* **Add Driving Record Form:**
  * `Select Student` (Searchable dropdown)
  * `Date` (Date picker, defaults to today)
  * `Starting Time` (Time picker)
  * `Ending Time` (Time picker)
  * `KM Travelled` (Numeric input)
  * `Class of Rule` (Select dropdown)
  * `Daily Report / Remarks` (Textarea)

---

### Screen 6: Fees & Payments
Financial tracking for student course balances and installment collections.
* **Summary KPI Cards (3-Column Grid):**
  1. **Total Fees Collected**
  2. **Total Pending Fees**
  3. **Total Payments** (Transaction count)
* **Header & Table Controls:**
  * Primary CTA: **+ Add Payment**
  * Student Fee Overview Table Columns: `Student Name`, `Total Course Fees`, `Paid Amount`, `Pending Balance`, `Payment Status` (`Paid`, `Partial`, `Unpaid`), and `Actions` (`Record Payment`, `View History`).
* **Add Payment Form (Modal/Drawer):**
  * `Select Student` (Displays current pending balance upon selection)
  * `Payment Amount`
  * `Payment Date`
  * `Payment Method` (e.g., Cash, UPI, Bank Transfer, Card)
  * `Reference Number`
  * `Notes`
* **Payment History:** Accessible log showing itemized receipts and clear status badges.

---

### Screen 7: Reports
Analytical and exportable reporting center for business auditing.
* **Report Category Selector (Tabs or Sidebar Cards):**
  1. `Student Registration Report`
  2. `Active Students Report`
  3. `Completed Students Report`
  4. `Daily Driving Report`
  5. `Student-wise Driving Report`
  6. `KM Report`
  7. `Fee Collection Report`
  8. `Pending Fees Report`
* **Global Report Filter Bar:**
  * `From Date` | `To Date` | `Student` | `Class of Rule`
* **Export Actions:**
  * **Export PDF** | **Export Excel** | **Print Report**
* **Visualization & Data:** Clean summary charts (bar/line charts using `#2563EB`) paired with structured, printable data tables tailored to the active report category.

---

### Screen 8: Settings
Administrative configuration for the driving school and owner account.
* **Section 1 — School Information:**
  * `School Name`
  * `School Address`
  * `Contact Number`
  * `School Logo` (Upload & preview)
* **Section 2 — Account Settings:**
  * `Owner Information` (Name, Email, Contact)
  * `Application Preferences` (Currency format, Distance unit e.g., KM, Default pagination size)
* **Actions:** **Save Changes** button with confirmation feedback.

---

## 5. Implementation & Developer Handoff Guidelines
1. **Build Order:** Establish the shared design tokens (colors, typography, spacing) and persistent layout shell (Sidebar + Header) first, followed by **Screen 1 (Dashboard)**, and then Screens 2 through 8.
2. **Component Reusability:** Standardize `StatCard`, `DataTable`, `StatusBadge`, `FormSection`, `ModalDrawer`, and `FilterBar` components across all screens.
3. **Clean Aesthetic:** Avoid decorative illustrations or clutter. Focus on crisp borders, generous whitespace, high-contrast legibility, and frictionless data entry for office staff.