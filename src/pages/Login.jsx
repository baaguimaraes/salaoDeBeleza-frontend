import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'

const Login = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, senha)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4 card-custom" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Header className="text-center mb-4" style={{ background: 'none', border: 'none' }}>
          <h2 style={{ color: '#ff69b4' }}>💇‍♀️ Salão de Beleza</h2>
          <p className="text-muted">Sistema de Gerenciamento</p>
        </Card.Header>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="danger" className="w-100 btn-pink" disabled={loading} type="submit">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>

        <hr className="my-4" />

        <div className="text-center text-muted" style={{ fontSize: '12px' }}>
          <p>Credenciais de teste:</p>
          <p>Email: admin@salao.com</p>
          <p>Senha: 123456</p>
        </div>
      </Card>
    </Container>
  )
}

export default Login
