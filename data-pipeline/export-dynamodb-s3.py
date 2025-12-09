# export-dynamodb-s3.py
import json
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import re
from pathlib import Path

# ===================== ĐỌC FILE mockData.js =====================
file_path = Path("../frontend/mockData.js")  # Điều chỉnh đường dẫn nếu cần

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Parse các export const bằng regex
amenities_match = re.search(r'export const AMENITIES = (\[[\s\S]*?\]);', content)
user_match = re.search(r'export const USER = (\[[\s\S]*?\]);', content)
rooms_match = re.search(r'export const ROOMS = (\[[\s\S]*?\]);', content)

if not all([amenities_match, user_match, rooms_match]):
    raise ValueError("Không tìm thấy AMENITIES / USER / ROOMS trong mockData.js")

AMENITIES = json.loads(amenities_match.group(1).replace("'", '"'))
USERS = json.loads(user_match.group(1).replace("'", '"'))
ROOMS = json.loads(rooms_match.group(1).replace("'", '"'))

print(f"Đã load: {len(AMENITIES)} amenities | {len(USERS)} users | {len(ROOMS)} rooms")

# ===================== XỬ LÝ DỮ LIỆU =====================
df_rooms = pd.DataFrame(ROOMS)

# Join thông tin chủ nhà từ USER
df_users = pd.DataFrame(USERS)
df = df_rooms.merge(
    df_users[['id', 'contact_name', 'contact_phone']],
    left_on='landlordId',
    right_on='id',
    how='left'
)
df.rename(columns={
    'contact_name': 'landlord_name',
    'contact_phone': 'landlord_phone'
}, inplace=True)

# Hàm chuyển amenities key → label
def map_amenities(keys):
    if not keys or not isinstance(keys, list):
        return ''
    labels = [item['label'] for item in AMENITIES if item['key'] in keys]
    return ', '.join(labels) if labels else ''

df['amenities_label'] = df['amenities'].apply(map_amenities)

# Xử lý ngày tháng linh hoạt (nhiều định dạng)
def parse_date(date_str):
    if pd.isna(date_str) or not date_str:
        return pd.NaT
    date_str = str(date_str).strip()
    formats = [
        '%d/%m/%Y %H:%M', '%H:%M %d/%m/%Y',
        '%d/%m/%Y', '%Y-%m-%d', '%d-%m-%Y'
    ]
    for fmt in formats:
        try:
            return pd.to_datetime(date_str, format=fmt, dayfirst=True)
        except:
            continue
    try:
        return pd.to_datetime(date_str, dayfirst=True)
    except:
        return pd.NaT

df['date'] = df['date'].apply(parse_date)

# Chuẩn hóa kiểu dữ liệu
df['price'] = pd.to_numeric(df['price'], errors='coerce')
df['area'] = pd.to_numeric(df['area'], errors='coerce')

# Xử lý imageUrl → lấy ảnh đầu tiên làm thumbnail (hoặc join ',')
df['imageUrl'] = df['imageUrl'].apply(
    lambda x: x[0] if isinstance(x, list) else str(x) if pd.notna(x) else ''
)

# Partition theo năm tháng
df['year'] = df['date'].dt.year.astype('Int32')
df['month'] = df['date'].dt.month.astype('Int32')

# Cột cuối cùng
final_columns = [
    'id', 'title', 'rental_type', 'date', 'address', 'price', 'area',
    'amenities_label', 'description', 'imageUrl',
    'landlord_name', 'landlord_phone', 'landlordId',
    'year', 'month'
]
df = df[final_columns].dropna(subset=['year', 'month'])

print(f"Dữ liệu sau xử lý: {len(df)} bản ghi hợp lệ")

# ===================== GHI RA S3 (PARQUET + PARTITION) =====================
S3_PATH = "s3://your-bucket-name/room-rental-data/"  # THAY ĐỔI TẠI ĐÂY

table = pa.Table.from_pandas(df, preserve_index=False)

pq.write_to_dataset(
    table,
    root_path=S3_PATH,
    partition_cols=['year', 'month'],
    compression='snappy',
    existing_data_behavior='overwrite_or_ignore',
    basename_template='part-{i}.snappy.parquet'
)

print("HOÀN TẤT!")
print(f"Đã xuất dữ liệu ra: {S3_PATH}")
print("→ Chạy Glue Crawler hoặc MSCK REPAIR TABLE room_listings trong Athena")