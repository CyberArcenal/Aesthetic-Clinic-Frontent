// // src/pages/public/contact/components/Map.tsx
// import React, { useEffect, useRef } from "react";
// import L from "leaflet";
// //@ts-ignore
// import "leaflet/dist/leaflet.css";

// interface Props {
//   coordinates: string; // "lat,lng"
//   address: string;
// }

// // Ayusin ang default marker icon para sa Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const Map: React.FC<Props> = ({ coordinates, address }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstance = useRef<L.Map | null>(null);

//   useEffect(() => {
//     if (!mapRef.current || !coordinates) return;

//     const parseCoordinates = (coordStr: string): [number, number] | null => {
//       const parts = coordStr.split(",").map(s => parseFloat(s.trim()));
//       if (parts.length !== 2 || parts.some(isNaN)) return null;
//       return parts as [number, number];
//     };

//     const coords = parseCoordinates(coordinates);
//     if (!coords) return;

//     // Clean up existing map
//     if (mapInstance.current) {
//       mapInstance.current.remove();
//       mapInstance.current = null;
//     }

//     if (mapRef.current.hasChildNodes()) {
//       mapRef.current.innerHTML = '';
//     }

//     try {
//       const map = L.map(mapRef.current).setView(coords, 15);
//       mapInstance.current = map;

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       L.marker(coords).addTo(map).bindPopup(address).openPopup();
//     } catch (error) {
//       console.error("Map initialization error:", error);
//     }

//     return () => {
//       if (mapInstance.current) {
//         mapInstance.current.remove();
//         mapInstance.current = null;
//       }
//     };
//   }, [coordinates, address]);

//   return <div ref={mapRef} className="h-80 w-full rounded-xl" />;
// };

// export default Map;