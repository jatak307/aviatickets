import "../css/style.css";
import "./plugins"; // файл index.js возьмется автоматически
import locations from "./store/locations";
import formUI from "./views/form";
import ticketsUI from "./views/tickets";
import currencyUI from "./views/currency";

// создадим единое место, где будем инициализировать наше приложение и вешать все обработчики
document.addEventListener("DOMContentLoaded", () => {
  const form = formUI.form;

  initApp();

  // Events
  form.addEventListener("submit", e => {
    e.preventDefault();
    onFormSubmit();
  });

  // Handlers (обработчики, стартовые функции)
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
  }

  async function onFormSubmit() {
    // cоберем данные из инпутов в один объект (чтобы потом его отправить на сервер в виде запроса)
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency
    });

    ticketsUI.renderTickets(locations.lastSearch);
  }
});
