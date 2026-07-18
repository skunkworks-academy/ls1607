import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ProgressTracker from '@site/src/components/ProgressTracker';
import styles from './index.module.css';

const localLogo = '/ls1607/img/favicon.svg';

const capabilities = [
  {label: 'Motivation and initiative', score: 80, rating: 'Strong'},
  {label: 'Career direction', score: 60, rating: 'Developing'},
  {label: 'Technical foundations', score: 40, rating: 'Emerging'},
  {label: 'Applied practice', score: 40, rating: 'Emerging'},
  {label: 'Portfolio evidence', score: 20, rating: 'Early'},
  {label: 'Mentorship readiness', score: 100, rating: 'Very strong'},
];

const firstSteps = [
  {
    number: '01',
    title: 'Read and confirm the roadmap',
    copy: 'Review the IDR, confirm priorities and note anything that needs clarification during the first consultation.',
    link: '/roadmap/intro',
    action: 'Open the IDR',
  },
  {
    number: '02',
    title: 'Reserve 5–7 hours each week',
    copy: 'Protect Year 12 by scheduling a sustainable mix of theory, labs, portfolio work and weekly reflection.',
    link: '#execution-workspace',
    action: 'Open the timetable',
  },
  {
    number: '03',
    title: 'Create evidence, not just activity',
    copy: 'Turn learning into commits, diagrams, reports, lab notes and demonstrations that a mentor can review.',
    link: '/roadmap/evidence',
    action: 'Review evidence rules',
  },
];

const assignments = [
  {
    number: '01',
    title: 'GitHub Achievements Academy',
    copy: 'A short foundation task to practise legitimate GitHub workflows, capture evidence and reflect on what was learned.',
    link: '/roadmap/github-achievements-academy',
    action: 'Open foundation task',
  },
  {
    number: '02',
    title: 'OWASP Top 10 2025 Content Sprint',
    copy: 'Create audience-specific security content, a presenter package and an incident-response runbook.',
    link: '/roadmap/owasp-top-10-2025-content-sprint',
    action: 'Open portfolio assignment',
  },
];

