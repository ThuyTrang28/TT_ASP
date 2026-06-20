import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';

function PostList() {
    const [posts, setPosts] = useState([]);       // Dữ liệu hiển thị
    const [categories, setCategories] = useState([]); // Danh mục
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300x200';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Gọi song song cả bài viết và danh mục
                const [postsRes, catRes] = await Promise.all([
                    productApi.getAllPosts(),
                    productApi.getPostCategories() // Đảm bảo hàm này đã có trong api
                ]);

                const postsData = postsRes?.data || postsRes || [];
                const catData = catRes?.data || catRes || [];

                setPosts(postsData);
                setCategories(catData);
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilter = async (categoryId) => {
        setActiveCategory(categoryId);
        setLoading(true);

        try {
            if (!categoryId) {
                // Nếu chọn "Tất cả", lấy lại toàn bộ bài viết
                const res = await productApi.getAllPosts();
                setPosts(res.data || res);
            } else {
                // Gọi API lọc từ server - Dữ liệu trả về sẽ chính xác 100%
                const res = await productApi.getPostsByCategory(categoryId);
                setPosts(res.data || res);
            }
        } catch (err) {
            console.error("Lỗi khi lọc bài viết từ server:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="fw-bold mb-4 text-success">
                <i className="bi bi-newspaper me-2"></i>Bài viết nổi bật
            </h2>

            {/* Bắt đầu chia cột: Hàng chứa cả menu và danh sách */}
            <div className="row">

                {/* Cột trái: Bộ lọc (3 phần) */}
                {/* Cột trái: Bộ lọc (3 phần) */}
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3">
                        <h5 className="fw-bold mb-3 text-success">Danh mục</h5>

                        {/* Dropdown Menu */}
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-success dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                                type="button"
                                id="categoryDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {activeCategory
                                    ? (categories.find(c => c.id === activeCategory)?.name || "Chọn danh mục")
                                    : "Tất cả bài viết"}
                            </button>

                            <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                <li>
                                    <button
                                        className={`dropdown-item ${activeCategory === null ? 'active' : ''}`}
                                        onClick={() => handleFilter(null)}
                                    >
                                        Tất cả bài viết
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                        <button
                                            className={`dropdown-item ${activeCategory === cat.id ? 'active' : ''}`}
                                            onClick={() => handleFilter(cat.id)}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Danh sách bài viết (9 phần) */}
                <div className="col-md-9">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status"></div>
                        </div>
                    ) : (
                        <div className="row">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                                        <div className="card h-100 shadow-sm border-0">
                                            <img src={getImageUrl(post.imageUrl)} className="card-img-top" alt={post.title} style={{ height: '200px', objectFit: 'cover' }} />
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">{post.title}</h5>
                                                <Link to={`/post/${post.id}`} className="btn btn-outline-success btn-sm w-100 mt-2">Xem chi tiết</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <p className="text-muted">Không tìm thấy bài viết nào trong danh mục này.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Kết thúc chia cột */}
            </div>
        </div>
    );
}

export default PostList;