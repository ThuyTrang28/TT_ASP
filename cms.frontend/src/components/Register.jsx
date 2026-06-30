import { useState } from 'react';
import { authApi } from '../api/authApi';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const result = await authApi.customerRegister(formData);

            if (result.success) {
                alert("Đăng ký tài khoản thành công!");
                navigate('/login'); // Chuyển về trang đăng nhập sau khi thành công
            } else {
                setMessage(result.message || "Đăng ký thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Chi tiết lỗi:", error);
            setMessage("Lỗi kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ backgroundColor: '#f8f9fa' }}>
            <div style={{ width: '100%', maxWidth: '550px', padding: '20px' }}>
                <form onSubmit={handleRegister} className="p-5 border-0 rounded-4 shadow-lg bg-white">
                    <div className="text-center mb-4">
                        <h4 className="fw-bold">Tạo tài khoản mới</h4>
                        <p className="text-muted">Nhập thông tin của bạn để bắt đầu</p>
                    </div>

                    {message && <div className="alert alert-info py-2 text-center">{message}</div>}

                    <div className="form-floating mb-3">
                        <input name="fullName" type="text" className="form-control" placeholder="Họ và tên" onChange={handleInputChange} value={formData.fullName} required />
                        <label>Họ và tên</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input name="email" type="email" className="form-control" placeholder="Email" onChange={handleInputChange} value={formData.email} required />
                        <label>Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input name="phone" type="tel" className="form-control" placeholder="Số điện thoại" onChange={handleInputChange} value={formData.phone} required />
                        <label>Số điện thoại</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input name="address" type="text" className="form-control" placeholder="Địa chỉ" onChange={handleInputChange} value={formData.address} required />
                        <label>Địa chỉ</label>
                    </div>
                    <div className="form-floating mb-4">
                        <input name="password" type="password" className="form-control" placeholder="Mật khẩu" onChange={handleInputChange} value={formData.password} required />
                        <label>Mật khẩu</label>
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-3 fw-bold rounded-3" disabled={loading}>
                        {loading ? "Đang xử lý..." : "ĐĂNG KÝ NGAY"}
                    </button>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            Đã có tài khoản? <Link to="/login" className="text-success fw-bold text-decoration-none">Đăng nhập</Link>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;