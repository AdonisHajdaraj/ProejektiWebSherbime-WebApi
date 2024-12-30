import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../user/Sidebar';
import { ClassContainer, SidebarContainer, Content, ClassHeader } from '../../styles/ClassesStyles';

const UShkollat = () => {
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await axios.get('http://localhost:3001/v1/shkollat');
      setSchools(response.data);
    } catch (err) {
      setError('Error fetching schools: ' + err.message);
      console.error('Error fetching schools:', err);
    }
  };

  return (
    <ClassContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Content>
        <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <ClassHeader>List of Schools</ClassHeader>
          </div>

          {}
          {error && <div className="alert alert-danger">{error}</div>}

          {}
          <table className="table table-bordered table-striped text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>School Name</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school, index) => (
                <tr key={school.id}>
                  <td>{index + 1}</td>
                  <td>{school.emri}</td>
                  <td>{school.qyteti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Content>
    </ClassContainer>
  );
};

export default UShkollat;
