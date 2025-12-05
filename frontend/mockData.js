export const AMENITIES = [
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

export const USERS = [
  {
    "contact_name":"Trần Thị Thu Thảo",
    "contact_phone":983574883,
    "id":"L1",
    "password":"1234",
    "role":"landlord",    // [landlord | tenant]
    "email":"phuhuynh.010104@gmail.com"
  },
  {
    "contact_name":"Nguyễn văn rẻ",
    "contact_phone":210931337,
    "id":"L2",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.020104@gmail.com"
  },
  {
    "contact_name":"Nguyễn Văn Hiển",
    "contact_phone":907658595,
    "id":"L3",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.030104@gmail.com"
  },
  {
    "contact_name":"trannhatphuong",
    "contact_phone":170903444,
    "id":"L4",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.040104@gmail.com"
  },
  {
    "contact_name":"Cô Tư",
    "contact_phone":902453432,
    "id":"L5",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.050104@gmail.com"
  },
  {
    "contact_name":"Hoàng Trung Thông",
    "contact_phone":932648778,
    "id":"L6",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.060104@gmail.com"
  },
  {
    "contact_name":"Nhi Quỳnh",
    "contact_phone":220858919,
    "id":"L7",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.070104@gmail.com"
  },
  {
    "contact_name":"Sương Elly",
    "contact_phone":230384304,
    "id":"L8",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.080104@gmail.com"
  },
  {
    "contact_name":"Nguyễn Hoàng",
    "contact_phone":250888051,
    "id":"L9",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.090104@gmail.com"
  },
  {
    "contact_name":"Mạc Phú",
    "contact_phone":250388927,
    "id":"L10",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.100104@gmail.com"
  },
  {
    "contact_name":"nhadat247",
    "contact_phone":160902324,
    "id":"L11",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.110104@gmail.com"
  },
  {
    "contact_name":"Lê Nguyễn Hà Anh",
    "contact_phone":220983955,
    "id":"L12",
    "password":"1234",
    "role":"landlord",
    "email":"phuhuynh.120104@gmail.com"
  }
]

export const ROOMS = [
  {
    "id": "r1",
    "title": "Chính chủ cho thuê phòng trọ giá rẻ địa chỉ 419 QL13, Quận Thủ Đức, TP Hồ Chí Minh",
    "rental_type": "Cho thuê phòng trọ",
    "date": "14:32 22/11/2021",
    "address": "419 Đường Quốc Lộ 13, Phường Hiệp Bình Chánh, Thủ Đức, Hồ Chí Minh",
    "price": 2500000,
    "area": 28.0,
    "amenities": [kit, airCon, Paking],
    "landlordId": "L1",
    "description": "GIÁ CHỈ 2tr - 3,8tr/ tháng Còn vài phòng gần GIGAMALL - ĐH LUẬT THỦ ĐỨC cần cho thuê - Diện tích: 15-28m2 chưa tính gác, phòng mới sạch đẹp, có lối đi riêng, máy lạnh inverter đời mới, WC, bếp nấu ăn riêng từng phòng, có chỗ để xe, có camera giám sát, báo trộm đảm bảo an ninh, wifi băng thông lớn, tốc độ cao học tập và làm việc thoải mái,.\n. Vị trí giáp Bình Thạnh, cầu Bình Triệu, Bình Lợi, chợ Coop Mart Bình Triệu, DH LUẬT, khu đô thị VẠN PHÚC thuận tiện qua các trường ĐH như HUTECH, GTVT, NGOẠI THƯƠNG, Đh CÔNG NGHIỆP Gò Vấp,…. Các phí khác: + Điện: 3,5k/1kwh + Nước: 25k/1 khối + Rác,wifi: 30k/1 phòng - Địa chỉ: số 419 Quốc lộ 13, Hiệp Bình Chánh, Thủ Đức. - Liên hệ: chị Thảo 098-357-4883 hoặc anh Chứ 0937-488-999 để xem phòng",
    "imageUrl": ["https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/11/22/z2922938006858-ce9ae711ab99e0e9b13ba55081ed2830_1637566208.jpg", 
                  "https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/11/22/z2922938040060-facb7e0510e8e4f989230b3dd13c2cdd_1637566179.jpg", 
                  "https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/11/22/z2922938049365-ead7c7a3c79a5f4b22bc4192034dc8f0_1637566179.jpg", 
                  "https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/11/22/z2922937916198-349c1da39fedd2c07fa3db7033c8c5b2_1637566185.jpg", 
                  'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/11/22/z2922937974231-33330ea2c469fbbff9765ac42a4b1d17_1637566207.jpg'],
    "location": {
      "lat": 10.830375717619898,
      "lng": 106.7140823386311
    }
  },
  {
    "id": "r2",
    "title": "Cho thuê MB kinh doanh có thể ở lại được tại Đường Đặng Thuỳ Trâm, Phường 13, Quận Bình Thạnh",
    "rental_type": "Cho thuê mặt bằng",
    "date": "9/11/2021 11:09",
    "address": "Đường Đặng Thuỳ Trâm, Phường 13, Quận Bình Thạnh, Hồ Chí Minh",
    "price": 8000000,
    "area": 35.0,
    "amenities": [],
    "landlordId": "L2",
    "description": "- Vị trí ngã ba giao thương 3 Quận\n- Góc 2 MT, Khu dân cư văn phòng\n- Đường vỉa hè 2 bên, lòng đường 8m\n- 100m đến Emart gò vấp, Ngã tư Phạm văn đồng nguyễn xí\n- 300m ĐH văn lang, trường cấp 23\n- ko chung chủ, ở lại dc\nCam kết giá rẻ nhất khu vực P13 Bình thạnh",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/11/09/dien-tich-mat-bang1_1636430955.png', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2021/11/09/dien-tich-mat-bang1_1636430955.png', 
      'https://phongtro123.com/images/default-user.svg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/28/img-9190_1761622534.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/09/30/z6896177374199-d6a8990dcbf7c9ba9119f97965a9f7a8_1759198328.jpg'],
    "location": {
      "lat": 10.830330042022501, 
      "lng": 106.702956
    } 
  },
  {
    "id": "r3",
    "title": "Nhà riêng cho thuê tại 936/10/2 Đường TL 10, Phường Tân Tạo, Bình Tân, Hồ Chí Minh",
    "rental_type": "Cho thuê nhà",
    "date": "11:03 15/08/2025",
    "address": "936/10/2 Đường Tỉnh Lộ 10, Phường Tân Tạo, Quận Bình Tân, Hồ Chí Minh",
    "price": 5000000,
    "area": 38.0,
    "amenities": [],
    "landlordId": "L3",
    "description": "- Diện tích 38 m2, giá cho thuê chỉ 5 triệu VND/tháng.\n- 1 trệt 1 lầu, diện tích sử dụng lên tới 70m2\n- Thiết kế gồm 2 phòng ngủ và 2 phòng tắm, phù hợp cho gia đình nhỏ.\n- Nhà có 2 tầng, không gian thoáng đãng và tiện nghi.\n- Thời gian cho thuê linh hoạt, tối thiểu 1 năm.\nGần các tiện ích như:\n- Gần trường học, thuận tiện cho việc học tập của trẻ em.\n- Gần chợ/siêu thị Aeon, dễ dàng mua sắm hàng ngày.\n- Gần khu công nghiệp Bon Chen (Pouyuen)\n- Gần bệnh viện kỹ thuật cao\nLiên hệ ngay để biết thêm chi tiết và xem nhà: Nguyễn Văn Hiển 0907658595",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/08/18/img-20250810-113253_1755479570.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/08/18/img-20250810-113329_1755479580.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/08/18/img-20250810-113243_1755479586.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/08/18/img-20250810-113250_1755479592.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/08/18/img-20250810-113253_1755479570.jpg'],
    "location": {
      "lat": 10.757585804716133, 
      "lng": 106.60462867726223
    }
  },
  {
    "id": "r4",
    "title": "PHÒNG TRỌ trung tâm 441/22 Nguyễn Đình Chiểu, P5, Quận 3, Tp Hồ Chí Minh",
    "rental_type": "Cho thuê phòng trọ",
    "date": "09:16 16/06/2025",
    "address": "441/22 Đường Nguyễn Đình Chiểu, Phường 5, Quận 3, Hồ Chí Minh",
    "price": 3800000,
    "area": 40.0,
    "amenities": [
      "frn",
      "mez",
      "kit",
      "airCon",
      "ref",
      "flxh",
      "sec24",
      "parking",
      "nso"
    ],
    "landlordId": "L4",
    "description": "CHO THUÊ PHÒNG TRỌ ĐƯỜNG NGUYỄN ĐÌNH CHIỂU 441/22, Phường 05, Quận 3, Tp Hồ Chí Minh\n- NHÀ NGAY TRUNG TÂM THÀNH PHỐ - KHU VIP, AN NINH, YÊN TĨNH VÀ TRÍ THỨC\n- GIÁP Q1, 5,10… CÁC DỊCH VỤ TIỆN ÍCH (CHỢ VƯỜN CHUỐI, BÀN CỜ, VINMART, MINISTOP, STAR MART, BV, TRƯỜNG HỌC….) CHỈ 1 BƯỚC CHÂN\n-CÓ BẢO VỆ CANH XE 24/24, GIỜ GIẤC TỰ DO. CHỖ ĐỂ XE RỘNG RÃI, SẠCH SẼ\n- NHÀ CHỦ YẾU DÂN VĂN PHÒNG, YÊN TĨNH\nGiá phòng: 3,8 - 4,5 triệu/tháng, free wifi, cáp\nTiền xe ga: 180.000 đồng/tháng\nTiền xe Số:120.000 đồng/tháng\nĐiện: 4.000 đồng/kwh\nNước: 22.000 đồng/m3\n***YÊU CẦU: ĂN Ở GỌN GÀNG, SẠCH SẼ, TÔN TRỌNG CS CỦA NHỮNG NGƯỜI XUNG QUANH, KO DẪN BẠN BÈ TỤ TẬP QUA ĐÊM…..ƯU TIÊN NGƯỜI ĐỘC THÂN ÍT ĐỒ ĐẠC",
    "imageUrl": [ 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/08/18/img-20250810-113329_1755479580.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/08/18/img-20250810-113243_1755479586.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/08/18/img-20250810-113250_1755479592.jpg', 
      'https://phongtro123.com/images/default-user.svg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/06/img-8647_1762397649.jpg'],
    "location": {
      "lat": 10.778586453873382, 
      "lng": 106.68073623288888
    }
  },
  {
    "id": "r5",
    "title": "Cho nữ thuê phòng hẻm 835 đường Trần Hưng Đạo phường 1 quận 5",
    "rental_type": "Cho thuê phòng trọ",
    "date": "9/5/2025 14:36",
    "address": "835/17d Đường Trần Hưng Đạo, Phường 1, Quận 5, Hồ Chí Minh",
    "price": 3000000,
    "area": 40.0,
    "amenities": [
      "airCon",
      "wm",
      "flxh",
      "parking"
    ],
    "landlordId": "L5",
    "description": "Cho nữ thuê phòng hẻm 835 đường Trần Hưng đạo phường 1 quận 5, gần ngã 4 Trần Hưng Đạo, Trần bình Trọng.\nGần nhiều trường đại học, gần nhiều chợ và siêu thị rất tiện lợi khi mua sắm\nkhu vực an ninh yên tịnh, phòng mới rộng rãi sạch đẹp\nphòng có máy lạnh, Wifi, máy giặt có chổ để xe\ngiờ giấc tự do, giao chìa khoá riêng.\nGiá 3 triệu/ tháng.\nĐiện thoại 090 245 3432 gập Cô Tư.",
    "imageUrl": [
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/31/20250212-105037_1761920027.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/28/01_1761662544.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/28/1000007070_1761620975.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/25/z7100231290708-92b590e7cd4b0872ab25fb82a5a2ace4_1761370540.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/21/img20251010104024_1761032658.jpg'],
    "location": {
      "lat": 10.755301876624264, 
      "lng": 106.6812513227378
    }
  },
  {
    "id": "r6",
    "title": "CHO THUÊ PHÒNG TRỌ: số 1 Lê Thị Chợ, Phú Thuận, Q.7, TP. Hồ Chí Minh, bên cạnh Chi Cục thuế cơ sở 7",
    "rental_type": "Cho thuê phòng trọ",
    "date": "15:44 27/08/2025",
    "address": "1 Đường Lê Thị Chợ, Phường Phú Thuận, Quận 7, Hồ Chí Minh",
    "price": 3200000,
    "area": 25.0,
    "amenities": [
      "kit",
      "airCon",
      "flxh",
      "sec24",
      "parking"
    ],
    "landlordId": "L6",
    "description": "CHO THUÊ PHÒNG TRỌ: số 1 Lê Thị Chợ, Phú Thuận, Q.7, TP. Hồ Chí Minh, nhà mặt tiền. Bên cạnh Chi Cục thuế cơ sở 7, Phú Thuận, TP. Hồ Chí Minh, cách Phú Mỹ Hưng 100 m.\nGia đình còn phòng không dùng hết cho thuê, phòng có diện tích 25 m2 và 30 m2, có nhà vệ sinh, nhà tắm RIÊNG biệt, điện nước dùng riêng theo đơn giá của nhà nước. (A/C xem video & ảnh). Có chỗ để xe máy thuận tiện\nPhòng có diện tích 25 m2 giá thuê là 3.200.000đ một tháng, phòng có diện tích 30 m2 là 3.800.000đ một tháng, đặt cọc một tháng.\nLH: 0932648778",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/17/hinhnha3_1760686154.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/15/img-7203_1760533194.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/img-8584_1763250836.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/z7227443522748-941354545e54ba9f36bb2c2395e3f046_1763239726.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/2025-11-12-053454-so-66-duong-dht-21_1763235160.jpg'],
    "location": {
      "lat": 10.719098666319173, 
      "lng": 106.73703850794668
    }
  },
  {
    "id": "r7",
    "title": "Cho thuê phòng tại Tản Viên, Phường 2, Quận Tân Bình",
    "rental_type": "Cho thuê phòng trọ",
    "date": "19:25 27/07/2025",
    "address": "Đường Tản Viên, Phường 2, Quận Tân Bình, Hồ Chí Minh",
    "price": 3800000,
    "area": 40.0,
    "amenities": [
      "kit",
      "airCon",
      "wm",
      "flxh",
      "elv",
      "nso"
    ],
    "landlordId": "L7",
    "description": "Cho thuê phòng tại Tản Viên, Phường 2, Quận Tân Bình\nTự do giờ giấc, có vân tay, sân phơi đồ chung, để xe chung, Nuôi thú cưng, Thang máy, Máy giặt chung\nLoại phòng: Studio, Lầu (Lầu 1), Diện tích (20), Giếng trời\nNội thất: Toilet (Riêng), Máy lạnh, Kệ bếp, Bồn rửa chén\nPhí: Điện: 4.000₫ /Kwh, Nước: 70.000₫ /Người, Phí QL: 150.000₫ /Phòng, Để xe: 150.000₫ /Xe",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z5531127654338-614f73e7d1fb475ea251a4ae3aa2aa11_1763222297.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227514252295-79e685cd1bf6c3fe8836aadebed5c44e_1763214697.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227105678369-5cc11b9a4f1f6022f655ecdebd2df0d5_1763215857.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-9876_1763218884.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-2241_1763213723.jpg'],
    "location": {
      "lat": 10.809105853088147, 
      "lng": 106.66583015342223
    } 
  },
  {
    "id": "r8",
    "title": "Trống phòng cho thuê tại Lê Đức Thọ, Phường 15, Quận Gò Vấp, Thành phố Hồ Chí Minh",
    "rental_type": "Cho thuê phòng trọ",
    "date": "19:22 27/07/2025",
    "address": "Đường Lê Đức Thọ, Phường 15, Quận Gò Vấp, Hồ Chí Minh",
    "price": 3800000,
    "area": 40.0,
    "amenities": [
      "mez",
      "kit",
      "airCon",
      "flxh",
      "elv",
      "parking",
      "nso"
    ],
    "landlordId": "L7",
    "description": "Trống phòng cho thuê tại Lê Đức Thọ, Phường 15, Quận Gò Vấp, Thành phố Hồ Chí Minh\nVân tay, giờ giấc tự do, có sân phơi chung, xe để chung, Nuôi thú cưng, Thang máy\nPhòng duplex, Lầu (lầu 2), Diện tích (25), Cửa sổ, Gác\nNội thất: Toilet (riêng), Máy lạnh, Kệ bếp, Bồn rửa chén, Máy nước nóng\nPhí: Điện: 3.500₫ /Kwh, Nước: 100.000₫ /người, Phí QL: 200.000₫ /phòng",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/07/27/adf8e4c4-8c6e-47d8-aaf2-208b0c4669f9_1753618926.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/07/27/b22a1c71-3734-430c-ac5e-5558726cc631_1753618926.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/07/27/e65a1525-0c60-46c0-a314-10bd2046e68d_1753618928.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2025/07/27/f5a6791b-0dc2-4858-b04b-cc479509b4ea_1753618928.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/27/adf8e4c4-8c6e-47d8-aaf2-208b0c4669f9_1753618926.jpg',],
    "location": {
      "lat": 10.84989063499709, 
      "lng": 106.6679003227378
    }
      
  },
  {
    "id": "r9",
    "title": "Phòng trống tại LIÊN KHU 16-18, Phường Bình Trị Đông, Quận Bình Tân, Thành phố Hồ Chí Minh",
    "rental_type": "Cho thuê phòng trọ",
    "date": "19:09 27/07/2025",
    "address": "Phường Bình Trị Đông, Quận Bình Tân, Hồ Chí Minh",
    "price": 3600000,
    "area": 20.0,
    "amenities": [
      "mez",
      "kit",
      "airCon",
      "wm",
      "flxh",
      "elv",
      "parking",
      "nso"
    ],
    "landlordId": "L7",
    "description": "Phòng trống tại LIÊN KHU 16-18, Phường Bình Trị Đông, Quận Bình Tân, Thành phố Hồ Chí Minh\nThoải mái giờ giấc, vân tay an ninh, Sân phơi và Để xe chung, Bảo vệ, có thang máy, Máy giặt chung\nDuplex tại Lầu 5, 20m2, Cửa sổ, Gác\nNội thất: Toilet (Riêng), Máy lạnh, Kệ bếp, Bồn rửa chén, Tủ quần áo\nPhí: Điện: 3.800₫ /Kwh, Nước: 100.000₫ /Người, Phí QL: 150.000₫ /Phòng, Để xe: 120.000₫ /Xe",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/27/b22a1c71-3734-430c-ac5e-5558726cc631_1753618926.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/27/e65a1525-0c60-46c0-a314-10bd2046e68d_1753618928.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/07/27/f5a6791b-0dc2-4858-b04b-cc479509b4ea_1753618928.jpg', 
      'https://phongtro123.com/images/default-user.svg', 'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/08/06/img-2585_1754444794.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/06/04/z6672224227928-ea620d18c659ac8180f446a7a52968fc_1749045525.jpg'],
    "location": {
      "lat": 10.747524,
      "lng": 106.606743
    }
  },
  {
    "id": "r10",
    "title": "Studio tại Cộng Hoà, Phường 4, Quận Tân Bình, Thành phố Hồ Chí Minh",
    "rental_type": "Cho thuê căn hộ mini",
    "date": "19:04 27/07/2025",
    "address": "Phường 4, Quận Tân Bình, Hồ Chí Minh",
    "price": 5300000,
    "area": 35.0,
    "amenities": [
      "frn"
    ],
    "landlordId": "L7",
    "description": "Studio tại Cộng Hoà, Phường 4, Quận Tân Bình, Thành phố Hồ Chí Minh\nGiờ giấc Tự do, Khóa Vân tay, phơi đồ Chung, xe để Chung, Nuôi thú cưng, Máy giặt xài chung\nStudio rộng 35m2, Cửa sổ\nNội thất: Toilet (Chung), Máy lạnh, Kệ bếp, Giường, Bồn rửa chén, Nệm, Tủ quần áo, Tủ lạnh\nPhí: Điện: 4.000₫ /Kwh, Nước: 100.000₫ /Người, Phí QL: 150.000₫ /Phòng",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/10/28/img-8462_1761628327.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2024/07/27/img-2047_1722050282.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/01/img-0375_1761980279.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7220213559451-c0cf5168bdd34de37bfb843ff0291b54_1763203566.jpg'],
    "location": {
      "lat": 10.792971022559174, 
      "lng": 106.65366844988436
    }
  },
  {
    "id": "r11",
    "title": "phòng trọ cho thuê đường Nguyễn Đình Chiểu ngay ĐH Hoa Sen, đh Đại học Kinh tế TP. Hồ Chí Minh - UEH",
    "rental_type": "Cho thuê phòng trọ",
    "date": "9/8/2025 15:58",
    "address": "491 Đường Nguyễn Đình Chiểu, Phường 5, Quận 3, Hồ Chí Minh",
    "price": 5000000,
    "area": 40.0,
    "amenities": [
      "frn",
      "mez",
      "kit",
      "airCon",
      "wm",
      "ref",
      "flxh",
      "sec24",
      "parking",
      "nso"
    ],
    "landlordId": "L8",
    "description": "phòng trọ cho thuê đường Nguyễn Đình Chiểu ngay ĐH Hoa Sen, đh Đại học Kinh tế TP. Hồ Chí Minh - UEH\nCác tiện ích:\nGiờ giấc tự do\nFull Nội Thất đầy đủ các thiết bị cần thiết,…\nDịch vụ dọn vệ sinh chung mỗi ngày\nDịch vụ bảo trì, bảo dưỡng hàng tháng\nToà nhà an ninh, camera an ninh 24/7, khoá vân tay - hẻm ô tô - An ninh",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-8365_1763193909.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7221962318356-42c237db453830008a1e0f51d22729ed_1763182237.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7212134595228-ffac9b6f39b838f50ed5eba8471cd5c6_1763172957.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/13/3_1763017659.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/12/z7216525058085-a11071cb4426a6a58ca5f24bafa5d3fc_1762955677.jpg'],
    "location": {
      "lat": 10.777658972106813, 
      "lng": 106.68150870904888
    } 
      
  },
  {
    "id": "r12",
    "title": "Phòng cho thuê tại địa chỉ 165/3 Nguyễn Thị Thập, P. Tân Phú, Quận 7",
    "rental_type": "Cho thuê phòng trọ",
    "date": "12/7/2025 12:04",
    "address": "165/3 Đường Nguyễn Thị Thập, Phường Tân Hưng, Quận 7, Hồ Chí Minh",
    "price": 5000000,
    "area": 20.0,
    "amenities": [
      "frn",
      "kit",
      "airCon",
      "wm",
      "ref",
      "flxh",
      "parking",
      "nso"
    ],
    "landlordId": "L9",
    "description": "Địa chỉ: 165/3 Nguyễn Thị Thập Tân Phú Quận 7 Hồ Chí Minh\nGiờ tự do - không chung chủ\n+ Phòng 5tr - rộng, full nội thất\nLH để biết thêm chi tiết",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/12/img-2038_1762943270.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/11/img-4495_1762849676.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/img-8584_1763250836.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/z7227443522748-941354545e54ba9f36bb2c2395e3f046_1763239726.jpg'],
    "location": {
      "lat": 10.740571345995521, 
      "lng": 106.695219
    }
      
  },
  {
    "id": "r13",
    "title": "Phòng trọ Trường Chinh, Phường 15, Quận Tân Bình cho thuê",
    "rental_type": "Cho thuê phòng trọ",
    "date": "6/7/2025 19:14",
    "address": "Đường Trường Chinh, Phường 15, Quận Tân Bình, Hồ Chí Minh",
    "price": 3600000,
    "area": 40.0,
    "amenities": [
      "mez",
      "kit",
      "wm",
      "flxh",
      "elv",
      "parking"
    ],
    "landlordId": "L10",
    "description": "Phòng trọ Trường Chinh, Phường 15, Quận Tân Bình cho thuê\nPhòng Duplex\nToilet riêng\nGiờ giấc tự do\nCó máy giặt, bồn rửa chén, thang máy,...\nGiá thuê: 3.6 triệu/tháng",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/2025-11-12-053454-so-66-duong-dht-21_1763235160.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z5531127654338-614f73e7d1fb475ea251a4ae3aa2aa11_1763222297.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227514252295-79e685cd1bf6c3fe8836aadebed5c44e_1763214697.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227105678369-5cc11b9a4f1f6022f655ecdebd2df0d5_1763215857.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-9876_1763218884.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-2241_1763213723.jpg'],
    "location": {
      "lat": 10.817110305594575, 
      "lng": 106.6317433386311
    } 
  },

  {
    "id": "r14",
    "title": "Cho thuê nhà tại Thủ Đức 180m2, gần bến xe Miền Đông quận Bình Thạnh, TP. Hồ Chí Minh",
    "rental_type": "Cho thuê nhà",
    "date": "12/9/2025 8:48",
    "address": "Hẻm 59 Đường số 48, Phường Hiệp Bình Chánh, Thủ Đức, Hồ Chí Minh",
    "price": 15000000,
    "area": 180.0,
    "amenities": [
      "frn"
    ],
    "landlordId": "L11",
    "description": "Nhà cho thuê nguyên căn tại thành phố Thủ Đức, gần bến xe Miền Đông, quận Bình Thạnh. Diện tích sử dụng 180m2, 1PK, 1B, 4PN, 4 máy lạnh, giường, nệm, 3WC, bếp từ nấu ăn, bàn ăn, bàn làm việc, máy giặt, máy nước nóng, tủ lạnh, camera an ninh, wifi, nhà thoáng mát, 1 trệt + 1 lầu đúc, nội thất đẹp, tiện nghi, có thể kết hợp để ở và làm văn phòng Công ty. Nhà hẻm 59 đường số 48 (cạnh Cafe Kim Loan và sân Bóng đá Hoa Cà), khu phố 6, phường Hiệp Bình Chánh, TP. Thủ Đức (nay là phường Hiệp Bình, TP.HCM), gần nhà hàng Cá Sấu Hoa Cà, cách Bến xe Miền Đông quận Bình Thạnh và ĐH Luật 1,5km, gần ĐH Ngoại Thương, ĐH Giao thông Vận Tải HCM; Giá cho thuê 15 triệu/tháng. LH: 090 2324 266",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/2025-11-12-053454-so-66-duong-dht-21_1763235160.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z5531127654338-614f73e7d1fb475ea251a4ae3aa2aa11_1763222297.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227514252295-79e685cd1bf6c3fe8836aadebed5c44e_1763214697.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227105678369-5cc11b9a4f1f6022f655ecdebd2df0d5_1763215857.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-9876_1763218884.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-2241_1763213723.jpg'],
    "location": {
      "lat": 10.837139299958439, 
      "lng": 106.726149
    } 
  },
  {
    "id": "r15",
    "title": "Cho thuê nhà nguyên căn hẻm 205/1 đường Liên Khu 4-5, phường Bình Hưng Hòa B, quận Bình Tân, Tp Hồ Chí Minh",
    "rental_type": "Cho thuê nhà",
    "date": "2/5/2024 13:57",
    "address": "Hẻm 205/1 Đường Liên khu 4-5, Phường Bình Hưng Hòa B, Quận Bình Tân, Hồ Chí Minh",
    "price": 5500000,
    "area": 195.0,
    "amenities": [],
    "landlordId": "L12",
    "description": "Diện tích 4x14, nhà cấp 4, có gác đúc, hai nhà vệ sinh, nhà sạch sẽ, dân cư an toàn, thoáng mát. Gần trường học, gần chợ, thuận tiện cho gia đình 3-5 thành viên sinh sống, làm việc và học tập. Wifi tốc độ 250Mb có sẵn. Có mái hiên có thể để xe ô tô nhỏ.",
    "imageUrl": ['https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/16/2025-11-12-053454-so-66-duong-dht-21_1763235160.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z5531127654338-614f73e7d1fb475ea251a4ae3aa2aa11_1763222297.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227514252295-79e685cd1bf6c3fe8836aadebed5c44e_1763214697.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/z7227105678369-5cc11b9a4f1f6022f655ecdebd2df0d5_1763215857.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-9876_1763218884.jpg', 
      'https://pt123.cdn.static123.com/images/thumbs/450x300/fit/2025/11/15/img-2241_1763213723.jpg'],
    "location": {
      "lat": 10.797622715456821, 
      "lng": 106.58572266136888
    } 
  }
]

// FAVORITE (USER_ID, ROOM_ID, DATE)
export const FAVOURITES = [
]