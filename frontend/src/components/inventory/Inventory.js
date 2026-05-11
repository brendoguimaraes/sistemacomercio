import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product: '', current_stock: 0, min_stock: 0 });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/inventory/');
    setInventory(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/products/');
    setProducts(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://127.0.0.1:8000/api/inventory/${editing}/`, form);
    } else {
      await axios.post('http://127.0.0.1:8000/api/inventory/', form);
    }
    setForm({ product: '', current_stock: 0, min_stock: 0 });
    setEditing(null);
    fetchInventory();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditing(item.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/inventory/${id}/`);
    fetchInventory();
  };

  return (
    <div>
      <h2>Estoque</h2>
      <form onSubmit={handleSubmit}>
        <select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required>
          <option value="">Selecione Produto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <input type="number" placeholder="Estoque Atual" value={form.current_stock} onChange={(e) => setForm({ ...form, current_stock: e.target.value })} required />
        <input type="number" placeholder="Estoque Mínimo" value={form.min_stock} onChange={(e) => setForm({ ...form, min_stock: e.target.value })} required />
        <button type="submit">{editing ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Estoque Atual</th>
            <th>Estoque Mínimo</th>
            <th>Última Atualização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id} style={{ backgroundColor: item.current_stock < item.min_stock ? '#ffcccc' : 'transparent' }}>
              <td>{item.product_name || 'N/A'}</td>
              <td>{item.current_stock}</td>
              <td>{item.min_stock}</td>
              <td>{new Date(item.last_updated).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;