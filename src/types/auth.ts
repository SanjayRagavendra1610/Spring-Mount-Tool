export type UserRole = 'admin' | 'teacher' | 'management';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  assignedClasses?: string[];
  avatarUrl: string;
}

export interface RolePermissions {
  canEditSchoolSettings: boolean;
  canDeleteStudents: boolean;
  canImportExcel: boolean;
  canExportExcel: boolean;
  canSignEndorsements: boolean;
  canEditScores: boolean;
  canViewExecutiveAnalytics: boolean;
  canManageUsers: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canEditSchoolSettings: true,
    canDeleteStudents: true,
    canImportExcel: true,
    canExportExcel: true,
    canSignEndorsements: true,
    canEditScores: true,
    canViewExecutiveAnalytics: true,
    canManageUsers: true
  },
  teacher: {
    canEditSchoolSettings: false,
    canDeleteStudents: false,
    canImportExcel: true,
    canExportExcel: true,
    canSignEndorsements: false,
    canEditScores: true,
    canViewExecutiveAnalytics: false,
    canManageUsers: false
  },
  management: {
    canEditSchoolSettings: true,
    canDeleteStudents: false,
    canImportExcel: false,
    canExportExcel: true,
    canSignEndorsements: true,
    canEditScores: false,
    canViewExecutiveAnalytics: true,
    canManageUsers: false
  }
};

export const DEMO_USERS: User[] = [
  {
    id: 'usr-admin-demo',
    name: 'Demo Administrator',
    email: 'admin@example.invalid',
    role: 'admin',
    title: 'System Administrator',
    department: 'Demo Environment',
    assignedClasses: ['All Demo Classes'],
    avatarUrl: '/demo-avatar.svg'
  },
  {
    id: 'usr-teacher-demo',
    name: 'Sample Teacher',
    email: 'teacher@example.invalid',
    role: 'teacher',
    title: 'Class Teacher',
    department: 'Demo Environment',
    assignedClasses: ['Grade 10 A'],
    avatarUrl: '/demo-avatar.svg'
  },
  {
    id: 'usr-management-demo',
    name: 'Demo Manager',
    email: 'management@example.invalid',
    role: 'management',
    title: 'School Manager',
    department: 'Demo Environment',
    assignedClasses: ['All Demo Classes'],
    avatarUrl: '/demo-avatar.svg'
  }
];
