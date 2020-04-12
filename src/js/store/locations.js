import api from "../services/apiService";
import {
  formatDate
} from '../helpers/date';

// store выступает как единый источник данных для приложения
// store может быть много: под каждую сущность своя store
// store - хранилище данных. Выступает посредником для коммуникации с API.
// реализуем ее ввиде класса (но может быть реализована и в виде объекта)
class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = {};
    this.airlines = {};
    this.lastSearch = {};
    this.formatDate = helpers.formatDate;
  }
  async init() {
    // сразу запросим города и страну у сервиса
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines()
    ]);

    // разделим ответ на страны и города с помощью деструктуризации полученного массива
    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);

    // console.log(this.cities);

    return response;
  }

  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find(
      item => item.full_name === key
    );
    return city.code;
  }

  // методы для получения названия городов
  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  // метод для работы с объектом авиокомпании (получаем имя авиокомпании, соответствующей имеющемуся коду)
  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : "";
  }

  //  метод для работы с объектом авиокомпании (получаем логотип авиокомпании, соответствующей имеющемуся коду)
  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : "";
  }

  // сформируем объект для автокомплита
  createShortCitiesList(cities) {
    // нам нужно сформировать объект вида
    // { 'City, Country': null}
    // так как получать мы здесь будем объект объектов, используем Object.entries - выдает [key, value]
    return Object.entries(cities).reduce((acc, [, city]) => {
      // для автокомплита нам нужно только название ключей, поэтому в значения им передаем null
      acc[city.full_name] = null;
      return acc;
    }, {});
  }

  // для формирования объектов авиакомпаний (чтоб везде было имя и логотип)
  serializeAirlines(airlines) {
    return airlines.reduce((acc, item) => {
      item.logo = `http://pics.avs.io/200/200/${item.code}.png`;
      item.name = item.name || item.name_translations.en;
      acc[item.code] = item;
      return acc;
    }, {});
  }

  // преобразуем вывод стран и городов в нужный нам формат
  serializeCountries(countries) {
    // нам нужен следующий формат
    // { 'Country code': { ...}}
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  serializeCities(cities) {
    // необходимый формат:
    // { 'City name, Country name': {...} }
    return cities.reduce((acc, city) => {
      const country_name = this.countries[city.country_code].name;
      city.name ? city.name : city.name_translations.en;
      // const city_name = city.name || city.name_translations.en;
      const full_name = `${city.name}, ${country_name}`; // название ключа, который добавим в объект города
      acc[city.code] = {
        ...city,
        country_name,
        full_name
      };
      return acc;
    }, {});
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);
  }

  serializeTickets(tickets) {
    // так как tickets - объект, будем его преобразовывать к массиву
    return Object.values(tickets).map(ticket => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        arline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
        returne_at: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
      };
    });
  }
}

const locations = new Locations(api, {
  formatDate
});

export default locations;

//