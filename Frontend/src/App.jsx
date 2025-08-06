import React from 'react';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignUp from './Pages/LoginSignUp';
import Footer from './Components/Footer/Footer';
import men_banner from '../src/assets/Frontend_Assets/banner_mens.png';
import women_banner from './assets/Frontend_Assets/banner_women.png';
import kid_banner from './assets/Frontend_Assets/banner_kids.png';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
        <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
        <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
        <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignUp />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
