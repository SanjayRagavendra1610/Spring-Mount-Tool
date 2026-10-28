import React, { useState, useRef, useEffect } from 'react';
import { ViewMode } from '../types/student';
import { User, UserRole, DEMO_USERS } from '../types/auth';
import { Plus, LogOut, ChevronDown, ShieldCheck, GraduationCap, Building2, UserCheck, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenAddModal: () => void;
  onExportExcel: () => void;
  studentCount: number;
  currentUser: User;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  onOpenAddModal,
  onExportExcel,
  studentCount,
  currentUser,
  onLogout,
  onSwitchUser
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'teacher':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'management':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      default:
        return 'text-slate-800 bg-slate-100 border-slate-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />;
      case 'teacher': return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case 'management': return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <header className="print:hidden bg-white/95 border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('spreadsheet')}
              className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                SG
              </span>
              <span>ScholarGrid</span>
            </button>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline tabular-nums">
              · {studentCount} Records
            </span>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 overflow-x-auto py-2">
            <button
              onClick={() => onNavigate('spreadsheet')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'spreadsheet' ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              Spreadsheet Registry
            </button>

            <button
              onClick={() => onNavigate('portfolios')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'portfolios' || currentView === 'portfolio-detail' ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              Student Portfolios
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'analytics' ? 'text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              School Analytics
            </button>

            <button
              onClick={onExportExcel}
              className="hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-emerald-600 font-semibold"
            >
              Export Excel (.xlsx)
            </button>
          </nav>

          {/* Zone 3: User Role & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Primary Action Button (Role Aware) */}
            {currentUser.role !== 'management' ? (
              <button
                onClick={onOpenAddModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('portfolios')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-900 rounded-lg hover:bg-purple-800 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Principal Oversight</span>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <div className="text-left hidden md:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 leading-tight block">
                      {currentUser.name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase border ${getRoleBadgeStyle(currentUser.role)}`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                    {currentUser.title}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                  
                  {/* User Profile Header */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1">
                      {getRoleIcon(currentUser.role)}
                      <span className="font-bold text-slate-900">{currentUser.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser.email}</p>
                    <p className="text-[11px] text-slate-600 mt-1">{currentUser.department}</p>
                    {currentUser.assignedClasses && (
                      <p className="text-[10px] text-indigo-700 font-semibold mt-1">
                        Scope: {currentUser.assignedClasses.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Switch Role Fast Bar */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Switch Role Portal:
                    </span>
                    <div className="space-y-1">
                      {DEMO_USERS.map((demo) => {
                        const isCurrent = demo.role === currentUser.role;
                        return (
                          <button
                            key={demo.id}
                            onClick={() => {
                              onSwitchUser(demo);
                              setIsProfileOpen(false);
                            }}
                            className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-50 text-indigo-900 font-semibold'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {getRoleIcon(demo.role)}
                              <div>
                                <span className="block font-bold text-xs capitalize">{demo.role} Login</span>
                                <span className="text-[10px] text-slate-500">{demo.name}</span>
                              </div>
                            </div>
                            {isCurrent && <span className="text-[10px] text-indigo-600 font-bold">Active</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Logout Action */}
                  <div className="px-2 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-semibold cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Portal</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
