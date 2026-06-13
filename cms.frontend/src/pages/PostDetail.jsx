import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../api/productApi';

const PostDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL: /post/:id
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        productApi.getPostDetail(id)
            .then(res => {
                // Kiểm tra cấu trúc response của axios (thường là res.data)
                setPost(res?.data || res);
            })
            .catch(err => {
                console.error("Lỗi lấy chi tiết bài viết:", err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center mt-5 text-success">Đang tải nội dung...</div>;
    if (!post) return <div className="text-center mt-5">Không tìm thấy bài viết.</div>;

    return (
        <div className="container my-5" style={{ maxWidth: '800px' }}>
            <button
                className="btn btn-outline-success btn-sm mb-4 rounded-pill px-3"
                onClick={() => navigate(-1)}
            >
                <i className="bi bi-arrow-left me-2"></i> Quay lại
            </button>

            <article>
                <h1 className="fw-bold mb-3">{post.title}</h1>
                <p className="text-muted small border-bottom pb-3">
                    <i className="bi bi-calendar3 me-2"></i>
                    {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
                </p>

                {post.imageUrl && (
                    <img
                        src={post.imageUrl.startsWith('http') ? post.imageUrl : `https://localhost:7064/${post.imageUrl.replace(/\\/g, '/')}`}
                        alt={post.title}
                        className="img-fluid rounded-3 mb-4 w-100"
                    />
                )}

                <div className="fs-5 lh-lg text-dark">
                    {/* Sử dụng white-space: pre-line nếu nội dung có xuống dòng từ backend */}
                    <div style={{ whiteSpace: 'pre-line' }}>{post.content}</div>
                </div>
            </article>
        </div>
    );
};

export default PostDetail;