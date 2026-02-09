// src/components/GPURental.tsx
import React, { useState } from 'react'

interface GPUListing {
    id: string
    provider: string
    model: string
    vram: string
    pricePerHour: number
    availability: 'Available' | 'In Use' | 'Maintenance'
    region: string
}

const SAMPLE_GPUS: GPUListing[] = [
    {
        id: 'g1',
        provider: 'Alex (Student)',
        model: 'NVIDIA RTX 4090',
        vram: '24 GB',
        pricePerHour: 5,
        availability: 'Available',
        region: 'North America',
    },
    {
        id: 'g2',
        provider: 'Sarah (Researcher)',
        model: 'NVIDIA RTX A6000',
        vram: '48 GB',
        pricePerHour: 12,
        availability: 'In Use',
        region: 'Europe',
    },
    {
        id: 'g3',
        provider: 'GamingLab_01',
        model: 'NVIDIA RTX 3080 Ti',
        vram: '12 GB',
        pricePerHour: 2.5,
        availability: 'Available',
        region: 'Asia',
    },
    {
        id: 'g4',
        provider: 'DevBox_Pro',
        model: 'NVIDIA RTX 4080',
        vram: '16 GB',
        pricePerHour: 4,
        availability: 'Available',
        region: 'North America',
    },
    {
        id: 'g5',
        provider: 'RenderFarm_Lite',
        model: 'NVIDIA RTX 3060',
        vram: '12 GB',
        pricePerHour: 1.5,
        availability: 'Maintenance',
        region: 'South America',
    },
]

const GPURental: React.FC = () => {
    const [selectedGpu, setSelectedGpu] = useState<string | null>(null)

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-slate-900/30 p-8 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-50 mb-3 tracking-tight">Rent Student Grade Compute</h2>
                    <p className="text-slate-400 max-w-2xl leading-relaxed">
                        Access affordable GPU power for your AI models, rendering, or complex calculations.
                        All payments are escrowed on-chain until the session completes.
                    </p>
                </div>
                <div className="flex gap-6 divide-x divide-slate-800">
                    <div className="pl-6 first:pl-0 text-right">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Network Capacity</span>
                        <span className="text-2xl font-mono text-emerald-400 tracking-tight">142 GPUs</span>
                    </div>
                    <div className="pl-6 text-right">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Avg Price</span>
                        <span className="text-2xl font-mono text-slate-200 tracking-tight">3.2 ALGO<span className="text-sm text-slate-500 ml-1">/hr</span></span>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800/50">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/50">
                        <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                            <th className="p-5 font-medium">GPU Model</th>
                            <th className="p-5 font-medium">VRAM</th>
                            <th className="p-5 font-medium">Provider</th>
                            <th className="p-5 font-medium">Region</th>
                            <th className="p-5 font-medium">Status</th>
                            <th className="p-5 font-medium text-right">Price / Hour</th>
                            <th className="p-5 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-sm bg-[#1e293b]/20">
                        {SAMPLE_GPUS.map((gpu) => (
                            <tr
                                key={gpu.id}
                                className={`table-row-premium group ${selectedGpu === gpu.id ? 'bg-slate-800/40' : ''}`}
                                onClick={() => setSelectedGpu(gpu.id)}
                            >
                                <td className="p-5 text-slate-200 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${gpu.model.includes('4090') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-600'}`}></div>
                                        {gpu.model}
                                    </div>
                                </td>
                                <td className="p-5 text-slate-400 font-mono text-xs">{gpu.vram}</td>
                                <td className="p-5 text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold border border-slate-700">
                                            {gpu.provider.charAt(0)}
                                        </span>
                                        {gpu.provider}
                                    </span>
                                </td>
                                <td className="p-5 text-slate-400">{gpu.region}</td>
                                <td className="p-5">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${gpu.availability === 'Available' ? 'bg-emerald-900/10 text-emerald-400 border-emerald-900/20' :
                                        gpu.availability === 'In Use' ? 'bg-indigo-900/10 text-indigo-400 border-indigo-900/20' :
                                            'bg-slate-800 text-slate-500 border-slate-700'
                                        }`}>
                                        {gpu.availability === 'Available' && <span className="w-1 h-1 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>}
                                        {gpu.availability}
                                    </span>
                                </td>
                                <td className="p-5 text-right font-mono text-slate-200">{gpu.pricePerHour} ALGO</td>
                                <td className="p-5 text-right">
                                    <button
                                        disabled={gpu.availability !== 'Available'}
                                        className={`px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all ${gpu.availability === 'Available'
                                            ? 'bg-slate-100 text-slate-900 hover:bg-white shadow-sm'
                                            : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                            }`}
                                    >
                                        Rent Now
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GPURental
