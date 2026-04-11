"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeroHeader } from "@/components/header"
import { MapPin, Search, ShieldCheck } from "lucide-react"
import { getApiBaseUrl } from "@/lib/api-base"
import {
  GEO_BLOCK_MESSAGES,
  getGeolocationBlockReason,
} from "@/lib/geolocation-context"

const NearbyMap = dynamic(() => import("@/components/nearby-map"), {
  ssr: false,
})

const API_BASE_URL = getApiBaseUrl()

const categoryItems = [
  { icon: MapPin, label: "All" },
  { icon: MapPin, label: "Repairs" },
  { icon: Search, label: "Tutors" },
  { icon: ShieldCheck, label: "Food" },
  { icon: MapPin, label: "Business" },
  { icon: ShieldCheck, label: "Trusted" },
  { icon: MapPin, label: "Electricians" },
]

const toRadians = (degrees) => (degrees * Math.PI) / 180

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const earthRadiusKm = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((earthRadiusKm * c).toFixed(2))
}

const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) {
    return "Nearby"
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }
  return `${distanceKm} km`
}

const dummyServicesByCategory = {
  Repairs: [
    { _id: "rep-1", name: "QuickFix Electric", vendorName: "Amit Electrics", category: "Repairs", area: "Sector 12", city: "Delhi", distanceKm: 0.32 },
    { _id: "rep-2", name: "City Repair Hub", vendorName: "Ravi Repair Co.", category: "Repairs", area: "Main Road", city: "Delhi", distanceKm: 0.78 },
    { _id: "rep-3", name: "HandyPro Services", vendorName: "SmartFix Crew", category: "Repairs", area: "Green Park", city: "Delhi", distanceKm: 1.15 },
    { _id: "rep-4", name: "TechFix Center", vendorName: "Expert Tech", category: "Repairs", area: "Connaught Place", city: "Mumbai", distanceKm: 0.45 },
    { _id: "rep-5", name: "Pro Repair Solutions", vendorName: "Repair Masters", category: "Repairs", area: "Marina Bay", city: "Mumbai", distanceKm: 0.89 },
    { _id: "rep-6", name: "Quick Service Hub", vendorName: "Service Pro", category: "Repairs", area: "MG Road", city: "Bangalore", distanceKm: 0.56 },
    { _id: "rep-7", name: "Expert Repairs", vendorName: "Repair Experts", category: "Repairs", area: "Koramangala", city: "Bangalore", distanceKm: 1.23 },
  ],
  Tutors: [
    { _id: "tut-1", name: "Bright Minds Academy", vendorName: "Priya Tutors", category: "Tutors", area: "Lake View", city: "Delhi", distanceKm: 0.45 },
    { _id: "tut-2", name: "Math Mentor Point", vendorName: "Rohan Classes", category: "Tutors", area: "Sector 8", city: "Delhi", distanceKm: 0.9 },
    { _id: "tut-3", name: "Home Tutor Connect", vendorName: "StudyBuddy", category: "Tutors", area: "Civil Lines", city: "Delhi", distanceKm: 1.4 },
    { _id: "tut-4", name: "Excellence Coaching", vendorName: "Coach Arjun", category: "Tutors", area: "Fort", city: "Mumbai", distanceKm: 0.62 },
    { _id: "tut-5", name: "Smart Study Center", vendorName: "Study Masters", category: "Tutors", area: "Bandra", city: "Mumbai", distanceKm: 1.15 },
    { _id: "tut-6", name: "Scholar Academy", vendorName: "Prof Kumar", category: "Tutors", area: "Whitefield", city: "Bangalore", distanceKm: 0.78 },
    { _id: "tut-7", name: "Learning Hub", vendorName: "Tutor Priya", category: "Tutors", area: "Indiranagar", city: "Bangalore", distanceKm: 1.05 },
  ],
  Food: [
    { _id: "food-1", name: "Street Bites Corner", vendorName: "SpiceHouse", category: "Food", area: "City Center", city: "Delhi", distanceKm: 0.28 },
    { _id: "food-2", name: "Cafe Midtown", vendorName: "Brew Crew", category: "Food", area: "MG Road", city: "Delhi", distanceKm: 0.67 },
    { _id: "food-3", name: "Tandoori Treats", vendorName: "Nawab Kitchen", category: "Food", area: "Old Market", city: "Delhi", distanceKm: 1.32 },
    { _id: "food-4", name: "Island Café", vendorName: "Island Foods", category: "Food", area: "South Bombay", city: "Mumbai", distanceKm: 0.41 },
    { _id: "food-5", name: "Sea View Restaurant", vendorName: "Ocean Dining", category: "Food", area: "Gateway", city: "Mumbai", distanceKm: 0.93 },
    { _id: "food-6", name: "Garden Bistro", vendorName: "Farm Fresh", category: "Food", area: "Cubbon Park", city: "Bangalore", distanceKm: 0.38 },
    { _id: "food-7", name: "Tech Park Café", vendorName: "Café Delight", category: "Food", area: "Electronic City", city: "Bangalore", distanceKm: 1.12 },
    { _id: "food-8", name: "Flavor Heaven", vendorName: "Master Chefs", category: "Food", area: "Bangalore Fort", city: "Bangalore", distanceKm: 0.75 },
  ],
  Business: [
    { _id: "biz-1", name: "City Tax Consultants", vendorName: "LedgerCare", category: "Business", area: "Business Bay", city: "Delhi", distanceKm: 0.51 },
    { _id: "biz-2", name: "Legal Link Office", vendorName: "LegalEase", category: "Business", area: "Court Lane", city: "Delhi", distanceKm: 0.99 },
    { _id: "biz-3", name: "BrandCraft Studio", vendorName: "CreativePoint", category: "Business", area: "Tech Park", city: "Delhi", distanceKm: 1.65 },
    { _id: "biz-4", name: "Corporate Solutions", vendorName: "Biz Pro", category: "Business", area: "BKCI", city: "Mumbai", distanceKm: 0.58 },
    { _id: "biz-5", name: "Finance Advisors", vendorName: "Money Wise", category: "Business", area: "Worli", city: "Mumbai", distanceKm: 1.02 },
    { _id: "biz-6", name: "Tech Business Hub", vendorName: "Innovation Co", category: "Business", area: "Marathahalli", city: "Bangalore", distanceKm: 0.67 },
  ],
  Trusted: [
    { _id: "trust-1", name: "Verified Home Care", vendorName: "CareFirst", category: "Trusted", area: "Sector 4", city: "Delhi", distanceKm: 0.36 },
    { _id: "trust-2", name: "Prime Local Experts", vendorName: "ProAssist", category: "Trusted", area: "Railway Colony", city: "Delhi", distanceKm: 0.84 },
    { _id: "trust-3", name: "SafeServe Network", vendorName: "SafeHands", category: "Trusted", area: "Airport Road", city: "Delhi", distanceKm: 1.72 },
    { _id: "trust-4", name: "Trust Care Services", vendorName: "Care Expert", category: "Trusted", area: "Powai", city: "Mumbai", distanceKm: 0.52 },
    { _id: "trust-5", name: "Safe Hands Mumbai", vendorName: "Safety Plus", category: "Trusted", area: "Andheri", city: "Mumbai", distanceKm: 1.18 },
    { _id: "trust-6", name: "Bangalore Care Plus", vendorName: "Care Solutions", category: "Trusted", area: "Malleswaram", city: "Bangalore", distanceKm: 0.64 },
    { _id: "trust-7", name: "City Trusted Services", vendorName: "Service Guard", category: "Trusted", area: "Domlur", city: "Bangalore", distanceKm: 0.92 },
  ],
}

