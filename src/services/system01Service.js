import { apiSystem01 } from "./api";

export const system01Service = {
  create(pessoa){
    return apiSystem01.post(`https://system-01.herokuapp.com/pessoas`, pessoa)
  },
  remove(id){
    return apiSystem01.delete(`https://system-01.herokuapp.com/pessoas`, { data: { id } })
  },
  list(limit, page){
    return apiSystem01.get('https://system-01.herokuapp.com/pessoas/list', { params: { limit, page } })
  },
  getUser(inscricao, codUf, uf, codCidade, cidade){
    return apiSystem01.get(`https://system-01.herokuapp.com/pessoas`, { params: { inscricao, codUf, uf, codCidade, cidade } })
  },
  getUserById(id){
    return apiSystem01.get(`https://system-01.herokuapp.com/pessoas/${id}`)
  },
  update(id, pessoa){
    return apiSystem01.put(`https://system-01.herokuapp.com/pessoas/${id}`, pessoa)
  }
}
