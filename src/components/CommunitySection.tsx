import React from 'react';

const CommunitySection: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      maxWidth: 'var(--container-xl)',
      margin: '0 auto',
      padding: isMobile ? 'var(--space-2) var(--space-2)' : 'var(--space-4) var(--space-4)',
      marginBottom: isMobile ? 'var(--space-4)' : 'var(--space-5)'
    }}>
      <div style={{
        background: '#181a20',
        borderRadius: 'var(--radius-sm)',
        padding: isMobile ? 'var(--space-4)' : 'var(--space-5)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)',
          fontWeight: 'var(--font-bold)',
          color: '#3b82f6',
          marginBottom: 'var(--space-2)',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-tight)'
        }}>
          CỘNG ĐỒNG GÁI GỌI PHÚ QUỐC
        </div>
        <div style={{
          width: '100px',
          height: '2px',
          background: '#3b82f6',
          marginBottom: 'var(--space-3)'
        }}></div>

        {/* Description */}
        <div style={{
          fontFamily: 'var(--font-primary)',
          fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)',
          color: '#fff',
          lineHeight: 'var(--leading-relaxed)',
          letterSpacing: 'var(--tracking-normal)',
          marginBottom: 'var(--space-4)'
        }}>
          Cộng đồng ăn chơi Gái Gọi Phú Quốc, nơi chia sẻ thông tin các em hàng đang hoạt động tại khu vực với chất lượng được đảm bảo uy tín nhất hiện nay. Chúng tôi cam kết mang đến sân chơi lành mạnh vì lợi ích của anh em Checker Phú Quốc.
        </div>

        {/* Contact Section */}
        <div style={{
          fontFamily: 'var(--font-primary)',
          fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)',
          color: '#fff',
          marginBottom: 'var(--space-2)'
        }}>
          Liên hệ đăng bài:
        </div>
        <a
          href="https://t.me/tubapq01"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-primary)',
            fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)',
            color: '#3b82f6',
            textDecoration: 'none',
            border: '1px dashed #3b82f6',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-2) var(--space-2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
        >
          https://t.me/tubapq01
        </a>
      </div>
    </div>
  );
};

export default CommunitySection;

