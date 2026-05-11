import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ customer: '', items: [] });
  const [itemForm, setItemForm] = useState({ product: '', quantity: 1 });

  useEffect(() => {
    fetchSales();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/sales/');
    setSales(response.data);
  };

  const fetchCustomers = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/customers/');
    setCustomers(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/products/');
    setProducts(response.data);
  };

  const addItem = () => {
    const product = products.find(p => p.id === parseInt(itemForm.product));
    if (product) {
      const newItem = {
        product: itemForm.product,
        quantity: itemForm.quantity,
        price: product.price,
        product_name: product.name
      };
      setForm({ ...form, items: [...form.items, newItem] });
      setItemForm({ product: '', quantity: 1 });
    }
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const calculateTotal = () => {
    return form.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saleData = {
      customer: form.customer,
      total: calculateTotal(),
      saleitem_set: form.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      }))
    };
    await axios.post('http://127.0.0.1:8000/api/sales/', saleData);
    setForm({ customer: '', items: [] });
    fetchSales();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/sales/${id}/`);
    fetchSales();
  };

  return (
    <div>
      <h2>Vendas</h2>
      <form onSubmit={handleSubmit}>
        <select value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} required>
          <option value="">Selecione Cliente</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
        <div>
          <select value={itemForm.product} onChange={(e) => setItemForm({ ...itemForm, product: e.target.value })}>
            <option value="">Selecione Produto</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name} - R$ {product.price}</option>
            ))}
          </select>
          <input type="number" min="1" value={itemForm.quantity} onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })} />
          <button type="button" onClick={addItem}>Adicionar Item</button>
        </div>
        <ul>
          {form.items.map((item, index) => (
            <li key={index}>
              {item.product_name} - Qtd: {item.quantity} - R$ {item.price * item.quantity}
              <button type="button" onClick={() => removeItem(index)}>Remover</button>
            </li>
          ))}
        </ul>
        <p>Total: R$ {calculateTotal()}</p>
        <button type="submit">Registrar Venda</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.customer_name || 'N/A'}</td>
              <td>R$ {sale.total}</td>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(sale.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;