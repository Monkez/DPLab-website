const updated = "21/08/2026";
const commonNote =
  "Giá bán đã gồm VAT cho model tiêu chuẩn; cấu hình, phụ kiện và thời gian giao được xác nhận trong báo giá chính thức.";

const categoryDefaults = {
  "Máy tính công nghiệp": {
    accent: "#148a83",
    applications: ["AI tại biên", "Machine vision", "Robot và AMR"],
  },
  "Machine Vision": {
    accent: "#167d9a",
    applications: ["Kiểm tra ngoại quan", "Đo kiểm tự động", "Định vị robot"],
  },
  "Cảm biến & đo lường": {
    accent: "#7357b8",
    applications: ["Robot và AGV", "Đo khoảng cách", "Nghiên cứu tự hành"],
  },
  "Giám sát tình trạng máy": {
    accent: "#df6a21",
    applications: ["Bảo trì dự đoán", "Kiểm tra tủ điện", "Chẩn đoán thiết bị"],
  },
  "DAQ & Remote I/O": {
    accent: "#405eaf",
    applications: ["Thu thập tín hiệu", "Mở rộng PLC/SCADA", "Giám sát hiện trường"],
  },
  "Industrial IoT & mạng": {
    accent: "#167d6b",
    applications: ["Kết nối máy móc", "Giám sát từ xa", "Hạ tầng IIoT"],
  },
  "Thiết bị đo điện tử": {
    accent: "#6b56b6",
    applications: ["R&D điện tử", "Kiểm thử sản phẩm", "Đào tạo kỹ thuật"],
  },
  "Tự động hóa & điều khiển": {
    accent: "#c44f3b",
    applications: ["Điều khiển máy", "Dây chuyền sản xuất", "Tủ điện tự động hóa"],
  },
};

const familyImages = {
  seeed: "/products/seeed-j4012.webp",
  hikrobot: "/products/hikrobot-mv-cs050-10gm.webp",
  lidar: "/products/livox-mid-360s.png",
  thermalPocket: "/products/hikmicro-pocket-series.png",
  thermalHandheld: "/products/hikmicro-m-series.png",
  adam4000: "/products/advantech-adam-4017-plus.jpg",
  adam6000: "/products/advantech-adam-6050.png",
  pusrRouter: "/products/pusr-usr-g806w.webp",
  pusrGateway: "/products/pusr-usr-m300.jpg",
  rigolScope: "/products/rigol-dho800.jpg",
  rigolBench: "/products/rigol-bench-series.jpg",
  siglentBench: "/products/siglent-bench-series.png",
  deltaPlc: "/products/delta-dvp-plc.jpg",
  deltaHmi: "/products/delta-dop-hmi.jpg",
  deltaServo: "/products/delta-asda-b3.jpg",
};

const makeProduct = (row) => {
  const defaults = categoryDefaults[row.category];
  return {
    priceMode: "fixed",
    leadTime: row.leadTime ?? "Khoảng 2–4 tuần, xác nhận theo đơn hàng",
    warranty: row.warranty ?? "12 tháng",
    status: "active",
    accent: defaults.accent,
    priceUpdatedAt: updated,
    priceNote: row.priceNote ?? commonNote,
    featured: false,
    applications: row.applications ?? defaults.applications,
    ...row,
    images: [familyImages[row.image]],
    highlights: row.details,
    specifications: [
      { label: "Model", value: row.model },
      { label: "Thương hiệu", value: row.brand },
      ...row.details.map((value, index) => ({
        label: ["Thông số chính", "Kết nối / hiệu năng", "Thiết kế"][index],
        value,
      })),
    ],
  };
};

