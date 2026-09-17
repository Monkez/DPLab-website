# Hướng dẫn quản trị website DTPT Techs

Trang quản trị tại `/admin` hiện hoạt động như một CMS gọn nhẹ. Dữ liệu được lưu qua backend PostgreSQL; khi frontend chưa nối `VITE_API_URL`, thay đổi chỉ tồn tại trong phiên chạy và không dùng cho production.

## Tài khoản và phân quyền

- Tài khoản gốc được xác định bởi `ADMIN_DEFAULT_USERNAME` trên Railway, luôn có vai trò **Chủ sở hữu** và không thể bị khóa, hạ quyền hoặc xóa trong CMS.
- Tab `Tài khoản` cho phép tạo tài khoản, đặt lại mật khẩu, khóa/mở khóa, đổi vai trò và xóa tài khoản phụ.
- Vai trò mẫu: Chủ sở hữu, Quản trị viên, Biên tập catalogue, Biên tập nội dung, Kinh doanh và Chỉ xem.
- Chọn `Quyền tùy chỉnh` để bật riêng từng quyền: báo giá, sản phẩm, phân loại, thương hiệu, nội dung, giao diện, analytics, tài khoản hoặc reset hệ thống.
- Quyền được kiểm tra tại backend cho từng API. Việc ẩn tab trên frontend chỉ giúp giao diện gọn hơn, không phải lớp bảo mật duy nhất.
- Không thể tự khóa hoặc tự xóa tài khoản đang đăng nhập; hệ thống luôn giữ ít nhất một Chủ sở hữu đang hoạt động.
- Mật khẩu tài khoản mới được đặt tự do, không giới hạn tối thiểu 10 ký tự; cần nhập mật khẩu không rỗng. Khi sửa tài khoản, để trống mật khẩu để giữ nguyên, hoặc nhập mật khẩu mới với độ dài tùy chọn.

Sau lần deploy đầu tiên có phân quyền, các phiên admin cũ sẽ tự đăng xuất một lần để nhận hồ sơ quyền mới.

## Sản phẩm

- Tìm theo tên, model, thương hiệu, ngành hàng hoặc tag.
- Thêm, sửa, xóa, ẩn/hiện nhanh và đánh dấu sản phẩm nổi bật.
- Quản lý giá bán, kiểu giá, thứ tự, ngành hàng, phân nhóm, tag, ảnh, mô tả, highlights, ứng dụng, thông số, bảo hành, lead time, link hãng, datasheet và SEO.
- Ảnh chấp nhận đường dẫn trong `public` như `/products/model.png` hoặc URL HTTPS. Mỗi dòng là một ảnh.
- Thông số nhập theo dạng `Tên thông số: Giá trị`, mỗi dòng một mục.

Sản phẩm ở trạng thái `draft` không xuất hiện trên website và không thể được khách gửi trong RFQ.

## Tin tức

- Tab `Tin tức` cho phép tạo, sửa, chuyển nháp/xuất bản và xóa bài viết.
- Mỗi bài có tiêu đề, slug, mô tả ngắn, nội dung, cover, chuyên mục, tag, tác giả, ngày xuất bản và metadata SEO riêng.
- Nội dung giữ Markdown đơn giản với heading `##`, `###`, danh sách `-` và ảnh trong bài.
- Đặt con trỏ trong nội dung, chọn **+ Chèn ảnh trong bài**, chọn một/nhiều ảnh từ máy hoặc nhập URL HTTPS/đường dẫn `/products/...`. Nhập mô tả và chú thích rồi bấm **Áp dụng ảnh**. Khi chọn nhiều ảnh, mô tả/chú thích ban đầu áp dụng chung.
- Mục **Ảnh trong bài** có nút sửa mô tả/chú thích, thay ảnh hoặc xóa riêng từng ảnh. **Xem trước nội dung** dùng cùng cách hiển thị với trang công khai. Ảnh cover vẫn độc lập.
- Nhấn **Lưu bài viết** để lưu mọi thay đổi. Xóa ảnh khỏi bài không xóa tệp dùng chung. Ảnh tải lên có URL công khai; không dùng cho tài liệu riêng tư kể cả khi bài còn là nháp.
- Ảnh tải lên phải là JPG/PNG/WebP tĩnh, tối đa 5 MB và 40 megapixel; backend xoay ảnh đúng hướng, thu nhỏ tối đa 1920px và chuyển WebP bỏ metadata. Cần backend đã cập nhật và quyền `articles.manage`.
- Có thể viết ảnh trực tiếp trên một dòng riêng: `![Mô tả](</products/anh.jpg> "Chú thích")`. Chú thích là tùy chọn; hỗ trợ nhiều ảnh giữa các đoạn. Không nhúng HTML.
- Bài nháp không xuất hiện công khai và không được đưa vào sitemap.
- Vai trò Biên tập nội dung và Quản trị viên có quyền quản lý tin tức mặc định; tài khoản tùy chỉnh cần quyền `articles.manage`.

