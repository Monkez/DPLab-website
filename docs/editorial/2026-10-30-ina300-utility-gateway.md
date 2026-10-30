# iNA300 cho trạm điện: đạt chuẩn độ bền đã đủ bảo mật?

- Ngày biên tập: 30/10/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API sau khi rà nháp desktop/mobile.
- Ngày xuất bản: `2026-10-30T03:14:17.564Z`.
- URL: https://dtpt.shop/tin-tuc/ina300-tram-dien-chung-nhan-moi-truong-an-toan-mang
- CMS ID: `NEWS-1793329906815`.
- Slug: `ina300-tram-dien-chung-nhan-moi-truong-an-toan-mang`.
- Chuyên mục: Tin công nghệ
- Tác giả: DTPT Techs
- Tag: Axiomtek iNA300, Mạng công nghiệp, An toàn OT
- SEO title: iNA300 cho trạm điện: chứng nhận và an toàn mạng
- SEO description: Axiomtek công bố iNA300 cho trạm điện. Phân biệt chứng nhận môi trường với an toàn mạng, đánh giá LAN Bypass và các điều kiện cần thử trước khi triển khai.
- Mô tả ngắn: Gateway mới của Axiomtek đặt ra câu hỏi thực tế: chịu được môi trường trạm điện có đồng nghĩa bảo vệ được mạng OT? Cần kiểm tra cả phần mềm và chế độ khi lỗi.
- Cover media: `/api/article-media/c8e89954-95bc-4203-afda-91a6e1b55add`.
- Ảnh: screenshot nguyên trạng trang sản phẩm iNA300 của Axiomtek, chụp ngày 30/10/2026, vùng hiển thị có logo hãng và hai góc nhìn thiết bị; không cắt ghép hoặc chèn chữ. Bản nguồn duy trì tại `docs/editorial/assets/2026-10-30-ina300-axiomtek-screenshot.jpg`. Không phải ảnh DTPT thử máy. Quyền dùng screenshot trang sản phẩm cho mục đích instructive/educational/illustrative được hãng nêu tại https://www.axiomtek.com/trademarks (III. Screenshots), đối chiếu cả trang US https://us.axiomtek.com/Default.aspx?FunctionId=InfoFullPage&ItemId=906&MenuId=Information; không suy rộng thành giấy phép dùng ảnh rời cho quảng cáo. CMS có thể nén/đổi định dạng khi lưu.
- Phạm vi: tin hãng 29/10/2026 và phân tích lựa chọn gateway cho đơn vị tích hợp điện lực. Lịch December 2026 là kế hoạch hãng, trang sản phẩm còn Coming Soon ngày kiểm tra; không khẳng định tồn kho, giá hoặc khả năng giao hàng Việt Nam. iNA300 chưa có trong catalogue DTPT.
- Kiểm chứng: thông số sản phẩm theo Axiomtek, chưa có kiểm thử độc lập được dùng trong bài; IEC/IEEE là nguồn độc lập về phạm vi tiêu chuẩn, NIST là hướng dẫn OT, không xác nhận hiệu năng/chứng nhận của iNA300. Không gán phiên bản IEEE 1613-2023/IEC 61850-3:2013 cho chứng nhận cụ thể của máy vì hãng chưa nêu edition/report.
- Đối chiếu tài liệu: press release, trang sản phẩm và eCatalogue v639 cùng nêu 6 × 2.5GbE + 2 × 1GbE SFP; eCatalogue cũ V439 có cấu hình khác. Dùng thông tin trang sản phẩm hiện hành, khuyến nghị chốt SKU/revision khi hỏi nhà cung cấp; không dùng hình/spec PDF cũ. Không suy đoán trạng thái mặc định hoặc điều kiện kích hoạt bypass; phân tích rủi ro chỉ theo kiến trúc bypass nói chung.
- Nguồn kiểm tra 30/10: Axiomtek press release và product page; IEEE 1613-2023 scope (công bố 26/02/2024), IEC 61850-3:2013 abstract/preview (12/12/2013), NIST SP 800-82 Rev. 3 final (09/2023, Rev. 4 mới ở initial public draft tại ngày kiểm tra). Không gọi Rev. 3 là bản phát hành mới.
- Kiểm tra: 964 từ trước phần nguồn tham khảo; SEO title 48 ký tự, description 155 ký tự. Ba test renderer đạt. Nháp CMS và public desktop/mobile 390 px đã rà screenshot/DOM: sáu heading, ba mục checklist, ảnh tải đúng 1.265 × 712, alt theo tiêu đề, chú thích nguồn, không lộ Markdown hoặc tràn ngang. Mục Tin tức hiển thị bài mới và điều hướng đúng URL. Renderer hiện hiển thị URL nguồn/nội bộ dạng văn bản để sao chép, không biến thành anchor; không ghi nhận nhầm là đã kiểm tra liên kết nhấp được.
- API: public có đúng một bài theo slug, bản đọc lại khớp nội dung duyệt; hash của 22 bài khác giữ nguyên. URL bài, bài tham khảo nội bộ và ảnh HTTP 200; ảnh CMS WebP 1.265 × 712, sitemap có đúng một URL. Metadata server sau cache đúng SEO title/description, Open Graph/ảnh, robots cho lập chỉ mục; canonical hiện hành `https://dtpt.shop`; Article schema đúng headline/description/ảnh/ngày/URL. Kiểm tra hoàn tất lúc tuổi xuất bản khoảng 216 giây, không đặt ngày tương lai.
- Bằng chứng: `ina300-published.jpg`, `ina300-mobile.jpg`, `ina300-mobile-sources.jpg` và ảnh nháp trong thư mục proof 30/10 ngoài Git. Baseline hash, payload không chứa credential và ảnh public kiểm tra tại `work/editorial-20261030/` ngoài commit. Không sửa seed, catalogue hoặc source ứng dụng; kiểm tra renderer/API/giao diện chạy thật thay full build không liên quan.

