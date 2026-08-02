"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Place = {
  id: number;
  name: string;
  type: "Hike" | "Camp";
  difficulty: "Easy" | "Moderate" | "Hard";
  region: string;
  coordinates: [number, number];
  distance: string;
  elevation: string;
  amenities: string[];
  permit: string;
  description: string;
};

declare global {
  interface Window {
    L?: {
      map: (el: HTMLElement, options: object) => LeafletMap;
      tileLayer: (url: string, options: object) => { addTo: (map: LeafletMap) => void };
      marker: (coords: [number, number], options?: object) => LeafletMarker;
      divIcon: (options: object) => object;
      latLngBounds: (coords: [number, number][]) => object;
    };
  }
}

type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (html: string) => LeafletMarker;
  openPopup: () => void;
};
type LeafletMap = {
  remove: () => void;
  fitBounds: (bounds: object, options: object) => void;
  flyTo: (coords: [number, number], zoom: number, options: object) => void;
};

const places: Place[] = [
  { id: 1, name: "Sandstone Peak Loop", type: "Hike", difficulty: "Moderate", region: "Santa Monica Mountains", coordinates: [34.1203, -118.9317], distance: "6.0 mi", elevation: "1,075 ft", amenities: ["Parking", "Ocean views", "Dogs on leash"], permit: "No permit; arrive early on weekends.", description: "A cinematic ridgeline loop to the highest point in the Santa Monica Mountains, with sandstone formations and Pacific views." },
  { id: 2, name: "Bridge to Nowhere", type: "Hike", difficulty: "Hard", region: "San Gabriel Mountains", coordinates: [34.2381, -117.7655], distance: "10.0 mi", elevation: "1,870 ft", amenities: ["River crossings", "Restrooms at trailhead"], permit: "Adventure Pass required for parking.", description: "Follow the East Fork through repeated river crossings to an abandoned 1930s bridge deep in the canyon." },
  { id: 3, name: "Mount Baldy via Devil’s Backbone", type: "Hike", difficulty: "Hard", region: "San Gabriel Mountains", coordinates: [34.2889, -117.6468], distance: "11.0 mi", elevation: "3,900 ft", amenities: ["Summit views", "Seasonal lodge"], permit: "Adventure Pass required; winter travel needs mountaineering skills.", description: "A demanding alpine classic climbing to 10,064 feet along an airy ridge with huge basin views." },
  { id: 4, name: "Crystal Cove Moro Canyon", type: "Hike", difficulty: "Moderate", region: "Orange County Coast", coordinates: [33.5637, -117.8219], distance: "5.0 mi", elevation: "800 ft", amenities: ["Restrooms", "Beach", "Picnic tables"], permit: "State park day-use fee.", description: "Coastal sage, broad ocean panoramas, and a beach finish make this a rewarding year-round loop." },
  { id: 5, name: "Potato Chip Rock", type: "Hike", difficulty: "Hard", region: "San Diego County", coordinates: [33.0083, -116.9702], distance: "7.6 mi", elevation: "2,100 ft", amenities: ["Parking", "Restrooms", "Photo spot"], permit: "Lake Poway parking fee on weekends/non-resident holidays.", description: "A steep climb up Mount Woodson to San Diego’s famously thin granite ledge and far-reaching inland views." },
  { id: 6, name: "Ryan Mountain", type: "Hike", difficulty: "Moderate", region: "Joshua Tree", coordinates: [34.0026, -116.1359], distance: "3.0 mi", elevation: "1,050 ft", amenities: ["Parking", "Panoramic views"], permit: "Joshua Tree National Park entrance fee.", description: "A short, steady desert ascent ending with a 360-degree view across Joshua Tree’s boulder-strewn basins." },
  { id: 7, name: "San Jacinto Peak via Tram", type: "Hike", difficulty: "Hard", region: "San Jacinto Mountains", coordinates: [33.8146, -116.6794], distance: "10.5 mi", elevation: "2,400 ft", amenities: ["Tram", "Restrooms", "Water at station"], permit: "Free wilderness permit required; tram ticket separate.", description: "Ride from desert heat to cool pine forest, then climb to a 10,834-foot summit above Palm Springs." },
  { id: 8, name: "Borrego Palm Canyon", type: "Hike", difficulty: "Moderate", region: "Anza-Borrego", coordinates: [33.2718, -116.4167], distance: "3.0 mi", elevation: "450 ft", amenities: ["Restrooms", "Visitor center nearby", "Wildlife"], permit: "State park day-use fee at trailhead.", description: "A rocky desert canyon leads to a surprising native California fan-palm oasis frequented by bighorn sheep." },
  { id: 9, name: "Jumbo Rocks Campground", type: "Camp", difficulty: "Easy", region: "Joshua Tree", coordinates: [33.9917, -116.0628], distance: "0.5 mi strolls", elevation: "Minimal", amenities: ["Pit toilets", "Fire rings", "Picnic tables"], permit: "Reservation required in peak season; park entrance fee.", description: "Sleep among enormous sculpted boulders in one of Joshua Tree’s most iconic, stargazing-friendly campgrounds." },
  { id: 10, name: "Kirk Creek Campground", type: "Camp", difficulty: "Easy", region: "Big Sur South", coordinates: [35.9907, -121.4948], distance: "1.0 mi access", elevation: "200 ft", amenities: ["Ocean views", "Fire rings", "Vault toilets"], permit: "Advance reservation strongly recommended.", description: "Clifftop campsites look straight over the Pacific, with quick access to coastal trails and Los Padres backcountry." },
  { id: 11, name: "San Onofre Bluffs Campground", type: "Camp", difficulty: "Easy", region: "San Diego Coast", coordinates: [33.3717, -117.5658], distance: "0.5 mi beach trail", elevation: "100 ft", amenities: ["Restrooms", "Showers", "Beach access"], permit: "California State Parks reservation and camping fee.", description: "Blufftop camping above a long surf beach, with numbered trails descending to secluded stretches of sand." },
  { id: 12, name: "Idyllwild Campground", type: "Camp", difficulty: "Easy", region: "San Jacinto Mountains", coordinates: [33.7454, -116.7153], distance: "Local trails", elevation: "Minimal", amenities: ["Showers", "Restrooms", "Water", "Town access"], permit: "Reserve through California State Parks.", description: "A pine-shaded basecamp within walking distance of Idyllwild, ideal for exploring San Jacinto trails." },
];

