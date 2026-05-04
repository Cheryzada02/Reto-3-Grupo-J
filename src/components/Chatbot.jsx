import { useEffect, useMemo, useState } from "react";
import { Bot, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { Link } from "react-router-dom";

import { get_products } from "../authentication/db_functions";
import { useAuth } from "../context/AuthContext";

const quickQuestions = [
  "Cual es el horario?",
  "Como puedo contactarlos?",
  "Donde estan ubicados?",
  "Que metodos de pago aceptan?",
  "Hacen delivery?",
];

const initialMessages = [
  {
    from: "bot",
    text: "Hola, soy Elupin, tu amigo de confianza en Ferreteria Elupina. Dime que necesitas y te ayudo a encontrar productos relacionados.",
  },
];

const stopWords = new Set([
  "para",
  "como",
  "cual",
  "cuales",
  "quiero",
  "necesito",
  "busco",
  "buscar",
  "tienen",
  "tiene",
  "producto",
  "productos",
  "algo",
  "con",
  "una",
  "uno",
  "unos",
  "unas",
  "del",
  "los",
  "las",
  "que",
  "hay",
]);

const intentGroups = [
  {
    name: "pintura",
    triggers: ["pintar", "pintura", "pared", "brocha", "rodillo", "color", "terminacion"],
    keywords: ["pintura", "brocha", "rodillo", "lija", "masilla", "sellador", "pared"],
    response: "Para trabajos de pintura te recomiendo revisar estos productos:",
  },
  {
    name: "plomeria",
    triggers: ["fuga", "agua", "bano", "baño", "tuberia", "tubería", "llave", "filtracion", "filtración", "plomeria", "plomería"],
    keywords: ["tubo", "tuberia", "llave", "teflon", "sellador", "silicona", "codo", "agua", "bomba"],
    response: "Para plomeria o fugas, estos productos pueden ayudarte:",
  },
  {
    name: "electricidad",
    triggers: ["electrico", "eléctrico", "electricidad", "cable", "bombillo", "breaker", "tomacorriente", "extension"],
    keywords: ["cable", "bombillo", "breaker", "tomacorriente", "extension", "electrico", "interruptor"],
    response: "Para electricidad, encontre estas opciones:",
  },
  {
    name: "herramientas",
    triggers: ["herramienta", "taladro", "martillo", "destornillador", "llave", "cortar", "perforar"],
    keywords: ["taladro", "martillo", "destornillador", "llave", "sierra", "disco", "herramienta"],
    response: "En herramientas, estas opciones pueden servirte:",
  },
  {
    name: "construccion",
    triggers: ["construccion", "construcción", "cemento", "block", "varilla", "obra", "remodelar", "reparacion", "reparación"],
    keywords: ["cemento", "block", "varilla", "arena", "mezcla", "clavo", "tornillo", "madera"],
    response: "Para construccion o reparacion, puedes considerar estos productos:",
  },
  {
    name: "jardin",
    triggers: ["jardin", "jardín", "manguera", "regar", "patio", "plantas"],
    keywords: ["manguera", "pala", "rastrillo", "jardin", "riego"],
    response: "Para jardin o patio, encontre estas alternativas:",
  },
];

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n");

const getWords = (text) =>
  normalizeText(text)
    .split(/\s+/)
    .map((word) => word.replace(/[^\w]/g, ""))
    .filter((word) => word.length > 2 && !stopWords.has(word));

const isSpecificProductSearch = (text) => getWords(text).length > 0;

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [messageText, setMessageText] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const productMatchers = useMemo(
    () =>
      products.map((product) => {
        const stock = Number(product.current_stock ?? product.stock ?? 0);
        const minStock = Number(product.min_stock ?? 0);

        return {
          product,
          stock,
          minStock,
          searchText: normalizeText(
            `${product.product_name} ${product.description} ${product.department_name} ${product.supplier_name}`
          ),
          price: Number(product.sale_price || 0),
        };
      }),
    [products]
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));

  const getStockLabel = (product) => {
    const stock = Number(product.current_stock ?? product.stock ?? 0);
    const minStock = Number(product.min_stock ?? 0);

    if (stock <= 0) return "Agotado";
    if (minStock > 0 && stock <= minStock) return "Pocas unidades";
    return "Disponible";
  };

  const detectIntent = (text) => {
    const normalized = normalizeText(text);
    return intentGroups.find((group) =>
      group.triggers.some((trigger) => normalized.includes(normalizeText(trigger)))
    );
  };

  const rankProducts = (text, options = {}) => {
    const normalized = normalizeText(text);
    const words = getWords(text);
    const intent = options.intent || detectIntent(text);
    const wantsCheap =
      normalized.includes("barato") ||
      normalized.includes("economico") ||
      normalized.includes("menor precio");
    const wantsAvailable =
      normalized.includes("disponible") ||
      normalized.includes("stock") ||
      normalized.includes("hay");

    const rankedProducts = productMatchers
      .map((item) => {
        let score = 0;
        const reasons = [];
        let hasProductMatch = false;

        words.forEach((word) => {
          if (item.searchText.includes(word)) {
            score += 3;
            hasProductMatch = true;
          }
        });

        if (intent) {
          const matchedIntentWords = intent.keywords.filter((keyword) =>
            item.searchText.includes(normalizeText(keyword))
          );

          if (matchedIntentWords.length) {
            score += matchedIntentWords.length * 4;
            hasProductMatch = true;
            reasons.push(`Relacionado con ${intent.name}`);
          }
        }

        if (!hasProductMatch) {
          return {
            product: item.product,
            score: 0,
            reasons,
          };
        }

        if (item.stock > 0) {
          score += 2;
          if (wantsAvailable) reasons.push("Disponible para compra");
        } else {
          score -= 5;
        }

        if (wantsCheap && item.price > 0) {
          score += Math.max(0, 4 - item.price / 1000);
          reasons.push("Opcion economica");
        }

        if (item.minStock > 0 && item.stock > 0 && item.stock <= item.minStock) {
          reasons.push("Pocas unidades");
        }

        return {
          product: item.product,
          score,
          reasons,
        };
      })
      .filter((item) => item.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (wantsCheap) {
      return rankedProducts.sort(
        (a, b) => Number(a.product.sale_price || 0) - Number(b.product.sale_price || 0)
      );
    }

    return rankedProducts;
  };

  const buildProductAnswer = (text) => {
    if (loadingProducts) {
      return {
        text: "Estoy cargando el catalogo. Intenta de nuevo en unos segundos para recomendarte productos reales.",
      };
    }

    const intent = detectIntent(text);
    const matches = rankProducts(text, { intent });

    if (matches.length > 0) {
      return {
        text: intent
          ? intent.response
          : `Encontre ${matches.length} producto(s) relacionado(s) con tu busqueda:`,
        products: matches.map(({ product, reasons }) => ({
          ...product,
          chatbotReason: reasons[0] || getStockLabel(product),
        })),
      };
    }

    if (intent) {
      return {
        text: `No tenemos productos claros para ${intent.name} en este momento. Puedes intentar con otro nombre, marca o revisar el catalogo.`,
        link: "/productos",
        linkText: "Ver catalogo",
      };
    }

    if (isSpecificProductSearch(text)) {
      return {
        text: "No tenemos ese producto disponible en el catalogo por ahora. Puedes intentar con otro nombre o revisar productos similares en la tienda.",
        link: "/productos",
        linkText: "Ver catalogo",
      };
    }

    return null;
  };

  const buildAnswer = (text) => {
    const normalized = normalizeText(text);

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

    if (normalized.includes("contacto") || normalized.includes("contactarlos") || normalized.includes("telefono") || normalized.includes("whatsapp")) {
      return {
        text: "Puedes contactarnos por WhatsApp al +1 (809) 536-9114 o desde la pagina de servicio al cliente.",
        link: "/servicio-cliente",
        linkText: "Ir a soporte",
      };
    }

    if (normalized.includes("ubicacion") || normalized.includes("direccion") || normalized.includes("donde estan")) {
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

    const productAnswer = buildProductAnswer(text);
    if (productAnswer) return productAnswer;

    return {
      text: "No tenemos un producto relacionado con esa busqueda en este momento. Intenta escribir el nombre del articulo o una necesidad mas especifica.",
      suggestions: [
        "Tienen bomba de agua?",
        "Busco pintura",
        "Necesito un taladro",
      ],
    };
  };

  const sendMessage = (text = messageText) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    if (user && normalizeText(cleanText) === "/limpiar") {
      setMessages(initialMessages);
      setMessageText("");
      setIsOpen(true);
      return;
    }

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

  const clearChat = () => {
    setMessages(initialMessages);
    setMessageText("");
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
                <h2>Elupin</h2>
                <p>Tu amigo de confianza</p>
              </div>
            </div>

            <div className="chatbot-header-actions">
              {user && (
                <button
                  type="button"
                  onClick={clearChat}
                  aria-label="Limpiar chat"
                  title="Limpiar chat"
                >
                  <RotateCcw size={17} />
                </button>
              )}

              <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar chat">
                <X size={18} />
              </button>
            </div>
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

                {message.suggestions && (
                  <div className="chatbot-suggestions">
                    {message.suggestions.map((suggestion) => (
                      <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>
                        {suggestion}
                      </button>
                    ))}
                  </div>
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
                          <em>{getStockLabel(product)}</em>
                          {product.chatbotReason &&
                            product.chatbotReason !== getStockLabel(product) && (
                              <em>{product.chatbotReason}</em>
                            )}
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
              placeholder="Ej: necesito arreglar una fuga..."
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
