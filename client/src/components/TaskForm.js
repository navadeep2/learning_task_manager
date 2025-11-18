// client/src/components/TaskForm.js
import React, { useState } from 'react';
import { createTask } from '../api/taskService';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!title || !description) {
      setError('Title and Description are required.');
      return;
    }

    const newTask = {
      title,
      description,
      // Only include dueDate if it has a value
      ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
    };

    try {
      await createTask(newTask);
      setTitle('');
      setDescription('');
      setDueDate('');
      onTaskCreated(); // Refresh task list
    } catch (err) {
      setError(err.message || 'Failed to create task.');
    }
  };

  return (
    <div className="task-form-container">
      <h3>Add New Learning Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title (Required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Details (Required)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label htmlFor="dueDate">Optional Due Date:</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Create Task</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default TaskForm;
