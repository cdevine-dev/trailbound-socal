# Trailbound SoCal

A responsive, map-first field guide to memorable hikes and camping spots across Southern California.

[Visit the official Trailbound SoCal website](https://cdevine-dev.github.io/trailbound-socal/)

The project is also maintained on a Sites mirror, but the GitHub Pages address above is the official public URL.

## About

Trailbound SoCal helps outdoor enthusiasts compare representative trails and campsites from the coast to the high desert. Visitors can search the collection, filter by type, difficulty, and region, and select any location to find it on an interactive map.

The location information is intended as a planning starting point. Always verify current permits, closures, weather, fire restrictions, water availability, and road conditions with the managing agency before traveling.

## Features

- Interactive Leaflet and OpenStreetMap map
- Search by location, region, description, or amenity
- Type, difficulty, and region filters
- Responsive location cards with distance and elevation gain
- Amenities, permit notes, and short field descriptions
- Keyboard-accessible cards and mobile-friendly navigation
- Twelve representative Southern California hikes and campsites
- No account, API key, or paid map service required

## Technology

The repository contains two versions of the same experience:

- `index.html`, `static.css`, and `static.js` form the static GitHub Pages site.
- `app/` contains the React and TypeScript version used by the Sites deployment.

The interactive map uses [Leaflet](https://leafletjs.com/) with map data from [OpenStreetMap](https://www.openstreetmap.org/).

## Project structure

```text
trailbound-socal/
├── index.html          # GitHub Pages markup
├── static.css          # GitHub Pages styling
├── static.js           # Map, filters, and location data
├── app/                # React/TypeScript Sites version
├── public/             # Shared public assets
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

## Run the static site locally

The GitHub Pages version does not require a build step.

1. Clone the repository:

   ```bash
   git clone https://github.com/cdevine-dev/trailbound-socal.git
   cd trailbound-socal
   ```

2. Open `index.html` in a browser.

For a local web-server preview, run:

```bash
npx serve .
```

## Run the React version locally

Install [Node.js 22 or later](https://nodejs.org/), then run:

```bash
npm install
npm run dev
```

Open the local address displayed in the terminal.

## Edit the location data

For the GitHub Pages website, edit the `places` array near the top of `static.js`. Each location includes:

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

The React version keeps matching data in `app/page.tsx`. Update both files when you want the GitHub Pages and Sites versions to stay synchronized.

## Publish updates

GitHub Pages publishes from the `main` branch and repository root. After editing:

```bash
git add .
git commit -m "Describe your update"
git push
```

GitHub will automatically rebuild the public site.

## Contributing

Suggestions, corrections, and improvements are welcome.

1. Open an issue describing the proposed change.
2. Fork the repository and create a focused branch.
3. Make and test your changes.
4. Submit a pull request explaining what changed and why.

Please avoid submitting sensitive personal information or unverified safety claims. Participation in this project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

The source code is available under the [MIT License](LICENSE).

Map data is provided by OpenStreetMap contributors under its applicable terms. Third-party libraries and services retain their respective licenses and terms.
