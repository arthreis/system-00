import axios from 'axios'

const _apiSystem01 = () => {
  const instance = axios.create({
    baseUrl: 'http://localhost:3333'
  })

  return instance
}

const _apiIbge = () => {
  const instance = axios.create({
    baseUrl: 'https://servicodados.ibge.gov.br/api/v1/localidades'
  })

  return instance
}

export const apiSystem01 = _apiSystem01();
export const apiIbge = _apiIbge();
