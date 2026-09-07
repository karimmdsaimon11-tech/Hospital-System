export type Language = 'en' | 'bn' | 'ar';

export interface DoctorWithDept {
  id: string;
  name: string;
  slug: string;
  photo: string;
  specialty: string;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    slug: string;
  };
  experience: string;
  qualification: string;
  visitingHours: string;
  consultationFee: number;
  phone: string;
  email: string;
  bio: string;
  featured: boolean;
  status: string;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
}

export interface AppointmentSlot {
  time: string;
  isAvailable: boolean;
  reason?: string;
}

export interface BookingRequest {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  departmentId: string;
  doctorId: string;
  branchId?: string;
  appointmentDate: string;
  timeSlot: string;
  type: string;
  notes?: string;
}

export interface LeadRequest {
  name: string;
  phone: string;
  email: string;
  source: string;
  interestedService?: string;
  notes?: string;
}
