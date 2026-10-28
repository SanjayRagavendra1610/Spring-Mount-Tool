import type { Student } from '../types/student';

// These are fictional demo entries. Do not add real student records or contact details here.
const demoProfiles: Array<{
  rollNo: string;
  grade: string;
  section: string;
  house: Student['house'];
  sport: string;
  talent: string;
}> = [
  { rollNo: '10-A-01', grade: 'Grade 10', section: 'A', house: 'Titans', sport: 'Basketball', talent: 'Teamwork' },
  { rollNo: '10-A-02', grade: 'Grade 10', section: 'A', house: 'Phoenix', sport: 'Swimming', talent: 'Creative writing' },
  { rollNo: '10-A-03', grade: 'Grade 10', section: 'A', house: 'Centaur', sport: 'Volleyball', talent: 'Visual arts' },
  { rollNo: '10-B-01', grade: 'Grade 10', section: 'B', house: 'Spartans', sport: 'Cricket', talent: 'Problem solving' },
  { rollNo: '10-B-02', grade: 'Grade 10', section: 'B', house: 'Phoenix', sport: 'Tennis', talent: 'Science communication' },
  { rollNo: '11-A-01', grade: 'Grade 11', section: 'A', house: 'Titans', sport: 'Track and field', talent: 'Peer mentoring' },
  { rollNo: '03-A-01', grade: 'Grade 3', section: 'A', house: 'Centaur', sport: 'Play and movement', talent: 'Storytelling' },
];

export const SCHOOL_INFO = {
  name: 'Spring Mount School',
  shortName: 'Spring Mount School',
  motto: 'Learning through curiosity and care',
  founded: '—',
  affiliation: '—',
  address: '—',
  phone: '—',
  email: 'contact@example.invalid',
  website: 'example.invalid',
  academicSession: 'Demo data · 2025–2026',
  principal: 'School Administrator',
};

export const initialStudents: Student[] = demoProfiles.map((profile, index): Student => {
  const number = String(index + 1).padStart(2, '0');
  const score = 84 + index * 2;

  return {
    id: 'demo-student-' + number,
    rollNo: profile.rollNo,
    admissionNo: 'DEMO-' + String(index + 1).padStart(3, '0'),
    fullName: 'Demo Student ' + number,
    gender: 'Other',
    dob: '',
    grade: profile.grade,
    section: profile.section,
    academicYear: '2025-2026',
    house: profile.house,
    photoUrl: '/demo-avatar.svg',
    guardianName: 'Demo Guardian',
    guardianContact: 'Not provided',
    email: 'demo@example.invalid',
    bloodGroup: 'Not provided',

    subjects: [
      { name: 'Mathematics', score, maxScore: 100, grade: 'Sample', remarks: 'Fictional demo value.' },
      { name: 'Language Arts', score: Math.min(score + 2, 100), maxScore: 100, grade: 'Sample', remarks: 'Fictional demo value.' },
      { name: 'Science', score: Math.max(score - 2, 0), maxScore: 100, grade: 'Sample', remarks: 'Fictional demo value.' },
    ],
    overallPercentage: score,
    gpa: Number((3.1 + index * 0.1).toFixed(2)),
    attendancePercentage: 92 + index,
    classRank: index + 1,
    academicRemarks: 'Sample academic profile for interface demonstration only.',

    primarySport: profile.sport,
    secondarySports: [],
    sportsRole: 'Demo team member',
    sportsAchievements: [],
    fitnessGrade: 'A',
    sportsRemarks: 'Sample sports profile for interface demonstration only.',

    conductRating: 'Good',
    punctualityScore: 90 + index,
    meritsCount: index,
    demeritsCount: 0,
    leadershipRoles: [],
    disciplineRecords: [],
    conductRemarks: 'No individual conduct records are included in the demo data.',

    clubs: ['Demo Learning Club'],
    competitions: [],
    communityServiceHours: 0,
    specialTalents: [profile.talent],
    extracurricularRemarks: 'Sample extracurricular profile for interface demonstration only.',
    principalEndorsement: 'This is a fictional demo entry and does not describe a real student.',

    ...(index === 0 ? {
      storybook: {
        stage: profile.grade + ' ' + profile.section,
        institutionName: 'SPRING MOUNT SCHOOL · DEMO',
        initiativeName: 'Sample Learning Portfolio',
        pedagogyTag: 'LEARN 360',
        portfolioYear: 'DEMO PORTFOLIO',
        dreamCareer: { title: 'Sample career', illustrationUrl: '/demo-placeholder.svg' },
        familyPhotoUrl: '',
        familyQuote: 'A sample quote for the demonstration.',
        classMontagePhotoUrl: '',
        educatorPhotoUrl: '',
        ecoActivityHours: 0,
        steamActivity: 'Bridge building',
        steamObservations: ['Plans an idea.', 'Builds a first version.', 'Reflects on the result.'],
        steamOutcome: 'A fictional example of a classroom learning activity.',
        steamThinkerLevel: '01 OBSERVER',
        superHeroTrait: 'Curiosity',
        superHeroName: 'Demo Hero',
        selRows: {
          selfAwareness: { faculty: 'Sample observation.', student: 'I can describe my idea.' },
          selfManagement: { faculty: 'Sample observation.', student: 'I can keep trying.' },
          socialAwareness: { faculty: 'Sample observation.', student: 'I can listen to others.' },
          collaboration: { faculty: 'Sample observation.', student: 'I can share a task.' },
          problemSolving: { faculty: 'Sample observation.', student: 'I can ask a question.' },
        },
        literacyScore: 20,
        literacyCharacter: 'DEMO READER',
        literacyTrait: 'PRACTICE AND CURIOSITY',
        literacyCriteria: [4, 4, 4, 4, 4],
        numeracyScore: 20,
        numeracyCharacter: 'DEMO THINKER',
        numeracyTrait: 'LEARNING STEP BY STEP',
        numeracyCriteria: [4, 4, 4, 4, 4],
        discoveryScore: 20,
        discoveryLevel: 'PASSAGE',
        discoveryCriteria: [4, 4, 4, 4, 4],
        discoveryVoices: ['I notice details.', 'I ask questions.', 'I try different ideas.', 'I use tools carefully.', 'I explain what I learned.'],
        grossMotorScore: 20,
        grossMotorGrade: 'A',
        grossMotorStepsCompleted: 20,
        grossMotorCriteria: [4, 4, 4, 4, 4],
        creativeArtsScore: 20,
        creativeArtsLevel: 'SAMPLE',
        artworkTitle: 'Demo artwork',
        artworkPhotoUrl: '',
        creativeArtsCriteria: [4, 4, 4, 4, 4],
        cognitiveScore: 20,
        cognitiveLevel: 'NOESIS',
        cognitiveBars: {
          thinkingReasoning: 4,
          attentionMemory: 4,
          logicalSkills: 4,
          communicationSkills: 4,
          problemSolvingCreativity: 4,
        },
        ecoScore: 20,
        ecoLevel: 'BLOSSOM',
        ecoPillars: [4, 4, 4, 4, 4],
        campusSketchUrl: '/demo-placeholder.svg',
        teacherPhilosophyQuote: 'Every learner grows at their own pace.',
      },
    } : {}),
  };
});
