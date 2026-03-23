// Initialize map
const map = L.map('map').setView([-26.2041, 28.0473], 5);

// Base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load GeoJSON
fetch('data/places.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {

        const name = feature.properties.name;
        const qid = feature.properties.wikidata;

        layer.bindPopup(`
          <b>${name}</b><br>
          <button onclick="loadWikidata('${qid}')">Load details</button>
          <div id="info-${qid}"></div>
        `);
      }
    }).addTo(map);
  });

// Fetch Wikidata info
function loadWikidata(qid) {
  const container = document.getElementById(`info-${qid}`);

  container.innerHTML = "Loading...";

  fetch(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`)
    .then(res => res.json())
    .then(data => {
      const entity = data.entities[qid];

      const label = entity.labels?.en?.value || "No label";
      const description = entity.descriptions?.en?.value || "No description";

      container.innerHTML = `
        <p><b>${label}</b></p>
        <p>${description}</p>
      `;
    })
    .catch(() => {
      container.innerHTML = "Failed to load data";
    });
}
