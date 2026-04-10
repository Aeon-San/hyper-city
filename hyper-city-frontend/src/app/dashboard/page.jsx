'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  BriefcaseBusiness,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Star,
  Store,
  Trash2,
  UserPlus,
  UserRoundCog,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { useAuthStore } from '@/store/use-auth-store'
import { toast } from 'sonner'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

const parseDashboardResponse = async (response) => {
  let payload = {}

  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

const roleDashboardConfig = {
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Manage users, moderation, and system-wide controls.',
    modules: [
      {
        id: 'overview',
        name: 'Overview',
        description: 'Track platform-wide health and account growth.',
        stats: [
          { label: 'Total Users', value: '1,284' },
          { label: 'Active Vendors', value: '312' },
          { label: 'Daily Logins', value: '467' },
        ],
      },
      {
        id: 'vendors',
        name: 'Vendor Management',
        description: 'Search, update, and remove vendor accounts.',
        stats: [],
      },
      {
        id: 'admin-services',
        name: 'Platform Services',
        description: 'Create service listings directly as admin.',
        stats: [],
      },
      {
        id: 'categories',
        name: 'Category Management',
        description: 'Create and manage service categories for India.',
        stats: [],
      },
      {
        id: 'approvals',
        name: 'Service Requests',
        description: 'Approve vendor service requests before they go live.',
        stats: [],
      },
      {
        id: 'moderation',
        name: 'Moderation',
        description: 'Handle reviews, listings, and platform reports.',
        stats: [
          { label: 'Pending Reports', value: '14' },
          { label: 'Blocked Listings', value: '5' },
          { label: 'Resolved Today', value: '22' },
        ],
      },
      {
        id: 'profile',
        name: 'Profile Management',
        description: 'Update your personal and contact details.',
        stats: [],
      },
    ],
  },
  vendor: {
    title: 'Vendor Dashboard',
    subtitle: 'Manage your services, leads, and profile visibility.',
    modules: [
      {
        id: 'overview',
        name: 'Overview',
        description: 'Snapshot of your business performance.',
        stats: [
          { label: 'Live Listings', value: '8' },
          { label: 'Total Leads', value: '23' },
          { label: 'Avg Rating', value: '4.7' },
        ],
      },
      {
        id: 'services',
        name: 'My Services',
        description: 'Create and manage all your listed services.',
        stats: [
          { label: 'Draft Listings', value: '2' },
          { label: 'Active Listings', value: '8' },
          { label: 'Needs Update', value: '1' },
        ],
      },
      {
        id: 'bookings',
        name: 'Bookings',
        description: 'Track customer requests and booking statuses.',
        stats: [
          { label: 'Pending', value: '5' },
          { label: 'Confirmed', value: '12' },
          { label: 'Completed', value: '37' },
        ],
      },
      {
        id: 'profile',
        name: 'Profile Management',
        description: 'Update your business owner profile details.',
        stats: [],
      },
    ],
  },
  user: {
    title: 'User Dashboard',
    subtitle: 'Discover nearby services and manage your activity.',
    modules: [
      {
        id: 'overview',
        name: 'Overview',
        description: 'Quick summary of your account activity.',
        stats: [
          { label: 'Saved Services', value: '12' },
          { label: 'Recent Searches', value: '31' },
          { label: 'Reviews Posted', value: '5' },
        ],
      },
      {
        id: 'bookings',
        name: 'My Bookings',
        description: 'View pending and completed service bookings.',
        stats: [
          { label: 'Pending', value: '2' },
          { label: 'Confirmed', value: '4' },
          { label: 'Completed', value: '9' },
        ],
      },
      {
        id: 'reviews',
        name: 'My Reviews',
        description: 'Track your ratings and recent feedback.',
        stats: [
          { label: 'Published', value: '5' },
          { label: 'Draft', value: '1' },
          { label: 'Avg Given Rating', value: '4.4' },
        ],
      },
      {
        id: 'profile',
        name: 'Profile Management',
        description: 'Update your account and contact details.',
        stats: [],
      },
    ],
  },
}

const serviceCategories = [
  'Repairs',
  'Tutors',
  'Food',
  'Business',
  'Trusted',
]

const moduleIconMap = {
  overview: LayoutDashboard,
  users: Users,
  vendors: Store,
  'admin-services': BriefcaseBusiness,
  moderation: ShieldCheck,
  services: BriefcaseBusiness,
  bookings: CalendarClock,
  reviews: Star,
  profile: UserRoundCog,
}

