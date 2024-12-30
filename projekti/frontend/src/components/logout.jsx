import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/user-signIn');
  };

  return (
    <div className="container mt-5 text-center">
      <h2>You are about to log out</h2>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
