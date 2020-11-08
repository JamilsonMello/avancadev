import axios from 'axios';

const api = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data',
  headers: {
    authorization: `Apikey ${process.env.CRYPTO_COMPARE_KEY}`
  }
})

export default api;