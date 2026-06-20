import axiosClient from './axiosClient';

const productApi = {
    // 1. Nhóm API Danh mục & Bài viết
    getAllPosts: () => axiosClient.get('/Posts'),
    getLatestPosts: (count) => axiosClient.get(`/Posts/latest/${count}`),
    getPostDetail: (id) => axiosClient.get(`/Posts/${id}`),
    getPostCategories: () => axiosClient.get('/Categories'),
    getPostsByCategory: (categoryId) => axiosClient.get(`/Posts/category/${categoryId}`), 

    // 2. Nhóm API Sản Phẩm
    getAll: () => axiosClient.get('/Products'),
    getCategories: () => axiosClient.get('/CategoryProducts'),
    getByCategory: (categoryId) => axiosClient.get(`/Products/category/${categoryId}`),
    getProductDetail: (id) => axiosClient.get(`/Products/${id}`),
    getLatestProducts: (count) => axiosClient.get(`/Products/latest/${count}`),
    getProductsByPage: (page, pageSize) =>
        axiosClient.get(`/Products/pagination?page=${page}&pageSize=${pageSize}`),

    // 3. Nhóm API Tài Khoản
    registerCustomer: (data) => axiosClient.post('/Auth/CustomerRegister', data),
    loginCustomer: (data) => axiosClient.post('/Auth/CustomerLogin', data),

    // 4. Nhóm API Đơn Hàng
    createOrder: (orderData) => axiosClient.post('/Orders', orderData),
    getOrderHistory: (customerId) => axiosClient.get(`/Orders/customer/${customerId}`)
};

export default productApi;