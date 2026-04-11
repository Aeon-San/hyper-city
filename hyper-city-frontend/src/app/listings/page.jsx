"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroHeader } from "@/components/header";
import { Search, ShieldCheck, BriefcaseBusiness, GraduationCap, UtensilsCrossed, Wrench } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api-base";

const API_BASE_URL = getApiBaseUrl();

const categoryItems = [
  { icon: ShieldCheck, label: "All" },
  { icon: Wrench, label: "Repairs" },
  { icon: GraduationCap, label: "Tutors" },
  { icon: UtensilsCrossed, label: "Food" },
  { icon: BriefcaseBusiness, label: "Business" },
  { icon: ShieldCheck, label: "Trusted" },
];

function ListingsPageInner() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) setSearch(q);
    const cat = searchParams.get("category");
    if (cat && categoryItems.some((c) => c.label === cat)) {
      setSelectedCategory(cat);
    }
    const cy = searchParams.get("city");
    if (cy !== null) setCity(cy);
  }, [searchParams]);

  const displayedResults = useMemo(() => services, [services]);

  const fetchLocalListings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        country: "India",
        search: search.trim(),
        limit: "24",
      });

      if (city.trim()) {
        params.set("city", city.trim())
      }
      if (selectedCategory && selectedCategory !== "All") {
        params.set("category", selectedCategory)
      }

      const response = await fetch(`${API_BASE_URL}/services/listings?${params.toString()}`);
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
    <>
      <HeroHeader />
      <main className="min-h-screen w-full bg-background px-4 pt-24 pb-10 text-foreground md:px-6 lg:px-10">
      <div className="w-full max-w-full space-y-8">
        <div className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-black/60 dark:text-white/60">Local Listings</p>
            <h1 className="mt-1 text-xl font-bold text-black dark:text-white">Browse the broader local service directory</h1>
            <p className="mt-1 max-w-2xl text-xs font-medium text-black/70 dark:text-white/80">
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
              <p className="text-base font-bold text-black dark:text-white">Search by City</p>
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
              <p className="text-base font-bold text-black dark:text-white">Categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categoryItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedCategory(item.label)}
                    className={`rounded-full px-4 py-2 text-base font-bold transition ${
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
              <p className="text-base font-bold text-black dark:text-white">Why this page?</p>
              <p className="mt-2 text-base text-black/70 dark:text-white/80">
                Local Listings show a broader catalog of businesses in your city. Use this page when you want to compare options, plan ahead, or browse trusted providers.
              </p>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base uppercase tracking-[0.3em] font-semibold text-black/60 dark:text-white/60">Local Listings</p>
                  <h2 className="mt-2 text-3xl font-bold text-black dark:text-white">{selectedCategory === 'All' ? 'All categories' : selectedCategory} available in {city || 'your area'}</h2>
                </div>
                <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-base text-slate-700 dark:text-slate-200 font-semibold">
                  {isLoading ? "Loading..." : `${displayedResults.length} listings`}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-slate-100 dark:bg-slate-800 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-black/60 dark:text-white/60 font-semibold">Browse</p>
                  <p className="mt-1 text-lg font-bold text-black dark:text-white">General local directory</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-slate-100 dark:bg-slate-800 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-black/60 dark:text-white/60 font-semibold">Use case</p>
                  <p className="mt-1 text-lg font-bold text-black dark:text-white">Compare vendors and categories</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="grid gap-4 md:grid-cols-[1fr_280px]">
                <div>
                  <label className="text-base font-bold text-black dark:text-white" htmlFor="search">
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
                      {service.images?.[0]?.url ? (
                        <img
                          src={service.images[0].url}
                          alt={service.name}
                          className="mb-4 h-44 w-full rounded-2xl border border-border/70 object-cover"
                        />
                      ) : null}
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
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <>
          <HeroHeader />
          <main className="min-h-screen w-full bg-background px-4 pt-24 pb-10 md:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl space-y-4">
              <div className="h-28 animate-pulse rounded-3xl bg-muted" />
              <div className="h-72 animate-pulse rounded-3xl bg-muted" />
            </div>
          </main>
        </>
      }>
      <ListingsPageInner />
    </Suspense>
  );
}
