# Cảm biến PNP hay NPN: kiểm tra ngõ vào PLC trước khi mua

- Ngày biên tập: 25/11/2026, khung 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API có quyền `articles.manage` sau khi rà nháp CMS desktop/mobile.
- Ngày xuất bản: `2026-11-25T03:07:56.289Z`.
- URL: https://dtpt.shop/tin-tuc/cam-bien-pnp-npn-chon-dung-ngo-vao-plc
- CMS ID: `NEWS-1795575882916`.
- Slug: `cam-bien-pnp-npn-chon-dung-ngo-vao-plc`.
- Chuyên mục: Kiến thức kỹ thuật
- Tác giả: DTPT Techs
- Tag: Cảm biến, PLC, PNP NPN
- SEO title: Cảm biến PNP hay NPN: kiểm tra ngõ vào PLC trước khi mua
- SEO description: Phân biệt ngõ ra cảm biến PNP/NPN, ngõ vào PLC và chân COM. Checklist đọc datasheet, thử trên bàn và kiểm tra NO/NC trước khi chọn thiết bị thay thế.
- Mô tả ngắn: Đèn cảm biến sáng chưa chứng minh PLC đã nhận tín hiệu. Cần đối chiếu kiểu ngõ ra, mạch ngõ vào và chân chung trước khi mua hoặc thay cảm biến.
- Nguồn sơ cấp: OMRON FAQ00379 về vị trí tải NPN/PNP; Schneider Electric FA142566 về cảm biến DC ba dây, PNP/NPN độc lập với NO/NC và nhóm ngõ vào dùng chung cấu hình; OMRON Explanation of Terms về dòng rò/điện áp dư, giới hạn hai dây. Kiểm tra 25/11/2026; bài hướng dẫn, không phải tin mới hoặc kết quả thử DTPT.
- Ảnh thật: `File:Inductive proximity sensor.jpg`, tác giả Ekbsensor, own work ngày 22/03/2019, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Inductive_proximity_sensor.jpg ; https://creativecommons.org/licenses/by-sa/4.0/ . Đã xem bản 960 × 1550: cảm biến dạng trụ, nhãn có sơ đồ nhiều ngõ ra; dùng để minh họa vị trí đọc nhãn, không gọi là cảm biến ba dây hoặc suy ra pinout/model đầy đủ từ ảnh. Dùng thumbnail liên kết từ Commons, giữ bố cục, CMS chuyển WebP/bỏ metadata; ảnh tái sử dụng theo CC BY-SA 4.0.
- cover media: `/api/article-media/2d98a438-9a99-4577-8390-6bc868d3bb59`.
- diagram media: `/api/article-media/1c459e51-fc55-41dd-966e-82a05cb820d4`.
- Sơ đồ: source `docs/editorial/assets/2026-11-25-pnp-npn-current.svg`, DTPT Techs tự dựng từ nguyên lý dòng của OMRON/Schneider; minh họa dòng quy ước khi ngõ ra ON, không phải sơ đồ đấu chân cụ thể. Ví dụ 24 V không thay thế dải nguồn/ngưỡng logic của model thực tế.
- Không dùng ảnh catalogue `delta-dvp-plc.jpg`: đã xem và thấy tem DVP28SV, khác DVP14SS211R, có watermark bên thứ ba. Không sửa catalogue trong tác vụ biên tập. Không dựa vào bản PDF Delta bị chặn/timeout để khẳng định wiring của DVP-SS2.
- Phạm vi: chọn cặp cảm biến chuyển mạch DC ba dây và ngõ vào số PLC. Đã đối chiếu 28 bài, chưa có nháp/bài ngày 25/11; không trùng bài ADAM-6050 về phạm vi tín hiệu hoặc bài 4–20 mA về vòng dòng analog.
- Kiểm tra nội dung: 923 từ trước phần đọc thêm/nguồn cuối, gồm heading và chú thích sơ đồ (884 từ phần văn bản, 39 từ chú thích); SEO title 56 ký tự, description 149 ký tự. Đã tự biên tập lại về phạm vi ba dây, đường dòng, NO/NC, COM dùng chung và điều kiện thử an toàn trước xuất bản. Không đưa số đo, giá, tồn kho hay pinout chưa xác nhận.
- Ba test renderer đạt. Đã xem nháp CMS và public trên desktop/mobile 390 px bằng screenshot/DOM: bốn mục chính, bốn mục checklist, một hình xen kẽ đúng alt/chú thích, không lộ Markdown hoặc tràn ngang. Ảnh thật 960 × 1550 và sơ đồ 720 × 780 tải đủ, giữ bố cục, ảnh không bị cắt. Media WebP tương ứng 265.404 và 42.720 byte.
- API public có một bài theo slug và khớp payload đã duyệt; hash của 28 bài trước giữ nguyên. Tin tức có một thẻ bài, điều hướng đúng URL. Bài, hai ảnh và hai bài nội bộ HTTP 200. URL tham khảo hiển thị dạng văn bản để sao chép theo renderer hiện hành. HTML server sau cache đúng SEO title/description, Open Graph/ảnh và robots cho lập chỉ mục; canonical hiện hành `https://dtpt.shop`. Article schema đúng headline, description, ảnh, ngày và URL; sitemap có đúng một URL. Tất cả đạt ở lần kiểm tra khoảng 334 giây sau xuất bản.
- Bằng chứng: `draft-desktop.jpg`, `draft-mobile-diagram.jpg`, `draft-mobile-checklist.jpg`, `published-desktop.jpg`, `published-mobile.jpg`, `published-mobile-diagram.jpg` trong thư mục proof tạm ngoài Git. Ảnh nguồn/PNG trung gian, payload, baseline và validation tại `work/editorial-20261125/`, không chứa credential. SVG gốc duy trì trong docs, hai ảnh public lưu PostgreSQL `article_media`; không đổi ứng dụng, seed hoặc catalogue nên không cần full build ứng dụng.

