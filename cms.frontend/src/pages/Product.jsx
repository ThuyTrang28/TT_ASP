import { useState } from 'react';
import CategoryMenu from '../components/CategoryMenu';
import ProductGrid from '../components/ProductGrid';

function ProductPage({ onAddToCart, searchQuery }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Thêm state trang hiện tại

    // Khi đổi danh mục, reset trang về 1
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
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
                onAddToCart={onAddToCart}
            />
        </div>
    );
}
export default ProductPage;