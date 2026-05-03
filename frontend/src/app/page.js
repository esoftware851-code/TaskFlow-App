"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import DashboardStats from '../components/DashboardStats';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import { fetchTasks, getStats, createTask, updateTask, deleteTask } from '../lib/api';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sort: 'createdAt'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Debounced load tasks
  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(handler);
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, statsData] = await Promise.all([
        fetchTasks(filters),
        getStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (taskToEdit) {
        await updateTask(taskToEdit._id, taskData);
      } else {
        await createTask(taskData);
      }
      loadData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2>Overview</h2>
        <p>Track your team's progress and stay on top of daily tasks.</p>
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--danger-color)', padding: '1rem', borderLeft: '4px solid var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}

      <DashboardStats stats={stats} />
      
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onOpenCreate={handleOpenCreate} 
      />

      {loading ? (
        <div className={styles.loadingSpinner}>Loading tasks...</div>
      ) : (
        <div className={styles.tasksGrid}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onEdit={handleOpenEdit} 
                onDelete={handleDeleteTask} 
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <h3>No tasks found</h3>
              <p>Try adjusting your filters or create a new task.</p>
            </div>
          )}
        </div>
      )}

      <TaskFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        initialData={taskToEdit}
      />
    </div>
  );
}