export default function DashboardPage({ selectedModuleId = null }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const authToken = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const logout = useAuthStore((state) => state.logout)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const authLoading = useAuthStore((state) => state.isLoading)
  const currentRole = (user?.role || 'user').toLowerCase()
  const dashboard = useMemo(() => roleDashboardConfig[currentRole] || roleDashboardConfig.user, [currentRole])
  const modules = useMemo(() => dashboard.modules || [], [dashboard])

  const [activeModuleId, setActiveModuleId] = useState(modules[0]?.id || 'overview')
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  })

  useEffect(() => {
    if (pathname?.startsWith('/dashboard/')) {
      const pathModule = pathname.split('/')[2]
      if (pathModule && modules.some((module) => module.id === pathModule)) {
        setActiveModuleId(pathModule)
        return
      }
    }

    if (!pathname?.startsWith('/dashboard/')) {
      setActiveModuleId(modules[0]?.id || 'overview')
    }
  }, [pathname, modules])
  const [vendors, setVendors] = useState([])
  const [vendorLoading, setVendorLoading] = useState(false)
  const [vendorSearchInput, setVendorSearchInput] = useState('')
  const [vendorQuery, setVendorQuery] = useState('')
  const [vendorPage, setVendorPage] = useState(1)
  const [vendorMeta, setVendorMeta] = useState({ page: 1, limit: 8, total: 0, count: 0 })
  const [vendorEditId, setVendorEditId] = useState(null)
  const [vendorEditForm, setVendorEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessCategory: '',
    businessAddress: '',
    businessCity: '',
    businessArea: '',
    businessDescription: '',
    website: '',
  })
  const [vendorCreateOpen, setVendorCreateOpen] = useState(false)
  const [vendorCreateLoading, setVendorCreateLoading] = useState(false)
  const [vendorCreateForm, setVendorCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    businessCategory: '',
    businessAddress: '',
    businessCity: '',
    businessArea: '',
    businessDescription: '',
    website: '',
  })

  const [categories, setCategories] = useState([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [adminCategories, setAdminCategories] = useState([])
  const [adminCategoryLoading, setAdminCategoryLoading] = useState(false)
  const [categoryActionLoading, setCategoryActionLoading] = useState(false)
  const [categoryRequestOpen, setCategoryRequestOpen] = useState(false)
  const [categoryRequestForm, setCategoryRequestForm] = useState({
    name: '',
    description: '',
  })
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    country: 'India',
  })
  const [categoryEditId, setCategoryEditId] = useState(null)
  const [categoryEditForm, setCategoryEditForm] = useState({
    name: '',
    description: '',
    country: 'India',
    status: 'approved',
  })

  const [pendingServices, setPendingServices] = useState([])
  const [pendingLoading, setPendingLoading] = useState(false)
  const [pendingQuery, setPendingQuery] = useState('')
  const [pendingPage, setPendingPage] = useState(1)
  const [pendingMeta, setPendingMeta] = useState({ page: 1, limit: 8, total: 0, count: 0 })

  const [services, setServices] = useState([])
  const [serviceLoading, setServiceLoading] = useState(false)
  const [serviceSearchInput, setServiceSearchInput] = useState('')
  const [serviceQuery, setServiceQuery] = useState('')
  const [servicePage, setServicePage] = useState(1)
  const [serviceMeta, setServiceMeta] = useState({ page: 1, limit: 8, total: 0, count: 0 })
  const [serviceEditId, setServiceEditId] = useState(null)
  const [serviceEditForm, setServiceEditForm] = useState({
    name: '',
    category: serviceCategories[0],
    phone: '',
    city: '',
    area: '',
    address: '',
    lat: '',
    lng: '',
  })
  const [serviceCreateOpen, setServiceCreateOpen] = useState(false)
  const [serviceCreateLoading, setServiceCreateLoading] = useState(false)
  const [serviceCreateForm, setServiceCreateForm] = useState({
    name: '',
    category: serviceCategories[0],
    phone: '',
    city: '',
    area: '',
    address: '',
    lat: '',
    lng: '',
  })

  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories[0]?.name || serviceCategories[0]
      setServiceCreateForm((prev) => ({
        ...prev,
        category: categories.some((category) => category.name === prev.category)
          ? prev.category
          : defaultCategory,
      }))
      setServiceEditForm((prev) => ({
        ...prev,
        category: categories.some((category) => category.name === prev.category)
          ? prev.category
          : defaultCategory,
      }))
    }
  }, [categories])

  useEffect(() => {
    if (modules.length > 0 && !selectedModuleId) {
      setActiveModuleId(modules[0].id)
    }
  }, [modules, selectedModuleId])

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) || modules[0],
    [modules, activeModuleId]
  )
  const isProfileModule = activeModule?.id === 'profile'
  const isVendorsModule = activeModule?.id === 'vendors' && currentRole === 'admin'
  const isAdminServicesModule = activeModule?.id === 'admin-services' && currentRole === 'admin'
  const isCategoriesModule = activeModule?.id === 'categories' && currentRole === 'admin'
  const isApprovalsModule = activeModule?.id === 'approvals' && currentRole === 'admin'
  const isServicesModule = activeModule?.id === 'services' && currentRole === 'vendor'

  const fetchVendors = useCallback(async () => {
    setVendorLoading(true)

    try {
      const searchParam = vendorQuery.trim() ? `&search=${encodeURIComponent(vendorQuery.trim())}` : ''
      const response = await fetch(
        `${API_BASE_URL}/api/auth/vendors?page=${vendorPage}&limit=${vendorMeta.limit}${searchParam}`,
        {
          credentials: 'include',
        }
      )
      const payload = await parseDashboardResponse(response)
      setVendors(payload.data || [])
      setVendorMeta((prev) => ({
        ...prev,
        page: payload.page || vendorPage,
        limit: payload.limit || prev.limit,
        total: payload.total || 0,
        count: payload.count || 0,
      }))
    } catch (error) {
      toast.error(error.message || 'Failed to load vendors')
    } finally {
      setVendorLoading(false)
    }
  }, [vendorPage, vendorQuery, vendorMeta.limit])

  const fetchServices = useCallback(async () => {
    setServiceLoading(true)

    try {
      const searchParam = serviceQuery.trim() ? `&search=${encodeURIComponent(serviceQuery.trim())}` : ''
      // Admins see all services via /admin endpoint, vendors see only their services via /vendor
      const endpoint = currentRole === 'admin' ? '/api/services/admin' : '/api/services/vendor'
      const headers = currentRole === 'admin' && authToken ? { Authorization: `Bearer ${authToken}` } : {}
      console.log('DEBUG fetchServices:', { currentRole, endpoint, authToken: !!authToken })
      const response = await fetch(
        `${API_BASE_URL}${endpoint}?page=${servicePage}&limit=${serviceMeta.limit}${searchParam}`,
        {
          credentials: 'include',
          headers,
        }
      )
      const payload = await parseDashboardResponse(response)
      setServices(payload.data || [])
      setServiceMeta((prev) => ({
        ...prev,
        page: payload.page || servicePage,
        limit: payload.limit || prev.limit,
        total: payload.total || 0,
        count: payload.count || 0,
      }))
    } catch (error) {
      toast.error(error.message || 'Failed to load services')
    } finally {
      setServiceLoading(false)
    }
  }, [servicePage, serviceQuery, serviceMeta.limit, currentRole, authToken])

  const fetchCategoryList = useCallback(async () => {
    setCategoryLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories?country=India`)
      const payload = await response.json()
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Unable to load categories')
      }
      setCategories(payload.data || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load categories')
    } finally {
      setCategoryLoading(false)
    }
  }, [])

  const fetchAdminCategories = useCallback(async () => {
    setAdminCategoryLoading(true)
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {}
      const response = await fetch(`${API_BASE_URL}/api/categories?country=India&includePending=true`, {
        credentials: 'include',
        headers,
      })
      const payload = await parseDashboardResponse(response)
      setAdminCategories(payload.data || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load category requests')
    } finally {
      setAdminCategoryLoading(false)
    }
  }, [authToken])

  const fetchPendingServices = useCallback(async () => {
    setPendingLoading(true)
    try {
      const searchParam = pendingQuery.trim() ? `&search=${encodeURIComponent(pendingQuery.trim())}` : ''
      const response = await fetch(
        `${API_BASE_URL}/api/services/pending?page=${pendingPage}&limit=${pendingMeta.limit}${searchParam}&country=India`,
        {
          credentials: 'include',
        }
      )
      const payload = await parseDashboardResponse(response)
      setPendingServices(payload.data || [])
      setPendingMeta((prev) => ({
        ...prev,
        page: payload.page || pendingPage,
        limit: payload.limit || prev.limit,
        total: payload.total || 0,
        count: payload.count || 0,
      }))
    } catch (error) {
      toast.error(error.message || 'Failed to load pending service requests')
    } finally {
      setPendingLoading(false)
    }
  }, [pendingPage, pendingQuery, pendingMeta.limit])

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login')
    }
  }, [hasHydrated, isAuthenticated, router])

  useEffect(() => {
    fetchCategoryList()
  }, [fetchCategoryList])

  useEffect(() => {
    if (activeModuleId === 'services' || activeModuleId === 'admin-services') {
      fetchServices()
    }
    if (activeModuleId === 'approvals') {
      fetchPendingServices()
    }
    if (activeModuleId === 'categories') {
      fetchAdminCategories()
    }
  }, [activeModuleId, fetchServices, fetchPendingServices, fetchAdminCategories])

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
    })
  }, [user?.name, user?.email, user?.phone])

  useEffect(() => {
    if (isVendorsModule) {
      fetchVendors()
    }
  }, [isVendorsModule, fetchVendors])

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfileSave = async (event) => {
    event.preventDefault()

    try {
      await updateProfile(profileForm)
      setProfileForm((prev) => ({ ...prev, password: '' }))
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleVendorSearch = (event) => {
    event.preventDefault()
    setVendorPage(1)
    setVendorQuery(vendorSearchInput)
  }

  const handleVendorEditStart = (vendor) => {
    setVendorEditId(vendor._id)
    setVendorEditForm({
      name: vendor.name || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      businessName: vendor.businessName || '',
      businessCategory: vendor.businessCategory || '',
      businessAddress: vendor.businessAddress || '',
      businessCity: vendor.businessCity || '',
      businessArea: vendor.businessArea || '',
      businessDescription: vendor.businessDescription || '',
      website: vendor.website || '',
    })
  }

  const handleVendorEditCancel = () => {
    setVendorEditId(null)
    setVendorEditForm({
      name: '',
      email: '',
      phone: '',
      businessName: '',
      businessCategory: '',
      businessAddress: '',
      businessCity: '',
      businessArea: '',
      businessDescription: '',
      website: '',
    })
  }

  const handleVendorUpdate = async (vendorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(vendorEditForm),
      })

      await parseDashboardResponse(response)
      toast.success('Vendor updated')
      handleVendorEditCancel()
      fetchVendors()
    } catch (error) {
      toast.error(error.message || 'Failed to update vendor')
    }
  }

  const handleVendorDelete = async (vendorId) => {
    const isConfirmed = window.confirm('Delete this vendor and linked services?')

    if (!isConfirmed) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/vendors/${vendorId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      await parseDashboardResponse(response)
      toast.success('Vendor deleted')
      fetchVendors()
    } catch (error) {
      toast.error(error.message || 'Failed to delete vendor')
    }
  }

  const handleServiceSearch = (event) => {
    event.preventDefault()
    setServicePage(1)
    setServiceQuery(serviceSearchInput)
  }

  const handleServiceEditStart = (service) => {
    setServiceEditId(service._id)
    setServiceEditForm({
      name: service.name || '',
      category: service.category || categories[0]?.name || serviceCategories[0],
      phone: service.phone || '',
      city: service.city || '',
      area: service.area || '',
      address: service.address || '',
      lat: service.location?.coordinates?.[1] ? String(service.location.coordinates[1]) : '',
      lng: service.location?.coordinates?.[0] ? String(service.location.coordinates[0]) : '',
    })
  }

  const handleServiceEditCancel = () => {
    setServiceEditId(null)
    setServiceEditForm({
      name: '',
      category: categories[0]?.name || serviceCategories[0],
      phone: '',
      city: '',
      area: '',
      address: '',
      lat: '',
      lng: '',
    })
  }

  const handleServiceUpdate = async (serviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(serviceEditForm),
      })

      await parseDashboardResponse(response)
      toast.success('Service updated')
      handleServiceEditCancel()
      fetchServices()
    } catch (error) {
      toast.error(error.message || 'Failed to update service')
    }
  }

  const resetServiceCreateForm = () => {
    setServiceCreateForm({
      name: '',
      category: categories[0]?.name || serviceCategories[0],
      phone: '',
      city: '',
      area: '',
      address: '',
      lat: '',
      lng: '',
    })
  }

  const handleServiceCreate = async (event) => {
    event.preventDefault()

    setServiceCreateLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(serviceCreateForm),
      })

      await parseDashboardResponse(response)
      toast.success('Service created')
      resetServiceCreateForm()
      setServiceCreateOpen(false)
      fetchServices()
    } catch (error) {
      toast.error(error.message || 'Failed to create service')
    } finally {
      setServiceCreateLoading(false)
    }
  }

  const handleServiceLocationPick = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const latitude = coords.latitude
        const longitude = coords.longitude

        setServiceCreateForm((prev) => ({
          ...prev,
          lat: String(latitude),
          lng: String(longitude),
        }))

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
          if (!response.ok) {
            throw new Error('Reverse geocoding failed')
          }

          const data = await response.json()
          const address = data.display_name || ''
          const addressDetails = data.address || {}
          const cityValue =
            addressDetails.city ||
            addressDetails.town ||
            addressDetails.village ||
            addressDetails.county ||
            ''
          const areaValue =
            addressDetails.suburb ||
            addressDetails.neighbourhood ||
            addressDetails.hamlet ||
            addressDetails.city_district ||
            ''

          setServiceCreateForm((prev) => ({
            ...prev,
            address: address || prev.address,
            city: cityValue || prev.city,
            area: areaValue || prev.area,
            lat: String(latitude),
            lng: String(longitude),
          }))

          toast.success('Location and address filled from current coordinates')
        } catch (error) {
          toast.error('Current location set, but address lookup failed')
        }
      },
      () => {
        toast.error('Unable to access location. Please allow permission.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const resetVendorCreateForm = () => {
    setVendorCreateForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      businessName: '',
      businessCategory: '',
      businessAddress: '',
      businessCity: '',
      businessArea: '',
      businessDescription: '',
      website: '',
    })
  }

  const handleVendorCreate = async (event) => {
    event.preventDefault()

    if (!vendorCreateForm.email && !vendorCreateForm.phone) {
      toast.error('Provide either email or phone for vendor')
      return
    }

    setVendorCreateLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: vendorCreateForm.name,
          email: vendorCreateForm.email,
          phone: vendorCreateForm.phone,
          password: vendorCreateForm.password,
          businessName: vendorCreateForm.businessName,
          businessCategory: vendorCreateForm.businessCategory,
          businessAddress: vendorCreateForm.businessAddress,
          businessCity: vendorCreateForm.businessCity,
          businessArea: vendorCreateForm.businessArea,
          businessDescription: vendorCreateForm.businessDescription,
          website: vendorCreateForm.website,
        }),
      })

      await parseDashboardResponse(response)
      toast.success('Vendor created')
      resetVendorCreateForm()
      setVendorCreateOpen(false)
      setVendorPage(1)
      fetchVendors()
    } catch (error) {
      toast.error(error.message || 'Failed to create vendor')
    } finally {
      setVendorCreateLoading(false)
    }
  }

  const handleCategoryCreate = async (event) => {
    event.preventDefault()
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setCategoryActionLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(categoryForm),
      })
      await parseDashboardResponse(response)
      toast.success('Category created')
      setCategoryForm({ name: '', description: '', country: 'India' })
      fetchCategoryList()
      fetchAdminCategories()
    } catch (error) {
      toast.error(error.message || 'Failed to create category')
    } finally {
      setCategoryActionLoading(false)
    }
  }

  const handleCategoryEditStart = (category) => {
    setCategoryEditId(category._id)
    setCategoryEditForm({
      name: category.name || '',
      description: category.description || '',
      country: category.country || 'India',
      status: category.status || 'approved',
      isActive: category.isActive !== undefined ? category.isActive : true,
    })
  }

  const handleCategoryEditCancel = () => {
    setCategoryEditId(null)
    setCategoryEditForm({ name: '', description: '', country: 'India' })
  }

  const handleCategoryUpdate = async (event) => {
    event.preventDefault()
    if (!categoryEditForm.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setCategoryActionLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryEditId}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(categoryEditForm),
      })
      await parseDashboardResponse(response)
      toast.success('Category updated successfully')
      handleCategoryEditCancel()
      fetchAdminCategories()
      fetchCategoryList()
    } catch (error) {
      toast.error(error.message || 'Failed to update category')
    } finally {
      setCategoryActionLoading(false)
    }
  }

  const handleCategoryApprove = async (categoryId) => {
    setCategoryActionLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify({ status: 'approved' }),
      })
      await parseDashboardResponse(response)
      toast.success('Category approved')
      fetchAdminCategories()
      fetchCategoryList()
    } catch (error) {
      toast.error(error.message || 'Failed to approve category')
    } finally {
      setCategoryActionLoading(false)
    }
  }

  const handleCategoryReject = async (categoryId) => {
    setCategoryActionLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify({ status: 'rejected' }),
      })
      await parseDashboardResponse(response)
      toast.success('Category rejected')
      fetchAdminCategories()
      fetchCategoryList()
    } catch (error) {
      toast.error(error.message || 'Failed to reject category')
    } finally {
      setCategoryActionLoading(false)
    }
  }

  const handleCategoryDelete = async (categoryId) => {
    if (!window.confirm('Delete this category?')) {
      return
    }

    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {}
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      })
      await parseDashboardResponse(response)
      toast.success('Category deleted')
      fetchAdminCategories()
      fetchCategoryList()
    } catch (error) {
      toast.error(error.message || 'Failed to delete category')
    }
  }

  const handleCategoryRequest = async (event) => {
    event.preventDefault()
    if (!categoryRequestForm.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setCategoryActionLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) }
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(categoryRequestForm),
      })
      await parseDashboardResponse(response)
      toast.success('Category request submitted')
      setCategoryRequestForm({ name: '', description: '' })
      setCategoryRequestOpen(false)
      fetchCategoryList()
    } catch (error) {
      toast.error(error.message || 'Failed to submit category request')
    } finally {
      setCategoryActionLoading(false)
    }
  }

  const handlePendingSearch = (event) => {
    event.preventDefault()
    setPendingPage(1)
    fetchPendingServices()
  }

  const handleServiceApproval = async (serviceId, approved) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/services/${serviceId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: approved ? 'approved' : 'rejected' }),
      })
      await parseDashboardResponse(response)
      toast.success(approved ? 'Service approved' : 'Service rejected')
      fetchPendingServices()
    } catch (error) {
      toast.error(error.message || 'Failed to update approval status')
    }
  }

  if (!hasHydrated) {
    return <main className="p-6 text-sm text-slate-600 dark:text-slate-300">Loading dashboard...</main>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background text-base text-slate-900 dark:text-slate-50">
      <div className="grid min-h-screen w-full gap-5 px-4 py-6 md:px-6 lg:grid-cols-[280px_1fr] lg:gap-0 lg:px-0 lg:py-0">
        <aside className="flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm lg:sticky lg:top-0 lg:h-screen lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:shadow-none">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{dashboard.title}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{dashboard.subtitle}</p>

          <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Modules</p>
            {modules.map((module) => {
              const ModuleIcon = moduleIconMap[module.id] || LayoutDashboard

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => router.push(`/dashboard/${module.id}`)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-base font-medium transition-all duration-200 ${
                    activeModuleId === module.id
                      ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_8px_24px_rgba(59,130,246,0.12)]'
                      : 'border-border bg-background text-slate-900 dark:text-slate-100 hover:bg-muted/50'
                  }`}>
                  <span className="flex items-center gap-3">
                    <ModuleIcon className="h-5 w-5 shrink-0" />
                    <span>{module.name}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={async () => {
                await logout()
                router.push('/login')
              }}>
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <section className="rounded-2xl border bg-card p-5 shadow-sm md:p-6 lg:my-6 lg:mr-6 text-base text-slate-900 dark:text-slate-50">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">{activeModule?.name || 'Overview'}</h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                {activeModule?.description || 'Module details'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push('/')}>Home</Button>
              <ThemeToggleButton />
            </div>
          </div>

          {isProfileModule ? (
            <form className="mt-5 space-y-4" onSubmit={handleProfileSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Name</span>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(event) => handleProfileChange('name', event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none ring-offset-background placeholder:text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                </label>

                <label className="block space-y-1 text-sm">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4" />
                    Email
                  </span>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(event) => handleProfileChange('email', event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none ring-offset-background placeholder:text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block space-y-1 text-sm">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="h-4 w-4" />
                    Phone
                  </span>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(event) => handleProfileChange('phone', event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none ring-offset-background placeholder:text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Optional"
                  />
                </label>

                <label className="block space-y-1 text-sm">
                  <span className="text-slate-600 dark:text-slate-300">New Password</span>
                  <input
                    type="password"
                    value={profileForm.password}
                    onChange={(event) => handleProfileChange('password', event.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none ring-offset-background placeholder:text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Leave blank to keep current"
                    minLength={6}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">Any role can update personal profile from here.</p>
                <Button type="submit" disabled={authLoading}>
                  {authLoading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          ) : isServicesModule || isAdminServicesModule ? (
            <div className="mt-5 space-y-4">
              <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleServiceSearch}>
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-slate-300" />
                  <input
                    type="text"
                    value={serviceSearchInput}
                    onChange={(event) => setServiceSearchInput(event.target.value)}
                    placeholder="Search your services by name, category, or area"
                    className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchServices()}
                  disabled={serviceLoading}>
                  <RefreshCcw className={`mr-1.5 h-4 w-4 ${serviceLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setServiceCreateOpen((prev) => !prev)
                    resetServiceCreateForm()
                  }}>
                  <BriefcaseBusiness className="mr-1.5 h-4 w-4" />
                  {serviceCreateOpen ? 'Close' : 'Add Service'}
                </Button>
              </form>

              {serviceCreateOpen ? (
                <form className="rounded-xl border p-4" onSubmit={handleServiceCreate}>
                  <p className="text-sm font-medium">Create Service Listing</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={serviceCreateForm.name}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Service name"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                    <select
                      value={serviceCreateForm.category}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, category: event.target.value }))
                      }
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {(categories.length ? categories : serviceCategories).map((category) => (
                        <option key={category.name || category} value={category.name || category}>
                          {category.name || category}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={serviceCreateForm.phone}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      placeholder="Contact phone"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={serviceCreateForm.city}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, city: event.target.value }))
                      }
                      placeholder="City"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                    <input
                      type="text"
                      value={serviceCreateForm.area}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, area: event.target.value }))
                      }
                      placeholder="Area / neighborhood"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                    <input
                      type="text"
                      value={serviceCreateForm.address}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, address: event.target.value }))
                      }
                      placeholder="Address"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={serviceCreateForm.lat}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, lat: event.target.value }))
                      }
                      placeholder="Latitude"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                    <input
                      type="text"
                      value={serviceCreateForm.lng}
                      onChange={(event) =>
                        setServiceCreateForm((prev) => ({ ...prev, lng: event.target.value }))
                      }
                      placeholder="Longitude"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button type="button" variant="outline" onClick={handleServiceLocationPick}>
                      <MapPin className="mr-1.5 h-4 w-4" />
                      Use current location
                    </Button>
                    <div className="ml-auto flex gap-2">
                      <Button type="button" variant="outline" onClick={resetServiceCreateForm}>
                        Reset
                      </Button>
                      <Button type="submit" disabled={serviceCreateLoading}>
                        {serviceCreateLoading ? 'Saving...' : 'Save Service'}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : null}

              {serviceCreateOpen ? (
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">Request Custom Category</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Vendor category suggestions are submitted for admin review.</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCategoryRequestOpen((prev) => !prev)}>
                      {categoryRequestOpen ? 'Close Request' : 'Open Request'}
                    </Button>
                  </div>
                  {categoryRequestOpen ? (
                    <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={handleCategoryRequest}>
                      <input
                        type="text"
                        value={categoryRequestForm.name}
                        onChange={(event) => setCategoryRequestForm((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Custom category name"
                        className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      />
                      <input
                        type="text"
                        value={categoryRequestForm.description}
                        onChange={(event) => setCategoryRequestForm((prev) => ({ ...prev, description: event.target.value }))}
                        placeholder="Description for admin review"
                        className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <div className="sm:col-span-2 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setCategoryRequestForm({ name: '', description: '' })}>
                          Reset
                        </Button>
                        <Button type="submit" disabled={categoryActionLoading}>
                          {categoryActionLoading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                      </div>
                    </form>
                  ) : null}
                </div>
              ) : null}

              <div className="rounded-xl border">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  <span>Name</span>
                  <span>Category</span>
                  <span>Area</span>
                  <span>Location</span>
                  <span className="text-right">Actions</span>
                </div>

                {serviceLoading ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">Loading services...</p>
                ) : services.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">No services found.</p>
                ) : (
                  services.map((service) => {
                    const isEditing = serviceEditId === service._id

                    return (
                      <div
                        key={service._id}
                        className="grid grid-cols-1 gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:items-center">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={serviceEditForm.name}
                              onChange={(event) =>
                                setServiceEditForm((prev) => ({ ...prev, name: event.target.value }))
                              }
                              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <select
                              value={serviceEditForm.category}
                              onChange={(event) =>
                                setServiceEditForm((prev) => ({ ...prev, category: event.target.value }))
                              }
                              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {(categories.length ? categories : serviceCategories).map((category) => (
                                <option key={category.name || category} value={category.name || category}>
                                  {category.name || category}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={serviceEditForm.area}
                              onChange={(event) =>
                                setServiceEditForm((prev) => ({ ...prev, area: event.target.value }))
                              }
                              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={serviceEditForm.lat}
                                onChange={(event) =>
                                  setServiceEditForm((prev) => ({ ...prev, lat: event.target.value }))
                                }
                                placeholder="Latitude"
                                className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                              />
                              <input
                                type="text"
                                value={serviceEditForm.lng}
                                onChange={(event) =>
                                  setServiceEditForm((prev) => ({ ...prev, lng: event.target.value }))
                                }
                                placeholder="Longitude"
                                className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                              />
                            </div>
                            <div className="sm:col-span-3 sm:col-start-1 sm:flex sm:flex-col sm:gap-2">
                              <input
                                type="text"
                                value={serviceEditForm.city}
                                onChange={(event) =>
                                  setServiceEditForm((prev) => ({ ...prev, city: event.target.value }))
                                }
                                placeholder="City"
                                className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleServiceUpdate(service._id)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleServiceEditCancel}>
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm font-medium">{service.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-300">{service.category}</p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{service.category}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{service.area}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {service.location?.coordinates ? `${service.location.coordinates[1].toFixed(4)}, ${service.location.coordinates[0].toFixed(4)}` : 'No coords'}
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleServiceEditStart(service)}>
                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Showing {services.length} of {serviceMeta.total} services
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={servicePage <= 1 || serviceLoading}
                    onClick={() => setServicePage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={servicePage * serviceMeta.limit >= serviceMeta.total || serviceLoading}
                    onClick={() => setServicePage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : isCategoriesModule ? (
            <div className="mt-5 space-y-4">
              <form
                className="rounded-xl border p-4"
                onSubmit={categoryEditId ? handleCategoryUpdate : handleCategoryCreate}
              >
                <p className="text-sm font-medium">
                  {categoryEditId ? 'Edit Service Category' : 'Create Service Category'}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={categoryEditId ? categoryEditForm.name : categoryForm.name}
                    onChange={(event) => {
                      const value = event.target.value
                      if (categoryEditId) {
                        setCategoryEditForm((prev) => ({ ...prev, name: value }))
                      } else {
                        setCategoryForm((prev) => ({ ...prev, name: value }))
                      }
                    }}
                    placeholder="Category name"
                    className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                  <input
                    type="text"
                    value={categoryEditId ? categoryEditForm.description : categoryForm.description}
                    onChange={(event) => {
                      const value = event.target.value
                      if (categoryEditId) {
                        setCategoryEditForm((prev) => ({ ...prev, description: value }))
                      } else {
                        setCategoryForm((prev) => ({ ...prev, description: value }))
                      }
                    }}
                    placeholder="Description"
                    className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {categoryEditId ? (
                    <select
                      value={categoryEditForm.status}
                      onChange={(event) =>
                        setCategoryEditForm((prev) => ({ ...prev, status: event.target.value }))
                      }
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : null}
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (categoryEditId) {
                        handleCategoryEditCancel()
                      } else {
                        setCategoryForm({ name: '', description: '', country: 'India' })
                      }
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={categoryActionLoading}>
                    {categoryEditId ? 'Update Category' : 'Save Category'}
                  </Button>
                </div>
              </form>

              <div className="rounded-xl border">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  <span>Name</span>
                  <span>Description</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>

                {adminCategoryLoading ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">Loading categories...</p>
                ) : adminCategories.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">No categories available.</p>
                ) : (
                  adminCategories.map((category) => (
                    <div key={category._id} className="grid grid-cols-1 gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center">
                      <div>
                        <p className="text-sm font-medium">{category.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {category.requestedBy?.name ? `Requested by ${category.requestedBy.name}` : category.country}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{category.description || '—'}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 capitalize">{category.status}</p>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleCategoryEditStart(category)}>
                          <Pencil className="mr-1.5 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        {category.status === 'pending' ? (
                          <>
                            <Button size="sm" variant="outline" disabled={categoryActionLoading} onClick={() => handleCategoryApprove(category._id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" disabled={categoryActionLoading} onClick={() => handleCategoryReject(category._id)}>
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleCategoryDelete(category._id)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : isApprovalsModule ? (
            <div className="mt-5 space-y-4">
              <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handlePendingSearch}>
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-slate-300" />
                  <input
                    type="text"
                    value={pendingQuery}
                    onChange={(event) => setPendingQuery(event.target.value)}
                    placeholder="Search pending services by name, vendor, or area"
                    className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchPendingServices()}
                  disabled={pendingLoading}>
                  <RefreshCcw className={`mr-1.5 h-4 w-4 ${pendingLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </form>

              <div className="rounded-xl border">
                <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  <span>Service</span>
                  <span>Vendor</span>
                  <span>Location</span>
                  <span>Category</span>
                  <span className="text-right">Actions</span>
                </div>

                {pendingLoading ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">Loading pending service requests...</p>
                ) : pendingServices.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">No pending services.</p>
                ) : (
                  pendingServices.map((service) => (
                    <div key={service._id} className="grid grid-cols-1 gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] sm:items-center">
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{service.vendorName}</p>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{service.vendor?.email || service.vendorName || 'N/A'}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{service.city}, {service.area}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{service.category}</p>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => handleServiceApproval(service._id, true)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleServiceApproval(service._id, false)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Showing {pendingServices.length} of {pendingMeta.total} pending requests
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingPage <= 1 || pendingLoading}
                    onClick={() => setPendingPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingPage * pendingMeta.limit >= pendingMeta.total || pendingLoading}
                    onClick={() => setPendingPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : isVendorsModule ? (
            <div className="mt-5 space-y-4">
              <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleVendorSearch}>
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-slate-300" />
                  <input
                    type="text"
                    value={vendorSearchInput}
                    onChange={(event) => setVendorSearchInput(event.target.value)}
                    placeholder="Search by vendor name, email, phone"
                    className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" variant="outline">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchVendors()}
                  disabled={vendorLoading}>
                  <RefreshCcw className={`mr-1.5 h-4 w-4 ${vendorLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setVendorCreateOpen((prev) => !prev)
                    resetVendorCreateForm()
                  }}>
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  {vendorCreateOpen ? 'Close' : 'Add Vendor'}
                </Button>
              </form>

              {vendorCreateOpen ? (
                <form className="rounded-xl border p-4" onSubmit={handleVendorCreate}>
                  <p className="text-sm font-medium">Create Vendor Account</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={vendorCreateForm.name}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Vendor name"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                    <input
                      type="password"
                      value={vendorCreateForm.password}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder="Password (min 6 chars)"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                      minLength={6}
                      required
                    />
                    <input
                      type="email"
                      value={vendorCreateForm.email}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="Email (optional if phone)"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="tel"
                      value={vendorCreateForm.phone}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      placeholder="Phone (optional if email)"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={vendorCreateForm.businessName}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, businessName: event.target.value }))
                      }
                      placeholder="Business name"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={vendorCreateForm.businessCategory}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, businessCategory: event.target.value }))
                      }
                      placeholder="Business category"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={vendorCreateForm.businessAddress}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, businessAddress: event.target.value }))
                      }
                      placeholder="Business address"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={vendorCreateForm.businessCity}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, businessCity: event.target.value }))
                      }
                      placeholder="City"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={vendorCreateForm.businessArea}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, businessArea: event.target.value }))
                      }
                      placeholder="Area / neighborhood"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={vendorCreateForm.website}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, website: event.target.value }))
                      }
                      placeholder="Website"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <input
                      type="text"
                      value={vendorCreateForm.businessDescription}
                      onChange={(event) =>
                        setVendorCreateForm((prev) => ({ ...prev, businessDescription: event.target.value }))
                      }
                      placeholder="Business description"
                      className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setVendorCreateOpen(false)
                        resetVendorCreateForm()
                      }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={vendorCreateLoading}>
                      {vendorCreateLoading ? 'Creating...' : 'Create Vendor'}
                    </Button>
                  </div>
                </form>
              ) : null}

              <div className="rounded-xl border">
                <div className="grid grid-cols-[1.3fr_1fr_1fr_auto] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Phone</span>
                  <span className="text-right">Actions</span>
                </div>

                {vendorLoading ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">Loading vendors...</p>
                ) : vendors.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-slate-600 dark:text-slate-300">No vendors found.</p>
                ) : (
                  vendors.map((vendor) => {
                    const isEditing = vendorEditId === vendor._id

                    return (
                      <div
                        key={vendor._id}
                        className="grid grid-cols-1 gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-center">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={vendorEditForm.name}
                              onChange={(event) =>
                                setVendorEditForm((prev) => ({ ...prev, name: event.target.value }))
                              }
                              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <input
                              type="email"
                              value={vendorEditForm.email}
                              onChange={(event) =>
                                setVendorEditForm((prev) => ({ ...prev, email: event.target.value }))
                              }
                              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <input
                              type="tel"
                              value={vendorEditForm.phone}
                              onChange={(event) =>
                                setVendorEditForm((prev) => ({ ...prev, phone: event.target.value }))
                              }
                              className="rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleVendorUpdate(vendor._id)}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleVendorEditCancel}>
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm font-medium">{vendor.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-300">{vendor.businessName || vendor.role}</p>
                              {vendor.businessCategory ? (
                                <p className="text-xs text-slate-600 dark:text-slate-300">{vendor.businessCategory}</p>
                              ) : null}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{vendor.email || 'N/A'}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{vendor.phone || 'N/A'}</p>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleVendorEditStart(vendor)}>
                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleVendorDelete(vendor._id)}>
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Showing {vendors.length} of {vendorMeta.total} vendors
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={vendorPage <= 1 || vendorLoading}
                    onClick={() => setVendorPage((prev) => Math.max(prev - 1, 1))}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={vendorPage * vendorMeta.limit >= vendorMeta.total || vendorLoading}
                    onClick={() => setVendorPage((prev) => prev + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(activeModule?.stats || []).map((item) => (
                  <div key={item.label} className="rounded-xl border bg-background p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-background p-4">
                  <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="mt-1 font-medium">{user?.email || 'Not provided'}</p>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  <p className="mt-1 font-medium">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
