# Chọn ống kính machine vision: tính vùng nhìn trước

- Ngày biên tập: 07/10/2026.
- Trạng thái: đã xuất bản qua API có quyền `articles.manage`, sau khi lưu nháp và kiểm tra renderer CMS desktop/mobile.
- CMS ID: `NEWS-1791342692911`.
- Ngày xuất bản: `2026-10-07T03:13:22.030Z` (10:13 giờ Việt Nam).
- URL: https://dtpt.shop/tin-tuc/chon-ong-kinh-machine-vision-fov-tieu-cu-khoang-cach
- Kiểm tra: API public trả đúng một bản ghi, nội dung trùng bản nháp; giữ nguyên 12 bài khác. Bài 1.000 từ, phép tính tiêu cự 20 mm và chi tiết 6 pixel đã kiểm tra, SEO description 148 ký tự. Hai ảnh HTTP 200 và tải đúng; renderer không lộ Markdown, không tràn ngang trên mobile 390 px. HTML server trả đúng title/description, Article schema, canonical và ngày xuất bản; sitemap có đúng một URL bài. Canonical thực tế dùng `https://dtpt.shop`, khớp cấu hình production hiện có; không mặc định alias www đã hoạt động.
- Slug: `chon-ong-kinh-machine-vision-fov-tieu-cu-khoang-cach`.
- Chuyên mục: Kiến thức kỹ thuật.
- Tác giả: DTPT Techs.
- SEO title: Chọn ống kính machine vision: FOV, tiêu cự và khoảng cách
- SEO description: Cách chọn ống kính camera công nghiệp từ FOV, khoảng cách lắp và cảm biến; ví dụ tính tiêu cự, kiểm tra chi tiết nhỏ và checklist thử trước khi mua.
- Mô tả ngắn: Camera nhiều megapixel vẫn có thể bỏ sót lỗi nếu vùng nhìn và ống kính không phù hợp. Bắt đầu từ kích thước vật, khoảng cách lắp và một phép tính có thể kiểm tra.
- Cover: `/products/hikrobot-mv-cs050-10gm.webp`, ảnh model có nhãn MV-CS050-10GM trong catalogue hiện có; chỉ minh họa camera, không phải bộ quang học đã kiểm thử.
- Ảnh trong bài: `/products/daheng-mer2-041-302gm.webp`, ảnh VA Imaging trong catalogue, minh họa ngàm dạng ren chưa lắp ống kính; không xác nhận model/cấu hình quang học từ ảnh.
- Nguồn ảnh gốc trong catalogue: Hikrobot https://www.hikrobotics.com/en/machinevision/visionproduct/?id=134&typeId=78 ; VA Imaging https://va-imaging.com/en-us/products/gige-vision-camera-4mp-monochrome-sony-imx287-mer2-041-302gm-va . Tái sử dụng tài nguyên hiện có cho biên tập; không cấp phép lại.
- Phạm vi: camera area-scan và ống kính tiêu cự cố định; ví dụ giả định, không gán thông số cho model trong ảnh. Không áp dụng công thức này để đặt mua ống kính telecentric.
- Khác bài cũ: tập trung vào quang học, tính FOV/tiêu cự và nghiệm thu; không viết lại bài chọn giao tiếp GigE/USB3 hoặc checklist camera tổng quát.
- Không thêm seed, không thay đổi/reset DB và không lưu thông tin đăng nhập.

## Nội dung CMS

Camera nhiều megapixel vẫn có thể bỏ sót vết xước nếu chi tiết quá nhỏ trong ảnh. Chọn ống kính nên bắt đầu bằng câu hỏi: cần nhìn vùng rộng bao nhiêu, từ khoảng cách nào, và phân biệt chi tiết gì? Bài dành cho camera area-scan dùng ống kính tiêu cự cố định; số liệu là ví dụ giả định, không phải kết quả thử thiết bị DTPT.

Ảnh cover: Hikrobot MV-CS050-10GM trong catalogue, không phải hệ thống đã kiểm thử.

## 1. Chốt vùng nhìn và vị trí lắp

FOV là vùng vật thể xuất hiện trong ảnh; WD là khoảng cách từ phía trước ống kính đến vật [1]. Ghi cả chiều rộng và chiều cao cần quan sát, kể cả khoảng lệch khi sản phẩm đi qua. Chụp vừa sát mép một mẫu đẹp dễ làm mất góc khi mẫu tiếp theo nằm lệch.

Đo không gian lắp thực tế: giá đỡ, đèn, tấm bảo vệ và phần máy chuyển động. Hãy dành khả năng điều chỉnh vị trí. Không lấy khoảng cách từ lưng camera thay cho WD rồi đặt mua theo con số đó.

## 2. Ước tính tiêu cự, rồi đối chiếu datasheet

Edmund Optics đưa công thức gần đúng cho lựa chọn ban đầu [2]:

Tiêu cự f ≈ chiều rộng cảm biến × WD / chiều rộng FOV.

Dùng cùng đơn vị mm. Ví dụ giả định: cảm biến rộng 6,4 mm, WD khoảng 500 mm, FOV rộng 160 mm. Kết quả là f ≈ 6,4 × 500 / 160 = 20 mm. Với cùng cảm biến và khoảng cách, tiêu cự ngắn hơn nhìn rộng hơn; tiêu cự dài hơn nhìn hẹp hơn.

