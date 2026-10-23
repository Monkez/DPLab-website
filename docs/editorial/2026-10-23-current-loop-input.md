# Vòng dòng 4–20 mA: đúng dải đo đã đủ chưa?

- Ngày biên tập: 23/10/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API sau khi rà nháp desktop/mobile.
- Ngày xuất bản: `2026-10-23T03:09:06.881Z`.
- URL: https://dtpt.shop/tin-tuc/vong-dong-4-20ma-chon-module-analog-input
- CMS ID: `NEWS-1792724828822`.
- Slug: `vong-dong-4-20ma-chon-module-analog-input`.
- Chuyên mục: Kiến thức kỹ thuật
- Tác giả: DTPT Techs
- Tag: 4–20 mA, Analog input, Remote I/O
- SEO title: Chọn đầu vào 4–20 mA: nguồn vòng, tải và phép thử
- SEO description: Chọn module analog input 4–20 mA theo nguồn vòng, tải đầu vào, cách ly và quy đổi đơn vị; ví dụ tính điện áp cùng checklist thử trên bàn trước khi mua.
- Mô tả ngắn: Cùng ghi 4–20 mA vẫn có thể không ghép được với cảm biến. Kiểm tra nguồn vòng, tải, cách ly và phép quy đổi trước khi chọn module analog input.
- Cover media: `/products/advantech-adam-4017-plus.jpg`.
- Inline media: `/api/article-media/ed42f678-7976-48aa-9f02-6cfce03324d8`.
- Kiểm tra: 981 từ không tính chú thích ảnh inline, SEO description 151 ký tự; ba test renderer đạt. Nháp và bài public đã rà screenshot/DOM desktop/mobile 390 px, ảnh đúng/đủ, chú thích và ba nguồn hiển thị, không tràn ngang/lộ Markdown; hình điện áp đọc được trên mobile. Cover 410 × 410 JPEG và hình 720 × 660 WebP HTTP 200. API public đúng một bản ghi, nội dung khớp bản duyệt; giữ nguyên 19 bài khác. URL bài/catalogue HTTP 200, sitemap có đúng một URL; metadata server sau cache đúng title/description/ảnh, canonical hiện hành `https://dtpt.shop`, robots cho lập chỉ mục, Article schema đúng headline/ảnh/ngày/URL. Không thay source ứng dụng hoặc asset cần deploy; kiểm tra trực tiếp CMS/API/renderer thay vì chạy lại full build không liên quan. Không thêm seed/reset DB hoặc lưu credential.
- Ảnh cover: ADAM-4017+ từ catalogue DTPT, nhãn trên ảnh đã kiểm tra; nguồn Advantech: https://www.advantech.com/vi-vn/products/gf-5vtd/adam-4017/mod_10fd9e9c-8e8a-42f2-b749-a395f8426262 . Tái sử dụng tài nguyên catalogue, ghi nguồn, không cấp phép lại hoặc coi ảnh là sơ đồ đấu dây/model đã thử.
- Hình trong bài: hình ngân sách điện áp do DTPT Techs biên tập bằng SVG, nguồn duy trì `docs/editorial/assets/2026-10-23-loop-voltage-budget.svg`; chuyển PNG để upload, CMS tự lưu WebP. Số 24 V/12 V/250 Ω là giả định toán học, không gán cho ADAM hoặc cảm biến cụ thể; không phải ảnh thiết bị, giao diện, kết quả đo hoặc sơ đồ đấu dây. Không dùng ImageGen để giả thiết bị/thử nghiệm.
- Kiểm chứng: nguồn NI về thành phần vòng, điện áp và cách ly; TI về tải đầu nhận và mất khả năng điều chỉnh khi thiếu điện áp; Fluke về chế độ Simulate dùng nguồn vòng ngoài. Không áp dụng mốc báo lỗi NAMUR mặc định vì phải đối chiếu transmitter/receiver. Không nêu thông số trở kháng ADAM do tài liệu/revision cần đối chiếu riêng.
- Phép tính: 0,020 × 250 = 5 V; 24 − 12 − 5 = 7 V; ví dụ cảm biến tuyến tính 0–10 bar, 4/12/20 mA tương ứng 0/5/10 bar. Dùng dòng lớn nhất thực tế và nguồn thấp nhất khi thiết kế, không chỉ giá trị danh định. Phần 7 V là khoảng còn cho dây/phụ kiện/dự phòng, không phải dự phòng sau khi đã trừ dây.
- Phạm vi: hướng dẫn chọn và thử đầu vào trên bộ thử riêng; không chỉ dẫn đấu vào dây chuyền đang chạy, sửa nguồn tùy ý hoặc nối tắt cách ly. Khác bài USB DAQ tốc độ/độ chính xác: tập trung ghép điện vòng dòng và quy đổi đơn vị. Không bịa giá, tồn kho, benchmark hay trải nghiệm DTPT.

