import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { formatDateOnly, formatTimeOnly } from "./dateFormat";

export function buildOrderPdf({
  invoiceNumber,
  items,
  subtotal,
  tax,
  total,
  paymentMethod,
  orderStatus,
  paymentStatus,
  formatCurrency,
  createdAt,
}) {
  const doc = new jsPDF();
  const date = formatDateOnly(createdAt);
  const time = formatTimeOnly(createdAt);

  doc.setFontSize(20);
  doc.text("Ferreteria Elupina", 14, 18);

  doc.setFontSize(12);
  doc.text("Factura Provisional", 14, 28);
  doc.text(`Factura No.: ${invoiceNumber}`, 14, 38);
  doc.text(`Fecha: ${date}`, 14, 46);
  doc.text(`Hora: ${time}`, 14, 54);
  doc.text("Modalidad: Retiro en tienda (Pick Up)", 14, 62);

  let nextY = 70;

  if (paymentMethod) {
    doc.text(`Metodo de pago: ${paymentMethod}`, 14, nextY);
    nextY += 8;
  }

  if (orderStatus) {
    doc.text(`Estado de orden: ${orderStatus}`, 14, nextY);
    nextY += 8;
  }

  if (paymentStatus) {
    doc.text(`Estado de pago: ${paymentStatus}`, 14, nextY);
    nextY += 8;
  }

  autoTable(doc, {
    startY: nextY + 4,
    head: [["Producto", "Cantidad", "Precio", "Subtotal"]],
    body: items.map((item) => [
      item.product_name,
      item.quantity,
      formatCurrency(item.unit_price ?? item.sale_price),
      formatCurrency(
        item.line_total ??
          Number(item.unit_price ?? item.sale_price ?? 0) *
            Number(item.quantity || 0)
      ),
    ]),
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [24, 59, 89],
    },
  });

  const finalY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(11);
  doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 14, finalY);
  doc.text(`ITBIS 18%: ${formatCurrency(tax)}`, 14, finalY + 8);
  doc.text(`Total: ${formatCurrency(total)}`, 14, finalY + 16);

  doc.setFontSize(9);
  doc.text(
    "Esta factura es provisional. El pedido debe ser confirmado al momento del retiro en tienda.",
    14,
    finalY + 32
  );

  doc.text(
    "Ferreteria Elupina no realiza delivery ni envios. Solo retiro en tienda.",
    14,
    finalY + 40
  );

  return doc;
}
