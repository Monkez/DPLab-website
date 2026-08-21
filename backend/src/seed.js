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
    id: "IPC-102",
    slug: "qy-p8156-panel-pc-hmi-15-6-inch",
    name: "Panel PC HMI cảm ứng QY-P8156 15,6 inch",
    model: "QY-P8156",
    brand: "QY",
    origin: "Trung Quốc",
    category: "Máy tính công nghiệp",
    subcategory: "Panel PC & HMI",
    price: 17900000,
    featured: true,
    badge: "15,6 inch Full HD",
    summary:
      "Máy tính công nghiệp liền màn hình cảm ứng điện dung, thiết kế không quạt cho HMI, SCADA và trạm vận hành tại nhà máy.",
    highlights: [
      "Màn hình 15,6 inch Full HD, cảm ứng điện dung đa điểm",
      "Tùy chọn Intel J6412 hoặc Core i3/i5, RAM DDR4 và SSD M.2",
      "2 LAN, 4 USB, 2 cổng RS-232/485; nguồn 12–24 VDC",
    ],
    applications: ["Giao diện HMI và SCADA", "Trạm vận hành dây chuyền"],
    specifications: s("QY-P8156", "QY", [
      { label: "Màn hình", value: "15,6 inch, Full HD 1920 × 1080, PCAP" },
      { label: "Bộ xử lý", value: "Tùy chọn Intel J6412 / Core i3 / Core i5" },
      { label: "Kết nối", value: "2 × LAN, 4 × USB, 2 × RS-232/485" },
      { label: "Nguồn", value: "12–24 VDC" },
    ]),
    images: ["/products/qy-p8156.png"],
    manufacturerUrl:
      "https://store.optori.com/product/may-tinh-cong-nghiep-man-hinh-cam-ung-touch-panel-hmi-qy-p8156-15-6-inch/",
    priceSourceLabel: "Mặt bằng Panel PC tại Việt Nam",
    priceSourceUrl:
      "https://store.optori.com/gia-man-hinh-cam-ung-hmi-2026-bang-gia-tham-khao-moi/",
    priceSourceValue: "Dòng 15 inch từ 17.500.000 ₫",
    priceNote:
      "Giá bán đã gồm VAT cho cấu hình tiêu chuẩn dùng Intel J6412; RAM, SSD và hệ điều hành được xác nhận trong báo giá.",
  }),
  p({
    id: "IPC-103",
    slug: "be-px09-panel-pc-i5-1235u-15-6-inch",
    name: "Panel PC cảm ứng BE-PX09 Core i5 15,6 inch",
    model: "BE-PX09",
    brand: "BE",
    origin: "Trung Quốc",
    category: "Máy tính công nghiệp",
    subcategory: "Panel PC & HMI",
    price: 19950000,
    featured: true,
    badge: "Core i5-1235U",
    summary:
      "Panel PC không quạt hiệu năng cao với Intel Core i5 thế hệ 12, màn hình Full HD và nhiều cổng COM cho máy móc công nghiệp.",
    highlights: [
      "Intel Core i5-1235U, 10 nhân 12 luồng, tối đa 4,4 GHz",
      "Màn hình 15,6 inch Full HD, cảm ứng đa điểm",
      "6 cổng COM, Dual LAN tới 2.5GbE và SSD NVMe",
    ],
    applications: ["Điều khiển và giám sát máy", "MES/SCADA tại xưởng"],
    specifications: s("BE-PX09", "BE", [
      { label: "Màn hình", value: "15,6 inch, Full HD 1920 × 1080" },
      { label: "Bộ xử lý", value: "Intel Core i5-1235U" },
      { label: "Kết nối", value: "6 × COM, LAN 1GbE + 2.5GbE, USB 3.0" },
      { label: "Thiết kế", value: "Vỏ nhôm không quạt" },
    ]),
    images: ["/products/be-px09.png"],
    manufacturerUrl:
      "https://store.optori.com/product/man-hinh-cam-ung-hmi-touch-panel-pc-be-px09-15-6-inch/",
    priceSourceLabel: "Optori Việt Nam",
    priceSourceUrl:
      "https://store.optori.com/product/man-hinh-cam-ung-hmi-touch-panel-pc-be-px09-15-6-inch/",
    priceSourceValue: "19.950.000 ₫",
  }),
  p({
    id: "IPC-104",
    slug: "axiomtek-got315a-elk-wcd-panel-pc",
    name: "Panel PC công nghiệp IP65 Axiomtek GOT315A-ELK-WCD",
    model: "GOT315A-ELK-WCD",
    brand: "Axiomtek",
    origin: "Đài Loan",
    category: "Máy tính công nghiệp",
    subcategory: "Panel PC & HMI",
    price: 48500000,
    featured: false,
    badge: "IP65 mặt trước",
    summary:
      "Panel PC 15,6 inch dùng Intel J6412, mặt trước IP65 và nguồn dải rộng, phù hợp môi trường nhà máy cần độ bền và khả năng tích hợp cao.",
    highlights: [
      "Mặt trước chuẩn IP65, cảm ứng điện dung và độ sáng 400 nit",
      "Intel Celeron J6412; hỗ trợ DDR4 tới 32 GB",
      "Nguồn 9–36 VDC, 2.5GbE và nhiều cổng nối tiếp",
    ],
    applications: ["Tủ điều khiển công nghiệp", "HMI trong môi trường bụi ẩm"],
    specifications: s("GOT315A-ELK-WCD", "Axiomtek", [
      { label: "Màn hình", value: "15,6 inch WXGA, 400 nit, IP65 mặt trước" },
      { label: "Bộ xử lý", value: "Intel Celeron J6412" },
      { label: "Mạng", value: "1 × 2.5GbE và 1 × Gigabit Ethernet" },
      { label: "Nguồn", value: "9–36 VDC" },
    ]),
    images: ["/products/axiomtek-got315a-elk-wcd.jpeg"],
    manufacturerUrl:
      "https://www.axiomtek.com/Default.aspx?MenuId=Products&FunctionId=ProductView&ItemId=27349",
    datasheetUrl:
      "https://www.axiomtek.com/download/spec/en-us/got315a-elk-wcd.pdf",
    priceSourceLabel: "Industrial PC Pro",
    priceSourceUrl:
      "https://www.industrialpcpro.com/got315a-elk-wcd-156-rugged-fanless-touch-panel-pc",
    priceSourceValue: "1.315 USD",
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
    id: "DAQ-103",
    slug: "advantech-adam-4017-plus-8ai-modbus",
    name: "Module analog input Advantech ADAM-4017+",
    model: "ADAM-4017+-F",
    brand: "Advantech",
    origin: "Đài Loan",
    category: "DAQ & Remote I/O",
    subcategory: "RS-485 Remote I/O",
    price: 12600000,
    badge: "8 AI · 16-bit",
    summary:
      "Module thu thập 8 kênh analog qua RS-485, hỗ trợ điện áp, dòng 4–20 mA và Modbus RTU cho cảm biến tại hiện trường.",
    highlights: [
      "8 kênh analog input, độ phân giải 16-bit",
      "Dải đo mV, V, 0/4–20 mA",
      "Cách ly 3.000 VDC, Modbus RTU",
    ],
    specifications: s("ADAM-4017+-F", "Advantech", [
      { label: "Analog input", value: "8 kênh differential, 16-bit" },
      { label: "Giao tiếp", value: "RS-485; Modbus RTU / ASCII" },
      { label: "Nguồn", value: "10–30 VDC" },
    ]),
    images: ["/products/advantech-adam-4017-plus.jpg"],
    manufacturerUrl:
      "https://www.advantech.com/vi-vn/products/gf-5vtd/adam-4017/mod_10fd9e9c-8e8a-42f2-b749-a395f8426262",
    datasheetUrl:
      "https://advdownload.advantech.com/productfile/PIS/ADAM-4017+/file/ADAM-4017_4018_4019_DS(092223)20230928142137.pdf",
    priceSourceLabel: "Mouser",
    priceSourceUrl:
      "https://www.mouser.vn/vi/ProductDetail/Advantech/ADAM-4017%2B-F?qs=MyNHzdoqoQLsdis6B%252BVk6g%3D%3D",
    priceSourceValue: "340,20 USD",
  }),
  p({
    id: "DAQ-104",
    slug: "advantech-adam-5000-tcp-8-slot",
    name: "Hệ Remote I/O 8 khe Advantech ADAM-5000/TCP",
    model: "ADAM-5000/TCP-CE",
    brand: "Advantech",
    origin: "Đài Loan",
    category: "DAQ & Remote I/O",
    subcategory: "Modular Remote I/O",
    price: 18000000,
    badge: "8 khe I/O",
    summary:
      "Bộ điều khiển Remote I/O dạng module 8 khe, kết nối Ethernet Modbus TCP và mở rộng tới 128 điểm.",
    highlights: [
      "8 khe module I/O, tối đa 128 điểm",
      "2 Ethernet 10/100, Modbus TCP",
      "2 RS-485, 1 RS-232; nguồn 10–30 VDC",
    ],
    specifications: s("ADAM-5000/TCP-CE", "Advantech", [
      { label: "Số khe I/O", value: "8 khe, tối đa 128 điểm" },
      { label: "Ethernet", value: "2 × 10/100 Mbps" },
      { label: "Nguồn", value: "10–30 VDC" },
    ]),
    images: ["/products/advantech-adam-5000-tcp.jpg"],
    manufacturerUrl:
      "https://www.advantech.com/vi-vn/products/38d14508-c3eb-43f8-ab8f-a0dd5f2f7708/adam-5000-tcp/mod_7d8ea69c-0ac7-4ff6-a27e-ed2af71ed7e6",
    datasheetUrl:
      "https://advdownload.advantech.com/productfile/PIS/ADAM-5000%5B2F%5DTCP/Product%20-%20Datasheet/DS_ADAM-5000TCP_EN20150716094042.pdf",
    priceSourceLabel: "Advantech eStore",
    priceSourceUrl:
      "https://buy.advantech.com/I-O-Devices-Communication/Programmable-Controllers-PACS-ADAM-Controllers/model-ADAM-5000/TCP-CE.htm?country=United+States",
    priceSourceValue: "487 USD",
    priceNote:
      "Giá bán đã gồm VAT cho bộ điều khiển/chassis 8 khe; các module I/O lắp trong từng khe được cấu hình và báo giá riêng.",
  }),
  p({
    id: "DAQ-105",
    slug: "advantech-adam-6050-ethernet-digital-io",
    name: "Module Digital I/O Ethernet Advantech ADAM-6050",
    model: "ADAM-6050-D1",
    brand: "Advantech",
    origin: "Đài Loan",
    category: "DAQ & Remote I/O",
    subcategory: "Ethernet Remote I/O",
    price: 9350000,
    featured: true,
    badge: "12 DI · 6 DO",
    summary:
      "Module I/O số cách ly 18 kênh dùng Ethernet, hỗ trợ Modbus TCP, MQTT và điều khiển peer-to-peer.",
    highlights: [
      "12 digital input và 6 digital output",
      "Modbus TCP, MQTT, SNMP và HTTP",
      "Cách ly 2.000 VDC, -40 đến 70 °C",
    ],
    specifications: s("ADAM-6050-D1", "Advantech", [
      { label: "Digital I/O", value: "12 DI + 6 DO sink" },
      { label: "Giao thức", value: "Modbus TCP, MQTT, SNMP, HTTP" },
      { label: "Nguồn", value: "10–30 VDC" },
    ]),
    images: ["/products/advantech-adam-6050.png"],
    manufacturerUrl:
      "https://www.advantech.com/vi-vn/products/a67f7853-013a-4b50-9b20-01798c56b090/adam-6050/mod_b009c4b4-4b7c-4736-b16f-241978245e6a",
    datasheetUrl:
      "https://advdownload.advantech.com/productfile/PIS/ADAM-6050/file/ADAM-60_62_63_DS(030926)20260310135433.pdf",
    priceSourceLabel: "Thiên Trường PC Việt Nam",
    priceSourceUrl:
      "https://thientruongpc.vn/bo-chuyen-doi-tin-hieu-adam-6050-12di-6do-iot-modbus-snmp-mqtt-ethernet-remote-i-o-advantech-converter",
    priceSourceValue: "8.500.000 ₫ chưa VAT",
  }),
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
