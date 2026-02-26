# Kế Hoạch Triển Khai - QLTSIT (Quản Lý Tài Sản IT)

## Giai Đoạn 1: Khởi Tạo Dự Án & Docker
- [ ] Tạo `docker-compose.yml` (PostgreSQL 16 + Backend + Frontend)
- [ ] Tạo `backend/Dockerfile` + `frontend/Dockerfile`
- [ ] Khởi tạo backend: Node.js + Express + TypeScript
- [ ] Cài đặt backend: express, prisma, cors, dotenv
- [ ] Tạo Prisma schema (Category, Location, Employee, HardwareAsset, SoftwareAsset)
- [ ] Tạo migration + seed data
- [ ] Khởi tạo frontend: Vite + React + TypeScript
- [ ] Cài đặt frontend: zustand, react-router-dom, recharts, lucide-react, date-fns
- [ ] Chạy `docker-compose up -d` — kiểm tra tất cả services hoạt động

## Giai Đoạn 2: Backend API
- [ ] CRUD API: `/api/categories` (GET, POST, PUT, DELETE)
- [ ] CRUD API: `/api/locations` (GET, POST, PUT, DELETE)
- [ ] CRUD API: `/api/employees` (GET, POST, PUT, DELETE)
- [ ] CRUD API: `/api/hardware` (GET, POST, PUT, DELETE) + tìm kiếm/lọc
- [ ] CRUD API: `/api/software` (GET, POST, PUT, DELETE) + tìm kiếm/lọc
- [ ] API: `/api/dashboard` (thống kê KPI, biểu đồ)
- [ ] API: `/api/reports` (báo cáo theo trạng thái, danh mục, bảo hành...)
- [ ] API: `/api/export` (xuất CSV)

## Giai Đoạn 3: Frontend - Hệ Thống Thiết Kế & Nền Tảng
- [ ] CSS design system (giao diện sáng, CSS custom properties, component classes)
- [ ] TypeScript types/interfaces
- [ ] API service layer (`services/api.ts`)
- [ ] Layout component (sidebar + nội dung + header)
- [ ] Sidebar điều hướng
- [ ] Reusable DataTable (sắp xếp, phân trang, hành động)
- [ ] Modal, StatusBadge, KPICard, Toast, ConfirmDialog

## Giai Đoạn 4: Frontend - Zustand Store
- [ ] Zustand store gọi API backend (không dùng localStorage)
- [ ] Store: phần cứng, phần mềm, danh mục, vị trí, nhân viên
- [ ] Loading states + error handling

## Giai Đoạn 5: Frontend - Các Trang Chức Năng
- [ ] Bảng Điều Khiển (KPI, PieChart, BarChart, Hoạt Động Gần Đây)
- [ ] Tài Sản Phần Cứng (bảng, bộ lọc, modal, xuất CSV)
- [ ] Tài Sản Phần Mềm (bảng, bộ lọc, tuân thủ bản quyền, xuất CSV)
- [ ] Danh Mục (lưới thẻ, lọc loại, số tài sản)
- [ ] Vị Trí (thẻ/bảng, số tài sản)
- [ ] Báo Cáo (báo cáo có sẵn + biểu đồ + xuất CSV)
- [ ] Cài Đặt (xuất/nhập/xóa dữ liệu)

## Giai Đoạn 6: Hoàn Thiện & Tích Hợp
- [ ] React Router cấu hình tất cả routes
- [ ] Kiểm tra responsive
- [ ] Tìm kiếm toàn cục
- [ ] Tự động sinh mã tài sản (HW-001, SW-001)

---

## ⚠️ NHẮC NHỞ CHECKPOINT
**Khi TẤT CẢ tác vụ trên được đánh dấu [x]:**
1. ✅ Báo cáo "Giai đoạn Coding Hoàn tất"
2. 📝 Tạo TEST_PLAN.md
3. ⛔ **DỪNG LẠI và chờ Human xem lại TEST_PLAN.md**
4. Chỉ chạy test SAU KHI Human phê duyệt

---

## Nhật Ký Tiến Độ
| Ngày       | Giai Đoạn  | Trạng Thái  | Ghi Chú                                  |
| ---------- | ---------- | ----------- | ----------------------------------------- |
| 2026-02-26 | Lập kế hoạch | Đang cập nhật | Thêm Docker + PostgreSQL + Express backend |
