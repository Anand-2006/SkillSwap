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
import TaskMarketplace from './components/TaskMarketplace'
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
    <div className="min-h-screen bg-[#0f172a] text-slate-400 overflow-x-hidden selection:bg-emerald-500/30 font-sans">

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 h-16 border-b border-slate-800/60 bg-[#0f172a]/90 backdrop-blur-md flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-slate-100 font-bold tracking-tight text-lg">SkillSwap</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {[
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'pools', label: 'My Pools' },
              { id: 'gpu', label: 'GPU Rental' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'text-emerald-400 bg-emerald-900/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => import('./utils/supabaseClient').then(({ supabase }) => supabase.auth.signOut())}
            className="hidden md:block text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors mr-2"
          >
            Sign Out
          </button>
          {activeAddress && (
            <div className="hidden md:flex items-center gap-4 mr-4">
              <button onClick={() => setCreateAsaModal(true)} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">New Asset</button>
              <button onClick={() => setMintNftModal(true)} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Mint NFT</button>
            </div>
          )}
          <button
            onClick={toggleWalletModal}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all border ${activeAddress
              ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'bg-emerald-600/90 text-white border-transparent hover:bg-emerald-600 shadow-sm'
              }`}
          >
            {activeAddress ? (
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="font-mono text-xs">{activeAddress.substring(0, 4)}...{activeAddress.substring(activeAddress.length - 4)}</span>
              </span>
            ) : 'Connect Wallet'}
          </button>
        </div>

      </nav>

      <main className="pt-28 pb-20 px-6 max-w-[1400px] mx-auto">

        {/* Header / Hero */}
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-3 tracking-tight">
              {activeTab === 'marketplace' && 'Peer-to-Peer Task Escrow'}
              {activeTab === 'pools' && 'Your Active Pools'}
              {activeTab === 'gpu' && 'Decentralized Compute'}
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
              {activeTab === 'marketplace' && 'Pool funds securely to hire developers. Smart contracts ensure payment is only released when code is verified.'}
              {activeTab === 'pools' && 'Monitor your active task contracts, manage deposits, and release payments to contributors.'}
              {activeTab === 'gpu' && 'Rent high-performance GPUs from verified students for AI training and rendering. Pay per minute in ALGO.'}
            </p>
          </div>

          <div className="flex gap-3">
            {activeTab === 'marketplace' && (
              <>
                <button className="btn-secondary" onClick={() => setBankModal(true)}>Create Pool</button>
                <button className="btn-primary" onClick={() => setActiveTab('marketplace')}>Browse Tasks</button>
              </>
            )}
            {activeTab === 'pools' && (
              <button className="btn-primary" onClick={() => setBankModal(true)}>+ New Pool</button>
            )}
            {activeTab === 'gpu' && (
              <button className="btn-primary">+ List My GPU</button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'marketplace' && <TaskMarketplace />}
          {activeTab === 'pools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Re-using Bank component as a modal for now, but displaying a card here representing an active pool */}
              <div className="card-premium p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="badge-emerald">Active Contract</span>
                  <span className="text-slate-500 font-mono text-xs">#8291</span>
                </div>
                <h3 className="text-base font-medium text-slate-100 mb-1">Fix Login Auth Bug</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">Backend authentication service failing on edge cases with Supabase integration.</p>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-2 uppercase tracking-wide font-medium">
                    <span className="text-slate-500">Funded</span>
                    <span className="text-slate-300 font-mono">450 / 600 ALGO</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>

                  <button onClick={() => setBankModal(true)} className="btn-secondary w-full text-sm">Manage Pool</button>
                </div>
              </div>

              <div className="card-premium p-6 border-dashed border-slate-700/50 bg-transparent flex flex-col items-center justify-center text-center hover:bg-slate-800/30 cursor-pointer transition-colors min-h-[250px]" onClick={() => setBankModal(true)}>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-slate-300 font-medium text-sm">Create New Pool</span>
              </div>
            </div>
          )}
          {activeTab === 'gpu' && <GPURental />}
        </div>

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
