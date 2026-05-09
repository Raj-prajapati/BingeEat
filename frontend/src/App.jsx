import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
// import Orders from "./pages/Orders";
import { Toaster } from "react-hot-toast";
import LocationModal from "./components/common/AddressForm";
import AddressForm from "./components/common/AddressForm";
import Location from "./components/common/Location";
import { useState } from "react";
function App() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/restaurants' element={<Restaurants/>}/>
        <Route path='/restaurant/:id' element={<RestaurantDetail/>}/>
        <Route path='/cart' element={<Cart/>}/>
        {/* <Route path='/orders' element={<Orders/>}/> */}

        <Route path='/add-address' element={<Location/>}/>
        <Route path='/select-location' element={<LocationModal/>}/>
        <Route path='/address-form' element={<AddressForm/>}/>
      </Routes>
       <Toaster />
    </BrowserRouter>
    
  )
}

export default App;