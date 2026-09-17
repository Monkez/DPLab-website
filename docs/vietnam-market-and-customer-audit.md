# Thị trường Việt Nam và cải thiện hành trình khách hàng

Ngày khảo sát: 17/09/2026. Phạm vi thực tế: DTPT Techs — thiết bị công nghiệp B2B, không phải laptop dù tên thư mục dự án còn giữ lịch sử cũ.

## Cơ sở và giới hạn

Đây là khảo sát định tính từ danh mục nhà cung cấp Việt Nam và tài liệu hãng. Chưa có dữ liệu Search Console, lượng tìm kiếm, tỷ lệ chuyển đổi hoặc doanh thu để kết luận sản phẩm nào bán chạy. Thứ tự ưu tiên dưới đây là giả thuyết kinh doanh cần đo, không phải bảng xếp hạng thị phần.

- [Advantech Việt Nam: Remote I/O công nghiệp](https://giaiphap.advantech.com.vn/remote-io-cong-nghiep/): phân chia ADAM-4000 RS-485 và ADAM-6000 Ethernet, phù hợp nội dung giải thích cách chọn và tương thích.
- [Advantech iFactory](https://www.advantech.com/vi-vn/solutions/ifactory): nhóm ứng dụng thu thập dữ liệu, kết nối IT/OT và Edge AI. Đây là định hướng giải pháp của hãng, không phải số liệu quy mô thị trường Việt Nam.
- [Hợp Long](https://www.hoplongtech.com/): hệ danh mục PLC/HMI, cảm biến và tự động hóa. Cạnh tranh bằng danh mục rộng khó tạo khác biệt cho một website mới.
- [EMIN: RIGOL DHO804](https://emin.vn/rigoldho804-may-hien-song-so-rigol-dho804-70-mhz-1-25-gsa-s-25-mpts-4ch-154657/pr.html): ví dụ thị trường Việt Nam tổ chức trang theo model và thông số cụ thể.
- [PUSR Việt Nam: USR-TCP232-410S](https://pusr.com.vn/san-pham/bo-chuyen-doi-1-cong-rs485-1-cong-rs232-sang-ethernet-usr-tcp232-410s/): nhóm chuyển đổi giao tiếp có ứng dụng cụ thể cho máy móc sẵn có.
- [MEAN WELL: datasheet HDR-60](https://www.meanwell.com/Upload/PDF/HDR-60/HDR-60-SPEC.PDF): căn cứ kỹ thuật cho sản phẩm mới HDR-60-24. Không suy diễn giá, tồn kho hay tư cách đại lý từ datasheet.

## Hướng danh mục để thu hút người tìm kiếm

| Ưu tiên | Nhóm / model đại diện | Nội dung nên trả lời |
|---|---|---|
| Tiếp cận ban đầu | ADAM-6050, gateway PUSR, nguồn 24 VDC | Giao thức, loại tín hiệu, nguồn cấp, sơ đồ ứng dụng |
| Đo kiểm / R&D | RIGOL DHO804 | Số kênh, băng thông, đầu dò, giới hạn đo |
| Tủ điện / tự động hóa | Delta DVP14SS211R, HDR-60-24 | I/O, tải nguồn, giao tiếp và tương thích |
| Bảo trì | HIKMICRO B20S | Kiểm tra nhiệt, dải đo, điều kiện sử dụng |
| Dự án chuyên sâu | Hikrobot, Jetson Industrial | Camera/ống kính/chiếu sáng, môi trường, phần mềm và cấu hình |

Thêm **MEAN WELL HDR-60-24** để bổ sung nguồn cấp cho các bài toán PLC/I/O hiện có; công bố thông số theo hãng và giá liên hệ. Tổng seed: **89 model**. Không thêm SKU hàng loạt để tăng số lượng trang.

Trang chủ chọn 8 model đại diện, giảm việc chiếm vị trí bằng các biến thể Edge AI, LiDAR hoặc camera gần nhau. Những model chuyên sâu vẫn giữ trong catalogue để không mất đường dẫn và khả năng đáp ứng khách dự án. Không kết luận model cũ ngừng sản xuất khi chưa có thông báo hãng.

## Những trở ngại đã xử lý

| Trước | Sau |
|---|---|
| API từ chối tư vấn chưa chọn sản phẩm dù trang chủ cho phép mở form | Chấp nhận yêu cầu không có sản phẩm khi mô tả tối thiểu 10 ký tự |
| Bắt buộc công ty và email | Chỉ bắt buộc họ tên, điện thoại; email và đơn vị tùy chọn |
| Tìm kiếm không dấu không ra kết quả; điện thoại ẩn ô tìm kiếm | Chuẩn hóa tiếng Việt, tìm theo ứng dụng, thêm ô tìm mobile và catalogue |
| Chỉ có lọc ngành hàng, thay ngành làm mất từ khóa | Kết hợp ngành, thương hiệu, ngân sách, sắp xếp; lưu bộ lọc trong URL |
| Thêm báo giá không rõ kết quả | Phản hồi trên thẻ; trang chi tiết mở form kèm sản phẩm |
| Offline xóa danh sách và tạo RFQ dù mới mở ứng dụng email | Giữ danh sách, không tạo xác nhận gửi giả |
| Không có pháp nhân và hướng dẫn mua rõ ràng | Footer và trang hướng dẫn có thông tin doanh nghiệp do chủ website cung cấp |
| Ảnh series dễ bị hiểu là ảnh đúng cấu hình | Ghi rõ ảnh minh họa model/dòng sản phẩm ở trang chi tiết có nguồn ảnh |
| Nút sản phẩm không phải liên kết | Thêm href thật để mở tab mới và hỗ trợ phát hiện URL |
| Mật khẩu tài khoản bị ép tối thiểu 10 ký tự | Chấp nhận mật khẩu không rỗng, không áp đặt độ dài tối thiểu; giữ cơ chế băm và phân quyền |

## Thông tin doanh nghiệp được chủ website xác nhận

CÔNG TY TNHH DTPT-TECHS. Giấy CNĐKDN 0110774870, cấp 05/07/2024 bởi Phòng Đăng ký kinh doanh – Sở Kế hoạch và Đầu tư Hà Nội. Địa chỉ ĐKKD: Tầng 4, số 146 Trần Vỹ, Phường Phú Diễn, TP Hà Nội. Email: dtpttechs@gmail.com. Điện thoại/Zalo: 0903463185.

Chưa có giờ làm việc, chứng nhận đại lý, thời hạn đổi trả chung hoặc SLA phản hồi được xác nhận. Không tự công bố các cam kết đó. Trang hướng dẫn yêu cầu chốt điều kiện từng đơn bằng báo giá/hợp đồng; địa chỉ đăng ký không bị mô tả thành showroom.

## Bước tăng lượng truy cập tiếp theo

1. Đo Search Console: trang được index, impression/click theo cụm model và bài toán. Theo dõi RFQ thực tế, không coi lượt xem là đơn hàng.
2. Biên tập bài có tài liệu hãng: ADAM-4000 so với ADAM-6000; chọn nguồn 24 VDC cho PLC/I/O; Modbus RTU so với TCP; chọn máy hiện sóng theo công việc. Trỏ bài về model liên quan và form tư vấn.
3. Sau 4–6 tuần có dữ liệu, ưu tiên nhóm có truy vấn và liên hệ thực tế; thu gọn trang trùng ý định tìm kiếm. Không hứa hẹn thứ hạng hoặc lưu lượng trước khi đo.
4. Chủ website rà soát từng giá bán, nguồn hàng, ảnh đúng model và bảo hành. Giữ chính sách giá có sẵn; đợt này không thay toàn bộ giá bằng ước tính mới.

## Triển khai và kiểm tra

- Đồng bộ frontend/backend; chỉ deploy frontend sẽ không sửa được lỗi API từ chối tư vấn và giới hạn mật khẩu.
- Migration `business_contact_20260917` cập nhật ba trường liên hệ và ba nội dung giới thiệu danh mục một lần, giữ nội dung CMS khác.
- Migration `entry_assortment_20260917` chỉ điều chỉnh nổi bật/thứ tự của model seed một lần; không thay giá, thông số hoặc sản phẩm tự thêm. Những lần sửa CMS sau đó được giữ nguyên.
- Giữ version catalogue hiện tại vì cơ chế đổi version cũ xóa sản phẩm. SKU mới được thêm bằng luồng bổ sung seed, không reset database.
- Kiểm thử: tìm không dấu/model/ứng dụng, kiểm tra ID/slug, biểu mẫu tư vấn/RFQ, mật khẩu ngắn qua băm/xác thực/đổi mật khẩu với database giả lập. Chạy toàn bộ test, lint, build và QA trình duyệt desktop/mobile.
- Môi trường local không có PostgreSQL/backend `.env`: chưa kiểm chứng migration và lưu RFQ với database thật tại local. Không gửi yêu cầu thử tới khách hàng hoặc tạo đơn trên production trong quá trình QA.

Kết quả local: 19/19 kiểm thử đạt; lint, TypeScript/Vite build và kiểm tra cú pháp backend đạt. QA bản build ở 1440 px và 390 px: tìm không dấu, chọn ngân sách kết hợp từ khóa, trạng thái không có kết quả → tư vấn, chi tiết → RFQ, Escape đóng dialog; không lỗi JavaScript ở phiên kiểm tra build và không tràn ngang trên các trang mobile đã kiểm tra. Domain production/API bị timeout từ môi trường làm việc; chưa xác nhận trạng thái phát hành trực tiếp.
