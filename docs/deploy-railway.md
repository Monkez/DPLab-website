# Deploy toàn bộ DTPT Techs lên Railway

Tài liệu này chuyển production từ Vercel + Render sang một Railway Project. Không tắt dịch vụ cũ cho tới khi hoàn tất kiểm thử và đổi DNS.

## Kiến trúc đích

| Railway service | Source / Root Directory | Public URL | Vai trò |
|---|---|---|---|
| `frontend` | GitHub repo, `/` | `https://www.dtpt.shop` | React/Vite storefront và `/admin` |
| `backend` | Cùng GitHub repo, `/backend` | `https://api.dtpt.shop` | Express API độc lập |
| `Postgres` | Railway PostgreSQL | Không public khi vận hành | Sản phẩm, CMS, admin, RFQ, analytics |

Frontend không thể gọi hostname `.railway.internal` vì JavaScript chạy trong trình duyệt. Chỉ backend kết nối Postgres qua private network.

## 1. Tạo project và database

1. Đăng nhập [Railway](https://railway.com/) và chọn **New Project → Empty Project**.
2. Đặt tên project, ví dụ `DTPT Techs Production`.
3. Trong project canvas, chọn **Create → Database → PostgreSQL**. Giữ service name là `Postgres` để các biến mẫu dưới đây dùng đúng namespace.
4. Chưa bật Public Access cho database, trừ giai đoạn nhập dữ liệu ở mục 5.

Nếu cần giữ tài khoản admin, nội dung CMS và RFQ hiện tại, hãy thực hiện mục 5 ngay sau bước này, trước khi deploy backend lần đầu. Nếu muốn khởi tạo catalogue mới thì tiếp tục mục 2.

## 2. Tạo backend service

1. Chọn **Create → GitHub Repo**, kết nối repo `Monkez/DPLab-website`.
2. Đổi tên service thành `backend`.
3. Trong **Settings → Source**, đặt **Root Directory** là `/backend`.
4. Xác nhận:
   - Build Command: `npm ci`
   - Start Command: `npm start`
   - Healthcheck Path: `/api/health`

Từ commit `7a96102` trở về trước, cấu hình `/backend` có thể lỗi thiếu catalogue. Hãy chắc chắn deployment lấy commit mới hơn bản vá này.
5. Trong **Variables**, dùng Raw Editor và nhập các dòng sau. Thay các giá trị trong dấu `<...>`:

```dotenv
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=false
FRONTEND_URL=https://www.dtpt.shop,https://dtpt.shop,https://<frontend-generated-domain>
ADMIN_SESSION_SECRET=<chuoi-ngau-nhien-toi-thieu-32-ky-tu>
ADMIN_DEFAULT_USERNAME=<ten-dang-nhap-admin>
ADMIN_DEFAULT_PASSWORD=<mat-khau-manh>
ADMIN_DEFAULT_DISPLAY_NAME=DTPT Admin
```

Không tạo biến `PORT`; Railway tự cấp và backend đã đọc `process.env.PORT`.

`ADMIN_DEFAULT_USERNAME` và `ADMIN_DEFAULT_PASSWORD` chỉ tạo tài khoản khi bảng `admin_users` đang trống. Nếu nhập database cũ, thông tin đăng nhập cũ được giữ nguyên.

6. Deploy và mở **Settings → Networking → Public Networking → Generate Domain**.
7. Ghi lại URL tạm, ví dụ `https://backend-production-xxxx.up.railway.app`.
8. Mở `<backend-url>/api/health` và `<backend-url>/api/bootstrap`. Cả hai phải trả HTTP 200.

## 3. Tạo frontend service

1. Tạo thêm một service từ cùng GitHub repo và đổi tên thành `frontend`.
2. Đặt **Root Directory** là `/`.
3. Xác nhận:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Healthcheck Path: `/`
4. Thêm biến build-time:

```dotenv
VITE_API_URL=https://<backend-generated-domain>
```

5. Deploy, tạo Railway domain và ghi lại URL frontend tạm.
6. Quay lại biến `FRONTEND_URL` của backend, thêm chính xác origin frontend tạm (không có dấu `/` cuối), rồi redeploy backend.
7. Kiểm tra trang chủ, catalogue, trang chi tiết, gửi thử RFQ và đăng nhập `/admin` bằng Railway domain tạm.

## 4. Tạo secret an toàn

Chạy một trong các lệnh sau trên máy cá nhân rồi dán kết quả vào `ADMIN_SESSION_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Không commit secret, mật khẩu admin hoặc URL database vào Git. Có thể dùng chức năng **Seal** của Railway sau khi lưu biến.

## 5. Chuyển dữ liệu PostgreSQL từ Render

Bỏ qua mục này nếu muốn database mới với catalogue seed mặc định. Nếu cần giữ tài khoản admin, nội dung CMS, RFQ và analytics hiện tại:

1. Lấy **External Database URL** của PostgreSQL cũ trên Render.
2. Trên Railway Postgres, tạm bật **Settings → Networking → Public Access** để Railway tạo `DATABASE_PUBLIC_URL`.
3. Bảo đảm database Railway là database mới, chưa chứa dữ liệu cần giữ. Không chạy các lệnh sau vào nhầm database.
4. Trên máy có PostgreSQL client, xuất và nhập:

```powershell
pg_dump --format=custom --no-owner --no-privileges --dbname="<RENDER_EXTERNAL_DATABASE_URL>" --file="dtpt-render.backup"
pg_restore --no-owner --no-privileges --exit-on-error --dbname="<RAILWAY_DATABASE_PUBLIC_URL>" "dtpt-render.backup"
```

5. Redeploy backend và kiểm tra `/api/bootstrap`, `/admin`, danh sách RFQ và settings.
6. Tắt **Public Access** của Postgres ngay sau khi nhập xong. Backend tiếp tục dùng private `DATABASE_URL`.
7. Giữ file backup ở nơi an toàn cho tới khi cutover ổn định; file này có dữ liệu kinh doanh, không đưa vào Git.

Nếu backend đã seed database Railway trước khi import, cách an toàn nhất là tạo lại một Postgres service trống rồi restore vào đó, sau đó đổi reference `DATABASE_URL`. Không dùng `--clean` trên database chưa xác minh đúng đích.

## 6. Gắn domain và chuyển DNS

Thực hiện backend trước, frontend sau:

1. Backend → **Settings → Networking → Custom Domain** → nhập `api.dtpt.shop`.
2. Tại nhà cung cấp DNS, tạo đúng bản ghi `CNAME` và `TXT` mà Railway hiển thị. TXT là bắt buộc để xác minh.
3. Khi `https://api.dtpt.shop/api/health` đã chạy, đổi frontend variable thành:

```dotenv
VITE_API_URL=https://api.dtpt.shop
```

4. Redeploy frontend và thử lại bằng Railway domain tạm.
5. Frontend → **Custom Domain** → thêm `www.dtpt.shop`, rồi thay bản ghi DNS cũ của Vercel bằng CNAME/TXT Railway cung cấp.
6. Với `dtpt.shop` (apex), thêm làm custom domain thứ hai nếu gói Railway và DNS provider hỗ trợ CNAME flattening/ALIAS. Hoặc cấu hình redirect 301 từ apex sang `https://www.dtpt.shop` tại DNS provider.
7. Nếu dùng Cloudflare proxy, đặt SSL/TLS là **Full**, không dùng **Full (Strict)** theo hướng dẫn Railway hiện tại.
8. Chạy:

```bat
check-production.bat
```

Có thể kiểm tra domain tạm trước khi đổi DNS:

```bat
check-production.bat https://frontend-production-xxxx.up.railway.app https://backend-production-xxxx.up.railway.app
```

## 7. Checklist nghiệm thu

- `https://www.dtpt.shop` và `https://api.dtpt.shop/api/health` trả HTTP 200.
- `/api/bootstrap` có đủ catalogue, settings và số ngành hàng dự kiến.
- Đăng nhập `/admin`, sửa một trường không quan trọng, tải lại trang và xác nhận dữ liệu còn nguyên.
- Gửi một RFQ thử và xác nhận xuất hiện trong admin.
- Kiểm tra favicon, ảnh sản phẩm, route trực tiếp `/admin` và một URL chi tiết sản phẩm.
- Kiểm tra Railway logs không có lỗi CORS, database hoặc restart loop.
- Bật backup định kỳ cho Postgres production.

## 8. Tắt Vercel và Render

Chỉ sau khi checklist đạt và DNS đã ổn định:

1. Tắt auto-deploy hoặc xóa Vercel project cũ.
2. Tạm suspend Render web service và database trong vài ngày nếu gói cho phép, chưa xóa ngay.
3. Theo dõi Railway logs/RFQ. Khi chắc chắn không cần rollback, tải backup cuối rồi mới xóa tài nguyên Render.

Rollback nhanh trước khi xóa dịch vụ cũ: trả DNS `www` về Vercel, đổi frontend API về Render và khôi phục bản ghi cũ. Việc giữ dịch vụ cũ trong thời gian quan sát giúp giảm rủi ro mất truy cập hoặc dữ liệu.

## Tài liệu Railway tham chiếu

- [Deploying a Monorepo](https://docs.railway.com/deployments/monorepo)
- [Deploy a React App](https://docs.railway.com/guides/react)
- [PostgreSQL](https://docs.railway.com/databases/postgresql)
- [Using Variables](https://docs.railway.com/variables)
- [Working with Domains](https://docs.railway.com/networking/domains/working-with-domains)
