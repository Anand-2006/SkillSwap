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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-4 border-b border-zinc-900">
                {['All', 'Frontend', 'Backend', 'Smart Contract', 'Design'].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setFilter(tag)}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${filter === tag
                            ? 'bg-zinc-800 text-zinc-50 border border-zinc-700'
                            : 'bg-transparent text-zinc-500 border border-transparent hover:text-zinc-300 hover:bg-zinc-900'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_TASKS.map((task) => (
                    <div key={task.id} className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col h-full group transition-all hover:border-zinc-700 rounded-md">
                        <div className="flex justify-between items-start mb-6">
                            <span className="badge-solid bg-indigo-600 text-white font-mono">{task.bounty} ALGO</span>
                            <span className={`text-[10px] uppercase font-bold tracking-widest font-mono ${task.difficulty === 'Easy' ? 'text-emerald-500' :
                                task.difficulty === 'Medium' ? 'text-amber-500' :
                                    'text-rose-500'
                                }`}>
                                {task.difficulty}
                            </span>
                        </div>

                        <h3 className="text-sm font-bold text-zinc-50 mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{task.title}</h3>
                        <p className="text-xs text-zinc-500 mb-8 line-clamp-3 leading-relaxed font-medium">
                            {task.description}
                        </p>

                        <div className="pt-6 border-t border-zinc-800 mt-auto">
                            <div className="flex flex-wrap gap-1.5 mb-6">
                                {task.tags.map((tag) => (
                                    <span key={tag} className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <button className="w-full py-2 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-sm border border-zinc-700 transition-all">
                                View Specification
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Task Teaser */}
                <div
                    className="border-2 border-dashed border-zinc-800 bg-transparent p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer transition-all min-h-[300px] group rounded-md"
                >
                    <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                        <span className="material-symbols-outlined text-zinc-600 text-2xl group-hover:text-white transition-colors">add</span>
                    </div>
                    <h3 className="text-zinc-300 font-bold text-xs uppercase tracking-widest group-hover:text-white transition-all">Post a Job</h3>
                    <p className="text-zinc-600 text-[10px] max-w-[200px] leading-relaxed mt-2 font-bold uppercase tracking-widest">Broadcast a unique bounty and recruit elite talent.</p>
                </div>
            </div>
        </div>
    )
}

export default TaskMarketplace
