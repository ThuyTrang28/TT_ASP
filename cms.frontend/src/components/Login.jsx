import { useState } from 'react';
import { authApi } from '../api/authApi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await authApi.customerLogin({ email, password });

        if (result.success) {
            // Đăng nhập thành công -> Lưu thông tin vào localStorage để dùng cho giỏ hàng / hóa đơn
            localStorage.setItem("customerId", result.customerId);
            localStorage.setItem("customerName", result.fullName);
            localStorage.setItem("customerEmail", result.email);

            alert(`Chào mừng ${result.fullName} đã quay trở lại!`);
            window.location.href = "/"; // Quay về trang chủ mua sắm
        } else {
            setError(result.message); // Hiển thị lỗi "Email hoặc Mật khẩu không chính xác!"
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mật khẩu" onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Đăng nhập</button>
        </form>
    );
};

export default Login;