import { useState, useEffect } from 'react';
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
import PolicyPage from './pages/Policy';

import productApi from './api/productApi'; // Import API để lấy dữ liệu

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newProducts, setNewProducts] = useState([]); // State lưu sản phẩm mới

    // Quản lý người dùng
    const [currentUser, setCurrentUser] = useState(() => {
        const id = localStorage.getItem("customerId");
        const name = localStorage.getItem("customerName");
        const email = localStorage.getItem("customerEmail");
        return id && id !== "undefined" ? { id, fullName: name, email: email } : null;
    });

    const [cart, setCart] = useState([]);

    // Gọi API lấy 4 sản phẩm mới nhất khi ứng dụng khởi chạy
    useEffect(() => {
        // Nếu chọn danh mục, gọi API theo danh mục, nếu không thì lấy tất cả
        if (selectedCategory) {
            productApi.getByCategory(selectedCategory)
                .then(res => setNewProducts(res.data || res))
                .catch(err => console.error("Lỗi lấy sản phẩm theo danh mục:", err));
        } else {
            // Mặc định load sản phẩm mới nhất hoặc tất cả
            productApi.getLatestProducts(4)
                .then(res => setNewProducts(res.data || res))
                .catch(err => console.error("Lỗi lấy tất cả sản phẩm:", err));
        }
    }, [selectedCategory]);

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
                onSearch={setSearchQuery}
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

                            <h4 className="fw-bold mt-4 mb-3">Sản phẩm mới nhất</h4>
                            <ProductGrid
                                products={newProducts} // Truyền dữ liệu mới nhất đã lấy từ API
                                limit={4}
                                categoryId={selectedCategory}
                                searchQuery={searchQuery}
                                onAddToCart={handleAddToCart}
                            />

                            <div className="text-center mt-3">
                                <a href="/products" className="btn btn-outline-success">Xem tất cả sản phẩm</a>
                            </div>

                            <div className="mt-5">
                                <LatestBlog currentUser={currentUser} />
                            </div>
                        </div>
                    } />

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
                    <Route path="/policy/:slug" element={<PolicyPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;