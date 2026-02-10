
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useSnackbar } from 'notistack'

export default function Auth({ onLogin }: { onLogin: () => void }) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    // Email validation regex for basic format checking
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isValidEmail(email)) {
            enqueueSnackbar('Please enter a valid email address.', { variant: 'warning' })
            return
        }

        setLoading(true)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) {
                    if (error.message.includes('already registered')) {
                        enqueueSnackbar('User already exists. Please sign in instead.', { variant: 'warning' })
                    } else {
                        throw error
                    }
                } else {
                    enqueueSnackbar('Access Node Created. Verification uplink sent to email.', { variant: 'success' })
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        enqueueSnackbar('Access Denied: Invalid credentials.', { variant: 'error' })
                    } else {
                        throw error
                    }
                } else {
                    onLogin()
                }
            }
        } catch (error: any) {
            enqueueSnackbar(error.error_description || error.message, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#050505] text-white font-sans overflow-hidden">

            {/* Left Section: Branding & Vision */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-20 relative border-r border-zinc-900/50">
                {/* Decorative background grid/noise could go here */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 border border-white/20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-emerald-500"></div>
                        </div>
                        <span className="font-mono text-xs tracking-widest text-zinc-500">SKILL-SWAP // DECENTRALIZED</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
                        Decentralized <br />
                        Gig Economy<span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-xl text-zinc-500 font-light leading-relaxed max-w-lg">
                        Optimizing talent pipelines for a permissionless grid. Every contract counts when you are building at planetary scale.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Carbon-Aware Inference // Stable Core v2.4
                    </div>
                </div>
            </div>

            {/* Right Section: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-[#0a0a0a]">
                <div className="w-full max-w-md space-y-12">

                    <div className="space-y-2">
                        <h2 className="font-mono text-xs text-emerald-500 tracking-widest uppercase mb-4">
                            Access Gate // {isSignUp ? '02 [INIT]' : '01 [LOGIN]'}
                        </h2>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-8">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-3 group-focus-within:text-emerald-500 transition-colors">
                                    Work Email
                                </label>
                                <input
                                    className="w-full bg-transparent border border-zinc-800 p-4 text-sm font-mono text-white placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:bg-zinc-900/30 transition-all rounded-sm"
                                    type="email"
                                    placeholder="dev@infrastructure.ai"
                                    value={email}
                                    required={true}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block font-mono text-[10px] text-zinc-600 uppercase tracking-widest group-focus-within:text-emerald-500 transition-colors">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full bg-transparent border border-zinc-800 p-4 text-sm font-mono text-white placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:bg-zinc-900/30 transition-all rounded-sm"
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={password}
                                        required={true}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full bg-white text-black font-bold tracking-tight py-4 px-6 hover:bg-emerald-400 hover:text-black hover:scale-[1.01] transition-all duration-200 uppercase text-sm border-0 rounded-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3 font-mono">
                                    <span className="w-2 h-2 bg-black animate-ping"></span>
                                    Processing Request...
                                </span>
                            ) : (
                                isSignUp ? 'Initialize Workspace' : 'Access Workspace'
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col items-center gap-6 pt-8 border-t border-zinc-900/50">
                        <button
                            className="text-xs font-mono text-zinc-600 hover:text-emerald-500 underline underline-offset-4 decoration-zinc-800 hover:decoration-emerald-500/50 transition-all"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? ':: Return to Access Gate' : ':: Create New Access Node'}
                        </button>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-900"></span>
                            <span>System Status: Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
