import { MapPin, Zap, Users, Star, Clock, Shield } from 'lucide-react'

export default function Features() {
    return (
        <section id="features" className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div
                    className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Discover Local Services Instantly</h2>
                    <p>Hyper City connects you with trusted local service providers, from electricians to tutors, all powered by GPS-based discovery and real-time listings.</p>
                </div>

                <div
                    className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3 dark:divide-slate-700 dark:border-slate-700">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="size-5" />
                            <h3 className="text-sm font-medium">GPS-Powered Search</h3>
                        </div>
                        <p className="text-sm">Find nearby service providers instantly using real-time location and smart filtering.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Zap className="size-5" />
                            <h3 className="text-sm font-medium">Quick Connect</h3>
                        </div>
                        <p className="text-sm">Reach local providers instantly and book services without delay.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Users className="size-5" />

                            <h3 className="text-sm font-medium">Business Profiles</h3>
                        </div>
                        <p className="text-sm">View ratings, contact details, and service descriptions at a glance.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Star className="size-5" />

                            <h3 className="text-sm font-medium">Categories</h3>
                        </div>
                        <p className="text-sm">Browse electricians, tutors, cafes, repair techs and more by category.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Clock className="size-5" />

                            <h3 className="text-sm font-medium">Real-Time Listings</h3>
                        </div>
                        <p className="text-sm">Stay updated with live availability and instant service updates.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Shield className="size-5" />

                            <h3 className="text-sm font-medium">Trusted Network</h3>
                        </div>
                        <p className="text-sm">Connect with verified local businesses and service providers.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
