import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StudentsContainer, Content, StudentsContent, StudentsHeader } from '../../styles/StudentsStyles';
import { Spinner, Alert } from 'react-bootstrap';

const Notat = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subjects = [
    { name: 'Matematika', endpoint: 'http://localhost:3001/v1/matematika' },
    { name: 'Gjuha Shqipe', endpoint: 'http://localhost:3001/v1/gjuheshqipe' },
    { name: 'Anglisht', endpoint: 'http://localhost:3001/v1/anglisht' },
    { name: 'Biologji', endpoint: 'http://localhost:3001/v1/biologji' },
    { name: 'Gjeografi', endpoint: 'http://localhost:3001/v1/gjeografi' },
  ];

  const gradeFields = ['shkelqyshem', 'shumemire', 'mire', 'mjaftushem', 'nukkalon'];

  const handleSubjectChange = async (subject) => {
    const selected = subjects.find((s) => s.name === subject);
    if (!selected) return;

    setSelectedSubject(subject);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(selected.endpoint);
      setGrades(response.data);
    } catch (err) {
      setError(`Nuk mund të marr të dhënat për ${subject}.`);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(2) : 0;
  };

  return (
    <StudentsContainer>
      <Sidebar />
      <Content>
        <StudentsContent className="text-center">
          <div className="d-flex flex-column align-items-center">
            <StudentsHeader className="mb-3">Rezultatet sipas lëndëve</StudentsHeader>

            <div className="mb-4 w-50">
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="form-select"
              >
                <option value="">-- Zgjidh një lëndë --</option>
                {subjects.map((subject) => (
                  <option key={subject.name} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedSubject && (
              <>
                <div className="table-container mb-4" style={{ maxWidth: '600px', width: '100%' }}>
                  <h4 className="mb-3">Lënda: {selectedSubject}</h4>
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Shkolla</th>
                        {gradeFields.map((field) => (
                          <th key={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grades.length === 0 ? (
                        <tr>
                          <td colSpan={gradeFields.length + 1}>Nuk ka të dhëna për këtë lëndë.</td>
                        </tr>
                      ) : (
                        grades.map((grade) => {
                          const totalStudents = gradeFields.reduce((total, field) => total + grade[field], 0);
                          return (
                            <tr key={grade.id}>
                              <td>{grade.shkolla}</td>
                              {gradeFields.map((field) => (
                                <td key={field}>
                                  {`${grade[field]} (${calculatePercentage(grade[field], totalStudents)}%)`}
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
          </div>
        </StudentsContent>
      </Content>
    </StudentsContainer>
  );
};

export default Notat;
