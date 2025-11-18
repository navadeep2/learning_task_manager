// client/src/api/authService.js

// FIX: Set the base URL to the server root (http://localhost:5000), 
// aligning with the REACT_APP_API_URL set in client/.env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Handles user sign-up.
 * @param {object} userData - User data (email, password, role, teacherId)
 */
export const signup = async (userData) => {
  // Correct path is explicitly defined: /auth/signup
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data;
};

/**
 * Handles user login.
 * @param {object} credentials - User credentials (email, password)
 */
export const login = async (credentials) => {
  // Correct path is explicitly defined: /auth/login
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};
