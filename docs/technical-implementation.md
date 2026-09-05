# Triển khai kỹ thuật DTPT Techs Industrial

## Kiến trúc

- Frontend SPA: Vite, React, TypeScript; build tĩnh và phục vụ bằng Node/`serve-handler` trên Railway, có fallback History API cho route trực tiếp.
- Backend: Express chạy trên Railway, PostgreSQL cùng Railway Project, CORS allow-list, phiên admin ký HMAC.
- Dữ liệu cốt lõi: `products`, `articles`, `quotes`, `settings`, `admin_users`, `analytics_events`.

Production gồm ba Railway service: `frontend` public tại `www.dtpt.shop`, `backend` public tại `api.dtpt.shop`, và `Postgres` chỉ nối nội bộ. Trình duyệt gọi backend qua HTTPS công khai; chỉ backend dùng private `DATABASE_URL` của Railway.

Nguồn catalogue mở rộng dùng chung nằm tại `backend/src/catalogExpansion.js`; frontend import trực tiếp nguồn này khi build. Nhờ vậy backend Railway có thể dùng Root Directory `/backend` độc lập, còn frontend dùng repository root `/`.

## Mô hình sản phẩm

Sản phẩm không còn các trường đặc thù laptop. Mỗi thiết bị có ngành hàng, phân nhóm, model, thương hiệu, xuất xứ, chế độ giá, thời gian cung cấp, bảo hành, highlights, ứng dụng và bảng thông số mở rộng. Catalogue xác minh còn lưu ảnh thực tế, trang hãng, datasheet, nguồn giá, giá gốc, ngày cập nhật và ghi chú cách hình thành ngân sách tham khảo. Quy ước nguồn dữ liệu nằm tại `docs/catalog-data-sources.md`.

Nhánh `Panel PC & HMI` nằm trong `Máy tính công nghiệp`. Với model có nhiều cấu hình, giá công khai phải gắn với cấu hình tiêu chuẩn và `priceNote` phải nêu rõ những trường cần xác nhận trong báo giá.

Nhánh Advantech ADAM nằm trong `DAQ & Remote I/O`, tách theo RS-485 Remote I/O, Ethernet Remote I/O và hệ module nhiều khe. Với ADAM-5000/TCP, giá chassis/controller không bao gồm module I/O lắp trong khe và phải ghi rõ trên trang chi tiết. Backend seed hiện đồng bộ qua phiên bản catalogue `dtpt-industrial-v5-88-products`.

Catalogue phiên bản v5 có 88 sản phẩm, phân bổ đồng đều 11 model cho mỗi ngành hàng cấp một. 18 sản phẩm lõi tiếp tục nằm trong `src/data/verifiedProducts.ts`; 70 sản phẩm mở rộng nằm trong `backend/src/catalogExpansion.js` và được dùng chung trực tiếp bởi frontend lẫn backend để tránh sai lệch dữ liệu. File `backend/src/catalogExpansion.d.ts` cung cấp kiểu dữ liệu cho bước kiểm tra TypeScript.

Ảnh sản phẩm mở rộng được lưu cục bộ trong `public/products`. Các model cùng series có thể dùng ảnh đại diện chính thức của series khi hình dáng vỏ máy không khác biệt; nguồn ảnh luôn được giữ trong metadata nội bộ.

Mega-menu desktop dùng một vùng hover nối giữa nút `Lĩnh vực` và bảng menu, đồng thời giữ trạng thái đóng trễ ngắn để người dùng có thể di chuột chéo xuống mục con. Trạng thái `focus-within` hỗ trợ điều hướng bằng bàn phím.

## Admin CMS

Trang `/admin` quản lý đầy đủ sản phẩm, tag, ngành hàng, phân nhóm, nhận diện, nội dung và trạng thái hiển thị. Các trường CMS mở rộng vẫn nằm trong JSONB nên không cần migration schema khi nâng cấp từ dữ liệu cũ.

`StoreSettings` có ba nhóm động: `categories`, `visibility` và `appearance`. Frontend và backend đều chuẩn hóa sâu với `seedSettings`, vì vậy bản ghi settings cũ tự nhận giá trị mặc định cho trường mới. Storefront lấy taxonomy từ settings thay vì hằng số tĩnh; trạng thái `draft` của sản phẩm và `visible` của ngành hàng được áp dụng trước khi render.

