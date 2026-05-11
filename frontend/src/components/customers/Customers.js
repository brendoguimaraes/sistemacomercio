import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/customers/');
    setCustomers(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`http://127.0.0.1:8000/api/customers/${editing}/`, form);
    } else {
      await axios.post('http://127.0.0.1:8000/api/customers/', form);
    }
    setForm({ name: '', email: '', phone: '', address: '' });
    setEditing(null);
    fetchCustomers();
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditing(customer.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/customers/${id}/`);
    fetchCustomers();
  };

  return (
    <div>
      <h2>Clientes</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="text" placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input type="text" placeholder="Endereço" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button type="submit">{editing ? 'Atualizar' : 'Adicionar'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <button onClick={() => handleEdit(customer)}>Editar</button>
                <button onClick={() => handleDelete(customer.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;