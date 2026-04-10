"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SeamlessCloud from "@/components/shadcn-space/blocks/hero-02/seamless-cloud";
import { Marquee } from "@/components/shadcn-space/animations/marquee";
import { BriefcaseBusiness, GraduationCap, MapPin, Search, ShieldCheck, Users, UtensilsCrossed, Wrench } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion, useInView } from "motion/react";

const propertyFeatures = [
  {
    icon: MapPin,
    label: "GPS Discovery",
    className: "border-e border-b",
    href: "#features",
  },
  {
    icon: Search,
    label: "Smart Search",
    className: "border-b",
    href: "#features",
  },
  {
    icon: Users,
    label: "Verified Providers",
    className: "border-e",
    href: "#features",
  },
  {
    value: "1000+",
    label: "Active Listings",
    className: "",
    href: "#features",
  },
];

const categoryItems = [
  { icon: Wrench, label: "Repairs" },
  { icon: GraduationCap, label: "Tutors" },
  { icon: UtensilsCrossed, label: "Food" },
  { icon: BriefcaseBusiness, label: "Business" },
  { icon: ShieldCheck, label: "Trusted" },
];

const dummyServicesByCategory = {
  Repairs: [
    { _id: "rep-1", name: "QuickFix Electric", area: "Sector 12", city: "Your City", distanceMeters: 320, distanceKm: 0.32 },
    { _id: "rep-2", name: "City Repair Hub", area: "Main Road", city: "Your City", distanceMeters: 780, distanceKm: 0.78 },
    { _id: "rep-3", name: "HandyPro Services", area: "Green Park", city: "Your City", distanceMeters: 1150, distanceKm: 1.15 },
  ],
  Tutors: [
    { _id: "tut-1", name: "Bright Minds Academy", area: "Lake View", city: "Your City", distanceMeters: 450, distanceKm: 0.45 },
    { _id: "tut-2", name: "Math Mentor Point", area: "Sector 8", city: "Your City", distanceMeters: 900, distanceKm: 0.9 },
    { _id: "tut-3", name: "Home Tutor Connect", area: "Civil Lines", city: "Your City", distanceMeters: 1400, distanceKm: 1.4 },
  ],
  Food: [
    { _id: "food-1", name: "Street Bites Corner", area: "City Center", city: "Your City", distanceMeters: 280, distanceKm: 0.28 },
    { _id: "food-2", name: "Cafe Midtown", area: "MG Road", city: "Your City", distanceMeters: 670, distanceKm: 0.67 },
    { _id: "food-3", name: "Tandoori Treats", area: "Old Market", city: "Your City", distanceMeters: 1320, distanceKm: 1.32 },
  ],
  Business: [
    { _id: "biz-1", name: "City Tax Consultants", area: "Business Bay", city: "Your City", distanceMeters: 510, distanceKm: 0.51 },
    { _id: "biz-2", name: "Legal Link Office", area: "Court Lane", city: "Your City", distanceMeters: 990, distanceKm: 0.99 },
    { _id: "biz-3", name: "BrandCraft Studio", area: "Tech Park", city: "Your City", distanceMeters: 1650, distanceKm: 1.65 },
  ],
  Trusted: [
    { _id: "trust-1", name: "Verified Home Care", area: "Sector 4", city: "Your City", distanceMeters: 360, distanceKm: 0.36 },
    { _id: "trust-2", name: "Prime Local Experts", area: "Railway Colony", city: "Your City", distanceMeters: 840, distanceKm: 0.84 },
    { _id: "trust-3", name: "SafeServe Network", area: "Airport Road", city: "Your City", distanceMeters: 1720, distanceKm: 1.72 },
  ],
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [coords, setCoords] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryItems[0].label);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState("");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const apiBaseUrl = useMemo(
    () => (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, ""),
    []
  );

  const displayedServices = useMemo(() => {
    if (nearbyServices.length > 0) {
      return nearbyServices;
    }

    return dummyServicesByCategory[selectedCategory] || [];
  }, [nearbyServices, selectedCategory]);

  const selectedCategoryDistance = useMemo(() => {
    const firstService = displayedServices[0];
    if (!firstService) {
      return null;
    }

    return `${Math.round(firstService.distanceMeters || 0)} m / ${firstService.distanceKm || 0} km`;
  }, [displayedServices]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setNearbyError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: geo }) => {
        setCoords({ lat: geo.latitude, lng: geo.longitude });
        setNearbyError("");
      },
      () => {
        setNearbyError("Enable location access to see near-me services.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const fetchNearbyServices = async () => {
      if (!coords || !selectedCategory) {
        return;
      }

      setIsLoading(true);
      setNearbyError("");

      try {
        const params = new URLSearchParams({
          lat: String(coords.lat),
          lng: String(coords.lng),
          category: selectedCategory,
          radiusKm: "10",
          limit: "6",
        });

        const response = await fetch(`${apiBaseUrl}/api/services?${params.toString()}`);
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Unable to fetch nearby services.");
        }

        setNearbyServices(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        setNearbyServices([]);
        setNearbyError(error.message || "Unable to fetch nearby services.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyServices();
  }, [coords, selectedCategory, apiBaseUrl]);

  return (
    <section ref={sectionRef}>
      <div
        className="bg-[url(https://images.shadcnspace.com/assets/backgrounds/real-estate-bg.webp)] bg-contain bg-center bg-repeat overflow-hidden xl:overflow-visible relative flex flex-col xl:h-screen justify-center z-10 xl:gap-0 gap-12">
        <div className="max-w-7xl mx-auto sm:px-16 px-4 w-full xl:pt-0 pt-32">
          <div className="relative text-white text-start z-30">
            <p className="text-inherit text-xs font-normal">Hyperlocal Discovery Platform</p>
            <h1
              className="text-inherit text-5xl! md:text-6xl! lg:text-7xl! font-normal! max-w-xl mt-2 mb-6">
              Find <span className="font-semibold!">Local Services</span>
            </h1>
            <div>
              <Button
                className="px-6 py-3.5 bg-white border-0 text-black duration-300 hover:bg-white/80 font-medium rounded-full hover:cursor-pointer h-auto">
                <a href="#features">Explore Services</a>
              </Button>
            </div>
          </div>
        </div>
        <div
          className="xl:absolute xl:-bottom-17.5 right-0 z-30 xl:w-full xl:max-w-6xl lg:w-4/5 w-full lg:ms-auto">
          <div className="relative">
            <div className="xl:absolute bottom-24 w-full z-0 xl:max-w-240 xl:right-0">
              <img
                src={
                  "https://images.shadcnspace.com/assets/backgrounds/hero-4-banner.webp"
                }
                alt="heroImg"
                width={956}
                height={897}
                className="w-full h-auto object-contain xl:ms-auto" />
            </div>
            <div
              className="w-full xl:max-w-3xl xl:ms-auto bg-background rounded-t-2xl xl:rounded-none xl:rounded-tl-2xl sm:py-10 py-6 sm:ps-12 ps-4 sm:pe-12 pe-4 xl:pe-20 z-1 relative">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{ duration: 0.05, ease: "easeInOut" }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-0 sm:flex sm:items-center justify-center sm:gap-10 sm:text-center">
                {propertyFeatures.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.05,
                      delay: 0.02 + index * 0.2,
                      ease: "easeInOut",
                    }}
                    className="flex sm:gap-10">
                    {item.label === "Smart Search" ? (
                      <button
                        type="button"
                        onClick={() => setSearchDialogOpen(true)}
                        className={`flex flex-col items-center gap-3 sm:py-0 sm:px-0 py-5 px-8 sm:border-0 border-gray-200 dark:border-gray-700 w-full rounded-lg text-left transition-colors hover:bg-muted/40 ${item.className}`}>
                        <item.icon size={28} className="text-foreground font-light" />
                        <p className="text-sm font-normal text-muted-foreground">{item.label}</p>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex flex-col items-center gap-3 sm:py-0 sm:px-0 py-5 px-8 sm:border-0 border-gray-200 dark:border-gray-700 w-full rounded-lg transition-colors hover:bg-muted/40 ${item.className}`}>
                        {item.icon ? (
                          <>
                            <item.icon size={28} className="text-foreground font-light" />
                            <p className="text-sm font-normal text-muted-foreground">
                              {item.label}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="sm:text-xl text-lg font-semibold text-foreground">
                              {item.value ?? item.price}
                            </p>
                            <p className="text-sm font-normal text-muted-foreground">
                              {item.label}
                            </p>
                          </>
                        )}
                      </Link>
                    )}
                    {index < propertyFeatures.length - 1 && (
                      <Separator orientation="vertical" className="h-12 my-auto sm:block hidden" />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
                }
                transition={{ duration: 0.25, delay: 0.15, ease: "easeInOut" }}
                className="mt-5 rounded-2xl border border-border/70 bg-background/80 p-3">
                <Link href="#features" className="px-2 pb-2 text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors inline-block">
                  Explore Categories
                </Link>
                <Marquee reverse pauseOnHover className="w-full [--duration:24s]">
                  {categoryItems.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedCategory(item.label)}
                      className={`mr-3 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-left transition-colors ${
                        selectedCategory === item.label
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border/60 bg-background text-foreground"
                      }`}>
                      <item.icon size={16} className="text-primary" />
                      <span className="flex flex-col items-start leading-tight">
                        <span className="font-medium leading-none">{item.label}</span>
                        {selectedCategory === item.label && selectedCategoryDistance && (
                          <span className="mt-1 text-[10px] leading-none text-muted-foreground">
                            {selectedCategoryDistance}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </Marquee>
                {isLoading && (
                  <p className="mt-2 px-2 text-xs text-muted-foreground">Loading nearby distance...</p>
                )}
                {!isLoading && nearbyError && displayedServices.length > 0 && (
                  <p className="mt-2 px-2 text-xs text-muted-foreground">Using demo distance data.</p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
        {/* Clouds */}
        <>
          <SeamlessCloud
            cloudCount={2}
            minSize={400}
            maxSize={678}
            opacity="opacity-60"
            gapMin={100}
            gapMax={500}
            top="top-56 sm:top-40 left-0" />
        </>
      </div>

      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="min-h-80 sm:max-w-xl md:max-w-2xl bg-background p-6 text-foreground">
          <DialogHeader className="gap-3">
            <DialogTitle className="text-xl">Smart Search</DialogTitle>
            <DialogDescription>
              Search local services by name, category, or area.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Try: electrician, tutor, cafe, MG Road"
            />
            <div className="flex flex-wrap gap-3">
              {categoryItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSearchText(item.label);
                    setSelectedCategory(item.label);
                  }}
                  className="rounded-full border border-border bg-muted/40 px-4 py-1.5 text-sm text-foreground hover:bg-muted">
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Dark and light mode are automatically supported in this modal.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
