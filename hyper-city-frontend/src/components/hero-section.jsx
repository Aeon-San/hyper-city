'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Search, Users, Clock, Shield } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { motion, useInView } from 'motion/react'
import { HeroHeader } from './header'
import Features from '@/components/features-4'
import FooterSection from '@/components/footer'

const serviceFeatures = [
  {
    icon: MapPin,
    label: "Real-time Discovery",
    className: "border-e border-b",
  },
  {
    icon: Search,
    label: "Smart Search",
    className: "border-b",
  },
  {
    icon: Users,
    label: "Trusted Providers",
    className: "border-e",
  },
  {
    count: "1000+",
    label: "Services",
    className: "",
  },
]

export default function HeroSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section ref={sectionRef} className="bg-linear-to-br from-blue-300 via-blue-200 to-sky-100 min-h-screen">
          <div className="relative flex flex-col xl:h-screen justify-center z-10 xl:gap-0 gap-12 overflow-hidden">
            {/* Animated Clouds */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: [0, 30, 0], opacity: 0.9 }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-10 w-80 h-32"
            >
              <svg viewBox="0 0 300 150" className="w-full h-full fill-white/80">
                <path d="M 80 80 Q 80 40 110 40 Q 130 15 160 40 Q 190 10 220 40 Q 250 20 270 60 Q 290 80 270 110 Q 220 140 160 140 Q 80 140 60 110 Q 40 80 80 80 Z" />
              </svg>
            </motion.div>

            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: [0, -40, 0], opacity: 0.7 }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute top-96 right-20 w-96 h-40"
            >
              <svg viewBox="0 0 300 150" className="w-full h-full fill-white/70">
                <path d="M 80 80 Q 80 40 110 40 Q 130 15 160 40 Q 190 10 220 40 Q 250 20 270 60 Q 290 80 270 110 Q 220 140 160 140 Q 80 140 60 110 Q 40 80 80 80 Z" />
              </svg>
            </motion.div>

            <div className="max-w-7xl mx-auto sm:px-16 px-4 w-full xl:pt-0 pt-20 relative z-20 grid xl:grid-cols-2 gap-12 items-center">
              {/* Left Side Content */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative text-slate-900 text-start z-30"
              >
                <p className="text-lg font-bold text-black/60 dark:text-white/60 mb-2">Ghar Baithe Services</p>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black dark:text-white mb-6 leading-tight">
                  Find Local<br /><span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-400">Services</span><br />Near You
                </h1>
                <p className="text-xl text-black/70 dark:text-white/80 max-w-xl mb-8">Discover electricians, tutors, cafes, repair technicians and local businesses instantly with GPS-powered search.</p>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button className="px-8 py-4 bg-white border-0 text-blue-600 shadow-lg font-semibold rounded-full hover:bg-blue-50 hover:cursor-pointer h-auto text-lg hover:shadow-xl transition-all">
                    <Link href="#features">Explore Services</Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Side - Modern Architecture Image Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateZ: -5 }}
                animate={{ opacity: 1, x: 0, rotateZ: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden xl:block"
              >
                <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  {/* Gradient overlay for modern look */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 opacity-40 z-10"></div>
                  
                  {/* 3D-style container */}
                  <div className="w-full h-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                    {/* Animated gradient background */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 opacity-30"
                    >
                      <div className="w-full h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    </motion.div>

                    {/* Modern architecture SVG representation */}
                    <svg viewBox="0 0 400 500" className="w-full h-full relative z-10">
                      {/* Building structure */}
                      <path d="M 150 200 Q 200 100 250 200 L 250 450 Q 200 500 150 450 Z" fill="url(#buildingGradient)" opacity="0.9" />
                      
                      {/* Windows with glow */}
                      <circle cx="180" cy="250" r="15" fill="#fff" opacity="0.8" />
                      <circle cx="220" cy="250" r="15" fill="#fff" opacity="0.8" />
                      <circle cx="180" cy="320" r="15" fill="#fbbf24" opacity="0.9" />
                      <circle cx="220" cy="320" r="15" fill="#fbbf24" opacity="0.9" />
                      
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor: '#ec4899', stopOpacity: 1}} />
                          <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Floating particles */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-60"
                        style={{ left: `${20 + i * 15}%`, top: `${30 + i * 10}%` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto w-full max-w-7xl px-4 sm:px-16 relative z-20"
            >
              <div className="bg-white/70 backdrop-blur rounded-3xl p-8 shadow-xl border border-white/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {serviceFeatures.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + index * 0.1,
                        ease: "easeInOut",
                      }}
                      className="flex flex-col items-center gap-3 text-center"
                    >
                      {item.icon ? (
                        <>
                          <div className="p-3 bg-linear-to-br from-blue-400 to-blue-600 rounded-full">
                            <item.icon size={32} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{item.count}</p>
                          <p className="text-sm font-semibold text-slate-600">{item.label}</p>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-background">
          <Features />
        </section>

        <section id="solution" className="bg-background py-24 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-4xl font-bold">Solution</h2>
                <p className="mt-4 text-lg text-slate-300">Hyper City connects users with trusted local services in one place, giving neighborhood businesses a stronger digital presence.</p>
                <ul className="mt-8 space-y-4 text-slate-300">
                  <li>• GPS-based discovery for nearby service providers</li>
                  <li>• Business listing and profile management</li>
                  <li>• Category search and instant contact options</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-white/5 p-8">
                <p className="text-slate-200">The platform is built to be simple for customers and powerful for local vendors, making it easy to find and hire services with confidence.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-slate-950/80 py-24 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold">Pricing</h2>
              <p className="mt-4 text-lg text-slate-300">Flexible plans for local businesses and service providers, designed to fit early-stage launches and growing communities.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-2xl font-semibold">Starter</h3>
                <p className="mt-3 text-slate-300">Basic listings and discovery tools for new local businesses.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-2xl font-semibold">Growth</h3>
                <p className="mt-3 text-slate-300">Enhanced visibility, featured placement, and customer leads.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-2xl font-semibold">Premium</h3>
                <p className="mt-3 text-slate-300">Full platform access with priority support and advanced tools.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-background py-24 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <h2 className="text-4xl font-bold">About Hyper City</h2>
            <p className="mt-4 max-w-3xl text-lg text-slate-300">Hyper City is a hyper-local discovery platform built for city residents and neighborhood businesses. It brings service discovery, listings, and customer connection into a single digital experience.</p>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  )
}
