import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap'
import { agendamentoService, clienteService, profissionalService } from '../services/api'

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    clienteId: '',
    profissionalId: '',
    dataHora: '',
    duracao: '',
    descricao: '',
    status: 'agendado',
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
      const [agend, clts, profs] = await Promise.all([
        agendamentoService.listar(),
        clienteService.listar(),
        profissionalService.listar(),
      ])
      setAgendamentos(agend.data || [])
      setClientes(clts.data || [])
      setProfissionais(profs.data || [])
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (agendamento = null) => {
    if (agendamento) {
      setFormData(agendamento)
      setEditingId(agendamento.id)
    } else {
      setFormData({
        clienteId: '',
        profissionalId: '',
        dataHora: '',
        duracao: '',
        descricao: '',
        status: 'agendado',
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
        await agendamentoService.atualizar(editingId, formData)
        setSuccess('Agendamento atualizado com sucesso!')
      } else {
        await agendamentoService.criar(formData)
        setSuccess('Agendamento criado com sucesso!')
      }
      handleCloseModal()
      carregarDados()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao salvar agendamento')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este agendamento?')) {
      try {
        await agendamentoService.deletar(id)
        setSuccess('Agendamento deletado com sucesso!')
        carregarDados()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Erro ao deletar agendamento')
      }
    }
  }

  const getClienteNome = (clienteId) => {
    return clientes.find((c) => c.id === clienteId)?.nome || 'N/A'
  }

  const getProfissionalNome = (profissionalId) => {
    return profissionais.find((p) => p.id === profissionalId)?.nome || 'N/A'
  }

  return (
    <Container className="container-main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📅 Agendamentos</h1>
        <Button className="btn-pink" onClick={() => handleOpenModal()}>
          + Novo Agendamento
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="spinner-custom">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : agendamentos.length === 0 ? (
        <Alert variant="info">Nenhum agendamento cadastrado</Alert>
      ) : (
        <div className="card-custom">
          <Table hover responsive>
            <thead style={{ backgroundColor: '#ff69b4', color: 'white' }}>
              <tr>
                <th>Cliente</th>
                <th>Profissional</th>
                <th>Data/Hora</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((agendamento) => (
                <tr key={agendamento.id}>
                  <td>{getClienteNome(agendamento.clienteId)}</td>
                  <td>{getProfissionalNome(agendamento.profissionalId)}</td>
                  <td>{new Date(agendamento.dataHora).toLocaleString('pt-BR')}</td>
                  <td>
                    <span className={`badge bg-${agendamento.status === 'agendado' ? 'primary' : 'success'}`}>
                      {agendamento.status}
                    </span>
                  </td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(agendamento)} className="me-2">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(agendamento.id)}>
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
          <Modal.Title>{editingId ? 'Editar Agendamento' : 'Novo Agendamento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profissional</Form.Label>
              <Form.Select
                value={formData.profissionalId}
                onChange={(e) => setFormData({ ...formData, profissionalId: e.target.value })}
                required
              >
                <option value="">Selecione um profissional</option>
                {profissionais.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data/Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.dataHora}
                onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duração (em minutos)</Form.Label>
              <Form.Control
                type="number"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="agendado">Agendado</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
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

export default Agendamentos
