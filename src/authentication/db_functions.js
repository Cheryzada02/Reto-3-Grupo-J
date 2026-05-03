
import { supabase } from './supabaseclient'

// Function to Register User
export async function insert_into_user_profile (full_name, internal_email, password_hash) {
    const {data, error} = await supabase.rpc("insert_user", {
    p_full_name: full_name,
    p_email: internal_email,
    p_password_hash: password_hash
    })
    if (error) throw error

    return data
}

// Function to Login User
export async function login_user_profile (email, password) {
    const {data, error} = await supabase.rpc("login_user", {
    p_email: email,
    p_password: password
    })
    if (error) throw error

    return data
}

// View to See Suppliers
export async function get_suppliers () {
    const {data, error} = await supabase.from('view_suppliers').select('*')
    if (error) throw error

    return data
}

// Insert Suppliers 
export async function insert_into_suppliers(name, phone, email, address) {
    const {data, error} = await supabase.rpc("insert_suppliers", {
    p_name: name,
    p_phone: phone,
    p_email: email,
    p_address: address
    })
    if (error) throw error

    return data
}

//Update Suppliers
export async function update_suppliers(id, name, phone, email, address) {
    const {data, error} = await supabase.rpc("update_suppliers", {
    p_id: id,
    p_name: name,
    p_phone: phone,
    p_email: email,
    p_address: address,
    p_is_active: true
    })
    if (error) throw error

    return data
}

// View to See Products
export async function get_products () {
    const {data, error} = await supabase.from('view_products').select('*')
    if (error) throw error

    return data
}

// Insert Products 
export async function insert_into_products(name, description, supplier_id, cost_price, sale_price, current_stock, min_stock, status, image_url) {
    const {data, error} = await supabase.rpc("insert_product", {
    p_name: name,
    p_description: description,
    p_supplier_id: supplier_id,
    p_cost: cost_price,
    p_sale: sale_price,
    p_stock: current_stock,
    p_min: min_stock,
    p_status: status,
    p_image_url: image_url
    })
    if (error) throw error

    return data
}

//Update Products
export async function update_products(id, name, description, supplier_id, cost_price, sale_price, current_stock, min_stock, status, image_url) {
    const {data, error} = await supabase.rpc("update_product", {
    p_id: id,
    p_name: name,
    p_description: description,
    p_supplier_id: supplier_id,
    p_cost: cost_price,
    p_sale: sale_price,
    p_stock: current_stock,
    p_min: min_stock,
    p_status: status,
    p_image_url: image_url
    })
    if (error) throw error

    return data
}

// Upload Image
export async function upload_image(file, bucked_name) {

    const fileName = `${bucked_name}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
        .from("ferreteriard-images")
        .upload(fileName, file);

    if (error) {
        console.error(error);
        return null;
    }

    // Get public URL
    const { data: public_url_data } = supabase.storage
        .from("ferreteriard-images")
        .getPublicUrl(fileName);

    return public_url_data.publicUrl;
}

// Delete Image
export async function delete_image(image_url) {
  const BUCKET = "ferreteriard-images";

  const getPathFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET}/`);
      return parts[1];
    } catch (err) {
      console.error("Invalid URL:", url);
      return null;
    }
  };

  const path = getPathFromUrl(image_url);

  if (!path) return;

  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .remove([path]);

  if (error) {
    console.error("Error deleting image:", error.message);
    return null;
  }

  return data;
}

// View to See Inventory_Movements
export async function get_inventory_movements () {
    const {data, error} = await supabase.from('view_inventory_movements').select('*')
    if (error) throw error

    return data
}

// Insert Inventory_Movements 
export async function insert_inventory_movement(product_id, user_id, movement_type, quantity, reference, notes) {
    const {data, error} = await supabase.rpc("insert_inventory_movement", {
    p_product_id: product_id,
    p_user_id: user_id,
    p_movement_type: movement_type,
    p_quantity: quantity,
    p_reference: reference,
    p_notes: notes
    })
    if (error) throw error

    return data
}

