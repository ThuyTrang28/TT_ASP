import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';
const PAGE_SIZE = 6; // Số bài viết mỗi trang

function PostList() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);

    // Thêm state phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300x200';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    const loadData = async (page = 1, categoryId = null) => {
        setLoading(true);
        console.log(`--- Đang gọi API lấy trang: ${page}, danh mục: ${categoryId} ---`);
        try {
            if (categoryId) {
                const res = await productApi.getPostsByCategory(categoryId);
                console.log("Dữ liệu lọc theo danh mục:", res);
                setPosts(res.data || res);
                setTotalPages(1);
            } else {
                const res = await productApi.getPostsByPage(page, PAGE_SIZE);
                console.log("Dữ liệu phân trang trả về:", res);

                // Log giá trị để kiểm tra tại sao phân trang không hiện
                console.log("Số trang (totalPages) nhận được:", res?.data?.totalPages || res?.totalPages);

                setPosts(res.data.data || res.data || []);
                setTotalPages(res.data.totalPages || res.totalPages || 1);
            }
        } catch (err) {
            console.error("Lỗi khi tải bài viết (loadData):", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            console.log("--- Đang khởi tạo dữ liệu ---");
            try {
                const catRes = await productApi.getPostCategories();
                console.log("Kết quả danh mục (Categories):", catRes);

                setCategories(catRes?.data || catRes || []);

                console.log("Đang gọi loadData(1)...");
                await loadData(1);
            } catch (error) {
                console.error("Lỗi trong quá trình khởi tạo (init):", error);
            }
        };
        init();
    }, []);

    // Cập nhật khi nhấn nút trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        loadData(page, activeCategory);
    };

    const handleFilter = async (categoryId) => {
        setActiveCategory(categoryId);
        setCurrentPage(1);
        loadData(1, categoryId);
    };

    return (
        <div className="container my-5">
            <h2 className="fw-bold mb-4 text-success">
                <i className="bi bi-newspaper me-2"></i>Bài viết nổi bật
            </h2>

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card shadow-sm border-0 p-3">
                        <h5 className="fw-bold mb-3 text-success">Danh mục</h5>
                        <div className="dropdown">
                            <button className="btn btn-outline-success dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center" type="button" id="categoryDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                {activeCategory ? (categories.find(c => c.id === activeCategory)?.name || "Chọn danh mục") : "Tất cả bài viết"}
                            </button>
                            <ul className="dropdown-menu w-100" aria-labelledby="categoryDropdown">
                                <li><button className={`dropdown-item ${activeCategory === null ? 'active' : ''}`} onClick={() => handleFilter(null)}>Tất cả bài viết</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                {categories.map(cat => (
                                    <li key={cat.id}><button className={`dropdown-item ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => handleFilter(cat.id)}>{cat.name}</button></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
                    ) : (
                        <>
                            <div className="row">
                                {posts.length > 0 ? posts.map(post => (
                                    <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                                        <div className="card h-100 shadow-sm border-0">
                                            <img src={getImageUrl(post.imageUrl)} className="card-img-top" alt={post.title} style={{ height: '200px', objectFit: 'cover' }} />
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">{post.title}</h5>
                                                <Link to={`/post/${post.id}`} className="btn btn-outline-success btn-sm w-100 mt-2">Xem chi tiết</Link>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="col-12 text-center py-5"><p className="text-muted">Không có bài viết.</p></div>}
                            </div>

                                {/* Giao diện phân trang chuyên nghiệp */}
                                {!activeCategory && totalPages > 1 && (
                                    <nav aria-label="Product navigation" className="mt-5">
                                        <ul className="pagination pagination-custom justify-content-center">
                                            {/* Nút Previous */}
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                                >
                                                    &laquo;
                                                </button>
                                            </li>

                                            {/* Hiển thị các số trang động theo totalPages */}
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}

                                            {/* Nút Next */}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                                >
                                                    &raquo;
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostList;