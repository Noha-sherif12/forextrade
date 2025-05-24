import { fetchData } from "./service.js";
import { populateDropdown } from "./service.js";
import { getSelectedCurrencies } from "./service.js";
import { useSelectedCurrencies } from "./service.js";
import { formatDateToLocal } from "./utils.js";
import { fetchTimeSeriesData } from "./service.js";
import { updateFlag } from "./service.js";


const minutesBtn = document.getElementById("minutes");
const hourBtn = document.getElementById("hour");
const dayBtn = document.getElementById("day");
const weekBtn = document.getElementById("week");
const monthBtn = document.getElementById("month");
const firstCurrency = document.getElementById("firstCurrency");
const secondCurrency = document.getElementById("secondCurrency");
const dropdowns = document.querySelectorAll(".dropDown");
const timeSeriesError = document.getElementById("timeSeriesError");
const currencyFetchingError = document.getElementById("currencyFetchingError");

firstCurrency.addEventListener("change", function () {
  useSelectedCurrencies();
  const selectedCurrency = firstCurrency.value;
  updateFlag("firstCurrencyFlag", selectedCurrency);
});
secondCurrency.addEventListener("change", async function () {
  useSelectedCurrencies();
  const selectedCurrency = secondCurrency.value;
  if (selectedCurrency) {
    try {
      const symbolResponse = await fetch(
        `https://restcountries.com/v3.1/currency/${selectedCurrency}`
      );
      if (!symbolResponse.ok) throw new Error("Network response was not ok");

      const symbolData = await symbolResponse.json();
      const selectedSymbol =
        symbolData[0]?.currencies[selectedCurrency]?.symbol;
      const currencySymbolElement = document.getElementById("currencySymbol");
      currencySymbolElement.textContent = selectedSymbol
        ? `${selectedSymbol}`
        : "Symbol not found";
    } catch (error) {
      alert("Symbol not found");
    }
  } else {
    currencySymbolElement.textContent = "";
  }
  updateFlag("secondCurrencyFlag", selectedCurrency);
});

minutesBtn.addEventListener("click", () => {
  let currencyPair = useSelectedCurrencies();
  console.log(currencyPair);
  let endDate = new Date();
  let startDate = new Date(endDate.getTime() - 15 * 60 * 1000);
  const formattedEndDate = formatDateToLocal(endDate);
  const formattedStartDate = formatDateToLocal(startDate);
  fetchTimeSeriesData(
    currencyPair,
    formattedStartDate,
    formattedEndDate,
    "minute",
    1
  );
});

hourBtn.addEventListener("click", () => {
  let currencyPair = useSelectedCurrencies();

  let endDate = new Date();
  let startDate = new Date(endDate.getTime() - 60 * 60 * 1000); // 1 hour ago

  const formattedEndDate = formatDateToLocal(endDate);
  const formattedStartDate = formatDateToLocal(startDate);

  fetchTimeSeriesData(
    currencyPair,
    formattedStartDate,
    formattedEndDate,
    "minute",
    5
  );
});

dayBtn.addEventListener("click", () => {
  let currencyPair = useSelectedCurrencies();

  let now = new Date();
  console.log(now);
  const endDate = now;
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getUTCDate() - 1);

  let formattedStartDate = formatDateToLocal(startDate);
  let formattedEndDate = formatDateToLocal(endDate);

  fetchTimeSeriesData(
    currencyPair,
    formattedStartDate,
    formattedEndDate,
    "hourly",
    5
  );
});

weekBtn.addEventListener("click", () => {
  let currencyPair = useSelectedCurrencies();

  let endDate = new Date(); // Current date and time
  let startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const formattedEndDate = formatDateToLocal(endDate);
  const formattedStartDate = formatDateToLocal(startDate);

  fetchTimeSeriesData(
    currencyPair,
    formattedStartDate,
    formattedEndDate,
    "daily",
    1
  );
});

monthBtn.addEventListener("click", async () => {
  const currencyPair = useSelectedCurrencies();

  let endDate = new Date(); // Current date and time
  let startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const formattedEndDate = formatDateToLocal(endDate);
  const formattedStartDate = formatDateToLocal(startDate);

  fetchTimeSeriesData(
    currencyPair,
    formattedStartDate,
    formattedEndDate,
    "daily",
    1
  );
});

fetchData();
