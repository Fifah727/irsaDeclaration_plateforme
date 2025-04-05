// export default MadagascarMap;
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MadagascarMap = () => {
  const [regionsData, setRegionsData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    fetch("/madagascar_Region_level_1.geojson") // Chemin basé sur le dossier `public/`
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données GeoJSON chargées :", data);
        setRegionsData(data);
      })
      .catch((error) => console.error("Erreur lors du chargement des données GeoJSON :", error));
  }, []);

  const onEachRegion = (region, layer) => {
    if (region.properties && region.geometry) {
      const regionName = region.properties.shape1 || "Nom inconnu";
      layer.bindPopup(`<b>${regionName}</b>`);
      layer.on({
        click: () => {
          console.log("Région sélectionnée :", regionName);
          setSelectedRegion(regionName);
        },
      });
    }
  };

  const regionStyle = {
    fillColor: "#1E90FF",
    weight: 1,
    opacity: 1,
    color: "black",
    fillOpacity: 0.6,
  };

  return (
    <div>
      {regionsData ? (
        <MapContainer
          center={[-18.8792, 47.5079]} // Centre Madagascar
          zoom={6}
          minZoom={5} // Empêche un zoom trop éloigné
          maxBounds={[
            [-26, 42], // Sud-ouest de Madagascar
            [-11, 52], // Nord-est de Madagascar
          ]}
          maxBoundsViscosity={1.0} // Rend les limites rigides
          style={{ height: "500px", width: "100%" }}
        >
          <GeoJSON data={regionsData} style={regionStyle} onEachFeature={onEachRegion} />
        </MapContainer>
      ) : (
        <p>Chargement des données GeoJSON...</p>
      )}
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="region">Région sélectionnée :</label>
        <input
          type="text"
          id="region"
          value={selectedRegion}
          readOnly
          style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
        />
      </div>
    </div>
  );
};

export default MadagascarMap;
