import { useEffect, useState } from 'react';
import productApi from '../api/productApi';

function CategoryMenu({ onSelectCategory, activeCategory }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        productApi.getCategories()
            .then(res => {
                // Kiểm tra xem res có data không (thường dùng cho axios)
                // Nếu không, kiểm tra xem chính res có phải là mảng không
                const data = res?.data || (Array.isArray(res) ? res : []);
                setCategories(data);
            })
            .catch(err => {
                console.error("Lỗi lấy danh mục:", err);
                setCategories([]); // Đảm bảo state luôn là mảng rỗng khi lỗi
            });
    }, []);

    return (
        <div className="bg-light py-3 border-bottom shadow-sm">
            <div className="container d-flex align-items-center gap-3">
                <span className="fw-bold text-success text-uppercase small">
                    <i className="bi bi-funnel-fill me-1"></i> Bộ lọc:
                </span>

                <button
                    className={`btn btn-sm rounded-pill px-3 ${activeCategory === null ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => onSelectCategory(null)}
                >
                    Tất cả sản phẩm
                </button>

                {/* Kiểm tra an toàn trước khi map */}
                {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat.id ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => onSelectCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))
                ) : (
                    <span className="text-muted small">Đang tải...</span>
                )}
            </div>
        </div>
    );
}

export default CategoryMenu;