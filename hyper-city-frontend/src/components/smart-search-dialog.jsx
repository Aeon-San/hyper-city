'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const CATEGORY_PILLS = ['Repairs', 'Tutors', 'Food', 'Business', 'Trusted']

export function SmartSearchDialog({ open, onOpenChange }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  const runSearch = useCallback(() => {
    const params = new URLSearchParams()
    params.set('country', 'India')
    const q = query.trim()
    if (q) params.set('search', q)
    if (activeCategory) params.set('category', activeCategory)
    onOpenChange(false)
    router.push(`/listings?${params.toString()}`)
  }, [query, activeCategory, onOpenChange, router])

  const handleOpenChange = (next) => {
    onOpenChange(next)
    if (!next) {
      setQuery('')
      setActiveCategory(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[min(90vh,640px)] w-[calc(100%-2rem)] max-w-[28rem] gap-0 overflow-y-auto rounded-3xl border border-border/80 bg-card p-0 text-card-foreground shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="border-b border-border/60 px-6 pb-4 pt-6 pr-14">
          <DialogHeader className="gap-2 space-y-0 text-left">
            <DialogTitle className="font-serif text-2xl font-normal tracking-tight text-foreground">
              Smart Search
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Search local services by name, category, or area.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                runSearch()
              }
            }}
            placeholder="Try: electrician, tutor, cafe, MG Road"
            className="h-12 rounded-2xl border-border/80 bg-background text-base"
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORY_PILLS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  setActiveCategory((prev) => (prev === label ? null : label))
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === label
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border/80 bg-muted/50 text-foreground hover:bg-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button
            type="button"
            className="h-11 w-full rounded-2xl text-base font-medium"
            onClick={runSearch}
          >
            Search listings
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Dark and light mode are automatically supported in this modal.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
