export type UserRole = 'student' | 'faculty' | 'admin' | 'parent';

export interface Institution {
  id: string;
  name: string;
  code: string;
  domain: string;
  address: string;
  accreditation: string;
  logoUrl?: string;
  primaryColor?: string;
  activeStudentsCount: number;
  activeFacultyCount: number;
  isDefault?: boolean;
}

export interface User {
  id: string;
  institutionId?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  studentId?: string; // Roll number, e.g. "2024-CSE-042"
  facultyId?: string; // e.g. "FAC-CSE-101"
  departmentId?: string;
  courseId?: string;
  semester?: number;
  section?: string;
  linkedStudentId?: string; // For parents
  bio?: string;
  academicGoal?: string; // e.g., "Become an IoT Engineer"
  cgpa?: number;
  attendancePercentage?: number;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  hod: string;
  facultyCount: number;
  studentCount: number;
  description: string;
  color: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  durationYears: number;
  totalSemesters: number;
  degreeType: 'B.Tech' | 'M.Tech' | 'B.Sc' | 'MBA';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  courseId: string;
  semester: number;
  credits: number;
  facultyId: string;
  facultyName: string;
  category: 'Core' | 'Elective' | 'Lab' | 'Project';
  description: string;
  totalHours: number;
  completedHours: number;
  iconName?: string;
}

export type CurriculumStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Assessed';

export interface CurriculumObjective {
  id: string;
  topicId: string;
  title: string;
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  isCompleted: boolean;
  assessedScore?: number;
}

export interface CurriculumTopic {
  id: string;
  unitId: string;
  title: string;
  estimatedHours: number;
  status: CurriculumStatus;
  objectives: CurriculumObjective[];
  activityCount: number;
  resourceCount: number;
}

export interface CurriculumUnit {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  description: string;
  status: CurriculumStatus;
  weightagePercent: number;
  topics: CurriculumTopic[];
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  room: string;
  semester: number;
  section: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Free Period';
}

export interface AttendanceSession {
  id: string;
  subjectId: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  semester: number;
  section: string;
  qrToken: string;
  qrExpiresAt: string;
  isActive: boolean;
  totalStudents: number;
  presentCount: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  checkInMethod: 'QR Scan' | 'Manual Faculty Entry' | 'Biometric' | 'System';
  timestamp: string;
  verified: boolean;
}

export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Late' | 'Evaluated';

export interface Assignment {
  id: string;
  subjectId: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  title: string;
  description: string;
  unitId?: string;
  topicId?: string;
  dueDate: string;
  maxMarks: number;
  weightage: number;
  attachmentUrl?: string;
  submissionsCount?: number;
  evaluatedCount?: number;
  status?: AssignmentStatus; // for current student
  competencyTags: string[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  content: string;
  fileAttachment?: string;
  status: AssignmentStatus;
  marksObtained?: number;
  maxMarks: number;
  feedback?: string;
  evaluatedBy?: string;
  evaluatedAt?: string;
}

export type AssessmentType = 'MCQ / Quiz' | 'Short Answer' | 'Practical Lab' | 'Course Project';

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionText: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswerText?: string;
  explanation?: string;
  marks: number;
  competencyTag: string;
}

export interface Assessment {
  id: string;
  subjectId: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  title: string;
  type: AssessmentType;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  semester: number;
  isPublished: boolean;
  scheduledDate: string;
  unitId?: string;
  topicId?: string;
  competencyTags: string[];
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  subjectName: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  completedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedOption?: number;
    answerText?: string;
    isCorrect: boolean;
    marksAwarded: number;
  }[];
  competencyGapsIdentified: string[];
}

export type CompetencyStatus = 'Strong' | 'Developing' | 'Needs Practice';

export interface Competency {
  id: string;
  name: string;
  category: 'Core Engineering' | 'Software & Data' | 'Hardware & Systems' | 'Professional Skills';
  subjectId: string;
  subjectName: string;
  currentLevel: number; // 0 to 100
  status: CompetencyStatus;
  history: {
    date: string;
    score: number;
    activityTitle: string;
  }[];
  relatedTopics: string[];
  recommendation?: string;
}

export interface Recommendation {
  id: string;
  studentId: string;
  title: string;
  description: string;
  type: 'Micro-Learning' | 'Practice Quiz' | 'Revision Video' | 'Code Challenge' | 'Faculty Consultation';
  subjectId: string;
  subjectName: string;
  competencyTag: string;
  durationMinutes: number;
  reason: string; // Plain language "why"
  urgency: 'High' | 'Medium' | 'Low';
  isCompleted: boolean;
  actionUrl?: string;
  freeSlotTime?: string; // e.g. "Today 2:00 PM - 3:00 PM (Free Period)"
  sourceGap?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  semester: number;
  unitNumber: number;
  topicTitle: string;
  type: 'PDF Notes' | 'Video Lecture' | 'Code Repository' | 'Cheat Sheet' | 'Slide Deck';
  author: string;
  url: string;
  fileSize: string;
  duration?: string;
  downloadsCount: number;
  isBookmarked?: boolean;
  tags: string[];
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Guest Lecture' | 'Workshop' | 'Exam' | 'Sports / Cultural';
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  targetAudience: ('student' | 'faculty' | 'parent' | 'all')[];
  registrationRequired: boolean;
  isRegistered?: boolean;
  image?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  priority: 'Urgent' | 'Normal' | 'Info';
  targetAudience: ('student' | 'faculty' | 'parent' | 'all')[];
  department?: string;
  attachments?: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'academic' | 'attendance' | 'alert' | 'event' | 'system';
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
}

export interface AuditLog {
  id: string;
  institutionId?: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
}

export interface AiGenerationLog {
  id: string;
  institutionId?: string;
  timestamp: string;
  facultyId: string;
  facultyName: string;
  topic: string;
  subjectName: string;
  model: string;
  prompt: string;
  generatedQuestionsCount: number;
  status: 'draft' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  assessmentId?: string;
}

export type ReportType = 'attendance_defaulters' | 'competency_matrix' | 'academic_cie' | 'audit_trail';

export interface ReportExport {
  id: string;
  institutionId?: string;
  title: string;
  type: ReportType;
  generatedAt: string;
  generatedBy: string;
  rowCount: number;
  fileFormat: 'csv' | 'pdf';
  downloadUrl?: string;
  summary: string;
}

export interface SystemStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalDepartments: number;
  averageAttendance: number;
  averageCGPA: number;
  activeQRSessions: number;
  pendingSubmissions: number;
  competencyMasteryRate: number;
  aiGenerationsLogged?: number;
}
