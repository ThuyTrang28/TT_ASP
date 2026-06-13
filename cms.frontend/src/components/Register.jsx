import { useState } from 'react';
import { authApi } from '../api/authApi';

const Register = () => {
    // State khớp với các cột trong DB của bạn
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Gom dữ liệu đúng với cấu trúc bảng Customers
        const data = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            password: formData.password
        };

        try {
            const result = await authApi.customerRegister(data);

            if (result.success) {
                alert("Đăng ký tài khoản thành công!");
                setFormData({ fullName: '', email: '', phone: '', address: '', password: '' });
            } else {
                setMessage(result.message || "Đăng ký thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            // 1. In ra console để xem lỗi thật sự từ API là gì (F12 -> Tab Console)
            console.error("Chi tiết lỗi:", error);

            // 2. Cập nhật thông báo
            setMessage("Lỗi kết nối đến máy chủ. Vui lòng kiểm tra API!");
        }
    };

    return (
        <form onSubmit={handleRegister} className="p-4">
            <h3>Đăng ký Khách hàng</h3>
            {message && <p style={{ color: 'red' }}>{message}</p>}

            <input name="fullName" type="text" placeholder="Họ và tên" onChange={handleInputChange} value={formData.fullName} required />
            <input name="email" type="email" placeholder="Email" onChange={handleInputChange} value={formData.email} required />
            <input name="phone" type="tel" placeholder="Số điện thoại" onChange={handleInputChange} value={formData.phone} required />
            <input name="address" type="text" placeholder="Địa chỉ" onChange={handleInputChange} value={formData.address} required />
            <input name="password" type="password" placeholder="Mật khẩu" onChange={handleInputChange} value={formData.password} required />

            <button type="submit">Đăng ký</button>
        </form>
    );
};

export default Register;