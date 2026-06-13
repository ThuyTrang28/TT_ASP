import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://localhost:7064';

const Cart = ({ cartItems, onUpdateQuantity, onRemove, onClearCart }) => {
    const navigate = useNavigate();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Hàm xử lý đường dẫn ảnh để đảm bảo hiển thị đúng
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/60';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath}`;
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-5">
                <h3>Giỏ hàng của bạn đang trống</h3>
                <button className="btn btn-success mt-3" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h2 className="fw-bold mb-4">Giỏ hàng của bạn</h2>
            <div className="table-responsive">
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <img
                                        src={getImageUrl(item.imageUrl)}
                                        alt={item.name}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.price.toLocaleString('vi-VN')} đ</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="mx-3">{item.quantity}</span>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                    >
                                        +
                                    </button>
                                </td>
                                <td>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => onRemove(item.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-end mt-4">
                <h4>Tổng cộng: <span className="text-danger fw-bold">{total.toLocaleString('vi-VN')} đ</span></h4>
                <button className="btn btn-outline-danger me-2" onClick={onClearCart}>Xóa giỏ hàng</button>
                <button
                    className="btn btn-success px-4"
                    onClick={() => navigate('/checkout')}
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default Cart;