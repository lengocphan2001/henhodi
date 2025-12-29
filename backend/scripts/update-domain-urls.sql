-- Script để cập nhật các URL cũ từ blackphuquoc.com sang chumgaiphuquoc.com
-- Chạy script này trên MySQL database sau khi đổi domain

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
