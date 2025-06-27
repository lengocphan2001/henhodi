import React from 'react';

const InfoSection: React.FC = () => (
  <div style={{ maxWidth: 1200, margin: '0 auto', marginTop: 32, marginBottom: 16 }}>
    <div style={{ color: '#ff7a00', fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Black Phú Quốc</div>
    <div style={{ color: '#fff', fontSize: 16, marginBottom: 16 }}>
      Cộng đồng Vua gái gọi Phú Quốc uy tín dành cho checker Phú Quốc. Chúng tôi có hàng trăm em hàng đẹp khu vực Phú Quốc đáp ứng mọi nhu cầu cho anh em checker đang dịch vụ.<br />
      Chúng tôi cam kết mang đến hàng sản phẩm mới liên tục, chất lượng, cung cấp chuẩn, không công nghệ.
    </div>
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
      <div style={{ background: '#181a20', borderRadius: 16, padding: 24, flex: 1, minWidth: 320, color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Black Phú Quốc</div>
        <div style={{ fontSize: 15, color: '#d1d5db', marginBottom: 8 }}>Black Phú Quốc là nơi review gái gọi uy tín nhất Phú Quốc. Hoàn toàn miễn phí cho checker.</div>
        <div style={{ fontSize: 13, color: '#ff7a00', marginBottom: 4 }}>* Lưu ý - Không đáp ứng trẻ nhỏ, gái các em</div>
      </div>
      <div style={{ background: '#181a20', borderRadius: 16, padding: 24, flex: 1, minWidth: 320, color: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: '#ff7a00', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>👍 ĐẲNG CẤP GÁI GỌI</div>
        <div style={{ fontSize: 18, color: '#fff', marginBottom: 4 }}><span style={{ color: '#6fa3ff' }}>0965209115</span></div>
        <div style={{ fontSize: 18, color: '#fff' }}><span style={{ color: '#6fa3ff' }}>0965209115</span></div>
      </div>
    </div>
  </div>
);

export default InfoSection; 