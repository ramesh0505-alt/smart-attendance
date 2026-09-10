import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbManager } from './src/server/db.ts';
import { generateAiQuiz, askAiAssistant } from './src/server/gemini.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (req.path.startsWith('/api')) {
      const duration = Date.now() - start;
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ==========================================
// API ROUTES
// ==========================================

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Smart College Portal API' });
});

// System Stats
app.get('/api/stats', (req, res) => {
  const stats = dbManager.getSystemStats();
  res.json({ success: true, data: stats });
});

// Reset database to initial seed
app.post('/api/db/reset', (req, res) => {
  const freshDb = dbManager.resetToSeed();
  res.json({ success: true, message: 'Database reset to initial seed successfully', data: freshDb });
});

// Users & Auth
app.get('/api/users', (req, res) => {
  const db = dbManager.getDb();
  const { role } = req.query;
  let users = db.users;
  if (role) {
    users = users.filter(u => u.role === role);
  }
  res.json({ success: true, data: users });
});

app.get('/api/users/:id', (req, res) => {
  const db = dbManager.getDb();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const db = dbManager.getDb();
  const user = db.users.find(u => (email && u.email.toLowerCase() === email.toLowerCase()) || (role && u.role === role));
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials or user not found' });
  }
  res.json({ success: true, data: user });
});

app.put('/api/users/:id', (req, res) => {
  const db = dbManager.getDb();
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  db.users[index] = { ...db.users[index], ...req.body };
  dbManager.persist();
  res.json({ success: true, data: db.users[index] });
});

// Departments & Courses
app.get('/api/departments', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.departments });
});

app.get('/api/courses', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.courses });
});

// Subjects
app.get('/api/subjects', (req, res) => {
  const db = dbManager.getDb();
  const { semester, courseId } = req.query;
  let list = db.subjects;
  if (semester) {
    list = list.filter(s => s.semester === Number(semester));
  }
  if (courseId) {
    list = list.filter(s => s.courseId === courseId);
  }
  res.json({ success: true, data: list });
});

// Curriculum Explorer
app.get('/api/curriculum', (req, res) => {
  const db = dbManager.getDb();
  const { subjectId } = req.query;
  let units = db.curriculum;
  if (subjectId) {
    units = units.filter(u => u.subjectId === subjectId);
  }
  res.json({ success: true, data: units });
});

app.put('/api/curriculum/units/:unitId/status', (req, res) => {
  const { unitId } = req.params;
  const { status } = req.body;
  const db = dbManager.getDb();
  const unit = db.curriculum.find(u => u.id === unitId);
  if (!unit) {
    return res.status(404).json({ success: false, error: 'Unit not found' });
  }
  unit.status = status;
  dbManager.persist();
  res.json({ success: true, data: unit });
});

app.put('/api/curriculum/topics/:topicId/status', (req, res) => {
  const { topicId } = req.params;
  const { status } = req.body;
  const db = dbManager.getDb();
  for (const unit of db.curriculum) {
    const topic = unit.topics.find(t => t.id === topicId);
    if (topic) {
      topic.status = status;
      dbManager.persist();
      return res.json({ success: true, data: topic });
    }
  }
  res.status(404).json({ success: false, error: 'Topic not found' });
});

// Timetable
app.get('/api/timetable', (req, res) => {
  const db = dbManager.getDb();
  const { semester, section, day } = req.query;
  let slots = db.timetable;
  if (semester) slots = slots.filter(s => s.semester === Number(semester));
  if (section) slots = slots.filter(s => s.section === section);
  if (day) slots = slots.filter(s => s.day === day);
  res.json({ success: true, data: slots });
});

// Attendance & Live QR Engine
app.get('/api/attendance/sessions', (req, res) => {
  const db = dbManager.getDb();
  const { facultyId, isActive } = req.query;
  let sessions = db.attendanceSessions;
  if (facultyId) sessions = sessions.filter(s => s.facultyId === facultyId);
  if (isActive !== undefined) sessions = sessions.filter(s => s.isActive === (isActive === 'true'));
  res.json({ success: true, data: sessions });
});

