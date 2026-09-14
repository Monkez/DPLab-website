# Tin tức và SEO DTPT Techs

## Đăng bài

1. Đăng nhập `/admin`, chọn **Tin tức** rồi **Viết bài**.
2. Nhập tiêu đề, mô tả ngắn, nội dung, ảnh cover, chuyên mục và tag.
3. Nội dung hỗ trợ Markdown đơn giản: `##` cho tiêu đề cấp hai, `###` cho cấp ba và `-` cho danh sách; ảnh xen kẽ dùng cú pháp ở mục “Cú pháp ảnh cho dtpt.shop” bên dưới.
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

## Lịch biên tập định kỳ

Mục tiêu 3 bài/tuần, 10:00 thứ Hai/Tư/Sáu giờ Việt Nam, bắt đầu từ lịch kế tiếp sau 12/09/2026. Mỗi lần tối đa một bài mới khoảng 400–700 từ. Ưu tiên chất lượng; bỏ qua khi không có chủ đề đủ giá trị. Lịch được quản lý trong Codex với tên **Biên tập tin tức hai website DTPT**, không phải tác vụ chạy trong backend. Khung 09:00 của lịch chung dành cho dptech.shop; khung 10:00 dành riêng cho website này.

Khoảng 40% tin công nghệ công nghiệp có phân tích ứng dụng, 40% hướng dẫn kỹ thuật/chọn thiết bị và 20% so sánh hoặc checklist đầu tư. Chủ đề: industrial PC, Panel PC/HMI, Edge AI, machine vision, cảm biến, đo lường, kết nối và tự động hóa. Thủ thuật máy tính/Windows chỉ khi phục vụ máy trạm kỹ thuật hoặc hệ thống công nghiệp. Giữ định vị catalogue + yêu cầu báo giá; không mô tả dịch vụ order/nhập hộ hoặc đưa nội dung thuê laptop từ dptech.shop sang đây.

### Tiêu chuẩn trước đăng

- Đọc catalogue và bài hiện có, tránh trùng câu hỏi, không đăng lại hoặc chỉ đổi vài từ từ website khác của DTPT.
- Kiểm chứng ngày công bố, model, phiên bản, thông số và phạm vi áp dụng bằng tài liệu hãng. Phân biệt thông tin hãng, nhận định biên tập và kiểm thử thực tế; không bịa benchmark, giá, tồn kho, lead time hoặc dự án khách hàng.
- Mỗi bài giải quyết một nhu cầu: ứng dụng cụ thể, cách chọn, giới hạn, sai lầm thường gặp hoặc các bước có kết quả kiểm chứng. Không dịch lại thông cáo dài hoặc nhồi từ khóa để lấp lịch.
- Ưu tiên ảnh sản phẩm thực/ảnh hãng đã có trong catalogue hoặc ảnh phù hợp quyền sử dụng. Ghi nguồn và đúng model; ảnh series phải ghi rõ. Không dùng ảnh AI làm ảnh thiết bị thật, bằng chứng đo lường hoặc ảnh hướng dẫn. Ảnh minh họa AI chỉ dùng khi cần và có nhãn.
- Dẫn nguồn có thể kiểm tra; renderer hiện hỗ trợ Markdown đơn giản, cần xem trước để bảo đảm liên kết/ảnh thể hiện đúng, không để cú pháp Markdown không hỗ trợ hiện nguyên văn. Tối ưu title/description, heading, alt, tag và liên kết nội bộ có ích. Không hứa thứ hạng Google.
- Thủ thuật hệ thống phải đúng phiên bản, có cách kiểm tra/hoàn tác khi phù hợp; không khuyên vô hiệu hóa bảo vệ, can thiệp dây chuyền đang chạy hoặc thay tham số điều khiển thiếu điều kiện an toàn.

### Bố trí nhiều ảnh trong bài tự động

- Khi lập dàn ý, xác định phần nào cần ảnh để giải thích. Với bài 400–700 từ, ưu tiên 2–3 ảnh trong nội dung nếu có ảnh phù hợp, ngoài ảnh đại diện; đây là gợi ý, không phải chỉ tiêu bắt buộc. Không mặc định chỉ dùng ảnh đầu bài, không lặp lại cùng ảnh để đủ số lượng.
- Đặt mỗi ảnh ngay sau đoạn/bước liên quan. Bài hướng dẫn ưu tiên ảnh giao diện đúng bước; bài so sánh ưu tiên ảnh đúng thiết bị/chi tiết đang so sánh. Không giả ảnh chụp màn hình bằng AI hoặc dùng ảnh thiết bị thay bằng chứng thao tác.
- Mỗi ảnh có alt mô tả đúng nội dung, chú thích giải thích giá trị của ảnh và nguồn/chủ sở hữu có thể kiểm chứng. Ảnh series, ảnh minh họa hoặc AI phải ghi rõ. Khi thiếu ảnh hợp lệ, dùng ít ảnh hơn và ghi lý do trong ghi chú biên tập, không bịa hoặc chèn ảnh không liên quan.
- Trước xuất bản, kiểm tra từng URL ảnh tải được, không chứa dữ liệu riêng tư; kiểm tra xem trước desktop/mobile, thứ tự ảnh, chú thích, không tràn ngang và không lộ cú pháp. Sau xuất bản, mở lại bài công khai kiểm tra đủ ảnh, alt và chú thích. Code đã push không đồng nghĩa production đã hỗ trợ: xác minh bản triển khai trước khi đăng.
- Áp dụng cho bài mới và lần sửa bài được giao. Không tự xuất bản lại hoặc sửa hàng loạt bài cũ để thêm ảnh.

