import { useState } from 'react';
import { authApi } from '../api/authApi';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authApi.customerLogin({ email, password });

            if (result.success) {
                // 1. Lưu thông tin vào localStorage
                localStorage.setItem("customerId", result.customerId);
                localStorage.setItem("customerName", result.fullName);
                localStorage.setItem("customerEmail", result.email);

                // 2. Thông báo cho App.jsx để cập nhật state currentUser
                // Khi App.jsx cập nhật state, component Login này sẽ tự động biến mất
                onLoginSuccess({
                    id: result.customerId,
                    fullName: result.fullName,
                    email: result.email
                });
            } else {
                setError(result.message || "Đăng nhập thất bại!");
            }
        } catch (err) {
            console.error("Chi tiết lỗi:", err); // Sử dụng biến err tại đây
            setError("Lỗi kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-3 border rounded shadow-sm bg-light">
            <h5 className="mb-3">Đăng nhập tài khoản</h5>
            {error && <p className="text-danger small">{error}</p>}

            <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                className="form-control mb-2"
                placeholder="Mật khẩu"
                onChange={e => setPassword(e.target.value)}
                required
            />

            <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
            >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
        </form>
    );
};

export default Login;