// Faculty starts a new short-lived QR Attendance Session
app.post('/api/attendance/sessions/start', (req, res) => {
  const { subjectId, facultyId, facultyName, durationMinutes = 15, room = 'Lab 402', semester = 4, section = 'A' } = req.body;
  const db = dbManager.getDb();

  const subject = db.subjects.find(s => s.id === subjectId) || db.subjects[0];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString();
  const randomToken = `QR-${subject.code}-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newSession = {
    id: `sess_${Date.now()}`,
    subjectId: subject.id,
    subjectName: subject.name,
    facultyId: facultyId || 'fac_priya',
    facultyName: facultyName || 'Dr. Priya Sharma',
    date: now.toISOString().split('T')[0],
    startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: new Date(now.getTime() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    room,
    semester: Number(semester),
    section,
    qrToken: randomToken,
    qrExpiresAt: expiresAt,
    isActive: true,
    totalStudents: 50,
    presentCount: 1
  };

  db.attendanceSessions.unshift(newSession);

  // Add faculty audit log
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: now.toISOString(),
    userName: newSession.facultyName,
    userRole: 'faculty',
    action: 'STARTED_ATTENDANCE_QR_SESSION',
    resource: `${subject.code} (${room}) - Token: ${randomToken}`,
    ipAddress: '192.168.1.104',
    status: 'Success'
  });

  dbManager.persist();
  res.json({ success: true, data: newSession });
});

// Faculty ends an attendance session
app.post('/api/attendance/sessions/:id/stop', (req, res) => {
  const db = dbManager.getDb();
  const session = db.attendanceSessions.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  session.isActive = false;
  dbManager.persist();
  res.json({ success: true, data: session });
});

// Student scans QR Code
app.post('/api/attendance/scan-qr', (req, res) => {
  const { qrToken, studentId } = req.body;
  const db = dbManager.getDb();

  if (!qrToken) {
    return res.status(400).json({ success: false, error: 'QR Token is required' });
  }

  const session = db.attendanceSessions.find(s => s.qrToken === qrToken);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Invalid or unknown attendance QR code.' });
  }

  if (!session.isActive) {
    return res.status(400).json({ success: false, error: 'This attendance session has already been closed by faculty.' });
  }

  const now = new Date();
  if (new Date(session.qrExpiresAt) < now) {
    return res.status(400).json({ success: false, error: 'QR Code has expired. Please ask faculty for a renewed QR.' });
  }

  const targetStudentId = studentId || 'std_ramesh';
  const student = db.users.find(u => u.id === targetStudentId);
  const studentName = student ? student.name : 'Ramesh Kumar';

  // Prevent duplicate scan
  const existingRecord = db.attendanceRecords.find(r => r.sessionId === session.id && r.studentId === targetStudentId);
  if (existingRecord) {
    return res.status(409).json({ success: false, error: 'Attendance already recorded for this session!', data: existingRecord });
  }

  // Record Attendance
  const newRecord = {
    id: `att_${Date.now()}`,
    sessionId: session.id,
    studentId: targetStudentId,
    studentName,
    subjectId: session.subjectId,
    subjectName: session.subjectName,
    date: session.date,
    status: 'Present' as const,
    checkInMethod: 'QR Scan' as const,
    timestamp: now.toISOString(),
    verified: true
  };

  db.attendanceRecords.unshift(newRecord);
  session.presentCount = (session.presentCount || 0) + 1;

  // Recalculate student attendance percentage
  if (student) {
    const studentRecords = db.attendanceRecords.filter(r => r.studentId === student.id);
    const presentTotal = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    student.attendancePercentage = Math.min(100, Math.round((presentTotal / Math.max(1, studentRecords.length)) * 100));
  }

  // Audit log
  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: now.toISOString(),
    userName: studentName,
    userRole: 'student',
    action: 'VERIFIED_QR_ATTENDANCE_CHECKIN',
    resource: `${session.subjectName} (${session.room})`,
    ipAddress: '192.168.4.88',
    status: 'Success'
  });

  dbManager.persist();
  res.json({ success: true, message: `Attendance marked successfully for ${session.subjectName}!`, data: newRecord, session });
});

// Attendance Records
app.get('/api/attendance/records', (req, res) => {
  const db = dbManager.getDb();
  const { studentId, subjectId, date } = req.query;
  let records = db.attendanceRecords;
  if (studentId) records = records.filter(r => r.studentId === studentId);
  if (subjectId) records = records.filter(r => r.subjectId === subjectId);
  if (date) records = records.filter(r => r.date === date);
  res.json({ success: true, data: records });
});

// Assignments
app.get('/api/assignments', (req, res) => {
  const db = dbManager.getDb();
  const { subjectId, studentId } = req.query;
  let assignments = db.assignments;
  if (subjectId) assignments = assignments.filter(a => a.subjectId === subjectId);

  // If studentId provided, attach student's personal submission status
  const targetStudentId = (studentId as string) || 'std_ramesh';
  const mapped = assignments.map(a => {
    const sub = db.submissions.find(s => s.assignmentId === a.id && s.studentId === targetStudentId);
    return {
      ...a,
      status: sub ? sub.status : a.status || 'Not Started',
      userSubmission: sub || null
    };
  });

  res.json({ success: true, data: mapped });
});

app.post('/api/assignments', (req, res) => {
  const db = dbManager.getDb();
  const newAssignment = {
    id: `assign_${Date.now()}`,
    submissionsCount: 0,
    evaluatedCount: 0,
    status: 'Not Started' as const,
    ...req.body
  };
  db.assignments.unshift(newAssignment);
  dbManager.persist();
  res.json({ success: true, data: newAssignment });
});

// Submissions
app.get('/api/submissions', (req, res) => {
  const db = dbManager.getDb();
  const { assignmentId, studentId } = req.query;
  let subs = db.submissions;
  if (assignmentId) subs = subs.filter(s => s.assignmentId === assignmentId);
  if (studentId) subs = subs.filter(s => s.studentId === studentId);
  res.json({ success: true, data: subs });
});

app.post('/api/submissions', (req, res) => {
  const { assignmentId, studentId, studentName, content, fileAttachment } = req.body;
  const db = dbManager.getDb();

  const assignment = db.assignments.find(a => a.id === assignmentId);
  if (!assignment) {
    return res.status(404).json({ success: false, error: 'Assignment not found' });
  }

  const existing = db.submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
  if (existing) {
    existing.content = content;
    existing.fileAttachment = fileAttachment || existing.fileAttachment;
    existing.submissionDate = new Date().toISOString();
    existing.status = 'Submitted';
    dbManager.persist();
    return res.json({ success: true, data: existing });
  }

  const newSub = {
    id: `subm_${Date.now()}`,
    assignmentId,
    studentId: studentId || 'std_ramesh',
    studentName: studentName || 'Ramesh Kumar',
    submissionDate: new Date().toISOString(),
    content,
    fileAttachment,
    status: 'Submitted' as const,
    maxMarks: assignment.maxMarks
  };

  db.submissions.unshift(newSub);
  assignment.submissionsCount = (assignment.submissionsCount || 0) + 1;
  dbManager.persist();
  res.json({ success: true, data: newSub });
});

app.put('/api/submissions/:id/evaluate', (req, res) => {
  const { marksObtained, feedback, evaluatedBy } = req.body;
  const db = dbManager.getDb();

  const sub = db.submissions.find(s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, error: 'Submission not found' });
  }

  sub.marksObtained = Number(marksObtained);
  sub.feedback = feedback;
  sub.evaluatedBy = evaluatedBy || 'Dr. Priya Sharma';
  sub.evaluatedAt = new Date().toISOString();
  sub.status = 'Evaluated';

  const assignment = db.assignments.find(a => a.id === sub.assignmentId);
  if (assignment) {
    assignment.evaluatedCount = (assignment.evaluatedCount || 0) + 1;
  }

  dbManager.persist();
  res.json({ success: true, data: sub });
});

// Assessments / Quizzes
app.get('/api/assessments', (req, res) => {
  const db = dbManager.getDb();
  const { subjectId } = req.query;
  let assessments = db.assessments;
  if (subjectId) assessments = assessments.filter(a => a.subjectId === subjectId);
  res.json({ success: true, data: assessments });
});

app.get('/api/assessments/:id', (req, res) => {
  const db = dbManager.getDb();
  const item = db.assessments.find(a => a.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Assessment not found' });
  }
  res.json({ success: true, data: item });
});

app.post('/api/assessments', (req, res) => {
  const db = dbManager.getDb();
  const newAssessment = {
    id: `assess_${Date.now()}`,
    isPublished: true,
    scheduledDate: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.assessments.unshift(newAssessment);
  dbManager.persist();
  res.json({ success: true, data: newAssessment });
});

// Student takes quiz & triggers Competency Gap -> Recommendation Live Loop!
app.post('/api/assessments/:id/attempt', (req, res) => {
  const { studentId, studentName, answers } = req.body;
  const db = dbManager.getDb();
  const assessment = db.assessments.find(a => a.id === req.params.id);

  if (!assessment) {
    return res.status(404).json({ success: false, error: 'Assessment not found' });
  }

  const targetStudentId = studentId || 'std_ramesh';
  const targetStudentName = studentName || 'Ramesh Kumar';

  let totalScore = 0;
  const processedAnswers: any[] = [];
  const identifiedGaps: string[] = [];

  assessment.questions.forEach((q, idx) => {
    const userAns = answers.find((a: any) => a.questionId === q.id) || answers[idx];
    const selectedOpt = userAns ? userAns.selectedOption : undefined;
    const isCorrect = selectedOpt === q.correctOptionIndex;
    const marks = isCorrect ? q.marks : 0;
    totalScore += marks;

    if (!isCorrect && q.competencyTag) {
      if (!identifiedGaps.includes(q.competencyTag)) {
        identifiedGaps.push(q.competencyTag);
      }
    }

    processedAnswers.push({
      questionId: q.id,
      selectedOption: selectedOpt,
      isCorrect,
      marksAwarded: marks
    });
  });

  const percentage = Math.round((totalScore / Math.max(1, assessment.totalMarks)) * 100);
  const passed = percentage >= ((assessment.passingMarks / assessment.totalMarks) * 100);

  const attempt: any = {
    id: `attempt_${Date.now()}`,
    assessmentId: assessment.id,
    assessmentTitle: assessment.title,
    subjectName: assessment.subjectName,
    studentId: targetStudentId,
    studentName: targetStudentName,
    startedAt: new Date(Date.now() - assessment.durationMinutes * 60 * 1000).toISOString(),
    completedAt: new Date().toISOString(),
    score: totalScore,
    totalMarks: assessment.totalMarks,
    percentage,
    passed,
    answers: processedAnswers,
    competencyGapsIdentified: identifiedGaps
  };

  db.assessmentAttempts.unshift(attempt);

  // Update Student Competencies based on this attempt
  const studentCompetencies = db.competencies[targetStudentId] || [];
  assessment.competencyTags.forEach(tag => {
    let comp = studentCompetencies.find(c => c.name.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(c.name.toLowerCase()));
    if (comp) {
      const newScore = passed ? Math.min(100, Math.round(comp.currentLevel * 0.7 + percentage * 0.3)) : Math.max(30, Math.round(comp.currentLevel * 0.7 + percentage * 0.3));
      comp.currentLevel = newScore;
      comp.status = newScore >= 80 ? 'Strong' : newScore >= 60 ? 'Developing' : 'Needs Practice';
      comp.history.push({
        date: new Date().toISOString().split('T')[0],
        score: percentage,
        activityTitle: `${assessment.title} (${percentage}%)`
      });
    }
  });

  // If Gaps Identified, create a new Smart Recommendation for the student's next Free Period!
  if (identifiedGaps.length > 0 || percentage < 70) {
    const gapName = identifiedGaps[0] || assessment.competencyTags[0] || 'Core Subject Mechanics';
    const newRec = {
      id: `rec_gap_${Date.now()}`,
      studentId: targetStudentId,
      title: `Micro-Learning Review: ${gapName} Mastery`,
      description: `Targeted interactive drill to clarify concepts missed in "${assessment.title}" (Score: ${percentage}%).`,
      type: 'Micro-Learning' as const,
      subjectId: assessment.subjectId,
      subjectName: assessment.subjectName,
      competencyTag: gapName,
      durationMinutes: 10,
      reason: `Triggered by recent quiz score (${percentage}% in ${assessment.title}). Closes identified gap in ${gapName}.`,
      urgency: 'High' as const,
      isCompleted: false,
      freeSlotTime: 'Today 2:15 PM - 3:15 PM (Free Period in Innovation Lounge)',
      sourceGap: `Assessment Score (${percentage}%) in ${assessment.title}`
    };
    db.recommendations.unshift(newRec);

    // Also notify student
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: targetStudentId,
      title: `Competency Gap Action: ${gapName}`,
      message: `Quiz completed with ${percentage}%. A 10-minute micro-learning task has been scheduled for your 2:15 PM free period.`,
      type: 'academic',
      timestamp: 'Just now',
      isRead: false,
      actionLink: '/recommendations'
    });
  }

  dbManager.persist();
  res.json({ success: true, message: 'Assessment attempt scored successfully!', data: attempt });
});

app.get('/api/assessment-attempts', (req, res) => {
  const db = dbManager.getDb();
  const { studentId, assessmentId } = req.query;
  let attempts = db.assessmentAttempts;
  if (studentId) attempts = attempts.filter(a => a.studentId === studentId);
  if (assessmentId) attempts = attempts.filter(a => a.assessmentId === assessmentId);
  res.json({ success: true, data: attempts });
});

// Competencies & Smart Recommendations
app.get('/api/competencies/:studentId', (req, res) => {
  const db = dbManager.getDb();
  const list = db.competencies[req.params.studentId] || db.competencies['std_ramesh'] || [];
  res.json({ success: true, data: list });
});

app.get('/api/recommendations/:studentId', (req, res) => {
  const db = dbManager.getDb();
  const list = db.recommendations.filter(r => r.studentId === req.params.studentId || r.studentId === 'std_ramesh');
  res.json({ success: true, data: list });
});

// Student completes a recommended micro-learning activity (Live Loop Closure!)
app.post('/api/recommendations/:id/complete', (req, res) => {
  const db = dbManager.getDb();
  const rec = db.recommendations.find(r => r.id === req.params.id);
  if (!rec) {
    return res.status(404).json({ success: false, error: 'Recommendation not found' });
  }

  rec.isCompleted = true;

  // Boost relevant competency!
  const studentCompetencies = db.competencies[rec.studentId] || db.competencies['std_ramesh'] || [];
  const comp = studentCompetencies.find(c => c.name.toLowerCase().includes(rec.competencyTag.toLowerCase()) || rec.competencyTag.toLowerCase().includes(c.name.toLowerCase()));
  if (comp) {
    comp.currentLevel = Math.min(98, comp.currentLevel + 12);
    comp.status = comp.currentLevel >= 80 ? 'Strong' : comp.currentLevel >= 60 ? 'Developing' : 'Needs Practice';
    comp.history.push({
      date: new Date().toISOString().split('T')[0],
      score: comp.currentLevel,
      activityTitle: `Completed Micro-Learning: ${rec.title}`
    });
  }

  dbManager.persist();
  res.json({ success: true, message: `Completed ${rec.title}! Competency upgraded to ${comp ? comp.currentLevel : 85}%.`, data: rec, competency: comp });
});

// Learning Resources
app.get('/api/resources', (req, res) => {
  const db = dbManager.getDb();
  const { subjectId, type, query } = req.query;
  let list = db.resources;
  if (subjectId) list = list.filter(r => r.subjectId === subjectId);
  if (type) list = list.filter(r => r.type === type);
  if (query) {
    const q = (query as string).toLowerCase();
    list = list.filter(r => r.title.toLowerCase().includes(q) || r.topicTitle.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q)));
  }
  res.json({ success: true, data: list });
});

app.post('/api/resources/:id/bookmark', (req, res) => {
  const db = dbManager.getDb();
  const item = db.resources.find(r => r.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Resource not found' });
  }
  item.isBookmarked = !item.isBookmarked;
  dbManager.persist();
  res.json({ success: true, data: item });
});

// Events & Announcements
app.get('/api/events', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.events });
});

app.post('/api/events/:id/register', (req, res) => {
  const db = dbManager.getDb();
  const evt = db.events.find(e => e.id === req.params.id);
  if (!evt) return res.status(404).json({ success: false, error: 'Event not found' });
  evt.isRegistered = !evt.isRegistered;
  dbManager.persist();
  res.json({ success: true, data: evt });
});

app.get('/api/announcements', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.announcements });
});

app.post('/api/announcements', (req, res) => {
  const db = dbManager.getDb();
  const newAnn = {
    id: `ann_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.announcements.unshift(newAnn);
  dbManager.persist();
  res.json({ success: true, data: newAnn });
});

