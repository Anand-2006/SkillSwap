
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
import AboutSection from './components/AboutSection'

const Home: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [bankModal, setBankModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [sendAlgoModal, setSendAlgoModal] = useState<boolean>(false)
  const [mintNftModal, setMintNftModal] = useState<boolean>(false)
  const [createAsaModal, setCreateAsaModal] = useState<boolean>(false)
  const [assetOptInModal, setAssetOptInModal] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'marketplace' | 'pools' | 'gpu' | 'about'>('marketplace')

  // Proposed Escrow state for pre-filling the Bank modal
  const [proposedEscrow, setProposedEscrow] = useState<{ amount: string; memo: string; receiver?: string } | null>(null)

  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStacks, setSelectedStacks] = useState<string[]>([])
  const [budgetRange, setBudgetRange] = useState(50)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const { activeAddress } = useWallet()

  const handleTelemetry = () => {
    import('notistack').then(({ enqueueSnackbar }) => {
      enqueueSnackbar('Telemetry stream synchronized. Network latency: 42ms', { variant: 'info' })
    })
  }

  const scrollToMarket = () => {
    document.getElementById('task-grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  const tasks = [
    {
      id: '#T001',
      title: 'Fix Website UI + Mobile Responsiveness',
      useCase: 'Improve accessibility and mobile UX',
      description: 'Clean up layout issues, fix spacing/overflow bugs, and make key pages responsive on mobile devices.',
      budget: 12,
      duration: '~1-2 Days',
      type: 'Frontend',
      tech: ['React', 'CSS', 'Tailwind'],
      status: 'active',
      postedAt: '1h ago'
    },
    {
      id: '#T002',
      title: 'Debug CORS Issue in Node.js Backend',
      useCase: 'Fix API communication errors',
      description: 'Identify and fix CORS errors between frontend and backend; ensure proper headers and environment handling.',
      budget: 18,
      duration: '~1 Day',
      type: 'Backend',
      tech: ['Node.js', 'Express'],
      status: 'active',
      postedAt: '3h ago'
    },
    {
      id: '#T003',
      title: 'Scrape Data and Export to CSV',
      useCase: 'Data collection for research',
      description: 'Build a scraper that collects structured data, removes duplicates, and exports a cleaned CSV file.',
      budget: 20,
      duration: '~2 Days',
      type: 'Automation',
      tech: ['Python', 'BeautifulSoup'],
      status: 'active',
      postedAt: '5h ago'
    },
    {
      id: '#T004',
      title: 'Add Role-Based Access Control',
      useCase: 'Enhance application security',
      description: 'Implement admin/user roles and protect routes or APIs accordingly in the existing web application.',
      budget: 28,
      duration: '~2-3 Days',
      type: 'Full Stack',
      tech: ['SQL', 'Auth'],
      status: 'active',
      postedAt: '2h ago'
    },
    {
      id: '#T005',
      title: 'Optimize Slow API Endpoint',
      useCase: 'Performance benchmarking',
      description: 'Profile a slow API, improve database queries or caching (Redis/Postgres), and reduce response time.',
      budget: 25,
      duration: '~2 Days',
      type: 'Backend',
      tech: ['Postgres', 'Redis'],
      status: 'active',
      postedAt: '4h ago'
    },
    {
      id: '#T006',
      title: 'Implement Real-Time Updates',
      useCase: 'Live dashboard functionality',
      description: 'Add live updates to a dashboard or chat-like feature using WebSockets or polling.',
      budget: 30,
      duration: '~3 Days',
      type: 'Full Stack',
      tech: ['Socket.io', 'Node.js'],
      status: 'active',
      postedAt: '6h ago'
    },
    {
      id: '#T007',
      title: 'Deploy Full Stack App to VPS',
      useCase: 'Production environment setup',
      description: 'Set up backend, frontend build, environment variables, and reverse proxy (Nginx or similar).',
      budget: 26,
      duration: '~2 Days',
      type: 'DevOps',
      tech: ['Docker', 'Nginx', 'Cloud'],
      status: 'active',
      postedAt: '1d ago'
    },
    {
      id: '#T008',
      title: 'Build Admin Dashboard',
      useCase: 'Internal data management',
      description: 'Create a simple dashboard to view users/data and perform basic administrative actions.',
      budget: 35,
      duration: '~3-4 Days',
      type: 'Full Stack',
      tech: ['Next.js', 'Tailwind'],
      status: 'active',
      postedAt: '2d ago'
    },
    {
      id: '#T009',
      title: 'Write Unit Tests for Backend',
      useCase: 'Code quality assurance',
      description: 'Add meaningful tests (Jest/Supertest) for existing APIs and fix failing test cases.',
      budget: 22,
      duration: '~2 Days',
      type: 'Backend',
      tech: ['Jest', 'Testing'],
      status: 'active',
      postedAt: '3d ago'
    },
    {
      id: '#T010',
      title: 'Implement File Upload + Storage',
      useCase: 'User content management',
      description: 'Add file upload feature with validation and storage (S3 or local cloud bucket).',
      budget: 28,
      duration: '~2-3 Days',
      type: 'Full Stack',
      tech: ['Node.js', 'S3'],
      status: 'active',
      postedAt: '4d ago'
    },
    {
      id: '#T011',
      title: 'Auditorium Event Arrangements',
      useCase: 'Campus event logistics',
      description: 'Assist in stage setup, seating arrangement, and coordination before event start.',
      budget: 24,
      duration: '4-6 Hours',
      type: 'Campus',
      tech: ['Logistics', 'Events'],
      status: 'active',
      postedAt: '2h ago'
    },
    {
      id: '#T012',
      title: 'Design Posters for Club Event',
      useCase: 'Creative marketing assets',
      description: 'Create 2–3 posters for social media and print using Canva or Figma.',
      budget: 18,
      duration: '~1-2 Days',
      type: 'Design',
      tech: ['Figma', 'Creative'],
      status: 'active',
      postedAt: '5h ago'
    },
    {
      id: '#T013',
      title: 'Manage Registration Desk',
      useCase: 'Event attendee check-in',
      description: 'Handle attendee check-in and maintain list or QR scanning during the event.',
      budget: 20,
      duration: '3-5 Hours',
      type: 'Campus',
      tech: ['Organization', 'QR'],
      status: 'active',
      postedAt: '1d ago'
    },
    {
      id: '#T014',
      title: 'Photography for College Event',
      useCase: 'Media coverage and highlights',
      description: 'Capture photos during the event and share edited highlights for the gallery.',
      budget: 30,
      duration: '~1 Day',
      type: 'Media',
      tech: ['Editing', 'Media'],
      status: 'active',
      postedAt: '2d ago'
    },
    {
      id: '#T015',
      title: 'Decorate Seminar Hall',
      useCase: 'Venue preparation',
      description: 'Help with banners, lights, and table arrangement before the club activity starts.',
      budget: 22,
      duration: '3-4 Hours',
      type: 'Campus',
      tech: ['Layout', 'Design'],
      status: 'active',
      postedAt: '3h ago'
    },
    {
      id: '#T016',
      title: 'Build Simple Attendance Tracker',
      useCase: 'Club administration tools',
      description: 'Web or spreadsheet-based tool to track attendance automatically for club members.',
      budget: 26,
      duration: '~2-3 Days',
      type: 'Tools',
      tech: ['Sheets', 'Automation'],
      status: 'active',
      postedAt: '1h ago'
    },
    {
      id: '#T017',
      title: 'Convert Google Sheet to Web Tool',
      useCase: 'Workflow optimization',
      description: 'Turn a manual sheet-based process into a small form + dashboard web application.',
      budget: 34,
      duration: '~3-4 Days',
      type: 'Full Stack',
      tech: ['React', 'API'],
      status: 'active',
      postedAt: '4h ago'
    },
    {
      id: '#T018',
      title: 'Automate Form Notifications',
      useCase: 'Communication automation',
      description: 'Trigger email or WhatsApp messages when new form submissions happen.',
      budget: 24,
      duration: '~2 Days',
      type: 'Automation',
      tech: ['Twilio', 'Zapier'],
      status: 'active',
      postedAt: '5h ago'
    }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStack = selectedStacks.length === 0 || selectedStacks.some(s => task.tech.includes(s))
    const matchesBudget = task.budget <= budgetRange
    const matchesType = !selectedType || task.type === selectedType
    return matchesSearch && matchesStack && matchesBudget && matchesType
  })

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedStacks([])
    setBudgetRange(50)
    setSelectedType(null)
  }

  const toggleStack = (stack: string) => {
    setSelectedStacks(prev =>
      prev.includes(stack) ? prev.filter(s => s !== stack) : [...prev, stack]
    )
  }

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)

  const handleHireAgent = (task: any) => {
    setProposedEscrow({
      amount: task.budget.toString(),
      memo: task.id
    })
    setBankModal(true)
  }

  const handleInitEscrow = () => {
    setProposedEscrow(null)
    setBankModal(true)
  }

  return (
    <div className="dark text-zinc-400 min-h-screen relative antialiased bg-zinc-950 font-sans selection:bg-indigo-500/30">

      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('marketplace')}>
            <div className="w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-500 text-xl">terminal</span>
            </div>
            <span className="text-base font-bold tracking-tight text-white font-mono">SkillSwap<span className="text-indigo-400">.io</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[12px] font-medium text-zinc-400">
            <button onClick={() => setActiveTab('marketplace')} className={`relative py-1 transition-all ${activeTab === 'marketplace' ? 'text-white' : 'hover:text-white'}`}>
              Marketplace
              {activeTab === 'marketplace' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>}
            </button>
            <button onClick={() => setActiveTab('pools')} className={`relative py-1 transition-all ${activeTab === 'pools' ? 'text-white' : 'hover:text-white'}`}>
              Compute Pools
              {activeTab === 'pools' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>}
            </button>
            <button onClick={() => setActiveTab('gpu')} className={`relative py-1 transition-all ${activeTab === 'gpu' ? 'text-white' : 'hover:text-white'}`}>
              GPU Rental
              {activeTab === 'gpu' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>}
            </button>
            <button onClick={() => setActiveTab('about')} className={`relative py-1 transition-all ${activeTab === 'about' ? 'text-white' : 'hover:text-white'}`}>
              About
              {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"></span>}
            </button>
            <button onClick={handleTelemetry} className="hover:text-white transition-colors">Telemetry</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn-ghost text-zinc-500 hover:text-indigo-500 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-xl">settings</span>
              </label>
              <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-sm bg-zinc-950 border border-zinc-800 rounded-md w-52 mt-4">
                <li><button onClick={() => setMintNftModal(true)} className="text-xs font-mono py-3 hover:bg-zinc-900 rounded-sm">Mint Artifact</button></li>
                <li><button onClick={() => setCreateAsaModal(true)} className="text-xs font-mono py-3 hover:bg-zinc-900 rounded-sm">Create ASA</button></li>
                <li><button onClick={() => setAssetOptInModal(true)} className="text-xs font-mono py-3 hover:bg-zinc-900 rounded-sm">Asset Opt-In</button></li>
                <li><button onClick={() => setAppCallsDemoModal(true)} className="text-xs font-mono py-3 hover:bg-zinc-900 rounded-sm">App Registry</button></li>
                <li><button onClick={() => setSendAlgoModal(true)} className="text-xs font-mono py-3 hover:bg-zinc-900 rounded-sm text-emerald-500 font-bold">Fast Payment</button></li>
              </ul>
            </div>
            <button
              onClick={toggleWalletModal}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-md text-xs font-bold hover:bg-zinc-800 transition-all text-white shadow-sm"
            >
              {activeAddress ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono">{activeAddress.substring(0, 6)}...{activeAddress.substring(activeAddress.length - 4)}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 pt-8 pb-12">
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'marketplace' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10 pb-8 border-b border-zinc-800">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold tracking-tighter text-zinc-50 mb-2 flex items-center gap-3">
                    PEER TASK ESCROW
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-mono border border-zinc-700 tracking-wider">V2.0-STABLE</span>
                  </h1>
                  <p className="text-zinc-500 text-sm font-medium max-w-xl leading-relaxed">
                    Deploy production-grade escrow contracts for decentralized collaboration.
                    <span className="text-indigo-400/80 ml-1">Autonomous release upon verification.</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={scrollToMarket} className="btn-outline">
                    Browse Tasks
                  </button>
                  <button onClick={handleInitEscrow} className="btn-premium flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    Create New Pool
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10">
                <aside className="w-full lg:w-64 shrink-0">
                  <div className="sticky top-24 space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Search Engine</h2>
                        {(searchTerm || selectedStacks.length > 0 || budgetRange < 50 || selectedType) && (
                          <button onClick={resetFilters} className="text-[10px] text-indigo-400 hover:underline font-bold uppercase tracking-widest">Reset</button>
                        )}
                      </div>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg transition-colors group-focus-within:text-indigo-500">search</span>
                        <input
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-10 pr-4 py-3 text-xs focus:border-indigo-600 outline-none transition-all placeholder:text-zinc-800 text-zinc-50 font-mono"
                          placeholder="Query tasks..."
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 block font-mono">Tech Stack</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['React', 'Node.js', 'Python', 'SQL', 'Tailwind', 'Automation', 'Figma', 'Cloud'].map(stack => (
                          <button
                            key={stack}
                            onClick={() => toggleStack(stack)}
                            className={`px-3 py-2 rounded-md text-[10px] font-mono transition-all border ${selectedStacks.includes(stack)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                              }`}
                          >
                            {stack}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Budget Cap</label>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold">{budgetRange} ALGO</span>
                      </div>
                      <input
                        className="w-full accent-indigo-600 h-1 bg-zinc-800 rounded-md appearance-none cursor-pointer"
                        max="100"
                        min="0"
                        step="1"
                        type="range"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 block font-mono">Project Type</label>
                      <div className="space-y-1">
                        {['Frontend', 'Backend', 'Full Stack', 'Automation', 'Campus', 'Design', 'Media'].map(type => (
                          <button
                            key={type}
                            onClick={() => setSelectedType(selectedType === type ? null : type)}
                            className={`w-full text-left px-3 py-2.5 text-[11px] font-semibold rounded-md transition-all flex justify-between items-center group ${selectedType === type
                              ? 'bg-zinc-800 text-zinc-50'
                              : 'bg-transparent text-zinc-500 hover:bg-zinc-900'
                              }`}
                          >
                            {type}
                            <span className={`text-[9px] font-mono ${selectedType === type ? 'text-zinc-400' : 'text-zinc-700'}`}>
                              {tasks.filter(t => t.type === type).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="flex-1" id="task-grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredTasks.length > 0 ? filteredTasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-zinc-900 border border-zinc-800 p-5 rounded-md flex flex-col hover:border-zinc-700 transition-all group relative cursor-pointer"
                        onClick={() => handleHireAgent(task)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${task.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">{task.status}</span>
                          </div>
                          <span className="text-[9px] font-mono text-zinc-600 font-bold tracking-widest uppercase">{task.id}</span>
                        </div>

                        <div className="mb-4">
                          <h3 className="text-sm font-bold text-zinc-50 group-hover:text-indigo-400 transition-colors leading-tight mb-2 line-clamp-2">
                            {task.title}
                          </h3>
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                            {task.description}
                          </p>
                        </div>

                        <div className="mt-auto">
                          <div className="grid grid-cols-3 gap-2 py-3 border-t border-zinc-800 mb-3">
                            <div>
                              <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Budget</p>
                              <p className="text-[11px] font-mono font-bold text-zinc-50 leading-none">{task.budget}</p>
                            </div>
                            <div className="border-x border-zinc-800 px-3">
                              <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Duration</p>
                              <p className="text-[11px] font-mono font-bold text-zinc-400 leading-none">{task.duration.split(' ')[0]}D</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Type</p>
                              <p className="text-[11px] font-mono font-bold text-indigo-400 leading-none truncate">{task.type.slice(0, 4)}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-1.5">
                              {task.tech.slice(0, 2).map(t => (
                                <span key={t} className="px-1.5 py-0.5 rounded-sm bg-zinc-800 text-[8px] text-zinc-400 font-bold uppercase tracking-widest">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <span className="text-[8px] text-zinc-600 font-mono font-bold uppercase tracking-wider">
                              {task.postedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-20 flex flex-col items-center justify-center border border-zinc-800 rounded-md bg-zinc-950">
                        <span className="material-symbols-outlined text-4xl text-zinc-800 mb-4 font-light">database_off</span>
                        <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest font-bold">No records found</p>
                        <button onClick={resetFilters} className="mt-4 text-[10px] text-indigo-500 font-bold uppercase tracking-widest hover:underline">Clear Filters</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pools' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-8 flex flex-col rounded-md hover:border-zinc-700 transition-all group overflow-hidden relative" onClick={() => handleHireAgent({ budget: 600, id: '#8291' })}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="badge-solid bg-emerald-900/40 text-emerald-400 border border-emerald-900/50">Active Node</span>
                    <span className="text-zinc-700 font-mono text-[10px] font-bold tracking-widest">REF: #8291</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-50 mb-2 tracking-tighter group-hover:text-indigo-400 transition-colors">Fix Login Auth Bug</h3>
                  <p className="text-sm text-zinc-500 mb-8 font-medium leading-relaxed italic">"Backend authentication service failing with intermittent 503 errors under load."</p>

                  <div className="mt-auto space-y-6">
                    <div>
                      <div className="flex justify-between text-[10px] mb-3 uppercase tracking-widest font-bold">
                        <span className="text-zinc-600">Funding Progress</span>
                        <span className="text-zinc-50 font-mono">450 <span className="text-zinc-700">/</span> 600</span>
                      </div>
                      <div className="w-full bg-zinc-950 rounded-full h-1 border border-zinc-800">
                        <div className="bg-indigo-600 h-1 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <button className="btn-premium w-full">
                      Enter Terminal
                    </button>
                  </div>
                </div>

                <div
                  className="bg-zinc-950 border-2 border-dashed border-zinc-800 p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer transition-all min-h-[300px] rounded-md group"
                  onClick={handleInitEscrow}
                >
                  <div className="w-12 h-12 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                    <span className="material-symbols-outlined text-zinc-600 text-2xl group-hover:text-white transition-colors">add</span>
                  </div>
                  <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest group-hover:text-white transition-all">Initialize New Node</span>
                  <p className="text-[10px] text-zinc-700 mt-2 font-mono font-bold uppercase tracking-widest">Allocate funds for execution</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gpu' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <GPURental onRent={(gpu) => handleHireAgent({ budget: gpu.pricePerHour, id: gpu.id })} />
            </div>
          )}

          {activeTab === 'about' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AboutSection />
            </div>
          )}
        </div>
      </main>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
      <SendAlgo openModal={sendAlgoModal} closeModal={() => setSendAlgoModal(false)} />
      <MintNFT openModal={mintNftModal} closeModal={() => setMintNftModal(false)} />
      <CreateASA openModal={createAsaModal} closeModal={() => setCreateAsaModal(false)} />
      <AssetOptIn openModal={assetOptInModal} closeModal={() => setAssetOptInModal(false)} />
      <Bank
        openModal={bankModal}
        closeModal={() => setBankModal(false)}
        initialAmount={proposedEscrow?.amount}
        initialMemo={proposedEscrow?.memo}
        initialReceiver={proposedEscrow?.receiver}
      />
    </div>
  )
}


export default Home
