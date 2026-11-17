const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const resultsContainer = document.getElementById("results");

let travelData = null;

// Fetch the JSON once and cache it (Task 6)
async function loadData() {
  if (!travelData) {
    const response = await fetch("travel_helper_api.json");
    travelData = await response.json();
    console.log(travelData);
  }
  return travelData;
}

// Match variations like "beach", "Beaches", "BEACH" (Task 7)
function getCategory(keyword) {
  const k = keyword.trim().toLowerCase();
  if (k.includes("beach")) return "beaches";
  if (k.includes("temple")) return "temples";
  if (k.includes("countr")) return "countries";
  return null;
}

// Format the current time in a given time zone (Task 10)
function getLocalTime(timeZone) {
  const options = { timeZone, hour12: true, hour: "numeric", minute: "numeric", second: "numeric" };
  return new Date().toLocaleTimeString("en-US", options);
}

function createCard(item) {
  return `
    <div class="card">
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${item.time ? `<p class="local-time">Local time: ${item.time}</p>` : ""}
      </div>
    </div>
  `;
}

// Show results only after the Search button is clicked (Tasks 7 and 8)
async function showResults() {
  const keyword = searchInput.value;

  if (!keyword.trim()) {
    resultsContainer.innerHTML = `<p class="message">Please enter a keyword such as beach, temple, or country.</p>`;
    return;
  }

  const category = getCategory(keyword);
  if (!category) {
    resultsContainer.innerHTML = `<p class="message">No recommendations found. Try "beach", "temple", or "country".</p>`;
    return;
  }

  const data = await loadData();
  let items = [];

  if (category === "countries") {
    data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        items.push({ ...city, time: getLocalTime(country.timeZone) });
      });
    });
  } else {
    items = data[category];
  }

  resultsContainer.innerHTML = items.map(createCard).join("");
}

// Clear the input and results (Task 9)
function clearResults() {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
}

searchBtn.addEventListener("click", showResults);
resetBtn.addEventListener("click", clearResults);