Hướng dẫn SEO và quy trình gửi sitemap nằm tại `docs/seo-and-news-guide.md`.

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

## Báo cáo lưu lượng

- Tab `Lưu lượng` tổng hợp theo 7, 30, 90 hoặc 365 ngày và so sánh với kỳ liền trước có cùng độ dài.
- Chỉ số tổng quan gồm lượt xem, người truy cập, phiên truy cập, số trang mỗi phiên, tỷ lệ thoát và thời gian phiên trung bình.
- Các bảng phân tích cho biết trang/sản phẩm được quan tâm, nguồn truy cập, chiến dịch UTM, thiết bị, trình duyệt, hệ điều hành và khung giờ truy cập.
- Nguồn chiến dịch nhận các tham số `utm_source`, `utm_medium`, `utm_campaign`. Nếu không có UTM, hệ thống dùng website giới thiệu hoặc xếp vào `Trực tiếp`.
- Hệ thống dùng mã ngẫu nhiên trong trình duyệt để phân biệt người truy cập và phiên; một phiên mới bắt đầu sau 30 phút không hoạt động. Hệ thống không lưu địa chỉ IP hay thông tin định danh cá nhân. Lượt xem khu vực `/admin` không được ghi nhận.
- Thời gian phiên là ước tính từ lượt xem đầu đến lượt xem cuối trong cùng tab; phiên chỉ có một lượt xem có thời gian bằng 0 và được tính vào tỷ lệ thoát.
- Chủ sở hữu có nút `Xóa dữ liệu` để xóa toàn bộ sự kiện lưu lượng. Hệ thống luôn hỏi xác nhận trước khi xóa và thao tác không thể hoàn tác.

Ngày tháng trên storefront và admin được hiển thị thống nhất theo `ngày/tháng/năm`; thời điểm có thêm giờ và phút theo múi giờ Việt Nam.

## Quy trình an toàn

1. Sửa một nhóm nội dung và lưu.
2. Chọn `Xem website`, kiểm tra desktop và mobile.
3. Với sản phẩm mới, nên để `draft` cho đến khi ảnh, giá và thông số đã được đối chiếu.
4. Không xóa sản phẩm đã xuất hiện trong RFQ cũ nếu vẫn cần tra cứu lịch sử.

## Tải ảnh sản phẩm từ máy tính

Trong **Sản phẩm → Thêm sản phẩm** (hoặc **Sửa**), tìm mục **Ảnh sản phẩm**, bấm **Chọn ảnh từ máy tính** rồi chọn một hoặc nhiều ảnh JPG/PNG/WebP, tối đa 5 MB mỗi ảnh. Không cần nhập URL. Xem ảnh đã tải, dùng **Đặt làm ảnh đại diện** hoặc nút bỏ ảnh nếu cần, sau đó bấm **Lưu sản phẩm**. Nút lưu tạm khóa khi ảnh đang tải; lỗi lưu không đóng form.

Backend cung cấp `POST /api/product-media` với quyền `products.manage`, dùng bộ xử lý ảnh hiện có và bảng media PostgreSQL để lưu bền vững; ảnh được trả công khai tại `GET /api/product-media/:id`. Không cần quyền `articles.manage`. Cần deploy cả frontend/backend và cấu hình `VITE_API_URL`. Bản xem trước không có API sẽ báo rõ chưa thể tải ảnh.

Kiểm tra: HTTP upload/đọc ảnh WebP, từ chối thiếu quyền/sai định dạng/quá dung lượng; QA trình duyệt chọn ảnh → lưu → tải lại với máy chủ kiểm thử dùng bộ nhớ. Chưa kiểm tra lưu với PostgreSQL thật trong môi trường local.