export default function NearbyPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [coords, setCoords] = useState(null)
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  /** Why GPS is not used (HTTPS / browser) — not an API failure */
  const [geoHint, setGeoHint] = useState("")
  /** Permission denied or API errors */
  const [error, setError] = useState("")
  const [browseCityInput, setBrowseCityInput] = useState("")
  const [browseCity, setBrowseCity] = useState("")

  const displayedServices = useMemo(() => services, [services])

  useEffect(() => {
    const block = getGeolocationBlockReason()
    if (block === "insecure") {
      setGeoHint(GEO_BLOCK_MESSAGES.insecure)
      return
    }
    if (block === "unsupported") {
      setGeoHint(GEO_BLOCK_MESSAGES.unsupported)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: geo }) => {
        setCoords({ lat: geo.latitude, lng: geo.longitude })
        setError("")
        setGeoHint("")
      },
      (err) => {
        setCoords(null)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoHint("Location access denied. You can still browse by city below.")
        } else {
          setGeoHint("Could not read your position. Try again or use city search below.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  useEffect(() => {
    const fetchNearby = async () => {
      if (!coords && !browseCity.trim()) {
        setServices([])
        return
      }

      setIsLoading(true)
      setError("")

      try {
        const params = new URLSearchParams({
          country: "India",
          search: "",
          limit: "48",
          ...(selectedCategory !== "All" ? { category: selectedCategory } : {}),
        })
        if (browseCity.trim()) {
          params.set("city", browseCity.trim())
        }

        const response = await fetch(`${API_BASE_URL}/services/listings?${params.toString()}`)
        const payload = await response.json()

        if (!response.ok || payload.success === false) {
          throw new Error(payload.message || "Unable to fetch nearby services.")
        }

        const serviceData = Array.isArray(payload.data) ? payload.data : []

        if (coords) {
          const servicesWithDistance = serviceData
            .map((service) => {
              const coordinates = service.location?.coordinates
              const distanceKm = coordinates
                ? getDistanceKm(coords.lat, coords.lng, coordinates[1], coordinates[0])
                : null

              return {
                ...service,
                distanceKm,
              }
            })
            .filter((service) => service.distanceKm !== null && service.distanceKm <= 10)

          servicesWithDistance.sort((a, b) => a.distanceKm - b.distanceKm)
          setServices(servicesWithDistance)
        } else {
          setServices(
            serviceData.map((service) => ({
              ...service,
              distanceKm: null,
            }))
          )
        }
      } catch (err) {
        setError(err.message || "Unable to fetch nearby services.")
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNearby()
  }, [coords, browseCity, selectedCategory])

  return (
    <>
      <HeroHeader />
      <main className="min-h-screen w-full bg-background px-4 pt-24 pb-10 text-foreground md:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24">
            <div className="rounded-3xl border border-border/70 bg-background p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Your Location</p>
              <p className="mt-2 text-xs text-black/70 dark:text-white/80">
                {coords
                  ? `✓ GPS on (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
                  : "GPS off — use HTTPS for automatic location, or search by city."}
              </p>
              {geoHint ? (
                <p className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-200">{geoHint}</p>
              ) : null}
              {error ? <p className="mt-2 text-xs text-destructive font-semibold">{error}</p> : null}
              {!coords ? (
                <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Browse by city</p>
                  <Input
                    placeholder="e.g. Delhi, Mumbai, Bangalore"
                    value={browseCityInput}
                    onChange={(e) => setBrowseCityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        setBrowseCity(browseCityInput.trim())
                      }
                    }}
                  />
                  <Button
                    type="button"
                    className="w-full"
                    variant="secondary"
                    onClick={() => setBrowseCity(browseCityInput.trim())}
                  >
                    Show services
                  </Button>
                  {browseCity ? (
                    <p className="text-[11px] text-muted-foreground">
                      Showing listings for <span className="font-semibold text-foreground">{browseCity}</span>
                      .{" "}
                      <button
                        type="button"
                        className="underline underline-offset-2 hover:text-foreground"
                        onClick={() => {
                          setBrowseCity("")
                          setBrowseCityInput("")
                        }}
                      >
                        Clear city
                      </button>
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="rounded-3xl border border-border/70 bg-background p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Categories</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {categoryItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedCategory(item.label)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                      selectedCategory === item.label
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-black dark:text-white hover:bg-muted/80"
                    }`}>
                    <item.icon className="mr-2 inline-block h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-background p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top Services</p>
              <div className="mt-3 space-y-3">
                {(displayedServices.length > 0 ? displayedServices.slice(0, 4) : dummyServicesByCategory[selectedCategory] || []).map((service) => (
                  <div key={service._id} className="rounded-2xl border border-border/70 bg-card px-3 py-3 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">{service.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{service.vendorName || 'Local vendor'}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-3xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Nearby Map</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Map view of nearby provider locations and your current position.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {coords ? "Live map" : "Default view"}
                </div>
              </div>
              <div className="mt-4 h-[420px] overflow-hidden rounded-3xl border border-border/70 bg-slate-100 dark:bg-slate-950">
                <NearbyMap coords={coords} services={services} />
              </div>
            </div>

            <section id="services" className="space-y-4">
              <div className="rounded-3xl border border-border bg-background p-4 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] font-semibold text-black/60 dark:text-white/60">Nearby Services</p>
                    <h2 className="mt-1 text-xl font-bold text-black dark:text-white">
                      {selectedCategory === "All" ? "Nearby services" : `${selectedCategory} near you`}
                    </h2>
                  </div>
                  <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                    {coords ? "GPS results" : browseCity ? `City: ${browseCity}` : "City or GPS"}
                  </div>
                </div>
                {!coords && !browseCity && (
                  <div className="mt-3 rounded-3xl border border-border/70 bg-slate-50 p-4 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    On <span className="font-semibold">http://</span> with an IP address, browsers do not allow GPS. Use{" "}
                    <span className="font-semibold">HTTPS</span> on your domain, or type a city in the sidebar.
                  </div>
                )}
              </div>

              {error ? (
                <div className="rounded-3xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive font-medium">
                  {error}
                </div>
              ) : null}

              {isLoading && displayedServices.length === 0 && (coords || browseCity) ? (
                <div className="grid gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-3xl border border-border/70 bg-white p-6 shadow-sm dark:bg-card">
                      <div className="space-y-4 animate-pulse">
                        <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {displayedServices.length > 0 ? (
                <div className="grid gap-4">
                  {(isLoading ? Array.from({ length: 3 }) : displayedServices).map((service, index) => (
                    <div key={service?._id || index} className="rounded-3xl border border-border/70 bg-white p-6 shadow-sm">
                      {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                          <div className="h-6 w-1/3 rounded bg-slate-200" />
                          <div className="h-4 w-1/2 rounded bg-slate-200" />
                          <div className="h-4 w-full rounded bg-slate-200" />
                          <div className="h-4 w-3/4 rounded bg-slate-200" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xl font-bold text-slate-900">{service.name}</p>
                              <p className="mt-1 text-sm font-semibold text-muted-foreground">Category: {service.category || "General"}</p>
                            </div>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                              {service.distanceKm != null ? formatDistance(service.distanceKm) : "City list"}
                            </span>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Vendor</p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">{service.vendorName || "Local Vendor"}</p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {service.area}, {service.city}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                !isLoading &&
                !error && (
                  <div className="rounded-3xl border border-border/70 bg-slate-50 p-6 text-center dark:bg-slate-800">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {coords
                        ? `No ${selectedCategory.toLowerCase()} services within 10 km.`
                        : browseCity
                          ? `No listings matched in ${browseCity} for this filter.`
                          : "Enter a city in the sidebar (or enable GPS over HTTPS) to see services."}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      Try another category or city.
                    </p>
                  </div>
                )
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
