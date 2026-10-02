# Bộ quảng cáo DTPT Techs

Chuẩn bị ngày 02/10/2026 cho Google Search, toàn Việt Nam, tiếng Việt, ngân sách 30.000 VND/ngày. Mục tiêu: tư vấn và yêu cầu báo giá. Đây là bộ tài liệu xem thử trên máy, chưa tạo hoặc bật quảng cáo.

Mở `preview.html` để xem banner, mô phỏng Search và toàn bộ tiêu đề/mô tả. Các tài nguyên nằm trong cùng thư mục; không cần chạy server hoặc cài thêm dependency để xem.

## Tài liệu

- `dtpt-ads-review.pdf`: bản xem thử 3 trang, gồm hai banner, hai mẫu Search và toàn bộ tiêu đề/mô tả; đã render và kiểm tra trực quan.
- `campaign.json`: nguồn nội dung chuẩn, 2 nhóm quảng cáo, 30 tiêu đề, 8 mô tả, 4 sitelink, callout, liên hệ, từ khóa gợi ý và việc còn cần xác nhận.
- `ad-copy.csv`: tiêu đề/mô tả kèm số ký tự, mở bằng Excel. Đây là bảng duyệt nội dung, không phải file import Google Ads Editor.
- `extensions.csv`: sitelink, callout và structured snippet.
- `keyword-seeds.csv`: từ khóa đề xuất, chưa có số liệu Keyword Planner. Không suy ra CPC, cạnh tranh hoặc lượng tìm kiếm.
- `copy.txt`: bản văn bản thuận tiện cho duyệt nội dung.
- `image-manifest.json`: kích thước, dung lượng, nguồn, phân loại và trạng thái từng ảnh.
- `image-prompts.json`: prompt đã dùng qua công cụ imagegen tích hợp, đầu vào là ảnh gốc trong catalogue.
- `images/`: ảnh catalogue gốc, logo, 3 ảnh sản phẩm dựng và 2 banner dựng.
- `dtpt-ads-kit.zip`: gói tài liệu để mang sang công cụ quảng cáo; được tạo tại máy và không đưa vào Git để tránh lặp dữ liệu nhị phân.

## Cách sử dụng ảnh

Ảnh gốc ADAM-6050 410 x 410 đáp ứng kích thước tối thiểu ảnh vuông Search. Ảnh gốc RIGOL 1024 x 768 là tham chiếu sản phẩm; cần cắt trong trình chọn ảnh Google Ads để đạt tỷ lệ vuông hoặc ngang. Logo DTPT là tài nguyên thương hiệu riêng.

Các ảnh sản phẩm và banner có nhãn `AI_CONCEPT` được dựng bằng imagegen. Chúng có thể thay đổi chữ nhỏ, màn hình hoặc chi tiết phần cứng so với ảnh catalogue; không coi chúng là bằng chứng thông số và không tự động đưa vào chiến dịch. Dùng ảnh gốc hoặc ảnh chụp thực tế đã được duyệt khi xuất bản. Nguồn catalogue có trong manifest; quyền tái sử dụng cho quảng cáo thương mại chưa được xác minh.

Banner có chữ/logo là mẫu sáng tạo cho Display hoặc kênh khác, không dùng làm image asset của Search. [Google yêu cầu ảnh Search không có chữ, logo hoặc đồ họa chèn thêm](https://support.google.com/adspolicy/answer/10347108?hl=en). Ảnh sạch chỉ giữ nhãn hãng vốn nằm trên sản phẩm. Kích thước đề xuất là 1200 x 1200 và 1200 x 628; ảnh ở kích thước khác được ghi đúng trong manifest, không ghi nhãn sai là 1200 px. [Thông số ảnh](https://support.google.com/google-ads/answer/9566341?hl=en).

## Trước Khi Tạo

Hạn mức Adspirer đã hết trong phiên chuẩn bị. Các bước Keyword Planner, đo lường chuyển đổi, đấu thầu và tạo chiến dịch chưa chạy. Chiến dịch mới phải tạo ở trạng thái PAUSED; bật quảng cáo cần người dùng xác nhận.

30.000 VND là ngân sách trung bình ngày của chiến dịch mới. Chiến dịch hiện có vẫn có ngân sách 25.000 VND/ngày. Con số 912.000 VND trong bản xem thử là tham chiếu 30.000 x 30,4, không phải số chi tiêu hoặc cam kết doanh thu. Các mẫu Search là cách ghép thử, không bảo đảm Google hiển thị mọi tài sản cùng lúc.

Giới hạn được kiểm tra: 15 tiêu đề/nhóm, tối đa 30 ký tự; 4 mô tả/nhóm, tối đa 80 ký tự theo schema Adspirer đã trả về (Google RSA cho phép 90); sitelink 25, mô tả sitelink 35, callout 25, đường dẫn hiển thị 15 ký tự. [Thông số RSA](https://support.google.com/google-ads/answer/7684791?hl=en).

## Cập Nhật

Sửa `campaign.json`, sau đó từ thư mục repository chạy:

```text
node artifacts/google-ads/dtpt-2026-10-02/build-kit.mjs
```

Script dùng React và lucide-react đã có trong repository để xuất icon, không gọi nền tảng quảng cáo hoặc API tạo ảnh. Các ảnh nhị phân được giữ nguyên; script chỉ sinh HTML, CSV và TXT, đồng thời kiểm tra nội dung.

`build-review.py` xuất PDF từ cùng nguồn nội dung, dùng ReportLab và font Arial trong thư mục Fonts của Windows. Có thể cấu hình `DTPT_AD_FONT_DIR` khi cần. Các ảnh gốc và ảnh dựng được đặt vào tài liệu, không chỉnh sửa pixel ảnh.

## Kiểm Tra

Đã kiểm tra cú pháp JavaScript, số lượng và giới hạn ký tự, cấu trúc JSON, tỷ lệ/dung lượng ảnh, bản CSV, PDF và nội dung gói ZIP. Trình duyệt tích hợp chặn URL `file:`, nên tương tác và bố cục HTML trên desktop/mobile chưa được xác minh bằng trình duyệt. Bản PDF là bản duyệt trực quan đã kiểm tra; HTML vẫn được cung cấp để người dùng mở bằng trình duyệt của mình.
