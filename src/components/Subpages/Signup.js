
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8 || formData.password.length > 255) {
      setError('Password must be 8 to 255 characters');
      setMessage('');
      return;
    }


    if (formData.username.length < 5) {
      setError('Username should be at least 5 characters long');
      setMessage('');
      return;
    }
    
    try {
      const response = await axios.post('http://13.234.23.179:3004/auth/signup', formData);
      console.log(response.data);
      setMessage(response.data.message); // Set the success message
      setError('');
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response.data.error); // Set the error message
      setMessage('');
    }
  };

  return (
    <div className="signup-container">
      <form  className="signup-form" onSubmit={handleSubmit}>
      <h2 style={{textAlign:'center'}}>Registration</h2>
      {message && <div className="success-message" style={{color:'green'}}>{message}</div>}
      {error && <div className="error-message" style={{color:'red'}}>{error}</div>}
      <br />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
        <p className="para">
          Already have an account?{' '}
          <Link to="/signin" className="hp">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
