# HMI hay Panel PC Windows: tính cả phần mềm và phục hồi

- Ngày biên tập: 16/11/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API có quyền `articles.manage` sau khi rà nháp CMS desktop/mobile.
- Ngày xuất bản: `2026-11-16T03:18:52.257Z`.
- URL: https://dtpt.shop/tin-tuc/hmi-hay-panel-pc-windows-phan-mem-phuc-hoi
- CMS ID: `NEWS-1794799030586`.
- Slug: `hmi-hay-panel-pc-windows-phan-mem-phuc-hoi`.
- Chuyên mục: Tư vấn đầu tư
- Tác giả: DTPT Techs
- Tag: HMI, Panel PC, Chi phí vòng đời
- SEO title: HMI hay Panel PC Windows: phần mềm và khả năng phục hồi
- SEO description: So sánh HMI và Panel PC Windows theo dự án, giấy phép, môi trường lắp đặt và phục hồi. Checklist nghiệm thu và câu hỏi cần gửi nhà cung cấp.
- Mô tả ngắn: Khi thay HMI bằng Panel PC Windows, cần so tổng chi phí phần mềm, chuyển đổi dự án và phục hồi sau sự cố, thay vì chỉ so giá hai màn hình.
- Cover: `/products/axiomtek-got315a-elk-wcd.jpeg`, 500 × 500. Đã xem ảnh đúng model; tái sử dụng tài nguyên catalogue có sẵn, nguồn Axiomtek. Không gán đây là ảnh DTPT chụp hoặc cấu hình đã được DTPT thử nghiệm. Không dùng ảnh Delta DOP trong catalogue vì là ảnh nhiều model có watermark đơn vị khác và chưa rõ quyền tái sử dụng.
- Phạm vi: so sánh/đầu tư HMI chuyên dụng và Panel PC dùng Windows. Không trùng bài 30/09 về Arm/x86, 21/09 về COM hoặc 28/09 về nguồn 24V. Đã đọc danh sách 26 bài public, không có bài hoặc nháp ngày 16/11 khi bắt đầu.
- Nguồn: Siemens TIA Portal V21, tài liệu 11/2025, mục Client về ES/RT và giấy phép truy cập; Microsoft Learn Windows IoT Enterprise, cập nhật 12/11/2026, về LTSC và cập nhật bảo mật; Axiomtek GOT315A-ELK-WCD về mặt trước IP65. Đây là bài hướng dẫn quyết định, không phải tin ra mắt hay bài thử nghiệm; khuyến nghị nghiệm thu là nhận định biên tập, không có số đo thực nghiệm.
- Kiểm tra nội dung: 995 từ trước phần tham khảo, tính cả heading và đoạn ghi nguồn ảnh; SEO title 55 ký tự, description 140 ký tự. Đã tự biên tập về logic, giới hạn kết luận, câu chữ và an toàn trước xuất bản. Không suy ra giá, tốc độ, độ bền, tồn kho hoặc thời gian phục hồi chưa đo.
- Ba test renderer đạt. Đã rà nháp CMS và trang public bằng screenshot/DOM ở desktop và mobile 390 px: năm mục chính, bốn mục checklist, heading đúng, không lộ Markdown, không tràn ngang. Ảnh cover đúng model, 500 × 500, hiển thị đủ thiết bị. Nội dung ghi nguồn ảnh ở mục lắp đặt. URL nguồn và catalogue hiển thị dạng văn bản để sao chép theo renderer hiện hành.
- API public có đúng một bài theo slug, khớp payload đã duyệt; hash của 26 bài trước giữ nguyên. Tin tức có một thẻ bài, điều hướng đúng URL. Bài, ảnh và hai trang catalogue HTTP 200; đã đối chiếu title trang catalogue. HTML server sau cache đúng SEO title/description, Open Graph/ảnh và robots cho lập chỉ mục; canonical hiện hành `https://dtpt.shop`. Article schema đúng headline, description, ảnh, ngày và URL; sitemap có đúng một URL. Tất cả đạt ở lần kiểm tra khoảng 337 giây sau xuất bản.
- Bằng chứng: `draft-desktop.jpg`, `draft-mobile.jpg`, `published-desktop.jpg`, `published-mobile.jpg` trong thư mục proof tạm ngoài Git. Baseline hash, payload và validation tại `work/editorial-20261116/`, không chứa credential. Tác vụ chỉ thay nội dung CMS và tài liệu; kiểm tra renderer/API/giao diện thực tế phù hợp, không có thay đổi ứng dụng cần full build.

