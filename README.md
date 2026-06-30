# 🌿 Trang CMS - Hệ Thống Quản Trị Cửa Hàng Mỹ Phẩm Thiên Nhiên (Cỏ Mềm)

## 📑 Mục lục
1. [Giới thiệu dự án](#1-giới-thiệu-dự-án)
2. [Cấu trúc hệ thống](#2-cấu-trúc-hệ-thống)
3. [Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
4. [Các phân hệ API chính](#4-các-phân-hệ-api-chính)
5. [Triển khai gRPC nâng cao](#5-triển-khai-grpc-nâng-cao)
6. [Cấu hình bảo mật](#6-cấu-hình-bảo-mật)
7. [Hướng dẫn cài đặt](#7-hướng-dẫn-cài-đặt)
8. [Cấu trúc thư mục dự án](#8-cấu-trúc-thư-mục-dự-án)
9. [Hướng dẫn dành cho Quản trị viên](#9-hướng-dẫn-dành-cho-quản-trị-viên)
10. [Nhật ký thực hiện (Changelog)](#10-nhật-ký-thực-hiện)
11. [Thông tin tác giả](#11-thông-tin-tác-giả)

---

## 1. Giới thiệu dự án
Dự án **Trang CMS - CoMem** là hệ thống quản trị chuyên sâu được phát triển cho thương hiệu mỹ phẩm thiên nhiên Cỏ Mềm. Hệ thống giúp đơn giản hóa việc quản lý danh mục sản phẩm (Dầu gội, Skincare, Sáp em bé...), theo dõi tồn kho và xử lý đơn hàng chuyên nghiệp.

## 2. Cấu trúc hệ thống
Hệ thống vận hành theo mô hình phân lớp hiện đại:
* **Frontend:** ReactJS (Single Page Application) đảm bảo tốc độ.
* **Backend:** ASP.NET Core 8 Web API đảm bảo hiệu năng xử lý nghiệp vụ.
* **Database:** SQL Server quản lý dữ liệu tập trung.

## 3. Công nghệ sử dụng
### 3.1 Backend
* .NET 8.0, Web API, gRPC, Entity Framework Core.
* Swagger UI để tài liệu hóa và kiểm thử API.
* JWT cho xác thực người dùng.

### 3.2 Frontend
* React 18, Vite, Axios Client (tối ưu hóa qua Interceptors).
* Tailwind CSS / Bootstrap để làm đẹp giao diện.

## 4. Các phân hệ API chính
Hệ thống bao gồm các phân hệ sau:
* **Auth:** Đăng ký, đăng nhập, phân quyền Role-based (Admin, Editor, User).
* **Product:** Quản lý sản phẩm, phân trang, tìm kiếm theo tên và thành phần thiên nhiên.
* **Order:** Xử lý giỏ hàng, tích hợp thanh toán VNPay, kiểm tra tồn kho (Stock validation).
* **Post:** Quản lý bài viết blog kiến thức Skincare.

## 5. Triển khai gRPC nâng cao
Trong buổi 10, hệ thống được nâng cấp để hỗ trợ giao tiếp tốc độ cao:
* **Protocol Buffers:** Sử dụng định dạng nhị phân (.proto) để tối ưu dung lượng truyền tải.
* **Lợi ích:** Giảm độ trễ khi gọi dịch vụ nội bộ so với chuẩn JSON/REST truyền thống.

## 6. Cấu hình bảo mật
* **CORS:** Cấu hình AllowAll cho phép giao tiếp giữa Frontend (port 5173) và Backend (port 7064).
* **403 Forbidden:** Cơ chế phân quyền ngăn chặn tài khoản không có quyền Admin can thiệp vào dữ liệu hệ thống.

## 7. Hướng dẫn cài đặt
### Bước 1: Chuẩn bị
* Cài đặt .NET 8.0 SDK, Node.js v18+.
* Cài đặt SQL Server.

### Bước 2: Thiết lập Backend
1. Mở `CMS.Backend.sln`.
2. Mở file `appsettings.json`, chỉnh sửa Connection String của bạn.
3. Chạy lệnh: `dotnet ef database update`.

### Bước 3: Thiết lập Frontend
1. Truy cập folder `cms.frontend`.
2. Chạy `npm install`.
3. Chạy `npm run dev`.

## 8. Cấu trúc thư mục dự án
```text
TrangCMS_Solution/
├── CMS.Backend/            # Backend API (ASP.NET Core)
│   ├── Controllers/        # Xử lý các nghiệp vụ API
│   ├── Entities/           # Các Model dữ liệu (Product, Order...)
│   ├── Data/               # Kết nối CSDL (DbContext)
│   └── Protos/             # Các file gRPC service (.proto)
├── cms.frontend/           # Frontend (ReactJS)
│   ├── src/
│   │   ├── api/            # Cấu hình axiosClient
│   │   ├── components/     # UI components
│   │   └── pages/          # Các trang chính (Trang chủ, Admin)
└── README.md

9. Hướng dẫn dành cho Quản trị viên
Thêm sản phẩm: Truy cập menu "Quản lý sản phẩm" -> "Thêm mới" -> Nhập tên sản phẩm, giá tiền, số lượng tồn kho -> Lưu.

Duyệt đơn hàng: Vào menu "Quản lý đơn hàng" -> Xem trạng thái (Đang xử lý/Đã giao) -> Cập nhật.

10. Nhật ký thực hiện (Changelog)
Buổi 1-4: Thiết kế CSDL và khung API.

Buổi 5-8: Tích hợp giao diện Frontend và logic giỏ hàng.

Buổi 9: Hoàn thiện kiểm tra tồn kho, fix lỗi hiển thị.

Buổi 10: Triển khai gRPC nâng cao, tổng kết đồ án.

11. Thông tin tác giả
Sinh viên: Lê Nguyễn Thùy Trang

MSSV: 2123110130
Ngày cập nhật: 2026-06-30
