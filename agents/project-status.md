# Trạng thái dự án dành cho AI agent

> Cập nhật: 21/08/2026

## Quyết định cố định

- Thương hiệu: **DTPT Techs**.
- Slogan hiện tại: **Công nghệ tiên tiến. Giá trị bền vững.**
- Không mô tả DTPT Techs như dịch vụ order/nhập hộ. Nội dung công khai nhấn mạnh công nghệ, chất lượng, giá trị đầu tư, uy tín và hỗ trợ kỹ thuật.
- Mô hình B2B là catalogue + yêu cầu báo giá, không phải giỏ hàng/checkout bán lẻ.

## Trạng thái triển khai

- Đã thay taxonomy laptop bằng 8 ngành hàng công nghiệp. Catalogue công khai hiện có 15 model đã đối chiếu thay cho 36 sản phẩm mẫu; mỗi model có ảnh thật, thông số, link hãng/datasheet và nguồn giá.
- Đã bổ sung nhánh `Panel PC & HMI` với QY-P8156, BE-PX09 và Axiomtek GOT315A-ELK-WCD ở ba mức cấu hình/độ bền; backend seed dùng phiên bản `dtpt-industrial-v3-panel-pc`.
- Đã thay giao diện trang chủ, catalogue, chi tiết, RFQ và admin.
- Backend dùng bảng `quotes`, sinh ID phía server, kiểm tra product ID/số lượng và không còn credential mặc định hard-code.
- Frontend build, lint và QA trình duyệt desktop/mobile đã đạt ngày 21/08/2026.
- Production frontend: `https://dtpt-techs-industrial.vercel.app`.
- Giá trên giao diện là giá bán tại Việt Nam đã gồm VAT; không hiển thị giá gốc hay công thức lợi nhuận. Giá nội bộ ưu tiên thị trường VN, nếu chưa có thì dùng landed cost + lợi nhuận 15% + VAT dự phòng. Chi tiết nằm tại `docs/catalog-data-sources.md`.
- Backend cần được provision PostgreSQL/biến môi trường trên Render và nối qua `VITE_API_URL` để RFQ lưu tập trung; khi chưa nối, frontend dùng catalogue và trạng thái local.

## File cần đọc

- `docs/ke-hoach-chuyen-doi-dtpt-techs.md`
- `docs/technical-implementation.md`
- `docs/catalog-data-sources.md`
- `README.md`

## Việc nên làm tiếp

- Xin media kit/quyền sử dụng ảnh trực tiếp từ hãng hoặc nhà phân phối trước khi chạy quảng cáo/brochure.
- Xác nhận giá, VAT, bảo hành và lead time trong từng báo giá; giá website chỉ là ngân sách tham khảo.
- Bổ sung email thông báo RFQ và CRM ở giai đoạn sau.
