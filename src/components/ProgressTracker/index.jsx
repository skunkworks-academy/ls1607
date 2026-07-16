import React, {useEffect, useMemo, useState} from 'react';
import styles from './styles.module.css';

const milestones = [
  {id: 'foundation', label: 'Linux and networking foundation', target: 'Month 3'},
  {id: 'github', label: 'GitHub profile and learning log', target: 'Day 30'},
  {id: 'agent', label: 'Secure Personal Agent baseline', target: 'Day 60'},
  {id: 'soc', label: 'Home SOC mini-lab', target: 'Month 6'},
  {id: 'credential', label: 'Entry-level credential readiness', target: 'Month 6–9'},
  {id: 'portfolio', label: 'Two documented portfolio projects', target: 'Month 9'},
  {id: 'adf', label: 'ADF transition evidence pack', target: 'Month 10'},
  {id: 'review', label: 'Annual IDR review and next-stage plan', target: 'Month 12'},
];

const storageKey = 'luca-idr-progress-v1';

export default function ProgressTracker() {
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setCompleted(JSON.parse(stored));
    } catch {
      setCompleted({});
    }
  }, []);

  const count = useMemo(
    () => milestones.filter((milestone) => completed[milestone.id]).length,
    [completed],
  );
  const percent = Math.round((count / milestones.length) * 100);

  function toggle(id) {
    setCompleted((current) => {
      const next = {...current, [id]: !current[id]};
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // The tracker remains usable for the current session if storage is blocked.
      }
      return next;
    });
  }

  function reset() {
    setCompleted({});
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // No action required.
    }
  }

  return (
    <section className={styles.tracker} aria-labelledby="tracker-title">
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Personal execution tracker</p>
          <h2 id="tracker-title">Roadmap progress</h2>
          <p>Mark completed milestones. Progress is stored only in this browser.</p>
        </div>
        <div className={styles.score} aria-label={`${percent}% complete`}>
          <strong>{percent}%</strong>
          <span>{count}/{milestones.length} milestones</span>
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span style={{width: `${percent}%`}} />
      </div>

      <div className={styles.grid}>
        {milestones.map((milestone) => (
          <label className={styles.item} key={milestone.id}>
            <input
              type="checkbox"
              checked={Boolean(completed[milestone.id])}
              onChange={() => toggle(milestone.id)}
            />
            <span className={styles.box} aria-hidden="true">✓</span>
            <span className={styles.copy}>
              <strong>{milestone.label}</strong>
              <small>{milestone.target}</small>
            </span>
          </label>
        ))}
      </div>

      <button className={styles.reset} type="button" onClick={reset}>
        Reset local progress
      </button>
    </section>
  );
}
