import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: { status: 'Open' },
      include: {
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a job application submission
    if (body.jobPostingId) {
      const app = await prisma.jobApplication.create({
        data: {
          jobPostingId: body.jobPostingId,
          name: body.name,
          email: body.email,
          phone: body.phone,
          coverLetter: body.coverLetter || null,
          cvUrl: body.cvUrl || null,
          status: 'New',
        },
      });

      // Capture CRM lead
      await prisma.lead.create({
        data: {
          name: body.name,
          phone: body.phone,
          email: body.email,
          source: 'Career Application',
          interestedService: 'Job Applicant',
          status: 'New',
          notes: `Applied for job posting ID: ${body.jobPostingId}`,
        },
      });

      return NextResponse.json(app);
    }

    // Otherwise, create job posting
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const job = await prisma.jobPosting.create({
      data: {
        title: body.title,
        slug: body.slug || slug,
        department: body.department,
        location: body.location || 'Main Campus',
        employmentType: body.employmentType || 'Full-time',
        salaryRange: body.salaryRange || null,
        experienceRequired: body.experienceRequired,
        deadline: body.deadline,
        description: body.description,
        requirements: body.requirements,
        responsibilities: body.responsibilities,
        status: body.status || 'Open',
      },
    });
    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process career action' }, { status: 400 });
  }
}
