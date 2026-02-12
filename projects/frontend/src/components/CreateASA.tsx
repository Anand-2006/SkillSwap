// src/components/CreateASA.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface CreateASAProps {
  openModal: boolean
  closeModal: () => void
}

const CreateASA = ({ openModal, closeModal }: CreateASAProps) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [name, setName] = useState('MyToken')
  const [unit, setUnit] = useState('MTK')
  const [decimals, setDecimals] = useState('6')
  const [total, setTotal] = useState('1000000')
  const [loading, setLoading] = useState(false)

  const algorand = useMemo(() => {
    const algodConfig = getAlgodConfigFromViteEnvironment()
    const client = AlgorandClient.fromConfig({ algodConfig })
    client.setDefaultSigner(transactionSigner)
    return client
  }, [transactionSigner])

  const onCreate = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Connect a wallet first', { variant: 'error' })
      return
    }
    setLoading(true)
    try {
      const result = await algorand.send.assetCreate({
        sender: activeAddress,
        total: BigInt(total),
        decimals: Number(decimals),
        unitName: unit.toUpperCase(),
        assetName: name,
        manager: activeAddress,
        reserve: activeAddress,
        freeze: activeAddress,
        clawback: activeAddress,
        defaultFrozen: false,
      })
      enqueueSnackbar(`ASA created successfully! ID: ${result.assetId}`, { variant: 'success' })
      closeModal()
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="create_asa_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-zinc-950 border border-zinc-800 p-0 overflow-hidden max-w-xl shadow-2xl rounded-md flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Create Protocol Asset
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono font-bold mt-0.5 uppercase tracking-widest">Protocol // ASA_FORGE_V1</p>
          </div>
          <button
            onClick={closeModal}
            className="text-zinc-600 hover:text-white transition-all w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded-sm"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-8 bg-zinc-950">
          <div className="grid grid-cols-2 gap-8">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 font-mono">Asset Nomenclature</label>
              <input
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600/50 transition-all font-medium"
                placeholder="e.g. SkillSwap Governance"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-[9px] text-zinc-600 mt-2 font-mono uppercase font-bold">The primary identifier for the ledger asset.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 font-mono">Symbol // Ticker</label>
              <input
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-sm font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600/50 transition-all uppercase tracking-widest"
                placeholder="e.g. SKIL"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 font-mono">Precision [Decimals]</label>
              <input
                className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-3 text-sm font-mono font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600/50 transition-all"
                placeholder="6"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 font-mono">Total Liquidity [Base Units]</label>
              <div className="relative">
                <input
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-sm px-4 py-4 text-2xl font-mono font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-600/50 transition-all"
                  placeholder="1,000,000"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">{unit || 'TOKEN'}</span>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded p-4 mt-6">
                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed font-bold">
                  <span className="text-zinc-400">MANIFEST:</span> Supply is defined in base units. For 1 full token with {decimals || '0'} decimals, provide {Math.pow(10, Number(decimals || 0)).toLocaleString()} as input.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              className={`w-full py-4 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30`}
              onClick={onCreate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-1.5 h-1.5 bg-white animate-ping rounded-full"></span>
                  FORGING PROTOCOL ASSET...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  INITIALIZE NETWORK ASSET
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Area */}
        <div className="bg-zinc-900 p-6 border-t border-zinc-800 flex justify-between items-center px-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest font-bold">Verification Engine Ready</span>
          </div>
          <button
            className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-all"
            onClick={closeModal}
            disabled={loading}
          >
            Abort Operation
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-zinc-950/80">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  )
}

export default CreateASA
