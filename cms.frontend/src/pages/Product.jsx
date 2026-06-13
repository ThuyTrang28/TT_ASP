import { useState } from 'react';
import CategoryMenu from '../components/CategoryMenu';
import ProductGrid from '../components/ProductGrid';

function ProductPage({ onAddToCart, searchQuery }) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Tất cả sản phẩm</h2>
            <div className="mb-4">
                <CategoryMenu onSelectCategory={setSelectedCategory} activeCategory={selectedCategory} />
            </div>
            <ProductGrid
                categoryId={selectedCategory}
                searchQuery={searchQuery}
                onAddToCart={onAddToCart}
            />
        </div>
    );
}
export default ProductPage;