import React from 'react';
import NavBar from '../components/NavBar';

const DriverRegistrationMainLayout: React.FC<DriverRegistrationMainLayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full font-inter">
      <NavBar />
      {children} 
    </div>
  )
}

interface DriverRegistrationMainLayoutProps {
  children: any;
}

export default DriverRegistrationMainLayout
