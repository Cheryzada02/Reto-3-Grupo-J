import { useState } from "react";
import { Trash2 } from "lucide-react";
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(value);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    alert(
      `Orden creada correctamente. Método de pago: ${
        paymentMethod === "efectivo" ? "Efectivo" : "Transferencia bancaria"
      }. Recuerda que el pedido es solo para Pick Up.`
    );

    clearCart();
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
                  src={item.image_url}
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
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
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
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>

            <div className="checkout-row">
              <span>Envío</span>
              <strong>No disponible</strong>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatCurrency(cartTotal)}</strong>
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
                <p>Banco Popular</p>
                <p>Banco BHD</p>
                <p>Banco Reservas</p>
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
    </main>
  );
}