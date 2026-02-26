# Tài Liệu Yêu Cầu Sản Phẩm - QLTSIT
## Quản Lý Tài Sản IT

## 1. Tổng Quan Sản Phẩm

**QLTSIT** là ứng dụng web đơn trang (SPA) hiện đại để quản lý tài sản IT bao gồm thiết bị phần cứng và giấy phép phần mềm. Hệ thống cung cấp giải pháp tập trung cho bộ phận IT để theo dõi, giám sát và quản lý toàn bộ vòng đời hạ tầng CNTT.

**Vấn đề:** Nhiều tổ chức sử dụng bảng tính Excel để theo dõi tài sản IT, dẫn đến kiểm kê không chính xác, bỏ lỡ gia hạn bảo hành, vi phạm bản quyền phần mềm và lãng phí ngân sách.

**Giải pháp:** Một ứng dụng SPA đẹp, nhanh, hoạt động offline, lưu trữ dữ liệu trong localStorage — không cần cài đặt server. Lý tưởng cho các đội IT vừa và nhỏ muốn bắt đầu ngay lập tức.

## 2. Mục Tiêu

- **Mục tiêu chính**: Cung cấp công cụ toàn diện, dễ sử dụng để theo dõi tất cả tài sản phần cứng và phần mềm IT
- **Thước đo thành công**: Tất cả tài sản được theo dõi với khả năng xem vòng đời đầy đủ, giám sát tuân thủ bản quyền
- **Điểm khác biệt**:
  - Không cần cài đặt (không server, không database — chạy trên trình duyệt)
  - Giao diện hiện đại, cao cấp, sáng màu chuyên nghiệp
  - Hỗ trợ tiếng Việt
  - Kiến trúc offline-first

## 3. Đối Tượng Sử Dụng

- **Quản lý IT**: Giám sát toàn bộ tài sản, cần dashboard tổng quan, báo cáo và phân tích
- **Nhân viên IT**: Quản lý tài sản hàng ngày, nhận/trả thiết bị, theo dõi bảo trì
- **Chủ doanh nghiệp nhỏ**: Cần theo dõi tài sản đơn giản mà không cần công cụ doanh nghiệp phức tạp

## 4. Tính Năng & Yêu Cầu

### Tính Năng Chính (MVP)
- [x] **F1: Bảng Điều Khiển (Dashboard)** — Tổng quan với KPI (tổng tài sản, đang dùng, bảo trì, thanh lý), biểu đồ (tài sản theo danh mục, phân bố trạng thái, hoạt động gần đây)
- [x] **F2: Quản Lý Phần Cứng** — CRUD đầy đủ với các trường: tên, mã tài sản, số serial, model, nhà sản xuất, danh mục, trạng thái, người sử dụng, vị trí, ngày mua, giá mua, hạn bảo hành, ghi chú
- [x] **F3: Quản Lý Phần Mềm** — CRUD đầy đủ với các trường: tên, phiên bản, mã bản quyền, loại bản quyền (vĩnh viễn/đăng ký/số lượng/OEM), tổng số ghế, đã dùng, nhà cung cấp, ngày mua, giá mua, ngày hết hạn, trạng thái, ghi chú
- [x] **F4: Quản Lý Danh Mục** — CRUD cho danh mục tài sản (Laptop, Desktop, Server, Màn hình, Máy in, Thiết bị mạng, Điện thoại, Tablet, Hệ điều hành, Ứng dụng văn phòng, Bảo mật, Cơ sở dữ liệu...)
- [x] **F5: Quản Lý Vị Trí** — CRUD cho vị trí (văn phòng, tòa nhà, trung tâm dữ liệu)
- [x] **F6: Báo Cáo** — Báo cáo có sẵn: Tài sản theo trạng thái, theo danh mục, theo vị trí, tuân thủ bản quyền, bảo hành sắp hết, khấu hao
- [x] **F7: Tìm Kiếm & Lọc** — Tìm kiếm toàn cục, lọc theo trạng thái/danh mục/vị trí
- [x] **F8: Xuất Dữ Liệu** — Xuất dữ liệu ra CSV
- [x] **F9: Lưu Trữ Dữ Liệu** — localStorage với Zustand middleware

### Tính Năng Bổ Sung (Sau MVP)
- [ ] Nhập từ CSV/Excel
- [ ] Tạo mã QR/Barcode cho tài sản
- [ ] Nhật ký kiểm tra / Lịch sử hoạt động
- [ ] Chuyển đổi ngôn ngữ (EN/VI)
- [ ] Chuyển đổi giao diện Tối/Sáng

## 5. Luồng Người Dùng

