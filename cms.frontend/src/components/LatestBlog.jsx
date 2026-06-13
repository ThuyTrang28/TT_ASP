import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';

function LatestBlog() { // Đã bỏ currentUser vì không còn dùng tới
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const getImageUrl = (path) => {
        if (!path) return '/placeholder-image.jpg';
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^\\+|\\+/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    // Load bài viết
    useEffect(() => {
        productApi.getLatestPosts()
            .then(res => {
                const data = Array.isArray(res) ? res : (res?.data || []);
                setPosts(data.slice(3,6));
            })
            .catch(err => console.error("Lỗi lấy bài viết:", err));
    }, []);

    return (
        <div className="bg-light py-5 border-top">
            <div className="container">
                {/* Danh sách bài viết */}
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
                                        <p className="card-text text-secondary small">{post.summary}</p>
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
                        <p className="text-center text-muted">Đang tải bài viết...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LatestBlog;