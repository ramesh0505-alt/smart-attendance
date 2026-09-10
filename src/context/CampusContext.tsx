import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Institution,
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
  ReportType,
  SystemStats
} from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'loop';
}

interface CampusContextType {
  institutions: Institution[];
  currentInstitution: Institution | null;
  setCurrentInstitution: (inst: Institution) => void;
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
  competencies: Competency[];
  recommendations: Recommendation[];
  resources: LearningResource[];
  events: CampusEvent[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  aiGenerationLogs: AiGenerationLog[];
  reports: ReportExport[];
  stats: SystemStats | null;
  isLoading: boolean;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  
  // Action Handlers
  scanQRCode: (token: string) => Promise<{ success: boolean; message: string }>;
  startAttendanceSession: (data: Partial<AttendanceSession>) => Promise<AttendanceSession | null>;
  stopAttendanceSession: (sessionId: string) => Promise<boolean>;
  submitAssignment: (assignmentId: string, content: string, fileAttachment?: string) => Promise<boolean>;
  evaluateSubmission: (submissionId: string, marksObtained: number, feedback: string) => Promise<boolean>;
  attemptAssessment: (assessmentId: string, answers: { questionId: string; selectedOption?: number }[]) => Promise<AssessmentAttempt | null>;
  completeRecommendation: (recommendationId: string) => Promise<boolean>;
  toggleResourceBookmark: (resourceId: string) => Promise<boolean>;
  toggleEventRegistration: (eventId: string) => Promise<boolean>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  updateCurriculumUnitStatus: (unitId: string, status: CurriculumUnit['status']) => Promise<void>;
  updateCurriculumTopicStatus: (topicId: string, status: CurriculumUnit['status']) => Promise<void>;
  createAnnouncement: (data: Partial<Announcement>) => Promise<boolean>;
  createAssignment: (data: Partial<Assignment>) => Promise<boolean>;
  createAssessment: (data: Partial<Assessment>) => Promise<boolean>;
  reviewAiGenerationLog: (logId: string, status: 'approved' | 'rejected', publishAssessmentData?: any) => Promise<boolean>;
  generateReport: (type: ReportType, title?: string) => Promise<ReportExport | null>;
  downloadReportCsv: (type: ReportType) => void;
  resetDatabase: () => Promise<void>;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumUnit[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentAttempts, setAssessmentAttempts] = useState<AssessmentAttempt[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [aiGenerationLogs, setAiGenerationLogs] = useState<AiGenerationLog[]>([]);
  const [reports, setReports] = useState<ReportExport[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const studentId = currentUser?.id || 'std_ramesh';
      const [
        instsRes,
        deptsRes,
        coursesRes,
        subjRes,
        currRes,
        ttRes,
        sessRes,
        attRecRes,
        assignRes,
        submRes,
        assessRes,
        attemptsRes,
        compRes,
        recRes,
        resRes,
        evtRes,
        annRes,
        notifRes,
        auditRes,
        aiLogsRes,
        reportsRes,
        statsRes
      ] = await Promise.all([
        fetch('/api/institutions').then(r => r.json()),
        fetch('/api/departments').then(r => r.json()),
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/subjects').then(r => r.json()),
        fetch('/api/curriculum').then(r => r.json()),
        fetch('/api/timetable').then(r => r.json()),
        fetch('/api/attendance/sessions').then(r => r.json()),
        fetch(`/api/attendance/records?studentId=${studentId}`).then(r => r.json()),
        fetch(`/api/assignments?studentId=${studentId}`).then(r => r.json()),
        fetch('/api/submissions').then(r => r.json()),
        fetch('/api/assessments').then(r => r.json()),
        fetch(`/api/assessment-attempts?studentId=${studentId}`).then(r => r.json()),
        fetch(`/api/competencies/${studentId}`).then(r => r.json()),
        fetch(`/api/recommendations/${studentId}`).then(r => r.json()),
        fetch('/api/resources').then(r => r.json()),
        fetch('/api/events').then(r => r.json()),
        fetch('/api/announcements').then(r => r.json()),
        fetch(`/api/notifications/${studentId}`).then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/ai/generation-logs').then(r => r.json()),
        fetch('/api/reports').then(r => r.json()),
        fetch('/api/stats').then(r => r.json())
      ]);

      if (instsRes.success) {
        setInstitutions(instsRes.data);
        if (!currentInstitution && instsRes.data.length > 0) {
          setCurrentInstitution(instsRes.data[0]);
        }
      }
      if (deptsRes.success) setDepartments(deptsRes.data);
      if (coursesRes.success) setCourses(coursesRes.data);
      if (subjRes.success) setSubjects(subjRes.data);
      if (currRes.success) setCurriculum(currRes.data);
      if (ttRes.success) setTimetable(ttRes.data);
      if (sessRes.success) setAttendanceSessions(sessRes.data);
      if (attRecRes.success) setAttendanceRecords(attRecRes.data);
      if (assignRes.success) setAssignments(assignRes.data);
      if (submRes.success) setSubmissions(submRes.data);
      if (assessRes.success) setAssessments(assessRes.data);
      if (attemptsRes.success) setAssessmentAttempts(attemptsRes.data);
      if (compRes.success) setCompetencies(compRes.data);
      if (recRes.success) setRecommendations(recRes.data);
      if (resRes.success) setResources(resRes.data);
      if (evtRes.success) setEvents(evtRes.data);
      if (annRes.success) setAnnouncements(annRes.data);
      if (notifRes.success) setNotifications(notifRes.data);
      if (auditRes.success) setAuditLogs(auditRes.data);
      if (aiLogsRes.success) setAiGenerationLogs(aiLogsRes.data);
      if (reportsRes.success) setReports(reportsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (e) {
      console.error('Error fetching campus data:', e);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id, currentInstitution]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Scan QR Code
  const scanQRCode = async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/attendance/scan-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrToken: token.trim(),
          studentId: currentUser?.id || 'std_ramesh'
        })
      });
      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        showToast('Attendance Verified!', data.message || 'Check-in recorded with valid QR signature.', 'success');
        await refreshData();
        return { success: true, message: data.message };
      } else {
        showToast('Check-in Failed', data.error || 'Invalid or expired QR code.', 'error');
        return { success: false, message: data.error };
      }
    } catch (e: any) {
      showToast('Error', e.message || 'QR Verification failed.', 'error');
      return { success: false, message: e.message };
    }
  };

  // Start Attendance Session (Faculty)
  const startAttendanceSession = async (data: Partial<AttendanceSession>): Promise<AttendanceSession | null> => {
    try {
      const res = await fetch('/api/attendance/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          facultyId: currentUser?.id || 'fac_priya',
          facultyName: currentUser?.name || 'Dr. Priya Sharma'
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Session Active', `Generated dynamic QR token for ${json.data.subjectName}.`, 'success');
        await refreshData();
        return json.data;
      }
      return null;
    } catch (e) {
      showToast('Error', 'Could not start attendance session.', 'error');
      return null;
    }
  };

  // Stop Attendance Session
  const stopAttendanceSession = async (sessionId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/attendance/sessions/${sessionId}/stop`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast('Session Closed', 'Attendance session finalized and archived.', 'info');
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Submit Assignment (Student)
  const submitAssignment = async (assignmentId: string, content: string, fileAttachment?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          studentId: currentUser?.id || 'std_ramesh',
          studentName: currentUser?.name || 'Ramesh Kumar',
          content,
          fileAttachment
        })
      });
      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        showToast('Assignment Submitted', 'Your submission was logged and sent to faculty for evaluation.', 'success');
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      showToast('Error', 'Submission failed.', 'error');
      return false;
    }
  };

  // Evaluate Submission (Faculty)
  const evaluateSubmission = async (submissionId: string, marksObtained: number, feedback: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/submissions/${submissionId}/evaluate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marksObtained,
          feedback,
          evaluatedBy: currentUser?.name || 'Dr. Priya Sharma'
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Graded Successfully', `Recorded mark of ${marksObtained} with student feedback.`, 'success');
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      showToast('Error', 'Evaluation save error.', 'error');
      return false;
    }
  };

  // Attempt Assessment / Quiz (Student - Triggers Competency Loop!)
  const attemptAssessment = async (assessmentId: string, answers: { questionId: string; selectedOption?: number }[]): Promise<AssessmentAttempt | null> => {
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser?.id || 'std_ramesh',
          studentName: currentUser?.name || 'Ramesh Kumar',
          answers
        })
      });
      const json = await res.json();
      if (json.success) {
        const attempt = json.data as AssessmentAttempt;
        if (attempt.passed) {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
        }

        if (attempt.competencyGapsIdentified && attempt.competencyGapsIdentified.length > 0) {
          showToast(
            '🔄 Live Loop: Competency Gap Detected',
            `Score: ${attempt.percentage}%. Gap in "${attempt.competencyGapsIdentified[0]}". Micro-learning task scheduled for your next free period!`,
            'loop'
          );
        } else {
          showToast('Quiz Completed', `Scored ${attempt.score}/${attempt.totalMarks} (${attempt.percentage}%). Competencies updated!`, 'success');
        }

        await refreshData();
        return attempt;
      }
      return null;
    } catch (e) {
      showToast('Error', 'Failed to score assessment.', 'error');
      return null;
    }
  };

  // Complete Recommendation (Student - Live Loop closure)
  const completeRecommendation = async (recommendationId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/recommendations/${recommendationId}/complete`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        showToast(
          '🎯 Competency Elevated!',
          json.message || 'Micro-learning activity completed. Progress and competency matrices updated.',
          'success'
        );
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      showToast('Error', 'Could not complete recommendation.', 'error');
      return false;
    }
  };

  // Toggle Bookmark
  const toggleResourceBookmark = async (resourceId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/resources/${resourceId}/bookmark`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Toggle Event Registration
  const toggleEventRegistration = async (eventId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(
          json.data.isRegistered ? 'Registered for Event' : 'Registration Cancelled',
          json.data.title,
          'info'
        );
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Mark notification read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch(`/api/notifications/read-all/${currentUser?.id || 'std_ramesh'}`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('Notifications Cleared', 'All notifications marked as read.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // Curriculum Status updates
  const updateCurriculumUnitStatus = async (unitId: string, status: CurriculumUnit['status']) => {
    try {
      const res = await fetch(`/api/curriculum/units/${unitId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Curriculum Updated', `Unit status marked as ${status}.`, 'info');
        await refreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCurriculumTopicStatus = async (topicId: string, status: CurriculumUnit['status']) => {
    try {
      const res = await fetch(`/api/curriculum/topics/${topicId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Curriculum Updated', `Topic status set to ${status}.`, 'info');
        await refreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createAnnouncement = async (data: Partial<Announcement>): Promise<boolean> => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          authorName: currentUser?.name || 'Administrator',
          authorRole: currentUser?.role || 'admin',
          authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Announcement Published', json.data.title, 'success');
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const createAssignment = async (data: Partial<Assignment>): Promise<boolean> => {
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          facultyId: currentUser?.id || 'fac_priya',
          facultyName: currentUser?.name || 'Dr. Priya Sharma'
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Assignment Created', json.data.title, 'success');
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const createAssessment = async (data: Partial<Assessment>): Promise<boolean> => {
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          facultyId: currentUser?.id || 'fac_priya',
          facultyName: currentUser?.name || 'Dr. Priya Sharma'
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Assessment Published', json.data.title, 'success');
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const reviewAiGenerationLog = async (logId: string, status: 'approved' | 'rejected', publishAssessmentData?: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/ai/generation-logs/${logId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewerName: currentUser?.name || 'Dr. Priya Sharma',
          publishAssessmentData
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          status === 'approved' ? 'AI Quiz Approved & Published' : 'AI Draft Rejected',
          status === 'approved' ? 'Assessment is now live for student evaluations.' : 'Draft marked as rejected.',
          status === 'approved' ? 'success' : 'info'
        );
        await refreshData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const generateReport = async (type: ReportType, title?: string): Promise<ReportExport | null> => {
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          generatedBy: `${currentUser?.name || 'Administrator'} (${currentUser?.role?.toUpperCase() || 'ADMIN'})`
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Report Generated', json.data.title, 'success');
        await refreshData();
        return json.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const downloadReportCsv = (type: ReportType) => {
    const link = document.createElement('a');
    link.href = `/api/reports/export/${type}`;
    link.setAttribute('download', `smartcampus_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download Started', `Exporting ${type.replace(/_/g, ' ')} spreadsheet CSV.`, 'info');
  };

  const resetDatabase = async () => {
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast('System Reset', 'All campus databases restored to clean seed data.', 'info');
        await refreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CampusContext.Provider
      value={{
        institutions,
        currentInstitution,
        setCurrentInstitution,
        departments,
        courses,
        subjects,
        curriculum,
        timetable,
        attendanceSessions,
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
        reports,
        stats,
        isLoading,
        toasts,
        showToast,
        removeToast,
        refreshData,
        scanQRCode,
        startAttendanceSession,
        stopAttendanceSession,
        submitAssignment,
        evaluateSubmission,
        attemptAssessment,
        completeRecommendation,
        toggleResourceBookmark,
        toggleEventRegistration,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateCurriculumUnitStatus,
        updateCurriculumTopicStatus,
        createAnnouncement,
        createAssignment,
        createAssessment,
        reviewAiGenerationLog,
        generateReport,
        downloadReportCsv,
        resetDatabase
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) throw new Error('useCampus must be used within a CampusProvider');
  return context;
};
