
function About() {
    return (
        <div className="container my-5">
            {/* Phần giới thiệu chính */}
            <div className="row align-items-center mb-5">
                <div className="col-md-6">
                    <h1 className="display-4 fw-bold text-success mb-3">Về Cỏ Mềm</h1>
                    <p className="lead text-muted">
                        Thành lập năm 2015 bởi đội ngũ Dược sĩ tâm huyết, Cỏ Mềm tự hào là Thương hiệu Mỹ phẩm Thiên nhiên được tin cậy hàng đầu Việt Nam.
                    </p>
                    <p>
                        Trải qua hành trình 10 năm xây dựng, chúng tôi sở hữu mô hình kinh doanh trọn vẹn từ nghiên cứu phát triển, nhà máy sản xuất cGMP đến chuỗi 90 cửa hàng độc quyền, mang vẻ đẹp an lành đến mọi miền tổ quốc.
                    </p>
                </div>
                <div className="col-md-6">
                    <img
                        src="https://images.unsplash.com/photo-1571781926291-c4a7ebfd024b?auto=format&fit=crop&q=80&w=800"
                        alt="Cỏ Mềm Team"
                        className="img-fluid rounded-4 shadow"
                    />
                </div>
            </div>

            {/* Các cột thông tin chi tiết */}
            <div className="row g-4 my-5">
                <h2 className="text-center mb-4">Sức mạnh từ sự khác biệt</h2>

                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm p-3">
                        <i className="bi bi-tree text-success fs-1"></i>
                        <h4 className="fw-bold">Vùng trồng Hữu cơ</h4>
                        <p className="small text-muted">Sở hữu vùng trồng Sâm Lai Châu đạt chứng nhận hữu cơ đầu tiên tại Việt Nam, với hơn 10ha tại độ cao 1700m.</p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm p-3">
                        <i className="bi bi-gear-wide-connected text-success fs-1"></i>
                        <h4 className="fw-bold">Nhà máy cGMP</h4>
                        <p className="small text-muted">Nhà máy 9.000m2 đạt chuẩn cGMP-ASEAN, vận hành theo quy trình kiểm soát chất lượng nghiêm ngặt ISO 17025.</p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm p-3">
                        <i className="bi bi-people-fill text-success fs-1"></i>
                        <h4 className="fw-bold">Hệ thống 90 cửa hàng</h4>
                        <p className="small text-muted">Phủ sóng 30 tỉnh thành, là không gian xanh nơi khách hàng trải nghiệm sự tận tâm và chân thành.</p>
                    </div>
                </div>
            </div>

            {/* Dự án cộng đồng */}
            <div className="bg-light p-5 rounded-4 my-5">
                <h2 className="text-center mb-4">Cùng Thiên nhiên & Cộng đồng</h2>
                <div className="row">
                    <div className="col-md-4 text-center">
                        <h5 className="fw-bold text-success">Rừng An Lành</h5>
                        <p className="small">Phủ xanh 4ha rừng đầu nguồn với gần 5.000 cây xanh tại Ninh Thuận và Sơn La.</p>
                    </div>
                    <div className="col-md-4 text-center">
                        <h5 className="fw-bold text-success">Ngôi Trường Ước Mơ</h5>
                        <p className="small">Xây dựng 9 ngôi trường, chắp cánh ước mơ cho hơn 350 em nhỏ vùng cao.</p>
                    </div>
                    <div className="col-md-4 text-center">
                        <h5 className="fw-bold text-success">Thư viện Thân thiện</h5>
                        <p className="small">Mang tri thức và niềm yêu sách đến với hơn 1.000 học sinh tại Gia Lai.</p>
                    </div>
                </div>
            </div>

            {/* Lời kết */}
            <div className="text-center mt-5">
                <h3 className="fw-bold text-success">Cảm ơn bạn đã đồng hành cùng Cỏ Mềm!</h3>
                <p className="text-muted">Kiên trì thay thế hóa chất độc hại bằng giá trị thiên nhiên bền vững.</p>
            </div>
        </div>
    );
}

export default About;