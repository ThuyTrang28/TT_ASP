import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ cartCount, onReset, onSearch }) {
    // Lấy thông tin user từ localStorage để hiển thị
    const customerName = localStorage.getItem("customerName");
    // State cho ô tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("customerId");
        localStorage.removeItem("customerName");
        localStorage.removeItem("customerEmail");
        alert("Bạn đã đăng xuất thành công!");
        window.location.reload();
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        } else {
            alert("Đang tìm kiếm: " + searchTerm);
        }
    };

    const headerStyle = {
        backgroundColor: '#e8f5e9',
        borderBottom: '1px solid #c8e6c9'
    };

    return (
        <header style={headerStyle} className="shadow-sm sticky-top">
            <div className="container py-3 d-flex justify-content-between align-items-center">
                <h1 className="fs-5 fw-bold m-0 text-success text-uppercase font-monospace"
                    style={{ cursor: 'pointer' }} onClick={onReset}>
                    <i className="bi bi-bag-heart-fill me-2"></i>Trang CMS.CoMem
                </h1>

                {/* Thanh tìm kiếm */}
                <div className="flex-grow-1 mx-4">
                    <div className="input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control border-success border-opacity-25"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            // Thay onKeyPress bằng onKeyDown
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="btn btn-success" type="button" onClick={handleSearch}>
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Link to="/cart" className="btn btn-outline-success btn-sm">
                        <i className="bi bi-cart"></i> Giỏ hàng ({cartCount})
                    </Link>

                    {customerName ? (
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-success small fw-bold">Hi, {customerName}</span>
                            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-success btn-sm">Đăng nhập</Link>
                    )}
                </div>
            </div>

            <div className="bg-success bg-opacity-75 py-2">
                {/* Thêm justify-content-center vào đây */}
                <div className="container d-flex gap-4 justify-content-center">
                    <Link to="/" onClick={onReset} className="text-white text-decoration-none small fw-bold">
                        <i className="bi bi-house-door me-1"></i>TRANG CHỦ
                    </Link>
                    <Link to="/products" onClick={onReset} className="text-white text-decoration-none small fw-bold">
                        <i className="bi bi-house-door me-1"></i>SẢN PHẨM
                    </Link>
                    <Link to="/about" className="text-white text-decoration-none small fw-bold">
                        <i className="bi bi-info-circle me-1"></i>VỀ CỎ MỀM
                    </Link>
                    <Link to="/post" className="text-white text-decoration-none small fw-bold">
                        <i className="bi bi-info-circle me-1"></i>BÀI VIẾT
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;