import { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

function Profile() {
    const [user, setUser] = useState({ id: 0, fullName: '', email: '', phone: '', address: '' });
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Lấy thông tin khi load trang
    useEffect(() => {
        const customerId = localStorage.getItem("customerId");
        if (customerId) {
            authApi.getProfile(customerId)
                .then(res => {
                    // Nếu API trả về dạng { success: true, ...data }
                    setUser(res.data || res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi lấy thông tin:", err);
                    setLoading(false);
                });
        }
    }, []);

    // 2. Xử lý cập nhật thông tin
    const handleUpdate = async (e) => {
        e.preventDefault();
        const result = await authApi.updateProfile(user);
        if (result.success) {
            localStorage.setItem("customerName", user.fullName);
            alert("Cập nhật thành công!");
            setIsEditing(false);
            window.location.reload();
        } else {
            alert(result.message || "Có lỗi xảy ra!");
        }
    };

    // 3. Xử lý đổi mật khẩu
    const handleChangePassword = async () => {
        const data = {
            id: user.id,
            oldPassword: passData.oldPassword,
            newPassword: passData.newPassword
        };
        const res = await authApi.changePassword(data);
        if (res.success) {
            alert("Đổi mật khẩu thành công!");
            setPassData({ oldPassword: '', newPassword: '' });
        } else {
            alert(res.message);
        }
    };

    if (loading) return <div className="text-center mt-5">Đang tải...</div>;

    return (
        <div className="container my-5" style={{ maxWidth: '600px' }}>
            {/* Form Thông tin cá nhân */}
            <div className="card shadow-sm p-4 mb-4">
                <h3 className="text-success mb-4 text-center">Thông tin tài khoản</h3>
                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label className="fw-bold">Họ tên:</label>
                        <input className="form-control" value={user.fullName}
                            onChange={e => setUser({ ...user, fullName: e.target.value })}
                            disabled={!isEditing} />
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold">Email:</label>
                        <input className="form-control bg-light" value={user.email} disabled />
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold">Số điện thoại:</label>
                        <input className="form-control" value={user.phone || ''}
                            onChange={e => setUser({ ...user, phone: e.target.value })}
                            disabled={!isEditing} />
                    </div>
                    <div className="mb-3">
                        <label className="fw-bold">Địa chỉ:</label>
                        <textarea className="form-control" value={user.address || ''}
                            onChange={e => setUser({ ...user, address: e.target.value })}
                            disabled={!isEditing} />
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Hủy bỏ' : 'Chỉnh sửa'}
                        </button>
                        {isEditing && <button type="submit" className="btn btn-success">Lưu thay đổi</button>}
                    </div>
                </form>
            </div>

            {/* Form Đổi mật khẩu */}
            <div className="card shadow-sm p-4">
                <h5 className="text-success mb-3">Đổi mật khẩu</h5>
                <input type="password" placeholder="Mật khẩu cũ" className="form-control mb-2"
                    value={passData.oldPassword}
                    onChange={e => setPassData({ ...passData, oldPassword: e.target.value })} />
                <input type="password" placeholder="Mật khẩu mới" className="form-control mb-2"
                    value={passData.newPassword}
                    onChange={e => setPassData({ ...passData, newPassword: e.target.value })} />
                <button className="btn btn-warning w-100 mt-2" onClick={handleChangePassword}>
                    Xác nhận đổi mật khẩu
                </button>
            </div>
        </div>
    );
}

export default Profile;