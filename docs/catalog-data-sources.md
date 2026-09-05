# Cơ sở giá bán và dữ liệu catalogue

> Cập nhật: 21/08/2026. Tài liệu nội bộ, không hiển thị giá vốn/giá nguồn trên website.

## Chính sách giá công khai

- Website chỉ hiển thị **giá bán tại Việt Nam đã gồm VAT**.
- Ưu tiên mức giá đang bán tại Việt Nam của đúng model hoặc cùng cấu hình, sau đó đặt giá DTPT Techs tương đương thị trường.
- Nếu chưa có giá công khai tại Việt Nam, tính từ giá mua nước ngoài theo công thức nội bộ bên dưới.
- Giá bán áp dụng cho cấu hình tiêu chuẩn. Báo giá chính thức cần xác nhận lại phụ kiện, phiên bản vùng, thời gian giao và hiệu lực giá.

## Công thức cho sản phẩm chưa có giá Việt Nam

Giá bán gồm VAT = Giá nguồn quy đổi VND × (1 + 10% chi phí nhập khẩu) × (1 + 15% lợi nhuận) × (1 + 10% VAT dự phòng).

Hệ số hiện dùng là `1,3915`. Trong đó:

- Tỷ giá ngân sách: 26.500 VND/USD; 3.900 VND/CNY.
- 10% chi phí nhập khẩu gồm vận chuyển quốc tế, bảo hiểm, khai báo/hải quan, giao nội địa và dự phòng thuế nhập khẩu. Khi có C/O ưu đãi hoặc lô hàng ghép tốt hơn, phần tiết kiệm là vùng an toàn cho báo giá.
- Lợi nhuận mặc định 15%, nằm giữa khung 10–20% theo định hướng kinh doanh.
- VAT dùng mức dự phòng 10% để không báo thiếu. Tại thời điểm lập hóa đơn phải áp đúng nhóm hàng và chính sách thuế đang hiệu lực; Nghị quyết 204/2025/QH15 đang giảm nhiều nhóm hàng từ 10% xuống 8% đến hết 31/12/2026, nhưng có nhóm loại trừ.
- Sau phép tính, giá được làm tròn theo mức dễ báo giá. Không công bố phép tính này trên trang sản phẩm.

## Bảng giá hiện tại

| Model | Giá bán gồm VAT | Cơ sở |
|---|---:|---|
| Seeed reComputer Industrial J4012 | 71.500.000 ₫ | Chưa có đúng model industrial tại VN; tính landed cost từ DigiKey 1.933,75 USD |
| QY-P8156 | 17.900.000 ₫ | Theo mặt bằng Panel PC 15 inch tại Việt Nam từ 17.500.000 ₫; giá cấu hình J6412 tiêu chuẩn |
| BE-PX09 | 19.950.000 ₫ | Theo giá công khai của Optori Việt Nam cho cấu hình Core i5-1235U |
| Axiomtek GOT315A-ELK-WCD | 48.500.000 ₫ | Chưa thấy giá công khai tại VN; tính từ nguồn Mỹ 1.315 USD theo hệ số landed cost 1,3915 |
| Hikrobot MV-CS050-10GM | 17.800.000 ₫ | Có nhà cung cấp tại VN nhưng không công khai giá; tính từ nguồn 481,16 USD |
| Daheng MER2-041-302GM-P | 12.900.000 ₫ | Chưa thấy giá VN; tính từ mức 350 USD |
| HIKMICRO B20S | 11.883.000 ₫ | Theo EMIN Việt Nam: 11.883.456 ₫ đã gồm VAT |
| Smacq USB-3310 | 17.900.000 ₫ | Chưa thấy giá VN; tính từ giá hãng 485,44 USD |
| Smacq USB-3313 | 34.300.000 ₫ | Chưa thấy giá VN; tính từ giá hãng 929,44 USD |
| Advantech ADAM-4017+-F | 12.600.000 ₫ | Chưa thấy giá mới công khai tại VN; tính từ giá Mouser 340,20 USD |
| Advantech ADAM-5000/TCP-CE | 18.000.000 ₫ | Chưa thấy giá đúng bản 8 khe tại VN; tính từ giá hãng 487 USD; chưa gồm module I/O lắp khe |
| Advantech ADAM-6050-D1 | 9.350.000 ₫ | Giá thị trường VN 8.500.000 ₫ chưa VAT, cộng VAT dự phòng 10% |
| PUSR USR-M300 | 6.000.000 ₫ | Có nhà phân phối VN nhưng giá liên hệ; tính từ PUSR China 1.099 CNY |
| PUSR USR-G806w | 2.200.000 ₫ | Có nhà cung cấp VN nhưng không công khai giá; tính từ PUSR China 398 CNY |
| 3onedata IES618-2F | 11.880.000 ₫ | Giá thị trường VN 10.800.000 ₫, cộng VAT dự phòng 10% |
| RIGOL DHO804 | 12.760.000 ₫ | Giá PiTek 11.600.000 ₫, cộng VAT dự phòng 10% |
| RIGOL DHO814 | 13.500.000 ₫ | Nằm trong vùng giá thị trường VN 9.845.000–13.505.000 ₫ |
| SIGLENT SDS1204X HD | 48.400.000 ₫ | Giá thị trường VN 44.820.000 ₫, cộng VAT 8% và làm tròn |

