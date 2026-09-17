import {
  ArrowLeft,
  Check,
  ExternalLink,
  FilePlus2,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { ProductArt } from "../components/ProductArt";
import { useStore } from "../store/StoreContext";
import type { Product } from "../types";
import { formatPrice } from "../utils/productFormat";
import { formatDate } from "../utils/dateFormat";

export function ProductDetailPage({
  product,
  navigate,
  onQuote,
}: {
  product: Product;
  navigate: (path: string) => void;
  onQuote: () => void;
}) {
  const { addToQuote, settings } = useStore();

  return (
    <main>
      <section className="product-detail">
        <div className="container">
          <button
            className="back-link"
            onClick={() =>
              navigate(
                `/san-pham?category=${encodeURIComponent(product.category)}`,
              )
            }
          >
            <ArrowLeft /> Quay lại danh mục
          </button>
          <div className="detail-grid">
            <div>
              <ProductArt product={product} large />
              {product.imageSourceUrl && (
                <a
                  className="image-credit"
                  href={product.imageSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ảnh minh họa model/dòng sản phẩm · Xem nguồn <ExternalLink />
                </a>
              )}
            </div>
            <div className="detail-copy">
              <span className="eyebrow">
                {product.category} · {product.subcategory}
              </span>
              <h1>{product.name}</h1>
              <p className="detail-model">
                {product.brand} / {product.model}
              </p>
              <p className="detail-summary">{product.summary}</p>
              <div className="detail-price">
                <small>{product.priceMode === "contact" ? "Báo giá theo yêu cầu" : "Giá bán tại Việt Nam · đã gồm VAT"}</small>
                <strong>{formatPrice(product)}</strong>
                <span>
                  {product.priceNote ??
                    "Giá cuối cùng phụ thuộc cấu hình, số lượng và thời điểm đặt hàng."}
                </span>
                {product.priceUpdatedAt && (
                  <span>Cập nhật: {formatDate(product.priceUpdatedAt)}</span>
                )}
              </div>
              <ul>
                {product.highlights.map((item) => (
                  <li key={item}>
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="primary-button"
                onClick={() => { addToQuote(product.id); onQuote() }}
              >
                <FilePlus2 /> Yêu cầu báo giá thiết bị này
              </button>
              <div className="contact-actions"><a className="secondary-button" href={`tel:${settings.phone.replace(/\D/g, "")}`}>Gọi {settings.phone}</a><a className="secondary-button" href={`https://zalo.me/${settings.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Chat Zalo</a></div>
              <p className="catalog-note">Thời gian cung cấp: {product.leadTime}. Vui lòng xác nhận tình trạng hàng trước khi đặt.</p>
              <a className="text-button" href="/huong-dan-mua-hang">Giao nhận, bảo hành & hướng dẫn đặt hàng</a>
              <div className="detail-trust">
                <span>
                  <ShieldCheck /> Bảo hành {product.warranty}
                </span>
                <span>
                  <Headphones /> Hỗ trợ kỹ thuật
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container detail-info">
          <div>
            <span className="eyebrow">THÔNG SỐ ĐỐI CHIẾU</span>
            <h2>Thông tin sản phẩm</h2>
            <dl>
              {product.specifications.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
              <div>
                <dt>Thời gian cung cấp</dt>
                <dd>{product.leadTime}</dd>
              </div>
            </dl>
            <div className="source-links">
              {product.manufacturerUrl && (
                <a
                  href={product.manufacturerUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Trang sản phẩm <ExternalLink />
                </a>
              )}
              {product.datasheetUrl && (
                <a href={product.datasheetUrl} target="_blank" rel="noreferrer">
                  Datasheet / tài liệu kỹ thuật <ExternalLink />
                </a>
              )}
            </div>
          </div>
          <div>
            <span className="eyebrow">ỨNG DỤNG</span>
            <h2>Phù hợp cho</h2>
            <div className="application-list">
              {product.applications.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <p className="technical-note">
              DTPT Techs sẽ xác nhận đúng phiên bản, phụ kiện, giao thức, điều
              kiện bảo hành và thời gian giao trong báo giá chính thức.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
