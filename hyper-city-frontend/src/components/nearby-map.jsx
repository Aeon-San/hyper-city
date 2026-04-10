"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const defaultLocation = { lat: 28.6139, lng: 77.2090 }

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function MapUpdater({ coords }) {
  const map = useMap()

  useEffect(() => {
    if (!coords) return
    map.setView([coords.lat, coords.lng], 13)
  }, [coords, map])

  return null
}

export default function NearbyMap({ coords, services }) {
  const [mounted, setMounted] = useState(false)
  const initialCenter = coords ? [coords.lat, coords.lng] : [defaultLocation.lat, defaultLocation.lng]
  const initialZoom = coords ? 13 : 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-full w-full bg-slate-100 dark:bg-slate-900" />
  }

  return (
    <MapContainer
      key={coords ? `${coords.lat}-${coords.lng}` : "default"}
      center={initialCenter}
      zoom={initialZoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater coords={coords} />
      {coords && (
        <Marker position={[coords.lat, coords.lng]} icon={markerIcon}>
          <Popup>Your current location</Popup>
        </Marker>
      )}
      {services.map((service) => {
        const coordinates = service.location?.coordinates
        if (!coordinates) return null
        return (
          <Marker key={service._id} position={[coordinates[1], coordinates[0]]} icon={markerIcon}>
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold">{service.name}</p>
                <p>{service.vendorName || "Local vendor"}</p>
                <p>{service.area}, {service.city}</p>
                <p>{service.distanceKm != null ? `${service.distanceKm.toFixed(1)} km away` : 'Distance unknown'}</p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
