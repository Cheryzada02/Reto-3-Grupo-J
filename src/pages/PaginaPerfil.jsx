import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Edit,
  Eye,
  FileText,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { useAuth } from "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";
import {
  delete_image,
  get_customer_info,
  update_customer_profile,
  update_user_password,
  upload_image,
  get_customer_order_by_customer_id,
  get_customer_order_details_by_order_id
} from "../authentication/db_functions";

export default function PaginaPerfil() {
  const { user } = useAuth();
  const { showAlert } = useAlerts();
  const avatarInputRef = useRef(null);

  const [activeSection, setActiveSection] = useState("personal");
  const [customer, setCustomer] = useState(null);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    image_url: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadCustomerProfile = async () => {
      try {
        setProfileLoading(true);

        const data = await get_customer_info(user?.user_id);
        const customerData = Array.isArray(data) ? data[0] : data;

        if (!customerData) return;

        setCustomer(customerData);

        setProfileForm({
          full_name: customerData.full_name || "",
          email: customerData.email || "",
          phone: customerData.phone || "",
          address: customerData.address || "",
          image_url: customerData.image_url || "",
        });
      } catch (error) {
        console.error(error);
        showAlert("No se pudo cargar la informacion del perfil.", "error");
      } finally {
        setProfileLoading(false);
      }
    };

    loadCustomerProfile();
  }, [user?.user_id, showAlert, user?.email, user?.user_name]);

  useEffect(() => {
    if (!customer?.customer_id) return;

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await get_customer_order_by_customer_id(customer.customer_id);
        setOrders(Array.isArray(data) ? data : data ? [data] : []);

      } catch (error) {
        console.error(error);
        showAlert("No se pudo cargar el historial de ordenes.", "error");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [customer?.customer_id, showAlert]);

  if (!user) {
    return (
      <main className="page-shell perfil-page">
        <section className="surface-card empty-state perfil-empty-card">
          <h1>No has iniciado sesion</h1>
          <p>Debes iniciar sesion para ver tu perfil.</p>
        </section>
      </main>
    );
  }

  const handleProfileInput = (event) => {
    const { name, value } = event.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelProfileEdit = () => {
    setProfileForm({
      full_name: customer?.full_name || user.user_name || "",
      email: customer?.email || user.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      image_url: customer?.image_url || "",
    });
    setIsEditingProfile(false);
  };

  const saveCustomerProfile = async (nextProfile = profileForm) => {
    if (!customer?.customer_id) {
      showAlert("No encontramos el perfil de cliente para actualizar.", "error");
      return false;
    }

    if (!nextProfile.full_name.trim()) {
      showAlert("El nombre es requerido.", "error");
      return false;
    }

    if (!nextProfile.email.trim()) {
      showAlert("El correo de alertas es requerido.", "error");
      return false;
    }

    try {
      setProfileLoading(true);

      await update_customer_profile(
        customer.customer_id,
        nextProfile.full_name,
        nextProfile.phone,
        nextProfile.email,
        nextProfile.address,
        nextProfile.image_url || ""
      );

      setCustomer((prev) => ({
        ...prev,
        full_name: nextProfile.full_name,
        phone: nextProfile.phone,
        email: nextProfile.email,
        address: nextProfile.address,
        image_url: nextProfile.image_url || "",
      }));

      showAlert("Perfil actualizado correctamente.", "success");
      return true;
    } catch (error) {
      console.error(error);
      showAlert("No se pudo actualizar el perfil.", "error");
      return false;
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    const saved = await saveCustomerProfile();

    if (saved) {
      setIsEditingProfile(false);
    }
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    try {
      setAvatarLoading(true);

      const imageUrl = await upload_image(file, "Customers");

      if (!imageUrl) {
        showAlert("No se pudo subir la imagen.", "error");
        return;
      }

      if (profileForm.image_url) {
        await delete_image(profileForm.image_url);
      }

      const nextProfile = {
        ...profileForm,
        image_url: imageUrl,
      };

      setProfileForm(nextProfile);
      await saveCustomerProfile(nextProfile);
    } catch (error) {
      console.error(error);
      showAlert("No se pudo actualizar la foto de perfil.", "error");
    } finally {
      setAvatarLoading(false);
      event.target.value = "";
    }
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  const formatDate = (value) => {
    if (!value) return "Sin fecha";

    return new Intl.DateTimeFormat("es-DO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(value));
  };

  const loadOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) return orderDetails[orderId];

    try {
      const data = await get_customer_order_details_by_order_id(orderId);
      const details = Array.isArray(data) ? data : data ? [data] : [];

      setOrderDetails((prev) => ({
        ...prev,
        [orderId]: details,
      }));

      return details;
    } catch (error) {
      console.error(error);
      showAlert("No se pudieron cargar los detalles de la orden.", "error");
      return [];
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    setSelectedOrderId((current) => (current === orderId ? null : orderId));
    await loadOrderDetails(orderId);
  };

  const downloadOrderPdf = async (order) => {
    const details = await loadOrderDetails(order.order_id);

    const doc = new jsPDF();
    const invoiceNumber = `FE-${order.order_id}`;
    const createdDate = order.created_at
      ? new Date(order.created_at).toLocaleDateString("es-DO")
      : new Date().toLocaleDateString("es-DO");
    const createdTime = order.created_at
      ? new Date(order.created_at).toLocaleTimeString("es-DO")
      : new Date().toLocaleTimeString("es-DO");

    doc.setFontSize(20);
    doc.text("Ferreteria Elupina", 14, 18);

    doc.setFontSize(12);
    doc.text("Factura Provisional", 14, 28);
    doc.text(`Factura No.: ${invoiceNumber}`, 14, 38);
    doc.text(`Fecha: ${createdDate}`, 14, 46);
    doc.text(`Hora: ${createdTime}`, 14, 54);
    doc.text("Modalidad: Retiro en tienda (Pick Up)", 14, 62);
    doc.text(`Estado de orden: ${order.order_status || "No disponible"}`, 14, 70);
    doc.text(`Estado de pago: ${order.payment_status || "No disponible"}`, 14, 78);

    autoTable(doc, {
      startY: 90,
      head: [["Producto", "Cantidad", "Precio", "Subtotal"]],
      body: details.map((item) => [
        item.product_name,
        item.quantity,
        formatCurrency(item.unit_price),
        formatCurrency(item.line_total),
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
    doc.text(`Subtotal: ${formatCurrency(order.subtotal)}`, 14, finalY);
    doc.text(`ITBIS 18%: ${formatCurrency(order.tax)}`, 14, finalY + 8);
    doc.text(`Total: ${formatCurrency(order.total)}`, 14, finalY + 16);

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

    doc.save(`factura-provisional-${invoiceNumber}.pdf`);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setMessage({ type: "", text: "" });

    if (passwords.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "La contrasena debe tener al menos 6 caracteres.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({
        type: "error",
        text: "Las contrasenas no coinciden.",
      });
      return;
    }

    try {
      setLoading(true);

      await update_user_password(user.user_id, passwords.newPassword);

      setMessage({
        type: "success",
        text: "Contrasena actualizada correctamente.",
      });

      setPasswords({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: "No se pudo actualizar la contrasena.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell perfil-page">
      <section className="page-hero perfil-hero">
        <div>
          <span>Cuenta de usuario</span>
          <h1>Mi perfil</h1>
          <p>
            Consulta tu informacion personal y administra la seguridad de tu
            cuenta.
          </p>
        </div>
      </section>

      <section className="perfil-layout">
        <aside className="surface-card perfil-sidebar">
          <div className="perfil-avatar-box">
            <div className="perfil-avatar-wrapper">
              <img
                src={profileForm.image_url || "https://i.pravatar.cc/150?img=12"}
                alt="Foto de perfil"
                className="perfil-avatar"
              />

              <button
                type="button"
                className="perfil-avatar-edit"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarLoading || profileLoading}
                aria-label="Cambiar foto de perfil"
              >
                <Camera size={20} />
              </button>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="perfil-avatar-input"
                onChange={handleAvatarSelect}
              />
            </div>

            <h2>{profileForm.full_name || user.user_name}</h2>
            <p>{profileForm.email || user.email}</p>
          </div>

          <nav className="perfil-menu">
            <button
              type="button"
              className={
                activeSection === "personal"
                  ? "perfil-menu-item active"
                  : "perfil-menu-item"
              }
              onClick={() => setActiveSection("personal")}
            >
              <User size={18} />
              Informacion personal
            </button>

            <button
              type="button"
              className={
                activeSection === "security"
                  ? "perfil-menu-item active"
                  : "perfil-menu-item"
              }
              onClick={() => setActiveSection("security")}
            >
              <KeyRound size={18} />
              Seguridad
            </button>

            <button
              type="button"
              className={
                activeSection === "orders"
                  ? "perfil-menu-item active"
                  : "perfil-menu-item"
              }
              onClick={() => setActiveSection("orders")}
            >
              <ShoppingBag size={18} />
              Historial De Ordenes
            </button>
          </nav>
        </aside>

        <section className="perfil-content">
          {activeSection === "personal" && (
            <article className="surface-card perfil-card">
              <div className="perfil-card-header">
                <div>
                  <h2>Informacion del usuario</h2>
                  <p>Actualiza tus datos de contacto y alertas.</p>
                </div>

                {isEditingProfile ? (
                  <div className="perfil-card-actions">
                    <button
                      type="button"
                      className="perfil-save-button"
                      onClick={handleSaveProfile}
                      disabled={profileLoading}
                    >
                      <Save size={18} />
                      {profileLoading ? "Guardando..." : "Guardar"}
                    </button>

                    <button
                      type="button"
                      className="perfil-cancel-button"
                      onClick={handleCancelProfileEdit}
                      disabled={profileLoading}
                    >
                      <X size={18} />
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="perfil-edit-button"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                )}
              </div>

              <div className="perfil-info-grid">
                <div className="perfil-info-item">
                  <User size={20} />
                  <div>
                    <span>Nombre</span>
                    {isEditingProfile ? (
                      <input
                        name="full_name"
                        value={profileForm.full_name}
                        onChange={handleProfileInput}
                      />
                    ) : (
                      <strong>{profileForm.full_name || "Sin nombre"}</strong>
                    )}
                  </div>
                </div>

                <div className="perfil-info-item">
                  <Mail size={20} />
                  <div>
                    <span>Correo de alertas</span>
                    {isEditingProfile ? (
                      <input
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileInput}
                      />
                    ) : (
                      <strong>{profileForm.email || "Sin correo"}</strong>
                    )}
                  </div>
                </div>

                <div className="perfil-info-item">
                  <Phone size={20} />
                  <div>
                    <span>Telefono</span>
                    {isEditingProfile ? (
                      <input
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileInput}
                      />
                    ) : (
                      <strong>{profileForm.phone || "Sin telefono"}</strong>
                    )}
                  </div>
                </div>

                <div className="perfil-info-item">
                  <MapPin size={20} />
                  <div>
                    <span>Direccion</span>
                    {isEditingProfile ? (
                      <input
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileInput}
                      />
                    ) : (
                      <strong>{profileForm.address || "Sin direccion"}</strong>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          {activeSection === "security" && (
            <article className="surface-card perfil-card">
              <div className="perfil-card-header">
                <div>
                  <h2>Cambiar contrasena</h2>
                  <p>
                    Usa una contrasena segura y facil de recordar para ti.
                  </p>
                </div>

                <Lock size={28} />
              </div>

              <form
                className="perfil-password-form"
                onSubmit={handleChangePassword}
              >
                <label>
                  Nueva contrasena
                  <div className="perfil-input-wrapper">
                    <Lock size={18} />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordInput}
                      placeholder="Minimo 6 caracteres"
                      required
                    />
                  </div>
                </label>

                <label>
                  Confirmar contrasena
                  <div className="perfil-input-wrapper">
                    <Lock size={18} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordInput}
                      placeholder="Repite la contrasena"
                      required
                    />
                  </div>
                </label>

                {message.text && (
                  <p className={`perfil-message ${message.type}`}>
                    {message.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="perfil-save-button"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? "Guardando..." : "Guardar contrasena"}
                </button>
              </form>
            </article>
          )}

          {activeSection === "orders" && (
            <article className="surface-card perfil-card">
              <div className="perfil-card-header">
                <div>
                  <h2>Historial De Ordenes</h2>
                  <p>Consulta tus compras y descarga tu factura provisional.</p>
                </div>

                <ShoppingBag size={28} />
              </div>

              {ordersLoading ? (
                <p className="estado">Cargando ordenes...</p>
              ) : !orders.length ? (
                <section className="perfil-empty-card">
                  <p>No tienes ordenes registradas.</p>
                </section>
              ) : (
                <div className="client-orders-list">
                  {orders.map((order) => {
                    const details = orderDetails[order.order_id] || [];
                    const isOpen = selectedOrderId === order.order_id;

                    return (
                      <article className="client-order-card" key={order.order_id}>
                        <div className="client-order-summary">
                          <div>
                            <span>Orden</span>
                            <strong>#{order.order_id}</strong>
                          </div>

                          <div>
                            <span>Estado</span>
                            <strong>{order.order_status || "No disponible"}</strong>
                          </div>

                          <div>
                            <span>Pago</span>
                            <strong>{order.payment_status || "No disponible"}</strong>
                          </div>

                          <div>
                            <span>Fecha</span>
                            <strong>{formatDate(order.created_at)}</strong>
                          </div>

                          <div>
                            <span>Total</span>
                            <strong>{formatCurrency(order.total)}</strong>
                          </div>
                        </div>

                        <div className="client-order-actions">
                          <button
                            type="button"
                            className="btn"
                            onClick={() => handleViewOrderDetails(order.order_id)}
                          >
                            <Eye size={17} />
                            Ver detalles
                          </button>

                          <button
                            type="button"
                            className="btn"
                            onClick={() => downloadOrderPdf(order)}
                          >
                            <FileText size={17} />
                            Descargar PDF
                          </button>
                        </div>

                        {isOpen && (
                          <div className="client-order-details">
                            {!details.length ? (
                              <p>No hay detalles disponibles para esta orden.</p>
                            ) : (
                              details.map((item) => (
                                <div
                                  className="client-order-detail-row"
                                  key={item.order_item_id || item.product_name}
                                >
                                  <span>{item.product_name}</span>
                                  <small>Cantidad: {item.quantity}</small>
                                  <strong>{formatCurrency(item.line_total)}</strong>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