### Cú pháp ảnh cho dtpt.shop (Markdown)

`coverImage` là ảnh đại diện; ảnh xen kẽ nằm trong trường `content`. Mỗi ảnh trên một dòng riêng, ngăn với đoạn văn bằng dòng trống:

```markdown
Đoạn giải thích bước hoặc thiết bị.

![Mô tả chính xác nội dung ảnh](</products/ten-anh.jpg> "Giải thích ảnh. Nguồn: tên chủ sở hữu.")

Đoạn nội dung tiếp theo.
```

Ví dụ chỉ mô tả cú pháp; thay bằng ảnh đã xác minh. Hỗ trợ đường dẫn `/products/...`, URL HTTPS hoặc `/api/article-media/<uuid>` thực tế. Không chèn HTML figure/img vào Markdown. Escape dấu ngoặc vuông, dấu nháy kép và dấu gạch chéo ngược trong alt/chú thích bằng helper `imageMarkdown` tại `src/utils/articleMarkdown.ts` khi tạo nội dung bằng code.

Đọc `docs/admin-cms-guide.md` khi thao tác CMS. Có thể chèn nhiều ảnh từ máy, sửa/thay/xóa riêng từng ảnh và xem trước. API POST `/api/article-media` nhận binary JPG/PNG/WebP tĩnh, cần Bearer token với quyền `articles.manage`; tối đa 5 MB/ảnh và 40 megapixel. Lấy `path` thực tế trong response để đưa vào Markdown, không tự tạo UUID. Ảnh được chuyển WebP và lưu PostgreSQL; frontend giải quyết `/api/article-media/...` theo `VITE_API_URL`. Không upload tài liệu riêng tư vì URL ảnh công khai kể cả bài nháp. Backend phải triển khai hỗ trợ upload trước frontend.

Ghi nguồn gốc kiểm chứng được trong hồ sơ biên tập và chú thích. Renderer hiện không hỗ trợ đầy đủ Markdown liên kết: không mặc định `[nguồn](URL)` sẽ thành liên kết; kiểm tra thực tế, có thể ghi URL nguồn dưới dạng văn bản. Dùng `ArticleBody`/xem trước để kiểm tra ảnh, không chỉ kiểm tra chuỗi JSON. Khi thêm ảnh trong `public/products`, chờ frontend deploy và xác minh URL trước khi xuất bản bài qua CMS/API.

### Cách xuất bản của automation

Đọc hướng dẫn người dùng, AGENTS.md nếu có, `agents/project-status.md` và tài liệu này. Kiểm tra Git tại đúng dự án Sell-Laptop-Website. Dùng CMS `/admin` hoặc API đã xác thực có quyền `articles.manage`: tạo nháp, kiểm tra ảnh/nội dung rồi xuất bản. Không lưu token, mật khẩu hay session trong Git.

`backend/src/articleSeed.js` chỉ seed khi bảng articles rỗng; thêm bài vào seed rồi push **không** tự xuất bản lên PostgreSQL hiện có. Không reset/truncate DB để nhập bài. Nếu chưa có phiên biên tập hoặc quyền xuất bản, chuẩn bị bài và nguồn/ảnh đã kiểm tra trong `docs/editorial/`, báo rõ phần còn cần quyền; không báo đã đăng và không tạo các bản nháp trùng mỗi lần chạy. Khi thêm tài nguyên/mã nguồn cần build/lint/test phù hợp, review diff rồi commit/push an toàn.

Sau đăng, kiểm tra API public, trang chi tiết, ảnh, metadata và sitemap trên tên miền đang hoạt động. Kiểm tra ngày 12/09/2026: `https://dtpt.shop/` trả 200; bundle production dùng backend `https://dtpt-shop-production.up.railway.app`, `/api/bootstrap` trả 88 sản phẩm và 3 bài công khai. `www.dtpt.shop` và `api.dtpt.shop` chưa truy cập được trong lần kiểm tra này; không mặc định hai alias đã hoạt động. Kiểm tra lại cấu hình công khai khi chạy. Metadata frontend có cache 5 phút; chờ hết cache khi kiểm tra thay đổi. Chỉ thông báo khi hoàn thành, lỗi hoặc cần người dùng xử lý; giữ im lặng khi không có thay đổi đáng kể.

Chủ đề gợi ý: xác định cổng COM trước khi chọn industrial PC; chọn nguồn và nhiệt độ cho máy tính không quạt; kiểm tra tương thích SDK camera với Windows; phân biệt thông số AI lý thuyết và hiệu năng ứng dụng thực tế. Mỗi chủ đề phải được kiểm chứng lại khi viết.
