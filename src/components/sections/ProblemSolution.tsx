import type { LocalizedContent } from '../../data/content';

interface ProblemSolutionProps {
  content: LocalizedContent;
}

export default function ProblemSolution({ content }: ProblemSolutionProps) {
  return (
    <section className="problem-solution-section" id="about">
      <div className="content-container">
        <div className="problem-solution-card fade-up">
          <div className="problem-tag-wrap"><span className="problem-tag-line" /><span className="problem-tag">PROBLEM & SOLUTION</span><span className="problem-tag-line" /></div>
          <h2 className="problem-subtitle">{content.problemTitle}</h2>
          <p className="problem-body">{content.problemBody}</p>
          <div className="problem-highlight-inline">
            <span className="highlight-badge-mini">DEEP PLATE SOLUTION</span>
            <div className="highlight-text">{content.solution}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