// Notifications
app.get('/api/notifications/:userId', (req, res) => {
  const db = dbManager.getDb();
  const list = db.notifications.filter(n => n.userId === req.params.userId || n.userId === 'std_ramesh');
  res.json({ success: true, data: list });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const db = dbManager.getDb();
  const item = db.notifications.find(n => n.id === req.params.id);
  if (item) item.isRead = true;
  dbManager.persist();
  res.json({ success: true, data: item });
});

app.put('/api/notifications/read-all/:userId', (req, res) => {
  const db = dbManager.getDb();
  db.notifications.forEach(n => {
    if (n.userId === req.params.userId || n.userId === 'std_ramesh') {
      n.isRead = true;
    }
  });
  dbManager.persist();
  res.json({ success: true, message: 'All notifications marked as read' });
});

// Institutions (Multi-Tenancy)
app.get('/api/institutions', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.institutions || [] });
});

app.get('/api/institutions/:id', (req, res) => {
  const db = dbManager.getDb();
  const inst = (db.institutions || []).find(i => i.id === req.params.id);
  if (!inst) return res.status(404).json({ success: false, error: 'Institution not found' });
  res.json({ success: true, data: inst });
});

app.put('/api/institutions/:id', (req, res) => {
  const db = dbManager.getDb();
  const idx = (db.institutions || []).findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Institution not found' });
  db.institutions[idx] = { ...db.institutions[idx], ...req.body };
  dbManager.persist();
  res.json({ success: true, data: db.institutions[idx] });
});

