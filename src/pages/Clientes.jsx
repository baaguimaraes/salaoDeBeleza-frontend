import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap'
import { clienteService } from '../services/api'

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', endereco: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = async () => {
    try {
      setLoading(true)
      const response = await clienteService.listar()
      setClientes(response.data || [])
    } catch (err) {
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setFormData(cliente)
      setEditingId(cliente.id)
    } else {
      setFormData({ nome: '', email: '', telefone: '', endereco: '' })
      setEditingId(null)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({ nome: '', email: '', telefone: '', endereco: '' })
    setEditingId(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await clienteService.atualizar(editingId, formData)
        setSuccess('Cliente atualizado com sucesso!')
      } else {
        await clienteService.criar(formData)
        setSuccess('Cliente criado com sucesso!')
      }
      handleCloseModal()
      carregarClientes()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao salvar cliente')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await clienteService.deletar(id)
        setSuccess('Cliente deletado com sucesso!')
        carregarClientes()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Erro ao deletar cliente')
      }
    }
  }

  return (
    <Container className="container-main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>👥 Clientes</h1>
        <Button className="btn-pink" onClick={() => handleOpenModal()}>
          + Novo Cliente
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="spinner-custom">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : clientes.length === 0 ? (
        <Alert variant="info">Nenhum cliente cadastrado</Alert>
      ) : (
        <div className="card-custom">
          <Table hover responsive>
            <thead style={{ backgroundColor: '#ff69b4', color: 'white' }}>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.endereco}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(cliente)} className="me-2">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(cliente.id)}>
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
          <Modal.Title>{editingId ? 'Editar Cliente' : 'Novo Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
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

export default Clientes
