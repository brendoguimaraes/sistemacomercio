import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Products from './components/products/Products';
import Categories from './components/products/Categories';
import Customers from './components/customers/Customers';
import Sales from './components/sales/Sales';
import Inventory from './components/inventory/Inventory';
import Financials from './components/financials/Financials';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (username && password) {
      axios.defaults.auth = {
        username,
        password,
      };
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    delete axios.defaults.auth;
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/products">Produtos</Link></li>
            <li><Link to="/categories">Categorias</Link></li>
            <li><Link to="/customers">Clientes</Link></li>
            <li><Link to="/sales">Vendas</Link></li>
            <li><Link to="/inventory">Estoque</Link></li>
            <li><Link to="/financials">Financeiro</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/financials" element={<Financials />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;