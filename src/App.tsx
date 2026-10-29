/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Student, ViewMode } from './types/student';
import { initialStudents } from './data/initialStudents';
import { User, UserRole, DEMO_USERS, ROLE_PERMISSIONS } from './types/auth';
import { HeaderNav } from './components/HeaderNav';
import { LoginView } from './components/LoginView';
import { SpreadsheetGrid } from './components/SpreadsheetGrid';
import { StoryBookPortfolio } from './components/StoryBookPortfolio';
import { PortfolioGallery } from './components/PortfolioGallery';
import { AnalyticsView } from './components/AnalyticsView';
import { ProductOverview } from './components/ProductOverview';
import { StudentFormModal } from './components/StudentFormModal';
import { exportRosterToExcel } from './utils/excelEngine';
import { collectPortfolioMediaReferences, loadPortfolioMediaUrls, MEDIA_REFERENCE_PREFIX } from './utils/mediaStore';
import { ShieldCheck, GraduationCap, Building2, Sparkles, CheckCircle2, UserCheck, Info } from 'lucide-react';

const STORAGE_KEY = 'scholargrid_students_records_v1';
const AUTH_KEY = 'scholargrid_auth_user_v1';

export default function App() {
  // Current Authenticated User (defaults to teacher or persisted user)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      }
    } catch (e) {
      console.error('Failed to read auth user:', e);
    }
    return DEMO_USERS[1]; // default to Teacher login for immediate access
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
    }
    return initialStudents;
  });

  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    let createdUrls: string[] = [];
    loadPortfolioMediaUrls(collectPortfolioMediaReferences(students))
      .then(urls => {
        createdUrls = Object.values(urls);
        if (active) setMediaUrls(urls);
        else createdUrls.forEach(url => URL.revokeObjectURL(url));
      })
      .catch(error => console.error('Failed to load portfolio images:', error));
    return () => {
      active = false;
      createdUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [students]);

  const resolveImage = (value?: string) => {
    if (!value) return '';
    return value.startsWith(MEDIA_REFERENCE_PREFIX) ? mediaUrls[value] || '' : value;
  };
  const displayStudents = useMemo(() => students.map(student => ({
    ...student,
    photoUrl: resolveImage(student.photoUrl),
    storybook: student.storybook ? {
      ...student.storybook,
      dreamCareer: { ...student.storybook.dreamCareer, illustrationUrl: resolveImage(student.storybook.dreamCareer?.illustrationUrl) },
      familyPhotoUrl: resolveImage(student.storybook.familyPhotoUrl),
      grossMotorActivityPhotoUrl: resolveImage(student.storybook.grossMotorActivityPhotoUrl),
      artworkPhotoUrl: resolveImage(student.storybook.artworkPhotoUrl),
      campusSketchUrl: resolveImage(student.storybook.campusSketchUrl),
      classMontagePhotoUrl: resolveImage(student.storybook.classMontagePhotoUrl),
      educatorPhotoUrl: resolveImage(student.storybook.educatorPhotoUrl),
    } : undefined,
  })), [students, mediaUrls]);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const displaySelectedStudent = selectedStudent
    ? displayStudents.find(student => student.id === selectedStudent.id) || selectedStudent
    : null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [students]);

  // Sync auth user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth:', e);
    }
  }, [currentUser]);

  // Keep selectedStudent in sync if students list changes
  useEffect(() => {
    if (selectedStudent) {
      const found = students.find(s => s.id === selectedStudent.id);
      if (found) setSelectedStudent(found);
    }
  }, [students, selectedStudent]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setViewMode('spreadsheet');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
  };

  const handleSelectStudent = (candidate: Student) => {
    const student = students.find(item => item.id === candidate.id) || candidate;
    setSelectedStudent(student);
    setViewMode('portfolio-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (candidate: Student) => {
    setEditingStudent(students.find(item => item.id === candidate.id) || candidate);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (saved: Student) => {
    setStudents(prev => {
      const exists = prev.some(s => s.id === saved.id);
      if (exists) {
        return prev.map(s => (s.id === saved.id ? saved : s));
      }
      return [saved, ...prev];
    });
    if (selectedStudent?.id === saved.id) {
      setSelectedStudent(saved);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (currentUser?.role === 'teacher') {
      alert('Teacher accounts cannot delete central registry records. Please contact the System Administrator.');
      return;
    }
    setStudents(prev => prev.filter(s => s.id !== studentId));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
      setViewMode('spreadsheet');
    }
  };

  const handleUpdateStudentDirectly = (updated: Student) => {
    const original = students.find(student => student.id === updated.id);
    const safeUpdate = original ? { ...updated, photoUrl: original.photoUrl, storybook: original.storybook } : updated;
    setStudents(prev => prev.map(student => student.id === safeUpdate.id ? safeUpdate : student));
    if (selectedStudent?.id === safeUpdate.id) setSelectedStudent(safeUpdate);
  };

  const handleImportStudents = (newStudents: Student[]) => {
    const incoming = new Map(newStudents.map(student => [student.admissionNo.trim().toLowerCase(), student]));
    let updated = 0;
    let added = 0;
    const merged = students.map(existing => {
      const key = existing.admissionNo.trim().toLowerCase();
      const replacement = incoming.get(key);
      if (!replacement) return existing;
      incoming.delete(key);
      updated += 1;
      return { ...replacement, id: existing.id };
    });
    const appended = [...incoming.values()];
    added = appended.length;
    const nextStudents = [...merged, ...appended];
    setStudents(nextStudents);
    const firstAdmission = newStudents[0]?.admissionNo.trim().toLowerCase();
    const firstImported = nextStudents.find(student => student.admissionNo.trim().toLowerCase() === firstAdmission);
    if (firstImported) {
      setSelectedStudent(firstImported);
      setViewMode('portfolio-detail');
    }
    return { added, updated };
  };

  const handleResetSampleData = () => {
    if (currentUser?.role !== 'admin') {
      alert('Only System Administrators can reset the central school database.');
      return;
    }
    if (window.confirm('Reset student registry to sample school data? Any custom added rows will be restored.')) {
      setStudents(initialStudents);
      localStorage.removeItem(STORAGE_KEY);
      if (selectedStudent) {
        setSelectedStudent(initialStudents[0]);
      }
    }
  };

  const handleExportAllExcel = () => {
    exportRosterToExcel(students);
  };

  const handleExportSingleStudentExcel = (candidate: Student) => {
    const student = students.find(item => item.id === candidate.id) || candidate;
    exportRosterToExcel([student], `${student.fullName.replace(/\s+/g, '_')}_Portfolio`);
  };

  // If not logged in, render the Login View
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const permissions = ROLE_PERMISSIONS[currentUser.role];

  return (
    <div className={`app-shell min-h-screen flex flex-col font-sans text-slate-100 ${viewMode === 'home' ? 'app-shell-home' : ''}`}>
      <div className={viewMode === 'home' ? 'landing-panel' : ''}>
      
      {/* Top Bar Navigation */}
      <HeaderNav
        currentView={viewMode}
        onNavigate={(mode) => setViewMode(mode)}
        onOpenAddModal={handleOpenAddModal}
        onExportExcel={handleExportAllExcel}
        studentCount={students.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Institutional Role Context Strip */}
      <div className="print:hidden bg-[#111720] text-white border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              currentUser.role === 'admin' ? 'bg-amber-400 text-slate-950' :
              currentUser.role === 'teacher' ? 'bg-emerald-400 text-slate-950' :
              'bg-purple-400 text-slate-950'
            }`}>
              {currentUser.role} Portal Active
            </span>
            <span className="text-slate-300">
              Welcome, <strong>{currentUser.name}</strong> · <span className="text-slate-400">{currentUser.title}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="hidden md:inline">
              Assigned Scope: <strong className="text-slate-200">{currentUser.assignedClasses?.join(', ')}</strong>
            </span>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Quick switch:</span>
              <button
                onClick={() => handleSwitchUser(DEMO_USERS[0])}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${currentUser.role === 'admin' ? 'bg-slate-800 text-white font-bold' : 'hover:text-white'}`}
              >
                Admin
              </button>
              <button
                onClick={() => handleSwitchUser(DEMO_USERS[1])}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${currentUser.role === 'teacher' ? 'bg-slate-800 text-white font-bold' : 'hover:text-white'}`}
              >
                Teacher
              </button>
              <button
                onClick={() => handleSwitchUser(DEMO_USERS[2])}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${currentUser.role === 'management' ? 'bg-slate-800 text-white font-bold' : 'hover:text-white'}`}
              >
                Management
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${viewMode === 'portfolio-detail' ? 'storybook-print-view' : ''} ${viewMode === 'home' ? 'overview-main' : ''}`}>

        {viewMode === 'home' && (
          <ProductOverview
            students={displayStudents}
            onNavigate={setViewMode}
          />
        )}
        
        {/* VIEW 1: SPREADSHEET GRID (EXCEL VIEW) */}
        {viewMode === 'spreadsheet' && (
          <SpreadsheetGrid
            students={displayStudents}
            onSelectStudent={handleSelectStudent}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onDeleteStudent={handleDeleteStudent}
            onImportStudents={handleImportStudents}
            onResetSampleData={handleResetSampleData}
            onUpdateStudentDirectly={handleUpdateStudentDirectly}
          />
        )}

        {/* VIEW 2: PORTFOLIO GALLERY (CARDS VIEW) */}
        {viewMode === 'portfolios' && (
          <PortfolioGallery
            students={displayStudents}
            onSelectStudent={handleSelectStudent}
            onOpenAddModal={handleOpenAddModal}
            onExportAllExcel={handleExportAllExcel}
          />
        )}

        {/* VIEW 3: SINGLE STUDENT PORTFOLIO */}
        {viewMode === 'portfolio-detail' && selectedStudent && (
          <div className="space-y-4">
            <div className="print:hidden bg-white border border-slate-200 p-3 rounded-xl flex flex-wrap items-center gap-3 text-xs shadow-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wide">Portfolio Format:</span>
              <strong className="text-slate-700">12-page StoryBook of Learning · Spring Mount PPT model</strong>
            </div>

            <StoryBookPortfolio
              student={displaySelectedStudent || selectedStudent}
              allStudents={displayStudents}
              onSelectStudent={setSelectedStudent}
              onBack={() => setViewMode('spreadsheet')}
              onEditStudent={handleOpenEditModal}
              onExportStudentExcel={handleExportSingleStudentExcel}
            />
          </div>
        )}

        {/* VIEW 4: SCHOOL ANALYTICS */}
        {viewMode === 'analytics' && (
          <AnalyticsView
            students={displayStudents}
            onSelectStudent={handleSelectStudent}
          />
        )}

      </main>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={isModalOpen}
        initialStudent={editingStudent}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
      />
    </div>
  );
}
