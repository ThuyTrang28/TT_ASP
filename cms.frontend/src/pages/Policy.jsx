import { useParams } from 'react-router-dom';

function PolicyPage() {
    const { slug } = useParams();

    const getContent = () => {
        switch (slug) {
            case 'doi-tra': return { title: "Chính sách đổi trả", body: "Nội dung đổi trả trong 7 ngày..." };
            case 'bao-mat': return { title: "Chính sách bảo mật", body: "Chúng tôi cam kết bảo mật thông tin..." };
            case 'thanh-toan': return { title: "Chính sách thanh toán", body: "Nội dung chính sách thanh toán..." };
            default: return { title: "Thông tin", body: "Đang cập nhật nội dung..." };
        }
    };

    const { title, body } = getContent();

    return (
        <div className="container my-5">
            <h2 className="text-success fw-bold">{title}</h2>
            <hr />
            <p>{body}</p>
        </div>
    );
}

export default PolicyPage;