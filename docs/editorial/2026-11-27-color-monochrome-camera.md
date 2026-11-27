# Camera màu hay đơn sắc: chọn theo lỗi cần phát hiện

- Ngày biên tập: 27/11/2026, khung 10:00 giờ Việt Nam.
- Trạng thái: đã lưu nháp CMS, chưa xuất bản.
- CMS ID: `NEWS-1795748889531`.
- Slug: `camera-mau-hay-don-sac-chon-theo-loi-can-phat-hien`.
- Chuyên mục: Tư vấn đầu tư
- Tác giả: DTPT Techs
- Tag: Machine vision, Camera màu, Camera đơn sắc
- SEO title: Camera màu hay đơn sắc: chọn theo lỗi cần phát hiện
- SEO description: So sánh camera màu và đơn sắc theo lỗi cần kiểm tra, ánh sáng, Bayer và chi phí tích hợp. Checklist thử mẫu trước khi đầu tư hệ thống machine vision.
- Mô tả ngắn: Camera màu có ích khi màu sắc quyết định đạt hay lỗi. Với đo biên hoặc kiểm tra hiện diện, cần so cả tương phản, nguồn sáng và khả năng lặp lại.
- Nguồn sơ cấp: Basler Camera Selection (bài nền tảng 2023, không gọi tin mới); Basler Pixel Format về Bayer raw và Mono; Basler Illumination về màu đèn/tương phản; Basler Balance White Auto; KEYENCE hướng dẫn chọn camera theo màu/độ sáng. Kiểm tra ngày 27/11/2026. Bài so sánh quyết định, không có benchmark hoặc thử nghiệm DTPT.
- Cover: `/products/hikrobot-mv-cs050-10gm.webp`, tài nguyên catalogue DTPT đã có. Đã xem và đọc đúng nhãn MV-CS050-10GM trên ảnh; tái sử dụng tài nguyên catalogue có nguồn hãng ở `src/data/verifiedProducts.ts`, không gán ảnh là máy DTPT thử hoặc xác nhận cấu hình đặt mua. Không dùng ảnh VA Imaging mang tên file Daheng để minh họa model Hikrobot, không sửa catalogue.
- Inline media: `/api/article-media/13ce30e5-761d-4379-a871-a34243885b66`.
- Hình xen kẽ: source `docs/editorial/assets/2026-11-27-mono-bayer.svg`, DTPT Techs tự dựng. Sơ đồ bốn photosite và ví dụ Bayer RGGB, không phải ảnh cảm biến, ảnh kiểm tra mẫu hoặc phép đo. Không suy rộng mọi công nghệ camera màu đều dùng Bayer.
- Phạm vi: quyết định camera area-scan mono hoặc Bayer màu theo đặc trưng lỗi và chi phí triển khai. Đã đọc bài tổng quan NEWS-003, đối chiếu 29 bài, không có nháp/bài ngày 27/11. Không trùng bài lens/FOV, GigE/USB3 hoặc phơi sáng/nhòe; không sao chép nội dung dptech.shop.
- Kiểm tra nội dung: 976 từ trước phần đọc thêm/nguồn cuối, gồm heading và chú thích sơ đồ (943 từ phần văn bản, 33 từ chú thích); SEO title 51 ký tự, description 149 ký tự. Đã tự biên tập về câu hỏi trung tâm, phạm vi Bayer, nguyên lý và giới hạn kết luận, chi phí tích hợp, phép thử mẫu và an toàn. Không đưa benchmark, giá hoặc ưu thế định lượng chưa đo.
- Ba test renderer đạt. Đã xem trực tiếp ảnh catalogue và bản PNG sơ đồ 720 × 690; không cắt chữ hoặc gán hình là kết quả thử. Cover WebP HTTP 200 (31.888 byte); sơ đồ WebP CMS HTTP 200 (35.258 byte). Hai bài nội bộ HTTP 200, title phù hợp. Chưa kiểm tra renderer thực tế trên desktop/mobile vì không có trình duyệt kết nối tại thời điểm duyệt: Chrome báo không khả dụng, danh sách trình duyệt rỗng.
- API đã xác nhận lại đúng một nháp `NEWS-1795748889531`, nội dung khớp hồ sơ, `publishedAt` rỗng; hash của 29 bài trước giữ nguyên. Nháp không có trong API public hoặc sitemap. URL dự kiến hiện trả HTML chung, chưa có metadata bài; không coi HTTP 200 này là đã xuất bản.
- Giữ nguyên ID/slug và media đã upload, không tạo thêm nháp hoặc upload lại hình. Sau khi kết nối trình duyệt được khôi phục: rà nháp CMS và ảnh ở desktop/mobile, xuất bản đúng nháp này với ngày thực tế nếu đạt, rồi kiểm tra API public, URL/ảnh, canonical, metadata sau cache và sitemap. Quyền `articles.manage` đã xác minh; chưa cần người dùng phê duyệt lại nội dung xuất bản.
- Payload, baseline hash, validation chuẩn bị, PNG trung gian tại `work/editorial-20261127/` ngoài Git, không lưu credential. Source SVG duy trì trong docs; hình public lưu PostgreSQL `article_media`. Chỉ thêm tài liệu/asset biên tập, không đổi mã ứng dụng, seed hoặc catalogue nên không cần full build ứng dụng.