const products = [
  // Industrial PC — Seeed Studio reComputer/reServer Industrial
  { id:"IPC-105", slug:"seeed-recomputer-industrial-j3010", name:"Máy tính AI công nghiệp reComputer J3010", model:"J3010", brand:"Seeed Studio", origin:"Trung Quốc", category:"Máy tính công nghiệp", subcategory:"Edge AI Computer", price:29500000, image:"seeed", badge:"20 TOPS", summary:"Máy tính edge AI không quạt dùng Jetson Orin Nano 4 GB cho thị giác máy và robot.", details:["Jetson Orin Nano 4 GB, 20 TOPS","2 × GbE, CAN, RS-232/422/485","Nguồn 12–24 VDC, -20 đến 60 °C"], manufacturerUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", datasheetUrl:"https://files.seeedstudio.com/products/NVIDIA/reComputer-Industrial-Reference-Guide.pdf", imageSourceUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceLabel:"Seeed Studio", priceSourceUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceValue:"799 USD" },
  { id:"IPC-106", slug:"seeed-recomputer-industrial-j3011", name:"Máy tính AI công nghiệp reComputer J3011", model:"J3011", brand:"Seeed Studio", origin:"Trung Quốc", category:"Máy tính công nghiệp", subcategory:"Edge AI Computer", price:33200000, image:"seeed", badge:"40 TOPS", summary:"Nền tảng Jetson Orin Nano 8 GB bền bỉ cho suy luận AI đa luồng tại hiện trường.", details:["Jetson Orin Nano 8 GB, 40 TOPS","2 × GbE, CAN, RS-232/422/485","Không quạt, DIN-rail và treo tường"], manufacturerUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceLabel:"Seeed Studio", priceSourceUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceValue:"899 USD" },
  { id:"IPC-107", slug:"seeed-recomputer-industrial-j4011", name:"Máy tính AI công nghiệp reComputer J4011", model:"J4011", brand:"Seeed Studio", origin:"Trung Quốc", category:"Máy tính công nghiệp", subcategory:"Edge AI Computer", price:36900000, image:"seeed", badge:"70 TOPS", summary:"Máy tính Jetson Orin NX 8 GB cho hệ thống nhận dạng, robot và phân tích video tại biên.", details:["Jetson Orin NX 8 GB, 70 TOPS","SSD NVMe, 2 × GbE và CAN","Nguồn rộng 12–24 VDC"], manufacturerUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceLabel:"Seeed Studio", priceSourceUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceValue:"999 USD" },
  { id:"IPC-108", slug:"seeed-recomputer-industrial-j2011", name:"Máy tính AI công nghiệp reComputer J2011", model:"J2011", brand:"Seeed Studio", origin:"Trung Quốc", category:"Máy tính công nghiệp", subcategory:"Edge AI Computer", price:36900000, image:"seeed", badge:"Xavier NX 8 GB", summary:"Máy tính công nghiệp Jetson Xavier NX tương thích hệ sinh thái CUDA và JetPack.", details:["Jetson Xavier NX 8 GB, 21 TOPS","2 × GbE, USB 3.2 và CAN","Vỏ nhôm không quạt, DIN-rail"], manufacturerUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceLabel:"Seeed Studio", priceSourceUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceValue:"999 USD" },
  { id:"IPC-109", slug:"seeed-recomputer-industrial-j2012", name:"Máy tính AI công nghiệp reComputer J2012", model:"J2012", brand:"Seeed Studio", origin:"Trung Quốc", category:"Máy tính công nghiệp", subcategory:"Edge AI Computer", price:40600000, image:"seeed", badge:"Xavier NX 16 GB", summary:"Phiên bản Xavier NX 16 GB cho workload AI cần bộ nhớ lớn và nhiều camera.", details:["Jetson Xavier NX 16 GB, 21 TOPS","NVMe, 2 × GbE và giao tiếp công nghiệp","Nhiệt độ làm việc -20 đến 60 °C"], manufacturerUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceLabel:"Seeed Studio", priceSourceUrl:"https://www.seeedstudio.com/reComputer-Industrial-optional-accessories.html", priceSourceValue:"1.099 USD" },
  { id:"IPC-110", slug:"seeed-reserver-industrial-j3010", name:"Máy chủ AI công nghiệp reServer J3010", model:"reServer J3010", brand:"Seeed Studio", origin:"Trung Quốc", category:"Máy tính công nghiệp", subcategory:"Edge AI Computer", price:33200000, image:"seeed", badge:"5 × GbE", summary:"Edge server Jetson Orin Nano có nhiều cổng mạng và khay lưu trữ cho NVR AI, robot fleet.", details:["Jetson Orin Nano 4 GB, 20 TOPS","5 × GbE hỗ trợ PoE, 2 khay 2,5 inch","CAN, RS-232/422/485 và 4 DI/DO"], manufacturerUrl:"https://www.seeedstudio.com/reServer-industrial-J4011-p-5748.html", priceSourceLabel:"Seeed Studio", priceSourceUrl:"https://www.seeedstudio.com/reServer-industrial-J4011-p-5748.html", priceSourceValue:"899 USD" },
  { id:"IPC-111", slug:"seeed-reserver-industrial-j4011", name:"Máy chủ AI công nghiệp reServer J4011", model:"reServer J4011", brand:"Seeed Studio", origin:"Trung Quốc", category:"Máy tính công nghiệp", subcategory:"Edge AI Computer", price:40600000, image:"seeed", badge:"Orin NX · 5 GbE", summary:"Máy chủ edge AI nhỏ gọn với Jetson Orin NX và hạ tầng mạng dày đặc cho nhiều camera.", details:["Jetson Orin NX 8 GB, 70 TOPS","5 × GbE hỗ trợ PoE, 2 khay 2,5 inch","DI/DO, CAN và serial công nghiệp"], manufacturerUrl:"https://www.seeedstudio.com/reServer-industrial-J4011-p-5748.html", priceSourceLabel:"Seeed Studio", priceSourceUrl:"https://www.seeedstudio.com/reServer-industrial-J4011-p-5748.html", priceSourceValue:"1.099 USD" },

  // Machine vision — Hikrobot CS series
  ...[
    ["VIS-103","hikrobot-mv-cs016-10gm","Camera GigE Hikrobot 1,6 MP","MV-CS016-10GM",12800000,"1440 × 1080, 65,2 fps","Sony IMX296 global shutter","GigE Vision, ngàm C"],
    ["VIS-104","hikrobot-mv-cs023-10gm","Camera GigE Hikrobot 2,3 MP","MV-CS023-10GM",14900000,"1920 × 1200, 41 fps","Sony IMX249 global shutter","GigE Vision, GenICam"],
    ["VIS-105","hikrobot-mv-cs013-80um","Camera USB3 tốc độ cao Hikrobot","MV-CS013-80UM",15800000,"1280 × 1024, 240,4 fps","Global shutter","USB3 Vision, ngàm C"],
    ["VIS-106","hikrobot-mv-cs016-10um","Camera USB3 Hikrobot 1,6 MP","MV-CS016-10UM",18900000,"1440 × 1080, 249,1 fps","Sony IMX273 global shutter","USB3 Vision, GenICam"],
    ["VIS-107","hikrobot-mv-cs020-10gm","Camera GigE Hikrobot 2 MP","MV-CS020-10GM",16500000,"1624 × 1240, 60 fps","Sony IMX430 global shutter","GigE Vision, ngàm C"],
    ["VIS-108","hikrobot-mv-cs050-10um","Camera USB3 Hikrobot 5 MP","MV-CS050-10UM",20500000,"2448 × 2048, 60 fps","Sony IMX264 global shutter","USB3 Vision, ngàm C"],
    ["VIS-109","hikrobot-mv-cs060-10gm","Camera GigE Hikrobot 6 MP","MV-CS060-10GM",19800000,"3072 × 2048, 19,5 fps","Sony IMX178 rolling shutter","GigE Vision, GenICam"],
    ["VIS-110","hikrobot-mv-cs060-10um","Camera USB3 Hikrobot 6 MP","MV-CS060-10UM",24800000,"3072 × 2048, 60,9 fps","Sony IMX178 rolling shutter","USB3 Vision, GenICam"],
    ["VIS-111","hikrobot-mv-cs120-10gm","Camera GigE Hikrobot 12 MP","MV-CS120-10GM",31500000,"4024 × 3036, 10 fps","Sony IMX226 rolling shutter","GigE Vision, ngàm C"],
  ].map(([id,slug,name,model,price,d1,d2,d3]) => ({ id,slug,name,model,brand:"Hikrobot",origin:"Trung Quốc",category:"Machine Vision",subcategory:"Area Scan Camera",price,image:"hikrobot",summary:`Camera công nghiệp ${model} cho kiểm tra, đo lường và nhận dạng tự động.`,details:[d1,d2,d3],manufacturerUrl:"https://www.hikrobotics.com/en/machinevision/visionproduct/?id=134&typeId=78",imageSourceUrl:"https://www.hikrobotics.com/en/machinevision/visionproduct/?id=134&typeId=78",priceSourceLabel:"Hikrobot CS Series / tham chiếu thị trường",priceSourceUrl:"https://www.hikrobotics.com/en/machinevision/visionproduct/?id=134&typeId=78",priceSourceValue:"Ngân sách model theo cảm biến, độ phân giải và giao tiếp" })),

  // Sensors — industrial LiDAR and distance measurement
  ...[
    ["SEN-101","benewake-tf03-100","LiDAR công nghiệp Benewake TF03-100","TF03-100",8300000,"Benewake","100 m, tới 1 kHz","IP67, -25 đến 60 °C","UART/CAN hoặc RS-485/RS-232","225 USD","https://www.seeedstudio.com/TF03-100-LiDAR-Long-Range-Distance-Sensor-p-4886.html"],
    ["SEN-102","benewake-tf03-180","LiDAR công nghiệp Benewake TF03-180","TF03-180",9300000,"Benewake","180 m, tới 1 kHz","IP67, chống nắng mưa","UART/CAN hoặc RS-485/RS-232","249,90 USD","https://www.seeedstudio.com/TF03-180-LiDAR-Long-Range-Distance-Sensor-p-4886.html"],
    ["SEN-103","livox-mid-360s","LiDAR 3D Livox Mid-360S","Mid-360S",23800000,"Livox","FOV 360° × 59°, tối đa 100 m","IMU tích hợp, PTP v2 và GPS sync","Chống nhiễu chủ động, điểm mù 0,1 m","604 EUR","https://store.dji.com/dk/product/livox-mid-360s"],
    ["SEN-104","livox-mid-70","LiDAR 3D Livox Mid-70","Mid-70",29400000,"Livox","FOV tròn 70,4°, tầm xa 260 m","100.000 điểm/giây","IP67, Ethernet","799 USD","https://www.livoxtech.com/jp/news/12"],
    ["SEN-105","livox-avia","LiDAR 3D Livox Avia","Avia",59000000,"Livox","Tầm xa tối đa 450 m","Tới 240.000 điểm/giây, triple echo","IP67, IMU tích hợp","1.599 USD","https://www.livoxtech.com/jp/news/12"],
    ["SEN-106","livox-tele-15","LiDAR 3D Livox Tele-15","Tele-15",54000000,"Livox","Tầm xa 500 m","FOV 14,5°, độ chính xác 2 cm","IP67, Ethernet","1.349 EUR","https://www.livoxtech.com/de"],
    ["SEN-107","slamtec-rplidar-a3m1","LiDAR 2D SLAMTEC RPLIDAR A3","RPLIDAR A3M1",24800000,"SLAMTEC","Tầm đo tới 25 m","16.000 mẫu/giây","Quét 360°, dùng trong nhà/ngoài trời","679 USD","https://www.slamtec.com/en/Lidar/A3"],
    ["SEN-108","slamtec-rplidar-s2","LiDAR 2D SLAMTEC RPLIDAR S2","RPLIDAR S2",16900000,"SLAMTEC","Tầm đo tới 30 m","32.000 mẫu/giây","IP65, quét 360°","459 USD","https://www.slamtec.com/en/Lidar/S2"],
    ["SEN-109","slamtec-rplidar-s3","LiDAR 2D SLAMTEC RPLIDAR S3","RPLIDAR S3",23800000,"SLAMTEC","Tầm đo tới 40 m","32.000 mẫu/giây","IP65, chống ánh sáng 80 klux","649 USD","https://www.slamtec.com/en/Lidar/S3"],
    ["SEN-110","sick-tim581-2050101","Cảm biến LiDAR 2D SICK TiM581","TiM581-2050101",48500000,"SICK","Dải đo 0,05–25 m, góc 270°","15 Hz, độ phân giải góc 0,33°","Ethernet, IP67, 9–28 VDC","Giá nhập khẩu dự toán theo model","https://emin.vn/sicktim581-2050101-cam-bien-khoang-cach-lidar-2d-sick-tim581-2050101-15-hz-0-05-m-25-m-9827902/pr.html"],
    ["SEN-111","autonics-bd-030","Cảm biến dịch chuyển laser Autonics BD-030","BD-030",18900000,"Autonics","Dải đo 20–40 mm","Độ phân giải 1 µm","Độ tuyến tính 0,1% F.S.","Giá nhập khẩu dự toán theo model","https://emin.vn/autonicsbd-030-cam-bien-do-dich-chuyen-bang-laser-autonics-bd-030-20-40mm-0-1-f-s-173896/pr.html"],
  ].map(([id,slug,name,model,price,brand,d1,d2,d3,source,sourceUrl]) => ({ id,slug,name,model,brand,origin:brand==="SICK"?"Đức":brand==="Autonics"?"Hàn Quốc":"Trung Quốc",category:"Cảm biến & đo lường",subcategory:model.includes("BD-")?"Cảm biến dịch chuyển":"Cảm biến khoảng cách",price,image:"lidar",summary:`Thiết bị đo khoảng cách ${model} cho robot, tự hành và đo lường công nghiệp.`,details:[d1,d2,d3],manufacturerUrl:sourceUrl,imageSourceUrl:sourceUrl,priceSourceLabel:source.includes("dự toán")?"Thị trường quốc tế / EMIN Việt Nam":"Nhà sản xuất / cửa hàng chính hãng",priceSourceUrl:sourceUrl,priceSourceValue:source })),

  // Condition monitoring — thermal imaging, Vietnamese market prices
  ...[
    ["MON-102","hikmicro-mini2-v2","Camera nhiệt điện thoại HIKMICRO Mini2 V2","Mini2 V2",6670000,"thermalPocket","256 × 192, USB-C","-20 đến 400 °C","NETD < 40 mK","6.057.050 ₫ chưa VAT","https://emin.vn/thiet-bi-do-nhiet-do-camera-do-nhiet-do-camera-nhiet-dung-cho-dien-thoai-thong-minh-4515/pc.html"],
    ["MON-103","hikmicro-mini2plus-v2","Camera nhiệt HIKMICRO Mini2Plus V2","Mini2Plus V2",7113000,"thermalPocket","256 × 192, lấy nét tay","-20 đến 400 °C","Kết nối smartphone USB-C","7.112.934 ₫ đã VAT","https://emin.vn/hikmicromini2plus-v2-camera-hong-ngoai-tren-dien-thoai-thong-minh-hikmicro-mini2plus-v2-256-x-192-20degc-400degc-217606/pr.html/"],
    ["MON-104","hikmicro-pocket2","Camera nhiệt bỏ túi HIKMICRO Pocket2","Pocket2",15683000,"thermalPocket","256 × 192, camera quang 8 MP","-20 đến 400 °C","Wi-Fi, bộ nhớ 16 GB","15.682.734 ₫ đã VAT","https://emin.vn/hikmicropocket2-camera-do-nhiet-bo-tui-hikmicro-hm-tp42-3aqf-w-pocket2-256x192px-20-400degc-emmc-16gb-120974/pr.html"],
    ["MON-105","hikmicro-m11w","Camera nhiệt HIKMICRO M11W","M11W",36251000,"thermalHandheld","192 × 144, camera quang 8 MP","-20 đến 550 °C","Lấy nét tự động, Wi-Fi","36.250.254 ₫ đã VAT","https://emin.vn/en/hikmicrom11w-hikmicro-m11w-thermal-camera-192x144px-20-550degc-8mp-120971/pr.html"],
    ["MON-106","hikmicro-m20","Camera nhiệt HIKMICRO M20","M20",53390000,"thermalHandheld","256 × 192, camera quang 8 MP","-20 đến 550 °C","Màn hình cảm ứng 3,5 inch","53.389.854 ₫ đã VAT","https://emin.vn/hikmicrom20-camera-nhiet-hikmicro-m20-256x192px-20-550degc-8mp-120969/pr.html"],
    ["MON-107","hikmicro-m20w","Camera nhiệt HIKMICRO M20W","M20W",48560000,"thermalHandheld","256 × 192, 25 Hz","-20 đến 550 °C","Wi-Fi và camera quang học","44.145.050 ₫ chưa VAT","https://emin.vn/en/temperature-measurement-thermal-camera-310/pc.html?page=5"],
    ["MON-108","hikmicro-bx20","Camera nhiệt chống cháy nổ HIKMICRO BX20","BX20",49440000,"thermalHandheld","256 × 192, 25 Hz","-20 đến 550 °C","Thiết kế cho khu vực nguy hiểm","44.938.550 ₫ chưa VAT","https://emin.vn/en/temperature-measurement-thermal-camera-310/pc.html?page=5"],
    ["MON-109","hikmicro-fb21","Camera nhiệt chữa cháy HIKMICRO FB21","FB21",20340000,"thermalHandheld","256 × 192, 25 Hz","-20 đến 550 °C","Chế độ ảnh phục vụ cứu hỏa","18.488.550 ₫ chưa VAT","https://emin.vn/en/temperature-measurement-thermal-camera-310/pc.html?page=5"],
    ["MON-110","guide-mobir-2s","Camera nhiệt smartphone Guide MobIR 2S","MobIR 2S",6983000,"thermalPocket","256 × 192","-20 đến 550 °C","USB-C, phân tích trên điện thoại","6.348.000 ₫ chưa VAT","https://emin.vn/thiet-bi-do-nhiet-do-camera-do-nhiet-do-camera-nhiet-dung-cho-dien-thoai-thong-minh-4515/pc.html"],
    ["MON-111","guide-mobir-2t","Camera nhiệt smartphone Guide MobIR 2T","MobIR 2T",6765000,"thermalPocket","256 × 192","-20 đến 550 °C","Gọn nhẹ cho bảo trì hiện trường","6.149.625 ₫ chưa VAT","https://emin.vn/thiet-bi-do-nhiet-do-camera-do-nhiet-do-camera-nhiet-dung-cho-dien-thoai-thong-minh-4515/pc.html"],
  ].map(([id,slug,name,model,price,image,d1,d2,d3,source,sourceUrl]) => ({ id,slug,name,model,brand:model.startsWith("MobIR")?"Guide":"HIKMICRO",origin:"Trung Quốc",category:"Giám sát tình trạng máy",subcategory:"Camera nhiệt",price,image,summary:`Camera nhiệt ${model} phục vụ kiểm tra điện, cơ khí và bảo trì dự đoán.`,details:[d1,d2,d3],manufacturerUrl:sourceUrl,imageSourceUrl:sourceUrl,priceSourceLabel:"EMIN Việt Nam",priceSourceUrl:sourceUrl,priceSourceValue:source })),

  // DAQ and Remote I/O — Advantech ADAM
  ...[
    ["DAQ-106","advantech-adam-4015","Module RTD Advantech ADAM-4015","ADAM-4015-F",16000000,"adam4000","6 kênh RTD","16-bit, cách ly 3.000 VDC","RS-485 Modbus RTU","432,60 USD"],
    ["DAQ-107","advantech-adam-4018-plus","Module thermocouple Advantech ADAM-4018+","ADAM-4018+-F",12900000,"adam4000","8 kênh thermocouple/analog input","16-bit, 10 mẫu/giây","RS-485 Modbus RTU","Giá eStore dự toán khoảng 350 USD"],
    ["DAQ-108","advantech-adam-4050","Module Digital I/O Advantech ADAM-4050","ADAM-4050-F",5200000,"adam4000","8 DI và 8 DO","Cách ly 5.000 VDC","RS-485 Modbus RTU","141 USD"],
    ["DAQ-109","advantech-adam-6017","Module Analog I/O Ethernet Advantech ADAM-6017","ADAM-6017-D",14020000,"adam6000","8 AI và 2 DO","16-bit, 100 mẫu/giây","Ethernet Modbus TCP","380,10 USD"],
    ["DAQ-110","advantech-adam-6060","Module Relay Ethernet Advantech ADAM-6060","ADAM-6060-D1",9780000,"adam6000","6 DI và 6 relay output","Modbus TCP, MQTT và SNMP","Nguồn 10–30 VDC","265 USD"],
    ["DAQ-111","advantech-adam-6066","Module Power Relay Ethernet ADAM-6066","ADAM-6066-D1",10470000,"adam6000","6 DI và 6 power relay","Modbus TCP, MQTT và peer-to-peer","-40 đến 70 °C","284 USD"],
  ].map(([id,slug,name,model,price,image,d1,d2,d3,source]) => ({ id,slug,name,model,brand:"Advantech",origin:"Đài Loan",category:"DAQ & Remote I/O",subcategory:model.startsWith("ADAM-4")?"RS-485 Remote I/O":"Ethernet Remote I/O",price,image,summary:`Module remote I/O ${model} cho thu thập và điều khiển tín hiệu phân tán.`,details:[d1,d2,d3],manufacturerUrl:"https://buy.advantech.com/I-O-Devices-Communication/Remote-I-O-Modules/Remote_IO_Module.products.htm?country=United+States",imageSourceUrl:"https://buy.advantech.com/I-O-Devices-Communication/Remote-I-O-Modules/Remote_IO_Module.products.htm?country=United+States",priceSourceLabel:"Advantech eStore",priceSourceUrl:"https://buy.advantech.com/I-O-Devices-Communication/Remote-I-O-Modules/Remote_IO_Module.products.htm?country=United+States",priceSourceValue:source })),

  // Industrial IoT and networking — PUSR China store
  ...[
    ["IOT-104","pusr-usr-g816","Router công nghiệp 5G PUSR USR-G816","USR-G816",9200000,"pusrRouter","5G SA/NSA, dual SIM","4 Gigabit Ethernet và Wi-Fi","VPN, watchdog, 9–36 VDC","1.688 CNY"],
    ["IOT-105","pusr-usr-g817","Router 5G Wi-Fi 6 PUSR USR-G817","USR-G817",13000000,"pusrRouter","5G SA/NSA và Wi-Fi 6","Gigabit Ethernet, dual SIM","VPN và quản lý cloud","2.388 CNY"],
    ["IOT-106","pusr-usr-g805s","Router 4G công nghiệp PUSR USR-G805s","USR-G805s",1500000,"pusrRouter","4G LTE Cat 4","Ethernet và Wi-Fi","Vỏ kim loại, DIN-rail","268 CNY"],
    ["IOT-107","pusr-usr-g781","Router 4G serial PUSR USR-G781","USR-G781",2600000,"pusrRouter","4G LTE, Ethernet","RS-232/485 và Modbus","VPN, nguồn dải rộng","468 CNY"],
    ["IOT-108","pusr-usr-n510","Serial device server PUSR USR-N510","USR-N510",1200000,"pusrGateway","1 cổng RS-232/485/422","10/100 Ethernet","Modbus gateway và virtual COM","218 CNY"],
    ["IOT-109","pusr-usr-n540","Serial device server 4 cổng PUSR USR-N540","USR-N540",2200000,"pusrGateway","4 cổng RS-232/485/422","Ethernet 10/100 Mbps","Modbus gateway, DIN-rail","398 CNY"],
    ["IOT-110","pusr-tcp232-410s","Serial server 2 cổng PUSR TCP232-410S","USR-TCP232-410S",1050000,"pusrGateway","2 cổng RS-232/485/422","Ethernet 10/100 Mbps","Modbus TCP/RTU gateway","188 CNY"],
    ["IOT-111","pusr-usr-lg210","Gateway LoRa PUSR USR-LG210","USR-LG210",2000000,"pusrGateway","LoRa point-to-multipoint","Ethernet và 4G tùy cấu hình","Quản lý node từ xa","368 CNY"],
  ].map(([id,slug,name,model,price,image,d1,d2,d3,source]) => ({ id,slug,name,model,brand:"PUSR",origin:"Trung Quốc",category:"Industrial IoT & mạng",subcategory:model.includes("G8")||model.includes("G7")?"Industrial Router":model.includes("LG")?"IoT Gateway":"Serial Device Server",price,image,summary:`Thiết bị kết nối công nghiệp ${model} cho truyền dữ liệu máy móc và giám sát từ xa.`,details:[d1,d2,d3],manufacturerUrl:"https://www.pusr.com/support/downloads/usr-product-catalog.html",imageSourceUrl:"https://www.pusr.com/support/downloads/usr-product-catalog.html",priceSourceLabel:"PUSR China",priceSourceUrl:"https://shop.usr.cn/wangguan",priceSourceValue:source })),

  // Test & Measurement — local VAT-inclusive prices
  ...[
    ["TST-104","rigol-dho924s","Máy hiện sóng RIGOL DHO924S","DHO924S",22824000,"RIGOL","rigolScope","250 MHz, 4 kênh, ADC 12-bit","1,25 GSa/s, bộ nhớ 50 Mpts","Tích hợp AWG và phân tích logic","22.824.234 ₫ đã VAT","https://emin.vn/rigoldho924s-may-hien-song-so-rigol-dho924s-250-mhz-1-25-gsa-s-50-mpts-4ch-154663/pr.html"],
    ["TST-105","rigol-mso5074","Máy hiện sóng hỗn hợp RIGOL MSO5074","MSO5074",31394000,"RIGOL","rigolScope","70 MHz, 4 kênh analog","8 GSa/s, bộ nhớ tới 200 Mpts","Mở rộng 16 kênh logic","31.394.034 ₫ đã VAT","https://emin.vn/rigolmso5074-may-hien-song-so-rigol-mso5074-70-mhz-2-4-16ch-8-gsa-s-35092/pr.html"],
    ["TST-106","rigol-dg1022z","Máy phát hàm RIGOL DG1022Z","DG1022Z",9684000,"RIGOL","rigolBench","2 kênh, 25 MHz","200 MSa/s","Sine, square, pulse và arbitrary","9.683.874 ₫ đã VAT","https://emin.vn/rigoldg1022z-may-phat-xung-tuy-y-rigol-dg1022z-25mhz-200msa-s-2-kenh-37828/pr.html"],
    ["TST-107","rigol-dp832a","Nguồn DC lập trình RIGOL DP832A","DP832A",15968000,"RIGOL","rigolBench","3 kênh, 30 V/3 A","Độ phân giải 1 mV/1 mA","USB, LAN, RS-232 tùy chọn","15.968.394 ₫ đã VAT","https://emin.vn/rigoldp832a-nguon-1-chieu-dc-rigol-dp832a-30v-3a-3-ch-52296/pr.html"],
    ["TST-108","siglent-sdg1032x-plus","Máy phát hàm SIGLENT SDG1032X Plus","SDG1032X Plus",11969000,"SIGLENT","siglentBench","2 kênh, 30 MHz","1 GSa/s, 16-bit","Arbitrary waveform và harmonic","11.969.154 ₫ đã VAT","https://emin.vn/siglentsdg1032x-plus-may-phat-xung-siglent-sdg1032x-plus-30-mhz-2-ch-1-gsa-s-216899/pr.html"],
    ["TST-109","siglent-ssa3021x-plus","Máy phân tích phổ SIGLENT SSA3021X Plus","SSA3021X Plus",45563000,"SIGLENT","siglentBench","9 kHz đến 2,1 GHz","DANL tới -161 dBm/Hz","RBW tối thiểu 1 Hz","45.562.770 ₫ đã VAT","https://emin.vn/siglentssa3021x-plus-may-phan-tich-pho-siglent-ssa3021x-plus-9khz-2-1ghz-100620/pr.html"],
    ["TST-110","siglent-sdg1032x","Máy phát hàm SIGLENT SDG1032X","SDG1032X",10255000,"SIGLENT","siglentBench","2 kênh, 30 MHz","150 MSa/s","EasyPulse và arbitrary waveform","10.255.194 ₫ đã VAT","https://emin.vn/siglentsdg1032x-may-phat-xung-siglent-sdg1032x-30mhz-2ch-150msa-s-100555/pr.html"],
    ["TST-111","siglent-ssa3015x-plus","Máy phân tích phổ SIGLENT SSA3015X Plus","SSA3015X Plus",35965000,"SIGLENT","siglentBench","9 kHz đến 1,5 GHz","DANL tới -161 dBm/Hz","Màn hình cảm ứng 10,1 inch","33.300.550 ₫ chưa VAT","https://emin.vn/en/siglentssa3015x-plus-siglent-ssa3015x-plus-spectrum-analyzer-9khz-1-5ghz-100619/pr.html"],
  ].map(([id,slug,name,model,price,brand,image,d1,d2,d3,source,sourceUrl]) => ({ id,slug,name,model,brand,origin:"Trung Quốc",category:"Thiết bị đo điện tử",subcategory:model.includes("DHO")||model.includes("MSO")?"Oscilloscope":model.includes("SSA")?"Spectrum Analyzer":model.includes("DP")?"Nguồn DC":"Máy phát hàm",price,image,summary:`Thiết bị đo ${model} cho bàn lab R&D, kiểm thử và đào tạo kỹ thuật.`,details:[d1,d2,d3],manufacturerUrl:sourceUrl,imageSourceUrl:sourceUrl,priceSourceLabel:"EMIN Việt Nam",priceSourceUrl:sourceUrl,priceSourceValue:source })),

  // Automation — Delta PLC, HMI and servo with Vietnamese public prices
  ...[
    ["AUT-101","delta-dvp14ss211r","PLC Delta DVP14SS211R","DVP14SS211R",2589000,"PLC","deltaPlc","8 input, 6 relay output","Nguồn 24 VDC","Kích thước 25,2 × 96 × 60 mm","2.352.900 ₫ chưa VAT","https://hoplongtech.com/products/dvp14ss211r"],
    ["AUT-102","delta-dvp12se11r","PLC Ethernet Delta DVP12SE11R","DVP12SE11R",3279000,"PLC","deltaPlc","8 input, 4 relay output","Ethernet, RS-232 và RS-485","Nguồn 24 VDC","2.980.670 ₫ chưa VAT","https://hoplongtech.com/products/dvp12se11r"],
    ["AUT-103","delta-dvp20sx211r","PLC Analog Delta DVP20SX211R","DVP20SX211R",4199000,"PLC","deltaPlc","8 DI, 6 relay DO","4 AI và 2 AO, độ phân giải 12-bit","USB, RS-232, RS-485 Modbus","3.817.440 ₫ chưa VAT","https://hoplongtech.com/products/dvp20sx211r"],
    ["AUT-104","delta-dop-103bq","HMI Delta DOP-103BQ 4,3 inch","DOP-103BQ",2186000,"HMI","deltaHmi","TFT 4,3 inch, 480 × 272","RS-232 và RS-485","Nguồn 24 VDC","1.987.040 ₫ chưa VAT","https://hoplongtech.com/products/dop-103bq"],
    ["AUT-105","delta-dop-107bv","HMI Delta DOP-107BV 7 inch","DOP-107BV",2315000,"HMI","deltaHmi","TFT 7 inch, 800 × 480","RS-232 và RS-485","Nguồn 24 VDC","2.103.970 ₫ chưa VAT","https://hoplongtech.com/products/dop-107bv"],
    ["AUT-106","delta-dop-107eg","HMI Ethernet Delta DOP-107EG 7 inch","DOP-107EG",5937000,"HMI","deltaHmi","TFT 7 inch, 800 × 600","RS-232/422/485 và USB host","Nguồn 24 VDC","5.396.600 ₫ chưa VAT","https://hoplongtech.com/products/dop-107eg"],
    ["AUT-107","delta-dop-110cs","HMI Delta DOP-110CS 10 inch","DOP-110CS",5272000,"HMI","deltaHmi","TFT 10 inch, 1024 × 600","RS-232/422/485, USB host","Nguồn 24 VDC","4.792.260 ₫ chưa VAT","https://hoplongtech.com/products/dop-110cs"],
    ["AUT-108","delta-dop-110ws","HMI Delta DOP-110WS 10 inch","DOP-110WS",7586000,"HMI","deltaHmi","TFT 10 inch, 1024 × 600","RS-232C, RS-485 và USB","Nguồn 24 VDC","6.896.230 ₫ chưa VAT","https://hoplongtech.com/products/dop-110ws"],
    ["AUT-109","delta-dop-112wx","HMI Delta DOP-112WX 12 inch","DOP-112WX",18290000,"HMI","deltaHmi","TFT 12 inch, 1024 × 768","RS-422/485, USB host/slave","Nguồn 24 VDC","16.626.940 ₫ chưa VAT","https://hoplongtech.com/products/dop-112wx"],
    ["AUT-110","delta-asd-b3-0121-e","Servo drive EtherCAT Delta ASDA-B3 100 W","ASD-B3-0121-E",6141000,"Servo","deltaServo","100 W, 1 pha/3 pha 220 VAC","EtherCAT, analog và PR mode","Băng thông 3,1 kHz, encoder 24-bit","5.582.390 ₫ chưa VAT","https://hoplongtech.com/products/asd-b3-0121-e"],
    ["AUT-111","delta-ecm-b3m-c20604ss1","Động cơ servo Delta B3 400 W có phanh","ECM-B3M-C20604SS1",5339000,"Servo","deltaServo","400 W, 200 V, 3.000 vòng/phút","Encoder tuyệt đối 24-bit","Có phanh và vành chống dầu","4.854.300 ₫ chưa VAT","https://hoplongtech.com/products/ecm-b3m-c20604ss1"],
  ].map(([id,slug,name,model,price,subcategory,image,d1,d2,d3,source,sourceUrl]) => ({ id,slug,name,model,brand:"Delta",origin:"Đài Loan",category:"Tự động hóa & điều khiển",subcategory,price,image,summary:`Thiết bị tự động hóa Delta ${model} cho máy móc và dây chuyền sản xuất.`,details:[d1,d2,d3],manufacturerUrl:sourceUrl,imageSourceUrl:sourceUrl,priceSourceLabel:"Hợp Long Việt Nam",priceSourceUrl:sourceUrl,priceSourceValue:source })),
];

export const expandedProducts = products.map(makeProduct);
