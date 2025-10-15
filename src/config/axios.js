import axios from 'axios';
const api = axios.create({
  baseURL: 'http://40.82.145.164:8080/api/'
});
export default api;