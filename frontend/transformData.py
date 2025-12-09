import pandas as pd
import json

# 1. ĐỌC FILE CSV
df = pd.read_csv(
    'C:/Users/LENOVO/source/repos/roommate-app_2_12/data-pipeline/phongtro.csv',
    encoding='utf-8-sig'
)

# 2. TÁCH BẢNG LANDLORD
landlords_df = df[['contact_name', 'contact_phone']].drop_duplicates().reset_index(drop=True)

# Tạo ID dạng L1, L2, L3...
landlords_df['id'] = landlords_df.index.map(lambda i: f"L{i+1}")

# Tạo map (name, phone) → landlordId
landlord_map = {
    (row['contact_name'], row['contact_phone']): row['id']
    for _, row in landlords_df.iterrows()
}

# 3. MAP TIỆN NGHI
amenity_mapping = {
    "Đầy đủ nội thất": "frn",
    "Có gác": "mez",
    "Có kệ bếp": "kit",
    "Có máy lạnh": "airCon",
    "Có máy giặt": "wm",
    "Có tủ lạnh": "ref",
    "Giờ giấc tự do": "flxh",
    "Có bảo vệ 24/24": "sec24",
    "Có thang máy": "elv",
    "Có hầm để xe": "parking",
    "Không chung chủ": "nso",
}

amenity_columns = list(amenity_mapping.keys())


# 4. CHUYỂN ĐỔI 1 DÒNG THÀNH OBJECT ROOM
def row_to_room(row):
    # Tiện nghi = list key có giá trị 1
    amenities = [amenity_mapping[col] for col in amenity_columns if col in row and row[col] == 1]

    # Price
    price_str = str(row['price_million']).replace('.', '')
    price = int(float(price_str)) if price_str.isdigit() else 0

    return {
        "id": row['id'],
        "title": row['title'],
        "rental_type": row['rental_type'],
        "date": row['date'],
        "address": row['address'],
        "price": price,
        "area": float(row['area_m2']) if pd.notna(row['area_m2']) else 0,
        "amenities": amenities,
        "landlordId": landlord_map.get((row['contact_name'], row['contact_phone']), None),
        "description": row['description'],
        "imageUrl": "https://placehold.co/600x400/4F46E5/ffffff?text=Room+" + row['id'].upper()
    }

# 5. TẠO DANH SÁCH PHÒNG
rooms_list = df.apply(row_to_room, axis=1).tolist()

# 6. XUẤT FILE mockData.js
# 6.1. Xuất bảng AMENITIES
js_text = """export const AMENITIES = [
  { key: "frn", label: "Đầy đủ nội thất" },
  { key: "mez", label: "Có gác" },
  { key: "kit", label: "Có kệ bếp" },
  { key: "airCon", label: "Có máy lạnh" },
  { key: "wm", label: "Có máy giặt" },
  { key: "ref", label: "Có tủ lạnh" },
  { key: "flxh", label: "Giờ giấc tự do" },
  { key: "sec24", label: "Có bảo vệ 24/24" },
  { key: "elv", label: "Có thang máy" },
  { key: "parking", label: "Có hầm để xe" },
  { key: "nso", label: "Không chung chủ" },
]

"""

# 6.2. Xuất bảng LANDLORDS
js_text += "export const LANDLORDS = "
js_text += landlords_df.to_json(orient='records', force_ascii=False, indent=2)
js_text += "\n\n"

# 6.3. Xuất bảng MOCK_ROOMS
js_text += "export const MOCK_ROOMS = "
js_text += json.dumps(rooms_list, ensure_ascii=False, indent=2)
js_text += "\n"

# 6.4. Ghi file
with open("mockData.js", "w", encoding="utf-8") as f:
    f.write(js_text)

# 7. LOG KẾT QUẢ
print("✔ Đã tạo thành công mockData.js")
print(f"→ Tổng số phòng: {len(rooms_list)}")
print(f"→ Tổng số landlord: {len(landlords_df)}")







# import pandas as pd
# import json

# # Đọc file CSV (có BOM UTF-8)
# df = pd.read_csv('C:/Users/LENOVO/source/repos/roommate-app_2_12/data-pipeline/phongtro.csv', encoding='utf-8-sig')

# # Danh sách ánh xạ cột tiện nghi -> key trong AMENITIES
# amenity_mapping = {
#     "Đầy đủ nội thất": "frn",
#     "Có gác": "mez",
#     "Có kệ bếp": "kit",
#     "Có máy lạnh": "airCon",
#     "Có máy giặt": "wm",
#     "Có tủ lạnh": "ref",
#     "Giờ giấc tự do": "flxh",
#     "Có bảo vệ 24/24": "sec24",
#     "Có thang máy": "elv",
#     "Có hầm để xe": "parking",
#     "Không chung chủ": "nso",
# }

# # Các cột tiện nghi có trong CSV
# amenity_columns = list(amenity_mapping.keys())

# # Hàm chuyển đổi 1 dòng thành object JSON
# def row_to_room(row):
#     # Lấy danh sách key tiện nghi có giá trị = 1
#     amenities = [amenity_mapping[col] for col in amenity_columns if row[col] == 1]
    
#     # Chuyển price từ chuỗi "2.500.000" → số
#     price_str = str(row['price_million']).replace('.', '')
#     price = int(float(price_str)) if price_str.replace('.','').isdigit() else 0
    
#     return {
#         "id": row['id'],
#         "title": row['title'],
#         "rental_type": row['rental_type'],
#         "date": row['date'],
#         "address": row['address'],
#         "price": price,
#         "area": float(row['area_m2']) if pd.notna(row['area_m2']) else 0,
#         "amenities": amenities,
#         "landlordId": "L1",  # tạm thời để L1, bạn có thể map sau
#         "description": row['description'],
#         "imageUrl": "https://placehold.co/600x400/4F46E5/ffffff?text=Room+" + row['id'].upper()  # placeholder đẹp
#     }

# # Chuyển toàn bộ DataFrame
# rooms_list = df.apply(row_to_room, axis=1).tolist()

# # Tạo nội dung file mockData.js
# js_content = """export const AMENITIES = [
#   { key: "frn", label: "Đầy đủ nội thất" },
#   { key: "mez", label: "Có gác" },
#   { key: "kit", label: "Có kệ bếp" },
#   { key: "airCon", label: "Có máy lạnh" },
#   { key: "wm", label: "Có máy giặt" },
#   { key: "ref", label: "Có tủ lạnh" },
#   { key: "flxh", label: "Giờ giấc tự do" },
#   { key: "sec24", label: "Có bảo vệ 24/24" },
#   { key: "elv", label: "Có thang máy" },
#   { key: "parking", label: "Có hầm để xe" },
#   { key: "nso", label: "Không chung chủ" },
# ]

# export const MOCK_ROOMS = """
# js_content += json.dumps(rooms_list, ensure_ascii=False, indent=2)
# js_content += "\n"

# # Ghi ra file
# with open("mockData.js", "w", encoding="utf-8") as f:
#     f.write(js_content)

# print("Đã tạo thành công mockData.js")
# print(f"→ Tổng cộng: {len(rooms_list)} phòng trọ")
# print("   (đã xử lý đúng price, area, amenities, placeholder image)")