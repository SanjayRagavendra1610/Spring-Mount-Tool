import React, { useState, useMemo, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  RefreshCw, 
  FileText,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Student, SpreadsheetTab } from '../types/student';
import { exportRosterToExcel, downloadExcelTemplate, importRosterFromExcel } from '../utils/excelEngine';
import { downloadBatchPortfoliosHtml } from '../utils/portfolioExport';

interface SpreadsheetGridProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onImportStudents: (newStudents: Student[]) => { added: number; updated: number };
  onResetSampleData: () => void;
  onUpdateStudentDirectly: (updated: Student) => void;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  students,
  onSelectStudent,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteStudent,
  onImportStudents,
  onResetSampleData,
  onUpdateStudentDirectly
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<SpreadsheetTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [houseFilter, setHouseFilter] = useState('All');
  const [conductFilter, setConductFilter] = useState('All');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Student | 'gpa' | 'overallPercentage' | 'attendancePercentage'>('rollNo');
  const [sortAsc, setSortAsc] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Inline editing state
  const [editingCell, setEditingCell] = useState<{ studentId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Import the workbook and any image files referenced by its image columns.
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const workbookFiles = selectedFiles.filter(file => /\.(xlsx|xls|csv)$/i.test(file.name));
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name));
    const unsupportedFiles = selectedFiles.filter(file => !workbookFiles.includes(file) && !imageFiles.includes(file));
    if (workbookFiles.length !== 1 || unsupportedFiles.length > 0) {
      showNotification('Select one Excel/CSV workbook and only the image files referenced in its image columns.', 'error');
      e.target.value = '';
      return;
    }

    setIsImporting(true);
    try {
      const result = await importRosterFromExcel(workbookFiles[0], imageFiles);
      if (result.error) {
        showNotification(result.error, 'error');
      } else if (result.students.length > 0) {
        const counts = onImportStudents(result.students);
        const summary = [
          `${result.count} portfolio${result.count === 1 ? '' : 's'} imported`,
          `${counts.added} added`,
          `${counts.updated} updated`,
        ].join(' · ');
        showNotification(`${summary}. The first portfolio is open.`, 'success');
      } else {
        showNotification('No student rows found. Fill in Admission ID and Student Full Name.', 'error');
      }
    } catch (err) {
      showNotification(`Failed to read the workbook: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Search across name, roll, sport, clubs, email
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        s.fullName.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.primarySport.toLowerCase().includes(q) ||
        s.clubs.some(c => c.toLowerCase().includes(q)) ||
        s.email.toLowerCase().includes(q)
      );

      const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
      const matchesHouse = houseFilter === 'All' || s.house === houseFilter;
      const matchesConduct = conductFilter === 'All' || s.conductRating === conductFilter;

      return matchesSearch && matchesGrade && matchesHouse && matchesConduct;
    }).sort((a, b) => {
      let valA: any = (a as any)[sortField];
      let valB: any = (b as any)[sortField];

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [students, searchQuery, gradeFilter, houseFilter, conductFilter, sortField, sortAsc]);

  const toggleSort = (field: any) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    const toExport = students.filter(s => selectedStudentIds.includes(s.id));
    if (toExport.length === 0) {
      exportRosterToExcel(students);
      showNotification('Exported all students to Excel.', 'success');
    } else {
      exportRosterToExcel(toExport);
      showNotification(`Exported ${toExport.length} selected students to Excel.`, 'success');
    }
  };

  const handleDeleteSelected = () => {
    if (selectedStudentIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedStudentIds.length} selected student(s)?`)) {
      selectedStudentIds.forEach(id => onDeleteStudent(id));
      setSelectedStudentIds([]);
      showNotification('Selected students removed from registry.', 'success');
    }
  };

  // Start inline editing
  const startEdit = (studentId: string, field: string, initialValue: any) => {
    setEditingCell({ studentId, field });
    setEditValue(String(initialValue ?? ''));
  };

  const saveEdit = (student: Student) => {
    if (!editingCell) return;
    const { field } = editingCell;
    const updated = { ...student };

    if (field === 'overallPercentage') {
      const num = parseFloat(editValue);
      if (!isNaN(num)) updated.overallPercentage = Math.min(100, Math.max(0, num));
    } else if (field === 'gpa') {
      const num = parseFloat(editValue);
      if (!isNaN(num)) updated.gpa = Math.min(4.0, Math.max(0, num));
    } else if (field === 'attendancePercentage') {
      const num = parseFloat(editValue);
      if (!isNaN(num)) updated.attendancePercentage = Math.min(100, Math.max(0, num));
    } else if (field === 'primarySport') {
      updated.primarySport = editValue.trim() || updated.primarySport;
    } else if (field === 'conductRating') {
      if (['Exemplary', 'Good', 'Satisfactory', 'Needs Improvement'].includes(editValue)) {
        updated.conductRating = editValue as any;
      }
    } else if (field === 'house') {
      if (['Titans', 'Spartans', 'Phoenix', 'Centaur'].includes(editValue)) {
        updated.house = editValue as any;
      }
    }

    onUpdateStudentDirectly(updated);
    setEditingCell(null);
    showNotification(`Updated ${field} for ${student.fullName}.`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between border ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Excel Operation Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            Master Roster
          </button>

          <button
            onClick={() => setActiveTab('academics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'academics' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Academics
          </button>

          <button
            onClick={() => setActiveTab('sports')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sports' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            Sports
          </button>

          <button
            onClick={() => setActiveTab('discipline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'discipline' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Discipline
          </button>

          <button
            onClick={() => setActiveTab('extracurricular')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'extracurricular' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Extracurricular
          </button>
        </div>

        {/* Right: Excel actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv,.jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Select one workbook and any image files named in its image columns."
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            {isImporting ? 'Importing...' : 'Import Excel + Photos'}
          </button>

          <button
            onClick={() => exportRosterToExcel(students)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download multi-tab Excel Workbook (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Excel
          </button>

          <button
            onClick={downloadExcelTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download the StoryBook student template with portfolio fields and image instructions."
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            StoryBook Excel Template
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

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, roll number, sport, club..."
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

            <select
              value={conductFilter}
              onChange={(e) => setConductFilter(e.target.value)}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
            >
              <option value="All">All Conduct</option>
              <option value="Exemplary">Exemplary</option>
              <option value="Good">Good</option>
              <option value="Satisfactory">Satisfactory</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>
        </div>

        {/* Selected batch operations */}
        <div className="flex items-center gap-2 text-slate-500">
          {selectedStudentIds.length > 0 && (
            <div className="flex items-center gap-2 mr-2 bg-slate-100 px-2.5 py-1 rounded-md">
              <span className="font-semibold text-slate-900">{selectedStudentIds.length} selected</span>
              <button
                onClick={() => {
                  const toDownload = students.filter(s => selectedStudentIds.includes(s.id));
                  downloadBatchPortfoliosHtml(toDownload, `Selected Students Portfolios (${toDownload.length})`);
                  showNotification(`Downloaded ${toDownload.length} portfolios booklet!`, 'success');
                }}
                className="text-indigo-700 hover:text-indigo-800 font-semibold underline cursor-pointer"
                title="Download combined portfolio document for selected students"
              >
                Download Portfolios
              </button>
              <span>·</span>
              <button
                onClick={handleExportSelected}
                className="text-emerald-700 hover:text-emerald-800 font-medium underline cursor-pointer"
              >
                Excel
              </button>
              <span>·</span>
              <button
                onClick={handleDeleteSelected}
                className="text-rose-600 hover:text-rose-700 font-medium underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}

          <span className="font-mono tabular-nums">
            Showing {filteredStudents.length} of {students.length} students
          </span>

          <button
            onClick={onResetSampleData}
            title="Reset to default roster"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-12 text-center">Photo</th>
                <th 
                  onClick={() => toggleSort('rollNo')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Roll No</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('fullName')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">Grade & Sec</th>
                <th className="py-3 px-3">House</th>

                {/* DYNAMIC COLUMNS BASED ON ACTIVE TAB */}
                {(activeTab === 'all' || activeTab === 'academics') && (
                  <>
                    <th 
                      onClick={() => toggleSort('overallPercentage')}
                      className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Academic %</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => toggleSort('gpa')}
                      className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>GPA</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th 
                      onClick={() => toggleSort('attendancePercentage')}
                      className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Attendance</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </>
                )}

                {(activeTab === 'all' || activeTab === 'sports') && (
                  <>
                    <th className="py-3 px-3">Primary Sport</th>
                    <th className="py-3 px-3">Athletic Role</th>
                    <th className="py-3 px-3 text-center">Fitness</th>
                    <th className="py-3 px-3">Medals</th>
                  </>
                )}

                {(activeTab === 'all' || activeTab === 'discipline') && (
                  <>
                    <th className="py-3 px-3">Conduct</th>
                    <th className="py-3 px-3 text-right">Punctuality</th>
                    <th className="py-3 px-3 text-center">Merits / Demerits</th>
                  </>
                )}

                {(activeTab === 'all' || activeTab === 'extracurricular') && (
                  <>
                    <th className="py-3 px-3">Enrolled Clubs</th>
                    <th className="py-3 px-3 text-right">Service Hrs</th>
                    <th className="py-3 px-3">Key Talent</th>
                  </>
                )}

                <th className="py-3 px-3 text-center w-28">Portfolio Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);

                  return (
                    <tr 
                      key={student.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(student.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="py-2.5 px-3 text-center">
                        <div 
                          onClick={() => onSelectStudent(student)}
                          className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 mx-auto cursor-pointer border border-slate-200 hover:ring-2 hover:ring-slate-900"
                          title="Open portfolio"
                        >
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.fullName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {student.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                        {student.rollNo}
                      </td>

                      {/* Full Name */}
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                        >
                          {student.fullName}
                        </button>
                      </td>

                      {/* Grade & Section */}
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {student.grade} - {student.section}
                      </td>

                      {/* House */}
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          student.house === 'Titans' ? 'bg-indigo-50 text-indigo-700' :
                          student.house === 'Phoenix' ? 'bg-rose-50 text-rose-700' :
                          student.house === 'Spartans' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {student.house}
                        </span>
                      </td>

                      {/* TAB: ACADEMICS */}
                      {(activeTab === 'all' || activeTab === 'academics') && (
                        <>
                          {/* Academic % (Inline Editable) */}
                          <td 
                            className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-slate-800 cursor-pointer hover:bg-slate-100/80"
                            onClick={() => startEdit(student.id, 'overallPercentage', student.overallPercentage)}
                          >
                            {editingCell?.studentId === student.id && editingCell?.field === 'overallPercentage' ? (
                              <div className="flex items-center justify-end gap-1">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-16 p-1 text-right text-xs border rounded bg-white"
                                  autoFocus
                                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(student)}
                                />
                                <button onClick={() => saveEdit(student)} className="text-emerald-600"><Check className="w-3 h-3" /></button>
                                <button onClick={() => setEditingCell(null)} className="text-rose-600"><X className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <span>{student.overallPercentage}%</span>
                            )}
                          </td>

                          {/* GPA (Inline Editable) */}
                          <td 
                            className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-blue-700 cursor-pointer hover:bg-slate-100/80"
                            onClick={() => startEdit(student.id, 'gpa', student.gpa)}
                          >
                            {editingCell?.studentId === student.id && editingCell?.field === 'gpa' ? (
                              <div className="flex items-center justify-end gap-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-14 p-1 text-right text-xs border rounded bg-white"
                                  autoFocus
                                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(student)}
                                />
                                <button onClick={() => saveEdit(student)} className="text-emerald-600"><Check className="w-3 h-3" /></button>
                                <button onClick={() => setEditingCell(null)} className="text-rose-600"><X className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <span>{student.gpa.toFixed(2)}</span>
                            )}
                          </td>

                          {/* Attendance */}
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                            {student.attendancePercentage}%
                          </td>
                        </>
                      )}

                      {/* TAB: SPORTS */}
                      {(activeTab === 'all' || activeTab === 'sports') && (
                        <>
                          <td 
                            className="py-2.5 px-3 font-medium text-slate-800 cursor-pointer hover:bg-slate-100/80"
                            onClick={() => startEdit(student.id, 'primarySport', student.primarySport)}
                          >
                            {editingCell?.studentId === student.id && editingCell?.field === 'primarySport' ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-28 p-1 text-xs border rounded bg-white"
                                  autoFocus
                                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(student)}
                                />
                                <button onClick={() => saveEdit(student)} className="text-emerald-600"><Check className="w-3 h-3" /></button>
                                <button onClick={() => setEditingCell(null)} className="text-rose-600"><X className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <span>{student.primarySport}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 truncate max-w-[130px]" title={student.sportsRole}>
                            {student.sportsRole || 'Varsity'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="font-mono font-bold text-slate-700">{student.fitnessGrade}</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {student.sportsAchievements.length > 0 ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                <Trophy className="w-3 h-3" />
                                {student.sportsAchievements[0].medal} ({student.sportsAchievements.length})
                              </span>
                            ) : (
                              <span className="text-slate-400">Regular</span>
                            )}
                          </td>
                        </>
                      )}

                      {/* TAB: DISCIPLINE */}
                      {(activeTab === 'all' || activeTab === 'discipline') && (
                        <>
                          <td 
                            className="py-2.5 px-3 cursor-pointer hover:bg-slate-100/80"
                            onClick={() => startEdit(student.id, 'conductRating', student.conductRating)}
                          >
                            {editingCell?.studentId === student.id && editingCell?.field === 'conductRating' ? (
                              <div className="flex items-center gap-1">
                                <select
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="p-1 text-xs border rounded bg-white"
                                  autoFocus
                                >
                                  <option value="Exemplary">Exemplary</option>
                                  <option value="Good">Good</option>
                                  <option value="Satisfactory">Satisfactory</option>
                                  <option value="Needs Improvement">Needs Improvement</option>
                                </select>
                                <button onClick={() => saveEdit(student)} className="text-emerald-600"><Check className="w-3 h-3" /></button>
                                <button onClick={() => setEditingCell(null)} className="text-rose-600"><X className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                student.conductRating === 'Exemplary' ? 'bg-emerald-50 text-emerald-700' :
                                student.conductRating === 'Good' ? 'bg-blue-50 text-blue-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>
                                {student.conductRating}
                              </span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                            {student.punctualityScore}%
                          </td>

                          <td className="py-2.5 px-3 text-center font-mono tabular-nums">
                            <span className="text-emerald-600 font-bold">+{student.meritsCount}</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-rose-600">-{student.demeritsCount}</span>
                          </td>
                        </>
                      )}

                      {/* TAB: EXTRACURRICULAR */}
                      {(activeTab === 'all' || activeTab === 'extracurricular') && (
                        <>
                          <td className="py-2.5 px-3 text-slate-700 truncate max-w-[150px]" title={student.clubs.join(', ')}>
                            {student.clubs.slice(0, 2).join(', ')}{student.clubs.length > 2 ? ` +${student.clubs.length - 2}` : ''}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-purple-700 font-medium">
                            {student.communityServiceHours} hrs
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 truncate max-w-[120px]">
                            {student.specialTalents[0] || 'N/A'}
                          </td>
                        </>
                      )}

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Generate and view full student portfolio dossier"
                          >
                            <FileText className="w-3 h-3 text-amber-400" />
                            Portfolio
                          </button>

                          <button
                            onClick={() => onOpenEditModal(student)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Edit student record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${student.fullName}?`)) onDeleteStudent(student.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No students match your search or filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setGradeFilter('All');
                        setHouseFilter('All');
                        setConductFilter('All');
                      }}
                      className="mt-2 text-xs text-indigo-600 font-semibold underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
