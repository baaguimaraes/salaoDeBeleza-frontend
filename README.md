# 💇‍♀️ Salão de Beleza - Frontend

Frontend de um sistema de gerenciamento de salão de beleza com React + Bootstrap.

## 🎯 Funcionalidades

✅ **Dashboard** - Visão geral com estatísticas
✅ **Gestão de Clientes** - Criar, editar, deletar clientes
✅ **Gestão de Profissionais** - Gerenciar equipe
✅ **Agendamentos** - Sistema completo de marcação
✅ **Pagamentos** - Controle de pagamentos
✅ **Autenticação JWT** - Login seguro

## 🛠️ Dependências

- React 18.2.0
- React Router DOM 6.20.0
- Bootstrap 5.3.2
- Axios 1.6.2
- Vite 5.0.8

## ⚙️ Instalação

1. **Clone o repositório**
   ```bash
   cd salaoDeBeleza-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o arquivo .env**
   ```bash
   cp .env.example .env
   ```
   - Atualize `VITE_API_URL` com a URL do seu backend (ex: http://localhost:5000)

## 🚀 Como rodar

### Modo desenvolvimento
```bash
npm run dev
```
O frontend estará disponível em `http://localhost:3001`

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## 📁 Estrutura de pastas

```
src/
├── pages/           # Páginas da aplicação
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Clientes.jsx
│   ├── Profissionais.jsx
│   ├── Agendamentos.jsx
│   └── Pagamentos.jsx
├── components/      # Componentes reutilizáveis
│   ├── Navbar.jsx
│   └── PrivateRoute.jsx
├── services/        # Serviços de API
│   └── api.js
├── context/         # Contextos React
│   └── AuthContext.jsx
├── styles/          # Estilos globais
│   └── global.css
├── App.jsx
└── main.jsx
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Token) para autenticação. O token é armazenado no `localStorage` e enviado automaticamente em cada requisição.

### Fluxo de autenticação
1. Usuário faz login com email e senha
2. Backend retorna um token JWT
3. Token é armazenado no localStorage
4. Token é enviado no header `Authorization: Bearer <token>` de cada requisição
5. Se o token expirar, usuário é redirecionado para login

## 📡 API Endpoints

### Autenticação
- `POST /auth/login` - Login

### Clientes
- `GET /clientes` - Listar todos
- `POST /clientes` - Criar novo
- `PUT /clientes/:id` - Atualizar
- `DELETE /clientes/:id` - Deletar

### Profissionais
- `GET /profissionais` - Listar todos
- `POST /profissionais` - Criar novo
- `PUT /profissionais/:id` - Atualizar
- `DELETE /profissionais/:id` - Deletar

### Agendamentos
- `GET /agendamentos` - Listar todos
- `POST /agendamentos` - Criar novo
- `PUT /agendamentos/:id` - Atualizar
- `DELETE /agendamentos/:id` - Deletar

### Pagamentos
- `GET /pagamentos` - Listar todos
- `POST /pagamentos` - Criar novo
- `PUT /pagamentos/:id` - Atualizar
- `DELETE /pagamentos/:id` - Deletar


## 📝 Notas

- O frontend espera que o backend esteja rodando em `http://localhost:3001`
- Ajuste a porta no `vite.config.js` se necessário
- Bootstrap é importado globalmente em `main.jsx`
