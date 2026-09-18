import type { Product, ProductVariant, QuoteItem } from '../../src/types';
export function variantLabel(variant?: ProductVariant): string;
export function quoteLineKey(item: QuoteItem): string;
export function summarizeProduct(product: Product): Product;
export function variantProduct(product: Product, variant?: ProductVariant): Product;
export function validateVariants(product: Product): string;
export function resolveQuoteItem(products: Product[], item: QuoteItem): {product?: Product; variant?: ProductVariant; variantId?: string};
export function quoteItemLabel(products: Product[], item: QuoteItem): string;
export function prepareQuoteItems(products: Product[], items: QuoteItem[]): QuoteItem[];