### Luồng chính — Thêm tài sản phần cứng
```
[Mở ứng dụng] → [Nhấn "Phần cứng" trên sidebar]
    → [Nhấn nút "+ Thêm tài sản"]
    → [Điền form: tên, mã, serial, model, danh mục, trạng thái, vị trí, người dùng]
    → [Nhấn "Lưu"]
    → [Tài sản hiển thị trong bảng]
    → [Có thể Sửa/Xóa/Xem từ cột hành động trong bảng]
```

### Luồng Dashboard
```
[Mở ứng dụng] → [Dashboard tải tự động]
    → [Xem thẻ KPI: Tổng Tài Sản, Đang Dùng, Bảo Trì, Thanh Lý]
    → [Xem Biểu Đồ: Tài sản theo Danh mục (tròn), Phân bố Trạng thái (cột)]
    → [Xem danh sách Hoạt Động Gần Đây]
    → [Nhấn vào bất kỳ số liệu → chuyển đến danh sách tài sản đã lọc]
```

### Luồng Bản quyền phần mềm
```
[Nhấn "Phần mềm" trên sidebar]
    → [Xem tất cả bản quyền trong bảng]
    → [Nhấn "+ Thêm Bản Quyền"]
    → [Điền: tên, phiên bản, mã, loại, số ghế, nhà cung cấp, ngày tháng]
    → [Lưu → hiển thị trong bảng]
    → [Trạng thái tuân thủ hiển thị với chỉ báo màu]
```

## 6. Wireframes

### Màn hình 1: Bảng Điều Khiển
```
┌──────────────────────────────────────────────────────────────┐
│  [☰]  QLTSIT                              [🔍] [👤]          │
├────────┬─────────────────────────────────────────────────────┤
│        │  Bảng Điều Khiển                                    │
│ 📊 TQ  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ 💻 PC  │  │Tổng  │ │Đang  │ │Bảo   │ │Thanh │              │
│ 📀 PM  │  │ 256  │ │Dùng  │ │Trì   │ │Lý   │              │
│ 📁 DM  │  │      │ │ 198  │ │  32  │ │  26  │              │
│ 📍 VT  │  └──────┘ └──────┘ └──────┘ └──────┘              │
│ 📋 BC  │                                                     │
│ ⚙️ CĐ  │  ┌─────────────────┐ ┌─────────────────┐          │
│        │  │ TS theo Loại    │ │ Phân bố TT      │          │
│        │  │ [Biểu đồ tròn] │ │ [Biểu đồ cột]   │          │
│        │  └─────────────────┘ └─────────────────┘          │
│        │                                                     │
│        │  Hoạt Động Gần Đây                                 │
│        │  ┌─────────────────────────────────────┐          │
│        │  │ ● Thêm Laptop Dell XPS 15  - 2h     │          │
│        │  │ ● Cập nhật Server-01       - 3h      │          │
│        │  │ ● Xóa máy in cũ           - 1 ngày  │          │
│        │  └─────────────────────────────────────┘          │
├────────┴─────────────────────────────────────────────────────┤
│  © 2025 QLTSIT                                               │
└──────────────────────────────────────────────────────────────┘
```

### Màn hình 2: Danh sách Phần Cứng
```
┌──────────────────────────────────────────────────────────────┐
│  [☰]  QLTSIT                              [🔍] [👤]          │
├────────┬─────────────────────────────────────────────────────┤
│        │  Tài Sản Phần Cứng              [+ Thêm Tài Sản]  │
│Sidebar │  ┌─────────────────────────────────────────────┐   │
│        │  │ Tìm: [____________] Trạng thái: [Tất cả ▾]│   │
│        │  │ Danh mục: [Tất cả ▾]  Vị trí: [Tất cả ▾] │   │
│        │  ├─────────────────────────────────────────────┤   │
│        │  │ Mã    │ Tên      │ TT    │ Vị Trí   │ ⚡  │   │
│        │  │ HW-001│ Dell XPS │ ĐDùng │ VP-T3    │ ✏🗑│   │
│        │  │ HW-002│ MacBook  │ ĐDùng │ VP-T2    │ ✏🗑│   │
│        │  │ HW-003│ HP Laser │ BTriì │ VP-T1    │ ✏🗑│   │
│        │  └─────────────────────────────────────────────┘   │
│        │  Hiển thị 1-10 / 45    [◀ 1 2 3 4 5 ▶]            │
├────────┴─────────────────────────────────────────────────────┤
│  © 2025 QLTSIT                                               │
└──────────────────────────────────────────────────────────────┘
```

