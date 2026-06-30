import { Link } from 'react-router-dom';
function Footer() {
    // Định nghĩa màu nền xanh pastel nhẹ nhàng
    const footerStyle = {
        backgroundColor: '#e8f5e9', // Màu xanh lá pastel rất nhạt
        color: '#2e7d32'            // Màu xanh lá đậm cho chữ để dễ đọc
    };

    return (
        <footer style={footerStyle} className="py-5 mt-auto border-top border-success border-opacity-25">
            <div className="container">
                <div className="row">
                    {/* Cột 1 */}
                    <div className="col-md-3">
                        <h5 className="fw-bold mb-3 text-success">TRANG CMS COMEM</h5>
                        <p className="small text-muted">
                            <i className="bi bi-geo-alt-fill me-1"></i>
                            TTTM Vincom Center Landmark 81, Vinhomes Tân Cảng, TP. Hồ Chí Minh.
                        </p>
                        <div className="d-flex gap-3 fs-5">
                            <i className="bi bi-facebook" style={{ color: '#2e7d32' }}></i>
                            <i className="bi bi-instagram" style={{ color: '#2e7d32' }}></i>
                            <i className="bi bi-tiktok" style={{ color: '#2e7d32' }}></i>
                        </div>
                    </div>

                    {/* Cột 2 */}
                    <div className="col-md-3">
                        <h5 className="fw-bold mb-3 text-success">CHĂM SÓC KHÁCH HÀNG</h5>
                        <ul className="list-unstyled small text-muted">
                            <li className="mb-2">
                                <Link to="/policy/doi-tra" className="text-decoration-none text-muted">Chính sách đổi trả</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/policy/bao-mat" className="text-decoration-none text-muted">Chính sách bảo mật</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/policy/thanh-toan" className="text-decoration-none text-muted">Chính sách thanh toán</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/policy/dieu-khoan" className="text-decoration-none text-muted">Điều khoản dịch vụ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div className="col-md-3">
                        <h5 className="fw-bold mb-3 text-success">GIỜ MỞ CỬA</h5>
                        <p className="small text-muted">9:00 - 21:30 (Cả tuần)</p>
                        <h5 className="fw-bold mb-3 text-success">GÓP Ý - KHIẾU NẠI</h5>
                        <p className="small text-muted">
                            <i className="bi bi-telephone-fill me-1"></i> 0387 898 352 <br />
                            <i className="bi bi-envelope-fill me-1"></i> trangcms@comem.com
                        </p>
                    </div>

                    {/* Cột 4 */}
                    <div className="col-md-3">
                        <h5 className="fw-bold mb-3 text-success">VỀ TRANG CMS</h5>
                        <ul className="list-unstyled small text-muted">
                            <li className="mb-2">
                                <Link to="/about" className="text-decoration-none text-dark">
                                    Giới thiệu cửa hàng
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/about" className="text-decoration-none text-dark">
                                    Liên hệ hợp tác
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/about" className="text-decoration-none text-dark">
                                    Hệ thống cửa hàng
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Phần bản quyền */}
                <div className="text-center mt-4 pt-3 border-top border-success border-opacity-25 text-muted small">
                    <p>© 2026 Trang CMS Cosmetics. Giấy phép kinh doanh số 0387898352</p>
                    <div className="d-flex justify-content-center gap-3">
                        <i className="bi bi-credit-card fs-4"></i>
                        <i className="bi bi-bank fs-4"></i>
                        <i className="bi bi-truck fs-4"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;