const regions = [...new Set(places.map((place) => place.region))].sort();

export default function Home() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<Place | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<number, LeafletMarker>>(new Map());

  const filtered = useMemo(() => places.filter((place) => {
    const text = `${place.name} ${place.region} ${place.description} ${place.amenities.join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase()) &&
      (type === "All" || place.type === type) &&
      (difficulty === "All" || place.difficulty === difficulty) &&
      (region === "All" || place.region === region);
  }), [query, type, difficulty, region]);

  useEffect(() => {
    const cssId = "leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (window.L) return setMapReady(true);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapElement.current || !window.L || mapRef.current) return;
    const L = window.L;
    const map = L.map(mapElement.current, { zoomControl: true, scrollWheelZoom: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
    map.fitBounds(L.latLngBounds(places.map((p) => p.coordinates)), { padding: [36, 36] });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [mapReady]);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;
    markersRef.current.clear();
    filtered.forEach((place) => {
      const icon = L.divIcon({
        className: "custom-marker-wrap",
        html: `<span class="custom-marker ${place.type.toLowerCase()}">${place.type === "Hike" ? "▲" : "◆"}</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      const marker = L.marker(place.coordinates, { icon }).addTo(mapRef.current!)
        .bindPopup(`<strong>${place.name}</strong><br>${place.region}<br>${place.distance} · ${place.difficulty}`);
      markersRef.current.set(place.id, marker);
    });
    if (filtered.length) {
      mapRef.current.fitBounds(L.latLngBounds(filtered.map((p) => p.coordinates)), { padding: [42, 42], maxZoom: 10 });
    }
  }, [filtered, mapReady]);

  const focusPlace = (place: Place) => {
    setSelected(place);
    mapRef.current?.flyTo(place.coordinates, 11, { duration: 0.8 });
    setTimeout(() => markersRef.current.get(place.id)?.openPopup(), 450);
    if (window.innerWidth < 900) document.getElementById("explore-map")?.scrollIntoView({ behavior: "smooth" });
  };

  const clearFilters = () => { setQuery(""); setType("All"); setDifficulty("All"); setRegion("All"); };

  return (
    <main>
      <header className="hero">
        <nav>
          <a className="brand" href="#"><span>▲</span> TRAILBOUND <em>SO·CAL</em></a>
          <a href="#explore">Explore</a>
          <a href="#community">Community</a>
          <a href="#about">Field notes</a>
        </nav>
        <div className="hero-content">
          <p className="eyebrow">CURATED OUTDOORS · SOUTHERN CALIFORNIA</p>
          <h1>Find your way<br /><i>out there.</i></h1>
          <p className="intro">Handpicked trails and campsites from the coast to the high desert. Filter the collection, explore the map, and plan a weekend worth remembering.</p>
          <a className="primary-button" href="#explore">EXPLORE 12 PLACES <span>↓</span></a>
        </div>
        <div className="hero-stats" aria-label="Collection highlights">
          <span><b>08</b> TRAILS</span><span><b>04</b> CAMPS</span><span><b>06</b> REGIONS</span>
        </div>
      </header>

      <section id="explore" className="explore">
        <div className="section-heading">
          <div><p className="eyebrow dark">THE FIELD GUIDE</p><h2>Choose your next<br /><i>escape.</i></h2></div>
          <p>Every place is selected for scenery, character, and that distinctly Southern California feeling.</p>
        </div>

        <div className="filters" aria-label="Filter locations">
          <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search places, regions, amenities…" /></label>
          <label><span>TYPE</span><select value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Hike</option><option>Camp</option></select></label>
          <label><span>DIFFICULTY</span><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>All</option><option>Easy</option><option>Moderate</option><option>Hard</option></select></label>
          <label><span>REGION</span><select value={region} onChange={(e) => setRegion(e.target.value)}><option>All</option>{regions.map((r) => <option key={r}>{r}</option>)}</select></label>
        </div>

        <div className="workspace">
          <div id="explore-map" className="map-panel">
            <div ref={mapElement} className="map" aria-label="Interactive map of Southern California hikes and campsites" />
            <div className="legend"><span><i className="dot hike" />HIKES</span><span><i className="dot camp" />CAMPS</span></div>
          </div>
          <div className="results">
            <div className="results-head"><p><b>{String(filtered.length).padStart(2, "0")}</b> PLACES FOUND</p>{(query || type !== "All" || difficulty !== "All" || region !== "All") && <button onClick={clearFilters}>CLEAR ALL</button>}</div>
            <div className="cards">
              {filtered.map((place, index) => (
                <article key={place.id} className={`card ${selected?.id === place.id ? "selected" : ""}`} onClick={() => focusPlace(place)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && focusPlace(place)}>
                  <div className="card-top"><span className={`type ${place.type.toLowerCase()}`}>{place.type === "Hike" ? "▲" : "◆"} {place.type.toUpperCase()}</span><small>{String(index + 1).padStart(2, "0")}</small></div>
                  <h3>{place.name}</h3>
                  <p className="region">⌖ {place.region}</p>
                  <p className="description">{place.description}</p>
                  <div className="metrics"><span><b>{place.distance}</b>DISTANCE</span><span><b>{place.elevation}</b>GAIN</span><span><b>{place.difficulty}</b>LEVEL</span></div>
                  <div className="chips">{place.amenities.slice(0, 3).map((a) => <span key={a}>{a}</span>)}</div>
                  <div className="permit"><b>PERMIT NOTE</b><p>{place.permit}</p></div>
                  <button className="view-button" onClick={(e) => { e.stopPropagation(); focusPlace(place); }}>VIEW ON MAP <span>↗</span></button>
                </article>
              ))}
              {!filtered.length && <div className="empty"><b>No trail found.</b><p>Try widening the filters or searching another region.</p><button onClick={clearFilters}>RESET FILTERS</button></div>}
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="discord-join">
        <div className="discord-art">
          <div className="discord-orbit" aria-hidden="true" />
          <img src="/discord-icon.png" alt="Trailbound SoCal mountain and trail icon" />
        </div>
        <div className="discord-copy">
          <p className="eyebrow">THE COMMUNITY TRAILHEAD</p>
          <h2>Plan together.<br /><i>Go farther.</i></h2>
          <p>Swap trail conditions, share trip reports, suggest new places, and meet other hikers and campers exploring Southern California.</p>
          <div className="discord-topics" aria-label="Discord community topics">
            <span>TRAIL CONDITIONS</span><span>TRIP REPORTS</span><span>LOCAL TIPS</span>
          </div>
          <a className="discord-button" href="https://discord.gg/8r35tR2Awb" target="_blank" rel="noreferrer">
            JOIN THE DISCORD <span>↗</span>
          </a>
        </div>
      </section>

      <section id="about" className="field-notes">
        <p className="eyebrow">BEFORE YOU GO</p>
        <h2>Adventure is better<br /><i>with a little homework.</i></h2>
        <div className="notes">
          <article><b>01</b><h3>Check current conditions</h3><p>Weather, fire restrictions, road access, and seasonal closures can change quickly. Confirm details with the managing agency.</p></article>
          <article><b>02</b><h3>Carry more water</h3><p>Southern California is dry and exposed. Pack generously, start early, and turn around before heat or fatigue makes the choice for you.</p></article>
          <article><b>03</b><h3>Leave it better</h3><p>Stay on durable surfaces, pack out everything, respect wildlife, and follow local fire rules. These places depend on all of us.</p></article>
        </div>
      </section>

      <footer><a className="brand" href="#"><span>▲</span> TRAILBOUND <em>SO·CAL</em></a><p>Curated with respect for the wild places of Southern California.</p><a href="#explore">BACK TO MAP ↑</a></footer>
    </main>
  );
}
