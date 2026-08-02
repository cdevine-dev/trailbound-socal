const places = [
  { id:1,name:"Sandstone Peak Loop",type:"Hike",difficulty:"Moderate",region:"Santa Monica Mountains",coordinates:[34.1203,-118.9317],distance:"6.0 mi",elevation:"1,075 ft",amenities:["Parking","Ocean views","Dogs on leash"],permit:"No permit; arrive early on weekends.",description:"A cinematic ridgeline loop to the highest point in the Santa Monica Mountains, with sandstone formations and Pacific views." },
  { id:2,name:"Bridge to Nowhere",type:"Hike",difficulty:"Hard",region:"San Gabriel Mountains",coordinates:[34.2381,-117.7655],distance:"10.0 mi",elevation:"1,870 ft",amenities:["River crossings","Restrooms at trailhead"],permit:"Adventure Pass required for parking.",description:"Follow the East Fork through repeated river crossings to an abandoned 1930s bridge deep in the canyon." },
  { id:3,name:"Mount Baldy via Devil’s Backbone",type:"Hike",difficulty:"Hard",region:"San Gabriel Mountains",coordinates:[34.2889,-117.6468],distance:"11.0 mi",elevation:"3,900 ft",amenities:["Summit views","Seasonal lodge"],permit:"Adventure Pass required; winter travel needs mountaineering skills.",description:"A demanding alpine classic climbing to 10,064 feet along an airy ridge with huge basin views." },
  { id:4,name:"Crystal Cove Moro Canyon",type:"Hike",difficulty:"Moderate",region:"Orange County Coast",coordinates:[33.5637,-117.8219],distance:"5.0 mi",elevation:"800 ft",amenities:["Restrooms","Beach","Picnic tables"],permit:"State park day-use fee.",description:"Coastal sage, broad ocean panoramas, and a beach finish make this a rewarding year-round loop." },
  { id:5,name:"Potato Chip Rock",type:"Hike",difficulty:"Hard",region:"San Diego County",coordinates:[33.0083,-116.9702],distance:"7.6 mi",elevation:"2,100 ft",amenities:["Parking","Restrooms","Photo spot"],permit:"Lake Poway parking fee on weekends/non-resident holidays.",description:"A steep climb up Mount Woodson to San Diego’s famously thin granite ledge and far-reaching inland views." },
  { id:6,name:"Ryan Mountain",type:"Hike",difficulty:"Moderate",region:"Joshua Tree",coordinates:[34.0026,-116.1359],distance:"3.0 mi",elevation:"1,050 ft",amenities:["Parking","Panoramic views"],permit:"Joshua Tree National Park entrance fee.",description:"A short, steady desert ascent ending with a 360-degree view across Joshua Tree’s boulder-strewn basins." },
  { id:7,name:"San Jacinto Peak via Tram",type:"Hike",difficulty:"Hard",region:"San Jacinto Mountains",coordinates:[33.8146,-116.6794],distance:"10.5 mi",elevation:"2,400 ft",amenities:["Tram","Restrooms","Water at station"],permit:"Free wilderness permit required; tram ticket separate.",description:"Ride from desert heat to cool pine forest, then climb to a 10,834-foot summit above Palm Springs." },
  { id:8,name:"Borrego Palm Canyon",type:"Hike",difficulty:"Moderate",region:"Anza-Borrego",coordinates:[33.2718,-116.4167],distance:"3.0 mi",elevation:"450 ft",amenities:["Restrooms","Visitor center nearby","Wildlife"],permit:"State park day-use fee at trailhead.",description:"A rocky desert canyon leads to a surprising native California fan-palm oasis frequented by bighorn sheep." },
  { id:9,name:"Jumbo Rocks Campground",type:"Camp",difficulty:"Easy",region:"Joshua Tree",coordinates:[33.9917,-116.0628],distance:"0.5 mi strolls",elevation:"Minimal",amenities:["Pit toilets","Fire rings","Picnic tables"],permit:"Reservation required in peak season; park entrance fee.",description:"Sleep among enormous sculpted boulders in one of Joshua Tree’s most iconic, stargazing-friendly campgrounds." },
  { id:10,name:"Kirk Creek Campground",type:"Camp",difficulty:"Easy",region:"Big Sur South",coordinates:[35.9907,-121.4948],distance:"1.0 mi access",elevation:"200 ft",amenities:["Ocean views","Fire rings","Vault toilets"],permit:"Advance reservation strongly recommended.",description:"Clifftop campsites look straight over the Pacific, with quick access to coastal trails and Los Padres backcountry." },
  { id:11,name:"San Onofre Bluffs Campground",type:"Camp",difficulty:"Easy",region:"San Diego Coast",coordinates:[33.3717,-117.5658],distance:"0.5 mi beach trail",elevation:"100 ft",amenities:["Restrooms","Showers","Beach access"],permit:"California State Parks reservation and camping fee.",description:"Blufftop camping above a long surf beach, with numbered trails descending to secluded stretches of sand." },
  { id:12,name:"Idyllwild Campground",type:"Camp",difficulty:"Easy",region:"San Jacinto Mountains",coordinates:[33.7454,-116.7153],distance:"Local trails",elevation:"Minimal",amenities:["Showers","Restrooms","Water","Town access"],permit:"Reserve through California State Parks.",description:"A pine-shaded basecamp within walking distance of Idyllwild, ideal for exploring San Jacinto trails." }
];