### Màn hình 3: Form Thêm/Sửa Tài Sản
```
┌─────────────────────────────────────────┐
│  Thêm Tài Sản Phần Cứng            [X]│
├─────────────────────────────────────────┤
│  Tên tài sản:   [____________________] │
│  Mã tài sản:    [HW-XXX_____________]  │
│  Số serial:     [____________________]  │
│  Model:         [____________________]  │
│  Nhà sản xuất:  [____________________]  │
│  Danh mục:      [Chọn ▾_____________]  │
│  Trạng thái:    [◉Đang dùng ○BT ○TL]  │
│  Người dùng:    [Chọn ▾_____________]  │
│  Vị trí:        [Chọn ▾_____________]  │
│  Ngày mua:      [____/____/________]    │
│  Giá mua:       [____________________]  │
│  Hạn bảo hành:  [____/____/________]    │
│  Ghi chú:       [____________________]  │
│                 [____________________]  │
│                                         │
│         [Hủy]           [Lưu Tài Sản]  │
└─────────────────────────────────────────┘
```

## 7. Mô Hình Dữ Liệu

### Sơ Đồ Quan Hệ Thực Thể
```
┌──────────────┐       ┌──────────────┐
│  Danh Mục    │ 1───N │ Phần Cứng    │
│  (Category)  │       │(HardwareAsset│
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ name         │       │ name         │
│ type (HW/SW) │       │ assetTag     │
│ description  │       │ serialNumber │
│ createdAt    │       │ model        │
└──────────────┘       │ manufacturer │
                       │ categoryId   │──→ Category
┌──────────────┐       │ status       │
│  Vị Trí      │ 1───N │ assignedTo   │
│  (Location)  │       │ locationId   │──→ Location
├──────────────┤       │ purchaseDate │
│ id           │       │ purchaseCost │
│ name         │       │ warrantyExp  │
│ address      │       │ notes        │
│ building     │       │ createdAt    │
│ description  │       │ updatedAt    │
│ createdAt    │       └──────────────┘
└──────────────┘

┌──────────────┐
│ Phần Mềm     │
│(SoftwareAsset)│
├──────────────┤
│ id           │
│ name         │
│ version      │
│ licenseKey   │
│ licenseType  │   (vĩnh viễn/đăng ký/số lượng/OEM)
│ seatsTotal   │
│ seatsUsed    │
│ vendor       │
│ categoryId   │──→ Category
│ purchaseDate │
│ purchaseCost │
│ expirationDate│
│ status       │   (đang dùng/hết hạn/tạm ngưng)
│ notes        │
│ createdAt    │
│ updatedAt    │
└──────────────┘

┌──────────────┐
│  Nhân Viên   │
│  (Employee)  │
├──────────────┤
│ id           │
│ name         │
│ email        │
│ department   │
│ position     │
│ createdAt    │
└──────────────┘
```

### Chi Tiết Schema
- **Danh Mục (Category)**: id (uuid), name (string), type (enum: 'hardware'|'software'), description (string), createdAt (date)
- **Vị Trí (Location)**: id (uuid), name (string), address (string?), building (string?), description (string?), createdAt (date)
- **Phần Cứng (HardwareAsset)**: id (uuid), name, assetTag (tự sinh HW-XXX), serialNumber, model, manufacturer, categoryId (FK), status (enum: 'active'|'maintenance'|'retired'|'stored'), assignedTo (string), locationId (FK), purchaseDate, purchaseCost (number), warrantyExpiration, notes, createdAt, updatedAt
- **Phần Mềm (SoftwareAsset)**: id (uuid), name, version, licenseKey, licenseType (enum), seatsTotal (number), seatsUsed (number), vendor, categoryId (FK), purchaseDate, purchaseCost, expirationDate, status (enum: 'active'|'expired'|'suspended'), notes, createdAt, updatedAt
- **Nhân Viên (Employee)**: id (uuid), name, email, department, position, createdAt

## 8. Kiến Trúc Kỹ Thuật

