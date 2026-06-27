Đây là nội dung chi tiết cho Buổi 6, phần kiến trúc cực kỳ quan trọng giúp liên kết Backend ASP.NET với bất kỳ Frontend nào (bao gồm cả ReactJS bạn đang xây dựng). Bạn có thể thêm vào README.md để hoàn thiện hồ sơ dự án của mình:

📌 Nội dung buổi học: Buổi 6
Chủ đề: Xây dựng WebAPI RESTful Service - Cầu nối dữ liệu

Đây là giai đoạn chuyển mình từ việc xây dựng ứng dụng trang web truyền thống sang xây dựng kiến trúc Client-Server hiện đại. Thay vì trả về các View (HTML), Backend giờ đây sẽ trở thành một "Data Provider" cung cấp dữ liệu thuần túy dưới dạng JSON.

🎯 Mục tiêu chuyên sâu
Tư duy thiết kế RESTful: Hiểu cách thiết kế các Endpoint sao cho chuẩn chỉnh, tường minh và dễ sử dụng cho Frontend.

Mastering HTTP Methods: Biết cách sử dụng đúng các phương thức GET, POST, PUT, DELETE để thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên tài nguyên.

JSON Serialization: Nắm vững cách ASP.NET tự động chuyển đổi từ đối tượng C# (Object) sang định dạng JSON mà trình duyệt có thể đọc hiểu được.

🛠 Nội dung thực hiện
Thiết lập API Controller: Chuyển đổi từ Controller thông thường sang ApiController với các cơ chế như Attribute Routing (ví dụ: [Route("api/[controller]")]).

Triển khai các Endpoint:

Xây dựng API GET để lấy toàn bộ danh sách bài viết.

Xây dựng API GET với tham số (ví dụ: /api/posts/{id}) để lấy chi tiết một bài viết cụ thể.

Cấu hình để lọc bài viết theo danh mục thông qua Query Parameters (ví dụ: /api/posts?categoryId=1).

Cấu hình Cross-Origin Resource Sharing (CORS): Thiết lập để trình duyệt (ReactJS) có quyền truy cập vào các tài nguyên từ Backend, tránh lỗi bảo mật Same-Origin Policy.

Kiểm thử API: Sử dụng các công cụ như Postman hoặc Swagger để test API trước khi kết nối với giao diện React.

💡 Tại sao RESTful API là "chìa khóa"?
Độc lập nền tảng: Nhờ việc trả về JSON, Backend của bạn không chỉ phục vụ ReactJS mà còn có thể dễ dàng kết nối với Mobile App (iOS/Android) hoặc các dịch vụ khác trong tương lai.

Tính nhất quán: Sử dụng chuẩn HTTP giúp mã nguồn dễ đọc, dễ hiểu và dễ dàng bảo trì. Các lập trình viên Frontend khi nhìn vào API của bạn sẽ biết ngay cần gửi dữ liệu gì và nhận được kết quả như thế nào.

Tăng hiệu suất: Chỉ gửi đi dữ liệu cần thiết (JSON) thay vì gửi toàn bộ mã nguồn HTML của trang web, giúp giảm băng thông và tăng tốc độ phản hồi.

💻 Mẫu Controller API tham khảo
C#
[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PostsController(ApplicationDbContext context) => _context = context;

    // GET: api/posts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Post>> GetPost(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }
}
