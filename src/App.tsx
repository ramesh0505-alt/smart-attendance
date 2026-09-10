import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CampusProvider, useCampus } from './context/CampusContext.tsx';
import { Navbar } from './components/common/Navbar.tsx';
import { Sidebar } from './components/common/Sidebar.tsx';
import { CommandSearch } from './components/common/CommandSearch.tsx';
import { QRCodeModal } from './components/common/QRCodeModal.tsx';
import { QRScannerModal } from './components/common/QRScannerModal.tsx';
import { AiAssistantModal } from './components/common/AiAssistantModal.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard.tsx';
import { CurriculumExplorer } from './components/student/CurriculumExplorer.tsx';
import { StudentAttendance } from './components/student/StudentAttendance.tsx';
import { TimetableSchedule } from './components/student/TimetableSchedule.tsx';
import { AssignmentsHub } from './components/student/AssignmentsHub.tsx';
import { AssessmentTaker } from './components/student/AssessmentTaker.tsx';
import { CompetencyMatrix } from './components/student/CompetencyMatrix.tsx';
import { SmartRecommendations } from './components/student/SmartRecommendations.tsx';
import { LearningResources } from './components/student/LearningResources.tsx';
import { EventsAnnouncements } from './components/student/EventsAnnouncements.tsx';

// Faculty Components
import { FacultyDashboard } from './components/faculty/FacultyDashboard.tsx';
import { ClassRoster } from './components/faculty/ClassRoster.tsx';
import { FacultyAttendance } from './components/faculty/FacultyAttendance.tsx';
import { AssignmentEvaluator } from './components/faculty/AssignmentEvaluator.tsx';
import { AiQuizGeneratorModal } from './components/faculty/AiQuizGeneratorModal.tsx';

// Admin & Parent Components
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { ParentDashboard } from './components/parent/ParentDashboard.tsx';
import { ReportsCenter } from './components/reports/ReportsCenter.tsx';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { attendanceSessions } = useCampus();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isAiCoPilotOpen, setIsAiCoPilotOpen] = useState(false);
  const [isAiQuizModalOpen, setIsAiQuizModalOpen] = useState(false);

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset tab to dashboard on role change
  useEffect(() => {
    setActiveTab('dashboard');
  }, [currentUser?.role]);

  // Render view based on role and activeTab
  const renderMainContent = () => {
    if (!currentUser) return null;

    if (currentUser.role === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <StudentDashboard
              onNavigate={setActiveTab}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              onOpenAiCoPilot={() => setIsAiCoPilotOpen(true)}
            />
          );
        case 'curriculum':
          return (
            <CurriculumExplorer
              onNavigateToQuiz={() => setActiveTab('assessments')}
              onNavigateToResources={() => setActiveTab('resources')}
            />
          );
        case 'attendance':
          return <StudentAttendance onOpenQRScanner={() => setIsQRScannerOpen(true)} />;
        case 'timetable':
          return <TimetableSchedule onOpenQRScanner={() => setIsQRScannerOpen(true)} />;
        case 'assignments':
          return <AssignmentsHub />;
        case 'assessments':
          return (
            <AssessmentTaker
              onNavigateToRecommendations={() => setActiveTab('recommendations')}
            />
          );
        case 'competencies':
          return (
            <CompetencyMatrix
              onNavigateToRecommendations={() => setActiveTab('recommendations')}
            />
          );
        case 'recommendations':
          return <SmartRecommendations />;
        case 'resources':
          return <LearningResources />;
        case 'events':
          return <EventsAnnouncements />;
        case 'reports':
          return <ReportsCenter />;
        default:
          return (
            <StudentDashboard
              onNavigate={setActiveTab}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              onOpenAiCoPilot={() => setIsAiCoPilotOpen(true)}
            />
          );
      }
    }

    if (currentUser.role === 'faculty') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <FacultyDashboard
              onNavigate={setActiveTab}
              onOpenQRLauncher={() => setIsQRModalOpen(true)}
              onOpenAiQuizModal={() => setIsAiQuizModalOpen(true)}
              onOpenAiCoPilot={() => setIsAiCoPilotOpen(true)}
            />
          );
        case 'roster':
          return <ClassRoster />;
        case 'attendance':
          return <FacultyAttendance onOpenQRLauncher={() => setIsQRModalOpen(true)} />;
        case 'assignments':
          return <AssignmentEvaluator />;
        case 'curriculum':
          return (
            <CurriculumExplorer
              onNavigateToQuiz={() => setIsAiQuizModalOpen(true)}
              onNavigateToResources={() => setActiveTab('resources')}
            />
          );
        case 'resources':
          return <LearningResources />;
        case 'events':
          return <EventsAnnouncements />;
        case 'reports':
          return <ReportsCenter />;
        default:
          return (
            <FacultyDashboard
              onNavigate={setActiveTab}
              onOpenQRLauncher={() => setIsQRModalOpen(true)}
              onOpenAiQuizModal={() => setIsAiQuizModalOpen(true)}
              onOpenAiCoPilot={() => setIsAiCoPilotOpen(true)}
            />
          );
      }
    }

    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'roster':
          return <ClassRoster />;
        case 'curriculum':
          return (
            <CurriculumExplorer
              onNavigateToQuiz={() => setActiveTab('dashboard')}
              onNavigateToResources={() => setActiveTab('dashboard')}
            />
          );
        case 'events':
          return <EventsAnnouncements />;
        case 'reports':
          return <ReportsCenter />;
        default:
          return <AdminDashboard />;
      }
    }

    if (currentUser.role === 'parent') {
      switch (activeTab) {
        case 'dashboard':
          return <ParentDashboard />;
        case 'attendance':
          return <StudentAttendance onOpenQRScanner={() => {}} />;
        case 'assignments':
          return <AssignmentsHub />;
        case 'competencies':
          return <CompetencyMatrix onNavigateToRecommendations={() => setActiveTab('dashboard')} />;
        case 'events':
          return <EventsAnnouncements />;
        case 'reports':
          return <ReportsCenter />;
        default:
          return <ParentDashboard />;
      }
    }

    return null;
  };

  const activeFacultySession = attendanceSessions.find(s => s.isActive);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast feedback system */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        onOpenCommand={() => setIsCommandSearchOpen(true)}
        onOpenAiAssistant={() => setIsAiCoPilotOpen(true)}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        activeSession={activeFacultySession}
      />

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-3 sm:p-5 gap-5">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 min-w-0 transition-all duration-300">
          {renderMainContent()}
        </main>
      </div>

      {/* Command Palette Modal (Cmd+K) */}
      <CommandSearch
        isOpen={isCommandSearchOpen}
        onClose={() => setIsCommandSearchOpen(false)}
        onNavigate={tab => {
          setActiveTab(tab);
          setIsCommandSearchOpen(false);
        }}
      />

      {/* Faculty QR Projector Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* Student QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      {/* Academic Mentor AI Chat CoPilot */}
      <AiAssistantModal
        isOpen={isAiCoPilotOpen}
        onClose={() => setIsAiCoPilotOpen(false)}
      />

      {/* Faculty AI Quiz Builder */}
      <AiQuizGeneratorModal
        isOpen={isAiQuizModalOpen}
        onClose={() => setIsAiQuizModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CampusProvider>
        <AppContent />
      </CampusProvider>
    </AuthProvider>
  );
}
