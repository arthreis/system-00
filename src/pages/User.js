import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { ModalSys } from "../components/ModalSys";

import { getAllUFs, listarMunicipiosPorUF } from "../services/addressService";
import { system01Service } from "../services/system01Service";

import * as Constants from "../constants";
import { cpfMask, cnpjMask, phoneMask } from "../utils/validations";

export const User = (props) => {

  const [tipoPessoa, setTipoPessoa] = useState(Constants.Strings.PESSOA.FISICA)

  const [codUf, setCodUf] = useState()
  const [uf, setUf] = useState('')
  const [ufs, setUfs] = useState([])

  const [codCidade, setCodCidade] = useState()
  const [cidade, setCidade] = useState('')
  const [cidades, setCidades] = useState([])

  const [nome, setNome] = useState('')
  const [inscricao, setInscricao] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [telefone, setTelefone] = useState('')

  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('')
  const [modalMsg, setModalMsg] = useState('')

  const toggleModal = (title, msg) => {
    setModalTitle(title)
    setModalMsg(msg)
    setModal(!modal)
  };

  const isPessoaFisica = () => {
    return tipoPessoa === Constants.Strings.PESSOA.FISICA;
  }

  const handleTipoPessoa = (value) => {
    if(!props.match.params.id){
      resetarTela()
      setTipoPessoa(value)
    }
  }

  const onChangeInscricao = (value) => {
    if (isPessoaFisica()) {
      setInscricao(cpfMask(value))
    } else {
      setInscricao(cnpjMask(value))
    }
  }

  const onChangeUf = (target) => {
    setUf(target.options[target.selectedIndex].text)
    setCodUf(target.value)
  }

  const onChangeCidade = (target) => {
    setCidade(target.options[target.selectedIndex].text)
    setCodCidade(target.value)
  }

  const onChangeDate = (value) => {
    setDataNascimento(value)
  }

  const handleSubmit = async() => {

    const usuario = {
      tipoPessoa,
      nome,
      inscricao,
      endereco: { codUf, uf, codCidade, cidade },
      dataNascimento: new Date(dataNascimento).toLocaleDateString(),
      telefone
    }

    if(!props.match.params.id){
      try {
        const { data } = await system01Service.create(usuario);
        if(data.error){
          toggleModal('Aviso', data.message)
        }else{
          toggleModal('Aviso','Usuário salvo com sucesso!')
        }
      } catch (error) {
        toggleModal('Aviso', 'Ocorreu um erro')
      }
    }else{
      try {
        const { data } = await system01Service.update(props.match.params.id, usuario);
        if(data.error){
          toggleModal('Aviso', data.message)
        }else{
          toggleModal('Aviso','Usuário alterado com sucesso!')
        }
      } catch (error) {
        toggleModal('Aviso', 'Ocorreu um erro')
      }
    }

    resetarTela()
  }

  const resetarTela = () => {
    setNome('')
    setInscricao('')
    setCodUf(0)
    setUf('')
    setCodCidade(0)
    setCidade(0)
    setDataNascimento('')
    setTelefone('')

    setCidades([])
  }

  useEffect(() => {
    resetarTela()
    if(props.match.params.id){
      system01Service.getUserById(props.match.params.id).then((response) => {
        setTipoPessoa(response.data.tipoPessoa)

        setNome(response.data.nome)
        setInscricao(response.data.inscricao)

        setCodUf(response.data.endereco.codUf)
        setUf(response.data.endereco.uf)
        setCodCidade(response.data.endereco.codCidade)
        setCidade(response.data.endereco.cidade)

        setDataNascimento(response.data.dataNascimento)
        setTelefone(response.data.telefone)
        setNome(response.data.nome)
      }).catch((error) => {
        toggleModal("ERROR-GET_USER_BY_ID", error);
      })
    }
    getAllUFs().then((response) => {
      setUfs(response.data)
    }).catch((error) => {
      toggleModal('ERROR-UFS: ', error);
    })
  }, [])

  useEffect(() => {
    if(codUf){
      setCidade('')
      setCidades([])
      listarMunicipiosPorUF(codUf).then((response) => {
        setCidades(response.data)
      }).catch((error) => {
        toggleModal('ERROR-CIDADES: ', error);
      })
    }
  }, [codUf])

  const isSubmitDisable = () => {
    return !!nome && !!inscricao && !!uf && !!cidade && !!telefone && telefone.length >=14 && (isPessoaFisica() ? inscricao.length === 14 : inscricao.length === 18) && (isPessoaFisica() ? !!dataNascimento : true)
  }

  return (
    <Container>
      <h1>Gerenciando Pessoas</h1>
      <h5>{props.match.params.id ? 'Alteração' : 'Criação'} de Pessoa Física/Jurídica</h5>
      <br/>
      <Form>

        <Container>
        <Row xs="6">
            <FormGroup check>
              <Label check>
                <Input type="radio" name="pessoa" value={Constants.Strings.PESSOA.FISICA} checked={isPessoaFisica()} onChange={e => handleTipoPessoa(e.target.value)}/>
                Pessoa Física
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="pessoa" value={Constants.Strings.PESSOA.JURIDICA} checked={!isPessoaFisica()} onChange={e => handleTipoPessoa(e.target.value)}/>
                Pessoa Jurídica
              </Label>
            </FormGroup>
          </Row>
        </Container>

        <FormGroup>
          <Label for="nome">Informe {isPessoaFisica() ? "o nome" : "a Razão Social"}:</Label>
          <Input type="text" name="nome" id="nome" placeholder={`Informe ${isPessoaFisica() ? "o nome" : "a Razão Social"}`} value={nome} onChange={e => setNome(e.target.value)}/>
        </FormGroup>

        <FormGroup>
          <Label for="inscricao">Informe o {isPessoaFisica() ? "CPF" : "CNPJ"}:</Label>
          <Input type="text" name="inscricao" id="inscricao" placeholder={`Informe o ${isPessoaFisica() ? "CPF" : "CNPJ"}`} value={inscricao} onChange={e => onChangeInscricao(e.target.value)}/>
        </FormGroup>

        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="uf">UF:</Label>
              <Input type="select" name="select" id="uf" onChange={e => onChangeUf(e.target)} value={codUf}>
                <option hidden value="">UF</option>
                { ufs.map(uf => (
                  <option key={uf.id} value={uf.id}>{uf.sigla}</option>
                )) }
              </Input>
            </FormGroup>
          </Col>

          <Col md={8}>
            <FormGroup>
              <Label for="city">Cidade:</Label>
              <Input type="select" name="select" id="city" onChange={e => onChangeCidade(e.target)} value={codCidade}>
                <option hidden value="">Cidade</option>
                {
                  cidades.map(cidade => (
                    <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
                  ))
                }
              </Input>
            </FormGroup>
          </Col>
        </Row>


        { isPessoaFisica() &&
        <FormGroup>
          <Label for="nascimento">Data de Nascimento:</Label>
          <Input type="date" name="nascimento" id="nascimento" value={dataNascimento} onChange={e => onChangeDate(e.target.value)}/>
        </FormGroup>}

        <FormGroup>
          <Label for="telefone">Informe o Telefone:</Label>
          <Input type="text" name="telefone" id="telefone" value={telefone} onChange={e => setTelefone(phoneMask(e.target.value))} />
        </FormGroup>

        <Button color="primary" onClick={() => handleSubmit()} disabled={!isSubmitDisable()}>{ !props.match.params.id ? 'Salvar' : 'Alterar'}</Button>
      </Form>

      <ModalSys
        visible={modal}
        title={modalTitle}
        text={modalMsg}
        confirmAction={() => setModal(!modal)}
      />

    </Container>
  );
}
