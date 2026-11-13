# Switch 8 cổng có cấp đủ nguồn cho hệ thống camera?

- Ngày biên tập: 13/11/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API sau khi rà nháp desktop/mobile.
- Ngày xuất bản: `2026-11-13T03:19:17.163Z`.
- URL: https://dtpt.shop/tin-tuc/chon-switch-poe-camera-ngan-sach-cong-suat
- CMS ID: `NEWS-1794539759879`.
- Slug: `chon-switch-poe-camera-ngan-sach-cong-suat`.
- Chuyên mục: Kiến thức kỹ thuật
- Tác giả: DTPT Techs
- Tag: PoE, Camera IP, Mạng công nghiệp
- SEO title: Chọn switch PoE cho camera: kiểm tra tổng công suất
- SEO description: Phân biệt cổng PoE, công suất PSE và PD, tính ngân sách nguồn cho camera. Kèm checklist khi bật IR, khởi động đồng thời và nghiệm thu hệ thống.
- Mô tả ngắn: Số cổng Ethernet, giới hạn cấp nguồn từng cổng và ngân sách PoE tổng là ba thông tin cần chốt trước khi chọn switch cho camera trong nhà máy.
- Cover media: `/api/article-media/ca5f5723-be8e-4dab-9b29-87df24667a41`.
- Inline media: `/api/article-media/6ff157cf-2e0c-46d8-84d2-730d4e316138`.
- Ảnh thật: bên trong Allied Telesis AT-GS950/8POE, tác giả -stk, chụp 12/01/2026. Nguồn https://commons.wikimedia.org/wiki/File:Allied_Telesis_AT-GS950-8POE_switch_P1110376.jpg ; CC BY-SA 4.0 tại https://creativecommons.org/licenses/by-sa/4.0/ . Dùng bản 1.280 × 854 có liên kết từ trang gốc, đã xem trực tiếp. CMS chuyển WebP/bỏ metadata, giữ bố cục ảnh; ảnh tái sử dụng cùng giấy phép, ghi tác giả/nguồn/thay đổi trong bài. Đây là ảnh cấu tạo của model Allied, riêng ví dụ tính toán sử dụng thông số NETGEAR GS108PEv3. Không gán thông số NETGEAR hoặc chứng nhận môi trường công nghiệp cho thiết bị trong ảnh. Không hướng dẫn mở vỏ hoặc sửa phần nguồn từ ảnh.
- Hình tính toán: SVG gốc `docs/editorial/assets/2026-11-13-poe-budget.svg`; tính từ giới hạn NETGEAR GS108PEv3, bốn cổng × 15,4 W = 61,6 W so với budget tổng 53 W, chênh 8,6 W. Đây là phép tính giới hạn cùng lúc, không phải công suất đo hoặc quy tắc mọi cổng luôn được cấp tối đa. Không suy ra hành vi phân bổ/ưu tiên cụ thể của model khác.
- Phạm vi: hướng dẫn chọn và nghiệm thu cấp nguồn PoE. Bài dự phòng mạng 26/10 bàn lỗi link/nguồn/đầu cuối, bài GigE/USB3 25/09 bàn giao diện truyền dữ liệu. Không có bài PoE trùng trong 25 bài public, không có nháp hoặc bài đăng ngày 13/11 khi bắt đầu.
- Nguồn sơ cấp kiểm tra 13/11: NETGEAR Installation Guide GS108PEv3 về 8 LAN/4 PoE/15,4 W/cổng/53 W tổng; TI TPS2378 Rev. C về PSE/PD Type 2 30 W/25,5 W; Axis white paper 12/2025 về typical/max, IR/heater và tải đỉnh; Cisco Industrial PoE Solution Brief 04/07/2025 về nguồn cho PSE, budget và đường cáp. Không dùng thông số PoE++ khác nhau giữa các tài liệu hoặc phần cấp nguồn độc quyền.
- Kiểm tra: 878 từ trước phần nguồn và không tính chú thích hình, SEO title 51 ký tự, description 143 ký tự. Ba test renderer đạt. Đã rà nháp CMS và public qua trình duyệt tích hợp ở desktop và mobile 390 px bằng screenshot/DOM: năm heading, bốn mục checklist, ảnh đủ alt/chú thích/nguồn và giấy phép, không tràn ngang hoặc lộ Markdown. Cover WebP 1.280 × 854, hình tính toán 720 × 620. URL tham khảo hiển thị dạng văn bản để sao chép theo renderer hiện tại.
- API public có đúng một bản theo slug và khớp payload đã duyệt; hash của 25 bài trước giữ nguyên. Mục Tin tức có một thẻ bài và điều hướng đúng trang. URL bài, hai ảnh và bài nội bộ HTTP 200. HTML server sau cache đúng SEO title/description, Open Graph/ảnh, robots cho lập chỉ mục; canonical hiện hành `https://dtpt.shop`, Article schema đúng headline/description/ảnh/ngày/URL, sitemap có đúng một URL. Metadata kiểm tra đạt khoảng 170 giây sau xuất bản.
- Bằng chứng: `poe-published.jpg`, `poe-mobile.jpg`, `poe-mobile-diagram.jpg` và ảnh nháp trong thư mục proof 13/11 ngoài Git. Ảnh nguồn, PNG tính toán, baseline hash, payload và validation tại `work/editorial-20261113/` ngoài commit, không chứa credential. SVG gốc duy trì trong docs. Kiểm tra renderer/API/giao diện chạy thật phù hợp cho nội dung CMS và tài liệu, không có thay đổi ứng dụng cần full build.

