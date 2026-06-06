import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Đảm bảo đã cài react-router-dom
import productApi from '../api/productApi';

function LatestBlog({ currentUser }) {
    const [posts, setPosts] = useState([]);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate(); // Khởi tạo hook điều hướng

    useEffect(() => {
        productApi.getLatestPosts()
            .then(res => {
                setPosts(Array.isArray(res) ? res : (res.data || []));
            })
            .catch(err => console.error("Lỗi lấy bài viết:", err));
    }, []);

    useEffect(() => {
        if (currentUser?.id) {
            productApi.getOrderHistory(currentUser.id)
                .then(res => {
                    setHistory(Array.isArray(res) ? res : (res.data || []));
                })
                .catch(err => console.error("Lỗi lấy lịch sử đơn:", err));
        } else {
            setHistory([]);
        }
    }, [currentUser]);

    return (
        <div className="bg-light py-5 border-top">
            <div className="container">
                {/* Lịch sử mua hàng */}
                {currentUser && (
                    <div className="mb-5">
                        <h4 className="fw-bold text-dark text-uppercase mb-4">
                            <i className="bi bi-clock-history text-success me-2"></i>Lịch Sử Mua Hàng Của Bạn
                        </h4>
                        <div className="table-responsive bg-white rounded-3 p-3 shadow-sm">
                            <table className="table table-sm align-middle table-hover mb-0">
                                <thead className="table-light">
                                    <tr><th>Mã Đơn</th><th>Ngày Đặt</th><th>Ghi Chú</th><th>Trạng Thái</th></tr>
                                </thead>
                                <tbody>
                                    {history.length > 0 ? history.map(h => (
                                        <tr key={h.id}>
                                            <td className="fw-bold text-success font-monospace">#{h.id}</td>
                                            <td className="small">{new Date(h.orderDate).toLocaleDateString('vi-VN')}</td>
                                            <td className="text-muted small">{h.notes || "Không có"}</td>
                                            <td><span className="badge bg-secondary">Chờ duyệt ({h.status})</span></td>
                                        </tr>
                                    )) : <tr><td colSpan="4" className="text-center text-muted py-2 small">Bạn chưa có đơn hàng nào.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Danh sách bài viết */}
                <h4 className="fw-bold text-center text-uppercase mb-4">
                    <i className="bi bi-journal-text text-success me-2"></i>Xu Hướng Mặc Đẹp Mới Nhất
                </h4>
                <div className="row g-4">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div className="col-md-4" key={post.id}>
                                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                                    {/* Hiển thị ảnh bài viết */}
                                    <img
                                        src={post.imageUrl || '/placeholder-image.jpg'}
                                        className="card-img-top"
                                        alt={post.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-dark">{post.title}</h5>
                                        <p className="card-text text-secondary small">{post.summary}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <small className="text-muted font-monospace">
                                                {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                            </small>
                                            <button
                                                className="btn btn-outline-success btn-sm rounded-pill"
                                                onClick={() => navigate(`/post/${post.id}`)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">Chưa có bài viết nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LatestBlog;