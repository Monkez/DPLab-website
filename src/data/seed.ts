import type { QuoteRequest, StoreSettings } from "../types";
import { industrialCategories } from "./industrialTaxonomy";
export { verifiedProducts as seedProducts } from "./verifiedProducts";

export const seedQuotes: QuoteRequest[] = [];

export const seedSettings: StoreSettings = {
  storeName: "DTPT Techs",
  slogan: "Công nghệ tiên tiến. Giá trị bền vững.",
  logoStyle: "wide",
  logoRoundSrc: "/dp-lab-logo.png",
  logoWideSrc: "/dtpt-techs-logo.png",
  phone: "0906 094 313",
  address: "Tầng 5, V11-B09, KĐT mới An Hưng, P. La Khê, Hà Đông, Hà Nội",
  email: "hello@dtpt.tech",
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
