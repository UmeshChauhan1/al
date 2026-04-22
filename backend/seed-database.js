/**
 * Demo Data Seeder
 *
 * Populates the MongoDB database with realistic demo data for alumni,
 * jobs, courses, events, forum topics, news, badges, gallery items, and
 * donation campaigns.
 *
 * Usage:
 *   npm run seed
 *
 * Optional environment variables:
 *   SEED_ADMIN_EMAIL=admin@example.com
 *   SEED_ADMIN_PASSWORD=Admin@12345
 *   SEED_RESET=true|false
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  User,
  Course,
  Career,
  Event,
  EventCalendar,
  ForumTopic,
  Gallery,
  SystemSetting,
  News,
  Badge,
  UserBadge,
  Endorsement,
  DirectMessage,
  Achievement,
  DonationCampaign,
  Donation,
  MentorProfile,
  MentorshipMatch,
  MentorshipSession,
  MentorshipMessage,
  Business
} = require('./models/Index');
const BusinessReview = require('./models/BusinessReview.model');
const Reunion = require('./models/Reunion.model');
const ReunionContribution = require('./models/ReunionContribution.model');
const ReunionMemory = require('./models/ReunionMemory.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_management';
const SEED_RESET = process.env.SEED_RESET !== 'false';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@alumni.local';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
}

async function clearDemoCollections() {
  await Promise.all([
    ReunionMemory.deleteMany({}),
    ReunionContribution.deleteMany({}),
    Reunion.deleteMany({}),
    MentorshipMessage.deleteMany({}),
    MentorshipSession.deleteMany({}),
    MentorshipMatch.deleteMany({}),
    MentorProfile.deleteMany({}),
    DirectMessage.deleteMany({}),
    Endorsement.deleteMany({}),
    UserBadge.deleteMany({}),
    Achievement.deleteMany({}),
    BusinessReview.deleteMany({}),
    Business.deleteMany({}),
    Donation.deleteMany({}),
    DonationCampaign.deleteMany({}),
    EventCalendar.deleteMany({}),
    News.deleteMany({}),
    Badge.deleteMany({}),
    Gallery.deleteMany({}),
    ForumTopic.deleteMany({}),
    Career.deleteMany({}),
    Event.deleteMany({}),
    User.deleteMany({}),
    Course.deleteMany({}),
    SystemSetting.deleteMany({})
  ]);
}

async function seedDatabase() {
  if (SEED_RESET) {
    await clearDemoCollections();
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await User.create({
    name: 'System Admin',
    email: ADMIN_EMAIL,
    password: passwordHash,
    type: 'admin'
  });

  const courses = await Course.insertMany([
    {
      title: 'Computer Science and Engineering',
      description: 'Core programming, systems, and software engineering foundations.',
      instructor: admin._id,
      category: 'Engineering',
      tags: ['programming', 'software', 'engineering'],
      duration: 720,
      level: 'beginner',
      isFree: true,
      status: 'published',
      isPublished: true,
      description_short: 'Software engineering fundamentals for modern development.',
      learningOutcomes: ['Build web apps', 'Work with APIs', 'Ship production code'],
      requirements: ['Basic computer literacy']
    },
    {
      title: 'Business Administration',
      description: 'Management, communication, finance, and leadership basics.',
      instructor: admin._id,
      category: 'Business',
      tags: ['management', 'leadership', 'finance'],
      duration: 540,
      level: 'beginner',
      isFree: true,
      status: 'published',
      isPublished: true,
      description_short: 'Practical management and business communication skills.',
      learningOutcomes: ['Lead teams', 'Analyze markets', 'Plan projects'],
      requirements: ['Interest in business and planning']
    },
    {
      title: 'Electronics and Communication',
      description: 'Signals, embedded systems, and communication technologies.',
      instructor: admin._id,
      category: 'Technology',
      tags: ['electronics', 'embedded', 'communication'],
      duration: 600,
      level: 'intermediate',
      isFree: true,
      status: 'published',
      isPublished: true,
      description_short: 'Hardware and communication systems for technical careers.',
      learningOutcomes: ['Design circuits', 'Work with IoT systems', 'Understand communication protocols'],
      requirements: ['Basic math and physics']
    }
  ]);

  const [csCourse, businessCourse, ecCourse] = courses;

  const alumniSeed = [
    {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      gender: 'male',
      batch: 2021,
      course: csCourse._id,
      connected_to: 'Software Engineering',
      avatar: '',
      status: 1,
      skills: ['JavaScript', 'Node.js', 'MongoDB'],
      location: 'Bengaluru, India',
      company: 'CodeWave Labs',
      job_title: 'Full Stack Developer',
      industry: 'Software',
      interests: ['Open source', 'Mentorship', 'Web apps'],
      bio: 'Builds product experiences for learning platforms and mentors student developers.'
    },
    {
      name: 'Neha Sharma',
      email: 'neha.sharma@example.com',
      gender: 'female',
      batch: 2020,
      course: businessCourse._id,
      connected_to: 'Business Development',
      avatar: '',
      status: 1,
      skills: ['Marketing', 'Strategy', 'Operations'],
      location: 'Mumbai, India',
      company: 'Northstar Consulting',
      job_title: 'Business Analyst',
      industry: 'Consulting',
      interests: ['Startups', 'Networking', 'Leadership'],
      bio: 'Works with growth-stage companies on strategy and go-to-market planning.'
    },
    {
      name: 'Rohan Kapoor',
      email: 'rohan.kapoor@example.com',
      gender: 'male',
      batch: 2019,
      course: ecCourse._id,
      connected_to: 'Embedded Systems',
      avatar: '',
      status: 1,
      skills: ['Embedded C', 'IoT', 'PCB Design'],
      location: 'Hyderabad, India',
      company: 'CircuitForge',
      job_title: 'Hardware Engineer',
      industry: 'Electronics',
      interests: ['IoT', 'Robotics', 'Research'],
      bio: 'Designs connected devices for industrial monitoring and smart energy systems.'
    },
    {
      name: 'Priya Desai',
      email: 'priya.desai@example.com',
      gender: 'female',
      batch: 2022,
      course: csCourse._id,
      connected_to: 'Product and Data',
      avatar: '',
      status: 1,
      skills: ['Python', 'Data Analysis', 'Product Thinking'],
      location: 'Pune, India',
      company: 'Insightly',
      job_title: 'Product Analyst',
      industry: 'SaaS',
      interests: ['Analytics', 'Product design', 'Community events'],
      bio: 'Focuses on user behavior analytics and product improvement loops.'
    },
    {
      name: 'Imran Khan',
      email: 'imran.khan@example.com',
      gender: 'male',
      batch: 2018,
      course: businessCourse._id,
      connected_to: 'Finance and Strategy',
      avatar: '',
      status: 1,
      skills: ['Finance', 'Planning', 'Stakeholder Management'],
      location: 'Delhi, India',
      company: 'Vertex Capital',
      job_title: 'Operations Manager',
      industry: 'Finance',
      interests: ['Alumni mentoring', 'Fundraising', 'Career development'],
      bio: 'Leads operational planning and supports alumni career mentoring initiatives.'
    }
  ];

  const alumniUsers = [];
  for (const alumnus of alumniSeed) {
    const user = await User.create({
      name: alumnus.name,
      email: alumnus.email,
      password: passwordHash,
      type: 'alumnus',
      alumnus_bio: {
        gender: alumnus.gender,
        batch: alumnus.batch,
        course: alumnus.course,
        connected_to: alumnus.connected_to,
        avatar: alumnus.avatar,
        status: alumnus.status,
        skills: alumnus.skills,
        location: alumnus.location,
        company: alumnus.company,
        job_title: alumnus.job_title,
        industry: alumnus.industry,
        interests: alumnus.interests,
        endorsementCount: 0,
        bio: alumnus.bio,
        isSearchable: true
      }
    });
    alumniUsers.push(user);
  }

  const studentUsers = await User.insertMany([
    {
      name: 'Kabir Singh',
      email: 'kabir.singh@example.com',
      password: passwordHash,
      type: 'student',
      student_bio: {
        gender: 'male',
        enrollment_year: 2023,
        current_year: 3,
        course: csCourse._id,
        roll_number: 'CS-2023-014'
      }
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      password: passwordHash,
      type: 'student',
      student_bio: {
        gender: 'female',
        enrollment_year: 2024,
        current_year: 2,
        course: businessCourse._id,
        roll_number: 'BA-2024-009'
      }
    },
    {
      name: 'Sahil Verma',
      email: 'sahil.verma@example.com',
      password: passwordHash,
      type: 'student',
      student_bio: {
        gender: 'male',
        enrollment_year: 2022,
        current_year: 4,
        course: ecCourse._id,
        roll_number: 'EC-2022-021'
      }
    }
  ]);

  const [kabir, ananya, sahil] = studentUsers;

  await Career.insertMany([
    {
      company: 'CodeWave Labs',
      location: 'Bengaluru, India',
      job_title: 'Frontend Developer',
      description: 'Build user-facing features for the alumni portal and internal tools.',
      skills: ['React', 'JavaScript', 'CSS'],
      job_type: 'full-time',
      experience_level: 'entry',
      salary_range: '6-10 LPA',
      user: alumniUsers[0]._id,
      applicants: [{ user: kabir._id, status: 'pending' }]
    },
    {
      company: 'Northstar Consulting',
      location: 'Mumbai, India',
      job_title: 'Business Analyst',
      description: 'Support market research, reporting, and client strategy projects.',
      skills: ['Excel', 'Communication', 'Strategy'],
      job_type: 'full-time',
      experience_level: 'mid',
      salary_range: '8-12 LPA',
      user: alumniUsers[1]._id,
      applicants: [{ user: ananya._id, status: 'pending' }]
    },
    {
      company: 'CircuitForge',
      location: 'Hyderabad, India',
      job_title: 'Embedded Systems Intern',
      description: 'Work on hardware prototypes and firmware testing for IoT products.',
      skills: ['C', 'Embedded Systems', 'Debugging'],
      job_type: 'internship',
      experience_level: 'entry',
      salary_range: 'Stipend provided',
      user: alumniUsers[2]._id,
      applicants: [{ user: sahil._id, status: 'pending' }]
    },
    {
      company: 'Insightly',
      location: 'Pune, India',
      job_title: 'Data Analyst',
      description: 'Turn product usage data into actionable recommendations.',
      skills: ['Python', 'SQL', 'Analytics'],
      job_type: 'remote',
      experience_level: 'mid',
      salary_range: '10-14 LPA',
      user: alumniUsers[3]._id,
      applicants: []
    },
    {
      company: 'Vertex Capital',
      location: 'Delhi, India',
      job_title: 'Operations Associate',
      description: 'Coordinate daily operations and reporting for finance programs.',
      skills: ['Operations', 'Planning', 'Reporting'],
      job_type: 'full-time',
      experience_level: 'entry',
      salary_range: '7-11 LPA',
      user: alumniUsers[4]._id,
      applicants: []
    }
  ]);

  await Event.insertMany([
    {
      title: 'Alumni Networking Night',
      content: 'An evening of introductions, career conversations, and collaboration opportunities.',
      schedule: daysFromNow(7),
      banner: '',
      commits: [{ user: alumniUsers[0]._id }, { user: alumniUsers[1]._id }]
    },
    {
      title: 'Resume Review Workshop',
      content: 'Students can get their resumes reviewed by alumni across product, business, and engineering.',
      schedule: daysFromNow(14),
      banner: '',
      commits: [{ user: alumniUsers[3]._id }, { user: kabir._id }]
    },
    {
      title: 'Campus Reunion 2026',
      content: 'A large reunion for alumni batches and current students with keynote sessions.',
      schedule: daysFromNow(30),
      banner: '',
      commits: [{ user: alumniUsers[4]._id }, { user: ananya._id }, { user: sahil._id }]
    }
  ]);

  await ForumTopic.insertMany([
    {
      title: 'Tips for landing the first internship',
      description: 'What helped you stand out when applying for internships and student roles?',
      user: alumniUsers[0]._id,
      comments: [
        { comment: 'Build one strong project and explain it clearly.', user: kabir._id },
        { comment: 'Apply early and tailor your resume for each role.', user: alumniUsers[1]._id }
      ]
    },
    {
      title: 'Best tools for alumni networking',
      description: 'Which platforms or habits make alumni networking more effective?',
      user: alumniUsers[4]._id,
      comments: [
        { comment: 'Short, consistent follow-ups matter more than long messages.', user: alumniUsers[3]._id },
        { comment: 'Keep your profile updated with current work and interests.', user: ananya._id }
      ]
    }
  ]);

  await Gallery.insertMany([
    { image_path: '/images/alumni-night-1.jpg', about: 'Highlights from the alumni networking evening.' },
    { image_path: '/images/reunion-1.jpg', about: 'Snapshots from the annual reunion celebration.' },
    { image_path: '/images/workshop-1.jpg', about: 'Resume review workshop with students and alumni.' }
  ]);

  const badges = await Badge.insertMany([
    {
      name: 'Verified Alumni',
      slug: 'verified-alumni',
      description: 'Awarded to alumni who have verified their credentials',
      icon: 'fa-check-circle',
      color: '#28a745',
      category: 'verification',
      points: 50,
      criteria: 'Complete the alumni verification process'
    },
    {
      name: 'First Job Finder',
      slug: 'first-job-finder',
      description: 'Awarded for sharing your first job after graduation',
      icon: 'fa-briefcase',
      color: '#17a2b8',
      category: 'career',
      points: 25,
      criteria: 'Post your first career achievement'
    },
    {
      name: 'Community Star',
      slug: 'community-star',
      description: 'Awarded for active community participation',
      icon: 'fa-star',
      color: '#ffc107',
      category: 'community',
      points: 50,
      criteria: 'Participate in 10 or more community activities'
    }
  ]);

  await News.insertMany([
    {
      title: 'Alumni portal refresh goes live',
      content: 'The alumni platform now includes updated profiles, job listings, and event features for the community.',
      category: 'announcement',
      author: admin._id,
      banner: '',
      isPublished: true
    },
    {
      title: 'Three alumni recognized for mentorship',
      content: 'Alumni mentors have been recognized for active support of students preparing for internships and placements.',
      category: 'achievement',
      author: admin._id,
      banner: '',
      isPublished: true
    }
  ]);

  const campaigns = await DonationCampaign.insertMany([
    {
      title: 'Student Scholarship Fund 2026',
      slug: 'student-scholarship-fund-2026',
      description: 'Support need-based scholarships for deserving students.',
      detailedDescription: 'Funding helps students with tuition, books, and learning resources.',
      category: 'scholarship',
      targetAmount: 50000,
      currentAmount: 12000,
      currency: 'USD',
      createdBy: admin._id,
      beneficiary: 'Incoming students',
      donorCount: 24,
      featured: true,
      tags: ['scholarship', 'students', 'education']
    },
    {
      title: 'Alumni Event Hall Upgrade',
      slug: 'alumni-event-hall-upgrade',
      description: 'Upgrade the event hall used for reunions, workshops, and community meetings.',
      detailedDescription: 'Project covers lighting, seating, and AV improvements.',
      category: 'infrastructure',
      targetAmount: 30000,
      currentAmount: 8500,
      currency: 'USD',
      createdBy: admin._id,
      beneficiary: 'Campus event hall',
      donorCount: 11,
      featured: false,
      tags: ['events', 'infrastructure', 'campus']
    }
  ]);

  await SystemSetting.create({
    name: 'Alumni Management System',
    email: ADMIN_EMAIL,
    contact: '+1 555 010 2000',
    cover_img: '',
    about_content: 'A community platform for alumni networking, jobs, mentorship, events, and engagement.'
  });

  const mentorProfiles = await MentorProfile.insertMany([
    {
      user: alumniUsers[0]._id,
      bio: 'Full-stack engineer helping students transition into software roles.',
      expertise: ['JavaScript', 'Node.js', 'System Design'],
      industries: ['Software', 'SaaS'],
      yearsOfExperience: 5,
      currentPosition: 'Senior Engineer',
      currentCompany: 'CodeWave Labs',
      availability: [
        { day: 'Saturday', startTime: '10:00', endTime: '12:00' },
        { day: 'Sunday', startTime: '16:00', endTime: '18:00' }
      ],
      maxMentees: 4,
      currentMentees: 2,
      preferredMenteeLevel: 'student',
      sessionTypes: ['career_guidance', 'mock_interview', 'resume_review'],
      rating: 4.8,
      totalReviews: 12,
      linkedInUrl: 'https://linkedin.com/in/aarav-mehta',
      achievements: 'Helped 20+ students crack internship interviews.'
    },
    {
      user: alumniUsers[1]._id,
      bio: 'Business mentor focused on strategy, communication, and consulting careers.',
      expertise: ['Business Strategy', 'Communication', 'Case Studies'],
      industries: ['Consulting', 'Finance'],
      yearsOfExperience: 6,
      currentPosition: 'Business Analyst',
      currentCompany: 'Northstar Consulting',
      availability: [{ day: 'Friday', startTime: '19:00', endTime: '21:00' }],
      maxMentees: 3,
      currentMentees: 1,
      preferredMenteeLevel: 'both',
      sessionTypes: ['career_guidance', 'networking'],
      rating: 4.7,
      totalReviews: 8,
      linkedInUrl: 'https://linkedin.com/in/neha-sharma',
      achievements: 'Mentored students for consulting and analyst pathways.'
    },
    {
      user: alumniUsers[3]._id,
      bio: 'Product analytics mentor supporting data and product-growth careers.',
      expertise: ['Product Analytics', 'SQL', 'Experimentation'],
      industries: ['SaaS', 'Product'],
      yearsOfExperience: 4,
      currentPosition: 'Product Analyst',
      currentCompany: 'Insightly',
      availability: [{ day: 'Wednesday', startTime: '18:00', endTime: '20:00' }],
      maxMentees: 3,
      currentMentees: 1,
      preferredMenteeLevel: 'student',
      sessionTypes: ['career_guidance', 'skill_development', 'resume_review'],
      rating: 4.9,
      totalReviews: 6,
      linkedInUrl: 'https://linkedin.com/in/priya-desai',
      achievements: 'Built mentorship tracks for data and product students.'
    }
  ]);

  const mentorshipMatches = await MentorshipMatch.insertMany([
    {
      mentor: alumniUsers[0]._id,
      mentee: kabir._id,
      status: 'accepted',
      requestMessage: 'I need help preparing for frontend interviews.',
      responseMessage: 'Happy to help. Let us start with your project portfolio.',
      goals: 'Build interview confidence and improve project storytelling.',
      startDate: daysFromNow(-20),
      totalSessions: 2,
      completedSessions: 1
    },
    {
      mentor: alumniUsers[1]._id,
      mentee: ananya._id,
      status: 'accepted',
      requestMessage: 'Looking for guidance on analyst and consulting roles.',
      responseMessage: 'Great, we can work on cases and communication together.',
      goals: 'Improve business case solving and interview communication.',
      startDate: daysFromNow(-15),
      totalSessions: 2,
      completedSessions: 1
    }
  ]);

  await MentorshipSession.insertMany([
    {
      mentorship: mentorshipMatches[0]._id,
      mentor: alumniUsers[0]._id,
      mentee: kabir._id,
      title: 'Portfolio and Resume Review',
      description: 'Review projects and improve resume bullets for frontend roles.',
      sessionType: 'resume_review',
      scheduledDate: daysFromNow(-7),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      status: 'completed',
      meetingLink: 'https://meet.google.com/demo-portfolio-review',
      isVirtual: true,
      actionItems: [
        { description: 'Refine two project case studies', completed: true, assignedTo: 'mentee' },
        { description: 'Practice intro pitch', completed: false, assignedTo: 'mentee' }
      ]
    },
    {
      mentorship: mentorshipMatches[1]._id,
      mentor: alumniUsers[1]._id,
      mentee: ananya._id,
      title: 'Consulting Case Practice',
      description: 'Framework-based case solving and hypothesis communication.',
      sessionType: 'career_guidance',
      scheduledDate: daysFromNow(5),
      startTime: '19:30',
      endTime: '20:30',
      duration: 60,
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/demo-case-practice',
      isVirtual: true,
      actionItems: [
        { description: 'Solve 2 market sizing cases', completed: false, assignedTo: 'mentee' }
      ]
    }
  ]);

  await MentorshipMessage.insertMany([
    {
      mentorship: mentorshipMatches[0]._id,
      sender: kabir._id,
      receiver: alumniUsers[0]._id,
      content: 'Thanks for the session. I updated my resume draft.',
      messageType: 'text',
      isRead: true,
      readAt: daysFromNow(-5)
    },
    {
      mentorship: mentorshipMatches[0]._id,
      sender: alumniUsers[0]._id,
      receiver: kabir._id,
      content: 'Great. Share your GitHub projects and we will refine your pitch next.',
      messageType: 'text',
      isRead: false
    }
  ]);

  const businesses = await Business.insertMany([
    {
      user: alumniUsers[2]._id,
      businessName: 'CircuitForge Innovations',
      description: 'Embedded systems consulting and IoT product prototyping services.',
      tagline: 'From prototype to production hardware',
      category: 'technology',
      subCategory: 'IoT Solutions',
      location: { city: 'Hyderabad', country: 'India' },
      contact: {
        email: 'contact@circuitforge.example',
        website: 'https://circuitforge.example',
        linkedIn: 'https://linkedin.com/company/circuitforge'
      },
      services: [
        { name: 'Embedded Firmware', description: 'Firmware design and optimization', price: 'Custom' },
        { name: 'IoT Integration', description: 'Sensor-to-cloud integrations', price: 'Custom' }
      ],
      hasAlumniDiscount: true,
      alumniDiscount: {
        title: 'Alumni Early Product Offer',
        description: 'Discount for alumni-founded startups',
        discountCode: 'ALUMNI10',
        percentage: 10,
        terms: 'For first project engagement only',
        isActive: true
      },
      isVerified: true,
      isFeatured: true,
      rating: 4.6,
      totalReviews: 1
    },
    {
      user: alumniUsers[4]._id,
      businessName: 'Vertex Ops Advisory',
      description: 'Operations and finance advisory services for scaling teams.',
      tagline: 'Operational clarity for growing organizations',
      category: 'consulting',
      subCategory: 'Operations Strategy',
      location: { city: 'Delhi', country: 'India' },
      contact: {
        email: 'hello@vertexops.example',
        website: 'https://vertexops.example'
      },
      services: [
        { name: 'Process Design', description: 'Set up repeatable team processes', price: 'Starts at $800' }
      ],
      hasAlumniDiscount: false,
      isVerified: true,
      isFeatured: false,
      rating: 4.3,
      totalReviews: 1
    }
  ]);

  await BusinessReview.insertMany([
    {
      business: businesses[0]._id,
      user: kabir._id,
      rating: 5,
      title: 'Excellent technical guidance',
      comment: 'Very helpful team for understanding embedded project scoping.',
      isVerifiedPurchase: true
    },
    {
      business: businesses[1]._id,
      user: ananya._id,
      rating: 4,
      title: 'Great strategic perspective',
      comment: 'Strong mentorship and practical process advice for project planning.',
      isVerifiedPurchase: false
    }
  ]);

  const achievements = await Achievement.insertMany([
    {
      user: alumniUsers[0]._id,
      type: 'promotion',
      title: 'Promoted to Senior Engineer',
      description: 'Led successful delivery of the platform redesign initiative.',
      date: daysFromNow(-40),
      company: 'CodeWave Labs',
      isPublished: true
    },
    {
      user: alumniUsers[1]._id,
      type: 'certification',
      title: 'Strategy and Analytics Certification',
      description: 'Completed advanced business analytics and case strategy program.',
      date: daysFromNow(-25),
      company: 'Northstar Consulting',
      isPublished: true
    },
    {
      user: alumniUsers[3]._id,
      type: 'award',
      title: 'Product Insights Champion',
      description: 'Recognized for data-driven product improvements and user impact.',
      date: daysFromNow(-15),
      company: 'Insightly',
      isPublished: true
    }
  ]);

  await Endorsement.insertMany([
    { endorser: kabir._id, endorsee: alumniUsers[0]._id, skill: 'JavaScript' },
    { endorser: ananya._id, endorsee: alumniUsers[1]._id, skill: 'Strategy' },
    { endorser: sahil._id, endorsee: alumniUsers[2]._id, skill: 'IoT' },
    { endorser: alumniUsers[0]._id, endorsee: alumniUsers[3]._id, skill: 'Data Analysis' }
  ]);

  await DirectMessage.insertMany([
    {
      sender: kabir._id,
      receiver: alumniUsers[0]._id,
      content: 'Hi Aarav, could you review my project README before I apply?',
      messageType: 'text',
      isRead: true,
      readAt: daysFromNow(-2)
    },
    {
      sender: alumniUsers[0]._id,
      receiver: kabir._id,
      content: 'Sure, send it over. I can review it tonight.',
      messageType: 'text',
      isRead: false
    }
  ]);

  const reunion = await Reunion.create({
    title: 'Batch 2020 Reunion Gala',
    batch: 2020,
    description: 'A celebration with networking, talks, and memory sharing.',
    eventDate: daysFromNow(45),
    venue: 'City Convention Center',
    virtualOption: {
      enabled: true,
      meetingLink: 'https://meet.google.com/demo-reunion'
    },
    organizers: [
      { user: alumniUsers[1]._id, role: 'coordinator' },
      { user: alumniUsers[4]._id, role: 'treasurer' }
    ],
    attendees: [alumniUsers[0]._id, alumniUsers[1]._id, alumniUsers[3]._id, kabir._id],
    budget: {
      total: 10000,
      collected: 4200
    },
    isConfirmed: true,
    status: 'confirmed'
  });

  await ReunionContribution.insertMany([
    {
      reunion: reunion._id,
      contributor: alumniUsers[0]._id,
      amount: 1200,
      paymentMethod: 'online',
      status: 'confirmed',
      transactionId: 'RXN-DEMO-1001'
    },
    {
      reunion: reunion._id,
      contributor: alumniUsers[3]._id,
      amount: 800,
      paymentMethod: 'bank_transfer',
      status: 'confirmed',
      transactionId: 'RXN-DEMO-1002'
    }
  ]);

  await ReunionMemory.create({
    reunion: reunion._id,
    user: alumniUsers[1]._id,
    caption: 'Throwback to our project showcase days.',
    photos: [{ url: '/images/reunion-memory-1.jpg' }],
    likes: [alumniUsers[0]._id, ananya._id],
    comments: [
      { user: kabir._id, text: 'Love this memory!' },
      { user: alumniUsers[4]._id, text: 'Can’t wait for the reunion.' }
    ]
  });

  await EventCalendar.insertMany([
    {
      title: 'Mentorship Kickoff Webinar',
      description: 'Introduction to alumni mentorship tracks and how to join sessions.',
      eventType: 'webinar',
      startDate: daysFromNow(10),
      endDate: daysFromNow(10),
      eventMode: 'virtual',
      virtualLink: 'https://meet.google.com/demo-mentorship-kickoff',
      capacity: 300,
      rsvpDeadline: daysFromNow(8),
      eventTags: ['mentorship', 'career', 'onboarding'],
      organizer: admin._id,
      rsvps: [
        { alumni: alumniUsers[0]._id, status: 'confirmed' },
        { alumni: alumniUsers[1]._id, status: 'confirmed' },
        { alumni: alumniUsers[3]._id, status: 'waitlist' }
      ],
      status: 'published'
    },
    {
      title: 'Annual Alumni Social Mixer',
      description: 'In-person community social for alumni and students.',
      eventType: 'social',
      startDate: daysFromNow(28),
      endDate: daysFromNow(28),
      eventMode: 'in-person',
      location: 'Main Campus Hall',
      capacity: 150,
      rsvpDeadline: daysFromNow(25),
      eventTags: ['social', 'networking'],
      organizer: admin._id,
      rsvps: [
        { alumni: alumniUsers[2]._id, status: 'confirmed' },
        { alumni: alumniUsers[4]._id, status: 'confirmed' }
      ],
      status: 'published'
    }
  ]);

  await Donation.insertMany([
    {
      donor: alumniUsers[0]._id,
      campaign: campaigns[0]._id,
      amount: 300,
      currency: 'USD',
      paymentMethod: 'stripe',
      paymentStatus: 'completed',
      donorEmail: alumniUsers[0].email,
      donorName: alumniUsers[0].name,
      isAnonymous: false,
      message: 'Happy to support scholarships for upcoming students.',
      recognitionLevel: 'silver',
      awardedBadges: [badges[0]._id],
      completedAt: daysFromNow(-6),
      donatedAt: daysFromNow(-6),
      metadata: { source: 'website' }
    },
    {
      donor: alumniUsers[4]._id,
      campaign: campaigns[1]._id,
      amount: 500,
      currency: 'USD',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'completed',
      donorEmail: alumniUsers[4].email,
      donorName: alumniUsers[4].name,
      isAnonymous: true,
      message: 'Proud to contribute to campus infrastructure.',
      recognitionLevel: 'gold',
      awardedBadges: [badges[2]._id],
      completedAt: daysFromNow(-3),
      donatedAt: daysFromNow(-3),
      metadata: { source: 'website' }
    }
  ]);

  await UserBadge.insertMany([
    {
      user: alumniUsers[0]._id,
      badge: badges[0]._id,
      awardedBy: admin._id,
      notes: 'Verified and active mentor',
      source: { type: 'manual' }
    },
    {
      user: alumniUsers[1]._id,
      badge: badges[1]._id,
      awardedBy: admin._id,
      notes: 'Career milestones shared',
      source: { type: 'achievement', referenceId: achievements[1]._id }
    },
    {
      user: alumniUsers[3]._id,
      badge: badges[2]._id,
      awardedBy: admin._id,
      notes: 'Community contribution',
      source: { type: 'mentorship', referenceId: mentorProfiles[2]._id }
    }
  ]);

  await User.updateOne(
    { _id: alumniUsers[0]._id },
    { $set: { 'alumnus_bio.endorsementCount': 1 } }
  );

  await User.updateOne(
    { _id: alumniUsers[1]._id },
    { $set: { 'alumnus_bio.endorsementCount': 1 } }
  );

  await User.updateOne(
    { _id: alumniUsers[2]._id },
    { $set: { 'alumnus_bio.endorsementCount': 1 } }
  );

  await User.updateOne(
    { _id: alumniUsers[3]._id },
    { $set: { 'alumnus_bio.endorsementCount': 1 } }
  );

  return {
    adminEmail: ADMIN_EMAIL,
    courseCount: courses.length,
    alumniCount: alumniUsers.length,
    studentCount: studentUsers.length,
    mentorCount: mentorProfiles.length,
    mentorshipMatchCount: mentorshipMatches.length,
    businessCount: businesses.length,
    reunionCount: 1,
    eventCalendarCount: 2,
    donationCampaignCount: campaigns.length,
    donationCount: 2
  };
}

async function main() {
  try {
    await connectDB();
    const result = await seedDatabase();
    console.log('Seed complete:', result);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

main();