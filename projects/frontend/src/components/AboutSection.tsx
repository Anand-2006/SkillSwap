import React from 'react'

const AboutSection: React.FC = () => {
    return (
        <div className="space-y-32 py-16 custom-scrollbar overflow-y-auto max-h-[calc(100vh-100px)] px-2">

            {/* 1. Hero: The Student Manifesto */}
            <section className="text-center space-y-8 max-w-5xl mx-auto px-6 relative">
                <div className="space-y-4">
                    <span className="inline-block px-4 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-indigo-400 tracking-widest uppercase font-mono">Documentation/Manifesto</span>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-zinc-50">
                        Zero Drama. <br />Pure Skill.
                    </h1>
                </div>
                <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-tight max-w-2xl mx-auto">
                    We're ending the era of awkward bank transfers and <span className="text-zinc-50 border-b-2 border-indigo-600/50">"I'll pay you after the event"</span> excuses.
                </p>
                <div className="flex justify-center gap-3 pt-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-500 text-[10px] font-bold uppercase tracking-widest font-mono">
                        <span className="material-symbols-outlined text-sm">bolt</span> Auto-Escrow
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-indigo-400 text-[10px] font-bold uppercase tracking-widest font-mono">
                        <span className="material-symbols-outlined text-sm">shield</span> Fraud-Proof
                    </div>
                </div>
            </section>

            {/* 2. Campus Friction vs. SkillSwap (Modern UI Comparison) */}
            <section className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 rounded-md overflow-hidden">
                    {/* Scenario A: The Status Quo */}
                    <div className="bg-zinc-950 p-12 relative group grayscale">
                        <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 font-bold text-zinc-700 font-mono">01</div>
                        <h3 className="text-2xl font-bold text-zinc-500 mb-8 tracking-tighter uppercase">The Campus Struggle</h3>
                        <ul className="space-y-6">
                            {[
                                { icon: 'chat_error', text: 'Chasing club treasurers for event payment for 3 weeks.' },
                                { icon: 'account_balance', text: '"My bank server is down," or "I forgot my card."' },
                                { icon: 'history_edu', text: 'No proof of work except some sketchy group chat screenshots.' }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="material-symbols-outlined text-zinc-700">{item.icon}</span>
                                    <p className="text-zinc-600 font-medium leading-relaxed text-sm">{item.text}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-12 pt-8 border-t border-zinc-900 flex items-center gap-3 text-red-900 text-[10px] font-bold uppercase tracking-widest font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-900"></span> HIGH FRICTION / LOW TRUST
                        </div>
                    </div>

                    {/* Scenario B: SkillSwap */}
                    <div className="bg-zinc-900 p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 font-bold text-indigo-500 font-mono">02</div>
                        <h3 className="text-2xl font-bold text-zinc-50 mb-8 tracking-tighter uppercase flex items-center gap-3">
                            The SkillSwap Era
                            <span className="badge-solid bg-indigo-600 text-white font-mono">STABLE</span>
                        </h3>

                        <ul className="space-y-6 relative z-10">
                            {[
                                { icon: 'verified_user', text: 'ALGO is locked in Escrow before you even start the design.' },
                                { icon: 'rocket_launch', text: 'Instant payout the moment the club approves your task.' },
                                { icon: 'terminal', text: 'Blockchain-verified portfolio entry for every completed job.' }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start translate-x-0 hover:translate-x-1 transition-transform">
                                    <span className="material-symbols-outlined text-indigo-500">{item.icon}</span>
                                    <p className="text-zinc-300 font-semibold leading-relaxed text-sm">{item.text}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12 pt-8 border-t border-zinc-800 flex items-center gap-3 text-emerald-500 text-[10px] font-bold uppercase tracking-widest font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ALGORAND SMART CONTRACTS ACTIVE
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The Tech Deep-Dive (Visual & Interactive) */}
            <section className="max-w-6xl mx-auto px-6">
                <div className="bg-zinc-900 border border-zinc-800 p-16 relative overflow-hidden text-center lg:text-left rounded-md">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-4xl font-bold text-zinc-50 tracking-tighter leading-none">
                                How we protect your <br />
                                <span className="text-indigo-500">Grind.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                                We use Algorand's layer-1 smart contracts to create a decentralized "Vault."
                                When a task is posted, the ALGO is physically removed from the budget and held in cryptographic escrow.
                                It's mathematically impossible for the requester to run away with your work.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Transparent', 'Immutable', 'Instant', 'Cheap'].map(tag => (
                                    <span key={tag} className="badge-solid font-mono">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 rounded-md space-y-8 relative">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">Architecture Ledger</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-sm border border-zinc-800">
                                    <div className="w-10 h-10 rounded-sm bg-indigo-600 flex items-center justify-center font-bold text-white font-mono">01</div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold uppercase text-zinc-50 tracking-widest font-mono">Funds Locked</p>
                                        <p className="text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-widest">TXN: A482...Z91</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-sm border border-zinc-800/50">
                                    <div className="w-10 h-10 rounded-sm bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 font-mono">02</div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest font-mono">Work Uploaded</p>
                                        <p className="text-[9px] font-mono text-zinc-800 font-bold tracking-widest">READY</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-zinc-900/30 p-4 rounded-sm border border-zinc-800/30">
                                    <div className="w-10 h-10 rounded-sm bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 font-mono">03</div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold uppercase text-zinc-700 tracking-widest font-mono">Verify & Release</p>
                                        <p className="text-[9px] font-mono text-zinc-900 font-bold tracking-widest">PENDING</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Campus Use Cases (The "Relatable" Section) */}
            <section className="max-w-6xl mx-auto px-6 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-zinc-50 tracking-tighter uppercase">Where SkillSwap Shines</h2>
                    <p className="text-zinc-500 font-bold font-mono text-xs tracking-widest uppercase">Real scenarios. Real solutions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-md transition-colors relative group">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <span className="material-symbols-outlined text-7xl text-zinc-100">campaign</span>
                        </div>
                        <h4 className="text-xl font-bold text-zinc-50 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-sm bg-indigo-600 flex items-center justify-center text-white text-sm font-bold font-mono">01</span>
                            Club Event Media
                        </h4>
                        <p className="text-zinc-500 leading-relaxed text-sm mb-6">
                            "The Cultural Club needs 100 photos edited by tonight. Instead of waiting for the treasurer to 'confirm' the budget, the ALGO is already in the smart contract. Work submitted? Funds released. Simple."
                        </p>
                        <div className="flex gap-2">
                            <span className="badge-solid font-mono">Instant Trust</span>
                            <span className="badge-solid font-mono">No Invoicing</span>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-md transition-colors relative group">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <span className="material-symbols-outlined text-7xl text-zinc-100">construction</span>
                        </div>
                        <h4 className="text-xl font-bold text-zinc-50 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-sm bg-indigo-600 flex items-center justify-center text-white text-sm font-bold font-mono">02</span>
                            Tech Support Gigs
                        </h4>
                        <p className="text-zinc-500 leading-relaxed text-sm mb-6">
                            "Need help debugging a React project or setting up a personal portfolio? Post a task, fund it with ALGO, and let a senior from the CSE department solve it. Peer-to-peer knowledge transfer, decentralized."
                        </p>
                        <div className="flex gap-2">
                            <span className="badge-solid font-mono">Peer-to-Peer</span>
                            <span className="badge-solid font-mono">Verifiable Skill</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Why it's for Students */}
            <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Resume Buff', desc: 'Every ALGO you earn is verifiable proof of professional contribution for recruiters.', icon: 'star' },
                    { title: 'Low Barrier', desc: 'No complex registration. Just connect your Pera or Defly wallet and start bidding.', icon: 'account_balance_wallet' },
                    { title: 'Global Reach', desc: 'Earn for tasks from clubs across campus, or even other universities.', icon: 'public' }
                ].map((card, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 p-10 rounded-md hover:border-indigo-600/50 transition-all">
                        <span className="material-symbols-outlined text-indigo-500 mb-6 text-3xl">{card.icon}</span>
                        <h4 className="text-xl font-bold text-zinc-50 mb-3 tracking-tight">{card.title}</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">{card.desc}</p>
                    </div>
                ))}
            </section>

            {/* 6. Footer: Hackathon Vibes */}
            <footer className="pt-24 pb-12 text-center border-t border-zinc-800 relative mx-6 overflow-hidden">
                <div className="max-w-2xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">Build Version 2.0.4 - Hackathon Stable</p>
                        <h4 className="text-6xl font-black text-zinc-50 tracking-tighter">ALGO IMPACT 2026</h4>
                        <p className="text-zinc-600 font-mono text-xs max-w-sm mx-auto font-bold uppercase tracking-widest">
                            TypeScript // Algorand SDK // Student Built
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default AboutSection
