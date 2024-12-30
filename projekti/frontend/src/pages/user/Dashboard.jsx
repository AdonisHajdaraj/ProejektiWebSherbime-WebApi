import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Container, Row, Col, Card as BootstrapCard } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherDashboard = () => {
  const [chartData, setChartData] = useState({
    Matematika: null,
    Anglisht: null,
  });

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Grade Statistics' },
    },
  };


  const fetchData = async (subject) => {
    try {
      const response = await axios.get(`http://localhost:3001/v1/${subject.toLowerCase()}`);
      const grades = response.data;
      const gradeCategories = ['shkelqyshem', 'shumemire', 'mire', 'mjaftushem', 'nukkalon'];
      const data = gradeCategories.map((category) =>
        grades.reduce((acc, nota) => acc + nota[category], 0)
      );

      return {
        labels: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
        datasets: [{
          label: 'Grades',
          data,
          backgroundColor: subject === 'Matematika' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)',
          borderColor: subject === 'Matematika' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }],
      };
    } catch (error) {
      console.error(`Error fetching ${subject} data:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const subjects = ['Matematika', 'Anglisht'];
      const fetchedData = {};

      for (let subject of subjects) {
        const data = await fetchData(subject);
        if (data) {
          fetchedData[subject] = data;
        }
      }
      setChartData(fetchedData);
    };

    loadData();
  }, []);

  return (
    <Container>
      <Sidebar />
      <Row className="justify-content-center mt-4">
        {Object.keys(chartData).map((subject) => (
          chartData[subject] ? (
            <Col md={8} key={subject} className="mb-4">
              <BootstrapCard>
                <BootstrapCard.Body>
                  <BootstrapCard.Title>{`${subject} Grades`}</BootstrapCard.Title>
                  <Bar data={chartData[subject]} options={options} />
                </BootstrapCard.Body>
              </BootstrapCard>
            </Col>
          ) : null
        ))}
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
