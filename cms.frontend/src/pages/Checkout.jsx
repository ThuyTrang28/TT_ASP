import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import để chuyển trang
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';

function Checkout({ cartItems, onClearCart, currentUser }) {
    const navigate = useNavigate(); // Khởi tạo hook chuyển trang
    const [notes, setNotes] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định là COD

    const [customerInfo, setCustomerInfo] = useState({
        fullName: "",
        phone: "",
        address: ""
    });

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/60';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    useEffect(() => {
        // 1. Log để kiểm tra xem currentUser có dữ liệu không
        console.log("Current User in Checkout:", currentUser);

        if (currentUser) {
            setCustomerInfo({
                fullName: currentUser.fullName || "",
                // Ưu tiên lấy từ currentUser, nếu không có mới lấy từ localStorage
                phone: currentUser.phone || localStorage.getItem("customerPhone") || "",
                address: currentUser.address || localStorage.getItem("customerAddress") || ""
            });
        } else {
            // Nếu không có user, lấy tạm từ localStorage (nếu có lưu trước đó)
            setCustomerInfo({
                fullName: localStorage.getItem("customerFullName") || "",
                phone: localStorage.getItem("customerPhone") || "",
                address: localStorage.getItem("customerAddress") || ""
            });
        }
    }, [currentUser]);

    const handleInputChange = (field, value) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }));
        localStorage.setItem(`customer${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
    };

    const totalCartPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra đăng nhập
        if (!currentUser) {
            setMessage({ type: 'warning', text: "⚠️ Bạn cần phải Đăng nhập trước khi tiến hành đặt hàng." });
            return;
        }

        // 2. KIỂM TRA CÁC TRƯỜNG BẮT BUỘC
        if (!customerInfo.fullName.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
            setMessage({ type: 'danger', text: "❌ Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!" });
            return; // Dừng lại không gửi request
        }

        // 3. Kiểm tra định dạng số điện thoại (Ví dụ: phải là số và có từ 10-11 chữ số)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(customerInfo.phone)) {
            setMessage({ type: 'danger', text: "❌ Số điện thoại không hợp lệ (cần 10-11 chữ số)!" });
            return;
        }

        setLoading(true);

        const orderPayload = {
            customerId: currentUser.id,
            shippingName: customerInfo.fullName,
            shippingPhone: customerInfo.phone,
            shippingAddress: customerInfo.address,
            notes: notes,
            paymentMethod: paymentMethod, // "COD" hoặc "VNPAY"
            cartItems: cartItems.map(item => ({ productId: item.id, quantity: item.quantity }))
        };

        try {
            const response = await productApi.createOrder(orderPayload);
            const result = response.data || response;

            if (result.success === true) {
                // XÓA GIỎ HÀNG Ở ĐÂY (Áp dụng cho cả VNPAY và COD)
                onClearCart();

                if (paymentMethod === "VNPAY" && result.paymentUrl) {
                    window.location.href = result.paymentUrl;
                } else {
                    navigate('/order-success');
                }
            } else {
                setMessage({ type: 'danger', text: result.message || "Đã có lỗi xảy ra." });
            }
        } catch (err) { // Đổi tên thành err
            console.error("Lỗi hệ thống:", err);
            setMessage({ type: 'danger', text: "Số lượng đặt hàng vượt quá số lượng tồn kho của sản phẩm!" });
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

                    <h6 className="fw-bold text-secondary mb-3">2. Phương thức thanh toán</h6>
                    <div className="mb-3">
                        <div className="form-check border p-2 rounded mb-2">
                            <input className="form-check-input ms-1" type="radio" name="payment" id="cod" value="COD"
                                checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <label className="form-check-label ms-2" htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                        </div>
                        <div className="form-check border p-2 rounded">
                            <input className="form-check-input ms-1" type="radio" name="payment" id="vnpay" value="VNPAY"
                                checked={paymentMethod === "VNPAY"} onChange={(e) => setPaymentMethod(e.target.value)} />
                            <label className="form-check-label ms-2" htmlFor="vnpay">Chuyển khoản / VNPAY</label>
                        </div>
                    </div>

                    <h6 className="fw-bold text-secondary mb-3">4. Ghi chú vận chuyển</h6>
                    <textarea className="form-control" rows="2" placeholder="Ví dụ: Giao ngoài giờ hành chính..."
                        value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </div>

                <div className="col-md-6">
                    {/* ... Giữ nguyên phần danh sách sản phẩm ... */}
                    <h6 className="fw-bold text-secondary mb-3">3. Danh sách sản phẩm</h6>
                    <ul className="list-group mb-3">
                        {cartItems.map((item, idx) => (
                            <li key={idx} className="list-group-item d-flex align-items-center gap-3">
                                <img src={getImageUrl(item.imageUrl)} alt={item.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div className="flex-grow-1">
                                    <div className="fw-bold">{item.name}</div>
                                    <small className="text-muted">Số lượng: <strong>{item.quantity}</strong></small>
                                </div>
                                <span className="text-danger fw-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                        <span>Tổng cộng:</span>
                        <span className="text-danger">{totalCartPrice.toLocaleString()}đ</span>
                    </div>
                    <button onClick={handlePlaceOrder} className="btn btn-warning w-100 fw-bold py-2 text-uppercase shadow-sm" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Checkout;