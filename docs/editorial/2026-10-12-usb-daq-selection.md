# Chọn USB DAQ: 16-bit và 1 MSa/s đã đủ chưa?

- Ngày biên tập: 12/10/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API có quyền `articles.manage`, sau khi kiểm tra nháp CMS desktop/mobile.
- Ngày xuất bản: `2026-10-12T03:13:31.705Z`.
- URL: https://dtpt.shop/tin-tuc/chon-usb-daq-toc-do-tung-kenh-do-chinh-xac
- Kiểm tra: 995 từ, SEO description 153 ký tự; phép tính tốc độ, khoảng mã và dung lượng đã kiểm tra. Ba test renderer đạt. Nháp CMS và bài công khai đã kiểm tra desktop/mobile 390 px: đủ heading, chú thích và nguồn, không tràn ngang/lộ Markdown; ảnh tải đúng 800 × 800. API public trả đúng một bản ghi, nội dung trùng bản đã duyệt; giữ nguyên 14 bài khác. URL bài, ảnh và liên kết catalogue HTTP 200; metadata server sau cache đúng title/description, Article schema đúng ảnh/ngày/URL, robots cho lập chỉ mục, sitemap có đúng một URL bài. Canonical hiện hành là `https://dtpt.shop`, không đổi sang alias www chưa xác minh.
- Không thêm seed, reset DB hoặc lưu thông tin đăng nhập.
- CMS ID: `NEWS-1791774664193`.
- Slug: `chon-usb-daq-toc-do-tung-kenh-do-chinh-xac`.
- Chuyên mục: Kiến thức kỹ thuật
- Tác giả: DTPT Techs
- SEO title: Chọn USB DAQ: tốc độ từng kênh và độ chính xác
- SEO description: Checklist chọn USB DAQ: phân biệt tốc độ tổng và từng kênh, độ phân giải và độ chính xác; kiểm tra tín hiệu, driver, lưu dữ liệu và nghiệm thu trước mua.
- Mô tả ngắn: Hai DAQ cùng 16-bit có thể phục vụ những phép đo rất khác nhau. Cần chốt số kênh, cách lấy mẫu, sai số và khả năng ghi liên tục trước khi hỏi giá.
- Cover: `/products/smacq-usb-3300.png`, ảnh dòng SMACQ USB-3300 đang có trong catalogue DTPT; nguồn hãng: https://www.smacq.com/product/usb-3300/ . Ảnh series, không đại diện cấu hình mọi model. Tái sử dụng tài nguyên catalogue, không cấp phép lại ảnh.
- Lựa chọn ảnh: dùng một ảnh series với chú thích rõ; không lặp ảnh cover trong thân bài. Không sao chép bảng/ảnh manual hoặc thêm ảnh trang trí.
- Phạm vi: hướng dẫn lựa chọn và nghiệm thu DAQ thu tín hiệu điện áp trên bàn thử; không phải tin sản phẩm mới, không phải kết quả kiểm thử thiết bị trong ảnh.
- Nguồn: tài liệu NI về tốc độ (cập nhật 30/07/2026), độ phân giải/độ chính xác (04/02/2026), lọc anti-alias (27/01/2026), đấu nối analog; nguồn hãng SMACQ chỉ cho ảnh series. Đối chiếu ngày 12/10/2026. NI-DAQmx không được suy rộng thành hỗ trợ driver cho SMACQ.
- Giới hạn xác minh: manual SMACQ Rev. F có cách ghi tốc độ không nhất quán giữa giới thiệu và bảng thông số; tải PDF đầy đủ để đối chiếu mục cấu hình không thành công. Vì vậy bài không kết luận tốc độ từng kênh hay khả năng lấy mẫu đồng thời của một model SMACQ cụ thể.
- Ví dụ giả định: tám kênh × 20.000 mẫu/giây = 160.000 mẫu/giây tổng; nếu tài liệu xác nhận tốc độ tổng 1.000.000 mẫu/giây chia đều tám kênh thì trần lý thuyết 125.000 mẫu/giây/kênh. Thang ±10 V, 16-bit: 20/65.536 V ≈ 305 µV/mã. Ghi tám kênh × 20.000 mẫu/giây × hai byte × 3.600 giây = 1.152.000.000 byte/giờ dữ liệu thô. Không gán các giả định cho model trong ảnh.
- Khác bài cũ: tập trung DAQ analog nhiều kênh, độ chính xác và vận hành ghi dữ liệu liên tục; không lặp hướng dẫn chọn máy hiện sóng hoặc module I/O số.

