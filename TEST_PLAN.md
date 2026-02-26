# KẾ HOẠCH KIỂM TRA - QLTSIT

## Kiểm Tra Đã Thực Hiện ✅
| Kiểm tra | Kết quả |
|----------|---------|
| Frontend `tsc --noEmit` | ✅ Không lỗi |
| Backend `tsc --noEmit` | ✅ Không lỗi |
| Frontend `vite build` | ✅ Build thành công (3.82s) |
| Backend `prisma generate` | ✅ Client generated |

## Kiểm Tra Docker (Cần Docker Desktop)
1. **Khởi động Docker Desktop**
2. Chạy `docker compose up --build -d` tại `d:\WEB\QLTSITv1`
3. Chờ DB healthy → Backend migrate + seed → Frontend dev server

### Kiểm tra dịch vụ
| Dịch vụ | URL | Kỳ vọng |
|---------|-----|---------|
| DB | `localhost:5432` | PostgreSQL chạy |
| Backend | `localhost:3001/api/health` | `{"status":"ok"}` |
| Frontend | `localhost:5173` | Giao diện QLTSIT |

## Kiểm Tra Chức Năng (Trên Trình Duyệt)

### TC-01: Dashboard
- Mở `localhost:5173` → thấy sidebar + dashboard
- KPI cards hiển thị đúng số liệu
- Biểu đồ Pie/Bar chart render
- Hoạt động gần đây hiển thị

### TC-02: Phần Cứng (CRUD)
- Nhấn "Phần Cứng" → bảng danh sách
- Tìm kiếm → lọc theo từ khóa
- Lọc trạng thái/danh mục/vị trí
- "Thêm Tài Sản" → form modal, điền, lưu → thấy trong bảng
- Sửa 1 tài sản → xác nhận thay đổi
- Xóa 1 tài sản → xác nhận → biến mất khỏi bảng
- Xuất CSV → file tải về

### TC-03: Phần Mềm (CRUD)
- Tương tự TC-02 nhưng cho bản quyền phần mềm
- Thanh tuân thủ (compliance bar) hiển thị đúng %
- Badge loại bản quyền đúng màu

### TC-04: Danh Mục
- Lưới thẻ hiển thị, lọc phần cứng/phần mềm
- Thêm/sửa/xóa danh mục
- Xóa danh mục có tài sản → báo lỗi

### TC-05: Vị Trí
- Lưới thẻ hiển thị tòa nhà + địa chỉ
- Thêm/sửa/xóa vị trí
- Xóa vị trí có tài sản → báo lỗi

### TC-06: Báo Cáo
- Biểu đồ trạng thái + danh mục + vị trí render
- Bảng giá trị + tuân thủ bản quyền hiển thị
- Cảnh báo bảo hành sắp hết
- Xuất CSV hoạt động

### TC-07: Responsive
- Thu nhỏ cửa sổ < 768px → menu hamburger
- Sidebar ẩn/hiện khi nhấn toggle

### TC-08: Toast Notifications
- Thêm/sửa/xóa tài sản → toast thông báo
- Toast tự biến mất sau 3.5s
