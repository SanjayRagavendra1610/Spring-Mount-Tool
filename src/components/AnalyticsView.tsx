import React from 'react';
import { 
  GraduationCap, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Award, 
  Clock, 
  HeartHandshake,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Student } from '../types/student';

interface AnalyticsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ students, onSelectStudent }) => {
  // Aggregate Computations
  const totalStudents = students.length;

  const avgGpa = totalStudents > 0
    ? (students.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2)
    : '0.00';

  const avgPct = totalStudents > 0
    ? (students.reduce((acc, s) => acc + s.overallPercentage, 0) / totalStudents).toFixed(1)
    : '0.0';

  const avgAttendance = totalStudents > 0
    ? (students.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents).toFixed(1)
    : '0.0';

  const totalServiceHours = students.reduce((acc, s) => acc + s.communityServiceHours, 0);

  const totalMerits = students.reduce((acc, s) => acc + s.meritsCount, 0);
  const totalDemerits = students.reduce((acc, s) => acc + s.demeritsCount, 0);

  // Sports Distribution
  const sportsMap: Record<string, number> = {};
  students.forEach(s => {
    sportsMap[s.primarySport] = (sportsMap[s.primarySport] || 0) + 1;
  });
  const topSports = Object.entries(sportsMap).sort((a, b) => b[1] - a[1]);

  // House Breakdown
  const houseMap: Record<string, number> = { Titans: 0, Phoenix: 0, Spartans: 0, Centaur: 0 };
  students.forEach(s => {
    houseMap[s.house] = (houseMap[s.house] || 0) + 1;
  });

  // Conduct Breakdown
  const conductMap: Record<string, number> = { Exemplary: 0, Good: 0, Satisfactory: 0, 'Needs Improvement': 0 };
  students.forEach(s => {
    conductMap[s.conductRating] = (conductMap[s.conductRating] || 0) + 1;
  });

  // Top Achievers by GPA
  const topAcademicScholars = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">{totalStudents}</span>
            <span className="text-xs text-slate-500">active records</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">100% portfolios verified</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">School GPA Average</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-blue-700 tabular-nums">{avgGpa}</span>
            <span className="text-xs text-slate-400">/ 4.0</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2">{avgPct}% aggregate marks</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Merits Recorded</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-600 tabular-nums">+{totalMerits}</span>
            <span className="text-xs text-slate-400">/ {totalDemerits} demerits</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{avgAttendance}% average attendance</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Community Service</span>
            <HeartHandshake className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-purple-700 tabular-nums">{totalServiceHours}</span>
            <span className="text-xs text-slate-500">hours completed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Civic outreach & volunteer drives</p>
        </div>
      </div>

      {/* 2-Column Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Academic Honor Roll Scholars */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Honor Roll</h3>
              <p className="text-xs text-slate-500">Top-ranking student portfolios by cumulative GPA</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {topAcademicScholars.map((scholar, idx) => (
              <div 
                key={scholar.id} 
                onClick={() => onSelectStudent(scholar)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    {scholar.photoUrl ? (
                      <img src={scholar.photoUrl} alt={scholar.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                        {scholar.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{scholar.fullName}</h4>
                    <p className="text-xs text-slate-500">{scholar.grade} - {scholar.section} · {scholar.rollNo}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-blue-700 tabular-nums">
                    {scholar.gpa.toFixed(2)} GPA
                  </span>
                  <span className="block text-[11px] text-slate-400">{scholar.overallPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conduct & Character Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Discipline & Conduct Standing</h3>
              <p className="text-xs text-slate-500">Character ratings across the student body</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-4 mt-4">
            {Object.entries(conductMap).map(([rating, count]) => {
              const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
              return (
                <div key={rating} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{rating}</span>
                    <span className="font-mono tabular-nums text-slate-500">{count} students ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${
                        rating === 'Exemplary' ? 'bg-emerald-600' :
                        rating === 'Good' ? 'bg-blue-600' :
                        rating === 'Satisfactory' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sports & Athletic Disciplines */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sports & Athletic Disciplines</h3>
              <p className="text-xs text-slate-500">Student enrollment across athletic sports</p>
            </div>
            <Trophy className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {topSports.map(([sport, count]) => (
              <div key={sport} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{sport}</span>
                <span className="font-mono tabular-nums text-slate-600 font-medium">
                  {count} athlete{count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* House Standings */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">House Standings</h3>
              <p className="text-xs text-slate-500">Roster distribution across collegiate houses</p>
            </div>
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(houseMap).map(([house, count]) => (
              <div key={house} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-700">{house}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{count}</span>
                  <span className="text-xs text-slate-400">members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
