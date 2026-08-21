import type { Product, QuoteRequest, StoreSettings } from '../types'

type SeedInput = [string, string, string, string, string, number, string, string]

const rows: SeedInput[] = [
  ['IPC-001', 'Partaker Fanless Industrial PC', 'I5-1240P-6COM', 'Partaker', 'Máy tính công nghiệp', 16800000, 'Box PC không quạt', 'Intel Core i5, 6 COM, 2 LAN cho tủ điều khiển và máy tự động.'],
  ['IPC-002', 'Partaker Mini Industrial PC', 'N100-4LAN', 'Partaker', 'Máy tính công nghiệp', 7800000, 'Box PC không quạt', 'Thiết kế compact, 4 LAN, vận hành 24/7 cho gateway và firewall công nghiệp.'],
  ['IPC-003', 'Advantech Industrial Computer', 'IPC-510', 'Advantech', 'Máy tính công nghiệp', 24500000, 'Rackmount IPC', 'Chassis công nghiệp phổ biến, dễ mở rộng card PCI/PCIe và bảo trì.'],
  ['IPC-004', 'TAICENN Industrial Panel PC 15.6”', 'TPC-DCM156', 'TAICENN', 'Máy tính công nghiệp', 21500000, 'Panel PC & HMI', 'Màn hình cảm ứng, mặt trước IP65, phù hợp HMI và MES tại xưởng.'],
  ['IPC-005', 'TAICENN Industrial Panel PC 12.1”', 'TPC-PCM121', 'TAICENN', 'Máy tính công nghiệp', 17600000, 'Panel PC & HMI', 'Panel PC không quạt, nguồn DC rộng và nhiều cổng giao tiếp công nghiệp.'],
  ['IPC-006', 'Edge AI Computer Jetson Orin NX', 'TBOX-ORNX', 'TAICENN', 'Máy tính công nghiệp', 32900000, 'Edge AI Computer', 'Nền tảng NVIDIA Jetson cho thị giác máy, robot và AI tại biên.'],
  ['VIS-001', 'Hikrobot GigE Area Scan Camera 5MP', 'MV-CS050-10GM', 'Hikrobot', 'Machine Vision', 12800000, 'Area Scan Camera', 'Camera công nghiệp 5 MP, GigE Vision cho kiểm tra ngoại quan tốc độ cao.'],
  ['VIS-002', 'Daheng Imaging GigE Camera', 'MER2-041-302GM', 'Daheng Imaging', 'Machine Vision', 15400000, 'Area Scan Camera', 'Cảm biến CMOS toàn cục, tốc độ cao, SDK đa nền tảng.'],
  ['VIS-003', 'Hikrobot 12MP Area Scan Camera', 'MV-CH120-10GM', 'Hikrobot', 'Machine Vision', 24700000, 'Area Scan Camera', 'Độ phân giải 12 MP cho đo kiểm chi tiết và nhận dạng chính xác.'],
  ['VIS-004', 'Hikrobot Smart Code Reader', 'ID5000', 'Hikrobot', 'Machine Vision', 26500000, 'Smart Camera', 'Đọc barcode và DPM tích hợp thuật toán, ánh sáng và giao tiếp I/O.'],
  ['VIS-005', 'Line Scan Camera 4K', 'MV-CL084-91GC', 'Hikrobot', 'Machine Vision', 38500000, 'Line Scan Camera', 'Camera line scan 4K cho vật liệu cuộn, in ấn và bề mặt liên tục.'],
  ['VIS-006', 'Telecentric Lens 1×', 'OPT-TC1-110', 'OPT', 'Machine Vision', 19500000, 'Ống kính công nghiệp', 'Ống kính telecentric giảm sai số phối cảnh trong ứng dụng đo kích thước.'],
  ['SEN-001', 'Laser Displacement Sensor', 'SDD-05D-RM', 'SIMAN', 'Cảm biến & đo lường', 9600000, 'Cảm biến dịch chuyển', 'Đo dịch chuyển không tiếp xúc, độ lặp lại cao cho kiểm tra inline.'],
  ['SEN-002', 'Laser Distance Sensor 50 m', 'TS-P-50', 'Tronsight', 'Cảm biến & đo lường', 11800000, 'Cảm biến dịch chuyển', 'Đo xa trong nhà máy, hỗ trợ RS485/Modbus và ngõ ra analog.'],
  ['SEN-003', 'Precision Load Cell 500 kg', 'CZL601-500KG', 'Zemic', 'Cảm biến & đo lường', 7200000, 'Load cell & lực', 'Load cell chính xác cho cân bồn, máy thử và hệ thống định lượng.'],
  ['SEN-004', 'Rotary Torque Sensor 100 Nm', 'TRS-100', 'Forsentek', 'Cảm biến & đo lường', 23800000, 'Mô-men xoắn', 'Đo mô-men động trên trục quay cho phòng thử nghiệm và kiểm tra motor.'],
  ['SEN-005', 'Smart Pressure Transmitter', 'SMP131', 'LEEG', 'Cảm biến & đo lường', 6800000, 'Áp suất & lưu lượng', 'Cảm biến áp suất công nghiệp, tùy chọn HART và nhiều dải đo.'],
  ['MON-001', 'Industrial Accelerometer', 'CS-YD-004', 'Sinocera', 'Giám sát tình trạng máy', 5900000, 'Cảm biến rung', 'Cảm biến gia tốc IEPE cho đo rung máy, cân bằng và chẩn đoán ổ bi.'],
  ['MON-002', 'Vibration Transmitter 4–20 mA', 'CA-YD-104T', 'Sinocera', 'Giám sát tình trạng máy', 8400000, 'Cảm biến rung', 'Bộ truyền rung công nghiệp kết nối trực tiếp PLC/DCS.'],
  ['MON-003', '4-Channel Vibration Analyzer', 'YE-8004', 'Sinocera', 'Giám sát tình trạng máy', 46500000, 'Máy phân tích rung', 'Thu thập đồng bộ 4 kênh cho phân tích modal và tình trạng máy.'],
  ['MON-004', 'HIKMICRO Thermal Camera', 'B20S', 'HIKMICRO', 'Giám sát tình trạng máy', 16900000, 'Camera nhiệt', 'Camera nhiệt cầm tay cho kiểm tra điện, cơ khí và bảo trì dự đoán.'],
  ['DAQ-001', '16-bit Multifunction USB DAQ', 'USB-3202', 'Smacq', 'DAQ & Remote I/O', 8900000, 'USB DAQ', 'DAQ đa chức năng 16-bit cho phòng thí nghiệm, kiểm thử và đào tạo.'],
  ['DAQ-002', 'High-speed USB DAQ', 'USB-5204', 'Smacq', 'DAQ & Remote I/O', 15800000, 'USB DAQ', 'Tốc độ lấy mẫu cao, analog I/O và digital I/O trong thiết kế gọn.'],
  ['DAQ-003', 'Ethernet DAQ 8AI', 'M2000-8AI', 'Smacq', 'DAQ & Remote I/O', 11200000, 'Ethernet DAQ', 'Module Ethernet đo analog phân tán, hỗ trợ Modbus TCP.'],
  ['DAQ-004', '8-Channel Thermocouple Module', 'TC-8CH', 'Smacq', 'DAQ & Remote I/O', 9800000, 'Module nhiệt độ', 'Đo đồng thời 8 kênh thermocouple với bù nhiệt độ đầu lạnh.'],
  ['IOT-001', 'Industrial IoT Gateway', 'USR-M300', 'PUSR', 'Industrial IoT & mạng', 7200000, 'IoT Gateway', 'Gateway Linux công nghiệp, kết nối serial, Ethernet, 4G và cloud.'],
  ['IOT-002', 'Industrial 4G Router', 'USR-G806W', 'PUSR', 'Industrial IoT & mạng', 8400000, 'Industrial Router', 'Router 4G hai SIM cho giám sát từ xa và mạng dự phòng tại nhà máy.'],
  ['IOT-003', '8-Port Managed Industrial Switch', 'IES618-2F', '3onedata', 'Industrial IoT & mạng', 11900000, 'Industrial Ethernet Switch', 'Switch managed DIN-rail, ring redundancy và 2 cổng quang.'],
  ['TST-001', 'Digital Oscilloscope 100 MHz', 'DHO804', 'RIGOL', 'Thiết bị đo điện tử', 14200000, 'Oscilloscope', 'Máy hiện sóng 12-bit, 4 kênh cho R&D, đào tạo và sửa chữa.'],
  ['TST-002', 'HD Oscilloscope 200 MHz', 'SDS1204X-HD', 'SIGLENT', 'Thiết bị đo điện tử', 36900000, 'Oscilloscope', 'Độ phân giải 12-bit, 4 kênh, phù hợp kiểm thử nguồn và tín hiệu hỗn hợp.'],
  ['TST-003', 'Real-time Spectrum Analyzer', 'RSA3030N', 'RIGOL', 'Thiết bị đo điện tử', 86500000, 'Spectrum Analyzer', 'Phân tích phổ thời gian thực 3 GHz cho RF, EMC sơ bộ và nghiên cứu.'],
  ['TST-004', 'Programmable DC Power Supply', 'IT-M3100', 'ITECH', 'Thiết bị đo điện tử', 26500000, 'Nguồn DC', 'Nguồn DC lập trình mật độ công suất cao, hỗ trợ tự động hóa kiểm thử.'],
  ['AUT-001', 'Compact PLC', 'H3U-3232MT', 'Inovance', 'Tự động hóa & điều khiển', 8400000, 'PLC', 'PLC hiệu năng cao, tích hợp Ethernet và điều khiển vị trí.'],
  ['AUT-002', 'Industrial HMI 10.1”', 'IT7100E', 'Inovance', 'Tự động hóa & điều khiển', 9600000, 'HMI', 'Màn hình HMI cảm ứng 10.1 inch cho máy và dây chuyền tự động.'],
  ['AUT-003', 'AC Servo System 750 W', 'SV660N-0R7', 'Inovance', 'Tự động hóa & điều khiển', 13800000, 'Servo', 'Bộ servo công nghiệp đáp ứng nhanh, EtherCAT, độ chính xác cao.'],
  ['AUT-004', 'Vector Frequency Inverter 7.5 kW', 'MD500-7R5G', 'Inovance', 'Tự động hóa & điều khiển', 12700000, 'Biến tần', 'Biến tần vector cho motor công nghiệp, nhiều chế độ điều khiển.'],
]

