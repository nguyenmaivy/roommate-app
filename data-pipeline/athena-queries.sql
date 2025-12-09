-- athena-queries.sql
-- Database: room_rental_db
-- Table: room_listings

-- TẠO BẢNG TRONG ATHENA (chạy 1 lần)
CREATE EXTERNAL TABLE IF NOT EXISTS room_listings (
    id string,
    title string,
    rental_type string,
    date timestamp,
    address string,
    price double,
    area double,
    amenities_label string,
    description string,
    imageUrl string,
    landlord_name string,
    landlord_phone bigint,
    landlordId string
)
PARTITIONED BY (year int, month int)
STORED AS PARQUET
LOCATION 's3://your-bucket-name/room-rental-data/'
TBLPROPERTIES ('parquet.compress'='SNAPPY');

-- Load partition mới
MSCK REPAIR TABLE room_listings;

-- PHÂN TÍCH DỮ LIỆU

-- 1. Top 10 quận có giá thuê trung bình cao nhất
WITH cleaned AS (
  SELECT *,
    regexp_extract(address, '(Quận|Thủ Đức)[^,]*', 0) AS raw_district
  FROM room_listings
)
SELECT 
    TRIM(REPLACE(raw_district, 'Quận', '')) AS district,
    COUNT(*) AS total_listings,
    ROUND(AVG(price)/1000000, 2) AS avg_price_million_vnd,
    ROUND(AVG(price/area), 0) AS avg_price_per_m2
FROM cleaned
WHERE raw_district IS NOT NULL AND price > 0 AND area > 0
GROUP BY raw_district
ORDER BY avg_price_million_vnd DESC
LIMIT 15;

-- 2. Giá trung bình theo loại hình thuê
SELECT 
    rental_type,
    COUNT(*) AS count,
    ROUND(AVG(price)/1000000, 2) AS avg_price_mil,
    ROUND(AVG(area), 1) AS avg_area
FROM room_listings 
WHERE price > 0
GROUP BY rental_type
ORDER BY avg_price_mil DESC;

-- 3. Chủ nhà đăng nhiều tin nhất (môi giới?)
SELECT 
    landlord_name,
    landlord_phone,
    COUNT(*) AS total_posts
FROM room_listings
WHERE landlord_name IS NOT NULL
GROUP BY landlord_name, landlord_phone
HAVING COUNT(*) >= 3
ORDER BY total_posts DESC
LIMIT 25;

-- 4. Tỷ lệ tiện ích cao cấp
SELECT 
    ROUND(100.0 * COUNT(*) FILTER (WHERE amenities_label LIKE '%máy lạnh%') / COUNT(*), 2) AS pct_aircon,
    ROUND(100.0 * COUNT(*) FILTER (WHERE amenities_label LIKE '%thang máy%') / COUNT(*), 2) AS pct_elevator,
    ROUND(100.0 * COUNT(*) FILTER (WHERE amenities_label LIKE '%hầm để xe%') / COUNT(*), 2) AS pct_parking,
    ROUND(100.0 * COUNT(*) FILTER (WHERE amenities_label LIKE '%không chung chủ%') / COUNT(*), 2) AS pct_no_owner,
    ROUND(100.0 * COUNT(*) FILTER (WHERE amenities_label LIKE '%nội thất%') / COUNT(*), 2) AS pct_furniture
FROM room_listings;

-- 5. Xu hướng giá theo thời gian
SELECT 
    year, month,
    COUNT(*) AS listings,
    ROUND(AVG(price)/1000000, 2) AS avg_price_million
FROM room_listings
WHERE year IS NOT NULL
GROUP BY year, month
ORDER BY year DESC, month DESC;

-- 6. Phòng "ngon bổ rẻ" nhất: có máy lạnh + thang máy + không chung chủ
SELECT 
    title, 
    price/1000000 AS price_mil,
    area,
    address,
    amenities_label,
    landlord_phone
FROM room_listings
WHERE amenities_label LIKE '%máy lạnh%'
  AND amenities_label LIKE '%thang máy%'
  AND amenities_label LIKE '%không chung chủ%'
  AND price > 0
ORDER BY price ASC
LIMIT 15;