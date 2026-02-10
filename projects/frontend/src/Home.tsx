
// src/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import AppCalls from './components/AppCalls'
import SendAlgo from './components/SendAlgo'
import MintNFT from './components/MintNFT'
import CreateASA from './components/CreateASA'
import AssetOptIn from './components/AssetOptIn'
import Bank from './components/Bank'
import GPURental from './components/GPURental'

const Home: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [sendAlgoModal, setSendAlgoModal] = useState<boolean>(false)
  const [mintNftModal, setMintNftModal] = useState<boolean>(false)
  const [createAsaModal, setCreateAsaModal] = useState<boolean>(false)
  const [assetOptInModal, setAssetOptInModal] = useState<boolean>(false)
  const [bankModal, setBankModal] = useState<boolean>(false)

  const [activeTab, setActiveTab] = useState<'marketplace' | 'pools' | 'gpu'>('marketplace')
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)

  return (
    <div className="dark text-slate-300 min-h-screen relative overflow-x-hidden antialiased bg-background-dark font-display selection:bg-primary/30">

      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-3/4 h-3/4 glow-indigo"></div>
        <div className="absolute bottom-0 left-0 w-3/4 h-3/4 glow-violet"></div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-border-dark bg-black/80 backdrop-blur-md px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-primary/20 border border-primary/40 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">terminal</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white font-mono">SkillSwap<span className="text-slate-600">_Dev</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[12px] font-medium text-slate-400">
            <button onClick={() => setActiveTab('marketplace')} className={`transition-colors ${activeTab === 'marketplace' ? 'text-white' : 'hover:text-white'}`}>Marketplace</button>
            <button onClick={() => setActiveTab('pools')} className={`transition-colors ${activeTab === 'pools' ? 'text-white' : 'hover:text-white'}`}>Compute Pools</button>
            <button onClick={() => setActiveTab('gpu')} className={`transition-colors ${activeTab === 'gpu' ? 'text-white' : 'hover:text-white'}`}>GPU Rental</button>
            <button className="hover:text-white transition-colors">Telemetry</button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => import('./utils/supabaseClient').then(({ supabase }) => supabase.auth.signOut())}
              className="hidden md:block text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors mr-2 font-mono"
            >
              Sign Out
            </button>
            <button
              onClick={toggleWalletModal}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded text-[11px] font-medium hover:bg-white/10 transition-all text-slate-300"
            >
              {activeAddress ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-mono">{activeAddress.substring(0, 4)}...{activeAddress.substring(activeAddress.length - 4)}</span>
                </>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 pt-6 pb-12">
        {activeTab === 'marketplace' && (
          <>
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-6 border-b border-border-dark pb-6">
              <div className="max-w-2xl">
                <h1 className="text-xl font-semibold tracking-tight text-white mb-1 flex items-center gap-2">
                  Peer-to-Peer Task Escrow
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">v2.1.0</span>
                </h1>
                <p className="text-slate-500 text-xs font-mono">
                  Secure pool funding via Algorand smart contracts. Autonomous release on verification.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className="px-4 py-2 bg-transparent border border-white/10 text-slate-300 text-xs font-medium rounded hover:bg-white/5 transition-colors">
                  Browse Tasks
                </button>
                <button onClick={() => setBankModal(true)} className="px-4 py-2 bg-white text-black text-xs font-semibold rounded hover:bg-slate-200 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Create Pool
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="w-full lg:w-60 shrink-0">
                <div className="sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Filters
                    </h2>
                    <button className="text-[10px] text-primary hover:text-primary/80">Reset</button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600 text-sm">search</span>
                        <input className="w-full bg-black border border-border-dark rounded pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-slate-700 text-slate-300 font-mono" placeholder="Search tasks..." type="text" />
                      </div>
                    </div>
                    <div className="border-t border-border-dark pt-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block font-mono">Tech Stack</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input className="w-3 h-3 rounded border-white/20 text-primary focus:ring-offset-0 focus:ring-0 bg-black" type="checkbox" />
                          <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">Rust / WASM</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input defaultChecked className="w-3 h-3 rounded border-white/20 text-primary focus:ring-offset-0 focus:ring-0 bg-black" type="checkbox" />
                          <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">PyTeal</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input className="w-3 h-3 rounded border-white/20 text-primary focus:ring-offset-0 focus:ring-0 bg-black" type="checkbox" />
                          <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">Reach</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input className="w-3 h-3 rounded border-white/20 text-primary focus:ring-offset-0 focus:ring-0 bg-black" type="checkbox" />
                          <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">React / TS</span>
                        </label>
                      </div>
                    </div>
                    <div className="border-t border-border-dark pt-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block font-mono">Budget (ALGO)</label>
                      <div className="space-y-3">
                        <input className="w-full accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" max="10000" min="0" type="range" />
                        <div className="flex gap-2 font-mono">
                          <div className="w-1/2 bg-black border border-border-dark rounded px-2 py-1 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Min</span>
                            <span className="text-white">0</span>
                          </div>
                          <div className="w-1/2 bg-black border border-border-dark rounded px-2 py-1 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Max</span>
                            <span className="text-white">10k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border-dark pt-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block font-mono">Type</label>
                      <div className="space-y-1">
                        <button className="w-full text-left px-2 py-1.5 text-[11px] text-white bg-white/5 rounded border border-white/10 flex justify-between items-center group">
                          Smart Contract
                          <span className="text-[9px] text-slate-500 group-hover:text-white">12</span>
                        </button>
                        <button className="w-full text-left px-2 py-1.5 text-[11px] text-slate-400 hover:text-white hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all flex justify-between items-center group">
                          Frontend
                          <span className="text-[9px] text-slate-600 group-hover:text-slate-400">8</span>
                        </button>
                        <button className="w-full text-left px-2 py-1.5 text-[11px] text-slate-400 hover:text-white hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all flex justify-between items-center group">
                          GPU Compute
                          <span className="text-[9px] text-slate-600 group-hover:text-slate-400">5</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                  <div className="bg-black border border-border-dark p-5 rounded-lg flex flex-col hover:border-primary/50 hover:bg-white/[0.02] transition-all duration-200 group relative shadow-sm hover:shadow-md cursor-pointer" onClick={() => setBankModal(true)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">ID: #8291</span>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors leading-tight mb-1">
                        React Query Optimization for Data Stream
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mb-2">Use case: Real-time dashboard performance</p>
                      <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">
                        Refactor existing fetch hooks to implement optimistic updates and infinite scrolling for the transaction feed.
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between py-3 border-t border-border-dark mb-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Budget</span>
                          <span className="text-xs font-mono text-white">150 ALGO</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Est. Duration</span>
                          <span className="text-xs font-mono text-slate-300">~2 Days</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Type</span>
                          <span className="text-xs font-mono text-slate-300">Frontend</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">React</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">TypeScript</span>
                        <div className="ml-auto">
                          <span className="text-[10px] text-slate-600 flex items-center gap-1 font-mono">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 2h ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black border border-border-dark p-5 rounded-lg flex flex-col hover:border-primary/50 hover:bg-white/[0.02] transition-all duration-200 group relative shadow-sm hover:shadow-md cursor-pointer" onClick={() => setBankModal(true)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">ID: #8294</span>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors leading-tight mb-1">
                        PyTeal Escrow Smart Contract Audit
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mb-2">Use case: Security verification for DeFi pool</p>
                      <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">
                        Comprehensive audit of TEAL bytecode logic to prevent re-entrancy attacks and ensure proper state management.
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between py-3 border-t border-border-dark mb-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Budget</span>
                          <span className="text-xs font-mono text-white">300 ALGO</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Est. Duration</span>
                          <span className="text-xs font-mono text-slate-300">~1 Week</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Type</span>
                          <span className="text-xs font-mono text-slate-300">Security</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">PyTeal</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">Algorand</span>
                        <div className="ml-auto">
                          <span className="text-[10px] text-slate-600 flex items-center gap-1 font-mono">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 5h ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black border border-border-dark p-5 rounded-lg flex flex-col hover:border-primary/50 hover:bg-white/[0.02] transition-all duration-200 group relative shadow-sm hover:shadow-md cursor-pointer" onClick={() => setBankModal(true)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20"></span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">ID: #8288</span>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors leading-tight mb-1">
                        Landing Page CSS-to-Tailwind Refactor
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mb-2">Use case: Maintainability improvement</p>
                      <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">
                        Migrate legacy CSS stylesheets to utility-first Tailwind classes while maintaining exact pixel fidelity.
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between py-3 border-t border-border-dark mb-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Budget</span>
                          <span className="text-xs font-mono text-white">50 ALGO</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Est. Duration</span>
                          <span className="text-xs font-mono text-slate-300">~1 Day</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Type</span>
                          <span className="text-xs font-mono text-slate-300">Frontend</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">Tailwind</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">HTML</span>
                        <div className="ml-auto">
                          <span className="text-[10px] text-slate-600 flex items-center gap-1 font-mono">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 1d ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black border border-border-dark p-5 rounded-lg flex flex-col hover:border-primary/50 hover:bg-white/[0.02] transition-all duration-200 group relative shadow-sm hover:shadow-md cursor-pointer" onClick={() => setBankModal(true)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">ID: #8301</span>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors leading-tight mb-1">
                        GPU Job Scheduler for Model Training
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mb-2">Use case: Training computer vision model</p>
                      <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-white/10 pl-3">
                        Implement a decentralized resource allocator to distribute compute loads across available GPU nodes.
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between py-3 border-t border-border-dark mb-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Budget</span>
                          <span className="text-xs font-mono text-white">450 ALGO</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Est. Duration</span>
                          <span className="text-xs font-mono text-slate-300">~5 Days</span>
                        </div>
                        <div className="h-6 w-px bg-border-dark"></div>
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] text-slate-600 uppercase font-bold tracking-wider">Type</span>
                          <span className="text-xs font-mono text-slate-300">Backend</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">Python</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-500 font-mono">CUDA</span>
                        <div className="ml-auto">
                          <span className="text-[10px] text-slate-600 flex items-center gap-1 font-mono">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> 1h ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-8 flex items-center justify-end gap-2 border-t border-border-dark pt-4">
                  <span className="text-[11px] text-slate-500 mr-4 font-mono">Page 1 of 12</span>
                  <button className="w-7 h-7 rounded flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors text-slate-400">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="w-7 h-7 rounded flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors text-slate-400">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Other Tabs */}
        {activeTab === 'pools' && (
            <div className="animate-fade-in text-white pt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Active Contract Card */}
                    <div className="bg-black border border-border-dark p-6 flex flex-col rounded-lg hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active Contract</span>
                            <span className="text-slate-500 font-mono text-xs">#8291</span>
                        </div>
                        <h3 className="text-base font-medium text-slate-100 mb-1">Fix Login Auth Bug</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">Backend authentication service failing.</p>

                        <div className="mt-auto">
                            <div className="flex justify-between text-xs mb-2 uppercase tracking-wide font-medium">
                                <span className="text-slate-500">Funded</span>
                                <span className="text-slate-300 font-mono">450 / 600 ALGO</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>

                            <button onClick={() => setBankModal(true)} className="w-full py-2 bg-transparent border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-sm font-medium rounded transition-colors">Manage Pool</button>
                        </div>
                    </div>

                    <div className="bg-black border border-dashed border-border-dark p-6 flex flex-col items-center justify-center text-center hover:bg-slate-800/30 cursor-pointer transition-colors min-h-[250px] rounded-lg group" onClick={() => setBankModal(true)}>
                        <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-3 group-hover:bg-slate-800 transition-colors">
                             <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-white">add</span>
                        </div>
                        <span className="text-slate-400 font-medium text-sm group-hover:text-slate-200">Create New Pool</span>
                    </div>
                </div>
            </div>
        )}
        {activeTab === 'gpu' && (
          <div className="animate-fade-in text-white p-4">
            <GPURental />
          </div>
        )}

      </main>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
      <SendAlgo openModal={sendAlgoModal} closeModal={() => setSendAlgoModal(false)} />
      <MintNFT openModal={mintNftModal} closeModal={() => setMintNftModal(false)} />
      <CreateASA openModal={createAsaModal} closeModal={() => setCreateAsaModal(false)} />
      <AssetOptIn openModal={assetOptInModal} closeModal={() => setAssetOptInModal(false)} />
      <Bank openModal={bankModal} closeModal={() => setBankModal(false)} />
    </div>
  )
}

export default Home
