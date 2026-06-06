import { useState } from 'react';
import { authApi } from '../api/authApi'; // Đường dẫn tới file authApi.js vừa tạo

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        // Gom dữ liệu khớp chính xác với DTO bên Backend
        const data = { fullName, email, password, phone, address };

        // Gọi sang Backend API
        const result = await authApi.customerRegister(data);

        if (result.success) {
            alert("Đăng ký tài khoản thành công!");
            // Trang có thể điều hướng sang trang đăng nhập bằng useNavigate() tại đây
        } else {
            setMessage(result.message); // Hiển thị thông báo lỗi (VD: Email đã tồn tại)
        }
    };

    return (
        <form onSubmit={handleRegister}>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <input type="text" placeholder="Họ và tên" onChange={e => setFullName(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mật khẩu" onChange={e => setPassword(e.target.value)} required />
            <input type="text" placeholder="Số điện thoại" onChange={e => setPhone(e.target.value)} />
            <input type="text" placeholder="Địa chỉ" onChange={e => setAddress(e.target.value)} />
            <button type="submit">Đăng ký</button>
        </form>
    );
};

export default Register;