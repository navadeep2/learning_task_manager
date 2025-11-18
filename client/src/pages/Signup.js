// client/src/pages/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Basic client-side validation for student role
    if (role === 'student' && !teacherId) {
      setError('Student role requires a Teacher ID.');
      return;
    }

    const userData = {
      email,
      password,
      role,
      ...(role === 'student' && { teacherId }),
    };

    const result = await signup(userData);
    if (result.success) {
      setMessage('Signup successful! Please log in.');
      // Optionally navigate to login after successful signup
      setTimeout(() => navigate('/login'), 1500); 
    } else {
      setError(result.message || 'Signup failed.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {role === 'student' && (
          <input
            type="text"
            placeholder="Teacher ID (required for student)"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required={role === 'student'}
          />
        )}
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default Signup;
