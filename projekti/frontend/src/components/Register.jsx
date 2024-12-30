import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Emri është i detyrueshëm.";
    if (!values.email) {
      errors.email = "Email është i detyrueshëm.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Email nuk është valid.";
    }
    if (!values.password) errors.password = "Fjalëkalimi është i detyrueshëm.";
    else if (values.password.length < 6) errors.password = "Fjalëkalimi duhet të ketë të paktën 6 karaktere.";
    return errors;
  };

  const handleInputChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios.post('http://localhost:3001/v1/register', values)
        .then(res => {
          if (res.data.token) {
            localStorage.setItem('jwtToken', res.data.token);
            navigate('/user-signIn');
          }
        })
        .catch(console.error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Regjistrohu</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'password'].map(field => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">{field === 'name' ? 'Emri' : field === 'email' ? 'Email' : 'Fjalëkalimi'}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              className="form-control"
              id={field}
              name={field}
              value={values[field]}
              onChange={handleInputChange}
              required
            />
            {errors[field] && <div className="text-danger">{errors[field]}</div>}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Regjistrohu</button>
      </form>
    </div>
  );
};

export default Register;
