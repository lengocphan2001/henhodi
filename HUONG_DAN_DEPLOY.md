# Hướng Dẫn Deploy Dự Án lên VPS Ubuntu

Hướng dẫn chi tiết để deploy dự án **henhodi** lên VPS Ubuntu với domain **blackphuquoc.com**.

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Chuẩn Bị](#chuẩn-bị)
3. [Cài Đặt Môi Trường](#cài-đặt-môi-trường)
4. [Cấu Hình Database](#cấu-hình-database)
5. [Deploy Backend](#deploy-backend)
6. [Deploy Frontend](#deploy-frontend)
7. [Cấu Hình Nginx](#cấu-hình-nginx)
8. [Cài Đặt SSL (HTTPS) với Certbot](#cài-đặt-ssl-https-với-certbot)
9. [Quản Lý Ứng Dụng với PM2](#quản-lý-ứng-dụng-với-pm2)
10. [Kiểm Tra và Troubleshooting](#kiểm-tra-và-troubleshooting)

---

## 🖥️ Yêu Cầu Hệ Thống

- **OS**: Ubuntu 20.04 LTS trở lên
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB)
- **CPU**: Tối thiểu 2 cores
- **Disk**: Tối thiểu 20GB
- **Domain**: blackphuquoc.com đã trỏ về IP của VPS

---

## 🔧 Chuẩn Bị

### 1. Kết Nối VPS

```bash
ssh root@your-vps-ip
# hoặc
ssh username@your-vps-ip
```

### 2. Cập Nhật Hệ Thống

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Tạo User (Nếu Cần)

```bash
# Tạo user mới (nếu chưa có)
adduser deploy
usermod -aG sudo deploy

# Chuyển sang user mới
su - deploy
```

---

## 📦 Cài Đặt Môi Trường

### 1. Cài Đặt Node.js 22.x

```bash
# Cài đặt Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kiểm tra phiên bản
node -v  # Nên hiển thị v22.x.x
npm -v   # Nên hiển thị v10.x.x
```

### 2. Cài Đặt MySQL

```bash
# Cài đặt MySQL Server
sudo apt install mysql-server -y

# Khởi động và bật tự động khởi động
sudo systemctl start mysql
sudo systemctl enable mysql

# Bảo mật MySQL (tùy chọn nhưng khuyến nghị)
sudo mysql_secure_installation
```

### 3. Cài Đặt PM2

```bash
# Cài đặt PM2 globally
sudo npm install -g pm2

# Kiểm tra
pm2 -v
```

### 4. Cài Đặt Nginx

```bash
# Cài đặt Nginx
sudo apt install nginx -y

# Khởi động và bật tự động khởi động
sudo systemctl start nginx
sudo systemctl enable nginx

# Kiểm tra trạng thái
sudo systemctl status nginx
```

### 5. Cài Đặt Certbot (Cho SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

## 🗄️ Cấu Hình Database

### 1. Tạo Database và User

```bash
# Đăng nhập MySQL
sudo mysql -u root -p

# Trong MySQL shell, thực hiện các lệnh sau:
```

```sql
-- Tạo database
CREATE DATABASE IF NOT EXISTS henhodi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user
CREATE USER IF NOT EXISTS 'henhodi_user'@'localhost' IDENTIFIED BY 'password';

-- Cấp quyền
GRANT ALL PRIVILEGES ON henhodi_db.* TO 'henhodi_user'@'localhost';
FLUSH PRIVILEGES;

-- Thoát
EXIT;
```

**⚠️ LƯU Ý**: Thay `your_strong_password_here` bằng mật khẩu mạnh của bạn!

### 2. Kiểm Tra Database

```bash
mysql -u henhodi_user -p henhodi_db
# Nhập mật khẩu vừa tạo, nếu vào được là thành công
EXIT;
```

---

## 🚀 Deploy Backend

### 1. Tạo Thư Mục Ứng Dụng

```bash
# Tạo thư mục
sudo mkdir -p /var/www/blackphuquoc.com
sudo chown -R $USER:$USER /var/www/blackphuquoc.com

# Di chuyển vào thư mục
cd /var/www/blackphuquoc.com
```

### 2. Upload Code lên VPS

**Cách 1: Sử dụng Git (Khuyến nghị)**

```bash
# Clone repository
git clone https://github.com/your-username/henhodi.git .

# Hoặc nếu đã có code, upload bằng SCP từ máy local:
# scp -r /path/to/henhodi/* user@vps-ip:/var/www/blackphuquoc.com/
```

**Cách 2: Sử dụng SCP từ máy local**

```bash
# Từ máy local của bạn, chạy:
scp -r ./henhodi/* user@your-vps-ip:/var/www/blackphuquoc.com/
```

### 3. Cấu Hình Backend

```bash
# Di chuyển vào thư mục backend
cd /var/www/blackphuquoc.com/backend

# Cài đặt dependencies
npm install

# Tạo file .env
nano .env
```

**Nội dung file `.env`:**

```env
DB_HOST=localhost
DB_USER=henhodi_user
DB_PASSWORD=password
DB_NAME=henhodi_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://blackphuquoc.com
```

**Lưu ý**: 
- Thay `your_strong_password_here` bằng mật khẩu database bạn đã tạo
- Thay `your_super_secret_jwt_key_change_this_in_production` bằng một chuỗi ngẫu nhiên mạnh

### 4. Khởi Tạo Database

```bash
# Chạy script setup database
npm run setup-db
```

### 5. Tạo Thư Mục Uploads

```bash
mkdir -p /var/www/blackphuquoc.com/backend/uploads
chmod 755 /var/www/blackphuquoc.com/backend/uploads
```

---

## 🎨 Deploy Frontend

### 1. Cấu Hình Environment

```bash
# Quay về thư mục root
cd /var/www/blackphuquoc.com

# Tạo file env.production
nano env.production
```

**Nội dung file `env.production`:**

```env
REACT_APP_API_URL=https://blackphuquoc.com/api
REACT_APP_DOMAIN=blackphuquoc.com
NODE_ENV=production
```

**⚠️ QUAN TRỌNG**: 
- Đảm bảo sử dụng `https://` (không phải `http://`) cho production
- URL phải trỏ về domain `blackphuquoc.com`, không phải `localhost`
- File `src/services/api.ts` đã được cấu hình để đọc từ biến môi trường này

### 2. Build Frontend

```bash
# Cài đặt dependencies
npm install

# Build ứng dụng (quan trọng: phải có file env.production trước khi build)
npm run build
```

**⚠️ LƯU Ý QUAN TRỌNG**: 
- React chỉ đọc biến môi trường `REACT_APP_*` khi **build time**, không phải runtime
- Phải đảm bảo file `env.production` đã được tạo và cấu hình đúng **TRƯỚC KHI** chạy `npm run build`
- Sau khi build, nếu thay đổi `env.production`, phải build lại: `npm run build`

Sau khi build thành công, thư mục `build/` sẽ được tạo ra chứa các file tĩnh.

**Kiểm tra API URL sau khi build:**

```bash
# Kiểm tra trong file build có sử dụng đúng URL không
grep -r "blackphuquoc.com" build/static/js/
# hoặc
grep -r "localhost:5000" build/static/js/
# Nếu vẫn thấy localhost:5000, có nghĩa là build chưa đúng
```

---

## 🌐 Cấu Hình Nginx

### 1. Tạo File Cấu Hình Nginx

```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Nội dung file cấu hình:**

```nginx
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # Logs
    access_log /var/log/nginx/blackphuquoc.com.access.log;
    error_log /var/log/nginx/blackphuquoc.com.error.log;
    
    # Frontend - Serve static files từ build folder
    location / {
        root /var/www/blackphuquoc.com/build;
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
        alias /var/www/blackphuquoc.com/backend/uploads;
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

### 2. Kích Hoạt Site

```bash
# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/blackphuquoc.com /etc/nginx/sites-enabled/

# Xóa default site (nếu có)
sudo rm -f /etc/nginx/sites-enabled/default

# Kiểm tra cấu hình
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Cài Đặt SSL (HTTPS) với Certbot

### 1. Cấu Hình DNS

Đảm bảo domain đã trỏ về IP VPS trước khi cài SSL:
- **A Record**: `blackphuquoc.com` → `your-vps-ip`
- **A Record**: `www.blackphuquoc.com` → `your-vps-ip`

Kiểm tra DNS:
```bash
# Kiểm tra DNS resolution
dig blackphuquoc.com +short
nslookup blackphuquoc.com

# Kiểm tra từ VPS
curl -I http://blackphuquoc.com
```

**⚠️ QUAN TRỌNG**: Phải đợi DNS propagate (thường 5-30 phút, có thể lên đến 48 giờ) trước khi chạy Certbot.

### 2. Cài Đặt Certbot Chi Tiết

```bash
# Cập nhật package list
sudo apt update

# Cài đặt Certbot và plugin Nginx
sudo apt install certbot python3-certbot-nginx -y

# Kiểm tra phiên bản
certbot --version

# Xem thông tin về Certbot
certbot --help
```

### 3. Cấu Hình Nginx Trước Khi Lấy SSL

Đảm bảo Nginx đã được cấu hình và chạy trên port 80:

```bash
# Kiểm tra Nginx đang chạy
sudo systemctl status nginx

# Kiểm tra port 80 đang listen
sudo netstat -tlnp | grep :80

# Test cấu hình Nginx
sudo nginx -t
```

### 4. Lấy SSL Certificate

**Phương pháp 1: Tự động với Nginx plugin (Khuyến nghị)**

```bash
# Lấy SSL certificate tự động (Certbot sẽ tự cấu hình Nginx)
sudo certbot --nginx -d blackphuquoc.com -d www.blackphuquoc.com \
  --non-interactive \
  --agree-tos \
  --email lengocphan503@gmail.com \
  --redirect
```

**Giải thích các tham số:**
- `--nginx`: Sử dụng Nginx plugin để tự động cấu hình
- `-d`: Chỉ định domain (có thể dùng nhiều lần cho nhiều domain)
- `--non-interactive`: Chạy không cần tương tác
- `--agree-tos`: Đồng ý với điều khoản
- `--email`: Email để nhận thông báo gia hạn
- `--redirect`: Tự động redirect HTTP sang HTTPS

**Phương pháp 2: Chỉ lấy certificate (không tự động cấu hình)**

```bash
# Chỉ lấy certificate, không cấu hình Nginx
sudo certbot certonly --nginx \
  -d blackphuquoc.com \
  -d www.blackphuquoc.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

**Phương pháp 3: Standalone (khi Nginx chưa chạy)**

```bash
# Tạm thời dừng Nginx
sudo systemctl stop nginx

# Lấy certificate bằng standalone mode
sudo certbot certonly --standalone \
  -d blackphuquoc.com \
  -d www.blackphuquoc.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Khởi động lại Nginx
sudo systemctl start nginx
```

### 5. Kiểm Tra SSL Certificate

```bash
# Xem danh sách certificates
sudo certbot certificates

# Kiểm tra thông tin certificate
sudo certbot show blackphuquoc.com

# Kiểm tra certificate files
sudo ls -la /etc/letsencrypt/live/blackphuquoc.com/
```

Các file quan trọng:
- `fullchain.pem`: Certificate chain (certificate + intermediate)
- `privkey.pem`: Private key
- `cert.pem`: Certificate
- `chain.pem`: Intermediate certificate

### 6. Cấu Hình Nginx với SSL (Nếu chưa tự động)

Nếu Certbot không tự động cấu hình, bạn cần cập nhật file Nginx config:

```bash
sudo nano /etc/nginx/sites-available/blackphuquoc.com
```

**Cấu hình Nginx với SSL:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name blackphuquoc.com www.blackphuquoc.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name blackphuquoc.com www.blackphuquoc.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/blackphuquoc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blackphuquoc.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA256';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/blackphuquoc.com/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Logs
    access_log /var/log/nginx/blackphuquoc.com.access.log;
    error_log /var/log/nginx/blackphuquoc.com.error.log;
    
    # Frontend - Serve static files
    location / {
        root /var/www/blackphuquoc.com/build;
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
        alias /var/www/blackphuquoc.com/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

Sau đó test và reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Kiểm Tra SSL

```bash
# Kiểm tra từ server
curl -I https://blackphuquoc.com

# Kiểm tra certificate details
openssl s_client -connect blackphuquoc.com:443 -servername blackphuquoc.com

# Kiểm tra online (từ máy local)
# Truy cập: https://www.ssllabs.com/ssltest/analyze.html?d=blackphuquoc.com
```

### 8. Tự Động Gia Hạn SSL

Certbot tự động tạo cron job để gia hạn certificate. Kiểm tra:

```bash
# Xem cron job
sudo crontab -l | grep certbot

# Hoặc xem systemd timer
sudo systemctl list-timers | grep certbot

# Test gia hạn (dry-run)
sudo certbot renew --dry-run
```

**Cấu hình gia hạn tự động:**

```bash
# Certbot tự động tạo timer, nhưng bạn có thể kiểm tra
sudo systemctl status certbot.timer

# Nếu chưa có, tạo cron job thủ công
sudo crontab -e
# Thêm dòng sau (chạy 2 lần mỗi ngày)
0 0,12 * * * certbot renew --quiet
```

### 9. Gia Hạn SSL Thủ Công

```bash
# Gia hạn tất cả certificates
sudo certbot renew

# Gia hạn một domain cụ thể
sudo certbot renew --cert-name blackphuquoc.com

# Gia hạn và reload Nginx
sudo certbot renew --nginx
```

### 10. Xóa SSL Certificate

```bash
# Xóa certificate
sudo certbot delete --cert-name blackphuquoc.com

# Hoặc xóa tất cả
sudo certbot delete
```

### 11. Troubleshooting SSL

**Lỗi: Domain không resolve**

```bash
# Kiểm tra DNS
dig blackphuquoc.com
nslookup blackphuquoc.com

# Đợi DNS propagate
# Kiểm tra từ nhiều DNS server
dig @8.8.8.8 blackphuquoc.com
dig @1.1.1.1 blackphuquoc.com
```

**Lỗi: Port 80 bị chặn**

```bash
# Kiểm tra firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Kiểm tra port đang listen
sudo netstat -tlnp | grep -E ':(80|443)'
```

**Lỗi: Too many requests**

Let's Encrypt có giới hạn 50 certificates/domain/tuần. Nếu vượt quá:

```bash
# Sử dụng staging environment để test
sudo certbot --nginx -d blackphuquoc.com --staging

# Sau khi test OK, dùng production
sudo certbot --nginx -d blackphuquoc.com
```

**Lỗi: Certificate không được cập nhật trong Nginx**

```bash
# Kiểm tra cấu hình Nginx
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Kiểm tra certificate path trong config
sudo grep -r "ssl_certificate" /etc/nginx/sites-available/
```

**Lỗi: Mixed content (HTTP resources trên HTTPS page)**

Đảm bảo tất cả resources sử dụng HTTPS:

```bash
# Kiểm tra trong browser console
# Sửa các link HTTP thành HTTPS trong code
```

### 12. Cấu Hình SSL Nâng Cao

**Tăng bảo mật với HSTS:**

```nginx
# Đã có trong config trên
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**Tối ưu SSL Performance:**

```nginx
# Sử dụng HTTP/2
listen 443 ssl http2;

# OCSP Stapling (đã có trong config)
ssl_stapling on;
ssl_stapling_verify on;
```

**Kiểm tra SSL Rating:**

Sau khi cài đặt, kiểm tra tại:
- https://www.ssllabs.com/ssltest/
- https://securityheaders.com/
- https://observatory.mozilla.org/

Mục tiêu: Đạt điểm A hoặc A+

---

## ⚙️ Quản Lý Ứng Dụng với PM2

### 1. Tạo File Ecosystem Config

```bash
cd /var/www/blackphuquoc.com
nano ecosystem.config.js
```

**Nội dung file `ecosystem.config.js`:**

```javascript
module.exports = {
  apps: [
    {
      name: 'henhodi-backend',
      cwd: '/var/www/blackphuquoc.com/backend',
      script: 'src/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_file: '/var/www/blackphuquoc.com/backend/.env',
      error_file: '/var/www/blackphuquoc.com/logs/backend-error.log',
      out_file: '/var/www/blackphuquoc.com/logs/backend-out.log',
      log_file: '/var/www/blackphuquoc.com/logs/backend-combined.log',
      time: true
    }
  ]
};
```

**Lưu ý**: Vì frontend đã được build thành static files và được serve bởi Nginx, chúng ta chỉ cần chạy backend với PM2.

### 2. Tạo Thư Mục Logs

```bash
mkdir -p /var/www/blackphuquoc.com/logs
```

### 3. Khởi Động Ứng Dụng

```bash
# Khởi động backend
pm2 start ecosystem.config.js

# Lưu cấu hình PM2
pm2 save

# Cấu hình PM2 khởi động cùng hệ thống
pm2 startup
# Chạy lệnh mà PM2 hiển thị (thường là sudo env PATH=...)
```

### 4. Các Lệnh PM2 Hữu Ích

```bash
# Xem trạng thái
pm2 status

# Xem logs
pm2 logs henhodi-backend
pm2 logs --lines 100  # Xem 100 dòng cuối

# Restart
pm2 restart henhodi-backend
pm2 restart all

# Stop
pm2 stop henhodi-backend

# Xóa khỏi PM2
pm2 delete henhodi-backend

# Monitor
pm2 monit
```

---

## ✅ Kiểm Tra và Troubleshooting

### 1. Kiểm Tra Backend

```bash
# Kiểm tra backend có chạy không
curl http://localhost:3000/api/health
# hoặc
curl http://localhost:3000/api/girls
```

### 2. Kiểm Tra Nginx

```bash
# Kiểm tra trạng thái
sudo systemctl status nginx

# Xem logs
sudo tail -f /var/log/nginx/blackphuquoc.com.error.log
sudo tail -f /var/log/nginx/blackphuquoc.com.access.log
```

### 3. Kiểm Tra PM2 Logs

```bash
pm2 logs henhodi-backend --lines 50
```

### 4. Kiểm Tra Database

```bash
mysql -u henhodi_user -p henhodi_db
# Kiểm tra tables
SHOW TABLES;
EXIT;
```

### 5. Kiểm Tra Ports

```bash
# Kiểm tra port 3000 (backend)
sudo netstat -tlnp | grep 3000

# Kiểm tra port 80, 443 (Nginx)
sudo netstat -tlnp | grep -E ':(80|443)'
```

### 6. Kiểm Tra Firewall

```bash
# Nếu sử dụng UFW
sudo ufw status
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 7. Các Lỗi Thường Gặp

**Lỗi: Cannot connect to database**
```bash
# Kiểm tra MySQL đang chạy
sudo systemctl status mysql

# Kiểm tra user và password trong .env
cat /var/www/blackphuquoc.com/backend/.env

# Test kết nối
mysql -u henhodi_user -p henhodi_db
```

**Lỗi: Permission denied**
```bash
# Cấp quyền cho thư mục
sudo chown -R $USER:$USER /var/www/blackphuquoc.com
sudo chmod -R 755 /var/www/blackphuquoc.com
```

**Lỗi: Port already in use**
```bash
# Tìm process đang dùng port
sudo lsof -i :3000
# Kill process nếu cần
sudo kill -9 <PID>
```

**Lỗi: Nginx 502 Bad Gateway**
- Kiểm tra backend có đang chạy: `pm2 status`
- Kiểm tra port trong ecosystem.config.js và nginx config phải khớp
- Kiểm tra logs: `pm2 logs henhodi-backend`

**Lỗi: API vẫn gọi về localhost:5000 sau khi deploy**

Đây là lỗi phổ biến khi React app không đọc đúng biến môi trường. Các bước xử lý:

```bash
# 1. Kiểm tra file env.production có tồn tại và đúng không
cd /var/www/blackphuquoc.com
cat env.production
# Phải thấy: REACT_APP_API_URL=https://blackphuquoc.com/api

# 2. Xóa thư mục build cũ
rm -rf build

# 3. Build lại (QUAN TRỌNG: React chỉ đọc env variables khi build)
npm run build

# 4. Kiểm tra trong file build có sử dụng đúng URL không
grep -r "blackphuquoc.com" build/static/js/ | head -5
# Nếu không thấy, có nghĩa là build chưa đọc env.production

# 5. Kiểm tra xem có file .env.production không (React cũng đọc file này)
ls -la | grep env

# 6. Nếu vẫn không được, thử đổi tên file
mv env.production .env.production
npm run build

# 7. Hoặc export trực tiếp khi build
REACT_APP_API_URL=https://blackphuquoc.com/api npm run build
```

**Nguyên nhân:**
- React chỉ đọc biến môi trường `REACT_APP_*` khi **build time**, không phải runtime
- File `env.production` phải có **TRƯỚC KHI** chạy `npm run build`
- Nếu build trước khi tạo file env, phải build lại

---

## 🔄 Cập Nhật Ứng Dụng

### 1. Cập Nhật Code

```bash
cd /var/www/blackphuquoc.com

# Nếu dùng Git
git pull origin master

# Hoặc upload code mới bằng SCP
```

### 2. Cập Nhật Backend

```bash
cd /var/www/blackphuquoc.com/backend
npm install
pm2 restart henhodi-backend
```

### 3. Cập Nhật Frontend

```bash
cd /var/www/blackphuquoc.com

# QUAN TRỌNG: Kiểm tra file env.production trước khi build
cat env.production
# Đảm bảo REACT_APP_API_URL=https://blackphuquoc.com/api

# Cài đặt dependencies (nếu có thay đổi)
npm install

# Build lại ứng dụng (React chỉ đọc env variables khi build)
npm run build

# Reload Nginx để serve files mới
sudo systemctl reload nginx
```

**⚠️ LƯU Ý**: Nếu sau khi deploy vẫn thấy API gọi về `localhost:5000`, có thể do:
1. File `env.production` chưa được tạo hoặc cấu hình sai
2. Build được thực hiện trước khi tạo file `env.production`
3. Cần build lại sau khi sửa `env.production`

---

## 📊 Monitoring và Maintenance

### 1. Xem Resource Usage

```bash
# CPU và Memory
pm2 monit

# Hoặc
htop
```

### 2. Backup Database

```bash
# Tạo backup
mysqldump -u henhodi_user -p henhodi_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u henhodi_user -p henhodi_db < backup_file.sql
```

### 3. Rotate Logs

PM2 tự động quản lý logs, nhưng bạn có thể cấu hình log rotation trong ecosystem.config.js hoặc sử dụng logrotate.

---

## 🔐 Bảo Mật

### 1. Cập Nhật Hệ Thống Định Kỳ

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Cấu Hình Firewall

```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 3. Thay Đổi Mật Khẩu Mặc Định

- Thay đổi mật khẩu MySQL root
- Sử dụng mật khẩu mạnh cho database user
- Sử dụng JWT_SECRET mạnh và ngẫu nhiên

### 4. Giới Hạn SSH Access

```bash
# Chỉ cho phép key-based authentication
sudo nano /etc/ssh/sshd_config
# Đặt: PasswordAuthentication no
sudo systemctl restart sshd
```

---

## 📞 Thông Tin Liên Hệ

Nếu gặp vấn đề trong quá trình deploy, hãy kiểm tra:
1. Logs của PM2: `pm2 logs`
2. Logs của Nginx: `/var/log/nginx/`
3. Logs của MySQL: `/var/log/mysql/`
4. Trạng thái services: `systemctl status`

---

## ✅ Checklist Deploy

- [ ] VPS Ubuntu đã được cài đặt
- [ ] Domain đã trỏ về IP VPS
- [ ] Node.js 22.x đã được cài đặt
- [ ] MySQL đã được cài đặt và cấu hình
- [ ] PM2 đã được cài đặt
- [ ] Nginx đã được cài đặt
- [ ] Database và user đã được tạo
- [ ] Backend code đã được upload
- [ ] File .env đã được cấu hình
- [ ] Frontend đã được build
- [ ] Nginx config đã được tạo và kích hoạt
- [ ] SSL certificate đã được cài đặt
- [ ] PM2 đã khởi động backend
- [ ] Ứng dụng đã hoạt động tại https://blackphuquoc.com

---

**Chúc bạn deploy thành công! 🎉**

