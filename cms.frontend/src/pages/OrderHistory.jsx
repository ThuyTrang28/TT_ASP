import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../api/productApi';

const OrderHistory = ({ currentUser }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = currentUser?.id || localStorage.getItem("userId");
        if (!userId) {
            setLoading(false);
            return;
        }

        productApi.getOrderHistory(userId)
            .then(res => {
                const data = res?.data || res || [];
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setError("Có lỗi xảy ra khi tải dữ liệu.");
                setLoading(false);
            });
    }, [currentUser]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            try {
                await productApi.cancelOrder(orderId);
                alert("Hủy đơn hàng thành công!");
                window.location.reload();
            } catch (err) {
                console.error("Lỗi hủy đơn:", err);
                alert("Không thể hủy đơn hàng.");
            }
        }
    };
    const getStatusConfig = (status) => {
        switch (status) {
            case 0: return { label: "Chờ duyệt", class: "bg-warning text-dark" };
            case 1: return { label: "Đang giao", class: "bg-primary text-white" };
            case 2: return { label: "Đã xong", class: "bg-success text-white" };
            case 3: return { label: "Đã hủy", class: "bg-danger text-white" };
            default: return { label: "Không xác định", class: "bg-secondary" };
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex align-items-center mb-4">
                <Link to="/" className="btn btn-outline-secondary btn-sm me-3">
                    <i className="bi bi-arrow-left"></i>
                </Link>
                <h3 className="fw-bold m-0 text-success"><i className="bi bi-receipt-cutoff me-2"></i>Lịch sử đơn hàng</h3>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {!error && orders.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-3 shadow-sm border">
                    <i className="bi bi-bag-x display-1 text-muted"></i>
                    <h5 className="mt-3">Bạn chưa có đơn hàng nào!</h5>
                    <Link to="/" className="btn btn-success mt-3">Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Mã đơn</th>
                                    <th>Ngày đặt</th>
                                        <th>Tổng tiền</th>
                                        <th>Thanh toán</th>
                                    <th>Trạng thái</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const status = getStatusConfig(order.status);
                                    const isPaid = order.paymentMethod !== 'COD';
                                    return (
                                        <tr key={order.id}>
                                            <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                                            <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                            <td className="fw-bold">{(order.totalPrice || 0).toLocaleString()}đ</td>
                                            {/* HIỂN THỊ TRẠNG THÁI THANH TOÁN */}
                                            <td>
                                                {isPaid ? (
                                                    <span className="badge bg-success-subtle text-success border border-success">
                                                        <i className="bi bi-check-circle me-1"></i> Đã thanh toán (VnPay)
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning-subtle text-dark border border-warning">
                                                        <i className="bi bi-cash-stack me-1"></i> Chưa thanh toán (COD)
                                                    </span>
                                                )}
                                            </td>
                                            <td><span className={`badge ${status.class} px-3 py-2`}>{status.label}</span></td>
                                            <td className="text-center">
                                                {order.status === 0 && (
                                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelOrder(order.id)}>
                                                        Hủy đơn
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;