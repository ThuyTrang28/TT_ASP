/* Sinh viên: Lê Nguyễn Thùy Trang
 * MSSV: 2123110130
 * Lớp: CCQ2311D
 * Mô tả: Dịch vụ gọi API Đăng ký và Đăng nhập Khách hàng sang .NET Backend
 */

// Trang kiểm tra số Port của dự án Backend .NET (trong file launchSettings.json) và thay thế vào đây nhé
const BASE_URL = "https://localhost:7064/api/Auth";

export const authApi = {
    // 1. API Đăng ký tài khoản khách hàng
    customerRegister: async (registerData) => {
        try {
            const response = await fetch(`${BASE_URL}/CustomerRegister`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData), // Gửi FullName, Email, Password, Phone, Address
            });
            return await response.json();
        } catch (error) {
            console.error("Lỗi kết nối API Register:", error);
            return { success: false, message: "Không thể kết nối đến máy chủ Backend." };
        }
    },

    // 2. API Đăng nhập khách hàng
    customerLogin: async (loginData) => {
        try {
            const response = await fetch(`${BASE_URL}/CustomerLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData), // Gửi Email, Password
            });

            if (!response.ok) {
                // Nếu lỗi 401 Unauthorized hoặc 400 Bad Request
                const errResult = await response.json();
                return { success: false, message: errResult.message || "Đăng nhập thất bại." };
            }

            return await response.json();
        } catch (error) {
            console.error("Lỗi kết nối API Login:", error);
            return { success: false, message: "Không thể kết nối đến máy chủ Backend." };
        }
    },

    // 3. API Lấy thông tin cá nhân
    getProfile: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/CustomerProfile/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            return await response.json();
        } catch (error) {
            console.error("Lỗi lấy thông tin Profile:", error);
            return { success: false, message: "Lỗi kết nối server." };
        }
    },

    // 4. API Cập nhật thông tin cá nhân
    updateProfile: async (profileData) => {
        try {
            const response = await fetch(`${BASE_URL}/UpdateProfile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileData),
            });
            return await response.json();
        } catch (error) {
            console.error("Lỗi cập nhật Profile:", error);
            return { success: false, message: "Lỗi kết nối server." };
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await fetch(`${BASE_URL}/ChangePassword`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(passwordData),
            });
            return await response.json();
        } catch (error) {
            console.error("Chi tiết lỗi:", error); // Sử dụng biến error
            return { success: false, message: "Lỗi kết nối server." };
        }
    }
};