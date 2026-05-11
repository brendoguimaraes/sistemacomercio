import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Financials = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ date: '', revenue: 0, expenses: 0 });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/financials/');
    setReports(response.data);
  };

  const calculateProfit = (revenue, expenses) => {
    return revenue - expenses;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profit = calculateProfit(parseFloat(form.revenue), parseFloat(form.expenses));
    const reportData = { ...form, profit };
    await axios.post('http://127.0.0.1:8000/api/financials/', reportData);
    setForm({ date: '', revenue: 0, expenses: 0 });
    fetchReports();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/financials/${id}/`);
    fetchReports();
  };

  return (
    <div>
      <h2>Relatórios Financeiros</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input type="number" step="0.01" placeholder="Receita" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} required />
        <input type="number" step="0.01" placeholder="Despesas" value={form.expenses} onChange={(e) => setForm({ ...form, expenses: e.target.value })} required />
        <p>Lucro: R$ {calculateProfit(parseFloat(form.revenue || 0), parseFloat(form.expenses || 0))}</p>
        <button type="submit">Gerar Relatório</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Receita</th>
            <th>Despesas</th>
            <th>Lucro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{new Date(report.date).toLocaleDateString()}</td>
              <td>R$ {report.revenue}</td>
              <td>R$ {report.expenses}</td>
              <td>R$ {report.profit}</td>
              <td>
                <button onClick={() => handleDelete(report.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Financials;