const elements = {
  search: document.querySelector("#search"),
  type: document.querySelector("#type"),
  difficulty: document.querySelector("#difficulty"),
  region: document.querySelector("#region"),
  count: document.querySelector("#result-count"),
  clear: document.querySelector("#clear"),
  cards: document.querySelector("#cards")
};

[...new Set(places.map(place => place.region))].sort().forEach(region => {
  elements.region.insertAdjacentHTML("beforeend", `<option>${region}</option>`);
});

const map = L.map("map", { scrollWheelZoom:true }).fitBounds(places.map(place => place.coordinates), { padding:[36,36] });
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom:18
}).addTo(map);

const markers = new Map();
let selectedId = null;

function markerFor(place) {
  const icon = L.divIcon({
    className:"custom-marker-wrap",
    html:`<span class="custom-marker ${place.type.toLowerCase()}">${place.type === "Hike" ? "▲" : "◆"}</span>`,
    iconSize:[34,34],
    iconAnchor:[17,17]
  });
  return L.marker(place.coordinates, { icon }).bindPopup(`<strong>${place.name}</strong><br>${place.region}<br>${place.distance} · ${place.difficulty}`);
}

function focusPlace(id) {
  const place = places.find(item => item.id === id);
  selectedId = id;
  document.querySelectorAll(".card").forEach(card => card.classList.toggle("selected", Number(card.dataset.id) === id));
  map.flyTo(place.coordinates, 11, { duration:.8 });
  setTimeout(() => markers.get(id)?.openPopup(), 450);
  if (window.innerWidth < 900) document.querySelector("#explore-map").scrollIntoView({ behavior:"smooth" });
}

function cardTemplate(place, index) {
  const amenityChips = place.amenities.slice(0,3).map(item => `<span>${item}</span>`).join("");
  return `<article class="card${selectedId === place.id ? " selected" : ""}" data-id="${place.id}" tabindex="0">
    <div class="card-top"><span class="type ${place.type.toLowerCase()}">${place.type === "Hike" ? "▲" : "◆"} ${place.type.toUpperCase()}</span><small>${String(index + 1).padStart(2,"0")}</small></div>
    <h3>${place.name}</h3><p class="region">⌖ ${place.region}</p><p class="description">${place.description}</p>
    <div class="metrics"><span><b>${place.distance}</b>DISTANCE</span><span><b>${place.elevation}</b>GAIN</span><span><b>${place.difficulty}</b>LEVEL</span></div>
    <div class="chips">${amenityChips}</div><div class="permit"><b>PERMIT NOTE</b><p>${place.permit}</p></div>
    <button class="view-button" type="button">VIEW ON MAP <span>↗</span></button>
  </article>`;
}

function render() {
  const query = elements.search.value.toLowerCase();
  const filtered = places.filter(place => {
    const text = `${place.name} ${place.region} ${place.description} ${place.amenities.join(" ")}`.toLowerCase();
    return text.includes(query) &&
      (elements.type.value === "All" || place.type === elements.type.value) &&
      (elements.difficulty.value === "All" || place.difficulty === elements.difficulty.value) &&
      (elements.region.value === "All" || place.region === elements.region.value);
  });
  elements.count.textContent = String(filtered.length).padStart(2,"0");
  elements.clear.hidden = !query && elements.type.value === "All" && elements.difficulty.value === "All" && elements.region.value === "All";
  elements.cards.innerHTML = filtered.length
    ? filtered.map(cardTemplate).join("")
    : '<div class="empty"><b>No trail found.</b><p>Try widening the filters or searching another region.</p><button id="reset" type="button">RESET FILTERS</button></div>';

  markers.forEach(marker => map.removeLayer(marker));
  markers.clear();
  filtered.forEach(place => {
    const marker = markerFor(place).addTo(map);
    markers.set(place.id, marker);
  });
  if (filtered.length) map.fitBounds(filtered.map(place => place.coordinates), { padding:[42,42], maxZoom:10 });

  document.querySelectorAll(".card").forEach(card => {
    const activate = () => focusPlace(Number(card.dataset.id));
    card.addEventListener("click", activate);
    card.addEventListener("keydown", event => { if (event.key === "Enter") activate(); });
  });
  document.querySelector("#reset")?.addEventListener("click", clearFilters);
}

function clearFilters() {
  elements.search.value = "";
  elements.type.value = "All";
  elements.difficulty.value = "All";
  elements.region.value = "All";
  render();
}

[elements.search,elements.type,elements.difficulty,elements.region].forEach(element => element.addEventListener(element.tagName === "INPUT" ? "input" : "change", render));
elements.clear.addEventListener("click", clearFilters);
render();
