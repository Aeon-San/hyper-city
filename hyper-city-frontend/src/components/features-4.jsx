import { MapPin, Zap, Users, Star, Clock, Shield } from 'lucide-react'

export default function Features() {
    return (
        <section id="features" className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div
                    className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-5xl md:text-6xl font-bold text-black dark:text-white">Discover Local Services Instantly</h2>
                    <p className="text-lg text-black/70 dark:text-white/80 font-medium">City Saathi connects you with trusted local service providers, from electricians to tutors, with location-aware discovery and real-time listings.</p>
                </div>

                <div
                    className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3 dark:divide-slate-700 dark:border-slate-700">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="size-6" />
                            <h3 className="text-lg font-bold text-black dark:text-white">GPS-Powered Search</h3>
                        </div>
                        <p className="text-base text-black/70 dark:text-white/80">Find nearby service providers instantly using real-time location and smart filtering.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className="size-6" />
                            <h3 className="text-lg font-bold text-black dark:text-white">Quick Connect</h3>
                        </div>
                        <p className="text-base text-black/70 dark:text-white/80">Reach local providers instantly and book services without delay.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="size-6" />

                            <h3 className="text-lg font-bold text-black dark:text-white">Business Profiles</h3>
                        </div>
                        <p className="text-base text-black/70 dark:text-white/80">View ratings, contact details, and service descriptions at a glance.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Star className="size-6" />

                            <h3 className="text-lg font-bold text-black dark:text-white">Categories</h3>
                        </div>
                        <p className="text-base text-black/70 dark:text-white/80">Browse electricians, tutors, cafes, repair techs and more by category.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Clock className="size-6" />

                            <h3 className="text-lg font-bold text-black dark:text-white">Real-Time Listings</h3>
                        </div>
                        <p className="text-base text-black/70 dark:text-white/80">Stay updated with live availability and instant service updates.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Shield className="size-6" />

                            <h3 className="text-lg font-bold text-black dark:text-white">Trusted Network</h3>
                        </div>
                        <p className="text-base text-black/70 dark:text-white/80">Connect with verified local businesses and service providers.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
