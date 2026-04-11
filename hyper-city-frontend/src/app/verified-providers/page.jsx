'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { HeroHeader } from '@/components/header'
import { useAuthStore } from '@/store/use-auth-store'
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
  X,
  Clock,
  CheckCircle,
  Users,
} from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { getApiBaseUrl } from '@/lib/api-base'

const API_BASE_URL = getApiBaseUrl()

// Mock verified providers data with ratings
const verifiedProvidersData = [
  // Repairs Category (7 providers)
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
  {
    _id: '3',
    name: 'Plumbing Experts',
    vendorName: 'Suresh Kumar',
    category: 'Repairs',
    city: 'Your City',
    area: 'Main Road',
    rating: 4.7,
    reviewsCount: 142,
    verified: true,
    badge: 'Trusted',
    phone: '+91-87654-12345',
    email: 'suresh@plumbingexperts.com',
    website: 'www.plumbingexperts.com',
    description: 'Expert plumbing solutions for residential & commercial',
    services: ['Pipe Repairs', 'Installation', 'Maintenance'],
  },
  {
    _id: '4',
    name: 'Quick AC Service',
    vendorName: 'Rohit Singh',
    category: 'Repairs',
    city: 'Your City',
    area: 'Green Park',
    rating: 4.6,
    reviewsCount: 198,
    verified: true,
    badge: 'Premium',
    phone: '+91-76543-54321',
    email: 'rohit@quickac.com',
    website: 'www.quickac.com',
    description: 'AC repair and maintenance with same-day service',
    services: ['AC Repair', 'Cleaning', 'Installation'],
  },
  {
    _id: '5',
    name: 'Carpenter Crafts',
    vendorName: 'Vikram Reddy',
    category: 'Repairs',
    city: 'Your City',
    area: 'South District',
    rating: 4.9,
    reviewsCount: 213,
    verified: true,
    badge: 'Expert',
    phone: '+91-65432-87654',
    email: 'vikram@carpentercrafts.com',
    website: 'www.carpentercrafts.com',
    description: 'Skilled carpentry and furniture repair services',
    services: ['Furniture Repair', 'Custom Designs', 'Installation'],
  },
  {
    _id: '6',
    name: 'Glass Works Pro',
    vendorName: 'Anil Patel',
    category: 'Repairs',
    city: 'Your City',
    area: 'Commercial Zone',
    rating: 4.5,
    reviewsCount: 89,
    verified: true,
    badge: 'Trusted',
    phone: '+91-54321-65432',
    email: 'anil@glassworkspro.com',
    website: 'www.glassworkspro.com',
    description: 'Glass and window repair with custom solutions',
    services: ['Window Repair', 'Glass Cutting', 'Installation'],
  },
  {
    _id: '7',
    name: 'Home Maintenance Plus',
    vendorName: 'Deepak Nair',
    category: 'Repairs',
    city: 'Your City',
    area: 'Riverside',
    rating: 4.7,
    reviewsCount: 176,
    verified: true,
    badge: 'Premium',
    phone: '+91-43210-76543',
    email: 'deepak@homemaintenance.com',
    website: 'www.homemaintenance.com',
    description: 'Comprehensive home maintenance and repair services',
    services: ['Wall Repair', 'Painting', 'General Maintenance'],
  },

  // Tutors Category (7 providers)
  {
    _id: '8',
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
    _id: '9',
    name: 'Language Academy',
    vendorName: 'Neha Desai',
    category: 'Tutors',
    city: 'Your City',
    area: 'Central Hub',
    rating: 4.8,
    reviewsCount: 267,
    verified: true,
    badge: 'Expert',
    phone: '+91-88765-43210',
    email: 'neha@languageacademy.com',
    website: 'www.languageacademy.com',
    description: 'Expert language tutoring for all levels',
    services: ['English', 'Hindi', 'French'],
  },
  {
    _id: '10',
    name: 'JEE/NEET Coaching Hub',
    vendorName: 'Dr. Sanjay Verma',
    category: 'Tutors',
    city: 'Your City',
    area: 'Education Zone',
    rating: 4.9,
    reviewsCount: 421,
    verified: true,
    badge: 'Expert',
    phone: '+91-77654-32109',
    email: 'sanjay@coachingHub.com',
    website: 'www.coachinghub.com',
    description: 'Specialized coaching for competitive exams',
    services: ['Physics', 'Chemistry', 'Biology'],
  },
  {
    _id: '11',
    name: 'Arts & Commerce Tutor',
    vendorName: 'Madhavi Sharma',
    category: 'Tutors',
    city: 'Your City',
    area: 'North District',
    rating: 4.6,
    reviewsCount: 134,
    verified: true,
    badge: 'Premium',
    phone: '+91-66543-21098',
    email: 'madhavi@artstutor.com',
    website: 'www.artstutor.com',
    description: 'Expert tuition for Arts and Commerce streams',
    services: ['History', 'Economics', 'Geography'],
  },
  {
    _id: '12',
    name: 'Piano & Music Classes',
    vendorName: 'Arjun Iyer',
    category: 'Tutors',
    city: 'Your City',
    area: 'Arts Quarter',
    rating: 4.7,
    reviewsCount: 156,
    verified: true,
    badge: 'Premium',
    phone: '+91-55432-10987',
    email: 'arjun@musicclasses.com',
    website: 'www.musicclasses.com',
    description: 'Professional music lessons for all ages',
    services: ['Piano', 'Guitar', 'Vocals'],
  },
  {
    _id: '13',
    name: 'Programming Academy',
    vendorName: 'Rajesh Kumar',
    category: 'Tutors',
    city: 'Your City',
    area: 'Tech Hub',
    rating: 4.8,
    reviewsCount: 289,
    verified: true,
    badge: 'Expert',
    phone: '+91-44321-09876',
    email: 'rajesh@progacademy.com',
    website: 'www.progacademy.com',
    description: 'Coding and programming for beginners to advanced',
    services: ['Python', 'Java', 'Web Development'],
  },
  {
    _id: '14',
    name: 'Sports Coaching Center',
    vendorName: 'Aditya Singh',
    category: 'Tutors',
    city: 'Your City',
    area: 'Stadium Area',
    rating: 4.6,
    reviewsCount: 167,
    verified: true,
    badge: 'Trusted',
    phone: '+91-33210-98765',
    email: 'aditya@sportscoach.com',
    website: 'www.sportscoach.com',
    description: 'Professional sports coaching for all levels',
    services: ['Cricket', 'Badminton', 'Tennis'],
  },

  // Food Category (8 providers)
  {
    _id: '15',
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
    _id: '16',
    name: 'Spice Route Café',
    vendorName: 'Lakshmi Nair',
    category: 'Food',
    city: 'Your City',
    area: 'Heritage Lane',
    rating: 4.8,
    reviewsCount: 342,
    verified: true,
    badge: 'Expert',
    phone: '+91-98765-12345',
    email: 'lakshmi@spiceroute.com',
    website: 'www.spiceroute.com',
    description: 'Traditional Indian cuisine with modern twist',
    services: ['Dine-in', 'Catering', 'Delivery'],
  },
  {
    _id: '17',
    name: 'Italian Trattoria',
    vendorName: 'Marco Rossi',
    category: 'Food',
    city: 'Your City',
    area: 'Gourmet District',
    rating: 4.9,
    reviewsCount: 267,
    verified: true,
    badge: 'Expert',
    phone: '+91-87654-54321',
    email: 'marco@italiantratt.com',
    website: 'www.italiantratt.com',
    description: 'Authentic Italian restaurant with imported ingredients',
    services: ['Pasta', 'Pizza', 'Wine Pairing'],
  },
  {
    _id: '18',
    name: 'Healthy Bowl Café',
    vendorName: 'Priya Menon',
    category: 'Food',
    city: 'Your City',
    area: 'Wellness Park',
    rating: 4.6,
    reviewsCount: 198,
    verified: true,
    badge: 'Premium',
    phone: '+91-76543-98765',
    email: 'priya@healthybowl.com',
    website: 'www.healthybowl.com',
    description: 'Nutritious and healthy meal options',
    services: ['Salads', 'Bowls', 'Detox Juices'],
  },
  {
    _id: '19',
    name: 'Bakery Bliss',
    vendorName: 'Sarah Khan',
    category: 'Food',
    city: 'Your City',
    area: 'Market Square',
    rating: 4.7,
    reviewsCount: 276,
    verified: true,
    badge: 'Premium',
    phone: '+91-65432-34567',
    email: 'sarah@bakerybliss.com',
    website: 'www.bakerybliss.com',
    description: 'Fresh artisan baked goods and pastries',
    services: ['Cakes', 'Breads', 'Custom Orders'],
  },
  {
    _id: '20',
    name: 'BBQ Smokehouse',
    vendorName: 'Rajesh Mishra',
    category: 'Food',
    city: 'Your City',
    area: 'Entertainment Zone',
    rating: 4.8,
    reviewsCount: 312,
    verified: true,
    badge: 'Expert',
    phone: '+91-54321-23456',
    email: 'rajesh@bbqsmoke.com',
    website: 'www.bbqsmoke.com',
    description: 'Premium grilled and smoked meats',
    services: ['Grilling', 'Catering', 'Events'],
  },
  {
    _id: '21',
    name: 'Asian Fusion Kitchen',
    vendorName: 'Wei Chen',
    category: 'Food',
    city: 'Your City',
    area: 'Chinatown',
    rating: 4.7,
    reviewsCount: 234,
    verified: true,
    badge: 'Premium',
    phone: '+91-43210-12345',
    email: 'wei@asionfusion.com',
    website: 'www.asionfusion.com',
    description: 'Fusion of Asian cuisines with local flavors',
    services: ['Chinese', 'Thai', 'Vietnamese'],
  },
  {
    _id: '22',
    name: 'Dessert Paradise',
    vendorName: 'Anjali Verma',
    category: 'Food',
    city: 'Your City',
    area: 'Sweet Lane',
    rating: 4.9,
    reviewsCount: 289,
    verified: true,
    badge: 'Expert',
    phone: '+91-32109-01234',
    email: 'anjali@dessertpara.com',
    website: 'www.dessertpara.com',
    description: 'Gourmet desserts and confectionery',
    services: ['Custom Cakes', 'Chocolates', 'Ice Cream'],
  },

  // Business Category (4 providers)
  {
    _id: '23',
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
    _id: '24',
    name: 'Corporate Training Institute',
    vendorName: 'Dr. Ravi Gupta',
    category: 'Business',
    city: 'Your City',
    area: 'Corporate Plaza',
    rating: 4.8,
    reviewsCount: 156,
    verified: true,
    badge: 'Expert',
    phone: '+91-65432-12345',
    email: 'ravi@corptraining.com',
    website: 'www.corptraining.com',
    description: 'Professional corporate training and development',
    services: ['Leadership', 'Soft Skills', 'Technical Training'],
  },
  {
    _id: '25',
    name: 'Digital Marketing Agency',
    vendorName: 'Sneha Kapoor',
    category: 'Business',
    city: 'Your City',
    area: 'Tech Hub',
    rating: 4.7,
    reviewsCount: 198,
    verified: true,
    badge: 'Premium',
    phone: '+91-54321-34567',
    email: 'sneha@digimarketing.com',
    website: 'www.digimarketing.com',
    description: 'Comprehensive digital marketing solutions',
    services: ['SEO', 'Social Media', 'Content Marketing'],
  },
  {
    _id: '26',
    name: 'Legal Associates',
    vendorName: 'Advocate Priya Sharma',
    category: 'Business',
    city: 'Your City',
    area: 'Law District',
    rating: 4.9,
    reviewsCount: 234,
    verified: true,
    badge: 'Expert',
    phone: '+91-43210-45678',
    email: 'priya@legalassoc.com',
    website: 'www.legalassoc.com',
    description: 'Professional legal services for businesses',
    services: ['Corporate Law', 'Contracts', 'Compliance'],
  },

  // Trusted Category (4 providers)
  {
    _id: '27',
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
    _id: '28',
    name: 'Professional Cleaning Services',
    vendorName: 'Kumar Enterprise',
    category: 'Trusted',
    city: 'Your City',
    area: 'Service Center',
    rating: 4.8,
    reviewsCount: 267,
    verified: true,
    badge: 'Expert',
    phone: '+91-54321-54321',
    email: 'kumar@cleanpro.com',
    website: 'www.cleanpro.com',
    description: 'Professional cleaning for homes and offices',
    services: ['Home Cleaning', 'Office Cleaning', 'Deep Cleaning'],
  },
  {
    _id: '29',
    name: 'Pet Care Specialists',
    vendorName: 'Dr. Anjali Vet',
    category: 'Trusted',
    city: 'Your City',
    area: 'Pet District',
    rating: 4.7,
    reviewsCount: 189,
    verified: true,
    badge: 'Premium',
    phone: '+91-43210-23456',
    email: 'anjali@petcare.com',
    website: 'www.petcare.com',
    description: 'Comprehensive pet grooming and veterinary care',
    services: ['Grooming', 'Vet Services', 'Training'],
  },
  {
    _id: '30',
    name: 'Security & Safety Solutions',
    vendorName: 'Rajesh Security',
    category: 'Trusted',
    city: 'Your City',
    area: 'Safety Hub',
    rating: 4.6,
    reviewsCount: 145,
    verified: true,
    badge: 'Trusted',
    phone: '+91-32109-34567',
    email: 'rajesh@securitysol.com',
    website: 'www.securitysol.com',
    description: 'Professional security and safety services',
    services: ['CCTV Installation', 'Security Guards', 'Alarms'],
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
            className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground/70">({reviewsCount})</span>
    </div>
  )
}

