import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

// Init Select
const select = document.querySelectorAll('select');
M.FormSelect.init(select);
// для получения экземпляра select-a создадим ф-цию и сразу её экспортируем
export function getSelectInstance(elem) {
  return M.FormSelect.getInstance(elem);
}

// Init autocomplete
const autocomplete = document.querySelectorAll('.autocomplete');
M.Autocomplete.init(autocomplete);

export function getAutocompleteInstance(elem) {
  return M.Autocomplete.getInstance(elem);
}

// Init datepicker
const datepickers = document.querySelectorAll('.datepicker');
M.Datepicker.init(datepickers, {
  showClearBtn: true,
  format: 'yyyy-mm'
});

export function getDatepickerInstance(elem) {
  return M.Datepicker.getInstance(elem);
}