import { displayError } from "./utils.js";
import { clearError } from "./utils.js";
import { myKey } from "./config.js";
import { fetchDataUrl } from "./config.js";
import { fetchTimeSeriesUrl } from "./config.js";
let myChart;
export async function fetchData() {
  try {
    let response = await fetch(`https://${fetchDataUrl}?api_key=${myKey}`);
    clearError(currencyFetchingError);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const currencies = data.available_currencies;
    populateDropdown(currencies);
  } catch (error) {
    displayError(currencyFetchingError);
  }
}

export function populateDropdown(currencies) {
  const options = Object.entries(currencies)
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join("");

  let dropdownHTML = `<option value="">Select Currency</option>${options}`;

  firstCurrency.innerHTML = dropdownHTML;
  secondCurrency.innerHTML = dropdownHTML;
}

export function getSelectedCurrencies() {
  let currencyCodes = [firstCurrency, secondCurrency].map(
    (dropdown) => dropdown.options[dropdown.selectedIndex].value
  );

  return currencyCodes;
}

export function updateFlag(elementId, currencyCode) {
  const flagElement = document.getElementById(elementId);
  const countryCode = currencyCode.slice(0, 2).toLowerCase();

  // Set the class for the flag
  flagElement.className = `fi rounded-circle fis fi-${countryCode}`;
  flagElement.innerHTML = ""; 

  // Check if the class is applied correctly (flag exists)
  const isFlagExists = document.querySelector(`.fi-${countryCode}`) !== null;

  if (!isFlagExists) {
    flagElement.innerHTML = "The flag doesn't exist."; // Set error message
    flagElement.className = "";
  } else {
    flagElement.innerHTML = ""; 
  }
}

export function useSelectedCurrencies() {
  let selectedCurrencies = getSelectedCurrencies();

  if (selectedCurrencies.some((code) => !code)) {
    console.error("Both currencies must be selected.");
    return undefined;
  }

  let currencyPair = selectedCurrencies.join("");
  let currencyPairLabel = selectedCurrencies.join("/");

  console.log("Combined Currency Pair:", currencyPair);
  let currencyPairElement = document.getElementById("currencyPair");
  currencyPairElement.textContent = `${currencyPairLabel}`;
  return currencyPair;
}

export async function fetchTimeSeriesData(
  currencyPair,
  startDate,
  endDate,
  interval,
  period
) {
  /////////////
  const localStorageKey = `${currencyPair}_${startDate}_${endDate}`; // Create a unique key

  // Check if data exists in local storage
  const cachedData = localStorage.getItem(localStorageKey);
  if (cachedData) {
    console.log("Using cached data from local storage");
    const data = JSON.parse(cachedData);
    displayChart(data.quotes);
    return;
  }
  try {
    const url = `https://${fetchTimeSeriesUrl}?api_key=${myKey}&currency=${currencyPair}&format=records&start_date=${startDate}&end_date=${endDate}&interval=${interval}&period=${period}`;
    console.log("Fetching data from URL:", url);

    const response = await fetch(url);
    clearError(timeSeriesError);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (!Array.isArray(data.quotes) || data.quotes.length === 0) {
      throw new Error("No quotes found in the API response.");
    }
    localStorage.setItem(localStorageKey, JSON.stringify(data));
    displayChart(data.quotes);
  } catch (error) {
    displayError(timeSeriesError);
  }
}

export function displayChart(quotes) {
  if (myChart) {
    myChart.destroy();
  }

  const closePrices = quotes.map((quote) => quote.close);
  const labels = quotes.map((quote) => quote.date);
  const lastClosePrice = closePrices[closePrices.length - 1];
  const sumClosePrices = closePrices.reduce((sum, price) => sum + price, 0);
  const averageClosePrice = sumClosePrices / closePrices.length;
  const percentChange = averageClosePrice * 100;
  const averageCurrencyElement = document.getElementById("averageCurrency");
  averageCurrencyElement.textContent = `${averageClosePrice.toFixed(
    4
  )} (${percentChange.toFixed(2)}%)`;
  const currencyQuoteElement = document.getElementById("currencyQuote");
  currencyQuoteElement.textContent = `${lastClosePrice}`;
  const ctx = document.getElementById("myChart");

  let lbs = new Array(closePrices.length).fill("");

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: lbs,
      datasets: [
        {
          data: closePrices,
          borderColor: "rgb(173,212,122)",
          backgroundColor: "rgb(243,249,235)",
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            display: false, // Hide the y-axis labels (values)
          },
          grid: {
            display: false,
          },
          beginAtZero: false,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const staticQuotes = [
    { date: "", close: 0 },
    { date: "", close: 0 },
    { date: "", close: 0 },
    { date: "", close: 0 },
    { date: "", close: 0 },
    { date: "", close: 0 },
    { date: "", close: 0 },
  ];
  displayChart(staticQuotes);
});