Backend kiểm tra các trường bắt buộc, trạng thái và kiểu giá trước khi ghi sản phẩm. Khi đổi tên ngành hàng qua admin, frontend cập nhật tuần tự các sản phẩm liên quan rồi mới lưu settings để tránh catalogue bị lệch phân loại. Hướng dẫn sử dụng nằm tại `docs/admin-cms-guide.md`.

RBAC được lưu trực tiếp trong `admin_users` qua `role`, `permissions` JSONB, `active` và `is_root`. `initDatabase()` dùng `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, vì vậy database Railway hiện hữu tự nâng cấp khi backend khởi động. Mỗi request quản trị tải lại user hiện tại từ database; khóa tài khoản hoặc đổi quyền có hiệu lực ngay với token đang tồn tại. Các route sản phẩm, báo giá, settings, analytics và tài khoản đều có permission middleware phía server. Với settings dùng chung một endpoint, backend còn so sánh từng nhóm dữ liệu để ngăn tài khoản sửa phần không được cấp quyền.

Tài khoản trùng `ADMIN_DEFAULT_USERNAME` được bảo đảm là root/owner sau mỗi lần khởi động nhưng mật khẩu không bị reset lại từ environment. Nếu bảng chưa có tài khoản này và Railway có đủ username/password, backend sẽ tạo tài khoản gốc.

Sau khi login, frontend giữ nguyên trang và gọi lại bootstrap bằng token vừa nhận thay vì reload toàn bộ document. Cách này tránh race condition giữa khôi phục session, bootstrap và `/api/admin/me`, đồng thời nạp ngay dữ liệu theo quyền của tài khoản.

Bài viết được lưu riêng trong bảng `articles` dưới dạng JSONB, có unique index theo slug. Public bootstrap chỉ trả bài `published`; tài khoản có `articles.manage` nhận cả bản nháp. Frontend có trang `/tin-tuc`, route chi tiết `/tin-tuc/:slug` và trình biên tập Markdown đơn giản trong admin.

Frontend server chèn metadata SEO vào HTML trước khi gửi response. Sitemap `/sitemap.xml` được frontend proxy từ `/api/sitemap.xml`, vì vậy sản phẩm/bài viết mới xuất bản được đưa vào sitemap mà không cần build lại frontend. Cache dữ liệu SEO là 5 phút.

`asyncRoute` phải chuyển tiếp đủ `(req, res, next)` cho permission middleware. Nếu bỏ `next`, mọi route RBAC sẽ lỗi `TypeError: next is not a function` dù token và database hợp lệ.

## An toàn dữ liệu RFQ

- Client chỉ gửi thông tin liên hệ và danh sách `{productId, quantity, requirement}`.
- Server tự sinh mã RFQ và thời gian tạo.
- Server đối chiếu product ID đang hoạt động, giới hạn số dòng và số lượng.
- Trạng thái RFQ chỉ được cập nhật qua API quản trị có xác thực.

## Môi trường

Frontend: `VITE_API_URL`. Backend: `DATABASE_URL`, `DATABASE_SSL`, `FRONTEND_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_DEFAULT_USERNAME`, `ADMIN_DEFAULT_PASSWORD`, `ADMIN_DEFAULT_DISPLAY_NAME`.

`DATABASE_SSL` mặc định được suy ra từ hostname: tắt cho local/private Railway, bật cho kết nối database ngoài. Có thể đặt rõ `true` hoặc `false` khi nhà cung cấp yêu cầu.

Không lưu credential thật vào Git. Lần khởi tạo database mới sẽ dừng nếu chưa có username/password quản trị trong môi trường.

## Kiểm tra trước deploy

Chạy `build.bat`, kiểm tra desktop/mobile trên trình duyệt, thử catalogue → chi tiết → thêm RFQ → gửi form, sau đó chạy `check-production.bat` và kiểm tra deployment logs trên Railway. Quy trình production đầy đủ nằm tại `docs/deploy-railway.md`.