## Nguồn thông số và hình ảnh

Mỗi bản ghi trong `src/data/verifiedProducts.ts` hoặc `backend/src/catalogExpansion.js` lưu trang hãng, datasheet, nguồn ảnh và nguồn giá nội bộ. Trang chi tiết chỉ hiển thị link hãng/datasheet và nguồn ảnh; không hiển thị giá mua hoặc công thức lợi nhuận. Frontend và backend dùng chung dữ liệu mở rộng để khi kết nối API không trả lại catalogue mẫu cũ.

## Catalogue v5 — 88 sản phẩm

Ngày cập nhật: 21/08/2026.

| Ngành hàng | Số model | Nhóm model mở rộng | Nguồn giá chính |
|---|---:|---|---|
| Máy tính công nghiệp | 11 | Seeed reComputer/reServer Industrial | Seeed Studio |
| Machine Vision | 11 | Hikrobot MV-CS GigE/USB3, 1,3–12 MP | Hikrobot và tham chiếu cùng series |
| Cảm biến & đo lường | 11 | Benewake, Livox, SLAMTEC, SICK, Autonics | Seeed, DJI/Livox, hãng và EMIN |
| Giám sát tình trạng máy | 11 | HIKMICRO và Guide MobIR | EMIN Việt Nam |
| DAQ & Remote I/O | 11 | Advantech ADAM-4000/6000 | Advantech eStore |
| Industrial IoT & mạng | 11 | PUSR router, serial server, LoRa gateway | PUSR China Store |
| Thiết bị đo điện tử | 11 | RIGOL và SIGLENT | EMIN Việt Nam |
| Tự động hóa & điều khiển | 11 | Delta DVP, DOP và ASDA-B3 | Hợp Long Việt Nam |

Giá công khai chưa VAT tại Việt Nam được cộng VAT trước khi hiển thị và làm tròn hợp lý. Sản phẩm chưa có giá công khai tại Việt Nam dùng giá hãng/nhà bán quốc tế, cộng tỷ giá, thuế và chi phí nhập khẩu, sau đó áp dụng biên lợi nhuận mục tiêu 10–20%. Riêng camera Hikrobot theo series dùng ngân sách so sánh dựa trên cảm biến, độ phân giải, tốc độ và giao tiếp; cần xác nhận lại báo giá nhà cung cấp trước khi gửi báo giá thương mại.

Ảnh hiện được lưu cục bộ trong `public/products` từ trang hãng hoặc nhà phân phối để giao diện tải ổn định. Trước khi dùng cho quảng cáo trả phí, brochure in ấn hoặc sàn thương mại điện tử, cần xin media kit/quyền sử dụng trực tiếp.

### Lưu ý riêng cho QY-P8156

Trang tham khảo của QY-P8156 mô tả nhiều tùy chọn CPU và cho biết dữ liệu kỹ thuật được tổng hợp theo dòng P8000/QY-P8150. Vì vậy website chỉ công bố các đặc điểm chung có thể đối chiếu; RAM, SSD, hệ điều hành và CPU cuối cùng phải được xác nhận theo mã cấu hình trong báo giá.

## Quy trình cập nhật

1. Tìm đúng model trên website hãng và tải datasheet.
2. Tìm ít nhất hai nguồn giá Việt Nam; nếu có giá rõ ràng, ưu tiên giá thị trường.
3. Nếu không có, ghi giá nguồn, tiền tệ, tỷ giá và áp công thức landed cost.
4. So sánh kết quả với sản phẩm tương đương để tránh định giá bất thường.
5. Cập nhật frontend, backend seed, phiên bản catalogue và bảng này.
