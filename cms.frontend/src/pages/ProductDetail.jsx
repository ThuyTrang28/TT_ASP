import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';

function ProductDetail({ onAddToCart }) {
    const { id } = useParams(); // Lấy ID trực tiếp từ URL: /product/:id
    const navigate = useNavigate(); // Dùng để quay lại trang trước
    const [product, setProduct] = useState(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/400';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    useEffect(() => {
        if (id) {
            productApi.getProductDetail(id)
                .then(res => {
                    setProduct(res.data || res);
                })
                .catch(err => console.error("Lỗi lấy chi tiết sản phẩm:", err));
        }
    }, [id]); // Chạy lại mỗi khi id trên URL thay đổi

    if (!product) return <div className="text-center py-5">Đang tải thông tin sản phẩm...</div>;

    return (
        <div className="card border-0 shadow-sm p-4 rounded-3 my-4">
            {/* Sử dụng navigate(-1) để quay về trang trước đó (thường là trang chủ) */}
            <button
                className="btn btn-link text-success p-0 mb-4 text-decoration-none fw-bold"
                onClick={() => navigate(-1)}
            >
                <i className="bi bi-arrow-left me-1"></i> Quay lại cửa hàng
            </button>
            <div className="row">
                <div className="col-md-5 text-center">
                    <img
                        src={getImageUrl(product.imageUrl)}
                        className="img-fluid rounded-3 shadow-sm"
                        alt={product.name}
                        style={{ maxHeight: '350px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                    />
                </div>
                <div className="col-md-7 d-flex flex-column justify-content-between py-2">
                    <div>
                        <h2 className="fw-bold text-dark">{product.name}</h2>
                        <h4 className="fw-bold mb-3">
                            {product.isOnSale ? (
                                <>
                                    <span className="text-success me-3">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.finalPrice)}
                                    </span>
                                    <span className="text-muted text-decoration-line-through fs-6">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-success">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                            )}
                        </h4>
                        <hr />
                        <p className="text-secondary">{product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                    </div>

                    <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Kho: <b className="text-dark font-monospace">{product.stockQuantity ?? 0}</b></span>

                        <button
                            className="btn btn-success px-4 fw-bold"
                            onClick={() => onAddToCart(product)}
                            disabled={product.stockQuantity <= 0}
                        >
                            <i className="bi bi-bag-plus me-2"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;