// AI Services & Human-in-the-Loop Approval Desk
app.get('/api/ai/generation-logs', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.aiGenerationLogs || [] });
});

app.post('/api/ai/quiz-generate', async (req, res) => {
  try {
    const { topic, subjectName, difficulty = 'Intermediate', questionCount = 4, syllabusNotes, facultyId, facultyName } = req.body;
    if (!topic || !subjectName) {
      return res.status(400).json({ success: false, error: 'Topic and subject name are required' });
    }
    const result = await generateAiQuiz({ topic, subjectName, difficulty, questionCount, syllabusNotes });
    const db = dbManager.getDb();

    // Log this generation in the AI audit trail
    const newLog = {
      id: `gen_log_${Date.now()}`,
      institutionId: 'inst_sit_01',
      timestamp: new Date().toISOString(),
      facultyId: facultyId || 'fac_priya',
      facultyName: facultyName || 'Dr. Priya Sharma',
      topic,
      subjectName,
      model: 'gemini-3.7-flash',
      prompt: `Generate ${questionCount} MCQs for ${topic} in ${subjectName} (${difficulty})`,
      generatedQuestionsCount: result.questions.length,
      status: 'draft' as const
    };

    if (!db.aiGenerationLogs) db.aiGenerationLogs = [];
    db.aiGenerationLogs.unshift(newLog);

    // Audit log
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: facultyName || 'Dr. Priya Sharma',
      userRole: 'faculty',
      action: 'AI_QUIZ_GENERATED_DRAFT',
      resource: `${topic} (${subjectName}) - ${result.questions.length} questions`,
      ipAddress: '192.168.1.104',
      status: 'Success'
    });

    dbManager.persist();
    res.json({ success: true, data: result, log: newLog });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI Quiz generation failed' });
  }
});

