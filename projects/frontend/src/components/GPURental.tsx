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

interface GPURentalProps {
    onRent?: (gpu: GPUListing) => void
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

const GPURental: React.FC<GPURentalProps> = ({ onRent }) => {
    const [selectedGpu, setSelectedGpu] = useState<string | null>(null)

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-zinc-900 p-8 rounded-md border border-zinc-800">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-50 mb-3 tracking-tight">Rent Student Grade Compute</h2>
                    <p className="text-zinc-500 max-w-2xl leading-relaxed text-sm">
                        Access affordable GPU power for your AI models, rendering, or complex calculations.
                        All payments are escrowed on-chain until the session completes.
                    </p>
                </div>
                <div className="flex gap-6 divide-x divide-zinc-800">
                    <div className="pl-6 first:pl-0 text-right">
                        <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Network Capacity</span>
                        <span className="text-2xl font-mono text-white font-bold tracking-tighter">142 GPUs</span>
                    </div>
                    <div className="pl-6 text-right">
                        <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Avg Price</span>
                        <span className="text-2xl font-mono text-indigo-400 font-bold tracking-tighter">3.2 ALGO<span className="text-sm text-zinc-600 ml-1">/hr</span></span>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border border-zinc-800">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-950">
                        <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            <th className="p-5">GPU Model</th>
                            <th className="p-5">VRAM</th>
                            <th className="p-5">Provider</th>
                            <th className="p-5">Region</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Price / Hour</th>
                            <th className="p-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm bg-zinc-900">
                        {SAMPLE_GPUS.map((gpu) => (
                            <tr
                                key={gpu.id}
                                className={`group cursor-pointer transition-colors ${selectedGpu === gpu.id ? 'bg-zinc-800' : 'hover:bg-zinc-950'}`}
                                onClick={() => setSelectedGpu(gpu.id)}
                            >
                                <td className="p-5 text-zinc-200 font-bold">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${gpu.availability === 'Available' ? 'bg-emerald-500' : 'bg-zinc-700'}`}></div>
                                        {gpu.model}
                                    </div>
                                </td>
                                <td className="p-5 text-zinc-500 font-mono text-xs font-bold">{gpu.vram}</td>
                                <td className="p-5 text-zinc-400">
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-sm bg-zinc-800 text-zinc-500 flex items-center justify-center text-[9px] font-bold border border-zinc-700">
                                            {gpu.provider.charAt(0)}
                                        </span>
                                        {gpu.provider}
                                    </span>
                                </td>
                                <td className="p-5 text-zinc-500 font-medium">{gpu.region}</td>
                                <td className="p-5">
                                    <span className={`badge-solid ${gpu.availability === 'Available' ? 'bg-emerald-900/40 text-emerald-400 font-mono' :
                                        gpu.availability === 'In Use' ? 'bg-indigo-900/40 text-indigo-400 font-mono' :
                                            'bg-zinc-950 text-zinc-600 font-mono'
                                        }`}>
                                        {gpu.availability === 'Available' && <span className="w-1 h-1 rounded-full bg-emerald-400 mr-1.5 inline-block"></span>}
                                        {gpu.availability}
                                    </span>
                                </td>
                                <td className="p-5 text-right font-mono text-zinc-200 font-bold tracking-tighter">{gpu.pricePerHour} ALGO</td>
                                <td className="p-5 text-right">
                                    <button
                                        disabled={gpu.availability !== 'Available'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onRent) onRent(gpu);
                                        }}
                                        className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all ${gpu.availability === 'Available'
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
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
