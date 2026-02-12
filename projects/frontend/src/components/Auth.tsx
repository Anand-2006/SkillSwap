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
        <div className="min-h-screen flex bg-zinc-950 text-white font-sans overflow-hidden">

            {/* Left Section: Branding & Vision */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-20 relative border-r border-zinc-900 bg-zinc-950">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 border border-zinc-800 flex items-center justify-center">
                            <div className="w-2 h-2 bg-indigo-600"></div>
                        </div>
                        <span className="font-mono text-[11px] font-bold tracking-widest text-zinc-600">SKILLSWAP // PRO_SYSTEM</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-7xl font-bold tracking-tighter mb-8 leading-[0.9] text-zinc-50">
                        Peer-to-Peer <br />
                        Task Escrow<span className="text-indigo-600">.</span>
                    </h1>
                    <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-lg">
                        Secure, automated release for decentralized collaboration on the Algorand blockchain.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-700 uppercase font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Algorand Mainnet Readiness // v2.0.4-STABLE
                    </div>
                </div>
            </div>

            {/* Right Section: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-zinc-900/50">
                <div className="w-full max-w-md space-y-12 bg-zinc-900 border border-zinc-800 p-10 rounded-md">

                    <div className="space-y-2">
                        <h2 className="font-mono text-[11px] font-bold text-indigo-400 tracking-widest uppercase mb-4">
                            System Access // {isSignUp ? '02_INIT' : '01_LOGIN'}
                        </h2>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-8">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="block font-mono text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-3 group-focus-within:text-indigo-400 transition-colors">
                                    Operator Email
                                </label>
                                <input
                                    className="w-full bg-zinc-950 border border-zinc-800 p-4 text-sm font-mono text-white placeholder-zinc-800 outline-none focus:border-indigo-600/50 transition-all rounded-sm"
                                    type="email"
                                    placeholder="operator@system.io"
                                    value={email}
                                    required={true}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block font-mono text-[9px] font-bold text-zinc-600 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full bg-zinc-950 border border-zinc-800 p-4 text-base font-mono text-white placeholder-zinc-800 outline-none focus:border-indigo-600/50 transition-all rounded-sm"
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={password}
                                        required={true}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-800">
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className="w-full bg-indigo-600 text-white font-bold tracking-widest py-4 px-6 hover:bg-indigo-500 transition-all duration-200 uppercase text-xs rounded-sm border-0"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3 font-mono">
                                    <span className="w-1.5 h-1.5 bg-white animate-ping"></span>
                                    UNLINKING DATA...
                                </span>
                            ) : (
                                isSignUp ? 'Initialize Node' : 'Enter Terminal'
                            )}
                        </button>
                    </form>

                    <div className="flex flex-col items-center gap-6 pt-8 border-t border-zinc-800">
                        <button
                            className="text-[11px] font-mono font-bold text-zinc-600 hover:text-indigo-400 uppercase tracking-widest transition-all"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? '> Return to Login' : '> Initialize New Account'}
                        </button>

                        <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-700 uppercase tracking-widest">
                            <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                            <span>Secure Channel Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
