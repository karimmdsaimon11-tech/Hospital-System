# MedicalPress — Enterprise Hospital Website & Advanced Admin CMS

> A production-ready, database-driven healthcare portal and hospital operations management SaaS built with Next.js 14 (App Router), Prisma ORM, SQLite, and Tailwind CSS.

---

## 🌟 Key Modules & Capabilities

### 🌐 Public Hospital Portal
- **3D Realistic Physical Clipboard Appointment System**: Doctor visiting hour calculations, real-time slot generation, double-booking collision prevention, and printable confirmation slips.
- **Multilingual Support**: Dynamic English (`en`), Bengali (`bn`), and Arabic (`ar` with native RTL layout).
- **Specialist Doctors Directory**: 4-column filterable directory by department and specialization, visiting schedules, and consultation fees.
- **Clinical Departments & Services**: Multi-specialty centers of excellence with procedure details.
- **Health Checkup Packages**: Executive, Cardiac, Diabetic, and Well-Woman packages with diagnostic checklists.
- **Real-time Blood Bank**: Live stock tracking for 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-) and emergency requisition fulfillment.
- **24/7 Emergency & Trauma Center**: Hotline direct dialing, trauma team protocols, and live ambulance fleet tracker.
- **Digital Patient Portal**: Lookup by Patient ID (e.g. `MED-90201`), appointment records, printable letterhead prescriptions, and diagnostic lab reports.
- **Hospital Photo & Video Gallery**: High-resolution clinical imagery, 360 hospital virtual tours, and surgical demonstration video players.
- **Health Blog & Knowledgebase**: Medical news, doctor wellness tips, and research articles.
- **Careers & Job Openings**: Clinical vacancies and online CV application submissions.
- **Section 66 & 67 Reference Components**: UI design-system test showcases with custom tab borders and editorial layouts.

### ⚙️ Hospital Operations & Admin CMS (`/admin`)
- **Executive KPI Dashboard**: 10 real-time operational metrics, appointment timeline charts, and clinical activity logs.
- **Appointments Management**: Dual Table and Calendar views with status controls (Pending, Confirmed, Completed, Cancelled).
- **Doctor & Schedule Controller**: Manage visiting hours, slots, fees, leaves, and holidays.
- **Patient Management & Medical Charts**: Complete demographic data, allergies, and clinical visit history.
- **Multi-Drug Digital Prescriptions**: Detailed medicine dosage, frequency, instructions, and printable medical letterhead.
- **Diagnostic Reports Engine**: Upload and assign pathology, radiology, and laboratory reports to patients.
- **CRM Patient Leads Pipeline**: 6-stage patient inquiry tracking (`New` → `Contacted` → `Qualified` → `Booked` → `Converted` → `Lost`).
- **Blood Bank & Ambulance Fleets**: Real-time blood inventory editor and emergency vehicle dispatch tracker.
- **Global Content CMS**: Zero-code updates for hospital telephone lines, announcement bars, emergency banners, and operating hours.
- **SEO & Search Analytics**: Route-by-route metadata editor with live Google SERP preview and social share card preview.
- **Security Audit Trail**: Immutable chronological log recording staff modifications across all modules.
- **System Settings**: Booking window policies, slot duration, timezone, and multi-currency controls.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Synchronize database schema
npx prisma db push

# 3. Seed database with realistic hospital records
npx prisma db seed

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Access Credentials

| Portal | Role | User ID (Email) | Password |
| :--- | :--- | :--- | :--- |
| **Admin CMS** | Super Admin | `admin@medicalpress.com` | `admin123` |
| **Admin CMS** | Doctor | `doctor@medicalpress.com` | `doctor123` |
| **Admin CMS** | Receptionist | `reception@medicalpress.com` | `reception123` |
| **Patient Portal** | Patient | ID: `MED-90201` | *(Lookup by Patient ID)* |

---

## 📁 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Prisma ORM 5.x
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