app.post('/api/ai/generation-logs/:id/review', (req, res) => {
  const { status, reviewerName, publishAssessmentData } = req.body; // status: 'approved' | 'rejected'
  const db = dbManager.getDb();

  if (!db.aiGenerationLogs) db.aiGenerationLogs = [];
  const log = db.aiGenerationLogs.find(l => l.id === req.params.id);
  if (!log) {
    return res.status(404).json({ success: false, error: 'Generation log not found' });
  }

  log.status = status;
  log.reviewedBy = reviewerName || 'Dr. Priya Sharma';
  log.reviewedAt = new Date().toISOString();

  let createdAssessment = null;
  if (status === 'approved' && publishAssessmentData) {
    createdAssessment = {
      id: `assess_${Date.now()}`,
      subjectId: publishAssessmentData.subjectId || 'sub_iot',
      subjectName: publishAssessmentData.subjectName || log.subjectName,
      facultyId: log.facultyId,
      facultyName: log.facultyName,
      title: publishAssessmentData.title || `${log.topic} AI Assessment`,
      type: 'MCQ / Quiz' as const,
      durationMinutes: publishAssessmentData.durationMinutes || 20,
      totalMarks: (publishAssessmentData.questions || []).reduce((acc: number, q: any) => acc + (q.marks || 5), 0),
      passingMarks: Math.round(((publishAssessmentData.questions || []).length * 5) * 0.6),
      semester: 4,
      isPublished: true,
      scheduledDate: new Date().toISOString().split('T')[0],
      competencyTags: [log.topic],
      questions: publishAssessmentData.questions.map((q: any, i: number) => ({
        id: `q_ai_${Date.now()}_${i}`,
        assessmentId: `assess_${Date.now()}`,
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        marks: q.marks || 5,
        competencyTag: q.competencyTag || log.topic
      }))
    };

    db.assessments.unshift(createdAssessment);
    log.assessmentId = createdAssessment.id;

    // Notify students of new assessment
    db.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: 'std_ramesh',
      title: 'New AI Assessment Published',
      message: `${log.facultyName} published "${createdAssessment.title}". Take the quiz to test your competencies.`,
      type: 'academic',
      timestamp: 'Just now',
      isRead: false,
      actionLink: '/assessments'
    });
  }

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userName: log.reviewedBy,
    userRole: 'faculty',
    action: status === 'approved' ? 'APPROVED_AI_QUIZ_ASSESSMENT' : 'REJECTED_AI_QUIZ_DRAFT',
    resource: `${log.topic} (${log.subjectName})`,
    ipAddress: '192.168.1.104',
    status: 'Success'
  });

  dbManager.persist();
  res.json({ success: true, data: log, assessment: createdAssessment });
});

