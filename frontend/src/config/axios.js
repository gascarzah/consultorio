import axios from 'axios';
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/?$/, "/") ||
  "http://localhost:8080/consultorio/";

const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

const clienteAxios = axios.create({
  baseURL,
  timeout,
});

clienteAxios.interceptors.request.use(async (request) => {

  const token = localStorage.getItem("token")

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;

    const decodeAccessToken = jwt_decode(token);

    const accessTokenisExpired =
      dayjs.unix(decodeAccessToken.exp).diff(dayjs()) < 1;
    if (!accessTokenisExpired) return request;
    // localStorage.removeItem("token");

  }
  return request;
}, (error) => {
  // Do something with request error
  console.error('interceptors.request.error: ', error);
  return Promise.reject(error);
})


export default clienteAxios;