const ProviderCard = ({ provider, index, onView }) => {
  const badgeColors = {
    Premium: 'bg-primary/10 text-primary border-primary/20',
    Expert: 'bg-accent/10 text-accent border-accent/20',
    Trusted: 'bg-secondary/10 text-secondary border-secondary/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-border dark:bg-card"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-primary/5 dark:to-accent/5" />

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
            <h3 className="text-lg font-bold text-foreground dark:text-foreground">{provider.name}</h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">{provider.vendorName}</p>
          </div>
          <Award className="h-6 w-6 text-yellow-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Rating */}
        <div className="space-y-2 border-t border-border pt-3 dark:border-border">
          <StarRating rating={provider.rating} reviewsCount={provider.reviewsCount} />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 dark:text-muted-foreground">{provider.description}</p>

        {/* Services tags */}
        <div className="flex flex-wrap gap-2">
          {provider.services.slice(0, 2).map((service, idx) => (
            <span key={idx} className="rounded-full bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground dark:bg-secondary/50 dark:text-secondary-foreground">
              {service}
            </span>
          ))}
        </div>

        {/* Location and Contact */}
        <div className="space-y-2 border-t border-border pt-3 dark:border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground">
            <MapPin size={14} className="shrink-0" />
            <span>
              {provider.area}, {provider.city}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 border-t border-border pt-3 dark:border-border">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Phone size={14} className="mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Mail size={14} className="mr-1" />
            Email
          </Button>
          <Button size="sm" className="flex-1 bg-primary text-xs text-primary-foreground hover:bg-primary/90" onClick={() => onView(provider)}>
            View
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

const ProviderModal = ({
  provider,
  isOpen,
  onClose,
  reviews,
  reviewLoading,
  reviewError,
  newRating,
  newComment,
  setNewRating,
  setNewComment,
  handleSubmitReview,
  user,
}) => {
  if (!isOpen || !provider) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-card dark:bg-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {reviewLoading ? (
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl bg-slate-200/80 dark:bg-slate-700/80">
            <div className="h-full w-full bg-primary/70 animate-pulse" />
          </div>
        ) : null}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-secondary p-2 transition-colors hover:bg-secondary/80 dark:bg-secondary dark:hover:bg-secondary/80"
        >
          <X size={20} className="text-secondary-foreground dark:text-secondary-foreground" />
        </button>

        {/* Content */}
        <div className="space-y-6 p-6 sm:p-8">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-6 dark:border-border">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/10 dark:text-primary">
                    {provider.badge} Provider
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground dark:text-foreground">{provider.name}</h1>
                <p className="mt-1 text-lg text-muted-foreground dark:text-muted-foreground">by {provider.vendorName}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-muted-foreground dark:text-muted-foreground">{provider.description}</p>
          </div>

          {/* Rating & Reviews */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-primary/10 p-4 dark:bg-primary/10">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground dark:text-foreground">{provider.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">Rating</p>
            </div>
            <div className="rounded-lg bg-accent/10 p-4 dark:bg-accent/10">
              <p className="text-2xl font-bold text-foreground dark:text-foreground">{provider.reviewsCount}</p>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">Reviews</p>
            </div>
            <div className="rounded-lg bg-secondary/10 p-4 dark:bg-secondary/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">Verified</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-4 dark:bg-primary/10">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">Trusted</p>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-foreground">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary dark:bg-primary/10 dark:text-primary"
                >
                  ✓ {service}
                </span>
              ))}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4 border-t border-border pt-6 dark:border-border">
            <h2 className="text-lg font-semibold text-foreground dark:text-foreground">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-lg bg-secondary/30 p-4 dark:bg-secondary/30">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground dark:text-foreground">
                    {provider.area}, {provider.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg bg-secondary/30 p-4 dark:bg-secondary/30">
                <Phone className="h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${provider.phone}`}
                    className="font-semibold text-foreground hover:text-primary dark:text-foreground dark:hover:text-primary"
                  >
                    {provider.phone}
                  </a>
                </div>
              </div>

              {provider.email ? (
                <div className="flex items-center gap-4 rounded-lg bg-secondary/30 p-4 dark:bg-secondary/30">
                  <Mail className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${provider.email}`}
                      className="font-semibold text-foreground hover:text-primary dark:text-foreground dark:hover:text-primary"
                    >
                      {provider.email}
                    </a>
                  </div>
                </div>
              ) : null}

              {provider.website ? (
                <div className="flex items-center gap-4 rounded-lg bg-secondary/30 p-4 dark:bg-secondary/30">
                  <Globe className="h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">Website</p>
                    <a
                      href={`https://${provider.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:text-primary dark:text-foreground dark:hover:text-primary"
                    >
                      {provider.website}
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4 border-t border-border pt-6 dark:border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground dark:text-foreground">Customer Reviews</h2>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Read what other users have said.</p>
              </div>
              <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary-foreground dark:bg-secondary/30">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>

            {reviewLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ) : reviewError ? (
              <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {reviewError}
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground dark:border-border">
                No reviews yet. Be the first to leave feedback!
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-2xl border border-border/70 bg-secondary/30 p-4 dark:border-border">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground dark:text-foreground">{review.userId?.name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/10">
                        {review.rating.toFixed(1)} ★
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground dark:text-muted-foreground">{review.comment || 'No comment provided.'}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-border/70 bg-card p-4 dark:border-border">
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Leave a Review</h3>
              {user ? (
                <form className="space-y-4" onSubmit={handleSubmitReview}>
                  <div>
                    <label className="text-sm font-medium text-foreground dark:text-foreground">Rating</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={newRating}
                      onChange={(e) => setNewRating(parseFloat(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="mt-2 text-sm text-muted-foreground">{newRating.toFixed(1)} ★</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground dark:text-foreground">Comment</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 dark:border-border dark:bg-card"
                      rows={4}
                      placeholder="Share your experience..."
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={reviewLoading}>
                      Submit Review
                    </Button>
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground">You can review this provider once.</span>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4 text-sm text-muted-foreground dark:border-border">
                  Please <Link href="/login" className="font-semibold text-primary">login</Link> to submit a review.
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-border pt-6 dark:border-border">
            <div className="flex flex-col gap-3 sm:flex-row">
              {provider.phone ? (
                <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                  <a href={`tel:${provider.phone}`} className="flex items-center justify-center gap-2">
                    <Phone size={18} />
                    Call Now
                  </a>
                </Button>
              ) : null}
              {provider.email ? (
                <Button asChild variant="outline" className="flex-1">
                  <a href={`mailto:${provider.email}`} className="flex items-center justify-center gap-2">
                    <Mail size={18} />
                    Send Email
                  </a>
                </Button>
              ) : null}
              {provider.website ? (
                <Button asChild variant="outline" className="flex-1">
                  <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Globe size={18} />
                    Visit Website
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function VerifiedProvidersPage() {
  const user = useAuthStore((state) => state.user)
  const authToken = useAuthStore((state) => state.token)
  const [providers, setProviders] = useState(verifiedProvidersData)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewLoading, setReviewLoading] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [reviewError, setReviewError] = useState('')

  const categories = ['All', 'Repairs', 'Tutors', 'Food', 'Business', 'Trusted']

  const fetchProviders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        country: 'India',
        search: search.trim(),
        limit: '30',
      })
      if (selectedCategory !== 'All') {
        params.set('category', selectedCategory)
      }

      const response = await fetch(`${API_BASE_URL}/services/listings?${params.toString()}`)
      const payload = await response.json()

      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Unable to fetch providers')
      }

      const serviceData = Array.isArray(payload.data) ? payload.data : []
      const mappedProviders = serviceData.map((service) => ({
        _id: service._id,
        name: service.name || 'Service Provider',
        vendorName: service.vendorName || 'Unknown Vendor',
        category: service.category || 'General',
        city: service.city || 'Unknown',
        area: service.area || service.address || 'Unknown Area',
        rating: service.rating || 0,
        reviewsCount: service.numReviews || 0,
        verified: service.status === 'approved',
        badge:
          service.rating >= 4.8 ? 'Premium' : service.rating >= 4.7 ? 'Expert' : 'Trusted',
        phone: service.phone || '',
        email: '',
        website: service.website || '',
        description: service.address || `${service.category || 'Service'} in ${service.area || service.city}`,
        services: [service.category || 'Service'],
      }))

      setProviders(mappedProviders)
    } catch (err) {
      toast.error(err.message || 'Unable to load providers')
      setProviders(verifiedProvidersData)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, search])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

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

  const fetchReviews = useCallback(async (serviceId) => {
    if (!serviceId) return
    setReviewLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${serviceId}?limit=10`)
      const payload = await response.json()
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Unable to load reviews')
      }
      setReviews(payload.data || [])
    } catch (err) {
      setReviewError(err.message || 'Unable to load reviews')
    } finally {
      setReviewLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProvider && selectedProvider._id) {
      fetchReviews(selectedProvider._id)
    }
  }, [selectedProvider, fetchReviews])

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    if (!user) {
      toast.error('Please login to submit a review')
      return
    }

    if (!selectedProvider) {
      toast.error('No provider selected')
      return
    }

    try {
      setReviewLoading(true)
      setReviewError('')

      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          serviceId: selectedProvider._id,
          rating: newRating,
          comment: newComment.trim(),
        }),
      })

      const payload = await response.json()
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Unable to submit review')
      }

      toast.success('Review submitted successfully')
      setNewComment('')
      setNewRating(5)
      fetchReviews(selectedProvider._id)
    } catch (err) {
      setReviewError(err.message || 'Unable to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      fetchProviders()
    },
    [fetchProviders]
  )

  return (
    <>
      <HeroHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-background dark:via-background dark:to-background pt-24">
      {/* Hero Section */}
      <section className="border-b border-border bg-card dark:border-border dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-3 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3 dark:bg-primary/10">
                <ShieldCheck className="h-7 w-7 text-primary dark:text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground dark:text-foreground sm:text-3xl">
              Verified & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">Trusted Providers</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground dark:text-muted-foreground">
              Browse trusted local professionals and view provider listings instantly.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 space-y-4"
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by provider name, vendor, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 text-sm dark:bg-card dark:border-border"
                />
              </div>
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 dark:bg-primary">
                <Zap size={18} className="mr-2" />
                Search
              </Button>
            </form>

            {/* Category Filters */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
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
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground dark:text-foreground flex items-center gap-2">
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
            className="rounded-2xl border-2 border-dashed border-border bg-secondary/30 py-16 text-center dark:border-border dark:bg-secondary/30"
          >
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground dark:text-foreground">No providers found</h3>
            <p className="mt-2 text-muted-foreground dark:text-muted-foreground">Try adjusting your filters or search terms</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground">
                  {filteredProviders.length} Verified Provider{filteredProviders.length !== 1 ? 's' : ''}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
                  All verified with proven track records and excellent ratings
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 dark:bg-primary/10">
                <TrendingUp size={18} className="text-primary dark:text-primary" />
                <span className="text-sm font-semibold text-primary dark:text-primary">
                  Avg Rating: {(filteredProviders.reduce((sum, p) => sum + p.rating, 0) / filteredProviders.length).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProviders.map((provider, index) => (
                <ProviderCard 
                  key={provider._id} 
                  provider={provider} 
                  index={index}
                  onView={(provider) => {
                    setSelectedProvider(provider)
                    setIsModalOpen(true)
                    fetchReviews(provider._id)
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Provider Detail Modal */}
      <ProviderModal 
        provider={selectedProvider} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        reviews={reviews}
        reviewLoading={reviewLoading}
        reviewError={reviewError}
        newRating={newRating}
        newComment={newComment}
        setNewRating={setNewRating}
        setNewComment={setNewComment}
        handleSubmitReview={handleSubmitReview}
        user={user}
      />

      {/* CTA Section */}
      <section className="border-t border-border bg-gradient-to-r from-primary to-primary dark:border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-primary-foreground">Ready to book a service?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Select a provider above and contact them directly, or use City Saathi to browse more services in your area.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link href="/nearby">
                  <MapPin size={18} className="mr-2" />
                  Browse Nearby Services
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-primary-foreground/20 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/30">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  )
}
