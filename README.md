# DP Lab Store

Website bán laptop cho **DP Lab** với khẩu hiệu **“Giá tốt - uy tín - chất lượng”**.

## Chạy project

```bash
npm install
npm run dev
```

- Cửa hàng: `http://localhost:5173/`
- Quản trị: `http://localhost:5173/admin`

## Chức năng hiện có

- Danh mục laptop, tìm kiếm và lọc theo nhu cầu
- Hiển thị giá bán, cấu hình, tồn kho và hotline liên hệ
- Giỏ hàng, thay đổi số lượng và đặt hàng không thanh toán online
- Admin tổng quan, quản lý sản phẩm, đơn hàng và thông tin cửa hàng
- Dữ liệu được lưu trong `localStorage` để dùng thử không cần backend
- Responsive cho desktop, tablet và mobile

## Lưu ý trước khi đưa lên production

Bản hiện tại là front-end prototype hoàn chỉnh để duyệt giao diện và luồng nghiệp vụ. Khi triển khai chính thức nên nối database/API, đăng nhập và phân quyền admin, lưu ảnh sản phẩm trên storage, gửi thông báo đơn hàng và thêm cơ chế sao lưu.

Thông tin liên hệ và logo đơn vị vận hành được tham chiếu từ project DTPT-Manager. Giá bán trong dữ liệu mẫu là giá minh họa và có thể sửa trực tiếp ở trang quản trị.
