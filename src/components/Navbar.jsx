import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap'

const Navbar = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <BSNavbar bg="light" expand="lg" sticky="top" className="border-bottom">
      <Container>
        <BSNavbar.Brand as={Link} to="/dashboard" style={{ color: '#ff69b4', fontWeight: 'bold' }}>
          💇‍♀️ Salão de Beleza
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/clientes">
              Clientes
            </Nav.Link>
            <Nav.Link as={Link} to="/profissionais">
              Profissionais
            </Nav.Link>
            <Nav.Link as={Link} to="/agendamentos">
              Agendamentos
            </Nav.Link>
            <Nav.Link as={Link} to="/pagamentos">
              Pagamentos
            </Nav.Link>
            {user && (
              <>
                <span className="nav-text ms-2" style={{ color: '#666' }}>
                  👤 {user.nome || user.email}
                </span>
                <button className="btn btn-sm btn-danger ms-2" onClick={handleLogout}>
                  Sair
                </button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}

export default Navbar
