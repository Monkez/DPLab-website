# DTPT Techs Industrial Website

Website catalogue B2B cho **DTPT Techs**, tập trung vào thiết bị công nghiệp, đo lường, machine vision, tự động hóa và thiết bị nghiên cứu. Frontend dùng Vite + React + TypeScript; backend dùng Express + PostgreSQL.

Production: [dtpt-techs-industrial.vercel.app](https://dtpt-techs-industrial.vercel.app)

## Chạy nhanh trên Windows

- `setup.bat`: cài dependency frontend và backend, tạo file môi trường mẫu nếu chưa có.
- `run.bat`: chạy đồng thời frontend và backend trong một cửa sổ.
- `build.bat`: lint, build frontend và kiểm tra cú pháp backend.

Backend cần `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_DEFAULT_USERNAME` và `ADMIN_DEFAULT_PASSWORD` trong `backend/.env`. Frontend vẫn chạy được với catalogue tích hợp sẵn nếu chưa cấu hình `VITE_API_URL`.

## Luồng nghiệp vụ

Khách duyệt catalogue → thêm thiết bị vào danh sách → gửi yêu cầu kỹ thuật/báo giá. Backend tự sinh mã RFQ, kiểm tra sản phẩm và số lượng; quản trị viên theo dõi trạng thái tại `/admin`.

## API chính

- `GET /api/health`, `GET /api/bootstrap`, `GET /api/products`
- `POST /api/quotes`
- Admin: quản lý sản phẩm, yêu cầu báo giá, cài đặt và người dùng

Admin CMS tại `/admin` còn hỗ trợ tag/phân loại, nội dung trang chủ, logo/slogan, màu sắc và công tắc ẩn/hiện từng khu vực. Xem [docs/admin-cms-guide.md](docs/admin-cms-guide.md).

## Deploy

- Frontend: Vercel, build `npm run build`, output `dist`, đặt `VITE_API_URL` tới backend.
- Backend: Render Blueprint qua `render.yaml`; nhập username/password admin ở Environment trước lần khởi tạo đầu tiên.

Chi tiết kiến trúc và quy trình nằm trong [docs/technical-implementation.md](docs/technical-implementation.md).
