# Trạng thái dự án dành cho AI agent

> Cập nhật: 17/09/2026

## Quyết định cố định

- Thương hiệu: **DTPT Techs**.
- Slogan hiện tại: **Thiết bị đo lường và tự động hóa**
- Không mô tả DTPT Techs như dịch vụ order/nhập hộ. Nội dung công khai nhấn mạnh công nghệ, chất lượng, giá trị đầu tư, uy tín và hỗ trợ kỹ thuật.
- Mô hình B2B là catalogue + yêu cầu báo giá, không phải giỏ hàng/checkout bán lẻ.

## Quy ước nội dung

- Viết trực tiếp về thiết bị, công việc và điều kiện cung cấp; tránh khẩu hiệu chung chung, câu đối ngắn và tự nhận uy tín/chất lượng khi thiếu bằng chứng.
- Migration `storefront_copy_20260917` chỉ thay câu mẫu cũ khớp chính xác; giữ nội dung chủ website đã sửa khác và các cài đặt còn lại.

## Cải tiến hành trình khách hàng 17/09/2026

- Danh mục seed 89 model, thêm MEAN WELL HDR-60-24 giá liên hệ; 8 model nổi bật được chọn lại theo nhóm ứng dụng, vẫn sửa được qua CMS.
- Pháp nhân và liên hệ do chủ website xác nhận: CÔNG TY TNHH DTPT-TECHS, 0110774870; 0903463185; dtpttechs@gmail.com; ĐKKD tại tầng 4, 146 Trần Vỹ, Phú Diễn, Hà Nội.
- Có trang `/huong-dan-mua-hang`, tìm kiếm không dấu/mobile, lọc thương hiệu/ngân sách, form tư vấn không cần chọn sản phẩm; họ tên/điện thoại bắt buộc, email/đơn vị tùy chọn. Offline chỉ soạn email và giữ danh sách.
- Mật khẩu tạo/đổi tài khoản không còn tối thiểu 10 ký tự; không rỗng khi tạo, để trống khi sửa để giữ mật khẩu cũ.
- Hai migration một lần cập nhật liên hệ/nội dung danh mục và thứ tự/nổi bật. Giữ version catalogue v5 để tránh cơ chế reset dữ liệu cũ.
- Xem `docs/vietnam-market-and-customer-audit.md` cho cơ sở thị trường, kiểm thử và giới hạn.

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
- Đã sửa async route wrapper chuyển tiếp Express `next`, tránh lỗi 500 trên `/api/admin/me` và `/api/admin/users` khi RBAC middleware cho phép request.
- Đã bổ sung CMS Tin tức: bảng `articles`, 3 bài seed, danh sách/chi tiết public, bài nổi bật ở trang chủ, CRUD admin và quyền `articles.manage`.
- Hero trang chủ có CTA `Tin tức` riêng; header và khối bài viết cuối trang cũng đều dẫn tới `/tin-tuc` trên desktop/mobile.
- Header desktop giữ cùng lưới 1180px với body, dùng logo/menu/tìm kiếm/CTA dạng gọn và khóa nhãn một dòng; dưới 1120px tự chuyển sang menu mobile.
- SEO kỹ thuật có canonical, Open Graph/Twitter, JSON-LD Organization/Product/Article và sitemap động từ PostgreSQL. Frontend server chèn metadata vào HTML trước khi trả crawler; hướng dẫn Search Console tại `docs/seo-and-news-guide.md`.
- Có `check-seo.bat [frontend-url]` để kiểm tra HTTP, title, description, canonical, JSON-LD, robots và sitemap sau deploy.
- Ngày hiển thị trên storefront/admin được chuẩn hóa `dd/mm/yyyy` theo múi giờ Việt Nam; giá trị ngày trong form và API vẫn dùng ISO.
- Admin có dashboard `Lưu lượng` chuyên sâu: so sánh kỳ trước, lượt xem/người/phiên, tỷ lệ thoát, thời gian phiên, xu hướng ngày, trang/sản phẩm, nguồn, UTM, thiết bị, trình duyệt, hệ điều hành, khung giờ và lượt xem gần đây. Tracking không lưu IP và loại trừ `/admin`; root/owner có nút xác nhận để xóa toàn bộ dữ liệu lưu lượng.

