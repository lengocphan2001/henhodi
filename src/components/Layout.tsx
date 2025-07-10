import React from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />
      <main style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 