export const invoiceTemplate = ({
  logoUrl,
  order,
  invoiceNo,
  invoiceDate,
  delivery_charges,
  amountWords,
}) => {
  const { _id, items, address, date, paymentMethod } = order;

  const subtotal = items.reduce((sum, i) => sum + i.sellprice * i.quantity, 0);

  const cgst = +(subtotal * 0.09).toFixed(2);
  const sgst = +(subtotal * 0.09).toFixed(2);
  const total = +(subtotal - (cgst + sgst)).toFixed(2);
  const grandtotal = (total + cgst + sgst + delivery_charges).toFixed(2);

  const itemRows = items
    .map(
      (item, index) => `
      <tr>
        <td class="tdItem">${index + 1}</td>
        <td>${item.name}</td>
        <td class="tdItem">${item.quantity}</td>
        <td class="tdItem">₹${
          (item.sellprice - (item.sellprice * 0.18).toFixed(2)) * item.quantity
        }</td>
        <td class="tdItem">₹${
          (item.sellprice * 0.18).toFixed(2) * item.quantity
        }</td>
        <td class="tdItem">₹${item.sellprice * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; color: #111; padding: 30px; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 10px; }
  .logo { height: 45px; }
  .title { text-align: right; }
  .section { margin-top: 18px; }
  .flex { display: flex; justify-content: space-between; gap: 20px; }
  .box { border: 1px solid #ddd; padding: 10px; width: 100%; }
  table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  th, td { border: 1px solid #ddd; padding: 8px;}
  .tdItem {text-align: center;}
  th { background: #f5f5f5; }
  .right { text-align: right; }
  .total { font-weight: bold; }
</style>
</head>

<body>

<!-- HEADER -->
<div class="header">
  <img src="${logoUrl}" class="logo" />
  <b>(Development Mode)</b>
  <div class="title">
    <h2>Bill of Supply</h2>
    <p>(Original for Recipient)</p>
    <p>${paymentMethod === "COD" ? "Cash on Delivery" : "Paid Order"}</p>
  </div>
</div>

<!-- SELLER -->
<div class="section box">
  <strong>Sold By:</strong><br/>
  <b>M Crystal Store</b><br/>
  Hitech city, <br/>
  Hyderabad, Telangana – 500081<br/>
  GSTIN: 36ABCDE1234F1Z5
</div>

<!-- ORDER DETAILS -->
<div class="section flex">
  <div class="box">
    <b>Order ID:</b> ${_id}<br/>
    <b>Order Date:</b> ${new Date(date).toLocaleDateString()}
  </div>
  <div class="box">
    <b>Invoice No:</b> ${invoiceNo}<br/>
    <b>Invoice Date:</b> ${invoiceDate}
  </div>
</div>

<!-- BILLING & SHIPPING -->
<div class="section flex">
  <div class="box">
    <b>Billing Address</b><br/>
    ${address.firstName} ${address.lastName}<br/>
    ${address.street}<br/>
    ${address.city}, ${address.state} – ${address.pincode} <br/>
    ${address.email},<br/>
    ${address.phone}.
  </div>

  <div class="box">
    <b>Shipping Address</b><br/>
    ${address.firstName} ${address.lastName}<br/>
    ${address.street}<br/>
    ${address.city}, ${address.state} – ${address.pincode} <br/>
    ${address.email},<br/>
    ${address.phone}.
  </div>
</div>

<!-- ITEMS -->
<table>
<thead>
<tr>
  <th>#</th>
  <th>Description</th>
  <th>Qty</th>
  <th>Unit Price</th>
  <th>Tax (18%)</th>
  <th>Total</th>
</tr>
</thead>
<tbody>
${itemRows}
</tbody>
</table>

<!-- TOTALS -->
<table>
<tr>
  <td class="right">Subtotal</td>
  <td class="right">₹${subtotal - (cgst + sgst)}</td>
</tr>
<tr>
  <td class="right">CGST (9%)</td>
  <td class="right">₹${cgst}</td>
</tr>
<tr>
  <td class="right">SGST (9%)</td>
  <td class="right">₹${sgst}</td>
</tr>
<tr>
  <td class="right">Delivery Fee</td>
  <td class="right">₹${delivery_charges}</td>
</tr>
<tr class="total">
  <td class="right">Grand Total</td>
  <td class="right">₹${grandtotal}</td>
</tr>
</table>
<div class="section box">
    <strong>Amount in Words:</strong><br/>
    ${amountWords}
  </div>
<p style="font-size:11px;color:#777">
  This document is generated for development and testing purposes only and does not represent a legally valid tax invoice or bill receipt.
</p>
</body>
</html>
`;
};
