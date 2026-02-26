# QLTSIT — Quản Lý Tài Sản IT

Hệ thống quản lý tài sản CNTT chuyên nghiệp, xây dựng với kiến trúc full-stack Docker.

![Dashboard](https://img.shields.io/badge/Status-Active-success) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blueviolet)

## 📸 Screenshots

### Bảng Điều Khiển
> KPI tổng quan, biểu đồ phân bố tài sản, hoạt động gần đây

### Quản Lý Phần Cứng
> Bảng CRUD đầy đủ: tìm kiếm, lọc trạng thái/danh mục/vị trí, phân trang, xuất CSV

### Quản Lý Phần Mềm
> Theo dõi bản quyền, compliance bar hiển thị % sử dụng, cảnh báo hết hạn

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (bắt buộc)

### Khởi Chạy
```bash
git clone https://github.com/<your-username>/QLTSITv1.git
cd QLTSITv1
docker compose up --build -d
```

### Truy Cập
| Dịch vụ | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001/api |
| Database | localhost:5432 |

> Dữ liệu mẫu sẽ được tự động seed khi khởi chạy lần đầu.

## 🏗️ Kiến Trúc

```
┌─────────────── Docker Compose ───────────────┐
│                                               │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ React    │  │ Express  │  │ PostgreSQL │  │
│  │ :5173    │─▶│ :3001    │─▶│ :5432      │  │
│  │ Vite SPA │  │ Prisma   │  │ 16-Alpine  │  │
│  └──────────┘  └──────────┘  └────────────┘  │
└───────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 18 · TypeScript · Vite · Zustand · Recharts · Lucide |
| Backend | Express.js · Prisma ORM · TypeScript |
| Database | PostgreSQL 16 |
| Infra | Docker Compose |
| Styling | Vanilla CSS (Professional Light Theme) |

## 📁 Cấu Trúc Dự Án

```
QLTSITv1/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma      # 5 data models
│   │   └── seed.ts            # Sample data (28 assets)
│   └── src/
│       ├── index.ts           # Express server
│       └── routes/            # 7 API routes
│           ├── categories.ts
│           ├── locations.ts
│           ├── employees.ts
│           ├── hardware.ts
│           ├── software.ts
│           ├── dashboard.ts
│           └── reports.ts
├── frontend/
│   ├── Dockerfile
│   └── src/
│       ├── index.css          # Design system (600+ lines)
│       ├── App.tsx            # Router + Layout
│       ├── types/             # TypeScript interfaces
│       ├── services/          # API client
│       ├── stores/            # Zustand state
│       ├── components/        # Sidebar, Toast
│       └── pages/             # 7 pages
│           ├── Dashboard.tsx
│           ├── HardwareAssets.tsx
│           ├── SoftwareAssets.tsx
│           ├── Categories.tsx
│           ├── Locations.tsx
│           ├── Reports.tsx
│           └── Settings.tsx
└── README.md
```

## ✨ Tính Năng Chính

- **Dashboard** — KPI cards, biểu đồ tròn/cột, hoạt động gần đây
- **Phần Cứng** — CRUD đầy đủ, tìm kiếm, lọc đa tiêu chí, mã tự động
- **Phần Mềm** — Quản lý bản quyền, compliance bars, cảnh báo hết hạn
- **Danh Mục** — Phân loại phần cứng/phần mềm, bảo vệ khi xóa
- **Vị Trí** — Quản lý tòa nhà, văn phòng, data center
- **Báo Cáo** — Biểu đồ tổng hợp, tuân thủ bản quyền, xuất CSV
- **Responsive** — Hoạt động tốt trên desktop & tablet

## 📄 License

MIT