## Nội dung CMS

Ngày 29/10/2026, Axiomtek công bố gateway DIN-rail iNA300 cho điện lực, dự kiến có hàng vào tháng 12/2026 [1]. Ngày 30/10, trang sản phẩm vẫn ghi Coming Soon [2]. Đây là thông tin ra mắt của hãng, chưa xác nhận giá, tồn kho hoặc lịch giao tại Việt Nam.

Điểm đáng bàn là cách đánh giá gateway trong trạm điện: thiết bị chịu được môi trường khắc nghiệt có đồng nghĩa mạng đã được bảo vệ? Cần tách độ bền phần cứng, chức năng bảo mật và khả năng vận hành thành ba phần nghiệm thu.

Ảnh đại diện: screenshot trang iNA300 của Axiomtek ngày 30/10/2026, dùng để nhận diện thiết bị; không phải ảnh thử nghiệm của DTPT.

## 1. Phần cứng mới giải quyết nhu cầu nào?

Theo trang sản phẩm, iNA300 dùng Intel Atom x7433RE, có sáu cổng 2.5GbE và hai khe SFP 1GbE. Hãng công bố dải nhiệt hoạt động −40 đến +60°C, hai đầu vào nguồn 12–48V DC và TPM 2.0 [2]. Các kết nối này giúp đơn vị tích hợp cân nhắc phân vùng mạng và lựa chọn đường truyền quang, nhưng phải chốt cấu hình thực tế khi đặt hàng.

Axiomtek cũng nêu hai cặp LAN Bypass nhằm duy trì lưu lượng khi hệ thống bị gián đoạn [1]. Đây là đặc tính cần đưa vào thiết kế xử lý lỗi, không chỉ một dòng cộng điểm trên bảng cấu hình.

Những thông số trên là công bố của nhà sản xuất. DTPT chưa kiểm thử iNA300; không suy ra tốc độ firewall, VPN hay độ trễ từ tốc độ danh định của cổng mạng.

## 2. Đọc đúng phạm vi chứng nhận

Axiomtek giới thiệu máy đạt IEC 61850-3 và IEEE 1613 [2]. Theo IEC, Phần 3 đặt yêu cầu chung về thiết kế, kết cấu và điều kiện môi trường cho thiết bị trong hệ thống tự động hóa điện lực [3]. Phạm vi IEEE 1613 bao gồm điều kiện làm việc, định mức điện/nhiệt, tương thích điện từ và thử nghiệm môi trường cho thiết bị truyền thông điện lực [4].

Vì vậy, hai tên tiêu chuẩn này không tự chứng minh một cấu hình firewall đã chặn đúng lưu lượng độc hại. Cũng không thể từ IEC 61850-3 suy ra máy đã được xác nhận mọi chức năng giao tiếp của cả bộ IEC 61850. Đây là phân biệt phạm vi tiêu chuẩn, không phủ nhận giá trị của việc thử độ bền.

