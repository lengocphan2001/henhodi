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
    <div className={styles.wrapper} style={{ minHeight: '100vh', background: '#232733', paddingBottom: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingTop: 32 }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: 16, background: '#393e4b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>← Quay lại</button>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 24 }}>
          {/* Left: Main image and info */}
          <div style={{ minWidth: 260, maxWidth: 260 }}>
            <img src={girl.img} alt={girl.name} style={{ width: 260, height: 320, objectFit: 'cover', borderRadius: 16, marginBottom: 12 }} />
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{girl.name}</div>
            <div style={{ color: '#d1d5db', fontSize: 13, marginBottom: 8 }}>{girl.area}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              {[...Array(girl.rating)].map((_, i) => <span key={i} style={{ color: '#ffb347', fontSize: 16 }}>★</span>)}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ background: '#ff7a00', color: '#fff', borderRadius: 8, padding: '4px 10px', fontWeight: 600, fontSize: 13 }}>Tẩu nhanh : {girl.price}</span>
            </div>
            <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, fontSize: 15, cursor: 'pointer', width: '100%' }}>Hẹn gặp bé click vào đây</button>
          </div>
          {/* Right: Details and comments */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ background: '#ff7a00', color: '#fff', borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: 13 }}>HOT</span>
              <span style={{ color: '#ff7a00', fontWeight: 700, fontSize: 20 }}>{girl.name} - {girl.area} - {girl.description}</span>
            </div>
            <div style={{ background: '#181a20', borderRadius: 16, padding: 18, marginBottom: 16 }}>
              <div style={{ color: '#fff', fontWeight: 600, marginBottom: 8 }}>Checker đánh giá</div>
              {comments.map((c, i) => (
                <div key={i} style={{ color: '#d1d5db', fontSize: 14, marginBottom: 4 }}><b>0972xxxxxx:</b> {c}</div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input placeholder="Nhập đánh giá của bạn vào đây" style={{ flex: 1, borderRadius: 8, border: 'none', padding: '8px 12px', fontSize: 15 }} />
                <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Gửi đi</button>
              </div>
            </div>
            <div style={{ background: '#181a20', borderRadius: 16, padding: 18, marginBottom: 16, color: '#fff', fontSize: 15 }}>
              <div style={{ marginBottom: 8 }}><b>Người đánh:</b> {girl.info?.['Người đánh']}</div>
              <div style={{ marginBottom: 8 }}><b>ZALO:</b> {girl.info?.['ZALO']}</div>
              <div style={{ marginBottom: 8 }}><b>Giá 1 lần:</b> {girl.info?.['Giá 1 lần']}</div>
              <div style={{ marginBottom: 8 }}><b>Giá phòng:</b> {girl.info?.['Giá phòng']}</div>
              <div style={{ marginBottom: 8 }}><b>Năm sinh:</b> {girl.info?.['Năm sinh']}</div>
              <div style={{ marginBottom: 8 }}><b>Khu vực:</b> {girl.info?.['Khu vực']}</div>
              <div style={{ marginBottom: 8 }}><b>Chiều cao:</b> {girl.info?.['Chiều cao']}</div>
              <div style={{ marginBottom: 8 }}><b>Cân nặng:</b> {girl.info?.['Cân nặng']}</div>
              <div style={{ marginBottom: 8 }}><b>Số đo:</b> {girl.info?.['Số đo']}</div>
            </div>
          </div>
        </div>
        {/* Image gallery */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 18, marginBottom: 12 }}><span role="img" aria-label="camera">📷</span> Hình ảnh của bé</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[1,2,3].map((i) => (
              <img key={i} src={girl.img} alt={girl.name} style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12 }} />
            ))}
          </div>
        </div>
        {/* Footer info */}
        <div style={{ maxWidth: 900, margin: '0 auto', background: '#181a20', borderRadius: 16, padding: 32, color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <div style={{ background: '#232733', color: '#ff7a00', fontWeight: 700, fontSize: 22, borderRadius: 12, padding: '8px 24px', display: 'inline-block', marginBottom: 16 }}>Black Phú Quốc</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Cộng Đồng Black Gái Phú Quốc</span>
            <span style={{ background: '#393e4b', borderRadius: 8, padding: '4px 12px', color: '#fff', fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={styles.flag}></span>Tiếng Việt
            </span>
          </div>
          <div style={{ color: '#d1d5db', fontSize: 16 }}>
            Cộng đồng anh chị Vua Gái Gọi Phú Quốc, nơi chia sẻ thông tin các em hàng đang hoạt động tại khu vực với chất lượng được đảm bảo uy tín nhất hiện nay. Chúng tôi cam kết là mạng cộng đồng sân chơi lành mạnh vì lợi ích của anh em Checker Phú Quốc.
          </div>
          <div style={{ color: '#aaa', fontSize: 14, marginTop: 16 }}>Liên hệ đăng bài : Telegram : Dev_code99</div>
        </div>
      </div>
    </div>
  );
};

export default Detail; 