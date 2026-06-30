import axiosClient from './axiosClient';

const productApi = {
    // 1. Nhóm API Danh mục & Bài viết
    getAllPosts: () => axiosClient.get('/Posts'),
    getLatestPosts: (count) => axiosClient.get(`/Posts/latest/${count}`),
    getPostDetail: (id) => axiosClient.get(`/Posts/${id}`),
    getPostCategories: () => axiosClient.get('/Categories'),
    getPostsByCategory: (categoryId) => axiosClient.get(`/Posts/category/${categoryId}`), 
    getPostsByPage: (page, pageSize) => axiosClient.get(`/Posts/paged`, {params: { page, pageSize }}),
    getAllBanners: () => axiosClient.get('/Banners'),

    // 2. Nhóm API Sản Phẩm
    getAll: () => axiosClient.get('/Products'),
    search: (keyword) => axiosClient.get(`/Products/search?keyword=${encodeURIComponent(keyword)}`),
    getSuggestions: (keyword) => axiosClient.get(`/Products/suggestions?keyword=${keyword}`),
    getCategories: () => axiosClient.get('/CategoryProducts'),
    getByCategory: (categoryId) => axiosClient.get(`/Products/category/${categoryId}`),
    getProductDetail: (id) => axiosClient.get(`/Products/${id}`),
    getLatestProducts: (count) => axiosClient.get(`/Products/latest/${count}`),
    getProductsByPage: (page, pageSize) =>
        axiosClient.get(`/Products/pagination?page=${page}&pageSize=${pageSize}`),

    // 3. Nhóm API Tài Khoản
    registerCustomer: (data) => axiosClient.post('/Auth/CustomerRegister', data),
    loginCustomer: (data) => axiosClient.post('/Auth/CustomerLogin', data),
    getProfile: (customerId) => axiosClient.get(`/Auth/CustomerProfile/${customerId}`),
    updateProfile: (data) => axiosClient.put('/Auth/UpdateProfile', data),
    changePassword: (data) => axiosClient.put('/Auth/ChangePassword', data),

    // 4. Nhóm API Đơn Hàng
    createOrder: (data) => axiosClient.post('/Orders', data),
    getOrderHistory: (customerId) => axiosClient.get(`/Orders/customer/${customerId}`),
    cancelOrder: (orderId) => axiosClient.post(`/Orders/cancel/${orderId}`),

};

export default productApi;