import React from 'react';
import Footer from './Footer';
import Header from './Header';
import CommunitySection from './CommunitySection';

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
        flexDirection: 'column',
      }}>
        {children}
        <div style={{
          background: '#232733',
          paddingTop: 'var(--space-4)',
          paddingBottom: 'var(--space-4)'
        }}>
          <CommunitySection />
        </div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 