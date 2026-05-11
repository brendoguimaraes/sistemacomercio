import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock_quantity: '', category: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/products/');
    setProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/categories/');
    setCategories(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://127.0.0.1:8000/api/products/${editing}/`, form);
    } else {
      await axios.post('http://127.0.0.1:8000/api/products/', form);
    }
    setForm({ name: '', description: '', price: '', stock_quantity: '', category: '' });
    setEditing(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditing(product.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`);
    fetchProducts();
  };

  return (
    <div>
      <h2>Produtos</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="text" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" step="0.01" placeholder="Preço" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input type="number" placeholder="Estoque" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} required />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Selecione Categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">{editing ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.stock_quantity}</td>
              <td>{product.category_name || 'N/A'}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Editar</button>
                <button onClick={() => handleDelete(product.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;