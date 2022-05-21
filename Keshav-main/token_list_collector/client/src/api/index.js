import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/',
})


export const getAllTokens = () => api.get(`/tokens`)

const apis = {
    getAllTokens,
}

export default apis