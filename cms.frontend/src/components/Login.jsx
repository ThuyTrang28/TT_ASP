import { useState } from 'react';
import { authApi } from '../api/authApi';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authApi.customerLogin({ email, password });
            if (result.success) {
                localStorage.setItem("customerId", result.customerId);
                localStorage.setItem("customerName", result.fullName);
                localStorage.setItem("customerEmail", result.email);

                if (typeof onLoginSuccess === 'function') {
                    onLoginSuccess({
                        id: result.customerId,
                        fullName: result.fullName,
                        email: result.email
                    });
                }
                navigate('/');
            } else {
                setError(result.message || "Email hoặc mật khẩu không chính xác!");
            }
        } catch (err) {
            console.error("Chi tiết lỗi:", err);
            setError("Lỗi kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', backgroundColor: '#f8f9fa' }}>
            <div style={{ width: '100%', maxWidth: '550px', padding: '20px' }}>
                <form
                    onSubmit={handleLogin}
                    className="p-5 border-0 rounded-4 shadow-lg bg-white"
                >
                    <div className="text-center mb-4">
                        <i className="bi bi-person-circle text-success" style={{ fontSize: '3rem' }}></i>
                        <h4 className="fw-bold mt-2">Chào mừng trở lại</h4>
                        <p className="text-muted">Vui lòng đăng nhập để tiếp tục</p>
                    </div>

                    {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="name@example.com"
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="email">Email</label>
                    </div>

                    <div className="form-floating mb-4">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Mật khẩu</label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100 py-3 fw-bold rounded-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <span><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</span>
                        ) : "ĐĂNG NHẬP"}
                    </button>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Chưa có tài khoản?
                            {/* 2. Thay thế thẻ <a> bằng component <Link> */}
                            <Link to="/register" className="text-success fw-bold ms-1 text-decoration-none">
                                Đăng ký ngay
                            </Link>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;