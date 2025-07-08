import React from 'react';

const InfoSection: React.FC = () => (
  <div style={{ 
    maxWidth: 'var(--container-xl)', 
    margin: '0 auto', 
    marginTop: 'var(--space-12)', 
    marginBottom: 'var(--space-8)',
    padding: '0 var(--space-6)'
  }}>
    <div style={{ 
      color: '#ff7a00', 
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--font-extrabold)', 
      fontSize: 'var(--text-4xl)', 
      marginBottom: 'var(--space-3)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-tight)',
      background: 'linear-gradient(135deg, #ff7a00, #ff5e62)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center'
    }}>
      Black Phú Quốc
    </div>
    <div style={{ 
      color: '#fff', 
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--text-lg)', 
      marginBottom: 'var(--space-6)',
      lineHeight: 'var(--leading-relaxed)',
      letterSpacing: 'var(--tracking-normal)',
      opacity: 0.9,
      textAlign: 'center'
    }}>
      Cộng đồng Vua gái gọi Phú Quốc uy tín dành cho checker Phú Quốc. Chúng tôi có hàng trăm em hàng đẹp khu vực Phú Quốc đáp ứng mọi nhu cầu cho anh em checker đang dịch vụ.<br />
      Chúng tôi cam kết mang đến hàng sản phẩm mới liên tục, chất lượng, cung cấp chuẩn, không công nghệ.
    </div>
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 'var(--space-5)',
      alignItems: 'stretch'
    }}>
      <div style={{ 
        background: '#181a20', 
        borderRadius: 'var(--radius-2xl)', 
        padding: 'var(--space-6)', 
        color: '#fff', 
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      >
        <div style={{ 
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--font-bold)', 
          fontSize: 'var(--text-2xl)', 
          marginBottom: 'var(--space-3)',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-tight)'
        }}>
          Black Phú Quốc
        </div>
        <div style={{ 
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-base)', 
          color: '#d1d5db', 
          marginBottom: 'var(--space-3)',
          lineHeight: 'var(--leading-relaxed)',
          letterSpacing: 'var(--tracking-normal)'
        }}>
          Black Phú Quốc là nơi review gái gọi uy tín nhất Phú Quốc. Hoàn toàn miễn phí cho checker.
        </div>
        <div style={{ 
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-sm)', 
          color: '#ff7a00', 
          lineHeight: 'var(--leading-normal)',
          letterSpacing: 'var(--tracking-wide)',
          fontWeight: 'var(--font-medium)'
        }}>
          * Lưu ý - Không đáp ứng trẻ nhỏ, gái các em
        </div>
      </div>
      <div style={{ 
        background: '#181a20', 
        borderRadius: 'var(--radius-2xl)', 
        padding: 'var(--space-6)', 
        color: '#fff', 
        boxShadow: 'var(--shadow-lg)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      >
        <div style={{ 
          color: '#ff7a00', 
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--font-bold)', 
          fontSize: 'var(--text-xl)', 
          marginBottom: 'var(--space-3)',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase'
        }}>
          👍 ĐẲNG CẤP GÁI GỌI
        </div>
        <div style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)', 
          color: '#fff', 
          marginBottom: 'var(--space-2)',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-wide)'
        }}>
          <span style={{ 
            color: '#6fa3ff',
            fontWeight: 'var(--font-semibold)',
            textShadow: '0 1px 2px rgba(111, 163, 255, 0.3)'
          }}>
            0965209115
          </span>
        </div>
        <div style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)', 
          color: '#fff',
          lineHeight: 'var(--leading-tight)',
          letterSpacing: 'var(--tracking-wide)'
        }}>
          <span style={{ 
            color: '#6fa3ff',
            fontWeight: 'var(--font-semibold)',
            textShadow: '0 1px 2px rgba(111, 163, 255, 0.3)'
          }}>
            0965209115
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default InfoSection; 