## Nội dung CMS

Một Panel PC Windows có thể trông giống HMI chuyên dụng nhưng báo giá phần cứng chưa cho biết chi phí thay thế. Câu hỏi cần chốt là: phương án nào chạy đúng dự án và được đội bảo trì khôi phục trong thời gian chấp nhận được?

Ở đây, HMI chuyên dụng là thiết bị vận hành theo hệ phần mềm của hãng; Panel PC là máy tính tích hợp màn hình, được xét với cấu hình Windows. Chức năng có thể giao nhau. Bài dùng tài liệu hãng làm căn cứ, chưa có thử nghiệm đối đầu giữa hai hệ thống.

## 1. Chốt công việc trước khi chọn nền tảng

Liệt kê màn hình vận hành, cảnh báo, công thức sản xuất, dữ liệu cần lưu và kết nối PLC. Kiểm tra cả macro hoặc tính toán đang nằm trong HMI cũ. Nếu bỏ sót chúng, giao diện mới hiển thị được nhưng quy trình vẫn có thể thiếu bước.

HMI chuyên dụng đáng ưu tiên khi dự án nằm trong khả năng model, bộ công cụ đã quen thuộc và đội bảo trì có bản sao lưu dùng được. Panel PC đáng xét khi cần phần mềm Windows cụ thể, cơ sở dữ liệu hoặc tích hợp nhiều ứng dụng mà HMI dự kiến không đáp ứng. Đây là tiêu chí lựa chọn, không phải kết luận rằng loại nào luôn nhanh hoặc bền hơn.

Yêu cầu nhà tích hợp trình diễn các màn hình khó nhất và chức năng quan trọng trên cấu hình đề xuất. Một bản chạy mô phỏng chỉ là bước đầu; cần kiểm tra với giao tiếp PLC và thiết bị đích thực tế.

## 2. Phân biệt dự án, phần mềm chạy và giấy phép

File dự án chỉnh sửa, gói triển khai và phần mềm runtime là các thành phần khác nhau. Có bản sao chương trình đang chạy chưa chắc đã có đủ tài nguyên để sửa hoặc chuyển sang nền tảng mới. Chốt định dạng, phiên bản công cụ, mật khẩu dự án và quyền bàn giao ngay trong yêu cầu kỹ thuật.

Ví dụ, tài liệu Siemens TIA Portal V21 phân biệt giấy phép WinCC Unified PC ES cho cấu hình với PC RT cho vận hành; truy cập từ xa còn có phạm vi giấy phép riêng [1]. Đây là ví dụ của WinCC Unified, không phải quy tắc cấp phép cho mọi HMI hoặc mọi phần mềm SCADA.

Báo giá Panel PC cần ghi Windows, runtime, số tag, driver PLC, chức năng lưu dữ liệu và client nào đã bao gồm. Hỏi riêng phí nâng cấp hoặc chuyển giấy phép khi thay máy. Với dự án khác hệ phần mềm, yêu cầu nhà cung cấp xác nhận phần chuyển đổi được và phần phải viết lại, kèm công nghiệm thu.

## 3. Đối chiếu cả lắp đặt và trách nhiệm cập nhật

Kích thước màn hình bằng nhau không bảo đảm vừa lỗ khoét. Đối chiếu kích thước lắp, độ sâu, đầu nối, nguồn và nhiệt độ trong tủ. Kiểm tra cảm ứng với loại găng sử dụng, độ đọc ngoài vị trí đứng thực tế và giao thức PLC; có cổng Ethernet chưa đủ chứng minh driver tương thích.

