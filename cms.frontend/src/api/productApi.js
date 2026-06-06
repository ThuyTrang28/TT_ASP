import axiosClient from './axiosClient';

const productApi = {
    // 1. Nhóm API Trang Chủ & Danh mục
    // Đổi tên thành getAllCategories để khớp với gọi API trong CategoryMenu
    getCategories: () => axiosClient.get('/CategoryProducts'),

    // Nhóm Bài viết (LatestBlog)
    getLatestPosts: () => axiosClient.get('/Posts'),
    getPostDetail: (id) => axiosClient.get(`/Posts/${id}`),

    // 2. Nhóm API Cửa Hàng & Sản Phẩm (Dùng cho ProductGrid)
    // Đổi thành getAll để khớp với gọi hàm trong ProductGrid.jsx
    getAll: () => axiosClient.get('/Products'),
    getByCategory: (categoryId) => axiosClient.get(`/Products/category/${categoryId}`),
    getDetail: (id) => axiosClient.get(`/Products/${id}`),

    // 3. Nhóm API Tài Khoản Khách Hàng (Dùng cho Auth.jsx)
    register: (data) => axiosClient.post('/Auth/CustomerRegister', data),
    login: (data) => axiosClient.post('/Auth/CustomerLogin', data),

    // 4. Nhóm API Đơn Hàng (Dùng cho Checkout.jsx)
    createOrder: (orderData) => axiosClient.post('/Orders', orderData),
    getHistory: (customerId) => axiosClient.get(`/Orders/customer/${customerId}`)
};

export default productApi;