import axios from 'axios'

export const createAxios = (axiosConfig: {
  baseUrl: string
  headers?: object
}) => {
  const axiosClient = axios.create({
    baseURL: axiosConfig.baseUrl,
    headers: { ...axiosConfig.headers },
  })

  /* c8 ignore start */
  axiosClient.interceptors.request.use(async (config) => {
    return config
  })

  axiosClient.interceptors.response.use(
    (response) => {
      if (response && response.data) {
        return response.data
      }
      return response
    },
    async (error) => {
      throw error
    },
  )

  return axiosClient
  /* c8 ignore end */
}
