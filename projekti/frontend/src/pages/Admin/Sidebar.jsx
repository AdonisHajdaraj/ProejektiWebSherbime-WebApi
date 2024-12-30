import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BsGraphUp, BsPeople, BsBook, BsCalendar, BsGear } from 'react-icons/bs';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  height: 100%;
  background: #2c3e50;
  color: white;
  overflow-y: auto;
  padding-top: 60px;
  transition: width 0.3s;
  z-index: 100;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
`;

const SidebarNavItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 18px;
  border-bottom: 1px solid #34495e;
  &:hover {
    background-color: #34495e;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-left: 10px;
`;

const Logo = styled.img`
  width: 50px;
  height: auto;
`;

const ToggleButton = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: #34495e;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContainer isOpen={isOpen}>
    
      <SidebarNav>
        
        <SidebarNavItem><BsGraphUp /><StyledLink to="/admin/dashboard">Dashboard</StyledLink></SidebarNavItem>
        <SidebarNavItem><BsPeople /><StyledLink to="/admin/shkollat">Shkollat</StyledLink></SidebarNavItem>
        <SidebarNavItem><BsPeople /><StyledLink to="/admin/users">Users</StyledLink></SidebarNavItem>
        <SidebarNavItem><BsBook /><StyledLink to="/admin/notat">Notat</StyledLink></SidebarNavItem>
        <SidebarNavItem><BsCalendar /><StyledLink to="/admin/lendet">Lendet</StyledLink></SidebarNavItem>
        <SidebarNavItem><BsGear /><StyledLink to="/logout">Logout</StyledLink></SidebarNavItem>
      </SidebarNav>
      <ToggleButton onClick={toggleSidebar}>▲</ToggleButton>
    </SidebarContainer>
  );
};

export default Sidebar;
