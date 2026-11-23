# Jetson tích hợp CODESYS: khi nào nên gộp AI và PLC?

- Ngày biên tập: 23/11/2026, khung 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API có quyền `articles.manage`, sau khi rà nháp desktop/mobile.
- Ngày xuất bản: `2026-11-23T03:04:24.459Z`.
- URL: https://dtpt.shop/tin-tuc/jetson-codesys-ethercat-gop-ai-plc
- CMS ID: `NEWS-1795402869570`.
- Slug: `jetson-codesys-ethercat-gop-ai-plc`.
- Chuyên mục: Tin công nghệ
- Tác giả: DTPT Techs
- Tag: NVIDIA Jetson, CODESYS, EtherCAT
- SEO title: Jetson tích hợp CODESYS: khi nào nên gộp AI và PLC?
- SEO description: Advantech tích hợp Jetson với CODESYS và EtherCAT. Phân tích lợi ích cho máy dùng thị giác, giới hạn thời gian thực và checklist thử trước khi gộp AI với PLC.
- Mô tả ngắn: Công bố mới của Advantech đưa AI, logic PLC và EtherCAT lên cùng máy tính. Cần đo điều gì để biết việc gộp này phù hợp với máy đang thiết kế?
- Cover media: `/api/article-media/83faf928-2f64-4784-96be-2d61cac740b6`.
- Hình: sơ đồ gốc DTPT Techs tại `docs/editorial/assets/2026-11-23-ai-plc-boundary.svg`, minh họa phân vai phần mềm, không phải sơ đồ điện, cấu hình được chứng nhận hoặc kết quả thử nghiệm. Không dùng ảnh developer kit Orin Nano trong catalogue để minh họa MIC-742-AT/MIC-732-AO khác model; chưa xác nhận điều kiện tái sử dụng ảnh thông cáo nên ưu tiên một sơ đồ thực sự giải thích luận điểm.
- Nguồn: Advantech công bố tích hợp ngày 19/11/2026; CODESYS cung cấp tài liệu độc lập về runtime, kernel và mạng thời gian thực. Chỉ Advantech xác nhận triển khai MIC-AI trong bộ nguồn tìm được; không gọi tài liệu CODESYS là phép thử độc lập của các model MIC. Không dùng bài phân tích của bên bán khác làm nguồn nội dung.
- Phạm vi: quyết định gộp AI và điều khiển chuyển động trên một host. Không trùng bài 11/11 về chia camera trên nhiều nút DSP820, bài 16/09 về TOPS hoặc bài 16/11 về HMI/Panel PC. Đã kiểm tra 27 bài CMS, không có nháp hoặc bài ngày 23/11 khi bắt đầu.
- Kiểm tra nội dung: 980 từ trước phần đọc thêm/nguồn, tính cả heading; SEO title 51 ký tự, description 158 ký tự. Đã tự biên tập về tính đúng, logic, câu chữ, giới hạn bằng chứng và giá trị nghiệm thu. Không đưa thông số chu kỳ, benchmark, giá hoặc lịch bán chưa xác nhận.
- Ba test renderer đạt. Đã rà nháp CMS và public bằng screenshot/DOM trên desktop và mobile 390 px: năm mục chính, bốn mục checklist, heading đúng, không lộ Markdown hoặc tràn ngang. Sơ đồ tự dựng đã xem bản PNG và bản WebP CMS 720 × 900 (49.436 byte), hiển thị đủ nội dung ở cả hai kích thước; ghi tác giả/mục đích trên hình và giải thích trong bài. Không có ảnh thiết bị hoặc giao diện giả.
- API public có một bài theo slug và khớp payload duyệt, hash của 27 bài trước giữ nguyên. Tin tức có một thẻ bài và điều hướng đúng URL; bài, ảnh và hai bài nội bộ HTTP 200. HTML server sau cache đúng SEO title/description, Open Graph/ảnh và robots cho lập chỉ mục; canonical hiện hành `https://dtpt.shop`. Article schema đúng headline, description, ảnh, ngày và URL; sitemap có đúng một URL. Tất cả đạt ở lần kiểm tra khoảng 329 giây sau xuất bản.
- Bằng chứng: `draft-desktop.jpg`, `draft-mobile.jpg`, `published-mobile.jpg`, `published-desktop-diagram.jpg`, `published-mobile-diagram.jpg` tại thư mục proof tạm ngoài Git. Payload/hash/validation và PNG/WebP trung gian tại `work/editorial-20261123/`, không chứa credential. Source SVG duy trì trong docs, ảnh public lưu `article_media`; không đổi mã ứng dụng, seed hoặc catalogue nên không cần full build ứng dụng.

