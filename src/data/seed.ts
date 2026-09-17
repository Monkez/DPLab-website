import type { QuoteRequest, StoreSettings } from "../types";
import { industrialCategories } from "./industrialTaxonomy";
export { seedArticles } from "../../backend/src/articleSeed.js";
export { verifiedProducts as seedProducts } from "./verifiedProducts";

export const seedQuotes: QuoteRequest[] = [];

export const seedSettings: StoreSettings = {
  storeName: "DTPT Techs",
  slogan: "Thiết bị đo lường và tự động hóa",
  logoStyle: "wide",
  logoRoundSrc: "/dp-lab-logo.png",
  logoWideSrc: "/dtpt-techs-logo.png",
  faviconSrc: "/dp-lab-logo.png",
  phone: "0903 463 185",
  address: "Tầng 4, số 146 Trần Vỹ, Phường Phú Diễn, TP Hà Nội",
  email: "dtpttechs@gmail.com",
  facebook: "facebook.com/dtpt.techs",
  categories: industrialCategories,
  visibility: {
    announcement: true, hero: true, categories: true, featuredProducts: true,
    capabilities: true, contact: true, footer: true, floatingContact: true, search: true,
  },
  appearance: {
    primaryColor: "#086ad8",
    secondaryColor: "#00a7c7",
    productsPerRow: 4,
    cardStyle: "comfortable",
  },
  content: {
    announcementPrimary:
      "Thiết bị đo lường, điều khiển và máy tính công nghiệp",
    announcementSecondary:
      "Tư vấn kỹ thuật cho doanh nghiệp, nhà máy và viện nghiên cứu",
    navProducts: "Sản phẩm",
    navSolutions: "Lĩnh vực",
    navWhy: "Về DTPT Techs",
    navContact: "Liên hệ",
    heroBadge: "DTPT TECHS · THIẾT BỊ CÔNG NGHIỆP",
    heroTitle: "Thiết bị đo lường",
    heroHighlight: "và tự động hóa",
    heroDescription:
      "DTPT Techs cung cấp máy tính công nghiệp, camera, cảm biến và thiết bị đo kiểm cho nhà máy, phòng nghiên cứu. Liên hệ để chọn model, kiểm tra cấu hình và nhận báo giá.",
    heroPrimaryAction: "Xem sản phẩm",
    heroSecondaryAction: "Liên hệ tư vấn",
    trustQuality: "Thông số theo tài liệu hãng",
    trustPrice: "Báo giá theo cấu hình",
    trustSupport: "Hỗ trợ kỹ thuật",
    service1Title: "Thiết bị công nghiệp",
    service1Description: "Máy tính, cảm biến, bộ điều khiển và thiết bị đo",
    service2Title: "Tài liệu sản phẩm",
    service2Description: "Tra cứu thông số và tài liệu kỹ thuật của hãng",
    service3Title: "Tư vấn chọn thiết bị",
    service3Description: "Chọn model theo ứng dụng và cấu hình cần dùng",
    service4Title: "Hỗ trợ sử dụng",
    service4Description: "Hỗ trợ trước và sau bán hàng",
    productsEyebrow: "SẢN PHẨM",
    productsTitle: "Thiết bị nổi bật",
    productsDescription:
      "Module I/O, máy hiện sóng, PLC và các thiết bị trong danh mục. Chọn sản phẩm để xem thông số và hỏi báo giá.",
    whyEyebrow: "TƯ VẤN & HỖ TRỢ",
    whyTitle: "Hỗ trợ chọn và sử dụng thiết bị",
    whyDescription:
      "DTPT Techs tiếp nhận yêu cầu, trao đổi cấu hình và báo giá trước khi đặt hàng. Bạn có thể gửi model đang dùng hoặc thông số cần tìm để được tư vấn.",
    why1Title: "Kiểm tra thông số",
    why1Description:
      "Đối chiếu nguồn cấp, giao tiếp, dải đo và điều kiện sử dụng theo tài liệu của từng model.",
    why2Title: "Báo giá theo yêu cầu",
    why2Description:
      "Làm rõ cấu hình, số lượng, phụ kiện và thời gian cần hàng để chuẩn bị báo giá.",
    why3Title: "Tư vấn kỹ thuật",
    why3Description:
      "Trao đổi cách kết nối thiết bị với máy móc, phần mềm hoặc hệ thống hiện có.",
    why4Title: "Giao hàng và bảo hành",
    why4Description:
      "Xác nhận lịch giao, phạm vi bảo hành và đầu mối hỗ trợ trong báo giá hoặc hợp đồng.",
    contactEyebrow: "LIÊN HỆ",
    contactTitle: "Cần tư vấn hoặc báo giá?",
    contactSubtitle:
      "Gửi model, số lượng hoặc mô tả công việc cần dùng thiết bị. DTPT Techs sẽ liên hệ để trao đổi chi tiết.",
    footerDescription:
      "Cung cấp thiết bị đo lường, tự động hóa và máy tính công nghiệp. Tư vấn cấu hình và báo giá theo yêu cầu.",
  },
};