const stages = [
  {
    number: '01',
    title: 'Technical Foundations',
    period: 'Months 1–3',
    copy: 'Linux, networking, Git/GitHub, command-line fluency and disciplined troubleshooting.',
    link: '/roadmap/pathway',
  },
  {
    number: '02',
    title: 'Cybersecurity Foundations',
    period: 'Months 3–6',
    copy: 'Security principles, identity, endpoint defence, network protection and incident basics.',
    link: '/roadmap/pathway',
  },
  {
    number: '03',
    title: 'Applied Security Operations',
    period: 'Months 6–9',
    copy: 'Log analysis, alert triage, hardening, reporting and evidence-led remediation.',
    link: '/roadmap/pathway',
  },
  {
    number: '04',
    title: 'Secure AI and Transition',
    period: 'Months 9–12',
    copy: 'Secure-agent engineering, ADF alignment, degree planning and career positioning.',
    link: '/roadmap/pathway',
  },
];

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          <div className={styles.brandLine}>
            <img src={localLogo} width="34" height="34" alt="" />
            <span>Skunkworks Academy · Individual Development Roadmap</span>
          </div>
          <p className={styles.eyebrow}>Your 12-month development workspace</p>
          <h1>
            Welcome,
            <span> Luca.</span>
          </h1>
          <p className={styles.subtitle}>Cybersecurity Foundations · Systems Operations · Secure AI Automation</p>
          <p className={styles.lead}>
            Plan your week, measure progress, build portfolio evidence and prepare for the ADF communications
            environment and a later cybersecurity degree—without losing focus on Year 12.
          </p>
          <div className={styles.actions}>
            <Link className={clsx('button button--primary button--lg', styles.primaryButton)} to="#getting-started">
              Start the first 10 days
            </Link>
            <a
              className={clsx('button button--secondary button--lg', styles.secondaryButton)}
              href="https://raw.githubusercontent.com/skunkworks-academy/ls1607/main/docs/Luca_Sprunt_Individual_Development_Roadmap.docx"
              download>
              Download my IDR
            </a>
            <Link className={clsx('button button--secondary button--lg', styles.secondaryButton)} to="/roadmap/intro">
              Read the full roadmap
            </Link>
          </div>
          <p className={styles.privacyNote}>
            <strong>Private by design:</strong> tracker data remains in this browser. Never record passwords, private keys
            or confidential information.
          </p>
        </div>

        <aside className={styles.heroPanel} aria-label="Roadmap summary">
          <div className={styles.heroMetric}>
            <span>Development level</span>
            <strong>Foundation Technical</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Primary pathway</span>
            <strong>Cybersecurity Operations</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Weekly commitment</span>
            <strong>5–7 sustainable hours</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Review gates</span>
            <strong>30 · 60 · 90 Days</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>North Star</span>
            <strong>16 July 2027</strong>
          </div>
        </aside>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="Welcome Luca — Individual Development Roadmap"
      description="Luca Sprunt’s personalised 12-month cybersecurity roadmap, weekly planner, progress dashboard and project evidence workspace.">
      <Hero />
      <main className={styles.main}>
        <section className={styles.quickStart} id="getting-started" aria-labelledby="getting-started-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Immediate action</p>
              <h2 id="getting-started-title">Start here</h2>
            </div>
            <span className={styles.sectionHint}>Complete these in order</span>
          </div>
          <div className={styles.quickStartGrid}>
            {firstSteps.map((step) => (
              <Link className={styles.quickStartCard} to={step.link} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                <strong>{step.action} →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="assignments-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Active work</p>
              <h2 id="assignments-title">Assigned tasks</h2>
            </div>
            <span className={styles.sectionHint}>Complete through GitHub issues and pull requests</span>
          </div>
          <div className={styles.quickStartGrid}>
            {assignments.map((assignment) => (
              <Link className={styles.quickStartCard} to={assignment.link} key={assignment.number}>
                <span>{assignment.number}</span>
                <h3>{assignment.title}</h3>
                <p>{assignment.copy}</p>
                <strong>{assignment.action} →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.northStar} aria-labelledby="north-star-title">
          <p className={styles.sectionKicker}>One-year North Star</p>
          <h2 className={styles.visuallyHidden} id="north-star-title">One-year development outcome</h2>
          <blockquote>
            By July 2027, Luca should have a documented cybersecurity foundation, an active GitHub portfolio,
            two to three practical projects, at least one validated entry-level learning milestone, regular mentor
            feedback and a clear transition plan into the ADF communications environment and cybersecurity degree.
          </blockquote>
        </section>

        <section className={styles.section} aria-labelledby="capability-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Readiness dashboard</p>
              <h2 id="capability-title">Current capability baseline</h2>
            </div>
            <Link to="/roadmap/profile">Review the full profile →</Link>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map((capability) => (
              <article className={styles.capabilityCard} key={capability.label}>
                <div className={styles.capabilityHeader}>
                  <strong>{capability.label}</strong>
                  <span>{capability.rating} · {capability.score}%</span>
                </div>
                <div
                  className={styles.bar}
                  role="progressbar"
                  aria-label={capability.label}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={capability.score}>
                  <span style={{width: `${capability.score}%`}} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="pathway-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Foundation-first pathway</p>
              <h2 id="pathway-title">Four-stage progression</h2>
            </div>
            <Link to="/roadmap/pathway">Open pathway details →</Link>
          </div>
          <div className={styles.stageGrid}>
            {stages.map((stage) => (
              <Link className={styles.stageCard} to={stage.link} key={stage.number}>
                <span className={styles.stageNumber}>{stage.number}</span>
                <p>{stage.period}</p>
                <h3>{stage.title}</h3>
                <span>{stage.copy}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section} id="execution-workspace" aria-label="Personal IDR execution workspace">
          <ProgressTracker />
        </section>

        <section className={styles.section} aria-labelledby="portfolio-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Portfolio evidence</p>
              <h2 id="portfolio-title">Projects that demonstrate capability</h2>
            </div>
            <Link to="/roadmap/portfolio">Open all project specifications →</Link>
          </div>
          <div className={styles.projectGrid}>
            <article><span>01</span><h3>Secure Personal Agent Baseline</h3><p>Threat model, secrets controls, audit logging, backups and a documented operating boundary.</p></article>
            <article><span>02</span><h3>Home SOC Mini-Lab</h3><p>Centralised logs, alert triage, incident notes and reproducible detection evidence.</p></article>
            <article><span>03</span><h3>Network Security Baseline</h3><p>Documented topology, segmentation, hardening checklist and validation evidence.</p></article>
            <article><span>04</span><h3>Python Security Utility</h3><p>A small defensive automation tool with tests, safe defaults and a clear README.</p></article>
          </div>
        </section>

        <section className={styles.callout} aria-labelledby="sprint-title">
          <div>
            <p className={styles.sectionKicker}>Next milestone</p>
            <h2 id="sprint-title">Begin the first 30-day foundation sprint.</h2>
            <p>Create the project board, start the learning log, establish the mentor cadence and baseline the OpenClaw agent before expanding its permissions.</p>
          </div>
          <Link className="button button--primary button--lg" to="/roadmap/execution-roadmap">
            Open the 30-day plan
          </Link>
        </section>
      </main>
    </Layout>
  );
}
