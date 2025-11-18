// client/src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../api/taskService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const progressOptions = ['all', 'not-started', 'in-progress', 'completed'];
// Added date filter options
const dateFilterOptions = [
    { value: 'none', label: 'All Dates' },
    { value: 'this-week', label: 'Due This Week' },
    { value: 'overdue', label: 'Overdue' },
];

const Dashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressFilter, setProgressFilter] = useState('all'); // Renamed from 'filter'
  const [dateFilter, setDateFilter] = useState('none'); // New state for date filtering

  // useCallback hook to memoize the fetch function
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass the dateFilter to the API call
      const fetchedTasks = await getTasks(dateFilter === 'none' ? '' : dateFilter);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || 'Failed to load tasks.');
      if (err.message.includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [logout, navigate, dateFilter]); // Added dateFilter dependency

  // Fetch tasks whenever dateFilter or authLoading changes
  useEffect(() => {
    if (!authLoading) { 
        fetchTasks();
    }
  }, [fetchTasks, authLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTaskDelete = (deletedTaskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== deletedTaskId));
  };
  
  // Apply progress filter client-side
  const filteredTasks = tasks.filter(task => 
    progressFilter === 'all' || task.progress === progressFilter
  );

  if (authLoading) {
      return <div className="dashboard-container">Loading authentication data...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{user?.role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}</h1>
        <div className="user-info">
          <p>
            **Role:** <span className="role-tag">{user?.role.toUpperCase()}</span>
            {/* 💡 FIX: Display teacherId/userId for teachers and students alike */}
            {(user?.role === 'student' && user?.teacherId) && (
              <span className="teacher-id-info"> (Assigned Teacher ID: **{user.teacherId}**)</span>
            )}
            {(user?.role === 'teacher') && (
              <span className="teacher-id-info teacher-share-id"> (Your Teacher ID: **{user.userId}**)</span>
            )}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <div className="task-management-section">
        <TaskForm onTaskCreated={fetchTasks} />
      </div>

      <div className="task-list-section">
        <div className="filter-controls">
          <label htmlFor="progress-filter">Filter by Progress:</label>
          <select id="progress-filter" value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)}>
            {progressOptions.map(p => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
          
          {/* New Date Filter Dropdown */}
          <label htmlFor="date-filter">Filter by Due Date:</label>
          <select id="date-filter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            {dateFilterOptions.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <h2>My Learning Tasks</h2>
        {loading && <p>Loading tasks...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        
        <div className="task-list">
          {!loading && filteredTasks.length === 0 && <p>No tasks found for your access level or current filter.</p>}
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onTaskUpdate={fetchTasks} 
              onTaskDelete={handleTaskDelete} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