Ảnh đại diện là Panel PC Axiomtek GOT315A-ELK-WCD trong catalogue DTPT, nguồn Axiomtek [3]. Hãng nêu IP65 cho viền mặt trước; không suy rộng thành bảo vệ cả mặt sau hoặc toàn bộ tủ. Ảnh không xác nhận máy có sẵn runtime, giấy phép Windows hay cấu hình phù hợp dự án đang xét.

Với Windows, cần giao rõ người quản lý tài khoản, cập nhật và bản sao hệ thống. Microsoft mô tả Windows IoT Enterprise LTSC cho thiết bị chuyên dụng với tính năng ổn định, vẫn có cập nhật bảo mật tích lũy hằng tháng [2]. Tên LTSC không thay thế việc kiểm tra tương thích OS, driver và runtime của đúng máy.

## 4. Đo khả năng phục hồi trên bàn thử

Trước nghiệm thu, yêu cầu một bộ bàn giao gồm dự án chỉnh sửa, gói triển khai, firmware hoặc OS, driver, bộ cài runtime và phương án khôi phục giấy phép. Tài khoản và mật khẩu phải bàn giao qua kênh bảo mật của đơn vị.

- Dùng thiết bị dự phòng hoặc môi trường thử được phép; ghi thời gian từ lúc nguồn ổn định đến khi giao diện sẵn sàng và đọc đúng dữ liệu PLC.
- Khôi phục từ bản sao theo tài liệu, kiểm tra màn hình, cảnh báo, công thức, thời gian hệ thống và dữ liệu đã lưu.
- Mô phỏng mất kết nối ở bàn thử: giao diện phải thể hiện dữ liệu không còn hợp lệ; kiểm tra quy trình vận hành khi kết nối trở lại.
- Thử bản cập nhật theo kế hoạch, lưu kết quả và phương án quay lại cấu hình đã duyệt trước khi áp dụng tại hiện trường.

Không thử ngắt nguồn hoặc thay thiết bị trên dây chuyền đang chạy. Các chức năng an toàn và liên động phải được đội có thẩm quyền kiểm soát; giao diện khởi động lại thành công chưa đủ để cho phép máy chạy.

## 5. Yêu cầu báo giá theo vòng đời

So hai phương án với cùng phạm vi: phần cứng, giấy phép, chuyển đổi dự án, nghiệm thu, phụ tùng dự phòng, sao lưu và hỗ trợ. Ghi rõ ai chịu trách nhiệm khi máy hỏng, còn thiếu bộ cài hoặc không chuyển được giấy phép.

Trước khi đặt mua, yêu cầu nhà cung cấp trả lời ba việc bằng văn bản: hạng mục nào bàn giao đủ để tự bảo trì; thời gian phục hồi nào đã được thử; chi phí nào phát sinh khi thay máy hoặc nâng phiên bản. Gắn các câu trả lời với tiêu chí nghiệm thu và người chịu trách nhiệm cụ thể.

## Tham khảo thiết bị trong catalogue DTPT

HMI Delta DOP-107BV: https://dtpt.shop/san-pham/delta-dop-107bv

Panel PC Axiomtek GOT315A-ELK-WCD: https://dtpt.shop/san-pham/axiomtek-got315a-elk-wcd-panel-pc

## Nguồn đối chiếu

[1] Siemens, TIA Portal V21, Installation / Licensing / Client, tài liệu 11/2025. https://docs.tia.siemens.cloud/r/en-us/v21/installation/licensing/licensing-of-wincc-unified-options/client?contentId=KpALFWAg71F6k0o5kACpOg

[2] Microsoft Learn, What is Windows IoT Enterprise?, cập nhật 12/11/2026. https://learn.microsoft.com/en-us/windows/iot/iot-enterprise/overview

[3] Axiomtek, GOT315A-ELK-WCD, thông số và nguồn ảnh catalogue. https://www.axiomtek.com/products/panel-pcs-and-monitors/fanless-touch-panel-pc/rugged-fanless-touch-panel-pc/got315a-elk-wcd
