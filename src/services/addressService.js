import { apiIbge } from "./api";

const getAllUFs = () => {
  const response = apiIbge.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
  return response;
}

const listarMunicipiosPorUF = (ufId) => {
  const response = apiIbge.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`)
  return response;
}

export { getAllUFs, listarMunicipiosPorUF }
