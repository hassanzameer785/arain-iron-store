/**
 * Invoice Generator
 * Generates a simple HTML invoice string for an order.
 * Can be rendered in browser or converted to PDF via puppeteer.
 */
const generateInvoiceHTML = (order) => {
  const rows = order.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity} ${item.unit}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">Rs. ${item.price.toLocaleString()}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: 800; color: #ea580c; }
    .invoice-meta { text-align: right; color: #666; font-size: 14px; }
    .badge { background: #ea580c; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    thead { background: #f9fafb; }
    th { padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
    .total-row td { padding: 12px; font-weight: 700; font-size: 16px; border-top: 2px solid #ea580c; }
    .footer { margin-top: 48px; text-align: center; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Arain Iron Store Vehova</div>
      <div style="color:#6b7280;font-size:13px;margin-top:4px;">Arain Brothers & Sons<br/>Vehova, Pakistan<br/>+92 300 0000000</div>
    </div>
    <div class="invoice-meta">
      <div style="font-size:28px;font-weight:800;color:#111;">INVOICE</div>
      <div style="margin:8px 0;"><span class="badge">#${order.orderNumber}</span></div>
      <div>Date: ${new Date(order.createdAt).toLocaleDateString('en-PK')}</div>
      <div style="margin-top:8px;font-weight:600;">Payment: <span style="color:${order.paymentStatus === 'paid' ? '#16a34a' : '#dc2626'}">${order.paymentStatus.toUpperCase()}</span></div>
    </div>
  </div>

  <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px;">
    <div style="font-size:12px;text-transform:uppercase;color:#6b7280;margin-bottom:4px;">Bill To</div>
    <div style="font-weight:600;">${order.customer?.name || 'Customer'}</div>
    <div style="color:#6b7280;font-size:14px;">${order.customer?.email || ''}</div>
    ${order.shippingAddress ? `<div style="color:#6b7280;font-size:14px;margin-top:4px;">${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}</div>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Unit Price</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="3" style="text-align:right;">Grand Total</td>
        <td style="text-align:right;color:#ea580c;">Rs. ${order.totalAmount.toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    <p>Thank you for choosing Arain Iron Store Vehova — Quality You Can Trust Since 1998</p>
    <p style="margin-top:4px;">WhatsApp: +92 300 0000000 | Email: info@arainiron.com</p>
  </div>
</body>
</html>`;
};

module.exports = { generateInvoiceHTML };
