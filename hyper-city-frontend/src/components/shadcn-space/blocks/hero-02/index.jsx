"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/shadcn-space/blocks/hero-02/hero";
import { HeroHeader } from "@/components/header";
import Features from "@/components/features-4";
import FooterSection from "@/components/footer";

const Hero02Page = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            setScrollProgress(Math.max(0, Math.min(100, progress * 100)));
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 h-1 bg-slate-200/50 backdrop-blur-sm">
                <div
                    className="h-full rounded-full transition-[width] duration-200 ease-out"
                    style={{ width: `${scrollProgress}%`, backgroundColor: '#3dca16' }}
                />
            </div>
            <HeroHeader />
            <main className="overflow-x-hidden bg-background text-foreground">
                <section id="home" className="-mt-20">
                    <HeroSection />
                </section>

                <section id="features" className="bg-background">
                    <Features />
                </section>
            </main>
            <FooterSection />
        </>
    );
};

export default Hero02Page;