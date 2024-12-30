import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StudentsContainer, Content, StudentsContent, StudentsHeader } from '../../styles/StudentsStyles';
import { Spinner, Alert } from 'react-bootstrap';

const UNotat = () => {
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

  const handleSubjectChange = async (subject) => {
    const selected = subjects.find((s) => s.name === subject);
    if (!selected) return;

    setSelectedSubject(subject);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(selected.endpoint);
      if (Array.isArray(response.data)) {
        setGrades(response.data);
      } else {
        setGrades([]);
        setError(`Të dhënat për ${subject} nuk janë në formatin e pritur.`);
      }
    } catch (err) {
      setError(`Nuk mund të marr të dhënat për ${subject}.`);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (count, total) => {
    // Avoid division by zero
    return total > 0 ? ((count / total) * 100).toFixed(2) : 0;
  };

  const totalCounts = grades.reduce(
    (acc, grade) => {
      const { shkelqyshem, shumemire, mire, mjaftushem, nukkalon } = grade;
      acc.shkelqyshem += shkelqyshem || 0;
      acc.shumemire += shumemire || 0;
      acc.mire += mire || 0;
      acc.mjaftushem += mjaftushem || 0;
      acc.nukkalon += nukkalon || 0;

      // Sum of all categories to get total number of students in that grade record
      const gradeTotal = (shkelqyshem || 0) + (shumemire || 0) + (mire || 0) + (mjaftushem || 0) + (nukkalon || 0);
      acc.total += gradeTotal;
      
      return acc;
    },
    { shkelqyshem: 0, shumemire: 0, mire: 0, mjaftushem: 0, nukkalon: 0, total: 0 }
  );

  const overallPercentages = {
    shkelqyshem: calculatePercentage(totalCounts.shkelqyshem, totalCounts.total),
    shumemire: calculatePercentage(totalCounts.shumemire, totalCounts.total),
    mire: calculatePercentage(totalCounts.mire, totalCounts.total),
    mjaftushem: calculatePercentage(totalCounts.mjaftushem, totalCounts.total),
    nukkalon: calculatePercentage(totalCounts.nukkalon, totalCounts.total),
  };

  return (
    <StudentsContainer>
      <Sidebar />
      <Content>
        <StudentsContent className="text-center">
          <StudentsHeader>Rezultatet sipas lëndëve</StudentsHeader>

          <div className="mb-4">
            <label htmlFor="subject-select" className="form-label me-2">Zgjidh lëndën:</label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="form-select d-inline-block w-auto"
            >
              <option value="">-- Zgjidh një lëndë --</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>

          {selectedSubject && (
            <div className="d-flex justify-content-center mt-4">
              <div className="table-responsive" style={{ width: '60%' }}>
                <h3 className="text-center">Lënda: {selectedSubject}</h3>
                <table className="table table-striped table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Shkolla</th>
                      <th className="text-center">Shkëlqyeshëm</th>
                      <th className="text-center">Shumë Mirë</th>
                      <th className="text-center">Mirë</th>
                      <th className="text-center">Mjaftueshëm</th>
                      <th className="text-center">Nuk kalon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade, index) => {
                      const totalStudents = (grade.shkelqyshem || 0) + (grade.shumemire || 0) + (grade.mire || 0) + (grade.mjaftushem || 0) + (grade.nukkalon || 0);
                      return (
                        <tr key={index}>
                          <td>{grade.shkolla}</td>
                          {['shkelqyshem', 'shumemire', 'mire', 'mjaftushem', 'nukkalon'].map((category) => (
                            <td key={category} className="text-center">
                              {grade[category]} ({calculatePercentage(grade[category], totalStudents)}%)
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    <tr>
                      <td><strong>Totali (të gjitha shkollat)</strong></td>
                      {['shkelqyshem', 'shumemire', 'mire', 'mjaftushem', 'nukkalon'].map((category) => (
                        <td key={category} className="text-center">
                          {totalCounts[category]} ({overallPercentages[category]}%)
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
        </StudentsContent>
      </Content>
    </StudentsContainer>
  );
};

export default UNotat;
