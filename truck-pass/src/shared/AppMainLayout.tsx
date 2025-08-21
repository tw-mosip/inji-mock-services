import React from 'react';
import NavBar from '../commans/NavBar';

const AppMainLayout: React.FC<AppMainLayoutProps> = ({ children }) => {

  return (
    <div className="h-full w-full font-inter">
      <NavBar />
      {children}
    </div>
  )
}

interface AppMainLayoutProps {
  children: any;
}

export default AppMainLayout
