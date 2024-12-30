import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../user/Sidebar.jsx';
import { ClassContainer, SidebarContainer, Content, ClassHeader } from '../../styles/ClassesStyles.js'; 

const ULendet = () => {
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/v1/lendet')
      .then(res => setSchools(res.data))
      .catch(err => setError('Error fetching schools: ' + err.message));
  }, []);

  return (
    <ClassContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Content>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <ClassHeader>Lista e Lendeve</ClassHeader>
              {error && <div className="alert alert-danger">{error}</div>}
              {schools.length === 0 && !error && (
                <div className="alert alert-warning">Ska lend</div>
              )}
              <table className="table table-bordered table-striped text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emri i Lendes</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, index) => (
                    <tr key={school.id}>
                      <td>{index + 1}</td>
                      <td>{school.lenda}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Content>
    </ClassContainer>
  );
};

export default ULendet;
