import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../src/components/Home.jsx';

import AdminDashboard from '../src/pages/Admin/Dashboard';
import Dashboard from '../src/pages/user/Dashboard.jsx';
import UserSignIn from '../src/components/UserSignIn.jsx';
import Logout from '../src/components/logout.jsx';

import Shkollat from '../src/pages/Admin/Shkollat.jsx'
import Notat from '../src/pages/Admin/Notat.jsx';
import Lendet from '../src/pages/Admin/Lendet';

import Register from '../src/components/Register.jsx'
import Users from './pages/Admin/Users.jsx';

import UShkollat from '../src/pages/user/Shkollat.jsx';
import UNotat from '../src/pages/user/Notat.jsx';
import ULendet from '../src/pages/user/Lendet.jsx';

const App = () => { 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {}
        <Route path="/user-signIn" element={<UserSignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        
        {}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/shkollat" element={<Shkollat />} />
        <Route path="/admin/notat" element={<Notat />} />
        <Route path="/admin/lendet" element={<Lendet />} />
        <Route path="/admin/users" element={<Users />} />
        
        {}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/shkollat" element={<UShkollat />} />
        <Route path="/user/notat" element={<UNotat />} />
        <Route path="/user/lendet" element={<ULendet />} />

        {}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
