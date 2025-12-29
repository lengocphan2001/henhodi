# Hướng Dẫn Đổi Domain từ blackphuquoc.com sang chumgaiphuquoc.com

## ⚠️ QUAN TRỌNG: Các bước cần thực hiện trên VPS

Lỗi 404 nginx not found thường xảy ra khi nginx config trên server chưa được cập nhật với domain mới. Bạn cần thực hiện các bước sau trên VPS:

---

## 🔧 Bước 1: Cập Nhật Nginx Configuration trên Server

### 1.1. Kiểm tra file nginx config hiện tại

```bash
# Xem file config hiện tại
sudo cat /etc/nginx/sites-available/blackphuquoc.com

# Hoặc nếu file có tên khác, tìm tất cả config files
sudo ls -la /etc/nginx/sites-available/
```

### 1.2. Tạo file config mới cho domain mới

```bash
# Tạo file config mới
sudo nano /etc/nginx/sites-available/chumgaiphuquoc.com
```

**Nội dung file cấu hình (HTTP - port 80):**

```nginx
server {
    listen 80;
    server_name chumgaiphuquoc.com www.chumgaiphuquoc.com;
    
    # Logs
    access_log /var/log/nginx/chumgaiphuquoc.com.access.log;
    error_log /var/log/nginx/chumgaiphuquoc.com.error.log;
    
    # Frontend - Serve static files từ build folder
    location / {
        root /var/www/chumgaiphuquoc.com/build;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Uploads
    location /uploads {
        alias /var/www/chumgaiphuquoc.com/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

**Lưu ý:** 
- Nếu thư mục build của bạn ở vị trí khác, hãy cập nhật đường dẫn `root` cho đúng
- Nếu backend chạy trên port khác (không phải 3000), hãy cập nhật `proxy_pass`

### 1.3. Kích hoạt site mới

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/chumgaiphuquoc.com /etc/nginx/sites-enabled/

# Xóa link cũ (nếu muốn)
sudo rm -f /etc/nginx/sites-enabled/blackphuquoc.com

# Kiểm tra cấu hình nginx
sudo nginx -t

# Nếu test thành công, reload nginx
sudo systemctl reload nginx
```

---

## 🔒 Bước 2: Cập Nhật SSL Certificate (Nếu đã có SSL)

### 2.1. Xóa SSL certificate cũ (tùy chọn)

```bash
# Xem danh sách certificates
sudo certbot certificates

# Xóa certificate cũ (nếu muốn)
sudo certbot delete --cert-name blackphuquoc.com
```

### 2.2. Lấy SSL certificate mới

**⚠️ QUAN TRỌNG:** Đảm bảo DNS đã trỏ về IP VPS trước khi chạy lệnh này:

```bash
# Kiểm tra DNS
dig chumgaiphuquoc.com +short
nslookup chumgaiphuquoc.com

# Lấy SSL certificate mới
sudo certbot --nginx -d chumgaiphuquoc.com -d www.chumgaiphuquoc.com \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com \
  --redirect
```

Certbot sẽ tự động cập nhật nginx config để thêm SSL.

### 2.3. Kiểm tra SSL

```bash
# Kiểm tra từ server
curl -I https://chumgaiphuquoc.com

# Kiểm tra certificate
sudo certbot certificates
```

---

## 📁 Bước 3: Cập Nhật Thư Mục Ứng Dụng (Nếu cần)

Nếu bạn muốn đổi tên thư mục trên server:

```bash
# Di chuyển thư mục (nếu muốn)
sudo mv /var/www/blackphuquoc.com /var/www/chumgaiphuquoc.com

# Cập nhật quyền
sudo chown -R $USER:$USER /var/www/chumgaiphuquoc.com
```

**Lưu ý:** Nếu bạn giữ nguyên thư mục cũ, chỉ cần cập nhật nginx config trỏ đến đúng đường dẫn.

---

## ⚙️ Bước 4: Cập Nhật Environment Variables

### 4.1. Cập nhật Frontend env.production

```bash
cd /var/www/chumgaiphuquoc.com  # hoặc /var/www/blackphuquoc.com nếu chưa đổi tên

# Sửa file env.production
nano env.production
```

**Nội dung:**
```env
REACT_APP_API_URL=https://chumgaiphuquoc.com/api
REACT_APP_DOMAIN=chumgaiphuquoc.com
NODE_ENV=production
```

**QUAN TRỌNG:** Sau khi sửa, phải build lại frontend:

```bash
# Xóa build cũ
rm -rf build

# Build lại
npm run build

# Reload nginx
sudo systemctl reload nginx
```

### 4.2. Cập nhật Backend .env

```bash
cd /var/www/chumgaiphuquoc.com/backend  # hoặc /var/www/blackphuquoc.com/backend

# Sửa file .env
nano .env
```