## Nội dung CMS

Ngày 19/11/2026, Advantech công bố tích hợp nền tảng MIC-AI dùng NVIDIA Jetson với CODESYS và điều khiển chuyển động EtherCAT [1]. Điểm đáng xem với đơn vị chế tạo máy là khả năng đưa nhận dạng hình ảnh, logic PLC và phối hợp chuyển động lên cùng máy tính công nghiệp.

Việc giảm một bộ điều khiển chỉ có ý nghĩa khi hệ thống vẫn đáp ứng đúng chu kỳ và xử lý lỗi rõ ràng. Câu hỏi đầu tư là: máy có lợi hơn khi gộp AI với PLC, hay nên giữ hai phần độc lập?

## 1. Điểm mới nằm ở tích hợp, chưa phải cam kết thay mọi PLC

Theo hãng, MIC-742-AT sử dụng Jetson Thor; MIC-732-AO dùng Jetson AGX Orin. Giải pháp kết hợp Linux thời gian thực, CODESYS SoftPLC và EtherCAT Master. Trong ví dụ gắp vật bằng thị giác, Jetson cung cấp tọa độ còn CODESYS phối hợp chuyển động tới drive và I/O tương thích [1].

Thông tin triển khai này do Advantech công bố. Tài liệu CODESYS dùng dưới đây giải thích yêu cầu nền tảng; không phải kết quả kiểm thử độc lập hai model MIC. Số trục và chu kỳ đạt được cần xác nhận theo ứng dụng.

Nhận định biên tập: hướng tích hợp đáng khảo sát với máy mới cần thị giác dẫn hướng và đội kỹ thuật làm chủ Linux, CODESYS, truyền động. Với máy đang chạy ổn định, chi phí viết lại, nghiệm thu và thay đổi quy trình bảo trì phải được tính trước lợi ích giảm phần cứng.

## 2. Tách thời gian xử lý AI khỏi chu kỳ điều khiển

Một kết quả nhận dạng có thể đến chậm hoặc không hợp lệ. Ứng dụng cần gắn nó với đúng vật, thời điểm và trạng thái máy. Nếu tọa độ đến sau cửa sổ thao tác, bộ điều khiển phải có quy tắc bỏ qua hoặc yêu cầu xử lý lại; không tiếp tục dùng tọa độ cũ chỉ vì mô hình vẫn đang chạy.

Sơ đồ đại diện minh họa phân vai này: AI đề xuất kết quả, phần điều khiển kiểm tra điều kiện sử dụng rồi thực hiện chuyển động. Đây là sơ đồ biên tập DTPT Techs, không phải sơ đồ đấu nối hoặc thiết kế an toàn được chứng nhận.

Hãy xác định riêng hạn nhận kết quả thị giác, chu kỳ PLC và yêu cầu đồng bộ drive. Đo từ lúc lấy ảnh đến khi lệnh phù hợp được chấp nhận, đồng thời theo dõi độ dao động chu kỳ. Một giá trị FPS trung bình không cho biết có lần xử lý nào lỡ hạn của máy hay không.

## 3. Cùng máy tính vẫn cần cấu hình thời gian thực

Với ứng dụng Linux cần thời gian thực, CODESYS yêu cầu kernel hỗ trợ PREEMPT_RT; dùng kernel low-latency là chưa đủ [2]. Vì vậy, không suy từ việc cài được runtime sang việc cấu hình đã đáp ứng chu kỳ yêu cầu.

