import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { clienteService, profissionalService, agendamentoService, pagamentoService } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    clientes: 0,
    profissionais: 0,
    agendamentos: 0,
    pagamentos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarStats = async () => {
      try {
        const [clientes, profissionais, agendamentos, pagamentos] = await Promise.all([
          clienteService.listar(),
          profissionalService.listar(),
          agendamentoService.listar(),
          pagamentoService.listar(),
        ])

        setStats({
          clientes: clientes.data?.length || 0,
          profissionais: profissionais.data?.length || 0,
          agendamentos: agendamentos.data?.length || 0,
          pagamentos: pagamentos.data?.length || 0,
        })
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarStats()
  }, [])

  const StatCard = ({ title, count, icon, color }) => (
    <Card className="card-custom text-center">
      <Card.Body>
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>{icon}</div>
        <h5>{title}</h5>
        <p style={{ fontSize: '28px', color, fontWeight: 'bold' }}>{count}</p>
      </Card.Body>
    </Card>
  )

  return (
    <Container className="container-main">
      <h1 className="mb-4">📊 Dashboard</h1>

      {loading ? (
        <div className="spinner-custom">
          <div className="spinner-border text-pink" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <Row className="g-4">
          <Col md={6} lg={3}>
            <StatCard
              title="Clientes"
              count={stats.clientes}
              icon="👥"
              color="#ff69b4"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title="Profissionais"
              count={stats.profissionais}
              icon="💇‍♀️"
              color="#ff69b4"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title="Agendamentos"
              count={stats.agendamentos}
              icon="📅"
              color="#ff69b4"
            />
          </Col>
          <Col md={6} lg={3}>
            <StatCard
              title="Pagamentos"
              count={stats.pagamentos}
              icon="💳"
              color="#ff69b4"
            />
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Dashboard
