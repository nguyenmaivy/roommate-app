# PROJECT 1 - ROOMMATE
## 🏠 RoomMate - Ứng Dụng Tìm Phòng Trọ/Ghép Phòng Serverless Hiện Đại

**RoomMate** là một ứng dụng tìm kiếm phòng trọ và ghép phòng trọ (**Roommate Matching**) được xây dựng trên kiến trúc **Serverless** (AWS Lambda, API Gateway, DynamoDB) và **Next.js** hiện đại. Dự án được thiết kế theo mô hình **Monorepo** để quản lý hiệu quả **Backend**, **Frontend**, **Infrastructure as Code (IaC)** và **Automation**.

-----
## ✨ Tính Năng Chính (Core Features)

| Danh mục        | Tính năng                                                                                 | Công nghệ liên quan                   |
| :-------------- | :---------------------------------------------------------------------------------------- | :------------------------------------ |
| **Tìm kiếm**    | **Tìm kiếm nâng cao & Lọc** theo giá, quận, tiện nghi.                                    | AWS Lambda, DynamoDB                  |
|                 | **Bản đồ tương tác** tích hợp **Geocoding** (Mapbox GL).                                  | Next.js, Mapbox GL                    |
| **Giao tiếp**   | **Chat Mini** giữa người tìm phòng và chủ trọ.                                            | AWS Lambda, DynamoDB                  |
|                 | **Quản lý Yêu thích (Favorite)**.                                                         | AWS Lambda, DynamoDB                  |
| **Chủ trọ**     | **Đăng tin phòng** (CRUD) với tọa độ bản đồ.                                              | Next.js, AWS Lambda                   |
|                 | **Dashboard thống kê** (views, chats).                                                    | Next.js                               |
| **Tự động hóa** | **Workflow tự động** (thông báo phòng mới, báo cáo hàng tuần) qua **n8n**.                | n8n, SNS/Telegram                     |
| **Dữ liệu**     | **Data Pipeline** (DynamoDB $\rightarrow$ S3 $\rightarrow$ Athena) cho phân tích dữ liệu. | AWS Data Pipeline, Athena, QuickSight |

-----

## 🛠️ Ngăn Xếp Công Nghệ (Tech Stack)

### 1\. Kiến Trúc (Architecture)

  * **Mô hình:** Serverless Monorepo
  * **IaC (Infrastructure as Code):** AWS Serverless Application Model (SAM)

### 2\. Backend (Serverless)

  * **Ngôn ngữ:** Node.js
  * **Compute:** AWS Lambda
  * **API Gateway:** AWS API Gateway
  * **Database:** AWS DynamoDB (NoSQL)
  * **External Services:** Mapbox Geocoding, n8n

### 3\. Frontend (Web App)

  * **Framework:** Next.js (App Router)
  * **Styling:** Tailwind CSS
  * **Mapping:** Mapbox GL
  * **Auth:** AWS Amplify (cho Cognito)
  * **Testing:** Cypress (E2E Tests)

### 4\. CI/CD & DevOps

  * **Version Control:** Git / GitHub
  * **CI/CD:** GitHub Actions (tự động deploy Frontend $\rightarrow$ S3 và Backend $\rightarrow$ SAM Stack)

-----

## 🏗️ Cấu Trúc Dự Án (Folder Structure)