**Cập nhật các dòng sau:**
```env
CORS_ORIGIN=https://chumgaiphuquoc.com
API_BASE_URL=https://chumgaiphuquoc.com
```

**Sau đó restart backend:**
```bash
pm2 restart henhodi-backend
```

---

## 🔄 Bước 5: Cập Nhật PM2 Ecosystem Config (Nếu cần)

Nếu bạn đã đổi tên thư mục, cần cập nhật `ecosystem.config.js`:

```bash
cd /var/www/chumgaiphuquoc.com
nano ecosystem.config.js
```

Cập nhật tất cả đường dẫn từ `/var/www/blackphuquoc.com` sang `/var/www/chumgaiphuquoc.com`

Sau đó:
```bash
pm2 delete henhodi-backend
pm2 start ecosystem.config.js
pm2 save
```

---

## ✅ Bước 6: Kiểm Tra

### 6.1. Kiểm tra Nginx

```bash
# Kiểm tra status
sudo systemctl status nginx

# Kiểm tra logs
sudo tail -f /var/log/nginx/chumgaiphuquoc.com.error.log
sudo tail -f /var/log/nginx/chumgaiphuquoc.com.access.log
```

### 6.2. Kiểm tra Backend

```bash
# Kiểm tra PM2
pm2 status

# Kiểm tra backend có chạy không
curl http://localhost:3000/api/health

# Xem logs
pm2 logs henhodi-backend
```

### 6.3. Kiểm tra từ Browser

- Truy cập: `http://chumgaiphuquoc.com` (nếu chưa có SSL)
- Truy cập: `https://chumgaiphuquoc.com` (nếu đã có SSL)
- Kiểm tra API: `https://chumgaiphuquoc.com/api/health`

---

## 🐛 Troubleshooting

### Lỗi 404 Not Found

**Nguyên nhân:**
1. Nginx config chưa được cập nhật với domain mới
2. File config chưa được kích hoạt (chưa có symbolic link)
3. Thư mục build không tồn tại hoặc đường dẫn sai

**Giải pháp:**
```bash
# 1. Kiểm tra file config có được kích hoạt không
ls -la /etc/nginx/sites-enabled/ | grep chumgaiphuquoc

# 2. Kiểm tra nginx config
sudo nginx -t

# 3. Kiểm tra thư mục build có tồn tại không
ls -la /var/www/chumgaiphuquoc.com/build

# 4. Xem error log
sudo tail -50 /var/log/nginx/chumgaiphuquoc.com.error.log
```

### Lỗi 502 Bad Gateway

**Nguyên nhân:** Backend không chạy hoặc port không đúng

**Giải pháp:**
```bash
# Kiểm tra backend
pm2 status

# Kiểm tra port
sudo netstat -tlnp | grep 3000

# Restart backend
pm2 restart henhodi-backend
```

### DNS chưa propagate

**Kiểm tra:**
```bash
# Từ server
dig chumgaiphuquoc.com +short

# Từ máy local
nslookup chumgaiphuquoc.com
```

Nếu DNS chưa trỏ về IP VPS, đợi 5-30 phút (có thể lên đến 48 giờ).

---

## 📋 Checklist

- [ ] DNS đã trỏ về IP VPS (A record cho chumgaiphuquoc.com và www.chumgaiphuquoc.com)
- [ ] Đã tạo file nginx config mới `/etc/nginx/sites-available/chumgaiphuquoc.com`
- [ ] Đã kích hoạt site mới (tạo symbolic link)
- [ ] Đã test nginx config (`nginx -t`)
- [ ] Đã reload nginx (`systemctl reload nginx`)
- [ ] Đã cập nhật `env.production` và build lại frontend
- [ ] Đã cập nhật backend `.env` và restart backend
- [ ] Đã lấy SSL certificate mới (nếu cần)
- [ ] Đã kiểm tra website hoạt động: `https://chumgaiphuquoc.com`

---

## 🎯 Tóm Tắt Các Lệnh Quan Trọng

```bash
# 1. Tạo và kích hoạt nginx config
sudo nano /etc/nginx/sites-available/chumgaiphuquoc.com
sudo ln -s /etc/nginx/sites-available/chumgaiphuquoc.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 2. Cập nhật env và build lại frontend
cd /var/www/chumgaiphuquoc.com
nano env.production
rm -rf build
npm run build

# 3. Cập nhật backend env và restart
cd /var/www/chumgaiphuquoc.com/backend
nano .env
pm2 restart henhodi-backend

# 4. Lấy SSL (nếu cần)
sudo certbot --nginx -d chumgaiphuquoc.com -d www.chumgaiphuquoc.com --non-interactive --agree-tos --email your-email@example.com --redirect
```

---

**Sau khi hoàn thành tất cả các bước, website sẽ hoạt động tại: https://chumgaiphuquoc.com** 🎉
