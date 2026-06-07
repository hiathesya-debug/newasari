// WhatsApp number configuration
export const WA_NUMBER = "6281234567890"; // Replace with actual WhatsApp number

/**
 * Parse order information into a WhatsApp message format
 * @param order - Order object to format
 * @returns Formatted message string
 */
export function parseOrder(order: any): string {
  if (!order) return "";
  
  const { id, items, total, customerName } = order;
  
  let message = `Order Details:\n`;
  message += `Order ID: ${id}\n`;
  if (customerName) message += `Customer: ${customerName}\n`;
  
  if (items && Array.isArray(items)) {
    message += `\nItems:\n`;
    items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.name} - Qty: ${item.quantity}\n`;
    });
  }
  
  if (total) message += `\nTotal: Rp${total.toLocaleString("id-ID")}\n`;
  
  return encodeURIComponent(message);
}
