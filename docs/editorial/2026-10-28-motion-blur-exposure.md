# Camera 300 fps vẫn nhòe: cần phơi sáng bao lâu?

- Ngày biên tập: 28/10/2026, lượt 10:00 giờ Việt Nam.
- Trạng thái: đã xuất bản qua API sau khi rà nháp desktop/mobile.
- Ngày xuất bản: `2026-10-28T03:07:06.108Z`.
- URL: https://dtpt.shop/tin-tuc/camera-cong-nghiep-nhoe-tinh-thoi-gian-phoi-sang
- CMS ID: `NEWS-1793156640175`.
- Slug: `camera-cong-nghiep-nhoe-tinh-thoi-gian-phoi-sang`.
- Chuyên mục: Kiến thức kỹ thuật
- Tác giả: DTPT Techs
- Tag: Machine vision, Phơi sáng, Chiếu sáng công nghiệp
- SEO title: Camera công nghiệp bị nhòe: tính phơi sáng theo tốc độ
- SEO description: Tính thời gian phơi sáng camera từ tốc độ vật và vùng nhìn; phân biệt fps, global shutter, ánh sáng và trigger, kèm quy trình kiểm tra nhòe trên bàn thử.
- Mô tả ngắn: Tăng fps chưa chắc làm rõ vết xước trên sản phẩm đang chạy. Tính nhòe theo pixel, kiểm tra ánh sáng và đồng bộ trước khi chọn camera hoặc đổi cấu hình.
- Cover media: `/products/daheng-mer2-041-302gm.webp`.
- Inline media: `/api/article-media/432d0d53-200b-4918-bcd2-85508c9f55c3`.
- Ảnh cover: ảnh camera area-scan mang nhãn VA Imaging, đã xem trực tiếp; tái sử dụng catalogue DTPT. Nguồn trong `src/data/verifiedProducts.ts`: https://va-imaging.com/en-us/products/gige-vision-camera-4mp-monochrome-sony-imx287-mer2-041-302gm-va . Chỉ minh họa dạng thiết bị; không gọi ảnh là Daheng MER2-041-302GM-P, không suy ra tốc độ/cấu hình/model từ ảnh và không cấp phép lại cho quảng cáo.
- Hình nội dung: hình tính toán gốc do DTPT Techs biên tập bằng SVG, duy trì tại `docs/editorial/assets/2026-10-28-motion-blur-budget.svg`. Mô hình hình học giả định v = 1.000 mm/s, W = 100 mm, N = 1.000 pixel; 1 ms dịch chuyển 1 mm = 10 pixel, 0,1 ms dịch chuyển 0,1 mm = 1 pixel. Không phải ảnh chụp mẫu, ảnh mô phỏng cảm biến, benchmark hoặc thử thiết bị.
- Phạm vi: camera area-scan cố định, vật chuyển động gần đều song song mặt phẳng ảnh, lấy tỉ lệ pixel/mm theo hướng chuyển động. Bài khác hướng dẫn chọn ống kính 07/10 (FOV/WD/ngàm/độ sâu trường ảnh) và GigE/USB3 25/09 (truyền dữ liệu). Không quy một pixel nhòe thành bảo đảm phát hiện lỗi. Không gán ví dụ 1.000 pixel/300 fps cho model trong ảnh hoặc catalogue.
- Nguồn sơ cấp kiểm tra 28/10: Basler Optimizing Image Quality về phơi sáng/nhòe/gain, Basler Electronic Shutter Types và Baumer về phơi đồng thời/lệch hàng, CCS FAQ về PWM không đồng bộ, Advanced Illumination về pulse width/duty cycle/giới hạn đèn-controller. Không lấy ngưỡng PWM hoặc duty cycle của một sản phẩm làm giới hạn chung, không hướng dẫn tự tăng dòng LED.
- Quyết định biên tập: chủ đề thực hành có nguồn rõ, chưa có bài trùng; nguồn là tài liệu kỹ thuật, không gắn thành tin ra mắt mới. Các bước thử chỉ trên bàn thử hoặc vùng thử đã phê duyệt, không thay cấu hình dây chuyền đang chạy, lưu bản phục hồi và giữ cơ chế bảo vệ.
- Kiểm tra: 979 từ không tính chú thích inline; SEO title 54 ký tự, description 153 ký tự. Ba test renderer đạt; nháp CMS và public desktop/mobile 390 px đã rà screenshot/DOM, công thức đủ đơn vị, hình/alt/chú thích/năm nguồn đúng, không tràn ngang hoặc lộ Markdown. API public có đúng một bản ghi, nội dung khớp bản duyệt; giữ nguyên 21 bài khác bằng hash đối chiếu. URL bài/catalogue/hai ảnh HTTP 200, sitemap có đúng một URL, canonical hiện hành `https://dtpt.shop`. Cover catalogue là JPEG 1.000 × 800 dù tên tệp có đuôi `.webp`; trình duyệt tải được, giữ tài nguyên cũ. Hình mới WebP 720 × 740 lưu PostgreSQL. Metadata server sau cache đúng SEO title/description/Open Graph/ảnh, robots cho lập chỉ mục; Article schema đúng headline/ảnh/ngày/URL.
- Bằng chứng: `motion-blur-published.jpg`, `motion-blur-mobile.jpg`, `motion-blur-mobile-diagram.jpg` trong thư mục proof ngày 28/10 ngoài Git. PNG trung gian/hash tại `work/editorial-20261028/` giữ ngoài commit; không lưu credential. Không sửa source ứng dụng/seed/catalogue hoặc reset DB; kiểm tra renderer/API/giao diện chạy thật thay full build không liên quan.

