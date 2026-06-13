import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';

const ProductGrid = ({ categoryId, searchQuery, onAddToCart, limit }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    const handleBuyNow = (product) => {
        onAddToCart(product);
        navigate('/checkout');
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let res;
                if (categoryId) {
                    res = await productApi.getByCategory(categoryId);
                } else {
                    res = await productApi.getAll();
                }
                const data = res?.data || res;

                // Sắp xếp sản phẩm theo ngày tạo mới nhất lên đầu
                // Giả sử API trả về trường 'createdDate'
                const sortedData = [...data].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setProducts(sortedData);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    // Lọc theo tìm kiếm
    const filteredProducts = products
        .filter(product => (product.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()))
        .slice(0, limit || products.length);

    if (loading) return <div className="text-center mt-5 text-success">Đang tải sản phẩm...</div>;

    return (
        <div className="row g-4">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                    <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">

                            {/* Logic: Chỉ hiển thị nhãn New cho 4 sản phẩm đầu tiên trong danh sách đã sắp xếp */}
                            {index < 4 && (
                                <span className="badge bg-success position-absolute top-0 end-0 m-3" style={{ zIndex: 1 }}>New</span>
                            )}

                            <div className="p-3">
                                <img
                                    src={getImageUrl(product.imageUrl)}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ height: '200px', objectFit: 'contain' }}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                                />
                            </div>

                            <div className="card-body d-flex flex-column text-center pt-0">
                                <h6 className="card-title fw-bold text-dark mb-2">{product.name}</h6>
                                <p className="card-text fw-bold text-success mb-3">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </p>

                                <div className="d-flex flex-column gap-2 mt-auto">
                                    <button
                                        className="btn btn-outline-success rounded-pill w-100"
                                        onClick={() => navigate(`/product/${product.id}`)}>
                                        Chi tiết
                                    </button>
                                    <button
                                        className="btn btn-success rounded-pill w-100"
                                        onClick={() => handleBuyNow(product)}>
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center w-100 text-secondary">Không tìm thấy sản phẩm nào phù hợp.</p>
            )}
        </div>
    );
};

export default ProductGrid;