## Nội dung CMS

Mô tả lỗi cần kiểm tra trước: sai màu linh kiện, thiếu chi tiết hay lệch biên. Camera màu đáng đầu tư khi thông tin màu giúp ra quyết định; ảnh trông đẹp hơn chưa chứng minh hệ thống phát hiện lỗi tốt hơn.

Bài tập trung so sánh camera area-scan đơn sắc với camera màu dùng bộ lọc Bayer thường gặp. Checklist là đề xuất biên tập, chưa có thử nghiệm đối đầu.

Ảnh đại diện là Hikrobot MV-CS050-10GM trong catalogue DTPT, nguồn ảnh hãng. Ảnh không phải thiết bị DTPT đã thử nghiệm.

## 1. Màu sắc có nằm trong tiêu chí đạt/lỗi không?

Nếu nhiệm vụ là phân biệt nắp chai đúng màu, nhận diện dây theo màu vỏ hoặc tìm vùng đổi màu, hãy đưa camera màu vào phương án thử. KEYENCE lưu ý khác biệt về sắc màu có thể có ích khi độ sáng giữa lỗi và nền gần nhau [1].

Với đo kích thước từ đường biên, tìm lỗ hoặc kiểm tra hiện diện bằng bóng vật, thông tin sáng/tối có thể đã đủ. Basler khuyến nghị ưu tiên mono khi màu không bắt buộc, với lợi thế thường gặp về độ nhạy và chi tiết [2]. Cần xác nhận lợi thế trên cặp model đang so sánh.

Lập danh sách lỗi bắt buộc và đặc trưng dùng để phát hiện từng lỗi. Nếu một trạm vừa đo biên vừa xác nhận màu, cần chứng minh một camera đáp ứng được cả hai, hoặc tính chi phí phương án tách phép kiểm tra.

## 2. Cùng số megapixel không có nghĩa cùng thông tin

Theo tài liệu Basler, ở định dạng Bayer raw, mỗi điểm ảnh được lọc để ghi một trong ba kênh đỏ, xanh lá hoặc xanh dương; dữ liệu raw chưa được nội suy [3]. Để tạo ảnh màu đầy đủ, hệ thống cần bước xử lý màu phù hợp. Chi tiết nhỏ và đường biên vì thế phải được đánh giá trên ảnh thực tế dùng cho thuật toán.

![Bốn điểm ảnh mono ghi độ sáng so với mảng Bayer RGGB gồm một ô đỏ, hai ô xanh lá và một ô xanh dương](</api/article-media/13ce30e5-761d-4379-a871-a34243885b66> "Sơ đồ nguyên lý DTPT Techs từ tài liệu Basler. Mảng RGGB chỉ là ví dụ; không phải ảnh cảm biến hoặc kết quả đo, không đại diện mọi công nghệ thu màu.")

Một số camera màu có thể xuất Mono 8 theo khả năng model [3]. Điều này tạo ảnh đầu ra đơn sắc, không loại bỏ bộ lọc màu vật lý trên cảm biến. Vì vậy, không dùng ảnh chuyển xám từ camera màu làm bằng chứng thay thế hoàn toàn thử nghiệm với camera mono.

Khi so báo giá, yêu cầu ghi model cảm biến, định dạng xuất ảnh và vị trí xử lý nội suy: camera, SDK hay máy tính. Đừng suy ra băng thông hoặc tải CPU chỉ từ chữ “camera màu”; cấu hình truyền Bayer raw và cấu hình truyền RGB có thể khác nhau.

