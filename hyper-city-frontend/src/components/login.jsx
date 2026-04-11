'use client'

import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/use-auth-store'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = useAuthStore((state) => state.login)
    const clearError = useAuthStore((state) => state.clearError)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isLoading = useAuthStore((state) => state.isLoading)
    const error = useAuthStore((state) => state.error)

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard')
        }
    }, [isAuthenticated, router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()

        try {
            await login({ email, password })
            router.push('/dashboard')
        } catch {
            // store already captures the error
        }
    }

    return (
        <section
            className="relative flex min-h-screen items-center justify-center px-4 py-16 md:py-32"
            style={{ backgroundImage: "url('/authbg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black/45" />
            <nav className="absolute inset-x-0 top-0 z-20">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 md:px-8">
                    <Link href="/" className="text-base font-semibold text-white md:text-lg">
                        City Saathi
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link href="/" className="hidden text-sm text-white/90 hover:text-white md:block">
                            Home
                        </Link>
                        <Link href="/#features" className="hidden text-sm text-white/90 hover:text-white md:block">
                            Features
                        </Link>
                        <Button asChild variant="outline" size="sm" className="h-9 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                        <ThemeToggleButton />
                    </div>
                </div>
            </nav>
            <form
                onSubmit={handleSubmit}
                className="bg-muted relative z-10 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
                <div
                    className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div className="text-center">
                        <Link href="/" aria-label="go home" className="mx-auto block w-fit">
                            <LogoIcon />
                        </Link>
                        <h1 className="mb-1 mt-4 text-3xl font-bold text-black dark:text-white">Sign In to City Saathi</h1>
                        <p className="mt-2 text-base text-black/70 dark:text-white/80">Welcome back! Continue exploring nearby services.</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-base font-semibold text-black dark:text-white">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pwd" className="text-base font-semibold text-black dark:text-white">
                                    Password
                                </Label>
                                <Button asChild variant="link" size="sm">
                                    <Link href="/login" className="link intent-info variant-ghost text-sm">
                                        Forgot password?
                                    </Link>
                                </Button>
                            </div>
                            <Input
                                type="password"
                                required
                                name="pwd"
                                id="pwd"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input sz-md variant-mixed" />
                        </div>

                        {error && <p className="text-base font-semibold text-destructive">{error}</p>}

                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </div>

                </div>

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-base font-medium">
                        Don&apos;t have an account?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/signup">Create account</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}
