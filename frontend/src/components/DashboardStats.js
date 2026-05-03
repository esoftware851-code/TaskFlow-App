"use client";

import styles from './DashboardStats.module.css';
import { LayoutList, CircleDashed, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const icons = {
  total: <LayoutList />,
  pending: <CircleDashed />,
  progress: <Clock />,
  completed: <CheckCircle2 />,
  overdue: <AlertCircle />
};

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className={styles.statsGrid}>
      <div className={`${styles.statCard} glass-panel`}>
        <div className={`${styles.iconContainer} ${styles.total}`}>
          {icons.total}
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.total || 0}</span>
          <span className={styles.statLabel}>Total Tasks</span>
        </div>
      </div>
      
      <div className={`${styles.statCard} glass-panel`}>
        <div className={`${styles.iconContainer} ${styles.pending}`}>
          {icons.pending}
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.pending || 0}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
      </div>

      <div className={`${styles.statCard} glass-panel`}>
        <div className={`${styles.iconContainer} ${styles.progress}`}>
          {icons.progress}
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.inProgress || 0}</span>
          <span className={styles.statLabel}>In Progress</span>
        </div>
      </div>

      <div className={`${styles.statCard} glass-panel`}>
        <div className={`${styles.iconContainer} ${styles.completed}`}>
          {icons.completed}
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.completed || 0}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
      </div>

      <div className={`${styles.statCard} glass-panel`}>
        <div className={`${styles.iconContainer} ${styles.overdue}`}>
          {icons.overdue}
        </div>
        <div className={styles.statInfo}>
          <span className={styles.statValue}>{stats.overdue || 0}</span>
          <span className={styles.statLabel}>Overdue</span>
        </div>
      </div>
    </div>
  );
}
