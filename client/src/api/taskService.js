// client/src/api/taskService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
if (!token) {
    throw new Error('Authentication token not found.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // JWT token required for all task APIs
  };
};

// GET /tasks - Get tasks based on role access rules (now supports dateFilter)
export const getTasks = async (dateFilter = '') => {
  const queryString = dateFilter ? `?dateFilter=${dateFilter}` : '';
  const response = await fetch(`${API_URL}/tasks${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tasks');
  }
  return data; // Returns an array of tasks
};
// ... (rest of the functions remain the same: createTask, updateTask, deleteTask)
// POST /tasks - Create a new task
export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create task');
  }
  return data;
};

// PUT /tasks/:id - Update an existing task
export const updateTask = async (taskId, updateData) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update task');
  }
  return data;
};

// DELETE /tasks/:id - Delete a task
export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (response.status === 204) { // No content on successful delete
    return { success: true };
  }
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete task');
  }
  return data;
};