## Nội dung CMS

Trước khi chọn switch cho tám camera, hãy ghi riêng số cổng Ethernet, số cổng có PoE và tổng công suất PoE. Ba con số này trả lời ba điều kiện khác nhau. Một cấu hình đủ đường truyền vẫn có thể thiếu ngân sách nguồn khi nhiều thiết bị cùng yêu cầu công suất cao.

Bài áp dụng cho camera IP và thiết bị cấp nguồn PoE tương thích theo tài liệu hãng. Khi gửi yêu cầu báo giá, cần cung cấp model camera, chuẩn cấp nguồn, công suất tối đa và điều kiện lắp đặt.

Ảnh đại diện là bên trong switch Allied Telesis AT-GS950/8POE, ảnh -stk/Wikimedia Commons [5], CC BY-SA 4.0 tại https://creativecommons.org/licenses/by-sa/4.0/ . Bản ảnh được thu nhỏ và chuyển WebP để hiển thị.

## 1. Đếm đúng cổng, rồi đọc cả hai giới hạn công suất

Ví dụ từ tài liệu NETGEAR GS108PEv3 [1], máy có tám cổng Ethernet nhưng chỉ cổng 1–4 hỗ trợ PoE. Giới hạn mỗi cổng PoE là 15,4 W, còn tổng ngân sách cho cả bốn cổng là 53 W.

Nếu bốn cổng cùng cần đến mức 15,4 W tại phía cấp, phép tính cho kết quả 61,6 W, cao hơn ngân sách tổng 8,6 W. Đây là cách kiểm tra các giới hạn có đáp ứng đồng thời hay không. Số thiết bị dùng được còn phụ thuộc yêu cầu của từng thiết bị và cách switch phân bổ công suất.

![Bốn cổng cùng ở giới hạn 15,4 W cần 61,6 W, trong khi NETGEAR GS108PEv3 công bố tổng ngân sách 53 W](</api/article-media/6ff157cf-2e0c-46d8-84d2-730d4e316138> "Hình tính toán DTPT Techs từ tài liệu NETGEAR GS108PEv3. Hai giá trị thể hiện giới hạn công bố và phép cộng lý thuyết, không phải kết quả đo. Ảnh đại diện là model Allied Telesis riêng.")

Khi đọc catalogue, ghi cả số cổng hỗ trợ chuẩn cần dùng, mức tối đa mỗi cổng và budget tổng ở cấu hình nguồn được chọn. Chốt các mục này theo đúng mã hàng và revision.

## 2. So sánh công suất ở cùng một phía

PSE là thiết bị cấp nguồn, thường là switch hoặc injector. PD là thiết bị nhận nguồn, chẳng hạn camera. Tài liệu TI về IEEE 802.3at Type 2 nêu mức 30 W tại PSE và 25,5 W tại đầu vào PD [2]. Ngân sách đường cáp tạo ra khác biệt giữa hai phía.

Vì vậy, khi camera ghi công suất tại PD, cần xác nhận switch hỗ trợ đúng chuẩn/class và phần công suất phải dành tại PSE. Đối chiếu ý nghĩa các cột “allocated” và “consumed” trong giao diện theo manual. Công suất đang tiêu thụ thấp tại một thời điểm chưa cho biết ngân sách có thể dành thêm cho thiết bị mới.

