import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7064/api', // Đường dẫn cổng Backend .NET của Trang
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động trích xuất dữ liệu khi API phản hồi
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    }
);

export default axiosClient;