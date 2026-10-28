import React, { useState } from 'react';
import { ShieldCheck, GraduationCap, Lock, Mail, ArrowRight, Building2, UserCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import { User, UserRole, DEMO_USERS } from '../types/auth';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [email, setEmail] = useState('teacher@springmount.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_USERS.find(u => u.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword('••••••••••••');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const matched = DEMO_USERS.find(u => u.role === selectedRole) || DEMO_USERS[1];
      onLogin(matched);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="login-shell min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xs">
              SG
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">ScholarGrid</span>
              <span className="text-[10px] text-slate-400">Spring Mount Institutions · Learn 360</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">256-Bit Institutional Portal</span>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Role Selector & System Overview */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400">
                  Institutional Access
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                  School Portfolio & Registry Portal
                </h1>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Select your assigned role to access student records, enter observations, and export official dossiers.
                </p>
              </div>

              {/* Role Cards Selector */}
              <div className="space-y-2.5">
                {[
                  {
                    role: 'admin' as UserRole,
                    title: 'Admin Console',
                    subtitle: 'System Administration & Full Registry',
                    desc: 'Database backup, bulk Excel sync, user access & system configuration',
                    icon: ShieldCheck,
                    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                  },
                  {
                    role: 'teacher' as UserRole,
                    title: 'Teacher Portal',
                    subtitle: 'Classroom Educator & Homeroom Mentor',
                    desc: 'Score entries, STEAM/Gross Motor logs, SEL traits & student portfolios',
                    icon: GraduationCap,
                    badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                  },
                  {
                    role: 'management' as UserRole,
                    title: 'Management Portal',
                    subtitle: 'Head of School & Executive Board',
                    desc: 'Institutional analytics, student endorsements, principal seals & reports',
                    icon: Building2,
                    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedRole === item.role;

                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelect(item.role)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.badgeColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{item.title}</span>
                            <span className="text-[10px] text-slate-400">{item.subtitle}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Demo Help */}
            <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span className="text-slate-300 font-semibold">Active Session Scope: </span>
              {selectedRole === 'admin' && 'Central School Registry (All Grades & Administrative Privileges)'}
              {selectedRole === 'teacher' && 'Classroom Scope: Stage 3 A, Grade 10 A (Grading & Portfolios)'}
              {selectedRole === 'management' && 'Executive Scope: Principal Endorsements & School-wide KPIs'}
            </div>
          </div>

          {/* Right Column: Credentials Sign-In */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-slate-950">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold text-white">Sign In to Workspace</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Spring Mount Institutions Single Sign-On (SSO)
                  </p>
                </div>

                <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase border border-slate-700 bg-slate-900 text-slate-300">
                  Role: {selectedRole}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@springmount.edu"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Security Passcode / Password
                    </label>
                    <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                      Forgot credentials?
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                    />
                    <span>Remember this device</span>
                  </label>

                  <span className="text-[11px] text-slate-500">Session validity: 8 hours</span>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <span>{isLoading ? 'Authenticating...' : `Enter as ${selectedRole.toUpperCase()}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Fast 1-Click Role Switch Helper */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block mb-2.5">
                  Fast Demo Switching:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleSelect('admin');
                      onLogin(DEMO_USERS[0]);
                    }}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-amber-300 rounded-md border border-slate-800 transition-colors cursor-pointer text-center"
                  >
                    👑 Log in as Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleRoleSelect('teacher');
                      onLogin(DEMO_USERS[1]);
                    }}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-emerald-300 rounded-md border border-slate-800 transition-colors cursor-pointer text-center"
                  >
                    👩‍🏫 Log in as Teacher
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleRoleSelect('management');
                      onLogin(DEMO_USERS[2]);
                    }}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-purple-300 rounded-md border border-slate-800 transition-colors cursor-pointer text-center"
                  >
                    🏛️ Log in as Management
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span>Spring Mount Institutions & ThinkLink Learn 360</span>
              <span className="font-mono">v2.5 Enterprise Edition</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
        ScholarGrid School Management System · Authorized Personnel Only · All Actions Audited
      </footer>

    </div>
  );
};
