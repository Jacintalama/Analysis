import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure CSS is imported
// Define a prop type for your component to accept GeoJSON data
interface WaterNetworkMapProps {
  geoJsonData?: GeoJSON.FeatureCollection;
}

// Replace 'YOUR_MAPBOX_ACCESS_TOKEN' with your actual Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoibGVzdGVyY3V0ZSIsImEiOiJjbHQyajZ5ZTExZnVhMmtvNXc5dG0xemw0In0.dMT5gb2TreClztmG3Wx-yQ";

  const WaterNetworkMap: React.FC<WaterNetworkMapProps> = ({ geoJsonData }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    
  useEffect(() => {
    if (!mapContainerRef.current) return; // Ensure the ref is set
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [125.1743, 6.1164],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    map.on("load", () => {
        console.log("Map loaded");
        console.log("GeoJSON Data:", geoJsonData);
      // Add 3D buildings layer
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;
      // Log the GeoJSON data to the console
      console.log(geoJsonData);
      
       // Click event listener for junctions
       map.on('click', 'junctions', (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          // You can now use 'feature.properties' to access the data of the clicked junction
          // and then pass it to your Analysis component or update the state accordingly
          console.log(feature.properties);

          // Example: Show Analysis component and pass the clicked junction data
          // This is where you'd trigger the visibility of your Analysis component
          // and pass the relevant data to it.
        }
      });
      
      // Add the entire GeoJSON as a source
      map.addSource("water-network", {
        type: "geojson",
        data: geoJsonData,
      });
      // Then add your layer(s) after the source is added/updated
      map.addLayer({
        id: "pipes",
        type: "line",
        source: "water-network",
        filter: ["==", ["get", "category"], "Pipe"], // Adjust 'category' to match your GeoJSON property
        paint: {
          "line-color": "#007cbf",
          "line-width": 2,
        },
      });
      // Example of adding a layer for junctions
      map.addLayer({
        id: "junctions",
        type: "circle",
        source: "water-network",
        filter: ["==", ["get", "category"], "Junction"], // Adjust 'category' to match your GeoJSON property
        paint: {
          "circle-radius": 5,
          "circle-color": "#ff0000",
        },
      });
      // Example of adding a layer for tanks
      map.addLayer({
        id: "tanks",
        type: "circle",
        source: "water-network",
        filter: ["==", ["get", "category"], "Tank"], // Adjust 'category' to match your GeoJSON property
        paint: {
          "circle-radius": 5,
          "circle-color": "#0000FF",
        },
      });
      
     
      map.addLayer({
        id: "reservoirs",
        type: "circle",
        source: "water-network",
        filter: ["==", ["get", "category"], "Reservoir"],
        paint: {
          "circle-radius": 6,
    
          "circle-color": "#FFFF00", // Blue stroke
          "circle-stroke-width": 1 // Stroke width
        },
      });
      
      
      // Ensure the reservoirs layer is visible
      map.setLayoutProperty('reservoirs', 'visibility', 'visible');

      // Example of adding a layer for pumps
      map.addLayer({
        id: "pumps",
        type: "line",
        source: "water-network",
        filter: ["==", ["get", "category"], "Pump"], // Adjust 'category' to match your GeoJSON property
        paint: {
          "line-width": 7,
          "line-color": "#00FFFF",
        },
      });

  

      // Example of adding a layer for valves
      map.addLayer({
        id: "valves",
        type: "circle",
        source: "water-network",
        filter: ["==", ["get", "category"], "Valve"], // Adjust 'category' to match your GeoJSON property
        paint: {
          "circle-radius": 5,
          "circle-color": "#FFFF00",
        },
      });

      map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
      // Check if geoJsonData exists and add it as a source and layer to the map
      if (geoJsonData) {
        if (!map.getSource("water-network")) {
          // Only add the source if it doesn't already exist
          map.addSource("water-network", {
            type: "geojson",
            data: geoJsonData,
          });
        }

        // Add a layer for the water network (adjust this based on your actual data)
        map.addLayer({
          id: "water-network-layer",
          type: "line", // or 'circle' for points, depending on your data
          source: "water-network",
          layout: {},
          paint: {
            "line-color": "#007cbf",
            "line-width": 2,
          },
        });
      }
    });

    return () => map.remove();
  }, [geoJsonData]); // Depend on geoJsonData to re-initialize the map when the data changes

  return (
    <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />
  );
};

export default WaterNetworkMap;
