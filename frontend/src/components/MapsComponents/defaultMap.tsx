import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { toast } from "sonner";

// Corrigir o ícone do Leaflet que não carrega corretamente no React
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Definir o ícone padrão para todos os marcadores
L.Marker.prototype.options.icon = DefaultIcon;

interface DefaultMapProps {
  location: {
    latitude: number;
    longitude: number;
  };
  popupText?: string;
}

function DefaultMap({ location, popupText = "Ponto de encontro" }: DefaultMapProps) {
  const hasValidLocation = 
    location && 
    typeof location.latitude === 'number' && 
    typeof location.longitude === 'number';

    if (!hasValidLocation) {
      toast.error("Localização inválida");
      }
  
      const position: [number, number] = [location.latitude, location.longitude];
  
  return (
    <div className="relative w-full h-52 overflow-hidden rounded-lg">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{popupText}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default DefaultMap;