## Nội dung CMS

Một module ghi “hỗ trợ 4–20 mA” chưa đủ để bảo đảm đọc đúng cảm biến. Cần kiểm tra ai cấp nguồn vòng, tổng tải, cách ly và phép quy đổi. Sai một khâu có thể khiến giá trị lên không hết thang hoặc hiển thị hợp lý nhưng sai đơn vị.

Ảnh đại diện: ADAM-4017+, nguồn Advantech, catalogue DTPT. Ảnh minh họa thiết bị nhận tín hiệu; không phải sơ đồ đấu dây hay kết quả thử của DTPT.

## 1. Chốt ai cấp nguồn trước khi chọn module

Vòng dòng cơ bản gồm nguồn DC, transmitter, đầu nhận và dây dẫn. Với transmitter hai dây được nuôi từ vòng, nguồn vừa cung cấp năng lượng vừa cho phép thiết bị điều chỉnh dòng [1]. Không suy ra đầu vào có cấp nguồn vòng chỉ vì bản thân module dùng nguồn 24 VDC.

Gửi nhà cung cấp sơ đồ terminal của cảm biến và đầu nhận. Hỏi rõ nguồn tích hợp hay nguồn ngoài, cực tính, điện áp tối thiểu tại transmitter và giới hạn đầu vào. Tên “active/passive” có thể được dùng theo phía thiết bị; yêu cầu mô tả chức năng thay vì chỉ trả lời bằng nhãn.

Với cảm biến ba hoặc bốn dây, phần nguồn và tín hiệu có thể khác cấu hình hai dây. Không áp dụng một sơ đồ đấu chung cho mọi cảm biến cùng dải 4–20 mA.

## 2. Kiểm tra ngân sách điện áp của cả vòng

Đầu nhận thường đo dòng qua điện trở tải rồi chuyển điện áp thành số. TI lưu ý tải này gây sụt áp, làm giảm phần điện áp còn dành cho các thành phần khác [2]. Dây và bộ cách ly hoặc thiết bị hiển thị mắc thêm cũng cần được tính.

Ví dụ giả định: nguồn vòng 24 V, transmitter cần tối thiểu 12 V, đầu nhận có tải 250 Ω. Tại 20 mA, đầu nhận sụt 0,020 × 250 = 5 V; còn 24 − 12 − 5 = 7 V cho dây, phụ kiện và phần dự phòng. Đây không phải thông số ADAM-4017+.

![Ví dụ ngân sách điện áp: nguồn 24 V, transmitter cần 12 V, tải 250 ohm sụt 5 V tại 20 mA, còn 7 V](</api/article-media/ed42f678-7976-48aa-9f02-6cfce03324d8> "Minh họa nguyên lý do DTPT Techs biên tập. Các giá trị là giả định, không phải thông số model hay sơ đồ đấu dây. Khoảng 7 V còn phải chia cho dây, phụ kiện và dự phòng.")

NI nhấn mạnh nguồn phải đáp ứng tổng sụt áp, gồm cả đường dây [1]. Khi thiết kế, dùng điện áp nguồn thấp nhất và dòng lớn nhất dự kiến, kể cả mức báo lỗi nếu có. Không chỉ tính ở 4 mA hoặc coi nguồn danh định 24 V là luôn đủ.

