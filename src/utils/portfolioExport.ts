import { Student } from '../types/student';
import { SCHOOL_INFO } from '../data/initialStudents';

/**
 * Generates and downloads a self-contained, standalone offline HTML file
 * containing the 12-page "StoryBook of Learning" pedagogical model from the uploaded PDF.
 */
export function downloadStandalonePortfolioHtml(student: Student) {
  const htmlContent = generateStoryBookHtml(student);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sanitizedName = student.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  a.href = url;
  a.download = `${sanitizedName}_StoryBook_Portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a combined multi-student booklet containing all student StoryBooks
 * with clean page breaks between students.
 */
export function downloadBatchPortfoliosHtml(students: Student[], batchTitle = 'StoryBooks of Learning Batch') {
  const allStoryBooksHtml = students.map(s => generateStoryBookPagesHtml(s)).join('\n<div class="student-separator"></div>\n');

  const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${batchTitle} - ${SCHOOL_INFO.name}</title>
  <style>
    ${getStoryBookCss()}
  </style>
</head>
<body>
  <div class="no-print download-banner">
    <div class="banner-content">
      <div>
        <strong>${SCHOOL_INFO.name}</strong> · Batch StoryBooks of Learning (${students.length} Students)
      </div>
      <div>
        <button onclick="window.print()" class="btn-print">Print / Save All as PDF</button>
      </div>
    </div>
  </div>
  ${allStoryBooksHtml}
</body>
</html>`;

  const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Batch_StoryBooks_${students.length}_Students.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateStoryBookHtml(student: Student): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${student.fullName}'s StoryBook of Learning - ${SCHOOL_INFO.name}</title>
  <style>
    ${getStoryBookCss()}
  </style>
</head>
<body>
  <div class="no-print download-banner">
    <div class="banner-content">
      <div>
        <strong>${student.fullName}'s StoryBook of Learning</strong> · ${student.grade} ${student.section}
        <span style="opacity: 0.8; margin-left: 8px;">(12-Page Illustrated Pedagogical Dossier)</span>
      </div>
      <div>
        <button onclick="window.print()" class="btn-print">Print / Save as PDF</button>
      </div>
    </div>
  </div>

  ${generateStoryBookPagesHtml(student)}
</body>
</html>`;
}

function generateStoryBookPagesHtml(student: Student): string {
  const stage = student.storybook?.stage || `${student.grade} ${student.section}`.toUpperCase();
  const institution = student.storybook?.institutionName || "SPRING MOUNT INSTITUTIONS";
  const portfolioYear = student.storybook?.portfolioYear || "MY PORTFOLIO '25-26";
  const placeholderImage = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#f1f5f9"/><path d="M80 270l110-110 72 72 70-75 208 167H80z" fill="#a5b4fc"/><text x="320" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#475569">Demo illustration</text></svg>');
  const useDemoPlaceholder = (value?: string) => !value || value.startsWith('/demo-');
  const doctorCandidate = student.storybook?.dreamCareer?.illustrationUrl || student.photoUrl;
  const doctorImg = useDemoPlaceholder(doctorCandidate) ? placeholderImage : doctorCandidate;
  const familyCandidate = student.storybook?.familyPhotoUrl;
  const familyImg = useDemoPlaceholder(familyCandidate) ? placeholderImage : familyCandidate;
  const campusCandidate = student.storybook?.campusSketchUrl;
  const campusImg = useDemoPlaceholder(campusCandidate) ? placeholderImage : campusCandidate;
  const heroName = student.storybook?.superHeroName || "BAT GIRL";
  const heroTrait = student.storybook?.superHeroTrait || "Stays calm";

  return `
  <!-- PAGE 1: COVER PAGE -->
  <article class="sb-page cover-page">
    <div class="cover-header">
      <div class="logo-group">
        <div class="thinklink-badge">TL</div>
        <div>
          <div class="logo-title">thinklink</div>
          <div class="logo-sub">Little Thinkers with Big Ideas</div>
        </div>
      </div>
      <div class="school-crest">SMI CREST</div>
    </div>

    <div class="cover-body">
      <div class="character-col">
        <div class="character-frame">
          <img src="${doctorImg}" alt="${student.fullName} as Doctor" class="character-img" />
          <div class="character-caption">Aspiring Little Healer · Doctor</div>
        </div>
      </div>
      <div class="title-col">
        <div class="title-kicker">CUMULATIVE PEDAGOGICAL DOSSIER</div>
        <h1 class="student-big-name">${student.fullName}'s</h1>
        <h2 class="storybook-title">StoryBook<br/>of Learning</h2>
        <div class="cover-meta">Stage: <strong>${stage}</strong> · Roll No: <strong>${student.rollNo}</strong></div>
      </div>
    </div>

    <div class="cover-footer">
      <span class="inst-name">${institution}</span>
      <span class="year-pill">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 2: DEDICATION & FAMILY STORY -->
  <article class="sb-page family-page">
    <div class="page-inner split-layout">
      <div class="family-text-side">
        <div class="logo-group">
          <div class="thinklink-badge small">TL</div>
          <div>
            <div class="logo-title small">thinklink</div>
            <div class="logo-sub">Little Thinkers with Big Ideas</div>
          </div>
        </div>

        <h3 class="family-poem">
          Every journey <br/>
          <span class="highlight-yellow">begins</span> <br/>
          with a story... <br/>
          and mine began <br/>
          with l<span class="heart-red">♥</span>ve.
        </h3>

        <div class="name-pill">${student.fullName.toUpperCase()}</div>
        <div class="stage-tag">${stage}</div>

        <div class="play-tag">✨ Play & Learn: Experience Learning Through Play</div>
      </div>

      <div class="family-photo-side">
        <div class="family-card">
          <img src="${familyImg}" alt="Family Love" class="family-photo" />
          <div class="family-caption">Guardian: ${student.guardianName} · ${student.guardianContact}</div>
        </div>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Chapter 1: The First Foundation of Love & Nurturance</span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 3: PLAY BASED LEARNING (STEAM) -->
  <article class="sb-page steam-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3">play based <span class="highlight-yellow">learning</span></h3>
          <div class="page-sub">STEAM BASED ASSESSMENT STANDARDS · 21ST CENTURY SKILLS</div>
        </div>
        <div class="header-right">
          <strong>thinklink</strong>
          <div>Experience Learning Through Play</div>
        </div>
      </div>

      <table class="steam-table">
        <thead>
          <tr>
            <th style="width: 180px;">METRIC</th>
            <th style="width: 160px;">ACTIVITY</th>
            <th>OBSERVATION</th>
            <th>LEARNING OUTCOME</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="bg-gray">Curiosity and Inquiry</td>
            <td rowspan="6" class="activity-cell">
              <strong>PARACHUTE<br/>MAKING</strong>
              <div style="font-size: 11px; margin-top: 4px; font-weight: normal;">Aerodynamics & Air Drag</div>
            </td>
            <td rowspan="6" class="obs-cell">
              <ol>
                <li>Eager to engage immediately with raw craft materials.</li>
                <li>Works with intense focus and sustained flow during drop testing.</li>
                <li>Cleans up workspace voluntarily without being instructed.</li>
              </ol>
            </td>
            <td rowspan="6" class="outcome-cell">
              <strong style="color: #6b21a8; font-size: 13px;">AIR RESISTANCE & GRAVITY</strong>
              <p style="margin-top: 6px; font-size: 12px; color: #475569;">
                Explores foundational physical science concepts like air resistance, surface area, and gravity in a fun, exploratory, tactile manner.
              </p>
            </td>
          </tr>
          <tr><td class="bg-gray">Critical Thinking</td></tr>
          <tr><td class="bg-gray">Collaboration</td></tr>
          <tr><td class="bg-gray">Creativity</td></tr>
          <tr><td class="bg-gray">Early Math Skills</td></tr>
          <tr><td class="bg-gray">Scientific Thinking</td></tr>
        </tbody>
      </table>

      <div class="thinkers-row">
        <div class="thinker-card"><strong>01 OBSERVER</strong><div>Charles Darwin</div></div>
        <div class="thinker-card"><strong>02 CODER</strong><div>Chanakya</div></div>
        <div class="thinker-card"><strong>03 COLLABORATOR</strong><div>Leonardo da Vinci</div></div>
        <div class="thinker-card"><strong>04 IMAGINATIVE</strong><div>Walt Disney</div></div>
        <div class="thinker-card"><strong>05 GEOMETRIC</strong><div>Praggnanandhaa</div></div>
        <div class="thinker-card"><strong>06 CURIOUS</strong><div>Shakuntala Devi</div></div>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Verified STEAM Assessment Standards</span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 4: SEL SUPER HEROS -->
  <article class="sb-page sel-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3">SEL SUPER HEROS</h3>
          <div class="page-sub">Social Emotional Learning & Behavioral Discipline Standards</div>
        </div>
        <div class="hero-badge-box">
          <div style="font-size: 10px; text-transform: uppercase;">My Super Hero Trait</div>
          <strong>${heroTrait.toUpperCase()}</strong>
          <div style="color: #fde047; font-size: 12px;">I AM ${heroName}</div>
        </div>
      </div>

      <div class="sel-grid">
        <div class="sel-row">
          <div class="sel-cat cat-purple">SELF AWARENESS</div>
          <div class="sel-fac">Shares personal likes, curiosity, and dislikes warmly during circle time.</div>
          <div class="sel-stu">Curious, open-minded, confident</div>
        </div>
        <div class="sel-row">
          <div class="sel-cat cat-blue">SELF MANAGEMENT</div>
          <div class="sel-fac">Waits patiently for her turn and shows self-regulation during excited moments.</div>
          <div class="sel-stu">Patient, persistent, focused</div>
        </div>
        <div class="sel-row">
          <div class="sel-cat cat-green">SOCIAL AWARENESS</div>
          <div class="sel-fac">Listens actively to others and comforts peers when they need reassurance.</div>
          <div class="sel-stu">Respectful, inclusive, caring</div>
        </div>
        <div class="sel-row">
          <div class="sel-cat cat-amber">COLLABORATION</div>
          <div class="sel-fac">Takes turns gracefully during shared tasks and cleans up materials in harmony.</div>
          <div class="sel-stu">Team-minded, cooperative, joyful</div>
        </div>
        <div class="sel-row">
          <div class="sel-cat cat-rose">PROBLEM SOLVING</div>
          <div class="sel-fac">Asks for help when needed and tries multiple angles before giving up.</div>
          <div class="sel-stu">Wise, understanding, persevering</div>
        </div>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Discipline Rating: <strong>${student.conductRating} (${student.punctualityScore}% Punctuality)</strong></span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 5: FOUNDATIONAL LITERACY & NUMERACY -->
  <article class="sb-page lit-num-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3">FOUNDATIONAL <span style="color: #e11d48;">LITERACY</span> & <span style="color: #2563eb;">NUMERACY</span></h3>
          <div class="page-sub">Early Childhood Readiness Matrix & Character Mastery Traits</div>
        </div>
        <div class="scale-note">Scale: 1-5 Marks Each</div>
      </div>

      <div class="lit-num-grid">
        <div class="matrix-card">
          <div class="matrix-head purple-head">
            <span>Literacy Readiness Matrix</span>
            <span class="score-badge">Score: 23 / 25</span>
          </div>
          <table class="matrix-table">
            <tr><td>Phonological Awareness</td><td>Distinguishes sounds and rhythm</td><td class="r-num">4</td></tr>
            <tr><td>Auditory Engagement</td><td>Participates in rhymes and songs</td><td class="r-num">5</td></tr>
            <tr><td>Responsive Listening</td><td>Responds to instructions promptly</td><td class="r-num">5</td></tr>
            <tr><td>Cognitive Listening</td><td>Listens attentively to stories</td><td class="r-num">5</td></tr>
            <tr><td>Emerging Expression</td><td>Articulates words clearly</td><td class="r-num">4</td></tr>
          </table>
          <div class="matrix-foot">CHARACTER: SIMBA · MASTERY AND CONFIDENCE</div>
        </div>

        <div class="matrix-card">
          <div class="matrix-head blue-head">
            <span>Numeracy Readiness Matrix</span>
            <span class="score-badge">Score: 22 / 25</span>
          </div>
          <table class="matrix-table">
            <tr><td>Quantitative Competence</td><td>Counts in sequence smoothly</td><td class="r-num">5</td></tr>
            <tr><td>Number-Quantity Mapping</td><td>Corresponds numbers to items</td><td class="r-num">4</td></tr>
            <tr><td>Geometric Attributes</td><td>Sorts objects by shape & color</td><td class="r-num">5</td></tr>
            <tr><td>Early Pattern Analysis</td><td>Identifies repetitive sequences</td><td class="r-num">4</td></tr>
            <tr><td>Spatial Exploratory Play</td><td>Spatial awareness in building</td><td class="r-num">4</td></tr>
          </table>
          <div class="matrix-foot">CHARACTER: KUNG FU PANDA · HIGHER UNDERSTANDING</div>
        </div>
      </div>

      <div class="grade-scale-bar">
        <strong>Final Grading Scale:</strong>
        <span>23-25: SHINE (Simba)</span> ·
        <span>17-22: SOAR (Kung Fu Panda)</span> ·
        <span>11-16: RISE (Naruto)</span> ·
        <span>06-10: BLOOM (Tom)</span>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Academic Standing: <strong>${student.overallPercentage}% (GPA: ${student.gpa.toFixed(2)})</strong></span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 6: LEARNING JOURNEY (TREE & ANT COLONY DISCOVERY) -->
  <article class="sb-page discovery-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3">LEARNING <span style="color: #059669;">JOURNEY</span></h3>
          <div class="page-sub">Nature, Honeycomb & Underground Discovery Framework</div>
        </div>
        <div class="trophy-badge">🏆 Discovery Score: 20 / 25</div>
      </div>

      <div class="discovery-content">
        <div class="levels-col">
          <div class="level-box">Den (23-25)</div>
          <div class="level-box active-level">★ Passage (17-22) - CURRENT</div>
          <div class="level-box">Chamber (11-16)</div>
          <div class="level-box">Tunnel (6-10)</div>
          <div class="level-box">Gate Way (1-5)</div>
        </div>

        <div class="ant-colony-box">
          <div class="ant-head">Underground Exploration Ant Colony Chambers · Passage Level</div>
          <div class="chambers-grid">
            <div class="chamber-card"><div class="ch-circle">4</div><strong>Investigative</strong><p>"I like to find out new things."</p></div>
            <div class="chamber-card"><div class="ch-circle">4</div><strong>Inquiry</strong><p>"I ask questions to know more."</p></div>
            <div class="chamber-card"><div class="ch-circle">4</div><strong>Observation</strong><p>"I see and talk about what happens."</p></div>
            <div class="chamber-card"><div class="ch-circle">4</div><strong>Hands-on</strong><p>"I use tools to try things out."</p></div>
            <div class="chamber-card"><div class="ch-circle">4</div><strong>Reflective</strong><p>"I can tell what I learned."</p></div>
          </div>
          <div class="tree-note">Tree canopy & honeycomb signify community harmony, deep curiosity roots, and shared discovery.</div>
        </div>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Discovery Framework: Experiential Inquiry</span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 7: GROSS MOTOR SKILLS ASSESSMENT (PIRATE ISLAND 1-40) -->
  <article class="sb-page motor-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3">GROSS MOTOR <span style="color: #e11d48;">SKILLS ASSESSMENT</span></h3>
          <div class="page-sub">Sports, Agility, Locomotor & Treasure Island Physical Challenge</div>
        </div>
        <div class="score-pill-green">Final Score: 24 / 25 (Grade A)</div>
      </div>

      <div class="motor-grid">
        <div class="pirate-track-card">
          <div class="track-header">
            <span>🏴‍☠️ Pirate Ship: Start</span>
            <span>Treasure Island: 40 🏝️</span>
          </div>
          <div class="steps-container">
            ${Array.from({ length: 40 }).map((_, i) => `
              <span class="step-ball ${i + 1 <= 38 ? 'step-done' : ''}">${i + 1}</span>
            `).join('')}
          </div>
          <div class="track-caption">${student.fullName} reached Step 38! Steady balance and locomotor agility.</div>
        </div>

        <div class="motor-table-card">
          <table class="motor-table">
            <thead>
              <tr><th>Skill Strands</th><th>Performance</th><th>Posture</th><th>Grade</th></tr>
            </thead>
            <tbody>
              <tr><td>Balance & Coordination</td><td style="color: #16a34a; font-weight: bold;">Skilled</td><td>Steady posture, smooth flow</td><td class="r-bold">A</td></tr>
              <tr><td>Locomotor Skills</td><td style="color: #16a34a; font-weight: bold;">Skilled</td><td>Moves fluidly; changes direction</td><td class="r-bold">A</td></tr>
              <tr><td>Spatial Awareness</td><td style="color: #2563eb; font-weight: bold;">Inductory</td><td>Explores space, avoids obstacles</td><td class="r-bold">A</td></tr>
              <tr><td>Strength & Endurance</td><td style="color: #d97706; font-weight: bold;">Competent</td><td>Performs tasks with stamina</td><td class="r-bold">B</td></tr>
              <tr><td>Object Control & Rhythm</td><td style="color: #16a34a; font-weight: bold;">Skilled</td><td>Controls hula hoop/ball in rhythm</td><td class="r-bold">A</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Primary Sport: <strong>${student.primarySport} (${student.fitnessGrade})</strong></span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 8: CREATIVE ARTS & CULTURAL LITERACY -->
  <article class="sb-page art-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3">CREATIVE ARTS & <span style="color: #d97706;">CULTURAL LITERACY</span></h3>
          <div class="page-sub">Fine Motor Precision, Cultural Traditions & Student Masterpiece Exhibition</div>
        </div>
        <div class="art-level-tag">ADEPT +++ (22/25)</div>
      </div>

      <div class="masterpiece-grid">
        <div class="art-card">
          <div class="art-placeholder" style="background: #fef3c7;">Classical Portrait</div>
          <strong>Leonardo da Vinci</strong>
          <div class="art-sub">Mona Lisa (1503)</div>
        </div>
        <div class="art-card">
          <div class="art-placeholder" style="background: #ffe4e6;">Indian Heritage</div>
          <strong>Raja Ravi Varma</strong>
          <div class="art-sub">Hamsa Damayanti (1899)</div>
        </div>
        <div class="art-card student-art-card">
          <div class="art-placeholder" style="background: #ffffff; color: #4338ca; font-weight: bold;">🎨 Diya Art (2025)</div>
          <strong>${student.fullName.toUpperCase()}</strong>
          <div class="art-sub" style="color: #4338ca; font-weight: bold;">Student Masterpiece Exhibit</div>
        </div>
        <div class="art-card">
          <div class="art-placeholder" style="background: #e0e7ff;">Modern Expression</div>
          <strong>M.F. Husain</strong>
          <div class="art-sub">Language of Stone</div>
        </div>
      </div>

      <div class="art-skills-bar">
        <div><strong>Inventiveness:</strong> 5 / 5</div>
        <div><strong>Craftsmanship:</strong> 4 / 5</div>
        <div><strong>Fine Motor Skills:</strong> 4 / 5</div>
        <div><strong>Artistry:</strong> 5 / 5</div>
        <div><strong>Cultural Literacy:</strong> 4 / 5</div>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Talents: <strong>${student.specialTalents.join(', ')}</strong></span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 9: COGNITIVE & CONCEPTUAL DEVELOPMENT -->
  <article class="sb-page cog-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3" style="color: #fde047;">Cognitive & Conceptual Development</h3>
          <div class="page-sub" style="color: #94a3b8;">Neural Pathways, Logical Deduction & Mind Architecture</div>
        </div>
        <div class="noesis-badge">Score: 22 · NOESIS</div>
      </div>

      <div class="estrada-quote">
        "All students can learn and succeed, but not on the same day, in the same way."
      </div>

      <div class="cog-nodes-row">
        <div class="cog-node"><div class="cog-score">05</div><strong>Thinking</strong><p>Making sense of ideas</p></div>
        <div class="cog-node"><div class="cog-score">04</div><strong>Attention</strong><p>Staying focused & recalling</p></div>
        <div class="cog-node"><div class="cog-score">05</div><strong>Logical</strong><p>Numbers & pattern solving</p></div>
        <div class="cog-node"><div class="cog-score">04</div><strong>Expression</strong><p>Words & communication</p></div>
        <div class="cog-node"><div class="cog-score">04</div><strong>Problem Solving</strong><p>Finding new solutions</p></div>
      </div>

      <div class="cog-scale-bar">
        <strong>Cognitive Spectrum:</strong>
        <span>Sapience (23-25)</span> ·
        <span style="color: #fde047; font-weight: bold;">★ Noesis (15-22) - CURRENT</span> ·
        <span>Ratio (10-14)</span> ·
        <span>Mnemonis (5-9)</span>
      </div>
    </div>
    <div class="page-footer-bar dark-footer">
      <span>Cognitive Mastery & Neuro-Developmental Profile</span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 10: ECO & ENVIRONMENTAL AWARENESS -->
  <article class="sb-page eco-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div>
          <h3 class="page-h3" style="color: #fde047;">ECO & Environmental Awareness</h3>
          <div class="page-sub" style="color: #a7f3d0;">Mother of Trees (Saalumarada Thimmakka) · Sustainable Living</div>
        </div>
        <div class="eco-badge">Eco Score: 23 / 25 · TREE</div>
      </div>

      <div class="eco-grid">
        <div class="thimmakka-card">
          <strong>Heroic Inspiration: Saalumarada Thimmakka</strong>
          <p>Planted 385 banyan trees along a 4 km highway in Karnataka with zero formal resources. Taught generations the sacred duty of environmental stewardship.</p>
          <div class="eco-action">
            <strong>Community Action:</strong> ${student.fullName} logged ${student.communityServiceHours} volunteer hours in campus greening and botanical care.
          </div>
        </div>

        <div class="eco-pillars-col">
          <div class="eco-row"><span>Global Citizenship</span><strong>05</strong></div>
          <div class="eco-row"><span>Eco & Social Care</span><strong>05</strong></div>
          <div class="eco-row"><span>Sustainable Thinking</span><strong>05</strong></div>
          <div class="eco-row"><span>Practical Life Engagement</span><strong>04</strong></div>
          <div class="eco-row"><span>Civic & Environmental Literacy</span><strong>04</strong></div>
        </div>
      </div>
    </div>
    <div class="page-footer-bar dark-footer">
      <span>Tree Rings Spectrum: Tree (23-25), Blossom (18-22), Bud (11-17), Sprout (6-10), Seed (1-5)</span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 11: CLASS PHOTO MONTAGE -->
  <article class="sb-page cohort-page">
    <div class="page-inner text-center">
      <div class="cohort-header">
        <div class="page-sub">COHORT UNITY & CLASS BOND</div>
        <h3 class="cohort-quote">"Together we grew, learned, and laughed — a class full of memories, a bond for life."</h3>
        <div class="stage-tag" style="display: inline-block;">${stage}</div>
      </div>

      <div class="cohort-grid">
        <div class="peer-card"><div class="peer-circ">A</div><div class="peer-name">${student.fullName}</div></div>
        <div class="peer-card"><div class="peer-circ">A</div><div class="peer-name">Aarav S.</div></div>
        <div class="peer-card"><div class="peer-circ">M</div><div class="peer-name">Maya C.</div></div>
        <div class="peer-card"><div class="peer-circ">M</div><div class="peer-name">Marcus O.</div></div>
        <div class="peer-card"><div class="peer-circ">S</div><div class="peer-name">Sophia A.</div></div>
        <div class="peer-card"><div class="peer-circ">L</div><div class="peer-name">Liam P.</div></div>
      </div>

      <div class="mentor-tribute">
        <div><strong>Lead Educator & Mentor:</strong> Sample Educator</div>
        <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Guiding young minds with gentle affection, observation, and unconditional encouragement.</p>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>${institution} · Student Bond</span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>

  <!-- PAGE 12: BACK COVER & CAMPUS SKETCH -->
  <article class="sb-page back-page">
    <div class="page-inner">
      <div class="page-header-row">
        <div class="back-quote">"Your child's story lives here."</div>
        <div style="text-align: right;">
          <strong style="font-size: 16px; color: #581c87;">LEARN 360</strong>
          <div style="font-size: 10px; color: #64748b;">A Pedagogical Initiative by ${institution}</div>
        </div>
      </div>

      <div class="campus-sketch-box">
        <img src="${campusImg}" alt="Campus Sketch" class="campus-img" />
      </div>

      <div class="manifesto-grid">
        <div class="manifesto-text">
          <strong>THIS IS NOT FOR YOU unless you:</strong>
          <ul>
            <li>believe learning is bigger than marks and exam scores.</li>
            <li>think a child's authentic voice matters more than a single number.</li>
            <li>want to see what textbooks and worksheets can't capture.</li>
            <li>are ready to witness growth in true 360° across heart, mind, and hands.</li>
            <li>know every child is far more than a report card.</li>
          </ul>
        </div>

        <div class="qr-box">
          <div class="qr-code-graphic">QR</div>
          <strong>THIS SIDE SPEAKS</strong>
          <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Scan to unlock audio story & gallery</div>
        </div>
      </div>
    </div>
    <div class="page-footer-bar">
      <span>Verified Official Record ID: <strong>${student.admissionNo}</strong> · ${institution}</span>
      <span class="font-mono">${portfolioYear}</span>
    </div>
  </article>
  `;
}

function getStoryBookCss(): string {
  return `
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #e2e8f0;
      color: #0f172a;
    }
    .download-banner {
      max-width: 960px;
      margin: 0 auto 16px auto;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
    }
    .banner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
    }
    .btn-print {
      background: #eab308;
      color: #0f172a;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-print:hover { background: #facc15; }
    
    .sb-page {
      max-width: 1031px;
      margin: 0 auto 30px auto;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
      min-height: 580px;
      aspect-ratio: 16 / 9;
      display: flex;
      flex-col: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
    }
    .page-inner {
      padding: 28px 32px;
      flex: 1;
    }
    .page-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .page-h3 { font-size: 24px; font-weight: 900; margin: 0; }
    .page-sub { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 2px; }
    .page-footer-bar {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 10px 32px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #64748b;
    }
    .dark-footer { background: #020617; border-color: #1e293b; color: #94a3b8; }
    .font-mono { font-family: monospace; }

    /* Page 1 Cover */
    .cover-page {
      background: linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #1e1b4b 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
    }
    .cover-header {
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-group { display: flex; align-items: center; gap: 10px; }
    .thinklink-badge {
      width: 44px; height: 44px; border-radius: 9999px;
      background: rgba(147, 51, 234, 0.4); border: 1px solid #c084fc;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; color: #fde047; font-size: 16px;
    }
    .thinklink-badge.small { width: 32px; height: 32px; font-size: 12px; }
    .logo-title { font-weight: 900; text-transform: uppercase; color: #fde047; font-size: 13px; }
    .logo-title.small { font-size: 11px; color: #581c87; }
    .logo-sub { font-size: 9px; color: #e9d5ff; }
    .school-crest {
      width: 50px; height: 50px; border-radius: 9999px;
      border: 1px solid #fde047; background: rgba(253, 224, 71, 0.1);
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: bold; color: #fde047; text-align: center;
    }
    .cover-body {
      padding: 20px 32px;
      display: flex;
      align-items: center;
      gap: 32px;
      flex: 1;
    }
    .character-col { width: 300px; flex-shrink: 0; text-align: center; }
    .character-frame {
      border: 4px solid rgba(253, 224, 71, 0.5);
      border-radius: 16px;
      overflow: hidden;
      background: #2e1065;
    }
    .character-img { width: 100%; height: 280px; object-fit: cover; display: block; }
    .character-caption { background: #0f172a; padding: 6px; font-size: 11px; font-weight: 700; color: #fde047; }
    .title-col { flex: 1; }
    .title-kicker { font-size: 11px; font-weight: 800; color: #fde047; letter-spacing: 0.1em; }
    .student-big-name { font-size: 40px; font-weight: 900; margin: 6px 0; color: #ffffff; }
    .storybook-title { font-size: 44px; font-weight: 900; color: #fde047; line-height: 1.1; margin: 0; }
    .cover-meta { font-size: 13px; color: #e9d5ff; margin-top: 14px; }
    .cover-footer {
      background: #facc15;
      color: #0f172a;
      padding: 14px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 800;
    }
    .year-pill { background: #1e1b4b; color: #ffffff; padding: 4px 14px; border-radius: 9999px; font-size: 12px; }

    /* Page 2 Family */
    .split-layout { display: flex; gap: 32px; align-items: center; }
    .family-text-side { width: 45%; }
    .family-poem { font-size: 32px; font-weight: 900; color: #1e1b4b; line-height: 1.2; margin: 18px 0; }
    .highlight-yellow { color: #d97706; }
    .heart-red { color: #ef4444; }
    .name-pill { background: #0f172a; color: #ffffff; font-weight: 800; font-size: 15px; padding: 6px 18px; border-radius: 9999px; display: inline-block; }
    .stage-tag { background: #fef3c7; color: #92400e; font-weight: 700; font-size: 11px; padding: 3px 12px; border-radius: 9999px; display: inline-block; margin-top: 6px; }
    .play-tag { font-size: 12px; font-weight: 700; color: #581c87; margin-top: 16px; }
    .family-photo-side { flex: 1; text-align: center; }
    .family-card { border: 4px solid #facc15; border-radius: 16px; overflow: hidden; }
    .family-photo { width: 100%; height: 280px; object-fit: cover; display: block; }
    .family-caption { background: #1e1b4b; color: #ffffff; padding: 8px; font-size: 12px; }

    /* Tables */
    .steam-table, .matrix-table, .motor-table {
      width: 100%; border-collapse: collapse; font-size: 12px;
    }
    .steam-table th { background: #ef4444; color: #ffffff; padding: 8px 10px; font-size: 11px; text-transform: uppercase; }
    .steam-table td { border: 1px solid #e2e8f0; padding: 8px 10px; }
    .bg-gray { background: #f8fafc; font-weight: 700; }
    .activity-cell { background: #fef3c7; text-align: center; font-weight: 800; }
    .thinkers-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 18px; text-align: center; font-size: 11px; }
    .thinker-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 4px; }

    /* SEL */
    .hero-badge-box { background: #1e1b4b; color: #ffffff; padding: 8px 16px; border-radius: 10px; text-align: right; }
    .sel-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
    .sel-row { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; font-size: 12px; }
    .sel-cat { width: 140px; flex-shrink: 0; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-align: center; }
    .cat-purple { background: #f3e8ff; color: #6b21a8; }
    .cat-blue { background: #e0f2fe; color: #0369a1; }
    .cat-green { background: #dcfce7; color: #15803d; }
    .cat-amber { background: #fef3c7; color: #b45309; }
    .cat-rose { background: #ffe4e6; color: #be123c; }
    .sel-fac { flex: 1; font-weight: 500; }
    .sel-stu { width: 180px; flex-shrink: 0; background: #faf5ff; padding: 4px 8px; border-radius: 6px; font-weight: 600; color: #581c87; }

    /* Literacy & Numeracy */
    .lit-num-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .matrix-card { border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; font-size: 12px; }
    .matrix-head { padding: 8px 12px; color: #ffffff; font-weight: 800; display: flex; justify-content: space-between; }
    .purple-head { background: #7e22ce; }
    .blue-head { background: #1d4ed8; }
    .score-badge { font-family: monospace; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; }
    .matrix-table td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; }
    .r-num { text-align: right; font-weight: 800; font-family: monospace; }
    .matrix-foot { background: #f8fafc; padding: 6px 12px; font-weight: 700; font-size: 11px; text-align: center; border-top: 1px solid #e2e8f0; }
    .grade-scale-bar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; font-size: 11px; text-align: center; margin-top: 14px; }

    /* Discovery */
    .discovery-content { display: flex; gap: 18px; margin-top: 14px; }
    .levels-col { width: 160px; flex-shrink: 0; font-size: 12px; display: flex; flex-direction: column; gap: 6px; }
    .level-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 8px; border-radius: 6px; font-weight: 600; }
    .active-level { background: #dcfce7; border-color: #22c55e; color: #15803d; font-weight: 800; }
    .ant-colony-box { flex: 1; background: #451a03; color: #ffffff; border-radius: 12px; padding: 14px; }
    .ant-head { font-size: 11px; font-weight: 800; color: #fde047; text-transform: uppercase; margin-bottom: 10px; }
    .chambers-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center; font-size: 11px; }
    .chamber-card { background: rgba(255,255,255,0.1); border: 1px solid rgba(253, 224, 71, 0.4); border-radius: 8px; padding: 8px 4px; }
    .ch-circle { width: 24px; height: 24px; border-radius: 9999px; background: #facc15; color: #000; font-weight: 800; margin: 0 auto 4px auto; display: flex; align-items: center; justify-content: center; }
    .tree-note { font-size: 10px; color: #fef08a; text-align: center; margin-top: 10px; }

    /* Motor */
    .motor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: center; }
    .pirate-track-card { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 12px; text-align: center; }
    .track-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #0369a1; }
    .steps-container { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; margin: 10px 0; }
    .step-ball { width: 22px; height: 22px; border-radius: 9999px; background: #e2e8f0; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: #64748b; }
    .step-done { background: #facc15; color: #0f172a; border: 1px solid #ca8a04; }
    .motor-table-card { border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; }
    .motor-table th { background: #0f172a; color: #ffffff; padding: 6px 8px; font-size: 10px; text-transform: uppercase; }
    .motor-table td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
    .r-bold { font-weight: 800; font-family: monospace; text-align: center; }

    /* Art */
    .masterpiece-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; font-size: 12px; }
    .art-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
    .student-art-card { background: #fef3c7; border: 2px solid #facc15; }
    .art-placeholder { height: 90px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #64748b; margin-bottom: 6px; }
    .art-sub { font-size: 10px; color: #64748b; }
    .art-skills-bar { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 11px; margin-top: 14px; text-align: center; }

    /* Cognitive */
    .cog-page { background: #020617; color: #ffffff; }
    .estrada-quote { text-align: center; font-style: italic; font-family: Georgia, serif; font-size: 13px; color: #e9d5ff; background: #0f172a; padding: 10px; border-radius: 8px; margin: 12px 0; }
    .cog-nodes-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center; font-size: 11px; }
    .cog-node { background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 10px 4px; }
    .cog-score { width: 30px; height: 30px; border-radius: 9999px; background: #3b0764; border: 1px solid #a855f7; color: #fde047; font-weight: 800; margin: 0 auto 6px auto; display: flex; align-items: center; justify-content: center; font-family: monospace; }
    .cog-scale-bar { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 8px; font-size: 11px; text-align: center; margin-top: 14px; color: #94a3b8; }

    /* Eco */
    .eco-page { background: linear-gradient(135deg, #022c22 0%, #064e3b 100%); color: #ffffff; }
    .eco-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; font-size: 12px; }
    .thimmakka-card { background: rgba(0,0,0,0.3); border: 1px solid #047857; border-radius: 10px; padding: 12px; }
    .eco-action { background: rgba(0,0,0,0.4); border-radius: 6px; padding: 8px; margin-top: 8px; font-size: 11px; }
    .eco-pillars-col { display: flex; flex-direction: column; gap: 6px; }
    .eco-row { display: flex; justify-content: space-between; background: rgba(0,0,0,0.3); border: 1px solid #047857; padding: 8px 12px; border-radius: 6px; }

    /* Cohort */
    .cohort-quote { font-family: Georgia, serif; font-style: italic; font-size: 18px; color: #1e293b; margin: 8px 0; }
    .cohort-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin: 18px 0; }
    .peer-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; text-align: center; }
    .peer-circ { width: 44px; height: 44px; border-radius: 9999px; background: #fde047; color: #0f172a; font-weight: 800; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 16px; }
    .peer-name { font-size: 11px; font-weight: 700; margin-top: 6px; }
    .mentor-tribute { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-top: 12px; text-align: center; font-size: 12px; }

    /* Back Cover */
    .back-quote { font-size: 22px; font-family: Georgia, serif; font-style: italic; font-weight: 800; color: #0f172a; }
    .campus-sketch-box { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; max-height: 200px; display: flex; align-items: center; justify-content: center; background: #f8fafc; margin: 14px 0; }
    .campus-img { width: 100%; height: 200px; object-fit: contain; }
    .manifesto-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: center; font-size: 12px; }
    .manifesto-text ul { margin: 6px 0; padding-left: 18px; }
    .manifesto-text li { margin-bottom: 4px; }
    .qr-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; text-align: center; }
    .qr-code-graphic { width: 50px; height: 50px; background: #0f172a; color: #fde047; font-weight: 800; border-radius: 8px; margin: 0 auto 6px auto; display: flex; align-items: center; justify-content: center; }

    @media print {
      @page { size: 13.333in 7.5in; margin: 0; }
      body { background: #ffffff !important; padding: 0 !important; }
      .no-print { display: none !important; }
      .sb-page { box-shadow: none !important; border: 1px solid #94a3b8 !important; width: 13.333in !important; height: 7.5in !important; max-width: none !important; min-height: 0 !important; margin: 0 !important; aspect-ratio: auto !important; page-break-after: always !important; break-after: page !important; }
      .sb-page:last-child { page-break-after: auto !important; break-after: auto !important; }
    }
  `;
}
