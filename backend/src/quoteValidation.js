export function validateQuoteRequest(payload) {
  const raw = payload?.customer;
  const customer = Object.fromEntries(['name', 'company', 'phone', 'email', 'note'].map(key => [key, typeof raw?.[key] === 'string' ? raw[key].trim() : '']));
  if (!customer.name || !customer.phone) return { error: 'Vui lòng nhập họ tên và số điện thoại.' };
  if (!/^[+\d\s().-]+$/.test(customer.phone) || customer.phone.replace(/\D/g, '').length < 9 || customer.phone.replace(/\D/g, '').length > 15) return { error: 'Số điện thoại cần có từ 9 đến 15 chữ số.' };
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return { error: 'Địa chỉ email không hợp lệ.' };
  if (customer.name.length > 100 || customer.company.length > 160 || customer.phone.length > 30 || customer.email.length > 160 || customer.note.length > 4000) return { error: 'Thông tin vượt quá độ dài cho phép.' };
  const items = payload?.items;
  if (!Array.isArray(items) || items.length > 50 || items.some(item => !item || typeof item.productId !== 'string' || (item.variantId !== undefined && (typeof item.variantId !== 'string' || item.variantId.length > 100)) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999)) return { error: 'Sản phẩm hoặc số lượng không hợp lệ.' };
  if (!items.length && customer.note.length < 10) return { error: 'Vui lòng mô tả nhu cầu ít nhất 10 ký tự khi chưa chọn thiết bị.' };
  return { customer, items };
}
