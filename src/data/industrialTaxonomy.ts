import type { IndustrialCategory } from '../types'

export const industrialCategories: IndustrialCategory[] = [
  { id: 'industrial-pc', name: 'Máy tính công nghiệp', shortName: 'Industrial PC', description: 'Nền tảng tính toán bền bỉ cho tủ điện, dây chuyền và môi trường khắc nghiệt.', subcategories: ['Box PC không quạt', 'Panel PC & HMI', 'Rackmount IPC', 'Edge AI Computer', 'Màn hình công nghiệp'], visible: true, sortOrder: 1 },
  { id: 'machine-vision', name: 'Machine Vision', shortName: 'Machine Vision', description: 'Camera, ống kính và chiếu sáng phục vụ kiểm tra, đo lường và truy xuất.', subcategories: ['Area Scan Camera', 'Line Scan Camera', 'Smart Camera', 'Ống kính công nghiệp', 'Nguồn sáng machine vision'], visible: true, sortOrder: 2 },
  { id: 'sensors', name: 'Cảm biến & đo lường', shortName: 'Sensors', description: 'Cảm biến chính xác cho lực, áp suất, khoảng cách, lưu lượng và vị trí.', subcategories: ['Cảm biến dịch chuyển', 'Load cell & lực', 'Áp suất & lưu lượng', 'Mô-men xoắn', 'Nhiệt độ & độ ẩm'], visible: true, sortOrder: 3 },
  { id: 'condition-monitoring', name: 'Giám sát tình trạng máy', shortName: 'Condition Monitoring', description: 'Thiết bị đo rung, nhiệt và chẩn đoán sớm tình trạng máy móc.', subcategories: ['Cảm biến rung', 'Máy phân tích rung', 'Camera nhiệt', 'Thu thập rung đa kênh'], visible: true, sortOrder: 4 },
  { id: 'daq-remote-io', name: 'DAQ & Remote I/O', shortName: 'Data Acquisition', description: 'Thu thập, đồng bộ và truyền dữ liệu đo lường tại hiện trường.', subcategories: ['USB DAQ', 'Ethernet DAQ', 'Remote I/O', 'Module nhiệt độ'], visible: true, sortOrder: 5 },
  { id: 'industrial-iot', name: 'Industrial IoT & mạng', shortName: 'Industrial IoT', description: 'Gateway, bộ chuyển đổi và hạ tầng mạng tin cậy cho nhà máy kết nối.', subcategories: ['IoT Gateway', 'Serial Device Server', 'Industrial Router', 'Industrial Ethernet Switch'], visible: true, sortOrder: 6 },
  { id: 'test-measurement', name: 'Thiết bị đo điện tử', shortName: 'Test & Measurement', description: 'Máy hiện sóng, phân tích phổ và nguồn đo cho R&D, kiểm thử.', subcategories: ['Oscilloscope', 'Spectrum Analyzer', 'Nguồn DC', 'Tải điện tử'], visible: true, sortOrder: 7 },
  { id: 'automation', name: 'Tự động hóa & điều khiển', shortName: 'Automation', description: 'PLC, HMI, servo và biến tần cho giải pháp điều khiển hoàn chỉnh.', subcategories: ['PLC', 'HMI', 'Servo', 'Biến tần'], visible: true, sortOrder: 8 },
]

export const categoryNames = industrialCategories.map(category => category.name)
