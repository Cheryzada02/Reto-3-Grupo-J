import { useState, useEffect } from 'react'
import './App.css'
import { insert_into_user_profile } from './authentication/db_functions'
import User_form from './components/testing2';
import Supplier_page from './components/Testing_Supplier';


function App() {

  return <Supplier_page/>

}

export default App
