# Triển khai kỹ thuật DTPT Techs Industrial

## Kiến trúc

- Frontend SPA: Vite, React, TypeScript; build tĩnh và phục vụ bằng Node/`serve-handler` trên Railway, có fallback History API cho route trực tiếp.
- Backend: Express chạy trên Railway, PostgreSQL cùng Railway Project, CORS allow-list, phiên admin ký HMAC.
- Dữ liệu cốt lõi: `products`, `quotes`, `settings`, `admin_users`, `analytics_events`.

Production gồm ba Railway service: `frontend` public tại `www.dtpt.shop`, `backend` public tại `api.dtpt.shop`, và `Postgres` chỉ nối nội bộ. Trình duyệt gọi backend qua HTTPS công khai; chỉ backend dùng private `DATABASE_URL` của Railway.

## Mô hình sản phẩm

Sản phẩm không còn các trường đặc thù laptop. Mỗi thiết bị có ngành hàng, phân nhóm, model, thương hiệu, xuất xứ, chế độ giá, thời gian cung cấp, bảo hành, highlights, ứng dụng và bảng thông số mở rộng. Catalogue xác minh còn lưu ảnh thực tế, trang hãng, datasheet, nguồn giá, giá gốc, ngày cập nhật và ghi chú cách hình thành ngân sách tham khảo. Quy ước nguồn dữ liệu nằm tại `docs/catalog-data-sources.md`.

Nhánh `Panel PC & HMI` nằm trong `Máy tính công nghiệp`. Với model có nhiều cấu hình, giá công khai phải gắn với cấu hình tiêu chuẩn và `priceNote` phải nêu rõ những trường cần xác nhận trong báo giá.

Nhánh Advantech ADAM nằm trong `DAQ & Remote I/O`, tách theo RS-485 Remote I/O, Ethernet Remote I/O và hệ module nhiều khe. Với ADAM-5000/TCP, giá chassis/controller không bao gồm module I/O lắp trong khe và phải ghi rõ trên trang chi tiết. Backend seed hiện đồng bộ qua phiên bản catalogue `dtpt-industrial-v5-88-products`.

Catalogue phiên bản v5 có 88 sản phẩm, phân bổ đồng đều 11 model cho mỗi ngành hàng cấp một. 18 sản phẩm lõi tiếp tục nằm trong `src/data/verifiedProducts.ts`; 70 sản phẩm mở rộng nằm trong `src/data/catalogExpansion.js` và được dùng chung trực tiếp bởi frontend lẫn backend để tránh sai lệch dữ liệu. File `src/data/catalogExpansion.d.ts` cung cấp kiểu dữ liệu cho bước kiểm tra TypeScript.

Ảnh sản phẩm mở rộng được lưu cục bộ trong `public/products`. Các model cùng series có thể dùng ảnh đại diện chính thức của series khi hình dáng vỏ máy không khác biệt; nguồn ảnh luôn được giữ trong metadata nội bộ.

Mega-menu desktop dùng một vùng hover nối giữa nút `Lĩnh vực` và bảng menu, đồng thời giữ trạng thái đóng trễ ngắn để người dùng có thể di chuột chéo xuống mục con. Trạng thái `focus-within` hỗ trợ điều hướng bằng bàn phím.

## Admin CMS

Trang `/admin` quản lý đầy đủ sản phẩm, tag, ngành hàng, phân nhóm, nhận diện, nội dung và trạng thái hiển thị. Các trường CMS mở rộng vẫn nằm trong JSONB nên không cần migration schema khi nâng cấp từ dữ liệu cũ.

`StoreSettings` có ba nhóm động: `categories`, `visibility` và `appearance`. Frontend và backend đều chuẩn hóa sâu với `seedSettings`, vì vậy bản ghi settings cũ tự nhận giá trị mặc định cho trường mới. Storefront lấy taxonomy từ settings thay vì hằng số tĩnh; trạng thái `draft` của sản phẩm và `visible` của ngành hàng được áp dụng trước khi render.

Backend kiểm tra các trường bắt buộc, trạng thái và kiểu giá trước khi ghi sản phẩm. Khi đổi tên ngành hàng qua admin, frontend cập nhật tuần tự các sản phẩm liên quan rồi mới lưu settings để tránh catalogue bị lệch phân loại. Hướng dẫn sử dụng nằm tại `docs/admin-cms-guide.md`.

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