Nếu dòng không lên hết thang, kiểm tra điện áp tại transmitter và tải thực tế trước khi kết luận cảm biến hỏng. Không tự tăng nguồn vượt giới hạn thiết bị hoặc tháo bảo vệ để ép đạt số đo.

## 3. Có cách ly vẫn phải đọc đúng phạm vi

Phân biệt cách ly giữa kênh với nguồn/truyền thông và cách ly từng kênh với nhau. NI lưu ý phần cách ly cũng có giới hạn điện áp chế độ chung [1]. Từ “isolated” trên trang giới thiệu chưa trả lời được toàn bộ sơ đồ nối đất.

Yêu cầu xác nhận giới hạn từng đầu vào, điểm tham chiếu và cách nối shield theo manual. Nếu các cảm biến ở những vị trí có điện thế đất khác nhau, cần đánh giá cấu hình cách ly phù hợp; không nối chung các đầu âm theo thói quen hoặc nối tắt cách ly để hết nhiễu.

## 4. Tách dòng điện khỏi giá trị kỹ thuật

Với cảm biến tuyến tính cấu hình 0–10 bar tương ứng 4–20 mA, 4 mA là 0 bar, 12 mA là 5 bar và 20 mA là 10 bar. Công thức là: giá trị = mức thấp + (dòng mA − 4) ÷ 16 × khoảng đo.

Ví dụ này chỉ đúng khi hai đầu cấu hình cùng khoảng đo và quy luật tuyến tính. Kiểm tra đơn vị bar/kPa, giá trị thô của module và việc phần mềm đã quy đổi hay chưa. Quy đổi hai lần cũng có thể tạo số trông hợp lý nhưng sai.

Không ép mọi dòng dưới 4 mA thành giá trị thấp nhất. Cần đối chiếu cách thiết bị báo mất tín hiệu, quá dải hoặc lỗi cảm biến; 0 mA có thể do hở vòng hay mất nguồn. Phần mềm nên lưu trạng thái chất lượng cùng giá trị.

## 5. Thử trên bàn trước khi đưa vào vận hành

Dùng bộ thử riêng, nguồn có giới hạn dòng và thiết bị phát/giả lập phù hợp. Fluke giải thích chế độ Simulate thay vai trò transmitter và lấy năng lượng từ nguồn vòng ngoài [3]. Chọn đúng chế độ theo manual, không ghép hai nguồn cấp vòng tùy ý.

- Ghi cấu hình ban đầu và sao lưu trước khi đổi dải đo.
- Theo sơ đồ hãng, thử các điểm 4, 12 và 20 mA; ghi giá trị dòng, số thô và đơn vị sau quy đổi.
- Đối chiếu với sai số chấp nhận của công việc, không chỉ kiểm tra kim hoặc số có thay đổi.
- Thử mất tín hiệu trên bộ thử, xác nhận báo lỗi và phục hồi; hoàn trả cấu hình đã duyệt trước khi bàn giao.

Không tháo dây hoặc chèn thiết bị thử vào vòng điều khiển đang chạy nếu chưa có điều kiện an toàn và kế hoạch được phê duyệt.

Khi hỏi báo giá, gửi loại transmitter, số kênh, nguồn vòng, tổng tải, chiều dài dây, yêu cầu cách ly, tốc độ cập nhật và tiêu chí đạt. Tham khảo module trong catalogue: https://dtpt.shop/san-pham/advantech-adam-4017-plus-8ai-modbus

## Nguồn đối chiếu

- [1] NI, nguyên lý và thiết kế vòng dòng: https://www.ni.com/en/shop/data-acquisition/fundamentals--system-design--and-setup-for-the-4-to-20-ma-curren.html
- [2] Texas Instruments, tải đầu vào vòng dòng: https://www.ti.com/document-viewer/lit/html/SSZTA14/GUID-6DB50EC8-054D-4C74-8345-64C80F8F211D
- [3] Fluke, kiểm tra bằng mA Simulate: https://www.fluke.com/en-gb/learn/blog/calibration/troubleshooting-a-4-20-ma-loop-using-ma-simulate