## Nội dung CMS

DAQ ghi “16-bit, 1 MSa/s” có đủ cho tám cảm biến không? Cần xác nhận tốc độ từng kênh, sai số và khả năng ghi liên tục trước khi xin báo giá bộ thu thập dữ liệu qua USB.

Ảnh đại diện: dòng SMACQ USB-3300, nguồn SMACQ, ảnh catalogue DTPT. Đây là ảnh series; đầu nối và cấu hình phải đối chiếu đúng model.

## 1. Viết yêu cầu từ phép đo

Ghi rõ đầu ra cảm biến, dải điện áp, số kênh, tần số cần quan sát, thời gian ghi và sai số chấp nhận được. Phân biệt ghi xu hướng chậm với so sánh pha hoặc diễn biến nhanh.

Ví dụ giả định: tám kênh điện áp, mỗi kênh 20.000 mẫu/giây, ghi một giờ. Tổng yêu cầu là 160.000 mẫu/giây; không mặc định phù hợp mọi cảm biến.

Nếu cần biết sự kiện xảy ra trước hay sau trên hai kênh, bổ sung giới hạn độ lệch thời gian giữa chúng.

## 2. Tốc độ tổng khác tốc độ từng kênh

NI nêu tốc độ tối đa phụ thuộc số kênh, thời gian ổn định tín hiệu và kiến trúc ADC: lấy mẫu đồng thời hoặc dùng chung ADC qua bộ chuyển kênh [1]. Tốc độ một kênh không tự động giữ nguyên khi bật tất cả kênh.

Giả sử tài liệu xác nhận 1 MSa/s là tốc độ tổng chia đều tám kênh: trần tính toán là 125 kSa/s/kênh. Phải kiểm tra điều kiện cấu hình và giới hạn thực tế, không lấy phép chia thay cho thông số được hãng xác nhận.

Yêu cầu nhà cung cấp xác nhận tốc độ duy trì từng kênh, độ lệch thời gian, điều kiện ổn định sau chuyển kênh và ví dụ SDK ở đúng chế độ đo. Với phép đo quan hệ thời gian, “lấy mẫu đồng thời” cần tài liệu hoặc demo có tiêu chí rõ.

## 3. 16-bit không phải cam kết sai số

Với DAQ 16-bit giả định ở thang ±10 V, khoảng mã lý thuyết là 20 V/65.536, xấp xỉ 305 µV. Đây là độ chia của ADC, không phải sai số ±305 µV của toàn hệ thống.

Theo NI, nhiễu đầu vào, sai số hệ số khuếch đại, sai số điểm không và trôi nhiệt đều ảnh hưởng độ chính xác [2]. Đọc điều kiện nhiệt độ, thời gian làm nóng và dải đo đi kèm thông số.

Khi nghiệm thu, đặt giới hạn sai lệch tại vài mức trong dải sử dụng, đối chiếu nguồn tham chiếu có sai số phù hợp. Ghi giá trị trung bình và độ dao động. Nhiều chữ số thập phân chưa chứng minh phép đo chính xác.

## 4. Kiểm tra đầu vào trước khi cắm dây

