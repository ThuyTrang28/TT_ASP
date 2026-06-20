import { useEffect, useState } from 'react';
import productApi from '../api/productApi';

function PostCategoryMenu({ onSelectCategory, activeCategory }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Giả sử bạn đã có hàm này trong productApi
        productApi.getPostCategories()
            .then(res => setCategories(res.data || res || []))
            .catch(err => console.error("Lỗi lấy danh mục bài viết:", err));
    }, []);

    return (
        <div className="container py-3">
            <div className="d-flex gap-2 flex-wrap">
                <button
                    className={`btn btn-sm rounded-pill ${activeCategory === null ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => onSelectCategory(null)}
                >
                    Tất cả bài viết
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`btn btn-sm rounded-pill ${activeCategory === cat.id ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PostCategoryMenu;