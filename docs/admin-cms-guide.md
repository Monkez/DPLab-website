# Hướng dẫn quản trị website DTPT Techs

Trang quản trị tại `/admin` hiện hoạt động như một CMS gọn nhẹ. Dữ liệu được lưu qua backend PostgreSQL; khi frontend chưa nối `VITE_API_URL`, thay đổi chỉ tồn tại trong phiên chạy và không dùng cho production.

## Sản phẩm

- Tìm theo tên, model, thương hiệu, ngành hàng hoặc tag.
- Thêm, sửa, xóa, ẩn/hiện nhanh và đánh dấu sản phẩm nổi bật.
- Quản lý giá bán, kiểu giá, thứ tự, ngành hàng, phân nhóm, tag, ảnh, mô tả, highlights, ứng dụng, thông số, bảo hành, lead time, link hãng, datasheet và SEO.
- Ảnh chấp nhận đường dẫn trong `public` như `/products/model.png` hoặc URL HTTPS. Mỗi dòng là một ảnh.
- Thông số nhập theo dạng `Tên thông số: Giá trị`, mỗi dòng một mục.

Sản phẩm ở trạng thái `draft` không xuất hiện trên website và không thể được khách gửi trong RFQ.

## Ngành hàng và phân loại

- Có thể thêm ngành hàng, sửa tên, mô tả, tên ngắn, phân nhóm và thứ tự.
- Tắt `Đang hiển thị` sẽ ẩn ngành hàng khỏi mega-menu, trang chủ và bộ lọc catalogue nhưng không xóa sản phẩm.
- Khi đổi tên ngành hàng, admin tự cập nhật các sản phẩm đang dùng tên cũ.
- Không thể xóa ngành hàng khi còn sản phẩm thuộc ngành đó.

## Thương hiệu và nội dung

- Tab `Thương hiệu` quản lý tên, slogan, logo ngang/tròn, điện thoại, email, Facebook và địa chỉ.
- Tab `Nội dung` quản lý thanh thông báo, menu, hero, sản phẩm nổi bật, năng lực, liên hệ và chân trang.
- Logo production nên dùng file tối ưu trong thư mục `public`; URL ngoài chỉ nên dùng khi nguồn ảnh ổn định và cho phép hotlink.

## Giao diện và hiển thị

- Chỉnh màu thương hiệu, màu nhấn, số cột sản phẩm và kiểu thẻ đầy đủ/gọn.
- Bật/tắt độc lập thanh thông báo, hero, ngành hàng, sản phẩm nổi bật, năng lực, liên hệ, footer, nút liên hệ nổi và ô tìm kiếm.
- Công tắc chỉ ẩn giao diện, không xóa dữ liệu. Có thể bật lại bất kỳ lúc nào.

## Quy trình an toàn

1. Sửa một nhóm nội dung và lưu.
2. Chọn `Xem website`, kiểm tra desktop và mobile.
3. Với sản phẩm mới, nên để `draft` cho đến khi ảnh, giá và thông số đã được đối chiếu.
4. Không xóa sản phẩm đã xuất hiện trong RFQ cũ nếu vẫn cần tra cứu lịch sử.

