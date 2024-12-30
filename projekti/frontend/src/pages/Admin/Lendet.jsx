import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';
import { ClassContainer, SidebarContainer, Content, ClassHeader } from '../../styles/ClassesStyles';

const Lendet = () => {
  const [schools, setSchools] = useState([]);
  const [newLenda, setNewLenda] = useState('');
  const [error, setError] = useState(null);
  const [editingLenda, setEditingLenda] = useState(null);
  const [editedLenda, setEditedLenda] = useState('');


  useEffect(() => {
    console.log("Fetching list of subjects..."); 
    axios.get('http://localhost:3001/v1/lendet')
      .then(res => {
        console.log("Successfully fetched subjects:", res.data); 
        setSchools(res.data);
      })
      .catch(err => {
        console.error('Error fetching schools:', err); 
        setError('Error fetching schools: ' + err.message);
      });
  }, []);

  
  const handleAddLenda = () => {
    if (newLenda.trim()) {
      console.log("Adding new subject:", newLenda); 
      axios.post('http://localhost:3001/v2/lendet', { lenda: newLenda })
        .then(res => {
          console.log("Successfully added subject:", res.data); 
          setSchools([...schools, res.data]);
          setNewLenda('');
        })
        .catch(err => {
          console.error('Error adding subject:', err); 
          setError('Error adding school: ' + err.message);
        });
    }
  };


  const handleDeleteLenda = (id) => {
    console.log("Deleting subject with ID:", id); 
    axios.delete(`http://localhost:3001/v2/lendet/${id}`)
      .then(() => {
        console.log("Successfully deleted subject with ID:", id);
        setSchools(schools.filter(school => school.id !== id));
      })
      .catch(err => {
        console.error('Error deleting subject:', err); 
        setError('Error deleting school: ' + err.message);
      });
  };

 
  const handleEditLenda = (school) => {
    console.log("Editing subject with ID:", school.id); 
    setEditingLenda(school);
    setEditedLenda(school.lenda);
  };


  const handleSaveEditLenda = () => {
    if (editedLenda.trim()) {
      console.log("Saving edited subject:", editedLenda);
      axios.put(`http://localhost:3001/v1/lendet/${editingLenda.id}`, { lenda: editedLenda })
        .then(res => {
          console.log("Successfully saved edited subject:", res.data); 
          setSchools(schools.map(school => school.id === res.data.id ? res.data : school));
          setEditingLenda(null);
          setEditedLenda('');
        })
        .catch(err => {
          console.error('Error editing subject:', err); 
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
                <ClassHeader>Lista e Lendeve</ClassHeader>
                <div>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newLenda}
                    onChange={(e) => setNewLenda(e.target.value)} 
                    placeholder="Shto Lenden" 
                  />
                  <button onClick={handleAddLenda} className="btn btn-success mt-2">Shto</button>
                </div>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {schools.length === 0 && !error && <div className="alert alert-warning">Ska lend</div>}
              <table className="table table-bordered table-striped text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Emri i Lendes</th>
                    <th>Veprime</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, index) => (
                    <tr key={school.id}>
                      <td>{index + 1}</td>
                      <td>
                        {editingLenda && editingLenda.id === school.id ? (
                          <input 
                            type="text" 
                            className="form-control" 
                            value={editedLenda}
                            onChange={(e) => setEditedLenda(e.target.value)} 
                          />
                        ) : (
                          school.lenda
                        )}
                      </td>
                      <td>
                        {editingLenda && editingLenda.id === school.id ? (
                          <button onClick={handleSaveEditLenda} className="btn btn-primary">Ruaj</button>
                        ) : (
                          <button onClick={() => handleEditLenda(school)} className="btn btn-warning">Edito</button>
                        )}
                        <button 
                          onClick={() => handleDeleteLenda(school.id)} 
                          className="btn btn-danger ml-2"
                        >
                          Fshi
                        </button>
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

export default Lendet;
