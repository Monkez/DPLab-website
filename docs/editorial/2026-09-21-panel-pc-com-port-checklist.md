# Bài đã xuất bản: Cổng COM trên Panel PC — 5 điểm cần chốt trước khi mua

- Trạng thái: đã xuất bản ngày 21/09/2026. API public, sitemap, canonical, dữ liệu Article JSON-LD, ba ảnh và giao diện desktop/mobile đã được kiểm tra sau khi xuất bản.
- URL công khai: https://dtpt.shop/tin-tuc/cong-com-panel-pc-rs232-rs485-can-chot-gi
- Slug: `cong-com-panel-pc-rs232-rs485-can-chot-gi`
- Chuyên mục: Kiến thức kỹ thuật
- Tóm tắt/SEO description: Đếm số cổng COM chưa đủ. Hãy chốt chuẩn RS-232/422/485, pinout, 2/4 dây, giao thức, cách ly và phần mềm trước khi chọn Panel PC.
- Tag: Panel PC, cổng COM, RS-232, RS-485, Modbus RTU
- Ảnh đại diện: `/products/be-px09.png`
- Sản phẩm liên quan: QY-P8156, BE-PX09 và Axiomtek GOT315A-ELK-WCD.

## Nội dung nhập CMS

“Có 6 cổng COM” chưa có nghĩa Panel PC sẽ nối được ngay với sáu thiết bị hiện trường. COM chỉ là cách gọi chung cho cổng nối tiếp; khả năng tương thích còn phụ thuộc chuẩn điện RS-232/422/485, số dây, pinout, giao thức và cách cấu hình từng cổng. Chốt năm điểm dưới đây trước khi yêu cầu báo giá sẽ giảm rủi ro phải thêm bộ chuyển đổi sau khi lắp máy.

## 1. Ghi chuẩn điện của từng thiết bị

Với mỗi PLC, biến tần, cân hoặc máy đo, hãy ghi chuẩn cổng theo manual, không suy từ hình dạng đầu nối. Tài liệu Modbus Organization nêu Modbus Serial có thể chạy trên RS-485 hoặc RS-232; đây là hai lớp khác nhau, nên câu “thiết bị dùng Modbus” vẫn chưa đủ để chọn phần cứng.

RS-232 thường dùng cho kết nối điểm-điểm ở khoảng cách ngắn. RS-485 hỗ trợ bus nhiều nút nhờ bộ phát có thể chuyển sang trạng thái không phát; Advantech lưu ý đây là khác biệt quan trọng với RS-422. Không đấu thử hai chuẩn chỉ vì chúng cùng dùng DB9 hoặc terminal block.

![Mặt sau Panel PC QY-P8156 với các cổng kết nối](</products/qy-p8156.png> "Ảnh QY-P8156 trong catalogue DTPT, nguồn Optori. Danh mục ghi 2 cổng RS-232/485; cần xác nhận chế độ và pinout cho cấu hình báo giá.")

## 2. Đọc cấu hình từng cổng, không chỉ tổng số

Một cổng “RS-232/422/485” thường là cổng có thể chọn chế độ, không phải ba cổng dùng đồng thời. Axiomtek công bố GOT315A-ELK-WCD có một COM chọn RS-232/422/485 và khe Flexible I/O mặc định thêm hai RS-232. Vì vậy, mô tả “1+2 COM” không đồng nghĩa cả ba cổng đều chạy RS-485.

Tương tự, catalogue BE-PX09 ghi tổng cộng 6 COM nhưng chưa đủ để kết luận chuẩn của từng cổng. Khi hỏi giá, yêu cầu bảng ánh xạ COM1–COM6: chuẩn hỗ trợ, đầu nối, pinout và cách đổi chế độ bằng BIOS, jumper hay phần mềm.

![Panel PC Axiomtek GOT315A-ELK-WCD](</products/axiomtek-got315a-elk-wcd.jpeg> "Ảnh đúng model GOT315A-ELK-WCD trong catalogue DTPT. Hãng công bố 1 COM chọn RS-232/422/485 và Flexible I/O mặc định 2 RS-232.")

## 3. Chốt 2 dây hay 4 dây và sơ đồ chân

