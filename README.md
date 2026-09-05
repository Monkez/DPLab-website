# DTPT Techs Industrial Website

Website catalogue B2B cho **DTPT Techs**, tập trung vào thiết bị công nghiệp, đo lường, machine vision, tự động hóa và thiết bị nghiên cứu. Frontend dùng Vite + React + TypeScript; backend dùng Express + PostgreSQL.

Production: [www.dtpt.shop](https://www.dtpt.shop) · API dự kiến: [api.dtpt.shop](https://api.dtpt.shop/api/health)

## Chạy nhanh trên Windows

- `setup.bat`: cài dependency frontend và backend, tạo file môi trường mẫu nếu chưa có.
- `run.bat`: chạy đồng thời frontend và backend trong một cửa sổ.
- `build.bat`: lint, build frontend và kiểm tra cú pháp backend.
- `check-production.bat`: kiểm tra frontend, API health và catalogue sau khi chuyển DNS.

Backend cần `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_DEFAULT_USERNAME` và `ADMIN_DEFAULT_PASSWORD` trong `backend/.env`. Frontend vẫn chạy được với catalogue tích hợp sẵn nếu chưa cấu hình `VITE_API_URL`.

## Luồng nghiệp vụ

Khách duyệt catalogue → thêm thiết bị vào danh sách → gửi yêu cầu kỹ thuật/báo giá. Backend tự sinh mã RFQ, kiểm tra sản phẩm và số lượng; quản trị viên theo dõi trạng thái tại `/admin`.

## API chính

- `GET /api/health`, `GET /api/bootstrap`, `GET /api/products`
- `POST /api/quotes`
- Admin: quản lý sản phẩm, yêu cầu báo giá, cài đặt và người dùng

Admin CMS tại `/admin` còn hỗ trợ tag/phân loại, nội dung trang chủ, logo/slogan, màu sắc và công tắc ẩn/hiện từng khu vực. Xem [docs/admin-cms-guide.md](docs/admin-cms-guide.md).

## Deploy

- Toàn bộ production chạy trong một Railway Project gồm `frontend`, `backend` và `Postgres`.
- Frontend dùng root directory `/`, build `npm run build`, start `npm start`.
- Backend dùng root directory `/` vì catalogue dùng chung nằm tại `src/data`; build `npm run build:backend`, start `npm run start:backend` và kết nối Postgres bằng Railway reference variable.
- Quy trình dựng service, chuyển dữ liệu, kiểm thử và đổi DNS: [docs/deploy-railway.md](docs/deploy-railway.md).

Chi tiết kiến trúc và quy trình nằm trong [docs/technical-implementation.md](docs/technical-implementation.md).
