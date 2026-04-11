"use client"

import { Fragment, useEffect, useState } from "react"
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const defaultLocation = { lat: 28.6139, lng: 77.2090 }

const formatDistance = (distanceKm) => {
  if (distanceKm == null || Number.isNaN(distanceKm)) {
    return "Distance unknown"
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }
  return `${distanceKm.toFixed(1)} km`
}

const toLineDistanceText = (serviceDistanceKm, userPoint, vendorPoint) => {
  if (serviceDistanceKm != null) {
    return formatDistance(serviceDistanceKm)
  }

  const meters = L.latLng(userPoint[0], userPoint[1]).distanceTo(L.latLng(vendorPoint[0], vendorPoint[1]))
  return formatDistance(meters / 1000)
}

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
  const [selectedServiceId, setSelectedServiceId] = useState(null)
  const [routePath, setRoutePath] = useState([])
  const [routeInfo, setRouteInfo] = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState("")
  const initialCenter = coords ? [coords.lat, coords.lng] : [defaultLocation.lat, defaultLocation.lng]
  const initialZoom = coords ? 13 : 5

  useEffect(() => {
    if (!selectedServiceId) {
      setRoutePath([])
      setRouteInfo(null)
      setRouteError("")
      return
    }

    if (!coords) {
      setRoutePath([])
      setRouteInfo(null)
      setRouteError("")
      return
    }

    const selectedService = services.find((service) => service._id === selectedServiceId)
    const coordinates = selectedService?.location?.coordinates

    if (!coordinates) {
      setRoutePath([])
      setRouteInfo(null)
      setRouteError("No coordinates for selected service")
      return
    }

    const abortController = new AbortController()
    const fromLng = coords.lng
    const fromLat = coords.lat
    const toLng = coordinates[0]
    const toLat = coordinates[1]

    const fetchRoute = async () => {
      setRouteLoading(true)
      setRouteError("")

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`,
          { signal: abortController.signal }
        )

        const payload = await response.json()

        if (!response.ok || payload.code !== "Ok" || !payload.routes?.[0]) {
          throw new Error("Route unavailable")
        }

        const route = payload.routes[0]
        const points = (route.geometry?.coordinates || []).map(([lng, lat]) => [lat, lng])

        setRoutePath(points)
        setRouteInfo({
          distanceKm: route.distance / 1000,
          durationMin: route.duration / 60,
        })
      } catch (error) {
        if (error.name === "AbortError") return
        setRoutePath([])
        setRouteInfo(null)
        setRouteError(error.message || "Unable to fetch route")
      } finally {
        setRouteLoading(false)
      }
    }

    fetchRoute()

    return () => {
      abortController.abort()
    }
  }, [coords, selectedServiceId, services])

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
      {routePath.length > 1 ? (
        <Polyline positions={routePath} pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.85 }} />
      ) : null}
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
        const midPoint = userPoint
          ? [(userPoint[0] + vendorPoint[0]) / 2, (userPoint[1] + vendorPoint[1]) / 2]
          : null
        return (
          <Fragment key={service._id}>
            {userPoint && (
              <>
                <Polyline positions={[userPoint, vendorPoint]} pathOptions={{ color: "#f97316", weight: 3, dashArray: "8 8" }} />
                <CircleMarker
                  center={midPoint}
                  radius={1}
                  pathOptions={{ opacity: 0, fillOpacity: 0 }}
                >
                  <Tooltip permanent direction="top" offset={[0, -6]}>
                    {toLineDistanceText(service.distanceKm, userPoint, vendorPoint)}
                  </Tooltip>
                </CircleMarker>
              </>
            )}
            <CircleMarker
              center={vendorPoint}
              radius={8}
              pathOptions={{ color: "#16a34a", fillColor: "#4ade80", fillOpacity: 0.9, weight: 2 }}
              eventHandlers={{
                click: () => setSelectedServiceId(service._id),
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -10]}>
                {service.name || "Service"}
              </Tooltip>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{service.name}</p>
                  <p>{service.vendorName || "Local vendor"}</p>
                  <p>{service.area}, {service.city}</p>
                  <p>
                    Contact: {service.phone ? (
                      <a href={`tel:${service.phone}`} className="font-medium text-blue-700 underline underline-offset-2">
                        {service.phone}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </p>
                  <p>{service.distanceKm != null ? `${formatDistance(service.distanceKm)} away` : 'Distance unknown'}</p>
                  {selectedServiceId === service._id && routeLoading ? <p>Route loading...</p> : null}
                  {selectedServiceId === service._id && routeInfo ? (
                    <p>
                      Route: {formatDistance(routeInfo.distanceKm)} • {Math.round(routeInfo.durationMin)} min
                    </p>
                  ) : null}
                  {selectedServiceId === service._id && routeError ? <p>{routeError}</p> : null}
                </div>
              </Popup>
            </CircleMarker>
          </Fragment>
        )
      })}
    </MapContainer>
  )
}