## Nội dung CMS

Camera ghi được nhiều khung hình chưa chắc nhìn rõ vết xước trên vật đang chạy. Fps cho biết số ảnh mỗi giây; thời gian phơi sáng quyết định vật dịch chuyển bao xa trong lúc thu một ảnh. Cần tính cả hai trước khi mua camera tốc độ cao.

Bài áp dụng cho camera area-scan cố định, vật chuyển động gần đều song song mặt phẳng ảnh. Các con số dưới đây là giả định hình học, không phải kết quả thử thiết bị.

Ảnh đại diện: camera area-scan, nguồn VA Imaging, catalogue DTPT; ảnh minh họa dạng thiết bị, không xác nhận cấu hình 300 fps.

## 1. Phân biệt nhòe, mất nét và méo hình

Chụp cùng mẫu khi đứng yên và khi di chuyển trên bộ thử. Nếu ảnh tĩnh đã mờ, kiểm tra lấy nét, rung, độ sâu trường ảnh và tương phản trước. Nếu ảnh tĩnh rõ nhưng ảnh động kéo vệt theo hướng chạy, nhòe chuyển động là giả thuyết cần kiểm tra.

Global shutter cho các pixel phơi đồng thời; rolling shutter phơi các hàng lệch thời điểm, có thể làm vật chuyển động bị méo [1]. Global shutter giảm dạng méo này nhưng vẫn có thể nhòe nếu phơi sáng quá lâu. Không kết luận loại cảm biến chỉ từ một ảnh lỗi.

## 2. Đổi tốc độ vật thành pixel mỗi giây

Gọi W là chiều dài vùng nhìn (mm) theo hướng chuyển động, N là số pixel tương ứng, v là tốc độ vật (mm/s), t là thời gian phơi (s). Khi tỉ lệ ảnh gần như không đổi:

- Mật độ lấy mẫu S = N / W, đơn vị pixel/mm.
- Độ dịch chuyển trong lúc phơi B ≈ v × t × S, đơn vị pixel.
- Với mức dịch chuyển cho phép b, thời gian t ≤ b / (v × S).

Ví dụ giả định: W = 100 mm, N = 1.000 pixel, v = 1.000 mm/s. Khi đó S = 10 pixel/mm. Muốn dịch chuyển không quá một pixel, t ≤ 0,0001 s, tức 0,1 ms hay 100 µs. Phơi 1 ms cho mức dịch chuyển khoảng 10 pixel.

![Ví dụ giả định cùng tốc độ 1000 mm mỗi giây và mật độ 10 pixel mỗi mm; phơi 1 ms dịch chuyển 10 pixel, phơi 0,1 ms dịch chuyển 1 pixel](</api/article-media/432d0d53-200b-4918-bcd2-85508c9f55c3> "Hình tính toán do DTPT Techs biên tập, không phải ảnh chụp hoặc kết quả đo. Chỉ tính dịch chuyển trong thời gian phơi; độ nét còn phụ thuộc quang học, rung và tương phản.")

Basler gợi ý giới hạn chuyển động khoảng một pixel khi chọn phơi sáng [2]. Đây là điểm khởi đầu, không phải chuẩn nghiệm thu mọi khuyết tật. Chi tiết nhỏ, tương phản thấp có thể cần điều kiện chặt hơn. Khi đổi FOV hoặc số pixel, phải tính lại.

