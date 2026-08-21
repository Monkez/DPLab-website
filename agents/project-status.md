# Trạng thái dự án dành cho AI agent

> Cập nhật: 21/08/2026

## Quyết định cố định

- Thương hiệu: **DTPT Techs**.
- Slogan hiện tại: **Công nghệ tiên tiến. Giá trị bền vững.**
- Không mô tả DTPT Techs như dịch vụ order/nhập hộ. Nội dung công khai nhấn mạnh công nghệ, chất lượng, giá trị đầu tư, uy tín và hỗ trợ kỹ thuật.
- Mô hình B2B là catalogue + yêu cầu báo giá, không phải giỏ hàng/checkout bán lẻ.

## Trạng thái triển khai

- Đã thay taxonomy laptop bằng 8 ngành hàng công nghiệp và 36 sản phẩm mẫu.
- Đã thay giao diện trang chủ, catalogue, chi tiết, RFQ và admin.
- Backend dùng bảng `quotes`, sinh ID phía server, kiểm tra product ID/số lượng và không còn credential mặc định hard-code.
- Frontend build và lint đã đạt ngày 21/08/2026; còn kiểm thử trình duyệt và deploy production.

## File cần đọc

- `docs/ke-hoach-chuyen-doi-dtpt-techs.md`
- `docs/technical-implementation.md`
- `README.md`

## Việc nên làm tiếp

- Thay minh họa category bằng ảnh sản phẩm chính hãng có quyền sử dụng.
- Xác nhận giá, VAT, bảo hành và lead time trước khi coi catalogue là dữ liệu thương mại chính thức.
- Bổ sung email thông báo RFQ và CRM ở giai đoạn sau.
