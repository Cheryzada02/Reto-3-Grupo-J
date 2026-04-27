
import { supabase } from './supabaseclient'


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