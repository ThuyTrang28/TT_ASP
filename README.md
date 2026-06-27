📌 Nội dung buổi học: Buổi 3
Chủ đề: Truy vấn LINQ & Thao tác dữ liệu chuyên sâu với Entity Framework Core

Buổi học này tập trung vào việc làm việc với dữ liệu thực tế. Thay vì viết các câu lệnh SQL thô (Raw SQL), chúng ta sử dụng LINQ (Language Integrated Query) để thao tác với Database ngay trong mã nguồn C#, giúp code sạch, an toàn và dễ bảo trì hơn.

🎯 Mục tiêu chuyên sâu
Làm chủ LINQ to Entities: Chuyển đổi tư duy từ viết câu lệnh SELECT * FROM... sang các phương thức LINQ mạnh mẽ.

Xử lý quan hệ dữ liệu: Sử dụng .Include() để thực hiện "Eager Loading" (tải dữ liệu liên quan) khi truy vấn các bảng có liên kết với nhau (ví dụ: lấy bài viết kèm theo thông tin danh mục).

Thực thi CRUD: Thành thạo 4 thao tác cốt lõi: tạo mới (Add), cập nhật (Update), xóa (Remove) và truy vấn (Where, Select, FirstOrDefault).

Hiểu về Tracking: Nắm được cách Entity Framework theo dõi các thay đổi trên đối tượng để tự động tạo câu lệnh SQL tương ứng khi gọi SaveChanges().

🛠 Nội dung thực hiện
Truy vấn dữ liệu: Viết các phương thức truy vấn danh sách (sử dụng .ToList(), .Where()) và truy vấn một phần tử cụ thể (sử dụng .FirstOrDefaultAsync()).

Include dữ liệu: Sử dụng .Include(p => p.Category) để lấy dữ liệu bài viết kèm danh mục của nó, giải quyết bài toán quan hệ 1-N.

Thao tác dữ liệu (CRUD):

Thêm: Khởi tạo object, thêm vào DbSet và SaveChanges.

Sửa: Lấy đối tượng từ DB, thay đổi thuộc tính, gọi Update hoặc SaveChanges.

Xóa: Lấy đối tượng, gọi Remove và SaveChanges.

Tối ưu hóa: Học cách lọc dữ liệu tại phía Database (Server-side) trước khi lấy kết quả về ứng dụng (Client-side) để tăng tốc độ.

💡 Tại sao LINQ & EF Core là "vũ khí" lợi hại?
An toàn (Type-safe): Mọi lỗi sai về tên bảng hay tên cột sẽ được báo ngay tại thời điểm biên dịch (Compile-time), tránh lỗi runtime nguy hiểm.

Độc lập Database: Code của bạn không bị gắn chặt với SQL Server. Nếu sau này cần chuyển sang PostgreSQL hay MySQL, bạn gần như không phải sửa logic truy vấn.

Tính trừu tượng cao: Tập trung vào logic nghiệp vụ thay vì tốn thời gian viết các câu lệnh truy vấn SQL phức tạp, giúp năng suất làm việc tăng vượt bậc.

💻 Mẫu minh họa: Truy vấn bài viết có kèm danh mục
C#
// Lấy danh sách tất cả bài viết kèm thông tin danh mục
var posts = await _context.Posts
    .Include(p => p.Category)
    .Where(p => p.IsPublished == true)
    .OrderByDescending(p => p.CreatedAt)
    .ToListAsync();
Ghi chú: Việc nắm vững cách thao tác dữ liệu là kỹ năng sống còn của mọi Backend Developer. Sau buổi này, bạn đã có thể tự tay xây dựng các tính năng CRUD cho mọi thực thể trong hệ thống CMS của mình.
