import React, {useEffect, useMemo, useState} from 'react';
import styles from './styles.module.css';

const milestones = [
  {id: 'consultation', label: 'Career consultation and priorities confirmed', target: 'Day 10'},
  {id: 'calendar', label: 'Sustainable weekly study calendar active', target: 'Day 10'},
  {id: 'github', label: 'GitHub profile and learning log published', target: 'Day 30'},
  {id: 'foundation', label: 'Linux and networking foundation evidenced', target: 'Month 3'},
  {id: 'agent', label: 'Secure Personal Agent baseline reviewed', target: 'Day 60'},
  {id: 'soc', label: 'Home SOC mini-lab demonstrated', target: 'Month 6'},
  {id: 'credential', label: 'Entry-level credential readiness gate passed', target: 'Month 6–9'},
  {id: 'portfolio', label: 'Two documented portfolio projects complete', target: 'Month 9'},
];

const weeklyPlan = [
  {id: 'theory', label: 'Theory and structured learning', slot: 'Tuesday', target: 1.5},
  {id: 'lab', label: 'Linux and network lab', slot: 'Thursday', target: 1.5},
  {id: 'project', label: 'Portfolio project', slot: 'Saturday', target: 2},
  {id: 'review', label: 'Review and planning', slot: 'Sunday', target: 1},
];

const projects = [
  {id: 'agent', label: 'Secure Personal Agent', evidence: 'Threat model, controls and recovery test'},
  {id: 'soc', label: 'Home SOC Mini-Lab', evidence: 'Log inventory, alerts and incident report'},
  {id: 'network', label: 'Network Security Baseline', evidence: 'Topology, asset register and hardening checklist'},
  {id: 'python', label: 'Python Security Utility', evidence: 'Tested code, safe defaults and usage guide'},
];

const reviewers = [
  {id: 'learner', role: 'Learner', name: 'Luca Sprunt'},
  {id: 'mentor', role: 'Mentor', name: 'Raydo'},
  {id: 'consultant', role: 'Career consultant', name: 'Analita'},
  {id: 'coordinator', role: 'Training coordinator', name: 'Maria'},
];

const storageKey = 'luca-idr-workspace-v2';
const emptyState = {
  milestones: {},
  hours: {},
  projects: {},
  reviews: {},
};

function clamp(value, maximum = 100) {
  return Math.max(0, Math.min(maximum, Number(value) || 0));
}

