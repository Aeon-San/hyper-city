'use client'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import React from 'react'
import { useScroll, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/use-auth-store'
import { SmartSearchDialog } from '@/components/smart-search-dialog'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
]

export const HeroHeader = ({ showNavLinks = true, showHomeButton = false }) => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const [smartSearchOpen, setSmartSearchOpen] = React.useState(false)
    const { scrollYProgress } = useScroll()
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const hasHydrated = useAuthStore((state) => state.hasHydrated)
    const logout = useAuthStore((state) => state.logout)

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe();
    }, [scrollYProgress])

    return (
        <header>
            <SmartSearchDialog open={smartSearchOpen} onOpenChange={setSmartSearchOpen} />
            <nav data-state={menuState && 'active'} className="fixed z-20 w-full pt-2">
                <div
                    className={cn(
                        'mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12',
                        scrolled && 'bg-background/50 backdrop-blur-2xl'
                    )}>
                    <motion.div
                        key={1}
                        className={cn(
                            'relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6',
                            scrolled && 'lg:py-4'
                        )}>
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link href="/" aria-label="home" className="flex items-center space-x-2">
                                <span
                                    className={cn(
                                        'text-xl font-semibold transition-colors',
                                        scrolled ? 'text-foreground' : 'text-white'
                                    )}>
                                    City Saathi
                                </span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu
                                    className={cn(
                                        'in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200',
                                        scrolled ? 'text-foreground' : 'text-white'
                                    )} />
                                <X
                                    className={cn(
                                        'in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200',
                                        scrolled ? 'text-foreground' : 'text-white'
                                    )} />
                            </button>

                            <div className="hidden lg:flex lg:items-center lg:gap-8">
                                {showHomeButton ? (
                                    <Button asChild variant="outline" size="sm" className="h-9 px-4">
                                        <Link href="/">
                                            <span>Back Home</span>
                                        </Link>
                                    </Button>
                                ) : null}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className={cn(
                                        'rounded-full',
                                        scrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
                                    )}
                                    aria-label="Open smart search"
                                    onClick={() => setSmartSearchOpen(true)}>
                                    <Search className="size-5" />
                                </Button>
                                {showNavLinks ? (
                                    <ul className="flex gap-8 text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        'block duration-150',
                                                        scrolled
                                                            ? 'text-foreground hover:text-primary'
                                                            : 'text-white hover:text-slate-300'
                                                    )}>
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </div>

                        <div
                            className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                {showHomeButton ? (
                                    <Button asChild variant="outline" size="sm" className="mb-4 w-full justify-center">
                                        <Link href="/">
                                            <span>Back Home</span>
                                        </Link>
                                    </Button>
                                ) : null}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mb-4 w-full justify-center gap-2"
                                    onClick={() => {
                                        setSmartSearchOpen(true)
                                        setMenuState(false)
                                    }}>
                                    <Search className="size-4" />
                                    Smart Search
                                </Button>
                                {showNavLinks ? (
                                    <ul className="space-y-6 text-base">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-foreground hover:text-primary block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                            <div
                                className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end md:w-fit">
                                {hasHydrated && isAuthenticated ? (
                                    <>
                                        <span className="text-sm font-medium text-foreground/90 sm:px-1">
                                            {user?.name || 'User'}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 px-4"
                                            onClick={logout}>
                                            <span>Logout</span>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button asChild variant="outline" size="sm" className="h-9 px-4">
                                            <Link href="/login">
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button asChild size="sm" className="h-9 px-4">
                                            <Link href="/signup">
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                    </>
                                )}
                                <div className="flex items-center justify-start sm:justify-center">
                                    <ThemeToggleButton />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    );
}
