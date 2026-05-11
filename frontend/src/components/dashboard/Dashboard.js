import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, customers: 0, sales: 0, revenue: 0 });
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, customersRes, salesRes, financialsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/products/'),
        axios.get('http://127.0.0.1:8000/api/customers/'),
        axios.get('http://127.0.0.1:8000/api/sales/'),
        axios.get('http://127.0.0.1:8000/api/financials/'),
      ]);

      // Compute revenue: try financials then fallback to sales totals
      let revenue = 0;
      if (Array.isArray(financialsRes.data) && financialsRes.data.length) {
        revenue = financialsRes.data.reduce((sum, r) => sum + (parseFloat(r.revenue) || 0), 0);
      } else if (Array.isArray(salesRes.data) && salesRes.data.length) {
        revenue = salesRes.data.reduce((sum, s) => sum + (parseFloat(s.total) || parseFloat(s.amount) || 0), 0);
      }

      setStats({
        products: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
        customers: Array.isArray(customersRes.data) ? customersRes.data.length : 0,
        sales: Array.isArray(salesRes.data) ? salesRes.data.length : 0,
        revenue,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/sales/');
      setOrders(Array.isArray(res.data) ? res.data.slice(0, 6) : []);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    }
  };

  return (
    <div className="dashboard-root">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="cards-grid">
        <div className="card">
          <div className="card-title">Produtos <span className="card-icon">👜</span></div>
          <div className="card-value">{stats.products}</div>
          <div className="card-foot">+2 this week</div>
        </div>

        <div className="card">
          <div className="card-title">Clientes <span className="card-icon">👤</span></div>
          <div className="card-value">{stats.customers}</div>
          <div className="card-foot">0 New Signups</div>
        </div>

        <div className="card">
          <div className="card-title">Vendas <span className="card-icon">📈</span></div>
          <div className="card-value">{stats.sales}</div>
          <div className="card-foot">0 Total Orders</div>
        </div>

        <div className="card">
          <div className="card-title">Receita Total <span className="card-icon">💵</span></div>
          <div className="card-value">R$ {stats.revenue.toFixed(2)}</div>
          <div className="card-foot">+0% Growth</div>
        </div>
      </div>

      <div className="panels">
        <div className="panel orders-panel">
          <h3>Recent Orders</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan="4" className="empty">No orders yet</td></tr>
              )}
              {orders.slice((page-1)*pageSize, page*pageSize).map((o) => (
                <tr key={o.id || o.pk}>
                  <td><Link to={`/sales/${o.id || o.pk || ''}`}>{o.id || o.pk || '-'}</Link></td>
                  <td>{(o.customer && (o.customer.name || o.customer)) || o.customer_name || o.customer || '-'}</td>
                  <td>{o.date ? o.date.split('T')[0] : (o.created_at ? String(o.created_at).split('T')[0] : '-')}</td>
                  <td>{o.status || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Anterior</button>
            <span> Página {page} </span>
            <button onClick={() => setPage(p => p+1)} disabled={orders.length <= page*pageSize}>Próxima</button>
          </div>
        </div>

        <div className="panel chart-panel">
          <h3>Sales Revenue Over Time</h3>
          <div className="chart-placeholder">
            <Line
              data={{
                labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
                datasets: [
                  {
                    label: 'Revenue',
                    data: [0,0,0,0,0,0,0,0,0],
                    borderColor: '#2b6f9a',
                    backgroundColor: 'rgba(43,111,154,0.12)',
                    tension: 0.4,
                    pointRadius: 3,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, ticks: { color: '#666' } },
                  x: { ticks: { color: '#666' } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;