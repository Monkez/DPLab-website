# Hướng dẫn quản trị website DTPT Techs

Trang quản trị tại `/admin` hiện hoạt động như một CMS gọn nhẹ. Dữ liệu được lưu qua backend PostgreSQL; khi frontend chưa nối `VITE_API_URL`, thay đổi chỉ tồn tại trong phiên chạy và không dùng cho production.

## Tài khoản và phân quyền

- Tài khoản gốc được xác định bởi `ADMIN_DEFAULT_USERNAME` trên Railway, luôn có vai trò **Chủ sở hữu** và không thể bị khóa, hạ quyền hoặc xóa trong CMS.
- Tab `Tài khoản` cho phép tạo tài khoản, đặt lại mật khẩu, khóa/mở khóa, đổi vai trò và xóa tài khoản phụ.
- Vai trò mẫu: Chủ sở hữu, Quản trị viên, Biên tập catalogue, Biên tập nội dung, Kinh doanh và Chỉ xem.
- Chọn `Quyền tùy chỉnh` để bật riêng từng quyền: báo giá, sản phẩm, phân loại, thương hiệu, nội dung, giao diện, analytics, tài khoản hoặc reset hệ thống.
- Quyền được kiểm tra tại backend cho từng API. Việc ẩn tab trên frontend chỉ giúp giao diện gọn hơn, không phải lớp bảo mật duy nhất.
- Không thể tự khóa hoặc tự xóa tài khoản đang đăng nhập; hệ thống luôn giữ ít nhất một Chủ sở hữu đang hoạt động.
- Mật khẩu tài khoản mới và mật khẩu thay thế phải có ít nhất 10 ký tự. Không dùng chung mật khẩu giữa nhân sự.

Sau lần deploy đầu tiên có phân quyền, các phiên admin cũ sẽ tự đăng xuất một lần để nhận hồ sơ quyền mới.

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

- Tab `Thương hiệu` quản lý tên, slogan, logo ngang/tròn, icon tab trình duyệt (favicon), điện thoại, email, Facebook và địa chỉ.
- Tab `Nội dung` quản lý thanh thông báo, menu, hero, sản phẩm nổi bật, năng lực, liên hệ và chân trang.
- Logo production nên dùng file tối ưu trong thư mục `public`; URL ngoài chỉ nên dùng khi nguồn ảnh ổn định và cho phép hotlink.
- Favicon nên là ảnh vuông PNG, SVG hoặc ICO; kích thước nguồn khuyến nghị từ 64 × 64 px trở lên.

## Giao diện và hiển thị

- Chỉnh màu thương hiệu, màu nhấn, số cột sản phẩm và kiểu thẻ đầy đủ/gọn.
- Bật/tắt độc lập thanh thông báo, hero, ngành hàng, sản phẩm nổi bật, năng lực, liên hệ, footer, nút liên hệ nổi và ô tìm kiếm.
- Công tắc chỉ ẩn giao diện, không xóa dữ liệu. Có thể bật lại bất kỳ lúc nào.

## Quy trình an toàn

1. Sửa một nhóm nội dung và lưu.
2. Chọn `Xem website`, kiểm tra desktop và mobile.
3. Với sản phẩm mới, nên để `draft` cho đến khi ảnh, giá và thông số đã được đối chiếu.
4. Không xóa sản phẩm đã xuất hiện trong RFQ cũ nếu vẫn cần tra cứu lịch sử.
