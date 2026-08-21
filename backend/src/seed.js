const updated = "21/08/2026";
const note =
  "Giá bán đã gồm VAT, áp dụng cho cấu hình tiêu chuẩn; báo giá chính thức sẽ xác nhận lại tình trạng hàng, phụ kiện và thời gian giao.";
const p = (data) => ({
  priceMode: "fixed",
  leadTime: "Khoảng 2–4 tuần, xác nhận theo đơn hàng",
  warranty: "12 tháng",
  status: "active",
  accent: "#086ad8",
  priceUpdatedAt: updated,
  priceNote: note,
  applications: ["Nhà máy sản xuất", "Phòng R&D", "Hệ thống tự động hóa"],
  ...data,
});
const s = (model, brand, rows) => [
  { label: "Model", value: model },
  { label: "Thương hiệu", value: brand },
  ...rows,
];

export const seedProducts = [
  p({
    id: "IPC-101",
    slug: "seeed-recomputer-industrial-j4012",
    name: "Máy tính AI công nghiệp reComputer Industrial J4012",
    model: "110110191 / J4012",
    brand: "Seeed Studio",
    origin: "Trung Quốc",
    category: "Máy tính công nghiệp",
    subcategory: "Edge AI Computer",
    price: 71500000,
    featured: true,
    badge: "Jetson Orin NX",
    summary:
      "Máy tính AI không quạt dùng NVIDIA Jetson Orin NX 16 GB, SSD NVMe 128 GB, thiết kế DIN-rail cho machine vision và robot.",
    highlights: [
      "Jetson Orin NX 16 GB, hiệu năng AI tới 100 TOPS",
      "SSD NVMe 128 GB; 2 Gigabit Ethernet; CAN và USB 3.2",
      "Nguồn 12–24 VDC, vận hành -20 đến 60 °C",
    ],
    specifications: s("J4012", "Seeed Studio", [
      { label: "Bộ xử lý", value: "NVIDIA Jetson Orin NX 16 GB" },
      { label: "Nguồn", value: "12–24 VDC" },
    ]),
    images: [
      "/products/seeed-j4012.webp",
    ],
    manufacturerUrl:
      "https://www.seeedstudio.com/reComputer-Industrial-J4012-p-5684.html",
    priceSourceLabel: "DigiKey",
    priceSourceUrl:
      "https://www.digikey.com/en/products/detail/seeed-technology-co-ltd/110110191/20372502",
    priceSourceValue: "1.933,75 USD",
  }),
  p({
    id: "VIS-101",
    slug: "hikrobot-mv-cs050-10gm",
    name: "Camera công nghiệp GigE 5 MP Hikrobot",
    model: "MV-CS050-10GM",
    brand: "Hikrobot",
    origin: "Trung Quốc",
    category: "Machine Vision",
    subcategory: "Area Scan Camera",
    price: 17800000,
    featured: true,
    badge: "Global shutter",
    summary:
      "Camera monochrome 5 MP dùng Sony IMX264 global shutter, chuẩn GigE Vision cho đo kiểm và nhận dạng tốc độ cao.",
    highlights: [
      "2448 × 2048, tối đa 24,2 fps",
      "Sony IMX264 global shutter",
      "GigE Vision 2.0, GenICam; ngàm C",
    ],
    specifications: s("MV-CS050-10GM", "Hikrobot", [
      { label: "Cảm biến", value: "Sony IMX264 global shutter" },
      { label: "Độ phân giải", value: "2448 × 2048" },
    ]),
    images: [
      "/products/hikrobot-mv-cs050-10gm.webp",
    ],
    manufacturerUrl:
      "https://www.hikrobotics.com/en/machinevision/visionproduct/?id=134&typeId=78",
    priceSourceLabel: "eBay",
    priceSourceUrl: "https://www.ebay.com/itm/116182593599",
    priceSourceValue: "481,16 USD",
  }),
  p({
    id: "VIS-102",
    slug: "daheng-mer2-041-302gm-p",
    name: "Camera GigE tốc độ cao Daheng Imaging",
    model: "MER2-041-302GM-P",
    brand: "Daheng Imaging",
    origin: "Trung Quốc",
    category: "Machine Vision",
    subcategory: "Area Scan Camera",
    price: 12900000,
    summary:
      "Camera monochrome 0,4 MP tốc độ 302,3 fps, cảm biến Sony IMX287 global shutter và cấp nguồn PoE.",
    highlights: [
      "302,3 fps ở 720 × 540",
      "Sony IMX287 global shutter",
      "GigE Vision, hỗ trợ PoE",
    ],
    specifications: s("MER2-041-302GM-P", "Daheng Imaging", [
      { label: "Cảm biến", value: "Sony IMX287" },
      { label: "Tốc độ", value: "302,3 fps" },
    ]),
    images: [
      "/products/daheng-mer2-041-302gm.webp",
    ],
    manufacturerUrl:
      "https://en.daheng-imaging.com/index.php?a=prolists&c=index&catid=92&m=content",
    priceSourceLabel: "VA Imaging",
    priceSourceUrl:
      "https://va-imaging.com/en-us/products/gige-vision-camera-4mp-monochrome-sony-imx287-mer2-041-302gm-va",
    priceSourceValue: "350 USD",
  }),
  p({
    id: "MON-101",
    slug: "hikmicro-b20s",
    name: "Camera nhiệt cầm tay HIKMICRO B20S",
    model: "B20S",
    brand: "HIKMICRO",
    origin: "Trung Quốc",
    category: "Giám sát tình trạng máy",
    subcategory: "Camera nhiệt",
    price: 11883000,
    featured: true,
    badge: "256 × 192",
    summary:
      "Camera nhiệt 256 × 192, dải đo -20 đến 550 °C, kết hợp camera quang học 2 MP cho bảo trì điện và cơ khí.",
    highlights: [
      "Ảnh nhiệt 256 × 192; 25 Hz",
      "Dải đo -20 đến 550 °C",
      "Wi-Fi, IP54, chịu rơi 2 m",
    ],
    specifications: s("B20S", "HIKMICRO", [
      { label: "Dải đo", value: "-20 đến 550 °C" },
      { label: "NETD", value: "< 40 mK" },
    ]),
    images: ["/products/hikmicro-b20s.png"],
    manufacturerUrl:
      "https://www.hikmicrotech.com/en/industrial-products/b20s-handheld-thermography-camera/",
    priceSourceLabel: "HIKMICRO Japan",
    priceSourceUrl: "https://www.hikmicro.jp/products/b20-copy",
    priceSourceValue: "82.280 JPY",
  }),
  ...[
    [
      "DAQ-101",
      "smacq-usb-3310",
      "USB-3310",
      17900000,
      "125 kSa/s",
      "485,44 USD",
    ],
    [
      "DAQ-102",
      "smacq-usb-3313",
      "USB-3313",
      34300000,
      "1 MSa/s",
      "929,44 USD",
    ],
  ].map(([id, slug, model, price, rate, source]) =>
    p({
      id,
      slug,
      name: `Bộ thu thập dữ liệu USB ${model} Smacq`,
      model,
      brand: "Smacq",
      origin: "Trung Quốc",
      category: "DAQ & Remote I/O",
      subcategory: "USB DAQ",
      price,
      summary: `DAQ USB đa chức năng 16-bit, ${rate}, có analog input/output, digital I/O và bộ đếm.`,
      highlights: [
        `16-bit, ${rate}`,
        "8 RSE / 4 DIFF, 4 AO",
        "4 DI, 4 DO và 3 counter",
      ],
      specifications: s(model, "Smacq", [
        { label: "Tốc độ lấy mẫu", value: rate },
        { label: "Analog input", value: "8 RSE / 4 DIFF" },
      ]),
      images: ["/products/smacq-usb-3300.png"],
      manufacturerUrl: "https://www.smacq.com/product/usb-3300/",
      priceSourceLabel: "Smacq",
      priceSourceUrl: "https://www.smacq.com/product/usb-3300/",
      priceSourceValue: source,
    }),
  ),
  p({
    id: "IOT-101",
    slug: "pusr-usr-m300",
    name: "Gateway Edge IoT công nghiệp PUSR",
    model: "USR-M300",
    brand: "PUSR",
    origin: "Trung Quốc",
    category: "Industrial IoT & mạng",
    subcategory: "IoT Gateway",
    price: 6000000,
    featured: true,
    summary:
      "Gateway edge Linux có Node-RED, Modbus và OPC UA, tích hợp serial, DI/DO và analog input.",
    highlights: [
      "Node-RED, Modbus và OPC UA",
      "2 serial, 2 DI, 2 relay DO, 2 AI",
      "Quản lý tới 2.000 điểm dữ liệu",
    ],
    specifications: s("USR-M300", "PUSR", [
      { label: "Nguồn", value: "9–36 VDC" },
      { label: "Giao thức", value: "Modbus, MQTT, OPC UA" },
    ]),
    images: [
      "/products/pusr-usr-m300.jpg",
    ],
    manufacturerUrl:
      "https://www.pusr.com/products/industrial-IoT-Gateway.html",
    priceSourceLabel: "PUSR China",
    priceSourceUrl: "https://shop.usr.cn/mobile/Goods/goodsInfo/id/553.html",
    priceSourceValue: "1.099 CNY",
  }),
  p({
    id: "IOT-102",
    slug: "pusr-usr-g806w",
    name: "Router 4G công nghiệp PUSR",
    model: "USR-G806w",
    brand: "PUSR",
    origin: "Trung Quốc",
    category: "Industrial IoT & mạng",
    subcategory: "Industrial Router",
    price: 2200000,
    summary:
      "Router LTE công nghiệp vỏ kim loại, 3 cổng Ethernet, Wi-Fi và VPN cho điểm giám sát từ xa.",
    highlights: [
      "4G LTE, Wi-Fi và 3 Ethernet",
      "OpenVPN/IPsec/PPTP/L2TP",
      "9–36 VDC; -20 đến 70 °C",
    ],
    specifications: s("USR-G806w", "PUSR", [
      { label: "Ethernet", value: "2 LAN + 1 WAN/LAN" },
      { label: "Nguồn", value: "9–36 VDC" },
    ]),
    images: [
      "/products/pusr-usr-g806w.webp",
    ],
    manufacturerUrl:
      "https://www.pusr.com/products/4g-industrial-cellular-router",
    priceSourceLabel: "PUSR China",
    priceSourceUrl: "https://shop.usr.cn/wuxianacap",
    priceSourceValue: "398 CNY",
  }),
  p({
    id: "IOT-103",
    slug: "3onedata-ies618-2f",
    name: "Switch Ethernet công nghiệp managed 8 cổng",
    model: "IES618-2F",
    brand: "3onedata",
    origin: "Trung Quốc",
    category: "Industrial IoT & mạng",
    subcategory: "Industrial Ethernet Switch",
    price: 11880000,
    summary:
      "Switch Layer 2 managed gắn DIN-rail với 2 cổng quang và 6 cổng đồng.",
    highlights: ["2 quang + 6 RJ45", "Nguồn kép 12–60 VDC", "-40 đến 75 °C"],
    specifications: s("IES618-2F", "3onedata", [
      { label: "Cổng", value: "2 quang + 6 RJ45" },
      { label: "Nguồn", value: "12–60 VDC kép" },
    ]),
    images: [
      "/products/3onedata-ies618-2f.png",
    ],
    manufacturerUrl:
      "https://www.3onedata.com/layer-2-managed-switch/8-port-layer-2-managed-industrial-ethernet-switch.html",
    priceSourceLabel: "eBay",
    priceSourceUrl: "https://www.ebay.com/itm/386238197123",
    priceSourceValue: "509,64 USD",
  }),
  ...[
    ["TST-101", "rigol-dho804", "DHO804", 12760000, "70 MHz", "459 USD"],
    ["TST-102", "rigol-dho814", "DHO814", 13500000, "100 MHz", "549 USD"],
  ].map(([id, slug, model, price, bandwidth, source]) =>
    p({
      id,
      slug,
      name: `Máy hiện sóng 12-bit RIGOL ${model}`,
      model,
      brand: "RIGOL",
      origin: "Trung Quốc",
      category: "Thiết bị đo điện tử",
      subcategory: "Oscilloscope",
      price,
      featured: model === "DHO804",
      badge: "12-bit",
      summary: `Máy hiện sóng 4 kênh, băng thông ${bandwidth}, ADC 12-bit và tốc độ lấy mẫu 1,25 GSa/s.`,
      highlights: [
        `4 kênh, ${bandwidth}, ADC 12-bit`,
        "1,25 GSa/s; bộ nhớ 25 Mpts",
        "Tới 1.000.000 wfms/s",
      ],
      specifications: s(model, "RIGOL", [
        { label: "Băng thông", value: bandwidth },
        { label: "Tốc độ lấy mẫu", value: "1,25 GSa/s" },
      ]),
      images: [
        "/products/rigol-dho800.jpg",
      ],
      manufacturerUrl:
        "https://www.rigolna.com/products/rigol-digital-oscilloscopes/dho800/",
      priceSourceLabel: "RIGOL North America",
      priceSourceUrl:
        "https://www.rigolna.com/products/rigol-digital-oscilloscopes/dho800/",
      priceSourceValue: source,
    }),
  ),
  p({
    id: "TST-103",
    slug: "siglent-sds1204x-hd",
    name: "Máy hiện sóng HD 200 MHz SIGLENT",
    model: "SDS1204X HD",
    brand: "SIGLENT",
    origin: "Trung Quốc",
    category: "Thiết bị đo điện tử",
    subcategory: "Oscilloscope",
    price: 48400000,
    featured: true,
    summary:
      "Máy hiện sóng 4 kênh, 200 MHz, ADC 12-bit, 2 GSa/s và bộ nhớ 100 Mpts.",
    highlights: [
      "4 kênh, 200 MHz, ADC 12-bit",
      "2 GSa/s; bộ nhớ 100 Mpts",
      "Tới 500.000 wfms/s",
    ],
    specifications: s("SDS1204X HD", "SIGLENT", [
      { label: "Băng thông", value: "200 MHz" },
      { label: "Tốc độ lấy mẫu", value: "2 GSa/s" },
    ]),
    images: [
      "/products/siglent-sds1204x-hd.png",
    ],
    manufacturerUrl: "https://siglentna.com/product/sds1204x-hd/",
    priceSourceLabel: "SIGLENT North America",
    priceSourceUrl: "https://siglentna.com/product/sds1204x-hd/",
    priceSourceValue: "1.699 USD",
  }),
];

