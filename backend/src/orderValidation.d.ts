import type { CustomerInfo, Product, QuoteItem } from '../../src/types';
export function validateOrderRequest(payload: unknown): { error: string; customer?: never; items?: never } | { error?: never; customer: CustomerInfo; items: QuoteItem[] };
export function prepareOrderItems(products: Product[], items: QuoteItem[]): QuoteItem[];