Hồ sơ mua sắm cần yêu cầu phiên bản tiêu chuẩn, báo cáo/chứng thư, đơn vị đánh giá và SKU áp dụng. Trang hãng chưa nêu rõ các chi tiết này; không nên tự gán phiên bản tiêu chuẩn mới nhất cho chứng nhận của thiết bị.

## 3. LAN Bypass: giữ liên lạc nhưng phải giữ đúng chính sách

Về nguyên tắc kiến trúc, nếu đường bypass cho gói tin đi vòng qua bộ máy kiểm tra đang lỗi, kết nối có thể tiếp tục nhưng lớp kiểm tra đó không còn tác dụng trên đường vòng. Đây là rủi ro cần phân tích, chưa phải kết luận về chế độ mặc định của iNA300.

Ngược lại, chặn đường truyền khi lỗi có thể làm mất giám sát hoặc điều khiển. NIST SP 800-82 Rev. 3 nhấn mạnh bảo mật OT phải xét đồng thời yêu cầu hiệu năng, độ tin cậy và an toàn [5]. Quyết định khi lỗi phải theo đánh giá rủi ro của hệ thống cụ thể.

Trước khi duyệt thiết kế, hỏi nhà cung cấp: cặp cổng nào hỗ trợ bypass; kích hoạt khi mất nguồn, hệ điều hành lỗi hay phần mềm lỗi; có cảnh báo không; đường truyền phục hồi thế nào? Không thử rút nguồn hoặc đổi chế độ trên mạng trạm đang vận hành.

## 4. Ba phần cần ghi trong kế hoạch thử

Đơn vị tích hợp nên thử trên mô hình cô lập được phê duyệt, có người phụ trách vận hành và an toàn. Sao lưu cấu hình, chuẩn bị phương án khôi phục trước khi thay đổi:

- Phần cứng: đối chiếu nguồn, nhiệt độ tại vị trí lắp, tiếp địa và module quang với tài liệu đúng revision. Không coi hai đầu vào nguồn là hai nguồn độc lập nếu cùng phụ thuộc một bộ cấp.
- Phần mềm: chốt hệ điều hành, ứng dụng firewall/VPN, phiên bản, giấy phép và bộ quy tắc. Đo lưu lượng, độ trễ, mất gói trong cấu hình sử dụng thật; số đo khi tắt tính năng không đại diện cấu hình nghiệm thu.
- Vận hành: mô phỏng lỗi theo kịch bản được phép, kiểm tra cảnh báo, hành vi đường truyền và khả năng phục hồi cấu hình. Chỉ chấp nhận khi đạt tiêu chí đã thống nhất và cơ chế bảo vệ vẫn hoạt động.

Nếu kết quả khác dự kiến, giữ hệ thống ở môi trường thử, khôi phục bản cấu hình đã kiểm tra và làm rõ nguyên nhân trước khi đề xuất đưa vào hiện trường.

## 5. Đừng bỏ quên chi phí sau khi lắp

Nhóm tích hợp trạm điện có lý do xem xét nền tảng chịu môi trường này. Với tủ mạng có điều kiện ổn định, cần chứng minh yêu cầu tương ứng trước khi chọn thiết bị chuyên dụng.

Báo giá nên làm rõ cả giấy phép, cập nhật bảo mật, thời hạn hỗ trợ, phụ tùng và trách nhiệm xử lý lỗ hổng của từng bên. TPM 2.0 là thành phần phần cứng; hiệu quả còn tùy phần mềm sử dụng nó. Chốt người duy trì hệ thống quan trọng không kém chốt model máy.

Đọc thêm về phạm vi dự phòng nguồn và đường truyền: https://dtpt.shop/tin-tuc/du-phong-mang-cong-nghiep-ring-nguon-kep

## Nguồn tham khảo

[1] Axiomtek, thông cáo iNA300 ngày 29/10/2026: https://www.axiomtek.com/whats-new/press-releases/ina300-iec-61850-3-and-ieee-1613-certified-din-rail-and-compact-cybersecurity-gateway-for-power-utilities

[2] Axiomtek, trang sản phẩm iNA300, đối chiếu 30/10/2026: https://www.axiomtek.com/products/systems-and-platforms/network-communication-platform/din-rail-cybersecurity-gateway/ina300

[3] IEC, phạm vi IEC 61850-3:2013: https://webstore.iec.ch/en/publication/6010

[4] IEEE, phạm vi IEEE 1613-2023: https://standards.ieee.org/ieee/1613/10454/

[5] NIST, SP 800-82 Rev. 3 final: https://csrc.nist.gov/pubs/sp/800/82/r3/final
