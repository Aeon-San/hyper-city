"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Search, ShieldCheck } from "lucide-react"

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "")

const categoryItems = [
  { icon: MapPin, label: "Repairs" },
  { icon: Search, label: "Tutors" },
  { icon: ShieldCheck, label: "Food" },
  { icon: MapPin, label: "Business" },
  { icon: ShieldCheck, label: "Trusted" },
]

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
  const [selectedCategory, setSelectedCategory] = useState("Repairs")
  const [selectedCity, setSelectedCity] = useState("Delhi")
  const [coords, setCoords] = useState(null)
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [locationRequired, setLocationRequired] = useState(true)

  const cities = ["Delhi", "Mumbai", "Bangalore"]

  const displayedServices = useMemo(() => {
    if (!selectedCity) {
      return []
    }
    return services.filter((service) => service.city === selectedCity)
  }, [selectedCity, services])

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser. Enable location to view nearby services.")
      setLocationRequired(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: geo }) => {
        setCoords({ lat: geo.latitude, lng: geo.longitude })
        setError("")
        setLocationRequired(false)
      },
      (err) => {
        setCoords(null)
        setLocationRequired(true)
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access denied. Please allow location to view nearby services.")
        } else {
          setError("Enable location access to see nearby services.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  useEffect(() => {
    setIsLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      const categoryServices = dummyServicesByCategory[selectedCategory] || []
      setServices(categoryServices)
      setIsLoading(false)
    }, 300)
  }, [selectedCategory])

  return (
    <main className="min-h-screen w-full bg-background px-4 py-10 text-foreground md:px-6 lg:px-10">
      <div className="w-full max-w-full space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-muted-foreground">Nearby Services</p>
            <h1 className="mt-2 text-3xl font-bold">Location-based listings with vendor details</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600">
              Discover nearby services, vendor names, and service categories from your city. Enable location for live results or browse demo listings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/">Back Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="#services">Jump to services</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 rounded-3xl border border-border bg-background p-4">
            <div className="rounded-3xl border border-border/70 bg-card p-4">
              <p className="text-sm font-semibold">Your Location</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {coords ? "Location enabled" : "Location disabled or permission denied."}
              </p>
              {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
            </div>
            <div className="rounded-3xl border border-border/70 bg-card p-4">
              <p className="text-sm font-semibold">Select City</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCity === city
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}>
                    <MapPin className="mr-2 inline-block h-4 w-4" />
                    {city}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card p-4">
              <p className="text-sm font-semibold">Categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedCategory(item.label)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === item.label
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}>
                    <item.icon className="mr-2 inline-block h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section id="services" className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] font-semibold text-muted-foreground">Nearby Services</p>
                  <h2 className="mt-2 text-2xl font-bold">{selectedCategory} in {selectedCity}</h2>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {displayedServices.length} results
                </div>
              </div>
              {displayedServices.length === 0 && !isLoading && (
                <div className="mt-6 rounded-3xl border border-border/70 bg-slate-50 p-6 text-sm font-semibold text-slate-700">
                  No {selectedCategory} services found in {selectedCity}. Try selecting a different category or city.
                </div>
              )}
            </div>

            {displayedServices.length > 0 && (
              <div className="grid gap-4">
                {(isLoading ? Array.from({ length: 3 }) : displayedServices).map((service, index) => (
                  <div
                    key={service?._id || index}
                    className="rounded-3xl border border-border bg-white p-6 shadow-sm"
                  >
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
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            {service.distanceKm ? `${service.distanceKm} km` : "Nearby"}
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
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
