📌 Nội dung buổi học: Buổi 7
Chủ đề: Nhập môn ReactJS - Thay đổi tư duy từ Server-side sang Client-side Rendering

Đây là buổi học "bản lề" giúp thay đổi hoàn toàn cách chúng ta xây dựng giao diện ứng dụng. Thay vì để Server tạo ra các trang HTML hoàn chỉnh như các View trong MVC, chúng ta sẽ chuyển sang việc xây dựng các "mảnh ghép" giao diện độc lập trên trình duyệt của người dùng.

🎯 Mục tiêu chuyên sâu
Xây dựng tư duy Component-based: Chia nhỏ giao diện phức tạp thành các Component nhỏ, dễ tái sử dụng và quản lý.

Mastering JSX: Làm quen với cú pháp JSX - sự kết hợp mạnh mẽ giữa JavaScript và HTML.

Luồng dữ liệu (Data Flow): Hiểu cách truyền dữ liệu giữa các thành phần thông qua Props (truyền từ cha xuống con) và quản lý trạng thái nội bộ thông qua State.

Cài đặt môi trường: Thiết lập thành công hệ sinh thái Node.js/NPM để làm việc chuyên nghiệp với các thư viện JavaScript.

🛠 Nội dung thực hiện
Thiết lập môi trường: Cài đặt Node.js và khởi tạo dự án React bằng Vite (hoặc create-react-app) để tối ưu tốc độ build.

Cấu trúc Component: Tạo các Component đầu tiên (Header, Footer, PostCard). Hiểu cách import/export các module trong React.

JSX - JavaScript XML: Học cách viết HTML ngay trong file .js, sử dụng các biểu thức JavaScript (curly braces {}) để render dữ liệu động.

Props (Properties): Truyền dữ liệu tĩnh từ Component cha xuống các Component con (ví dụ: truyền tiêu đề, nội dung, hình ảnh bài viết vào Card).

State (Trạng thái): Sử dụng useState để quản lý các dữ liệu thay đổi theo tương tác của người dùng, giúp giao diện phản hồi tức thì mà không cần load lại trang.

💡 Tại sao phải thay đổi tư duy sang Client-side Rendering (CSR)?
Tách biệt hoàn toàn: Backend chỉ đóng vai trò cung cấp dữ liệu (dưới dạng JSON API), trong khi Frontend chịu trách nhiệm hoàn toàn về trải nghiệm hiển thị. Điều này giúp dự án trở nên linh hoạt hơn rất nhiều.

Tốc độ & Trải nghiệm: Khi đã tải xong bundle JavaScript ban đầu, việc chuyển đổi giữa các giao diện trở nên cực nhanh. Người dùng không còn cảm thấy sự giật lag mỗi khi click chuột do không phải đợi Server phản hồi toàn bộ trang mới.

Tái sử dụng (Reusability): Bạn chỉ cần viết một Component Card một lần và có thể sử dụng lại ở bất cứ đâu trong toàn bộ dự án, giúp code cực kỳ sạch sẽ và dễ bảo trì.

💻 Mẫu ví dụ về Component (PostCard)
Để minh họa cho buổi 7, đây là cách chúng ta tạo một thành phần bài viết:

JavaScript
// PostCard.jsx
const PostCard = ({ title, summary }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{summary}</p>
      <button onClick={() => alert("Đã click vào bài viết!")}>Xem chi tiết</button>
    </div>
  );
};

export default PostCard;
