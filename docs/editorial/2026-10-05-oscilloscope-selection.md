# Bài đã xuất bản: Chọn máy hiện sóng: đừng chỉ nhìn MHz

- Ngày biên tập: 05/10/2026.
- CMS ID: `NEWS-1791169835830`.
- URL: https://dtpt.shop/tin-tuc/chon-may-hien-song-bang-thong-lay-mau-bo-nho
- Trạng thái: xuất bản qua API có quyền `articles.manage`; đọc lại API public xác nhận đúng một bản ghi, nội dung trùng bản nháp đã kiểm tra.
- Chuyên mục: Kiến thức kỹ thuật.
- Ảnh: `/products/rigol-dho800.jpg`, ảnh RIGOL DHO804 đã có trong catalogue, nguồn RIGOL; có alt/chú thích trong bài, không trình bày như kết quả đo DTPT.
- Nguồn sơ cấp: hai tài liệu Keysight và primer Tektronix.
- Kiểm tra: renderer CMS desktop/mobile, ảnh tải đúng, không tràn ngang; API public, URL/ảnh HTTP 200, canonical đúng, sitemap có URL.
- Đã chờ cache metadata: HTML server trả đúng SEO title, SEO description (146 ký tự), robots index/follow và JSON-LD Article với ngày xuất bản đúng; canonical và sitemap đã xác minh.
- Không thêm seed, không sửa/reset DB, không lưu thông tin đăng nhập.

## Nội dung đã xuất bản

Một máy hiện sóng nhiều MHz chưa chắc bắt được lỗi khởi động của bo điều khiển. Câu hỏi trước khi mua là: máy có ghi được đúng tín hiệu, đủ lâu và đồng thời đủ kênh không? Bài dành cho R&D điện tử, không hướng dẫn đo điện lưới hay biến tần đang chạy.

## 1. Viết yêu cầu đo trước khi chọn model

Hãy mô tả ba phép đo thường làm: theo dõi nguồn lúc khởi động, đối chiếu tín hiệu điều khiển với phản hồi, tìm xung bất thường. Với mỗi phép đo, ghi biên độ, thời gian cần quan sát, số tín hiệu đồng thời và chi tiết nhỏ nhất phải phân biệt.

Ví dụ giả định, để tìm nguyên nhân reset, cần xem nguồn cấp, chân reset và tín hiệu enable trong cùng lần thu. Hai kênh có thể buộc đo lại; lỗi ngẫu nhiên không nhất thiết lặp giống nhau.

![RIGOL DHO804 thuộc dòng DHO800 với bốn đầu vào BNC ở mặt trước](</products/rigol-dho800.jpg> "Ảnh RIGOL DHO804 từ catalogue DTPT, nguồn RIGOL. Bốn cổng hỗ trợ quan sát đồng thời; ảnh không phải kết quả thử nghiệm của DTPT.")

## 2. Băng thông phải theo chi tiết của tín hiệu

Băng thông mô tả khả năng tái hiện các thành phần tần số, không phải tốc độ lấy mẫu. Theo Keysight, cần xét nội dung tần số và tốc độ sườn xung; chỉ nhìn tần số lặp hay clock có thể bỏ sót yêu cầu của sườn nhanh [1].

Một tín hiệu lặp chậm vẫn có thể đổi trạng thái rất nhanh. Nếu mục tiêu là đo overshoot hoặc thời gian lên, hãy gửi nhà cung cấp yêu cầu về sườn xung và sai số chấp nhận, thay vì hỏi “đo được bao nhiêu MHz”.

Đầu dò cũng thuộc hệ đo. Máy có băng thông cao không khắc phục được đầu dò thiếu băng thông hoặc làm tải tín hiệu. Tektronix giải thích tải điện dung và dây tham chiếu dài có thể làm biến dạng dạng sóng [3].

## 3. Hỏi tốc độ lấy mẫu khi bật đủ kênh

Thông số GSa/s lớn trên quảng cáo thường là mức tối đa. Keysight lưu ý một số máy chỉ đạt mức này với số kênh hoạt động hạn chế [2]. Hãy yêu cầu bảng tốc độ lấy mẫu theo cấu hình một, hai và tất cả kênh.

