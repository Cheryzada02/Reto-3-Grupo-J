# Ferreteria Elupina - Sistema Web

Aplicacion web para la gestion y venta de productos de Ferreteria Elupina. El proyecto esta desarrollado con React y Vite, usa Supabase como backend y separa la experiencia entre clientes y administradores segun el rol de la sesion.

El sistema permite consultar productos, comprar para retiro en tienda, administrar inventario, registrar ordenes, revisar alertas de stock y exportar informacion operativa.

## Tabla de contenido

- [Descripcion general](#descripcion-general)
- [Funcionalidades principales](#funcionalidades-principales)
- [Roles y rutas](#roles-y-rutas)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Conexion con Supabase](#conexion-con-supabase)
- [Instalacion y ejecucion](#instalacion-y-ejecucion)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Notas importantes](#notas-importantes)

## Descripcion general

Ferreteria Elupina funciona como una tienda web con panel administrativo. La aplicacion carga productos, departamentos, suplidores, clientes, ordenes, movimientos de inventario y alertas desde Supabase mediante vistas, funciones RPC, Storage y una Edge Function para envio de correos.

La navegacion se controla con React Router. Cuando el usuario autenticado tiene `role_id === 1`, se muestra el panel administrativo; en caso contrario, se muestra la experiencia de cliente.

## Funcionalidades principales

### Cliente

- Registro e inicio de sesion.
- Catalogo de productos activos.
- Vista de detalle por producto.
- Filtro por departamento.
- Busqueda de productos desde parametros de URL.
- Ordenamiento alfabetico y filtro por rango de precio.
- Control visual de columnas en el catalogo.
- Carrito de compra con cantidades, subtotal, ITBIS y total.
- Validacion de stock antes de crear una orden.
- Checkout para retiro en tienda.
- Metodos de pago: efectivo al retirar y transferencia bancaria.
- Generacion de factura provisional en PDF.
- Envio de factura provisional por correo cuando el cliente tiene email.
- Gestion de favoritos con persistencia en `localStorage`.
- Perfil de cliente con actualizacion de datos, imagen y contrasena.
- Historial de ordenes del cliente y descarga de factura.
- Pagina de preguntas frecuentes.
- Pagina de servicio al cliente.
- Pagina de Sobre Nosotros.

### Administrador

- Dashboard con resumen de ventas, ordenes, movimientos y alertas.
- Gestion de productos con carga de imagenes.
- Gestion de departamentos con imagenes.
- Gestion de suplidores.
- Consulta de clientes.
- Registro y consulta de movimientos de inventario.
- Consulta y actualizacion de estados de ordenes.
- Consulta de detalles de ordenes.
- Revision de alertas de stock.
- Perfil administrativo con correo de alertas.
- Edicion del contenido de Sobre Nosotros.
- Exportacion de tablas a CSV.
- Envio de reportes CSV por correo.

### Componentes globales

- Navbar de cliente y navbar de administrador.
- Footer compartido.
- Chatbot "Elupin" con respuestas sobre horario, contacto, pagos, delivery y recomendaciones de productos del catalogo.
- Widget de accesibilidad con texto grande, alto contraste, modo daltonico, reduccion de movimiento, subrayado de enlaces, lectura comoda y salto al contenido.
- Sistema de alertas global para mensajes de exito y error.

## Roles y rutas

### Rutas de cliente

| Ruta | Vista |
| --- | --- |
| `/` | Inicio |
| `/login` | Inicio de sesion |
| `/registro` | Registro |
| `/perfil` | Perfil del cliente |
| `/servicio-cliente` | Servicio al cliente |
| `/sobre-nosotros` | Sobre Nosotros |
| `/faq` | Preguntas frecuentes |
| `/productos` | Catalogo de productos |
| `/productos/:id` | Detalle de producto |
| `/departamentos/:departamentoRuta` | Productos filtrados por departamento |
| `/carrito` | Carrito y checkout |
| `/favoritos` | Productos favoritos |

### Rutas de administrador

| Ruta | Vista |
| --- | --- |
| `/` | Dashboard |
| `/dashboard` | Dashboard |
| `/productos` | Administracion de productos |
| `/productos/:id` | Detalle de producto |
| `/departamentos` | Administracion de departamentos |
| `/suplidores` | Administracion de suplidores |
| `/inventory_movements` | Movimientos de inventario |
| `/customers` | Clientes |
| `/orders` | Ordenes |
| `/orders_details` | Detalles de ordenes |
| `/stock-alerts` | Alertas de stock |
| `/perfil` | Perfil administrador |
| `/sobre-nosotros` | Administracion de Sobre Nosotros |
| `/faq` | Preguntas frecuentes |

## Tecnologias utilizadas

- React 19.
- Vite.
- React Router DOM.
- Supabase JS.
- Supabase PostgreSQL, vistas, RPC, Storage y Edge Functions.
- Lucide React para iconos.
- jsPDF y jspdf-autotable para facturas PDF.
- heic2any para soporte de imagenes HEIC.
- ESLint.
- CSS personalizado.

## Estructura del proyecto

```text
src/
|-- api/
|   `-- customerServiceApi.js
|-- authentication/
|   |-- db_functions.js
|   `-- supabaseclient.js
|-- components/
|   |-- AccessibilityWidget.jsx
|   |-- Chatbot.jsx
|   |-- Footer.jsx
|   |-- Navbar.jsx
|   |-- Navbar_Admin.jsx
|   |-- ProductSearch.jsx
|   `-- TableExportActions.jsx
|-- context/
|   |-- AlertContext.jsx
|   |-- AuthContext.jsx
|   |-- CartContext.jsx
|   `-- FavoritesContext.jsx
|-- data/
|   `-- aboutContent.js
|-- pages/
|   |-- Home.jsx
|   |-- Productos.jsx
|   |-- ProductoDetalle.jsx
|   |-- Cart.jsx
|   |-- Favoritos.jsx
|   |-- PaginaPerfil.jsx
|   |-- Dashboard_Admin.jsx
|   |-- Products_Admin.jsx
|   |-- Departamentos_Admin.jsx
|   |-- Suppliers_Admin.jsx
|   |-- Inventory_Movements_Admin.jsx
|   |-- Orders_Admin.jsx
|   |-- Orders_Details_Admin.jsx
|   |-- Stock_Alerts.jsx
|   `-- ...
|-- utils/
|   |-- dateFormat.js
|   |-- exportEmail.js
|   |-- imageOptimization.js
|   `-- orderPdf.js
|-- App.jsx
|-- App.css
|-- index.css
|-- main.jsx
`-- styles.css
```

Carpetas adicionales:

- `public/`: favicon, logo e iconos.
- `Planificacion/`: documentos de planificacion y base de datos.
- `Evidencias/`: capturas y fotografias del proceso.
- `database_sql_scripts/`: scripts SQL para la creacion de la base de datos.

## Conexion con Supabase

La conexion se crea en `src/authentication/supabaseclient.js` usando:

```js
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

La mayor parte de la comunicacion con la base de datos esta centralizada en `src/authentication/db_functions.js`.

### Vistas utilizadas

- `view_suppliers`
- `view_products`
- `view_inventory_movements`
- `view_customers`
- `view_departments`
- `view_orders`
- `view_orders_details`
- `view_stock_alerts`

### Funciones RPC principales

- `insert_user`
- `login_user`
- `update_user_password`
- `insert_suppliers`
- `update_suppliers`
- `insert_product`
- `update_product`
- `insert_inventory_movement`
- `check_stock_available`
- `insert_orders`
- `insert_orders_items`
- `get_customer_info`
- `get_customer_orders`
- `get_customer_orders_details`
- `insert_department`
- `update_department`
- `update_orders`
- `update_customers`
- `get_user_profile`
- `update_user_profiles`

### Storage y correo

- Las imagenes se suben al bucket `ferreteriard-images`.
- Antes de subir imagenes, el proyecto usa `imageOptimization.js` para reducir tamano y mejorar rendimiento.
- El envio de correos se realiza mediante la Edge Function `Send-Google-Email`.
- Los reportes CSV y facturas PDF pueden enviarse como adjuntos.

## Instalacion y ejecucion

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
```

2. Entrar al proyecto:

```bash
cd Reto-3-Grupo-J
```

3. Instalar dependencias:

```bash
npm install
```

4. Crear el archivo `.env` con las credenciales de Supabase.

5. Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

6. Abrir la URL que indique Vite en la terminal.

## Variables de entorno

Crear un archivo `.env` en la raiz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## Scripts disponibles

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Genera la version de produccion.

```bash
npm run preview
```

Previsualiza la version generada por build.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

## Notas importantes

- El checkout esta diseñado solo para retiro en tienda.
- No hay delivery ni envio a domicilio implementado.
- La sesion del usuario se guarda en `localStorage` bajo la clave `session`.
- Los favoritos se guardan en `localStorage` bajo la clave `favorites`.
- Los ajustes de accesibilidad se guardan en `localStorage` bajo la clave `elupina-accessibility-settings`.
- El contenido editable de Sobre Nosotros se guarda localmente bajo la clave `ferreteria_elupina_about_content`.
- La web esta aloja en Vercel para poder estar activa al momento de usarla, ya que este sitio es gratis para cualquier deploy

## Autor

Proyecto desarrollado como parte del Reto 3 - Grupo J para Ferreteria Elupina.
