📌 Nội dung buổi học: Buổi 9
Chủ đề: Routing & Trang chi tiết bài viết

Trong buổi này, dự án tập trung vào việc xử lý điều hướng người dùng và hiển thị dữ liệu chi tiết cho từng bài viết cụ thể.

🎯 Mục tiêu
Hiểu và áp dụng React Router Dom để quản lý các tuyến đường (routes) trong ứng dụng React.

Xây dựng cơ chế truyền và lấy ID bài viết thông qua URL (params).

Triển khai trang chi tiết bài viết dựa trên ID được chọn.

🛠 Nội dung thực hiện
React Router Dom: Cấu hình các Route để chuyển đổi giữa trang danh sách bài viết và trang chi tiết mà không cần tải lại toàn bộ trang (trải nghiệm SPA).

Truyền tham số (Dynamic Routing): Sử dụng useParams để bắt ID từ URL, từ đó truy vấn dữ liệu chi tiết của bài viết tương ứng.

Chức năng thực hành:

Tạo liên kết tại tiêu đề bài viết ở danh sách bài viết.

Khi người dùng nhấp vào tiêu đề, ứng dụng sẽ điều hướng đến trang /post/:id và hiển thị đầy đủ nội dung bài viết đó.

💡 Tại sao cần Routing trong dự án?
Việc áp dụng Routing giúp website của chúng ta:

Hoạt động mượt mà: Chuyển trang tức thì mà không cần load lại toàn bộ tài nguyên (CSS, JS, Header/Footer không bị reload).

Trải nghiệm SPA: Giả lập trải nghiệm như một ứng dụng di động (App-like), tăng tốc độ tương tác.

Tối ưu SEO & SEO-friendly URL: URL rõ ràng, dễ hiểu giúp người dùng và công cụ tìm kiếm dễ dàng truy cập vào các tài nguyên cụ thể.

📂 Cấu trúc dự án
CMS.Backend: API xử lý dữ liệu.

CMS.Data: Tầng truy cập dữ liệu (Entity Framework).

cms.frontend: Giao diện người dùng React (Sử dụng React Router).

🚀 Cách cài đặt & Chạy dự án
Clone repo: git clone <URL_REPO_CỦA_BẠN>

Backend: Mở TrangCMS_Solution.sln trong Visual Studio và chạy dự án.

Frontend: Di chuyển vào thư mục cms.frontend, cài đặt thư viện và chạy:

Bash
npm install
npm start

Cập nhật bởi: ThuyTrang28
