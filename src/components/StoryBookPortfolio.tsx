import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Edit3, 
  Share2, 
  QrCode, 
  Trophy, 
  Sparkles, 
  Heart,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Student } from '../types/student';
import { downloadStandalonePortfolioHtml } from '../utils/portfolioExport';

interface StoryBookPortfolioProps {
  student: Student;
  allStudents: Student[];
  onSelectStudent: (student: Student) => void;
  onBack: () => void;
  onEditStudent: (student: Student) => void;
  onExportStudentExcel: (student: Student) => void;
}

export const StoryBookPortfolio: React.FC<StoryBookPortfolioProps> = ({
  student,
  allStudents,
  onSelectStudent,
  onBack,
  onEditStudent,
  onExportStudentExcel
}) => {
  const [activePage, setActivePage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'reader' | 'all-pages'>('reader');

  const currentIndex = allStudents.findIndex(s => s.id === student.id);
  const prevStudent = currentIndex > 0 ? allStudents[currentIndex - 1] : null;
  const nextStudent = currentIndex < allStudents.length - 1 ? allStudents[currentIndex + 1] : null;

  const handlePrint = () => {
    // Switch to all pages before printing so all 12 pages print into the PDF
    setViewMode('all-pages');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownload = () => {
    downloadStandalonePortfolioHtml(student);
  };

  const book = student.storybook;
  const isImported = book?.source === 'excel';
  const textValue = (value: string | undefined, fallback: string) => value?.trim() || (isImported ? '—' : fallback);
  const score25 = (value: number | undefined, fallback: number) => value === undefined ? (isImported ? '— / 25' : `${fallback} / 25`) : `${value} / 25`;
  const criterionValue = (values: Array<number | undefined> | undefined, index: number, fallback: number) => values?.[index] ?? (isImported ? undefined : fallback);
  const score5 = (value: number | undefined) => value === undefined ? '— / 5' : `${value} / 5`;
  const selValue = (key: 'selfAwareness' | 'selfManagement' | 'socialAwareness' | 'collaboration' | 'problemSolving', field: 'faculty' | 'student', fallback: string) => {
    const value = book?.selRows?.[key]?.[field];
    return value?.trim() || (isImported ? '—' : fallback);
  };
  const stage = book?.stage?.trim() || `${student.grade} ${student.section}`.toUpperCase();
  const institution = textValue(book?.institutionName, 'SPRING MOUNT INSTITUTIONS');
  const initiative = textValue(book?.initiativeName, 'thinklink Little Thinkers with Big Ideas');
  const pedagogyTag = textValue(book?.pedagogyTag, 'LEARN 360');
  const portfolioYear = textValue(book?.portfolioYear, "MY PORTFOLIO '25-26");
  const careerTitle = textValue(book?.dreamCareer?.title, 'Doctor');
  const doctorImg = book?.dreamCareer?.illustrationUrl || student.photoUrl || '';
  const familyImg = book?.familyPhotoUrl || '';
  const campusImg = book?.campusSketchUrl || '';
  const motorImg = book?.grossMotorActivityPhotoUrl || '';
  const artworkImg = book?.artworkPhotoUrl || '';
  const classMontageImg = book?.classMontagePhotoUrl || '';
  const educatorImg = book?.educatorPhotoUrl || '';
  const heroName = textValue(book?.superHeroName, 'BAT GIRL');
  const heroTrait = textValue(book?.superHeroTrait, 'Stays calm');
  const getTier = (score: number | undefined, bands: Array<{ name: string; min: number; max: number }>) =>
    score === undefined ? '—' : bands.find(band => score >= band.min && score <= band.max)?.name || '—';
  const discoveryBands = [
    { name: 'Den', min: 23, max: 25 }, { name: 'Passage', min: 17, max: 22 },
    { name: 'Chamber', min: 11, max: 16 }, { name: 'Tunnel', min: 6, max: 10 }, { name: 'Gate Way', min: 1, max: 5 },
  ];
  const cognitiveBands = [
    { name: 'Sapience', min: 23, max: 25 }, { name: 'Noesis', min: 15, max: 22 },
    { name: 'Ratio', min: 10, max: 14 }, { name: 'Mnemonis', min: 5, max: 9 }, { name: 'Perceptus', min: 1, max: 4 },
  ];
  const ecoBands = [
    { name: 'TREE', min: 23, max: 25 }, { name: 'Blossom', min: 18, max: 22 },
    { name: 'Bud', min: 11, max: 17 }, { name: 'Sprout', min: 6, max: 10 }, { name: 'Seed', min: 1, max: 5 },
  ];
  const canonicalTier = (value: string | undefined, score: number | undefined, bands: Array<{ name: string; min: number; max: number }>) => {
    const entered = value?.trim();
    return (entered && bands.find(band => band.name.toLowerCase() === entered.toLowerCase())?.name) || entered || getTier(score, bands);
  };
  const discoveryTier = canonicalTier(book?.discoveryLevel, book?.discoveryScore, discoveryBands);
  const cognitiveTier = canonicalTier(book?.cognitiveLevel, book?.cognitiveScore, cognitiveBands);
  const ecoTier = canonicalTier(book?.ecoLevel, book?.ecoScore, ecoBands);
  const motorSteps = book?.grossMotorStepsCompleted ?? (isImported ? undefined : 40);
  const scorePerformance = (score: number | undefined) => score === undefined ? '—' : score === 5 ? 'Skilled' : score >= 3 ? 'Competent' : 'Introductory';
  const scoreGrade = (score: number | undefined) => score === undefined ? '—' : score === 5 ? 'A' : score >= 3 ? 'B' : 'C';

  return (
    <div className="storybook-print-root max-w-6xl mx-auto pb-16">
      
      {/* Top Controls Toolbar (Hidden in Print) */}
      <div className="print:hidden mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </button>

          <span className="text-slate-300">|</span>

          {/* Student Selector */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <button
              onClick={() => prevStudent && onSelectStudent(prevStudent)}
              disabled={!prevStudent}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              title="Previous Student"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-900">{student.fullName}</span>
            <span className="text-slate-400">({stage})</span>
            <button
              onClick={() => nextStudent && onSelectStudent(nextStudent)}
              disabled={!nextStudent}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              title="Next Student"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode & Page Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('reader')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'reader' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 inline mr-1" />
              Page Reader
            </button>
            <button
              onClick={() => setViewMode('all-pages')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'all-pages' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1" />
              All 12 Pages
            </button>
          </div>

          <button
            onClick={() => onExportStudentExcel(student)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download Excel row"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Excel
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Download complete StoryBook document file"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            Download Portfolio
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Reader Page Selector Strip (When in Reader Mode) */}
      {viewMode === 'reader' && (
        <div className="print:hidden mb-4 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs overflow-x-auto gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActivePage(p => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 px-2">Page {activePage} of 12</span>
            <button
              onClick={() => setActivePage(p => Math.min(12, p + 1))}
              disabled={activePage === 12}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Page Jump Pills */}
          <div className="flex items-center gap-1">
            {[
              { num: 1, label: 'Cover' },
              { num: 2, label: 'Family' },
              { num: 3, label: 'STEAM' },
              { num: 4, label: 'Superheros' },
              { num: 5, label: 'Literacy' },
              { num: 6, label: 'Discovery' },
              { num: 7, label: 'Gross Motor' },
              { num: 8, label: 'Creative Arts' },
              { num: 9, label: 'Cognitive' },
              { num: 10, label: 'Eco' },
              { num: 11, label: 'Memories' },
              { num: 12, label: 'Campus' }
            ].map(p => (
              <button
                key={p.num}
                onClick={() => setActivePage(p.num)}
                className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activePage === p.num
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p.num}. {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STORYBOOK PAGES CONTAINER */}
      <div className="storybook-container space-y-8 print:space-y-0">

        {/* PAGE 1: COVER PAGE */}
        {(viewMode === 'all-pages' || activePage === 1) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white min-h-[580px] flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            
            {/* Top Logos */}
            <div className="p-8 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border border-purple-400/40 bg-purple-800/50 flex items-center justify-center font-bold text-amber-300">
                  TL
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-wider text-amber-300 uppercase">thinklink</h4>
                  <p className="text-[10px] text-purple-200 tracking-wide">{initiative}</p>
                </div>
              </div>

              <div className="w-14 h-14 rounded-full border border-amber-400/50 bg-amber-400/10 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full border border-amber-300 flex items-center justify-center font-serif text-[10px] font-bold text-amber-300 text-center uppercase leading-none">
                  SMI Crest
                </div>
              </div>
            </div>

            {/* Center Content: Character + Title */}
            <div className="px-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center z-10">
              {/* Doctor Child Character */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-amber-400/40 shadow-2xl bg-purple-950/60">
                  {doctorImg ? <img src={doctorImg} alt={`${student.fullName} as ${careerTitle}`} className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center text-sm text-purple-100">Add a student or dream career image</div>}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-center py-1 px-2 rounded-lg border border-purple-400/30">
                    <span className="text-[11px] font-bold text-amber-300">Dream: {careerTitle}</span>
                  </div>
                </div>
              </div>

              {/* Title Lockup */}
              <div className="md:col-span-7 space-y-3 text-left">
                <span className="text-xs font-bold tracking-widest text-amber-400 uppercase block">
                  {pedagogyTag}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {student.fullName}'s
                </h1>
                <h2 className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight leading-tight">
                  StoryBook<br />of Learning
                </h2>
                <p className="text-sm text-purple-100 font-medium max-w-xl">
                  Holistic Early-Years Growth, STEAM &amp; Discovery Portfolio
                </p>
                <p className="text-sm text-purple-200 font-medium pt-2">
                  Stage: <strong className="text-white">{stage}</strong> · Roll No: <strong className="text-white">{student.rollNo}</strong>
                </p>
              </div>
            </div>

            {/* Bottom Yellow Curved Strip */}
            <div className="relative bg-amber-400 text-slate-900 px-8 py-4 flex items-center justify-between z-10 border-t-4 border-amber-300">
              <span className="font-extrabold text-sm tracking-wider uppercase">
                {institution}
              </span>
              <span className="bg-purple-950 text-white font-mono text-xs font-bold px-4 py-1.5 rounded-full shadow-inner">
                {portfolioYear}
              </span>
            </div>
          </div>
        )}

        {/* PAGE 2: DEDICATION & FAMILY STORY */}
        {(viewMode === 'all-pages' || activePage === 2) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 min-h-[580px] flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
              
              {/* Left Column: Quote & Branding */}
              <div className="md:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                    TL
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-900 uppercase">thinklink</h4>
                    <p className="text-[10px] text-slate-500">Little Thinkers With Big Ideas</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-4xl font-extrabold text-indigo-950 leading-tight">
                    {isImported ? (book?.familyQuote || `${student.fullName}'s learning journey begins here.`) : <>Every journey <br /><span className="text-amber-500">begins</span> <br />with a story... <br />and mine began <br />with l<span className="text-rose-500">♥</span>ve.</>}
                  </h3>
                </div>

                {/* Student Badge */}
                <div className="space-y-2 pt-4">
                  <div className="bg-slate-900 text-white font-extrabold text-base px-6 py-2 rounded-full inline-block tracking-wide shadow-sm">
                    {student.fullName.toUpperCase()}
                  </div>
                  <div className="block">
                    <span className="bg-amber-100 text-amber-900 font-bold text-xs px-4 py-1 rounded-full border border-amber-200">
                      {stage}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Play & Learn: Experience Learning Through Play</span>
                  </p>
                </div>

                <dl className="grid grid-cols-1 gap-1.5 border-t border-slate-200 pt-3 text-[11px] text-slate-600">
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Student Name</dt><dd>{student.fullName.toUpperCase()}</dd></div>
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Class / Stage</dt><dd>{stage}</dd></div>
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Gender</dt><dd>{student.gender || '—'}</dd></div>
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Date of Birth</dt><dd>{student.dob || '—'}</dd></div>
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Guardian</dt><dd>{student.guardianName || '—'}</dd></div>
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Institution</dt><dd>{institution} · {initiative}</dd></div>
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Pedagogical Theme</dt><dd>{pedagogyTag}</dd></div>
                  <div className="flex gap-2"><dt className="font-bold text-slate-800">Academic Session</dt><dd>{portfolioYear}</dd></div>
                </dl>
              </div>

              {/* Right Column: Family Love Photo */}
              <div className="md:col-span-7 flex justify-center">
                <div className="w-full max-w-md rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-100">
                  {familyImg ? <img src={familyImg} alt={`${student.fullName} with Family`} className="w-full h-80 object-cover object-center" referrerPolicy="no-referrer" /> : <div className="w-full h-80 flex items-center justify-center text-sm text-slate-500">Add a family photo in the Student Data sheet</div>}
                  <div className="p-3 bg-purple-950 text-white text-center text-xs">
                    <span>{institution} · {initiative}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Page 2 Footer */}
            <div className="bg-purple-950 text-white px-8 py-3 flex items-center justify-between text-xs">
              <span className="font-medium text-purple-200">Chapter 1: The First Foundation of Love & Nurturance</span>
              <span className="font-mono text-amber-400">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 3: PLAY BASED LEARNING & STEAM */}
        {(viewMode === 'all-pages' || activePage === 3) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div>
                  <h3 className="text-3xl font-black text-purple-900 tracking-tight">
                    play based <span className="text-amber-500">learning</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    STEAM Assessment Standards · {textValue(book?.steamActivity, 'Parachute Making')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-900 uppercase">thinklink</span>
                  <p className="text-[10px] text-slate-400">Experience Learning Through Play</p>
                </div>
              </div>

              {/* STEAM Assessment Table */}
              <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-rose-500 text-white font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 w-44">METRIC</th>
                      <th className="p-3 w-40">ACTIVITY</th>
                      <th className="p-3">OBSERVATION</th>
                      <th className="p-3">LEARNING OUTCOME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="p-3 bg-slate-50 font-semibold text-slate-800">Curiosity & Inquiry</td>
                      <td rowSpan={6} className="p-3 font-bold text-center bg-amber-50 text-amber-900 border-x border-slate-200 align-middle">
                        <div className="text-sm font-extrabold text-slate-900">{textValue(book?.steamActivity, 'PARACHUTE MAKING')}</div>
                        <span className="text-[10px] text-slate-500 mt-1 block">Aerodynamics & Air Drag</span>
                      </td>
                      <td rowSpan={6} className="p-3 bg-white text-slate-700 align-middle">
                        <ol className="list-decimal pl-4 space-y-1.5 font-medium">
                          {(book?.steamObservations?.length ? book.steamObservations : isImported ? ['—'] : ['Eager to engage immediately.', 'Works with focus & flow.', 'Cleans up without being told.']).map((observation, idx) => <li key={idx}>{observation || '—'}</li>)}
                        </ol>
                      </td>
                      <td rowSpan={6} className="p-3 bg-slate-50 text-slate-800 align-middle border-l border-slate-200">
                        <p className="font-semibold text-purple-900 uppercase text-[11px] mb-1">
                          Air Resistance & Gravity
                        </p>
                        <p className="text-xs text-slate-600">
                          {textValue(book?.steamOutcome, 'Explore basic science concepts like air resistance and gravity in a fun, hands-on way.')}
                        </p>
                      </td>
                    </tr>
                    <tr><td className="p-2.5 bg-slate-50 font-semibold text-slate-800">Critical Thinking</td></tr>
                    <tr><td className="p-2.5 bg-slate-50 font-semibold text-slate-800">Collaboration</td></tr>
                    <tr><td className="p-2.5 bg-slate-50 font-semibold text-slate-800">Creativity</td></tr>
                    <tr><td className="p-2.5 bg-slate-50 font-semibold text-slate-800">Early Math</td></tr>
                    <tr><td className="p-2.5 bg-slate-50 font-semibold text-slate-800">Scientific Thinking</td></tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs font-semibold text-purple-800">Student thinker profile: {textValue(book?.steamThinkerLevel, '01 OBSERVER: C. Darwin')}</p>
              {/* Full thinker and discovery reference matrix from the model PPT */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { id: '01', role: 'OBSERVER', name: 'C. Darwin', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { id: '02', role: 'CODER', name: 'Chanakya', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                  { id: '03', role: 'COLLABORATOR', name: 'Da Vinci', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                  { id: '04', role: 'IMAGINATIVE', name: 'W. Disney', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  { id: '05', role: 'GEOMETRIC', name: 'Praggnanandhaa', color: 'bg-orange-50 text-orange-800 border-orange-200' },
                  { id: '06', role: 'CURIOUS', name: 'Shakuntala Devi', color: 'bg-rose-50 text-rose-800 border-rose-200' },
                  { role: 'EXPLORER', name: 'Galileo Galilei', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { role: 'ANALYST', name: 'Aryabhata', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                  { role: 'CONTRIBUTOR', name: 'Ratan Tata', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                  { role: 'CREATIVE', name: 'Arundhati Roy', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  { role: 'PATHFINDER', name: 'Pythagoras', color: 'bg-orange-50 text-orange-800 border-orange-200' },
                  { role: 'OPEN MINDNESS', name: 'E. Hubble', color: 'bg-rose-50 text-rose-800 border-rose-200' },
                  { role: 'INQUIRER', name: 'Marie Curie', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { role: 'INQUISITIVE', name: 'Edison', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                  { role: 'EXAMINER', name: 'Kalpana Chawla', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                  { role: 'INVENTIVE', name: 'Einstein', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  { role: 'PROBLEM SOLVER', name: 'Ramanujan', color: 'bg-orange-50 text-orange-800 border-orange-200' },
                  { role: 'EXPLORER', name: 'Louis Pasteur', color: 'bg-rose-50 text-rose-800 border-rose-200' },
                  { role: 'DISCOVERY', name: 'M. Faraday', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                  { role: 'THINKER', name: 'Nikola Tesla', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                  { role: 'SEEKER', name: 'Ramanujan', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                  { role: 'EXPLORATORY', name: 'B. Franklin', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                  { role: 'PRECISION', name: 'V. Anand', color: 'bg-orange-50 text-orange-800 border-orange-200' },
                  { role: 'PATTERN PIONEER', name: 'Pascal', color: 'bg-rose-50 text-rose-800 border-rose-200' }
                ].map((th, idx) => (
                  <div key={idx} className={`p-1.5 rounded-lg border text-center ${th.color}`}>
                    <span className="font-mono text-[10px] font-bold block">{th.id && <span>★ {th.id} · </span>}{th.role}</span>
                    <p className="text-[10px] font-bold truncate mt-0.5">{th.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
              <span>Play-Based Learning · 21st Century Skills</span>
              <span className="font-mono">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 4: SEL SUPER HEROS (Discipline & Character) */}
        {(viewMode === 'all-pages' || activePage === 4) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-900 font-extrabold flex items-center justify-center text-sm shadow-sm">
                    SEL
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                      SEL SUPER HEROS
                    </h3>
                    <p className="text-xs font-bold text-amber-800">
                      SEL Super Heroes: Calm, Patient & Inclusive Leadership
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-900 text-white px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">My Super Hero Trait</span>
                  <p className="text-sm font-black text-white">{heroTrait.toUpperCase()}</p>
                  <p className="text-xs font-bold text-amber-300">I AM {heroName}</p>
                </div>
              </div>

              {/* SEL Rows Table */}
              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'SELF AWARENESS',
                    color: 'bg-purple-100 border-purple-200 text-purple-900',
                    faculty: selValue('selfAwareness', 'faculty', 'Shares her personal likes and dislikes during group activities.'),
                    student: selValue('selfAwareness', 'student', 'Curious, open-minded')
                  },
                  {
                    title: 'SELF MANAGEMENT',
                    color: 'bg-sky-100 border-sky-200 text-sky-900',
                    faculty: selValue('selfManagement', 'faculty', 'Waits patiently for his/her turn.'),
                    student: selValue('selfManagement', 'student', 'Patient, persistent')
                  },
                  {
                    title: 'SOCIAL AWARENESS',
                    color: 'bg-emerald-100 border-emerald-200 text-emerald-900',
                    faculty: selValue('socialAwareness', 'faculty', 'Listens actively to others.'),
                    student: selValue('socialAwareness', 'student', 'Respectful, inclusive')
                  },
                  {
                    title: 'COLLABORATION',
                    color: 'bg-amber-100 border-amber-200 text-amber-900',
                    faculty: selValue('collaboration', 'faculty', 'Takes turns during shared tasks.'),
                    student: selValue('collaboration', 'student', 'Team-minded, respectful')
                  },
                  {
                    title: 'PROBLEM SOLVING',
                    color: 'bg-rose-100 border-rose-200 text-rose-900',
                    faculty: selValue('problemSolving', 'faculty', 'Asks for help when needed.'),
                    student: selValue('problemSolving', 'student', 'Wise, understanding')
                  }
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-xl border bg-white shadow-xs items-center">
                    <div className="md:col-span-3">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-extrabold uppercase border ${row.color}`}>
                        {row.title}
                      </span>
                    </div>
                    <div className="md:col-span-6 text-xs text-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Faculty Observation</span>
                      <p className="font-medium">{row.faculty}</p>
                    </div>
                    <div className="md:col-span-3 text-xs text-purple-900 bg-purple-50 p-2 rounded-lg border border-purple-100">
                      <span className="text-[10px] uppercase font-bold text-purple-600 block mb-0.5">Student Reflection</span>
                      <p className="font-semibold">{row.student}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200 flex justify-between text-xs text-slate-500">
              <span>Demonstrates calm self-regulation, active listening, and kind teamwork.</span>
              <span className="font-mono">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 5: FOUNDATIONAL LITERACY & NUMERACY (Cartoons & Characters) */}
        {(viewMode === 'all-pages' || activePage === 5) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="border-b pb-4 border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-rose-600 tracking-tight">
                    FOUNDATIONAL <span className="text-slate-900">LITERACY</span> & <span className="text-blue-600">NUMERACY</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Foundational Literacy ({score25(book?.literacyScore, 23)}) & Numeracy ({score25(book?.numeracyScore, 22)}) — {textValue(book?.literacyCharacter, 'SIMBA')} · {textValue(book?.numeracyCharacter, 'KUNG FU PANDA')}.
                  </p>
                </div>
                <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold">
                  Scale: 1-5 Marks Each
                </div>
              </div>

              {/* 2 Tables: Literacy + Numeracy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* Literacy Matrix */}
                <div className="border border-purple-200 rounded-xl overflow-hidden bg-purple-50/30">
                  <div className="bg-purple-700 text-white p-3 flex justify-between items-center text-xs font-bold uppercase">
                    <span>Literacy Readiness Matrix</span>
                    <span className="font-mono bg-purple-900 px-2 py-0.5 rounded text-amber-300">Score: {score25(book?.literacyScore, 23)}</span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-purple-100">
                      {[
                        { name: 'Phonological Awareness', marker: 'Recognizes & distinguishes between various sounds', score: criterionValue(book?.literacyCriteria, 0, 4) },
                        { name: 'Auditory Engagement', marker: 'Participates enthusiastically in rhymes, rhythm, songs', score: criterionValue(book?.literacyCriteria, 1, 5) },
                        { name: 'Responsive Listening', marker: 'Responds appropriately to simple instructions', score: criterionValue(book?.literacyCriteria, 2, 5) },
                        { name: 'Cognitive Listening Skills', marker: 'Listens attentively to short narratives & storytelling', score: criterionValue(book?.literacyCriteria, 3, 5) },
                        { name: 'Emerging Oral Expression', marker: 'Attempts to articulate simple words/phrases in English', score: criterionValue(book?.literacyCriteria, 4, 4) }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-purple-50/50">
                          <td className="p-2.5 font-semibold text-slate-800">{item.name}</td>
                          <td className="p-2.5 text-[11px] text-slate-600">{item.marker}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-purple-900">{score5(item.score)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-purple-100 border-t border-purple-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-950">CHARACTER: {textValue(book?.literacyCharacter, 'SIMBA')}</span>
                    <span className="font-semibold text-purple-800">{textValue(book?.literacyTrait, 'MASTERY AND CONFIDENCE')}</span>
                  </div>
                </div>

                {/* Numeracy Matrix */}
                <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/30">
                  <div className="bg-blue-700 text-white p-3 flex justify-between items-center text-xs font-bold uppercase">
                    <span>Numeracy Readiness Matrix</span>
                    <span className="font-mono bg-blue-900 px-2 py-0.5 rounded text-amber-300">Score: {score25(book?.numeracyScore, 22)}</span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-blue-100">
                      {[
                        { name: 'Quantitative Competence', marker: 'Counts in sequence accurately', score: criterionValue(book?.numeracyCriteria, 0, 5) },
                        { name: 'Number-Quantity Mapping', marker: 'Corresponds numbers to objects', score: criterionValue(book?.numeracyCriteria, 1, 4) },
                        { name: 'Geometric Classification', marker: 'Sorts objects by shape', score: criterionValue(book?.numeracyCriteria, 2, 5) },
                        { name: 'Arithmetical Pattern Analysis', marker: 'Interested in sequence and patterns', score: criterionValue(book?.numeracyCriteria, 3, 4) },
                        { name: 'Spatial-Relational Cognition', marker: 'Recognises spatial awareness through play', score: criterionValue(book?.numeracyCriteria, 4, 4) }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50">
                          <td className="p-2.5 font-semibold text-slate-800">{item.name}</td>
                          <td className="p-2.5 text-[11px] text-slate-600">{item.marker}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-blue-900">{score5(item.score)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-blue-100 border-t border-blue-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-950">CHARACTER: {textValue(book?.numeracyCharacter, 'KUNG FU PANDA')}</span>
                    <span className="font-semibold text-blue-800">{textValue(book?.numeracyTrait, 'REACHING HIGHER UNDERSTANDING')}</span>
                  </div>
                </div>

              </div>

              {/* Grading Scale */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-700 uppercase">Final Grading Scale:</span>
                <span className="text-emerald-700 font-semibold">23–25: SHINE ★ · {textValue(book?.literacyCharacter, 'SIMBA')} · {textValue(book?.literacyTrait, 'Mastery & confidence')}</span>
                <span className="text-blue-700 font-semibold">17–22: SOAR ★ · {textValue(book?.numeracyCharacter, 'KUNG FU PANDA')} · {textValue(book?.numeracyTrait, 'Higher understanding')}</span>
                <span className="text-amber-700 font-semibold">11–16: RISE · NARUTO · Building confidence and skills</span>
                <span className="text-purple-700 font-semibold">06–10: BLOOM · TOM · Growth in letters and numbers</span>
                <span className="text-slate-500 font-semibold">01–05: SPARK · MASHA & BEAR · The beginning of curiosity</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
              <span>Overall Academic Percentage: <strong>{isImported && !student.overallPercentage ? '—' : `${student.overallPercentage}%`} (GPA: {isImported && !student.gpa ? '—' : student.gpa.toFixed(2)})</strong></span>
              <span className="font-mono">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 6: LEARNING JOURNEY (Tree & Ant Colony Underground Discovery) */}
        {(viewMode === 'all-pages' || activePage === 6) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-b from-amber-50/80 via-emerald-50/40 to-amber-950/20 border border-emerald-200 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-emerald-200">
                <div>
                  <h3 className="text-3xl font-black text-emerald-950 tracking-tight">
                    LEARNING <span className="text-emerald-600">JOURNEY</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                    Experiential Inquiry · Discovery Framework
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold shadow-xs">
                  <Trophy className="w-5 h-5 text-amber-800" />
                  <div>
                    <span className="text-[10px] uppercase block font-mono">Discovery Score</span>
                    <span className="text-lg font-black font-mono">{score25(book?.discoveryScore, 20)}</span>
                  </div>
                </div>
              </div>

              {/* Discovery Table & Tree representation */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
                
                {/* Level Scale */}
                <div className="md:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500 block mb-2">Discovery Levels</span>
                  {discoveryBands.map((band, index) => {
                    const active = band.name === discoveryTier;
                    const next = !active && index === Math.max(discoveryBands.findIndex(item => item.name === discoveryTier) - 1, 0);
                    return <div key={band.name} className={`p-2 rounded font-bold ${active ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500' : next ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                      {active ? '★ ' : ''}{band.name} · {band.min}–{band.max} · {active ? `ACHIEVED (${score25(book?.discoveryScore, 20)})` : next ? 'Next Target' : 'Completed'}
                    </div>;
                  })}
                </div>

                {/* 5 Underground Chambers */}
                <div className="md:col-span-9 bg-amber-950 text-white p-5 rounded-2xl shadow-inner space-y-4">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Underground Exploration Ant Colony Chambers</span>
                    <span className="font-mono">{discoveryTier} Level</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[
                      { num: criterionValue(book?.discoveryCriteria, 0, 4), name: 'Investigative Curiosity', voice: book?.discoveryVoices?.[0] || (isImported ? '—' : 'I like to try and find out new things.') },
                      { num: criterionValue(book?.discoveryCriteria, 1, 4), name: 'Analytical Inquiry', voice: book?.discoveryVoices?.[1] || (isImported ? '—' : 'I ask questions to know more.') },
                      { num: criterionValue(book?.discoveryCriteria, 2, 4), name: 'Observation & Interpretation', voice: book?.discoveryVoices?.[2] || (isImported ? '—' : 'I see, notice, and talk about what is happening.') },
                      { num: criterionValue(book?.discoveryCriteria, 3, 4), name: 'Experiential Exploration', voice: book?.discoveryVoices?.[3] || (isImported ? '—' : 'I use my hands and tools to try things out.') },
                      { num: criterionValue(book?.discoveryCriteria, 4, 4), name: 'Reflective Understanding', voice: book?.discoveryVoices?.[4] || (isImported ? '—' : 'I can tell what I learned or did.') }
                    ].map((ch, idx) => (
                      <div key={idx} className="bg-amber-900/80 border border-amber-700 p-3 rounded-xl text-center flex flex-col justify-between">
                        <div>
                          <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 font-bold font-mono mx-auto flex items-center justify-center text-[10px] shadow-xs mb-1.5">
                            {score5(ch.num)}
                          </div>
                          <h5 className="text-[11px] font-extrabold text-amber-200">{ch.name}</h5>
                        </div>
                        <p className="text-[10px] text-amber-100 italic mt-2">"{ch.voice}"</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-amber-300 text-center font-medium pt-1">
                    TOTAL DISCOVERY SCORE · {score25(book?.discoveryScore, 20)}
                  </p>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-emerald-200 flex justify-between text-xs text-slate-500">
              <span>Learning Journey Level · {discoveryTier} · {score25(book?.discoveryScore, 20)}</span>
              <span className="font-mono">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 7: GROSS MOTOR SKILLS ASSESSMENT (Treasure Island & Pirate Game) */}
        {(viewMode === 'all-pages' || activePage === 7) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div>
                  <h3 className="text-3xl font-black text-rose-600 tracking-tight">
                    GROSS MOTOR <span className="text-slate-900">SKILLS ASSESSMENT</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Steady balance, fluid locomotion, spatial awareness, growing stamina, and rhythmic object control.
                  </p>
                </div>
                <div className="bg-emerald-100 text-emerald-900 px-4 py-2 rounded-xl font-bold text-right">
                  <span className="text-[10px] uppercase block font-mono">Final Score</span>
                  <span className="text-lg font-black font-mono">{score25(book?.grossMotorScore, 24)} (Grade {textValue(book?.grossMotorGrade, 'A')})</span>
                </div>
              </div>

              {/* Pirate Track + Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
                
                {/* Pirate Path 1-40 Graphic */}
                <div className="md:col-span-5 bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-2">
                    <span>🏴‍☠️ Pirate Ship: Start</span>
                    <span>Treasure Island: 40 🏝️</span>
                  </div>

                  {/* 40 steps visual track mini pills */}
                  <div className="flex flex-wrap gap-1 justify-center max-w-xs mx-auto py-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          i + 1 <= (motorSteps ?? 0)
                            ? 'bg-amber-400 text-slate-900 border border-amber-500 shadow-2xs'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                  {motorImg && <img src={motorImg} alt={`${student.fullName} gross motor activity`} className="w-full h-20 object-cover rounded-lg mt-2" loading="lazy" />}
                  <p className="text-[11px] text-sky-800 font-semibold mt-2">
                    Steps completed: {motorSteps ?? '—'} / 40
                  </p>
                </div>

                {/* Skill Strands Table */}
                <div className="md:col-span-7 border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Skill Strands</th>
                        <th className="p-2.5">Performance</th>
                        <th className="p-2.5">Gradation & Posture</th>
                        <th className="p-2.5 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { strand: 'Balance & Coordination', score: criterionValue(book?.grossMotorCriteria, 0, 5), perf: scorePerformance(criterionValue(book?.grossMotorCriteria, 0, 5)), grad: 'Steady posture; smooth coordination.', grade: scoreGrade(criterionValue(book?.grossMotorCriteria, 0, 5)) },
                        { strand: 'Locomotor Skills', score: criterionValue(book?.grossMotorCriteria, 1, 5), perf: scorePerformance(criterionValue(book?.grossMotorCriteria, 1, 5)), grad: 'Moves fluidly; changes speed/direction easily.', grade: scoreGrade(criterionValue(book?.grossMotorCriteria, 1, 5)) },
                        { strand: 'Spatial Awareness', score: criterionValue(book?.grossMotorCriteria, 2, 3), perf: scorePerformance(criterionValue(book?.grossMotorCriteria, 2, 3)), grad: 'Exploring space; learning to avoid obstacles.', grade: scoreGrade(criterionValue(book?.grossMotorCriteria, 2, 3)) },
                        { strand: 'Strength & Endurance', score: criterionValue(book?.grossMotorCriteria, 3, 4), perf: scorePerformance(criterionValue(book?.grossMotorCriteria, 3, 4)), grad: 'Performs light tasks with growing stamina.', grade: scoreGrade(criterionValue(book?.grossMotorCriteria, 3, 4)) },
                        { strand: 'Object Control & Rhythm', score: criterionValue(book?.grossMotorCriteria, 4, 5), perf: scorePerformance(criterionValue(book?.grossMotorCriteria, 4, 5)), grad: 'Controls objects confidently; moves in rhythm consistently.', grade: scoreGrade(criterionValue(book?.grossMotorCriteria, 4, 5)) }
                      ].map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-800">{s.strand}</td>
                          <td className="p-2.5 text-emerald-700 font-semibold">{s.perf} · {score5(s.score)}</td>
                          <td className="p-2.5 text-slate-600">{s.grad}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-900">{s.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-slate-50 border-t border-slate-200 text-[10px] text-center">
                    <div><strong>Skilled ★</strong><br />5 Points · Grade A<br />HULA · HOP · RUN</div>
                    <div><strong>Competent</strong><br />3–4 Points · Grade B<br />CLIMB · BALANCE</div>
                    <div><strong>Inductory</strong><br />1–2 Points · Grade C<br />SKIP · THROW</div>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
              <span>Treasure Island Course · Steps {motorSteps ?? '—'} / 40 · Final score {score25(book?.grossMotorScore, 24)} (Grade {textValue(book?.grossMotorGrade, 'A')})</span>
              <span className="font-mono">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 8: CREATIVE ARTS & CULTURAL LITERACY (Art Wheel & Masterpieces) */}
        {(viewMode === 'all-pages' || activePage === 8) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-200 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div>
                  <h3 className="text-3xl font-black text-amber-500 tracking-tight">
                    AESTHETIC EXPRESSION · <span className="text-slate-900">CREATIVE ARTS & CULTURAL LITERACY</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    Creative Arts Score: {score25(book?.creativeArtsScore, 22)} ({textValue(book?.creativeArtsLevel, 'ADEPT +++')}) · High inventiveness and artistry paired with appreciation of global and Indian artistic heritage.
                  </p>
                </div>
                <div className="bg-rose-600 text-white px-3 py-2 rounded-xl font-bold flex items-center gap-2 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-[9px] font-bold text-violet-700">Demo</div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase block font-mono">Creative Arts Score</span>
                    <span className="text-sm font-black uppercase">{score25(book?.creativeArtsScore, 22)} · {textValue(book?.creativeArtsLevel, 'ADEPT +++')}</span>
                  </div>
                </div>
              </div>

              {/* Art Wheel & Masterpiece Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                
                {/* Masterpiece 1: Da Vinci */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="h-28 rounded-lg overflow-hidden bg-amber-900/20 mb-2">
                    <img src="/storybook-assets/art-mona-lisa.png" alt="Mona Lisa" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Leonardo da Vinci</span>
                  <span className="text-[10px] text-slate-500">Mona Lisa (1503–1517)</span>
                </div>

                {/* Masterpiece 2: Raja Ravi Varma */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="h-28 rounded-lg overflow-hidden bg-rose-900/20 mb-2">
                    <img src="/storybook-assets/art-hamsa-damayanti.png" alt="Hamsa Damayanti" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Raja Ravi Varma</span>
                  <span className="text-[10px] text-slate-500">Hamsa Damayanti (1899)</span>
                </div>

                {/* Masterpiece 3: STUDENT'S REAL ARTWORK */}
                <div className="bg-amber-100 p-3 rounded-xl border-2 border-amber-400 text-center shadow-xs">
                  <div className="h-28 rounded-lg overflow-hidden bg-white mb-2">
                    {artworkImg ? <img src={artworkImg} alt={`${student.fullName} artwork`} className="w-full h-full object-cover" loading="lazy" /> : <div className="h-full flex items-center justify-center text-xs text-slate-500">Add artwork image</div>}
                  </div>
                  <span className="text-xs font-black text-slate-900 block">{student.fullName.toUpperCase()}</span>
                  <span className="text-[10px] text-purple-800 font-bold">{textValue(book?.artworkTitle, 'Student Artwork')}</span>
                </div>

                {/* Masterpiece 4: M.F. Hussain */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="h-28 rounded-lg overflow-hidden bg-blue-900/20 mb-2">
                    <img src="/storybook-assets/art-language-of-stone.png" alt="Language of Stone" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">M.F. Husain</span>
                  <span className="text-[10px] text-slate-500">Language of Stone (2008–11)</span>
                </div>

              </div>

              {/* 5 Art Dimensions */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                  <span className="font-bold text-purple-900 block">Inventiveness</span>
                  <span className="font-mono font-bold text-purple-700">Score: {score5(criterionValue(book?.creativeArtsCriteria, 0, 5))}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="font-bold text-blue-900 block">Artistry</span>
                  <span className="font-mono font-bold text-blue-700">Score: {score5(criterionValue(book?.creativeArtsCriteria, 1, 5))}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-900 block">Fine Motor Skills</span>
                  <span className="font-mono font-bold text-emerald-700">Score: {score5(criterionValue(book?.creativeArtsCriteria, 2, 4))}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-bold text-amber-900 block">Craftsmanship</span>
                  <span className="font-mono font-bold text-amber-700">Score: {score5(criterionValue(book?.creativeArtsCriteria, 3, 4))}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="font-bold text-rose-900 block">Cultural Literacy</span>
                  <span className="font-mono font-bold text-rose-700">Score: {score5(criterionValue(book?.creativeArtsCriteria, 4, 4))}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
              <span>Co-Curricular Talents: <strong>{student.specialTalents.join(', ')}</strong></span>
              <span className="font-mono">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 9: COGNITIVE & CONCEPTUAL DEVELOPMENT (Brain & Neural Pathways) */}
        {(viewMode === 'all-pages' || activePage === 9) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-slate-950 text-white min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-slate-800">
                <div>
                  <h3 className="text-3xl font-black text-amber-400 tracking-tight">
                    Cognitive Score: {score25(book?.cognitiveScore, 22)} ({cognitiveTier}) — Reasoning & Logic
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Neural Pathways, Logical Deduction & Mind Architecture
                  </p>
                </div>
                <div className="bg-purple-900 text-white px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] uppercase block text-purple-300 font-mono">Cognitive Standing</span>
                  <span className="text-base font-black text-amber-400">Score {score25(book?.cognitiveScore, 22)} · {cognitiveTier}</span>
                </div>
              </div>

              {/* Central Philosophy Quote */}
              <div className="my-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-sm font-serif italic text-purple-200">
                  "{textValue(book?.teacherPhilosophyQuote, 'All students can learn and succeed, but not on the same day, in the same way.')}"
                </p>
              </div>

              {/* 5 Cognitive Pathways */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                {[
                  { title: 'Thinking & Reasoning', desc: 'Making sense of ideas', score: book?.cognitiveBars?.thinkingReasoning },
                  { title: 'Attention & Memory', desc: 'Staying focused & recalling', score: book?.cognitiveBars?.attentionMemory },
                  { title: 'Logical Skills', desc: 'Solving with numbers & patterns', score: book?.cognitiveBars?.logicalSkills },
                  { title: 'Communication Skills', desc: 'Expressing ideas clearly in words', score: book?.cognitiveBars?.communicationSkills },
                  { title: 'Problem-Solving & Creativity', desc: 'Finding new ways & solutions', score: book?.cognitiveBars?.problemSolvingCreativity }
                ].map((cog, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-full border border-purple-500/50 bg-purple-950 mx-auto flex items-center justify-center font-mono font-bold text-amber-400 text-sm mb-2">
                        {score5(cog.score)}
                      </div>
                      <h5 className="text-xs font-bold text-white">{cog.title}</h5>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">{cog.desc}</p>
                  </div>
                ))}
              </div>

              {/* Cognitive Level Scale */}
              <div className="mt-6 p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between text-xs text-slate-300">
                <span className="font-bold text-amber-400 uppercase">Cognitive Spectrum:</span>
                {cognitiveBands.map((band, index) => {
                  const active = band.name === cognitiveTier;
                  const next = !active && index === Math.max(cognitiveBands.findIndex(item => item.name === cognitiveTier) - 1, 0);
                  return <span key={band.name} className={active ? 'text-amber-400 font-bold' : ''}>{active ? '★ ' : ''}{band.name} · {band.min}–{band.max} · {active ? `Achieved (${score25(book?.cognitiveScore, 22)})` : next ? 'Next milestone' : 'Completed'}</span>;
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Cognitive Mastery & Neuro-Developmental Profile</span>
              <span className="font-mono text-slate-400">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 10: ECO & ENVIRONMENTAL AWARENESS (Mother of Trees & Rings) */}
        {(viewMode === 'all-pages' || activePage === 10) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 text-white min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-emerald-800">
                <div>
                  <h3 className="text-3xl font-black text-amber-400 tracking-tight">
                    Environmental Stewardship · Civic & Eco Awareness
                  </h3>
                  <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mt-0.5">
                    Civic & Eco Score: {score25(book?.ecoScore, 23)} ({ecoTier} Tier) — Little Voices
                  </p>
                </div>
                <div className="bg-emerald-900 text-white px-4 py-2 rounded-xl text-right border border-emerald-700">
                  <span className="text-[10px] uppercase block text-emerald-300 font-mono">Eco Score</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{score25(book?.ecoScore, 23)} · {ecoTier}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
                
                {/* Left: Mother of Trees Inspiration */}
                <div className="md:col-span-5 bg-emerald-900/60 p-4 rounded-xl border border-emerald-800 space-y-3">
                  <span className="text-xs font-extrabold text-amber-300 uppercase block">Heroic Inspiration</span>
                  <h4 className="text-sm font-bold text-white">Saalumarada Thimmakka</h4>
                  <p className="text-xs text-emerald-200">
                    Saalumarada Thimmakka planted 385 banyan trees along a 4 km highway in Karnataka — showing how one dedicated citizen can nurture an entire forest.
                  </p>
                  <div className="p-2.5 bg-emerald-950 rounded-lg text-xs border border-emerald-800">
                    <span className="font-bold text-amber-300">Community Action: </span>
                    {student.fullName} logged {book?.ecoActivityHours ?? (isImported ? '—' : student.communityServiceHours)} volunteer hours in campus greening and botanical care.
                  </div>
                  <div className="p-2.5 bg-emerald-950 rounded-lg text-xs border border-emerald-800">
                    <span className="font-bold text-amber-300 block">Mother of Trees & QR Audio</span>
                    Scan QR: “Little Voices, Big Message — Hear Us Out!”
                  </div>
                </div>

                {/* Right: 5 Eco Pillars */}
                <div className="md:col-span-7 space-y-2.5">
                  {[
                    { title: 'Eco & Social Care', score: criterionValue(book?.ecoPillars, 0, 5), desc: 'Looking after nature and helping people around us.' },
                    { title: 'Global Citizenship', score: criterionValue(book?.ecoPillars, 1, 5), desc: 'Understanding that all children are friends & Earth is our home.' },
                    { title: 'Sustainable Thinking', score: criterionValue(book?.ecoPillars, 2, 5), desc: 'Learning to care for Earth by not wasting food, water, or paper.' },
                    { title: 'Practical Life Engagement', score: criterionValue(book?.ecoPillars, 3, 4), desc: 'Practising small tasks that build good habits every day.' },
                    { title: 'Civic & Environmental Literacy', score: criterionValue(book?.ecoPillars, 4, 4), desc: 'Following rules to care for people and nature.' }
                  ].map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{p.title}</span>
                        <p className="text-[11px] text-emerald-300 mt-0.5">{p.desc}</p>
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-sm ml-3 shrink-0">
                        {score5(p.score)}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-emerald-800 flex justify-between text-xs text-emerald-400">
              <span>Growth Stage · {ecoTier} ★ · {score25(book?.ecoScore, 23)} · TREE 23–25 · Blossom 18–22 · Bud 11–17 · Sprout 6–10 · Seed 1–5</span>
              <span className="font-mono text-emerald-400">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 11: CLASS PHOTO MONTAGE / RIPPED PAPER MEMORIES */}
        {(viewMode === 'all-pages' || activePage === 11) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-slate-100 border border-slate-300 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh] print:page-break-after">
            <div>
              <div className="text-center space-y-1 pb-4 border-b border-slate-300">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {stage} Community · Class Memories & Holistic Summary
                </span>
                <h3 className="text-2xl font-serif italic text-slate-900 font-bold">
                  “Together We Grew, Learned, and Laughed — {stage}”
                </h3>
                <p className="text-xs text-slate-500">“Together we grew, learned, and laughed — a class full of memories, a bond for life.” · {student.fullName}’s learning milestones.</p>
                <span className="inline-block bg-slate-900 text-white font-mono text-xs font-bold px-4 py-1 rounded-full mt-1">
                  {stage}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-start">
                <div className="md:col-span-5 space-y-3">
                  {classMontageImg ? <img src={classMontageImg} alt={`${stage} class memories`} className="w-full rounded-xl border border-slate-200" loading="lazy" /> : <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl">Add a class montage image</div>}
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                    {educatorImg ? <img src={educatorImg} alt="Educator" className="w-16 h-16 rounded-full object-cover" loading="lazy" /> : <div className="w-16 h-16 rounded-full bg-slate-100" />}
                    <div className="text-xs">
                      <strong className="block text-slate-900">Stage 3A Class Cohort</strong>
                      <span className="text-slate-500">Spring Mount Institutions · 2025–26</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 overflow-hidden rounded-xl border border-slate-300 bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-900 text-white uppercase">
                      <tr><th className="p-2">Portfolio Domain</th><th className="p-2">Score / Grade</th><th className="p-2">Achieved Tier / Persona</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr><td className="p-2 font-semibold">Play-Based STEAM</td><td className="p-2">{textValue(book?.steamActivity, '6 / 6 Pillars')}</td><td className="p-2">{textValue(book?.steamThinkerLevel, 'Observer, Coder, Collaborator, Imaginative, Geometric')}</td></tr>
                      <tr><td className="p-2 font-semibold">Social-Emotional (SEL)</td><td className="p-2">5 / 5 Domains</td><td className="p-2">{heroName} — Super Hero Trait: {heroTrait}</td></tr>
                      <tr><td className="p-2 font-semibold">Literacy & Numeracy</td><td className="p-2">{score25(book?.literacyScore, 23)} & {score25(book?.numeracyScore, 22)}</td><td className="p-2">Literacy: {textValue(book?.literacyCharacter, 'SIMBA')} · Numeracy: {textValue(book?.numeracyCharacter, 'KUNG FU PANDA')}</td></tr>
                      <tr><td className="p-2 font-semibold">Discovery & Motor</td><td className="p-2">{score25(book?.discoveryScore, 20)} & {score25(book?.grossMotorScore, 24)}</td><td className="p-2">Discovery: {discoveryTier} · Gross Motor: Grade {textValue(book?.grossMotorGrade, 'A')}</td></tr>
                      <tr><td className="p-2 font-semibold">Arts, Cognitive & Eco</td><td className="p-2">{score25(book?.creativeArtsScore, 22)}, {score25(book?.cognitiveScore, 22)} & {score25(book?.ecoScore, 23)}</td><td className="p-2">Arts: {textValue(book?.creativeArtsLevel, 'ADEPT +++')} · Cognitive: {cognitiveTier} · Eco: {ecoTier}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-300 flex justify-between text-xs text-slate-500">
              <span>{institution} · Spring Mount Institutions · 2025–26</span>
              <span className="font-mono">{portfolioYear}</span>
            </div>
          </div>
        )}

        {/* PAGE 12: BACK COVER & CAMPUS SKETCH */}
        {(viewMode === 'all-pages' || activePage === 12) && (
          <div className="storybook-page relative rounded-2xl overflow-hidden shadow-md bg-white border border-slate-300 min-h-[580px] p-8 flex flex-col justify-between print:rounded-none print:shadow-none print:min-h-[100vh]">
            <div>
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div className="flex items-center gap-3">
                    <span className="text-2xl font-serif italic text-slate-900 font-bold">
                    “{textValue(book?.teacherPhilosophyQuote, "Your child's story lives here.")}”
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-purple-900 tracking-wider">LEARN 360</span>
                  <p className="text-[9px] text-slate-500 uppercase">A Pedagogical Initiative by {institution}</p>
                </div>
              </div>

              {/* Campus Sketch Image */}
              <div className="my-6 rounded-xl overflow-hidden border border-slate-200 shadow-xs max-h-64 flex items-center justify-center bg-slate-50">
                {campusImg ? (
                  <img
                    src={campusImg}
                    alt="School Campus Sketch"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">Add a campus sketch in the Student Data sheet</div>
                )}
              </div>

              {/* Manifesto */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h4 className="text-base font-extrabold text-slate-900">
                    THIS IS NOT FOR YOU — UNLESS YOU:
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4 font-medium">
                    <li>believe learning is bigger than marks.</li>
                    <li>think a child's voice matters more than a number.</li>
                    <li>want to see what textbooks can't capture.</li>
                    <li>are ready to witness growth in 360°.</li>
                    <li>know every child is more than a report card.</li>
                  </ul>
                </div>

                <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div className="w-20 h-20 bg-slate-900 text-white mx-auto rounded-lg flex items-center justify-center shadow-xs">
                    <QrCode className="w-12 h-12 text-amber-400" />
                  </div>
                    <span className="text-[11px] font-bold text-slate-900 mt-2 block">
                    THIS SIDE SPEAKS: SCAN TO UNLOCK
                  </span>
                  <p className="text-[10px] text-slate-500">A QR code awaits, only for the curious.</p>
                </div>
              </div>
            </div>

            {/* Verification Line */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                Verified Official Record ID: <strong className="font-mono text-slate-800">{student.admissionNo}</strong>
              </div>
              <div className="flex items-center gap-4">
                <span>{institution}</span>
                <span>·</span>
                <span className="font-mono">{portfolioYear}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
