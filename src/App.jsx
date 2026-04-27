import { useState, useEffect } from 'react'
import './App.css'
import { insert_into_user_profile } from './authentication/db_functions'
import User_form from './pages/testing';


function App() {

  const [result, set_result] = useState(null)
  const [loading, set_loading] = useState(false)

  const register_user_profile = async () => {
    set_loading(true)
    try {
      const res = await insert_into_user_profile('Raykel Villar', "raykelvillar@ferreteriard.com", 'test', 1)
      console.log("Sucess:", res)
      set_result('Role Exist')
    } catch (err) {
      console.log('Error:', err.message)
      set_result(err.message)
    } finally {
      set_loading(false)
    }
  }

  return <User_form onSubmit={register_user_profile}/>
}

export default App
