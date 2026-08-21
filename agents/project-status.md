# Trạng thái dự án dành cho AI agent

> Cập nhật: 21/08/2026

## Bối cảnh

Codebase hiện tại là website bán laptop DTPT Shop, frontend Vite/React/TypeScript và backend Express/PostgreSQL. Chủ dự án đã quyết định chuyển toàn bộ định hướng sang website cung cấp thiết bị công nghiệp và thiết bị nghiên cứu công nghệ cao.

## Quyết định bắt buộc

- Thương hiệu phải là **DTPT Techs**.
- Không dùng tên DTPT Industrial nếu chưa có quyết định mới từ người dùng.
- Không định vị công ty là đơn vị chuyên order, nhập hộ hoặc trung gian logistics.
- Nội dung hướng khách hàng phải nhấn mạnh chất lượng, công nghệ, giá cạnh tranh, uy tín, thông số minh bạch và hỗ trợ kỹ thuật.
- Mô hình mua hàng theo nhu cầu chỉ là logic vận hành nội bộ.
- Website sẽ có catalogue rộng và có thể hiển thị giá/giá từ/khoảng giá tùy sản phẩm.
- Luồng bán hàng B2B nên dùng danh sách quan tâm/yêu cầu báo giá thay cho checkout bán lẻ hiện tại.

## Tài liệu nguồn phải đọc trước khi triển khai

- `docs/ke-hoach-chuyen-doi-dtpt-techs.md`
- `README.md`

## Trạng thái hiện tại

- Đã hoàn thành khảo sát thị trường ban đầu.
- Đã lập bản nháp đầu tiên về thương hiệu, taxonomy, catalogue, giá, nội dung và lộ trình.
- Chưa thay đổi giao diện hoặc logic ứng dụng.
- Chưa thay dữ liệu sản phẩm laptop.
- Chưa chốt slogan cuối cùng.
- Chưa chốt logo/nhận diện mới.
- Chưa chốt chính sách hiển thị VAT và bảo hành.

## Rủi ro codebase đã phát hiện trong review

- Backend tạo tài khoản admin mặc định bằng credential cố định khi thiếu biến môi trường.
- API tạo đơn hàng tin cậy dữ liệu và tổng tiền do client gửi.
- Frontend có thể báo đặt hàng thành công trước khi backend xác nhận.
- Sản phẩm hết hàng vẫn có thể thêm vào giỏ.
- Lint hiện không đạt và chưa có test tự động.
- Frontend còn cảnh báo dependency mức high từ npm audit tại thời điểm review.

Các rủi ro bảo mật cần xử lý trước khi website mới vận hành production.

## Bước tiếp theo dự kiến

1. Tiếp tục chỉnh sửa kế hoạch theo phản hồi của chủ dự án.
2. Chốt slogan, hero, danh mục homepage và chính sách giá.
3. Thiết kế data model sản phẩm công nghiệp và yêu cầu báo giá.
4. Lập kế hoạch kỹ thuật chuyển đổi codebase.
5. Chỉ bắt đầu sửa ứng dụng khi người dùng yêu cầu triển khai.

## Quy tắc cập nhật

- Khi có quyết định mới về thương hiệu, nội dung, taxonomy hoặc phạm vi, cập nhật ngay tài liệu trong `docs/` và file trạng thái này.
- Tài liệu trong `docs/` viết cho người dùng và đội dự án.
- Tài liệu trong `agents/` phải ngắn gọn, tập trung vào quyết định, trạng thái và ràng buộc cần nhớ.

