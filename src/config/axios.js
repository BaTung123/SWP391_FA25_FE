// import axios from 'axios';
// const api = axios.create({
//   baseURL: 'http://40.82.145.164:8080/api'
//   // baseURL: '/api'
  
// });
// export default api;


import axios from "axios";

const baseURL = import.meta.env.PROD
  ? "/api"                         // prod: gọi HTTPS -> Vercel rewrite
  : "/api";                        // dev: gọi qua Vite proxy '/api' (đã map tới API_TARGET)

const api = axios.create({
  baseURL: 'http://40.82.145.164:8080/api',
  withCredentials: true,           // nếu dùng cookie/session
  timeout: 20000,
});

export default api;
