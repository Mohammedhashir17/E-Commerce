import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/ui/Navbar';

// Layouts
import Home from './layouts/Home';
import Login from './layouts/Login';
import ProductListing from './layouts/ProductListing';
import ProductDetail from './layouts/ProductDetail';
import Cart from './layouts/Cart';
import Wishlist from './layouts/Wishlist';
import Checkout from './layouts/Checkout';
import Payment from './layouts/Payment';
import Orders from './layouts/Orders';
import Account from './layouts/Account';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

