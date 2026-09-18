import { ArrowUpRight, FilePlus2 } from "lucide-react";
import { useStore } from '../store/StoreContext';
import type { Product } from "../types";
import { formatPrice } from "../utils/productFormat";
import { ProductArt } from "./ProductArt";

export function ProductCard({
  product,
  navigate,
  add,
}: {
  product: Product;
  navigate: (path: string) => void;
  add: (id: string) => void;
}) {
  const { quoteItems } = useStore();
  const added = quoteItems.some(item => item.productId === product.id);
  return (
    <article className="product-card">
      <a
        href={`/san-pham/${product.slug}`}
        className="product-card__visual"
        onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey) { event.preventDefault(); navigate(`/san-pham/${product.slug}`) } }}
        aria-label={`Xem ${product.name}`}
      >
        <ProductArt product={product} />
        {product.badge && <span className="badge">{product.badge}</span>}
      </a>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <span>{product.origin}</span>
        </div>
        <a
          href={`/san-pham/${product.slug}`}
          className="product-card__title"
          onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey) { event.preventDefault(); navigate(`/san-pham/${product.slug}`) } }}
        >
          {product.name}
        </a>
        {added && <small role="status">Đã thêm vào danh sách báo giá ở đầu trang.</small>}
        <p className="model">{product.model}</p>
        <p>{product.summary}</p>
        <div className="product-card__footer">
          <div>
            <small>{product.priceMode === "contact" ? "Báo giá theo yêu cầu" : product.priceBasis === "market-reference" ? "Giá tham khảo tại Việt Nam" : product.priceBasis === "store-price" ? "Giá niêm yết" : "Giá bán · đã gồm VAT"}</small>
            <strong>{formatPrice(product)}</strong>
          </div>
          <div className="card-actions">
            <button
              className="icon-button"
              onClick={() => navigate(`/san-pham/${product.slug}`)}
              aria-label="Xem chi tiết"
            >
              <ArrowUpRight />
            </button>
            <button
              className="primary-button primary-button--compact"
              onClick={() => product.variants?.length ? navigate(`/san-pham/${product.slug}`) : add(product.id)}
            >
              <FilePlus2 /> {product.variants?.length ? "Chọn cấu hình" : added ? "Thêm nữa" : "Thêm báo giá"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
