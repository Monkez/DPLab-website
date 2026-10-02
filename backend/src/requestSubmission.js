import crypto from 'node:crypto'
import { Router } from 'express'
import { prepareQuoteItems } from './productVariants.js'
import { validateQuoteRequest } from './quoteValidation.js'
import { prepareOrderItems, validateOrderRequest } from './orderValidation.js'

// Both request types use the existing JSONB inbox and sales permissions.
export function createRequestSubmissionRouter({ listProducts, saveQuote }) {
  const router = Router()
  for (const requestType of ['quote', 'order']) {
    router.post(requestType === 'order' ? '/orders' : '/quotes', async (req, res, next) => {
      try {
        const result = (requestType === 'order' ? validateOrderRequest : validateQuoteRequest)(req.body)
        if (result.error) return res.status(400).json({ message: result.error })
        const products = await listProducts()
        let items
        try {
          items = (requestType === 'order' ? prepareOrderItems : prepareQuoteItems)(products, result.items)
        } catch (error) { return res.status(400).json({ message: error.message }) }
        const request = {
          id: `${requestType === 'order' ? 'ORD' : 'RFQ'}-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${crypto.randomBytes(6).toString('hex')}`,
          createdAt: new Date().toISOString(), requestType, customer: result.customer, items, status: 'new',
          ...(requestType === 'order' ? { shippingIncluded: false } : {}),
        }
        res.status(201).json(await saveQuote(request))
      } catch (error) { next(error) }
    })
  }
  return router
}
