export interface AcademicSubject {
  name: string;
  score: number;
  maxScore: number;
  grade: string;
  remarks: string;
}

export interface SportsAchievement {
  title: string;
  event: string;
  level: 'School' | 'District' | 'Zonal' | 'State' | 'National';
  year: string;
  medal: 'Gold' | 'Silver' | 'Bronze' | 'Participation' | 'Captain';
}

export interface DisciplineRecord {
  date: string;
  category: 'Commendation' | 'Merit' | 'Notice' | 'Leadership';
  description: string;
  awardedBy: string;
}

export interface ExtracurricularCompetition {
  title: string;
  category: string;
  award: string;
  year: string;
}

export interface SELDimension {
  specifics: string;
  facultyObservation: string;
  studentReflection: string;
}

export interface StoryBookData {
  source?: 'excel';
  stage: string;
  institutionName: string;
  initiativeName: string;
  pedagogyTag: string;
  portfolioYear: string;
  dreamCareer: { title: string; illustrationUrl: string };
  familyPhotoUrl: string;
  familyQuote: string;
  classMontagePhotoUrl?: string;
  educatorPhotoUrl?: string;
  ecoActivityHours?: number;
  steamActivity: string;
  steamObservations: string[];
  steamOutcome: string;
  steamThinkerLevel: string;
  superHeroTrait: string;
  superHeroName: string;
  selRows?: {
    selfAwareness?: { faculty: string; student: string };
    selfManagement?: { faculty: string; student: string };
    socialAwareness?: { faculty: string; student: string };
    collaboration?: { faculty: string; student: string };
    problemSolving?: { faculty: string; student: string };
  };
  literacyScore?: number;
  literacyCharacter?: string;
  literacyTrait?: string;
  literacyCriteria?: Array<number | undefined>;
  numeracyScore?: number;
  numeracyCharacter?: string;
  numeracyTrait?: string;
  numeracyCriteria?: Array<number | undefined>;
  discoveryScore?: number;
  discoveryLevel?: string;
  discoveryCriteria?: Array<number | undefined>;
  discoveryVoices?: string[];
  grossMotorScore?: number;
  grossMotorGrade?: string;
  grossMotorStepsCompleted?: number;
  grossMotorActivityPhotoUrl?: string;
  grossMotorCriteria?: Array<number | undefined>;
  creativeArtsScore?: number;
  creativeArtsLevel?: string;
  artworkTitle?: string;
  artworkPhotoUrl?: string;
  creativeArtsCriteria?: Array<number | undefined>;
  cognitiveScore?: number;
  cognitiveLevel?: string;
  cognitiveBars?: {
    thinkingReasoning?: number;
    attentionMemory?: number;
    logicalSkills?: number;
    communicationSkills?: number;
    problemSolvingCreativity?: number;
  };
  ecoScore?: number;
  ecoLevel?: string;
  ecoPillars?: Array<number | undefined>;
  campusSketchUrl?: string;
  teacherPhilosophyQuote: string;
}

export interface Student {
  id: string;
  rollNo: string;
  admissionNo: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  grade: string;
  section: string;
  academicYear: string;
  house: 'Titans' | 'Spartans' | 'Phoenix' | 'Centaur';
  photoUrl: string;
  guardianName: string;
  guardianContact: string;
  email: string;
  bloodGroup: string;

  // Education / Academics
  subjects: AcademicSubject[];
  overallPercentage: number;
  gpa: number; // out of 4.0
  attendancePercentage: number;
  classRank: number;
  academicRemarks: string;

  // Sports & Athletics
  primarySport: string;
  secondarySports: string[];
  sportsRole: string; // e.g. 'Team Captain', 'Opening Batsman', 'Sprinter', 'Goalie'
  sportsAchievements: SportsAchievement[];
  fitnessGrade: 'A+' | 'A' | 'B+' | 'B';
  sportsRemarks: string;

  // Discipline & Conduct
  conductRating: 'Exemplary' | 'Good' | 'Satisfactory' | 'Needs Improvement';
  punctualityScore: number; // 0 - 100
  meritsCount: number;
  demeritsCount: number;
  leadershipRoles: string[];
  disciplineRecords: DisciplineRecord[];
  conductRemarks: string;

  // Extracurricular Activities
  clubs: string[];
  competitions: ExtracurricularCompetition[];
  communityServiceHours: number;
  specialTalents: string[];
  extracurricularRemarks: string;

  // General appraisal
  principalEndorsement: string;

  // Detailed "StoryBook of Learning" pedagogical model (matching the model PPT)
  storybook?: StoryBookData;
}

export type ViewMode = 'home' | 'spreadsheet' | 'portfolios' | 'portfolio-detail' | 'analytics';
export type SpreadsheetTab = 'all' | 'academics' | 'sports' | 'discipline' | 'extracurricular';
export type PortfolioPresentationMode = 'storybook' | 'official-dossier';
