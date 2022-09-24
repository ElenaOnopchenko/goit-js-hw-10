import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchInput.addEventListener(
  'input',
  debounce(event => {
    event.preventDefault();
    const countryName = event.target.value.trim();
    cleanMarkup();
    if (countryName !== '') {
      fetchCountries(countryName).then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            '⚠️Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length === 0) {
          Notiflix.Notify.failure('❌Oops, there is no country with that name');
        } else if (countries.length >= 2 && countries.length <= 10) {
          renderCountryList(countries);
        } else if (countries.length === 1) {
          renderCountryCard(countries);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li><img src = "${country.flags.svg}" alt = "${country.name.official}" width="30" height="20"><b>     ${country.name.official}</b></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryCard(countries) {
  const countryCard = countries
    .map(country => {
      return `<h1><img src = "${country.flags.svg}" alt = "${
        country.name.official
      }" width="60" height="30"> ${country.name.official}</h1>
        <p><b>Capital:</b>  ${country.capital}</p>
        <p><b>Population:</b>  ${country.population}</p>
        <p><b>Languages:</b>  ${Object.values(country.languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = countryCard;
}

function cleanMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
