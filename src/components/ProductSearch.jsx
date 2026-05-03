import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { get_products } from "../authentication/db_functions";

export default function ProductSearch({ className = "navbar-search" }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await get_products();
        setProducts(data.filter((product) => product.status === "Activo"));
      } catch (error) {
        console.error("Error cargando productos para búsqueda:", error);
      }
    };

    loadProducts();
  }, []);

  const matches = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    if (!cleanSearch) return [];

    return products
      .filter((product) =>
        (product.product_name || "").toLowerCase().includes(cleanSearch)
      )
      .slice(0, 6);
  }, [products, searchTerm]);

  const goToProduct = (productId) => {
    setSearchTerm("");
    setIsOpen(false);
    navigate(`/productos/${productId}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (matches[0]) {
      goToProduct(matches[0].product_id);
      return;
    }

    const cleanSearch = searchTerm.trim();
    navigate(cleanSearch ? `/productos?buscar=${encodeURIComponent(cleanSearch)}` : "/productos");
    setIsOpen(false);
  };

  return (
    <form
      className={className}
      onSubmit={handleSubmit}
      onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
    >
      <div className="navbar-search-box">
        <input
          type="text"
          placeholder="Buscar en la tienda..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        {isOpen && searchTerm.trim() && (
          <div className="navbar-search-results">
            {matches.length ? (
              matches.map((product) => (
                <button
                  type="button"
                  className="navbar-search-result"
                  key={product.product_id}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => goToProduct(product.product_id)}
                >
                  <img
                    src={product.image_url || "/placeholder-product.png"}
                    alt={product.product_name}
                  />

                  <span>
                    <strong>{product.product_name}</strong>
                    <small>{product.department_name || "Producto disponible"}</small>
                  </span>
                </button>
              ))
            ) : (
              <p className="navbar-search-empty">No encontramos productos.</p>
            )}
          </div>
        )}
      </div>

      <button type="submit" aria-label="Buscar productos">
        <Search size={20} />
      </button>
    </form>
  );
}
