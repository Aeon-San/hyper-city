"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, MapPin, BriefcaseBusiness, GraduationCap, UtensilsCrossed, Wrench } from "lucide-react";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const categoryItems = [
  { icon: Wrench, label: "Repairs" },
  { icon: GraduationCap, label: "Tutors" },
  { icon: UtensilsCrossed, label: "Food" },
  { icon: BriefcaseBusiness, label: "Business" },
  { icon: ShieldCheck, label: "Trusted" },
];

export default function ListingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Repairs");
  const [city, setCity] = useState("Your City");
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const displayedResults = useMemo(() => services, [services]);

  const fetchLocalListings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        city: city.trim() || "",
        category: selectedCategory,
        search: search.trim(),
        limit: "24",
      });

      const response = await fetch(`${API_BASE_URL}/api/services/listings?${params.toString()}`);
      const payload = await response.json();

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || "Unable to fetch local listings.");
      }

      setServices(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      setError(err.message || "Unable to fetch local listings.");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, [city, selectedCategory, search]);

  useEffect(() => {
    fetchLocalListings();
  }, [fetchLocalListings]);

  return (
    <main className="min-h-screen w-full bg-background px-4 py-10 text-foreground md:px-6 lg:px-10">
      <div className="w-full max-w-full space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-muted-foreground">Local Listings</p>
            <h1 className="mt-2 text-3xl font-bold">Browse the broader local service directory</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600">
              Explore trusted providers and service categories across the city. Use city search, filters, and keywords to compare options.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/">Back Home</Link>
            </Button>
            <Button variant="outline" type="button" onClick={fetchLocalListings}>
              Refresh Listings
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 rounded-3xl border border-border bg-background p-4">
            <div className="rounded-3xl border border-border/70 bg-card p-4">
              <p className="text-sm font-semibold">Search by City</p>
              <div className="mt-3 space-y-3">
                <Input
                  placeholder="City name"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
                <Button variant="secondary" className="w-full" onClick={fetchLocalListings}>
                  <Search className="mr-2 h-4 w-4" />
                  Search Listings
                </Button>
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

            <div className="rounded-3xl border border-border/70 bg-card p-4">
              <p className="text-sm font-semibold">Why this page?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Local Listings show a broader catalog of businesses in your city. Use this page when you want to compare options, plan ahead, or browse trusted providers.
              </p>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] font-semibold text-muted-foreground">Local Listings</p>
                  <h2 className="mt-2 text-2xl font-bold">{selectedCategory} available in {city || "your area"}</h2>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {isLoading ? "Loading..." : `${displayedResults.length} listings`}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Browse</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">General local directory</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Use case</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Compare vendors and categories</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_280px]">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground" htmlFor="search">
                    Search by keyword
                  </label>
                  <Input
                    id="search"
                    placeholder="Search by vendor, service, or area"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="flex items-end gap-3">
                  <Button variant="secondary" className="w-full" onClick={fetchLocalListings}>
                    Search Directory
                  </Button>
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-3xl border border-destructive/50 bg-destructive/10 p-6 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-3xl border border-border bg-white p-6 shadow-sm animate-pulse">
                      <div className="h-6 w-3/4 rounded bg-slate-200" />
                      <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="h-16 rounded-2xl bg-slate-200" />
                        <div className="h-16 rounded-2xl bg-slate-200" />
                      </div>
                    </div>
                  ))
                : displayedResults.length > 0
                ? displayedResults.map((service) => (
                    <div key={service._id} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-bold text-slate-900">{service.name}</p>
                          <p className="mt-1 text-sm font-semibold text-muted-foreground">{service.category || selectedCategory}</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                          Local listing
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Vendor</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">{service.vendorName || "Unknown"}</p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-slate-50 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Area</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">{service.area || "Citywide"}, {service.city || city}</p>
                        </div>
                      </div>
                    </div>
                  ))
                : (
                  <div className="rounded-3xl border border-border/70 bg-slate-50 p-6 text-sm text-slate-700">
                    No local listings matched your search. Try another city, category, or keyword.
                  </div>
                )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
