import fs from 'fs';
import path from 'path';
import {
  Institution,
  User,
  Department,
  Course,
  Subject,
  CurriculumUnit,
  TimetableSlot,
  AttendanceSession,
  AttendanceRecord,
  Assignment,
  Submission,
  Assessment,
  AssessmentAttempt,
  Competency,
  Recommendation,
  LearningResource,
  CampusEvent,
  Announcement,
  NotificationItem,
  AuditLog,
  AiGenerationLog,
  ReportExport,
  SystemStats
} from '../types/index.ts';

// Data storage interface
export interface CampusDatabase {
  institutions: Institution[];
  users: User[];
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  curriculum: CurriculumUnit[];
  timetable: TimetableSlot[];
  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  assignments: Assignment[];
  submissions: Submission[];
  assessments: Assessment[];
  assessmentAttempts: AssessmentAttempt[];
  competencies: Record<string, Competency[]>; // studentId -> Competency[]
  recommendations: Recommendation[];
  resources: LearningResource[];
  events: CampusEvent[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  aiGenerationLogs: AiGenerationLog[];
  reports: ReportExport[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'campus.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Generator
function getInitialSeedData(): CampusDatabase {
  const institutions: Institution[] = [
    {
      id: 'inst_sit_01',
      name: 'Smart Institute of Technology',
      code: 'SIT-BLR',
      domain: 'smartcampus.edu',
      address: 'Tech Innovation Campus, Outer Ring Rd, Bangalore 560103',
      accreditation: 'NAAC A++ Grade (Autonomous)',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=200',
      primaryColor: '#3B82F6',
      activeStudentsCount: 1010,
      activeFacultyCount: 54,
      isDefault: true
    },
    {
      id: 'inst_apex_02',
      name: 'Apex Institute of Advanced Technology',
      code: 'AIAT-HYD',
      domain: 'apextech.edu',
      address: 'Cyber Towers Tech Park, Hitec City, Hyderabad 500081',
      accreditation: 'NIRF Rank 24 (Deemed University)',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=200',
      primaryColor: '#8B5CF6',
      activeStudentsCount: 840,
      activeFacultyCount: 42,
      isDefault: false
    },
    {
      id: 'inst_metro_03',
      name: 'Metro Polytechnic & Applied Sciences',
      code: 'MPAS-PUN',
      domain: 'metropoly.edu',
      address: 'Shivajinagar Campus, Pune 411005',
      accreditation: 'NBA Tier-1 Accredited',
      logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200',
      primaryColor: '#10B981',
      activeStudentsCount: 620,
      activeFacultyCount: 30,
      isDefault: false
    }
  ];

  const departments: Department[] = [
    {
      id: 'dept_cse',
      code: 'CSE',
      name: 'Computer Science & Engineering',
      hod: 'Dr. K. Ramanathan',
      facultyCount: 18,
      studentCount: 320,
      description: 'Pioneering research and education in AI, Cloud, Embedded Systems, and Software Architecture.',
      color: '#3B82F6'
    },
    {
      id: 'dept_ece',
      code: 'ECE',
      name: 'Electronics & Communication Engineering',
      hod: 'Dr. Shweta Menon',
      facultyCount: 14,
      studentCount: 260,
      description: 'Hardware engineering, VLSI design, signal processing, and IoT microcontroller innovations.',
      color: '#10B981'
    },
    {
      id: 'dept_it',
      code: 'IT',
      name: 'Information Technology',
      hod: 'Dr. Rajesh Gupta',
      facultyCount: 12,
      studentCount: 240,
      description: 'Distributed computing, database optimization, cyber systems, and enterprise cloud solutions.',
      color: '#8B5CF6'
    },
    {
      id: 'dept_me',
      code: 'ME',
      name: 'Mechanical & Mechatronics Engineering',
      hod: 'Dr. Arvind Patel',
      facultyCount: 10,
      studentCount: 190,
      description: 'Robotics, automation, thermal systems, and smart mechanical integrations.',
      color: '#F59E0B'
    }
  ];

  const courses: Course[] = [
    {
      id: 'course_btech_cse',
      code: 'BTECH-CSE',
      name: 'Bachelor of Technology in Computer Science & Engineering',
      departmentId: 'dept_cse',
      durationYears: 4,
      totalSemesters: 8,
      degreeType: 'B.Tech'
    },
    {
      id: 'course_btech_ece',
      code: 'BTECH-ECE',
      name: 'Bachelor of Technology in Electronics & Communication',
      departmentId: 'dept_ece',
      durationYears: 4,
      totalSemesters: 8,
      degreeType: 'B.Tech'
    },
    {
      id: 'course_btech_it',
      code: 'BTECH-IT',
      name: 'Bachelor of Technology in Information Technology',
      departmentId: 'dept_it',
      durationYears: 4,
      totalSemesters: 8,
      degreeType: 'B.Tech'
    }
  ];

  const subjects: Subject[] = [
    {
      id: 'sub_iot',
      code: 'CS401',
      name: 'Internet of Things & Smart Sensors',
      courseId: 'course_btech_cse',
      semester: 4,
      credits: 4,
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      category: 'Core',
      description: 'Architecture of connected devices, MQTT/CoAP protocols, edge sensors, telemetry, and IoT cloud platforms.',
      totalHours: 45,
      completedHours: 32,
      iconName: 'Cpu'
    },
    {
      id: 'sub_embedded',
      code: 'EC402',
      name: 'Embedded Systems & Microcontrollers',
      courseId: 'course_btech_cse',
      semester: 4,
      credits: 4,
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      category: 'Core',
      description: 'ARM Cortex M4 architecture, interrupt vectors, timers, firmware development in Embedded C, and RTOS fundamentals.',
      totalHours: 48,
      completedHours: 30,
      iconName: 'CircuitBoard'
    },
    {
      id: 'sub_dbms',
      code: 'CS403',
      name: 'Database Management Systems',
      courseId: 'course_btech_cse',
      semester: 4,
      credits: 4,
      facultyId: 'fac_amit',
      facultyName: 'Prof. Amit Verma',
      category: 'Core',
      description: 'Relational calculus, SQL tuning, indexing, transactions, ACID properties, normalization, and distributed storage.',
      totalHours: 42,
      completedHours: 35,
      iconName: 'Database'
    },
    {
      id: 'sub_networks',
      code: 'CS404',
      name: 'Computer Networks & Security',
      courseId: 'course_btech_cse',
      semester: 4,
      credits: 4,
      facultyId: 'fac_sunita',
      facultyName: 'Dr. Sunita Rao',
      category: 'Core',
      description: 'TCP/IP stack, packet routing, DNS, BGP, cryptographic handshakes, TLS, firewall architectures, and zero-trust.',
      totalHours: 44,
      completedHours: 28,
      iconName: 'Network'
    },
    {
      id: 'sub_programming',
      code: 'CS405',
      name: 'Advanced Programming & Design Patterns',
      courseId: 'course_btech_cse',
      semester: 4,
      credits: 3,
      facultyId: 'fac_amit',
      facultyName: 'Prof. Amit Verma',
      category: 'Core',
      description: 'OOP architecture, SOLID principles, concurrency, memory management, design patterns, and unit test automation.',
      totalHours: 38,
      completedHours: 26,
      iconName: 'Code'
    },
    {
      id: 'sub_ai',
      code: 'CS406',
      name: 'Artificial Intelligence & Machine Learning',
      courseId: 'course_btech_cse',
      semester: 4,
      credits: 4,
      facultyId: 'fac_vikram',
      facultyName: 'Prof. Vikram Mehta',
      category: 'Elective',
      description: 'Supervised & unsupervised learning, deep neural networks, transformers, reinforcement models, and model evaluation.',
      totalHours: 45,
      completedHours: 25,
      iconName: 'Sparkles'
    }
  ];

  const facultyUsers: User[] = [
    {
      id: 'fac_priya',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@smartcampus.edu',
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      facultyId: 'FAC-CSE-101',
      departmentId: 'dept_cse',
      phone: '+91 98765 43210',
      bio: 'Lead Researcher in Smart Embedded IoT & Cyber-Physical Systems. PhD from IIT Delhi.'
    },
    {
      id: 'fac_amit',
      name: 'Prof. Amit Verma',
      email: 'amit.verma@smartcampus.edu',
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      facultyId: 'FAC-CSE-102',
      departmentId: 'dept_cse',
      phone: '+91 98765 43211',
      bio: 'Database specialist with 12 years experience in enterprise query optimization and distributed databases.'
    },
    {
      id: 'fac_sunita',
      name: 'Dr. Sunita Rao',
      email: 'sunita.rao@smartcampus.edu',
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      facultyId: 'FAC-CSE-103',
      departmentId: 'dept_cse',
      phone: '+91 98765 43212',
      bio: 'Cybersecurity & Computer Networks researcher with publications in IEEE Communications.'
    },
    {
      id: 'fac_vikram',
      name: 'Prof. Vikram Mehta',
      email: 'vikram.mehta@smartcampus.edu',
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      facultyId: 'FAC-CSE-104',
      departmentId: 'dept_cse',
      phone: '+91 98765 43213',
      bio: 'AI/ML practitioner specializing in Generative Models and Neural Edge Optimization.'
    },
    {
      id: 'fac_shweta',
      name: 'Dr. Shweta Menon',
      email: 'shweta.menon@smartcampus.edu',
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      facultyId: 'FAC-ECE-105',
      departmentId: 'dept_ece',
      phone: '+91 98765 43214',
      bio: 'HOD of ECE, VLSI circuits and signal architecture expert.'
    }
  ];

  const adminUser: User = {
    id: 'admin_ramanathan',
    name: 'Dr. K. Ramanathan',
    email: 'admin@smartcampus.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    facultyId: 'ADM-001',
    departmentId: 'dept_cse',
    phone: '+91 98765 00001',
    bio: 'Dean of Academic Affairs & Institutional Director at Smart Institute of Technology.'
  };

  const demoStudent: User = {
    id: 'std_ramesh',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@student.smartcampus.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    studentId: '2024-CSE-042',
    departmentId: 'dept_cse',
    courseId: 'course_btech_cse',
    semester: 4,
    section: 'A',
    phone: '+91 98765 11111',
    academicGoal: 'Become an IoT Engineer',
    cgpa: 8.4,
    attendancePercentage: 91,
    bio: 'Passionate about smart hardware, MQTT wireless networks, and distributed edge intelligence.'
  };

  const parentUser: User = {
    id: 'parent_suresh',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@parent.smartcampus.edu',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    linkedStudentId: 'std_ramesh',
    phone: '+91 98765 22222',
    bio: 'Parent of Ramesh Kumar (B.Tech CSE, Sem 4).'
  };

  // Generate 49 additional students for realistic batch data
  const firstNames = ['Aarav', 'Ananya', 'Rohan', 'Sneha', 'Aditya', 'Pooja', 'Karan', 'Meera', 'Rahul', 'Divya', 'Siddharth', 'Ishita', 'Arjun', 'Nisha', 'Varun', 'Neha', 'Gautam', 'Kavya', 'Manish', 'Simran', 'Tanmay', 'Ritu', 'Pranav', 'Tanvi', 'Abhishek', 'Swati', 'Harsh', 'Anjali', 'Kunal', 'Shruti', 'Naveen', 'Deepika', 'Akash', 'Shreya', 'Chetan', 'Preeti', 'Vikas', 'Rashmi', 'Mayank', 'Sanjana', 'Sachin', 'Pallavi', 'Yash', 'Bhavna', 'Nikhil', 'Shalini', 'Tarun', 'Archana', 'Gaurav'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Reddy', 'Iyer', 'Nair', 'Choudhury', 'Joshi', 'Bose', 'Rao', 'Deshmukh', 'Mishra', 'Bhat', 'Agarwal', 'Chatterjee', 'Kulkarni', 'Sinha', 'Pillai'];

  const otherStudents: User[] = [];
  for (let i = 0; i < 49; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3) % lastNames.length];
    const rollNo = `2024-CSE-${String(i + 1).padStart(3, '0')}`;
    const cgpa = Number((7.0 + (i % 30) * 0.1).toFixed(2));
    const attendance = 75 + (i % 23);
    otherStudents.push({
      id: `std_${i + 1}`,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@student.smartcampus.edu`,
      role: 'student',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567) % 500000000}?auto=format&fit=crop&q=80&w=200`,
      studentId: rollNo,
      departmentId: 'dept_cse',
      courseId: 'course_btech_cse',
      semester: 4,
      section: i % 2 === 0 ? 'A' : 'B',
      academicGoal: i % 3 === 0 ? 'Cloud Architect' : i % 3 === 1 ? 'Full Stack Developer' : 'AI Engineer',
      cgpa: cgpa > 9.8 ? 9.8 : cgpa,
      attendancePercentage: attendance
    });
  }

  const users: User[] = [adminUser, ...facultyUsers, demoStudent, parentUser, ...otherStudents];

  // Deep Curriculum Hierarchies
  const curriculum: CurriculumUnit[] = [
    // IoT Units
    {
      id: 'unit_iot_1',
      subjectId: 'sub_iot',
      unitNumber: 1,
      title: 'Unit 1: Sensors, Actuators & Hardware Interfaces',
      description: 'Understanding analog and digital sensors, ADC sampling, serial communication protocols (I2C, SPI, UART).',
      status: 'Completed',
      weightagePercent: 25,
      topics: [
        {
          id: 'topic_iot_1_1',
          unitId: 'unit_iot_1',
          title: 'Sensor Interfacing & Signal Conditioning',
          estimatedHours: 4,
          status: 'Completed',
          activityCount: 3,
          resourceCount: 4,
          objectives: [
            { id: 'obj_1_1_1', topicId: 'topic_iot_1_1', title: 'Explain voltage dividers and operational amplifier conditioning', bloomLevel: 'Understand', isCompleted: true, assessedScore: 92 },
            { id: 'obj_1_1_2', topicId: 'topic_iot_1_1', title: 'Interface DHT22 temperature and Ultrasonic sensors to MCU', bloomLevel: 'Apply', isCompleted: true, assessedScore: 95 }
          ]
        },
        {
          id: 'topic_iot_1_2',
          unitId: 'unit_iot_1',
          title: 'Serial Communication: I2C, SPI, UART',
          estimatedHours: 6,
          status: 'Completed',
          activityCount: 2,
          resourceCount: 3,
          objectives: [
            { id: 'obj_1_2_1', topicId: 'topic_iot_1_2', title: 'Compare bus speed, clocking, and master-slave arbitration in I2C vs SPI', bloomLevel: 'Analyze', isCompleted: true, assessedScore: 88 }
          ]
        }
      ]
    },
    {
      id: 'unit_iot_2',
      subjectId: 'sub_iot',
      unitNumber: 2,
      title: 'Unit 2: IoT Wireless Protocols & Networking',
      description: 'Low-power wireless protocols: BLE, Zigbee, LoRaWAN, Wi-Fi 6, and cellular NB-IoT.',
      status: 'In Progress',
      weightagePercent: 25,
      topics: [
        {
          id: 'topic_iot_2_1',
          unitId: 'unit_iot_2',
          title: 'MQTT & CoAP Protocol Internals',
          estimatedHours: 5,
          status: 'In Progress',
          activityCount: 4,
          resourceCount: 5,
          objectives: [
            { id: 'obj_2_1_1', topicId: 'topic_iot_2_1', title: 'Implement publish/subscribe telemetry with QoS levels 0, 1, 2', bloomLevel: 'Apply', isCompleted: true, assessedScore: 90 },
            { id: 'obj_2_1_2', topicId: 'topic_iot_2_1', title: 'Evaluate CoAP RESTful constraint model over UDP', bloomLevel: 'Evaluate', isCompleted: false }
          ]
        },
        {
          id: 'topic_iot_2_2',
          unitId: 'unit_iot_2',
          title: 'LoRaWAN Long Range Telemetry',
          estimatedHours: 5,
          status: 'In Progress',
          activityCount: 2,
          resourceCount: 3,
          objectives: [
            { id: 'obj_2_2_1', topicId: 'topic_iot_2_2', title: 'Configure gateway packet forwarder and spreading factors', bloomLevel: 'Apply', isCompleted: false }
          ]
        }
      ]
    },
    {
      id: 'unit_iot_3',
      subjectId: 'sub_iot',
      unitNumber: 3,
      title: 'Unit 3: Edge Computing & Embedded Micro-AI',
      description: 'Deploying quantized ML models on microcontrollers using TensorFlow Lite for Microcontrollers.',
      status: 'Not Started',
      weightagePercent: 25,
      topics: [
        {
          id: 'topic_iot_3_1',
          unitId: 'unit_iot_3',
          title: 'TinyML Anomaly Detection on Edge MCUs',
          estimatedHours: 6,
          status: 'Not Started',
          activityCount: 3,
          resourceCount: 4,
          objectives: [
            { id: 'obj_3_1_1', topicId: 'topic_iot_3_1', title: 'Quantize neural networks to 8-bit integers for Cortex-M processors', bloomLevel: 'Create', isCompleted: false }
          ]
        }
      ]
    },
    // Embedded Systems Units
    {
      id: 'unit_emb_1',
      subjectId: 'sub_embedded',
      unitNumber: 1,
      title: 'Unit 1: ARM Cortex-M Architecture & Assembly',
      description: 'Register files, pipelining, memory mapping, NVIC interrupt priority controllers.',
      status: 'Completed',
      weightagePercent: 30,
      topics: [
        {
          id: 'topic_emb_1_1',
          unitId: 'unit_emb_1',
          title: 'Nested Vectored Interrupt Controller (NVIC)',
          estimatedHours: 6,
          status: 'Completed',
          activityCount: 3,
          resourceCount: 3,
          objectives: [
            { id: 'obj_emb_1_1', topicId: 'topic_emb_1_1', title: 'Configure priority grouping, tail-chaining and ISR handlers', bloomLevel: 'Apply', isCompleted: true, assessedScore: 72 }
          ]
        }
      ]
    },
    {
      id: 'unit_emb_2',
      subjectId: 'sub_embedded',
      unitNumber: 2,
      title: 'Unit 2: Real-Time Operating Systems (FreeRTOS)',
      description: 'Task scheduling, mutexes, semaphores, queues, and priority inversion prevention.',
      status: 'In Progress',
      weightagePercent: 35,
      topics: [
        {
          id: 'topic_emb_2_1',
          unitId: 'unit_emb_2',
          title: 'FreeRTOS Task Synchronization & Queues',
          estimatedHours: 8,
          status: 'In Progress',
          activityCount: 4,
          resourceCount: 5,
          objectives: [
            { id: 'obj_emb_2_1', topicId: 'topic_emb_2_1', title: 'Implement producer-consumer task queue with counting semaphore', bloomLevel: 'Create', isCompleted: false, assessedScore: 65 }
          ]
        }
      ]
    },
    // DBMS Units
    {
      id: 'unit_dbms_1',
      subjectId: 'sub_dbms',
      unitNumber: 1,
      title: 'Unit 1: Relational Algebra & Query Optimization',
      description: 'B+ Tree indexing, execution plans, cost-based optimizer, and index clustering.',
      status: 'Completed',
      weightagePercent: 30,
      topics: [
        {
          id: 'topic_db_1_1',
          unitId: 'unit_dbms_1',
          title: 'B+ Tree Indexing & Composite Indexes',
          estimatedHours: 5,
          status: 'Completed',
          activityCount: 3,
          resourceCount: 4,
          objectives: [
            { id: 'obj_db_1_1', topicId: 'topic_db_1_1', title: 'Optimize multi-column WHERE queries using covering indexes', bloomLevel: 'Analyze', isCompleted: true, assessedScore: 94 }
          ]
        }
      ]
    }
  ];

  // Weekly Timetable (Semester 4 - Section A)
  const timetable: TimetableSlot[] = [
    // Monday
    { id: 'tt_mon_1', day: 'Monday', startTime: '09:00', endTime: '10:00', subjectId: 'sub_iot', subjectName: 'Internet of Things & Smart Sensors', subjectCode: 'CS401', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Lab 402 (IoT Hub)', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_mon_2', day: 'Monday', startTime: '10:00', endTime: '11:00', subjectId: 'sub_embedded', subjectName: 'Embedded Systems & Microcontrollers', subjectCode: 'EC402', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_mon_3', day: 'Monday', startTime: '11:15', endTime: '12:15', subjectId: 'sub_dbms', subjectName: 'Database Management Systems', subjectCode: 'CS403', facultyId: 'fac_amit', facultyName: 'Prof. Amit Verma', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_mon_4', day: 'Monday', startTime: '13:15', endTime: '14:15', subjectId: 'sub_networks', subjectName: 'Computer Networks & Security', subjectCode: 'CS404', facultyId: 'fac_sunita', facultyName: 'Dr. Sunita Rao', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_mon_5', day: 'Monday', startTime: '14:15', endTime: '15:15', subjectId: 'free', subjectName: 'Self-Study / Micro-Learning Slot', subjectCode: 'FREE', facultyId: '', facultyName: 'Autonomous Learning', room: 'Innovation Lounge / Library', semester: 4, section: 'A', type: 'Free Period' },
    { id: 'tt_mon_6', day: 'Monday', startTime: '15:30', endTime: '17:00', subjectId: 'sub_iot', subjectName: 'IoT Sensor Interfacing Lab', subjectCode: 'CS401L', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Lab 402 (IoT Hub)', semester: 4, section: 'A', type: 'Lab' },

    // Tuesday
    { id: 'tt_tue_1', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subjectId: 'sub_programming', subjectName: 'Advanced Programming & Design Patterns', subjectCode: 'CS405', facultyId: 'fac_amit', facultyName: 'Prof. Amit Verma', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_tue_2', day: 'Tuesday', startTime: '10:00', endTime: '11:00', subjectId: 'sub_ai', subjectName: 'Artificial Intelligence & Machine Learning', subjectCode: 'CS406', facultyId: 'fac_vikram', facultyName: 'Prof. Vikram Mehta', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_tue_3', day: 'Tuesday', startTime: '11:15', endTime: '12:15', subjectId: 'sub_iot', subjectName: 'Internet of Things & Smart Sensors', subjectCode: 'CS401', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Lab 402', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_tue_4', day: 'Tuesday', startTime: '13:15', endTime: '15:15', subjectId: 'sub_embedded', subjectName: 'Embedded Microcontroller Lab (FreeRTOS)', subjectCode: 'EC402L', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Hardware Lab 2', semester: 4, section: 'A', type: 'Lab' },
    { id: 'tt_tue_5', day: 'Tuesday', startTime: '15:30', endTime: '16:30', subjectId: 'free', subjectName: 'Career Mentorship / Competency Gap Refinement', subjectCode: 'FREE', facultyId: '', facultyName: 'Smart Recommendation Slot', room: 'Library Pod 4', semester: 4, section: 'A', type: 'Free Period' },

    // Wednesday
    { id: 'tt_wed_1', day: 'Wednesday', startTime: '09:00', endTime: '10:00', subjectId: 'sub_networks', subjectName: 'Computer Networks & Security', subjectCode: 'CS404', facultyId: 'fac_sunita', facultyName: 'Dr. Sunita Rao', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_wed_2', day: 'Wednesday', startTime: '10:00', endTime: '11:00', subjectId: 'sub_dbms', subjectName: 'Database Management Systems', subjectCode: 'CS403', facultyId: 'fac_amit', facultyName: 'Prof. Amit Verma', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_wed_3', day: 'Wednesday', startTime: '11:15', endTime: '12:15', subjectId: 'sub_embedded', subjectName: 'Embedded Systems & Microcontrollers', subjectCode: 'EC402', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_wed_4', day: 'Wednesday', startTime: '13:15', endTime: '15:15', subjectId: 'sub_dbms', subjectName: 'DBMS SQL & Indexing Lab', subjectCode: 'CS403L', facultyId: 'fac_amit', facultyName: 'Prof. Amit Verma', room: 'Software Lab 1', semester: 4, section: 'A', type: 'Lab' },

    // Thursday
    { id: 'tt_thu_1', day: 'Thursday', startTime: '09:00', endTime: '10:00', subjectId: 'sub_iot', subjectName: 'Internet of Things & Smart Sensors', subjectCode: 'CS401', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Lab 402', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_thu_2', day: 'Thursday', startTime: '10:00', endTime: '11:00', subjectId: 'sub_programming', subjectName: 'Advanced Programming & Design Patterns', subjectCode: 'CS405', facultyId: 'fac_amit', facultyName: 'Prof. Amit Verma', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_thu_3', day: 'Thursday', startTime: '11:15', endTime: '12:15', subjectId: 'sub_ai', subjectName: 'Artificial Intelligence & Machine Learning', subjectCode: 'CS406', facultyId: 'fac_vikram', facultyName: 'Prof. Vikram Mehta', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_thu_4', day: 'Thursday', startTime: '13:15', endTime: '14:15', subjectId: 'free', subjectName: 'Self-Directed IoT Lab Practice', subjectCode: 'FREE', facultyId: '', facultyName: 'Smart Recommendation Slot', room: 'IoT Innovation Lab', semester: 4, section: 'A', type: 'Free Period' },

    // Friday
    { id: 'tt_fri_1', day: 'Friday', startTime: '09:00', endTime: '10:00', subjectId: 'sub_ai', subjectName: 'Artificial Intelligence & Machine Learning', subjectCode: 'CS406', facultyId: 'fac_vikram', facultyName: 'Prof. Vikram Mehta', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_fri_2', day: 'Friday', startTime: '10:00', endTime: '11:00', subjectId: 'sub_networks', subjectName: 'Computer Networks & Security', subjectCode: 'CS404', facultyId: 'fac_sunita', facultyName: 'Dr. Sunita Rao', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_fri_3', day: 'Friday', startTime: '11:15', endTime: '12:15', subjectId: 'sub_embedded', subjectName: 'Embedded Systems & Microcontrollers', subjectCode: 'EC402', facultyId: 'fac_priya', facultyName: 'Dr. Priya Sharma', room: 'Room 304', semester: 4, section: 'A', type: 'Lecture' },
    { id: 'tt_fri_4', day: 'Friday', startTime: '13:15', endTime: '15:15', subjectId: 'sub_programming', subjectName: 'Design Patterns & Java Coding Lab', subjectCode: 'CS405L', facultyId: 'fac_amit', facultyName: 'Prof. Amit Verma', room: 'Software Lab 3', semester: 4, section: 'A', type: 'Lab' }
  ];

  // Active Attendance Session (Created by Dr. Priya Sharma for IoT)
  const now = new Date();
  const currentISO = now.toISOString();
  const expiresAtISO = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 mins expiry
  const todayDateStr = now.toISOString().split('T')[0];

  const initialSessions: AttendanceSession[] = [
    {
      id: 'sess_iot_today',
      subjectId: 'sub_iot',
      subjectName: 'Internet of Things & Smart Sensors',
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      date: todayDateStr,
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      room: 'Lab 402 (IoT Hub)',
      semester: 4,
      section: 'A',
      qrToken: 'QR-IOT-SESS-98231',
      qrExpiresAt: expiresAtISO,
      isActive: true,
      totalStudents: 50,
      presentCount: 42
    },
    {
      id: 'sess_dbms_prev',
      subjectId: 'sub_dbms',
      subjectName: 'Database Management Systems',
      facultyId: 'fac_amit',
      facultyName: 'Prof. Amit Verma',
      date: new Date(now.getTime() - 24 * 3600 * 1000).toISOString().split('T')[0],
      startTime: '11:15 AM',
      endTime: '12:15 PM',
      room: 'Room 304',
      semester: 4,
      section: 'A',
      qrToken: 'QR-DBMS-SESS-77123',
      qrExpiresAt: new Date(now.getTime() - 23 * 3600 * 1000).toISOString(),
      isActive: false,
      totalStudents: 50,
      presentCount: 47
    }
  ];

  // Attendance Records for Ramesh Kumar across 30 past class dates
  const attendanceRecords: AttendanceRecord[] = [];
  const subjectList = ['sub_iot', 'sub_embedded', 'sub_dbms', 'sub_networks', 'sub_programming', 'sub_ai'];
  const subjectNamesMap: Record<string, string> = {
    sub_iot: 'Internet of Things & Smart Sensors',
    sub_embedded: 'Embedded Systems & Microcontrollers',
    sub_dbms: 'Database Management Systems',
    sub_networks: 'Computer Networks & Security',
    sub_programming: 'Advanced Programming & Design Patterns',
    sub_ai: 'Artificial Intelligence & Machine Learning'
  };

  for (let d = 1; d <= 25; d++) {
    const recordDate = new Date(now.getTime() - d * 24 * 3600 * 1000);
    const dateStr = recordDate.toISOString().split('T')[0];
    const dayOfWeek = recordDate.getDay();
    if (dayOfWeek === 0) continue; // Skip Sunday

    subjectList.forEach((subId, idx) => {
      if ((d + idx) % 2 === 0) {
        // Ramesh is 91% present (so mostly present, occasional absent or late)
        let status: 'Present' | 'Absent' | 'Late' | 'Excused' = 'Present';
        if (d === 8 && subId === 'sub_embedded') status = 'Absent';
        else if (d === 14 && subId === 'sub_programming') status = 'Late';
        else if (d === 21 && subId === 'sub_networks') status = 'Excused';

        attendanceRecords.push({
          id: `att_${d}_${subId}_ramesh`,
          sessionId: `sess_hist_${d}_${subId}`,
          studentId: 'std_ramesh',
          studentName: 'Ramesh Kumar',
          subjectId: subId,
          subjectName: subjectNamesMap[subId],
          date: dateStr,
          status,
          checkInMethod: status === 'Present' ? 'QR Scan' : 'Manual Faculty Entry',
          timestamp: `${dateStr}T09:04:12Z`,
          verified: true
        });
      }
    });
  }

  // Assignments
  const assignments: Assignment[] = [
    {
      id: 'assign_iot_1',
      subjectId: 'sub_iot',
      subjectName: 'Internet of Things & Smart Sensors',
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      title: 'MQTT Broker Deployment & Telemetry Dashboard',
      description: 'Set up an Eclipse Mosquitto MQTT broker on an edge device (Raspberry Pi/Linux VM), publish simulated telemetry every 2s, and visualize temperature & vibration metrics.',
      dueDate: new Date(now.getTime() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      maxMarks: 25,
      weightage: 15,
      competencyTags: ['IoT Sensor Integration', 'Network Protocols'],
      submissionsCount: 38,
      evaluatedCount: 30,
      status: 'Submitted'
    },
    {
      id: 'assign_emb_1',
      subjectId: 'sub_embedded',
      subjectName: 'Embedded Systems & Microcontrollers',
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      title: 'FreeRTOS Multi-Task Priority Inversion Analysis',
      description: 'Implement two producer tasks and one high-priority logging task with mutexes. Demonstrate and resolve priority inversion using priority inheritance protocol.',
      dueDate: new Date(now.getTime() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0],
      maxMarks: 30,
      weightage: 20,
      competencyTags: ['Microcontroller Architecture', 'Firmware Interrupts'],
      submissionsCount: 15,
      evaluatedCount: 8,
      status: 'In Progress'
    },
    {
      id: 'assign_dbms_1',
      subjectId: 'sub_dbms',
      subjectName: 'Database Management Systems',
      facultyId: 'fac_amit',
      facultyName: 'Prof. Amit Verma',
      title: 'Complex Query Plan Optimization & B+ Tree Indexing',
      description: 'Analyze an unindexed 1-million row e-commerce schema. Rewrite suboptimal joins, create composite indexes, and verify execution cost reduction from 4500 to <50.',
      dueDate: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      maxMarks: 20,
      weightage: 10,
      competencyTags: ['SQL Optimization & Indexing'],
      submissionsCount: 48,
      evaluatedCount: 48,
      status: 'Evaluated'
    }
  ];

  const submissions: Submission[] = [
    {
      id: 'subm_ramesh_iot_1',
      assignmentId: 'assign_iot_1',
      studentId: 'std_ramesh',
      studentName: 'Ramesh Kumar',
      submissionDate: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
      content: 'Configured Mosquitto MQTT broker with TLS encryption. Created Python publisher emitting JSON payloads containing sensor ID, timestamp, temperature, and humidity. Node-RED dashboard streams live telemetry.',
      fileAttachment: 'https://github.com/ramesh-kumar/iot-mqtt-telemetry-suite.zip',
      status: 'Submitted',
      maxMarks: 25
    },
    {
      id: 'subm_ramesh_dbms_1',
      assignmentId: 'assign_dbms_1',
      studentId: 'std_ramesh',
      studentName: 'Ramesh Kumar',
      submissionDate: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
      content: 'Benchmarked PostgreSQL explain analyze before and after index creation. Created composite index on orders(customer_id, order_date DESC). Query execution dropped from 380ms to 1.8ms.',
      fileAttachment: 'https://smartcampus.edu/storage/submissions/dbms_ramesh_opt.pdf',
      status: 'Evaluated',
      marksObtained: 19,
      maxMarks: 20,
      feedback: 'Excellent explain plan documentation and correct indexing strategy. Well done!',
      evaluatedBy: 'Prof. Amit Verma',
      evaluatedAt: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString()
    }
  ];

  // Assessments / Quizzes
  const assessments: Assessment[] = [
    {
      id: 'assess_iot_quiz_1',
      subjectId: 'sub_iot',
      subjectName: 'Internet of Things & Smart Sensors',
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      title: 'IoT Sensor Protocols & MQTT Mastery Quiz',
      type: 'MCQ / Quiz',
      durationMinutes: 20,
      totalMarks: 20,
      passingMarks: 12,
      semester: 4,
      isPublished: true,
      scheduledDate: todayDateStr,
      unitId: 'unit_iot_1',
      topicId: 'topic_iot_1_2',
      competencyTags: ['IoT Sensor Integration', 'Network Protocols'],
      questions: [
        {
          id: 'q_iot_1',
          assessmentId: 'assess_iot_quiz_1',
          questionText: 'In MQTT protocol, what is the key characteristic of Quality of Service (QoS) Level 1?',
          options: [
            'Fire and forget with no acknowledgement',
            'At least once delivery with PUBACK confirmation',
            'Exactly once delivery using a 4-step handshake',
            'Streaming UDP datagram packets without state'
          ],
          correctOptionIndex: 1,
          explanation: 'QoS 1 guarantees that the message arrives at the receiver at least once. The sender stores the message until it receives a PUBACK packet.',
          marks: 5,
          competencyTag: 'IoT Sensor Integration'
        },
        {
          id: 'q_iot_2',
          assessmentId: 'assess_iot_quiz_1',
          questionText: 'Which serial communication bus uses dedicated Master-Out-Slave-In (MOSI) and Master-In-Slave-Out (MISO) lines allowing full-duplex transmission?',
          options: ['I2C', 'UART', 'SPI (Serial Peripheral Interface)', '1-Wire'],
          correctOptionIndex: 2,
          explanation: 'SPI uses separate lines for transmit (MOSI) and receive (MISO) along with a clock (SCK) and slave select (SS), enabling synchronous full-duplex communication.',
          marks: 5,
          competencyTag: 'IoT Sensor Integration'
        },
        {
          id: 'q_iot_3',
          assessmentId: 'assess_iot_quiz_1',
          questionText: 'What is the primary power-saving advantage of CoAP (Constrained Application Protocol) over HTTP in IoT devices?',
          options: [
            'CoAP runs over TCP with persistent connections',
            'CoAP uses UDP with a compact 4-byte fixed binary header and asynchronous transactions',
            'CoAP does not support URI schemes',
            'CoAP requires XML formatting'
          ],
          correctOptionIndex: 1,
          explanation: 'CoAP operates on top of UDP with a lightweight 4-byte binary header, avoiding the overhead and connection teardown latency of HTTP over TCP.',
          marks: 5,
          competencyTag: 'Network Protocols'
        },
        {
          id: 'q_iot_4',
          assessmentId: 'assess_iot_quiz_1',
          questionText: 'When an analog sensor has an output impedance of 50kΩ connected to a microcontrollers ADC with 10pF sampling capacitor, what is the best mitigation for ADC reading drop?',
          options: [
            'Increase ADC clock speed to maximum',
            'Insert an operational amplifier voltage follower (buffer) or increase sample hold time',
            'Ground the analog input directly',
            'Use a pull-up resistor of 100Ω'
          ],
          correctOptionIndex: 1,
          explanation: 'A unity-gain buffer op-amp provides high input impedance and near-zero output impedance to charge the internal ADC sample-and-hold capacitor without distorting signal voltage.',
          marks: 5,
          competencyTag: 'Hardware & Systems'
        }
      ]
    },
    {
      id: 'assess_emb_quiz_1',
      subjectId: 'sub_embedded',
      subjectName: 'Embedded Systems & Microcontrollers',
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      title: 'FreeRTOS & ARM NVIC Interrupt Assessment',
      type: 'MCQ / Quiz',
      durationMinutes: 25,
      totalMarks: 20,
      passingMarks: 12,
      semester: 4,
      isPublished: true,
      scheduledDate: todayDateStr,
      unitId: 'unit_emb_2',
      topicId: 'topic_emb_2_1',
      competencyTags: ['Microcontroller Architecture', 'Firmware Interrupts'],
      questions: [
        {
          id: 'q_emb_1',
          assessmentId: 'assess_emb_quiz_1',
          questionText: 'What happens during ARM Cortex-M Tail-Chaining when a higher priority interrupt arrives while an ISR is executing?',
          options: [
            'The CPU pops registers to stack and re-pushes them immediately',
            'The processor skips state restoration and jumps directly to the new ISR in only 6 clock cycles',
            'The CPU resets to the bootloader',
            'Interrupts are disabled permanently'
          ],
          correctOptionIndex: 1,
          explanation: 'Tail-chaining avoids saving and restoring state between back-to-back interrupts, reducing interrupt entry latency to just 6 cycles.',
          marks: 5,
          competencyTag: 'Microcontroller Architecture'
        },
        {
          id: 'q_emb_2',
          assessmentId: 'assess_emb_quiz_1',
          questionText: 'In FreeRTOS, how does Priority Inheritance solve the classic Priority Inversion problem?',
          options: [
            'It terminates the lowest priority task immediately',
            'It temporarily boosts the priority of the mutex-holding task to match the highest waiting task priority',
            'It disables the scheduler entirely',
            'It converts the mutex to a binary semaphore'
          ],
          correctOptionIndex: 1,
          explanation: 'Priority Inheritance ensures the lower priority task holding the shared resource inherits the higher priority of the blocked task until it releases the mutex.',
          marks: 5,
          competencyTag: 'Firmware Interrupts'
        },
        {
          id: 'q_emb_3',
          assessmentId: 'assess_emb_quiz_1',
          questionText: 'Which FreeRTOS API function is safe to call from within an Interrupt Service Routine (ISR)?',
          options: ['xQueueSend()', 'vTaskDelay()', 'xQueueSendFromISR()', 'vTaskDelete()'],
          correctOptionIndex: 2,
          explanation: 'Functions ending in "FromISR" are designed not to block or invoke scheduler operations directly and take a pxHigherPriorityTaskWoken pointer.',
          marks: 5,
          competencyTag: 'Firmware Interrupts'
        },
        {
          id: 'q_emb_4',
          assessmentId: 'assess_emb_quiz_1',
          questionText: 'What is the purpose of the SysTick timer in an ARM Cortex-M based RTOS port?',
          options: [
            'To generate baud rates for UART',
            'To provide the periodic OS tick interrupt driving task time-slicing and delay timers',
            'To monitor supply voltage levels',
            'To trigger DMA transfers'
          ],
          correctOptionIndex: 1,
          explanation: 'SysTick is the dedicated 24-bit down-counter system timer standard on Cortex-M cores used as the heartbeat/tick for RTOS schedulers.',
          marks: 5,
          competencyTag: 'Microcontroller Architecture'
        }
      ]
    }
  ];

  // Assessment Attempts for Ramesh Kumar
  const assessmentAttempts: AssessmentAttempt[] = [
    {
      id: 'attempt_iot_1',
      assessmentId: 'assess_iot_quiz_1',
      assessmentTitle: 'IoT Sensor Protocols & MQTT Mastery Quiz',
      subjectName: 'Internet of Things & Smart Sensors',
      studentId: 'std_ramesh',
      studentName: 'Ramesh Kumar',
      startedAt: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
      completedAt: new Date(now.getTime() - 2 * 24 * 3600 * 1000 + 15 * 60 * 1000).toISOString(),
      score: 20,
      totalMarks: 20,
      percentage: 100,
      passed: true,
      answers: [
        { questionId: 'q_iot_1', selectedOption: 1, isCorrect: true, marksAwarded: 5 },
        { questionId: 'q_iot_2', selectedOption: 2, isCorrect: true, marksAwarded: 5 },
        { questionId: 'q_iot_3', selectedOption: 1, isCorrect: true, marksAwarded: 5 },
        { questionId: 'q_iot_4', selectedOption: 1, isCorrect: true, marksAwarded: 5 }
      ],
      competencyGapsIdentified: []
    },
    {
      id: 'attempt_emb_1',
      assessmentId: 'assess_emb_quiz_1',
      assessmentTitle: 'FreeRTOS & ARM NVIC Interrupt Assessment',
      subjectName: 'Embedded Systems & Microcontrollers',
      studentId: 'std_ramesh',
      studentName: 'Ramesh Kumar',
      startedAt: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString(),
      completedAt: new Date(now.getTime() - 4 * 24 * 3600 * 1000 + 18 * 60 * 1000).toISOString(),
      score: 10,
      totalMarks: 20,
      percentage: 50,
      passed: false,
      answers: [
        { questionId: 'q_emb_1', selectedOption: 1, isCorrect: true, marksAwarded: 5 },
        { questionId: 'q_emb_2', selectedOption: 0, isCorrect: false, marksAwarded: 0 },
        { questionId: 'q_emb_3', selectedOption: 0, isCorrect: false, marksAwarded: 0 },
        { questionId: 'q_emb_4', selectedOption: 1, isCorrect: true, marksAwarded: 5 }
      ],
      competencyGapsIdentified: ['Firmware Interrupts', 'FreeRTOS Task Synchronization']
    }
  ];

  // Competency Map for Ramesh Kumar
  const competencies: Record<string, Competency[]> = {
    std_ramesh: [
      {
        id: 'comp_iot_sensors',
        name: 'IoT Sensor & Hardware Interfacing',
        category: 'Hardware & Systems',
        subjectId: 'sub_iot',
        subjectName: 'Internet of Things & Smart Sensors',
        currentLevel: 94,
        status: 'Strong',
        history: [
          { date: '2026-08-01', score: 82, activityTitle: 'Sensor Interfacing Lab' },
          { date: '2026-08-15', score: 90, activityTitle: 'I2C/SPI Protocol Assignment' },
          { date: '2026-08-25', score: 94, activityTitle: 'IoT Telemetry Quiz' }
        ],
        relatedTopics: ['Sensor Interfacing', 'ADC Signal Conditioning', 'I2C/SPI Bus'],
        recommendation: 'Top percentile in hardware interfacing. Ready for advanced edge TinyML projects.'
      },
      {
        id: 'comp_sql_dbms',
        name: 'SQL Optimization & Indexing',
        category: 'Software & Data',
        subjectId: 'sub_dbms',
        subjectName: 'Database Management Systems',
        currentLevel: 91,
        status: 'Strong',
        history: [
          { date: '2026-08-05', score: 85, activityTitle: 'Relational Calculus Test' },
          { date: '2026-08-18', score: 91, activityTitle: 'Query Optimization Assignment' }
        ],
        relatedTopics: ['B+ Tree Indexing', 'Execution Plans', 'ACID Transactions'],
        recommendation: 'Excellent analytical query design. Consider exploring distributed database sharding.'
      },
      {
        id: 'comp_network_protocols',
        name: 'Network Protocols & Telemetry',
        category: 'Core Engineering',
        subjectId: 'sub_networks',
        subjectName: 'Computer Networks & Security',
        currentLevel: 88,
        status: 'Strong',
        history: [
          { date: '2026-08-10', score: 80, activityTitle: 'TCP Handshake Lab' },
          { date: '2026-08-22', score: 88, activityTitle: 'MQTT vs CoAP Evaluation' }
        ],
        relatedTopics: ['MQTT QoS', 'TCP/IP Stack', 'TLS Cryptographic Handshakes']
      },
      {
        id: 'comp_microcontroller',
        name: 'Microcontroller Architecture & NVIC',
        category: 'Hardware & Systems',
        subjectId: 'sub_embedded',
        subjectName: 'Embedded Systems & Microcontrollers',
        currentLevel: 72,
        status: 'Developing',
        history: [
          { date: '2026-08-08', score: 68, activityTitle: 'ARM Cortex Register File Quiz' },
          { date: '2026-08-20', score: 72, activityTitle: 'SysTick Timer Configuration' }
        ],
        relatedTopics: ['ARM Cortex-M4', 'Tail Chaining', 'Interrupt Latency'],
        recommendation: 'Good grasp of CPU registers; focus on low-level ISR stack frame restoration.'
      },
      {
        id: 'comp_oop_patterns',
        name: 'Object-Oriented Design & Patterns',
        category: 'Software & Data',
        subjectId: 'sub_programming',
        subjectName: 'Advanced Programming & Design Patterns',
        currentLevel: 70,
        status: 'Developing',
        history: [
          { date: '2026-08-12', score: 65, activityTitle: 'SOLID Principles Quiz' },
          { date: '2026-08-24', score: 70, activityTitle: 'Factory Pattern Implementation' }
        ],
        relatedTopics: ['SOLID Principles', 'Observer Pattern', 'Memory Management']
      },
      {
        id: 'comp_rtos_interrupts',
        name: 'FreeRTOS & Firmware Interrupts',
        category: 'Hardware & Systems',
        subjectId: 'sub_embedded',
        subjectName: 'Embedded Systems & Microcontrollers',
        currentLevel: 52,
        status: 'Needs Practice',
        history: [
          { date: '2026-08-14', score: 55, activityTitle: 'RTOS Task Delay Lab' },
          { date: '2026-08-23', score: 50, activityTitle: 'FreeRTOS Assessment Quiz' }
        ],
        relatedTopics: ['Priority Inversion', 'xQueueSendFromISR', 'Counting Semaphores'],
        recommendation: 'Targeted practice needed on Mutex Priority Inheritance and ISR queue handling.'
      }
    ]
  };

  // Smart Recommendations (Closing the Competency Loop)
  const recommendations: Recommendation[] = [
    {
      id: 'rec_rtos_gap_1',
      studentId: 'std_ramesh',
      title: 'FreeRTOS Priority Inversion & Mutex Protocol Interactive Lab',
      description: 'Review the 8-minute interactive visual walkthrough explaining how Priority Inheritance temporarily elevates task priority to avert unbounded inversion.',
      type: 'Micro-Learning',
      subjectId: 'sub_embedded',
      subjectName: 'Embedded Systems & Microcontrollers',
      competencyTag: 'FreeRTOS & Firmware Interrupts',
      durationMinutes: 15,
      reason: 'Triggered by low score (50%) on Embedded Systems Assessment. Directly impacts your target goal: "Become an IoT Engineer".',
      urgency: 'High',
      isCompleted: false,
      freeSlotTime: 'Today 2:15 PM - 3:15 PM (Free Period in Innovation Lounge)',
      sourceGap: 'Assessment Score (50%) in FreeRTOS & ARM NVIC Interrupt Assessment'
    },
    {
      id: 'rec_isr_quiz_2',
      studentId: 'std_ramesh',
      title: '5-Minute Practice Sprint: ISR-Safe RTOS APIs',
      description: 'Practice 4 targeted questions on xQueueSendFromISR and context switching mechanics.',
      type: 'Practice Quiz',
      subjectId: 'sub_embedded',
      subjectName: 'Embedded Systems & Microcontrollers',
      competencyTag: 'FreeRTOS & Firmware Interrupts',
      durationMinutes: 5,
      reason: 'Reinforces the distinction between blocking tasks and ISR contexts before upcoming midterm.',
      urgency: 'High',
      isCompleted: false,
      freeSlotTime: 'Tomorrow 3:30 PM - 4:30 PM (Free Period)',
      sourceGap: 'Incorrect answer on xQueueSendFromISR API question'
    },
    {
      id: 'rec_tinyml_adv_3',
      studentId: 'std_ramesh',
      title: 'Edge Micro-AI: Quantizing Neural Networks for Cortex-M4',
      description: 'Hands-on tutorial building a 4-layer gesture recognizer using TensorFlow Lite Micro.',
      type: 'Code Challenge',
      subjectId: 'sub_iot',
      subjectName: 'Internet of Things & Smart Sensors',
      competencyTag: 'IoT Sensor & Hardware Interfacing',
      durationMinutes: 25,
      reason: 'Recommended because you demonstrated 94% mastery in IoT Sensor Interfacing and have high career interest in IoT Engineering.',
      urgency: 'Medium',
      isCompleted: false,
      freeSlotTime: 'Thursday 1:15 PM - 2:15 PM (Free Period)'
    }
  ];

  // Learning Resources Library
  const resources: LearningResource[] = [
    {
      id: 'res_iot_notes_1',
      title: 'IoT Protocols Cheat Sheet: MQTT, CoAP, LoRaWAN & Zigbee Compared',
      subjectId: 'sub_iot',
      subjectName: 'Internet of Things & Smart Sensors',
      semester: 4,
      unitNumber: 2,
      topicTitle: 'MQTT & CoAP Protocol Internals',
      type: 'PDF Notes',
      author: 'Dr. Priya Sharma',
      url: 'https://smartcampus.edu/resources/iot-protocols-handbook.pdf',
      fileSize: '2.4 MB',
      downloadsCount: 142,
      isBookmarked: true,
      tags: ['MQTT', 'CoAP', 'Wireless', 'QoS']
    },
    {
      id: 'res_emb_freertos_2',
      title: 'Mastering FreeRTOS Kernel: Task Scheduling & Interrupt Architecture',
      subjectId: 'sub_embedded',
      subjectName: 'Embedded Systems & Microcontrollers',
      semester: 4,
      unitNumber: 2,
      topicTitle: 'FreeRTOS Task Synchronization & Queues',
      type: 'Video Lecture',
      author: 'Dr. Priya Sharma',
      url: 'https://smartcampus.edu/resources/freertos-masterclass-video.mp4',
      fileSize: '480 MB',
      duration: '42 mins',
      downloadsCount: 289,
      isBookmarked: true,
      tags: ['FreeRTOS', 'Priority Inversion', 'Semaphores', 'Interrupts']
    },
    {
      id: 'res_dbms_indexing_3',
      title: 'Database Query Optimization & PostgreSQL Indexing Deep-Dive',
      subjectId: 'sub_dbms',
      subjectName: 'Database Management Systems',
      semester: 4,
      unitNumber: 1,
      topicTitle: 'B+ Tree Indexing & Composite Indexes',
      type: 'Slide Deck',
      author: 'Prof. Amit Verma',
      url: 'https://smartcampus.edu/resources/dbms-bplus-indexing.pdf',
      fileSize: '5.1 MB',
      downloadsCount: 198,
      isBookmarked: false,
      tags: ['SQL', 'Indexes', 'PostgreSQL', 'Performance']
    },
    {
      id: 'res_networks_tls_4',
      title: 'TLS 1.3 Handshake Protocol & Cryptographic Suite Blueprint',
      subjectId: 'sub_networks',
      subjectName: 'Computer Networks & Security',
      semester: 4,
      unitNumber: 3,
      topicTitle: 'Cryptographic Protocols & Zero Trust',
      type: 'Code Repository',
      author: 'Dr. Sunita Rao',
      url: 'https://github.com/smartcampus-edu/tls-handshake-lab',
      fileSize: '1.2 MB',
      downloadsCount: 88,
      isBookmarked: false,
      tags: ['Security', 'TLS', 'Cryptography', 'TCP']
    }
  ];

  // Campus Events
  const events: CampusEvent[] = [
    {
      id: 'evt_iot_hackathon',
      title: 'Smart Campus 2026: IoT & TinyML 36-Hour Hackathon',
      category: 'Hackathon',
      description: 'Build real-world smart environmental, robotic, or assistive hardware prototypes. Sponsored by Intel & Texas Instruments with ₹1,50,000 cash prizes.',
      date: new Date(now.getTime() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
      time: '09:00 AM - 09:00 PM',
      venue: 'Main Innovation Center & IoT Lab Hub',
      organizer: 'IoT & Robotics Student Club',
      targetAudience: ['student', 'faculty', 'all'],
      registrationRequired: true,
      isRegistered: true,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'evt_ai_summit',
      title: 'Industry Keynote: Next-Gen Edge AI & Autonomous Robotics',
      category: 'Guest Lecture',
      description: 'Distinguished lecture by Principal Research Scientist from Google DeepMind on scalable multimodal intelligence on low-power devices.',
      date: new Date(now.getTime() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      time: '03:00 PM - 05:00 PM',
      venue: 'Dr. APJ Abdul Kalam Auditorium',
      organizer: 'Department of Computer Science',
      targetAudience: ['student', 'faculty', 'parent', 'all'],
      registrationRequired: false,
      isRegistered: false,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600'
    }
  ];

  // Announcements
  const announcements: Announcement[] = [
    {
      id: 'ann_midterm_schedule',
      title: 'Academic Notice: Mid-Semester Examination Schedule Published',
      content: 'The Mid-Semester exams for Semester 4 (B.Tech CSE/ECE/IT) will commence on September 15, 2026. Hall tickets and seating charts will be issued on the student portal next Monday. All attendance requirements (>75%) must be met.',
      authorName: 'Dr. K. Ramanathan',
      authorRole: 'Dean of Academic Affairs',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      date: todayDateStr,
      priority: 'Urgent',
      targetAudience: ['student', 'faculty', 'parent', 'all'],
      department: 'Academic Office'
    },
    {
      id: 'ann_iot_lab_upgrades',
      title: 'Facility Update: 25 New ESP32-S3 & Raspberry Pi 5 Kits Deployed in Lab 402',
      content: 'The IoT Innovation Hub has completed hardware provisioning with AI accelerators and sensor packs. Students working on capstone projects can check out boards during free periods.',
      authorName: 'Dr. Priya Sharma',
      authorRole: 'Associate Professor, CSE',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      date: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      priority: 'Normal',
      targetAudience: ['student', 'faculty'],
      department: 'Computer Science & Engineering'
    }
  ];

  // Notifications
  const notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      userId: 'std_ramesh',
      title: 'Live QR Attendance Session Open',
      message: 'Dr. Priya Sharma opened the attendance session for Internet of Things & Smart Sensors (Room 402). Scan now!',
      type: 'attendance',
      timestamp: 'Just now',
      isRead: false,
      actionLink: '/attendance'
    },
    {
      id: 'notif_2',
      userId: 'std_ramesh',
      title: 'Personalized Learning Recommendation Available',
      message: 'FreeRTOS Priority Inversion lab suggested for your 2:15 PM free period to address quiz gap.',
      type: 'academic',
      timestamp: '2 hours ago',
      isRead: false,
      actionLink: '/recommendations'
    },
    {
      id: 'notif_3',
      userId: 'std_ramesh',
      title: 'Grade Evaluated: DBMS Query Optimization',
      message: 'Prof. Amit Verma evaluated your submission with 19/20 marks ("Excellent explain plan documentation").',
      type: 'academic',
      timestamp: 'Yesterday',
      isRead: true,
      actionLink: '/assignments'
    },
    {
      id: 'notif_4',
      userId: 'parent_suresh',
      title: 'Attendance Report: Ramesh Kumar (91%)',
      message: 'Ramesh has maintained 91% attendance across Semester 4. All subjects are above institution threshold.',
      type: 'attendance',
      timestamp: 'Yesterday',
      isRead: false
    }
  ];

  // Audit Logs
  const auditLogs: AuditLog[] = [
    {
      id: 'log_1',
      timestamp: new Date().toISOString(),
      userName: 'Dr. Priya Sharma',
      userRole: 'faculty',
      action: 'GENERATED_ATTENDANCE_QR_SESSION',
      resource: 'Session CS401 (IoT Hub)',
      ipAddress: '192.168.1.104',
      status: 'Success'
    },
    {
      id: 'log_2',
      timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
      userName: 'Dr. K. Ramanathan',
      userRole: 'admin',
      action: 'PUBLISHED_INSTITUTION_ANNOUNCEMENT',
      resource: 'Academic Notice: Mid-Semester Schedule',
      ipAddress: '192.168.1.1',
      status: 'Success'
    },
    {
      id: 'log_3',
      timestamp: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      userName: 'Ramesh Kumar',
      userRole: 'student',
      action: 'COMPLETED_ASSESSMENT_ATTEMPT',
      resource: 'assess_iot_quiz_1 (Score: 20/20)',
      ipAddress: '192.168.4.88',
      status: 'Success'
    }
  ];

  // AI Generation Logs (Human in the loop approval desk)
  const aiGenerationLogs: AiGenerationLog[] = [
    {
      id: 'gen_log_1',
      institutionId: 'inst_sit_01',
      timestamp: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(),
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      topic: 'IoT Sensor Protocols & MQTT Mastery',
      subjectName: 'Internet of Things & Smart Sensors',
      model: 'gemini-3.7-flash',
      prompt: 'Generate 4 rigorous MCQs on MQTT QoS levels, SPI bus arbitration, and CoAP constraints.',
      generatedQuestionsCount: 4,
      status: 'approved',
      reviewedBy: 'Dr. Priya Sharma',
      reviewedAt: new Date(now.getTime() - 2.8 * 3600 * 1000).toISOString(),
      assessmentId: 'assess_iot_quiz_1'
    },
    {
      id: 'gen_log_2',
      institutionId: 'inst_sit_01',
      timestamp: new Date(now.getTime() - 1 * 3600 * 1000).toISOString(),
      facultyId: 'fac_priya',
      facultyName: 'Dr. Priya Sharma',
      topic: 'FreeRTOS Task Synchronization & Queues',
      subjectName: 'Embedded Systems & Microcontrollers',
      model: 'gemini-3.7-flash',
      prompt: 'Generate 4 MCQs evaluating Priority Inheritance and ISR safe RTOS queue APIs.',
      generatedQuestionsCount: 4,
      status: 'approved',
      reviewedBy: 'Dr. Priya Sharma',
      reviewedAt: new Date(now.getTime() - 0.8 * 3600 * 1000).toISOString(),
      assessmentId: 'assess_emb_quiz_1'
    }
  ];

  // Institutional Compliance & Exportable Reports
  const reports: ReportExport[] = [
    {
      id: 'rep_att_defaulters_01',
      institutionId: 'inst_sit_01',
      title: 'Semester 4 Attendance Defaulter Registry (<75% threshold)',
      type: 'attendance_defaulters',
      generatedAt: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
      generatedBy: 'Dr. K. Ramanathan (Dean of Academic Affairs)',
      rowCount: 4,
      fileFormat: 'csv',
      summary: 'Identified 4 students across Section A/B requiring mandatory faculty mentor counseling before Mid-Semester exams.'
    },
    {
      id: 'rep_comp_matrix_02',
      institutionId: 'inst_sit_01',
      title: 'CSE Batch 2024 Competency Gap & Mastery Matrix',
      type: 'competency_matrix',
      generatedAt: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
      generatedBy: 'Institutional Quality Assurance Cell (IQAC)',
      rowCount: 50,
      fileFormat: 'csv',
      summary: '84% overall cohort mastery. Highlighted FreeRTOS Firmware Interrupts as the primary cross-sectional remediation priority.'
    },
    {
      id: 'rep_cie_marks_03',
      institutionId: 'inst_sit_01',
      title: 'Continuous Internal Evaluation (CIE) Cumulative Marks Statement',
      type: 'academic_cie',
      generatedAt: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      generatedBy: 'Academic Registrar Office',
      rowCount: 50,
      fileFormat: 'csv',
      summary: 'Verified grades across 6 core theory & lab subjects with automated GPA projection calculations.'
    },
    {
      id: 'rep_audit_trail_04',
      institutionId: 'inst_sit_01',
      title: 'Institutional Access, QR Sessions & Grading Security Audit Trail',
      type: 'audit_trail',
      generatedAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      generatedBy: 'System Security Administrator',
      rowCount: 128,
      fileFormat: 'csv',
      summary: 'Complete immutable log of all authenticated faculty sessions, student QR check-ins, grade submissions, and AI interactions.'
    }
  ];

  return {
    institutions,
    users,
    departments,
    courses,
    subjects,
    curriculum,
    timetable,
    attendanceSessions: initialSessions,
    attendanceRecords,
    assignments,
    submissions,
    assessments,
    assessmentAttempts,
    competencies,
    recommendations,
    resources,
    events,
    announcements,
    notifications,
    auditLogs,
    aiGenerationLogs,
    reports
  };
}

class DatabaseManager {
  private db: CampusDatabase;

  constructor() {
    this.db = this.loadData();
  }

  private loadData(): CampusDatabase {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Quick validation and migration defaults
        if (parsed.users && parsed.subjects && parsed.curriculum) {
          if (!parsed.institutions) parsed.institutions = getInitialSeedData().institutions;
          if (!parsed.aiGenerationLogs) parsed.aiGenerationLogs = getInitialSeedData().aiGenerationLogs;
          if (!parsed.reports) parsed.reports = getInitialSeedData().reports;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read existing data file, initializing seed data:', e);
    }
    const seed = getInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(data: CampusDatabase): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database to file:', e);
    }
  }

  public getDb(): CampusDatabase {
    return this.db;
  }

  public persist(): void {
    this.saveData(this.db);
  }

  public resetToSeed(): CampusDatabase {
    this.db = getInitialSeedData();
    this.persist();
    return this.db;
  }

  // System Stats calculation
  public getSystemStats(): SystemStats {
    const students = this.db.users.filter(u => u.role === 'student');
    const faculty = this.db.users.filter(u => u.role === 'faculty');
    const totalAtt = students.reduce((acc, s) => acc + (s.attendancePercentage || 85), 0);
    const avgAtt = students.length ? Math.round(totalAtt / students.length) : 88;
    const totalCgpa = students.reduce((acc, s) => acc + (s.cgpa || 7.5), 0);
    const avgCgpa = students.length ? Number((totalCgpa / students.length).toFixed(2)) : 8.1;
    const activeSessions = (this.db.attendanceSessions || []).filter(s => s.isActive).length;
    const pendingSubmissions = (this.db.assignments || []).reduce((acc, a) => acc + ((a.submissionsCount || 0) - (a.evaluatedCount || 0)), 0);

    return {
      totalStudents: students.length,
      totalFaculty: faculty.length,
      totalCourses: (this.db.courses || []).length,
      totalDepartments: (this.db.departments || []).length,
      averageAttendance: avgAtt,
      averageCGPA: avgCgpa,
      activeQRSessions: activeSessions,
      pendingSubmissions: Math.max(0, pendingSubmissions),
      competencyMasteryRate: 84,
      aiGenerationsLogged: (this.db.aiGenerationLogs || []).length
    };
  }
}

export const dbManager = new DatabaseManager();
