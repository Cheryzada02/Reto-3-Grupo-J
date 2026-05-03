import { useEffect, useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Link } from "react-router-dom";

import { get_products } from "../authentication/db_functions";

const quickQuestions = [
  "Cual es el horario?",
  "Hacen delivery?",
  "Donde estan ubicados?",
  "Como compro un producto?",
  "Que metodos de pago aceptan?",
];

const initialMessages = [
  {
    from: "bot",
    text: "Hola, soy el asistente de Ferreteria Elupina. Puedes preguntarme por horarios, ubicacion, retiro en tienda, pagos o buscar productos.",
  },
];

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [messageText, setMessageText] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await get_products();
        const activeProducts = Array.isArray(data)
          ? data.filter((item) => item.status === "Activo")
          : [];
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error cargando productos para chatbot:", error);
      }
    };

    loadProducts();
  }, []);

  const productMatchers = useMemo(
    () =>
      products.map((product) => ({
        product,
        searchText: normalizeText(
          `${product.product_name} ${product.description} ${product.department_name} ${product.supplier_name}`
        ),
      })),
    [products]
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));

  const findProducts = (text) => {
    const normalizedMessage = normalizeText(text);
    const words = normalizedMessage
      .split(/\s+/)
      .filter((word) => word.length > 2 && !["producto", "tienen", "buscar", "precio"].includes(word));

    if (!words.length) return [];

    return productMatchers
      .filter(({ searchText }) => words.some((word) => searchText.includes(word)))
      .slice(0, 3)
      .map(({ product }) => product);
  };

  const buildAnswer = (text) => {
    const normalized = normalizeText(text);
    const matches = findProducts(text);

    if (normalized.includes("horario") || normalized.includes("abren") || normalized.includes("cierran")) {
      return {
        text: "Nuestro horario es de lunes a viernes de 8:00 AM a 6:00 PM, sabados de 8:00 AM a 4:00 PM y domingos cerrado.",
      };
    }

    if (normalized.includes("delivery") || normalized.includes("envio") || normalized.includes("envios")) {
      return {
        text: "Por el momento no realizamos delivery ni envios. Las compras son para retiro en tienda (Pick Up).",
      };
    }

    if (normalized.includes("ubicacion") || normalized.includes("direccion") || normalized.includes("donde")) {
      return {
        text: "Puedes ver nuestra ubicacion desde el mapa del footer o escribirnos por WhatsApp al +1 (809) 536-9114 para orientacion.",
      };
    }

    if (normalized.includes("pago") || normalized.includes("transferencia") || normalized.includes("efectivo")) {
      return {
        text: "Aceptamos efectivo al retirar y transferencia bancaria. En el carrito puedes seleccionar el metodo de pago antes de confirmar tu orden.",
      };
    }

    if (normalized.includes("comprar") || normalized.includes("pedido") || normalized.includes("carrito")) {
      return {
        text: "Para comprar, entra al catalogo, agrega productos al carrito y confirma la orden. Luego retiras el pedido en tienda.",
        link: "/productos",
        linkText: "Ver productos",
      };
    }

    if (normalized.includes("favorito") || normalized.includes("favoritos")) {
      return {
        text: "Puedes guardar productos con el boton de corazon y verlos luego en la seccion de favoritos.",
        link: "/favoritos",
        linkText: "Ir a favoritos",
      };
    }

    if (matches.length > 0) {
      return {
        text: `Encontre ${matches.length} producto(s) que podrian ayudarte:`,
        products: matches,
      };
    }

    return {
      text: "Puedo ayudarte con horarios, ubicacion, pagos, retiro en tienda o busqueda de productos. Tambien puedes escribir el nombre de un articulo que estes buscando.",
    };
  };

  const sendMessage = (text = messageText) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const answer = buildAnswer(cleanText);

    setMessages((current) => [
      ...current,
      { from: "user", text: cleanText },
      { from: "bot", ...answer },
    ]);
    setMessageText("");
    setIsOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <section className="chatbot-panel" aria-label="Chat de ayuda">
          <header className="chatbot-header">
            <div className="chatbot-title">
              <span>
                <Bot size={20} />
              </span>
              <div>
                <h2>Asistente Elupina</h2>
                <p>Respuesta rapida</p>
              </div>
            </div>

            <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
              <X size={18} />
            </button>
          </header>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div className={`chatbot-message ${message.from}`} key={`${message.from}-${index}`}>
                <p>{message.text}</p>

                {message.link && (
                  <Link to={message.link} className="chatbot-link" onClick={() => setIsOpen(false)}>
                    {message.linkText}
                  </Link>
                )}

                {message.products && (
                  <div className="chatbot-products">
                    {message.products.map((product) => (
                      <Link
                        to={`/productos/${product.product_id}`}
                        className="chatbot-product"
                        key={product.product_id}
                        onClick={() => setIsOpen(false)}
                      >
                        <img
                          src={product.image_url || "/placeholder-product.png"}
                          alt={product.product_name}
                        />
                        <span>
                          <strong>{product.product_name}</strong>
                          <small>{formatCurrency(product.sale_price)}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chatbot-quick-questions" aria-label="Preguntas frecuentes">
            {quickQuestions.map((question) => (
              <button type="button" key={question} onClick={() => sendMessage(question)}>
                {question}
              </button>
            ))}
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Mensaje para el chatbot"
            />
            <button type="submit" aria-label="Enviar mensaje">
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