// View to See Customers
export async function get_customers () {
    const {data, error} = await supabase.from('view_customers').select('*')
    if (error) throw error

    return data
}

// Update User Password
export async function update_user_password(user_id, new_password) {
  const { data, error } = await supabase.rpc("update_user_password", {
    p_user_id: user_id,
    p_new_password: new_password,
  });

  if (error) throw error;

  return data;
}

// Check Stock Availability
export async function check_stock_availablity(product_id, quantity) {
  const { data, error } = await supabase.rpc("check_stock_available", {
    p_product_id: product_id,
    p_qty: quantity,
  });

  if (error) throw error;

  return data;
}

// Insert orders 
export async function insert_orders(customer_id, created_by_user_id, order_type, sub_total, tax, discount, total) {
    const {data, error} = await supabase.rpc("insert_orders", {
    p_customer_id: customer_id,
    p_created_by_user_id: created_by_user_id,
    p_order_type: order_type,
    p_sub_total: sub_total,
    p_tax: tax,
    p_discount: discount,
    p_total: total
    })
    if (error) throw error

    return data
}

// Get Indidividual Customer
export async function get_customer_info(user_id) {
    const {data, error} = await supabase.rpc("get_customer_info", {
    p_user_id: user_id

    })
    if (error) throw error

    return data
}

// Insert orders items
export async function insert_orders_items(order_id, product_id, quantity, unit_price, discount, line_total, user_id) {
    const {data, error} = await supabase.rpc("insert_orders_items", {
    p_order_id: order_id,
    p_product_id: product_id,
    p_quantity: quantity,
    p_unit_price: unit_price,
    p_discount: discount,
    p_line_total: line_total,
    p_user_id: user_id
    })
    if (error) throw error

    return data
}

// View to See Products
export async function get_departments () {
    const {data, error} = await supabase.from('view_departments').select('*')
    if (error) throw error

    return data
}

// Insert Departments 
export async function insert_into_departments(name, image_url) {
    const {data, error} = await supabase.rpc("insert_department", {
    p_name: name,
    p_image_url: image_url
    })
    if (error) throw error

    return data
}

//Update departments
export async function update_departments(id, name, image_url) {
    const {data, error} = await supabase.rpc("update_department", {
    p_id: id,
    p_name: name,
    p_image_url: image_url
    })
    if (error) throw error

    return data
}

// View to See Orders
export async function get_orders () {
    const {data, error} = await supabase.from('view_orders').select('*')
    if (error) throw error

    return data
}

// View to See Orders Details
export async function get_orders_details () {
    const {data, error} = await supabase.from('view_orders_details').select('*')
    if (error) throw error

    return data
}

// Update Orders Status
export async function update_orders(id, order_status, payment_status) {
    const {data, error} = await supabase.rpc("update_orders", {
    p_order_id: id,
    p_order_status: order_status,
    p_payment_status: payment_status
    })
    if (error) throw error

    return data
}

//Update Customers
export async function update_customer_profile(id, fullname, phone, email, address, image_url) {
    const {data, error} = await supabase.rpc("update_customers", {
    p_customer_id: id,
    p_full_name: fullname,
    p_phone: phone,
    p_email: email,
    p_address: address,
    p_image_url: image_url
    })
    if (error) throw error

    return data
}


// Get_ Customer_order_by_id
export async function get_customer_order_by_customer_id(customer_id) {
    const {data, error} = await supabase.rpc("get_customer_orders", {
    p_customer_id: customer_id
    })
    if (error) throw error

    return data
}


// Get_Customer_order_details_by_order_id
export async function get_customer_order_details_by_order_id(order_id) {
    const {data, error} = await supabase.rpc("get_customer_orders_details", {
    p_order_id: order_id
    })
    if (error) throw error

    return data
}

// View Stock Alers
export async function get_stock_alerts () {
    const {data, error} = await supabase.from('view_stock_alerts').select('*')
    if (error) throw error

    return data
}