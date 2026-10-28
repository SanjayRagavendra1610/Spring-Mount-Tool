import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2, Check, GraduationCap, Trophy, ShieldCheck, Sparkles, User } from 'lucide-react';
import { Student, AcademicSubject, SportsAchievement, DisciplineRecord, ExtracurricularCompetition } from '../types/student';

interface StudentFormModalProps {
  initialStudent?: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  initialStudent,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'academics' | 'sports' | 'discipline' | 'extracurricular'>('basic');

  // Form State
  const [formData, setFormData] = useState<Student>(() => {
    if (initialStudent) return JSON.parse(JSON.stringify(initialStudent));

    return {
      id: `std-${Date.now()}`,
      rollNo: '10-A-15',
      admissionNo: `ADM-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: '',
      gender: 'Male',
      dob: '2010-01-01',
      grade: 'Grade 10',
      section: 'A',
      academicYear: '2025-2026',
      house: 'Titans',
      photoUrl: '',
      guardianName: '',
      guardianContact: '',
      email: '',
      bloodGroup: 'O+',

      overallPercentage: 88,
      gpa: 3.6,
      attendancePercentage: 96,
      classRank: 5,
      academicRemarks: 'Diligent student with consistent engagement in class discussions.',
      subjects: [
        { name: 'Mathematics', score: 88, maxScore: 100, grade: 'A', remarks: 'Good analytical grasp' },
        { name: 'Sciences', score: 90, maxScore: 100, grade: 'A', remarks: 'Thorough experiment logs' },
        { name: 'English Literature', score: 86, maxScore: 100, grade: 'B+', remarks: 'Strong essay writing' },
        { name: 'Social Studies', score: 88, maxScore: 100, grade: 'A', remarks: 'Active participation' }
      ],

      primarySport: 'Basketball',
      secondarySports: ['Athletics'],
      sportsRole: 'Point Guard',
      fitnessGrade: 'A',
      sportsRemarks: 'Committed to team training and positive sportsmanship.',
      sportsAchievements: [
        { title: 'Inter-School Tournament', event: 'Varsity Meet', level: 'District', year: '2025', medal: 'Gold' }
      ],

      conductRating: 'Exemplary',
      punctualityScore: 98,
      meritsCount: 10,
      demeritsCount: 0,
      leadershipRoles: ['Class Monitor'],
      disciplineRecords: [
        { date: '2025-10-10', category: 'Merit', description: 'Assisted faculty in organizing campus science fair.', awardedBy: 'Homeroom Advisor' }
      ],
      conductRemarks: 'Displays exemplary discipline, honesty, and cooperative conduct.',

      clubs: ['Robotics Club', 'Debate Society'],
      communityServiceHours: 30,
      specialTalents: ['Public Speaking', 'Coding'],
      competitions: [
        { title: 'Regional STEM Challenge', category: 'Robotics', award: 'Finalist', year: '2025' }
      ],
      extracurricularRemarks: 'Active participant in weekend community drives and club hackathons.',

      principalEndorsement: 'A promising student displaying high integrity and well-rounded scholastic commitment.'
    };
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectChange = (index: number, field: keyof AcademicSubject, value: any) => {
    setFormData(prev => {
      const updated = [...prev.subjects];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto-recalculate average if score changes
      if (field === 'score') {
        const total = updated.reduce((sum, s) => sum + (Number(s.score) || 0), 0);
        const avg = Math.round((total / updated.length) * 10) / 10;
        const calcGpa = Number(((avg / 100) * 4).toFixed(2));
        return {
          ...prev,
          subjects: updated,
          overallPercentage: avg,
          gpa: calcGpa
        };
      }
      return { ...prev, subjects: updated };
    });
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { name: 'New Subject', score: 85, maxScore: 100, grade: 'A', remarks: 'Good work' }]
    }));
  };

  const removeSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      sportsAchievements: [
        ...prev.sportsAchievements,
        { title: 'New Sports Award', event: 'School Meet', level: 'School', year: '2025', medal: 'Gold' }
      ]
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sportsAchievements: prev.sportsAchievements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Please enter student full name.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialStudent ? `Edit Student: ${initialStudent.fullName}` : 'Add New Student Record'}
            </h3>
            <p className="text-xs text-slate-500">
              Record comprehensive student information for Excel synchronization and portfolio generation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'basic' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            General & Identification
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academics')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'academics' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Education & Academics
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sports')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sports' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            Sports & Athletics
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discipline')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'discipline' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Discipline & Conduct
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('extracurricular')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'extracurricular' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Extracurricular Activities
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: BASIC INFORMATION & PHOTO */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Photo Upload & Preview */}
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white border-2 border-slate-200 shrink-0">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-2">
                      <User className="w-8 h-8 text-slate-300 mb-1" />
                      <span>No Photo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900">Student Profile Photo</h4>
                  <p className="text-xs text-slate-500">
                    Upload a high resolution student photo for official yearbook and portfolio generation
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Photo File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                        className="text-xs text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="e.g. Demo Student"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, admissionNo: e.target.value }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value.toUpperCase() }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">House</label>
                  <select
                    value={formData.house}
                    onChange={(e) => setFormData(prev => ({ ...prev, house: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="Titans">Titans</option>
                    <option value="Phoenix">Phoenix</option>
                    <option value="Spartans">Spartans</option>
                    <option value="Centaur">Centaur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                    placeholder="e.g. David Chen"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Contact Phone</label>
                  <input
                    type="text"
                    value={formData.guardianContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, guardianContact: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student School Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="student@school.edu"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Principal's Cumulative Endorsement</label>
                <textarea
                  rows={2}
                  value={formData.principalEndorsement}
                  onChange={(e) => setFormData(prev => ({ ...prev, principalEndorsement: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMICS & EDUCATION */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overall Academic %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.overallPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, overallPercentage: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GPA (4.0 Scale)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.gpa}
                    onChange={(e) => setFormData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attendance %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.attendancePercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, attendancePercentage: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Subject Rows */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Curriculum Subjects & Scores
                  </h4>
                  <button
                    type="button"
                    onClick={addSubject}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Subject
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.subjects.map((subj, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={subj.name}
                        onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded font-medium"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Score:</span>
                        <input
                          type="number"
                          value={subj.score}
                          onChange={(e) => handleSubjectChange(idx, 'score', parseFloat(e.target.value) || 0)}
                          className="w-16 p-1.5 text-right font-mono bg-white border border-slate-200 rounded font-medium"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Grade"
                        value={subj.grade}
                        onChange={(e) => handleSubjectChange(idx, 'grade', e.target.value)}
                        className="w-14 p-1.5 text-center font-mono bg-white border border-slate-200 rounded font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Teacher Remarks"
                        value={subj.remarks}
                        onChange={(e) => handleSubjectChange(idx, 'remarks', e.target.value)}
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded text-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubject(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Academic Dean Appraisal</label>
                <textarea
                  rows={2}
                  value={formData.academicRemarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicRemarks: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SPORTS & ATHLETICS */}
          {activeTab === 'sports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Sport</label>
                  <input
                    type="text"
                    value={formData.primarySport}
                    onChange={(e) => setFormData(prev => ({ ...prev, primarySport: e.target.value }))}
                    placeholder="e.g. Basketball, Track & Field, Swimming"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Athletic Role / Position</label>
                  <input
                    type="text"
                    value={formData.sportsRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, sportsRole: e.target.value }))}
                    placeholder="e.g. Captain, Point Guard, Sprinter"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fitness Evaluation</label>
                  <select
                    value={formData.fitnessGrade}
                    onChange={(e) => setFormData(prev => ({ ...prev, fitnessGrade: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="A+">Grade A+ (Elite Conditioning)</option>
                    <option value="A">Grade A (Optimal Fitness)</option>
                    <option value="B+">Grade B+ (Good Fitness)</option>
                    <option value="B">Grade B (Developing)</option>
                  </select>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Sports Achievements & Medals
                  </h4>
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Achievement
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.sportsAchievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <input
                        type="text"
                        placeholder="Championship Title"
                        value={ach.title}
                        onChange={(e) => {
                          const updated = [...formData.sportsAchievements];
                          updated[idx].title = e.target.value;
                          setFormData(prev => ({ ...prev, sportsAchievements: updated }));
                        }}
                        className="flex-1 p-1.5 bg-white border border-slate-200 rounded font-medium"
                      />
                      <select
                        value={ach.medal}
                        onChange={(e) => {
                          const updated = [...formData.sportsAchievements];
                          updated[idx].medal = e.target.value as any;
                          setFormData(prev => ({ ...prev, sportsAchievements: updated }));
                        }}
                        className="w-24 p-1.5 bg-white border border-slate-200 rounded cursor-pointer"
                      >
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Captain">Captain</option>
                        <option value="Participation">Participation</option>
                      </select>
                      <select
                        value={ach.level}
                        onChange={(e) => {
                          const updated = [...formData.sportsAchievements];
                          updated[idx].level = e.target.value as any;
                          setFormData(prev => ({ ...prev, sportsAchievements: updated }));
                        }}
                        className="w-24 p-1.5 bg-white border border-slate-200 rounded cursor-pointer"
                      >
                        <option value="School">School</option>
                        <option value="District">District</option>
                        <option value="Zonal">Zonal</option>
                        <option value="State">State</option>
                        <option value="National">National</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Year"
                        value={ach.year}
                        onChange={(e) => {
                          const updated = [...formData.sportsAchievements];
                          updated[idx].year = e.target.value;
                          setFormData(prev => ({ ...prev, sportsAchievements: updated }));
                        }}
                        className="w-16 p-1.5 text-center font-mono bg-white border border-slate-200 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeAchievement(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Athletic Coach Remarks</label>
                <textarea
                  rows={2}
                  value={formData.sportsRemarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, sportsRemarks: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 4: DISCIPLINE & CONDUCT */}
          {activeTab === 'discipline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Conduct Evaluation</label>
                  <select
                    value={formData.conductRating}
                    onChange={(e) => setFormData(prev => ({ ...prev, conductRating: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="Exemplary">Exemplary</option>
                    <option value="Good">Good</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Punctuality Score (%)</label>
                  <input
                    type="number"
                    value={formData.punctualityScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, punctualityScore: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Merits Count</label>
                  <input
                    type="number"
                    value={formData.meritsCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, meritsCount: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Demerits Count</label>
                  <input
                    type="number"
                    value={formData.demeritsCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, demeritsCount: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Leadership Roles (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.leadershipRoles.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    leadershipRoles: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }))}
                  placeholder="e.g. Class Monitor, Head Prefect, House Captain"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Discipline Faculty Appraisal</label>
                <textarea
                  rows={2}
                  value={formData.conductRemarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, conductRemarks: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 5: EXTRACURRICULAR ACTIVITIES */}
          {activeTab === 'extracurricular' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enrolled Clubs & Societies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.clubs.join(', ')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      clubs: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="e.g. Robotics Club, Debate Society, Model UN"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Community Service Hours</label>
                  <input
                    type="number"
                    value={formData.communityServiceHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, communityServiceHours: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full p-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-purple-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Special Talents & Abilities (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.specialTalents.join(', ')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specialTalents: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="e.g. Classical Piano, Speed Chess, Python Programming"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Extracurricular Advisor Notes</label>
                <textarea
                  rows={2}
                  value={formData.extracurricularRemarks}
                  onChange={(e) => setFormData(prev => ({ ...prev, extracurricularRemarks: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

        </form>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            {initialStudent ? 'Save Changes' : 'Create Student Profile'}
          </button>
        </div>

      </div>
    </div>
  );
};
