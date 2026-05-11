import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/categories/');
    setCategories(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://127.0.0.1:8000/api/categories/${editing}/`, form);
    } else {
      await axios.post('http://127.0.0.1:8000/api/categories/', form);
    }
    setForm({ name: '', description: '' });
    setEditing(null);
    fetchCategories();
  };

  const handleEdit = (category) => {
    setForm(category);
    setEditing(category.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/categories/${id}/`);
    fetchCategories();
  };

  return (
    <div>
      <h2>Categorias</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="text" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">{editing ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEdit(category)}>Editar</button>
                <button onClick={() => handleDelete(category.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;