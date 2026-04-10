"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  { icon: Wrench, label: "Repairs", href: "#features" },
  { icon: GraduationCap, label: "Tutors", href: "#features" },
  { icon: UtensilsCrossed, label: "Food", href: "#features" },
  { icon: BriefcaseBusiness, label: "Business", href: "#features" },
  { icon: ShieldCheck, label: "Trusted", href: "#features" },
];

const HeroSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

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
                    <Link
                      key={index}
                      href={item.href}
                      className="mr-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-2 text-sm text-foreground">
                      <item.icon size={16} className="text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </Marquee>
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
    </section>
  );
};

export default HeroSection;