roommate-app/
├── backend/                  # Backend serverless (Lambda functions)
│   ├── lambda/               # Các handler Lambda
│   │   ├── roomCrud.js       # CRUD phòng + geocoding (Mapbox)
│   │   ├── searchRooms.js    # Tìm kiếm & lọc (price, district, distance)
│   │   ├── chatMessage.js    # Xử lý chat mini
│   │   ├── favorite.js       # Quản lý favorite
│   │   └── userProfile.js    # Profile user (preferences)
│   ├── package.json          # Dependencies: aws-sdk, node-fetch, uuid
│   └── tests/                # Unit tests (Jest: test CRUD)
│
├── frontend/                 # Frontend Next.js (App Router)
│   ├── app/                  # Pages (Next.js 13+)
│   │   ├── layout.js         # Root layout + providers (Auth, Theme)
│   │   ├── page.js           # Home page (intro)
│   │   ├── search/           # Page tìm kiếm
│   │   │   └── page.js       # Với filters, map, list rooms
│   │   ├── post-room/        # Page đăng tin (chủ trọ)
│   │   │   └── page.js
│   │   ├── chat/             # Page chat room
│   │   │   └── page.js
│   │   └── dashboard/        # Dashboard chủ trọ (stats)
│   ├── components/           # Reusable components
│   │   ├── RoomMap.js        # Mapbox integration
│   │   ├── ChatModal.js      # Modal chat
│   │   ├── RoomCard.js       # Card hiển thị phòng (list view)
│   │   └── Navbar.js         # Nav với auth
│   ├── api/                  # API routes proxy (Next.js)
│   │   └── proxy/            # Proxy đến API Gateway
│   ├── public/               # Static assets (icons, default images)
│   ├── styles/               # globals.css + Tailwind config
│   ├── .env.local            # Env: NEXT_PUBLIC_MAPBOX_TOKEN, API_URL
│   ├── next.config.js        # Config: images, env
│   ├── package.json          # Dependencies: mapbox-gl, aws-amplify, react-hook-form
│   └── tests/                # E2E tests (Cypress)
│
├── infrastructure/           # IaC - AWS SAM cho serverless
│   ├── template.yaml         # Define API Gateway, Lambda, DynamoDB (optional create)
│   ├── samconfig.toml        # Deploy config
│   └── scripts/              # deploy.sh (sam build && sam deploy)
│
├── automation/               # n8n workflows
│   ├── workflows/            # JSON exports
│   │   ├── new-room-notification.json  # Gửi email/Telegram
│   │   ├── weekly-report.json          # Báo cáo views cho chủ trọ
│   │   └── ai-suggest.json             # Gợi ý phòng với ChatGPT/HuggingFace
│   └── n8n-docker-compose.yml # Để run local n8n
│
├── data-pipeline/            # Scripts cho stats
│   ├── export-dynamodb-s3.py # AWS Data Pipeline script (Python)
│   ├── athena-queries.sql    # SQL: AVG price by district
│   └── quicksight-dashboard.json # Config visualize
│
├── .github/                  # CI/CD
│   └── workflows/            # GitHub Actions
│       ├── deploy-frontend.yml  # Build Next.js & sync S3
│       └── deploy-backend.yml   # SAM deploy Lambda
│
├── docs/                     # Tài liệu
│   ├── architecture.md       # Diagram (AWS icons)
│   └── setup-guide.md        # Hướng dẫn setup
│
├── .gitignore                # Ignore node_modules, .env, builds
├── package.json              # Root (nếu monorepo với workspaces)
├── README.md                 # Overview project, run instructions
└── LICENSE                   # MIT hoặc tương tự

-----

## 🚀 Hướng Dẫn Thiết Lập (Getting Started)

### Điều kiện tiên quyết (Prerequisites)

  * Node.js (v18+) & npm
  * AWS CLI & SAM CLI
  * Docker (để chạy n8n local)

### 1\. Backend & Infrastructure (SAM Deploy)

1.  **Cài đặt Dependencies:**
    ```bash
    cd backend
    npm install
    ```
2.  **Định nghĩa hạ tầng:** Kiểm tra và cấu hình `infrastructure/template.yaml`.
3.  **Build và Deploy:**
    ```bash
    cd infrastructure
    sam build
    sam deploy --guided  # Triển khai Lambda, API Gateway, DynamoDB lên AWS
    ```
4.  Ghi lại **API Gateway Endpoint URL** sau khi deploy.

### 2\. Frontend (Next.js)

1.  **Cài đặt Dependencies:**
    ```bash
    cd frontend
    npm install
    ```
2.  **Cấu hình biến môi trường:** Tạo file `.env.local` trong thư mục `frontend/` và điền các giá trị:
    ```
    # Lấy từ Mapbox Account
    NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
    # API Gateway Endpoint từ bước deploy SAM
    NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com/Prod
    ```
3.  **Chạy Local:**
    ```bash
    npm run dev
    # Truy cập http://localhost:3000
    ```

### 3\. Automation (n8n)

1.  **Khởi động n8n:**
    ```bash
    docker-compose -f automation/n8n-docker-compose.yml up -d
    ```
2.  Tru cập n8n UI, import các workflow JSON từ thư mục `automation/workflows/`.

-----

## 📈 Tính Năng Mở Rộng Tiềm Năng (Future Development)

1.  **Review & Rating System:** Cho phép người dùng đánh giá phòng trọ và chủ trọ để tăng tính minh bạch.
2.  **AI Gợi Ý Nâng Cao:** Tích hợp **OpenAI/HuggingFace** qua n8n hoặc Lambda để gợi ý phòng trọ phù hợp nhất dựa trên lịch sử và sở thích của người dùng.
3.  **Tích Hợp Thanh Toán:** Thêm cổng thanh toán (Momo/VNPay) để chủ trọ đăng tin Premium hoặc sinh viên đặt cọc phòng.
4.  **Ghép Phòng (Roommate Matching):** Logic tìm kiếm phức tạp hơn để ghép nối các sinh viên có nhu cầu ở ghép.

-----
