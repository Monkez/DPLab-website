# Trạng thái dự án dành cho AI agent

> Cập nhật: 06/09/2026

## Quyết định cố định

- Thương hiệu: **DTPT Techs**.
- Slogan hiện tại: **Công nghệ tiên tiến. Giá trị bền vững.**
- Không mô tả DTPT Techs như dịch vụ order/nhập hộ. Nội dung công khai nhấn mạnh công nghệ, chất lượng, giá trị đầu tư, uy tín và hỗ trợ kỹ thuật.
- Mô hình B2B là catalogue + yêu cầu báo giá, không phải giỏ hàng/checkout bán lẻ.

## Trạng thái triển khai

- Đã thay taxonomy laptop bằng 8 ngành hàng công nghiệp. Catalogue v5 hiện có 88 model, đúng 11 sản phẩm cho từng ngành hàng; mỗi model có ảnh thực tế/ảnh series, thông số và nguồn giá nội bộ.
- Đã bổ sung nhánh `Panel PC & HMI` với QY-P8156, BE-PX09 và Axiomtek GOT315A-ELK-WCD ở ba mức cấu hình/độ bền.
- Đã mở rộng Advantech ADAM-4000/6000, Seeed edge AI, Hikrobot machine vision, LiDAR Trung Quốc, camera nhiệt, PUSR, RIGOL/SIGLENT và Delta Automation; backend seed chuyển sang `dtpt-industrial-v5-88-products`.
- 70 model mở rộng dùng chung dữ liệu frontend/backend tại `backend/src/catalogExpansion.js`; tổng số ID và slug đã được kiểm tra duy nhất.
- Mega-menu `Lĩnh vực` có vùng hover nối và thời gian đóng trễ để con trỏ đi từ nút xuống bảng menu không bị mất trạng thái.
- Đã thay giao diện trang chủ, catalogue, chi tiết, RFQ và admin.
- Backend dùng bảng `quotes`, sinh ID phía server, kiểm tra product ID/số lượng và không còn credential mặc định hard-code.
- Frontend build, lint và QA trình duyệt desktop/mobile đã đạt ngày 21/08/2026.
- Kiến trúc production mục tiêu đã chuyển hoàn toàn sang Railway: service `frontend`, service `backend` và service `Postgres`; không dùng Vercel/Render sau khi cutover hoàn tất.
- Domain mục tiêu: `https://www.dtpt.shop` cho frontend và `https://api.dtpt.shop` cho backend. Frontend cần build-time variable `VITE_API_URL=https://api.dtpt.shop`.
- Frontend Railway dùng Root Directory `/`; backend dùng `/backend`. Catalogue mở rộng được đặt trong backend và frontend import trực tiếp, giúp backend deploy độc lập mà không nhân đôi dữ liệu.
- Giá trên giao diện là giá bán tại Việt Nam đã gồm VAT; không hiển thị giá gốc hay công thức lợi nhuận. Giá nội bộ ưu tiên thị trường VN, nếu chưa có thì dùng landed cost + lợi nhuận 15% + VAT dự phòng. Chi tiết nằm tại `docs/catalog-data-sources.md`.
- Dịch vụ Vercel/Render cũ phải được giữ nguyên đến khi dữ liệu PostgreSQL đã chuyển, Railway checks đạt và DNS ổn định; sau đó mới tắt để có đường rollback.
- Admin đã được nâng thành CMS chuyên sâu: CRUD/ẩn hiện sản phẩm, tag, giá, thông số, ảnh, SEO; quản lý ngành hàng/phân nhóm; sửa logo, slogan, liên hệ và toàn bộ nội dung chính; chỉnh màu, kiểu thẻ và công tắc hiển thị từng khu vực.
- Taxonomy storefront lấy từ `settings.categories`. Settings cũ được merge sâu với mặc định ở cả frontend và backend, không cần migration JSONB.
- Backend đã thêm validation tối thiểu cho product/settings và allow-list CORS cho `dtpt.shop` / `www.dtpt.shop`.
- CMS mới đã deploy production trên `https://www.dtpt.shop/admin` từ commit `2152993`; frontend và backend đều đã qua health/bootstrap check.
- Tab `Thương hiệu` hỗ trợ chọn favicon riêng cho tab trình duyệt, độc lập với logo header/footer.
- Admin đã có RBAC phía backend và tab `Tài khoản`: root lấy từ Railway, role preset/quyền tùy chỉnh, tạo/sửa/đặt lại mật khẩu/khóa/xóa tài khoản phụ. Schema `admin_users` tự migration, quyền được kiểm tra lại từ database ở mỗi request.
- Login admin không reload document; frontend refresh bootstrap trực tiếp sau khi lưu token để tránh quay lại form đăng nhập do race condition session.

## File cần đọc

- `docs/ke-hoach-chuyen-doi-dtpt-techs.md`
- `docs/technical-implementation.md`
- `docs/catalog-data-sources.md`
- `docs/deploy-railway.md`
- `README.md`

## Việc nên làm tiếp

- Xin media kit/quyền sử dụng ảnh trực tiếp từ hãng hoặc nhà phân phối trước khi chạy quảng cáo/brochure.
- Xác nhận giá, VAT, bảo hành và lead time trong từng báo giá; giá website chỉ là ngân sách tham khảo.
- Bổ sung email thông báo RFQ và CRM ở giai đoạn sau.
- Thực hiện checklist cutover Railway trong `docs/deploy-railway.md`; chưa được ghi nhận là production cho tới khi người dùng hoàn tất tạo service, secrets và DNS trên tài khoản Railway.
