# Triển khai kỹ thuật DTPT Techs Industrial

## Kiến trúc

- Frontend SPA: Vite, React, TypeScript; routing nhẹ bằng History API.
- Backend: Express, PostgreSQL, CORS allow-list, phiên admin ký HMAC.
- Dữ liệu cốt lõi: `products`, `quotes`, `settings`, `admin_users`, `analytics_events`.

## Mô hình sản phẩm

Sản phẩm không còn các trường đặc thù laptop. Mỗi thiết bị có ngành hàng, phân nhóm, model, thương hiệu, xuất xứ, chế độ giá, thời gian cung cấp, bảo hành, highlights, ứng dụng và bảng thông số mở rộng.

## An toàn dữ liệu RFQ

- Client chỉ gửi thông tin liên hệ và danh sách `{productId, quantity, requirement}`.
- Server tự sinh mã RFQ và thời gian tạo.
- Server đối chiếu product ID đang hoạt động, giới hạn số dòng và số lượng.
- Trạng thái RFQ chỉ được cập nhật qua API quản trị có xác thực.

## Môi trường

Frontend: `VITE_API_URL`. Backend: `DATABASE_URL`, `FRONTEND_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_DEFAULT_USERNAME`, `ADMIN_DEFAULT_PASSWORD`, `ADMIN_DEFAULT_DISPLAY_NAME`.

Không lưu credential thật vào Git. Lần khởi tạo database mới sẽ dừng nếu chưa có username/password quản trị trong môi trường.

## Kiểm tra trước deploy

Chạy `build.bat`, kiểm tra desktop/mobile trên trình duyệt, thử catalogue → chi tiết → thêm RFQ → gửi form, sau đó kiểm tra `/api/health` và deployment production.
