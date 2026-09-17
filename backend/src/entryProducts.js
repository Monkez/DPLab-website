const featuredModels = ['ADAM-6050', 'USR-G806', 'DHO804', 'DVP14SS211R', 'B20S', 'HDR-60-24', 'MV-CS050', 'J4012'];

export function curateSeedProducts(products) {
  return products.map(product => {
    const index = featuredModels.findIndex(model => product.model.includes(model));
    return { ...product, featured: index >= 0, sortOrder: index >= 0 ? index + 1 : product.sortOrder };
  });
}

export const entryProducts = [{
  id: 'AUT-112', slug: 'mean-well-hdr-60-24', name: 'Nguồn DIN rail MEAN WELL HDR-60-24',
  model: 'HDR-60-24', brand: 'MEAN WELL', origin: 'Xác nhận theo lô hàng',
  category: 'Tự động hóa & điều khiển', subcategory: 'Nguồn DIN rail',
  priceMode: 'contact', status: 'active', featured: true, sortOrder: 6, accent: '#167d6b',
  leadTime: 'Liên hệ xác nhận tình trạng hàng và lịch giao', warranty: 'Xác nhận trong báo giá',
  priceNote: 'Báo giá theo số lượng; xác nhận VAT, thời gian giao và bảo hành trước khi đặt hàng.',
  summary: 'Nguồn 24 VDC, 2,5 A, công suất 60 W lắp DIN rail cho tủ điều khiển, PLC và module I/O. Cần kiểm tra tổng tải trước khi chọn nguồn.',
  highlights: ['Đầu ra 24 VDC · 2,5 A · 60 W', 'Đầu vào 85–264 VAC', 'Lắp DIN rail, kích thước 52,5 × 90 × 54,5 mm'],
  applications: ['Cấp nguồn PLC và HMI', 'Tủ điều khiển', 'Remote I/O 24 VDC'],
  specifications: [{ label: 'Điện áp đầu ra', value: '24 VDC' }, { label: 'Dòng định mức', value: '2,5 A' }, { label: 'Công suất định mức', value: '60 W' }, { label: 'Đầu vào AC', value: '85–264 VAC' }, { label: 'Kích thước', value: '52,5 × 90 × 54,5 mm' }],
  tags: ['nguồn 24V', 'nguồn DIN rail', 'nguồn PLC'],
  manufacturerUrl: 'https://www.meanwell.com/Upload/PDF/HDR-60/HDR-60-SPEC.PDF',
  datasheetUrl: 'https://www.meanwell.com/Upload/PDF/HDR-60/HDR-60-SPEC.PDF',
  images: [],
}];
