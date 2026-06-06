import { useEffect, useState } from 'react';
import productApi from '../api/productApi';

function ProductDetail({ productId, onBack, onAddToCart }) {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (productId) {
            productApi.getProductDetail(productId)
                .then(res => setProduct(res.data))
                .catch(err => console.error("Lỗi lấy chi tiết sản phẩm:", err));
        }
    }, [productId]);

    if (!product) return <div className="text-center py-5">Đang tải thông tin sản phẩm...</div>;

    return (
        <div className="card border-0 shadow-sm p-4 rounded-3 my-4">
            <button className="btn btn-link text-success p-0 mb-4 text-decoration-none fw-bold" onClick={onBack}><i className="bi bi-arrow-left me-1"></i> Quay lại cửa hàng</button>
            <div className="row">
                <div className="col-md-5 text-center"><img src={product.imageUrl || 'https://via.placeholder.com/400'} className="img-fluid rounded-3 shadow-sm" alt={product.name} style={{ maxHeight: '350px', objectFit: 'cover' }} /></div>
                <div className="col-md-7 d-flex flex-column justify-content-between py-2">
                    <div>
                        <h2 className="fw-bold text-dark">{product.name}</h2>
                        <h3 className="text-danger font-monospace fw-bold my-3">{(product.price || 0).toLocaleString()} đ</h3>
                        <hr />
                        <p className="text-secondary">{product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                    </div>
                    <div className="bg-light p-3 rounded-3 d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Tồn kho khả dụng: <b className="text-dark font-monospace">{product.stockQuantity ?? 0}</b> cái</span>
                        <button className="btn btn-success px-4 fw-bold" onClick={() => onAddToCart(product)} disabled={product.stockQuantity <= 0}><i className="bi bi-bag-plus me-2"></i> THÊM VÀO GIỎ HÀNG</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ProductDetail;