app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { role = 'student', userName = 'Ramesh Kumar', userContext = '', message, chatHistory = [] } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }
    const reply = await askAiAssistant({ role, userName, userContext, message, chatHistory });
    res.json({ success: true, data: { reply } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'AI Assistant service error' });
  }
});

// Reports & Institutional Export Center
app.get('/api/reports', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.reports || [] });
});

app.post('/api/reports/generate', (req, res) => {
  const { type, title, generatedBy } = req.body;
  const db = dbManager.getDb();
  if (!db.reports) db.reports = [];

  const now = new Date();
  let rowCount = 50;
  let summary = 'Report generated successfully.';

  if (type === 'attendance_defaulters') {
    const defaulters = db.users.filter(u => u.role === 'student' && (u.attendancePercentage || 0) < 75);
    rowCount = defaulters.length;
    summary = `Identified ${rowCount} students below 75% minimum threshold requiring mentor intervention.`;
  } else if (type === 'competency_matrix') {
    rowCount = db.users.filter(u => u.role === 'student').length;
    summary = `Cohort competency analysis across 6 subjects. Average mastery level: 84%.`;
  } else if (type === 'audit_trail') {
    rowCount = db.auditLogs.length;
    summary = `Immutable system security and access audit log containing ${rowCount} verified actions.`;
  }

  const newReport = {
    id: `rep_${Date.now()}`,
    institutionId: 'inst_sit_01',
    title: title || `${type.replace(/_/g, ' ').toUpperCase()} Report`,
    type,
    generatedAt: now.toISOString(),
    generatedBy: generatedBy || 'Administrator',
    rowCount,
    fileFormat: 'csv' as const,
    summary
  };

  db.reports.unshift(newReport);
  dbManager.persist();
  res.json({ success: true, data: newReport });
});

