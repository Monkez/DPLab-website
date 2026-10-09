# MQTT trong nhà máy: QoS 1 đã đủ chống mất dữ liệu?

- Ngày biên tập: 09/10/2026, xử lý lượt 10:00 bị trễ; lượt 09:00 đã được kiểm tra riêng.
- Trạng thái: đã xuất bản qua API có quyền `articles.manage`, sau khi kiểm tra nháp CMS desktop/mobile.
- Ngày xuất bản: `2026-10-09T07:35:30.990Z`.
- URL: https://dtpt.shop/tin-tuc/mqtt-qos-1-chong-mat-du-lieu-nha-may
- Kiểm tra: 997 từ, SEO description 145 ký tự; phép tính 3 MB payload đã kiểm tra. Ba test renderer ảnh đạt. Nháp CMS và bài công khai đã kiểm tra desktop/mobile 390 px: hai ảnh tải đúng, chú thích hiện đủ, không tràn ngang hay lộ Markdown. API public trả đúng một bản ghi và nội dung trùng bản đã duyệt; giữ nguyên 13 bài khác. URL bài, hai ảnh, liên kết catalogue và sitemap HTTP 200; metadata server đúng title/description, robots cho lập chỉ mục, Article schema đúng ngày và sitemap có một URL. Canonical hiện hành là `https://dtpt.shop`, không đổi sang alias www chưa xác minh.
- Không thêm seed, không reset DB, không thay nội dung CMS khác và không lưu thông tin đăng nhập.
- CMS ID: `NEWS-1791531139817`.
- Slug: `mqtt-qos-1-chong-mat-du-lieu-nha-may`.
- Chuyên mục: Kiến thức kỹ thuật.
- Tác giả: DTPT Techs.
- SEO title: MQTT trong nhà máy: QoS 1 và chống mất dữ liệu
- SEO description: Phân biệt QoS 1, phiên lưu và bộ đệm gateway; ví dụ tính dung lượng, xử lý bản tin trùng và checklist nghiệm thu MQTT khi mất mạng hoặc mất điện.
- Mô tả ngắn: Bật QoS 1 chưa chứng minh dữ liệu đã vào cơ sở dữ liệu. Cần kiểm tra bộ đệm ở gateway, phiên tại broker và cách ứng dụng xử lý bản tin trùng.
- Cover: `/products/pusr-usr-m300.jpg`, ảnh đúng nhãn USR-M300 trong catalogue; nguồn ảnh Sparwan: https://sparwan.com/products/passerelle-iot-industrielle-usr-m300 .
- Ảnh trong bài: `/products/pusr-usr-g806w.webp`, ảnh đúng nhãn USR-G806W trong catalogue; nguồn ThinkRobotics: https://thinkrobotics.com/products/4g-industrial-router-usr-g806w . Tái sử dụng ảnh catalogue cho biên tập, không cấp phép lại.
- Phạm vi: thu thập dữ liệu giám sát; các nguyên tắc QoS đối chiếu MQTT 3.1.1, hành vi triển khai phải kiểm tra đúng firmware/client/broker. Không hướng dẫn điều khiển thời gian thực hoặc chức năng an toàn.
- Nguồn sơ cấp: OASIS MQTT 3.1.1 bản chuẩn 29/10/2014, mục 4.3.2; AWS IoT Core MQTT; Eclipse Mosquitto mosquitto.conf. Đối chiếu 09/10/2026; không coi tài liệu nền tảng là tin công bố mới.
- Nguồn model: https://www.pusr.com/products/industrial-IoT-Gateway.html . Ảnh M300 chỉ minh họa vị trí gateway, không khẳng định khả năng lưu bền vững hay bộ đệm của cấu hình cụ thể.
- Khác bài cũ: tập trung vào tính toàn vẹn dữ liệu MQTT sau mất mạng/mất điện, không lặp checklist I/O hoặc cổng COM.
- Ví dụ giả định: 10 bản tin/giây × 600 giây × 500 byte = 3.000.000 byte payload; chưa gồm metadata và dự phòng. Không gán cho model trong ảnh.

## Nội dung CMS

Dashboard hiện “đã kết nối” nhưng biểu đồ vẫn khuyết đoạn sau sự cố mạng. MQTT QoS 1 có giải quyết được không? Chưa đủ: cần kiểm tra nơi tạo, chuyển tiếp và lưu dữ liệu. Bài dành cho giám sát, không thay chức năng an toàn hoặc điều khiển thời gian thực.

Ảnh cover: gateway PUSR USR-M300 trong catalogue, nguồn Sparwan; không phải thiết bị đã nghiệm thu lưu dữ liệu.

## 1. Xác nhận truyền tin khác xác nhận lưu dữ liệu

MQTT chuyển bản tin qua broker, tức máy chủ trung gian. Theo OASIS, QoS 1 cho phép bản tin đến bên nhận ít nhất một lần; có thể có bản trùng. Bên nhận được gửi PUBACK trước khi hoàn tất chuyển bản tin tới ứng dụng [1].

Vì vậy, PUBACK từ broker không chứng minh bản ghi đã vào cơ sở dữ liệu của doanh nghiệp. Gateway gửi lên broker và broker gửi xuống ứng dụng là hai chặng riêng. Cần kiểm tra QoS thực tế ở cả chặng xuất bản lẫn đăng ký nhận.

Thống nhất điểm nào được xem là “đã lưu”. Nếu cần xác nhận từ ứng dụng, thiết kế thông báo có mã bản ghi sau khi lưu thành công; cơ chế này cần tích hợp thêm.

