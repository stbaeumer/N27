# nearest-db-stations

Searches the nearest **stations of [Deutsche Bahn](http://db.de/)**, using [geokdbush](https://github.com/mourner/geokdbush). Data taken from the excellent [db-stations](https://github.com/derhuerst/db-stations) package.

[![build status](https://img.shields.io/travis/steffenmllr/nearest-db-stations.svg)](https://travis-ci.org/steffenmllr/nearest-db-stations)
[![npm version](https://img.shields.io/npm/v/nearest-db-stations.svg)](https://www.npmjs.com/package/nearest-db-stations)
[![npm version](https://img.shields.io/npm/v/nearest-db-stations.svg)](https://www.npmjs.com/package/nearest-db-stations)
![ISC-licensed](https://img.shields.io/github/license/steffenmllr/nearest-db-stations.svg)


## Installing

```shell
npm install nearest-db-stations
```


## Usage

```js
const nearestStations = require('nearest-db-stations')

const latitude = 52.509647;
const longitude = 13.375944;

const stations = nearestStations(latitude, longitude);

// Output as in db-stations

```

---

## API

#### nearestStations(longitude, latitude[, maxDistance, maxResults])

Returns an array of the closest points from a given location in order of increasing distance.

- `longitude`: query point longitude.
- `latitude`: query point latitude.
- `maxDistance`: (optional) maximum distance in meters to search within (`Infinity` by default).
- `maxResults`: (optional) maximum number of points to return (`5` by default).


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/steffenmllr/nearest-db-stations/issues).


## Data License

[The Dataset](http://data.deutschebahn.com/dataset/data-stationsdaten) is [published](http://data.deutschebahn.com/dataset/data-haltestellen) under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/) by *Deutsche Bahn (DB)*.