export default function ProgressTracker() {
  const [state, setState] = useState(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          milestones: parsed.milestones || {},
          hours: parsed.hours || {},
          projects: parsed.projects || {},
          reviews: parsed.reviews || {},
        });
      }
    } catch {
      setState(emptyState);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // The workspace remains usable for this browser session when storage is blocked.
    }
  }, [ready, state]);

  const metrics = useMemo(() => {
    const completedMilestones = milestones.filter((item) => state.milestones[item.id]).length;
    const milestonePercent = Math.round((completedMilestones / milestones.length) * 100);
    const weeklyHours = weeklyPlan.reduce((total, item) => total + clamp(state.hours[item.id], 12), 0);
    const projectAverage = Math.round(
      projects.reduce((total, item) => total + clamp(state.projects[item.id]), 0) / projects.length,
    );
    const approvedReviews = reviewers.filter((item) => state.reviews[item.id]?.status === 'approved').length;
    const overall = Math.round(
      milestonePercent * 0.45 + Math.min(weeklyHours / 5, 1) * 20 + projectAverage * 0.25 + (approvedReviews / reviewers.length) * 10,
    );
    return {completedMilestones, milestonePercent, weeklyHours, projectAverage, approvedReviews, overall};
  }, [state]);

  function update(section, id, value) {
    setState((current) => ({
      ...current,
      [section]: {...current[section], [id]: value},
    }));
  }

  function updateReview(id, field, value) {
    setState((current) => ({
      ...current,
      reviews: {
        ...current.reviews,
        [id]: {...(current.reviews[id] || {}), [field]: value},
      },
    }));
  }

  function reset() {
    if (!window.confirm('Reset all progress saved in this browser?')) return;
    setState(emptyState);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // No action required.
    }
  }

  function exportProgress() {
    const payload = JSON.stringify({exportedAt: new Date().toISOString(), state}, null, 2);
    const href = URL.createObjectURL(new Blob([payload], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = href;
    link.download = 'luca-idr-progress.json';
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <section className={styles.tracker} aria-labelledby="tracker-title">
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Personal execution workspace</p>
          <h2 id="tracker-title">Plan, measure and evidence progress</h2>
          <p>Updates stay in this browser. Do not record passwords, private keys or confidential information.</p>
        </div>
        <div
          className={styles.score}
          role="progressbar"
          aria-label="Overall roadmap progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={metrics.overall}>
          <strong>{metrics.overall}%</strong>
          <span>overall progress</span>
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span style={{width: `${metrics.overall}%`}} />
      </div>

      <div className={styles.metricGrid} aria-label="Roadmap performance summary">
        <article>
          <span>Milestones</span>
          <strong>{metrics.completedMilestones}/{milestones.length}</strong>
          <small>{metrics.milestonePercent}% complete</small>
        </article>
        <article>
          <span>Weekly effort</span>
          <strong>{metrics.weeklyHours.toFixed(1)}h</strong>
          <small>target: 5–7 hours</small>
        </article>
        <article>
          <span>Portfolio</span>
          <strong>{metrics.projectAverage}%</strong>
          <small>average project progress</small>
        </article>
        <article>
          <span>Approvals</span>
          <strong>{metrics.approvedReviews}/{reviewers.length}</strong>
          <small>review workflow</small>
        </article>
      </div>

      <div className={styles.workspaceSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>First 90 days</p>
            <h3>Milestone checklist</h3>
          </div>
          <span>{metrics.completedMilestones} complete</span>
        </div>
        <div className={styles.grid}>
          {milestones.map((milestone) => (
            <label className={styles.item} key={milestone.id}>
              <input
                type="checkbox"
                checked={Boolean(state.milestones[milestone.id])}
                onChange={(event) => update('milestones', milestone.id, event.target.checked)}
              />
              <span className={styles.box} aria-hidden="true">✓</span>
              <span className={styles.copy}>
                <strong>{milestone.label}</strong>
                <small>{milestone.target}</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.workspaceSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>Time management</p>
            <h3>Starter weekly timetable</h3>
          </div>
          <span className={metrics.weeklyHours >= 5 && metrics.weeklyHours <= 7 ? styles.onTarget : ''}>
            {metrics.weeklyHours.toFixed(1)} of 5–7 hours
          </span>
        </div>
        <div className={styles.tableScroller} tabIndex="0" aria-label="Scrollable weekly timetable">
          <table>
            <caption className={styles.visuallyHidden}>Weekly IDR timetable and completed hours</caption>
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Suggested slot</th>
                <th scope="col">Target</th>
                <th scope="col">Completed</th>
              </tr>
            </thead>
            <tbody>
              {weeklyPlan.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.label}</th>
                  <td>{item.slot}</td>
                  <td>{item.target.toFixed(1)}h</td>
                  <td>
                    <label className={styles.visuallyHidden} htmlFor={`hours-${item.id}`}>
                      Completed hours for {item.label}
                    </label>
                    <input
                      id={`hours-${item.id}`}
                      type="number"
                      min="0"
                      max="12"
                      step="0.25"
                      inputMode="decimal"
                      value={state.hours[item.id] || 0}
                      onChange={(event) => update('hours', item.id, clamp(event.target.value, 12))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.workspaceSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>Portfolio evidence</p>
            <h3>Project progress</h3>
          </div>
          <span>{metrics.projectAverage}% average</span>
        </div>
        <div className={styles.projectGrid}>
          {projects.map((project) => {
            const value = clamp(state.projects[project.id]);
            return (
              <article key={project.id}>
                <div>
                  <h4>{project.label}</h4>
                  <output htmlFor={`project-${project.id}`}>{value}%</output>
                </div>
                <p>{project.evidence}</p>
                <label className={styles.visuallyHidden} htmlFor={`project-${project.id}`}>
                  Progress for {project.label}
                </label>
                <input
                  id={`project-${project.id}`}
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={value}
                  onChange={(event) => update('projects', project.id, clamp(event.target.value))}
                />
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.workspaceSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>Governance</p>
            <h3>Review and sign-off workflow</h3>
          </div>
          <span>{metrics.approvedReviews} approved</span>
        </div>
        <div className={styles.tableScroller} tabIndex="0" aria-label="Scrollable review register">
          <table>
            <caption className={styles.visuallyHidden}>IDR review and sign-off workflow</caption>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviewers.map((reviewer) => (
                <tr key={reviewer.id}>
                  <th scope="row">{reviewer.role}</th>
                  <td>{reviewer.name}</td>
                  <td>
                    <label className={styles.visuallyHidden} htmlFor={`status-${reviewer.id}`}>
                      {reviewer.role} review status
                    </label>
                    <select
                      id={`status-${reviewer.id}`}
                      value={state.reviews[reviewer.id]?.status || 'not-started'}
                      onChange={(event) => updateReview(reviewer.id, 'status', event.target.value)}>
                      <option value="not-started">Not started</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                    </select>
                  </td>
                  <td>
                    <label className={styles.visuallyHidden} htmlFor={`date-${reviewer.id}`}>
                      {reviewer.role} review date
                    </label>
                    <input
                      id={`date-${reviewer.id}`}
                      type="date"
                      value={state.reviews[reviewer.id]?.date || ''}
                      onChange={(event) => updateReview(reviewer.id, 'date', event.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.governanceNote}>
          This register tracks workflow status. Formal signatures remain in the controlled IDR document.
        </p>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={exportProgress}>Export progress</button>
        <button type="button" onClick={() => window.print()}>Print or save PDF</button>
        <button className={styles.reset} type="button" onClick={reset}>Reset local progress</button>
      </div>
    </section>
  );
}
