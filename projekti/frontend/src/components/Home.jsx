import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/user-signIn');

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="#">School Management System</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="ms-auto">
              <button className="btn btn-primary" onClick={handleLoginClick}>Sign In</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container text-center my-5">
        <h1 className="display-4 fw-bold mb-3">Welcome to the School Management System</h1>
        <p className="lead mb-4">Manage all school operations with ease and efficiency.</p>
        <button className="btn btn-primary btn-lg" onClick={handleLoginClick}>Get Started</button>
      </div>

      <footer className="bg-light py-4 mt-5">
        <div className="container text-center">
          <p>© 2024 School Management System. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
