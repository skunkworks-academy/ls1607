import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ProgressTracker from '@site/src/components/ProgressTracker';
import styles from './index.module.css';

const lightLogo = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-black.png';
const darkLogo = 'https://raw.githubusercontent.com/skunkworks-academy/.github/refs/heads/main/images/favicon-white.png';

const capabilities = [
  {label: 'Motivation and initiative', score: 80, rating: 'Strong'},
  {label: 'Career direction', score: 60, rating: 'Developing'},
  {label: 'Technical foundations', score: 40, rating: 'Emerging'},
  {label: 'Applied practice', score: 40, rating: 'Emerging'},
  {label: 'Portfolio evidence', score: 20, rating: 'Early'},
  {label: 'Mentorship readiness', score: 100, rating: 'Very strong'},
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
            <picture>
              <source media="(prefers-color-scheme: dark)" srcSet={darkLogo} />
              <source media="(prefers-color-scheme: light)" srcSet={lightLogo} />
              <img src={lightLogo} alt="" />
            </picture>
            <span>Skunkworks Academy · Individual Development Roadmap</span>
          </div>
          <p className={styles.eyebrow}>Foundation Technical · July 2026–June 2027</p>
          <h1>Luca Sprunt</h1>
          <p className={styles.subtitle}>Cybersecurity Foundations · Systems Operations · Secure AI Automation</p>
          <p className={styles.lead}>
            A structured 12-month roadmap that converts curiosity and initiative into technical foundations,
            practical evidence, credential readiness and a credible transition into the ADF communications environment.
          </p>
          <div className={styles.actions}>
            <Link className={clsx('button button--primary button--lg', styles.primaryButton)} to="/roadmap/intro">
              Open the complete IDR
            </Link>
            <a
              className={clsx('button button--secondary button--lg', styles.secondaryButton)}
              href="https://github.com/skunkworks-academy/ls1607/raw/main/docs/Luca_Sprunt_Individual_Development_Roadmap.docx">
              Download editable IDR
            </a>
          </div>
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
            <span>Anchor capstone</span>
            <strong>Secure Personal Agent</strong>
          </div>
          <div className={styles.heroMetric}>
            <span>Review gates</span>
            <strong>30 · 60 · 90 Days</strong>
          </div>
        </aside>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="Luca Sprunt Individual Development Roadmap"
      description="Cybersecurity, systems operations and secure AI development roadmap for Luca Sprunt.">
      <Hero />
      <main className={styles.main}>
        <section className={styles.northStar}>
          <p className={styles.sectionKicker}>One-year North Star</p>
          <blockquote>
            By July 2027, Luca should have a documented cybersecurity foundation, an active GitHub portfolio,
            two to three practical projects, at least one validated entry-level learning milestone, regular mentor
            feedback and a clear transition plan into the ADF communications environment and cybersecurity degree.
          </blockquote>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Readiness dashboard</p>
              <h2>Current capability baseline</h2>
            </div>
            <Link to="/roadmap/profile">Review the full development profile →</Link>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map((capability) => (
              <article className={styles.capabilityCard} key={capability.label}>
                <div className={styles.capabilityHeader}>
                  <strong>{capability.label}</strong>
                  <span>{capability.rating}</span>
                </div>
                <div className={styles.bar} aria-label={`${capability.score}%`}>
                  <span style={{width: `${capability.score}%`}} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Foundation-first pathway</p>
              <h2>Four-stage progression</h2>
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

        <section className={styles.section}>
          <ProgressTracker />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>Portfolio evidence</p>
              <h2>Projects that demonstrate capability</h2>
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

        <section className={styles.callout}>
          <div>
            <p className={styles.sectionKicker}>Immediate action</p>
            <h2>Begin with the first 30-day foundation sprint.</h2>
            <p>Create the project board, start the learning log, establish the mentor cadence and baseline the OpenClaw agent before expanding its permissions.</p>
          </div>
          <Link className="button button--primary button--lg" to="/roadmap/execution-roadmap">
            Start the 30-day plan
          </Link>
        </section>
      </main>
    </Layout>
  );
}
