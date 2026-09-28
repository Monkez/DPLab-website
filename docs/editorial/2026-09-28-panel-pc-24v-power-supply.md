# Bài đã xuất bản: Chọn nguồn 24VDC cho Panel PC: vì sao 60 W chưa chắc đủ?

- Trạng thái: đã xuất bản lúc 10:07 ngày 28/09/2026 (Asia/Ho_Chi_Minh).
- CMS ID: `NEWS-1790564826425`
- URL công khai: https://dtpt.shop/tin-tuc/chon-nguon-24vdc-cho-panel-pc
- Slug: `chon-nguon-24vdc-cho-panel-pc`
- Chuyên mục: Kiến thức kỹ thuật
- Tóm tắt: Cách tính dòng, kiểm tra dòng khởi động, suy giảm theo nhiệt độ và sụt áp dây khi chọn nguồn 24VDC cho Panel PC, HMI cùng thiết bị trong tủ điện.
- SEO title: `Chọn nguồn 24VDC cho Panel PC: 60 W đã đủ chưa?`
- SEO description: `Hướng dẫn chọn nguồn 24VDC cho Panel PC theo tải cực đại, dòng khởi động, nhiệt độ, sụt áp dây và bảo vệ nhánh; kèm ví dụ và checklist nghiệm thu.`
- Tag: nguồn 24VDC, Panel PC, nguồn DIN rail, tủ điện, MEAN WELL
- Ảnh đại diện: `/products/axiomtek-got315a-elk-wcd.jpeg`
- Sản phẩm liên quan: Axiomtek GOT315A-ELK-WCD và MEAN WELL HDR-60-24.

## Nội dung nhập CMS

Một Panel PC ghi đầu vào 24VDC và công suất khoảng 60 W có dùng được nguồn DIN rail 24V/60 W hay không? Chưa thể kết luận từ con số watt. Nguồn còn phải chịu lúc khởi động, nhiệt trong tủ, sụt áp dây và các tải dùng chung. Chọn vừa khít trên giấy có thể khiến máy khởi động lại ngẫu nhiên.

## 1. Bắt đầu từ tải cực đại, không dùng TDP của CPU

Hãy lấy công suất hoặc dòng đầu vào cực đại của cả thiết bị từ datasheet, không lấy TDP của CPU. TDP chưa gồm màn hình, SSD, RAM, USB, cổng mở rộng và tổn hao chuyển đổi bên trong.

Ví dụ, Axiomtek công bố GOT315A-ELK-WCD dùng 9–36VDC, tối đa 60,3 W. Ở 24 V, dòng tính toán là 60,3 ÷ 24 ≈ 2,51 A. MEAN WELL HDR-60-24 có định mức 24 V, 2,5 A, 60 W. Tải cực đại của riêng Panel PC đã nhỉnh hơn định mức nguồn, chưa tính ngoại vi. Vì vậy HDR-60-24 không phù hợp để cấp chung cho cấu hình ví dụ này.

Đây là phép kiểm tra định mức, không phải kết quả đo tại DTPT. Muốn chốt thiết kế phải đo trên đúng cấu hình và ngoại vi sẽ lắp.

## 2. Lập bảng tải theo từng nhánh 24VDC

Lập bảng gồm điện áp cho phép, dòng liên tục cực đại, dòng khởi động nếu hãng công bố, thời gian xung và nhánh bảo vệ cho Panel PC/HMI, PLC, remote I/O, cảm biến, relay, van và bộ chuyển đổi mạng.

Với tải chỉ có công suất, dùng I = P ÷ V để quy đổi về dòng. Kiểm tra tình huống bất lợi khi CPU, SSD, màn hình, I/O và ngoại vi cùng hoạt động. Không áp một tỷ lệ dự phòng cố định cho mọi tủ; phần dư phải bao phủ sai số tải, mở rộng đã biết và mức giảm công suất thực tế của nguồn.

## 3. Dòng khởi động có thể làm sụt cả thanh cái

Màn hình và thiết bị có tụ đầu vào thường hút một xung dòng khi bật. Nhiều tải khởi động cùng lúc có thể kéo 24V xuống dưới ngưỡng của Panel PC, gây treo dù dòng ổn định vẫn dưới định mức.

Siemens cho biết bật tuần tự các ngõ ra giúp giảm dòng khởi động nguồn phải cấp và hạn chế sụt áp. Điều này cho thấy cần kiểm tra đặc tính quá tải ngắn hạn và trình tự đóng tải. Nếu datasheet không nêu dòng khởi động, hãy yêu cầu xác nhận hoặc đo trên hệ thống thử.

## 4. Nhiệt độ trong tủ làm giảm công suất khả dụng

Định mức trên nhãn chỉ đúng trong điều kiện datasheet quy định. Đường cong HDR-60 cho phép 100% tải đến khoảng 45 °C, rồi giảm dần còn khoảng 50% ở 70 °C. Ở đầu vào 85 VAC, tải cho phép khoảng 80% và đạt 100% từ 100 VAC.

Dùng nhiệt độ dự kiến quanh nguồn sau khi tủ kín chạy ổn định, không dùng nhiệt độ phòng. Giữ khoảng thoáng, tránh đặt nguồn sát biến tần hoặc điện trở xả, và kiểm tra đường cong khi tủ ngoài trời hay nguồn AC yếu. Không tăng điện áp đầu ra để che sụt áp khi chưa kiểm tra giới hạn mọi tải.

