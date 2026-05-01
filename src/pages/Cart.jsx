import { useState } from "react";
import { Trash2, X, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

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

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setShowCheckoutDetail(true);
  };

  const confirmOrder = () => {
    alert("Orden confirmada correctamente. Recuerda que el pedido es solo para Pick Up.");
    clearCart();
    setShowCheckoutDetail(false);
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

            <button className="checkout-button" onClick={handleCheckout}>
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
                <article className="checkout-detail-item" key={item.product_id}>
                  <span>{item.product_name}</span>
                  <small>
                    {item.quantity} x {formatCurrency(item.sale_price)}
                  </small>
                  <strong>
                    {formatCurrency(Number(item.sale_price) * item.quantity)}
                  </strong>
                </article>
              ))}
            </div>

            <div className="checkout-detail-summary">
              <p>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </p>

              <p>
                <span>ITBIS 18%</span>
                <strong>{formatCurrency(tax)}</strong>
              </p>

              <p>
                <span>Envío</span>
                <strong>No disponible</strong>
              </p>

              <p className="checkout-detail-total">
                <span>Total a pagar</span>
                <strong>{formatCurrency(total)}</strong>
              </p>
            </div>

            <div className="checkout-payment-detail">
              <h3>Método de pago</h3>

              <p>
                {paymentMethod === "efectivo"
                  ? "Efectivo al retirar en tienda."
                  : "Transferencia bancaria."}
              </p>

              {paymentMethod === "transferencia" && (
                <div className="checkout-bank-list">
                  {bankAccounts.map((account) => (
                    <div key={account.accountNumber}>
                      <strong>{account.bank}</strong>
                      <p>{account.type}</p>
                      <p>Cuenta: {account.accountNumber}</p>
                      <p>A nombre de: {account.accountName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pickup-notice">
              El pedido será preparado para retiro en tienda. No realizamos
              delivery ni envíos.
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={confirmOrder}
            >
              Confirmar orden
            </button>
          </div>
        </section>
      )}
    </main>
  );
}