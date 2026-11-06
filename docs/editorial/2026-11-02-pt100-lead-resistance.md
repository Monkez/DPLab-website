# Pt100 ba dây: vì sao nhiệt độ vẫn có thể bị lệch?

- Ngày biên tập: 02/11/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API sau khi rà nháp desktop/mobile.
- Ngày xuất bản: `2026-11-06T03:07:22.236Z`.
- URL: https://dtpt.shop/tin-tuc/pt100-ba-day-sai-so-dien-tro-day-dan
- CMS ID: `NEWS-1793589057442`.
- Slug: `pt100-ba-day-sai-so-dien-tro-day-dan`.
- Chuyên mục: Kiến thức kỹ thuật
- Tác giả: DTPT Techs
- Tag: Pt100, Đo nhiệt độ, Module RTD
- SEO title: Pt100 ba dây vẫn sai nhiệt độ: kiểm tra gì trước?
- SEO description: Hiểu sai số điện trở dây dẫn Pt100, giới hạn bù ba dây và điều kiện đo bốn dây. Quy trình kiểm tra trên bàn trước khi đổi cảm biến hoặc chỉnh offset.
- Mô tả ngắn: Chọn Pt100 ba dây chưa bảo đảm nhiệt độ chính xác. Cần kiểm tra cách bù của module, cáp và tiếp điểm, rồi tách lỗi điện khỏi lỗi lắp đầu dò.
- Cover media: `/api/article-media/29c85128-3768-44bd-a1f7-a4331c879fd7`.
- Inline media: `/api/article-media/054064fc-6837-44e9-a2ff-d80f207bf85f`.
- Ảnh thật: “3 wire PT100 Sensor.jpg”, tác giả Suyash Dwivedi, chụp 08/01/2016, nguồn https://commons.wikimedia.org/wiki/File:3_wire_PT100_Sensor.jpg ; tệp gốc https://upload.wikimedia.org/wikipedia/commons/c/c8/3_wire_PT100_Sensor.jpg . Giấy phép CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ . Đã xem trực tiếp: đầu dò ghi WZP Pt100, cuộn dây và ba đầu dây, có thước. Không suy ra cấp chính xác, dải nhiệt, chuẩn màu dây hoặc tồn kho từ ảnh. CMS chỉ thu nhỏ/chuyển WebP, bỏ metadata; không chỉnh nội dung, ghi attribution/nguồn/giấy phép và thay đổi trong bài, bản ảnh tái sử dụng cùng giấy phép. Không đưa ảnh gốc có EXIF vào Git; tệp làm việc giữ tại `work/editorial-20261102/`.
- Hình tính toán: SVG gốc `docs/editorial/assets/2026-11-02-pt100-two-wire-budget.svg`, mô hình tổng điện trở hai dây giả định R_RTD = 100 Ω, R_đi = R_về = 0,5 Ω → R_đọc = 101 Ω; không phải sơ đồ chân hoặc kết quả đo. Không dùng xấp xỉ 0,385 Ω/°C làm công thức hiệu chuẩn, không gán ví dụ cho cảm biến trong ảnh hoặc ADAM-4015.
- Phạm vi: Pt100 nối trực tiếp đầu đọc/module RTD; phân biệt cảm biến ba dây với transmitter 4–20 mA. Không trùng bài vòng dòng 23/10 (nguồn/tải/scaling) hoặc USB DAQ 12/10 (tốc độ/độ chính xác ADC). Chưa có bài Pt100/RTD trùng trong 23 bài public và không có nháp trước lượt này.
- Nguồn sơ cấp kiểm tra 02/11: TE Connectivity về Pt100/đường đặc tính/điện trở dây; NI về sai lệch điện trở ba dây, phần cứng bốn dây và lắp nhiệt; Analog Devices về kích dòng, tự nung và cấu hình đo. Không coi nguồn hướng dẫn là kiểm thử thiết bị DTPT, không gọi đây là tin ra mắt.
- Quyết định ảnh: catalogue ADAM-4015 dùng ảnh ADAM-4017+ chung, không dùng để nhận diện module RTD hoặc minh họa sơ đồ đấu. Chọn ảnh đầu dò thật có giấy phép rõ và một hình tính toán có giá trị giải thích; không dùng ImageGen.
- Kiểm tra ngày 06/11: 959 từ trước nguồn tham khảo, không tính chú thích hình; SEO title 49 ký tự, description 149 ký tự. Ba test renderer đạt. Đã rà nháp CMS và public qua Chrome ở desktop mặc định và mobile 390 px bằng screenshot/DOM: sáu heading, bốn mục checklist, hai ảnh đủ alt/chú thích/ghi nguồn, không tràn ngang hoặc lộ Markdown. Hình tính toán đọc được trên mobile; ảnh đầu dò public WebP 1.920 × 1.280, hình tính toán 720 × 740. Renderer hiện hiển thị URL nguồn/nội bộ dạng văn bản để sao chép.
- API public có đúng một bản theo slug và khớp payload duyệt; giữ nguyên 23 bài khác bằng hash đối chiếu trước/sau xuất bản. Mục Tin tức có một thẻ bài mới và điều hướng đúng trang. URL bài, catalogue ADAM-4015 và hai ảnh HTTP 200; canonical hiện hành `https://dtpt.shop`, sitemap có đúng một URL. Sau cache, HTML server đúng SEO title/description, Open Graph/ảnh, robots cho lập chỉ mục; Article schema đúng headline/description/ảnh/ngày/URL. Metadata hoàn tất kiểm tra khoảng 264 giây sau xuất bản.
- Bằng chứng: `pt100-published.jpg`, `pt100-mobile.jpg`, `pt100-mobile-diagram.jpg` và ảnh nháp trong thư mục proof 06/11 ngoài Git. Baseline hash/payload/validation tại `work/editorial-20261106/`, tệp chuẩn bị cũ ở `work/editorial-20261102/`, đều ngoài commit và không chứa credential. Giữ đúng CMS ID/slug và hai ảnh đã tạo ngày 02/11. Không sửa seed, catalogue, source ứng dụng hoặc reset DB; kiểm tra renderer/API/giao diện chạy thật thay full build không liên quan.

