import { ArrowUpRight, FilePlus2 } from "lucide-react";
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
  return (
    <article className="product-card">
      <button
        className="product-card__visual"
        onClick={() => navigate(`/san-pham/${product.slug}`)}
        aria-label={`Xem ${product.name}`}
      >
        <ProductArt product={product} />
        {product.badge && <span className="badge">{product.badge}</span>}
      </button>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category}</span>
          <span>{product.origin}</span>
        </div>
        <button
          className="product-card__title"
          onClick={() => navigate(`/san-pham/${product.slug}`)}
        >
          {product.name}
        </button>
        <p className="model">{product.model}</p>
        <p>{product.summary}</p>
        <div className="product-card__footer">
          <div>
            <small>Giá bán · đã gồm VAT</small>
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
              onClick={() => add(product.id)}
            >
              <FilePlus2 /> Thêm yêu cầu
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
