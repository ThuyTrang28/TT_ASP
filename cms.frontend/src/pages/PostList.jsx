import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../api/productApi';

// Cấu hình base URL để lấy ảnh
const BASE_URL = 'https://localhost:7064';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm xử lý đường dẫn ảnh từ server
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/300x200';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true);
                const res = await productApi.getLatestPosts();
                const data = Array.isArray(res) ? res : (res?.data || []);

                // BỎ .slice(0, 3) Ở ĐÂY ĐỂ HIỂN THỊ TẤT CẢ
                setPosts(data);
            } catch (err) {
                console.error("Lỗi lấy danh sách bài viết:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, []);

    return (
        <div className="container my-5">
            <h2 className="fw-bold mb-4 text-success">
                <i className="bi bi-newspaper me-2"></i>Bài viết nổi bật 
            </h2>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status"></div>
                    <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="row">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post.id} className="col-md-4 mb-4">
                                <div className="card h-100 shadow-sm border-0">
                                    <img
                                        src={getImageUrl(post.imageUrl)}
                                        className="card-img-top"
                                        alt={post.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{post.title}</h5>
                                        <p className="card-text small text-muted text-truncate" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.summary || post.description}
                                        </p>
                                        <Link to={`/post/${post.id}`} className="btn btn-outline-success btn-sm w-100">
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">Chưa có bài viết nào.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostList;