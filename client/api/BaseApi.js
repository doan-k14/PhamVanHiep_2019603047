import axios from 'axios'

const baseApi = axios.create({
  baseURL: 'https://open-source-project-api.vercel.app/api/v1',
  withCredentials: true,
})

export default baseApi