Khi demo, bật đúng số kênh dự kiến dùng rồi đọc tốc độ lấy mẫu thực tế. Phân biệt lấy mẫu thời gian thực với lấy mẫu tương đương: chế độ dựa vào nhiều lần lặp không thay thế được lần thu duy nhất của sự kiện không lặp [2].

Nếu waveform thay đổi bất thường khi chỉnh thời gian quan sát, kiểm tra tốc độ lấy mẫu và chế độ thu trước khi kết luận mạch lỗi.

## 4. Bộ nhớ quyết định cửa sổ quan sát

Với một bản ghi liên tục, thời lượng xấp xỉ số mẫu chia cho tốc độ lấy mẫu. Ví dụ tính toán, 10 triệu mẫu ở 1 tỷ mẫu/giây tương ứng khoảng 10 ms. Muốn giữ tốc độ ấy trong 100 ms cần khoảng 100 triệu mẫu. Ví dụ này không phải thông số model trong ảnh.

Phải hỏi dung lượng khả dụng ở cấu hình kênh và chế độ định dùng. Keysight cũng nêu đánh đổi: thu bản ghi sâu có thể tăng thời gian xử lý, giảm tốc độ cập nhật [1]. Bộ nhớ sâu không bảo đảm bắt mọi sự kiện giữa các lần thu.

## 5. Chọn đầu dò trước khi cấp điện

Với máy để bàn tham chiếu đất, dây mass đầu dò không phải một cực đo tùy ý. Tektronix cảnh báo về kết nối tham chiếu và việc làm nổi máy không được thiết kế cho phép đo đó [3]. Không tháo tiếp địa bảo vệ để “đo cho tiện”.

Trước khi nối, xác định điện áp so với đất, giới hạn đầu vào, định mức đầu dò và loại phép đo. Đo điểm nổi hoặc mạch công suất cần giải pháp vi sai/cách ly phù hợp và người có chuyên môn. Cấp nguồn qua USB-C hay pin không tự chứng minh đầu vào được cách ly.

## 6. Demo có tiêu chí đạt, không chỉ xem màn hình

Thực hiện trên bo thử điện áp thấp với kết nối đã được xác nhận an toàn:

- Kiểm tra đầu dò, hệ số suy hao trên đầu dò và trong máy; bù đầu dò theo hướng dẫn hãng.
- Thu sự kiện đại diện với đủ kênh; lưu cấu hình, tốc độ lấy mẫu và chiều dài bản ghi.
- Zoom tới chi tiết cần phân biệt, kiểm tra trigger và dữ liệu trước/sau sự kiện.
- Xuất waveform rồi đọc lại trên máy tính; xác nhận đội kỹ thuật dùng được dữ liệu, không chỉ ảnh chụp.

Lưu cấu hình gốc trước khi demo để khôi phục sau thử nghiệm. Một lần bắt được lỗi là bằng chứng hữu ích; chưa bắt thấy lỗi không có nghĩa mạch đã đạt yêu cầu.

## 7. Gửi yêu cầu báo giá cho cả hệ đo

Khi tham khảo DHO804 trong catalogue DTPT, hãy gửi cả danh sách phép đo và yêu cầu demo:
https://dtpt.shop/san-pham/rigol-dho804

Yêu cầu báo giá nêu rõ đầu dò đi kèm, phụ kiện vi sai nếu cần, tính năng trigger/giải mã đã kích hoạt, xuất dữ liệu, hiệu chuẩn và hỗ trợ. Chi phí vòng đời gồm phụ kiện, giấy phép, đào tạo và gián đoạn bảo trì. Chốt cấu hình đáp ứng phép đo trước, rồi mới so giá; không mặc định mọi tùy chọn có sẵn.

## Nguồn kỹ thuật

[1] Keysight, hướng dẫn chọn oscilloscope: https://www.keysight.com/blogs/en/tech/bench/2020/08/25/tips-how-to-select-an-oscilloscope-before-you-buy-part-i

[2] Keysight, Oscilloscope Basics: https://www.keysight.com/used/us/en/knowledge/oscilloscope-basics

[3] Tektronix, ABCs of Probes: https://download.tek.com/document/02_ABCs-of-Probes-Primer.pdf

Đối chiếu ngày 05/10/2026. Ví dụ tính toán do DTPT biên tập; không phải benchmark hay chứng nhận an toàn.
