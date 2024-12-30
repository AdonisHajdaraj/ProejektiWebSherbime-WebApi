import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';
import { ClassContainer, SidebarContainer, Content, ClassHeader } from '../../styles/ClassesStyles';

const Shkollat = () => {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({ emri: '', qyteti: '' });
  const [editedSchool, setEditedSchool] = useState({ emri: '', qyteti: '' });
  const [editingSchool, setEditingSchool] = useState(null);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    console.log("Fetching list of schools..."); 
    fetchSchools();
  }, []);

  const fetchSchools = () => {
    axios.get('http://localhost:3001/v1/shkollat')
      .then(res => {
        console.log("Successfully fetched schools:", res.data); 
        setSchools(res.data);
      })
      .catch(err => {
        console.error('Error fetching schools:', err); 
        setError('Error fetching schools: ' + err.message);
      });
  };


  const handleAddSchool = () => {
    if (newSchool.emri.trim() && newSchool.qyteti.trim()) {
      console.log("Adding new school:", newSchool); 
      axios.post('http://localhost:3001/v2/shkollat', newSchool)
        .then(res => {
          console.log("Successfully added new school:", res.data); 
          setSchools([...schools, res.data]);
          setNewSchool({ emri: '', qyteti: '' });
        })
        .catch(err => {
          console.error('Error adding school:', err); 
          setError('Error adding school: ' + err.message);
        });
    }
  };


  const handleDeleteSchool = (id) => {
    console.log("Deleting school with ID:", id); 
    axios.delete(`http://localhost:3001/v2/shkollat/${id}`)
      .then(() => {
        console.log("Successfully deleted school with ID:", id); 
        setSchools(schools.filter(school => school.id !== id));
      })
      .catch(err => {
        console.error('Error deleting school:', err);
        setError('Error deleting school: ' + err.message);
      });
  };

 
  const handleEditSchool = (school) => {
    console.log("Editing school with ID:", school.id);
    setEditingSchool(school);
    setEditedSchool({ emri: school.emri, qyteti: school.qyteti });
  };


  const handleSaveEditSchool = () => {
    if (editedSchool.emri.trim() && editedSchool.qyteti.trim()) {
      console.log("Saving edited school:", editedSchool); 
      axios.put(`http://localhost:3001/v1/shkollat/${editingSchool.id}`, editedSchool)
        .then(res => {
          console.log("Successfully saved edited school:", res.data); 
          setSchools(schools.map(school => school.id === res.data.id ? res.data : school));
          setEditingSchool(null);
          setEditedSchool({ emri: '', qyteti: '' });
        })
        .catch(err => {
          console.error('Error saving edited school:', err);
          setError('Error editing school: ' + err.message);
        });
    }
  };

  return (
    <ClassContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Content>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <ClassHeader>Lista e Shkollave</ClassHeader>
                <div>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newSchool.emri}
                    onChange={(e) => setNewSchool({ ...newSchool, emri: e.target.value })} 
                    placeholder="Shto Shkollën" 
                  />
                  <input 
                    type="text" 
                    className="form-control mt-2" 
                    value={newSchool.qyteti}
                    onChange={(e) => setNewSchool({ ...newSchool, qyteti: e.target.value })} 
                    placeholder="Shto Qytetin" 
                  />
                  <button onClick={handleAddSchool} className="btn btn-success mt-2">Shto</button>
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {schools.length === 0 && !error && <div className="alert alert-warning">Ska shkolla</div>}

              <table className="table table-bordered table-striped text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emri i Shkollës</th>
                    <th>Qyteti</th>
                    <th>Veprime</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, index) => (
                    <tr key={school.id}>
                      <td>{index + 1}</td>
                      <td>
                        {editingSchool && editingSchool.id === school.id ? (
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editedSchool.emri}
                            onChange={(e) => setEditedSchool({ ...editedSchool, emri: e.target.value })} 
                          />
                        ) : school.emri}
                      </td>
                      <td>
                        {editingSchool && editingSchool.id === school.id ? (
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editedSchool.qyteti}
                            onChange={(e) => setEditedSchool({ ...editedSchool, qyteti: e.target.value })} 
                          />
                        ) : school.qyteti}
                      </td>
                      <td>
                        {editingSchool && editingSchool.id === school.id ? (
                          <button onClick={handleSaveEditSchool} className="btn btn-primary">Ruaj</button>
                        ) : (
                          <button onClick={() => handleEditSchool(school)} className="btn btn-warning">Edito</button>
                        )}
                        <button onClick={() => handleDeleteSchool(school.id)} className="btn btn-danger ml-2">Fshi</button>
                      </td>
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

export default Shkollat;
