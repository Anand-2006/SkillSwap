
import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useSnackbar } from 'notistack'

export default function Auth({ onLogin }: { onLogin: () => void }) {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                enqueueSnackbar('Check your email for the confirmation link!', { variant: 'info' })
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                onLogin()
            }
        } catch (error: any) {
            enqueueSnackbar(error.error_description || error.message, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-400 font-sans selection:bg-emerald-500/30 relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md p-8 relative z-10">

                {/* Logo / Brand */}
                <div className="mb-10 text-center">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/5">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-2">SkillSwap</h1>
                    <p className="text-slate-500 text-sm">Decentralized Gig Marketplace & Compute Rental</p>
                </div>

                {/* Auth Card */}
                <div className="card-premium p-8 bg-[#1e293b]/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl">
                    <h2 className="text-xl font-semibold text-white mb-6 text-center">
                        {isSignUp ? 'Create an Account' : 'Welcome Back'}
                    </h2>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                            <input
                                className="input-field bg-slate-900/50 border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-lg text-sm"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                required={true}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                            <input
                                className="input-field bg-slate-900/50 border-slate-700 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-lg text-sm"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                required={true}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn-primary w-full py-2.5 text-sm font-semibold rounded-lg shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                isSignUp ? 'Sign Up' : 'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
                        <p className="text-sm text-slate-500">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                className="ml-2 text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-600 mt-8">
                    {'By continuing, you agree to our Terms of Service and Privacy Policy.'}
                </p>

            </div>
        </div>
    )
}
