import { useState, useEffect } from 'react';
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';

function Checkout({ cartItems, onClearCart, currentUser }) {
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Khởi tạo state thông tin khách hàng
    const [customerInfo, setCustomerInfo] = useState({
        fullName: "",
        phone: "",
        address: ""
    });

    // Helper: Xử lý đường dẫn ảnh
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/60';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    // useEffect: Tự động cập nhật thông tin khi currentUser thay đổi
    useEffect(() => {
        if (currentUser) {
            setCustomerInfo({
                fullName: currentUser.fullName || "",
                phone: currentUser.phone || localStorage.getItem("customerPhone") || "",
                address: currentUser.address || localStorage.getItem("customerAddress") || ""
            });
        }
    }, [currentUser]);

    // Hàm hỗ trợ cập nhật State và LocalStorage cùng lúc
    const handleInputChange = (field, value) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }));
        localStorage.setItem(`customer${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
    };

    const totalCartPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setMessage({ type: 'warning', text: "⚠️ Bạn cần phải Đăng nhập trước khi tiến hành đặt hàng." });
            return;
        }

        setLoading(true);
        setMessage(null);

        const orderPayload = {
            customerId: currentUser.id,
            shippingName: customerInfo.fullName,
            shippingPhone: customerInfo.phone,
            shippingAddress: customerInfo.address,
            notes: notes,
            cartItems: cartItems.map(item => ({ productId: item.id, quantity: item.quantity }))
        };

        try {
            const response = await productApi.createOrder(orderPayload);
            if (response.data.success) {
                setMessage({ type: 'success', text: `🎉 Đặt hàng thành công! Mã đơn: #${response.data.orderId}.` });
                onClearCart();
                setNotes("");
            }
        } catch (error) {
            setMessage({ type: 'danger', text: `❌ Lỗi: ${error.response?.data?.message || "Không thể kết nối máy chủ."}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4 rounded-3 my-4 bg-white border">
            <h4 className="fw-bold text-success mb-4 text-uppercase">
                <i className="bi bi-cart-check me-2"></i>Thanh Toán & Xác Nhận
            </h4>

            {message && (
                <div className={`alert alert-${message.type} fw-bold`}>
                    {message.text}
                </div>
            )}

            <div className="row">
                <div className="col-md-6 mb-3">
                    <h6 className="fw-bold text-secondary mb-3">1. Thông tin giao hàng</h6>
                    <div className="mb-2">
                        <label className="small text-muted">Họ tên:</label>
                        <input className="form-control" value={customerInfo.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label className="small text-muted">Số điện thoại:</label>
                        <input className="form-control" value={customerInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="small text-muted">Địa chỉ nhận hàng:</label>
                        <textarea className="form-control" rows="2" value={customerInfo.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}></textarea>
                    </div>

                    <h6 className="fw-bold text-secondary mb-3">2. Ghi chú vận chuyển</h6>
                    <textarea className="form-control" rows="2" placeholder="Ví dụ: Giao ngoài giờ hành chính..."
                        value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </div>

                <div className="col-md-6">
                    <h6 className="fw-bold text-secondary mb-3">3. Danh sách sản phẩm</h6>
                    <ul className="list-group mb-3">
                        {cartItems.map((item, idx) => (
                            <li key={idx} className="list-group-item d-flex align-items-center gap-3">
                                <img
                                    src={getImageUrl(item.imageUrl)}
                                    alt={item.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                                <div className="flex-grow-1">
                                    <div className="fw-bold">{item.name}</div>
                                    <small className="text-muted">Số lượng: <strong>{item.quantity}</strong></small>
                                </div>
                                <span className="text-danger fw-bold">
                                    {(item.price * item.quantity).toLocaleString()}đ
                                </span>
                            </li>
                        ))}
                    </ul>

                    {cartItems.length > 0 ? (
                        <div>
                            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                                <span>Tổng cộng:</span>
                                <span className="text-danger">{totalCartPrice.toLocaleString()}đ</span>
                            </div>
                            <button onClick={handlePlaceOrder} className="btn btn-warning w-100 fw-bold py-2 text-uppercase shadow-sm" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-muted py-3">Giỏ hàng của bạn đang trống.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;