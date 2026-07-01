# DTPT Shop Website

Website bán laptop cho **DTPT Shop** với frontend Vite React và backend Express/PostgreSQL.

## Chạy local

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Cần điền `DATABASE_URL` trong `backend/.env`. Khi frontend có `VITE_API_URL`, app sẽ dùng backend; nếu không có, app tự fallback sang dữ liệu localStorage.

## Deploy frontend

### Vercel

- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable:
  - `VITE_API_URL=https://<render-backend-url>`

### Render Static Site

- Root Directory: để trống
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variable:
  - `VITE_API_URL=https://<render-backend-url>`

## Deploy backend trên Render

Cách nhanh nhất:

1. Vào Render → `New` → `Blueprint`
2. Chọn repo `Monkez/DPLab-website`
3. Render đọc file `render.yaml` và tạo:
   - Web Service: `dplab-backend`
   - PostgreSQL: `dplab-postgres`
4. Sau khi frontend deploy xong, vào backend service → Environment → set:
   - `FRONTEND_URL=https://<frontend-url>`
5. Redeploy backend.

Cách tạo thủ công:

- New → PostgreSQL → tạo database.
- New → Web Service → chọn repo.
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `DATABASE_URL=<Render PostgreSQL internal connection string>`
  - `FRONTEND_URL=https://<frontend-url>`

## API chính

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/reset-demo`

## Lưu ý

- Backend hiện chưa có đăng nhập admin. Trước khi vận hành thật nên thêm auth/JWT hoặc ít nhất bảo vệ các API admin.
- Logo upload đang lưu dạng data URL trong PostgreSQL, phù hợp logo nhỏ. Nếu sau này upload nhiều ảnh sản phẩm, nên chuyển sang Cloudinary/S3/Supabase Storage.