## Nội dung CMS

Nhiệt độ đọc cao hơn dự kiến không nhất thiết do Pt100 hỏng. Khi nối cảm biến về tủ đo, điện trở dây và đầu nối cũng tham gia phép đo. Đổi sang đầu dò đắt hơn có thể không giải quyết đúng nguyên nhân nếu module vẫn đo sai cấu hình.

Bài áp dụng cho Pt100 nối trực tiếp đầu đọc RTD. Nếu đầu dò đã qua transmitter xuất 4–20 mA, cần kiểm tra riêng phần RTD và vòng dòng; không áp dụng cách đấu dây dưới đây cho ngõ ra transmitter.

Ảnh đại diện: đầu dò Pt100 ba dây, Suyash Dwivedi/Wikimedia Commons [4], CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/ . Ảnh thu nhỏ/chuyển WebP, không chỉnh nội dung; không xác nhận cấp chính xác hoặc máy có sẵn tại DTPT.

## 1. Máy đang đo cảm biến hay cả đoạn cáp?

Pt100 có điện trở danh định 100 Ω tại 0°C; phải chọn đúng đường đặc tính cảm biến trong đầu đọc [1]. Với phép đo hai dây, điện trở đo được gồm phần tử RTD và hai dây nối tiếp. Máy không tự biết phần tăng thêm đến từ nhiệt độ hay dây dẫn.

Ví dụ giả định: phần tử đang đúng 100 Ω, mỗi dây có điện trở 0,5 Ω, bỏ qua tiếp điểm và các sai số khác. Đầu đọc hai dây thấy 101 Ω, nên diễn giải thành nhiệt độ cao hơn. Thêm chữ số hiển thị hoặc chọn ADC nhiều bit hơn không loại được phần điện trở này.

![Ví dụ đo Pt100 hai dây: phần tử 100 ohm cộng dây đi 0,5 ohm và dây về 0,5 ohm thành 101 ohm](</api/article-media/054064fc-6837-44e9-a2ff-d80f207bf85f> "Hình tính toán gốc DTPT Techs. Các điện trở là giả định tại một thời điểm, không phải số đo cảm biến trong ảnh; không phải sơ đồ chân thiết bị.")

Bù một offset cố định chỉ khớp tại điều kiện đã kiểm tra. Analog Devices lưu ý điện trở dây còn thay đổi theo nhiệt độ [3]; một giá trị bù lúc tủ mát có thể không còn phù hợp lúc tủ nóng.

## 2. Ba dây bù được gì, còn điều kiện nào?

Đầu đọc hỗ trợ ba dây sử dụng thêm đường nối để ước lượng, bù ảnh hưởng dây dẫn. NI cảnh báo điện trở các dây không nhất quán vẫn gây sai số [2]. Vì vậy, cùng chiều dài và tiết diện là điểm khởi đầu; mối nối lỏng, oxy hóa hoặc nối dài khác loại có thể làm mất cân bằng.

