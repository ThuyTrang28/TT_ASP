import { useEffect, useState } from 'react';
import productApi from '../api/productApi'; // Đảm bảo bạn đã tạo file productApi.js như mình hướng dẫn trước đó

const ProductGrid = ({ categoryId, onSelectProduct, onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            // Lấy tất cả sản phẩm (hoặc lọc theo category nếu có)
            const data = await productApi.getAll();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [categoryId]);

    if (loading) return <div className="text-center mt-5">Đang tải sản phẩm...</div>;

    return (
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map(product => (
                <div key={product.id} className="col">
                    <div className="card h-100 shadow-sm border-0">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/300'}
                            className="card-img-top"
                            alt={product.name}
                            style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text text-danger fw-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                            </p>
                            <div className="d-flex justify-content-between">
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => onSelectProduct(product.id)}>
                                    Chi tiết
                                </button>
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => onAddToCart(product)}>
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;