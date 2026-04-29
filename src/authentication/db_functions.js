
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
    const {data, error} = await supabase.from('view_products').select('*').range(0, 1)
    if (error) throw error

    return data
}

// Insert Products 
export async function insert_into_products(name, description, supplier_id, cost_price, sale_price, current_stock, min_stock) {
    const {data, error} = await supabase.rpc("insert_product", {
    p_name: name,
    p_description: description,
    p_supplier_id: supplier_id,
    p_cost: cost_price,
    p_sale: sale_price,
    p_stock: current_stock,
    p_min: min_stock
    })
    if (error) throw error

    return data
}

//Update Products
export async function update_products(id, name, description, supplier_id, cost_price, sale_price, current_stock, min_stock) {
    const {data, error} = await supabase.rpc("update_product", {
    p_id: id,
    p_name: name,
    p_description: description,
    p_supplier_id: supplier_id,
    p_cost: cost_price,
    p_sale: sale_price,
    p_stock: current_stock,
    p_min: min_stock
    })
    if (error) throw error

    return data
}