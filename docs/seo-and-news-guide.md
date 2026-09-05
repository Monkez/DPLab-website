# Tin tức và SEO DTPT Techs

## Đăng bài

1. Đăng nhập `/admin`, chọn **Tin tức** rồi **Viết bài**.
2. Nhập tiêu đề, mô tả ngắn, nội dung, ảnh cover, chuyên mục và tag.
3. Nội dung hỗ trợ Markdown đơn giản: `##` cho tiêu đề cấp hai, `###` cho cấp ba và `-` cho danh sách.
4. Giữ trạng thái **Bản nháp** trong lúc biên tập; chọn **Xuất bản** khi nội dung đã được kiểm tra.
5. SEO title nên khoảng 50–60 ký tự; SEO description nên khoảng 140–160 ký tự. Nếu để trống, website dùng tiêu đề và mô tả ngắn.

Bài xuất bản xuất hiện tại `/tin-tuc`, trang chủ và sitemap. Bản nháp chỉ xuất hiện trong admin. Quyền `articles.manage` kiểm soát toàn bộ thao tác tạo, sửa, xuất bản và xóa bài.

## SEO kỹ thuật đã triển khai

- Canonical URL cho trang chủ, catalogue, sản phẩm, tin tức và bài chi tiết.
- Title, meta description, robots, Open Graph và Twitter Card theo từng URL.
- JSON-LD loại `Organization`, `Product` và `Article`.
- Sitemap động lấy sản phẩm đang hoạt động và bài đã xuất bản từ PostgreSQL.
- `robots.txt` cho phép crawl website, chặn `/admin` và khai báo sitemap.
- HTML production được chèn metadata phía server trước khi JavaScript chạy, giúp crawler và bot chia sẻ mạng xã hội đọc đúng nội dung.
- Ảnh nội dung dùng alt text; heading của bài theo cấu trúc H1 → H2/H3.

## Sau khi deploy

1. Railway frontend phải có `VITE_API_URL` trỏ đúng backend public.
2. Kiểm tra `https://www.dtpt.shop/robots.txt` và `https://www.dtpt.shop/sitemap.xml`.
   Có thể chạy `check-seo.bat` hoặc `check-seo.bat https://<railway-frontend-domain>` để kiểm tra tự động.
3. Thêm property `https://www.dtpt.shop` vào Google Search Console, xác minh domain bằng DNS.
4. Gửi sitemap `https://www.dtpt.shop/sitemap.xml` trong **Indexing → Sitemaps**.
5. Dùng **URL Inspection** yêu cầu lập chỉ mục trang chủ, `/san-pham`, `/tin-tuc` và các bài quan trọng.
6. Theo dõi Core Web Vitals, Pages indexed và lỗi structured data sau mỗi đợt deploy lớn.

Google không bảo đảm thứ hạng chỉ nhờ SEO kỹ thuật. Nội dung cần nguyên bản, giải quyết đúng nhu cầu tìm kiếm B2B, có thông số đáng tin cậy, liên kết nội bộ tới sản phẩm liên quan và được cập nhật định kỳ.
