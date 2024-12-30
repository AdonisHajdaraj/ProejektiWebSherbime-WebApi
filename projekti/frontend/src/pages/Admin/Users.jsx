import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';

function Users() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ id: '', name: '', email: '', password: '', role: '' });
    const [message, setMessage] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true); 
        try {
            const response = await axios.get('http://localhost:3001/v2/login');
            setUsers(response.data);
        } catch (error) {
            setMessage('Error fetching users.');
            console.error('Error fetching users:', error); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        try {
            let response;
            if (isEdit) {
                response = await axios.put(`http://localhost:3001/v1/login/${formData.id}`, formData);
                setMessage(`User updated: ${response.data.message}`);
            } else {
                response = await axios.post('http://localhost:3001/v1/login', formData);
                setMessage(`User added: ${response.data.message}`);
            }

            setFormData({ name: '', email: '', password: '', role: '' });
            setIsEdit(false);
            fetchUsers(); 
        } catch (error) {
            setMessage('Error saving user.');
            console.error('Error saving user:', error); 
        } finally {
            setLoading(false); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setLoading(true); 
            try {
                const response = await axios.delete(`http://localhost:3001/v1/login/${id}`);
                setMessage(`User deleted: ${response.data.message}`);
                fetchUsers(); 
            } catch (error) {
                setMessage('Error deleting user.');
                console.error('Error deleting user:', error); 
            } finally {
                setLoading(false); 
            }
        }
    };

    const handleEdit = (user) => {
        setFormData(user);
        setIsEdit(true);
    };

    return (
        <div className="container mt-5">
            <Sidebar />
            <h1 className="mb-4">Manage Users</h1>
            
            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-info'}`}>{message}</div>}
            
            {}
            <form onSubmit={handleSubmit} className="mb-4">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                />
                <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Email" 
                    name="email" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })} 
                />
                <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Password" 
                    name="password" 
                    value={formData.password} 
                    onChange={e => setFormData({ ...formData, password: e.target.value })} 
                />
                <select 
                    className="form-control" 
                    name="role" 
                    value={formData.role} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                    {isEdit ? 'Update User' : 'Add User'}
                </button>
            </form>

            {}
            {loading && <div className="alert alert-warning">Loading...</div>}

            {}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(user)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;
