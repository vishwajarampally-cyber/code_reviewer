import api from './api'

export async function submitReview(code, language){
  const resp = await api.post('/review', { code, language })
  return resp.data
}

export default { submitReview }
