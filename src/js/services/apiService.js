import axios from 'axios';
import config from '../config/apiConfig';

// класс с набором методов для взаимодействия с сервером
/**
 * / countries - возвращает массив доступных стран (array of countries)
 * / cities - array of cities
 * / price/cheap - массив доступных рейсов
 */
class Api {
  constructor(config) {
    this.url = config.url;
  }
  async countries() {
    try {
      const response = await axios.get(`${this.url}/countries`);
      return response.data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
  async cities() {
    try {
      const response = await axios.get(`${this.url}/cities`);
      return response.data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  // для получения инфо об аиакомпании
  async airlines() {
    try {
      const response = await axios.get(`${this.url}/airlines`);
      return response.data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async prices(params) {
    try {
      const response = await axios.get(`${this.url}/prices/cheap`, {
        params,
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

// создадим экземпляр этого класса
const api = new Api(config);

export default api;