20 mm chỉ là điểm bắt đầu. Công thức bỏ qua vị trí các mặt phẳng quang học và méo hình; WD cơ khí không trùng hoàn toàn khoảng cách trong mô hình [2]. Yêu cầu nhà cung cấp kiểm tra bảng FOV tại WD thực tế và giới hạn lấy nét gần nhất của ống kính. Không chọn tiêu cự gần nhất trong danh sách rồi mặc định lắp vừa.

## 3. Kiểm tra ngàm và vùng ảnh phủ cảm biến

Basler khuyến nghị kiểm tra ngàm và image circle, tức vùng ảnh mà ống kính phủ được [3]. Cùng ngàm chưa bảo đảm ống kính phủ hết cảm biến: góc ảnh có thể tối hoặc chất lượng giảm. Lấy kích thước cảm biến thực bằng mm từ datasheet; tên định dạng như 1/2 inch không phải phép đổi đơn giản sang chiều rộng.

![Camera công nghiệp trong catalogue với ngàm ống kính dạng ren ở mặt trước](</products/daheng-mer2-041-302gm.webp> "Ảnh VA Imaging đã dùng trong catalogue DTPT. Ngàm phía trước chưa lắp ống kính; ảnh minh họa cơ khí, không chứng minh cấu hình quang học đề xuất.")

Gửi đúng mã camera, ngàm, kích thước cảm biến và khoảng trống cho nhà cung cấp. Với máy đang vận hành, không tháo camera hoặc thay ống kính khi chưa có phương án dừng an toàn và lưu cấu hình cũ.

## 4. Tính số pixel trên chi tiết cần tìm

Giả sử ảnh có 1.920 pixel theo chiều ngang và FOV rộng 160 mm: mật độ lấy mẫu là 12 pixel/mm. Chi tiết rộng 0,5 mm chiếm khoảng 6 pixel. Nếu tăng FOV lên 320 mm mà giữ nguyên camera, chi tiết đó chỉ còn khoảng 3 pixel.

Đây là phép tính hình học, không phải cam kết phát hiện lỗi. Độ tương phản, chất lượng ống kính, ánh sáng, nhòe chuyển động và thuật toán vẫn quyết định kết quả. Basler lưu ý cần ghép khả năng phân giải của ống kính với cảm biến [3]. Không dùng một ngưỡng pixel duy nhất cho mọi loại khuyết tật.

## 5. Thử độ cao, khẩu độ và mục tiêu đo

Nếu vật thay đổi độ cao, cần kiểm tra độ sâu trường ảnh. Khép khẩu có thể tăng khoảng giữ nét nhưng làm giảm ánh sáng; khép quá nhiều có thể mất chi tiết do nhiễu xạ [4]. Đừng xử lý mọi ảnh thiếu nét bằng cách tăng thời gian phơi sáng, vì vật chuyển động có thể bị nhòe.

Nếu mục tiêu là đo kích thước chính xác, hãy hỏi thêm về ống kính telecentric và sai số khi vật thay đổi vị trí [5]. Đây là lựa chọn cần đánh giá riêng, không suy ra chỉ từ tiêu cự hoặc megapixel.

## 6. Nghiệm thu bằng mẫu đạt và mẫu lỗi

Thử trên bàn hoặc trong thời gian dừng đã được phê duyệt. Lưu vị trí, tiêu cự, khẩu độ, phơi sáng, đèn và cấu hình phần mềm để có thể quay lại trạng thái trước.

- Đặt mẫu ở giữa và các mép vùng nhìn; thử các vị trí lệch và độ cao cho phép.
- Dùng mẫu đạt cùng mẫu có lỗi nhỏ nhất cần phát hiện, gồm bề mặt phản sáng hoặc khó chụp.
- Chạy đúng tốc độ và thời gian phơi sáng dự kiến; ghi trường hợp bỏ sót và loại nhầm.
- Kiểm tra lại sau khi khóa vòng lấy nét, khẩu độ và giá đỡ; ảnh đẹp trước khi siết chưa đủ.

Trước báo giá, gửi nhà cung cấp bản yêu cầu gồm FOV, WD, chi tiết nhỏ nhất, biến thiên độ cao, tốc độ vật, model camera và tiêu chí nghiệm thu. Tính cả giá đỡ, đèn, tấm bảo vệ, hiệu chuẩn và thời gian thử vào chi phí triển khai. Một ảnh mẫu rõ nét không thay thế bộ mẫu kiểm chứng.

Tham khảo camera trong catalogue: https://dtpt.shop/san-pham/hikrobot-mv-cs050-10gm

## Tài liệu đối chiếu

- [1] Edmund Optics — Imaging Fundamentals: https://www.edmundoptics.com/knowledge-center/application-notes/imaging/6-fundamental-parameters-of-an-imaging-system/
- [2] Edmund Optics — Focal Length and Field of View: https://www.edmundoptics.com/knowledge-center/application-notes/imaging/understanding-focal-length-and-field-of-view/
- [3] Basler — Lens Selection, cập nhật 02/02/2026: https://www.baslerweb.com/en-us/learning/lens-selection/
- [4] Edmund Optics — Depth of Field and Depth of Focus: https://www.edmundoptics.com/knowledge-center/application-notes/imaging/depth-of-field-and-depth-of-focus/
- [5] Edmund Optics — Types of Machine Vision Lenses: https://www.edmundoptics.com/knowledge-center/application-notes/imaging/imaging-lens-selection-guide/