RS-485 có thể dùng 2 dây half-duplex hoặc 4 dây full-duplex; RS-422 thường có cặp phát và cặp nhận riêng. Hãy gửi trang manual thể hiện chân A/B hoặc TX/RX/GND của thiết bị. Ký hiệu A/B giữa các hãng có thể gây nhầm, nên đối chiếu tên tín hiệu và sơ đồ thay vì chỉ nối cùng chữ.

Việc có cần điện trở kết thúc hoặc bias phụ thuộc topology, chiều dài cáp, tốc độ và thiết bị. Tài liệu Advantech giải thích termination dùng để hạn chế phản xạ và phải được đặt theo thiết kế đường truyền. Không tự thêm điện trở theo thói quen, đặc biệt khi chưa biết thiết bị đã tích hợp termination hay chưa.

## 4. Tách giao thức khỏi cổng vật lý

Hai đầu cùng RS-485 vẫn không giao tiếp nếu khác baud rate, data bits, parity, stop bits, địa chỉ hoặc vai trò master/slave. Với Modbus RTU, chuẩn Modbus yêu cầu các thiết bị trên đường truyền dùng cùng cách kiểm tra parity. Cần thêm register map, function code cần dùng và một bản tin mẫu nếu nhà sản xuất cung cấp.

Thử trên một thiết bị mẫu, đọc một thanh ghi không làm thay đổi quá trình và lưu lại cấu hình thành công. Không ghi thử coil/register điều khiển trên dây chuyền đang chạy.

## 5. Checklist nghiệm thu trước khi đặt hàng

- Bảng thiết bị gồm chuẩn RS-232/422/485, 2/4 dây, đầu nối và pinout.
- Bảng COM của Panel PC: chế độ từng cổng, cách cấu hình, cách ly và bảo vệ xung nếu có.
- Hệ điều hành, driver serial, cách giữ số COM sau khi khởi động lại và phần mềm cần dùng.
- Tham số truyền, địa chỉ thiết bị, register map và kết quả thử với thiết bị mẫu.
- Phương án cáp, nối đất, termination/bias đã được người phụ trách điện–tự động hóa phê duyệt.

Ngắt nguồn và tuân thủ quy trình an toàn trước khi đổi dây hoặc jumper. Khi gửi yêu cầu, đính kèm manual thiết bị hiện trường và ảnh đầu nối. Catalogue Panel PC của DTPT:
https://dtpt.shop/san-pham?category=may-tinh-cong-nghiep

## Nguồn tham khảo

Axiomtek — GOT315A-ELK-WCD:
https://www.axiomtek.com/products/panel-pcs-and-monitors/fanless-touch-panel-pc/rugged-fanless-touch-panel-pc/got315a-elk-wcd

Advantech — RS-422 and RS-485 Application Note:
https://www.advantech.com/en-us/support/details/reference?id=1+3FF+0

Advantech — Difference between RS-422 and RS-485:
https://www.advantech.com/emt/support/details/faq?id=1-HIIV-121

Modbus Organization — Modbus specifications:
https://www.modbus.org/modbus-specifications

## Ghi chú biên tập — không đưa vào nội dung công khai

- Thông số Axiomtek lấy từ trang hãng được kiểm tra ngày 21/09/2026. Nội dung phân biệt cổng chọn chế độ và Flexible I/O bám đúng cấu hình hãng.
- Ảnh QY-P8156 và Axiomtek GOT315A-ELK-WCD là ảnh sản phẩm đã có trong catalogue; ảnh cover BE-PX09 là ảnh đúng trang sản phẩm. Không coi ảnh giao diện hiển thị trên thiết bị là bằng chứng phần mềm thực tế.
- Không hướng dẫn đấu dây chi tiết hoặc thay đổi tham số trên hệ thống đang chạy. Bài yêu cầu manual, thử đọc không phá hủy và phê duyệt của người phụ trách.
- Renderer dùng URL thuần cho nguồn và catalogue vì chưa hỗ trợ đầy đủ Markdown liên kết.
- Bài lưu PostgreSQL qua CMS; không thêm vào `articleSeed.js` và không reset database.
