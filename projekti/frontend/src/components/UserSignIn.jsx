import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const UserSignIn = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const validate = ({ email, password }) => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios.post('http://localhost:3001/v1/signin', values)
        .then((res) => {
          const { token, role } = res.data;
          if (token) {
            localStorage.setItem('token', token);
            role === 'admin' ? navigate('/admin/dashboard') : navigate('/user/dashboard');
          } else {
            alert('Authentication failed.');
          }
        })
        .catch(() => alert('An error occurred. Please try again.'));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-light">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4 text-primary">Sign In</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="email">Email Address</label>
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="password">Password</label>
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button type="submit" className="btn btn-primary btn-lg">Sign In</button>
                </div>

                <div className="text-center">
                  <Link to="/register" className="link-primary">Sign up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignIn;
