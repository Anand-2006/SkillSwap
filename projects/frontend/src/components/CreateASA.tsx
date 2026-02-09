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
      <div className="modal-box glass-card bg-slate-900/95 border-white/10 p-0 overflow-hidden max-w-lg">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white">Create Asset</h3>
              <p className="text-slate-400 text-sm mt-1">Deploy a new fungible token (ASA)</p>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="col-span-2">
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Asset Name</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="e.g. Algorand Governance"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Unit Name</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                placeholder="e.g. ALGO"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Decimals</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
                placeholder="6"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Total Supply (Base Units)</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-lg"
                placeholder="1000000"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
              <p className="text-slate-500 text-xs mt-2 ml-1">
                Note: Total is in base units. For 1 token with 6 decimals, enter 1,000,000.
              </p>
            </div>
          </div>

          <button
            className={`btn-premium w-full flex items-center justify-center gap-2 ${loading ? 'opacity-80' : ''}`}
            onClick={onCreate}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Asset...
              </>
            ) : (
              'Initialize Asset'
            )}
          </button>
        </div>

        <div className="bg-white/5 p-4 border-t border-white/5 flex justify-end">
          <button
            className="px-6 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            onClick={closeModal}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default CreateASA

