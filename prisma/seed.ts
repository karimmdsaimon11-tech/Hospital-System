import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic enterprise healthcare data...');

  // 1. Clear existing records to ensure fresh state
  await prisma.auditLog.deleteMany();
  await prisma.prescriptionItem.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.medicalReport.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.doctorLeave.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.service.deleteMany();
  await prisma.department.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.healthPackage.deleteMany();
  await prisma.bloodInventory.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.ambulance.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.globalSetting.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.seoSetting.deleteMany();
  await prisma.holiday.deleteMany();

  // 2. Users & Staff
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@medicalpress.com',
      password: 'admin123', // In production hashed, here for demo auth
      name: 'Dr. Arthur Sterling',
      role: 'Super Admin',
      phone: '+1-800-654-3210',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.user.create({
    data: {
      email: 'doctor@medicalpress.com',
      password: 'doctor123',
      name: 'Dr. Addison Alexander',
      role: 'Doctor',
      phone: '+1-800-654-3211',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    },
  });

  await prisma.user.create({
    data: {
      email: 'reception@medicalpress.com',
      password: 'reception123',
      name: 'Sarah Connor',
      role: 'Receptionist',
      phone: '+1-800-654-3212',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  });

  // 3. Global Settings
  await prisma.globalSetting.create({
    data: {
      id: 'default',
      hospitalName: 'MedicalPress Hospital',
      tagline: 'Advanced Healthcare & Compassionate Care',
      logoUrl: '/medical-cross.svg',
      phone: '+1-800-654-3210',
      emergencyPhone: '+1-800-999-HELP',
      ambulancePhone: '+1-800-555-AMBU',
      email: 'care@medicalpress.com',
      address: '742 Evergreen Medical Parkway, Healthcare District, NY 10001',
      openingHours: 'Monday to Saturday — 8:00 AM to 9:00 PM',
      googleMapsUrl: 'https://maps.google.com/?q=New+York+Presbyterian+Hospital',
      whatsapp: '+18006543210',
      facebook: 'https://facebook.com/medicalpress',
      twitter: 'https://twitter.com/medicalpress',
      instagram: 'https://instagram.com/medicalpress',
      linkedin: 'https://linkedin.com/company/medicalpress',
      youtube: 'https://youtube.com/medicalpress',
      copyright: '© 2026 MedicalPress International Hospital. All rights reserved.',
      announcementActive: true,
      announcementText: 'Welcome to MedicalPress — Advanced Healthcare & Compassionate Care',
      emergencyBannerActive: true,
      emergencyBannerText: '24/7 Level 1 Trauma & Emergency Care Available. Call hotline directly.',
    },
  });

  // 4. Homepage Sections (Order and config)
  const sections = [
    { key: 'hero', title: 'Hero Carousel', subtitle: 'Main landing introduction', order: 1 },
    { key: 'quick_actions', title: 'Quick Action Cards', subtitle: 'Essential patient shortcuts', order: 2 },
    { key: 'statistics', title: 'Hospital Statistics', subtitle: 'Numbers and achievements', order: 3 },
    { key: 'departments', title: 'Featured Departments', subtitle: 'Medical specialties', order: 4 },
    { key: 'doctors', title: 'Meet Our Doctors', subtitle: 'World class specialists', order: 5 },
    { key: 'services', title: 'Hospital Services', subtitle: 'Comprehensive care offerings', order: 6 },
    { key: 'why_choose_us', title: 'Why Choose Us', subtitle: 'Core healthcare values', order: 7 },
    { key: 'appointment_cta', title: 'Appointment Banner', subtitle: 'Fast booking prompt', order: 8 },
    { key: 'packages', title: 'Health Packages', subtitle: 'Preventive wellness checkups', order: 9 },
    { key: 'testimonials', title: 'Patient Testimonials', subtitle: 'Real healing stories', order: 10 },
    { key: 'blog', title: 'Latest Health News', subtitle: 'Clinical updates & lifestyle', order: 11 },
    { key: 'emergency', title: 'Emergency Care Banner', subtitle: '24/7 hotline and dispatch', order: 12 },
    { key: 'newsletter', title: 'Newsletter Subscription', subtitle: 'Weekly health briefings', order: 13 },
  ];

  for (const s of sections) {
    await prisma.homepageSection.create({ data: s });
  }

  // 5. Branches
  const b1 = await prisma.branch.create({
    data: {
      name: 'MedicalPress Downtown Main Campus',
      slug: 'downtown-main',
      address: '742 Evergreen Medical Parkway, Healthcare District, NY 10001',
      phone: '+1-800-654-3210',
      emergencyPhone: '+1-800-999-4357',
      email: 'downtown@medicalpress.com',
      openingHours: '24 Hours / 7 Days a Week',
      mapUrl: 'https://maps.google.com',
    },
  });

  const b2 = await prisma.branch.create({
    data: {
      name: 'MedicalPress Midtown Specialist Clinic',
      slug: 'midtown-clinic',
      address: '350 5th Avenue, Suite 4200, New York, NY 10118',
      phone: '+1-800-654-3220',
      emergencyPhone: '+1-800-999-4358',
      email: 'midtown@medicalpress.com',
      openingHours: 'Mon - Fri: 8:00 AM - 8:00 PM',
      mapUrl: 'https://maps.google.com',
    },
  });

  const b3 = await prisma.branch.create({
    data: {
      name: 'MedicalPress West Suburbs Wellness Center',
      slug: 'west-suburbs',
      address: '1200 Lakeview Blvd, White Plains, NY 10601',
      phone: '+1-800-654-3230',
      emergencyPhone: '+1-800-999-4359',
      email: 'west@medicalpress.com',
      openingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
      mapUrl: 'https://maps.google.com',
    },
  });

  // 6. Departments
  const deptsData = [
    {
      name: 'Cardiology Clinic',
      slug: 'cardiology',
      icon: 'HeartPulse',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Comprehensive diagnostic, interventional and rehabilitative cardiovascular care.',
      description: 'Our world-renowned Cardiology Department provides state-of-the-art diagnostic and interventional services for all cardiovascular conditions, from hypertension management to complex cardiac catheterization and post-infarction rehabilitation.',
      headOfDepartment: 'Dr. Addison Alexander, MD, FACC',
      featured: true,
    },
    {
      name: 'Neurology & Neurosurgery',
      slug: 'neurology',
      icon: 'Brain',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Advanced care for neurological disorders, stroke management, and spine surgery.',
      description: 'Specialized in treating stroke, epilepsy, neuromuscular disorders, Parkinson’s disease, and brain tumors with cutting-edge robotic surgical suites and 24/7 dedicated neuro-intensive care.',
      headOfDepartment: 'Dr. Adaline Becka, MD, PhD',
      featured: true,
    },
    {
      name: 'Orthopedics & Joint Care',
      slug: 'orthopedics',
      icon: 'Bone',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Minimally invasive joint replacement, sports injury recovery, and trauma surgery.',
      description: 'Equipped with computer-assisted navigational surgery for knee and hip replacements, arthroscopy, cartilage regeneration, and advanced sports physical rehabilitation.',
      headOfDepartment: 'Dr. Andrew Bert, MD, FAAOS',
      featured: true,
    },
    {
      name: 'Pediatrics Clinic',
      slug: 'pediatrics',
      icon: 'Baby',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Compassionate pediatric care from newborn intensive care to adolescent medicine.',
      description: 'Dedicated to providing warm, family-centered medical care for infants, children, and teenagers, supported by a Level III Neonatal Intensive Care Unit (NICU).',
      headOfDepartment: 'Dr. Orana Talebin, MD, FAAP',
      featured: true,
    },
    {
      name: 'Gynaecological Clinic',
      slug: 'gynecology',
      icon: 'Users',
      image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Women’s comprehensive health, high-risk obstetrics, and fertility consultation.',
      description: 'Full-spectrum women’s healthcare including routine screening, prenatal and high-risk childbirth care, minimally invasive laparoscopic surgery, and menopause management.',
      headOfDepartment: 'Dr. Sarah Johnson, MD, FACOG',
      featured: true,
    },
    {
      name: 'Dermatology & Laser Center',
      slug: 'dermatology',
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Clinical dermatology, skin cancer surgery, and advanced aesthetic rejuvenation.',
      description: 'Delivers diagnostic dermoscopy, Mohs micrographic surgery, eczema/psoriasis phototherapy, and safe clinical laser therapies for optimal skin health.',
      headOfDepartment: 'Dr. Elena Rostova, MD',
      featured: true,
    },
    {
      name: 'ENT & Head/Neck Surgery',
      slug: 'ent',
      icon: 'Ear',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Ear, nose, sinus, voice, and complex head/neck reconstructive medicine.',
      description: 'Comprehensive audiometry, endoscopic sinus surgery, sleep apnea treatment, hearing loss interventions, and pediatric ENT procedures.',
      headOfDepartment: 'Dr. Marcus Vance, MD, FACS',
      featured: true,
    },
    {
      name: 'Primary Health Care',
      slug: 'primary-care',
      icon: 'Activity',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Holistic preventive health checkups, chronic disease management, and family medicine.',
      description: 'Your primary healthcare foundation offering annual health audits, immunization, diabetes and hypertension management, and lifestyle counseling.',
      headOfDepartment: 'Dr. Emily Watson, MD',
      featured: true,
    },
    {
      name: 'Emergency Medicine',
      slug: 'emergency',
      icon: 'AlertTriangle',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      shortDesc: '24/7 Level-1 trauma resuscitation, stroke rapid response, and critical care.',
      description: 'Manned round-the-clock by board-certified emergency physicians, critical care nurses, and specialized trauma surgical teams ready for any medical crisis.',
      headOfDepartment: 'Dr. David Miller, MD, FACEP',
      featured: false,
    },
  ];

  const depts: Record<string, any> = {};
  for (const d of deptsData) {
    const dept = await prisma.department.create({ data: d });
    depts[dept.slug] = dept;
  }

  // 7. Doctors (12 Doctors)
  const doctorsData = [
    {
      name: 'Dr. Addison Alexander',
      slug: 'dr-addison-alexander',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      specialty: 'Senior Interventional Cardiologist',
      departmentId: depts['cardiology'].id,
      branchId: b1.id,
      experience: '18+ Years Experience',
      qualification: 'MD, FACC, Harvard Medical School Fellow',
      visitingHours: 'Mon - Fri: 09:00 AM - 01:00 PM',
      consultationFee: 150.0,
      phone: '+1-800-654-3210',
      email: 'dr.alexander@medicalpress.com',
      bio: 'Dr. Addison Alexander is the Chief of Cardiovascular Medicine at MedicalPress. He has performed over 4,000 successful coronary interventions and specializes in structural heart disease and preventive cardiology.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Adaline Becka',
      slug: 'dr-adaline-becka',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      specialty: 'Consultant Neurologist & Stroke Lead',
      departmentId: depts['neurology'].id,
      branchId: b1.id,
      experience: '15+ Years Experience',
      qualification: 'MD, PhD (Neuroscience), Johns Hopkins',
      visitingHours: 'Tue, Thu, Sat: 10:00 AM - 03:00 PM',
      consultationFee: 160.0,
      phone: '+1-800-654-3214',
      email: 'dr.becka@medicalpress.com',
      bio: 'Dr. Adaline Becka is an internationally renowned neurologist recognized for her breakthrough clinical research in rapid acute ischemic stroke intervention and epilepsy management.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Andrew Bert',
      slug: 'dr-andrew-bert',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      specialty: 'Chief Orthopedic Surgeon',
      departmentId: depts['orthopedics'].id,
      branchId: b1.id,
      experience: '20+ Years Experience',
      qualification: 'MD, FAAOS, Mayo Clinic Fellow',
      visitingHours: 'Mon, Wed, Fri: 08:30 AM - 12:30 PM',
      consultationFee: 140.0,
      phone: '+1-800-654-3215',
      email: 'dr.bert@medicalpress.com',
      bio: 'Dr. Andrew Bert specializes in robotic-assisted total hip and knee arthroplasty, complex trauma reconstruction, and sports medicine rehabilitation for Olympic and collegiate athletes.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Orana Talebin',
      slug: 'dr-orana-talebin',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      specialty: 'Senior Pediatrician & Neonatologist',
      departmentId: depts['pediatrics'].id,
      branchId: b2.id,
      experience: '12+ Years Experience',
      qualification: 'MD, FAAP, Columbia University',
      visitingHours: 'Mon - Sat: 09:00 AM - 02:00 PM',
      consultationFee: 120.0,
      phone: '+1-800-654-3216',
      email: 'dr.talebin@medicalpress.com',
      bio: 'Dr. Orana Talebin brings gentle, compassionate care to young patients and extensive expertise in pediatric critical care, developmental pediatrics, and childhood asthma.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Sarah Johnson',
      slug: 'dr-sarah-johnson',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      specialty: 'Consultant Obstetrician & Gynecologist',
      departmentId: depts['gynecology'].id,
      branchId: b1.id,
      experience: '14+ Years Experience',
      qualification: 'MD, FACOG, Oxford Medical Graduate',
      visitingHours: 'Mon, Wed, Thu: 01:00 PM - 06:00 PM',
      consultationFee: 135.0,
      phone: '+1-800-654-3217',
      email: 'dr.johnson@medicalpress.com',
      bio: 'Dr. Sarah Johnson offers high-empathy, patient-focused obstetric care, high-risk pregnancy monitoring, minimally invasive laparoscopic gynecological surgery, and reproductive health guidance.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Elena Rostova',
      slug: 'dr-elena-rostova',
      photo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80',
      specialty: 'Clinical & Aesthetic Dermatologist',
      departmentId: depts['dermatology'].id,
      branchId: b2.id,
      experience: '11+ Years Experience',
      qualification: 'MD, European Board Certified',
      visitingHours: 'Tue, Wed, Fri: 11:00 AM - 05:00 PM',
      consultationFee: 130.0,
      phone: '+1-800-654-3218',
      email: 'dr.rostova@medicalpress.com',
      bio: 'Dr. Elena Rostova has extensive training in dermatosurgery, autoimmune skin disorders, clinical laser therapeutics, and modern medical skincare protocols.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Marcus Vance',
      slug: 'dr-marcus-vance',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
      specialty: 'Senior ENT Surgeon',
      departmentId: depts['ent'].id,
      branchId: b3.id,
      experience: '16+ Years Experience',
      qualification: 'MS (ENT), FACS, Royal College of Surgeons',
      visitingHours: 'Mon, Tue, Thu: 09:00 AM - 01:00 PM',
      consultationFee: 125.0,
      phone: '+1-800-654-3219',
      email: 'dr.vance@medicalpress.com',
      bio: 'Dr. Marcus Vance is an authority on functional endoscopic sinus surgery (FESS), cochlear implants, voice restoration, and snoring/sleep apnea surgical management.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. David Miller',
      slug: 'dr-david-miller',
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80',
      specialty: 'Head of Emergency & Trauma',
      departmentId: depts['emergency'].id,
      branchId: b1.id,
      experience: '17+ Years Experience',
      qualification: 'MD, FACEP, Disaster Medicine Specialist',
      visitingHours: 'Mon - Sun (24/7 Shift Protocol)',
      consultationFee: 140.0,
      phone: '+1-800-654-3221',
      email: 'dr.miller@medicalpress.com',
      bio: 'Dr. David Miller leads the 24/7 Level 1 Trauma Center, coordinating rapid resuscitation, acute toxicological crises, cardiac arrests, and disaster management teams.',
      featured: false,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Emily Watson',
      slug: 'dr-emily-watson',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      specialty: 'Family Medicine & Diabetologist',
      departmentId: depts['primary-care'].id,
      branchId: b3.id,
      experience: '13+ Years Experience',
      qualification: 'MD, MRCGP (UK), Board Certified',
      visitingHours: 'Mon - Fri: 08:00 AM - 01:00 PM',
      consultationFee: 110.0,
      phone: '+1-800-654-3222',
      email: 'dr.watson@medicalpress.com',
      bio: 'Dr. Emily Watson emphasizes holistic preventive healthcare, hypertension, thyroid disorders, obesity control, and comprehensive family medical management.',
      featured: true,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Robert Patel',
      slug: 'dr-robert-patel',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      specialty: 'Consultant Laparoscopic Surgeon',
      departmentId: depts['primary-care'].id,
      branchId: b1.id,
      experience: '19+ Years Experience',
      qualification: 'MS, FRCS (Edin), Minimal Access Surgery',
      visitingHours: 'Mon, Wed, Fri: 02:00 PM - 07:00 PM',
      consultationFee: 145.0,
      phone: '+1-800-654-3223',
      email: 'dr.patel@medicalpress.com',
      bio: 'Pioneer in single-incision laparoscopic gallbladder, hernia, appendiceal, and gastrointestinal surgical procedures with rapid recovery protocols.',
      featured: false,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Sophia Chen',
      slug: 'dr-sophia-chen',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      specialty: 'Ophthalmologist & Vitreoretinal Surgeon',
      departmentId: depts['primary-care'].id,
      branchId: b2.id,
      experience: '10+ Years Experience',
      qualification: 'MD, Stanford Eye Center Fellow',
      visitingHours: 'Tue, Thu: 09:00 AM - 01:00 PM',
      consultationFee: 130.0,
      phone: '+1-800-654-3224',
      email: 'dr.chen@medicalpress.com',
      bio: 'Expert in micro-incision phacoemulsification for cataract removal, glaucoma implants, diabetic retinopathy laser therapy, and LASIK vision correction.',
      featured: false,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
    {
      name: 'Dr. Michael Chang',
      slug: 'dr-michael-chang',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      specialty: 'Consultant Diagnostic Radiologist',
      departmentId: depts['primary-care'].id,
      branchId: b1.id,
      experience: '15+ Years Experience',
      qualification: 'MD, Radiology Board Certified',
      visitingHours: 'Mon - Fri: 09:00 AM - 05:00 PM',
      consultationFee: 120.0,
      phone: '+1-800-654-3225',
      email: 'dr.chang@medicalpress.com',
      bio: 'Specialized in advanced 3T MRI, dual-energy CT, cardiovascular imaging, musculoskeletal ultrasound, and interventional ultrasound biopsies.',
      featured: false,
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  ];

  const createdDoctors: any[] = [];
  for (const doc of doctorsData) {
    const d = await prisma.doctor.create({ data: doc });
    createdDoctors.push(d);

    // Create schedules for Monday (1), Wednesday (3), Friday (5)
    await prisma.schedule.create({
      data: {
        doctorId: d.id,
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '13:00',
        slotDuration: 30,
        maxPatients: 10,
        isActive: true,
      },
    });

    await prisma.schedule.create({
      data: {
        doctorId: d.id,
        dayOfWeek: 3, // Wednesday
        startTime: '14:00',
        endTime: '18:00',
        slotDuration: 30,
        maxPatients: 10,
        isActive: true,
      },
    });

    await prisma.schedule.create({
      data: {
        doctorId: d.id,
        dayOfWeek: 5, // Friday
        startTime: '09:00',
        endTime: '12:00',
        slotDuration: 30,
        maxPatients: 8,
        isActive: true,
      },
    });
  }

  // 8. Services (10+ Services)
  const servicesData = [
    {
      name: 'Dental Implants & Oral Surgery',
      slug: 'dental-implants',
      icon: 'Smile',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Titanium root replacements, cosmetic veneers, and painless oral surgery.',
      description: 'Restoring beautiful, functional smiles with digital 3D-guided dental implants, bone grafting, and same-day dental crowns under sedation anesthesia.',
      price: 450.0,
      departmentId: depts['primary-care'].id,
      featured: true,
    },
    {
      name: 'Blood Bank & Transfusion Unit',
      slug: 'blood-bank',
      icon: 'Droplet',
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
      shortDesc: '24/7 sterile component separation, platelet pheresis, and blood reserves.',
      description: 'Accredited international blood banking facility providing nucleic acid tested (NAT) red blood cells, fresh frozen plasma, cryoprecipitate, and single-donor platelets.',
      price: 120.0,
      departmentId: depts['cardiology'].id,
      featured: true,
    },
    {
      name: 'Medicine Research & Clinical Trials',
      slug: 'medicine-research',
      icon: 'FlaskConical',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Phase II-IV investigational pharmacological studies and translational medicine.',
      description: 'Collaborating with leading global biomedical institutions on groundbreaking cancer therapies, novel cardiac medications, and gene therapies.',
      price: 0.0,
      departmentId: depts['neurology'].id,
      featured: true,
    },
    {
      name: 'Pharmaceutical Advice & Dispensing',
      slug: 'pharmaceutical-advice',
      icon: 'Pill',
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Licensed clinical pharmacologists reviewing drug interactions and dosages.',
      description: 'Comprehensive outpatient and inpatient pharmacy service providing bedside medication counseling, allergy screening, and custom sterile compounding.',
      price: 40.0,
      departmentId: depts['primary-care'].id,
      featured: true,
    },
    {
      name: 'Medical Counseling & Mental Health',
      slug: 'medical-counseling',
      icon: 'HeartHandshake',
      image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Psychotherapy, grief counseling, stress management, and chronic illness support.',
      description: 'Compassionate licensed clinical psychologists providing cognitive behavioral therapy (CBT), post-trauma counseling, and pediatric developmental support.',
      price: 130.0,
      departmentId: depts['pediatrics'].id,
      featured: true,
    },
    {
      name: 'Diagnostic Imaging & Radiology',
      slug: 'diagnostic-services',
      icon: 'Scan',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      shortDesc: '3T MRI, 128-Slice Low Dose CT, Digital X-Ray, 4D Doppler Ultrasound.',
      description: 'State-of-the-art imaging center providing rapid-turnaround scan interpretation with cloud report access for treating physicians and patients.',
      price: 250.0,
      departmentId: depts['primary-care'].id,
      featured: true,
    },
    {
      name: 'Emergency & Acute Trauma Care',
      slug: 'emergency-care',
      icon: 'Siren',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Immediate triage and resuscitation for critical medical emergencies.',
      description: 'Fully equipped 20-bed emergency room with resuscitation bays, mobile radiography, cardiac monitors, and direct elevator access to operative suites.',
      price: 300.0,
      departmentId: depts['emergency'].id,
      featured: true,
    },
    {
      name: 'Automated Laboratory Services',
      slug: 'laboratory-services',
      icon: 'TestTube',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Clinical biochemistry, hematology, immunology, and molecular PCR testing.',
      description: 'Robotic high-throughput analyzers providing precise clinical blood and tissue biopsy results within hours, linked directly to your patient portal.',
      price: 85.0,
      departmentId: depts['primary-care'].id,
      featured: true,
    },
    {
      name: 'Physical Therapy & Rehabilitation',
      slug: 'physical-therapy',
      icon: 'Accessibility',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Post-operative recovery, hydrotherapy, spine alignment, and gait retraining.',
      description: 'Modern gym and rehabilitation facility guiding patients through safe functional mobility recovery after joint replacements, strokes, or sports injuries.',
      price: 110.0,
      departmentId: depts['orthopedics'].id,
      featured: false,
    },
    {
      name: 'Cardiac Catheterization Lab',
      slug: 'cardiac-cath-lab',
      icon: 'Activity',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
      shortDesc: 'Emergency angioplasty, coronary stenting, and pacemaker implantation.',
      description: 'Operating 24/7 for acute myocardial infarction door-to-balloon times under 60 minutes, with fractional flow reserve and intravascular ultrasound.',
      price: 1200.0,
      departmentId: depts['cardiology'].id,
      featured: false,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }

  // 9. Patients (10 Patients)
  const patientsData = [
    {
      patientId: 'MED-90201',
      name: 'Jonathan Miller',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      dob: '1982-04-12',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1-555-0101',
      email: 'jonathan.miller@example.com',
      address: '142 Pine Street, Apt 4B, New York, NY',
      emergencyContact: 'Karen Miller (Spouse)',
      emergencyPhone: '+1-555-0102',
      allergies: 'Penicillin, Sulfa drugs',
      medicalHistory: 'Mild hypertension diagnosed 2021, controlled with lifestyle.',
    },
    {
      patientId: 'MED-90202',
      name: 'Eleanor Davis',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      dob: '1990-09-24',
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+1-555-0103',
      email: 'eleanor.davis@example.com',
      address: '77 West End Ave, New York, NY',
      emergencyContact: 'Mark Davis (Father)',
      emergencyPhone: '+1-555-0104',
      allergies: 'None',
      medicalHistory: 'Annual executive physical checkups, healthy.',
    },
    {
      patientId: 'MED-90203',
      name: 'Robert Hastings',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      dob: '1975-11-03',
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+1-555-0105',
      email: 'robert.hastings@example.com',
      address: '22 Riverdale Lane, Bronx, NY',
      emergencyContact: 'Patricia Hastings (Sister)',
      emergencyPhone: '+1-555-0106',
      allergies: 'Aspirin',
      medicalHistory: 'Right knee arthroscopy 2019.',
    },
    {
      patientId: 'MED-90204',
      name: 'Maria Santos',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      dob: '1988-06-18',
      gender: 'Female',
      bloodGroup: 'AB+',
      phone: '+1-555-0107',
      email: 'maria.santos@example.com',
      address: '504 Lexington Ave, Brooklyn, NY',
      emergencyContact: 'Carlos Santos (Brother)',
      emergencyPhone: '+1-555-0108',
      allergies: 'Latex',
      medicalHistory: 'Asthma since childhood.',
    },
    {
      patientId: 'MED-90205',
      name: 'David Kim',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      dob: '1995-02-14',
      gender: 'Male',
      bloodGroup: 'O-',
      phone: '+1-555-0109',
      email: 'david.kim@example.com',
      address: '89 Columbus Circle, New York, NY',
      emergencyContact: 'Grace Kim (Mother)',
      emergencyPhone: '+1-555-0110',
      allergies: 'None',
      medicalHistory: 'Healthy sports athlete, runner.',
    },
    {
      patientId: 'MED-90206',
      name: 'Claire Beauchamp',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      dob: '1968-12-30',
      gender: 'Female',
      bloodGroup: 'A-',
      phone: '+1-555-0111',
      email: 'claire.b@example.com',
      address: '15 Sutton Place, New York, NY',
      emergencyContact: 'Frank Randall (Husband)',
      emergencyPhone: '+1-555-0112',
      allergies: 'Codeine',
      medicalHistory: 'Type 2 Diabetes mellitus managed on Metformin.',
    },
    {
      patientId: 'MED-90207',
      name: 'Lucas Wright',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      dob: '2015-08-10',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+1-555-0113',
      email: 'wright.family@example.com',
      address: '430 Greenpoint Ave, Brooklyn, NY',
      emergencyContact: 'Amanda Wright (Mother)',
      emergencyPhone: '+1-555-0114',
      allergies: 'Peanuts',
      medicalHistory: 'Pediatric vaccinations complete, minor ear infections.',
    },
    {
      patientId: 'MED-90208',
      name: 'Beatrice Taylor',
      photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
      dob: '1984-07-22',
      gender: 'Female',
      bloodGroup: 'B-',
      phone: '+1-555-0115',
      email: 'beatrice.taylor@example.com',
      address: '210 Central Park South, New York, NY',
      emergencyContact: 'George Taylor (Spouse)',
      emergencyPhone: '+1-555-0116',
      allergies: 'None',
      medicalHistory: 'Obstetric routine prenatal care.',
    },
    {
      patientId: 'MED-90209',
      name: 'Samuel Green',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      dob: '1959-05-15',
      gender: 'Male',
      bloodGroup: 'AB-',
      phone: '+1-555-0117',
      email: 'samuel.green@example.com',
      address: '99 Hudson St, New York, NY',
      emergencyContact: 'Diane Green (Wife)',
      emergencyPhone: '+1-555-0118',
      allergies: 'Iodinated contrast media',
      medicalHistory: 'Coronary artery disease, stent placed 2018.',
    },
    {
      patientId: 'MED-90210',
      name: 'Olivia Martinez',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      dob: '1998-03-05',
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '+1-555-0119',
      email: 'olivia.m@example.com',
      address: '320 West 14th St, New York, NY',
      emergencyContact: 'Rosa Martinez (Mother)',
      emergencyPhone: '+1-555-0120',
      allergies: 'None',
      medicalHistory: 'Dermatological acne treatment.',
    },
  ];

  const createdPatients: any[] = [];
  for (const pat of patientsData) {
    const p = await prisma.patient.create({ data: pat });
    createdPatients.push(p);
  }

  // 10. Appointments (10+ Appointments with various statuses)
  const aptsData = [
    {
      appointmentNumber: 'APT-2026-001',
      patientId: createdPatients[0].id,
      patientName: 'Jonathan Miller',
      patientPhone: '+1-555-0101',
      patientEmail: 'jonathan.miller@example.com',
      doctorId: createdDoctors[0].id, // Dr. Alexander (Cardio)
      departmentId: depts['cardiology'].id,
      branchId: b1.id,
      appointmentDate: '2026-09-15',
      timeSlot: '09:30 AM',
      type: 'In-person',
      status: 'Confirmed',
      notes: 'Routine cardiac checkup and lipid profile discussion.',
      paymentStatus: 'Paid',
    },
    {
      appointmentNumber: 'APT-2026-002',
      patientId: createdPatients[1].id,
      patientName: 'Eleanor Davis',
      patientPhone: '+1-555-0103',
      patientEmail: 'eleanor.davis@example.com',
      doctorId: createdDoctors[1].id, // Dr. Becka (Neuro)
      departmentId: depts['neurology'].id,
      branchId: b1.id,
      appointmentDate: '2026-09-15',
      timeSlot: '10:30 AM',
      type: 'In-person',
      status: 'Confirmed',
      notes: 'Persistent migraine evaluation.',
      paymentStatus: 'Paid',
    },
    {
      appointmentNumber: 'APT-2026-003',
      patientId: createdPatients[2].id,
      patientName: 'Robert Hastings',
      patientPhone: '+1-555-0105',
      patientEmail: 'robert.hastings@example.com',
      doctorId: createdDoctors[2].id, // Dr. Bert (Ortho)
      departmentId: depts['orthopedics'].id,
      branchId: b1.id,
      appointmentDate: '2026-09-17',
      timeSlot: '09:00 AM',
      type: 'In-person',
      status: 'Pending',
      notes: 'Right knee pain after running marathon.',
      paymentStatus: 'Pending',
    },
    {
      appointmentNumber: 'APT-2026-004',
      patientId: createdPatients[3].id,
      patientName: 'Maria Santos',
      patientPhone: '+1-555-0107',
      patientEmail: 'maria.santos@example.com',
      doctorId: createdDoctors[4].id, // Dr. Sarah Johnson (Gyn)
      departmentId: depts['gynecology'].id,
      branchId: b1.id,
      appointmentDate: '2026-09-16',
      timeSlot: '02:00 PM',
      type: 'Follow-up',
      status: 'Completed',
      notes: 'Post-delivery routine 6-week wellness visit.',
      paymentStatus: 'Paid',
    },
    {
      appointmentNumber: 'APT-2026-005',
      patientId: createdPatients[4].id,
      patientName: 'David Kim',
      patientPhone: '+1-555-0109',
      patientEmail: 'david.kim@example.com',
      doctorId: createdDoctors[5].id, // Dr. Elena Rostova (Derm)
      departmentId: depts['dermatology'].id,
      branchId: b2.id,
      appointmentDate: '2026-09-18',
      timeSlot: '11:30 AM',
      type: 'In-person',
      status: 'Confirmed',
      notes: 'Skin spot dermoscopy check on upper shoulder.',
      paymentStatus: 'Paid',
    },
    {
      appointmentNumber: 'APT-2026-006',
      patientId: createdPatients[5].id,
      patientName: 'Claire Beauchamp',
      patientPhone: '+1-555-0111',
      patientEmail: 'claire.b@example.com',
      doctorId: createdDoctors[8].id, // Dr. Emily Watson (Primary Care)
      departmentId: depts['primary-care'].id,
      branchId: b3.id,
      appointmentDate: '2026-09-18',
      timeSlot: '08:30 AM',
      type: 'In-person',
      status: 'Confirmed',
      notes: 'Quarterly HbA1c review and insulin dosage adjustments.',
      paymentStatus: 'Paid',
    },
    {
      appointmentNumber: 'APT-2026-007',
      patientId: createdPatients[6].id,
      patientName: 'Lucas Wright',
      patientPhone: '+1-555-0113',
      patientEmail: 'wright.family@example.com',
      doctorId: createdDoctors[3].id, // Dr. Talebin (Pediatrics)
      departmentId: depts['pediatrics'].id,
      branchId: b2.id,
      appointmentDate: '2026-09-19',
      timeSlot: '10:00 AM',
      type: 'In-person',
      status: 'Confirmed',
      notes: 'Childhood growth milestones and seasonal allergy check.',
      paymentStatus: 'Paid',
    },
    {
      appointmentNumber: 'APT-2026-008',
      patientId: createdPatients[7].id,
      patientName: 'Beatrice Taylor',
      patientPhone: '+1-555-0115',
      patientEmail: 'beatrice.taylor@example.com',
      doctorId: createdDoctors[4].id, // Dr. Johnson
      departmentId: depts['gynecology'].id,
      branchId: b1.id,
      appointmentDate: '2026-09-21',
      timeSlot: '03:30 PM',
      type: 'In-person',
      status: 'Pending',
      notes: 'First trimester ultrasound consultation.',
      paymentStatus: 'Pending',
    },
    {
      appointmentNumber: 'APT-2026-009',
      patientId: createdPatients[8].id,
      patientName: 'Samuel Green',
      patientPhone: '+1-555-0117',
      patientEmail: 'samuel.green@example.com',
      doctorId: createdDoctors[0].id, // Dr. Alexander (Cardio)
      departmentId: depts['cardiology'].id,
      branchId: b1.id,
      appointmentDate: '2026-09-21',
      timeSlot: '11:00 AM',
      type: 'Video Consultation',
      status: 'Confirmed',
      notes: 'Telemedicine check for blood pressure telemetry readings.',
      paymentStatus: 'Paid',
    },
    {
      appointmentNumber: 'APT-2026-010',
      patientId: createdPatients[9].id,
      patientName: 'Olivia Martinez',
      patientPhone: '+1-555-0119',
      patientEmail: 'olivia.m@example.com',
      doctorId: createdDoctors[5].id, // Dr. Rostova
      departmentId: depts['dermatology'].id,
      branchId: b2.id,
      appointmentDate: '2026-09-22',
      timeSlot: '01:30 PM',
      type: 'In-person',
      status: 'Cancelled',
      notes: 'Rescheduled by patient due to work travel.',
      paymentStatus: 'Refunded',
    },
  ];

  const createdApts: any[] = [];
  for (const apt of aptsData) {
    const a = await prisma.appointment.create({ data: apt });
    createdApts.push(a);

    // Create payment record if paid
    if (apt.paymentStatus === 'Paid') {
      await prisma.payment.create({
        data: {
          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          appointmentId: a.id,
          patientName: apt.patientName,
          amount: 150.0,
          currency: 'USD',
          gateway: 'Stripe',
          status: 'Paid',
        },
      });
    }
  }

  // 11. Prescriptions & Prescription Items
  const rx1 = await prisma.prescription.create({
    data: {
      prescriptionNumber: 'RX-2026-0811',
      appointmentId: createdApts[0].id,
      patientId: createdPatients[0].id,
      doctorId: createdDoctors[0].id,
      diagnosis: 'Essential Hypertension (Stage 1) & Mild Hyperlipidemia',
      instructions: 'Take medications strictly after meals. Monitor BP daily in morning and evening. Follow low-sodium DASH diet.',
      followUpDate: '2026-10-15',
    },
  });

  await prisma.prescriptionItem.createMany({
    data: [
      {
        prescriptionId: rx1.id,
        medicineName: 'Amlodipine Besylate',
        dosage: '5mg',
        frequency: '1-0-0 (Once daily morning)',
        duration: '30 Days',
        instructions: 'Take with or without water after breakfast.',
      },
      {
        prescriptionId: rx1.id,
        medicineName: 'Atorvastatin Calcium',
        dosage: '10mg',
        frequency: '0-0-1 (Once daily at bedtime)',
        duration: '30 Days',
        instructions: 'Take at night before sleep.',
      },
      {
        prescriptionId: rx1.id,
        medicineName: 'Omega-3 Marine Triglycerides',
        dosage: '1000mg',
        frequency: '0-1-0 (Once daily lunch)',
        duration: '60 Days',
        instructions: 'Take with main meal.',
      },
    ],
  });

  const rx2 = await prisma.prescription.create({
    data: {
      prescriptionNumber: 'RX-2026-0812',
      appointmentId: createdApts[3].id,
      patientId: createdPatients[3].id,
      doctorId: createdDoctors[4].id,
      diagnosis: 'Postpartum iron deficiency anemia and lactation support',
      instructions: 'Continue rich leafy green vegetable intake, plenty of fluids, and mild walking exercises.',
      followUpDate: '2026-11-01',
    },
  });

  await prisma.prescriptionItem.createMany({
    data: [
      {
        prescriptionId: rx2.id,
        medicineName: 'Ferrous Fumarate + Folic Acid',
        dosage: '200mg / 0.5mg',
        frequency: '1-0-0',
        duration: '60 Days',
        instructions: 'Take with orange juice for enhanced iron absorption.',
      },
      {
        prescriptionId: rx2.id,
        medicineName: 'Calcium Carbonate + Vitamin D3',
        dosage: '500mg / 400 IU',
        frequency: '0-1-0',
        duration: '90 Days',
        instructions: 'Take after lunch.',
      },
    ],
  });

  // 12. Medical Reports
  const reportsData = [
    {
      reportNumber: 'REP-55101',
      patientId: createdPatients[0].id,
      title: 'Comprehensive Lipid & Metabolic Panel',
      category: 'Blood Test',
      fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      testDate: '2026-09-10',
      doctorName: 'Dr. Addison Alexander',
      notes: 'Total cholesterol 215 mg/dL, Triglycerides 160 mg/dL, HDL 48 mg/dL, LDL 135 mg/dL. Fasting Glucose 94 mg/dL.',
    },
    {
      reportNumber: 'REP-55102',
      patientId: createdPatients[0].id,
      title: '12-Lead Electrocardiogram (ECG) Report',
      category: 'Cardiology',
      fileUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
      testDate: '2026-09-10',
      doctorName: 'Dr. Addison Alexander',
      notes: 'Normal sinus rhythm, heart rate 68 bpm. Normal axis, no acute ST-segment changes.',
    },
    {
      reportNumber: 'REP-55103',
      patientId: createdPatients[2].id,
      title: 'High Resolution Knee MRI Scan',
      category: 'MRI/CT',
      fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      testDate: '2026-09-12',
      doctorName: 'Dr. Andrew Bert',
      notes: 'Mild grade 1 medial meniscus fraying without displaced tear. Intact ACL and PCL ligaments.',
    },
    {
      reportNumber: 'REP-55104',
      patientId: createdPatients[5].id,
      title: 'HbA1c Glycated Hemoglobin Test',
      category: 'Pathology',
      fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      testDate: '2026-09-14',
      doctorName: 'Dr. Emily Watson',
      notes: 'HbA1c level 6.7% indicating good glycemic stability under ongoing oral therapy.',
    },
  ];

  for (const rep of reportsData) {
    await prisma.medicalReport.create({ data: rep });
  }

  // 13. CRM Leads (10+ Leads)
  const leadsData = [
    {
      name: 'Michael Henderson',
      phone: '+1-555-0201',
      email: 'm.henderson@example.com',
      source: 'Appointment',
      interestedService: 'Executive Cardiac Screening',
      assignedStaff: 'Nurse Manager Brenda',
      status: 'Qualified',
      notes: 'Requested priority appointment slot with Dr. Alexander.',
      followUpDate: '2026-09-16',
    },
    {
      name: 'Jennifer Lopez',
      phone: '+1-555-0202',
      email: 'jennifer.l@example.com',
      source: 'Contact Form',
      interestedService: 'Laser Skin Resurfacing',
      assignedStaff: 'Front Desk Chloe',
      status: 'New',
      notes: 'Inquiring about dermatology packages for acne scars.',
      followUpDate: '2026-09-15',
    },
    {
      name: 'Arthur Pendelton',
      phone: '+1-555-0203',
      email: 'arthur.p@example.com',
      source: 'WhatsApp',
      interestedService: 'Knee Joint Replacement',
      assignedStaff: 'Dr. Bert Team',
      status: 'Contacted',
      notes: 'Discussed robotic surgery costs, sent hospital brochure.',
      followUpDate: '2026-09-17',
    },
    {
      name: 'Samantha Ray',
      phone: '+1-555-0204',
      email: 'samantha.ray@example.com',
      source: 'Health Package',
      interestedService: 'Women Comprehensive Wellness Package',
      assignedStaff: 'Wellness Coordinator Lisa',
      status: 'Booked',
      notes: 'Confirmed booking for Saturday morning session.',
      followUpDate: '2026-09-20',
    },
    {
      name: 'David Thorne',
      phone: '+1-555-0205',
      email: 'dthorne@example.com',
      source: 'Callback Request',
      interestedService: 'ENT Sinus Surgery',
      assignedStaff: 'Consultant Liaison Alan',
      status: 'Converted',
      notes: 'Patient successfully admitted for scheduled procedure.',
      followUpDate: '2026-09-18',
    },
    {
      name: 'Hannah Brooks',
      phone: '+1-555-0206',
      email: 'hannah.b@example.com',
      source: 'Consultation',
      interestedService: 'Pediatric Asthma Evaluation',
      assignedStaff: 'Pediatric Reception',
      status: 'Qualified',
      notes: 'Needs appointment around school hours.',
      followUpDate: '2026-09-19',
    },
    {
      name: 'William Taylor',
      phone: '+1-555-0207',
      email: 'wtaylor@example.com',
      source: 'Career Application',
      interestedService: 'Staff Nurse Position',
      assignedStaff: 'HR Officer Rachel',
      status: 'Contacted',
      notes: 'Resume screened, scheduled phone screening.',
      followUpDate: '2026-09-21',
    },
    {
      name: 'Victoria Vance',
      phone: '+1-555-0208',
      email: 'vvance@example.com',
      source: 'Newsletter',
      interestedService: 'Heart Health Webinar',
      assignedStaff: 'Marketing Team',
      status: 'New',
      notes: 'Subscribed through homepage footer.',
      followUpDate: '2026-09-22',
    },
    {
      name: 'Ethan Hunt',
      phone: '+1-555-0209',
      email: 'ethan.h@example.com',
      source: 'Contact Form',
      interestedService: 'Executive Full Body Checkup',
      assignedStaff: 'VIP Concierge',
      status: 'Converted',
      notes: 'Corporate executive package booked for executive team.',
      followUpDate: '2026-09-23',
    },
    {
      name: 'Sophia Adams',
      phone: '+1-555-0210',
      email: 'sadams@example.com',
      source: 'WhatsApp',
      interestedService: 'Dental Implants Consultation',
      assignedStaff: 'Dental Coordinator Roy',
      status: 'Lost',
      notes: 'Patient opted for clinic closer to home in New Jersey.',
      followUpDate: '2026-09-14',
    },
  ];

  for (const l of leadsData) {
    await prisma.lead.create({ data: l });
  }

  // 14. Blog Posts & Categories (8+ Posts)
  const cat1 = await prisma.blogCategory.create({ data: { name: 'Cardiovascular Health', slug: 'cardiovascular-health', postCount: 3 } });
  const cat2 = await prisma.blogCategory.create({ data: { name: 'Healthy Lifestyle', slug: 'healthy-lifestyle', postCount: 3 } });
  const cat3 = await prisma.blogCategory.create({ data: { name: 'Pediatrics & Parenting', slug: 'pediatrics-parenting', postCount: 2 } });

  const blogsData = [
    {
      title: '10 Essential Steps for Maintaining a Resilient Heart in 2026',
      slug: '10-essential-steps-for-resilient-heart',
      featuredImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      category: 'Cardiovascular Health',
      tags: 'heart, cardiology, diet, prevention, longevity',
      author: 'Dr. Addison Alexander',
      shortDesc: 'Discover the latest scientific recommendations for preventing coronary artery disease and optimizing heart rhythm naturally.',
      content: `<p>Maintaining cardiovascular vitality requires more than occasional exercise. In this comprehensive guide, Dr. Addison Alexander breaks down the primary pillars of modern heart preservation.</p><h3>1. Blood Pressure Telemetry</h3><p>Consistent tracking is paramount. Maintaining systolic levels below 120 mmHg reduces stroke hazard by over 40%.</p><h3>2. Mediterranean Lipid Profile</h3><p>Emphasizing monounsaturated fatty acids, wild-caught omega-3s, and daily polyphenols lowers vascular plaque accumulation.</p><h3>3. High-Intensity Interval Training</h3><p>Brief periods of elevated aerobic output strengthen myocardial wall elasticity and optimize VO2 max.</p>`,
      status: 'Published',
      views: 1420,
    },
    {
      title: 'Understanding Modern Minimally Invasive Joint Replacement',
      slug: 'understanding-minimally-invasive-joint-replacement',
      featuredImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      category: 'Healthy Lifestyle',
      tags: 'orthopedics, surgery, joint care, rehabilitation',
      author: 'Dr. Andrew Bert',
      shortDesc: 'How robotic navigational precision enables patients to walk comfortably within hours after hip and knee surgery.',
      content: `<p>Orthopedic surgical methodology has transformed dramatically over the last decade. Sub-millimeter computer optical tracking ensures implant placement matches each patient’s unique skeletal anatomy.</p><h3>Key Benefits</h3><ul><li>Significantly lower intraoperative blood loss</li><li>Muscle-sparing access vectors</li><li>Discharge within 24 to 48 hours</li><li>Restored natural joint kinetics</li></ul>`,
      status: 'Published',
      views: 980,
    },
    {
      title: 'Childhood Nutrition: Building Lifelong Immunity and Energy',
      slug: 'childhood-nutrition-building-lifelong-immunity',
      featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      category: 'Pediatrics & Parenting',
      tags: 'pediatrics, nutrition, parenting, kids health',
      author: 'Dr. Orana Talebin',
      shortDesc: 'A practical pediatrician guide to balanced macronutrients, gut microbiome health, and avoiding hidden refined sugars.',
      content: `<p>Early dietary patterns form the biological cornerstone of juvenile immunological resilience. Dr. Orana Talebin shares actionable guidelines for growing families.</p>`,
      status: 'Published',
      views: 820,
    },
    {
      title: 'The Silent Threat of Sleep Apnea on Neurological Function',
      slug: 'silent-threat-of-sleep-apnea-on-neurological-function',
      featuredImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
      category: 'Cardiovascular Health',
      tags: 'neurology, sleep, brain, oxygenation',
      author: 'Dr. Adaline Becka',
      shortDesc: 'Chronic nighttime nocturnal desaturations impair memory, focus, and elevate long-term stroke vulnerability.',
      content: `<p>Recurrent airway collapse disrupts deep REM sleep cycles, causing micro-vascular neuro-inflammation that manifests as chronic daytime fatigue and cognitive fog.</p>`,
      status: 'Published',
      views: 1150,
    },
    {
      title: 'Advanced Dermatological Care: What Laser Wavelengths Do',
      slug: 'advanced-dermatological-care-laser-wavelengths',
      featuredImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      category: 'Healthy Lifestyle',
      tags: 'dermatology, laser, skincare, aesthetics',
      author: 'Dr. Elena Rostova',
      shortDesc: 'Deciphering fractional erbium, picosecond, and vascular lasers for scar remodeling and hyperpigmentation.',
      content: `<p>Modern dermatological lasers selectively target melanin and hemoglobin without thermal harm to surrounding collagen structures.</p>`,
      status: 'Published',
      views: 740,
    },
    {
      title: 'Early Detection of Diabetes: Warning Signs You Shouldn’t Ignore',
      slug: 'early-detection-of-diabetes-warning-signs',
      featuredImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      category: 'Healthy Lifestyle',
      tags: 'diabetes, primary care, glucose, metabolism',
      author: 'Dr. Emily Watson',
      shortDesc: 'Frequent thirst, unexplained fatigue, and slow-healing cuts: how routine screening prevents microvascular complications.',
      content: `<p>Pre-diabetes affects one in three adults, yet over 80% remain undiagnosed. A simple fasting glucose or HbA1c test gives you clarity.</p>`,
      status: 'Published',
      views: 1310,
    },
    {
      title: 'Seasonal Allergies vs. Sinusitis: How to Tell the Difference',
      slug: 'seasonal-allergies-vs-sinusitis-difference',
      featuredImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      category: 'Healthy Lifestyle',
      tags: 'ent, allergies, breathing, wellness',
      author: 'Dr. Marcus Vance',
      shortDesc: 'Facial pressure, discolored mucus, or itchy watery eyes? Discover when you need ENT specialist intervention.',
      content: `<p>While antihistamines alleviate histamine-driven sneezing, bacterial chronic rhinosinusitis requires targeted endoscopic evaluation and irrigation.</p>`,
      status: 'Published',
      views: 650,
    },
    {
      title: 'Pre-Conception Health: Preparing for a Safe, Joyful Pregnancy',
      slug: 'pre-conception-health-safe-joyful-pregnancy',
      featuredImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
      category: 'Pediatrics & Parenting',
      tags: 'gynecology, pregnancy, maternal health, baby',
      author: 'Dr. Sarah Johnson',
      shortDesc: 'Vital prenatal supplements, genetic screening, and maternal wellness protocols before conception.',
      content: `<p>A healthy pregnancy starts months prior to fertilization. Folate supplementation, thyroid optimization, and blood pressure checks create the optimal maternal environment.</p>`,
      status: 'Published',
      views: 920,
    },
  ];

  for (const b of blogsData) {
    await prisma.blogPost.create({ data: b });
  }

  // 15. Gallery Items (10+ Items)
  const galleryData = [
    { title: 'Modern Hybrid Surgical Theater', category: 'Facilities', imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80', description: 'Advanced intraoperative 3D imaging for robotic surgery.' },
    { title: 'Level 1 Trauma Resuscitation Bay', category: 'Facilities', imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80', description: '24/7 immediate trauma triage ready for critical emergencies.' },
    { title: 'Cardiology Consultation Suite', category: 'Hospital', imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80', description: 'Private, tranquil consultation room with echocardiogram telemetry.' },
    { title: 'Pediatric Care Ward & Play Lounge', category: 'Hospital', imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', description: 'Comfortable, colorful healing space tailored for young patients.' },
    { title: 'Chief Surgeon Team Briefing', category: 'Doctors', imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80', description: 'Multidisciplinary tumor board discussing precision treatment.' },
    { title: 'Senior Neurologist Evaluation', category: 'Doctors', imageUrl: 'https://images.unsplash.com/photo-1594824813576-248386348efc?auto=format&fit=crop&w=800&q=80', description: 'Compassionate bedside neurological assessment.' },
    { title: '3 Tesla High-Precision MRI Scanner', category: 'Equipment', imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80', description: 'Ultra-clear neuro and musculoskeletal scans in reduced time.' },
    { title: 'Automated Clinical Biochemistry Robot', category: 'Equipment', imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80', description: 'Precision robotic handling delivering error-free blood analysis.' },
    { title: 'Annual International Medical Symposium', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', description: 'Hosting 400+ international cardiac surgeons in New York.' },
    { title: 'Community Heart Health Awareness Day', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80', description: 'Free cardiovascular screening and CPR training for 1,200 citizens.' },
  ];

  for (const g of galleryData) {
    await prisma.galleryItem.create({ data: g });
  }

  // 16. Testimonials (6+ Real stories)
  const testimonialsData = [
    {
      patientName: 'Gregory Vance',
      patientRole: 'Cardiac Bypass Patient',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      review: 'Dr. Addison Alexander and the surgical nursing team gave me my life back. The cardiac ICU was spotless, and their warmth turned an intimidating emergency into a tranquil recovery.',
      rating: 5,
      department: 'Cardiology Clinic',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Elena Rostova-Petrov',
      patientRole: 'Orthopedic Knee Patient',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      review: 'After suffering chronic knee arthritis for four years, Dr. Andrew Bert performed robotic knee surgery. I was walking the next morning without pain. Simply phenomenal standard of care.',
      rating: 5,
      department: 'Orthopedics & Joint Care',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'David & Karen Miller',
      patientRole: 'Parents of Pediatric Patient',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      review: 'Dr. Orana Talebin handled our 5-year-old daughter with infinite patience and gentleness. MedicalPress is our whole family’s trusted hospital for all health matters.',
      rating: 5,
      department: 'Pediatrics Clinic',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Sophia Montgomery',
      patientRole: 'Maternity Patient',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      review: 'The birthing suites are comparable to a 5-star hotel, and Dr. Sarah Johnson’s calm guidance made our baby boy’s delivery an unforgettable, peaceful memory.',
      rating: 5,
      department: 'Gynaecological Clinic',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Arthur Jenkins',
      patientRole: 'Emergency Stroke Survivor',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      review: 'The rapid triage response at MedicalPress was incredible. From ambulance arrival to neuro-thrombolysis took only 22 minutes. Dr. Becka’s precision prevented any permanent damage.',
      rating: 5,
      department: 'Neurology & Neurosurgery',
      isApproved: true,
      isFeatured: true,
    },
    {
      patientName: 'Nadia Al-Mansoor',
      patientRole: 'Executive Wellness Patient',
      photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
      review: 'Every test during my full body checkup was coordinated seamlessly in less than 3 hours. Reports were uploaded directly to my online portal the very same day.',
      rating: 5,
      department: 'Primary Health Care',
      isApproved: true,
      isFeatured: true,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  // 17. FAQs (10+ Items)
  const faqsData = [
    {
      question: 'How do I book an appointment with a specialist?',
      answer: 'You can book directly through our online realistic clipboard booking page by choosing your department, preferred specialist, and available time slot. Alternatively, call our appointment desk at +1-800-654-3210.',
      category: 'Appointments',
      displayOrder: 1,
    },
    {
      question: 'What documents should I bring to my initial consultation?',
      answer: 'Please bring a valid photo ID, your insurance card, any recent medical records/scans, and a complete list of current prescription or over-the-counter medications.',
      category: 'Appointments',
      displayOrder: 2,
    },
    {
      question: 'Does MedicalPress accept international health insurance plans?',
      answer: 'Yes, we partner directly with over 45 major global insurers including Bupa Global, Cigna Global, Allianz Care, Aetna International, and Blue Cross Blue Shield. We provide direct cashless billing assistance.',
      category: 'Billing & Insurance',
      displayOrder: 3,
    },
    {
      question: 'How fast can an emergency ambulance reach my location?',
      answer: 'Our GPS-monitored ICU mobile ambulances have an average urban response dispatch time of under 8 to 12 minutes in the metropolitan area. Call our dedicated emergency hotline at +1-800-999-HELP.',
      category: 'Emergency',
      displayOrder: 4,
    },
    {
      question: 'How do I access my diagnostic laboratory or MRI reports online?',
      answer: 'Visit the Patient Portal tab on our website, enter your registered Patient ID (e.g. MED-90201) and phone number. All approved digital laboratory reports and physician notes are downloadable in PDF format.',
      category: 'Medical Reports',
      displayOrder: 5,
    },
    {
      question: 'Can I reschedule or cancel a booked appointment?',
      answer: 'Yes, appointments can be modified up to 4 hours prior to the scheduled slot with zero cancellation fees through your confirmation email link or by contacting reception.',
      category: 'Appointments',
      displayOrder: 6,
    },
    {
      question: 'What safety precautions are in place in surgical wards?',
      answer: 'Our operating theaters utilize ultra-clean laminar airflow systems, HEPA filtration surpassing ISO Class 5 cleanroom standards, and rigorous sterilization audits to maintain our 0.08% surgical site infection rate.',
      category: 'General',
      displayOrder: 7,
    },
    {
      question: 'Are visiting hours flexible for family members?',
      answer: 'General inpatient visiting hours are from 10:00 AM to 8:00 PM daily. For intensive care units (ICU), visiting is restricted to immediate family during designated slots to ensure patient safety and infection control.',
      category: 'General',
      displayOrder: 8,
    },
    {
      question: 'Do you provide translation and language support services?',
      answer: 'Yes, we offer on-site certified medical interpreters for Arabic, Bengali, Spanish, Mandarin, and Russian, ensuring comfortable, crystal-clear communication with all patients.',
      category: 'General',
      displayOrder: 9,
    },
    {
      question: 'What is included in the Comprehensive Full Body Checkup?',
      answer: 'It includes 65+ biomarker tests: CBC, complete lipid profile, renal panel, liver function, HbA1c, thyroid panel, 12-lead ECG, chest X-ray, abdominal ultrasound, and a detailed 45-minute physician consultation.',
      category: 'Health Packages',
      displayOrder: 10,
    },
  ];

  for (const f of faqsData) {
    await prisma.faq.create({ data: f });
  }

  // 18. Health Packages (5 Packages)
  const packagesData = [
    {
      name: 'Comprehensive Full Body Checkup',
      slug: 'full-body-checkup',
      price: 299.0,
      discount: 25.0,
      originalPrice: 399.0,
      testsIncluded: 'Complete Blood Count (CBC)\nLipid & Cholesterol Profile\nLiver Function Test (LFT)\nKidney Function Test (KFT)\nFasting Blood Sugar & HbA1c\nDigital Chest X-Ray\n12-Lead Resting ECG\nAbdominal Ultrasound\nConsultation with Senior Physician',
      description: 'An all-inclusive annual diagnostic audit evaluating metabolic health, cardiovascular status, vital organs, and chronic disease markers.',
      duration: '3 - 4 Hours',
      availability: 'Mon - Sat (8 AM - 12 PM)',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Advanced Cardiac Wellness Package',
      slug: 'cardiac-package',
      price: 380.0,
      discount: 20.0,
      originalPrice: 475.0,
      testsIncluded: 'Lipoprotein(a) & hs-CRP\nHigh-Resolution 2D Echocardiogram\nCardiac Stress Treadmill Test (TMT)\n12-Lead Electrocardiogram\nCarotid Doppler Ultrasound\nElectrolytes & Renal Function\nCardiologist Consultation with Dr. Alexander',
      description: 'Specialized cardiovascular assessment designed to detect early coronary plaque, heart muscle elasticity, and stroke risks.',
      duration: '2.5 Hours',
      availability: 'Daily (9 AM - 2 PM)',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Executive Metabolic & Diabetes Panel',
      slug: 'diabetes-package',
      price: 180.0,
      discount: 15.0,
      originalPrice: 210.0,
      testsIncluded: 'Fasting & Post-Prandial Glucose\nGlycated Hemoglobin (HbA1c)\nUrine Microalbumin/Creatinine Ratio\nSerum Creatinine & eGFR\nLipid Profile & Triglycerides\nDiabetic Retinopathy Eye Exam\nDiabetologist Consultation',
      description: 'Focused glycemic profiling for early detection and comprehensive management of pre-diabetes and Type 1/2 diabetes.',
      duration: '2 Hours',
      availability: 'Mon - Fri (8 AM - 11 AM)',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Women’s Comprehensive Health Package',
      slug: 'womens-health-package',
      price: 340.0,
      discount: 20.0,
      originalPrice: 425.0,
      testsIncluded: 'Liquid-Based Pap Smear\nDigital Screening Mammography\nPelvic Ultrasound (TVS)\nThyroid Profile (TSH, FT3, FT4)\nSerum Vitamin D3 & B12\nIron & Ferritin Levels\nGynecologist Consultation with Dr. Johnson',
      description: 'Tailored specifically for women of all life stages to screen for cervical, breast, hormonal, bone density, and reproductive wellness.',
      duration: '3 Hours',
      availability: 'Mon - Sat (9 AM - 1 PM)',
      image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
    {
      name: 'Executive Premier Health Assessment',
      slug: 'executive-package',
      price: 650.0,
      discount: 30.0,
      originalPrice: 925.0,
      testsIncluded: 'Comprehensive Full Body Biomarkers (80+ Tests)\nCoronary Calcium CT Scan\nWhole Body Ultrasound Screening\nPulmonary Function Test (PFT)\nAudiometry & Vision Testing\nPersonalized Nutrition & Exercise Prescription\nVIP Lounge Access & Private Escort Nurse',
      description: 'Our most prestigious preventive medicine protocol providing unhurried evaluations with leading clinical heads in absolute privacy.',
      duration: 'Full Morning (4 Hours)',
      availability: 'By Appointment Only',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    },
  ];

  for (const pkg of packagesData) {
    await prisma.healthPackage.create({ data: pkg });
  }

  // 19. Blood Bank Inventory
  const bloodGroups = [
    { bloodGroup: 'A+', unitsAvailable: 42, status: 'Normal' },
    { bloodGroup: 'A-', unitsAvailable: 14, status: 'Adequate' },
    { bloodGroup: 'B+', unitsAvailable: 38, status: 'Normal' },
    { bloodGroup: 'B-', unitsAvailable: 8, status: 'Critical' },
    { bloodGroup: 'AB+', unitsAvailable: 22, status: 'Adequate' },
    { bloodGroup: 'AB-', unitsAvailable: 5, status: 'Critical' },
    { bloodGroup: 'O+', unitsAvailable: 65, status: 'Normal' },
    { bloodGroup: 'O-', unitsAvailable: 11, status: 'Critical' },
  ];

  for (const bg of bloodGroups) {
    await prisma.bloodInventory.create({ data: bg });
  }

  // 20. Ambulance Fleet
  const ambulances = [
    {
      vehicleNumber: 'AMB-MED-01',
      ambulanceType: 'Advanced Cardiac ICU Unit',
      driverName: 'Robert Martinez',
      driverPhone: '+1-800-555-0191',
      serviceArea: 'Downtown & Metro Core',
      isAvailable: true,
    },
    {
      vehicleNumber: 'AMB-MED-02',
      ambulanceType: 'Neonatal & Pediatric Transport ICU',
      driverName: 'James Wilson',
      driverPhone: '+1-800-555-0192',
      serviceArea: 'Midtown & Northern District',
      isAvailable: true,
    },
    {
      vehicleNumber: 'AMB-MED-03',
      ambulanceType: 'Basic Life Support (BLS)',
      driverName: 'Thomas Anderson',
      driverPhone: '+1-800-555-0193',
      serviceArea: 'West Suburbs & Highway Corridor',
      isAvailable: true,
    },
  ];

  for (const amb of ambulances) {
    await prisma.ambulance.create({ data: amb });
  }

  // 21. Careers & Job Postings
  const jobsData = [
    {
      title: 'Senior Staff Nurse (ICU & Critical Care)',
      slug: 'senior-staff-nurse-icu',
      department: 'Emergency & Critical Care',
      location: 'Downtown Main Campus',
      employmentType: 'Full-time',
      salaryRange: '$85,000 - $105,000 / yr',
      experienceRequired: '3+ Years ICU Experience',
      deadline: '2026-10-30',
      description: 'We are seeking an experienced, compassionate Critical Care Staff Nurse to join our multi-disciplinary intensive care unit.',
      requirements: 'BSN degree, valid State RN License, BLS and ACLS certification, minimum 3 years of clinical acute ICU experience.',
      responsibilities: 'Deliver continuous hemodynamic monitoring, ventilator management, medication titration, and patient family coordination.',
    },
    {
      title: 'Resident Medical Officer (Emergency Medicine)',
      slug: 'resident-medical-officer-emergency',
      department: 'Emergency Medicine',
      location: 'Downtown Main Campus',
      employmentType: 'Full-time / Rotational',
      salaryRange: '$120,000 - $145,000 / yr',
      experienceRequired: '2+ Years Emergency Care',
      deadline: '2026-11-15',
      description: 'Provide round-the-clock frontline medical evaluation, resuscitation, and triage in our high-volume Level 1 Trauma Center.',
      requirements: 'MBBS/MD degree, state medical board registration, ATLS and ACLS credentials.',
      responsibilities: 'Execute initial clinical evaluations, manage trauma resuscitations, coordinate emergency admissions, and perform procedures.',
    },
    {
      title: 'Senior Medical Laboratory Technologist',
      slug: 'medical-laboratory-technologist',
      department: 'Automated Pathology & Biochemistry',
      location: 'Downtown Main Campus',
      employmentType: 'Full-time',
      salaryRange: '$70,000 - $88,000 / yr',
      experienceRequired: '2+ Years Clinical Lab',
      deadline: '2026-10-25',
      description: 'Oversee automated robotic hematology, chemistry analyzers, and quality assurance control protocols.',
      requirements: 'Bachelor’s degree in Medical Laboratory Science, ASCP certification.',
      responsibilities: 'Calibrate analyzers, conduct blood cross-matching, verify test results, and maintain CAP accreditation standards.',
    },
  ];

  for (const j of jobsData) {
    await prisma.jobPosting.create({ data: j });
  }

  // 22. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      userName: 'Dr. Arthur Sterling',
      action: 'System Initialized',
      module: 'Global Settings',
      details: 'Enterprise database seeded with complete hospital operational data.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