## 3. Chọn đèn cùng lúc với camera

Camera mono vẫn có thể phân biệt một số vật khác màu nhờ chọn bước sóng chiếu sáng để tạo khác biệt sáng/tối. Basler mô tả việc dùng đèn màu làm nổi hoặc che đặc trưng, còn đèn trắng phục vụ tái tạo màu tự nhiên [4]. Hiệu quả phụ thuộc vật liệu và phổ phản xạ, nên phải kiểm tra cả mẫu đạt lẫn mẫu lỗi.

Nếu cần đánh giá màu, kiểm soát nguồn sáng, ánh sáng ngoài và cấu hình xử lý màu. Cân bằng trắng tự động liên tục có thể thay đổi cân bằng kênh khi đang thu ảnh; Basler có các chế độ Once và Continuous tùy model [5]. Với bài thử so màu, cần ghi rõ chế độ và thông số đã dùng để tái hiện kết quả.

Cân bằng trắng không tự chứng minh hệ thống đo màu đạt dung sai khách hàng yêu cầu. Nếu tiêu chí nghiệm thu là sai khác màu, hãy chốt vật chuẩn, điều kiện chiếu sáng, phương pháp đánh giá và giới hạn được chấp nhận với nhà cung cấp.

## 4. So chi phí của cả trạm kiểm tra

Đặt hai phương án cạnh nhau với cùng phạm vi: camera, lens, đèn, bộ điều khiển đèn, che sáng, phần mềm và công nghiệm thu. Phương án ít tiền camera hơn có thể cần thêm nguồn sáng hoặc xử lý; phương án camera màu cũng có thể cần công quản lý màu và bộ mẫu tham chiếu.

Hỏi riêng khả năng lưu ảnh gốc, xuất cấu hình, thay camera và khôi phục công thức kiểm tra. Với hệ thống đang dùng, xác nhận SDK, định dạng ảnh và thuật toán hiện hữu hỗ trợ model mới. Tính cả công hiệu chỉnh sau khi thay đèn, lens hoặc linh kiện.

## 5. Yêu cầu thử mẫu trước khi chốt mua

- Dùng mẫu đạt, mẫu lỗi và mẫu sát ranh giới từ các lô thực tế; thống nhất nhãn chuẩn với bộ phận chất lượng trước khi chạy thuật toán.
- Giữ cùng trường nhìn, chi tiết cần phát hiện và giới hạn phơi sáng theo chuyển động. Mỗi phương án được tối ưu đèn trong cùng ràng buộc lắp đặt và an toàn.
- Ghi tỷ lệ nhận nhầm mẫu đạt và bỏ lọt mẫu lỗi, thời gian xử lý cùng điều kiện chụp. Không nghiệm thu chỉ bằng vài ảnh trình diễn được chọn sẵn.
- Lưu ảnh và cấu hình; kiểm tra lại với biến thiên vị trí, bề mặt, ánh sáng ngoài và mẫu từ lô khác trước khi áp dụng tại hiện trường.

Thử trên bàn hoặc trong môi trường được phép, không đổi tham số trạm đang điều khiển dây chuyền để làm phép so sánh. Kèm bộ mẫu, danh sách lỗi, tiêu chí nghiệm thu và trách nhiệm hiệu chỉnh sau thay thế vào yêu cầu báo giá.

## Đọc thêm tại DTPT

Tính vùng nhìn và chọn lens: https://dtpt.shop/tin-tuc/chon-ong-kinh-machine-vision-fov-tieu-cu-khoang-cach

Kiểm tra nhòe khi vật chuyển động: https://dtpt.shop/tin-tuc/camera-cong-nghiep-nhoe-tinh-thoi-gian-phoi-sang

## Nguồn đối chiếu

[1] KEYENCE, Selecting Based on Color or Monochrome Type Image Sensor. https://www.keyence.com/products/vision/resources/vision-resources/selecting-the-correct-industrial-machine-vision-camera.jsp

[2] Basler, Camera Selection, mục Monochrome or Color Camera. https://www.baslerweb.com/en/learning/camera-selection/

[3] Basler Product Documentation, Pixel Format / Mono Formats và Bayer Formats. https://docs.baslerweb.com/pixel-format

[4] Basler, Light in Machine Vision. https://www.baslerweb.com/en/learning/illumination/

[5] Basler Product Documentation, Balance White Auto. https://docs.baslerweb.com/balance-white-auto