## 5. Tính sụt áp và bảo vệ từng nhánh

Dây dài, tiết diện nhỏ và đầu nối tạo điện trở. Tính sụt áp trên cả dây đi và về, rồi đo tại Panel PC khi tải lớn nhất và lúc khởi động. Nếu điện áp gần giới hạn thấp, hãy tăng tiết diện, rút ngắn tuyến hoặc đưa nguồn gần tải hơn.

Một lỗi ở cảm biến không nên kéo sập Panel PC. Siemens lưu ý MCB thông thường có thể không cắt nhanh trong mạch 24VDC vì nguồn giới hạn dòng và điện trở dây làm giảm dòng sự cố. Với hệ thống cần duy trì vận hành, hãy tách tải quan trọng và chọn bảo vệ theo đặc tính nguồn, dòng tải và chiều dài cáp.

## 6. Checklist trước khi duyệt cấu hình

- Chốt đúng hậu tố model, dải điện áp, cực tính, đầu nối và công suất/dòng cực đại của Panel PC.
- Liệt kê tải dùng chung 24VDC; ghi dòng liên tục, dòng khởi động và kế hoạch mở rộng.
- Đối chiếu công suất khả dụng theo nhiệt độ tủ, điện áp AC đầu vào và hướng lắp của đúng model nguồn.
- Kiểm tra quá tải ngắn hạn, trình tự khởi động và UPS nếu cần tắt máy an toàn.
- Tính sụt áp hai chiều; chọn dây, cầu đấu và bảo vệ riêng cho từng nhánh theo tiêu chuẩn của dự án.
- Chạy thử cấu hình xấu nhất nhiều lần: khởi động nguội, đủ ngoại vi và tải bật đồng thời. Ghi điện áp thấp nhất tại máy và nhiệt độ tủ.
- Chỉ đo hoặc đấu lại trên hệ thống đã cô lập, mất điện và được người có thẩm quyền xác nhận an toàn; không thử trực tiếp trên dây chuyền đang chạy.

Khi yêu cầu báo giá, nên kèm bảng tải, nhiệt độ tủ, nguồn AC, chiều dài dây và sơ đồ nhánh. Xem hai model được nhắc trong bài:
https://dtpt.shop/san-pham/axiomtek-got315a-elk-wcd
https://dtpt.shop/san-pham/mean-well-hdr-60-24

## Nguồn tham khảo

Axiomtek — GOT315A-ELK-WCD, thông số đầu vào 9–36VDC, công suất cực đại 60,3 W và phụ kiện adapter 24V/120 W:
https://www.axiomtek.com/products/panel-pcs-and-monitors/fanless-touch-panel-pc/rugged-fanless-touch-panel-pc/got315a-elk-wcd

MEAN WELL — HDR-60 series datasheet, thông số HDR-60-24 và đường cong giảm tải theo nhiệt độ/điện áp đầu vào:
https://www.meanwell.com/Upload/PDF/HDR-60/HDR-60-SPEC.PDF

Siemens — Electronic protection and fast fault localization in 24 V DC load circuits, về dòng khởi động, chọn lọc bảo vệ và ảnh hưởng của điện trở đường dây:
https://cache.industry.siemens.com/dl/files/409/109766409/att_1347795/v1/SITOP-select_en.pdf

## Ghi chú biên tập — không đưa vào nội dung công khai

- Thông số Axiomtek lấy từ trang hãng kiểm tra ngày 28/09/2026. Bài dùng mức 60,3 W hiện hiển thị trên trang sản phẩm; tài liệu catalogue cũ có thể ghi khác nên khi đặt hàng vẫn phải chốt revision và cấu hình.
- Phép tính 60,3 W ÷ 24 V = 2,5125 A được làm tròn 2,51 A. Đây là kiểm tra định mức, không phải benchmark hay phép đo của DTPT.
- Datasheet MEAN WELL HDR-60 bản hãng ghi HDR-60-24: 24 V, 2,5 A, 60 W; đường cong cho 100% tải đến khoảng 45 °C, giảm còn 50% ở 70 °C; đầu vào 85 VAC cho khoảng 80% tải và từ 100 VAC đạt 100%.
- Ảnh `/products/axiomtek-got315a-elk-wcd.jpeg` là ảnh model thực đã có trong catalogue. Chỉ dùng một ảnh vì ảnh sản phẩm nguồn chưa có trong kho media được kiểm soát; không chèn ảnh trang trí hoặc ảnh AI giả thiết bị.
- Renderer dùng URL thuần cho nguồn và catalogue vì chưa hỗ trợ đầy đủ Markdown liên kết.
- Không thêm bài vào `articleSeed.js`; production đã có dữ liệu PostgreSQL.
- Kiểm tra sau xuất bản: API công khai và sitemap có đúng một bản ghi; URL và ảnh cover trả HTTP 200; canonical, SEO description, Open Graph, robots và JSON-LD Article đúng; giao diện desktop/mobile không tràn ngang, ảnh tải thành công và trình duyệt không ghi nhận lỗi.
