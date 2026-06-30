import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className="text-center py-5">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            <h2 className="mt-3">Đặt hàng thành công!</h2>
            <p className="text-muted">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
            <div className="mt-4">
                <Link to="/order-history" className="btn btn-success me-2">Xem lịch sử đơn hàng</Link>
                <Link to="/" className="btn btn-outline-secondary">Về trang chủ</Link>
            </div>
        </div>
    );
};
export default OrderSuccess;