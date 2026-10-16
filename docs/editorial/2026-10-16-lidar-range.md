# LiDAR 100 m: đọc đúng tầm đo trước khi mua

- Ngày biên tập: 16/10/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API có quyền `articles.manage`, sau khi kiểm tra nháp desktop/mobile.
- Ngày xuất bản: `2026-10-16T03:12:55.953Z`.
- Cập nhật tiêu đề: `2026-10-16T03:14:31.168Z`, rút gọn sau kiểm tra giao diện; giữ nguyên ngày xuất bản và nội dung.
- URL: https://dtpt.shop/tin-tuc/chon-lidar-tam-do-do-phan-xa-muc-tieu
- Kiểm tra: 992 từ, SEO description 148 ký tự. Ba test renderer đạt. Nháp và bài công khai đã rà desktop/mobile 390 px bằng ảnh chụp và DOM: hai ảnh tải đúng, alt/chú thích và ba nguồn hiển thị đủ, không tràn ngang/lộ Markdown. API public có đúng một bản ghi, nội dung khớp bản đã duyệt; giữ nguyên 16 bài khác. URL bài, hai ảnh và catalogue HTTP 200; title/description server đúng, Article schema sau cache đúng tiêu đề cuối/ảnh/ngày xuất bản/ngày cập nhật/URL, robots cho lập chỉ mục, sitemap có đúng một URL bài. Canonical hiện hành là `https://dtpt.shop`.
- Không thêm seed, reset DB hoặc lưu thông tin đăng nhập.
- CMS ID: `NEWS-1792120282677`.
- Slug: `chon-lidar-tam-do-do-phan-xa-muc-tieu`.
- Chuyên mục: Tư vấn sản phẩm
- Tác giả: DTPT Techs
- SEO title: Chọn LiDAR ngoài trời: tầm đo và phản xạ mục tiêu
- SEO description: Đọc đúng tầm đo LiDAR theo độ phản xạ, ánh sáng, vùng gần và góc quan sát; ví dụ Livox Mid-360S, Benewake TF03-100 cùng checklist thử trước khi mua.
- Mô tả ngắn: Nhãn 100 m không bảo đảm đo được mọi vật thể ở khoảng cách đó. Cần đối chiếu độ phản xạ, điều kiện đo, góc quan sát và kết quả trên vật mẫu thực tế.
- Cover media: `/api/article-media/ee9ae289-2610-45c9-a4cc-d8b1e822a9bd`.
- Inline media: `/api/article-media/d793b293-0440-4cfe-bb1f-c380445e7a9a`.
- Ảnh cover: ảnh hãng Mid-360S cùng bóng golf để minh họa kích thước, lấy từ mục Smaller and Lighter: https://www.livoxtech.com/mid-360s ; tệp https://www.livoxtech.com/dps/7a52fc719623bd035b73f4ba994f8360.png . Không dùng ảnh `livox-mid-360s.png` đang có trong catalogue vì nhãn trên ảnh đó là MID-360.
- Ảnh trong bài: banner có hình dòng TF03 từ datasheet Benewake, ảnh series, không xác nhận hậu tố model/giao tiếp: https://ai.benewake.com/en/resources/technical-documents/tf03-datasheet/ ; tệp https://ai.benewake.com/uploads/images/e1c4e818-7667-470e-9a65-d88156ed4db6.png . Giữ nguyên ảnh và ghi nguồn; dùng biên tập đúng sản phẩm, không cấp phép lại hoặc gọi là ảnh DTPT tự chụp.
- Phạm vi: tư vấn lựa chọn và nghiệm thu LiDAR đo lường/nhận thức môi trường; không phải tin ra mắt, benchmark DTPT hay hướng dẫn thiết kế chức năng bảo vệ con người.
- Nguồn: Livox Mid-360S specs và trang sản phẩm; Benewake TF03 Series Datasheet. Đối chiếu 16/10/2026. Bản Markdown liên kết từ trang Benewake xác nhận chú thích phép đo sai số/độ lặp ở 25 °C trong nhà, bảng trắng khuếch tán 90%, toàn bộ vết sáng nằm trên mục tiêu. Không gán điều kiện đó thành phép thử tầm xa trên mục tiêu 10% hoặc tự suy ra tầm đo dưới mọi mức sáng.
- Khác bài cũ: tập trung tầm đo/phản xạ/vùng quan sát của LiDAR; không lặp bài ống kính, camera nhiệt hoặc DAQ. Hai hãng được dùng làm ví dụ đọc thông số, không xếp hạng hơn kém giữa LiDAR một hướng và 3D.

## Nội dung CMS

LiDAR ghi “100 m” có nhận được kiện hàng tối màu ở khoảng cách đó không? Cần đối chiếu mục tiêu, ánh sáng và cách lấy dữ liệu trước khi chọn thiết bị.

Ảnh đại diện: Mid-360S cùng bóng golf, nguồn Livox. Ảnh hãng minh họa kích thước, không phải kết quả thử tầm đo của DTPT.

## 1. Phân biệt tầm cắt và tầm đo theo độ phản xạ

Livox công bố Mid-360S có tầm cắt 100 m, nhưng tầm phát hiện điển hình với mục tiêu phản xạ 10% là 40 m ở điều kiện ánh sáng 100 klx [1]. Trang sản phẩm bổ sung điều kiện nhiệt độ 25 °C cho mức 40 m [2]. Không đổi “100 m cut-off” thành cam kết nhận mọi mục tiêu ở 100 m.

Bảng Benewake ghi TF03-100 đạt 100 m với phản xạ 90%, và 40 m với phản xạ 10% [3]. Hai dòng số của cùng model đã cho thấy việc chỉ lấy khoảng cách lớn nhất sẽ bỏ mất điều kiện lựa chọn.

