# Trailbound SoCal

A responsive, map-first field guide to representative Southern California hikes and camping spots. Built with editable React/TypeScript source, Leaflet, and OpenStreetMap.

## Features

- Interactive pan-and-zoom map with hike and campsite markers
- Search by name, region, description, or amenity
- Filters for place type, difficulty, and region
- Responsive cards with distance, elevation gain, amenities, and permit notes
- Keyboard-accessible location cards and mobile-friendly layout
- Twelve representative locations stored directly in `app/page.tsx` for easy editing

## Run locally

1. Install [Node.js 22 or later](https://nodejs.org/).
2. Open this folder in Visual Studio Code.
3. Open the integrated terminal and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local address shown in the terminal.

## Edit the location data

Open `app/page.tsx` and find the `places` array near the top. Copy an existing object and edit its fields:

- `name`
- `type` (`Hike` or `Camp`)
- `difficulty` (`Easy`, `Moderate`, or `Hard`)
- `region`
- `coordinates` (`[latitude, longitude]`)
- `distance`
- `elevation`
- `amenities`
- `permit`
- `description`

The map, filters, counts, and cards update automatically.

## Production build

```bash
npm run build
```

## Deploy to GitHub Pages

The repository includes a standalone static version in `index.html`, `static.css`, and `static.js`. It does not require a build server.

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the GitHub repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and the `/(root)` folder, then save.
5. GitHub will publish the project at `https://YOUR-USERNAME.github.io/trailbound-socal/`.

The `app/` source remains available for the separately hosted Sites version.

## Map and data notes

Map tiles and attribution are provided by OpenStreetMap. Leaflet is loaded from its official unpkg distribution. Location details are representative planning information: always verify current permits, closures, weather, fire restrictions, water availability, and road conditions with the managing agency before traveling.
