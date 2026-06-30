import { useState, useEffect } from 'react'; // <--- Thêm useEffect ở đây
import { Link } from 'react-router-dom';
import productApi from '../api/productApi'; // Đảm bảo đã import API của bạn

function Header({ cartCount, onReset, onSearch }) {
    const customerName = localStorage.getItem("customerName");
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]); // <--- Thêm state này

    // Bổ sung logic lấy gợi ý
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim().length > 1) {
                productApi.getSuggestions(searchTerm)
                    .then(res => {
                        // Kiểm tra xem res nằm ở đâu: thường là res.data
                        // Nếu res đã là mảng dữ liệu (do interceptor), thì dùng res
                        const data = res.data || res;
                        setSuggestions(Array.isArray(data) ? data : []);
                    })
                    .catch(err => {
                        console.error("Lỗi gọi API:", err);
                        setSuggestions([]);
                    });
            } else {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleLogout = () => {
        localStorage.removeItem("customerId");
        localStorage.removeItem("customerName");
        localStorage.removeItem("customerEmail");

        // PHẢI XÓA ĐÚNG KEY 'cartItems' ĐANG DÙNG TRONG APP.JS
        localStorage.removeItem("cartItems");


        window.location.href = "/";
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
                <div className="flex-grow-1 mx-4 position-relative"> {/* Thêm position-relative */}
                    <div className="input-group input-group-sm">
                        <input
                            type="text"
                            className="form-control border-success border-opacity-25"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button className="btn btn-success" type="button" onClick={handleSearch}>
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                    {/* Danh sách gợi ý - Đã thêm kiểm tra an toàn Array.isArray */}
                    {Array.isArray(suggestions) && suggestions.length > 0 && (
                        <ul className="list-group position-absolute w-100 shadow mt-1"
                            style={{
                                zIndex: 9999, // Tăng cao hơn nữa để đảm bảo không bị che
                                top: '100%',
                                left: 0,
                                border: '1px solid #ccc' // Thêm border để thấy khung
                            }}>
                            {suggestions.map(item => (
                                <li key={item.id}
                                    className="list-group-item list-group-item-action"
                                    style={{ cursor: 'pointer', backgroundColor: '#fff' }} // Đảm bảo nền màu trắng
                                    onClick={() => {
                                        setSearchTerm(item.name);
                                        setSuggestions([]);
                                        onSearch(item.name);
                                    }}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2">
                    <Link to="/cart" className="btn btn-outline-success btn-sm">
                        <i className="bi bi-cart"></i> Giỏ hàng ({cartCount})
                    </Link>

                    {customerName ? (
                        <div className="d-flex align-items-center gap-2">
                            <Link to="/order-history" className="text-decoration-none me-2">
                                <span className="badge bg-success">
                                    <i className="bi bi-box-seam me-1"></i>Đơn hàng
                                </span>
                            </Link>
                            <Link to="/profile" className="text-success small fw-bold text-decoration-none border-bottom border-success">
                                Hi, {customerName}
                            </Link>
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