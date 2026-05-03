"use client";

import styles from './TaskCard.module.css';
import { Pencil, Trash2, Calendar } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No due date';

  return (
    <div className={`${styles.card} glass-panel animate-fade-in`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div className={styles.actions}>
          <button className={styles.btnAction} onClick={() => onEdit(task)} title="Edit Task">
            <Pencil size={16} />
          </button>
          <button className={`${styles.btnAction} ${styles.delete}`} onClick={() => onDelete(task._id)} title="Delete Task">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.footer}>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[`status-${task.status}`]}`}>
            {task.status.replace('-', ' ')}
          </span>
          <span className={`${styles.badge} ${styles[`priority-${task.priority}`]}`}>
            {task.priority}
          </span>
        </div>
        
        <div className={`${styles.date} ${isOverdue ? styles.overdueDate : ''}`}>
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
