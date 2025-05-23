// MapDragglablePin.tsx
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef, useMemo } from "react";
import L from "leaflet";

interface MapDraggablePinProps {
  initialCenter: L.LatLngLiteral; // Default location for the map center
  onLocationChange?: (location: L.LatLngLiteral) => void; // Callback for location changes
}

function MapDraggablePin({
  initialCenter,
  onLocationChange,
}: MapDraggablePinProps) {
  const [position, setPosition] = useState(initialCenter);
  const markerRef = useRef<L.Marker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          if (onLocationChange) {
            onLocationChange({ lat: newPos.lat, lng: newPos.lng });
          }
        }
      },
    }),
    [onLocationChange]
  );



  return (
    <div className="relative w-full h-45.5 overflow-hidden rounded-[10px]">
      <MapContainer center={initialCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
      >
        <Popup>Arraste para definir o ponto de encontro</Popup>
      </Marker>
    </MapContainer>
    </div>
  );
}

export default MapDraggablePin;