## 3. Fps giải quyết một câu hỏi khác

Ở 300 fps, khoảng cách thời gian giữa hai khung là khoảng 3,33 ms. Trong ví dụ trên, phơi 1 ms vẫn tạo dịch chuyển 10 pixel dù hệ thống thu đủ 300 ảnh/giây. Tăng fps đơn thuần không bảo đảm thời gian phơi đang đặt sẽ ngắn đi.

Fps cần đủ để thu đúng số ảnh cho mỗi sản phẩm; phơi sáng cần đủ ngắn để từng ảnh dùng được. Sau khi chọn thời gian phơi, kiểm tra tốc độ thực tế với đúng độ phân giải, pixel format, trigger và đường truyền. Đừng lấy tốc độ tối đa của một cấu hình khác làm kết quả cam kết.

## 4. Rút ngắn phơi sáng cần đủ ánh sáng

Ảnh tối sau khi giảm phơi không có nghĩa nên tăng gain ngay. Basler lưu ý gain khuếch đại cả tín hiệu và nhiễu [2]. Hãy kiểm tra góc chiếu, độ đồng đều, vùng phản xạ cháy sáng và khả năng đèn đáp ứng trước.

Đèn xung cần đồng bộ với khoảng phơi phù hợp. Với rolling shutter, phải kiểm tra cửa sổ flash theo model; không coi xung ngắn bất kỳ sẽ chiếu đúng toàn ảnh [3]. CCS cũng nêu PWM không đồng bộ với camera có thể làm độ sáng thay đổi giữa ảnh [4].

Nếu dùng strobe, đối chiếu độ rộng xung, tần số, dòng và giới hạn nhiệt của cả đèn lẫn controller [5]. Không tự tăng dòng hoặc bỏ bảo vệ để bù thiếu sáng; không nhìn trực tiếp nguồn sáng cường độ cao.

## 5. Ảnh rõ vẫn có thể chụp sai vị trí

Trigger đến sai thời điểm có thể tạo ảnh rõ nhưng sản phẩm nằm lệch vùng kiểm tra. Tách độ nhòe trong một ảnh khỏi biến thiên vị trí giữa các ảnh. Kiểm tra cảm biến phát hiện vật, độ trễ, jitter và thời điểm đèn phát sáng cùng cấu hình camera.

Trước báo giá, gửi tốc độ lớn nhất, FOV, chi tiết nhỏ nhất, số ảnh mỗi sản phẩm, tín hiệu trigger và mẫu bề mặt. Chốt cả đèn, ống kính, giá đỡ và phép thử, thay vì chỉ hỏi camera bao nhiêu fps.

## 6. Kiểm tra có thể lặp lại

Chỉ thao tác trên bàn thử hoặc vùng thử đã phê duyệt, giữ bảo vệ thiết bị. Lưu cấu hình ban đầu để hoàn tác. Khi so sánh trên bàn thử, cố định phơi sáng/gain thay vì để chế độ tự động làm thay đổi phép thử.

- Lưu ảnh mẫu tĩnh làm mốc; thử cùng mẫu ở tốc độ lớn nhất dự kiến.
- Thay từng thông số, ghi phơi sáng, gain, đèn và tốc độ; lưu ảnh gốc.
- Thử mẫu đạt và lỗi nhỏ nhất tại các vị trí, độ cao cho phép; ghi bỏ sót và loại nhầm.
- Kiểm tra độ sáng, vị trí chụp và mất khung khi chạy lặp; nếu kém hơn, nạp cấu hình đã lưu rồi kiểm tra lại.

Tham khảo camera và gửi yêu cầu cấu hình: https://dtpt.shop/san-pham/daheng-mer2-041-302gm-p

## Nguồn đối chiếu

- [1] Baumer, global/rolling shutter: https://www.baumer.com/us/en/service-support/technical-information-industrial-cameras/rolling-shutter-global-shutter-two-principles-of-exposure-/a/rolling-shutter-global-shutter
- [2] Basler, chất lượng ảnh: https://docs.baslerweb.com/optimizing-image-quality
- [3] Basler, loại shutter và flash: https://docs.baslerweb.com/electronic-shutter-types
- [4] CCS, điều khiển đèn và PWM: https://www.ccs-grp.com/support/faq/products/power/
- [5] Advanced Illumination, chiếu sáng machine vision: https://advancedillumination.com/a-practical-guide-to-machine-vision-lighting/