export const seedQuotes = [];
export const seedSettings = {
  storeName: "DTPT Techs",
  slogan: "Công nghệ tiên tiến. Giá trị bền vững.",
  logoStyle: "wide",
  logoRoundSrc: "/dp-lab-logo.png",
  logoWideSrc: "/dtpt-techs-logo.png",
  phone: "0906 094 313",
  address: "Tầng 5, V11-B09, KĐT mới An Hưng, P. La Khê, Hà Đông, Hà Nội",
  email: "hello@dtpt.tech",
  facebook: "facebook.com/dtpt.techs",
  content: {
    announcementPrimary:
      "Giải pháp thiết bị công nghiệp và đo lường chuyên sâu",
    announcementSecondary:
      "Tư vấn kỹ thuật cho doanh nghiệp, nhà máy và viện nghiên cứu",
    navProducts: "Sản phẩm",
    navSolutions: "Lĩnh vực",
    navWhy: "Về DTPT Techs",
    navContact: "Liên hệ",
    heroBadge: "INDUSTRIAL TECHNOLOGY · MEASUREMENT · AUTOMATION",
    heroTitle: "Thiết bị công nghiệp",
    heroHighlight: "cho những hệ thống đòi hỏi cao.",
    heroDescription:
      "DTPT Techs cung cấp thiết bị công nghệ cao, giải pháp đo lường và tự động hóa được lựa chọn kỹ lưỡng cho doanh nghiệp, nhà máy và viện nghiên cứu.",
    heroPrimaryAction: "Khám phá sản phẩm",
    heroSecondaryAction: "Trao đổi với kỹ sư",
    trustQuality: "Sản phẩm chính hãng",
    trustPrice: "Chi phí cạnh tranh",
    trustSupport: "Hỗ trợ kỹ thuật",
    service1Title: "Danh mục chuyên sâu",
    service1Description: "Thiết bị cho nhiều bài toán công nghiệp",
    service2Title: "Thương hiệu tin cậy",
    service2Description: "Nguồn cung được lựa chọn và kiểm soát",
    service3Title: "Giải pháp phù hợp",
    service3Description: "Tư vấn theo yêu cầu kỹ thuật thực tế",
    service4Title: "Đồng hành dài hạn",
    service4Description: "Hỗ trợ trước và sau bán hàng",
    productsEyebrow: "SẢN PHẨM ĐÃ ĐỐI CHIẾU",
    productsTitle: "Công nghệ cho nhà máy và phòng nghiên cứu",
    productsDescription:
      "Model thực tế, thông số theo tài liệu hãng và giá bán tại Việt Nam đã gồm VAT.",
    whyEyebrow: "NĂNG LỰC DTPT TECHS",
    whyTitle: "Một đối tác kỹ thuật đáng tin cậy.",
    whyDescription:
      "Chúng tôi kết hợp hiểu biết kỹ thuật, mạng lưới nguồn cung và quy trình làm việc minh bạch để mang lại giá trị lâu dài.",
    why1Title: "Lựa chọn có cơ sở",
    why1Description:
      "Sản phẩm được đánh giá theo thông số, độ ổn định và khả năng tích hợp.",
    why2Title: "Giá trị đầu tư tốt",
    why2Description:
      "Giải pháp cân bằng hiệu năng, chất lượng và tổng chi phí sở hữu.",
    why3Title: "Tư vấn kỹ thuật",
    why3Description:
      "Trao đổi trực tiếp để làm rõ giao thức, môi trường và yêu cầu vận hành.",
    why4Title: "Uy tín trong từng cam kết",
    why4Description:
      "Thông tin rõ ràng, phản hồi trách nhiệm và đồng hành sau bán hàng.",
    contactEyebrow: "TRAO ĐỔI NHU CẦU",
    contactTitle: "Đang tìm một thiết bị chuyên dụng?",
    contactSubtitle:
      "Gửi yêu cầu kỹ thuật để đội ngũ DTPT Techs đề xuất phương án phù hợp.",
    footerDescription:
      "Thiết bị công nghiệp, đo lường và tự động hóa cho những hệ thống đòi hỏi cao.",
  },
};
