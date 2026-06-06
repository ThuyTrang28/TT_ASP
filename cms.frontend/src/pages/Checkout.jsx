import { useState } from 'react';
import productApi from '../api/productApi';

function Checkout({ cartItems, onClearCart, currentUser }) {
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const totalCartPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setMessage({ type: 'warning', text: "⚠️ Bạn cần phải Đăng nhập tài khoản ở phía trên trước khi tiến hành đặt hàng." });
            return;
        }
        setLoading(true);
        setMessage(null);

        const orderPayload = {
            customerId: currentUser.id,
            notes: notes,
            cartItems: cartItems.map(item => ({ productId: item.id, quantity: item.quantity }))
        };

        try {
            const response = await productApi.createOrder(orderPayload);
            if (response.data.success) {
                setMessage({ type: 'success', text: `🎉 Đặt đơn thành công! Mã số đơn của bạn trong SQL Server là #${response.data.orderId}. Kho đã được khấu trừ.` });
                onClearCart();
                setNotes("");
            }
        } catch (error) {
            setMessage({ type: 'danger', text: `❌ Lỗi: ${error.response?.data?.message || "Không thể đặt hàng."}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4 rounded-3 my-4 bg-white border">
            <h4 className="fw-bold text-success mb-4 text-uppercase"><i className="bi bi-cart-check me-2"></i>Thông Tin Giỏ Hàng & Xác Nhận Đơn</h4>
            {message && <div className={`alert alert-${message.type} fw-bold`}>{message.text}</div>}
            <div className="row">
                <div className="col-md-6 mb-3">
                    <h6 className="fw-bold text-secondary mb-3">1. Ghi chú vận chuyển</h6>
                    <textarea className="form-control" rows="4" placeholder="Nhập chỉ dẫn giao nhận (ví dụ: giao ngoài giờ hành chính...)" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={cartItems.length === 0}></textarea>
                </div>
                <div className="col-md-6">
                    <h6 className="fw-bold text-secondary mb-3">2. Danh sách sản phẩm mua</h6>
                    <ul className="list-group mb-3">
                        {cartItems.map((item, idx) => (
                            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center small">
                                <div>{item.name} <strong className="text-success">x{item.quantity}</strong></div>
                                <span className="text-danger fw-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                            </li>
                        ))}
                    </ul>
                    {cartItems.length > 0 ? (
                        <div>
                            <div className="d-flex justify-content-between fw-bold fs-5 mb-3 text-dark"><span>Tổng cộng:</span><span className="text-danger">{totalCartPrice.toLocaleString()}đ</span></div>
                            <button onClick={handlePlaceOrder} className="btn btn-warning w-100 fw-bold py-2 text-uppercase shadow-sm" disabled={loading}>{loading ? "Đang ghi dữ liệu..." : "Xác nhận đặt hàng"}</button>
                        </div>
                    ) : <p className="text-center text-muted py-3">Giỏ hàng của bạn đang trống.</p>}
                </div>
            </div>
        </div>
    );
}
export default Checkout;