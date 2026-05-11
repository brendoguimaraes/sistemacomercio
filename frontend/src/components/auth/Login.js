import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get('http://127.0.0.1:8000/api/products/', {
        auth: { username, password },
      });
      if (remember) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
      }
      axios.defaults.auth = { username, password };
      onLogin();
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <div className="illustration" aria-hidden />
        </div>
        <div className="login-right">
          <h1 className="title">ENTRAR</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="label">Nome de Usuário</label>
            <input
              className="input"
              type="text"
              placeholder="@mail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="label">Senha</label>
            <input
              className="input"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="row between">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Lembrar de mim</span>
              </label>
              <a className="forgot" href="#">Esqueceu a senha?</a>
            </div>

            {error && <div className="error">{error}</div>}

            <button className="btn primary" type="submit">Entrar</button>

            <div className="signup">Não Tem Uma Conta? <a href="#">Cadastre-se.</a></div>

            <div className="divider">Logar Com</div>

            <div className="socials">
              <button type="button" className="social">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.4 3.3-3.4.95 0 1.9.17 1.9.17v2.1h-1.05c-1.04 0-1.36.65-1.36 1.32V12h2.3l-.37 2.9h-1.93v7A10 10 0 0022 12z"/></svg>
              </button>
              <button type="button" className="social">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#DB4437" xmlns="http://www.w3.org/2000/svg"><path d="M21.35 11.1h-9.2v2.9h5.4c-.23 1.4-1.1 2.5-2.34 3.1v2.6h3.78c2.2-2 3.5-5 3.5-8.6 0-.6-.06-1.2-.14-1.8z"/></svg>
              </button>
              <button type="button" className="social">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg"><path d="M16.365 1.43c-.8.05-1.77.54-2.34 1.17-.5.55-.95 1.5-.82 2.43 1.07.08 2.36-.6 3.05-1.34.4-.44.8-1.1.11-2.26zM12 6.5c-3.86 0-4.41 3.17-4.41 3.17-.06.2-.14.36-.23.52C6.46 11 6 12.21 6 13.8c0 2.65 1.62 5.02 3.9 5.02.8 0 1.5-.36 2.4-.36.93 0 1.5.36 2.4.36 2.28 0 3.9-2.37 3.9-5.02 0-1.86-.82-3.1-1.34-3.96C17.5 9 16.95 8.2 16.1 7.9c-.5-.18-1.16-.26-2.1-.2-.93.06-1.7.2-2 0z"/></svg>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;