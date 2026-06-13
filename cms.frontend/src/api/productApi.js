import axiosClient from './axiosClient';

const productApi = {
    // 1. Nhóm API Danh mục & Bài viết
    getCategories: () => axiosClient.get('/CategoryProducts'),
    getLatestPosts: () => axiosClient.get('/Posts'),
    getPostDetail: (id) => axiosClient.get(`/Posts/${id}`),

    // 2. Nhóm API Sản Phẩm
    getAll: () => axiosClient.get('/Products'),
    getByCategory: (categoryId) => axiosClient.get(`/Products/category/${categoryId}`),
    // Cập nhật tên hàm thành getProductDetail để khớp với ProductDetail.jsx
    getProductDetail: (id) => axiosClient.get(`/Products/${id}`),

    // 3. Nhóm API Tài Khoản Khách Hàng
    // Cập nhật tên hàm thành registerCustomer và loginCustomer để khớp với Auth.jsx
    registerCustomer: (data) => axiosClient.post('/Auth/CustomerRegister', data),
    loginCustomer: (data) => axiosClient.post('/Auth/CustomerLogin', data),

    // 4. Nhóm API Đơn Hàng
    createOrder: (orderData) => axiosClient.post('/Orders', orderData),
    // Cập nhật thành getOrderHistory để khớp với LatestBlog.jsx
    getOrderHistory: (customerId) => axiosClient.get(`/Orders/customer/${customerId}`)
};

export default productApi;