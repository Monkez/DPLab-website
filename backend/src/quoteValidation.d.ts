import type { CustomerInfo, QuoteItem } from '../../src/types';
export function validateQuoteRequest(payload: unknown): { error: string; customer?: never; items?: never } | { error?: never; customer: CustomerInfo; items: QuoteItem[] };
