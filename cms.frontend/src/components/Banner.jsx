const Banner = () => {
    return (
        <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="3000"
        >
            {/* Chú thích trong JSX phải nằm trong ngoặc nhọn thế này */}
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5" aria-label="Slide 6"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="6" aria-label="Slide 7"></button>
            </div>

            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="images/banner1.webp" className="d-block w-100" alt="Banner 1" style={{ height: '500px', objectFit: 'cover' }} />
                </div>
                <div className="carousel-item">
                    <img src="images/banner2.webp" className="d-block w-100" alt="Banner 2" style={{ height: '500px', objectFit: 'cover' }} />
                </div>
                <div className="carousel-item">
                    <img src="images/banner3.webp" className="d-block w-100" alt="Banner 3" style={{ height: '500px', objectFit: 'cover' }} />
                </div>
                <div className="carousel-item">
                    <img src="images/banner4.webp" className="d-block w-100" alt="Banner 3" style={{ height: '500px', objectFit: 'cover' }} />
                </div>
                <div className="carousel-item">
                    <img src="images/banner5.webp" className="d-block w-100" alt="Banner 3" style={{ height: '500px', objectFit: 'cover' }} />
                </div>
                <div className="carousel-item">
                    <img src="images/banner6.webp" className="d-block w-100" alt="Banner 3" style={{ height: '500px', objectFit: 'cover' }} />
                </div>
                <div className="carousel-item">
                    <img src="images/banner7.webp" className="d-block w-100" alt="Banner 3" style={{ height: '500px', objectFit: 'cover' }} />
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default Banner;