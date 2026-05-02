import { useState } from "react";
import { Trash2, X, CheckCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useCart } from "../context/CartContext";
import { check_stock_availablity, get_customer_info, insert_orders, insert_orders_items } from "../authentication/db_functions";
import { useAuth } from  "../context/AuthContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [showCheckoutDetail, setShowCheckoutDetail] = useState(false);
  const [loading, set_loading] = useState(false)
  const {user} = useAuth();
  const [customer, set_customer] = useState([]);

  const taxRate = 0.18;
  const subtotal = cartTotal;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const bankAccounts = [
    {
      bank: "Banco Popular Dominicano",
      accountName: "Ferretería Elupina SRL",
      accountNumber: "829-456789-001",
      type: "Cuenta Corriente",
    },
    {
      bank: "Banco BHD",
      accountName: "Ferretería Elupina SRL",
      accountNumber: "203-987654-2",
      type: "Cuenta de Ahorro",
    },
    {
      bank: "Banreservas",
      accountName: "Ferretería Elupina SRL",
      accountNumber: "960-123456-7",
      type: "Cuenta Corriente",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  const generarFacturaProvisionalPDF = () => {
    const doc = new jsPDF();

    const numeroFactura = `FE-${Date.now()}`;
    const fecha = new Date().toLocaleDateString("es-DO");
    const hora = new Date().toLocaleTimeString("es-DO");

    doc.setFontSize(20);
    doc.text("Ferreteria Elupina", 14, 18);

    doc.setFontSize(12);
    doc.text("Factura Provisional", 14, 28);
    doc.text(`Factura No.: ${numeroFactura}`, 14, 38);
    doc.text(`Fecha: ${fecha}`, 14, 46);
    doc.text(`Hora: ${hora}`, 14, 54);
    doc.text("Modalidad: Retiro en tienda (Pick Up)", 14, 62);
    doc.text(
      `Método de pago: ${
        paymentMethod === "efectivo" ? "Efectivo al retirar" : "Transferencia bancaria"
      }`,
      14,
      70
    );

    autoTable(doc, {
      startY: 82,
      head: [["Producto", "Cantidad", "Precio", "Subtotal"]],
      body: cartItems.map((item) => [
        item.product_name,
        item.quantity,
        formatCurrency(item.sale_price),
        formatCurrency(Number(item.sale_price) * Number(item.quantity)),
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
      "Ferreteria Elupina no realiza delivery ni envíos. Solo retiro en tienda.",
      14,
      finalY + 40
    );

    doc.save(`factura-provisional-${numeroFactura}.pdf`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setShowCheckoutDetail(true);
  };

  const confirmOrder = async () => {
    set_loading(true);
    let errors = false

    for (const item of cartItems) {
      
      try {
        const response = await check_stock_availablity(item.product_id, item.quantity)
      } catch (error) {
        if (error.message === "No Hay Stock Suficiente") {
          alert("No Hay Stock Suficiente Para Producto: " + item.product_name);
          errors = true
        }
      }
    }
    
    if (!errors) {

      try {
        const response_customer = await get_customer_info(user.user_id)
        set_customer(response_customer)

        try {
          const response_order = await insert_orders(customer.customer_id, user.user_id, "Online", subtotal, tax, 0, total)
          for (const item of cartItems) { 
            try {
              const res = await insert_orders_items(response_order, item.product_id, item.quantity, item.sale_price, 0, item.quantity * item.sale_price, user.user_id)
            } catch (error) {
              console.log(error)
            }
          }
        } catch (error) {
          console.log(error)  
        }
      } catch (error) {
        console.log(error)
      }

      generarFacturaProvisionalPDF();

    alert(
      "Orden confirmada correctamente. Se generó una factura provisional en PDF."
    );
  
    clearCart();
      setShowCheckoutDetail(true);
      set_loading(false);
    }

  };

  return (
    <main className="cart-page">
      <section className="cart-header">
        <h1>Carrito de compra</h1>
        <p>
          Revisa tus artículos antes de finalizar. Actualmente solo trabajamos
          con retiro en tienda (Pick Up).
        </p>
      </section>

      {cartItems.length === 0 ? (
        <section className="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para continuar con tu compra.</p>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.product_id}>
                <img
                  src={item.image_url || "/placeholder-product.png"}
                  alt={item.product_name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h2>{item.product_name}</h2>
                  <p>{item.description}</p>

                  <span className="cart-price">
                    {formatCurrency(item.sale_price)}
                  </span>
                </div>

                <div className="cart-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>

          <aside className="checkout-box">
            <h2>Resumen de compra</h2>

            <div className="checkout-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>

            <div className="checkout-row">
              <span>ITBIS 18%</span>
              <strong>{formatCurrency(tax)}</strong>
            </div>

            <div className="checkout-row">
              <span>Envío</span>
              <strong>No disponible</strong>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <div className="pickup-notice">
              Solo disponible para retiro en tienda. No realizamos delivery ni
              envíos.
            </div>

            <div className="payment-methods">
              <h3>Método de pago</h3>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="efectivo"
                  checked={paymentMethod === "efectivo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Efectivo al retirar
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="transferencia"
                  checked={paymentMethod === "transferencia"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Transferencia bancaria
              </label>
            </div>

            {paymentMethod === "transferencia" && (
              <div className="bank-info">
                <h3>Cuentas disponibles</h3>

                {bankAccounts.map((account) => (
                  <div className="bank-account" key={account.accountNumber}>
                    <strong>{account.bank}</strong>
                    <p>{account.type}</p>
                    <p>Cuenta: {account.accountNumber}</p>
                    <p>A nombre de: {account.accountName}</p>
                  </div>
                ))}

                <small>
                  Luego de realizar la transferencia, conserva tu comprobante.
                </small>
              </div>
            )}

            <button
              type="button"
              className="checkout-button"
              onClick={handleCheckout}
            >
              Finalizar compra
            </button>
          </aside>
        </section>
      )}

      {showCheckoutDetail && (
        <section className="checkout-modal-overlay">
          <div className="checkout-modal">
            <button
              type="button"
              className="checkout-modal-close"
              onClick={() => setShowCheckoutDetail(false)}
            >
              <X size={22} />
            </button>

            <div className="checkout-modal-header">
              <CheckCircle size={34} />
              <div>
                <h2>Confirmar compra</h2>
                <p>Revisa los detalles antes de confirmar tu orden.</p>
              </div>
            </div>

            <div className="checkout-detail-items">
              {cartItems.map((item) => (
                <div className="checkout-detail-item" key={item.product_id}>
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>

                  <strong>
                    {formatCurrency(
                      Number(item.sale_price) * Number(item.quantity)
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-detail-total">
              <span>Total a pagar</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <p className="checkout-detail-note">
              Al confirmar, se generará una factura provisional en PDF. El
              pedido debe ser retirado en tienda.
            </p>

            <button
              type="button"
              className="checkout-button"
              onClick={confirmOrder}
              disabled={loading}
            >
              {loading ? "Confirmando..." : " Hacer pedido y generar factura"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}