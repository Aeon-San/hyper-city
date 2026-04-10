import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import Link from 'next/link'

export default function SignupPage() {
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
                action=""
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
                                <Input type="text" required name="firstname" id="firstname" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname" className="block text-sm">
                                    Last Name
                                </Label>
                                <Input type="text" required name="lastname" id="lastname" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Email
                            </Label>
                            <Input type="email" required name="email" id="email" />
                        </div>

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
                                className="input sz-md variant-mixed" />
                        </div>

                        <Button className="w-full">Sign Up</Button>
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
