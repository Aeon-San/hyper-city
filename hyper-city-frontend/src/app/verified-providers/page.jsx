'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import {
  Search,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Filter,
  ArrowRight,
  Zap,
  Award,
  TrendingUp,
} from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

// Mock verified providers data with ratings
const verifiedProvidersData = [
  {
    _id: '1',
    name: 'ElectroMaster Pro',
    vendorName: 'Rahul Sharma',
    category: 'Repairs',
    city: 'Your City',
    area: 'Sector 12',
    rating: 4.8,
    reviewsCount: 156,
    verified: true,
    badge: 'Premium',
    phone: '+91-98765-43210',
    email: 'rahul@electromaster.com',
    website: 'www.electromaster.com',
    description: 'Expert electrical repairs with 10+ years experience',
    services: ['Wiring', 'Troubleshooting', 'Panel Repairs'],
  },
  {
    _id: '2',
    name: 'Tutoring Excellence',
    vendorName: 'Priya Singh',
    category: 'Tutors',
    city: 'Your City',
    area: 'South Park',
    rating: 4.9,
    reviewsCount: 203,
    verified: true,
    badge: 'Expert',
    phone: '+91-99876-54321',
    email: 'priya@tutoringexcel.com',
    website: 'www.tutoringexcel.com',
    description: 'Math & Science coaching with proven track record',
    services: ['Maths', 'Science', 'English'],
  },
  {
    _id: '3',
    name: 'Gourmet Kitchen',
    vendorName: 'Chef Arun',
    category: 'Food',
    city: 'Your City',
    area: 'Downtown',
    rating: 4.7,
    reviewsCount: 298,
    verified: true,
    badge: 'Premium',
    phone: '+91-87654-32109',
    email: 'chef@gourmerkitchen.com',
    website: 'www.gourmerkitchen.com',
    description: 'Authentic cuisine prepared by award-winning chef',
    services: ['Catering', 'Cooking Classes', 'Personal Chef'],
  },
  {
    _id: '4',
    name: 'Business Solutions Hub',
    vendorName: 'Vikram Patel',
    category: 'Business',
    city: 'Your City',
    area: 'Business Bay',
    rating: 4.6,
    reviewsCount: 89,
    verified: true,
    badge: 'Trusted',
    phone: '+91-76543-21098',
    email: 'vikram@bshub.com',
    website: 'www.bshub.com',
    description: 'Complete business consulting and services',
    services: ['Consulting', 'Tax Advisory', 'Bookkeeping'],
  },
  {
    _id: '5',
    name: 'Premium Home Care',
    vendorName: 'Care Team',
    category: 'Trusted',
    city: 'Your City',
    area: 'Wellness District',
    rating: 4.9,
    reviewsCount: 412,
    verified: true,
    badge: 'Expert',
    phone: '+91-65432-10987',
    email: 'support@premiumcare.com',
    website: 'www.premiumcare.com',
    description: 'Trusted home care services with certified professionals',
    services: ['Home Care', 'Cleaning', 'Maintenance'],
  },
  {
    _id: '6',
    name: 'TechRepair Masters',
    vendorName: 'Arjun Verma',
    category: 'Repairs',
    city: 'Your City',
    area: 'Tech Park',
    rating: 4.8,
    reviewsCount: 167,
    verified: true,
    badge: 'Premium',
    phone: '+91-54321-09876',
    email: 'arjun@techrepair.com',
    website: 'www.techrepair.com',
    description: 'Mobile and laptop repair with warranty',
    services: ['Phone Repair', 'Laptop Repair', 'Data Recovery'],
  },
]

const StarRating = ({ rating, reviewsCount }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-600">{rating.toFixed(1)}</span>
      <span className="text-xs text-gray-500">({reviewsCount})</span>
    </div>
  )
}

const ProviderCard = ({ provider, index }) => {
  const badgeColors = {
    Premium: 'bg-purple-100 text-purple-700 border-purple-200',
    Expert: 'bg-blue-100 text-blue-700 border-blue-200',
    Trusted: 'bg-green-100 text-green-700 border-green-200',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950 dark:to-purple-950" />

      <div className="relative z-10 space-y-4">
        {/* Header with badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeColors[provider.badge]}`}>
                {provider.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{provider.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{provider.vendorName}</p>
          </div>
          <Award className="h-6 w-6 text-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Rating */}
        <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-800">
          <StarRating rating={provider.rating} reviewsCount={provider.reviewsCount} />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{provider.description}</p>

        {/* Services tags */}
        <div className="flex flex-wrap gap-2">
          {provider.services.slice(0, 2).map((service, idx) => (
            <span key={idx} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {service}
            </span>
          ))}
        </div>

        {/* Location and Contact */}
        <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <MapPin size={14} className="shrink-0" />
            <span>
              {provider.area}, {provider.city}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Phone size={14} className="mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Mail size={14} className="mr-1" />
            Email
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 text-xs text-white hover:bg-blue-700">
            View
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function VerifiedProvidersPage() {
  const [providers, setProviders] = useState(verifiedProvidersData)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [loading, setLoading] = useState(false)

  const categories = ['All', 'Repairs', 'Tutors', 'Food', 'Business', 'Trusted']

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.vendorName.toLowerCase().includes(search.toLowerCase()) ||
        provider.city.toLowerCase().includes(search.toLowerCase())

      const matchesCategory = selectedCategory === 'All' || provider.category === selectedCategory
      const matchesRating = provider.rating >= minRating

      return matchesSearch && matchesCategory && matchesRating
    })
  }, [providers, search, selectedCategory, minRating])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    toast.success(`Found ${filteredProviders.length} verified providers`)
  }, [filteredProviders.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header Navigation */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              Hyper City
            </Link>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">← Back Home</Link>
              </Button>
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-950">
                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Verified & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Trusted Providers</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Connect with vetted professionals who have proven track records, verified credentials, and excellent customer ratings.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-12 space-y-6"
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by provider name, vendor, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 text-base dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600">
                <Zap size={18} className="mr-2" />
                Search
              </Button>
            </form>

            {/* Category Filters */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Filter size={16} />
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                Minimum Rating: {minRating.toFixed(1)} ★
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Providers Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {filteredProviders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900"
          >
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No providers found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Try adjusting your filters or search terms</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredProviders.length} Verified Provider{filteredProviders.length !== 1 ? 's' : ''}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  All verified with proven track records and excellent ratings
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-950">
                <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Avg Rating: {(filteredProviders.reduce((sum, p) => sum + p.rating, 0) / filteredProviders.length).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProviders.map((provider, index) => (
                <ProviderCard key={provider._id} provider={provider} index={index} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white">Ready to book a service?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Select a provider above and contact them directly, or use Hyper City to browse more services in your area.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link href="/nearby">
                  <MapPin size={18} className="mr-2" />
                  Browse Nearby Services
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 border-white text-white hover:bg-white/30">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
