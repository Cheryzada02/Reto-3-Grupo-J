
import { supabase } from './supabaseclient'

// Function to Register User
export async function insert_into_user_profile (full_name, internal_email, password_hash, role_id) {
    const {data, error} = await supabase.rpc("insert_user", {
    p_full_name: full_name,
    p_email: internal_email,
    p_password_hash: password_hash,
    p_role_id: role_id
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
export async function upload_image(file) {

    const fileName = `Products/${Date.now()}-${file.name}`;

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
      return parts[1]; // ONLY file path inside bucket
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
    .remove([path]);   // ✅ use path, not full URL

  if (error) {
    console.error("Error deleting image:", error.message);
    return null;
  }

  return data;
}
