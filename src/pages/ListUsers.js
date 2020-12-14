import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Pagination, PaginationItem, PaginationLink  } from "reactstrap";
import { ModalSys } from "../components/ModalSys";

import { system01Service } from "../services/system01Service";

export const ListUsers = (props) => {

  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [pages, setPages] = useState(1)

  const [user, setUser] = useState({});
  const [modal, setModal] = useState(false);

  const toggleModal = (user) => {
    setUser(user)
    setModal(!modal)
  };

  useEffect(() => {
    listPeoples(limit, page);
  }, [page,limit])

  const excluirUsuario = ({_id}) => {
    system01Service.remove(_id).then(() => {
      setModal(false)
      if(page !== 1) {
        setPage(1)
      }else{
        listPeoples(limit, 1)
      }
    }).catch((error) => {
      console.log('EXCLUIR ERROR', error);
    })
  }

  const handleChangePage = (newPage) => {
    if(newPage > 0 && newPage <= pages){
      setPage(newPage)
    }
  }

  const listPeoples = (limit, page) => {
    system01Service.list(limit, page).then(({data}) => {
      setUsers(data.peoples)
      setPages(Math.ceil(data.total/limit))
    }).catch((error) => {
      console.log('ERROR: ', error)
    })
  }

  return (
    <div>
      <Container>
        <h1>Gerenciando Pessoas Físicas e Jurídicas</h1>
        <Table responsive>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nome/Razão Social</th>
              <th>CPF/CNPJ</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map(user => (
                <tr key={user._id}>
                  <td>{user.tipoPessoa}</td>
                  <td>{user.nome}</td>
                  <td>{user.inscricao}</td>
                  <td>{user.telefone}</td>
                  <td>{user.endereco.cidade}</td>
                  <td>
                  <Button onClick={() => props.history.push(`/edit/${user._id}`)} color="primary">Editar</Button>
                  {' '}
                  <Button onClick={ () => toggleModal(user)} color="secondary">Excluir</Button></td>
                </tr>
              ))
            }

            {
              !users.length && (
                <h3>Ainda não há registros</h3>
              )
            }
          </tbody>

        </Table>
        <Pagination aria-label="Page navigation example">
          <PaginationItem>
            <PaginationLink first onClick={() => handleChangePage(1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink previous onClick={() => handleChangePage(page - 1)} />
          </PaginationItem>

          {
            [...Array(pages).keys()].map(
              num => (
                <PaginationItem active={num+1 === page} key={num}>
                  <PaginationLink onClick={() => handleChangePage(num+1)}>
                    {num+1}
                  </PaginationLink>
                </PaginationItem>
              )
            )
          }

          <PaginationItem>
            <PaginationLink next onClick={() => handleChangePage(page + 1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink last onClick={() => handleChangePage(pages)} />
          </PaginationItem>
        </Pagination>
      </Container>

      <ModalSys
        visible={modal}
        title={'Excluir Usuário'}
        text={`Deseja excluir o usuário ${user.nome} ?`}
        confirmAction={() => excluirUsuario(user)}
        cancelAction={() => setModal(false)}
        confirmLabel={'Excluir'}
        />
    </div>
  )
}