## Nội dung CMS

Cảm biến phát hiện vật và bật đèn báo nhưng ngõ vào PLC vẫn không đổi trạng thái là tình huống cần kiểm tra cả hai đầu. Trước khi mua cảm biến thay thế, hãy xác định ngõ ra PNP hay NPN có tạo được đường dòng phù hợp với ngõ vào PLC hay không.

Bài áp dụng cho cảm biến chuyển mạch DC ba dây và ngõ vào số tương thích. Cảm biến hai dây, ngõ ra analog, IO-Link hoặc thiết bị an toàn cần tài liệu riêng; không áp dụng máy móc cách ghép dưới đây.

Ảnh đại diện của Ekbsensor/Wikimedia Commons [4], CC BY-SA 4.0, minh họa cảm biến có sơ đồ trên nhãn. Ảnh được thu nhỏ, chuyển WebP và giữ theo giấy phép https://creativecommons.org/licenses/by-sa/4.0/ . Không dùng kiểu vỏ trong ảnh để kết luận PNP/NPN hay số dây của thiết bị cần mua.

## 1. Theo đường dòng, đừng chỉ nhìn chữ PNP/NPN

OMRON giải thích: với ngõ ra NPN, tải nằm giữa cực dương nguồn và ngõ ra cảm biến; với PNP, tải nằm giữa ngõ ra và cực âm nguồn [1]. Khi ghép PLC, mạch ngõ vào đóng vai trò tải này.

Với cặp tương thích trong ví dụ DC, PNP cấp dòng vào chân IN, dòng đi qua mạch ngõ vào rồi về COM 0 V. NPN kéo dòng từ mạch ngõ vào về 0 V; phía COM của ngõ vào tương ứng nối cực dương. PNP ghép đầu vào sinking, NPN ghép đầu vào sourcing [2].

![Đường dòng PNP về COM 0 V và đường dòng NPN từ COM dương qua ngõ vào PLC, khi transistor ON](</api/article-media/1c459e51-fc55-41dd-966e-82a05cb820d4> "Sơ đồ nguyên lý DTPT Techs từ OMRON và Schneider Electric. Hai dòng đánh số nối tiếp nhau; ví dụ DC 24 V, đã lược mạch cấp nguồn. Không dùng thay sơ đồ đấu chân của model thực tế.")

Cần đọc tên gọi từ phía thiết bị đang xét: “sourcing” của cảm biến và “sourcing” của card input không mô tả cùng vai trò. Hãy yêu cầu sơ đồ dòng hoặc sơ đồ đấu nối của đúng card, thay vì đặt hàng chỉ theo câu “PLC dùng NPN”.

## 2. Chốt kiểu ngõ vào và nhóm chân chung

Ghi đủ mã PLC hoặc module mở rộng, revision và nhóm chân IN sẽ dùng. Tìm mục digital input trong manual để xác định điện áp, ngưỡng ON/OFF, dòng vào và cách nối COM. Tên hoặc loại ngõ ra relay/transistor của PLC không trả lời được câu hỏi về ngõ vào cảm biến.

