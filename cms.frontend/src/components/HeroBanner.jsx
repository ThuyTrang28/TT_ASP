import { useState, useEffect } from 'react';
import productApi from '../api/productApi';

const BASE_URL = 'https://localhost:7064';

function HeroBanner() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await productApi.getAllBanners();
                console.log("Dữ liệu banner nhận được từ API:", res);

                // Xử lý an toàn: 
                // Nếu axiosClient trả về res.data (phổ biến) thì dùng, 
                // không thì dùng res nếu API trả về mảng trực tiếp.
                const data = res?.data || res || [];

                if (Array.isArray(data)) {
                    // Lọc dữ liệu: sử dụng b.isActive (hoặc b.isActive === true)
                    const activeBanners = data.filter(b => b.isActive === true || b.isActive === 1);
                    setBanners(activeBanners);
                } else {
                    console.warn("Dữ liệu không phải là mảng:", data);
                    setBanners([]);
                }
            } catch (err) {
                console.error("Lỗi tải HeroBanner:", err);
            }
        };
        fetchBanners();
    }, []);
    if (banners.length === 0) return null;

    return (
        <div id="heroCarousel" className="carousel slide shadow-sm mb-5" data-bs-ride="carousel"  // <--- THÊM THUỘC TÍNH NÀY VÀO ĐÂY
            data-bs-interval="3000">
            <div className="carousel-indicators">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target="#heroCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner rounded">
                {banners.map((banner, index) => (
                    <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                            src={`${BASE_URL}${banner.imageUrl}`}
                            className="d-block w-100"
                            alt={banner.title}
                            style={{ height: '500px', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </div>

            {/* Nút điều hướng */}
            <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
            </button>
        </div>
    );
}

export default HeroBanner;