import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  logout: () => localStorage.removeItem('token'),
}


export const clienteService = {
  listar: () => api.get('/clientes'),
  buscarPorId: (id) => api.get(`/clientes/${id}`),
  criar: (dados) => api.post('/clientes', dados),
  atualizar: (id, dados) => api.put(`/clientes/${id}`, dados),
  deletar: (id) => api.delete(`/clientes/${id}`),
}


export const profissionalService = {
  listar: () => api.get('/profissionais'),
  buscarPorId: (id) => api.get(`/profissionais/${id}`),
  criar: (dados) => api.post('/profissionais', dados),
  atualizar: (id, dados) => api.put(`/profissionais/${id}`, dados),
  deletar: (id) => api.delete(`/profissionais/${id}`),
}


export const agendamentoService = {
  listar: () => api.get('/agendamentos'),
  buscarPorId: (id) => api.get(`/agendamentos/${id}`),
  criar: (dados) => api.post('/agendamentos', dados),
  atualizar: (id, dados) => api.put(`/agendamentos/${id}`, dados),
  deletar: (id) => api.delete(`/agendamentos/${id}`),
  listarPorCliente: (clienteId) => api.get(`/agendamentos/cliente/${clienteId}`),
  listarPorProfissional: (profissionalId) => api.get(`/agendamentos/profissional/${profissionalId}`),
}


export const pagamentoService = {
  listar: () => api.get('/pagamentos'),
  buscarPorId: (id) => api.get(`/pagamentos/${id}`),
  criar: (dados) => api.post('/pagamentos', dados),
  atualizar: (id, dados) => api.put(`/pagamentos/${id}`, dados),
  deletar: (id) => api.delete(`/pagamentos/${id}`),
  listarPorAgendamento: (agendamentoId) => api.get(`/pagamentos/agendamento/${agendamentoId}`),
}

export default api