const colors = ['#0b6bcb', '#00a78e', '#f27a24', '#6957c8', '#167d9a', '#bf4f68', '#46704d', '#3f5ea8']

export const seedProducts: Product[] = rows.map((row, index) => ({
  id: row[0], slug: `${row[2]}-${row[0]}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: row[1], model: row[2], brand: row[3], category: row[4], price: row[5], subcategory: row[6], summary: row[7],
  origin: ['Partaker', 'TAICENN', 'Hikrobot', 'Daheng Imaging', 'OPT', 'SIMAN', 'Tronsight', 'Sinocera', 'Smacq', 'PUSR', '3onedata', 'Inovance'].includes(row[3]) ? 'Trung Quốc' : row[3] === 'Advantech' ? 'Đài Loan' : row[3] === 'Zemic' ? 'Hà Lan' : row[3] === 'RIGOL' || row[3] === 'SIGLENT' || row[3] === 'ITECH' || row[3] === 'HIKMICRO' ? 'Trung Quốc' : 'Quốc tế',
  priceMode: 'from', leadTime: 'Liên hệ để xác nhận', warranty: '12 tháng', status: 'active', badge: index < 8 ? 'Nổi bật' : undefined, featured: index < 8, accent: colors[index % colors.length],
  highlights: [row[7], `Model ${row[2]}`, 'Hỗ trợ tư vấn lựa chọn và tích hợp'], applications: ['Nhà máy sản xuất', 'Phòng R&D', 'Hệ thống tự động hóa'],
  specifications: [{ label: 'Model', value: row[2] }, { label: 'Thương hiệu', value: row[3] }, { label: 'Xuất xứ thương hiệu', value: ['Advantech', 'Zemic'].includes(row[3]) ? 'Quốc tế' : 'Trung Quốc' }, { label: 'Bảo hành', value: '12 tháng' }],
}))

export const seedQuotes: QuoteRequest[] = []

export const seedSettings: StoreSettings = {
  storeName: 'DTPT Techs', slogan: 'Công nghệ tiên tiến. Giá trị bền vững.', logoStyle: 'wide', logoRoundSrc: '/dp-lab-logo.png', logoWideSrc: '/dtpt-techs-logo.png', phone: '0906 094 313', address: 'Tầng 5, V11-B09, KĐT mới An Hưng, P. La Khê, Hà Đông, Hà Nội', email: 'hello@dtpt.tech', facebook: 'facebook.com/dtpt.techs',
  content: {
    announcementPrimary: 'Giải pháp thiết bị công nghiệp và đo lường chuyên sâu', announcementSecondary: 'Tư vấn kỹ thuật cho doanh nghiệp, nhà máy và viện nghiên cứu', navProducts: 'Sản phẩm', navSolutions: 'Lĩnh vực', navWhy: 'Về DTPT Techs', navContact: 'Liên hệ',
    heroBadge: 'INDUSTRIAL TECHNOLOGY · MEASUREMENT · AUTOMATION', heroTitle: 'Thiết bị công nghiệp', heroHighlight: 'cho những hệ thống đòi hỏi cao.', heroDescription: 'DTPT Techs cung cấp thiết bị công nghệ cao, giải pháp đo lường và tự động hóa được lựa chọn kỹ lưỡng cho doanh nghiệp, nhà máy và viện nghiên cứu.', heroPrimaryAction: 'Khám phá sản phẩm', heroSecondaryAction: 'Trao đổi với kỹ sư',
    trustQuality: 'Sản phẩm chính hãng', trustPrice: 'Chi phí cạnh tranh', trustSupport: 'Hỗ trợ kỹ thuật',
    service1Title: 'Danh mục chuyên sâu', service1Description: 'Thiết bị cho nhiều bài toán công nghiệp', service2Title: 'Thương hiệu tin cậy', service2Description: 'Nguồn cung được lựa chọn và kiểm soát', service3Title: 'Giải pháp phù hợp', service3Description: 'Tư vấn theo yêu cầu kỹ thuật thực tế', service4Title: 'Đồng hành dài hạn', service4Description: 'Hỗ trợ trước và sau bán hàng',
    productsEyebrow: 'SẢN PHẨM NỔI BẬT', productsTitle: 'Công nghệ cho nhà máy và phòng nghiên cứu', productsDescription: 'Từ máy tính công nghiệp, machine vision đến cảm biến, DAQ và thiết bị đo điện tử.',
    whyEyebrow: 'NĂNG LỰC DTPT TECHS', whyTitle: 'Một đối tác kỹ thuật đáng tin cậy.', whyDescription: 'Chúng tôi kết hợp hiểu biết kỹ thuật, mạng lưới nguồn cung và quy trình làm việc minh bạch để mang lại giá trị lâu dài.', why1Title: 'Lựa chọn có cơ sở', why1Description: 'Sản phẩm được đánh giá theo thông số, độ ổn định và khả năng tích hợp.', why2Title: 'Giá trị đầu tư tốt', why2Description: 'Giải pháp cân bằng hiệu năng, chất lượng và tổng chi phí sở hữu.', why3Title: 'Tư vấn kỹ thuật', why3Description: 'Trao đổi trực tiếp để làm rõ giao thức, môi trường và yêu cầu vận hành.', why4Title: 'Uy tín trong từng cam kết', why4Description: 'Thông tin rõ ràng, phản hồi trách nhiệm và đồng hành sau bán hàng.',
    contactEyebrow: 'TRAO ĐỔI NHU CẦU', contactTitle: 'Đang tìm một thiết bị chuyên dụng?', contactSubtitle: 'Gửi yêu cầu kỹ thuật để đội ngũ DTPT Techs đề xuất phương án phù hợp.', footerDescription: 'Thiết bị công nghiệp, đo lường và tự động hóa cho những hệ thống đòi hỏi cao.',
  },
}
