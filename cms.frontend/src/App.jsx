import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import CategoryMenu from './components/CategoryMenu';
import ProductGrid from './components/ProductGrid';
import LatestBlog from './components/LatestBlog';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState([]);

    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            <header className="bg-dark text-white py-3 sticky-top shadow">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-5 fw-bold m-0 text-success text-uppercase font-monospace"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedProductId(null)}>
                        <i className="bi bi-bag-heart-fill me-2"></i>Fashion CMS Platform
                    </h1>
                    <span className="badge bg-success py-2 px-3 rounded-pill">
                        <i className="bi bi-cart3 me-1"></i> Giỏ hàng ({cart.reduce((a, b) => a + b.quantity, 0)})
                    </span>
                </div>
            </header>

            {/* Chỉ hiển thị phần Đăng nhập/Đăng ký khi chưa đăng nhập */}
            {!currentUser && (
                <div className="container mt-4">
                    <Auth
                        currentUser={currentUser}
                        onAuthSuccess={(user) => setCurrentUser(user)}
                        onLogout={() => setCurrentUser(null)}
                    />
                </div>
            )}

            {/* Điều hướng hiển thị: Trang chủ hoặc Chi tiết sản phẩm */}
            <main className="flex-grow-1">
                {!selectedProductId ? (
                    <>
                        <CategoryMenu onSelectCategory={setSelectedCategory} activeCategory={selectedCategory} />
                        <div className="container my-4">
                            <ProductGrid
                                categoryId={selectedCategory}
                                onSelectProduct={setSelectedProductId}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </>
                ) : (
                    <div className="container my-4">
                        <ProductDetail
                            productId={selectedProductId}
                            onBack={() => setSelectedProductId(null)}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                )}
            </main>

            {/* Chỉ hiển thị Checkout khi giỏ hàng có sản phẩm */}
            {cart.length > 0 && (
                <div className="container mb-5 p-4 border rounded shadow-sm">
                    <h3 className="mb-3">Giỏ hàng của bạn</h3>
                    <Checkout
                        cartItems={cart}
                        onClearCart={() => setCart([])}
                        currentUser={currentUser}
                    />
                </div>
            )}

            {/* Hiển thị blog */}
            <div className="container my-4">
                <LatestBlog currentUser={currentUser} />
            </div>

            <footer className="bg-dark text-white-50 text-center py-4 mt-auto small">
                <div className="container">
                    <p className="mb-1 fw-bold text-light">TRƯỜNG CAO ĐẲNG CÔNG THƯƠNG TP.HCM</p>
                    <p className="m-0 text-secondary font-monospace">Sinh viên: Lê Nguyễn Thùy Trang | MSSV: 2123110130</p>
                </div>
            </footer>
        </div>
    );
}

export default App;