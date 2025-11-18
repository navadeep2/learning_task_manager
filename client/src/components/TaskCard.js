// client/src/components/TaskCard.js
import React, { useState } from 'react';
import { updateTask, deleteTask } from '../api/taskService';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  
  const isOwner = user && task.userId === user.userId;
  const canModify = isOwner;

  const handleProgressChange = async (e) => {
    if (!canModify) {
      alert("You can only change the progress of tasks you own.");
      return;
    }
    const newProgress = e.target.value;
    try {
      await updateTask(task._id, { progress: newProgress });
      onTaskUpdate(); // Refresh task list
    } catch (error) {
      alert(`Error updating task: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!canModify) {
      alert("You can only delete tasks you own.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask(task._id);
        onTaskDelete(task._id);
      } catch (error) {
        alert(`Error deleting task: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!canModify) return;

    const updates = {};
    if (editedTitle !== task.title) updates.title = editedTitle;
    if (editedDescription !== task.description) updates.description = editedDescription;

    if (Object.keys(updates).length > 0) {
      try {
        await updateTask(task._id, updates);
        onTaskUpdate(); // Refresh task list
        setIsEditing(false);
      } catch (error) {
        alert(`Error saving task: ${error.message}`);
      }
    } else {
      setIsEditing(false); // No changes, just close edit mode
    }
  };

  return (
    <div className={`task-card task-${task.progress}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="edit-input-title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="edit-input-description"
          />
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </>
      )}

      <p className="task-meta">
        **Created By:** {task.creatorName || (task.role === 'teacher' ? 'Teacher' : 'Student')}
      </p>
      {task.dueDate && (
        <p className="task-meta">
          **Due Date:** {new Date(task.dueDate).toLocaleDateString('en-GB')} {/* Changed date format */}
        </p>
      )}

      <div className="task-controls">
        <label htmlFor={`progress-${task._id}`}>Progress:</label>
        <select
          id={`progress-${task._id}`}
          value={task.progress}
          onChange={handleProgressChange}
          disabled={!canModify || isDeleting || isEditing}
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        {canModify && (
          isEditing ? (
            <button className="save-button" onClick={handleSaveEdit}>Save</button>
          ) : (
            <div className="task-actions">
              <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TaskCard;
