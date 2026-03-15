import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap'
import { pagamentoService, agendamentoService, clienteService } from '../services/api'

const Pagamentos = () => {
  const [pagamentos, setPagamentos] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    agendamentoId: '',
    valor: '',
    metodoPagamento: 'cartao',
    status: 'pendente',
    dataPagamento: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [pags, agends, clts] = await Promise.all([
        pagamentoService.listar(),
        agendamentoService.listar(),
        clienteService.listar(),
      ])
      setPagamentos(pags.data || [])
      setAgendamentos(agends.data || [])
      setClientes(clts.data || [])
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (pagamento = null) => {
    if (pagamento) {
      setFormData(pagamento)
      setEditingId(pagamento.id)
    } else {
      setFormData({
        agendamentoId: '',
        valor: '',
        metodoPagamento: 'cartao',
        status: 'pendente',
        dataPagamento: '',
      })
      setEditingId(null)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await pagamentoService.atualizar(editingId, formData)
        setSuccess('Pagamento atualizado com sucesso!')
      } else {
        await pagamentoService.criar(formData)
        setSuccess('Pagamento criado com sucesso!')
      }
      handleCloseModal()
      carregarDados()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao salvar pagamento')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este pagamento?')) {
      try {
        await pagamentoService.deletar(id)
        setSuccess('Pagamento deletado com sucesso!')
        carregarDados()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Erro ao deletar pagamento')
      }
    }
  }

  const getClienteNome = (agendamentoId) => {
    const agendamento = agendamentos.find((a) => a.id === agendamentoId)
    if (agendamento) {
      return clientes.find((c) => c.id === agendamento.clienteId)?.nome || 'N/A'
    }
    return 'N/A'
  }

  return (
    <Container className="container-main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>💳 Pagamentos</h1>
        <Button className="btn-pink" onClick={() => handleOpenModal()}>
          + Novo Pagamento
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="spinner-custom">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : pagamentos.length === 0 ? (
        <Alert variant="info">Nenhum pagamento cadastrado</Alert>
      ) : (
        <div className="card-custom">
          <Table hover responsive>
            <thead style={{ backgroundColor: '#ff69b4', color: 'white' }}>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td>{getClienteNome(pagamento.agendamentoId)}</td>
                  <td>R$ {parseFloat(pagamento.valor).toFixed(2)}</td>
                  <td>{pagamento.metodoPagamento}</td>
                  <td>
                    <span className={`badge bg-${pagamento.status === 'pago' ? 'success' : 'warning'}`}>
                      {pagamento.status}
                    </span>
                  </td>
                  <td>{pagamento.dataPagamento ? new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR') : 'N/A'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(pagamento)} className="me-2">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(pagamento.id)}>
                      Deletar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar Pagamento' : 'Novo Pagamento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Agendamento</Form.Label>
              <Form.Select
                value={formData.agendamentoId}
                onChange={(e) => setFormData({ ...formData, agendamentoId: e.target.value })}
                required
              >
                <option value="">Selecione um agendamento</option>
                {agendamentos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {getClienteNome(a.id)} - {new Date(a.dataHora).toLocaleDateString('pt-BR')}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor (R$)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Método de Pagamento</Form.Label>
              <Form.Select
                value={formData.metodoPagamento}
                onChange={(e) => setFormData({ ...formData, metodoPagamento: e.target.value })}
              >
                <option value="cartao">Cartão</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data do Pagamento</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.dataPagamento}
                onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default Pagamentos
