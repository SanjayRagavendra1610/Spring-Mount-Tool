import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Printer, 
  ArrowUpRight, 
  GraduationCap, 
  Trophy, 
  ShieldCheck, 
  Sparkles,
  Download,
  Filter,
  Plus
} from 'lucide-react';
import { Student } from '../types/student';
import { downloadBatchPortfoliosHtml, downloadStandalonePortfolioHtml } from '../utils/portfolioExport';

interface PortfolioGalleryProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenAddModal: () => void;
  onExportAllExcel: () => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  students,
  onSelectStudent,
  onOpenAddModal,
  onExportAllExcel
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [houseFilter, setHouseFilter] = useState('All');

  const filtered = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        s.fullName.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.primarySport.toLowerCase().includes(q) ||
        s.clubs.some(c => c.toLowerCase().includes(q))
      );
      const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
      const matchesHouse = houseFilter === 'All' || s.house === houseFilter;
      return matchesSearch && matchesGrade && matchesHouse;
    });
  }, [students, searchQuery, gradeFilter, houseFilter]);

  return (
    <div className="space-y-6">
      {/* Gallery Header & Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Portfolio Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic student dossiers spanning academics, sports, discipline records, and extracurricular accolades
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadBatchPortfoliosHtml(filtered, `Westwood Academy Portfolios (${filtered.length} Students)`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Download all student portfolios in a single multi-page printable HTML booklet"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            Download All Portfolios (.html)
          </button>

          <button
            onClick={onExportAllExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export Portfolios Excel
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student portfolios by name, roll no, sport, or activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
          >
            <option value="All">All Grades</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>

          <select
            value={houseFilter}
            onChange={(e) => setHouseFilter(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
          >
            <option value="All">All Houses</option>
            <option value="Titans">Titans</option>
            <option value="Phoenix">Phoenix</option>
            <option value="Spartans">Spartans</option>
            <option value="Centaur">Centaur</option>
          </select>

          <span className="text-slate-400 pl-2 font-mono tabular-nums">
            {filtered.length} portfolios
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((student) => (
          <div
            key={student.id}
            className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            {/* Card Upper Section */}
            <div>
              {/* Photo & Header Lockup */}
              <div className="p-5 pb-4 border-b border-slate-100 flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-lg">
                      {student.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {student.rollNo}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      student.house === 'Titans' ? 'bg-indigo-50 text-indigo-700' :
                      student.house === 'Phoenix' ? 'bg-rose-50 text-rose-700' :
                      student.house === 'Spartans' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {student.house}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate mt-0.5 group-hover:text-indigo-600 transition-colors">
                    {student.fullName}
                  </h3>
                  
                  <p className="text-xs text-slate-500">
                    {student.grade} - {student.section} · Rank #{student.classRank}
                  </p>
                </div>
              </div>

              {/* 4 Pillars Summary Strip */}
              <div className="p-5 space-y-3 text-xs">
                {/* Academic */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Academic GPA</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {student.gpa.toFixed(2)} ({student.overallPercentage}%)
                  </span>
                </div>

                {/* Sports */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[150px]">{student.primarySport}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {student.sportsAchievements.length > 0 ? `${student.sportsAchievements.length} Honors` : 'Active'}
                  </span>
                </div>

                {/* Discipline */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Discipline Conduct</span>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded text-[11px] font-semibold ${
                    student.conductRating === 'Exemplary' ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'
                  }`}>
                    {student.conductRating}
                  </span>
                </div>

                {/* Extracurriculars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="truncate max-w-[150px]">{student.clubs[0] || 'Activities'}</span>
                  </div>
                  <span className="font-mono font-medium text-purple-700 tabular-nums">
                    {student.communityServiceHours} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {student.attendancePercentage}% attendance
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => downloadStandalonePortfolioHtml(student)}
                  className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title={`Download ${student.fullName}'s offline portfolio (.html)`}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectStudent(student)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <span>View Full Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