### Sơ Đồ Hệ Thống
```
┌─────────────────────── Docker Compose ───────────────────────┐
│                                                               │
│  ┌────────────────┐    ┌────────────────┐   ┌─────────────┐ │
│  │  Frontend      │    │  Backend API   │   │ PostgreSQL  │ │
│  │  React + Vite  │◄──►│  Express.js    │◄─►│  Database   │ │
│  │  Port: 5173    │    │  Port: 3001    │   │  Port: 5432 │ │
│  └────────────────┘    └────────────────┘   └─────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Hạ Tầng Docker (docker-compose.yml)
| Dịch vụ  | Image          | Mục đích            | Cổng |
| -------- | -------------- | ------------------- | ---- |
| db       | postgres:16    | Cơ sở dữ liệu chính| 5432 |
| backend  | node:20-alpine | API REST            | 3001 |
| frontend | node:20-alpine | React SPA dev server| 5173 |

### Công Nghệ Sử Dụng

**Frontend:**
- **Ngôn ngữ**: TypeScript (strict mode)
- **Framework**: React 18 + Vite
- **Quản lý State**: Zustand — đồng bộ với Backend API
- **Giao diện**: Vanilla CSS với CSS custom properties
- **Điều hướng**: React Router v6
- **Biểu tượng**: Lucide React
- **Biểu đồ**: Recharts
- **Xử lý ngày**: date-fns

**Backend:**
- **Runtime**: Node.js 20 + Express.js
- **Ngôn ngữ**: TypeScript
- **ORM**: Prisma — type-safe, migration, seed
- **Database**: PostgreSQL 16
- **API**: REST JSON

### Cấu Trúc Dự Án
```
QLTSITv1/
├── docker-compose.yml
├── frontend/          (React SPA)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── services/  (API calls)
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── backend/           (Express API)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── Dockerfile
└── PRD.md
```

## 9. Hướng Dẫn UI/UX

### Bảng Màu (Giao Diện Sáng Chuyên Nghiệp)
```
--bg-primary:     #f8fafc        (Nền chính xám rất nhạt)
--bg-secondary:   #ffffff        (Nền thẻ/panel trắng)
--bg-tertiary:    #1e293b        (Nền sidebar xanh đậm chuyên nghiệp)
--bg-hover:       #f1f5f9        (Nền hover nhạt)
--accent-primary: #4F46E5        (Xanh indigo — hành động chính)
--accent-primary-light: #EEF2FF  (Nền nhạt cho accent)
--accent-success: #10b981        (Xanh lá — đang dùng, thành công)
--accent-success-light: #ecfdf5  (Nền nhạt cho thành công)
--accent-warning: #f59e0b        (Cam — bảo trì, cảnh báo)
--accent-warning-light: #fffbeb  (Nền nhạt cho cảnh báo)
--accent-danger:  #ef4444        (Đỏ — thanh lý, nguy hiểm)
--accent-danger-light: #fef2f2   (Nền nhạt cho nguy hiểm)
--accent-info:    #06b6d4        (Xanh cyan — lưu kho, thông tin)
--accent-info-light: #ecfeff     (Nền nhạt cho thông tin)
--text-primary:   #1e293b        (Chữ chính — xám đậm)
--text-secondary: #64748b        (Chữ phụ — xám trung)
--text-muted:     #94a3b8        (Nhãn mờ — xám nhạt)
--border:         #e2e8f0        (Viền nhạt)
--shadow:         0 1px 3px rgba(0,0,0,0.1)   (Bóng nhẹ)
--shadow-md:      0 4px 12px rgba(0,0,0,0.08)  (Bóng vừa)
```

### Typography
- **Font**: 'Inter', system-ui, sans-serif (Google Fonts)
- **Tiêu đề**: độ đậm 600-700, màu `--text-primary`
- **Nội dung**: độ đậm 400, kích thước cơ bản 14px
- **Font code**: 'JetBrains Mono' cho mã tài sản, số serial

### Thiết Kế Components
- Thẻ trắng nổi bật với bóng đổ tinh tế (box-shadow)
- Sidebar xanh đậm chuyên nghiệp tạo tương phản đẹp
- Bo góc (8px-12px)
- Chuyển động mượt (200ms ease)
- Hiệu ứng hover trên các phần tử tương tác (nền nhạt + bóng đổ)
- Badge trạng thái với nền màu nhạt + chữ đậm
- Form dialog dạng modal nền trắng
- Thông báo toast cho phản hồi
- Gradient nhẹ trên header KPI cards

### Breakpoints Responsive
- Máy tính: > 1024px (sidebar đầy đủ)
- Tablet: 768px-1024px (sidebar thu gọn)
- Di động: < 768px (menu hamburger)

## 10. Nguồn Tham Khảo
- Snipe-IT: ITAM mã nguồn mở — lấy cảm hứng từ theo dõi tài sản, nhận/trả, barcode
- GLPI: ITAM doanh nghiệp — lấy cảm hứng từ quản lý vòng đời, tích hợp ticket
- Mẫu thiết kế dashboard hiện đại — thẻ KPI, bố cục biểu đồ, thiết kế bảng
- Zustand persist middleware — mẫu đồng bộ localStorage cho SPA state
- Best practices schema ITAM — phương pháp bảng chung + bảng con cho các loại tài sản
