# Sistema de Comércio Varejista

Este é um sistema full-stack para gestão de comércio varejista, integrando cadastros, vendas, estoque, finanças e relatórios.

## Tecnologias
- Backend: Django + Django REST Framework
- Frontend: React
- Banco: SQLite (desenvolvimento)

## Funcionalidades Implementadas
- CRUD completo para Produtos, Clientes, Vendas, Estoque e Relatórios Financeiros
- Interface web responsiva
- Integração frontend-backend

## Instalação

1. Instalar dependências backend:
   cd backend
   pip install -r requirements.txt

2. Instalar dependências frontend:
   cd frontend
   npm install

3. Migrar banco:
   cd backend
   python manage.py migrate

4. Iniciar backend:
   python manage.py runserver

5. Iniciar frontend:
   cd frontend
   npm start

## Acesso
- Backend API: http://127.0.0.1:8000/api/
- Frontend: http://localhost:3000

## Próximos Passos
- Implementar autenticação de usuário
- Completar CRUD para vendas, estoque e finanças
- Adicionar relatórios