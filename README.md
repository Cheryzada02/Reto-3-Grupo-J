# 🛠️ Ferretería Elupina - Sistema Web

Aplicación web desarrollada con **React + Vite** para la gestión y venta de productos de ferretería.

Incluye funcionalidades tanto para **clientes** como para **administradores**, con integración a base de datos mediante **Supabase**.

---

## 🚀 Funcionalidades

### 👤 Cliente

* Registro e inicio de sesión
* Visualización de productos
* Búsqueda en tiempo real
* Agregar productos al carrito
* Gestión de favoritos
* Checkout (efectivo / transferencia)
* Página de perfil con cambio de contraseña
* Preguntas frecuentes (FAQ)
* Servicio al cliente

### 🛠️ Administrador

* Gestión de productos
* Gestión de suplidores
* Movimientos de inventario
* Visualización de clientes

---

## 🧱 Tecnologías utilizadas

* **React**
* **Vite**
* **React Router DOM**
* **Supabase (PostgreSQL + RPC + Storage)**
* **Lucide Icons**
* **CSS personalizado (App.css)**

---

## 📂 Estructura del proyecto

```
src/
│
├── components/        # Navbar, Footer, UI reutilizable
├── pages/             # Vistas principales
├── context/           # CartContext, FavoritesContext, AuthContext
├── authentication/    # Funciones de conexión con Supabase
├── data/              # Datos estáticos (departamentos)
├── api/               # APIs auxiliares
└── App.jsx
```

---

## 🔐 Autenticación

El sistema utiliza funciones RPC en Supabase:

* `insert_user` → Registro
* `login_user` → Login
* `update_user_password` → Cambio de contraseña

Las contraseñas se almacenan encriptadas usando:

```
crypt(password, gen_salt('bf'))  -- bcrypt
```

---

## 🛒 Carrito y Favoritos

* Manejo global con **React Context**
* Persistencia en memoria (puedes extenderlo a localStorage si quieres)
* Contador dinámico en Navbar

---

## 💳 Checkout

* Métodos disponibles:

  * Efectivo (Pickup en tienda)
  * Transferencia bancaria

Incluye:

* Resumen de productos
* Cálculo de impuestos
* Información de cuentas bancarias

---

## 🔎 Búsqueda de productos

* Integrada en el Navbar
* Conectada a base de datos (Supabase)
* Filtra productos activos en tiempo real

---

## ⚙️ Instalación

```bash
# Clonar repositorio
git clone <tu-repo>

# Entrar al proyecto
cd ferreteria-elupina

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

---

## 🌐 Variables de entorno

Crea un archivo `.env`:

```env
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

---

## 🧪 Buenas prácticas implementadas

* Componentes reutilizables
* Separación por contexto (cart, auth, favoritos)
* Manejo de estado limpio
* Validación de formularios
* UX moderna (toggle password, loaders, mensajes)

---

## 📌 Notas

* Actualmente solo hay **retiro en tienda (pickup)**.
* No hay sistema de envíos/delivery implementado.

---

## 👨‍💻 Autor

Proyecto desarrollado como sistema completo de práctica profesional en React + Supabase.
