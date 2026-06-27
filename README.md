📌 Nội dung buổi học: Buổi 8
Chủ đề: Kết nối Frontend - Backend (Tích hợp Axios & useEffect)

Đây là cột mốc quan trọng nhất trong việc chuyển đổi từ giao diện tĩnh sang ứng dụng Web động. Buổi học tập trung vào việc thiết lập kênh giao tiếp an toàn và hiệu quả giữa ReactJS (Client) và ASP.NET Core (Server).

🎯 Mục tiêu chuyên sâu
Hiểu sâu về Client-Server Architecture: Nắm vững cách Frontend thực hiện các Request HTTP tới API của Backend.

Xử lý vòng đời Component (React Lifecycle): Sử dụng Hook useEffect để kiểm soát thời điểm dữ liệu được nạp vào bộ nhớ.

Quản lý dữ liệu bất đồng bộ: Làm chủ Promise và async/await để xử lý các phản hồi từ server mà không làm treo giao diện.

Tối ưu hóa Axios: Cấu hình các thiết lập chung (Base URL, Headers) để code gọn gàng, dễ tái sử dụng.

🛠 Các bước triển khai chi tiết
Thiết lập thư viện:

Cài đặt Axios thông qua npm install axios --save.

Tạo file apiService.js hoặc cấu hình axios.create() để thiết lập baseURL trỏ tới địa chỉ API của Backend (ví dụ: https://localhost:xxxx/api).

Kỹ thuật Fetching dữ liệu với useEffect:

Lập trình logic để gọi API ngay khi component được khởi tạo (componentDidMount trong Functional Component).

Sử dụng dependency array [] để đảm bảo API chỉ gọi một lần duy nhất khi trang load, tránh tình trạng loop vô tận.

Quản lý trạng thái với useState:

Khởi tạo data state để lưu trữ danh sách bài viết nhận được từ server.

Khởi tạo loading state để hiển thị icon loading cho người dùng trong thời gian chờ đợi.

Khởi tạo error state để bắt và xử lý các tình huống lỗi như 404, 500 hoặc mất kết nối.

Hiển thị dữ liệu:

Áp dụng phương thức .map() để render danh sách bài viết từ state ra giao diện.

Kết hợp kỹ thuật Conditional Rendering để hiển thị thông báo "Không có bài viết" nếu danh sách trả về rỗng.

💡 Tại sao kỹ thuật này là "xương sống" của dự án?
Tách biệt Logic (Decoupling): Backend tập trung vào truy vấn Database và xử lý nghiệp vụ, Frontend chỉ tập trung vào hiển thị. Điều này giúp dự án dễ bảo trì và nâng cấp.

Tính ổn định: Việc xử lý lỗi (try-catch) trong các hàm gọi API giúp ứng dụng không bị crash khi Backend gặp sự cố hoặc dữ liệu không đúng định dạng.

Tối ưu hóa trải nghiệm (UX): Việc sử dụng loading spinner kết hợp với dữ liệu động tạo ra cảm giác chuyên nghiệp, giống với các ứng dụng thực tế trên thị trường.

💻 Mẫu code tham khảo
Dưới đây là cấu trúc cơ bản đã được áp dụng trong dự án:

JavaScript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts'); // Gọi đến Controller của Backend
        setPosts(res.data);
      } catch (err) {
        console.error("Lỗi kết nối Backend: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Đang tải dữ liệu từ Server...</div>;

  return (
    <div>
      {posts.map(post => <h3 key={post.id}>{post.title}</h3>)}
    </div>
  );
};
