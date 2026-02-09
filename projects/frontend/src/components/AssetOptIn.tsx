// src/components/AssetOptIn.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface AssetOptInProps {
  openModal: boolean
  closeModal: () => void
}

const AssetOptIn = ({ openModal, closeModal }: AssetOptInProps) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [asaId, setAsaId] = useState('')
  const [loading, setLoading] = useState(false)

  const algorand = useMemo(() => {
    const algodConfig = getAlgodConfigFromViteEnvironment()
    const client = AlgorandClient.fromConfig({ algodConfig })
    client.setDefaultSigner(transactionSigner)
    return client
  }, [transactionSigner])

  const onOptIn = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Connect a wallet first', { variant: 'error' })
      return
    }
    const id = BigInt(asaId)
    if (id <= 0n) {
      enqueueSnackbar('Enter a valid ASA ID', { variant: 'error' })
      return
    }
    setLoading(true)
    try {
      await algorand.send.assetOptIn({ sender: activeAddress, assetId: id })
      enqueueSnackbar('Opt-in successful', { variant: 'success' })
      closeModal()
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="asset_optin_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box glass-card bg-slate-900/90 border-white/10 p-0 overflow-hidden max-w-md">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Asset Opt-In</h3>
              <p className="text-slate-400 text-sm mt-1">Enable your account to receive specific ASAs</p>
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

          <div className="space-y-6">
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Asset ID</label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
                placeholder="Enter ASA ID (e.g. 31566704)"
                value={asaId}
                onChange={(e) => setAsaId(e.target.value)}
              />
              <p className="text-slate-500 text-xs mt-3 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Opting in requires a small minimum balance increase (0.1 ALGO) to cover the local storage.
              </p>
            </div>

            <button
              className={`btn-premium w-full flex items-center justify-center gap-2 ${loading ? 'opacity-80' : ''}`}
              onClick={onOptIn}
              disabled={loading || !asaId}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Confirm Opt-In'
              )}
            </button>
          </div>
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

export default AssetOptIn