// Stream downloadable CSV formatted reports
app.get('/api/reports/export/:type', (req, res) => {
  const { type } = req.params;
  const db = dbManager.getDb();
  const now = new Date().toISOString().split('T')[0];

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="smartcampus_${type}_${now}.csv"`);

  if (type === 'attendance_defaulters') {
    let csv = 'Roll No,Student Name,Email,Department,Semester,Section,Attendance %,Status,Action Required\n';
    const students = db.users.filter(u => u.role === 'student');
    students.forEach(s => {
      const att = s.attendancePercentage || 85;
      const isDefaulter = att < 75;
      csv += `"${s.studentId || 'N/A'}","${s.name}","${s.email}","CSE","4","${s.section || 'A'}","${att}%","${isDefaulter ? 'DEFAULTER (<75%)' : 'Eligible'}","${isDefaulter ? 'Mandatory Mentor Counseling' : 'None'}"\n`;
    });
    return res.send(csv);
  }

  if (type === 'competency_matrix') {
    let csv = 'Roll No,Student Name,IoT Sensors,Embedded Systems,DBMS SQL,Networks,OOP Patterns,FreeRTOS Interrupts,Overall Status\n';
    const students = db.users.filter(u => u.role === 'student').slice(0, 50);
    students.forEach(s => {
      const comps = db.competencies[s.id] || db.competencies['std_ramesh'] || [];
      const iot = comps.find(c => c.name.includes('IoT'))?.currentLevel || 90;
      const emb = comps.find(c => c.name.includes('Microcontroller'))?.currentLevel || 72;
      const dbms = comps.find(c => c.name.includes('SQL'))?.currentLevel || 91;
      const net = comps.find(c => c.name.includes('Network'))?.currentLevel || 88;
      const oop = comps.find(c => c.name.includes('Object'))?.currentLevel || 70;
      const rtos = comps.find(c => c.name.includes('FreeRTOS'))?.currentLevel || 52;
      const avg = Math.round((iot + emb + dbms + net + oop + rtos) / 6);
      csv += `"${s.studentId || 'N/A'}","${s.name}",${iot}%,${emb}%,${dbms}%,${net}%,${oop}%,${rtos}%,"${avg >= 80 ? 'Mastery (Strong)' : avg >= 60 ? 'Developing' : 'Requires Remediation'}"\n`;
    });
    return res.send(csv);
  }

  if (type === 'academic_cie') {
    let csv = 'Roll No,Student Name,Assignments Submitted,Assignments Evaluated,Quizzes Attempted,Avg Quiz %,CGPA,Internal Evaluation Result\n';
    const students = db.users.filter(u => u.role === 'student').slice(0, 50);
    students.forEach(s => {
      const subs = db.submissions.filter(sub => sub.studentId === s.id);
      const evaluated = subs.filter(sub => sub.status === 'Evaluated');
      const attempts = db.assessmentAttempts.filter(att => att.studentId === s.id);
      const avgQuiz = attempts.length ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length) : 85;
      csv += `"${s.studentId || 'N/A'}","${s.name}",${subs.length || 2},${evaluated.length || 1},${attempts.length || 2},${avgQuiz}%,${s.cgpa || 8.4},"PASS (Satisfactory CIE)"\n`;
    });
    return res.send(csv);
  }

  // Default: Audit Trail
  let csv = 'Timestamp,User Name,Role,Action,Resource,IP Address,Status\n';
  db.auditLogs.forEach(l => {
    csv += `"${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.resource.replace(/"/g, '""')}","${l.ipAddress}","${l.status}"\n`;
  });
  return res.send(csv);
});

// Global Unified Search
app.get('/api/search', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  if (!query) {
    return res.json({ success: true, data: { subjects: [], assignments: [], resources: [], announcements: [], events: [] } });
  }
  const db = dbManager.getDb();

  const matchedSubjects = db.subjects.filter(s => s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
  const matchedAssignments = db.assignments.filter(a => a.title.toLowerCase().includes(query) || a.subjectName.toLowerCase().includes(query));
  const matchedResources = db.resources.filter(r => r.title.toLowerCase().includes(query) || r.topicTitle.toLowerCase().includes(query) || r.tags.some(t => t.toLowerCase().includes(query)));
  const matchedAnnouncements = db.announcements.filter(a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query));
  const matchedEvents = db.events.filter(e => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query));

  res.json({
    success: true,
    data: {
      subjects: matchedSubjects,
      assignments: matchedAssignments,
      resources: matchedResources,
      announcements: matchedAnnouncements,
      events: matchedEvents
    }
  });
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  const db = dbManager.getDb();
  res.json({ success: true, data: db.auditLogs.slice(0, 50) });
});

// ==========================================
// VITE MIDDLEWARE SETUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Smart College Student Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
