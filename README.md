📌 Nội dung buổi học: Buổi 5
Chủ đề: Validation & Identity - Xây dựng nền móng bảo mật

Trong bất kỳ hệ thống quản trị nội dung (CMS) nào, việc kiểm soát ai được phép truy cập và dữ liệu nào được phép lưu vào Database là yếu tố sống còn. Buổi học này cung cấp các "chốt chặn" an toàn cho ứng dụng của bạn.

🎯 Mục tiêu chuyên sâu
Đảm bảo tính toàn vẹn của dữ liệu (Data Integrity): Sử dụng Validation để ngăn chặn dữ liệu rác hoặc dữ liệu sai định dạng xâm nhập vào Database.

Quản trị người dùng (Identity): Nắm vững hệ thống xác thực (Authentication) và phân quyền (Authorization) của ASP.NET Core Identity.

Tư duy bảo mật: Bảo vệ các API và các trang quản trị không bị truy cập trái phép.

🛠 Nội dung thực hiện
Data Annotations: Áp dụng các thuộc tính (Attributes) như [Required], [StringLength], [EmailAddress] trực tiếp trên các Model C#. Điều này giúp tự động kiểm tra dữ liệu phía Backend trước khi lưu vào Database.

ASP.NET Core Identity:

Cấu hình hệ thống Identity để quản lý User, Role, và Login session.

Thiết lập quy trình Đăng nhập (Login) cho Admin để truy cập vào các chức năng quản trị.

Phân quyền truy cập (Authorization): Sử dụng [Authorize] trên các Controller hoặc Action để đảm bảo rằng chỉ người dùng đã đăng nhập hoặc có quyền "Admin" mới được phép thực hiện các thao tác thêm, sửa, xóa bài viết.

Xử lý phía Client: Kết hợp với validation trên giao diện để đưa ra cảnh báo kịp thời cho người dùng (ví dụ: "Tên bài viết không được để trống").

💡 Tại sao Validation & Identity là không thể thiếu?
An toàn dữ liệu: Data Annotations là lớp bảo vệ đầu tiên, giúp dữ liệu luôn nằm trong phạm vi mong muốn, tránh các lỗi logic hệ thống về sau.

Chống truy cập trái phép: Với hệ thống Identity, bạn có thể kiểm soát chi tiết ai được phép xem, ai được phép chỉnh sửa nội dung. Đây là chuẩn mực bắt buộc cho mọi trang quản trị CMS.

Trải nghiệm người dùng: Khi có Validation rõ ràng, hệ thống sẽ phản hồi lỗi ngay lập tức, giúp người dùng biết họ cần sửa thông tin gì thay vì gặp lỗi hệ thống (500 Internal Server Error) sau khi đã nhấn nút lưu.

💻 Mẫu Model với Data Annotations
C#
public class Post 
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Tiêu đề không được để trống")]
    [StringLength(100, ErrorMessage = "Tiêu đề không quá 100 ký tự")]
    public string Title { get; set; }

    [Required]
    public string Content { get; set; }
}
Ghi chú: Việc áp dụng tốt các kỹ thuật bảo mật này không chỉ giúp dự án của bạn an toàn hơn mà còn thể hiện tư duy làm việc chuyên nghiệp, có trách nhiệm với hệ thống.
