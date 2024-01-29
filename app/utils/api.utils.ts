import axios, { AxiosInstance } from 'axios'
import UnAuthorizedException from '#exceptions/un_authorized.exception'
import TechnicalException from '#exceptions/technical.exception'

export function buildApiRequester(
  baseURL: string,
  tokenGetter: () => Promise<string | null>
): AxiosInstance {
  const apiRequester = axios.create({
    baseURL,
  })

  apiRequester.interceptors.request.use(async (config) => {
    try {
      const token = await tokenGetter()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        throw new UnAuthorizedException()
      }
      throw new TechnicalException()
    }
    return config
  })

  return apiRequester
}
