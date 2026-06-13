import { useState } from 'react';
import productApi from '../api/productApi';

function Auth({ onAuthSuccess, currentUser, onLogout }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: ''
    });
    const [msg, setMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        try {
            if (isLogin) {
                const res = await productApi.loginCustomer({
                    email: formData.email,
                    password: formData.password
                });

                // THÊM DÒNG NÀY ĐỂ DEBUG
                console.log("Response từ API:", res);

                // Kiểm tra cấu trúc dữ liệu: 
                // Nếu res.data là user, hãy dùng res.data. Nếu res là user luôn, hãy dùng res.
                if (res && (res.data || res.fullName)) {
                    const user = res.data || res; // Dự phòng trường hợp API trả về thẳng user

                    // Lưu localStorage
                    localStorage.setItem("customerId", user.id);
                    localStorage.setItem("customerName", user.fullName);
                    localStorage.setItem("customerEmail", user.email);

                    // Gọi callback để App.jsx render lại
                    onAuthSuccess(user);
                } else {
                    setMsg({ type: 'danger', text: "Đăng nhập thất bại: Dữ liệu không hợp lệ." });
                }
            }
        } catch (err) {
            console.error("Lỗi xác thực:", err);
            setMsg({ type: 'danger', text: err.response?.data?.message || "Xử lý tài khoản thất bại." });
        }
    };

    if (currentUser) return (
        <div className="alert alert-info d-flex justify-content-between align-items-center rounded-3 p-3 mb-4 shadow-sm border-0">
            <div>
                <i className="bi bi-person-check-fill text-primary me-2"></i>
                Đang đăng nhập: <strong className="text-dark">{currentUser.fullName}</strong>
                <span className="text-muted small"> ({currentUser.email})</span>
            </div>
            <button className="btn btn-sm btn-outline-danger px-3 rounded-pill fw-semibold" onClick={onLogout}>Đăng xuất</button>
        </div>
    );

    return (
        <div className="card border-0 shadow-sm p-4 mx-auto my-4 rounded-3" style={{ maxWidth: '450px' }}>
            <h4 className="fw-bold text-center text-success mb-4 text-uppercase">
                {isLogin ? "Đăng Nhập" : "Đăng Ký Tài Khoản"}
            </h4>
            {msg && <div className={`alert alert-${msg.type} small`}>{msg.text}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label small fw-semibold">Email</label>
                    <input type="email" className="form-control form-control-sm" required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>

                {!isLogin && (
                    <>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Họ và Tên</label>
                            <input type="text" className="form-control form-control-sm" required
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Số điện thoại</label>
                            <input type="tel" className="form-control form-control-sm" required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Địa chỉ</label>
                            <input type="text" className="form-control form-control-sm" required
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </>
                )}

                <div className="mb-3">
                    <label className="form-label small fw-semibold">Mật khẩu</label>
                    <input type="password" className="form-control form-control-sm" required
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>

                <button type="submit" className="btn btn-success w-100 fw-bold my-2 text-uppercase">
                    {isLogin ? "Vào hệ thống" : "Tạo tài khoản"}
                </button>
            </form>

            <div className="text-center mt-3">
                <button className="btn btn-link btn-sm text-secondary text-decoration-none"
                    onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Quay lại đăng nhập"}
                </button>
            </div>
        </div>
    );
}

export default Auth;