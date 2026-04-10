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

export default function SignupPage() {
    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const [adminSecret, setAdminSecret] = useState('')

    const signup = useAuthStore((state) => state.signup)
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
            const fullName = `${firstName} ${lastName}`.trim()
            await signup({
                name: fullName,
                email,
                password,
                role,
                adminSecret: role === 'admin' ? adminSecret : undefined,
            })

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
                        Hyper City
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link href="/" className="hidden text-sm text-white/90 hover:text-white md:block">
                            Home
                        </Link>
                        <Link href="/#features" className="hidden text-sm text-white/90 hover:text-white md:block">
                            Features
                        </Link>
                        <Button asChild variant="outline" size="sm" className="h-9 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                            <Link href="/login">Login</Link>
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
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Create a Hyper City Account</h1>
                        <p className="text-sm">Join Hyper City to discover trusted local services.</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="firstname" className="block text-sm">
                                    First Name
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    name="firstname"
                                    id="firstname"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="block text-sm">
                                    Last Name
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    name="lastname"
                                    id="lastname"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
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

                        <div className="space-y-2">
                            <Label htmlFor="role" className="block text-sm">
                                Account Type
                            </Label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40">
                                <option value="user">User</option>
                                <option value="vendor">Vendor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {role === 'admin' && (
                            <div className="space-y-2">
                                <Label htmlFor="admin-secret" className="block text-sm">
                                    Admin Secret
                                </Label>
                                <Input
                                    type="password"
                                    required
                                    name="admin-secret"
                                    id="admin-secret"
                                    value={adminSecret}
                                    onChange={(e) => setAdminSecret(e.target.value)}
                                    placeholder="Enter admin secret key"
                                />
                            </div>
                        )}

                        <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pwd" className="text-sm">
                                    Password
                                </Label>
                                <span className="text-xs text-muted-foreground">Min 8 characters</span>
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

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </div>

                </div>

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Already have an account?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}
