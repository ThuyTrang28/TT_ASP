import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../api/productApi'; // Đảm bảo import đúng file chứa hàm API

const BASE_URL = 'https://localhost:7064';

function LatestBlog() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const getImageUrl = (path) => {
        if (!path) return '/placeholder-image.jpg';
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/\\/g, '/'); // Đã tối ưu regex
        return `${BASE_URL}/${cleanPath}`;
    };

    // Load 3 bài viết mới nhất từ API
    useEffect(() => {
        productApi.getLatestPosts(3)
            .then(res => {
                const data = res?.data || res || [];
                setPosts(data);
            })
            .catch(err => {
                console.error("Lỗi lấy bài viết:", err);
                setPosts([]);
            });
    }, []);

    return (
        <div className="bg-light py-5 border-top">
            <div className="container">
                <h4 className="fw-bold text-center text-uppercase mb-4">
                    <i className="bi bi-journal-text text-success me-2"></i>Xu Hướng Làm Đẹp Mới Nhất
                </h4>
                <div className="row g-4">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div className="col-md-4" key={post.id}>
                                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                                    <img
                                        src={getImageUrl(post.imageUrl)}
                                        className="card-img-top"
                                        alt={post.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-dark">{post.title}</h5>
                                        {/* Hiển thị tóm tắt nếu có, nếu không lấy một phần của content */}
                                        <p className="card-text text-secondary small">
                                            {post.summary || "Xem ngay để cập nhật những xu hướng làm đẹp mới nhất..."}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <small className="text-muted font-monospace">
                                                {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : ''}
                                            </small>
                                            <button
                                                className="btn btn-outline-success btn-sm rounded-pill"
                                                onClick={() => navigate(`/post/${post.id}`)}
                                            >
                                                Đọc Ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">Hiện chưa có bài viết mới nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LatestBlog;