Đây là thông số hãng, chưa phải so sánh độc lập. Mid-360S tạo dữ liệu 3D, TF03 đo trong góc nhìn hẹp; cùng mức 40 m không chứng minh chúng thay thế nhau.

![Hình dòng Benewake TF03 trên đầu trang datasheet](</api/article-media/d793b293-0440-4cfe-bb1f-c380445e7a9a> "Ảnh dòng TF03 từ datasheet Benewake, minh họa cảm biến đo theo hướng hẹp. Đây là ảnh series; xác nhận đúng TF03-100/180 và phiên bản giao tiếp khi chọn cấu hình.")

Ví dụ: phát hiện kiện hàng ở 60 m. Với vật phản xạ thấp, thông số 100 m chưa chứng minh cấu hình đạt. Cần thử vật mẫu hoặc có xác nhận của hãng cho điều kiện tương ứng. Không tự gán phản xạ 10% chỉ vì vật nhìn bằng mắt có màu đen.

## 2. Đọc chú thích phép đo trước khi so sai số

Tầm phát hiện, sai số khoảng cách và độ lặp là ba thông tin khác nhau. Nhận được tín hiệu chưa chứng minh khoảng cách đo đã đủ chính xác cho ứng dụng.

Chú thích datasheet TF03 nêu phép đo sai số, độ phân giải khoảng cách và độ lặp trên bảng trắng khuếch tán phản xạ 90%, ở 25 °C trong nhà, với toàn bộ vết sáng nằm trên mục tiêu [3]. Không lấy kết quả đó làm cam kết trên một mép kiện hàng nhỏ hoặc trong mọi điều kiện ngoài trời.

Khi hỏi báo giá, gửi kích thước nhỏ nhất, vật liệu, bề mặt và góc đặt của vật cần nhận. Mẫu thử phải đại diện vật khó đo nhất trong công việc, không chỉ là tấm trắng lớn đặt vuông góc.

## 3. FOV rộng vẫn cần kiểm tra đúng vị trí lắp

FOV là vùng góc quan sát. Livox lưu ý tầm đo hiệu dụng của Mid-360S thay đổi theo vùng FOV; phía trên có tầm ngắn hơn phía dưới. Hãng cũng nêu độ phân giải góc cải thiện khi tăng thời gian tích lũy [2].

Vì vậy, cần thử ở đúng độ cao và góc lắp dự kiến. Một khung cảnh tĩnh tích lũy lâu có thể cho kết quả khác yêu cầu phát hiện vật đang di chuyển. Đừng dùng một ảnh đám mây điểm đẹp để thay phép đo thời gian nhận mục tiêu.

Yêu cầu bên tích hợp mô tả thời gian tích lũy, chu kỳ xử lý và độ trễ từ cảm biến đến ứng dụng. Với vật nhỏ, kiểm tra cả biên vùng nhìn và vị trí có khả năng bị khung máy che khuất.

## 4. Vùng gần phải nghiệm thu riêng

Khoảng cách tối thiểu không đồng nghĩa toàn bộ vùng gần có cùng chất lượng đo. Livox ghi dữ liệu Mid-360S trong khoảng 0,1–0,2 m chỉ để tham khảo vì không bảo đảm độ chính xác [1].

Nếu cần đo sát vỏ máy, thử riêng vùng này. Ghi các khoảng không đạt và trao đổi phương án đổi vị trí hoặc bổ sung cảm biến. Không tháo cửa sổ quang học hay sửa phần phát laser để giảm vùng mù.

## 5. Thử bằng dữ liệu có thể đối chiếu

Tổ chức tại bàn thử hoặc khu vực được phê duyệt, tách khỏi dây chuyền đang chạy. Dùng vật mẫu cố định hoặc đồ gá an toàn; không dùng người làm vật thử cho chức năng tránh va chạm.

- Lập danh sách mục tiêu, khoảng cách, góc đặt, điều kiện sáng và tiêu chí đạt trước demo.
- Ghi đúng model, firmware, tốc độ xuất dữ liệu, cấu hình lọc và thời gian tích lũy.
- Thử vật mẫu tại vị trí gần, xa và biên FOV; lặp lại trong điều kiện sáng dự kiến sử dụng.
- Lưu dữ liệu gốc và khoảng cách tham chiếu; thống kê lần không nhận, độ dao động và độ trễ, không chỉ chọn khung đẹp.
- Xác nhận cách phần mềm nhận biết dữ liệu không hợp lệ hoặc quá cũ; thử khởi động lại và phục hồi cấu hình.

Giữ cấu hình đã đạt để đối chiếu khi giao hàng. Hướng dẫn này phục vụ chọn thiết bị đo; hệ thống bảo vệ con người cần đánh giá an toàn và thiết bị được xác nhận phù hợp riêng.

## 6. Đưa công tích hợp vào chi phí đầu tư

So sánh cả giá cảm biến, gá lắp, dây/nguồn, máy tính xử lý, driver/SDK, công thử vật mẫu và bảo trì cửa sổ quang học theo hướng dẫn hãng. Hỏi nhà cung cấp ai xử lý khi mất dữ liệu hoặc thay firmware, và có bàn giao cấu hình, log cùng tiêu chí nghiệm thu không.

Tham khảo model 3D trong catalogue: https://dtpt.shop/san-pham/livox-mid-360s

## Nguồn đối chiếu

- [1] Livox — Mid-360S Specs: https://www.livoxtech.com/mid-360s/specs
- [2] Livox — Mid-360S và chú thích FOV/thời gian tích lũy: https://www.livoxtech.com/mid-360s
- [3] Benewake — TF03 Series Datasheet: https://ai.benewake.com/en/resources/technical-documents/tf03-datasheet/
