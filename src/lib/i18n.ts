import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn' | 'ar';

export interface Translations {
  hospitalName: string;
  tagline: string;
  bookAppointment: string;
  findDoctor: string;
  emergencyCall: string;
  search: string;
  patientPortal: string;
  home: string;
  doctors: string;
  departments: string;
  services: string;
  about: string;
  news: string;
  gallery: string;
  healthPackages: string;
  appointment: string;
  contact: string;
  quickActions: string;
  stats: {
    experience: string;
    doctors: string;
    departments: string;
    patients: string;
    emergency: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    bookBtn: string;
    doctorBtn: string;
    emergencyBtn: string;
  };
  appointmentClipboard: {
    title: string;
    subtitle: string;
    name: string;
    phone: string;
    email: string;
    department: string;
    doctor: string;
    date: string;
    timeSlot: string;
    type: string;
    message: string;
    submit: string;
    submitting: string;
    selectDept: string;
    selectDoc: string;
    selectType: string;
    successTitle: string;
    successDesc: string;
  };
  bloodBank: string;
  emergency: string;
  ambulance: string;
  careers: string;
  faq: string;
  testimonials: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    hospitalName: 'MedicalPress Hospital',
    tagline: 'Advanced Healthcare & Compassionate Care',
    bookAppointment: 'Book Appointment',
    findDoctor: 'Find a Doctor',
    emergencyCall: 'Emergency Call',
    search: 'Search doctors, specialties, services...',
    patientPortal: 'Patient Portal',
    home: 'Home',
    doctors: 'Doctors',
    departments: 'Departments',
    services: 'Services',
    about: 'About',
    news: 'News & Blog',
    gallery: 'Gallery',
    healthPackages: 'Health Packages',
    appointment: 'Appointment',
    contact: 'Contact',
    quickActions: 'Quick Healthcare Actions',
    stats: {
      experience: '25+ Years Experience',
      doctors: '100+ Leading Specialists',
      departments: '50+ Clinical Units',
      patients: '100K+ Healed Patients',
      emergency: '24/7 Level 1 Emergency',
    },
    hero: {
      headline: 'Medical Services That You Can Trust',
      subheadline: 'Advanced medical care delivered by experienced professionals with compassion, technology and dedication.',
      bookBtn: 'Book an Appointment',
      doctorBtn: 'Find a Doctor',
      emergencyBtn: '24/7 Emergency Hotline',
    },
    appointmentClipboard: {
      title: 'Make an Appointment',
      subtitle: 'Book your consultation with our experienced medical specialists.',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      department: 'Medical Department',
      doctor: 'Preferred Specialist',
      date: 'Appointment Date',
      timeSlot: 'Available Time Slot',
      type: 'Consultation Type',
      message: 'Brief Symptoms / Message',
      submit: 'Submit Request',
      submitting: 'Securing Slot...',
      selectDept: 'Select Medical Department',
      selectDoc: 'Select Doctor / Specialist',
      selectType: 'Select Consultation Type',
      successTitle: 'Appointment Request Submitted!',
      successDesc: 'Your appointment reference has been generated. Our medical desk will confirm promptly.',
    },
    bloodBank: 'Blood Bank',
    emergency: 'Emergency 24/7',
    ambulance: 'Ambulance Dispatch',
    careers: 'Careers',
    faq: 'Frequently Asked Questions',
    testimonials: 'Patient Healing Stories',
  },
  bn: {
    hospitalName: 'মেডিকেলপ্রেস হসপিটাল',
    tagline: 'উন্নত স্বাস্থ্যসেবা ও আন্তরিক যত্ন',
    bookAppointment: 'অ্যাপয়েন্টমেন্ট নিন',
    findDoctor: 'ডাক্তার খুঁজুন',
    emergencyCall: 'জরুরি সেবা',
    search: 'ডাক্তার, বিভাগ ও সেবা অনুসন্ধান করুন...',
    patientPortal: 'রোগী পোর্টাল',
    home: 'হোম',
    doctors: 'ডাক্তারগণ',
    departments: 'বিভাগসমূহ',
    services: 'সেবাসমূহ',
    about: 'আমাদের সম্পর্কে',
    news: 'স্বাস্থ্য সংবাদ',
    gallery: 'গ্যালারি',
    healthPackages: 'স্বাস্থ্য প্যাকেজ',
    appointment: 'অ্যাপয়েন্টমেন্ট',
    contact: 'যোগাযোগ',
    quickActions: 'জরুরি পদক্ষেপসমূহ',
    stats: {
      experience: '২৫+ বছরের চিকিৎসা অভিজ্ঞতা',
      doctors: '১০০+ বিশেষজ্ঞ চিকিৎসক',
      departments: '৫০+ বিশেষায়িত বিভাগ',
      patients: '১ লক্ষ+ সুস্থ রোগী',
      emergency: '২৪/৭ জরুরি ও ট্রমা সেবা',
    },
    hero: {
      headline: 'নির্ভরযোগ্য ও আন্তর্জাতিক মানের স্বাস্থ্যসেবা',
      subheadline: 'অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক ও আধুনিক প্রযুক্তির সমন্বয়ে আন্তরিক পরিবেশে রোগীর সর্বাধুনিক সেবা।',
      bookBtn: 'অ্যাপয়েন্টমেন্ট বুক করুন',
      doctorBtn: 'বিশেষজ্ঞ চিকিৎসক খুঁজুন',
      emergencyBtn: '২৪/৭ জরুরি হটলাইন',
    },
    appointmentClipboard: {
      title: 'অনলাইন অ্যাপয়েন্টমেন্ট নিন',
      subtitle: 'আমাদের অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের সাথে সরাসরি পরামর্শের জন্য সময় নির্ধারণ করুন।',
      name: 'রোগীর পূর্ণ নাম',
      phone: 'মোবাইল নম্বর',
      email: 'ইমেইল অ্যাড্রেস',
      department: 'চিকিৎসা বিভাগ',
      doctor: 'পছন্দের বিশেষজ্ঞ ডাক্তার',
      date: 'অ্যাপয়েন্টমেন্টের তারিখ',
      timeSlot: 'পরামর্শের সময়সূচি (স্লট)',
      type: 'পরামর্শের ধরন',
      message: 'সমস্যার বিবরণ / বার্তা',
      submit: 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন',
      submitting: 'প্রক্রিয়াকরণ হচ্ছে...',
      selectDept: 'বিভাগ নির্বাচন করুন',
      selectDoc: 'ডাক্তার নির্বাচন করুন',
      selectType: 'পরামর্শের ধরন নির্বাচন করুন',
      successTitle: 'অ্যাপয়েন্টমেন্ট অনুরোধ সফল হয়েছে!',
      successDesc: 'আপনার অ্যাপয়েন্টমেন্ট রসিদ তৈরি হয়েছে। আমাদের প্রতিনিধি অতিসত্বর যোগাযোগ করবেন।',
    },
    bloodBank: 'ব্লাড ব্যাংক',
    emergency: 'জরুরি বিভাগ ২৪/৭',
    ambulance: 'অ্যাম্বুলেন্স সার্ভিস',
    careers: 'ক্যারিয়ার',
    faq: 'সাধারণ প্রশ্নাবলী',
    testimonials: 'রোগীদের সুস্থতার গল্প',
  },
  ar: {
    hospitalName: 'مستشفى ميديكال بريس',
    tagline: 'رعاية صحية متقدمة باهتمام وإخلاص',
    bookAppointment: 'حجز موعد',
    findDoctor: 'ابحث عن طبيب',
    emergencyCall: 'طوارئ 24/7',
    search: 'ابحث عن الأطباء، التخصصات، الخدمات...',
    patientPortal: 'بوابة المرضى',
    home: 'الرئيسية',
    doctors: 'الأطباء',
    departments: 'الأقسام الطبية',
    services: 'الخدمات',
    about: 'عن المستشفى',
    news: 'الأخبار الطبية',
    gallery: 'معرض الصور',
    healthPackages: 'باقات الفحص',
    appointment: 'حجز موعد',
    contact: 'اتصل بنا',
    quickActions: 'إجراءات سريعة',
    stats: {
      experience: '25+ سنة من الخبرة',
      doctors: '100+ من كبار الاستشاريين',
      departments: '50+ قسماً متخصصاً',
      patients: '100,000+ مريض معافى',
      emergency: 'طوارئ وإسعاف 24/7',
    },
    hero: {
      headline: 'خدمات طبية موثوقة يمكنك الاعتماد عليها',
      subheadline: 'رعاية طبية متطورة يقدمها نخبة من الأطباء الاستشاريين بأحدث التقنيات وأعلى معايير الإنسانية.',
      bookBtn: 'احجز موعدك الآن',
      doctorBtn: 'ابحث عن استشاري',
      emergencyBtn: 'خط الطوارئ الساخن 24/7',
    },
    appointmentClipboard: {
      title: 'حجز موعد طبي',
      subtitle: 'احجز استشارتك مع نخبة من أفضل الأطباء والاستشاريين المتخصصين.',
      name: 'اسم المريض بالكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      department: 'القسم الطبي',
      doctor: 'الطبيب المعالج',
      date: 'تاريخ الموعد',
      timeSlot: 'الوقت المتاح',
      type: 'نوع الاستشارة',
      message: 'وصف الأعراض / ملاحظات',
      submit: 'تأكيد طلب الموعد',
      submitting: 'جاري الحجز...',
      selectDept: 'اختر القسم الطبي',
      selectDoc: 'اختر الطبيب المعالج',
      selectType: 'اختر نوع الاستشارة',
      successTitle: 'تم إرسال طلب الموعد بنجاح!',
      successDesc: 'تم إنشاء رقم الحجز المرجعي الخاص بك. سيتواصل معك فريق الاستقبال فوراً.',
    },
    bloodBank: 'بنك الدم',
    emergency: 'قسم الطوارئ',
    ambulance: 'خدمة الإسعاف',
    careers: 'الوظائف',
    faq: 'الأسئلة الشائعة',
    testimonials: 'تجارب وقصص المرضى',
  },
};
