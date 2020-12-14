import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from "reactstrap";

export const Menu = () => {
  const styles = {
    menu: {
      display: 'flex',
    },
    menuItem: {
      margin: '5px',
      padding: '20px',
      border: 'solid #e8e',
      textDecoration: 'none',
    },
  }
  return (
    <Container style={styles.menu}>
      <Link to="/" style={styles.menuItem}>
        <div>Buscar pessoa</div>
      </Link>
      <br/>
      <Link to="/user" style={styles.menuItem}>
        <div>Criar Nova Pessoa</div>
      </Link>
      <br/>
      <Link to="/users" style={styles.menuItem}>
        <div>Listar Pessoa</div>
      </Link>
    </Container>
  )
}