Một số card có thể dùng theo cả hai kiểu, nhưng cách nối chân chung thường quyết định cấu hình cho cả nhóm input [2]. Không đổi COM của một nhóm để thử một cảm biến mới khi chưa kiểm tra các kênh đang dùng chung. Nếu cần phối hợp nhiều loại, xác nhận nhóm độc lập hoặc giải pháp giao tiếp phù hợp với nhà tích hợp.

Trong ví dụ 24 V, 0 V là điểm tham chiếu của mạch DC, không tự đồng nghĩa với dây bảo vệ PE. Đối chiếu thiết kế nguồn và manual trước khi nối các điểm tham chiếu của những bộ nguồn khác nhau.

## 3. PNP/NPN không quyết định NO/NC

Schneider Electric phân biệt rõ kiểu transistor với trạng thái thường mở NO hoặc thường đóng NC: cả PNP và NPN đều có thể có lựa chọn NO/NC [2]. Chọn đúng PNP nhưng sai NO/NC vẫn có thể khiến logic hiện diện vật bị đảo so với chương trình.

Tách riêng bốn dòng trong yêu cầu mua: dải nguồn, PNP/NPN, NO/NC và mã đầu nối/pinout. Với cảm biến quang, kiểm tra thêm cách hãng định nghĩa Light-ON/Dark-ON. Không đoán chân từ màu dây hoặc việc hai giắc cắm vừa nhau.

Đối chiếu dòng tải cho phép và sụt áp khi ON với yêu cầu của input. Riêng cảm biến hai dây có dòng rò khi OFF và điện áp dư khi ON, OMRON yêu cầu kiểm tra tải có hoạt động đúng trong hai điều kiện này [3]. Không tự thêm điện trở để chữa trạng thái chập chờn khi chưa có tính toán và hướng dẫn đúng model.

## 4. Kiểm tra trên bàn trước khi lắp vào máy

Chỉ thử ở môi trường được phép, với nhân sự đủ năng lực, nguồn DC đúng dải và giới hạn dòng phù hợp. Ngắt nguồn trước khi đổi dây; tách cơ cấu chấp hành để thay đổi tín hiệu không làm máy chuyển động. Không thử bằng cách đảo cực nguồn cảm biến.

- Kiểm tra mã thiết bị, sơ đồ chân và đường dòng trên giấy trước khi cấp nguồn. Xác nhận cả COM và các kênh cùng nhóm.
- Đưa vật vào rồi ra khỏi vùng phát hiện; ghi đồng thời đèn cảm biến, đèn input và bit ngõ vào trong chế độ giám sát PLC.
- Đối chiếu hai trạng thái với NO/NC đã chọn. Nếu đèn input đúng nhưng bit ứng dụng sai, kiểm tra địa chỉ và logic chương trình trước khi thay phần cứng.
- Nếu tín hiệu chỉ mất khi vật di chuyển nhanh, kiểm tra thời gian đáp ứng, bộ lọc input và chu kỳ xử lý; không quy mọi xung bị bỏ lỡ cho PNP/NPN.

Khi kết quả khác dự kiến, dừng thử, ngắt nguồn và kiểm tra lại cấu hình. Giữ cảm biến cũ cùng bản ghi đấu nối để đội bảo trì có phương án khôi phục được duyệt. Ngõ vào số thông thường không thay thế mạch an toàn hoặc liên động đã thiết kế cho máy.

## Đọc thêm tại DTPT

Checklist tín hiệu trước khi chọn module Digital I/O: https://dtpt.shop/tin-tuc/chon-adam-6050-checklist-tin-hieu-truoc-khi-hoi-gia

Với cảm biến ngõ ra analog 4–20 mA: https://dtpt.shop/tin-tuc/vong-dong-4-20ma-chon-module-analog-input

## Nguồn đối chiếu

[1] OMRON, FAQ00379, khác biệt ngõ ra NPN và PNP. https://www.ia.omron.com/support/faq/answer/41/faq00379/

[2] Schneider Electric, FA142566, PNP/NPN trong kết nối cảm biến ba dây. https://www.se.com/us/en/faqs/FA142566/

[3] OMRON, Proximity Sensors / Explanation of Terms, NO/NC và lưu ý dòng rò/điện áp dư cho cảm biến hai dây. https://www.ia.omron.com/support/guide/41/explanation_of_terms.html

[4] Ekbsensor, ảnh Inductive proximity sensor, Wikimedia Commons, 22/03/2019, CC BY-SA 4.0. https://commons.wikimedia.org/wiki/File:Inductive_proximity_sensor.jpg
