import React, { useRef, useState } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Trophy, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Edit3,
  HeartHandshake,
  Download
} from 'lucide-react';
import { Student } from '../types/student';
import { SCHOOL_INFO } from '../data/initialStudents';
import { downloadStandalonePortfolioHtml } from '../utils/portfolioExport';

interface StudentPortfolioProps {
  student: Student;
  allStudents: Student[];
  onSelectStudent: (student: Student) => void;
  onBack: () => void;
  onEditStudent: (student: Student) => void;
  onUpdatePhoto: (studentId: string, photoUrl: string) => void;
  onExportStudentExcel: (student: Student) => void;
}

export const StudentPortfolio: React.FC<StudentPortfolioProps> = ({
  student,
  allStudents,
  onSelectStudent,
  onBack,
  onEditStudent,
  onUpdatePhoto,
  onExportStudentExcel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState(false);

  // Find index for prev/next navigation
  const currentIndex = allStudents.findIndex(s => s.id === student.id);
  const prevStudent = currentIndex > 0 ? allStudents[currentIndex - 1] : null;
  const nextStudent = currentIndex < allStudents.length - 1 ? allStudents[currentIndex + 1] : null;

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdatePhoto(student.id, reader.result);
          setPhotoError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getConductColor = (rating: string) => {
    switch (rating) {
      case 'Exemplary': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Good': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Satisfactory': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  const getHouseBadgeColor = (house: string) => {
    switch (house) {
      case 'Titans': return 'text-indigo-800 bg-indigo-50 border-indigo-200';
      case 'Phoenix': return 'text-rose-800 bg-rose-50 border-rose-200';
      case 'Spartans': return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'Centaur': return 'text-amber-800 bg-amber-50 border-amber-200';
      default: return 'text-slate-800 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Portfolio Top Action Bar (Hidden in Print) */}
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roster
          </button>

          <span className="text-slate-300">|</span>

          {/* Quick Prev / Next Navigator */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <button
              onClick={() => prevStudent && onSelectStudent(prevStudent)}
              disabled={!prevStudent}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={prevStudent ? `Previous: ${prevStudent.fullName}` : 'No previous student'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono tabular-nums px-2">
              {currentIndex + 1} of {allStudents.length}
            </span>
            <button
              onClick={() => nextStudent && onSelectStudent(nextStudent)}
              disabled={!nextStudent}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={nextStudent ? `Next: ${nextStudent.fullName}` : 'No next student'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onExportStudentExcel(student)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download student data formatted in Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export Excel
          </button>

          <button
            onClick={() => downloadStandalonePortfolioHtml(student)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Download complete standalone offline portfolio document with photo and formatting"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            Download Portfolio (.html)
          </button>

          <button
            onClick={() => onEditStudent(student)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-600" />
            Edit
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Print or choose 'Save as PDF' in print dialog"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Official Portfolio Document (Printable A4 format) */}
      <article className="portfolio-document bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
        
        {/* Official School Header */}
        <header className="p-8 border-b border-slate-200 bg-slate-900 text-white print:bg-slate-900 print:text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                <GraduationCap className="w-9 h-9 text-amber-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
                  Official Cumulative Student Record
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {SCHOOL_INFO.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {SCHOOL_INFO.affiliation} · {SCHOOL_INFO.academicSession}
                </p>
              </div>
            </div>

            <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
              <div className="inline-block text-left md:text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Dossier Registry ID</span>
                <span className="font-mono text-sm font-semibold text-white tabular-nums tracking-wide">
                  {student.admissionNo}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Verified by Office of the Registrar
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Student Identification & Hero Bio Strip */}
        <section className="p-8 border-b border-slate-200 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Student Photo Column */}
            <div className="lg:col-span-3 flex flex-col items-center">
              <div className="relative group w-44 h-44 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-sm">
                {student.photoUrl && !photoError ? (
                  <img
                    src={student.photoUrl}
                    alt={student.fullName}
                    onError={() => setPhotoError(true)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                    <GraduationCap className="w-12 h-12 mb-2 text-slate-300" />
                    <span className="text-xs font-medium">No Portrait</span>
                  </div>
                )}

                {/* Upload Photo Button Overlay (Print Hidden) */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className="print:hidden absolute inset-0 bg-slate-900/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-3 text-center"
                >
                  <Upload className="w-6 h-6 mb-1 text-amber-300" />
                  <span className="text-xs font-medium">Update Photo</span>
                  <span className="text-[10px] text-slate-300">Click to upload file</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-3 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getHouseBadgeColor(student.house)}`}>
                  {student.house} House
                </span>
              </div>
            </div>

            {/* Student Core Details Column */}
            <div className="lg:col-span-9 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {student.fullName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getConductColor(student.conductRating)}`}>
                      {student.conductRating} Conduct
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Rank #{student.classRank} in Class
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Roll No: <span className="font-mono font-medium text-slate-800">{student.rollNo}</span>
                  <span className="mx-2">·</span>
                  Grade & Section: <span className="font-medium text-slate-800">{student.grade} - {student.section}</span>
                  <span className="mx-2">·</span>
                  Gender: <span className="font-medium text-slate-800">{student.gender}</span>
                  <span className="mx-2">·</span>
                  DOB: <span className="font-mono text-slate-800">{student.dob}</span>
                </p>
              </div>

              {/* 4 Key Pillar Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">Academic GPA</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{student.gpa.toFixed(2)}</span>
                    <span className="text-xs text-slate-400">/ 4.0</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">{student.overallPercentage}% aggregate</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">School Attendance</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{student.attendancePercentage}%</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Regular attendance</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">Primary Sport</span>
                  <p className="text-sm font-bold text-slate-900 truncate mt-1.5" title={student.primarySport}>
                    {student.primarySport}
                  </p>
                  <span className="text-[11px] text-slate-500">{student.sportsRole || 'Varsity Squad'}</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">Discipline Merits</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">+{student.meritsCount}</span>
                    <span className="text-xs text-slate-400">/ {student.demeritsCount} demerits</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{student.punctualityScore}% punctuality</span>
                </div>
              </div>

              {/* Contact and Guardian Summary */}
              <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Guardian: </span>
                  <span className="font-medium text-slate-800">{student.guardianName}</span> ({student.guardianContact})
                </div>
                <div>
                  <span className="text-slate-400">Email: </span>
                  <span className="font-mono text-slate-800">{student.email}</span>
                  <span className="mx-2">·</span>
                  <span className="text-slate-400">Blood Group: </span>
                  <span className="font-mono font-medium text-slate-800">{student.bloodGroup}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 CORE DIMENSIONS GRID */}
        <div className="p-8 space-y-8">
          
          {/* 1. ACADEMIC & EDUCATIONAL EXCELLENCE */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    1. Academic & Educational Performance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Curriculum subject transcript, standardized scores, and academic remarks
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Term Average</span>
                <p className="text-lg font-bold font-mono text-blue-700 tabular-nums">
                  {student.overallPercentage}%
                </p>
              </div>
            </div>

            {/* Subject Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/60">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-right">Score / 100</th>
                    <th className="py-2.5 px-3 w-48">Score Bar</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3">Faculty Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.subjects.map((subj, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{subj.name}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-slate-900">
                        {subj.score}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, Math.max(0, subj.score))}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 font-mono">
                          {subj.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-600 italic">
                        "{subj.remarks}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-3.5 rounded-lg text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Academic Dean Appraisal: </span>
              {student.academicRemarks}
            </div>
          </section>

          {/* 2. SPORTS & ATHLETICS RECORD */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    2. Sports, Athletics & Physical Education
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inter-school achievements, varsity positions, and physical conditioning
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Fitness Assessment:</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                  Grade {student.fitnessGrade}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">Primary Discipline</span>
                  <span className="text-base font-bold text-slate-900">{student.primarySport}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">Role & Position</span>
                  <span className="text-sm font-medium text-slate-800">{student.sportsRole || 'Varsity Player'}</span>
                </div>
                {student.secondarySports.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wide block">Secondary Disciplines</span>
                    <span className="text-xs text-slate-700">{student.secondarySports.join(', ')}</span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">Athletic Coach Remarks</span>
                  <p className="text-xs text-slate-600 italic mt-0.5">"{student.sportsRemarks}"</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Official Sports Accolades & Medals
                </span>
                
                {student.sportsAchievements.length > 0 ? (
                  <div className="space-y-2">
                    {student.sportsAchievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            ach.medal === 'Gold' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            ach.medal === 'Silver' ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                            ach.medal === 'Bronze' ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{ach.title}</p>
                            <p className="text-xs text-slate-500">{ach.event} · {ach.year}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-800">
                            {ach.medal}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">{ach.level} Level</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-lg">
                    Participated in regular physical education and intramural athletic sessions.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3. DISCIPLINE, CONDUCT & CHARACTER ("decreplin") */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    3. Discipline, Conduct & Character Standing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Punctuality track record, merits tally, moral conduct, and leadership appointments
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-500">Punctuality</span>
                  <p className="text-sm font-bold font-mono text-slate-900">{student.punctualityScore}%</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Merits Balance</span>
                  <p className="text-sm font-bold font-mono text-emerald-600">+{student.meritsCount - student.demeritsCount}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">Conduct Standing</span>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold border ${getConductColor(student.conductRating)}`}>
                    {student.conductRating} Conduct
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">School Leadership Positions</span>
                  {student.leadershipRoles.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {student.leadershipRoles.map((role, idx) => (
                        <li key={idx} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{role}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-slate-500 italic">General student body</span>
                  )}
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block">Discipline Faculty Note</span>
                  <p className="text-xs text-slate-600 italic mt-0.5">"{student.conductRemarks}"</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Discipline & Commendation History
                </span>

                {student.disciplineRecords.length > 0 ? (
                  <div className="space-y-2">
                    {student.disciplineRecords.map((rec, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={`font-semibold px-2 py-0.5 rounded ${
                            rec.category === 'Commendation' ? 'bg-emerald-50 text-emerald-700' :
                            rec.category === 'Leadership' ? 'bg-indigo-50 text-indigo-700' :
                            rec.category === 'Merit' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {rec.category}
                          </span>
                          <span className="text-slate-400 font-mono">{rec.date}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-medium">{rec.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Awarded by: {rec.awardedBy}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-lg">
                    Clean disciplinary record with no infractions or reprimands.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 4. EXTRACURRICULAR ACTIVITIES & SERVICE ("extra curiclar activities") */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    4. Extracurricular, Clubs & Community Service
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active club participation, creative arts, competitions, and civic volunteer hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                  {student.communityServiceHours} Volunteer Hours
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              
              {/* Clubs & Special Talents */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Enrolled Clubs & Societies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {student.clubs.map((club, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {club}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                    Special Talents & Abilities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {student.specialTalents.map((talent, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
                        ★ {talent}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Advisor Observation: </span>
                  {student.extracurricularRemarks}
                </div>
              </div>

              {/* Competitions & Awards */}
              <div>
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                  Key Competitions & Co-Curricular Awards
                </span>

                {student.competitions.length > 0 ? (
                  <div className="space-y-2">
                    {student.competitions.map((comp, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{comp.title}</span>
                          <span className="font-mono text-slate-400">{comp.year}</span>
                        </div>
                        <p className="text-xs font-semibold text-purple-700 mt-0.5">{comp.award}</p>
                        <p className="text-[11px] text-slate-500">Category: {comp.category}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-lg">
                    Participated in school exhibition and cultural showcases.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* OFFICIAL PRINCIPAL ENDORSEMENT & CERTIFICATION */}
          <section className="rounded-xl border-2 border-slate-300 bg-slate-50/70 p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Principal's Cumulative Endorsement
            </h4>
            <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
              "{student.principalEndorsement}"
            </p>

            <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-slate-600">
              <div>
                <div className="h-10 border-b border-slate-400 mx-auto max-w-[180px] mb-2 flex items-end justify-center pb-1 font-serif text-slate-700">
                  {SCHOOL_INFO.principal}
                </div>
                <p className="font-semibold text-slate-900">Head of School / Principal</p>
                <p className="text-[10px] text-slate-500">{SCHOOL_INFO.shortName}</p>
              </div>

              <div>
                <div className="h-10 border-b border-slate-400 mx-auto max-w-[180px] mb-2 flex items-end justify-center pb-1 font-serif text-slate-700">
                  Academic Council
                </div>
                <p className="font-semibold text-slate-900">Homeroom Advisor</p>
                <p className="text-[10px] text-slate-500">Class {student.grade}-{student.section}</p>
              </div>

              <div>
                <div className="h-10 border-b border-slate-400 mx-auto max-w-[180px] mb-2 flex items-end justify-center pb-1 font-mono text-slate-700">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <p className="font-semibold text-slate-900">Date of Issue</p>
                <p className="text-[10px] text-slate-500">Official Institutional Seal</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="p-6 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 print:bg-white print:text-[10px]">
          <p>{SCHOOL_INFO.name} · {SCHOOL_INFO.address} · {SCHOOL_INFO.website}</p>
          <p className="mt-1">
            This cumulative student portfolio represents verified institutional records for academic and extra-curricular development.
          </p>
        </footer>

      </article>
    </div>
  );
};