## 2. Tìm đúng chỗ cần bộ đệm

Khi đường truyền từ gateway lên broker mất, broker chưa nhận được các mẫu mới. Không thể yêu cầu máy chủ lưu dữ liệu mà nó chưa thấy. Gateway cần tiếp tục thu, lưu cục bộ rồi gửi bù; hỏi rõ tính năng này ở đúng firmware và phần mềm đang dùng.

Ngược lại, khi broker còn hoạt động nhưng ứng dụng nhận tạm ngắt, phiên lưu có thể giúp giữ bản tin chờ. AWS IoT Core mô tả việc khôi phục đăng ký và gửi lại bản tin QoS 1 trong phiên, nhưng có giới hạn hàng đợi và thời hạn; hết hạn có thể mất phần đang chờ [2]. Đây là hành vi của AWS, không mặc định mọi broker giống nhau.

![Router PUSR USR-G806W với cổng mạng và đầu nối anten](</products/pusr-usr-g806w.webp> "Router USR-G806W, nguồn ThinkRobotics, ảnh catalogue DTPT. Kết nối WAN và bộ đệm dữ liệu là hai hạng mục phải kiểm tra riêng; ảnh không chứng minh có chức năng gửi bù.")

Router dự phòng có thể giảm gián đoạn, nhưng vẫn phải thử trường hợp cả hai đường truyền đều mất. “Có 4G” chưa bảo đảm không mất mẫu.

## 3. Tính dung lượng theo thời gian gián đoạn

Ví dụ giả định: tổng lưu lượng 10 bản tin/giây, cần giữ 10 phút, mỗi payload khoảng 500 byte. Phần dữ liệu tối thiểu là 10 × 600 × 500 = 3.000.000 byte, khoảng 3 MB theo hệ thập phân.

Con số này chưa gồm timestamp, mã bản ghi, chỉ mục, định dạng lưu và dự phòng. Yêu cầu nhà cung cấp xác nhận giới hạn theo byte lẫn số bản tin, cách xử lý khi đầy và dữ liệu còn giữ được sau khởi động lại không.

Khi mạng trở lại, tốc độ gửi bù phải đủ để hàng đợi giảm trong lúc dữ liệu mới vẫn phát sinh. Đo thời gian giải phóng bộ đệm. Nếu loại bỏ mẫu cũ, quy định rõ điều kiện và ghi nhận số mẫu bị bỏ.

## 4. Bản tin trùng không được làm tăng sản lượng

Đề xuất cho bên tích hợp: mỗi sự kiện có mã ổn định, gồm mã thiết bị, mã phiên khởi động và số thứ tự. Giữ nguyên mã khi gửi lại. Cơ sở dữ liệu dùng mã này để nhận lại cùng sự kiện mà không cộng thêm sản phẩm hoặc phát cảnh báo lần nữa.

Timestamp nên ghi lúc đo, không thay bằng lúc gửi bù. Kiểm tra đồng hồ thiết bị và hiển thị tuổi dữ liệu trên dashboard. AWS lưu ý retained message chỉ giữ một bản tin cho mỗi topic [2]; nó phù hợp đưa trạng thái gần nhất cho người mới đăng ký, không thay lịch sử đầy đủ. Một giá trị retained cũ cần được nhận diện là cũ.

## 5. Lưu trong RAM vẫn có thể mất khi mất điện

Với persistence tích hợp của Eclipse Mosquitto, dữ liệu được ghi xuống đĩa khi đóng broker và theo chu kỳ autosave [3]. Không suy ra mọi bản tin được ghi tức thời.

Cần hỏi cơ chế lưu, chu kỳ ghi và phạm vi mất dữ liệu chấp nhận được ở cả gateway lẫn broker. Ghi thường xuyên có đánh đổi về I/O và tuổi thọ lưu trữ; tính cả UPS, giám sát dung lượng, khôi phục và công bảo trì vào chi phí vòng đời.

## 6. Nghiệm thu bằng bản ghi đếm được

Thử trên thiết bị riêng; không ngắt mạng hay nguồn dây chuyền đang chạy. Sao lưu cấu hình, dùng topic/tài khoản thử, TLS và quyền truy cập giới hạn.

- Phát chuỗi mẫu có mã liên tục; đối chiếu số mẫu phát với số bản ghi duy nhất đã lưu.
- Mô phỏng mất WAN rồi nối lại; kiểm tra khoảng thiếu, tuổi mẫu và thời gian gửi bù.
- Ngắt riêng ứng dụng nhận để thử khôi phục phiên; phân biệt với mất WAN ở gateway.
- Khởi động lại gateway/broker bằng quy trình an toàn; kiểm tra hàng đợi còn lại và cảnh báo khi đầy.

Chốt trước demo: mức mất mẫu, độ trễ và cách xử lý trùng. Sau thử, phục hồi cấu hình, xác nhận luồng giám sát. Khi hỏi báo giá, gửi lưu lượng, thời gian mất mạng cần chịu và yêu cầu lưu qua mất điện.

Tham khảo gateway trong catalogue: https://dtpt.shop/san-pham/pusr-usr-m300

## Tài liệu đối chiếu

- [1] OASIS — MQTT 3.1.1, mục 4.3.2: https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html
- [2] AWS IoT Core — MQTT, phiên lưu và retained messages: https://docs.aws.amazon.com/iot/latest/developerguide/mqtt.html
- [3] Eclipse Mosquitto — persistence và autosave: https://mosquitto.org/man/mosquitto-conf-5.html
