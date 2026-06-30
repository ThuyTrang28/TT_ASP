import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook để điều hướng
import CategoryMenu from '../components/CategoryMenu';
import ProductGrid from '../components/ProductGrid';

function ProductPage({ onAddToCart, searchQuery }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate(); // 2. Khởi tạo điều hướng

    // Khi đổi danh mục, reset trang về 1
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    // 3. Hàm xử lý riêng khi bấm "Mua ngay"
    const handleBuyNow = (product) => {
        // Kiểm tra xem onAddToCart có thực sự là một hàm không
        if (typeof onAddToCart === 'function') {
            onAddToCart(product);
            navigate('/cart');
        } else {
            console.error("onAddToCart không phải là hàm! Kiểm tra lại App.js");
        }
    };

    return (
        <div className="container my-5">
            <div className="mb-4">
                <CategoryMenu
                    onSelectCategory={handleCategorySelect}
                    activeCategory={selectedCategory}
                />
            </div>
            <ProductGrid
                categoryId={selectedCategory}
                searchQuery={searchQuery}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                // 4. Truyền hàm xử lý mới vào thay vì truyền trực tiếp onAddToCart
                onAddToCart={handleBuyNow}
            />

            {/* Giao diện phân trang chuyên nghiệp */}
            {!selectedCategory && (
                <nav aria-label="Product navigation" className="mt-5">
                    <ul className="pagination pagination-custom justify-content-center">
                        {/* Nút Previous */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                &laquo;
                            </button>
                        </li>

                        {/* Hiển thị các số trang (Giả sử bạn có 5 trang - bạn có thể dùng logic để map) */}
                        {[1, 2, 3, 4, 5].map(page => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(page)}>
                                    {page}
                                </button>
                            </li>
                        ))}

                        {/* Nút Next */}
                        <li className="page-item">
                            <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                                &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
export default ProductPage;