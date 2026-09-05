export const seedArticles = [
  {
    id: 'NEWS-001',
    slug: 'huong-dan-chon-may-tinh-cong-nghiep-khong-quat',
    title: 'Hướng dẫn chọn máy tính công nghiệp không quạt cho nhà máy',
    excerpt: 'Các tiêu chí quan trọng về hiệu năng, cổng kết nối, nguồn điện và môi trường khi lựa chọn fanless industrial PC.',
    content: `## Vì sao nên dùng máy tính công nghiệp không quạt?

Máy tính công nghiệp không quạt tản nhiệt bằng vỏ kim loại, hạn chế bụi đi vào bên trong và giảm thành phần chuyển động. Thiết kế này phù hợp với tủ điện, dây chuyền sản xuất và các vị trí cần vận hành liên tục.

## Những thông số cần xác định

- Nền tảng CPU và dung lượng bộ nhớ theo phần mềm sẽ chạy.
- Số lượng cổng LAN, COM, USB và các giao tiếp mở rộng.
- Điện áp đầu vào, khả năng chống đảo cực và dải nhiệt độ hoạt động.
- Phương án lắp DIN rail, treo tường hoặc lắp trong tủ điện.
- Yêu cầu TPM, watchdog và khả năng vận hành 24/7.

## Lựa chọn theo bài toán thực tế

Một cấu hình mạnh chưa chắc là lựa chọn tối ưu nếu thiếu đúng giao tiếp cần dùng. Trước khi chọn model, nên lập danh sách thiết bị ngoại vi, giao thức, điều kiện môi trường và vòng đời dự kiến của hệ thống.`,
    coverImage: '/products/seeed-j4012.webp',
    category: 'Kiến thức kỹ thuật',
    tags: ['Máy tính công nghiệp', 'Fanless PC', 'Nhà máy'],
    author: 'DTPT Techs',
    status: 'published',
    featured: true,
    publishedAt: '2026-09-06T02:00:00.000Z',
    updatedAt: '2026-09-06T02:00:00.000Z',
    seoTitle: 'Cách chọn máy tính công nghiệp không quạt | DTPT Techs',
    seoDescription: 'Hướng dẫn lựa chọn máy tính công nghiệp không quạt theo CPU, kết nối, nguồn điện, nhiệt độ và phương án lắp đặt trong nhà máy.',
  },
  {
    id: 'NEWS-002',
    slug: 'remote-io-adam-4000-va-adam-6000-khac-nhau-the-nao',
    title: 'Remote I/O ADAM-4000 và ADAM-6000 khác nhau thế nào?',
    excerpt: 'So sánh nhanh hai dòng Advantech ADAM phổ biến theo giao tiếp, kiến trúc mạng và tình huống triển khai.',
    content: `## Điểm khác biệt chính

ADAM-4000 chủ yếu sử dụng mạng nối tiếp RS-485, phù hợp với hệ thống phân tán có hạ tầng serial và khoảng cách truyền xa. ADAM-6000 kết nối Ethernet, thuận tiện khi cần tích hợp dữ liệu I/O vào mạng IP của nhà máy.

## Khi nào chọn ADAM-4000?

- Hệ thống hiện hữu dùng Modbus RTU.
- Điểm đo phân tán theo tuyến và không cần băng thông cao.
- Cần kiến trúc đơn giản, ổn định và dễ bảo trì.

## Khi nào chọn ADAM-6000?

- Hạ tầng nhà máy đã có Ethernet công nghiệp.
- Cần truy cập I/O từ nhiều hệ thống hoặc phần mềm giám sát.
- Bài toán cần phản hồi nhanh, cấu hình qua mạng và mở rộng linh hoạt.

Số lượng và loại kênh I/O vẫn là tiêu chí quyết định. Cần kiểm tra rõ đầu vào điện áp, dòng điện, thermocouple, relay hoặc transistor trước khi chốt model.`,
    coverImage: '/products/advantech-adam-6050.png',
    category: 'Tư vấn sản phẩm',
    tags: ['Advantech', 'ADAM', 'Remote I/O'],
    author: 'DTPT Techs',
    status: 'published',
    featured: true,
    publishedAt: '2026-09-05T02:00:00.000Z',
    updatedAt: '2026-09-05T02:00:00.000Z',
    seoTitle: 'So sánh Advantech ADAM-4000 và ADAM-6000',
    seoDescription: 'So sánh Remote I/O Advantech ADAM-4000 và ADAM-6000 theo giao tiếp RS-485, Ethernet và ứng dụng trong nhà máy.',
  },
  {
    id: 'NEWS-003',
    slug: 'nam-luu-y-khi-chon-camera-machine-vision',
    title: '5 lưu ý khi chọn camera Machine Vision cho kiểm tra sản phẩm',
    excerpt: 'Độ phân giải chỉ là một phần: cảm biến, tốc độ khung hình, giao tiếp, ống kính và nguồn sáng phải được tính đồng bộ.',
    content: `## 1. Kích thước chi tiết cần phát hiện

Độ phân giải phải đủ để khuyết tật cần kiểm tra chiếm số pixel phù hợp. Cần tính cùng trường nhìn và khoảng cách làm việc, không chọn chỉ theo số megapixel.

## 2. Tốc độ của dây chuyền

Tốc độ khung hình, thời gian phơi sáng và kiểu màn trập ảnh hưởng trực tiếp đến khả năng bắt vật chuyển động.

## 3. Giao tiếp camera

GigE phù hợp với khoảng cách cáp dài và triển khai linh hoạt; USB3 cho băng thông cao ở khoảng cách ngắn; các giao tiếp chuyên dụng phù hợp với hệ thống tốc độ rất cao.

## 4. Ống kính và nguồn sáng

Ống kính quyết định trường nhìn và độ méo. Nguồn sáng ổn định giúp làm nổi đặc điểm cần kiểm tra và thường ảnh hưởng đến kết quả nhiều không kém camera.

## 5. Phần mềm và khả năng tích hợp

Cần xác nhận SDK, hệ điều hành, chuẩn GenICam và khả năng kết nối với PLC hoặc phần mềm xử lý ảnh trước khi mua.`,
    coverImage: '/products/hikrobot-mv-cs050-10gm.webp',
    category: 'Kiến thức kỹ thuật',
    tags: ['Machine Vision', 'Camera công nghiệp', 'Kiểm tra ngoại quan'],
    author: 'DTPT Techs',
    status: 'published',
    featured: false,
    publishedAt: '2026-09-04T02:00:00.000Z',
    updatedAt: '2026-09-04T02:00:00.000Z',
    seoTitle: '5 lưu ý khi chọn camera Machine Vision',
    seoDescription: 'Cách chọn camera Machine Vision theo độ phân giải, tốc độ, giao tiếp, ống kính, nguồn sáng và khả năng tích hợp.',
  },
]
