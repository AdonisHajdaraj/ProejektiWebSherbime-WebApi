import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; 
import { BsGraphUp, BsPeople, BsPerson, BsGear, BsList } from 'react-icons/bs';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ isOpen }) => (isOpen ? '250px' : '80px')};
  height: 100%;
  background-color: #2c3e50; /* Dark blue background */
  color: white;
  overflow-y: auto;
  padding-top: 60px;
  transition: width 0.3s ease; /* Smooth width transition */
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
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
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #34495e;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  margin-left: 10px;
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
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

const ToggleIcon = styled.span`
  color: white;
  font-size: 20px;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
   
  return (
    <SidebarContainer isOpen={isOpen}>
  
        <SidebarHeader>User</SidebarHeader>
        <SidebarNav>
          <SidebarNavItem>
            <SidebarIcon><BsGraphUp /></SidebarIcon>
            <StyledLink to="/user/dashboard">Dashboard</StyledLink>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarIcon><BsPeople /></SidebarIcon>
            <StyledLink to="/user/shkollat">Shkollat</StyledLink>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarIcon><BsPeople /></SidebarIcon>
            <StyledLink to="/user/notat">Notat</StyledLink>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarIcon><BsPerson /></SidebarIcon>
            <StyledLink to="/user/lendet">Lendet</StyledLink>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarIcon><BsGear /></SidebarIcon>
            <StyledLink to="/logout">Logout</StyledLink>
          </SidebarNavItem>
        </SidebarNav>
        <ToggleButton onClick={toggleSidebar} aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}>
          <ToggleIcon isOpen={isOpen}><BsList /></ToggleIcon>
        </ToggleButton>
    </SidebarContainer>
  );
};

export default Sidebar;
