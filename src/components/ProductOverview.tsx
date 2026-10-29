import React from 'react';
import { ArrowDownRight, ArrowRight, Award, BookOpen, HeartHandshake, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import { Student } from '../types/student';

interface ProductOverviewProps {
  students: Student[];
  onNavigate: (view: 'spreadsheet' | 'portfolios' | 'analytics') => void;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ students, onNavigate }) => {
  const topStudent = [...students].sort((a, b) => b.gpa - a.gpa)[0];
  const averageGpa = students.length
    ? (students.reduce((total, student) => total + student.gpa, 0) / students.length).toFixed(2)
    : '0.00';

  return (
    <div className="product-overview">
      <section className="overview-hero" aria-labelledby="overview-title">
        <div className="overview-copy">
          <div className="overview-kicker"><span /> A fuller view of every learner</div>
          <h1 id="overview-title">Every student's story, <em>in focus.</em></h1>
          <p className="overview-description">
            Bring academics, wellbeing, achievement and potential together in one thoughtful student portfolio.
          </p>
          <div className="overview-actions">
            <button type="button" className="overview-primary" onClick={() => onNavigate('spreadsheet')}>
              Open student registry <ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className="overview-secondary" onClick={() => onNavigate('portfolios')}>
              Explore portfolios <ArrowDownRight aria-hidden="true" />
            </button>
          </div>
          <div className="overview-metrics" aria-label="Current roster statistics">
            <div>
              <strong>{students.length}</strong>
              <span>student records</span>
            </div>
            <div>
              <strong>{averageGpa}<small> / 4.0</small></strong>
              <span>roster average GPA</span>
            </div>
          </div>
        </div>

        <div className="overview-visual" aria-label="Live student portfolio overview">
          <div className="overview-orbit overview-orbit-one" />
          <div className="overview-orbit overview-orbit-two" />
          <div className="overview-dash overview-dash-one" />
          <div className="overview-dash overview-dash-two" />

          <div className="overview-record-card">
            <div className="overview-card-topline">
              <span className="overview-card-mark"><BookOpen aria-hidden="true" /></span>
              <span className="overview-live"><span /> ROSTER SNAPSHOT</span>
            </div>
            {topStudent ? (
              <>
                <p className="overview-card-label">TOP GPA IN CURRENT ROSTER</p>
                <div className="overview-student">
                  <div className="overview-avatar">
                    {topStudent.photoUrl ? <img src={topStudent.photoUrl} alt="" /> : topStudent.fullName.slice(0, 1)}
                  </div>
                  <div className="overview-student-name">
                    <strong>{topStudent.fullName}</strong>
                    <span>{topStudent.grade} · {topStudent.section}</span>
                  </div>
                  <div className="overview-student-gpa">{topStudent.gpa.toFixed(2)}<small> GPA</small></div>
                </div>
                <div className="overview-record-footer">
                  <span><Award aria-hidden="true" /> {topStudent.overallPercentage}% overall</span>
                  <span>{topStudent.attendancePercentage}% attendance</span>
                </div>
              </>
            ) : (
              <div className="overview-empty">
                <strong>Your student overview starts here.</strong>
                <span>Add or import a student record to see roster insights.</span>
              </div>
            )}
          </div>

          <button type="button" className="overview-average-card" onClick={() => onNavigate('analytics')}>
            <span className="overview-average-icon"><Users aria-hidden="true" /></span>
            <span className="overview-average-text"><small>ROSTER AVERAGE</small><strong>{averageGpa}<i> / 4.0</i></strong></span>
            <ArrowRight aria-hidden="true" className="overview-average-arrow" />
          </button>

          <button type="button" className="overview-pill-card" onClick={() => onNavigate('portfolios')}>
            <span className="overview-pill-icon"><Sparkles aria-hidden="true" /></span>
            <span><strong>{students.length} portfolios</strong><small>Explore the directory</small></span>
          </button>
        </div>
      </section>

      <section className="overview-capabilities" aria-label="Portfolio dimensions and tools">
        <span className="overview-capabilities-title">A whole-learner view</span>
        <div className="overview-capability"><BookOpen aria-hidden="true" /><span>Academics</span></div>
        <div className="overview-capability"><Trophy aria-hidden="true" /><span>Athletics</span></div>
        <div className="overview-capability"><ShieldCheck aria-hidden="true" /><span>Character</span></div>
        <div className="overview-capability"><HeartHandshake aria-hidden="true" /><span>Enrichment</span></div>
        <button type="button" className="overview-capability overview-capability-link" onClick={() => onNavigate('spreadsheet')}>
          <ArrowRight aria-hidden="true" /><span>Registry & Excel tools</span>
        </button>
      </section>
    </div>
  );
};