Hướng dẫn fieldbus của CODESYS còn yêu cầu cổng Ethernet vật lý dành riêng cho fieldbus nhạy thời gian, không đi qua switch hoặc USB trong cấu hình được mô tả. Luồng runtime, tác vụ và ngắt mạng cần được bố trí theo CPU và mức ưu tiên xác định [3]. Yêu cầu nhà tích hợp bàn giao cấu hình đã kiểm tra cho đúng phần cứng.

Tải camera, suy luận, ghi dữ liệu và truyền mạng cùng tồn tại trên host là những điều kiện phải đưa vào nghiệm thu. CODESYS hướng dẫn kiểm tra lại sau từng thay đổi, rồi thử tải cao khi cấu hình đã đạt ở tải bình thường [2]. Không sao chép lệnh tối ưu của một PC khác vào máy sản xuất.

## 4. Thử cả tình huống kết quả đến muộn

Lập bài thử ở môi trường cô lập, với người có thẩm quyền kiểm soát truyền động. Các chức năng dừng khẩn cấp, liên động và an toàn phải được thiết kế theo đánh giá rủi ro riêng; công bố tích hợp không chứng minh hệ AI là bộ điều khiển an toàn.

- Chạy đồng thời camera, mô hình, logic, truyền động và ghi log; lưu thời gian lớn nhất quan sát được, số lần quá hạn và điều kiện tải.
- Mô phỏng ảnh thiếu, tọa độ quá hạn hoặc kết quả gắn sai vật; xác nhận lệnh không hợp lệ bị chặn theo thiết kế.
- Kiểm tra khởi động lại ứng dụng AI và mất kết nối ở bàn thử; xác nhận trạng thái điều khiển, cảnh báo và điều kiện cho phép chạy lại.
- Lặp bài thử sau cập nhật mô hình hoặc phần mềm; giữ bộ cấu hình đã duyệt và cách khôi phục.

Kết quả đạt trong một ca thử chưa phải bảo đảm cho mọi tải. Hồ sơ cần ghi phiên bản OS/kernel, runtime, driver, mô hình, số trục, chu kỳ đặt và thời lượng thử để có thể tái hiện.

## 5. Chốt phạm vi báo giá trước khi quyết định gộp

Yêu cầu báo giá tách phần cứng, tích hợp Linux, runtime PLC, EtherCAT, thư viện chuyển động và hỗ trợ. CODESYS liệt kê SoftMotion là lựa chọn cấp phép thêm trên trang Control for Linux ARM SL [4]; phải xác nhận gói thực tế của giải pháp được chào, không mặc định phần mềm chuyển động đã nằm trong giá máy.

Giữ phương án PLC riêng trong so sánh nếu cần bảo trì AI mà không thay đổi bộ điều khiển hiện hữu. Nếu chọn gộp, giao rõ trách nhiệm xử lý khi host gặp lỗi và yêu cầu nhà tích hợp chứng minh tiêu chí nghiệm thu bằng đúng tải dự kiến, thay vì chỉ trình diễn robot chạy được.

## Đọc thêm tại DTPT

Chọn máy tính Edge AI theo ứng dụng: https://dtpt.shop/tin-tuc/chon-may-tinh-edge-ai-kiem-tra-gi-ngoai-tops

Chi phí phần mềm và phục hồi của Panel PC: https://dtpt.shop/tin-tuc/hmi-hay-panel-pc-windows-phan-mem-phuc-hoi

## Nguồn đối chiếu

[1] Advantech, công bố ngày 19/11/2026 về MIC-AI, CODESYS và EtherCAT. https://www.advantech.com/en-us/resources/news/advantech-integrates-nvidia-jetson-powered-computing-with-codesys-ethercat-motion-control-for-physical-ai

[2] CODESYS, Performance Optimization, tài liệu Linux Control SL. https://content.helpme-codesys.com/en/CODESYS%20Control/_rtsl_performance_optimization_linux.html

[3] CODESYS, Ethernet/Fieldbus Performance. https://content.helpme-codesys.com/en/CODESYS%20Control/_rtsl_ethernet_performance.html

[4] CODESYS, Control for Linux ARM SL, mục Fieldbus support và Product options. https://us.store.codesys.com/codesys-control-for-linux-arm-sl-1.html
