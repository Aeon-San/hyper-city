"use client"

import { Fragment, useEffect, useState } from "react"
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const defaultLocation = { lat: 28.6139, lng: 77.2090 }

function MapUpdater({ coords }) {
  const map = useMap()

  useEffect(() => {
    if (!coords) return
    map.setView([coords.lat, coords.lng], 13)
  }, [coords, map])

  return null
}

function BoundsUpdater({ coords, services }) {
  const map = useMap()

  useEffect(() => {
    if (!coords) return

    const points = [[coords.lat, coords.lng]]
    services.forEach((service) => {
      const coordinates = service.location?.coordinates
      if (coordinates) {
        points.push([coordinates[1], coordinates[0]])
      }
    })

    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40] })
    }
  }, [coords, services, map])

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
      <BoundsUpdater coords={coords} services={services} />
      {coords && (
        <CircleMarker
          center={[coords.lat, coords.lng]}
          radius={9}
          pathOptions={{ color: "#2563eb", fillColor: "#60a5fa", fillOpacity: 0.9, weight: 3 }}
        >
          <Popup>Your current location</Popup>
        </CircleMarker>
      )}
      {services.map((service) => {
        const coordinates = service.location?.coordinates
        if (!coordinates) return null
        const vendorPoint = [coordinates[1], coordinates[0]]
        const userPoint = coords ? [coords.lat, coords.lng] : null
        return (
          <Fragment key={service._id}>
            {userPoint && (
              <Polyline positions={[userPoint, vendorPoint]} pathOptions={{ color: "#f97316", weight: 3, dashArray: "8 8" }} />
            )}
            <CircleMarker
              center={vendorPoint}
              radius={8}
              pathOptions={{ color: "#16a34a", fillColor: "#4ade80", fillOpacity: 0.9, weight: 2 }}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{service.name}</p>
                  <p>{service.vendorName || "Local vendor"}</p>
                  <p>{service.area}, {service.city}</p>
                  <p>{service.distanceKm != null ? `${service.distanceKm.toFixed(1)} km away` : 'Distance unknown'}</p>
                </div>
              </Popup>
            </CircleMarker>
          </Fragment>
        )
      })}
    </MapContainer>
  )
}
