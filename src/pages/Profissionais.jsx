import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap'
import { profissionalService } from '../services/api'

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', especialidade: '', telefone: '' })
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    carregarProfissionais()
  }, [])

  const carregarProfissionais = async () => {
    try {
      setLoading(true)
      const response = await profissionalService.listar()
      setProfissionais(response.data || [])
    } catch (err) {
      setError('Erro ao carregar profissionais')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (profissional = null) => {
    if (profissional) {
      setFormData(profissional)
      setEditingId(profissional.id)
    } else {
      setFormData({ nome: '', email: '', especialidade: '', telefone: '' })
      setEditingId(null)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({ nome: '', email: '', especialidade: '', telefone: '' })
    setEditingId(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await profissionalService.atualizar(editingId, formData)
        setSuccess('Profissional atualizado com sucesso!')
      } else {
        await profissionalService.criar(formData)
        setSuccess('Profissional criado com sucesso!')
      }
      handleCloseModal()
      carregarProfissionais()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Erro ao salvar profissional')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este profissional?')) {
      try {
        await profissionalService.deletar(id)
        setSuccess('Profissional deletado com sucesso!')
        carregarProfissionais()
        setTimeout(() => setSuccess(null), 3000)
      } catch (err) {
        setError('Erro ao deletar profissional')
      }
    }
  }

  return (
    <Container className="container-main">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>💇‍♀️ Profissionais</h1>
        <Button className="btn-pink" onClick={() => handleOpenModal()}>
          + Novo Profissional
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="spinner-custom">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : profissionais.length === 0 ? (
        <Alert variant="info">Nenhum profissional cadastrado</Alert>
      ) : (
        <div className="card-custom">
          <Table hover responsive>
            <thead style={{ backgroundColor: '#ff69b4', color: 'white' }}>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Especialidade</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map((profissional) => (
                <tr key={profissional.id}>
                  <td>{profissional.nome}</td>
                  <td>{profissional.email}</td>
                  <td>{profissional.especialidade}</td>
                  <td>{profissional.telefone}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(profissional)} className="me-2">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(profissional.id)}>
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
          <Modal.Title>{editingId ? 'Editar Profissional' : 'Novo Profissional'}</Modal.Title>
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
              <Form.Label>Especialidade</Form.Label>
              <Form.Control
                type="text"
                value={formData.especialidade}
                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                placeholder="Ex: Corte, Coloração, etc"
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
            <Button variant="success" type="submit" className="w-100">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default Profissionais