Không có một sơ đồ chân chung cho mọi module. Cần xác định hai dây cùng nối một đầu phần tử theo tài liệu cảm biến, rồi đối chiếu sơ đồ đầu đọc. Không mặc định dây cùng màu luôn đúng chức năng, và không nối thêm dây ở đầu tủ để coi đầu dò hai dây đã thành ba dây đúng nghĩa.

Khi hỏi nhà cung cấp, yêu cầu giới hạn điện trở dây và độ mất cân bằng cho phép, phương pháp bù, cùng sai số ở cấu hình sử dụng. “Hỗ trợ Pt100” chưa trả lời đủ các câu hỏi đó.

## 3. Bốn dây cũng cần đúng phần cứng

Đo bốn dây tách đường cấp dòng kích và đường đo điện áp trên phần tử, giảm ảnh hưởng điện trở dây. Cả TE và NI đều lưu ý đầu đọc phải hỗ trợ phép đo bốn dây thực sự [1][2]. Đầu dò có bốn sợi nhưng đấu vào đầu đọc ba dây không tự tạo ra phép đo Kelvin.

Bốn dây phù hợp khi yêu cầu sai số và điều kiện cáp đòi hỏi; đổi lại cần thêm dây, chân đấu và phần cứng tương ứng. Nó không xóa mọi sai số: dung sai cảm biến, đầu đọc và vị trí lắp vẫn cần xét.

Kích dòng còn gây tự nung phần tử; Analog Devices phân tích đây là đánh đổi khi tăng tín hiệu đo [3]. Không tự tăng dòng để “đọc rõ hơn” ngoài điều kiện hãng quy định.

## 4. Tách lỗi điện và lỗi lắp bằng thử trên bàn

Chỉ thực hiện trên bộ thử cô lập, bởi người có chuyên môn. Không tháo đầu dò trên thiết bị nóng, có áp suất hoặc vòng điều khiển đang chạy. Lưu cấu hình, ghi nhãn dây và chuẩn bị bản khôi phục trước khi thay đổi.

- Ghi lại loại RTD, đường đặc tính, số dây, dải đo, lọc và offset hiện tại. Đối chiếu manual đúng model/revision; đừng sửa nhiều tham số cùng lúc.
- Dùng bộ giả lập RTD hoặc hộp điện trở chuẩn có hồ sơ hiệu chuẩn phù hợp để thử đầu đọc ở vài điểm trong dải làm việc, đấu đúng hướng dẫn. Ghi giá trị đặt, giá trị đọc, sai lệch và độ không đảm bảo của chuẩn. Đây là kiểm tra phần điện, chưa chứng minh đầu dò lắp ngoài hiện trường đúng.
- Nếu phần điện đạt, thử cả đầu dò với nhiệt kế tham chiếu trong môi trường nhiệt ổn định, cùng vị trí và độ nhúng phù hợp. Chờ ổn định rồi so sánh; hai đầu dò đặt khác điểm có thể gặp nhiệt độ khác nhau [2].
- Nếu kết quả không đạt, giữ bộ thử ngoài vận hành, phục hồi cấu hình đã lưu và xử lý nguyên nhân. Không chỉnh offset để ép một điểm khớp rồi coi đã nghiệm thu cả dải.

## 5. Hồ sơ cần chốt trước khi mua

Gửi nhà cung cấp dải nhiệt, sai số hệ thống cho phép, chiều dài cáp, môi trường lắp và thời gian đáp ứng cần thiết. Yêu cầu xác nhận tổ hợp cảm biến–cáp–đầu đọc, hỗ trợ hai/ba/bốn dây, phương án kiểm tra đứt dây và hồ sơ hiệu chuẩn. Tiêu chí nghiệm thu cần bao gồm cả phần điện và lắp nhiệt.

Tham khảo module RTD ADAM-4015 trong catalogue DTPT; đối chiếu sơ đồ và cấu hình theo tài liệu hãng trước khi hỏi báo giá: https://dtpt.shop/san-pham/advantech-adam-4015

## Nguồn tham khảo

[1] TE Connectivity, Understanding RTDs: https://www.te.com/en/products/sensors/temperature-sensors/resources/understanding-rtds.html

[2] NI, Measuring Temperature with Thermocouples, RTDs, and Thermistors: https://www.ni.com/en/shop/data-acquisition/sensor-fundamentals/measuring-temperature-with-thermocouples-rtds-and-thermistors.html

[3] Analog Devices, How to Select and Design the Best RTD Temperature Sensing System: https://www.analog.com/en/resources/analog-dialogue/articles/how-to-select-and-design-the-best-rtd-temperature-sensing-system.html

[4] Suyash Dwivedi, 3 wire PT100 Sensor, nguồn và giấy phép ảnh: https://commons.wikimedia.org/wiki/File:3_wire_PT100_Sensor.jpg
