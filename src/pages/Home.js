import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Button, Label, Input, FormGroup } from 'reactstrap';

import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

import { getAllUFs, listarMunicipiosPorUF } from "../services/addressService";
import { system01Service } from "../services/system01Service";

import * as Constants from "../constants";
import { cpfMask, cnpjMask } from "../utils/validations";

const Home = () => {

  const [codUf, setCodUf] = useState()
  const [uf, setUf] = useState('')
  const [ufs, setUfs] = useState([])

  const [codCidade, setCodCidade] = useState()
  const [cidade, setCidade] = useState('')
  const [cidades, setCidades] = useState([])

  const [tipoPessoa, setTipoPessoa] = useState(Constants.Strings.PESSOA.FISICA)
  const [pessoa, setPessoa] = useState({})

  const [inscricao, setInscricao] = useState('')

  const [captcha, setCaptcha] = useState('')

  const isPessoaFisica = () => {
    return tipoPessoa === Constants.Strings.PESSOA.FISICA;
  }

  useEffect(() => {
    loadCaptchaEnginge(4);
    getAllUFs().then((response) => {
      setUfs(response.data)
    }).catch((error) => {
      console.log('ERROR: ', error);
    })
  }, [])

  useEffect(() => {
    if(codUf){
      setCidade('')
      setCidades([])
      listarMunicipiosPorUF(codUf).then((response) => {
        setCidades(response.data)
      }).catch((error) => {
        console.log('ERROR: ', error);
      })
    }
  }, [codUf])


  const handlePessoa = (value) => {
    setCidade('')
    setCodCidade(0)
    setUf('')
    setCodUf(0)
    setInscricao('')
    setCidades([])
    setTipoPessoa(value)
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

  const isSearchDisabled = () => {
    return !!inscricao && !!uf && !!cidade && (isPessoaFisica ? inscricao.length === 14 : inscricao.length === 18)
  }

  const buscar = async () => {
    setCaptcha('')
    setPessoa({})
    const { data } = await system01Service.getUser(inscricao, codUf, uf, codCidade, cidade);
    if(data && data.length > 0){
      setPessoa(data[0])
    }
  }

  const doSubmit = () => {
    setPessoa({})
    setCaptcha('')
    const res = validateCaptcha(captcha)
    if (res === true) {
      buscar()
      console.log('Captcha Matched');
    } else {
      console.log('Captcha Does Not Match');
    }
  };

  return (
    <Container>
      <h1>Lista pública de telefone</h1>
      <h4>Selecione o tipo de busca e informe os dados pra encontrar o número de telefone</h4>

      <Container>
        <Container>
          <Row xs="6">
            <FormGroup check>
              <Label check>
                <Input type="radio" name="pessoa" value={Constants.Strings.PESSOA.FISICA} checked={isPessoaFisica()} onChange={e => handlePessoa(e.target.value)}/>
                Pessoa Física
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="pessoa" value={Constants.Strings.PESSOA.JURIDICA} checked={!isPessoaFisica()} onChange={e => handlePessoa(e.target.value)}/>
                Pessoa Jurídica
              </Label>
            </FormGroup>
          </Row>
        </Container>
      </Container>

      <div style={styles.content}>

        <Container style={styles.searchContent}>
          <FormGroup>
            <Label for="inscricao">Informe o {isPessoaFisica() ? "CPF" : "CNPJ"}:</Label>
            <Input type="text" name="inscricao" id="inscricao" placeholder={`Informe o ${isPessoaFisica() ? "CPF" : "CNPJ"}`}  value={inscricao} onChange={e => onChangeInscricao(e.target.value)} />
          </FormGroup>

          <Row>
            <Col md={4}>
              <FormGroup>
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
                <Input type="select" name="select" id="city" onChange={e => onChangeCidade(e.target)} value={codCidade}>
                  <option hidden value="">Cidade</option>
                  {cidades.map(cidade => (
                    <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Button color="primary" onClick={() => doSubmit()} disabled={!isSearchDisabled()} >Buscar</Button>
            </Col>
            <Col md={4}>
              <Input type="text" maxLength="4" onChange={e => setCaptcha(e.target.value)} />
              <LoadCanvasTemplate  />
            </Col>
          </Row>
        </Container>

        <div style={styles.resultContent}>
          <Container>
            <div>{pessoa.nome}</div>
            <div>{pessoa.inscricao}</div>
            <div>{pessoa.endereco?.cidade}</div>
            <div>{pessoa.telefone}</div>
          </Container>
        </div>

      </div>
    </Container>
  )
}

const styles = {
  content: {
    display: 'flex',
  },
  searchContent: {
    flex: 1,
  },
  resultContent: {
    flex: 1,
    borderStyle: 'solid',
    borderColor: 'grey',
  },
  result: {
    backgroundColor: 'blue',
  },
  inputRadioContent: {
    display: 'flex',
  },
}

export default Home