## File cần đọc

- `docs/ke-hoach-chuyen-doi-dtpt-techs.md`
- `docs/technical-implementation.md`
- `docs/catalog-data-sources.md`
- `docs/deploy-railway.md`
- `docs/seo-and-news-guide.md`
- `README.md`

## Việc nên làm tiếp

- Xin media kit/quyền sử dụng ảnh trực tiếp từ hãng hoặc nhà phân phối trước khi chạy quảng cáo/brochure.
- Xác nhận giá, VAT, bảo hành và lead time trong từng báo giá; giá website chỉ là ngân sách tham khảo.
- Bổ sung email thông báo RFQ và CRM ở giai đoạn sau.
- Thực hiện checklist cutover Railway trong `docs/deploy-railway.md`; chưa được ghi nhận là production cho tới khi người dùng hoàn tất tạo service, secrets và DNS trên tài khoản Railway.

## 14/09/2026 — Ảnh trong bài

- Bổ sung chèn nhiều ảnh tại con trỏ Markdown, sửa/thay/xóa riêng từng ảnh, alt/caption, preview chung renderer public; giữ cover và bài cũ.
- `article_media` BYTEA lưu ảnh WebP bằng PostgreSQL, tự tạo bảng khi boot; POST cần articles.manage, GET công khai. Không xóa media khi xóa bài. Backend cần sharp và phải deploy trước frontend.
- Build/lint/unit và tích hợp PostgreSQL local đã kiểm tra. Dữ liệu QA riêng, không dùng production. Chưa xác minh triển khai Railway lần này.

## Production xác minh 18/09/2026

- Railway project DTPT-XuatNhapKhau (141c25ae-8dd2-4ddf-8afa-241cbc3f0992), environment production. Frontend fontend-dtpt-shop phục vụ https://dtpt.shop; backend backend-dtpt-shop tại https://dtpt-shop-production.up.railway.app. Cả hai tự deploy qua GitHub. Đây là địa chỉ thực tế, khác các domain mục tiêu trong hướng dẫn cũ.
- API health/bootstrap đã trả 200 với catalogue SBC mới. Không dùng api.dtpt.shop/www.dtpt.shop để kết luận site lỗi.
- Catalogue 98 model, 9 cấu hình SBC; giá 7 cấu hình giảm 10% theo chủ website, 2 ROCK 5B giữ liên hệ. Migration embedded_prices_20260918_10pct chạy một lần, giữ trường nội dung khác và chỉnh sửa giá CMS về sau.

## 18/09/2026 — Tùy chọn sản phẩm

- Generic variants (tối đa 6 loại/100 cấu hình) trong JSON sản phẩm: options, giá, model, trạng thái, ảnh và thông số. Admin sửa trong trang sản phẩm; danh mục hiển thị giá thấp nhất, detail yêu cầu chọn đủ tùy chọn.
- Seed 98 bản ghi/93 hiển thị: gom Pi 5, Orange Pi 5 Plus, ROCK 5B. Migration product_variants_20260918 trong transaction giữ dữ liệu CMS; 5 bản ghi cũ draft + redirectTo. Không bump catalogVersion vì sẽ reset catalogue.
- RFQ dùng khóa productId + variantId, lưu nhãn/model snapshot từ server; tự ánh xạ ID cũ. Link slug cũ 301 đến trang chung + query variant, canonical trang chung.
- QA local: lưu giá cấu hình qua admin/API, chọn RAM + màu sắc trên mobile không tràn, gửi RFQ hai cấu hình và đọc lại đúng hai dòng. Kiểm tra migration bằng mock transaction; production sẽ kiểm tra sau push.
