// src/components/TaskMarketplace.tsx
import React, { useState } from 'react'

interface Task {
    id: string
    title: string
    description: string
    bounty: number
    tags: string[]
    difficulty: 'Easy' | 'Medium' | 'Hard'
}

const SAMPLE_TASKS: Task[] = [
    {
        id: '101',
        title: 'Integrate Algorand Wallet Connect',
        description: 'Implement WalletConnect v2 for mobile wallet support in our dApp.',
        bounty: 150,
        tags: ['React', 'Web3', 'Mobile'],
        difficulty: 'Medium',
    },
    {
        id: '102',
        title: 'Fix Staking Contract Bug',
        description: 'Investigate and fix the reward calculation error in the staking smart contract.',
        bounty: 500,
        tags: ['Teal', 'Smart Contract', 'Security'],
        difficulty: 'Hard',
    },
    {
        id: '103',
        title: 'Design Landing Page Hero',
        description: 'Create a responsive hero section with 3D elements using Three.js.',
        bounty: 80,
        tags: ['UI/UX', 'Three.js', 'Tailwind'],
        difficulty: 'Easy',
    },
    {
        id: '104',
        title: 'Optimize API Response Time',
        description: 'Refactor Node.js backend to improve data fetching speed by 50%.',
        bounty: 200,
        tags: ['Node.js', 'Backend', 'Performance'],
        difficulty: 'Medium',
    },
    {
        id: '105',
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        bounty: 120,
        tags: ['DevOps', 'GitHub Actions'],
        difficulty: 'Medium',
    },
]

const TaskMarketplace: React.FC = () => {
    const [filter, setFilter] = useState('All')

    return (
        <div>
            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-slate-800/50">
                {['All', 'Frontend', 'Backend', 'Smart Contract', 'Design'].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setFilter(tag)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === tag
                            ? 'bg-slate-100/10 text-slate-100 border border-slate-700'
                            : 'bg-transparent text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_TASKS.map((task) => (
                    <div key={task.id} className="card-premium p-6 flex flex-col h-full group relative overflow-hidden">
                        {/* Subtle Glow Effect on Hover (Optional, kept minimal) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="badge-emerald">{task.bounty} ALGO</span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm border ${task.difficulty === 'Easy' ? 'border-emerald-500/20 text-emerald-500' :
                                task.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-500' :
                                    'border-red-500/20 text-red-500'
                                }`}>
                                {task.difficulty}
                            </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors relative z-10">{task.title}</h3>
                        <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow leading-relaxed relative z-10">
                            {task.description}
                        </p>

                        <div className="pt-4 border-t border-slate-700/50 mt-auto relative z-10">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {task.tags.map((tag) => (
                                    <span key={tag} className="text-[10px] text-slate-400 bg-slate-800/50 border border-slate-700/50 px-2 py-1 rounded">#{tag}</span>
                                ))}
                            </div>
                            <button className="btn-secondary w-full text-xs group-hover:border-slate-500 group-hover:text-slate-100">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Task Teaser */}
                <div className="card-premium border-dashed border-slate-700/50 bg-transparent p-6 flex flex-col items-center justify-center text-center hover:bg-slate-800/30 cursor-pointer transition-colors min-h-[300px] group">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 group-hover:bg-slate-700 transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h3 className="text-slate-300 font-medium mb-1">Post a Job</h3>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Need help? Create a bounty and get top talent to work on your project.</p>
                </div>
            </div>
        </div>
    )
}

export default TaskMarketplace
