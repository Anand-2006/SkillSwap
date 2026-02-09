// src/components/AppCalls.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { CounterClient } from '../contracts/Counter'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const FIXED_APP_ID = 747652603
  const [appId, setAppId] = useState<number | null>(FIXED_APP_ID)
  const [currentCount, setCurrentCount] = useState<number>(0)
  const { enqueueSnackbar } = useSnackbar()
  const { activeAddress, transactionSigner: TransactionSigner } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })

  algorand.setDefaultSigner(TransactionSigner)

  const fetchCount = async (appId: number): Promise<number> => {
    try {
      const counterClient = new CounterClient({
        appId: BigInt(appId),
        algorand,
        defaultSigner: TransactionSigner,
      })
      const state = await counterClient.appClient.getGlobalState()
      return typeof state.count.value === 'bigint'
        ? Number(state.count.value)
        : parseInt(state.count.value, 10)
    } catch (e) {
      console.error('Error fetching count:', e)
      return 0
    }
  }

  useEffect(() => {
    const load = async () => {
      if (appId) {
        const count = await fetchCount(appId)
        setCurrentCount(count)
      }
    }
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, TransactionSigner])

  const incrementCounter = async () => {
    if (!appId) {
      enqueueSnackbar('Missing App ID', { variant: 'error' })
      return
    }

    setLoading(true)
    try {
      const counterClient = new CounterClient({
        appId: BigInt(appId),
        algorand,
        defaultSigner: TransactionSigner,
      })

      await counterClient.send.incrCounter({ args: [], sender: activeAddress ?? undefined })

      const count = await fetchCount(appId)
      setCurrentCount(count)

      enqueueSnackbar(`Counter incremented! New count: ${count}`, {
        variant: 'success'
      })
    } catch (e) {
      enqueueSnackbar(`Error incrementing counter: ${(e as Error).message}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box glass-card bg-slate-900/90 border-white/10 p-0 overflow-hidden max-w-md">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Counter Contract</h3>
              <p className="text-slate-400 text-sm mt-1">Interact with Algorand Smart Contracts</p>
            </div>
            <button
              onClick={() => setModalState(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm">Application ID</span>
                <span className="text-indigo-400 font-mono text-sm">{appId}</span>
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-slate-400 text-sm mb-1">On-Chain Value</span>
                <span className="text-5xl font-black text-white tracking-tight">{currentCount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                className={`btn-premium w-full flex items-center justify-center gap-2 ${loading ? 'opacity-80' : ''}`}
                onClick={incrementCounter}
                disabled={loading || !appId}
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
                  'Increment Counter'
                )}
              </button>
              <p className="text-center text-xs text-slate-500">
                This will trigger a NoOp call to increment the global state.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 border-t border-white/5 flex justify-end">
          <button
            className="px-6 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            onClick={() => setModalState(false)}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default AppCalls