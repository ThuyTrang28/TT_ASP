import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7064/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});


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