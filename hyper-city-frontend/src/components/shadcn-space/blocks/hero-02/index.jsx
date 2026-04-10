import HeroSection from "@/components/shadcn-space/blocks/hero-02/hero";
import { HeroHeader } from "@/components/header";
import Features from "@/components/features-4";
import FooterSection from "@/components/footer";

const Hero02Page = () => {
    return (
        <>
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