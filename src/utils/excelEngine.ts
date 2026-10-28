import * as XLSX from 'xlsx';
import { Student, StoryBookData } from '../types/student';
import { savePortfolioImage } from './mediaStore';
import { SCHOOL_INFO } from '../data/initialStudents';

/**
 * Exports all students into a structured multi-tab Excel workbook (.xlsx)
 */
export function exportRosterToExcel(students: Student[], schoolName = SCHOOL_INFO.shortName) {
  const wb = XLSX.utils.book_new();

  // 1. MASTER SHEET
  const masterData = students.map((s, idx) => ({
    'S.No': idx + 1,
    'Roll Number': s.rollNo,
    'Admission ID': s.admissionNo,
    'Student Full Name': s.fullName,
    'Gender': s.gender,
    'Date of Birth': s.dob,
    'Grade': s.grade,
    'Section': s.section,
    'House': s.house,
    'Overall Academic %': s.overallPercentage,
    'GPA (4.0 Scale)': s.gpa,
    'Attendance %': s.attendancePercentage,
    'Class Rank': s.classRank,
    'Primary Sport': s.primarySport,
    'Sports Role / Position': s.sportsRole,
    'Fitness Grade': s.fitnessGrade,
    'Sports Medals': s.sportsAchievements.map((a) => `${a.medal}: ${a.title} (${a.year})`).join('; ') || 'None',
    'Discipline Conduct': s.conductRating,
    'Punctuality Score (%)': s.punctualityScore,
    'Merits Count': s.meritsCount,
    'Demerits Count': s.demeritsCount,
    'Leadership Roles': s.leadershipRoles.join(', ') || 'Student Member',
    'Extracurricular Clubs': s.clubs.join(', ') || 'General',
    'Community Service Hours': s.communityServiceHours,
    'Special Talents': s.specialTalents.join(', ') || 'N/A',
    'Competitions Won': s.competitions.map((c) => `${c.award} - ${c.title}`).join('; ') || 'N/A',
    'Guardian Name': s.guardianName,
    'Guardian Contact': s.guardianContact,
    'Student Email': s.email,
    'Blood Group': s.bloodGroup,
    'Photo URL': s.photoUrl,
    'Principal Endorsement': s.principalEndorsement
  }));

  const masterWs = XLSX.utils.json_to_sheet(masterData);
  XLSX.utils.book_append_sheet(wb, masterWs, 'Master Student Registry');

  // 2. EDUCATION / ACADEMICS SHEET
  const academicsData = students.map(s => {
    const subjectsMap: Record<string, string | number> = {};
    s.subjects.forEach((subj) => {
      subjectsMap[`${subj.name} (Score)`] = subj.score;
      subjectsMap[`${subj.name} (Grade)`] = subj.grade;
    });

    return {
      'Roll Number': s.rollNo,
      'Student Name': s.fullName,
      'Grade & Section': `${s.grade} - ${s.section}`,
      'Overall %': s.overallPercentage,
      'GPA': s.gpa,
      'Attendance %': s.attendancePercentage,
      'Class Rank': s.classRank,
      ...subjectsMap,
      'Academic Faculty Remarks': s.academicRemarks
    };
  });
  const academicsWs = XLSX.utils.json_to_sheet(academicsData);
  XLSX.utils.book_append_sheet(wb, academicsWs, 'Education & Academics');

  // 3. SPORTS & ATHLETICS SHEET
  const sportsData = students.map(s => ({
    'Roll Number': s.rollNo,
    'Student Name': s.fullName,
    'House': s.house,
    'Primary Sport': s.primarySport,
    'Secondary Sports': s.secondarySports.join(', '),
    'Athletic Role': s.sportsRole,
    'Fitness Grade': s.fitnessGrade,
    'Honors & Medals Count': s.sportsAchievements.length,
    'Notable Achievements': s.sportsAchievements.map((a) => `[${a.level}] ${a.medal} - ${a.title} (${a.event}, ${a.year})`).join(' | '),
    'Coach Remarks': s.sportsRemarks
  }));
  const sportsWs = XLSX.utils.json_to_sheet(sportsData);
  XLSX.utils.book_append_sheet(wb, sportsWs, 'Sports & Athletics');

  // 4. DISCIPLINE & CONDUCT SHEET
  const disciplineData = students.map(s => ({
    'Roll Number': s.rollNo,
    'Student Name': s.fullName,
    'Grade': s.grade,
    'Conduct Evaluation': s.conductRating,
    'Punctuality %': s.punctualityScore,
    'Merit Points': s.meritsCount,
    'Demerit Points': s.demeritsCount,
    'Leadership Appointments': s.leadershipRoles.join(', '),
    'Discipline Faculty Remarks': s.conductRemarks,
    'Recent Commendations / Notices': s.disciplineRecords.map((r) => `[${r.date}] ${r.category}: ${r.description} (By: ${r.awardedBy})`).join(' | ')
  }));
  const disciplineWs = XLSX.utils.json_to_sheet(disciplineData);
  XLSX.utils.book_append_sheet(wb, disciplineWs, 'Discipline & Conduct');

  // 5. EXTRACURRICULAR ACTIVITIES SHEET
  const extracurricularData = students.map(s => ({
    'Roll Number': s.rollNo,
    'Student Name': s.fullName,
    'Enrolled Clubs & Societies': s.clubs.join(', '),
    'Community Service (Hours)': s.communityServiceHours,
    'Special Talents & Skills': s.specialTalents.join(', '),
    'Key Competitions & Awards': s.competitions.map((c) => `${c.award} in ${c.title} (${c.year})`).join(' | '),
    'Advisor Remarks': s.extracurricularRemarks
  }));
  const extracurricularWs = XLSX.utils.json_to_sheet(extracurricularData);
  XLSX.utils.book_append_sheet(wb, extracurricularWs, 'Extracurricular Activities');

  // Write and trigger download
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${schoolName.replace(/[^a-zA-Z0-9]/g, '_')}_Student_Registry_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/** Downloads the StoryBook data template used by the portfolio importer. */
export function downloadExcelTemplate() {
  const anchor = document.createElement("a");
  anchor.href = "/downloads/StoryBook_Student_Portfolio_Template.xlsx";
  anchor.download = "StoryBook_Student_Portfolio_Template.xlsx";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

const normalizeHeader = (value: unknown) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

function splitList(value: string): string[] {
  return value.split(/[;\n|]/).map(item => item.trim()).filter(Boolean);
}

function readOptionalNumber(value: unknown, label: string, rowNumber: number): number | undefined {
  const text = String(value ?? "").trim();
  if (!text) return undefined;
  const parsed = Number(text.replace(/,/g, "").replace(/%$/, ""));
  if (!Number.isFinite(parsed)) throw new Error(`Row ${rowNumber}: ${label} must be a number.`);
  return parsed;
}

function sanitizeId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function validHouse(value: string): Student["house"] {
  return (["Titans", "Spartans", "Phoenix", "Centaur"] as const).find(house => house.toLowerCase() === value.toLowerCase()) || "Titans";
}

function validGender(value: string): Student["gender"] {
  if (/^(female|girl)$/i.test(value)) return "Female";
  if (/^(male|boy)$/i.test(value)) return "Male";
  return "Other";
}

/**
 * Reads one StoryBook Student Data row per learner. Image cells accept a public URL,
 * an existing media reference, or a file name selected alongside the workbook.
 */
export async function importRosterFromExcel(
  workbookFile: File,
  imageFiles: File[] = []
): Promise<{ students: Student[]; count: number; error?: string }> {
  try {
    if (!/\.(xlsx|xls|csv)$/i.test(workbookFile.name)) {
      return { students: [], count: 0, error: "Choose an Excel or CSV workbook, then select any linked image files with it." };
    }

    const data = await workbookFile.arrayBuffer();
    const wb = XLSX.read(data, { type: "array", cellDates: true });
    if (!wb.SheetNames.length) return { students: [], count: 0, error: "The uploaded file contains no sheets." };

    const targetSheetName = wb.SheetNames.find(name => normalizeHeader(name) === "studentdata")
      || wb.SheetNames.find(name => normalizeHeader(name).includes("storybook"))
      || wb.SheetNames.find(name => normalizeHeader(name).includes("master"))
      || wb.SheetNames.find(name => !/instructions|readme/i.test(name))
      || wb.SheetNames[0];
    const ws = wb.Sheets[targetSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "", raw: false });
    if (!rows.length) return { students: [], count: 0, error: "The uploaded sheet has a header row but no student data rows." };

    const filesByName = new Map<string, File>();
    for (const imageFile of imageFiles) {
      const name = imageFile.name.toLowerCase();
      if (filesByName.has(name)) return { students: [], count: 0, error: `More than one selected image is named ${imageFile.name}. Rename the files so each image name is unique.` };
      filesByName.set(name, imageFile);
    }
    const savedImageReferences = new Map<string, string>();
    const resolveImage = async (value: string, rowNumber: number, field: string): Promise<string> => {
      const reference = value.trim();
      if (!reference) return "";
      if (/^(https?:\/\/|data:image\/|media:\/\/)/i.test(reference)) return reference;
      const basename = reference.replace(/\\/g, "/").split("/").pop()?.toLowerCase() || "";
      const file = filesByName.get(basename);
      if (!file) throw new Error(`Row ${rowNumber}: ${field} refers to “${reference}”. Select that image file with the workbook or enter an https image URL.`);
      if (!savedImageReferences.has(basename)) savedImageReferences.set(basename, await savePortfolioImage(file));
      return savedImageReferences.get(basename)!;
    };

    const importedStudents: Student[] = [];
    const seenAdmissions = new Set<string>();
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      if (!Object.values(row).some(value => String(value ?? "").trim() !== "")) continue;
      const keys = Object.keys(row);
      const get = (labels: string[], fallback = ""): string => {
        const target = labels.map(normalizeHeader);
        const found = keys.find(key => target.includes(normalizeHeader(key)));
        return found ? String(row[found] ?? "").trim() : fallback;
      };
      const getNum = (header: string, aliases: string[] = []) => readOptionalNumber(get([header, ...aliases]), header, index + 2);
      const fullName = get(["Student Full Name", "Full Name", "Student Name", "Name"]);
      const admissionNo = get(["Admission ID", "Admission No", "Admission Number", "AdmNo", "ID"]);
      if (!fullName || !admissionNo) {
        throw new Error(`Row ${index + 2}: Student Full Name and Admission ID are required.`);
      }
      const admissionKey = admissionNo.toLowerCase();
      if (seenAdmissions.has(admissionKey)) throw new Error(`Row ${index + 2}: Admission ID ${admissionNo} appears more than once in this upload.`);
      seenAdmissions.add(admissionKey);

      const getImage = (header: string, aliases: string[] = []) => resolveImage(get([header, ...aliases]), index + 2, header);
      const grade = get(["Stage", "Grade", "Class", "Year"]);
      const section = get(["Section", "Sec", "Div"]);
      const portfolioYear = get(["Portfolio Year", "Academic Session"]);
      const literacyScore = getNum("Literacy Score (0-25)", ["Literacy Score"]);
      const numeracyScore = getNum("Numeracy Score (0-25)", ["Numeracy Score"]);
      const discoveryScore = getNum("Discovery Score (0-25)", ["Discovery Score"]);
      const grossMotorScore = getNum("Gross Motor Score (0-25)", ["Gross Motor Score"]);
      const creativeArtsScore = getNum("Creative Arts Score (0-25)", ["Creative Arts Score"]);
      const cognitiveScore = getNum("Cognitive Score (0-25)", ["Cognitive Score"]);
      const ecoScore = getNum("Eco Score (0-25)", ["Eco Score"]);
      const scoreArray = (prefix: string, names: string[], suffix: string) => names.map(name => getNum(`${prefix} - ${name} ${suffix}`));
      const imageValues = await Promise.all([
        getImage("Dream Career Image File or URL", ["Dream Career Image URL", "Dream Career Image"]),
        getImage("Family Photo File or URL", ["Family Photo URL", "Family Photo"]),
        getImage("Motor Activity Image File or URL", ["Gross Motor Activity Photo URL", "Motor Activity Photo"]),
        getImage("Student Artwork Image File or URL", ["Artwork Photo URL", "Artwork Image"]),
        getImage("Campus Sketch Image File or URL", ["Campus Sketch URL", "Campus Sketch"]),
        getImage("Class Montage Image File or URL", ["Class Montage URL", "Class Photo"]),
        getImage("Educator Photo File or URL", ["Educator Photo URL", "Teacher Photo"]),
        getImage("Student Photo File or URL", ["Photo URL", "Student Photo", "Photo", "Image"]),
      ]);
      const [dreamCareerImage, familyPhotoUrl, grossMotorActivityPhotoUrl, artworkPhotoUrl, campusSketchUrl, classMontagePhotoUrl, educatorPhotoUrl, photoUrl] = imageValues;

      const selRows: NonNullable<StoryBookData["selRows"]> = {
        selfAwareness: { faculty: get(["Self Awareness - Teacher Observation"]), student: get(["Self Awareness - Student Reflection"]) },
        selfManagement: { faculty: get(["Self Management - Teacher Observation"]), student: get(["Self Management - Student Reflection"]) },
        socialAwareness: { faculty: get(["Social Awareness - Teacher Observation"]), student: get(["Social Awareness - Student Reflection"]) },
        collaboration: { faculty: get(["Collaboration - Teacher Observation"]), student: get(["Collaboration - Student Reflection"]) },
        problemSolving: { faculty: get(["Problem Solving - Teacher Observation"]), student: get(["Problem Solving - Student Reflection"]) },
      };
      const literacyNames = ["Phonological Awareness", "Auditory Engagement", "Responsive Listening", "Cognitive Listening Skills", "Emerging Oral Expression"];
      const numeracyNames = ["Quantitative Competence", "Number-Quantity Mapping", "Geometric Classification", "Arithmetical Pattern Analysis", "Spatial-Relational Cognition"];
      const discoveryNames = ["Investigative Curiosity", "Analytical Inquiry", "Observation & Interpretation", "Experiential Exploration", "Reflective Understanding"];
      const motorNames = ["Balance & Coordination", "Locomotor Skills", "Spatial Awareness", "Strength & Endurance", "Object Control & Rhythm"];
      const artNames = ["Inventiveness", "Artistry", "Fine Motor Skills", "Craftsmanship", "Cultural Literacy"];
      const ecoNames = ["Eco & Social Care", "Global Citizenship", "Sustainable Thinking", "Practical Life Engagement", "Civic & Environmental Literacy"];
      const cognitiveNames = ["Thinking & Reasoning", "Attention & Memory", "Logical Skills", "Communication Skills", "Problem-Solving & Creativity"];
      const storybook: StoryBookData = {
        source: "excel",
        stage: get(["Stage", "Grade", "Class", "Year"]),
        institutionName: get(["Institution Name"]),
        initiativeName: get(["Initiative Name"]),
        pedagogyTag: get(["Pedagogy Tag"]),
        portfolioYear,
        dreamCareer: { title: get(["Dream Career"]), illustrationUrl: dreamCareerImage },
        familyPhotoUrl,
        familyQuote: get(["Family Quote"]),
        classMontagePhotoUrl,
        educatorPhotoUrl,
        ecoActivityHours: getNum("Community Service Hours", ["Service Hours"]),
        steamActivity: get(["STEAM Activity"]),
        steamObservations: [1, 2, 3].map(i => get([`STEAM Observation ${i}`])).filter(Boolean),
        steamOutcome: get(["STEAM Outcome"]),
        steamThinkerLevel: get(["STEAM Thinker Profile", "STEAM Thinker Level"]),
        superHeroName: get(["Superhero Name", "Super Hero Name"]),
        superHeroTrait: get(["Superhero Trait", "Super Hero Trait"]),
        selRows,
        literacyScore,
        literacyCharacter: get(["Literacy Character"]),
        literacyTrait: get(["Literacy Trait"]),
        literacyCriteria: scoreArray("Literacy", literacyNames, "(0-5)"),
        numeracyScore,
        numeracyCharacter: get(["Numeracy Character"]),
        numeracyTrait: get(["Numeracy Trait"]),
        numeracyCriteria: scoreArray("Numeracy", numeracyNames, "(0-5)"),
        discoveryScore,
        discoveryLevel: get(["Discovery Level"]),
        discoveryCriteria: scoreArray("Discovery", discoveryNames, "Score (0-5)"),
        discoveryVoices: discoveryNames.map(name => get([`Discovery - ${name} Learner Voice`])),
        grossMotorScore,
        grossMotorGrade: get(["Gross Motor Grade"]),
        grossMotorStepsCompleted: getNum("Motor Steps Completed (0-40)", ["Gross Motor Steps Completed"]),
        grossMotorActivityPhotoUrl,
        grossMotorCriteria: scoreArray("Motor", motorNames, "Score (0-5)"),
        creativeArtsScore,
        creativeArtsLevel: get(["Creative Arts Level"]),
        artworkTitle: get(["Artwork Title"]),
        artworkPhotoUrl,
        creativeArtsCriteria: scoreArray("Creative Arts", artNames, "Score (0-5)"),
        cognitiveScore,
        cognitiveLevel: get(["Cognitive Level"]),
        cognitiveBars: {
          thinkingReasoning: getNum("Cognitive - Thinking & Reasoning Score (0-5)"),
          attentionMemory: getNum("Cognitive - Attention & Memory Score (0-5)"),
          logicalSkills: getNum("Cognitive - Logical Skills Score (0-5)"),
          communicationSkills: getNum("Cognitive - Communication Skills Score (0-5)"),
          problemSolvingCreativity: getNum("Cognitive - Problem-Solving & Creativity Score (0-5)"),
        },
        ecoScore,
        ecoLevel: get(["Eco Level"]),
        ecoPillars: scoreArray("Eco", ecoNames, "Score (0-5)"),
        campusSketchUrl,
        teacherPhilosophyQuote: get(["Teacher Philosophy Quote"]),
      };

      const rawGender = get(["Gender", "Sex"]);
      const rawDob = get(["Date of Birth", "DOB", "Birth Date"]);
      const overallPercentage = getNum("Overall Academic Percentage", ["Overall Academic %", "Overall %", "Percentage"]) ?? 0;
      const gpa = getNum("GPA (4.0)", ["GPA"]) ?? 0;
      const attendancePercentage = getNum("Attendance Percentage", ["Attendance %", "Attendance"]) ?? 0;
      const classRank = getNum("Class Rank", ["Rank"]) ?? 0;
      const communityServiceHours = storybook.ecoActivityHours ?? 0;
      const talents = splitList(get(["Co-Curricular Talents", "Special Talents", "Talents"]));
      const primarySport = get(["Primary Sport", "Sport"]);
      importedStudents.push({
        id: `std-import-${sanitizeId(admissionNo)}`,
        rollNo: get(["Roll Number", "Roll No", "Roll"]) || admissionNo,
        admissionNo,
        fullName,
        gender: validGender(rawGender),
        dob: rawDob,
        grade,
        section,
        academicYear: get(["Academic Year"]) || portfolioYear,
        house: validHouse(get(["House"])),
        photoUrl,
        guardianName: get(["Guardian Name", "Parent Name"]),
        guardianContact: get(["Guardian Contact", "Parent Phone", "Phone"]),
        email: get(["Student Email", "Email"]),
        bloodGroup: get(["Blood Group"]),
        subjects: [
          ...(literacyScore === undefined ? [] : [{ name: "Foundational Literacy", score: literacyScore, maxScore: 25, grade: storybook.literacyCharacter || "", remarks: storybook.literacyTrait || "" }]),
          ...(numeracyScore === undefined ? [] : [{ name: "Foundational Numeracy", score: numeracyScore, maxScore: 25, grade: storybook.numeracyCharacter || "", remarks: storybook.numeracyTrait || "" }]),
          ...(discoveryScore === undefined ? [] : [{ name: "Discovery & Inquiry", score: discoveryScore, maxScore: 25, grade: storybook.discoveryLevel || "", remarks: "" }]),
          ...(grossMotorScore === undefined ? [] : [{ name: "Gross Motor Development", score: grossMotorScore, maxScore: 25, grade: storybook.grossMotorGrade || "", remarks: "" }]),
          ...(creativeArtsScore === undefined ? [] : [{ name: "Creative Arts", score: creativeArtsScore, maxScore: 25, grade: storybook.creativeArtsLevel || "", remarks: storybook.artworkTitle || "" }]),
          ...(cognitiveScore === undefined ? [] : [{ name: "Cognitive Development", score: cognitiveScore, maxScore: 25, grade: storybook.cognitiveLevel || "", remarks: "" }]),
          ...(ecoScore === undefined ? [] : [{ name: "Eco Awareness", score: ecoScore, maxScore: 25, grade: storybook.ecoLevel || "", remarks: "" }]),
        ],
        overallPercentage,
        gpa,
        attendancePercentage,
        classRank,
        academicRemarks: get(["Academic Remarks"]),
        primarySport,
        secondarySports: [],
        sportsRole: get(["Sports Role"]),
        sportsAchievements: [],
        fitnessGrade: "A",
        sportsRemarks: "",
        conductRating: "Good",
        punctualityScore: 0,
        meritsCount: 0,
        demeritsCount: 0,
        leadershipRoles: [],
        disciplineRecords: [],
        conductRemarks: "",
        clubs: [],
        competitions: [],
        communityServiceHours,
        specialTalents: talents,
        extracurricularRemarks: "",
        principalEndorsement: get(["Principal Endorsement"]),
        storybook,
      });
    }

    if (!importedStudents.length) return { students: [], count: 0, error: "No student rows found. Fill in Admission ID and Student Full Name in the Student Data sheet." };
    return { students: importedStudents, count: importedStudents.length };
  } catch (err) {
    console.error("Failed to import StoryBook Excel:", err);
    return { students: [], count: 0, error: err instanceof Error ? err.message : "Failed to parse the workbook." };
  }
}
