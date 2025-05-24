export function formatDateToLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}:${minutes}`;
}

export function displayError(errorHandling) {
  errorHandling.innerHTML = "Failed to fetch data";
  console.log(errorHandling);
}


export function clearError(errorHandling) {
    errorHandling.innerHTML = "";
    console.log("Error message cleared");
  }