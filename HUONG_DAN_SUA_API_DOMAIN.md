# Hướng Dẫn Sửa Lỗi API Vẫn Dùng Domain Cũ

## 🔍 Nguyên Nhân

URL `https://blackphuquoc.com/api/girls/10/image` vẫn xuất hiện vì:

1. **File `.env` trên server** vẫn có `API_BASE_URL=https://blackphuquoc.com`
2. **Database** có thể đã lưu URL cũ trong trường `img_url`
3. Backend sử dụng `process.env.API_BASE_URL` để tạo URL cho images

---

## ✅ Giải Pháp

### Bước 1: Cập Nhật File .env trên Server (QUAN TRỌNG NHẤT)

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Di chuyển vào thư mục backend
cd /var/www/chumgaiphuquoc.com/backend
# hoặc
cd /var/www/blackphuquoc.com/backend  # nếu chưa đổi tên thư mục

# Sửa file .env
nano .env
```

**Cập nhật các dòng sau:**

```env
# Tìm và sửa dòng này:
API_BASE_URL=https://chumgaiphuquoc.com

# Và đảm bảo có dòng này:
CORS_ORIGIN=https://chumgaiphuquoc.com
```

**Lưu ý:** 
- Phải dùng `https://` (không phải `http://`)
- Không có dấu `/` ở cuối
- Domain phải đúng: `chumgaiphuquoc.com`

**Sau khi sửa, lưu file (Ctrl+O, Enter, Ctrl+X)**

### Bước 2: Restart Backend

```bash
# Restart backend để áp dụng thay đổi
pm2 restart henhodi-backend

# Kiểm tra logs để đảm bảo không có lỗi
pm2 logs henhodi-backend --lines 50
```

### Bước 3: Cập Nhật URL Cũ Trong Database

Nếu database đã lưu URL cũ trong trường `img_url`, cần cập nhật:

```bash
# Đăng nhập MySQL
mysql -u henhodi_user -p henhodi_db
```

**Chạy các lệnh SQL sau:**

```sql
-- Cập nhật img_url trong bảng girls
UPDATE girls 
SET img_url = REPLACE(img_url, 'https://blackphuquoc.com', 'https://chumgaiphuquoc.com')
WHERE img_url LIKE '%blackphuquoc.com%';

UPDATE girls 
SET img_url = REPLACE(img_url, 'http://blackphuquoc.com', 'https://chumgaiphuquoc.com')
WHERE img_url LIKE '%blackphuquoc.com%';

-- Cập nhật URL trong bảng detail_images (nếu có)
UPDATE detail_images 
SET url = REPLACE(url, 'https://blackphuquoc.com', 'https://chumgaiphuquoc.com')
WHERE url LIKE '%blackphuquoc.com%';

UPDATE detail_images 
SET url = REPLACE(url, 'http://blackphuquoc.com', 'https://chumgaiphuquoc.com')
WHERE url LIKE '%blackphuquoc.com%';

-- Kiểm tra kết quả
SELECT id, name, img_url FROM girls WHERE img_url LIKE '%blackphuquoc.com%';
SELECT id, url FROM detail_images WHERE url LIKE '%blackphuquoc.com%';

-- Nếu không còn kết quả nào, đã cập nhật thành công
EXIT;
```

**Hoặc sử dụng script SQL có sẵn:**

```bash
# Từ thư mục project (nếu đã upload script lên server)
cd /var/www/chumgaiphuquoc.com/backend/scripts
mysql -u henhodi_user -p henhodi_db < update-domain-urls.sql
```

### Bước 4: Xóa Cache và Test

```bash
# Clear browser cache hoặc test với curl
curl -I https://chumgaiphuquoc.com/api/girls/10/image

# Hoặc test từ browser với incognito mode
```

---

## 🔍 Kiểm Tra

### 1. Kiểm Tra File .env

```bash
cd /var/www/chumgaiphuquoc.com/backend
cat .env | grep API_BASE_URL
# Phải thấy: API_BASE_URL=https://chumgaiphuquoc.com
```

### 2. Kiểm Tra Backend Logs

```bash
pm2 logs henhodi-backend --lines 20
# Xem có lỗi gì không
```

### 3. Test API Endpoint

```bash
# Test từ server
curl https://chumgaiphuquoc.com/api/girls/10/image -I

# Hoặc test từ browser
# Truy cập: https://chumgaiphuquoc.com/api/girls/10/image
```

### 4. Kiểm Tra Response JSON

```bash
# Test API trả về JSON
curl https://chumgaiphuquoc.com/api/girls | jq '.[0].img'

# Phải thấy URL mới: https://chumgaiphuquoc.com/api/girls/10/image
# Không phải: https://blackphuquoc.com/api/girls/10/image
```

---

## 🐛 Troubleshooting

### Vẫn thấy URL cũ sau khi cập nhật

**Nguyên nhân có thể:**
1. Backend chưa được restart
2. File `.env` chưa được lưu đúng
3. Database vẫn có URL cũ trong `img_url`
4. Browser cache

**Giải pháp:**
```bash
# 1. Kiểm tra lại file .env
cat /var/www/chumgaiphuquoc.com/backend/.env | grep API_BASE_URL

# 2. Restart lại backend
pm2 restart henhodi-backend

# 3. Kiểm tra database
mysql -u henhodi_user -p henhodi_db -e "SELECT id, name, img_url FROM girls WHERE img_url LIKE '%blackphuquoc.com%' LIMIT 5;"

# 4. Nếu vẫn có kết quả, chạy lại script UPDATE
```

### Backend không đọc được .env

**Kiểm tra:**
```bash
# Xem PM2 có đọc env_file không
pm2 show henhodi-backend

# Xem ecosystem.config.js
cat /var/www/chumgaiphuquoc.com/ecosystem.config.js | grep env_file

# Nếu không có env_file, thêm vào ecosystem.config.js
```

**Cập nhật ecosystem.config.js:**
```javascript
{
  name: 'henhodi-backend',
  // ...
  env_file: '/var/www/chumgaiphuquoc.com/backend/.env',
  // ...
}
```

Sau đó:
```bash
pm2 delete henhodi-backend
pm2 start ecosystem.config.js
pm2 save
```

### URL mới được tạo nhưng database vẫn có URL cũ

**Giải pháp:** Chạy lại script UPDATE SQL ở Bước 3.

---

## 📋 Checklist

- [ ] Đã cập nhật `API_BASE_URL` trong file `.env` trên server
- [ ] Đã cập nhật `CORS_ORIGIN` trong file `.env` trên server
- [ ] Đã restart backend: `pm2 restart henhodi-backend`
- [ ] Đã cập nhật URL cũ trong database (nếu có)
- [ ] Đã test API endpoint và thấy URL mới
- [ ] Đã clear browser cache và test lại

---

## 🎯 Tóm Tắt Các Lệnh Quan Trọng

```bash
# 1. Cập nhật .env
cd /var/www/chumgaiphuquoc.com/backend
nano .env
# Sửa: API_BASE_URL=https://chumgaiphuquoc.com

# 2. Restart backend
pm2 restart henhodi-backend

# 3. Cập nhật database
mysql -u henhodi_user -p henhodi_db
# Chạy các lệnh UPDATE SQL

# 4. Test
curl https://chumgaiphuquoc.com/api/girls/10/image -I
```

---

**Sau khi hoàn thành, tất cả URL sẽ sử dụng domain mới: `https://chumgaiphuquoc.com`** ✅
