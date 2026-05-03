"use client";

import { Search, Plus, FilterX } from 'lucide-react';
import styles from './FilterBar.module.css';

export default function FilterBar({ filters, setFilters, onOpenCreate }) {
  const handleReset = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sort: 'createdAt'
    });
  };

  return (
    <div className={`${styles.filterBar} glass-panel`}>
      <div className={styles.searchGroup}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="Search tasks..." 
          value={filters.search || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>

      <div className={styles.filterGroup}>
        <select 
          value={filters.status || 'all'} 
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select 
          value={filters.priority || 'all'} 
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select 
          value={filters.sort || 'createdAt'} 
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
        >
          <option value="createdAt">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Highest Priority</option>
        </select>

        <button className={styles.btnReset} onClick={handleReset} title="Reset filters">
          <FilterX size={18} />
        </button>
      </div>

      <button className={styles.btnCreate} onClick={onOpenCreate}>
        <Plus size={20} />
        New Task
      </button>
    </div>
  );
}
