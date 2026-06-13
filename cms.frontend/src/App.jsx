import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Banner from './components/Banner';
import Header from './components/Header';
import Footer from './components/Footer';
import CategoryMenu from './components/CategoryMenu';
import ProductGrid from './components/ProductGrid';
import LatestBlog from './components/LatestBlog';
import ProductDetail from './pages/ProductDetail';
import PostDetail from './pages/PostDetail';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import About from './pages/About';
import PostList from './pages/PostList';
import ProductPage from './pages/Product';

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State tìm kiếm

    // Quản lý người dùng
    const [currentUser, setCurrentUser] = useState(() => {
        const id = localStorage.getItem("customerId");
        const name = localStorage.getItem("customerName");
        const email = localStorage.getItem("customerEmail");
        return id && id !== "undefined" ? { id, fullName: name, email: email } : null;
    });

    const [cart, setCart] = useState([]);

    const handleLogout = () => {
        localStorage.clear();
        setCurrentUser(null);
        setCart([]);
    };

    const handleAddToCart = (product) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === product.id);
            return exists
                ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (id, delta) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const handleRemoveItem = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            <Header
                cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
                currentUser={currentUser}
                onLogout={handleLogout}
                searchQuery={searchQuery}
                onSearch={setSearchQuery} // Truyền hàm set xuống Header
            />

            <main className="flex-grow-1">
                <Routes>
                    <Route path="/" element={
                        <div className="container-fluid p-0">
                            <Banner />
                            {!currentUser && (
                                <div className="mb-4">
                                    <Auth
                                        onAuthSuccess={(user) => setCurrentUser(user)}
                                        onLogout={handleLogout}
                                        currentUser={currentUser}
                                    />
                                </div>
                            )}

                            <CategoryMenu onSelectCategory={setSelectedCategory} activeCategory={selectedCategory} />

                            {/* CẬP NHẬT: Thêm limit={4} để chỉ hiện 4 sản phẩm mới nhất ở trang chủ */}
                            <h4 className="fw-bold mt-4 mb-3">Sản phẩm mới nhất</h4>
                            <ProductGrid
                                limit={4}
                                categoryId={selectedCategory}
                                searchQuery={searchQuery}
                                onAddToCart={handleAddToCart}
                            />

                            {/* Thêm nút xem thêm */}
                            <div className="text-center mt-3">
                                <a href="/products" className="btn btn-outline-success">Xem tất cả sản phẩm</a>
                            </div>

                            <div className="mt-5">
                                <LatestBlog currentUser={currentUser} />
                            </div>
                        </div>
                    } />
                    {/* Trang danh sách sản phẩm */}
                    <Route path="/products" element={<ProductPage />} />

                    <Route path="/cart" element={
                        <Cart
                            cartItems={cart}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                            onClearCart={() => setCart([])}
                        />
                    } />

                    <Route path="/checkout" element={
                        <div className="container my-5">
                            <Checkout
                                cartItems={cart}
                                onClearCart={() => setCart([])}
                                currentUser={currentUser}
                            />
                        </div>
                    } />

                    <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/post" element={<PostList />} />
                    <Route path="/login" element={<Auth />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;