RSE là đo so với điểm tham chiếu chung; DIFF đo chênh lệch giữa hai đầu vào. Không suy ra có cách ly điện chỉ từ chữ DIFF. NI lưu ý điện áp chế độ chung vẫn phải nằm trong giới hạn cho phép [3].

Chốt số kênh dùng được ở chế độ đã chọn, giới hạn từng đầu vào và cách nối tham chiếu theo manual. Không đưa điện áp nguồn 24 V vào đầu đo chỉ vì thiết bị nằm trong tủ 24 V. Với tín hiệu dòng, nhiệt điện hoặc cảm biến cần cấp nguồn, yêu cầu giải pháp điều hòa tín hiệu đúng loại.

Đo tín hiệu biến thiên còn cần chống aliasing: thành phần cao tần có thể xuất hiện thành tần số sai sau lấy mẫu. NI giải thích bộ lọc analog trước ADC và vùng chuyển tiếp của bộ lọc khiến thiết kế thực tế cần dự phòng hơn quy tắc hai lần tần số [4]. Hỏi bộ lọc có sẵn hay phải bổ sung; không coi lọc phần mềm sau đo là thay thế tương đương.

## 5. Driver và lưu trữ là phần của cấu hình

Ví dụ tám kênh ở trên, nếu mỗi mẫu lưu hai byte, một giờ tạo 1,152 GB dữ liệu thô theo hệ thập phân. Timestamp, định dạng tệp và phần mềm có thể làm dung lượng lớn hơn; CSV không mặc định giữ mức hai byte/mẫu.

Yêu cầu xác nhận driver cho đúng Windows, kiến trúc ứng dụng và ngôn ngữ đang dùng. Có phần mềm demo không đồng nghĩa có SDK phù hợp chương trình hiện tại. Hỏi cách phát hiện tràn bộ đệm, mất mẫu, ngắt USB và khởi động lại phiên ghi.

Tính chi phí vòng đời gồm phần mềm, công tích hợp, hiệu chuẩn, dây/đầu nối, điều hòa tín hiệu và hỗ trợ driver. DAQ rẻ hơn nhưng thiếu công cụ ghi liên tục có thể cần nhiều công triển khai hơn.

## 6. Nghiệm thu đúng cấu hình sẽ mua

Thử trên bàn riêng với nguồn tín hiệu điện áp thấp đã kiểm tra, nằm trong giới hạn đầu vào, tham chiếu và cấp đo của thiết bị. Không đấu thử vào điện lưới, biến tần hoặc dây chuyền đang chạy.

- Bật đủ kênh, đúng dải và chế độ; lưu cấu hình cùng phiên bản driver.
- Ghi liên tục trong thời lượng dự kiến; đối chiếu số mẫu kỳ vọng, lỗi bộ đệm và khoảng gián đoạn.
- Đo mức DC tham chiếu và tín hiệu biến thiên phù hợp; kiểm tra sai số, méo dạng và lệch thời gian giữa kênh theo yêu cầu.
- Sau thử, ngừng thu an toàn, phục hồi cấu hình; giữ tệp và biên bản để đối chiếu khi giao hàng.

Khi gửi yêu cầu báo giá, đính kèm bảng yêu cầu và tiêu chí đạt. Tham khảo dòng USB DAQ trong catalogue: https://dtpt.shop/san-pham/smacq-usb-3310

## Tài liệu đối chiếu

- [1] NI — Sample Rate Considerations: https://www.ni.com/docs/en-US/bundle/ni-daqmx/page/smplrateconsid.html
- [2] NI — Accuracy, Code Width and Bits of Resolution: https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/analog-fundamentals/differences-between-accuracy--code-width-and-bits-of-resolution.html
- [3] NI — Field Wiring and Noise Considerations: https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/field-wiring-and-noise-considerations-for-analog-signals.html
- [4] NI — Anti-Aliasing Filters: https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/analog-fundamentals/anti-aliasing-filters-and-their-usage-explained.html