Với hệ thống dùng switch công nghiệp và bộ nguồn ngoài, kiểm tra cả công suất switch tự dùng và tổn hao chuyển đổi khi chọn bộ nguồn. Cisco hướng dẫn tính nguồn cấp cho tải PoE cùng phần vận hành PSE [4]. Đồng thời đối chiếu điện áp đầu vào, nhiệt độ và bảng giảm công suất nếu tài liệu model có quy định.

## 3. Chọn tải cần thiết kế từ chế độ camera thực dùng

Axis phân biệt công suất typical với maximum. Trong tài liệu của hãng, typical có thể được ghi rõ khi tắt IR và sưởi, còn maximum xét điều kiện bất lợi và tải đỉnh [3]. Cần đọc chú thích đi kèm con số trên datasheet của đúng camera.

Lập bảng cho từng camera gồm chuẩn/class, công suất tối đa, các tính năng IR, sưởi, motor hoặc cấp nguồn phụ nếu có. Xác định tính năng nào được phép hoạt động đồng thời trong ứng dụng. Lấy tổng ở điều kiện sử dụng cần bảo đảm, rồi chốt phần dự phòng theo kế hoạch mở rộng và yêu cầu vận hành.

Một lần đo ban ngày giúp biết tải hiện tại. Để đánh giá thiết kế, cần thử cả chế độ tải cao được nhà sản xuất cho phép và tình huống nhiều camera khởi động lại cùng lúc.

## 4. Nghiệm thu trên bộ thử trước khi đưa vào vận hành

Thực hiện trên bộ thử cô lập được phê duyệt, có người phụ trách kỹ thuật. Ghi phiên bản firmware, lưu cấu hình switch và danh sách cổng trước khi thay đổi. Dùng nguồn, camera và cáp theo hướng dẫn tương ứng.

- Kết nối từng camera, ghi trạng thái nhận diện PoE, công suất dành/công suất dùng và tình trạng luồng hình. Kiểm tra đúng cổng hỗ trợ PoE trước khi chuyển sang bước tiếp theo.
- Thử đồng thời các camera ở độ phân giải, tốc độ khung hình và tính năng phụ dự kiến. Ghi log từ chối cấp nguồn, quá tải, số lần mất hình hoặc khởi động lại, kèm thời điểm và chế độ camera.
- Kiểm tra đường cáp, đầu nối và chiều dài theo giới hạn hãng. Nếu một camera lỗi, đối chiếu với cáp và cổng đã biết hoạt động trong cùng điều kiện, mỗi lần đổi một yếu tố.
- Khi kết quả lệch tiêu chí, giữ cấu hình trong môi trường thử, phục hồi bản đã lưu và làm rõ nguyên nhân. Chốt điều kiện cấp nguồn ổn định cùng phản ứng khi thiếu budget trong biên bản nghiệm thu.

Để hỏi báo giá, gửi bảng tải cùng số cổng dự kiến mở rộng, điều kiện tủ và yêu cầu cảnh báo/quản lý. Khi chọn camera, đối chiếu thêm giao diện truyền dữ liệu tại https://dtpt.shop/tin-tuc/gige-vision-hay-usb3-vision-camera-cong-nghiep

## Nguồn tham khảo

[1] NETGEAR, GS108PEv3 Installation Guide. https://www.downloads.netgear.com/files/GDC/GS108PEV3/GS108PEv3_IG_EN.pdf

[2] Texas Instruments, TPS2378 datasheet Rev. C, bảng giới hạn PoE Type 2. https://www.ti.com/lit/ds/symlink/tps2378.pdf

[3] Axis, Typical and maximum power consumption in Axis cameras, 12/2025. https://whitepapers.axis.com/en-us/typical-and-maximum-power-consumption-in-axis-cameras

[4] Cisco, PoE for Industrial Automation. https://www.cisco.com/c/en/us/products/collateral/networking/industrial-switches/poe-ind-data-control-single-cable-so.html

[5] -stk, ảnh Allied Telesis AT-GS950/8POE và giấy phép. https://commons.wikimedia.org/wiki/File:Allied_Telesis_AT-GS950-8POE_switch_P1110376.jpg
