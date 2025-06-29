import React from 'react';
import styles from './SignUp.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Type for the girl prop
type Girl = {
  name: string;
  area: string;
  price: string;
  rating: number;
  img: string;
  zalo?: string;
  phone?: string;
  description?: string;
  info?: Record<string, string>;
};

const comments = [
  'Con hàng này tuyệt vời lắm anh em',
  'Gái phục vụ nhiệt tình lắm anh em',
  'Gái đẹp, giá hợp lý, sẽ quay lại',
];

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get girl data from location state (passed from main page)
  const girl: Girl = location.state?.girl || {
    name: 'LYLY GÁI GỌI',
    area: 'Dương Đông',
    price: '700.000 VND',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1673897224148-32491ab112b6?fm=jpg&q=60&w=3000',
    zalo: '0965209115',
    phone: '0965209115',
    description: 'NHIỆT TÌNH - VUI VẺ',
    info: {
      'Người đánh': 'Ngọc Miu',
      'ZALO': '0965209115',
      'Giá 1 lần': '700.000 VND',
      'Giá phòng': '150.000 VND',
      'Năm sinh': '2005',
      'Khu vực': 'Dương Đông',
      'Chiều cao': '160cm',
      'Cân nặng': '46kg',
      'Số đo': '88,60,85',
    },
  };

  return (
    <div className={styles.wrapper} style={{ 
      minHeight: '100vh', 
      background: '#232733', 
      paddingBottom: 'var(--space-8)',
      overflowX: 'hidden'
    }}>
      <div style={{ 
        maxWidth: 'var(--container-xl)', 
        margin: '0 auto', 
        paddingTop: 'var(--space-8)', 
        padding: 'var(--space-6)'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            marginBottom: 'var(--space-6)', 
            background: '#393e4b', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 'var(--radius-lg)', 
            padding: 'var(--space-3) var(--space-7)', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-semibold)', 
            fontSize: 'var(--text-base)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4a5568';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#393e4b';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ← Quay lại
        </button>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-8)', 
          alignItems: 'flex-start', 
          marginBottom: 'var(--space-8)'
        }}>
          {/* Left: Main image and info */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            maxWidth: '400px',
            justifySelf: 'center'
          }}>
            <img src={girl.img} alt={girl.name} style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-2xl)', 
              marginBottom: 'var(--space-4)',
              boxShadow: 'var(--shadow-lg)'
            }} />
            <div style={{ 
              color: '#fff', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)', 
              fontSize: 'var(--text-xl)', 
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: 'var(--space-1)'
            }}>
              {girl.name}
            </div>
            <div style={{ 
              color: '#d1d5db', 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)', 
              lineHeight: 'var(--leading-normal)',
              letterSpacing: 'var(--tracking-normal)',
              marginBottom: 'var(--space-3)'
            }}>
              {girl.area}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-1)', 
              marginBottom: 'var(--space-3)'
            }}>
              {[...Array(girl.rating)].map((_, i) => (
                <span key={i} style={{ 
                  color: '#ffb347', 
                  fontSize: 'var(--text-xl)',
                  textShadow: '0 1px 2px rgba(255, 179, 71, 0.3)'
                }}>
                  ★
                </span>
              ))}
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-2)', 
              marginBottom: 'var(--space-3)'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff7a00, #ff5e62)', 
                color: '#fff', 
                borderRadius: 'var(--radius-lg)', 
                padding: 'var(--space-2) var(--space-4)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-semibold)', 
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)',
                whiteSpace: 'nowrap'
              }}>
                Tẩu nhanh : {girl.price}
              </span>
            </div>
            <button style={{ 
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 'var(--radius-xl)', 
              padding: 'var(--space-4) 0', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-semibold)', 
              fontSize: 'var(--text-base)', 
              cursor: 'pointer',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
            }}
            >
              Hẹn gặp bé click vào đây
            </button>
          </div>
          {/* Right: Details and comments */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            minWidth: '300px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)', 
              marginBottom: 'var(--space-4)', 
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff7a00, #ff5e62)', 
                color: '#fff', 
                borderRadius: 'var(--radius-lg)', 
                padding: 'var(--space-1) var(--space-4)', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-bold)', 
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(255, 122, 0, 0.3)',
                whiteSpace: 'nowrap'
              }}>
                HOT
              </span>
              <span style={{ 
                color: '#ff7a00', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-bold)', 
                fontSize: 'var(--text-2xl)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-tight)'
              }}>
                {girl.name} - {girl.area} - {girl.description}
              </span>
            </div>
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ 
                color: '#fff', 
                fontFamily: 'var(--font-heading)',
                fontWeight: 'var(--font-semibold)', 
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--leading-tight)',
                letterSpacing: 'var(--tracking-normal)'
              }}>
                Checker đánh giá
              </div>
              {comments.map((c, i) => (
                <div key={i} style={{ 
                  color: '#d1d5db', 
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-base)', 
                  marginBottom: 'var(--space-2)',
                  lineHeight: 'var(--leading-relaxed)',
                  letterSpacing: 'var(--tracking-normal)'
                }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#6fa3ff'
                  }}>
                    0972xxxxxx:
                  </span> {c}
                </div>
              ))}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-3)', 
                marginTop: 'var(--space-4)',
                flexWrap: 'wrap'
              }}>
                <input 
                  placeholder="Nhập đánh giá của bạn vào đây" 
                  style={{ 
                    flex: 1, 
                    borderRadius: 'var(--radius-lg)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    padding: 'var(--space-3) var(--space-4)', 
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--text-base)',
                    background: '#232733',
                    color: '#fff',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    lineHeight: 'var(--leading-normal)',
                    letterSpacing: 'var(--tracking-normal)',
                    minWidth: '200px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button style={{ 
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: 'var(--space-3) var(--space-6)', 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'var(--font-semibold)', 
                  fontSize: 'var(--text-base)', 
                  cursor: 'pointer',
                  lineHeight: 'var(--leading-tight)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
                }}
                >
                  Gửi đi
                </button>
              </div>
            </div>
            <div style={{ 
              background: '#181a20', 
              borderRadius: 'var(--radius-2xl)', 
              padding: 'var(--space-6)', 
              color: '#fff', 
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-base)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'var(--shadow-lg)',
              lineHeight: 'var(--leading-relaxed)',
              letterSpacing: 'var(--tracking-normal)'
            }}>
              {Object.entries(girl.info || {}).map(([key, value]) => (
                <div key={key} style={{ marginBottom: 'var(--space-3)' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'var(--font-semibold)',
                    color: '#ff7a00'
                  }}>
                    {key}:
                  </span> {value}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Image gallery */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ 
            color: '#fff', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-semibold)', 
            fontSize: 'var(--text-xl)', 
            marginBottom: 'var(--space-4)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-normal)'
          }}>
            <span role="img" aria-label="camera">📷</span> Hình ảnh của bé
          </div>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-5)',
            maxWidth: '600px'
          }}>
            {[1,2,3].map((i) => (
              <img key={i} src={girl.img} alt={girl.name} style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              />
            ))}
          </div>
        </div>
        {/* Footer info */}
        <div style={{ 
          maxWidth: 'var(--container-lg)', 
          margin: '0 auto', 
          background: '#181a20', 
          borderRadius: 'var(--radius-2xl)', 
          padding: 'var(--space-10)', 
          color: '#fff', 
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #232733, #2a2d35)', 
            color: '#ff7a00', 
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-bold)', 
            fontSize: 'var(--text-xl)', 
            borderRadius: 'var(--radius-xl)', 
            padding: 'var(--space-3) var(--space-7)', 
            display: 'inline-block', 
            marginBottom: 'var(--space-5)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(255, 122, 0, 0.2)'
          }}>
            Black Phú Quốc
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-4)', 
            marginBottom: 'var(--space-5)',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              color: '#fff', 
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-bold)', 
              fontSize: 'var(--text-xl)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-tight)'
            }}>
              Cộng Đồng Black Gái Phú Quốc
            </span>
            <span style={{ 
              background: '#393e4b', 
              borderRadius: 'var(--radius-lg)', 
              padding: 'var(--space-1) var(--space-4)', 
              color: '#fff', 
              fontFamily: 'var(--font-primary)',
              fontWeight: 'var(--font-medium)', 
              fontSize: 'var(--text-sm)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase'
            }}>
              <span className={styles.flag}></span>
              Tiếng Việt
            </span>
          </div>
          <div style={{ 
            color: '#d1d5db', 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-base)', 
            lineHeight: 'var(--leading-relaxed)',
            letterSpacing: 'var(--tracking-normal)',
            opacity: 0.9
          }}>
            Cộng đồng anh chị Vua Gái Gọi Phú Quốc, nơi chia sẻ thông tin các em hàng đang hoạt động tại khu vực với chất lượng được đảm bảo uy tín nhất hiện nay. Chúng tôi cam kết là mạng cộng đồng sân chơi lành mạnh vì lợi ích của anh em Checker Phú Quốc.
          </div>
          <div style={{ 
            color: '#aaa', 
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--text-sm)', 
            marginTop: 'var(--space-5)',
            lineHeight: 'var(--leading-normal)',
            letterSpacing: 'var(--tracking-normal)'
          }}>
            Liên hệ đăng bài : Telegram : Dev_code99
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail; 