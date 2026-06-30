import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Header from './components/Header';
import Footer from './components/Footer';
import CategoryMenu from './components/CategoryMenu';
import ProductGrid from './components/ProductGrid';
import LatestBlog from './components/LatestBlog';
import Register from './components/Register';
import Login from './components/Login';
import ProductDetail from './pages/ProductDetail';
import PostDetail from './pages/PostDetail';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import About from './pages/About';
import PostList from './pages/PostList';
import ProductPage from './pages/Product';
import PolicyPage from './pages/Policy';
import OrderSuccess from './pages/OrderSuccess'; 
import OrderFailed from './pages/OrderFailed';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import HeroBanner from './components/HeroBanner';

import productApi from './api/productApi';
import { Link } from 'react-router-dom';

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newProducts, setNewProducts] = useState([]);

    // Quản lý người dùng
    const [currentUser, setCurrentUser] = useState(() => {
        const id = localStorage.getItem("customerId");
        const name = localStorage.getItem("customerName");
        const email = localStorage.getItem("customerEmail");
        return id && id !== "undefined" ? { id, fullName: name, email: email } : null;
    });

    // 1. Quản lý giỏ hàng: Khởi tạo từ localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cartItems"); // <--- KEY LÀ 'cartItems'
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Đồng bộ giỏ hàng với localStorage mỗi khi 'cart' thay đổi
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }, [cart]);

    // Gọi API lấy 4 sản phẩm mới nhất khi ứng dụng khởi chạy
    useEffect(() => {
        if (selectedCategory) {
            productApi.getByCategory(selectedCategory)
                .then(res => setNewProducts(res.data || res))
                .catch(err => console.error("Lỗi lấy sản phẩm theo danh mục:", err));
        } else {
            productApi.getLatestProducts(4)
                .then(res => setNewProducts(res.data || res))
                .catch(err => console.error("Lỗi lấy tất cả sản phẩm:", err));
        }
    }, [selectedCategory]);

    // Thêm đoạn này vào App.js, ngay dưới useEffect lấy sản phẩm mới nhất
    useEffect(() => {
        if (searchQuery.trim() !== "") {
            productApi.search(searchQuery)
                .then(res => setNewProducts(res.data || res))
                .catch(err => console.error("Lỗi tìm kiếm sản phẩm:", err));
        } else {
            // Nếu xóa từ khóa, load lại sản phẩm mặc định (giữ nguyên logic cũ của bạn)
            if (selectedCategory) {
                productApi.getByCategory(selectedCategory)
                    .then(res => setNewProducts(res.data || res));
            } else {
                productApi.getLatestProducts(4)
                    .then(res => setNewProducts(res.data || res));
            }
        }
    }, [searchQuery]); // Chỉ chạy lại khi searchQuery thay đổi

    const handleLogout = () => {
        localStorage.clear();
        setCart([]);          // Lệnh này phải hoạt động được ở đây
        setCurrentUser(null); // Lệnh này phải hoạt động được ở đây
        alert("Bạn đã đăng xuất!");
        window.location.reload();
    };

    const handleAddToCart = (product) => {
        // Kiểm tra đăng nhập
        const isLoggedIn = localStorage.getItem("customerId"); // Hoặc dùng biến state currentUser

        if (!isLoggedIn) {
            alert("Vui lòng đăng nhập để thực hiện chức năng này!");
            // Chuyển hướng về trang đăng nhập
            window.location.href = "/login";
            return; // Dừng hàm, không thực hiện thêm vào giỏ
        }

        // Nếu đã đăng nhập, tiếp tục logic thêm vào giỏ
        setCart(prev => {
            const exists = prev.find(i => i.id === product.id);
            // Sử dụng product.finalPrice làm giá bán thực tế
            const priceToUse = product.finalPrice || product.price;

            return exists
                ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
                : [...prev, { ...product, quantity: 1, price: priceToUse }]; // Lưu giá đã giảm vào giỏ
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
                            <HeroBanner />
                            <CategoryMenu onSelectCategory={setSelectedCategory} activeCategory={selectedCategory} />

                            <h4 className="fw-bold mt-4 mb-3">Sản phẩm mới nhất</h4>
                            <ProductGrid
                                products={newProducts}
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

                    <Route path="/products" element={
                        <ProductPage onAddToCart={handleAddToCart} />
                    } />

                    <Route path="/cart" element={
                        <Cart
                            cartItems={cart}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                            onClearCart={() => setCart([])}
                        />
                    } />

                    <Route path="/checkout" element={
                        localStorage.getItem("customerId") ? (
                            <div className="container my-5">
                                <Checkout
                                    cartItems={cart}
                                    onClearCart={() => setCart([])}
                                    currentUser={currentUser}
                                />
                            </div>
                        ) : (
                            <div className="container text-center my-5">
                                <p>Bạn cần đăng nhập để thanh toán.</p>
                                <Link to="/login" className="btn btn-success">Đến trang đăng nhập</Link>
                            </div>
                        )
                    } />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/post" element={<PostList />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login onLoginSuccess={(user) => setCurrentUser(user)} />} />
                    <Route path="/policy/:slug" element={<PolicyPage />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/order-failed" element={<OrderFailed />} />
                    <Route path="/order-history" element={<OrderHistory currentUser={currentUser} />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;